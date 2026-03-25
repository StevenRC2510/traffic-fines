import { test, expect } from '@playwright/test';
import {
  TEST_DATE,
  VALIDATION_MESSAGES,
  CATEGORY_LABELS,
  FINE_IDS,
  FINE_DESCRIPTIONS,
  EXPECTED_SINGLE_F101,
  EXPECTED_THREE_FINES,
  EXPECTED_ALL_FINES,
  EXPECTED_LICENSE_VOLUME,
  TOTAL_FINE_COUNT,
  LICENSE_FINE_ID,
  SEVERELY_OVERDUE_IDS,
  NOT_EXPIRED_IDS,
} from './fixtures/test-constants';

async function clickFine(page: import('@playwright/test').Page, fineId: string) {
  const card = page.getByRole('checkbox', { name: new RegExp(`Fine ${fineId}`) });
  await card.click();
}

function getFineCard(page: import('@playwright/test').Page, fineId: string) {
  return page.getByRole('checkbox', { name: new RegExp(`Fine ${fineId}`) });
}

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date(TEST_DATE) });
  await page.clock.setFixedTime(new Date(TEST_DATE));
});

test('TC-01: page loads and displays all fines', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Loading fines...')).toBeHidden({ timeout: 10_000 });

  await expect(page.getByRole('heading', { name: 'Select Fines to Pay' })).toBeVisible();

  for (const description of Object.values(FINE_DESCRIPTIONS)) {
    await expect(page.getByText(description)).toBeVisible();
  }

  await expect(page.getByText(CATEGORY_LABELS.traffic, { exact: true }).first()).toBeVisible();
  await expect(page.getByText(CATEGORY_LABELS.parking, { exact: true }).first()).toBeVisible();
  await expect(page.getByText(CATEGORY_LABELS.license, { exact: true }).first()).toBeVisible();

  await expect(page.getByRole('list', { name: 'Traffic fines' })).toBeVisible();

  const items = page.getByRole('listitem');
  await expect(items).toHaveCount(TOTAL_FINE_COUNT);
});

test('TC-02: select a single fine and verify summary updates', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Loading fines...')).toBeHidden({ timeout: 10_000 });

  await clickFine(page, FINE_IDS.F101);

  await expect(getFineCard(page, FINE_IDS.F101)).toHaveAttribute('aria-checked', 'true');

  const summary = page.getByText('Payment Summary').locator('..');
  await expect(summary.getByText('Selected fines')).toBeVisible();
  await expect(summary.getByText('1', { exact: true })).toBeVisible();

  await expect(summary.getByText(`$${EXPECTED_SINGLE_F101.subtotal.toFixed(2)}`).first()).toBeVisible();

  const continueButton = page.getByRole('button', { name: /Continue with/ });
  await expect(continueButton).toBeEnabled();
});

test('TC-03: select 3 fines and verify volume discount', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Loading fines...')).toBeHidden({ timeout: 10_000 });

  await clickFine(page, FINE_IDS.F101);
  await clickFine(page, FINE_IDS.F102);
  await clickFine(page, FINE_IDS.F103);

  const summary = page.getByText('Payment Summary').locator('..');

  await expect(summary.getByText('Volume discount (5%)')).toBeVisible();

  await expect(summary.getByText(`-$${EXPECTED_THREE_FINES.volumeDiscount.toFixed(2)}`)).toBeVisible();

  await expect(summary.getByText(`$${EXPECTED_THREE_FINES.total.toFixed(2)}`)).toBeVisible();
});

test('TC-04: deselect a fine and verify summary recalculates', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Loading fines...')).toBeHidden({ timeout: 10_000 });

  await clickFine(page, FINE_IDS.F101);
  await clickFine(page, FINE_IDS.F102);
  await clickFine(page, FINE_IDS.F103);

  const summary = page.getByText('Payment Summary').locator('..');
  await expect(summary.getByText('Volume discount (5%)')).toBeVisible();

  await clickFine(page, FINE_IDS.F103);

  await expect(summary.getByText('Volume discount (5%)')).toBeHidden();

  // F-101(140) + F-102(80) = 220
  await expect(summary.getByText('Total', { exact: true }).locator('..').getByText('$220.00')).toBeVisible();
});

test('TC-05: license fine alone shows dependency error', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Loading fines...')).toBeHidden({ timeout: 10_000 });

  await clickFine(page, LICENSE_FINE_ID);

  await expect(page.getByRole('alert').getByText(VALIDATION_MESSAGES.dependency)).toBeVisible();

  await expect(page.getByRole('button', { name: 'Select fines to continue' })).toBeDisabled();
});

test('TC-06: license fine with non-license fine is valid', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Loading fines...')).toBeHidden({ timeout: 10_000 });

  await clickFine(page, LICENSE_FINE_ID);
  await clickFine(page, FINE_IDS.F101);

  await expect(page.getByText(VALIDATION_MESSAGES.dependency)).toBeHidden();

  const continueButton = page.getByRole('button', { name: /Continue with/ });
  await expect(continueButton).toBeEnabled();
});

test('TC-07: severely overdue + not-expired fines show incompatibility error', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Loading fines...')).toBeHidden({ timeout: 10_000 });

  await clickFine(page, SEVERELY_OVERDUE_IDS[0]);
  await clickFine(page, NOT_EXPIRED_IDS[0]);

  await expect(page.getByRole('alert').getByText(VALIDATION_MESSAGES.incompatibility)).toBeVisible();

  await expect(page.getByRole('button', { name: 'Select fines to continue' })).toBeDisabled();
});

test('TC-08: all overdue fines have no incompatibility error', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Loading fines...')).toBeHidden({ timeout: 10_000 });

  await clickFine(page, FINE_IDS.F101);
  await clickFine(page, FINE_IDS.F102);

  await expect(page.getByText(VALIDATION_MESSAGES.incompatibility)).toBeHidden();

  const continueButton = page.getByRole('button', { name: /Continue with/ });
  await expect(continueButton).toBeEnabled();
});

test('TC-09: continue button is disabled with no selection', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Loading fines...')).toBeHidden({ timeout: 10_000 });

  const button = page.getByRole('button', { name: 'Select fines to continue' });
  await expect(button).toBeVisible();
  await expect(button).toBeDisabled();

  await expect(page.getByText('Select fines to see the payment summary.')).toBeVisible();
});

test('TC-10: keyboard navigation selects a fine', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Loading fines...')).toBeHidden({ timeout: 10_000 });

  const firstCard = getFineCard(page, FINE_IDS.F101);
  await firstCard.focus();

  await page.keyboard.press('Enter');
  await expect(firstCard).toHaveAttribute('aria-checked', 'true');

  await page.keyboard.press('Space');
  await expect(firstCard).toHaveAttribute('aria-checked', 'false');

  await page.keyboard.press('Space');
  await expect(firstCard).toHaveAttribute('aria-checked', 'true');
});

test('TC-11: all fines selected shows volume discount and triggers incompatibility', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Loading fines...')).toBeHidden({ timeout: 10_000 });

  for (const id of Object.values(FINE_IDS)) {
    await clickFine(page, id);
  }

  const summary = page.getByText('Payment Summary').locator('..');

  await expect(summary.getByText(`$${EXPECTED_ALL_FINES.subtotal.toFixed(2)}`).first()).toBeVisible();
  await expect(summary.getByText('Volume discount (5%)')).toBeVisible();
  await expect(summary.getByText(`-$${EXPECTED_ALL_FINES.volumeDiscount.toFixed(2)}`)).toBeVisible();
  await expect(summary.getByText(`$${EXPECTED_ALL_FINES.total.toFixed(2)}`)).toBeVisible();

  await expect(page.getByRole('alert').getByText(VALIDATION_MESSAGES.incompatibility)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Select fines to continue' })).toBeDisabled();
});

test('TC-12: license fine excluded from volume discount but counted toward threshold', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Loading fines...')).toBeHidden({ timeout: 10_000 });

  // Select 3 fines including the license fine (F-104)
  await clickFine(page, FINE_IDS.F101);
  await clickFine(page, FINE_IDS.F102);
  await clickFine(page, LICENSE_FINE_ID);

  const summary = page.getByText('Payment Summary').locator('..');

  // Volume discount applies only to non-license fines
  await expect(summary.getByText('Volume discount (5%)')).toBeVisible();
  await expect(summary.getByText(`-$${EXPECTED_LICENSE_VOLUME.volumeDiscount.toFixed(2)}`)).toBeVisible();

  await expect(summary.getByText(`$${EXPECTED_LICENSE_VOLUME.total.toFixed(2)}`)).toBeVisible();

  // Dependency rule satisfied (license + non-license fines)
  await expect(page.getByText(VALIDATION_MESSAGES.dependency)).toBeHidden();

  // Incompatibility triggered: F-102 (severely overdue) + F-104 (not expired)
  await expect(page.getByRole('alert').getByText(VALIDATION_MESSAGES.incompatibility)).toBeVisible();
});

test('TC-13: loading state appears before fines load', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Loading fines...')).toBeVisible();

  await expect(page.getByText('Loading fines...')).toBeHidden({ timeout: 10_000 });
  await expect(page.getByRole('list', { name: 'Traffic fines' })).toBeVisible();
});

test('TC-14: continue button opens confirmation dialog', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Loading fines...')).toBeHidden({ timeout: 10_000 });

  await clickFine(page, FINE_IDS.F101);

  const continueButton = page.getByRole('button', { name: /Continue with/ });
  await continueButton.click();

  const dialog = page.locator('dialog[open]');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Confirm Payment').first()).toBeVisible();
  await expect(dialog.getByText(`$${EXPECTED_SINGLE_F101.subtotal.toFixed(2)}`).first()).toBeVisible();

  // Cancel closes the dialog
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(dialog).toBeHidden();
});

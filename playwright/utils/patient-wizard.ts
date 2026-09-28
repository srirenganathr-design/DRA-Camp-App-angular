import { expect, type Page } from '@playwright/test';

export async function completePatientWizardStep1(page: Page) {
  await page.locator('#patient-name').fill('Test Patient');
  await page.locator('#patient-age').fill('28');
  await page.getByRole('radio', { name: 'Male', exact: true }).click();
  await page.locator('#patient-whatsapp').fill('9000000001');
  await page.getByRole('heading', { level: 1, name: 'Basic Information' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page).toHaveURL('/patients/create/medical-history');
}

export async function completePatientWizardStep2(page: Page) {
  await page.getByRole('radiogroup', { name: 'Diabetic' }).getByRole('radio', { name: 'No' }).click();
  await page
    .getByRole('radiogroup', { name: 'Has Blood Pressure' })
    .getByRole('radio', { name: 'No' })
    .click();
  await page
    .getByRole('radiogroup', { name: 'Daily Digital Hours' })
    .getByRole('radio', { name: '2-5 hrs' })
    .click();
}

export async function completePatientWizardFoundation(page: Page) {
  await page.goto('/patients/create');
  await completePatientWizardStep1(page);
  await completePatientWizardStep2(page);
}

export async function gotoPatientWizardStep3(page: Page) {
  await completePatientWizardFoundation(page);
  await page.getByRole('button', { name: 'Create Patient' }).click();
  await expect(page).toHaveURL('/patients/create/dry-auto-refraction');
}

export async function gotoPatientWizardStep4(page: Page) {
  await gotoPatientWizardStep3(page);
  await page.getByRole('button', { name: 'Save & Next' }).click();
  await expect(page).toHaveURL('/patients/create/dry-refraction');
}

export async function gotoPatientWizardStep5(page: Page) {
  await gotoPatientWizardStep4(page);
  await page.getByRole('button', { name: 'Save & Next' }).click();
  await expect(page).toHaveURL('/patients/create/diagnosis');
}

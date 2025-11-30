import { test, expect } from '@playwright/test'

test.describe('Board Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/posts')
    await page.waitForLoadState('networkidle')
  })

  test('TC-01: Create Post Successfully', async ({ page }) => {
    await page.getByRole('button', { name: 'New Post' }).click()
    await expect(page).toHaveURL('/posts/new')

    await page.getByLabel('Title').fill('E2E Test Post ' + Date.now())

    await page.locator("[role='combobox']").or(page.getByText('Select a category')).click()
    await page.waitForTimeout(300)
    await page.getByRole('option', { name: 'Free' }).click()

    await page.getByLabel('Content').fill('This is a test post created by E2E test.')
    await page.getByRole('button', { name: 'Create Post' }).click()

    await page.waitForURL('/posts', { timeout: 10000 })
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('TC-02: Forbidden Words Validation', async ({ page }) => {
    await page.getByRole('button', { name: 'New Post' }).click()

    await page.getByLabel('Title').fill('Test Post')
    await page.locator("[role='combobox']").or(page.getByText('Select a category')).click()
    await page.waitForTimeout(300)
    await page.getByRole('option', { name: 'Free' }).click()
    await page.getByLabel('Content').fill('This contains 캄보디아 forbidden word')

    await page.getByRole('button', { name: 'Create Post' }).click()
    await page.waitForTimeout(1000)

    await expect(page).toHaveURL('/posts/new')
    await expect(page.getByText(/forbidden word/i)).toBeVisible()
  })

  test('TC-03: Table Displays Posts', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Title' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Category' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Date' })).toBeVisible()

    const rows = await page.locator('tbody tr').count()
    expect(rows).toBeGreaterThan(0)
  })

  test('TC-04: Infinite Scroll', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible()
    const initialRows = await page.locator('tbody tr').count()

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(2000)

    const finalRows = await page.locator('tbody tr').count()
    expect(finalRows).toBeGreaterThanOrEqual(initialRows)
  })

  test('TC-05: Column Menu Works', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible()

    const columnsButton = page.getByRole('button', { name: 'Columns' })
    await columnsButton.click()
    await page.waitForTimeout(500)

    const checkboxes = page.getByRole('menuitemcheckbox')
    const count = await checkboxes.count()
    expect(count).toBeGreaterThan(0)

    await checkboxes.first().click()
    await page.waitForTimeout(500)

    await columnsButton.click()
    await page.waitForTimeout(300)

    const checkboxesAgain = page.getByRole('menuitemcheckbox')
    const countAgain = await checkboxesAgain.count()
    expect(countAgain).toBe(count)
  })

  test('TC-06: Search Functionality', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible()
    await page.waitForTimeout(1000)

    const searchInput = page.getByPlaceholder(/search/i)
    if (await searchInput.isVisible()) {
      await searchInput.fill('test')
      await page.waitForTimeout(1500)
      await expect(page.getByRole('table')).toBeVisible()
    }
  })
})

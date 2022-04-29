import { test, expect } from '@playwright/test'

import config from '../../../../config.js'

test('basic test', async ({ page }) => {
  await page.goto(config.baseURL)
  const title = page.locator('h1')
  await expect(title).toHaveText('Home')
})
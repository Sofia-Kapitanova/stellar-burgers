import { test, expect } from '@playwright/test';
import path from 'path';

const testUser = {
  email: 'test@test.com',
  name: 'Тестовый Пользователь',
  password: 'password123'
};

const mockAccessToken = 'Bearer test-access-token';
const mockRefreshToken = 'test-refresh-token';

test.beforeEach(async ({ page, context }) => {
  await context.routeFromHAR(path.join(__dirname, 'mocks/ingredients.har'), {
    url: '**/api/ingredients',
    update: false
  });

  await page.goto('/');
  await expect(page.getByText('Тестовая булка')).toBeVisible();
});

test.describe('Конструктор бургера — добавление ингредиентов', () => {
  test('добавление булки в конструктор', async ({ page }) => {
    const bunCard = page.locator('li', { hasText: 'Тестовая булка' });
    await bunCard.getByText('Добавить').click();

    await expect(page.getByText('Тестовая булка (верх)')).toBeVisible();
    await expect(page.getByText('Тестовая булка (низ)')).toBeVisible();
  });

  test('добавление начинки в конструктор', async ({ page }) => {
    const mainCard = page.locator('li', { hasText: 'Тестовая начинка' });
    await mainCard.getByText('Добавить').click();

    await expect(
      page.locator('[class*="constructor-element__text"]', {
        hasText: 'Тестовая начинка'
      })
    ).toBeVisible();
  });
});

test.describe('Конструктор бургера — модальные окна', () => {
  test('открытие модального окна ингредиента', async ({ page }) => {
    await page.getByText('Тестовая булка').click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Тестовая булка' })
    ).toBeVisible();
  });

  test('закрытие модального окна по клику на крестик', async ({ page }) => {
    await page.getByText('Тестовая булка').click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    await page.locator('#modals button').click();

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('закрытие модального окна по клику на оверлей', async ({ page }) => {
    await page.getByText('Тестовая булка').click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    await page
      .locator('#modals > div')
      .last()
      .click({ position: { x: 5, y: 5 } });

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });
});

test.describe('Конструктор бургера — оформление заказа', () => {
  test('создание заказа авторизованным пользователем', async ({
    page,
    context
  }) => {
    await page.route('**/api/auth/user', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: testUser.email, name: testUser.name }
        })
      })
    );

    await page.route('**/api/orders', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Тестовый бургер',
          order: { number: 12345 }
        })
      })
    );

    await context.addCookies([
      {
        name: 'accessToken',
        value: mockAccessToken,
        url: 'http://localhost:4000'
      }
    ]);
    await page.addInitScript((token) => {
      window.localStorage.setItem('refreshToken', token);
    }, mockRefreshToken);

    await page.goto('/');
    await expect(page.getByText('Тестовая булка')).toBeVisible();

    const bunCard = page.locator('li', { hasText: 'Тестовая булка' });
    await bunCard.getByText('Добавить').click();

    const mainCard = page.locator('li', { hasText: 'Тестовая начинка' });
    await mainCard.getByText('Добавить').click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('идентификатор заказа')).toBeVisible();
    await expect(page.getByText('12345')).toBeVisible();

    await page.locator('#modals button').click();
    await expect(page.getByText('идентификатор заказа')).not.toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();
  });
});

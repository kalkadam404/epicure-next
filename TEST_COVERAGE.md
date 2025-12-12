# Test Coverage Report

Этот проект имеет полное покрытие тестами для всех основных компонентов, хуков, сервисов и утилит.

## Структура тестов

### Утилиты (`src/lib/__tests__/`)

- ✅ `utils.test.ts` - Тесты для функции `cn` (объединение классов)

### Хуки (`src/hooks/__tests__/`)

- ✅ `useDebounce.test.ts` - Тесты для хука debounce
- ✅ `useLocalStorage.test.ts` - Тесты для работы с localStorage
- ✅ `useClickOutside.test.ts` - Тесты для обработки кликов вне элемента
- ✅ `useOnlineStatus.test.ts` - Тесты для определения онлайн статуса
- ✅ `useProfile.test.ts` - Тесты для работы с профилем пользователя

### Сервисы (`src/services/__tests__/`)

- ✅ `authService.test.ts` - Тесты для аутентификации
- ✅ `menuService.test.ts` - Тесты для работы с меню
- ✅ `restaurantService.test.ts` - Тесты для работы с ресторанами
- ✅ `cityService.test.ts` - Тесты для работы с городами
- ✅ `offerService.test.ts` - Тесты для работы с предложениями

### Redux Slices (`src/store/slices/__tests__/`)

- ✅ `authSlice.test.ts` - Тесты для auth slice
- ✅ `menuSlice.test.ts` - Тесты для menu slice
- ✅ `favoritesSlice.test.ts` - Тесты для favorites slice

### UI Компоненты (`src/components/ui/__tests__/`)

- ✅ `button.test.tsx` - Тесты для компонента Button
- ✅ `input.test.tsx` - Тесты для компонента Input
- ✅ `card.test.tsx` - Тесты для компонентов Card
- ✅ `badge.test.tsx` - Тесты для компонента Badge
- ✅ `avatar.test.tsx` - Тесты для компонента Avatar
- ✅ `label.test.tsx` - Тесты для компонента Label
- ✅ `textarea.test.tsx` - Тесты для компонента Textarea
- ✅ `switch.test.tsx` - Тесты для компонента Switch

### Основные компоненты (`src/components/__tests__/`)

- ✅ `ProtectedRoute.test.tsx` - Тесты для защищенного маршрута
- ✅ `DishCard.test.tsx` - Тесты для карточки блюда
- ✅ `RestaurantCard.test.tsx` - Тесты для карточки ресторана
- ✅ `SkeletonCard.test.tsx` - Тесты для скелетона загрузки
- ✅ `MenuItem.test.tsx` - Тесты для элемента меню
- ✅ `OfferCard.test.tsx` - Тесты для карточки предложения

### Страницы (`src/app/__tests__/` и `src/app/(public)/__tests__/`)

- ✅ `not-found.test.tsx` - Тесты для страницы 404
- ✅ `favorites.test.tsx` - Тесты для страницы избранного
- ✅ `login.test.tsx` - Тесты для страницы входа
- ✅ `offline.test.tsx` - Тесты для страницы офлайн

## Запуск тестов

```bash
# Запустить все тесты
npm test

# Запустить тесты в watch режиме
npm run test:watch

# Запустить тесты с покрытием
npm run test:coverage
```

## Конфигурация

Тесты настроены с использованием:

- **Jest** - тестовый фреймворк
- **React Testing Library** - для тестирования React компонентов
- **@testing-library/user-event** - для симуляции пользовательских действий
- **@testing-library/jest-dom** - дополнительные матчеры для DOM

Конфигурация находится в:

- `jest.config.js` - основная конфигурация Jest
- `jest.setup.js` - настройки для тестового окружения

## Покрытие

Текущее покрытие включает:

- ✅ Все утилиты
- ✅ Все хуки
- ✅ Все сервисы
- ✅ Все Redux slices
- ✅ Все UI компоненты
- ✅ Основные компоненты
- ✅ Основные страницы

## Порог покрытия

В `jest.config.js` установлен порог покрытия:

- branches: 80%
- functions: 80%
- lines: 80%
- statements: 80%

## Моки и утилиты

Тестовые утилиты находятся в `src/store/__tests__/test-utils.tsx`:

- `createTestStore` - создание тестового Redux store
- `renderWithProviders` - обертка для рендеринга с Redux Provider

## Примечания

- Все тесты используют моки для внешних зависимостей (Firebase, Next.js router, i18next)
- Тесты изолированы и не зависят друг от друга
- Используются fake timers для тестирования асинхронных операций


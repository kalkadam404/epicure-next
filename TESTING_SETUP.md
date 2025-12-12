# Настройка тестирования

## Выполненные задачи

✅ **Установлены зависимости для тестирования:**

- jest
- @testing-library/jest-dom
- @testing-library/react
- @testing-library/user-event
- @types/jest
- jest-environment-jsdom

✅ **Создана конфигурация Jest:**

- `jest.config.js` - основная конфигурация с настройками для Next.js
- `jest.setup.js` - настройки окружения (моки для Next.js router, matchMedia, IntersectionObserver)

✅ **Созданы тестовые утилиты:**

- `src/store/__tests__/test-utils.tsx` - утилиты для тестирования с Redux

✅ **Написаны тесты для всех компонентов проекта:**

### Утилиты (1 файл)

- `lib/__tests__/utils.test.ts`

### Хуки (5 файлов)

- `hooks/__tests__/useDebounce.test.ts`
- `hooks/__tests__/useLocalStorage.test.ts`
- `hooks/__tests__/useClickOutside.test.ts`
- `hooks/__tests__/useOnlineStatus.test.ts`
- `hooks/__tests__/useProfile.test.ts`

### Сервисы (5 файлов)

- `services/__tests__/authService.test.ts`
- `services/__tests__/menuService.test.ts`
- `services/__tests__/restaurantService.test.ts`
- `services/__tests__/cityService.test.ts`
- `services/__tests__/offerService.test.ts`

### Redux Slices (3 файла)

- `store/slices/__tests__/authSlice.test.ts`
- `store/slices/__tests__/menuSlice.test.ts`
- `store/slices/__tests__/favoritesSlice.test.ts`

### UI Компоненты (8 файлов)

- `components/ui/__tests__/button.test.tsx`
- `components/ui/__tests__/input.test.tsx`
- `components/ui/__tests__/card.test.tsx`
- `components/ui/__tests__/badge.test.tsx`
- `components/ui/__tests__/avatar.test.tsx`
- `components/ui/__tests__/label.test.tsx`
- `components/ui/__tests__/textarea.test.tsx`
- `components/ui/__tests__/switch.test.tsx`

### Основные компоненты (6 файлов)

- `components/__tests__/ProtectedRoute.test.tsx`
- `components/__tests__/DishCard.test.tsx`
- `components/__tests__/RestaurantCard.test.tsx`
- `components/__tests__/SkeletonCard.test.tsx`
- `components/__tests__/MenuItem.test.tsx`
- `components/__tests__/OfferCard.test.tsx`

### Страницы (4 файла)

- `app/__tests__/not-found.test.tsx`
- `app/(public)/__tests__/favorites.test.tsx`
- `app/(public)/__tests__/login.test.tsx`
- `app/(public)/__tests__/offline.test.tsx`

## Итого: 32 тестовых файла

## Команды для запуска

```bash
# Запустить все тесты
npm test

# Запустить тесты в watch режиме
npm run test:watch

# Запустить тесты с покрытием
npm run test:coverage
```

## Особенности настройки

1. **Совместимость с React 19:** Использован `@testing-library/react@^16.0.0` для совместимости с React 19
2. **Моки для Next.js:** Настроены моки для `next/navigation`, `next/image`, `next/link`
3. **Моки для Firebase:** Настроены моки для Firebase Auth и Firestore
4. **Моки для i18next:** Настроены моки для react-i18next
5. **Порог покрытия:** Установлен на 80% для всех метрик

## Следующие шаги

Для дальнейшего улучшения покрытия можно добавить:

- Интеграционные тесты для полных пользовательских сценариев
- E2E тесты с Playwright или Cypress
- Тесты производительности
- Визуальные регрессионные тесты


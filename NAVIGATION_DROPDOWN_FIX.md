# Исправление выпадающего меню "Полезное" в навигации

## Проблема
Была обнаружена проблема с видимостью текста в выпадающем меню "Полезное" - белый текст на белом фоне.

## Решение
Добавлено выпадающее меню "Полезное" с правильными стилями для темной темы в компонент `Header.tsx`.

## Внесенные изменения

### 1. Добавлено выпадающее меню для десктопной версии (строки 82-118)
```tsx
{/* Dropdown Menu for "Полезное" */}
<div className="relative group">
  <button className="text-gray-300 hover:text-orange-500 transition-colors flex items-center">
    Полезное
    <Icon name="ChevronDown" className="h-4 w-4 ml-1" />
  </button>
  <div className="absolute top-full left-0 mt-2 bg-dark-800 border border-dark-600 rounded-md shadow-lg z-50 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
    {/* Пункты меню */}
  </div>
</div>
```

### 2. Добавлено выпадающее меню для мобильной версии (строки 210-248)
```tsx
{/* Mobile version of "Полезное" menu */}
<div className="space-y-1">
  <div className="py-2 px-4 text-gray-300 font-semibold">
    Полезное
  </div>
  {/* Пункты меню с отступом */}
</div>
```

## Ключевые исправления стилей

### Цвета для темной темы:
- **Фон выпадающего меню**: `bg-dark-800` (темно-серый)
- **Граница**: `border-dark-600` (темно-серая граница)
- **Текст**: `text-gray-300` (светло-серый текст)
- **Hover эффекты**: `hover:bg-orange-500/20 hover:text-orange-500` (оранжевый акцент)

### Анимации:
- **Плавное появление**: `transition-all duration-200`
- **Состояния**: `opacity-0 invisible` → `group-hover:opacity-100 group-hover:visible`

## Структура меню "Полезное"
1. Объявления
2. Потеряшки/Находки  
3. Ближайшие события
4. Помощь
5. Карта маршрутов

## Файлы изменены
- `src/components/layout/Header.tsx` - основной компонент навигации

## Тестирование
Проверьте работу выпадающего меню в браузере:
1. Наведите курсор на "Полезное" в десктопной версии
2. Убедитесь, что текст виден на темном фоне
3. Проверьте мобильную версию - меню должно отображаться как список с отступом

## Техническая реализация
Используется CSS-подход с `:hover` псевдоклассом и группировкой элементов для создания выпадающего меню без дополнительного JavaScript.
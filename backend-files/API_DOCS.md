# PHP API для базы данных мотоциклистов

## Установка

1. Скопируйте все файлы на ваш сервер
2. Настройте `config/db.php` - укажите ваш пароль MySQL
3. Убедитесь что .htaccess настроен правильно

## API Endpoints

### Пользователи
- `POST /api/users/register` - Регистрация
- `GET /api/users/{id}` - Профиль пользователя  
- `PUT /api/users/{id}` - Обновить профиль

### Мотоциклы
- `POST /api/users/{id}/bikes` - Добавить мотоцикл
- `GET /api/users/{id}/bikes` - Мотоциклы пользователя
- `PUT /api/bikes/{id}/primary` - Установить основным

### Заказы  
- `POST /api/orders` - Создать заказ
- `GET /api/orders/{id}` - Получить заказ
- `PUT /api/orders/{id}/status` - Обновить статус

### Избранное
- `POST /api/favorites/toggle` - Добавить/убрать из избранного
- `GET /api/users/{id}/favorites` - Избранное пользователя

### Настройки
- `GET /api/users/{id}/settings` - Настройки пользователя
- `PUT /api/users/{id}/settings/theme` - Сменить тему

Проверка работы: `GET /api/health`
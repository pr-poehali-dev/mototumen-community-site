# 🚀 API Документация для Юры

**Блядь, Юра! Вот твои API endpoints для интеграции с сайтом объявлений!**

## 🔑 **Базовый URL**
```
https://yourdomain.com/api/
```

---

## 📋 **API Endpoints**

### 1. **🔐 Авторизация через Telegram**
**Endpoint:** `POST /api/auth`

**Что делает:** Авторизует пользователя через Telegram виджет и возвращает токен

**Запрос:**
```json
{
  "id": 123456789,
  "first_name": "Иван",
  "last_name": "Иванов",
  "username": "ivan_user",
  "photo_url": "https://t.me/i/userpic/320/ivan.jpg",
  "auth_date": 1635724800,
  "hash": "telegram_hash_here"
}
```

**Ответ (успех):**
```json
{
  "status": "success",
  "message": "Авторизация успешна",
  "data": {
    "user": {
      "id": 1,
      "telegram_id": 123456789,
      "name": "Иван Иванов",
      "first_name": "Иван",
      "last_name": "Иванов",
      "username": "ivan_user",
      "avatar": "https://t.me/i/userpic/320/ivan.jpg",
      "email": null,
      "phone": null,
      "location": "Москва",
      "rating": 4.5,
      "review_count": 12,
      "is_verified": true,
      "response_time": "1 час",
      "member_since": "2023"
    },
    "token": "jwt_token_here"
  }
}
```

---

### 2. **👤 Получение карточки пользователя**
**Endpoint:** `GET /api/user?id={user_id}`

**Что делает:** Возвращает полную информацию о пользователе + его последние объявления

**Пример запроса:**
```
GET /api/user?id=1
```

**Ответ:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "telegram_id": 123456789,
      "name": "Иван Иванов",
      "first_name": "Иван",
      "last_name": "Иванов",
      "username": "ivan_user",
      "avatar": "https://t.me/i/userpic/320/ivan.jpg",
      "email": "ivan@example.com",
      "phone": "+7 (999) 123-45-67",
      "location": "Москва",
      "rating": 4.5,
      "review_count": 12,
      "is_verified": true,
      "response_time": "1 час",
      "member_since": "2023",
      "last_login": "2024-01-15 10:30:00",
      "total_ads": 5
    },
    "recent_ads": [
      {
        "id": 1,
        "title": "Honda CBR 600RR",
        "price": 450000,
        "status": "active",
        "created_at": "2024-01-15 10:00:00",
        "main_image": "https://example.com/images/honda.jpg"
      }
    ]
  }
}
```

---

### 3. **✏️ Обновление карточки пользователя**
**Endpoint:** `PUT /api/user?id={user_id}`

**Что делает:** Обновляет данные пользователя (имя, email, телефон, локацию, время ответа)

**Запрос:**
```json
{
  "name": "Иван Петров",
  "email": "ivan.petrov@example.com",
  "phone": "+7 (999) 999-99-99",
  "location": "Санкт-Петербург",
  "response_time": "30 минут"
}
```

**Ответ:**
```json
{
  "status": "success",
  "message": "Данные пользователя обновлены",
  "data": {
    "user": {
      "id": 1,
      "name": "Иван Петров",
      "email": "ivan.petrov@example.com",
      "phone": "+7 (999) 999-99-99",
      "location": "Санкт-Петербург",
      "response_time": "30 минут"
    }
  }
}
```

---

### 4. **📋 Получение объявлений**
**Endpoint:** `GET /api/classifieds`

**Что делает:** Возвращает список объявлений с фильтрацией и пагинацией

**Параметры запроса:**
- `user_id` - ID пользователя (опционально)
- `category_id` - ID категории (опционально)  
- `search` - поиск по тексту (опционально)
- `limit` - количество объявлений (по умолчанию 20)
- `offset` - смещение для пагинации (по умолчанию 0)

**Примеры запросов:**
```
GET /api/classifieds - все объявления
GET /api/classifieds?user_id=1 - объявления пользователя
GET /api/classifieds?search=Honda - поиск по Honda
GET /api/classifieds?category_id=2&limit=10 - 10 объявлений из категории
```

**Ответ:**
```json
{
  "status": "success",
  "data": {
    "classifieds": [
      {
        "id": 1,
        "title": "Honda CBR 600RR",
        "description": "Спортивный мотоцикл в отличном состоянии",
        "price": 450000,
        "currency": "RUB",
        "year": 2020,
        "mileage": 15000,
        "engine_volume": 600,
        "condition": "excellent",
        "location": "Москва",
        "status": "active",
        "created_at": "2024-01-15 10:00:00",
        "updated_at": "2024-01-15 10:00:00",
        "category": "Мотоциклы",
        "seller": {
          "name": "Иван Иванов",
          "rating": 4.5,
          "avatar": "https://t.me/i/userpic/320/ivan.jpg",
          "response_time": "1 час"
        },
        "favorites_count": 3,
        "images": [
          "https://example.com/images/honda1.jpg",
          "https://example.com/images/honda2.jpg"
        ],
        "main_image": "https://example.com/images/honda1.jpg"
      }
    ],
    "pagination": {
      "total": 50,
      "limit": 20,
      "offset": 0,
      "has_more": true
    }
  }
}
```

---

## 🔧 **Настройка для интеграции**

### **1. CORS заголовки**
Все API поддерживают CORS, можешь делать запросы с любого домена.

### **2. Формат ответов**
Все ответы в JSON с полями:
- `status`: "success" или "error"
- `message`: сообщение (опционально)
- `data`: данные (опционально)

### **3. Коды ошибок**
- `200` - успех
- `400` - ошибка в запросе
- `405` - метод не разрешен

---

## 🚀 **Как подключить к React**

### **Пример использования:**

```javascript
// Авторизация через Telegram
const authUser = async (telegramData) => {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(telegramData)
  });
  return response.json();
};

// Получение карточки пользователя
const getUserProfile = async (userId) => {
  const response = await fetch(`/api/user?id=${userId}`);
  return response.json();
};

// Обновление профиля
const updateProfile = async (userId, data) => {
  const response = await fetch(`/api/user?id=${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

// Получение объявлений
const getClassifieds = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/classifieds?${params}`);
  return response.json();
};
```

---

**Блядь, Юра! Теперь у тебя есть полный API для работы с карточками пользователей и объявлениями! Подключай и делай магию! 🎯**
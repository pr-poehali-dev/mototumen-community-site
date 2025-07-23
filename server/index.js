const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к БД
const dbConfig = {
  host: 'server184.hosting.reg.ru',
  user: 'u3183548_default',
  password: '81DitCnnDi2664KZ',
  database: 'users',
  port: 3306,
  charset: 'utf8mb4'
};

let db;

async function connectToDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ Подключение к MySQL успешно!');
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error);
    process.exit(1);
  }
}

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен доступа отсутствует' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// API Routes

// 1. Авторизация/регистрация пользователя через Telegram
app.post('/api/auth/telegram', async (req, res) => {
  try {
    const { telegram_id, username, first_name, last_name, avatar_url } = req.body;

    if (!telegram_id || !first_name) {
      return res.status(400).json({ error: 'Telegram ID и имя обязательны' });
    }

    // Проверяем существует ли пользователь
    const [existingUser] = await db.execute(
      'SELECT * FROM users WHERE telegram_id = ?',
      [telegram_id]
    );

    let user;
    if (existingUser.length > 0) {
      // Обновляем данные существующего пользователя
      await db.execute(
        'UPDATE users SET username = ?, first_name = ?, last_name = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = ?',
        [username, first_name, last_name, avatar_url, telegram_id]
      );
      user = existingUser[0];
    } else {
      // Создаем нового пользователя
      const [result] = await db.execute(
        'INSERT INTO users (telegram_id, username, first_name, last_name, avatar_url) VALUES (?, ?, ?, ?, ?)',
        [telegram_id, username, first_name, last_name, avatar_url]
      );
      
      const [newUser] = await db.execute(
        'SELECT * FROM users WHERE id = ?',
        [result.insertId]
      );
      user = newUser[0];
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user.id, telegram_id: user.telegram_id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        telegram_id: user.telegram_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar_url: user.avatar_url,
        phone: user.phone,
        email: user.email,
        bio: user.bio,
        experience: user.experience,
        location: user.location,
        is_active: user.is_active
      },
      token
    });

  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 2. Получение данных пользователя
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const [user] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
      success: true,
      user: user[0]
    });

  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 3. Обновление профиля пользователя
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { phone, email, bio, experience, location } = req.body;

    await db.execute(
      'UPDATE users SET phone = ?, email = ?, bio = ?, experience = ?, location = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [phone, email, bio, experience, location, req.user.userId]
    );

    const [updatedUser] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [req.user.userId]
    );

    res.json({
      success: true,
      user: updatedUser[0]
    });

  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 4. Получение избранного пользователя
app.get('/api/user/favorites', authenticateToken, async (req, res) => {
  try {
    const { category } = req.query;

    let query = 'SELECT * FROM favorites WHERE user_id = ?';
    let params = [req.user.userId];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const [favorites] = await db.execute(query, params);

    res.json({
      success: true,
      favorites
    });

  } catch (error) {
    console.error('Ошибка получения избранного:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 5. Добавление в избранное
app.post('/api/user/favorites', authenticateToken, async (req, res) => {
  try {
    const { item_id, category, name, description, image_url, price, rating, location, external_url } = req.body;

    if (!item_id || !category || !name) {
      return res.status(400).json({ error: 'item_id, category и name обязательны' });
    }

    await db.execute(
      'INSERT INTO favorites (user_id, item_id, category, name, description, image_url, price, rating, location, external_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), image_url = VALUES(image_url), price = VALUES(price), rating = VALUES(rating), location = VALUES(location), external_url = VALUES(external_url)',
      [req.user.userId, item_id, category, name, description, image_url, price, rating, location, external_url]
    );

    res.json({
      success: true,
      message: 'Добавлено в избранное'
    });

  } catch (error) {
    console.error('Ошибка добавления в избранное:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 6. Удаление из избранного
app.delete('/api/user/favorites/:item_id/:category', authenticateToken, async (req, res) => {
  try {
    const { item_id, category } = req.params;

    await db.execute(
      'DELETE FROM favorites WHERE user_id = ? AND item_id = ? AND category = ?',
      [req.user.userId, item_id, category]
    );

    res.json({
      success: true,
      message: 'Удалено из избранного'
    });

  } catch (error) {
    console.error('Ошибка удаления из избранного:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 7. Получение мотоциклов пользователя
app.get('/api/user/bikes', authenticateToken, async (req, res) => {
  try {
    const [bikes] = await db.execute(
      'SELECT * FROM user_bikes WHERE user_id = ? ORDER BY is_primary DESC, created_at DESC',
      [req.user.userId]
    );

    res.json({
      success: true,
      bikes
    });

  } catch (error) {
    console.error('Ошибка получения мотоциклов:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 8. Добавление мотоцикла
app.post('/api/user/bikes', authenticateToken, async (req, res) => {
  try {
    const { brand, model, year, engine_volume, color, mileage, is_primary, notes } = req.body;

    if (!brand || !model) {
      return res.status(400).json({ error: 'Марка и модель обязательны' });
    }

    // Если это основной мотоцикл, убираем флаг у других
    if (is_primary) {
      await db.execute(
        'UPDATE user_bikes SET is_primary = FALSE WHERE user_id = ?',
        [req.user.userId]
      );
    }

    const [result] = await db.execute(
      'INSERT INTO user_bikes (user_id, brand, model, year, engine_volume, color, mileage, is_primary, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.userId, brand, model, year, engine_volume, color, mileage || 0, is_primary || false, notes]
    );

    const [newBike] = await db.execute(
      'SELECT * FROM user_bikes WHERE id = ?',
      [result.insertId]
    );

    res.json({
      success: true,
      bike: newBike[0]
    });

  } catch (error) {
    console.error('Ошибка добавления мотоцикла:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 9. Удаление мотоцикла
app.delete('/api/user/bikes/:bike_id', authenticateToken, async (req, res) => {
  try {
    const { bike_id } = req.params;

    await db.execute(
      'DELETE FROM user_bikes WHERE id = ? AND user_id = ?',
      [bike_id, req.user.userId]
    );

    res.json({
      success: true,
      message: 'Мотоцикл удален'
    });

  } catch (error) {
    console.error('Ошибка удаления мотоцикла:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Запуск сервера
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`🚀 API сервер запущен на порту ${PORT}`);
});
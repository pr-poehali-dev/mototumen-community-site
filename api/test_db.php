<?php
require_once 'config.php';

try {
    echo "Подключение к базе данных...\n";
    $pdo = getConnection();
    echo "Соединение установлено!\n";
    
    // Проверяем таблицу users
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "Таблица users найдена!\n";
        
        // Проверяем структуру таблицы
        $stmt = $pdo->query("DESCRIBE users");
        $columns = $stmt->fetchAll();
        echo "Колонки таблицы users:\n";
        foreach ($columns as $column) {
            echo "- " . $column['Field'] . " (" . $column['Type'] . ")\n";
        }
    } else {
        echo "ОШИБКА: Таблица users НЕ найдена!\n";
    }
    
    // Проверяем количество пользователей
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $count = $stmt->fetch()['count'];
    echo "Количество пользователей в БД: $count\n";
    
} catch (Exception $e) {
    echo "ОШИБКА: " . $e->getMessage() . "\n";
}
?>
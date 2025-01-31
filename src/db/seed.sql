-- Створення тестового користувача
INSERT INTO users (name, email, password)
VALUES ('Test User', 'test@example.com', '$2a$10$xxxxxxxxxxx');

-- Вставка тестових завдань
INSERT INTO tasks (title, description, status, priority, deadline, user_id) 
VALUES 
  (
    'Розробити дизайн головної сторінки',
    'Створити макет та UI компоненти для головної сторінки додатку',
    'todo',
    'high',
    '2024-02-01',
    1
  ),
  (
    'Налаштувати авторизацію',
    'Інтегрувати Firebase Auth для автентифікації користувачів',
    'in_progress',
    'high',
    '2024-01-25',
    1
  ),
  (
    'Написати unit тести',
    'Покрити основні компоненти unit тестами',
    'todo',
    'medium',
    '2024-02-10',
    1
  ),
  (
    'Оптимізувати продуктивність',
    'Провести аудит та оптимізувати завантаження сторінок',
    'done',
    'low',
    '2024-01-20',
    1
  ); 
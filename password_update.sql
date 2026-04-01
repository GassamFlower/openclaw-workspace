-- 更新管理员密码
-- Password: $2b$12$1gHPlDo3kMQkDNCoMmkXkOyPvJucex0s80OO7lGmyKXXbTQnC.HVm
-- Salt: $2b$12$1gHPlDo3kMQkDNCoMmkXkO

UPDATE accounts SET password = '$2b$12$1gHPlDo3kMQkDNCoMmkXkOyPvJucex0s80OO7lGmyKXXbTQnC.HVm', password_salt = '$2b$12$1gHPlDo3kMQkDNCoMmkXkO' WHERE email = 'admin@local.com';

UPDATE accounts SET password = '$2b$12$1gHPlDo3kMQkDNCoMmkXkOyPvJucex0s80OO7lGmyKXXbTQnC.HVm', password_salt = '$2b$12$1gHPlDo3kMQkDNCoMmkXkO' WHERE email = 'admin@example.com';

-- 验证
SELECT email, length(password) as pwd_len, substring(password, 1, 30) as pwd_start FROM accounts WHERE email IN ('admin@local.com', 'admin@example.com');
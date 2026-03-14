CREATE USER IF NOT EXISTS 'project_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON *.* TO 'project_user'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

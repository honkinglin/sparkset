-- 检查并添加 input_schema 列（如果不存在）
SET @dbname = DATABASE();
SET @tablename = "actions";
SET @columnname = "input_schema";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  "SELECT 'Column input_schema already exists in actions table.' AS result;",
  "ALTER TABLE `actions` ADD COLUMN `input_schema` JSON NULL AFTER `parameters`;"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 检查并添加 is_default 列（如果不存在）
SET @tablename = "datasources";
SET @columnname = "is_default";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  "SELECT 'Column is_default already exists in datasources table.' AS result;",
  "ALTER TABLE `datasources` ADD COLUMN `is_default` BOOLEAN NOT NULL DEFAULT false AFTER `database`;"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;


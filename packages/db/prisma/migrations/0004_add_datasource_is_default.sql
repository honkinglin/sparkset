-- Add is_default column to datasources table
ALTER TABLE `datasources` ADD COLUMN `is_default` BOOLEAN NOT NULL DEFAULT false AFTER `database`;


-- Add inputSchema column to actions table
ALTER TABLE `actions` ADD COLUMN `input_schema` JSON NULL AFTER `parameters`;


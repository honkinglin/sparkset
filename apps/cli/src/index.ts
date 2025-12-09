#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();
const apiBaseUrl = process.env.SPARKLINE_API_URL ?? 'http://localhost:3333';

const createTodoAction = (label: string) => (options: Record<string, unknown>) => {
  console.log(`[pending] ${label}`, { apiBaseUrl, options });
};

program
  .name('sparkline')
  .description('Sparkline AI operations CLI')
  .version('0.1.0')
  .showHelpAfterError();

program
  .command('datasource:add')
  .description('Add a datasource')
  .requiredOption('--name <name>', 'Datasource name')
  .option('--type <type>', 'Datasource type', 'mysql')
  .requiredOption('--host <host>', 'Database host')
  .requiredOption('--port <port>', 'Database port', '3306')
  .requiredOption('--username <username>', 'Database user')
  .requiredOption('--password <password>', 'Database password')
  .requiredOption('--database <database>', 'Database name')
  .action(createTodoAction('datasource:add'));

program
  .command('datasource:update')
  .description('Update a datasource')
  .requiredOption('--id <id>', 'Datasource id')
  .option('--name <name>', 'Datasource name')
  .option('--type <type>', 'Datasource type')
  .option('--host <host>', 'Database host')
  .option('--port <port>', 'Database port')
  .option('--username <username>', 'Database user')
  .option('--password <password>', 'Database password')
  .option('--database <database>', 'Database name')
  .action(createTodoAction('datasource:update'));

program
  .command('datasource:remove')
  .description('Remove a datasource')
  .requiredOption('--id <id>', 'Datasource id')
  .action(createTodoAction('datasource:remove'));

program
  .command('datasource:sync')
  .description('Sync datasource schema cache')
  .requiredOption('--id <id>', 'Datasource id')
  .option('--full', 'Force full sync instead of incremental', false)
  .action(createTodoAction('datasource:sync'));

program
  .command('query:run')
  .description('Run a natural language query via API')
  .argument('<question>', 'Question to ask')
  .option('--datasource <id>', 'Datasource id to target')
  .option('--action <id>', 'Action template id to reuse')
  .option('--limit <n>', 'Result limit')
  .action(createTodoAction('query:run'));

program
  .command('action:exec')
  .description('Execute a saved action template')
  .argument('<id>', 'Action id')
  .option('--parameters <json>', 'JSON string of parameters')
  .action(createTodoAction('action:exec'));

program
  .command('conversation:list')
  .description('List conversations')
  .option('--limit <n>', 'Max items', '20')
  .action(createTodoAction('conversation:list'));

program
  .command('conversation:show')
  .description('Show conversation messages')
  .argument('<id>', 'Conversation id')
  .action(createTodoAction('conversation:show'));

void program.parseAsync(process.argv);

const Scanner = require('./scanner');
const chalk = require('chalk');

process.on('uncaughtException', (error) => {
    console.error(chalk.red('Uncaught Exception:', error.message));
});

process.on('unhandledRejection', (error) => {
    console.error(chalk.red('Unhandled Rejection:', error.message));
});

const scanner = new Scanner();
scanner.start().catch(error => {
    console.error(chalk.red('Fatal error:', error.message));
    process.exit(1);
});
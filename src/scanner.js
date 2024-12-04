const chalk = require('chalk');
const { generateWallet } = require('./utils/wallet');
const { checkBalance } = require('./utils/api');
const FileHandler = require('./utils/file-handler');

class Scanner {
    constructor() {
        this.attempts = 0;
        this.checkedAddresses = new Set();
        FileHandler.initialize();
    }

    async start() {
        console.log(chalk.green('Starting Enhanced Bitcoin Address Scanner...'));
        console.log(chalk.yellow('Using optimized wallet generation strategies...'));
        console.log(chalk.yellow('Searching for addresses with balances...\n'));

        this.interval = setInterval(() => this.scan(), 1500);
        setTimeout(() => this.stop(), 3600000);
    }

    async scan() {
        try {
            this.attempts++;
            const wallet = generateWallet();
            
            for (const [type, address] of Object.entries(wallet.addresses)) {
                if (!this.checkedAddresses.has(address)) {
                    this.checkedAddresses.add(address);
                    const balance = await checkBalance(address);
                    
                    this.logCheck(address, type, balance);
                    
                    if (balance > 0) {
                        await this.handleSuccess(wallet.wif, type, address, balance);
                    }
                }
            }

            if (this.attempts % 5 === 0) {
                this.logProgress();
            }
        } catch (error) {
            console.error(chalk.red('Error during scanning:', error.message));
        }
    }

    logCheck(address, type, balance) {
        const status = balance > 0 ? chalk.green('HAS BALANCE') : chalk.gray('empty');
        console.log(`${chalk.yellow(type)}: ${address} - ${status}`);
    }

    logProgress() {
        console.log(chalk.blue(`\nProgress: Checked ${this.attempts * 3} addresses`));
        console.log(chalk.gray(`Unique addresses checked: ${this.checkedAddresses.size}\n`));
    }

    async handleSuccess(wif, type, address, balance) {
        const btcBalance = balance / 100000000;
        console.log(chalk.green('\n=== FOUND ADDRESS WITH BALANCE ==='));
        console.log(chalk.yellow('Private Key (WIF):', wif));
        console.log(chalk.yellow('Address Type:', type));
        console.log(chalk.yellow('Address:', address));
        console.log(chalk.yellow('Balance:', btcBalance, 'BTC\n'));

        FileHandler.saveFoundAddress({ wif, type, address, balance: btcBalance });
    }

    stop() {
        clearInterval(this.interval);
        console.log(chalk.red('\nScanning completed.'));
        console.log(chalk.yellow(`Total attempts: ${this.attempts}`));
        console.log(chalk.yellow(`Total unique addresses checked: ${this.checkedAddresses.size}`));
    }
}

module.exports = Scanner;
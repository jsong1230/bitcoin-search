const { strategyGenerator, createWalletFromKeyPair } = require('./wallet-strategies');

let generator = null;

function generateWallet() {
    if (!generator) {
        generator = strategyGenerator();
    }
    
    const keyPair = generator.next().value;
    return createWalletFromKeyPair(keyPair);
}

module.exports = { generateWallet };
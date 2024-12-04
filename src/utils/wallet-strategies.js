const bitcoin = require('bitcoinjs-lib');
const ecc = require('tiny-secp256k1');
const { ECPairFactory } = require('ecpair');
const crypto = require('crypto');

const ECPair = ECPairFactory(ecc);

// Common phrases for brain wallets
const commonPhrases = [
    'password', 'correct horse battery staple', 'bitcoin',
    'satoshi', 'blockchain', 'cryptocurrency', 'wallet',
    '12345678', 'qwerty', 'password123'
];

function sha256(data) {
    return crypto.createHash('sha256').update(data).digest();
}

function generateFromPhrase(phrase) {
    const hash = sha256(phrase);
    return ECPair.fromPrivateKey(hash);
}

function generateVanityPattern() {
    // Generate private keys that might result in addresses with specific patterns
    const keyPair = ECPair.makeRandom();
    return keyPair;
}

function generateLowEntropyKey() {
    // Simulate keys that might have been generated with weak RNG
    const buffer = Buffer.alloc(32);
    for (let i = 0; i < 32; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
    }
    return ECPair.fromPrivateKey(buffer);
}

function* strategyGenerator() {
    // Try brain wallet phrases
    for (const phrase of commonPhrases) {
        yield generateFromPhrase(phrase);
    }
    
    // Try vanity patterns
    yield generateVanityPattern();
    
    // Try low entropy keys
    yield generateLowEntropyKey();
    
    // Fallback to completely random as last resort
    while (true) {
        yield ECPair.makeRandom();
    }
}

function createWalletFromKeyPair(keyPair) {
    const wif = keyPair.toWIF();
    
    const addresses = {
        legacy: bitcoin.payments.p2pkh({
            pubkey: keyPair.publicKey,
            network: bitcoin.networks.bitcoin
        }).address,
        
        p2sh: bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({
                pubkey: keyPair.publicKey,
                network: bitcoin.networks.bitcoin
            }),
            network: bitcoin.networks.bitcoin
        }).address,
        
        bech32: bitcoin.payments.p2wpkh({
            pubkey: keyPair.publicKey,
            network: bitcoin.networks.bitcoin
        }).address
    };

    return { wif, addresses };
}

module.exports = {
    strategyGenerator,
    createWalletFromKeyPair
};
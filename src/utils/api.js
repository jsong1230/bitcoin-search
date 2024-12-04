const axios = require('axios');

const instance = axios.create({
    timeout: 10000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
});

async function checkBalance(address) {
    try {
        const response = await instance.get(`https://blockchain.info/balance?active=${address}`);
        return response.data[address]?.final_balance || 0;
    } catch (error) {
        if (error.code !== 'ECONNABORTED') {
            console.error(`API error: ${error.message}`);
        }
        return 0;
    }
}

module.exports = { checkBalance };
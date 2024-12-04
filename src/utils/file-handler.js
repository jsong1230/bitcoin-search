const fs = require('fs');
const path = require('path');

class FileHandler {
    static resultsDir = path.join(process.cwd(), 'results');
    static resultsFile = path.join(this.resultsDir, 'found_addresses.json');

    static initialize() {
        if (!fs.existsSync(this.resultsDir)) {
            fs.mkdirSync(this.resultsDir, { recursive: true });
        }
        if (!fs.existsSync(this.resultsFile)) {
            fs.writeFileSync(this.resultsFile, JSON.stringify([], null, 2));
        }
    }

    static saveFoundAddress(data) {
        try {
            const existingData = JSON.parse(fs.readFileSync(this.resultsFile, 'utf8'));
            existingData.push({
                ...data,
                timestamp: new Date().toISOString()
            });
            fs.writeFileSync(this.resultsFile, JSON.stringify(existingData, null, 2));
            return true;
        } catch (error) {
            console.error('Error saving to file:', error.message);
            return false;
        }
    }
}

module.exports = FileHandler;
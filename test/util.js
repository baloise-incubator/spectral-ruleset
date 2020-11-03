const { join } = require('path');
const yaml = require('js-yaml');
const fs = require('fs').promises;

module.exports = {
    loadYaml: async (path) => {
        const fileContents = await fs.readFile(join(__dirname, path), 'utf-8') 
        return yaml.safeLoad(fileContents);
    }
}

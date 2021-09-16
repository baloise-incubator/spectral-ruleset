// can be used to create the rule support markdown table

https = require('https');
fs = require('fs');

(async () => {
  const testFiles = await fs.promises.readdir(process.cwd() + '/tests');
  const testedIds = testFiles
    .map((filename) => filename.match(/^([0-9]{3})-/))
    .filter((m) => m)
    .map((m) => '#' + m[1]);
  https.get('https://opensource.zalando.com/restful-api-guidelines/rules.json', (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      const rules = JSON.parse(body).rules;
      let markdown = '<!-- table created with `node scripts/todo.js` -->\n';
      markdown += '| id | title |supported |\n';
      markdown += '| --- | --- | --- |\n';
      rules.forEach((rule) => {
        const tested = testedIds.indexOf(rule.id) !== -1;
        markdown += `| [${rule.id}][${rule.id}] | [${rule.title}][${rule.id}] | ${
          tested ? ':heavy_check_mark:' : '-'
        } |\n`;
      });
      markdown += '\n';
      rules.forEach((rule) => {
        markdown += `[${rule.id}]: https://opensource.zalando.com/restful-api-guidelines/${rule.id}\n`;
      });
      console.log(markdown);
    });
  });
})();

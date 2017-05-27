'use strict';

const fs = require('fs');
const path = require('path');

const execa = require('execa');

module.exports = () => {
	if (fs.existsSync(path.join(process.cwd(), 'package.json'))) {
		let pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')).toString());

		pkg.fyi = {};
		pkg.fyi.ignore = [];

		if (!pkg.scripts) pkg.scripts = {};

		if (pkg.scripts.test) {
			if (pkg.scripts.test !== 'fyi') pkg.scripts.test = 'fyi && ' + pkg.scripts.test;
			else pkg.scripts.test = 'fyi';
		} else pkg.scripts.test = 'fyi';

		pkg.scripts['test-watch'] = 'fyi --watch';

		pkg = JSON.stringify(pkg);

		fs.writeFile(path.join(process.cwd(), 'package.json'), pkg, (err) => {
		  if (err) throw err;

			console.log('Installing ...');

			execa.shell('npm install --save-dev fyi').then(() => {
				console.log('Done!');
			});
		});
	} else {
		console.log('Unable to find package.json');
	}
};

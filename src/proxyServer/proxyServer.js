import express from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import {hashFn} from '../helpers/hashFn.js';
import {URL_FILES_SERVER} from '../config.js';

const app = express();
app.use(bodyParser.raw());

// In fact, instead of getting the file and providing it as a proxy, we will just redirect the request to the existing files. however for the files that do not exist => we will load them and then send them in the response as a real proxy.
const startProxy = ({PROT, hashObj, hashSet}) => {
	app.use('*', function (req, res) {
		const {baseUrl} = req;
		const keyFileName = hashFn(baseUrl);
		if (keyFileName) {
			if (hashSet.has(keyFileName)) {
				const redirectTo = URL_FILES_SERVER + hashObj[keyFileName];
				console.log(chalk.gray('Founded file', baseUrl));
				res.redirect(redirectTo);
			} else {
				// todo: load the file and serve it.
				console.log(chalk.red('File not founded', keyFileName));
			}
		} else {
			console.log(chalk.red('File not founded', baseUrl));
		}
		// has to redirect to the fileServer or upload the real file and serve it..
	});
	app.listen(PROT, () => {
		console.log('Proxy started at http://127.0.0.1:' + PROT);
	});
};

export default startProxy;

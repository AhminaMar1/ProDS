import express from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import {getLastTwoSubdir, removeChunkhash} from '../helpers/subdirResolver.js';
import {URL_FILES_SERVER, INCLUDED_EXT} from '../config.js';

const app = express();
app.use(bodyParser.raw());

// In fact, instead of getting the file and providing it as a proxy, we will just redirect the request to the existing files. however for the files that do not exist => we will load them and then send them in the response as a real proxy.
const startProxy = ({PROT, hashObj, hashSet}) => {
	app.use('*', function (req, res) {
		const {baseUrl} = req;
		const ext = baseUrl && baseUrl.split('.').pop();
		if (INCLUDED_EXT.has(ext)) {
			const pathArrs = baseUrl.split('/');
			const fileName = pathArrs.pop();
			const lastTwoPath = getLastTwoSubdir(pathArrs.join('/') + '/');
			const keyFileName = removeChunkhash(fileName, lastTwoPath);
			if (hashSet.has(keyFileName)) {
				const redirectTo = URL_FILES_SERVER + hashObj[keyFileName];
				console.log(chalk.gray('Founded file', baseUrl));
				res.redirect(redirectTo);
			} else {
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

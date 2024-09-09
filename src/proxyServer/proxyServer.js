import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import {URL_FILES_SERVER, EXCLUDE_WITH_NO_PRODS} from '../config.js';
import {hashFn} from '../helpers/hashFn.js';
import {fullUrl} from '../helpers/urlResolver.js';

const app = express();
app.use(bodyParser.raw());
http.globalAgent.keepAlive = true;
// In fact, instead of getting the file and providing it as a proxy, we will just redirect the request to the existing files. however for the files that do not exist => we will load them and then send them in the response as a real proxy.
const startProxy = ({PROT, hashObj, hashSet}) => {
	app.use('*', async function (req, res) {
		const {baseUrl} = req;
		if (!baseUrl.includes(EXCLUDE_WITH_NO_PRODS)) {
			const keyFileName = hashFn(baseUrl);
			if (keyFileName && hashSet.has(keyFileName)) {
				const redirectTo = URL_FILES_SERVER + hashObj[keyFileName];
				console.log(chalk.green('Founded file', baseUrl));
				res.redirect(redirectTo);
			} else {
				const url = fullUrl(baseUrl);
				console.log(chalk.gray('file note founded, however redirecting into: ', url));
				res.redirect(url);
			}
		} else {
			console.log(chalk.red('The url that contain ', EXCLUDE_WITH_NO_PRODS, ' not has to redirect to the ProDS solution'));
		}
	});

	app.listen(PROT, () => {
		console.log('Proxy started at http://127.0.0.1:' + PROT);
	});
};

export default startProxy;

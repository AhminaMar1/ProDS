import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import {LOCALHOST, URL_FILES_SERVER, EXCLUDE_WITH_NO_PRODS} from '../../config.js';
import {hashFn} from '../helpers/hashFn.js';
import {excludedfullUrl} from '../helpers/urlResolver.js';
import {trieMatch, resolve_url} from '../helpers/proDSTrie.js';
import {splitNameDirFile} from '../helpers/splitNameDirFile.js';

const app = express();
app.use(bodyParser.raw());
http.globalAgent.keepAlive = true;
// In fact, instead of getting the file and providing it as a proxy, we will just redirect the request to the existing files. however for the files that do not exist => we will load them and then send them in the response as a real proxy.
const startProxy = ({PORT, hashObj, hashSet}) => {
	app.use('*', async function (req, res) {
		const {baseUrl} = req;
		console.log(chalk.blue('In: ', baseUrl));
		if (!baseUrl.includes(EXCLUDE_WITH_NO_PRODS)) {
			const keyFileName = hashFn(baseUrl);
			if (keyFileName && hashSet.has(keyFileName)) {
				const redirectTo = URL_FILES_SERVER + hashObj[keyFileName];
				const fileDirAndName = hashObj[keyFileName];
				console.log(chalk.green('Out: file found, file link:'), chalk.bgGreen(redirectTo));
				const [fileName, fileDir] = splitNameDirFile(fileDirAndName);
				console.log(fileDir + fileName);
				res.sendFile(fileName, {root: fileDir}, (err) => {
					if (err) console.log(chalk.red('Error when send file:'), chalk.bgRed(err));
				});
			} else {
				const tryTrie = trieMatch(baseUrl);
				if (tryTrie && (tryTrie.success || tryTrie.resolved)) {
					const rFile = tryTrie.res;
					const rUrl = resolve_url(baseUrl, rFile);
					const redirectTo = URL_FILES_SERVER + rUrl;
					const fileDirAndName = rUrl;
					if (tryTrie.success) {
						console.log(
							chalk.green('Out: file found using trie algo, file link:'),
							chalk.bgGreen(redirectTo),
						);
					} else {
						console.log(
							chalk.yellow('Out: file found using trie algo, file link:'),
							chalk.bgYellow(redirectTo),
						);
					}
					const [fileNameTrie, fileDir] = splitNameDirFile(fileDirAndName);

					res.sendFile(fileNameTrie, {root: fileDir}, (err) => {
						if (err) console.log(chalk.red('Error when send file:'), chalk.bgRed(err));
					});
				} else {
					const url = excludedfullUrl(baseUrl);
					console.log(
						chalk.gray(
							'Explaining: file note founded, however we will redirect you to get it from the origin server',
						),
					);
					console.log(chalk.red('Out: redirectTo:'), chalk.bgRed(url));
					res.redirect(url);
				}
			}
		} else {
			console.log(
				chalk.red(
					'Out: the url that contain ',
					EXCLUDE_WITH_NO_PRODS,
					' not has to redirect to the ProDS solution',
				),
			);
		}
	});

	app.listen(PORT, () => {
		console.log(`Proxy started at ${LOCALHOST}:${PORT}`);
	});
};

export default startProxy;

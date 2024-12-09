import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import {
	LOCALHOST,
	URL_FILES_SERVER,
	INCLUDED_EXT,
	EXCLUDE_WITH_NO_PRODS,
} from '../../config.js';
import {hashFn} from '../helpers/hashFn.js';
import {excludedfullUrl} from '../helpers/urlResolver.js';
import {trieMatch} from '../helpers/proDSTrie.js';
import {splitNameDirFile} from '../helpers/splitNameDirFile.js';
import {getAsIsPath} from '../helpers/getAsIsPath.js';

const app = express();
app.use(bodyParser.raw());
http.globalAgent.keepAlive = true;

const serveFileHOF = (hashObj) => {
	return (res, path, hardUrl, isASIS) => {
		const redirectTo = URL_FILES_SERVER + (hardUrl || hashObj[path]);
		const fileDirAndName = hardUrl || hashObj[path];
		if (!hardUrl) {
			console.log(
				chalk.green(`Out: ${isASIS ? ' AS IS' : ''} file found, file link:`),
				chalk.bgGreen(redirectTo),
			);
		}
		const [fileName, fileDir] = splitNameDirFile(fileDirAndName);
		res.sendFile(fileName, {root: fileDir}, (err) => {
			if (err) console.log(chalk.red('Error when send file:'), chalk.bgRed(err));
		});
	};
};

const startProxy = ({PORT, hashObj, hashSet}) => {
	const serveFile = serveFileHOF(hashObj);
	app.use('*', async function (req, res) {
		const {baseUrl} = req;
		const toGetExt = baseUrl.split('.');
		const hasIncludedExt = INCLUDED_EXT.has(toGetExt.pop() || '');
		console.log(chalk.blue('In: ', baseUrl));
		if (hasIncludedExt) {
			const keyFileName = hashFn(baseUrl);
			const asIsPath = getAsIsPath(baseUrl);
			if (asIsPath && hashSet.has(asIsPath)) {
				serveFile(res, asIsPath, '', true);
			} else if (keyFileName && hashSet.has(keyFileName)) {
				serveFile(res, keyFileName);
			} else {
				const tryTrie = trieMatch(baseUrl);
				if (tryTrie && (tryTrie.success || tryTrie.resolved)) {
					const rUrl = tryTrie.res;
					const redirectTo = URL_FILES_SERVER + rUrl;
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
					serveFile(res, keyFileName, rUrl);
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
			const url = excludedfullUrl(baseUrl);
			const alreadyHasExluded = baseUrl.split('#').pop() === EXCLUDE_WITH_NO_PRODS;
			console.log(
				chalk.red('Out: the file extension not allowed, so redirect into'),
				chalk.bgRed(url),
			);
			if (!alreadyHasExluded) {
				res.redirect(baseUrl);
			}
		}
	});

	app.listen(PORT, () => {
		console.log(`Proxy started at ${LOCALHOST}:${PORT}`);
	});
};

export default startProxy;

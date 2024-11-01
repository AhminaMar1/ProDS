import fs from 'fs';
import chalk from 'chalk';
import {initDirResolver, getLastTwoSubdir, removeChunkhash} from './subdirResolver.js';
import {INCLUDED_EXT, ROOT_PATH_LEN} from '../config.js';
import {addToTrie} from './proDStrie.js';

const readdirAsync = (path) => {
	return new Promise(function (resolve, reject) {
		fs.readdir(path, function (error, result) {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const getDir = (path) => path.substr(ROOT_PATH_LEN);

const getExt = (file) => file.split('.')?.pop();

const readOneDir = async (allFiles, hashSet, path) => {
	await readdirAsync(path)
		.then((files) => {
			let duplicated = 0;
			const lastTwoPath = getLastTwoSubdir(path);
			const dir = getDir(path);

			files.forEach((file) => {
				const key = removeChunkhash(file, lastTwoPath);
				const ext = getExt(file);
				const fileWithHash = lastTwoPath + file;
				addToTrie(fileWithHash);

				if (key && INCLUDED_EXT.has(ext)) {
					if (hashSet.has(key)) {
						duplicated++;
						console.log(chalk.red('Error file duplicated', key, path));
					}
					allFiles[key] = dir + file;
					hashSet.add(key);
				}
			});

			if (duplicated)
				console.error(chalk.red('Duplication issue: ' + duplicated + ' files'));
			console.log(
				chalk.green('----- Hashing step has been finished for "' + path + '" -----'),
			);
		})
		.catch((err) => {
			console.log(chalk.red('Error when try to read dir', err));
		});
};

const readAndHash = async (allFiles, hashSet, ROOT_PATH, flowsEnabled) => {
	const getDir = initDirResolver(ROOT_PATH);

	for (let i = 0; i < flowsEnabled.length; i++) {
		await readOneDir(allFiles, hashSet, getDir(flowsEnabled[i]));
	}
};

const initHash = (allFiles, hashSet, ROOT_PATH) => {
	return async (flowsEnabled) => {
		await readAndHash(allFiles, hashSet, ROOT_PATH, flowsEnabled);
	};
};

export {initHash};

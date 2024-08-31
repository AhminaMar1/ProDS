import fs from 'fs';
import chalk from 'chalk';
import {getLastTwoSubdir, removeChunkhash} from './subdirResolver.js';

function readdirAsync(path) {
	return new Promise(function (resolve, reject) {
		fs.readdir(path, function (error, result) {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
}

const readOneDir = async (allFiles, hashSet, path) => {
	await readdirAsync(path)
		.then((files) => {
			let duplicated = 0;
			const lastTwoPath = getLastTwoSubdir(path);
			files.forEach((file) => {
				const key = removeChunkhash(file, lastTwoPath);
				if (key) {
					if (hashSet.has(key)) {
						duplicated++;
						console.log(chalk.red('Error file duplicated', key, path));
					}
					hashSet.add(key);
					allFiles[key] = file;
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

const readAndHash = async (allFiles, hashSet, flowsEnabled) => {
	for (let i = 0; i < flowsEnabled.length; i++) {
		await readOneDir(allFiles, hashSet, flowsEnabled[i]);
	}
};

const initHash = (allFiles, hashSet) => {
	return async (flowsEnabled) => {
		await readAndHash(allFiles, hashSet, flowsEnabled);
	};
};

export {initHash};

import fs, {lstatSync} from 'fs';
import chalk from 'chalk';
import {initDirResolver, getLastNSubdir, removeChunkhash} from './subdirResolver.js';
import {
	INCLUDED_EXT,
	ROOT_PATH_LEN,
	HAS_TO_EXCLUDE_LEGACY,
	EXCLUDED_EXT,
	LEGACY_TOKEN_NAME,
} from '../../config.js';
import {addToTrie} from './proDSTrie.js';

const readedDirSet = new Set();

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

const isDir = async (path) => {
	try {
		const stat = lstatSync(path);
		return stat.isDirectory();
	} catch (e) {
		// lstatSync throws an error if path doesn't exist
		return false;
	}
};

const readOneDir = async (hashObj, hashSet, path) => {
	await readdirAsync(path)
		.then(async (files) => {
			let duplicated = 0;
			const lastTwoPath = getLastNSubdir(path);
			const dir = getDir(path);

			await files.forEach(async (file) => {
				const newDir = path + file;
				const isADir = await isDir(newDir);
				if (isADir) {
					if (!readedDirSet.has(newDir)) {
						readedDirSet.add(newDir);
						//Todo: has to add readStack => wait for it
						await readOneDir(hashObj, hashSet, newDir + '/');
					}
				} else {
					const key = removeChunkhash(file, lastTwoPath);
					const ext = getExt(file);
					const fileWithHash = lastTwoPath + file;
					if (
						(HAS_TO_EXCLUDE_LEGACY && fileWithHash.includes(LEGACY_TOKEN_NAME)) ||
						EXCLUDED_EXT.has(ext)
					) {
					} else if (INCLUDED_EXT.has(ext)) {
						addToTrie(fileWithHash);
					}

					if (key && INCLUDED_EXT.has(ext)) {
						if (hashSet.has(key)) {
							duplicated++;
							console.log(chalk.red('Error file duplicated', key, path));
						}
						hashObj[key] = dir + file;
						hashSet.add(key);
					}
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

const readAndHash = async (hashObj, hashSet, ROOT_PATH, flowsEnabled) => {
	const getDir = initDirResolver(ROOT_PATH);

	for (let i = 0; i < flowsEnabled.length; i++) {
		await readOneDir(hashObj, hashSet, getDir(flowsEnabled[i]));
	}
};

const initHash = (hashObj, hashSet, ROOT_PATH) => {
	return async (flowsEnabled) => {
		await readAndHash(hashObj, hashSet, ROOT_PATH, flowsEnabled);
	};
};

export {initHash};

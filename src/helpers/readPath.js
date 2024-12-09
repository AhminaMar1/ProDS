import fs, {lstatSync} from 'fs';
import chalk from 'chalk';
import {initDirResolver, getLastNSubdir, removeChunkhash} from './subdirResolver.js';
import {
	INCLUDED_EXT,
	ROOT_PATH_LEN,
	HAS_TO_EXCLUDE_LEGACY,
	EXCLUDED_EXT,
	LEGACY_TOKEN_NAME,
	ROOT_PATH,
} from '../../config.js';
import {addToTrie} from './proDSTrie.js';
import {readQueue} from './readStack.js';
import {getAsIsPath} from './getAsIsPath.js';

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
						const len = newDir.length;
						const dirToAddToQueue = newDir.substr(-(len - ROOT_PATH.length)) + '/';
						console.log(chalk.green('+added new path to be read', dirToAddToQueue));
						readQueue.enqueue(dirToAddToQueue);
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
						const AsIsPath = getAsIsPath(lastTwoPath + file);
						hashObj[AsIsPath] = dir + file;
						hashSet.add(AsIsPath);
					}
				}
			});

			if (duplicated)
				console.error(chalk.red('Duplication issue: ' + duplicated + ' files'));
			console.log(chalk.green('-Hashing step has been finished for "' + path + '" -----'));
		})
		.catch((err) => {
			console.log(chalk.red('Error when try to read dir', err));
		});
};

const readAndHash = async (hashObj, hashSet, flowToRead) => {
	const getDir = initDirResolver(ROOT_PATH);
	await readOneDir(hashObj, hashSet, getDir(flowToRead));
};

const initHash = async (hashObj, hashSet) => {
	return async (flowToRead) => {
		await readAndHash(hashObj, hashSet, flowToRead);
	};
};

export {initHash};

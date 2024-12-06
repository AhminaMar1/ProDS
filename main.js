import {
	ROOT_PATH,
	FILES_SERVER_PORT,
	PROXY_SERVER_PORT,
	FLOWS_TO_READ,
} from './config.js';
import chalk from 'chalk';
import {startFileServer} from './src/fileServer/index.js';
import {startProxy} from './src/proxyServer/index.js';
import {initHash} from './src/helpers/readPath.js';
import {readQueue} from './src/helpers/readStack.js';

// to understand the structure => look at README.md

// read existing files and init hashes
const hashObj = {}; // hashmap
const hashSet = new Set();

(async () => {
	const startHashes = await initHash(hashObj, hashSet);
	FLOWS_TO_READ.forEach((flow) => {
		console.log(chalk.green('+added new path to be read', flow));
		readQueue.enqueue(flow);
	});

	let flowToRead = readQueue.dequeue();
	while (flowToRead) {
		await startHashes(flowToRead);
		flowToRead = readQueue.dequeue();
	}

	console.log(chalk.cyan('The files that has been hashed:'));
	const keys = Object.keys(hashObj);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		console.log(chalk.cyan(key, '=>', hashObj[key]));
	}
	// start the file server
	const fileServerConfigs = {
		PORT: FILES_SERVER_PORT,
		FILES_DIR: ROOT_PATH,
	};

	startFileServer(fileServerConfigs);
	startProxy({PORT: PROXY_SERVER_PORT, hashObj, hashSet});
})();

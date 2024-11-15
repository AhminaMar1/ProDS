import {
	ROOT_PATH,
	FILES_SERVER_PORT,
	PROXY_SERVER_PORT,
	ENABLED_FLOWS,
} from './config.js';
import {startFileServer} from './src/fileServer/index.js';
import {startProxy} from './src/proxyServer/index.js';
import {initHash} from './src/helpers/readPath.js';

// to understand the structure => look at README.md

// read existing files and init hashes
const hashObj = {}; // hashmap
const hashSet = new Set();

(async () => {
	const startHashes = initHash(hashObj, hashSet, ROOT_PATH);
	await startHashes(ENABLED_FLOWS);

	console.log(hashObj);
	// start the file server
	const fileServerConfigs = {
		PORT: FILES_SERVER_PORT,
		FILES_DIR: ROOT_PATH,
	};

	startFileServer(fileServerConfigs);
	startProxy({PROT: PROXY_SERVER_PORT, hashObj, hashSet});
})();

import {ROOT_PATH, fileServerPort, proxyServerPort} from './src/config.js';
import {startFileServer} from './src/fileServer/index.js';
import {startProxy} from './src/proxyServer/index.js';
import {initHash} from './src/helpers/readPath.js';

// to understand the structure => look at README.md

const FLOWS = ['app01', 'app02'];

// read existing files and init hashes
const hashObj = {}; // hashmap
const hashSet = new Set();

(async () => {
	const startHashes = initHash(hashObj, hashSet, ROOT_PATH);
	await startHashes(FLOWS);

	console.log(hashObj);
	// start the file server
	const fileServerConfigs = {
		PORT: fileServerPort,
		FILES_DIR: ROOT_PATH,
	};

	startFileServer(fileServerConfigs);
	startProxy({PROT: proxyServerPort, hashObj, hashSet});
})();

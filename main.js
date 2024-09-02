import {ROOT_PATH, fileServerPort, proxyServerPort} from './src/config.js';
import {startFileServer} from './src/fileServer/index.js';
import {startProxy} from './src/proxyServer/index.js';
import {initHash} from './src/helpers/readPath.js';
import {initDirResolver} from './src/helpers/subdirResolver.js';

// to understand the structure => look at README.md

// read existing files and init hashes
const allFiles = {};
const hashSet = new Set();

const getDir = initDirResolver(ROOT_PATH);

(async () => {
	const hashes = initHash(allFiles, hashSet);
	await hashes([getDir('app01/')]);

	console.log(allFiles);
	// start the file server
	const fileServerConfigs = {
		PORT: fileServerPort,
		FILES_DIR: ROOT_PATH,
	};

	startFileServer(fileServerConfigs);
	//TODO: send the allFiles Hashes and hasSet to start proxy
	startProxy({port: proxyServerPort});
})();

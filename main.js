import {resourcesPath, fileServerPort, proxyServerPort} from './src/config.js';
import {startFileServer} from './src/fileServer/index.js';
import {startProxy} from './src/proxyServer/index.js';
import {initHash} from './src/helpers/readPath.js';

// to understand the structure => look at README.md

// read existing files and init hashes
const allFiles = {};
const hashSet = new Set();

(async () => {
	const hashes = initHash(allFiles, hashSet);
	await hashes(['./resourcesExample/']);

	// start the file server
	const fileServerConfigs = {
		PORT: fileServerPort,
		FILES_DIR: resourcesPath,
	};

	startFileServer(fileServerConfigs);
	startProxy({port: proxyServerPort});
})();

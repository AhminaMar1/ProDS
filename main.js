import { resourcesPath, fileServerPort, proxyServerPort } from './src/config.js';
import { startFileServer } from './src/fileServer/index.js';
import { startProxy } from './src/proxyServer/index.js';

// to understand the structure => look at README.md


// start the file server
startFileServer({ resourcesPath, fileServerPort });
startProxy({ proxyServerPort });

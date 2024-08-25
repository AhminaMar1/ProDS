import { resourcesPath, fileServerPort } from './src/config';
import { startFileServer } from './src/fileServer';


// to understand the structure => look at README.md


// start the file server
startFileServer({ resourcesPath, fileServerPort });

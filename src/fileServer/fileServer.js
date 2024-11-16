import httpServer from 'http-server';
import {LOCALHOST} from '../../config.js';
import path from 'path';

const startFileServer = ({FILES_DIR, PORT}) => {
	const resourceRoot = path.resolve(FILES_DIR);
	const options = {
		root: resourceRoot,
	};

	const server = httpServer.createServer(options);
	server.listen(PORT, '0.0.0.0', function () {
		console.log(`Server started at ${LOCALHOST}:${PORT}`);
	});
};

export default startFileServer;

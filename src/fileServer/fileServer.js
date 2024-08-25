import httpServer from "http-server";
import path from "path";

const startFileServer = ({ resourcesPath, fileServerPort }) => {
    const resourceRoot = path.resolve(resourcesPath);
    const options = {
        root: resourceRoot,
    };

    const server = httpServer.createServer(options);
    server.listen(fileServerPort, "0.0.0.0", function () {
        console.log("Server started at http://127.0.0.1:" + fileServerPort);
    });
};

export default startFileServer;

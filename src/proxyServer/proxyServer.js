import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.raw());

// In fact, instead of getting the file and providing it as a proxy, we will just redirect the request to the existing files. however for the files that do not exist => we will load them and then send them in the response as a real proxy.
const startProxy = ({ proxyServerPort }) => {
    app.use("*", function (req, res) {
        const { baseUrl } = req;
        res.send({ baseUrl });
    });
    app.listen(proxyServerPort, () => {
        console.log("Proxy started at http://127.0.0.1:" + proxyServerPort);
    });
}

export default startProxy;

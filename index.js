const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const url = require("url");
const bodyParser = require("body-parser");

app.use(bodyParser());

let clientResponseRef;

app.get("/", (req, res) => {
  res.send("HI");
});

app.get("/*", (req, res) => {
  const pathname = url.parse(req.url).pathname;

  const obj = {
    pathname: pathname,
    method: "get",
    params: req.query,
  };

  io.emit("page-request", obj);
  clientResponseRef = res;
});

app.post("/*", (req, res) => {
  const pathname = url.parse(req.url).pathname;

  const obj = {
    pathname: pathname,
    method: "post",
    params: req.body,
  };

  io.emit("page-request", obj);
  clientResponseRef = res;
});

io.on("connection", (socket) => {
  console.log("a node connected");
  socket.on("page-response", (response) => {
    clientResponseRef.send(response);
  });
});

const server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, () => {
  console.log("listening on *:" + server_port);
});

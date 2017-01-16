var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;
server.listen(port);

app.use(bodyParser.json());

app.get('/', function (req, res) {
    fs.readFile(__dirname + '/htdocs/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
});

app.all('/netatmo-webhook/', function (req, res) {
    var requestData = req.body;

    if (requestData && requestData.home_id) {
        io.sockets.in(requestData.home_id).emit('alert', requestData);
    }

    res.writeHead(200);
    res.end("OK");
});

io.on('connection', function (socket) {
    socket.on('registerHome', function (homeId) {
        socket.join(homeId);
    });
});
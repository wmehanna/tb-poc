const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

var expressApp = require('express')();
var http = require("http").Server(expressApp);
var io = require("socket.io")(http);

var bodyParser = require('body-parser')

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({extended: true}));


io.on("connection", function (socket) {

    socket.on("disconnect", function () {
        console.log("user disconnected");
    });

    expressApp.post('/api/login', function (req, res) {
        console.log(req.body)
        if (!req.body || !req.body.username || !req.body.password) return res.sendStatus(400);

        let username = req.body.username;
        let password = req.body.password;

        socket.emit('loginSocket', req.body);

        res.send('welcome, ' + req.body.username);
    });

    expressApp.post('/api/diaporama', function (req, res) {
        let mode = req.body.diaporama;

        socket.emit("modeDiaporamaSocket", mode);
        res.send('Diaporama is '+ mode)
    })

    expressApp.post('/api/logout', function (req, res) {
        socket.emit("logoutSocket", "GoodBye");
        res.send('goodbye')
    })
});

http.listen(3000, function () {
    console.log('Tileboard POC app listening on port 3000!');
});

let win;

function createWindow() {
    win = new BrowserWindow({width: '100%', fullscreen : true})

    win.loadURL(`file://${__dirname}/index.html`)
    // win.webContents.openDevTools();

    win.on('closed', function () {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (win === null) {
        createWindow()
    }
})

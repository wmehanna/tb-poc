const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow


var expressApp = require('express')();
var http = require("http").Server(expressApp);
var io = require("socket.io")(http);

var bodyParser = require('body-parser')

expressApp.use(bodyParser.json()); // for parsing application/json
expressApp.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

io.on("connection", function (socket) {

    socket.on("disconnect", function () {
        console.log("user disconnected");
    });

    expressApp.post('/api/login', function (req, res) {
        console.log(req.body)
        if (!req.body || !req.body.username || !req.body.password) return res.sendStatus(400);

        let username = req.body.username;
        let password = req.body.password;

        socket.emit('loginSocket', req.body)

        res.send('welcome, ' + req.body.username)
    });
});

http.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

let win;

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600})

    win.loadURL(`file://${__dirname}/index.html`)
    // win.loadURL(`http://portal.tileboard.ca/Account/Login?ReturnUrl`)

    // Open the DevTools.
    win.webContents.openDevTools()

    win.on('closed', function () {

        win = null
    })
}


app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {

    if (win === null) {
        createWindow()
    }
})

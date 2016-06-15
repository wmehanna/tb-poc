const {ipcMain} = require('electron')

const electron = require('electron');
const app = electron.app
const BrowserWindow = electron.BrowserWindow

var expressApp = require('express')();
var http = require("http").Server(expressApp);

var bodyParser = require('body-parser')

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({extended: true}));


expressApp.post('/api/login', function (req, res) {
    if (!req.body || !req.body.username || !req.body.password) return res.sendStatus(400);

    let body = req.body;
    let username = body.username;
    let password = body.password;

    res.send('welcome, ' + username);

    win.webContents.send('loginIPC', body);
});


expressApp.post('/api/logout', function (req, res) {
    res.send('goodbye')
    win.webContents.send("logoutIPC", "GoodBye");
});

expressApp.post('/api/diaporama', function (req, res) {
    let mode = req.body.diaporama;

    res.send('Diaporama is ' + mode);

    win.webContents.send("modeDiaporamaIPC", mode);
})

expressApp.post('/api/line', function (req, res) {
    let line = req.body.line;

    res.send('Line id changed to :  ' + line);

    win.webContents.send("changeLineIPC", line);
})



http.listen(3000, function () {
    console.log('Tileboard POC app listening on port 3000!');
});

let win;

function createWindow() {
    win = new BrowserWindow({width: '100%', fullscreen: true})

    win.loadURL(`file://${__dirname}/index.html`)
    // win.webContents.openDevTools();
    win.setMenu(null);

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

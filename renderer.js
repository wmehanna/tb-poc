var io = require("socket.io-client");

var socket;

function initSocket() {

    socket = io("http://localhost:3000", {
        reconnectionDelay: 0,
        reconnectionDelayMax: 0,
        randomizationFactor: 0,
        timeout: 1000,
        reconnection: true
    });

    socket.on("connect_error", function () {
        console.log("connect_error", arguments);
    });
    socket.on("connect_timeout", function () {
        console.log("connect_timeout", arguments);
    });
    socket.on("reconnect", function () {
        console.log("reconnect", arguments);
    });
    socket.on("reconnect_attempt", function () {
        console.log("reconnect_attempt", arguments);
    });
    socket.on("reconnect_error", function () {
        console.log("reconnect_error", arguments);
    });
    socket.on("reconnecting", function () {
        console.log("reconnecting", arguments);
    });
    socket.on("reconnect_failed", function () {
        console.log("reconnect_failed", arguments);
    });
    socket.on("connect", function () {
        // socket.emit("loginSocket");
        // console.log("connected")

        socket.on('loginSocket', function (credentials) {
            $("#leMessage").text(JSON.stringify(credentials));

            var $iframe = $("#iframe").contents().find('body');
            $iframe.find("#username").val(credentials.username);
            $iframe.find("#password").val(credentials.password);

            var form =
                `
                <form id='leForm' method="post" action="/Account/GetAccounts">
                <input type="text" name="UserName" value="Viau/jp">
                <input type="text" name="Password" value="Antoine">
                </form>
                `;

            $iframe.append($(form));
            $iframe.find("#leForm").submit();

            // $iframe.find("#login-submit").click();
            // let len = 0;
            // let isAccounts = setInterval(()=> {
            //     len = $iframe.find("#list-view-modal > div > ul").length;
            //
            //     console.log(len)
            //
            //     if (len == 1) {
            //         console.log("Got Accounts");
            //         $iframe.find("#list-view-modal > div > ul > li:nth-child(56)").click();
            //
            //
            //         $("#list-view-modal > div > div > a.btn.btn-large.list-view-select").click();
            //         clearInterval(isAccounts);
            //
            //
            //     } else {
            //
            //         console.log("nothing")
            //     }
            //
            // }, 1000)


        });

        socket.on("open", function () {

        });

        socket.on("quit", function () {
            app.quit();
        });
    });
}

initSocket();
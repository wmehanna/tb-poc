var io = require("socket.io-client");
var socket;

function initSocket() {
    var baserUrl = "http://portal.tileboard.ca/";

    var welcomeMessage = function(){
        setTimeout(function(){
            var $iframe = $("#iframe");
            var $body = $iframe.contents().find('body');
            $body.find(".login-group").html("<h1>Authentifiez-vous sur votre téléphone intelligent.</h1>")

        }, 100)
    }

    socket = io("http://localhost:3000", {
        reconnectionDelay: 0,
        reconnectionDelayMax: 0,
        randomizationFactor: 0,
        timeout: 1000,
        reconnection: true
    });

    socket.on("connect", ()=> {
        welcomeMessage();

        socket.on('modeDiaporamaSocket', (mode)=> {
            var $iframe = $("#iframe");
            var $body = $iframe.contents().find('body');
            if(mode == 'on') $body.find("#slideshowbutton").click();

            else $body.find("#buttonSlideshowModal > span:nth-child(1)").click();
        });

        socket.on('logoutSocket', (message)=> {
            var $iframe = $("#iframe");
            $iframe.attr('src', baserUrl + '/Account/LogOut');
            welcomeMessage();
        });

        socket.on('loginSocket', (credentials)=> {
            var $iframe = $("#iframe");
            var $body = $iframe.contents().find('body');

            // $("#welcomeMessage").text("Welcome " + credentials.username);

            var $loadingIcon = '<i class="fa fa-circle-o-notch fa-spin fa-4x" style="margin-right:auto; margin-left:auto;"></i>';

            var form =
                `
                <form id='leForm' method="post" action="/Account/Login" style="display: none;">
                <input type="text" name="AccountId" value="` + credentials.accountId + `">
                <input type="text" name="UserName" value="` + credentials.username + `">
                <input type="text" name="Password" value="` + credentials.password + `">
                </form>
                `;

            $body.append($(form));
            $body.find("#leForm").submit();

            $body.find("#loginForm").hide();
            $body.append($loadingIcon);
        });

        socket.on("quit", function () {
            app.quit();
        });
    });
}

initSocket();
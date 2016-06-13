const {ipcRenderer} = require('electron')

var baserUrl = "http://portal.tileboard.ca/";

var welcomeMessage = function () {
    var $iframe = $("#iframe");
    var $body = $iframe.contents().find('body');
    $body.find(".login-group").html("<h1>Authentifiez-vous sur votre téléphone intelligent.</h1>")
}

setTimeout(function () {
    welcomeMessage();
}, 450)

ipcRenderer.on('modeDiaporamaSocket', (event, mode)=> {
    var $iframe = $("#iframe");
    var $body = $iframe.contents().find('body');
    if (mode == 'on') $body.find("#slideshowbutton").click();

    else $body.find("#buttonSlideshowModal > span:nth-child(1)").click();
});

ipcRenderer.on('changeLineSocket', (event, line)=> {
    var $iframe = $("#iframe");
    var $body = $iframe.contents().find('body');
    $body.find("#" + line).click();
});

ipcRenderer.on('logoutSocket', (event, message)=> {
    var $iframe = $("#iframe");
    $iframe.attr('src', baserUrl + '/Account/LogOut');
    welcomeMessage();
});

ipcRenderer.on('loginSocket', (event, credentials)=> {
    var $iframe = $("#iframe");
    var $body = $iframe.contents().find('body');

    $("#welcomeMessage").text("Welcome " + credentials.username);

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

ipcRenderer.on("quit", function () {
    app.quit();
});

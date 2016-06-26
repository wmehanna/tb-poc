const {ipcRenderer} = require('electron')

let baserUrl = "http://portal.tileboard.ca/";

let welcomeMessage = function () {
    setTimeout(function () {
        let $iframe = $("#iframe");
        let $body = $iframe.contents().find('body');
        $body.find("#forgot-password").hide();

        $.get("http://localhost:3000/api/ip", function (ifaces) {

            $body.find(".login-group").html("<h1>Authentifiez-vous sur votre téléphone intelligent");

            ifaces.forEach((iface, key) =>{
                $body.find(".login-group").append("<p/>"+"http://"+iface.ip + ":3000.</h1><p/>");
            })
        });

    }, 2000)
}


welcomeMessage();


ipcRenderer.on('modeDiaporamaIPC', (event, mode)=> {
    let $iframe = $("#iframe");
    let $body = $iframe.contents().find('body');
    if (mode == 'on') $body.find("#slideshowbutton").click();

    else $body.find("#buttonSlideshowModal > span:nth-child(1)").click();
});

ipcRenderer.on('changeLineIPC', (event, line)=> {
    let $iframe = $("#iframe");
    let $body = $iframe.contents().find('body');
    $body.find("#" + line).click();
});

ipcRenderer.on('logoutIPC', (event, message)=> {
    let $iframe = $("#iframe");
    $iframe.attr('src', baserUrl + '/Account/LogOut');

    welcomeMessage();
});

ipcRenderer.on('loginIPC', (event, credentials)=> {
    let $iframe = $("#iframe");
    let $body = $iframe.contents().find('body');

    $("#welcomeMessage").text("Welcome " + credentials.username);

    let $loadingIcon = '<i class="fa fa-circle-o-notch fa-spin fa-4x" style="margin-right:auto; margin-left:auto;"></i>';

    let form =
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

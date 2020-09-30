var WSCCmd_TokenLogin = WSClientCmd.extend({
    cmdid: CMDID_TOKENLOGIN,

    send: function (token, callback) {
        this.wsc.sendex({cmdid: this.cmdid, token: token}, callback, false);
    }
});

MainClient.singleton.addCmd(new WSCCmd_TokenLogin());
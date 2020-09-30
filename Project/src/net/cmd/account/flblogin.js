var WSCCmd_FLBLogin = WSClientCmd.extend({
    cmdid: CMDID_FLBLOGIN,

    send: function (token, callback) {
        //AccountMgr.singleton.mobile = mobile;
        //AccountMgr.singleton.passwd = passwd;

        this.wsc.sendex({cmdid: this.cmdid, token: token, clienttype: GameAssistant.singleton.getClientType(), language: CLIENT_LANGUAGE}, callback);
    }
});

MainClient.singleton.addCmd(new WSCCmd_FLBLogin());
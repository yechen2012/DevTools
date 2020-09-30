var WSCCmd_PLogin = WSClientCmd.extend({
    cmdid: CMDID_PLOGIN,

    send: function (pname, uname, callback) {
        //AccountMgr.singleton.mobile = mobile;
        //AccountMgr.singleton.passwd = passwd;

        this.wsc.sendex({cmdid: this.cmdid, uname: uname, pname: pname, clienttype: GameAssistant.singleton.getClientType(), language: CLIENT_LANGUAGE}, callback);
    }
});

MainClient.singleton.addCmd(new WSCCmd_PLogin());
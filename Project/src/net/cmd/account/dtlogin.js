var WSCCmd_DTLogin = WSClientCmd.extend({
    cmdid: CMDID_DTLOGIN,

    send: function (business, playername, playerpwd, clienttype, callback) {
        //AccountMgr.singleton.mobile = mobile;
        //AccountMgr.singleton.passwd = passwd;

        this.wsc.sendex({cmdid: this.cmdid, business: business, playername: playername, playerpwd: playerpwd, clienttype: clienttype, language: CLIENT_LANGUAGE}, callback);
    }
});

MainClient.singleton.addCmd(new WSCCmd_DTLogin());
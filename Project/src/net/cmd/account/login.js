var WSCCmd_Login = WSClientCmd.extend({
    cmdid: CMDID_LOGIN,

    send: function (uname, passwd, callback) {
        //AccountMgr.singleton.mobile = mobile;
        //AccountMgr.singleton.passwd = passwd;

        this.wsc.sendex({cmdid: this.cmdid, uname: uname, passwd: passwd}, callback);
    }
});

MainClient.singleton.addCmd(new WSCCmd_Login());
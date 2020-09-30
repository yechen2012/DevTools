var WSCCmd_GuestLogin = WSClientCmd.extend({
    cmdid: CMDID_GUESTLOGIN,

    send: function (token, guestuname, callback) {
        //AccountMgr.singleton.mobile = mobile;
        //AccountMgr.singleton.passwd = passwd;

        var msgobj = {cmdid: this.cmdid, language: CLIENT_LANGUAGE};

        if (token != undefined) {
            msgobj.token = token;
        }

        if (guestuname != undefined) {
            msgobj.guestuname = guestuname;
        }

        this.wsc.sendex(msgobj, callback);
    }
});

MainClient.singleton.addCmd(new WSCCmd_GuestLogin());
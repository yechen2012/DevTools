var WSCCmd_Logout = WSClientCmd.extend({
    cmdid: CMDID_LOGOUT,

    send: function (callback) {
        //AccountMgr.singleton.mobile = mobile;
        //AccountMgr.singleton.passwd = passwd;

        this.wsc.sendex({cmdid: this.cmdid}, callback);
    }
});

MainClient.singleton.addCmd(new WSCCmd_Logout());
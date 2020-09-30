var WSCCmd_Reg = WSClientCmd.extend({
    cmdid: CMDID_REG,

    send: function (uname, passwd, keycode, callback) {
        //AccountMgr.singleton.mobile = mobile;
        //AccountMgr.singleton.passwd = passwd;

        this.wsc.sendex({cmdid: this.cmdid, uname: uname, keycode: keycode, passwd: passwd}, callback);
    }
});

MainClient.singleton.addCmd(new WSCCmd_Reg());
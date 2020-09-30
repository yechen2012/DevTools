var WSCCmd_ChgMyIcon = WSClientCmd.extend({
    cmdid: CMDID_CHGMYICON,

    send: function (iconid, callback) {
        this.wsc.sendex({cmdid: this.cmdid, iconid: iconid}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_ChgMyIcon());
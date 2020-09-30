var WSCCmd_GetMailAward = WSClientCmd.extend({
    cmdid: CMDID_GETMAILAWARD,

    send: function (rsa, type, callback) {
        this.wsc.sendex({cmdid: this.cmdid, rsa: rsa, type: type}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_GetMailAward());
var WSCCmd_GetFreeCash = WSClientCmd.extend({
    cmdid: CMDID_GETFREECASH,

    send: function (callback) {
        this.wsc.sendex({cmdid: this.cmdid}, callback);
    }
});

MainClient.singleton.addCmd(new WSCCmd_GetFreeCash());
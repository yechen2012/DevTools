var WSCCmd_ReqBetLog = WSClientCmd.extend({
    cmdid: CMDID_REQBETLOG,

    send: function (callback) {
        this.wsc.sendex({cmdid: this.cmdid}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_ReqBetLog());
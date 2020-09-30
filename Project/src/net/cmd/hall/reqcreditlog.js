var WSCCmd_ReqCreditLog = WSClientCmd.extend({
    cmdid: CMDID_REQCREDITLOG,

    send: function (callback) {
        this.wsc.sendex({cmdid: this.cmdid}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_ReqCreditLog());
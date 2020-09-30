var WSCCmd_ReqMail = WSClientCmd.extend({
    cmdid: CMDID_REQMAIL,

    send: function (callback) {
        this.wsc.sendex({cmdid: this.cmdid}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_ReqMail());
var WSCCmd_ReqDiscount = WSClientCmd.extend({
    cmdid: CMDID_REQDISCOUNT,

    send: function (callback) {
        this.wsc.sendex({cmdid: this.cmdid}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_ReqDiscount());
var WSCCmd_ProcDiscount = WSClientCmd.extend({
    cmdid: CMDID_PROCDISCOUNT,

    send: function (discountcode, callback) {
        this.wsc.sendex({cmdid: this.cmdid, discountcode: discountcode}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_ProcDiscount());
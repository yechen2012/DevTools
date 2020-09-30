var WSCCmd_GetAllMailAward = WSClientCmd.extend({
    cmdid: CMDID_GETALLMAILAWARD,

    send: function (lst, callback) {
        this.wsc.sendex({cmdid: this.cmdid, lst: lst}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_GetAllMailAward());
var WSCCmd_Refurbish = WSClientCmd.extend({
    cmdid: CMDID_REFURBISH,

    send: function (mainscene, childscene, callback) {
        this.wsc.sendex({cmdid: this.cmdid, mainscene: mainscene, childscene: childscene}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_Refurbish());
var WSCCmd_CheckVer = WSClientCmd.extend({
    cmdid: CMDID_CHECKVER,

    send: function (clienttype, nativever, scriptver, businessid, callback) {
        this.wsc.sendex({cmdid: this.cmdid, clienttype: clienttype, nativever: nativever, scriptver: scriptver, businessid: businessid}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_CheckVer());
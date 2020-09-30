var WSCCmd_ReqCommonJackpot = WSClientCmd.extend({
    cmdid: CMDID_REQCOMMONJACKPOT,

    send: function (callback) {
        if(GAMETYPE_CURTYPE != undefined && GAMETYPE_CURTYPE > 5)
            this.wsc.sendex({cmdid: this.cmdid}, undefined, false);
    }
});

MainClient.singleton.addCmd(new WSCCmd_ReqCommonJackpot());
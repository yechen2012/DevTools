var WSCCmd_Usegiftfree = WSClientCmd.extend({
    cmdid: CMDID_USEGIFTFREE,

    send: function (gameid, giftfreeid, callback) {
        //GameMgr.singleton.curgameid = gameid;

        //cc.log(gameid);

        this.wsc.sendex({cmdid: this.cmdid, gameid: gameid, giftfreeid: giftfreeid}, function (isok) {

            if (callback != undefined) {
                callback(isok);
            }
        });
    }
});

MainClient.singleton.addCmd(new WSCCmd_Usegiftfree());
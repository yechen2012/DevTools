var WSCCmd_ComeInGameEx = WSClientCmd.extend({
    cmdid: CMDID_COMEINGAMEEX,

    send: function (gamecode, tableid, callback) {
        //GameMgr.singleton.curgameid = gameid;

        //cc.log(gameid);

        this.wsc.sendex({cmdid: this.cmdid, gamecode: gamecode, tableid: tableid}, function (isok) {
            if (isok) {

                //GameMgr.singleton.onComeInOK(gameid);

            }

            if (callback != undefined) {
                callback(isok);
            }
        });
    }
});

MainClient.singleton.addCmd(new WSCCmd_ComeInGameEx());
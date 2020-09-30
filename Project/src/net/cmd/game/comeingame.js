var WSCCmd_ComeInGame = WSClientCmd.extend({
    cmdid: CMDID_COMEINGAME,

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

MainClient.singleton.addCmd(new WSCCmd_ComeInGame());
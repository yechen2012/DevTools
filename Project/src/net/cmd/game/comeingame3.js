var WSCCmd_ComeInGame3 = WSClientCmd.extend({
    cmdid: CMDID_COMEINGAME3,

    send: function (gamecode, tableid, isreconnect, callback) {
        //GameMgr.singleton.curgameid = gameid;
        //cc.log(gameid);

        this.wsc.sendex({cmdid: this.cmdid, gamecode: gamecode, tableid: tableid, isreconnect: isreconnect}, function (isok) {
            if (isok) {
                //GameMgr.singleton.onComeInOK(gameid);
                MainClient.singleton.isreconnect = true;
            }

            if (callback != undefined) {
                callback(isok);
            }
        });
    }
});

MainClient.singleton.addCmd(new WSCCmd_ComeInGame3());
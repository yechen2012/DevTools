var WSCCmd_LeftGame2 = WSClientCmd.extend({
    cmdid: CMDID_LEFTGAME2,

    send: function (gamecode, callback) {
        //GameMgr.singleton.curgameid = gameid;

        //cc.log(gameid);

        this.wsc.sendex({cmdid: this.cmdid, gamecode: gamecode}, callback, false);
    }
});

MainClient.singleton.addCmd(new WSCCmd_LeftGame2());
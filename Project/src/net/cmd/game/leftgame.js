/**
 * Created by chowray on 16/4/13.
 */
var WSCCmd_LeftGame = WSClientCmd.extend({
    cmdid: CMDID_LEFTGAME,

    send: function (gamecode, callback) {
        //GameMgr.singleton.curgameid = gameid;

        //cc.log(gameid);

        this.wsc.sendex({cmdid: this.cmdid, gamecode: gamecode}, callback, false);
    }
});

MainClient.singleton.addCmd(new WSCCmd_LeftGame());
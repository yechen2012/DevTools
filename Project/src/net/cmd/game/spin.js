/**
 * Created by chowray on 16/4/8.
 */
var WSCCmd_Spin = WSClientCmd.extend({
    cmdid: CMDID_SPIN,

    send: function (gameid, bet, times, lines, callback) {
        //GameMgr.singleton.curgameid = gameid;

        //cc.log(gameid);

        //GameMgr.singleton.lastSpinID = GameMgr.singleton.myInfo.spinnums + 1;
        var msg = {cmdid: this.cmdid, gameid: gameid, spinindex: MainClient.singleton.curSpinID, bet: bet, times: times, lines: lines};
        if (g_spinstate > 0) {
            msg.state = g_spinstate;
        }

        GameMgr.singleton.onSendCmd(msg, callback);

        this.wsc.sendex(msg, callback, false);
    }
});

MainClient.singleton.addCmd(new WSCCmd_Spin());
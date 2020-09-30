var WSCCmd_Spin2 = WSClientCmd.extend({
    cmdid: CMDID_SPIN2,

    send: function (gameid, bet, times, lines, callback) {
        var msg = {cmdid: this.cmdid, gameid: gameid, ctrlid: MainClient.singleton.curctrlid, bet: bet, times: times, lines: lines};
        GameMgr.singleton.onSendCmd(msg, callback);

        this.wsc.sendex(msg, callback, false);
    }
});

MainClient.singleton.addCmd(new WSCCmd_Spin2());
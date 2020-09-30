var WSCCmd_GameCtrl3 = WSClientCmd.extend({
    cmdid: CMDID_GAMECTRL3,

    send: function (gameid, ctrlname, ctrlparam, callback) {
        var msg = {cmdid: this.cmdid, gameid: gameid, ctrlid: MainClient.singleton.curctrlid, ctrlname: ctrlname, ctrlparam: ctrlparam};
        GameMgr.singleton.onSendCmd(msg, callback);

        this.wsc.sendex(msg, callback, false);

        return msg;
    },

    sendex: function (msg, callback) {
        GameMgr.singleton.onSendCmd(msg, callback);

        this.wsc.sendex(msg, callback, false);
    }
});

MainClient.singleton.addCmd(new WSCCmd_GameCtrl3());
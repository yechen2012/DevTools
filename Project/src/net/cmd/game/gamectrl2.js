var WSCCmd_GameCtrl2 = WSClientCmd.extend({
    cmdid: CMDID_GAMECTRL2,

    send: function (gameid, ctrlname, ctrlparam, callback) {
        var msg = {cmdid: this.cmdid, gameid: gameid, ctrlid: MainClient.singleton.curctrlid, ctrlname: ctrlname, ctrlparam: ctrlparam};
        GameMgr.singleton.onSendCmd(msg, callback);

        this.wsc.sendex(msg, callback, false);
    }
});

MainClient.singleton.addCmd(new WSCCmd_GameCtrl2());
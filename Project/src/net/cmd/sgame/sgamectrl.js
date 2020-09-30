var WSCCmd_SGameCtrl = WSClientCmd.extend({
    cmdid: CMDID_SGAMECTRL,

    send: function (gameid, sgame, ctrl, param0, callback) {
        var msg = {cmdid: this.cmdid, spinid: MainClient.singleton.curSpinID, gameid: gameid, sgame: sgame, ctrl: ctrl, param0: param0};
        GameMgr.singleton.onSendCmd(msg, callback);

        this.wsc.sendex(msg, function (isok) {
            if (isok) {
            }

            if (callback != undefined) {
                callback(isok);
            }
        });
    }
});

MainClient.singleton.addCmd(new WSCCmd_SGameCtrl());
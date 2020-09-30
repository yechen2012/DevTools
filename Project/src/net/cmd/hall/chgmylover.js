var WSCCmd_ChgMyLover = WSClientCmd.extend({
    cmdid: CMDID_CHGMYLOVER,

    send: function (ctrl, gamecode, tableid, callback) {
        this.wsc.sendex({cmdid: this.cmdid, ctrl: ctrl, gamecode: gamecode, tableid: tableid}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_ChgMyLover());
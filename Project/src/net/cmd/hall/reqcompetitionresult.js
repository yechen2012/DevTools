var WSCCmd_ReqCompetitionResult = WSClientCmd.extend({
    cmdid: CMDID_REQCOMPETITIONRESULT,

    send: function (type, callback) {
        this.wsc.sendex({cmdid: this.cmdid, type: type}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_ReqCompetitionResult());
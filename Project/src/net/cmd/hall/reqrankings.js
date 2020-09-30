var WSCCmd_ReqRankings = WSClientCmd.extend({
    cmdid: CMDID_REQRANKINGS,

    send: function (ranktype, timetype, callback) {
        this.wsc.sendex({cmdid: this.cmdid, ranktype: ranktype, timetype: timetype}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_ReqRankings());
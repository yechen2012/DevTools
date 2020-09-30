var WSCCmd_JoinChampionship = WSClientCmd.extend({
    cmdid: CMDID_JOINCHAMPIONSHIP,

    send: function (callback) {
        this.wsc.sendex({cmdid: this.cmdid}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_JoinChampionship());
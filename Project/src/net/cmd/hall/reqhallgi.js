var WSCCmd_ReqHallGI = WSClientCmd.extend({
    cmdid: CMDID_REQHALLGI,

    send: function (viewlevel, roomname, gamecode, callback) {
        this.wsc.sendex({cmdid: this.cmdid, viewlevel: viewlevel, roomname: roomname, gamecode: gamecode}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_ReqHallGI());
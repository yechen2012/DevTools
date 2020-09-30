var WSCCmd_ReqData = WSClientCmd.extend({
    cmdid: CMDID_REQDATA,

    send: function (datatype, callback) {
        this.wsc.sendex({cmdid: this.cmdid, datatype: datatype}, callback, true);
    }
});

MainClient.singleton.addCmd(new WSCCmd_ReqData());
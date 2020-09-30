var WSCCmd_KeepAlive = WSClientCmd.extend({
    cmdid: CMDID_KEEPALIVE,

    send: function () {
        //NetTime.singleton.onReq();

        this.wsc.sendex({cmdid: this.cmdid}, undefined, false);
    }
});

MainClient.singleton.addCmd(new WSCCmd_KeepAlive());
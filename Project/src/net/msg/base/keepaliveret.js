var WSCMsg_KeepAliveRet = WSClientMsg.extend({
    msgid: MSGID_KEEPALIVERET,

    onMsg: function (msgobj) {
        //NetTime.singleton.onRes();
        //NetTime.singleton.onSync(msgobj.nettime);
        cc.log("msgobj");
    }
});

MainClient.singleton.addMsg(new WSCMsg_KeepAliveRet());
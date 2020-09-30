var WSCMsg_VerInfo = WSClientMsg.extend({
    msgid: MSGID_VERINFO,

    onMsg: function (msgobj) {
        cc.log("msgobj: " + msgobj);

        // msgobj.info
        // msgobj.isok
        // 如果版本可用，isok为true，忽略info即可
        // 如果版本不可用，isok为false，显示info内容，点确定关闭即可
        checkVerInfo = msgobj;
    }
});

MainClient.singleton.addMsg(new WSCMsg_VerInfo());
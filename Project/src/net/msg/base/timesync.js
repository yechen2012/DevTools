var WSCMsg_TimeSync = WSClientMsg.extend({
    msgid: MSGID_TIMESYNC,

    onMsg: function (msgobj) {
        //NoticeLayer.showNotice(msgobj.info);
        // cc.log("msgobj: " + msgobj.info);

        // GameMgr.singleton.onError(0, msgobj.info);
        //UIMgr.singleton.showMsgUI(msgobj.info);

        NetTime.singleton.onRes();
        NetTime.singleton.onSync(msgobj.servtime);
    }
});

MainClient.singleton.addMsg(new WSCMsg_TimeSync());
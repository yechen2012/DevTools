var WSCMsg_RedPoint = WSClientMsg.extend({
    msgid: MSGID_REDPOINT,

    onMsg: function (msgobj) {
        cc.log("小红点",msgobj);
        mailredPoint = msgobj.mailnums;
        if(msgobj.hasdiscount != undefined){
            hasdiscount = msgobj.hasdiscount;
        }
        if(GameMgr.singleton.halllayer){
            GameMgr.singleton.halllayer.setMailPoint();
            GameMgr.singleton.halllayer.setActivityPoint();
        }
    }
});

MainClient.singleton.addMsg(new WSCMsg_RedPoint());
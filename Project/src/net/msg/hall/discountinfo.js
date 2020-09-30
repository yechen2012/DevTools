var WSCMsg_DiscountInfo = WSClientMsg.extend({
    msgid: MSGID_DISCOUNTINFO,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));
        //GameDiscountInfo
        if(GameMgr.singleton.halllayer){
            GameMgr.singleton.halllayer.GameDiscountInfo = msgobj;
            if(GameMgr.singleton.halllayer.activity_layer && GameMgr.singleton.halllayer.activity_layer.isVisible() == true){
                GameMgr.singleton.halllayer.activity_layer.initfordata(GameMgr.singleton.halllayer.GameDiscountInfo);
            }
        }
    }
});

MainClient.singleton.addMsg(new WSCMsg_DiscountInfo());
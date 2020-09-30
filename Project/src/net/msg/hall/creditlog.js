/**
 * Created by zhs007 on 2017/4/12.
 */
var WSCMsg_CreditLog = WSClientMsg.extend({
    msgid: MSGID_CREDITLOG,

    onMsg: function (msgobj) {
        //cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));
        if(GameMgr.singleton.halllayer){
            GameMgr.singleton.halllayer.GameRecordInfo = msgobj;
        }
    }
});

MainClient.singleton.addMsg(new WSCMsg_CreditLog());
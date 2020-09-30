/**
 * Created by chowray on 16/4/8.
 */
var WSCMsg_PayTables = WSClientMsg.extend({
    msgid: MSGID_PAYTABLES,

    onMsg: function (msgobj) {
        //cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));

        //UIMgr.singleton.jsonBet = msgobj.paytables;

    }

});

MainClient.singleton.addMsg(new WSCMsg_PayTables());
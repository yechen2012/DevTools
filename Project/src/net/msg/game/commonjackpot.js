var WSCMsg_CommonJackpot = WSClientMsg.extend({
    msgid: MSGID_COMMONJACKPOT,

    onMsg: function (msgobj) {

        CommonJackpotMgr.singleton.onMsg(msgobj.lstpool, msgobj.lstwin, msgobj.isbussnessopen, msgobj.isgameopen);

    }
});

MainClient.singleton.addMsg(new WSCMsg_CommonJackpot());
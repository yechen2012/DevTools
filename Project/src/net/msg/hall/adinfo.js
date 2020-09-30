/**
 * Created by chowray on 16/4/8.
 */
var WSCMsg_AdInfo = WSClientMsg.extend({
    msgid: MSGID_ADINFO,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));

        // UIMgr.singleton.mainlayer_adid = msgobj.ad;
        // UIMgr.singleton.mainlayer_gameid1 = msgobj.adarr[0];
        // UIMgr.singleton.mainlayer_gameid2 = msgobj.adarr[1];
        // UIMgr.singleton.mainlayer_gameid3 = msgobj.adarr[2];
    }
});

MainClient.singleton.addMsg(new WSCMsg_AdInfo());
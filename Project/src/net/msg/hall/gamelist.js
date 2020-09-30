/**
 * Created by chowray on 16/4/6.
 */
var WSCMsg_GameList = WSClientMsg.extend({
    msgid: MSGID_GAMELIST,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));

        //GameMgr.singleton.setGameList(msgobj.gamelist);
    }
});

MainClient.singleton.addMsg(new WSCMsg_GameList());
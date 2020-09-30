/**
 * Created by chowray on 16/4/5.
 */
var WSCMsg_UserBaseInfo = WSClientMsg.extend({
    msgid: MSGID_USERBASEINFO,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));
        this.inithalldata(msgobj);
        var json_s = msgobj.userbaseinfo;
        var money = json_s.gold;

        GameMgr.singleton.onMyMoney(money);

        GameMgr.singleton.myInfo.uid = msgobj.userbaseinfo.uid;
        GameMgr.singleton.myInfo.spinnums = msgobj.userbaseinfo.spinnums;
        GameMgr.singleton.myInfo.nickname = msgobj.userbaseinfo.nickname;

        if (GameMgr.singleton.lastSpinID > 0 && GameMgr.singleton.lastSpinID < GameMgr.singleton.myInfo.spinnums) {
            GameMgr.singleton.onError(2);
        }

        if (g_isguest) {
            MainClient.singleton.guesttoken = msgobj.token;
        }

        GameMgr.singleton.onUserBaseInfo(msgobj);

        //UserMgr.singleton.my.initWithMsg(msgobj.ub);
        //
        //UserMgr.singleton.my.uid = msgobj.ub.uid;
        //
        //UserMgr.singleton.my.ub = msgobj.ub;

        //PlayerMgr.singleton.initWithMsg(msgobj.userbaseinfo);
    },

    inithalldata: function (msgobj) {
        var json_s = msgobj.userbaseinfo;
        GameMgr.singleton.userbaseinfo = json_s;

        if(typeof(GameAssistant) == 'undefined' || !GameAssistant.singleton.bNative)
            return ;

        if(halltitle){
            halltitle.setHallTitleView();
        }
        //聊天服务器需要用到的token
        g_flblogintoken = json_s.token;
        if(GameMgr.singleton.halllayer && GameMgr.singleton.halllayer.activity_layer && GameMgr.singleton.halllayer.activity_layer.isVisible() == true){
            GameMgr.singleton.halllayer.activity_layer.setActivityItemCoin();
        }
    }
});

MainClient.singleton.addMsg(new WSCMsg_UserBaseInfo());
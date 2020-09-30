var WSCMsg_NoticeMsg = WSClientMsg.extend({
    msgid: MSGID_NOTICEMSG,

    onMsg: function (msgobj) {
        // NoticeLayer.showNotice(msgobj.info);
        //cc.log("msgobj: " + JSON.stringify(msgobj));
        if(isOpenTalkService && isOpenNotice){
            cc.log("使用聊天服务器接受公告信息");
            return;
        }
        //"恭喜玩家#402e1d#HKN5060#f6ff00#在#402e1d#赛亚烈战#ffffff#中下注#402e1d#0.50#ffffff#获得#402e1d#45.21#f6ff00#的奖励#ffffff#"
        //str_name = this.data["toplst"][i].nickname.substring(0, 2) + "****" + this.data["toplst"][i].nickname.substring(this.data["toplst"][i].nickname.length - 2);
        var notice_str = "";
        var strname = msgobj.username.substring(0,2) + "****" + msgobj.username.substring(msgobj.username.length - 2);
        var str1 = "恭喜玩家#402e1d#" + strname + "#f6ff00#在#402e1d#";
        if(isgameeixt(msgobj.gamecode) == false){
            cc.log("通知游戏不存在-->",msgobj.gamecode);
            //return;
        }
        var str2 = GameMgr.singleton.getGameNameFromcode(msgobj.gamecode);
        var str3 = "#ffffff#中";
        var str4 = "";//"#" + (msgobj.bet/100).toFixed(2);
        var str5 = "获得#402e1d";
        var str6 = "#" + (msgobj.win/100).toFixed(2);
        var str7 = "#f6ff00#的奖励#402e1d#";
        notice_str = str1 + str2 + str3 + str4 + str5 + str6 + str7;

        StringMgrSys.NoticeUser = strname;
        StringMgrSys.NoticeGameName = GameMgr.singleton.getGameNameFromcode(msgobj.gamecode);
        StringMgrSys.NoticeReward = (msgobj.win/100).toFixed(2);
        StringMgrSys.NoticeBet = (msgobj.bet/100);
        notice_str = StringMgrSys.getString_str("StringNoticeInfo");

        var _msgobj = {msgid : msgobj.msgid,
            businessid : msgobj.businessid,
            username : msgobj.username,
            type : msgobj.type,
            timeid : msgobj.timeid,
            gamecode : msgobj.gamecode,
            tableid : msgobj.tableid,
            bet : msgobj.bet,
            win : msgobj.win,
            info : notice_str
        };
        DataSys.AddNoticeStr(_msgobj);
        //GameMgr.singleton.halllayer.addNoticeArr(arr);
        // GameMgr.singleton.onError(0, msgobj.info);
        //UIMgr.singleton.showMsgUI(msgobj.info);
    }
});

MainClient.singleton.addMsg(new WSCMsg_NoticeMsg());
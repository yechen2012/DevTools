//需求
//显示各种通知
//奖池中奖通知，比赛开始通知，上线通知，一般性通知。。。
//大厅和游戏内通知用一套代码，资源不一样
//在大厅进游戏时销毁大厅通知，存放消息的arr数据不清空，在游戏里继续显示大厅未显示的通知
//arr支持插入，删除，排序等功能
//通知基本属性：优先级别，循环次数，显示时间，是否是自己
//notice 控制类 CommonNoticeMgr
//notice 实体类 CommonNoticeNode

var CommonNoticeMgr = {
    commonnoticenode : null,
    noticearr : [],
    //首先创建notice界面
    initNoticeNode : function (node,path,hierarchy) {
        if(this.commonnoticenode){
            return;
        }
        if(hierarchy == undefined)
            hierarchy = 0;
        if(this.commonnoticenode == null){
            this.commonnoticenode = new CommonNoticeNode(path);
        }
        this.commonnoticenode.setPosition(640,648);
        if(GameMgr.singleton.halllayer){
            foripad(this.commonnoticenode);
        }
        node.addChild(this.commonnoticenode,hierarchy);
    },

    //收到奖池数据
    addrewardmsg : function (arr) {
        var infolist = arr;
        for(var i in infolist){
            var strname = infolist[i].username.substring(0,2) + "****" + infolist[i].username.substring(infolist[i].username.length - 2);
            StringMgrSys.NoticeUser = strname;
            StringMgrSys.NoticeGameName = GameMgr.singleton.getGameNameFromcode(infolist[i].gameCode);
            StringMgrSys.NoticeReward = (infolist[i].win/100).toFixed(2);
            StringMgrSys.NoticeBet = (infolist[i].bet/100);
            var notice_str = StringMgrSys.getString_str("StringNoticeInfo");

            var _msgobj = {msgid : infolist[i].msgId,
                businessid : "",
                username : infolist[i].username,
                type : infolist[i].type,
                timeid : infolist[i].timeId,
                gamecode : infolist[i].gameCode,
                tableid : "",
                bet : infolist[i].bet,
                win : infolist[i].win,
                info : notice_str
            };
            console.log(_msgobj.type);
            this.analysisdata(_msgobj);
        }

    },

    //收到公告数据
    addnoticemsg : function (msg) {
        var strname = msg.playerName.substring(0,2) + "****" + msg.playerName.substring(msg.playerName.length - 2);
        StringMgrSys.NoticeUser = strname;
        var notice_str = StringMgrSys.getString_str("StringNoticeInfoInGame");
        var _msgobj = {};
        _msgobj.msgid = msg.msgid ? msg.msgid : 0;
        _msgobj.businessid = msg.platformCode ? msg.platformCode : "";
        _msgobj.username = msg.playerName ? msg.playerName : "";
        _msgobj.type = msg.type ? msg.type : 0;
        _msgobj.timeid = msg.timeNow ? msg.timeNow : 0;
        _msgobj.gamecode = msg.gameCode ? msg.gameCode : "";
        _msgobj.tableid = msg.tableid ? msg.tableid : "";
        _msgobj.bet = msg.bet ? msg.bet : 0;
        _msgobj.win = msg.win ? msg.win : 0;
        _msgobj.info = notice_str;
        this.analysisdata(_msgobj);
    },

    //解析数据，存放在数组里
    analysisdata : function (msgobj) {
        if(this.commonnoticenode == null){
            if(GameMgr.singleton.halllayer){
                this.initNoticeNode(cc.director.getRunningScene(),reshall.gamehall_gamehallnoticenode_json,996);
            }else {
                //只在大厅使用
                return;
            }
            if(GameMgr.singleton.curGameLayer){
                this.initNoticeNode(GameMgr.singleton.curGameLayer,reshall.gamehall_gamehallnoticenode_json,996);
            }
        }

        var strarr = [];
        strarr = msgobj.info.split("#");

        var str = [];
        var str1, str2;
        for(var i = 0; i < strarr.length; i++){
            str1 = strarr[i];
            str2 = strarr[i+1];
            var str3 = [str1,str2];
            str.push(str3);
            i++;
        }
        if(this.noticearr.length > 100){
            this.noticearr.splice(0,89);
        }
        var notice_str = [str,msgobj.gamecode,msgobj.tableid,msgobj.type,msgobj.timeid];
        if(msgobj.type == "notice"){
            this.noticearr.splice(1,0,notice_str);
        }else {
            this.noticearr.push(notice_str);
        }
        this.sortnoticearr();
        console.log(this.noticearr.length);

    },

    sortnoticearr : function () {
        this.noticearr.sort(function (x,y) {
            return x[3] - y[3];
        });
        //根据时间排序，暂时不用
        //
        // var arr1 = [];
        // var arr2 = [];
        // for(var i = 0; i < this.noticearr.length; i++){
        //     if(this.noticearr[i][3] == 1){
        //         arr1.push(this.noticearr[i])
        //     }
        //     if(this.noticearr[i][3] == 2){
        //         arr2.push(this.noticearr[i])
        //     }
        // }
        // arr1.sort(function (x,y) {
        //     return x[4] - y[4];
        // });
        // arr2.sort(function (x,y) {
        //     return x[4] - y[4];
        // });
        // console.log(this.noticearr.length);
        // this.noticearr = [];
        // for(var i = 0; i < arr1.length; i++){
        //     this.noticearr.push(arr1[i]);
        // }
        // for(var i = 0; i < arr2.length; i++){
        //     this.noticearr.push(arr2[i]);
        // }
        // console.log(this.noticearr.length);
    },

    //清理公告
    clearcommonnotice : function () {
        if(this.commonnoticenode){
            this.commonnoticenode.clearnotice();
            this.commonnoticenode.removeFromParent(true);
            this.commonnoticenode = null;
        }
    },



};

var CommonNoticeNode = cc.Layer.extend({
    notice : null,
    notice_str : null,
    notice_join_btn : null,
    notice_gamecode : "",
    notice_tableid : "",
    notice_act_running : false,
    richText : null,
    noticetimer : null,
    notice_act_interval : null,
    ctor : function (path) {
        this._super();
        var size = cc.winSize;
        var layer = ccs.load(path);
        this.addChild(layer.node);
        this.init(layer.node);
        return layer.node;
    },

    init : function (node) {
        this.notice = findChildByName(node, "notice");
        this.notice_str = findChildByName(node, "notice_str");
        this.notice_join_btn = findChildByName(node, "notice_join_btn");
        this.notice.setVisible(false);
        this.notice_str.setVisible(false);
        this.notice_join_btn.setVisible(false);
        this.notice_join_btn.addTouchEventListener(this.on_notice_join, this);
        this.notice_str.setString("这是游戏的通知：2017年4月18日起，注册并登录游戏赠送1000000000000000金币（通知测试）");
        this.startnoticetimer();
    },

    //加入游戏
    on_notice_join: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;
        CurGameCode = this.notice_gamecode;
        CurGameTable = "";
        var gamename = gamelistinfo[CurGameCode][1];
        var manager = UpdateManager.create().getUpdateManager(gamename);
        if(manager) return;
        GameMgr.singleton.halllayer.game_slecet();

        cc.log("notice_join");
    },

    //启动定时器
    startnoticetimer : function () {
        var self = this;
        this.noticetimer = setInterval(function () {
            //检查NoticeArr是否有值
            //cc.log("gong gao de chang du",DataSys.DataSysNoticeArr.length);
            if(CommonNoticeMgr.noticearr.length>0){
                if(self.notice_act_running)
                    return;
                if(CommonNoticeMgr.noticearr[0][1] && isgameeixt(CommonNoticeMgr.noticearr[0][1]) == true){
                    self.notice_join_btn.setVisible(true);
                    self.notice_gamecode = CommonNoticeMgr.noticearr[0][1];
                    self.notice_tableid = CommonNoticeMgr.noticearr[0][2];
                }else {
                    self.notice_join_btn.setVisible(false);
                }
                //if(that.notice)
                //    that.notice.setVisible(true);
                self.notice_act_running = true;
                self.setNoticeStr(CommonNoticeMgr.noticearr[0][0]);
                var speed = 1;
                var times = 1;
                //有人上线了，速度快一些
                if(CommonNoticeMgr.noticearr[0][3] == 1){
                    speed = 4;
                    times = 3;
                }
                //奖池中奖信息，正常速度
                if(CommonNoticeMgr.noticearr[0][3] == 2){
                    speed = 5;
                    times = 1;
                }
                self.notice_act(speed,times);
                CommonNoticeMgr.noticearr.splice(0,1);
            }else {
                if(self.notice_act_running == false){
                    CommonNoticeMgr.clearcommonnotice();
                }
            }
        },1000);
    },

    setNoticeStr : function (content) {
        this.richText = new ccui.RichText();
        this.richText.setAnchorPoint(cc.p(0,0.5));
        var reText = "";
        for (var nIndex = 0; nIndex < content.length; nIndex++) {
            var index_str = 0;
            index_str = content[nIndex][0].indexOf(".png");
            if(index_str > 0){
                reText = new ccui.RichElementImage(nIndex,cc.color.WHITE, 255, content[nIndex][0]);
                // reText.setContentSize(20,20);
                this.richText.pushBackElement(reText);
            }else {
                reText = new ccui.RichElementText(nIndex, cc.hexToColor("#" + content[nIndex][1]), 255, content[nIndex][0], this.notice_str.getFontName(), this.notice_str.getFontSize());
                this.richText.pushBackElement(reText);
            }

        }
        this.richText.x = -this.notice.width/2;
        this.richText.y = this.notice_str.y;
        this.richText.ignoreContentAdaptWithSize(true);
        this.richText.formatText();
        this.notice_str.getParent().addChild(this.richText);
    },

    notice_act : function(speed/*1*/,times){

        if(!speed){
            speed = 1;
        }
        if(!times){
            times = 1;
        }
        var self = this;
        var po = 0;
        po = this.richText.width;
        var distance = 0;
        if(cc.sys.isNative){
            distance = 0;
        }else {
            distance = distance + po/2;
        }
        this.richText.x = this.notice_str.getParent().width - distance;
        var moveby = new cc.moveBy(0.01,cc.p(-1*speed,0));
        var forever_act = new cc.RepeatForever(moveby);

        self.richText.runAction(forever_act);

        this.notice_act_interval = setInterval(function(){
            if(self.richText && self.notice_act_running == true){
                if(self.notice)
                    self.notice.setVisible(true);
                if(self.richText.x < -po - distance){
                    times--;
                    if(times > 0){
                        self.richText.x = self.notice_str.getParent().width - distance;
                    }else {
                        // DataSys.DataSysNoticeArr.splice(0,1);
                        clearInterval(self.notice_act_interval);
                        self.notice_act_interval = null;
                        self.richText.stopAction(forever_act);
                        self.richText.removeFromParent(true);
                        self.richText = null;
                        self.notice_join_btn.setVisible(false);
                        self.notice_act_running = false;
                    }
                }
            }else {
                clearInterval(self.notice_act_interval);
                self.notice_act_interval = null;
                self.notice_act_running = false;
            }

        },10);
    },

    //清理
    clearnotice : function () {
        if(this.notice_act_interval){
            clearInterval(this.notice_act_interval);
            this.notice_act_interval = null;
        }
        if(this.noticetimer){
            clearInterval(this.noticetimer);
            this.noticetimer = null;
        }
        if(this.richText){
            this.richText.stopAllActions();
            this.richText.removeFromParent(true);
            this.richText = null;
        }
        this.notice_gamecode = "";
        this.notice_tableid = "";
        this.notice_act_running = false;
    }

});


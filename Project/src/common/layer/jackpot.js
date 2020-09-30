// var CLIENT_LANGUAGE;
// if (CLIENT_LANGUAGE == undefined) {
//     CLIENT_LANGUAGE = 'zh_CN';
// }

var CommonGameName = {
    "sd":{"gamecode":"sd","name_chs":"灌篮大师","name_eng":"灌篮大师","name_jp":"灌篮大师"},
    "kof":{"gamecode":"kof","name_chs":"格斗之魂","name_eng":"格斗之魂","name_jp":"格斗之魂"},
    "sd5":{"gamecode":"sd5","name_chs":"灌篮大师2","name_eng":"灌篮大师3","name_jp":"灌篮大师4"},
    "naruto":{"gamecode":"naruto","name_chs":"NINJA","name_eng":"NINJA","name_jp":"NINJA"},
    "onepiece":{"gamecode":"onepiece","name_chs":"海盗无双","name_eng":"海盗无双","name_jp":"海盗无双"},
    "dragonball":{"gamecode":"dragonball","name_chs":"赛亚烈战","name_eng":"赛亚烈战","name_jp":"赛亚烈战"},
    "san":{"gamecode":"san","name_chs":"赤壁之战","name_eng":"赤壁之战","name_jp":"赤壁之战"},
    "seiya":{"gamecode":"seiya","name_chs":"圣域传说","name_eng":"圣域传说","name_jp":"圣域传说"},
    "tgow":{"gamecode":"tgow","name_chs":"财神到","name_eng":"财神到","name_jp":"财神到"},
    "watermargin":{"gamecode":"watermargin","name_chs":"武松传","name_eng":"武松传","name_jp":"武松传"},
    "newyear":{"gamecode":"newyear","name_chs":"新年到","name_eng":"新年到","name_jp":"新年到"},
    "tlod":{"gamecode":"tlod","name_chs":"封神榜","name_eng":"封神榜","name_jp":"封神榜"},
    "jtw":{"gamecode":"jtw","name_chs":"西游降妖","name_eng":"西游降妖","name_jp":"西游降妖"},
    "whitesnake":{"gamecode":"whitesnake","name_chs":"白蛇传","name_eng":"白蛇传","name_jp":"白蛇传"},
    "dnp":{"gamecode":"dnp","name_chs":"龙凤呈祥","name_eng":"龙凤呈祥","name_jp":"龙凤呈祥"},
    "crystal":{"gamecode":"crystal","name_chs":"123","name_eng":"英雄荣耀","name_jp":"英雄荣耀"},
    "fls":{"gamecode":"fls","name_chs":"福禄寿","name_eng":"福禄寿","name_jp":"福禄寿"},
    "fourss":{"gamecode":"fourss","name_chs":"四圣兽","name_eng":"四圣兽","name_jp":"四圣兽"},
    "casino":{"gamecode":"casino","name_chs":"3D老虎机","name_eng":"4D老虎机","name_jp":"5D老虎机"},
    "football":{"gamecode":"football","name_chs":"传奇之路","name_eng":"传奇之路","name_jp":"传奇之路"},
    "rocknight":{"gamecode":"rocknight","name_chs":"摇滚之夜","name_eng":"摇滚之夜","name_jp":"摇滚之夜"},
    "dash":{"gamecode":"dash","name_chs":"四驱英雄","name_eng":"四驱英雄","name_jp":"四驱英雄"},
    "bluesea":{"gamecode":"bluesea","name_chs":"深蓝海域","name_eng":"深蓝海域","name_jp":"深蓝海域"},
    "circus":{"gamecode":"circus","name_chs":"疯狂马戏团","name_eng":"疯狂马戏团","name_jp":"疯狂马戏团"}
};

var CommonJackpotLayer = cc.Layer.extend({
    sprite:null,
    ctor:function (pos) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var gamelayer = ccs.load(res.CommonJackpotLayer_json);
        this.addChild(gamelayer.node);
        this.GameLayer = gamelayer;

        //! 列表
        this.lstlistanitime = [[0,5],[10,17],[25,30],[35,42]];
        this.lstlistshow = [false, true, true, true];

        this.nodeJackpot = findNodeByName(gamelayer.node, "nodeJackpot");
        this.nodeList = findNodeByName(gamelayer.node, "nodeList");
        this.layList = ccs.load(res.CommonJackpotList_json);
        this.nodeList.addChild(this.layList.node);
        this.layList.node.runAction(this.layList.action);

        this.lstTextJackpotNums = [];

        for(var ii = 0; ii < 4; ++ii) {
            var ntext = findNodeByName(this.layList.node, "textJackpotNums" + (ii + 1));
            ntext.setString('0.00');
            this.lstTextJackpotNums.push(ntext);
        }

        this.btnList = findNodeByName(gamelayer.node, "btnList");
        this.btnList.addTouchEventListener(this.onTouchJackpotList, this);

        this.btnList1 = findNodeByName(gamelayer.node, "btnList1");
        this.btnList1.addTouchEventListener(this.onTouchJackpotList, this);

        this.iJackpotListState = -1;     //! 状态：0不显示 1出现 2显示 3消失
        //this.setListState(0);

        //this.lstjackpotmin = [10000000,3000000,200000,30000];
        this.lstjackpotmin = [9980000,2970000,260000,20000];
        this.lstjackpotadd = [50/2,80/2,120/2,175/2];
        this.jackpottimesp = 360 + 10;
        //this.lstjackpottimesp = [1/4,1/6,1/8,1/10];
        this.lstjackpottimesp = [1/15,1/15,1/15,1/15];

        this.lstLastJackpotNums = [-1,-1,-1,-1];
        this.lstCurJackpotNums = [-1,-1,-1,-1];
        this.lstJackpotNumsSP = [1,1,1,1];
        this.iJackpotNumsTime = [0,0,0,0];
        this.iJackpotRefreshTime = 0;

        //! 公告
        this.lstnoticeaniname = ['jigg1','jigg1','jlgg2','jlgg3','jlgg4'];
        this.lstnoticeanishow = [false,true,true,true,true];
        this.lstnoticeaniloop = [0,1,0,1,0];

        this.nodeNotice = findNodeByName(gamelayer.node, "nodeNotice");
        this.nodeNoticeAni = findNodeByName(gamelayer.node, "nodeNoticeAni");
        this.layNoticeAni = ccs.load(res.CommonJackpotNoticeAni_json);
        this.nodeNoticeAni.addChild(this.layNoticeAni.node);
        this.aniNoticeAni = findNodeByName(this.layNoticeAni.node, "ctrlani");
        this.aniNoticeAni.setVisible(false);
        this.textNotice = findNodeByName(this.layNoticeAni.node, "textNotice");
        this.textNotice.setVisible(false);

        this.richNotice = new ccui.RichText();
        //this.richNotice.setContentSize(cc.size(1280, 30));
        this.textNotice.addChild(this.richNotice);
        this.lstRichElemmentNums = 0;
        this.iCurNoticeX = 0;
        this.iEndNoticeX = 0;
        this.iNoticeSpeed = 80;
        //this.iNoticeTime = 0;

        this.btnNotice = findNodeByName(gamelayer.node, "btnNotice");
        this.btnNotice.addTouchEventListener(this.onTouchJackpotNotice, this);

        this.objShowNotice = undefined;
        this.iShowNoticeID = -1;
        this.iSelfNoticeID = -1;
        this.iShowNoticeTime = 0;
        this.iWaitNoticeTime = -1;

        //richText.ignoreContentAdaptWithSize(false);
        //richText.setContentSize(cc.size(1280, 30));
        // var re1 = new ccui.RichElementText(1, cc.color.WHITE, 255, "This color is white. ", "Helvetica", 24);
        // richText.pushBackElement(re1);
        // richText.setPosition(0,0);

        this.iNoticeState = -1;     //! 状态：0没有消息 1有未读 2弹出 3显示中 4消失

        this.lstWinAniName = ["jackpot1", "jackpot2", "jackpot3"];
        this.lstWinAniFrame = [[0,37], [40,80], [85,103]];
        this.lstWinAniChgNum = [333333,100000,10000,3000];

        this.nodeJackpotAni = findNodeByName(gamelayer.node, "nodeJackpotAni");
        this.WinAni = undefined;
        this.WinAniState = 0;       //! 0出现 1变化 2关闭
        this.WinAniAllNums = 0;
        this.WinAniType = 0;
        this.WinAniShowNums = 0;
        this.WinAniChgTime = 0;
        this.WinAniSPTime = 0;
        this.WinAniAllTime = 0;
        this.WinAniCtrlAni = undefined;
        this.WinAniTextNums = undefined;
        this.WinAniBtnOK = undefined;
        this.WinAniSprTime = undefined;
        this.WinAniTextTime = undefined;

        //! 转盘游戏
        this.lstGameRotate = [[252],[288,324],[360,36,72],[108,144,180,216]];
        //this.lstGameLayerFrame = [[0,18],[20,25],[30,42]];
        this.lstturntablendname = ['zhuanpan08', 'zhuanpan09', 'zhuanpan10', 'zhuanpan11'];
        this.lstturntablwinname = ['zhuanpan12', 'zhuanpan13', 'zhuanpan14', 'zhuanpan15'];
        this.lstturntablsound = [res.CommonJackpotFly1_mp3, res.CommonJackpotFly2_mp3, res.CommonJackpotFly3_mp3, res.CommonJackpotFly4_mp3, ];

        this.nodeJackpotGame = findNodeByName(gamelayer.node, "nodeJackpotGame");
        this.layGame = ccs.load(res.CommonJackpotGame_json);
        this.nodeJackpotGame.addChild(this.layGame.node);
        this.layGame.node.setVisible(false);
        this.layGame.node.runAction(this.layGame.action);

        this.lstTextGameNums = [];

        for(var ii = 0; ii < 4; ++ii) {
            var ntext = findNodeByName(this.layGame.node, "textJpNums" + (ii + 1));
            ntext.setString('0.00');
            this.lstTextGameNums.push(ntext);
        }

        this.btnRun = findNodeByName(this.layGame.node, "btnRun");
        this.btnRun.addTouchEventListener(this.onTouchRun, this);

        this.sprTurntable = findNodeByName(this.layGame.node, "sprTurntable");
        this.aniTurntable1 = findNodeByName(this.layGame.node, "aniTurntable1");
        this.aniTurntable1.setVisible(false);
        this.aniTurntable2 = findNodeByName(this.layGame.node, "aniTurntable2");
        this.aniTurntable2.setVisible(false);
        this.aniBegin = findNodeByName(this.layGame.node, "aniBegin");
        this.aniTurntableEnd = findNodeByName(this.layGame.node, "aniTurntableEnd");
        this.aniTurntableEnd.setVisible(false);
        this.iAniShowTime = -1;

        this.lstGameLight = [];

        for(var ii = 0; ii < 4; ++ii) {
            var lst = [];

            for(var jj = 0; jj < 3; ++jj) {
                var sprlight = findNodeByName(this.layGame.node, "sprLight" + (ii + 1).toString() + (jj + 1).toString());
                lst.push(sprlight);
            }

            this.lstGameLight.push(lst);
        }

        this.iGameState = 0;        //! 0未显示 1等待开转 2正在转 3转结束
        this.iGameTime = 0;
        this.iGameStop = -1;
        this.iGameSpeed = 60;
        this.iGameAwardType = -1;
        this.iGameAwardNums = -1;
        this.iSoundRotation = 0;

        if(pos) {
            this.nodeJackpot.setPosition(pos[0],pos[1]);
            this.nodeNotice.setPosition(pos[2],pos[3]);
        }
        else {
            this.nodeJackpot.setPosition(0,0);
            this.nodeNotice.setPosition(0,20);
        }

        this.scheduleUpdate();
        this.restoreUserSetup();

        this.nodeNotice.setVisible(false);
        this.nodeJackpot.setVisible(false);
        this.nodeJackpotAni.setVisible(false);
        this.nodeJackpotGame.setVisible(false);
        //this.setVisible(CommonJackpotMgr.singleton.bShowJackpot);

        this.bUpdate = false;
        this.bShowGame = false;

        this.setVisible(false);

        return true;
    },

    onTouchJackpotList : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.iJackpotListState == 0) {
            this.setListState(1);
            this.setUserSetup("commonjackpot", 1);
            this.btnList.setVisible(false);
            this.btnList1.setVisible(true);
        }
        else if(this.iJackpotListState == 2) {
            this.setListState(3);
            this.setUserSetup("commonjackpot", 0);
            this.btnList.setVisible(true);
            this.btnList1.setVisible(false);
        }
    },

    setListState : function (state) {
        this.iJackpotListState = state;

        this.layList.action.gotoFrameAndPlay(this.lstlistanitime[state][0], this.lstlistanitime[state][1], false);
        this.layList.node.setVisible(this.lstlistshow[state]);
    },

    update_List : function (dt) {
        if(this.iJackpotListState == 1) {
            if(this.layList.action.getCurrentFrame() == this.lstlistanitime[this.iJackpotListState ][1])
                this.setListState(2);
        }
        else if(this.iJackpotListState == 3) {
            if(this.layList.action.getCurrentFrame() == this.lstlistanitime[this.iJackpotListState ][1])
                this.setListState(0);
        }

        this.refreshJackpotNums();

        for(var ii = 0; ii < this.lstTextJackpotNums.length; ++ii) {
            if(this.lstLastJackpotNums[ii] < 0)
                continue ;

            if(this.lstCurJackpotNums[ii] < this.lstLastJackpotNums[ii]) {
                this.lstCurJackpotNums[ii] += this.lstJackpotNumsSP[ii] * dt;

                if(this.lstCurJackpotNums[ii] > this.lstLastJackpotNums[ii])
                    this.lstCurJackpotNums[ii] = this.lstLastJackpotNums[ii];
            }

            // var jnums = Math.floor(this.lstCurJackpotNums[ii]);
            //
            // this.lstTextJackpotNums[ii].setString(this.chgString_Gray1(jnums, 20));
        }

        this.iJackpotRefreshTime += dt;

        if(this.iJackpotRefreshTime < 0.1)
            return ;
        else
            this.iJackpotRefreshTime = 0;

        for(var ii = 0; ii < this.lstTextJackpotNums.length; ++ii) {
            // this.iJackpotNumsTime[ii] += dt;
            //
            // if(this.iJackpotNumsTime[ii] > this.lstjackpottimesp[ii]) {
            //     this.iJackpotNumsTime[ii] -= this.lstjackpottimesp[ii];
            //
            //     var jnums = Math.floor(this.lstCurJackpotNums[ii]);
            //
            //     if(this.WinAni != undefined && ii == this.WinAniType) {
            //         jnums = this.WinAniAllNums;
            //     }
            //
            //     if(GameMgr.singleton.bJackpotWin && ii == GameMgr.singleton.iJackpotType) {
            //         jnums = GameMgr.singleton.iJackpotNums;
            //     }
            //
            //     if(this.iGameAwardType >= 0 && ii == this.iGameAwardType) {
            //         jnums = this.iGameAwardNums;
            //     }
            //
            //     var str = this.chgString_Gray1(jnums, 20);
            //
            //     this.lstTextJackpotNums[ii].setString(str);
            //     this.lstTextGameNums[ii].setString(str);
            // }

            var jnums = Math.floor(this.lstCurJackpotNums[ii]);

            if(this.WinAni != undefined && ii == this.WinAniType) {
                jnums = this.WinAniAllNums;
            }

            if(GameMgr.singleton.bJackpotWin && ii == GameMgr.singleton.iJackpotType) {
                jnums = GameMgr.singleton.iJackpotNums;
            }

            if(this.iGameAwardType >= 0 && ii == this.iGameAwardType) {
                jnums = this.iGameAwardNums;
            }

            var str = "";

            if(jnums >= 0)
                str = this.chgString_Gray1(jnums, 20);

            this.lstTextJackpotNums[ii].setString(str);
            this.lstTextGameNums[ii].setString(str);
        }
    },

    refreshJackpotNums : function () {
        if(CommonJackpotMgr.singleton.lstPool == undefined || CommonJackpotMgr.singleton.lstPool.length < 4)
            return ;

        for(var ii = 0; ii < this.lstLastJackpotNums.length; ++ii) {
            //this.lstLastJackpotNums[ii] = CommonJackpotMgr.singleton.lstPool[ii];

            if(this.lstLastJackpotNums[ii] == CommonJackpotMgr.singleton.lstPool[ii])
                continue ;

            var pnums = CommonJackpotMgr.singleton.lstPool[ii];

            if(this.lstLastJackpotNums[ii] < 0 || pnums < this.lstLastJackpotNums[ii]) {
                this.lstCurJackpotNums[ii] = pnums - this.lstjackpotadd[ii] * this.jackpottimesp;
                this.lstJackpotNumsSP[ii] = this.lstjackpotadd[ii];

                if(this.lstCurJackpotNums[ii] < this.lstjackpotmin[ii]) {
                    this.lstCurJackpotNums[ii] = this.lstjackpotmin[ii];
                    this.lstJackpotNumsSP[ii] = (pnums - this.lstjackpotmin[ii]) / this.jackpottimesp;
                }

                if(this.lstJackpotNumsSP[ii] < 1)
                    this.lstJackpotNumsSP[ii] = 1;

                if(this.lstCurJackpotNums[ii] > pnums)
                    this.lstCurJackpotNums[ii] = pnums;
            }
            else {
                this.lstJackpotNumsSP[ii] = (pnums - this.lstCurJackpotNums[ii]) / this.jackpottimesp;

                if(this.lstJackpotNumsSP[ii] < 1)
                    this.lstJackpotNumsSP[ii] = 1;
            }

            this.lstLastJackpotNums[ii] = pnums;
        }
    },

    onTouchJackpotNotice : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.iNoticeState > 1)
            return ;

        if(!this.hasSelfNotice()) {
            this.setNoticeState(0);
            return ;
        }

        this.iWaitNoticeTime = -1;
        this.setNoticeState(2);

        this.objShowNotice = this.getSelfNotice(this.iSelfNoticeID);
        this.iSelfNoticeID = this.objShowNotice.id;
        this.objShowNotice.bselfshow = true;

        this.refreshNoticeText();
        //this.iShowNoticeTime = 5;

        // if(this.iJackpotListState == 1) {
        //     this.setListState(1);
        //     this.setUserSetup("commonjackpot", 1);
        // }
        // else if(this.iJackpotListState == 2) {
        //     this.setListState(3);
        //     this.setUserSetup("commonjackpot", 0);
        // }
    },

    canTouchRun : function () {
        if(!this.btnRun.isVisible() || !this.btnRun.isEnabled())
            return false;

        return this.iGameState == 1;
    },

    onTouchRun : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        // //! 测试
        // this.showGame(false);
        // GameMgr.singleton.closeJackpotGame();
        // return ;

        cc.audioEngine.playEffect(res.CommonJackpotRun_mp3, false);
        this.setGameState(2);
        this.iGameTime = 2;

        var callback=function (isok) {}
        GamelogicMgr.instance.callRegistered("gameCtrl2",GameMgr.singleton.getCurGameID(), 'commonjackpot', {},callback);
    },

    update_Notice : function (dt) {
        if(this.iNoticeState < 0) {
            if(CommonJackpotMgr.singleton.lstWin != undefined && CommonJackpotMgr.singleton.lstWin.length > 0) {
                for(var ii = 0; ii < CommonJackpotMgr.singleton.lstWin.length; ++ii) {
                    CommonJackpotMgr.singleton.lstWin[ii].curnums = 1;
                }
            }

            this.setNoticeState(0);
            this.iWaitNoticeTime = 1;
        }
        
        if(this.iNoticeState == 2) {
            if(this.aniNoticeAni.animation.getCurrentMovementID() == "")
                this.setNoticeState(3);
        }
        else if(this.iNoticeState == 4) {
            //! 需要判断是否还有自己中奖的
            if(!this.hasSelfNotice())
                this.setNoticeState(0);
            else
                this.setNoticeState(1);

            if(this.hasNewNotice()) {
                this.iWaitNoticeTime = 1;
            }
            else {
                this.iWaitNoticeTime = 120;
            }
        }
        else if(this.iNoticeState == 3) {
            this.iShowNoticeTime -= dt;
            this.iCurNoticeX -= this.iNoticeSpeed * dt;
            this.textNotice.setPositionX(this.iCurNoticeX);

            if(this.iShowNoticeTime <= 0) {
                this.iShowNoticeTime = 0;
                this.textNotice.setPositionX(this.iEndNoticeX);
                this.setNoticeState(4);
            }
        }
        else if(this.iNoticeState == 0) {
            if(this.hasSelfNotice())
                this.setNoticeState(1);
        }
        else if(this.iNoticeState == 1) {
            if(!this.hasSelfNotice())
                this.setNoticeState(0);
        }

        if(this.iWaitNoticeTime >= 0) {
            this.iWaitNoticeTime -= dt;

            if(this.hasNewNotice() && this.iWaitNoticeTime > 1)
                this.iWaitNoticeTime = 1;

            if(this.iWaitNoticeTime <= 0) {
                if(GameMgr.singleton.isPauseGame() || GameMgr.singleton.bJackpotWin)
                    this.iWaitNoticeTime = 1;
            }

            if(this.iWaitNoticeTime <= 0) {
                this.objShowNotice = this.getNewNotice(this.iShowNoticeID);

                if(this.objShowNotice == undefined) {
                    this.iWaitNoticeTime = 1;
                }
                else {
                    this.iWaitNoticeTime = -1;
                    this.setNoticeState(2);

                    this.iShowNoticeID = this.objShowNotice.id;
                    ++this.objShowNotice.curnums;

                    this.refreshNoticeText();
                    //this.iShowNoticeTime = 5
                };
            }
        }
    },

    refreshNoticeText : function () {
        // var re1 = new ccui.RichElementText(1, cc.color.WHITE, 255, "This color is white. ", "Helvetica", 24);
        // richText.pushBackElement(re1);
        // richText.setPosition(0,0);

        for(var ii = 0; ii < this.lstRichElemmentNums; ++ii) {
            this.richNotice.removeElement(0);
        }

        this.lstRichElemmentNums = 0;

        if(this.objShowNotice == undefined)
            return ;

        StringMgrSys.NoticeUser = this.objShowNotice.playerName;
        StringMgrSys.NoticeGameName = this.getGameName(this.objShowNotice.gameCode);
        StringMgrSys.NoticeReward = (this.objShowNotice.win / 100).toString();
        StringMgrSys.NoticeBet = (this.objShowNotice.bet / 100).toString();
        StringMgrSys.NoticeTime = this.objShowNotice.createTime;
        //StringMgrSys.NoticeImage = reshall.testimage_png;

        var level = -1;

        if(this.objShowNotice.jpl)
            level = this.objShowNotice.jpl;

        if(res['CommonJackpotNoticeIcon' + (level + 1) + '_png'])
            StringMgrSys.NoticeImage = res['CommonJackpotNoticeIcon' + (level + 1) + '_png'];
        else
            StringMgrSys.NoticeImage = '';

        //StringMgrSys.setRichTextFont('Microsoft YaHei', 24);

        switch(CLIENT_LANGUAGE) {
            case 'zh_CN':
                //this.addNoticeText_chs();
                StringMgrSys.setRichTextFont('Microsoft YaHei', 24);
                break;
            case 'en_US':
                //this.addNoticeText_eng();
                StringMgrSys.setRichTextFont('Arial', 24);
                break;
            case 'ja_JP':
                //this.addNoticeText_jp();
                StringMgrSys.setRichTextFont('Meiryo', 20);
                break;
            default :
                //this.addNoticeText_chs();
                StringMgrSys.setRichTextFont('Microsoft YaHei', 24);
                break;
        }

        if(this.objShowNotice.isme)
            this.lstRichElemmentNums = StringMgrSys.setRichText(this.richNotice, 'StringNoticeInfo2');
        else
            this.lstRichElemmentNums = StringMgrSys.setRichText(this.richNotice, 'StringNoticeInfo1');

        var nsize = this.richNotice.getContentSize();

        this.iCurNoticeX = 1280 + nsize.width / 2;
        this.iEndNoticeX = -nsize.width / 2;
        this.iShowNoticeTime = (this.iCurNoticeX - this.iEndNoticeX) / this.iNoticeSpeed;
        this.textNotice.setPositionX(this.iCurNoticeX);

        // this.iShowNoticeTime = 10;
        // this.textNotice.setPositionX(640);
    },

    getGameName : function (gamecode) {
        return GameMgr.singleton.getGameNameFromcode(gamecode);
        // if(CommonGameName[gamecode] == undefined)
        //     return 'unknown';
        //
        // if(CommonGameName[gamecode]['name_' + CLIENT_LANGUAGE] != undefined)
        //     return CommonGameName[gamecode]['name_' + CLIENT_LANGUAGE];
        //
        // return 'unknown';
    },

    addNoticeText_chs : function () {
        var colorb = {r:95, g:184, b:235};      // #5fb8eb#
        var colorb1 = {r:0, g:255, b:246};      // #00fff6#
        var colory = {r:246, g:255, b:0};       // #f6ff00#

        var re1 = new ccui.RichElementText(0, colorb, 255, "恭喜", "Microsoft YaHei", 24);
        this.richNotice.pushBackElement(re1);
        ++this.lstRichElemmentNums;

        if(this.objShowNotice.isme) {
            var re2 = new ccui.RichElementText(0, colory, 255, "您", "Microsoft YaHei", 24);
            this.richNotice.pushBackElement(re2);
            ++this.lstRichElemmentNums;
        }
        else {
            var re2 = new ccui.RichElementText(0, colory, 255, this.objShowNotice.playerName, "Microsoft YaHei", 24);
            this.richNotice.pushBackElement(re2);
            ++this.lstRichElemmentNums;
        }

        var re3 = new ccui.RichElementText(0, colorb, 255, "在", "Microsoft YaHei", 24);
        this.richNotice.pushBackElement(re3);
        ++this.lstRichElemmentNums;

        var re4 = new ccui.RichElementText(0, colorb1, 255, this.getGameName(this.objShowNotice.gameCode), "Microsoft YaHei", 24);
        this.richNotice.pushBackElement(re4);
        ++this.lstRichElemmentNums;

        var re5 = new ccui.RichElementText(0, colorb, 255, "中，投注", "Microsoft YaHei", 24);
        this.richNotice.pushBackElement(re5);
        ++this.lstRichElemmentNums;

        var re6 = new ccui.RichElementText(0, colory, 255, (this.objShowNotice.bet / 100).toString(), "Microsoft YaHei", 24);
        this.richNotice.pushBackElement(re6);
        ++this.lstRichElemmentNums;

        var re7 = new ccui.RichElementText(0, colorb, 255, "赢得", "Microsoft YaHei", 24);
        this.richNotice.pushBackElement(re7);
        ++this.lstRichElemmentNums;

        var re8 = new ccui.RichElementText(0, colory, 255, (this.objShowNotice.win / 100).toString(), "Microsoft YaHei", 24);
        this.richNotice.pushBackElement(re8);
        ++this.lstRichElemmentNums;

        //var re9 = new ccui.RichElementText(0, colory, 255, "元！", "Microsoft YaHei", 24);
        var re9 = new ccui.RichElementText(0, colorb, 255, "公共奖池奖金。", "Microsoft YaHei", 24);
        this.richNotice.pushBackElement(re9);
        ++this.lstRichElemmentNums;

        var re12 = new ccui.RichElementText(0, colorb, 255, "（", "Microsoft YaHei", 16);
        this.richNotice.pushBackElement(re12);
        ++this.lstRichElemmentNums;

        var re4 = new ccui.RichElementText(0, colorb, 255, this.objShowNotice.createTime, "Microsoft YaHei", 16);
        this.richNotice.pushBackElement(re4);
        ++this.lstRichElemmentNums;

        var re13 = new ccui.RichElementText(0, colorb, 255, "）", "Microsoft YaHei", 16);
        this.richNotice.pushBackElement(re13);
        ++this.lstRichElemmentNums;
    },

    addNoticeText_eng : function () {
        var colorb = {r:95, g:184, b:235};
        var colorb1 = {r:0, g:255, b:246};
        var colory = {r:246, g:255, b:0};

        if(this.objShowNotice.isme) {
            var re1 = new ccui.RichElementText(0, colorb, 255, "Congratulations! ", "Arial", 24);
            this.richNotice.pushBackElement(re1);
            ++this.lstRichElemmentNums;

            var re2 = new ccui.RichElementText(0, colory, 255, "You ", "Arial", 24);
            this.richNotice.pushBackElement(re2);
            ++this.lstRichElemmentNums;

            var re3 = new ccui.RichElementText(0, colorb, 255, "have won $", "Arial", 24);
            this.richNotice.pushBackElement(re3);
            ++this.lstRichElemmentNums;

            var re4 = new ccui.RichElementText(0, colory, 255, (this.objShowNotice.win / 100).toString(), "Arial", 24);
            this.richNotice.pushBackElement(re4);
            ++this.lstRichElemmentNums;

            var re5 = new ccui.RichElementText(0, colorb, 255, " on your $", "Arial", 24);
            this.richNotice.pushBackElement(re5);
            ++this.lstRichElemmentNums;

            var re6 = new ccui.RichElementText(0, colorb1, 255, (this.objShowNotice.bet / 100).toString(), "Arial", 24);
            this.richNotice.pushBackElement(re6);
            ++this.lstRichElemmentNums;

            var re7 = new ccui.RichElementText(0, colorb, 255, " ", "Arial", 24);
            this.richNotice.pushBackElement(re7);
            ++this.lstRichElemmentNums;

            var re8 = new ccui.RichElementText(0, colorb1, 255, this.getGameName(this.objShowNotice.gameCode), "Arial", 24);
            this.richNotice.pushBackElement(re8);
            ++this.lstRichElemmentNums;

            var re9 = new ccui.RichElementText(0, colorb, 255, " wager.", "Arial", 24);
            this.richNotice.pushBackElement(re9);
            ++this.lstRichElemmentNums;
        }
        else {
            var re1 = new ccui.RichElementText(0, colorb, 255, "Congratulations to ", "Arial", 24);
            this.richNotice.pushBackElement(re1);
            ++this.lstRichElemmentNums;

            var re2 = new ccui.RichElementText(0, colory, 255, this.objShowNotice.playerName, "Arial", 24);
            this.richNotice.pushBackElement(re2);
            ++this.lstRichElemmentNums;

            var re3 = new ccui.RichElementText(0, colorb, 255, " who has just won $", "Arial", 24);
            this.richNotice.pushBackElement(re3);
            ++this.lstRichElemmentNums;

            var re4 = new ccui.RichElementText(0, colory, 255, (this.objShowNotice.win / 100).toString(), "Arial", 24);
            this.richNotice.pushBackElement(re4);
            ++this.lstRichElemmentNums;

            var re5 = new ccui.RichElementText(0, colorb, 255, " on a $", "Arial", 24);
            this.richNotice.pushBackElement(re5);
            ++this.lstRichElemmentNums;

            var re6 = new ccui.RichElementText(0, colorb1, 255, (this.objShowNotice.bet / 100).toString(), "Arial", 24);
            this.richNotice.pushBackElement(re6);
            ++this.lstRichElemmentNums;

            var re7 = new ccui.RichElementText(0, colorb, 255, " ", "Arial", 24);
            this.richNotice.pushBackElement(re7);
            ++this.lstRichElemmentNums;

            var re8 = new ccui.RichElementText(0, colorb1, 255, this.getGameName(this.objShowNotice.gameCode), "Arial", 24);
            this.richNotice.pushBackElement(re8);
            ++this.lstRichElemmentNums;

            var re9 = new ccui.RichElementText(0, colorb, 255, " wager.", "Arial", 24);
            this.richNotice.pushBackElement(re9);
            ++this.lstRichElemmentNums;
        }

        // var re6 = new ccui.RichElementText(0, colorb1, 255, (this.objShowNotice.bet / 100).toString(), "Microsoft YaHei", 24);
        // this.richNotice.pushBackElement(re6);
        // ++this.lstRichElemmentNums;

        // var re5 = new ccui.RichElementText(0, colorb, 255, " in ", "Microsoft YaHei", 24);
        // this.richNotice.pushBackElement(re5);
        // ++this.lstRichElemmentNums;


        // var re7 = new ccui.RichElementText(0, colorb, 255, " game.", "Microsoft YaHei", 24);
        // this.richNotice.pushBackElement(re7);
        // ++this.lstRichElemmentNums;

        // var re9 = new ccui.RichElementText(0, colory, 255, "元！", "Microsoft YaHei", 24);
        // this.richNotice.pushBackElement(re9);
        // ++this.lstRichElemmentNums;

        var re21 = new ccui.RichElementText(0, colorb, 255, "(", "Arial", 16);
        this.richNotice.pushBackElement(re21);
        ++this.lstRichElemmentNums;

        var re22 = new ccui.RichElementText(0, colorb, 255, this.objShowNotice.createTime, "Arial", 16);
        this.richNotice.pushBackElement(re22);
        ++this.lstRichElemmentNums;

        var re23 = new ccui.RichElementText(0, colorb, 255, ")", "Arial", 16);
        this.richNotice.pushBackElement(re23);
        ++this.lstRichElemmentNums;
    },

    addNoticeText_jp : function () {
        var colorb = {r:95, g:184, b:235};
        var colorb1 = {r:0, g:255, b:246};
        var colory = {r:246, g:255, b:0};

        if(!this.objShowNotice.isme) {
            var re1 = new ccui.RichElementText(0, colorb, 255, "おめでとうございます！", "Meiryo", 20);
            this.richNotice.pushBackElement(re1);
            ++this.lstRichElemmentNums;

            var re2 = new ccui.RichElementText(0, colorb1, 255, this.getGameName(this.objShowNotice.gameCode), "Meiryo", 20);
            this.richNotice.pushBackElement(re2);
            ++this.lstRichElemmentNums;

            var re3 = new ccui.RichElementText(0, colorb, 255, "ゲームで", "Meiryo", 20);
            this.richNotice.pushBackElement(re3);
            ++this.lstRichElemmentNums;

            var re4 = new ccui.RichElementText(0, colorb1, 255, (this.objShowNotice.bet / 100).toString(), "Meiryo", 20);
            this.richNotice.pushBackElement(re4);
            ++this.lstRichElemmentNums;

            var re5 = new ccui.RichElementText(0, colorb, 255, "円を賭けて", "Meiryo", 20);
            this.richNotice.pushBackElement(re5);
            ++this.lstRichElemmentNums;

            var re6 = new ccui.RichElementText(0, colory, 255, (this.objShowNotice.win / 100).toString(), "Meiryo", 20);
            this.richNotice.pushBackElement(re6);
            ++this.lstRichElemmentNums;

            var re7 = new ccui.RichElementText(0, colorb, 255, "円を勝ちました！", "Meiryo", 20);
            this.richNotice.pushBackElement(re7);
            ++this.lstRichElemmentNums;
        }
        else {
            var re1 = new ccui.RichElementText(0, colorb, 255, "おめでとうございます！", "Meiryo", 20);
            this.richNotice.pushBackElement(re1);
            ++this.lstRichElemmentNums;

            var re2 = new ccui.RichElementText(0, colory, 255, this.objShowNotice.playerName, "Meiryo", 20);
            this.richNotice.pushBackElement(re2);
            ++this.lstRichElemmentNums;

            var re3 = new ccui.RichElementText(0, colorb, 255, "様が", "Meiryo", 20);
            this.richNotice.pushBackElement(re3);
            ++this.lstRichElemmentNums;

            var re4 = new ccui.RichElementText(0, colorb1, 255, this.getGameName(this.objShowNotice.gameCode), "Meiryo", 20);
            this.richNotice.pushBackElement(re4);
            ++this.lstRichElemmentNums;

            var re5 = new ccui.RichElementText(0, colorb, 255, "ゲームで", "Meiryo", 20);
            this.richNotice.pushBackElement(re5);
            ++this.lstRichElemmentNums;

            var re6 = new ccui.RichElementText(0, colorb1, 255, (this.objShowNotice.bet / 100).toString(), "Meiryo", 20);
            this.richNotice.pushBackElement(re6);
            ++this.lstRichElemmentNums;

            var re7 = new ccui.RichElementText(0, colorb, 255, "円を賭けて", "Meiryo", 20);
            this.richNotice.pushBackElement(re7);
            ++this.lstRichElemmentNums;

            var re8 = new ccui.RichElementText(0, colory, 255, (this.objShowNotice.win / 100).toString(), "Meiryo", 20);
            this.richNotice.pushBackElement(re8);
            ++this.lstRichElemmentNums;

            var re9 = new ccui.RichElementText(0, colorb, 255, "円を勝ちました！", "Meiryo", 20);
            this.richNotice.pushBackElement(re9);
            ++this.lstRichElemmentNums;
        }

        // var re6 = new ccui.RichElementText(0, colorb1, 255, (this.objShowNotice.bet / 100).toString(), "Microsoft YaHei", 24);
        // this.richNotice.pushBackElement(re6);
        // ++this.lstRichElemmentNums;

        // var re5 = new ccui.RichElementText(0, colorb, 255, " in ", "Microsoft YaHei", 24);
        // this.richNotice.pushBackElement(re5);
        // ++this.lstRichElemmentNums;


        // var re7 = new ccui.RichElementText(0, colorb, 255, " game.", "Microsoft YaHei", 24);
        // this.richNotice.pushBackElement(re7);
        // ++this.lstRichElemmentNums;

        // var re9 = new ccui.RichElementText(0, colory, 255, "元！", "Microsoft YaHei", 24);
        // this.richNotice.pushBackElement(re9);
        // ++this.lstRichElemmentNums;

        var re21 = new ccui.RichElementText(0, colorb, 255, "(", "Meiryo", 16);
        this.richNotice.pushBackElement(re21);
        ++this.lstRichElemmentNums;

        var re22 = new ccui.RichElementText(0, colorb, 255, this.objShowNotice.createTime, "Meiryo", 16);
        this.richNotice.pushBackElement(re22);
        ++this.lstRichElemmentNums;

        var re23 = new ccui.RichElementText(0, colorb, 255, ")", "Meiryo", 16);
        this.richNotice.pushBackElement(re23);
        ++this.lstRichElemmentNums;
    },

    setNoticeState : function (state) {
        if(this.iNoticeState != 2 && state == 2 && this.nodeNotice.isVisible())
            cc.audioEngine.playEffect(res.CommonJackpotNotice_mp3, false);

        this.btnNotice.setEnabled(state == 1);
        this.btnNotice.setBright(state == 1);

        this.iNoticeState = state;
        this.aniNoticeAni.animation.play(this.lstnoticeaniname[state], -1, this.lstnoticeaniloop[state]);
        this.aniNoticeAni.setVisible(this.lstnoticeanishow[state]);
        this.textNotice.setVisible(state == 3);
    },

    getNewNotice : function (lastid) {
        if (CommonJackpotMgr.singleton.lstWin == undefined || CommonJackpotMgr.singleton.lstWin.length <= 0)
            return;

        var msgobj = undefined;

        //! 找一个最老没有播放过的
        for(var ii = CommonJackpotMgr.singleton.lstWin.length - 1; ii >= 0; --ii) {
            // if(bself && !CommonJackpotMgr.singleton.lstWin[ii].isme)
            //     continue ;

            if(CommonJackpotMgr.singleton.lstWin[ii].curnums <= 0) {
                msgobj = CommonJackpotMgr.singleton.lstWin[ii];
                break;
            }
        }

        if(msgobj != undefined) {
            return msgobj;
        }

        //! 没有新的则找播放过的
        if(lastid > 0) {
            for(var ii = 0; ii < CommonJackpotMgr.singleton.lstWin.length; ++ii) {
                if(CommonJackpotMgr.singleton.lstWin[ii].id == lastid) {
                    if(ii < CommonJackpotMgr.singleton.lstWin.length - 1) {
                        msgobj = CommonJackpotMgr.singleton.lstWin[ii + 1];
                        return msgobj;
                    }
                }
            }
        }

        msgobj = CommonJackpotMgr.singleton.lstWin[0];
        return msgobj;
    },

    getSelfNotice : function (lastid) {
        if (CommonJackpotMgr.singleton.lstWin == undefined || CommonJackpotMgr.singleton.lstWin.length <= 0)
            return;

        var msgobj = undefined;
        var bfindid = false;

        for(var ii = CommonJackpotMgr.singleton.lstWin.length - 1; ii >= 0; --ii) {
            var winfo = CommonJackpotMgr.singleton.lstWin[ii];

            if(!winfo.isme)
                continue ;

            if(winfo.bselfshow != undefined && winfo.bselfshow)
                continue ;

            // if(!CommonJackpotMgr.singleton.lstWin[ii].isme)
            //     continue ;

            if(lastid < 0) {
                msgobj = winfo;
                break;
            }
            else if(bfindid) {
                msgobj = winfo;
                break;
            }
            else if(winfo.id == lastid) {
                bfindid = true;
            }
        }

        if(msgobj != undefined) {
            return msgobj;
        }

        for(var ii = CommonJackpotMgr.singleton.lstWin.length - 1; ii >= 0; --ii) {
            // if(!CommonJackpotMgr.singleton.lstWin[ii].isme)
            //     continue ;

            var winfo = CommonJackpotMgr.singleton.lstWin[ii];

            if(!winfo.isme)
                continue ;

            if(winfo.bselfshow != undefined && winfo.bselfshow)
                continue ;

            msgobj = winfo;
            break;
        }

        return msgobj;
    },

    hasNewNotice : function () {
        if (CommonJackpotMgr.singleton.lstWin == undefined || CommonJackpotMgr.singleton.lstWin.length <= 0)
            return false;

        if(CommonJackpotMgr.singleton.lstWin[0].curnums <= 0)
            return true;

        return false;
    },

    hasSelfNotice : function () {
        //return false;

        if (CommonJackpotMgr.singleton.lstWin == undefined || CommonJackpotMgr.singleton.lstWin.length <= 0)
            return false;

        for(var ii = 0; ii < CommonJackpotMgr.singleton.lstWin.length; ++ii) {
            var winfo = CommonJackpotMgr.singleton.lstWin[ii];

            if(!winfo.isme)
                continue ;

            if(winfo.bselfshow == undefined)
                return true;

            if(!winfo.bselfshow)
                return true;
        }

        return false;
    },

    showJackpotWin : function (type, nums) {
        if(this.WinAni != undefined) {
            this.WinAni.node.stopAllActions();
            this.nodeJackpotAni.removeChild(this.WinAni.node);
            this.WinAni = undefined;
        }

        this.WinAni = ccs.load(res.CommonJackpotAni_json);
        this.nodeJackpotAni.addChild(this.WinAni.node);
        this.WinAni.node.runAction(this.WinAni.action);
        this.WinAniState = 0;
        this.WinAniAllNums = nums;
        this.WinAniType = type;
        this.WinAniShowNums = 0;
        this.WinAniChgTime = 0;
        this.WinAniSPTime = 0;
        this.WinAniAllTime = nums / this.lstWinAniChgNum[type];

        if(this.WinAniAllTime < 10)
            this.WinAniAllTime = 10;

        if(this.WinAniAllTime > 60)
            this.WinAniAllTime = 60;

        this.WinAniCtrlAni = findNodeByName(this.WinAni.node, "ctrlani");
        this.WinAniTextNums = findNodeByName(this.WinAni.node, "textNum1");
        this.WinAniSprTime = findNodeByName(this.WinAni.node, "sprTime");
        this.WinAniTextTime = findNodeByName(this.WinAni.node, "textTime");

        this.WinAniBtnOK = findNodeByName(this.WinAni.node, "btnOK");
        this.WinAniBtnOK.addTouchEventListener(this.onTouchWinAniOK, this);

        var panel = findNodeByName(this.WinAni.node, "Panel_1");
        panel.addTouchEventListener(this.onTouchWinAniPanel, this);

        var frame = cc.spriteFrameCache.getSpriteFrame("jackpot_img_icon" + (type + 1) + ".png");

        for(var ii = 1; ; ++ii) {
            var spricon = findNodeByName(this.WinAni.node, "sprIcon" + ii);

            if(spricon)
                spricon.setSpriteFrame(frame);
            else
                break;
        }

        this.setWinAniState(0, -1);
    },

    setWinAniState : function (state, time) {
        this.WinAniState = state;

        // this.lstWinAniName = ["jackpot1", "jackpot2", "jackpot3"];
        // this.lstWinAniFrame = [[0,37], [40,80], [85,103]];

        this.WinAni.action.gotoFrameAndPlay(this.lstWinAniFrame[this.WinAniState][0], this.lstWinAniFrame[this.WinAniState][1], this.WinAniState == 1);

        if(this.WinAniCtrlAni) {
            this.WinAniCtrlAni.animation.play(this.lstWinAniName[this.WinAniState], -1, this.WinAniState == 1 ? 1 : 0);
        }

        if(time > 0)
            this.WinAniChgTime = time;

        var bshow = false;

        if(this.WinAniState == 1 && this.WinAniChgTime >= this.WinAniAllTime)
            bshow = true;

        if(this.WinAniBtnOK)
            this.WinAniBtnOK.setVisible(bshow);

        if(this.WinAniSprTime)
            this.WinAniSprTime.setVisible(bshow);

        if(this.WinAniTextTime)
            this.WinAniTextTime.setVisible(bshow);
    },

    update_WinAni : function (dt) {
        if(this.WinAni == undefined)
            return ;

        this.WinAniSPTime += dt;

        if(this.WinAniSPTime >= 1 / 23) {
            var baddend = (this.WinAniAllTime <= this.WinAniChgTime);

            while(this.WinAniSPTime >= 1 / 23) {
                this.WinAniChgTime += 1 / 23;
                this.WinAniSPTime -= 1 / 23;
            }

            if(this.WinAniChgTime < this.WinAniAllTime) {
                this.WinAniShowNums = Math.floor(this.WinAniAllNums * this.WinAniChgTime / this.WinAniAllTime);
                cc.audioEngine.playEffect(res.CommonJackpotAddMoney_mp3, false);

                if(this.WinAniTextNums)
                    this.WinAniTextNums.setString(this.chgString_Gray1(this.WinAniShowNums, 20));
            }
            else {
                if(!baddend) {
                    cc.audioEngine.playEffect(res.CommonJackpotFinishMoney_mp3, false);
                    this.setWinAniState(1, this.WinAniChgTime);
                }

                this.WinAniShowNums = this.WinAniAllNums;

                if(this.WinAniTextNums)
                    this.WinAniTextNums.setString(this.chgString(this.WinAniShowNums));

                if(this.WinAniState == 1) {
                    var wtime = 30 - (this.WinAniChgTime - this.WinAniAllTime);

                    if(wtime < 0) {
                        this.setWinAniState(2, -1);
                        return ;
                    }

                    if(this.WinAniTextTime) {
                        wtime = Math.floor(wtime);
                        this.WinAniTextTime.setString(wtime.toString());
                    }
                }

            }
        }

        if(this.WinAniState == 0) {
            if(this.WinAni.action.getCurrentFrame() >= this.lstWinAniFrame[this.WinAniState][1]) {
                this.setWinAniState(1, 0);
            }
        }
        else if(this.WinAniState == 2) {
            if(this.WinAni.action.getCurrentFrame() >= this.lstWinAniFrame[this.WinAniState][1]) {
                if(this.WinAni != undefined) {
                    this.WinAni.node.stopAllActions();
                    this.nodeJackpotAni.removeChild(this.WinAni.node);
                    this.WinAni = undefined;

                    var ii = this.WinAniType;
                    var pnums = CommonJackpotMgr.singleton.lstPool[ii];

                    this.lstCurJackpotNums[ii] = pnums - this.lstjackpotadd[ii] * this.jackpottimesp;
                    this.lstJackpotNumsSP[ii] = this.lstjackpotadd[ii];

                    if(this.lstCurJackpotNums[ii] < this.lstjackpotmin[ii]) {
                        this.lstCurJackpotNums[ii] = this.lstjackpotmin[ii];
                        this.lstJackpotNumsSP[ii] = (pnums - this.lstjackpotmin[ii]) / this.jackpottimesp;
                    }

                    if(this.lstJackpotNumsSP[ii] < 1)
                        this.lstJackpotNumsSP[ii] = 1;

                    if(this.lstCurJackpotNums[ii] > pnums)
                        this.lstCurJackpotNums[ii] = pnums;

                    //GameMgr.singleton.closeJackpotWin();
                    GameMgr.singleton.closeJackpotGame();
                }
            }
        }

        // this.WinAniAllNums = nums;
        // this.WinAniShowNums = 0;
        // this.WinAniChgTime = 0;
        // this.WinAniSPTime = 0;
        // this.WinAniAllTime = nums / this.lstWinAniChgNum[type];
    },

    onTouchWinAniOK : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.WinAniState >= 2)
            return

        this.setWinAniState(2, -1);
    },

    canTouchWinAniPanel : function () {
        if(this.WinAni == undefined)
            return false;

        if(this.WinAniState >= 2)
            return false;

        if(this.WinAniState == 1 && this.WinAniChgTime >= this.WinAniAllTime)
            return false;

        return true;
    },

    onTouchWinAniPanel : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.WinAniState >= 2)
            return ;

        if(this.WinAniState == 1 && this.WinAniChgTime >= this.WinAniAllTime)
            return ;

        cc.audioEngine.playEffect(res.CommonJackpotFinishMoney_mp3, false);
        this.setWinAniState(1, this.WinAniAllTime);
    },

    //! 设置是否显示转盘游戏
    showGame : function (bshow, binit) {
        this.layGame.node.setVisible(bshow);

        if(bshow) {
            // if(binit)
            //     this.layGame.action.gotoFrameAndPlay(this.lstGameLayerFrame[1][0], this.lstGameLayerFrame[1][1], false);
            // else
            //     this.layGame.action.gotoFrameAndPlay(this.lstGameLayerFrame[0][0], this.lstGameLayerFrame[0][1], false);

            if(this.bUpdate) {
                this.layGame.action.gotoFrameAndPlay(0, 65, false);
                this.aniBegin.animation.play('zhuanpan01',-1,0);
                this.sprTurntable.setRotation(0);

                this.aniTurntable1.setVisible(false);
                this.aniTurntable2.setVisible(false);
                this.aniTurntableEnd.setVisible(false);
                this.iAniShowTime = 1;

                cc.audioEngine.playEffect(res.CommonJackpotBegin_mp3, false);
            }
            else {
                this.bShowGame = true;
            }
        }
        // else
        //     this.layGame.action.gotoFrameAndPlay(this.lstGameLayerFrame[2][0], this.lstGameLayerFrame[2][1], false);

        if(bshow && this.iGameState == 0) {
            this.initGame();
        }
        else if(!bshow) {
            this.iGameState = 0;
        }
    },

    //! 初始化转盘游戏
    initGame : function () {
        if(GameMgr.singleton.JackpotGameMsg == undefined)
            return ;

        this.refreshGameLight();
        this.setGameState(1);
        GameMgr.singleton.JackpotGameMsg = undefined;
    },

    refreshGameLight : function () {
        var gframe = cc.spriteFrameCache.getSpriteFrame("jackpot_img_light0.png");

        for(var ii = 0; ii < 4; ++ii) {
            var lframe = cc.spriteFrameCache.getSpriteFrame("jackpot_img_light" + (ii + 1) + ".png");

            for(var jj = 0; jj < 3; ++jj) {
                if(jj < GameMgr.singleton.JackpotGameMsg.gmi.lstval[ii])
                    this.lstGameLight[ii][jj].setSpriteFrame(lframe);
                else
                    this.lstGameLight[ii][jj].setSpriteFrame(gframe);
            }
        }
    },

    setGameState : function (state) {
        if(this.iGameState == state)
            return ;

        this.iGameState = state;

        switch(state) {
            case 1:{
                this.btnRun.setEnabled(true);
                this.btnRun.setBright(true);

                this.aniTurntable1.animation.play("zhuanpan07", -1, 1);
                this.aniTurntable2.setVisible(false);
            }
                break;
            case 2:{
                this.btnRun.setEnabled(false);
                this.btnRun.setBright(false);

                this.aniTurntable1.animation.play("zhuanpan02", -1, 0);
                this.aniTurntable2.animation.play("zhuanpan05", -1, 1);
                this.aniTurntable2.setVisible(true);

                this.iGameStop = -1;
            }
                break;
            case 3:{
                this.btnRun.setEnabled(false);
                this.btnRun.setBright(false);

                this.aniTurntable1.animation.play("zhuanpan04", -1, 0);
                //this.aniTurntable2.animation.play("zhuanpan4", -1, 1);
                this.aniTurntable2.setVisible(true);
                cc.audioEngine.playEffect(res.CommonJackpotStop_mp3, false);
            }
                break;
            case 4:{
                if(GameMgr.singleton.JackpotGameMsg.gmi.award >= 0) {
                    this.iGameTime = 1;
                    this.iGameAwardType = GameMgr.singleton.JackpotGameMsg.gmi.lastindex;
                    this.iGameAwardNums = GameMgr.singleton.JackpotGameMsg.gmi.award;

                    this.aniTurntableEnd.animation.play(this.lstturntablwinname[GameMgr.singleton.JackpotGameMsg.gmi.lastindex], -1, 0);
                    cc.audioEngine.playEffect(res.CommonJackpotWin_mp3, false);
                }
                break;
            }
        }
    },

    update_Game : function (dt) {
        // if(this.layGame.action.getCurrentFrame() == this.lstGameLayerFrame[0][1]) {
        //     this.layGame.action.gotoFrameAndPlay(this.lstGameLayerFrame[1][0], this.lstGameLayerFrame[1][1], false);
        // }

        switch(this.iGameState) {
            case 2: {
                if(this.aniTurntable1.animation.getCurrentMovementID() == "") {
                    this.aniTurntable1.animation.play("zhuanpan03", -1, 1);
                }

                var rota = this.sprTurntable.getRotation();
                var nrota = rota + dt * this.iGameSpeed;

                this.iSoundRotation += dt * this.iGameSpeed;

                if(this.iGameStop >= 0) {
                    if(this.iGameSpeed >= 60) {
                        this.iGameSpeed -= 360 * dt * 1.5;

                        if(this.iGameSpeed < 60)
                            this.iGameSpeed = 60;
                    }
                    else {
                        this.iGameSpeed -= 3 * dt;

                        if(this.iGameSpeed < 30)
                            this.iGameSpeed = 30;
                    }

                    if(this.iGameSpeed <= 60) {
                        if(rota <= this.iGameStop && nrota >= this.iGameStop) {
                            this.sprTurntable.setRotation(this.iGameStop);
                            this.iGameStop = -1;
                            this.setGameState(3);
                            return ;
                        }
                    }
                }
                else {
                    this.iGameSpeed += 360 * dt;

                    if(this.iGameSpeed > 1080)
                        this.iGameSpeed = 1080;
                }

                if(this.iSoundRotation > 36) {
                    cc.audioEngine.playEffect(res.CommonJackpotStep_mp3, false);

                    this.iSoundRotation = this.iSoundRotation % 36;
                }

                while(nrota >= 360)
                    nrota -= 360;

                this.sprTurntable.setRotation(nrota);

                if(this.iGameSpeed >= 1080) {
                    if(this.iGameTime > 0) {
                        this.iGameTime -= dt;

                        if(this.iGameTime <= 0)
                            this.iGameTime = 0;
                    }
                    else {
                        if(GameMgr.singleton.JackpotGameMsg != undefined) {
                            // //! 测试
                            // this.setGameState(3);

                            var si = GameMgr.singleton.JackpotGameMsg.gmi.lastindex;
                            var sindex = Math.floor(Math.random() * this.lstGameRotate[si].length);

                            this.iGameStop = this.lstGameRotate[si][sindex];
                        }
                    }
                }
            }
                break;
            case 3: {
                if(this.aniTurntable1.animation.getCurrentMovementID() == "") {
                    this.aniTurntable1.animation.play("zhuanpan07", -1, 1);
                    this.aniTurntable2.animation.play("zhuanpan06", -1, 1);
                    this.aniTurntableEnd.animation.play(this.lstturntablendname[GameMgr.singleton.JackpotGameMsg.gmi.lastindex], -1, 0);
                    cc.audioEngine.playEffect(this.lstturntablsound[GameMgr.singleton.JackpotGameMsg.gmi.lastindex], false);

                    //this.refreshGameLight();

                    this.iGameTime = 0.5;
                }

                if(this.iGameTime > 0) {
                    this.iGameTime -= dt;

                    if(this.iGameTime <= 0) {
                        this.iGameTime = 0;

                        this.refreshGameLight();

                        if(GameMgr.singleton.JackpotGameMsg.gmi.award >= 0)
                            this.setGameState(4);
                        else
                            this.setGameState(1);

                        // if(GameMgr.singleton.JackpotGameMsg.gmi.award > 0) {
                        //     this.iGameTime = 2;
                        //     this.iGameAwardType = GameMgr.singleton.JackpotGameMsg.gmi.lastindex;
                        //     this.iGameAwardNums = GameMgr.singleton.JackpotGameMsg.gmi.award;
                        // }

                        // if(GameMgr.singleton.JackpotGameMsg.gmi.award > 0) {
                        //     this.showGame(false);
                        //     this.showJackpotWin(this.iGameAwardType, this.iGameAwardNums);
                        //     this.iGameAwardType = -1;
                        //     this.iGameAwardNums = -1;
                        //     //GameMgr.singleton.closeJackpotGame();
                        // }

                        GameMgr.singleton.JackpotGameMsg = undefined;
                    }
                }
            }
                break;
            case 4: {
                if(this.iGameTime > 0) {
                    this.iGameTime -= dt;

                    if(this.iGameTime <= 0) {
                        this.iGameTime = 0;

                        this.setGameState(1);
                        this.showGame(false);
                        this.showJackpotWin(this.iGameAwardType, this.iGameAwardNums);
                        this.iGameAwardType = -1;
                        this.iGameAwardNums = -1;
                    }
                }
            }
                break;
        }
    },

    //! 恢复之前记录的属性
    restoreUserSetup : function () {
        var jackpot = cc.sys.localStorage.getItem("commonjackpot");

        if(jackpot) {
            jackpot = parseInt(jackpot);

            if(jackpot <= 0) {
                this.setListState(0);
                this.btnList.setVisible(true);
                this.btnList1.setVisible(false);
            }
            else {
                this.setListState(2);
                this.btnList.setVisible(false);
                this.btnList1.setVisible(true);
            }
        }
        else
            this.setListState(0);
    },

    //! 记录用户设置
    setUserSetup : function (sname, snum) {
        cc.sys.localStorage.setItem(sname, snum);
    },

    update : function(dt) {
        this.bUpdate = true;

        if(this.bShowGame) {
            this.layGame.action.gotoFrameAndPlay(0, 65, false);
            this.aniBegin.animation.play('zhuanpan01',-1,0);
            this.sprTurntable.setRotation(0);

            this.aniTurntable1.setVisible(false);
            this.aniTurntable2.setVisible(false);
            this.aniTurntableEnd.setVisible(false);
            this.iAniShowTime = 1;

            cc.audioEngine.playEffect(res.CommonJackpotBegin_mp3, false);

            this.bShowGame = false;
        }

        if(this.iAniShowTime > 0) {
            this.iAniShowTime -= dt;

            if(this.iAniShowTime <= 0) {
                this.iAniShowTime = -1;
                this.aniTurntable1.setVisible(true);
                this.aniTurntableEnd.setVisible(true);
            }
        }
        // if(!this.aniTurntable1.isVisible() && this.aniBegin.animation.getCurrentMovementID() == '') {
        //     this.aniTurntable1.setVisible(true);
        //     this.aniTurntableEnd.setVisible(true);
        // }

        //this.setVisible(CommonJackpotMgr.singleton.bShowJackpot);
        this.nodeNotice.setVisible(CommonJackpotMgr.singleton.bShowJackpot);
        this.nodeJackpot.setVisible(CommonJackpotMgr.singleton.bShowJackpot && CommonJackpotMgr.singleton.bShowJackpot1);
        this.nodeJackpotAni.setVisible(CommonJackpotMgr.singleton.bShowJackpot && CommonJackpotMgr.singleton.bShowJackpot1);
        this.nodeJackpotGame.setVisible(CommonJackpotMgr.singleton.bShowJackpot && CommonJackpotMgr.singleton.bShowJackpot1);

        if((!CommonJackpotMgr.singleton.bShowJackpot || !CommonJackpotMgr.singleton.bShowJackpot1) && GameMgr.singleton.bPauseGame) {
            GameMgr.singleton.JackpotGameMsg = undefined;
            GameMgr.singleton.closeJackpotGame();
        }

        this.update_List(dt);
        this.update_Notice(dt);
        this.update_WinAni(dt);
        this.update_Game(dt);
    },

    chgString : function (num) {
        var str = Math.floor(num / 100).toString();

        if(num % 100 != 0) {
            str += ".";
            var snum = num % 100;

            if(snum < 10) {
                str += "0";
                str += snum;
            }
            else {
                str += snum;
            }
        }

        return str;
    },

    chgString_Gray1 : function (num, gnum) {
        var tstr = "";

        var znum = Math.floor(num / 100);

        var zstr = znum.toString();
        var anum = gnum - zstr.length;
        var comma = 3 - gnum % 3;

        if(comma >= 3)
            comma = 0;

        if(anum > 0) {
            //! 需要补灰色的0
            for(var ii = 0; ii < anum; ++ii) {
                //tstr += "a";

                ++comma;
                if(comma >= 3) {
                    comma = 0;
                    //tstr += "b";
                }
            }
        }

        for(var ii = 0; ii < zstr.length; ++ii) {
            tstr += zstr[ii];

            ++comma;
            if (comma >= 3) {
                comma = 0;
                tstr += ",";
            }
        }

        var str = tstr.slice(0, tstr.length - 1);

        if(num % 100 != 0) {
            str += ".";
            var snum = num % 100;

            if(snum < 10) {
                str += "0";
                str += snum;
            }
            else {
                str += snum;
            }
        }
        else {
            str += ".00";
        }

        return str;
    },
});

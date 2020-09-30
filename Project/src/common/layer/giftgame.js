var CommonGiftGameLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var gamelayer = ccs.load(res.CommonGiftGamLayer_json);
        this.addChild(gamelayer.node);
        this.GameLayer = gamelayer;

        gamelayer.node.runAction(gamelayer.action);
        //gamelayer.action.play('1', false);

        this._loadNewGift();

        //! 屏蔽操作
        this.ggBack = findNodeByName(gamelayer.node, "ggBack");
        //this.ggBack.setVisible(false);

        //! 上方文字
        this.ggTitle = findNodeByName(gamelayer.node, "ggTitle");
        this.ggTimes = findNodeByName(gamelayer.node, "ggTimes");
        this.ggWins = findNodeByName(gamelayer.node, "ggWins");

        //! 结果
        this.ggResult = findNodeByName(gamelayer.node, "ggResult");
        this.t3Times = findNodeByName(gamelayer.node, "t3Times");
        this.t3Wins = findNodeByName(gamelayer.node, "t3Wins");

        this.BtnOK = findNodeByName(gamelayer.node, "BtnOK");
        this.BtnOK.addTouchEventListener(this.onTouchOK, this);

        //! 红包
        this.ggPocket = findNodeByName(gamelayer.node, "ggPocket");
        this.TxtInfo = findNodeByName(gamelayer.node, "TxtInfo");
        this.contentTimes = findNodeByName(gamelayer.node, "contentTimes");
        this.contentBets = findNodeByName(gamelayer.node, "contentBets");

        this.BtnOpen = findNodeByName(gamelayer.node, "BtnOpen");
        this.BtnOpen.addTouchEventListener(this.onTouchOpen, this);

        this.BtnReceive = findNodeByName(gamelayer.node, "BtnReceive");
        this.BtnReceive.addTouchEventListener(this.onTouchReceive, this);

        //! 逻辑
        this.lstbvisible = [[false,false,true], [false,false,true], [true,false,true], [true,true,false], [true,true,false]];

        this.iState = -2;        //! -1不存在 0出现 1打开 2领取后 3显示结算 4结算消失
        this.Data = undefined;

        this.iState1 = -2;        //! -1不存在 0出现 1消失 2投注不足出现 3投注不足游戏中 4投注足够出现
        this.Data1 = undefined;
        this.gg1Str1 = "";
        this.gg1Str2 = "";
        this.iGG1Bet = 0;

        this.setState(-1);
        this.setState1(-1);

        this.scheduleUpdate();
        this.setVisible(false);

        return true;
    },

    //! 是否可以穿过去操作后面的功能
    canThrough : function () {
        if(this.GameLayer && this.GameLayer.node.isVisible() && this.ggBack.isVisible())
            return false;

        if(this.GameLayer1 && this.GameLayer1.node.isVisible())
            return false;

        return true;
    },

    setState : function (state) {
        if(this.iState == state)
            return ;

        this.iState = state;

        if(state == -1) {
            this.GameLayer.node.setVisible(false);
        }
        else {
            this.GameLayer.node.setVisible(true);
            this.ggBack.setVisible(true);

            this.ggTitle.setVisible(this.lstbvisible[state][0]);
            this.ggResult.setVisible(this.lstbvisible[state][1]);
            this.ggPocket.setVisible(this.lstbvisible[state][2]);

            this.GameLayer.action.play(state.toString(), false);
        }
    },

    update : function (dt) {
        this.update_gg1(dt);

        if(this.iState == 2) {
            if(this.ggBack.isVisible()) {
                if(!this.GameLayer.action.isPlaying()) {
                    this.ggBack.setVisible(false);
                    GameMgr.singleton.refreshGiftGame();
                }
            }
        }
        else if(this.iState == 4) {
            if(this.ggBack.isVisible()) {
                if(!this.GameLayer.action.isPlaying()) {
                    this.Data = undefined;
                    this.setState(-1);
                    GameMgr.singleton.leftGiftGame();
                }
            }
        }
    },

    onTouchOK : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if(this.GameLayer.action.isPlaying())
            return ;

        if(this.iState != 3)
            return ;

        this.setState(4);
    },

    onTouchOpen : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if(this.GameLayer.action.isPlaying())
            return ;

        if(this.iState != 0)
            return ;

        this.setState(1);
    },

    onTouchReceive : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if(this.GameLayer.action.isPlaying())
            return ;

        if(this.iState != 1)
            return ;

        this.setState(2);
    },

    //! 收到数据
    onData : function (msgobj) {
        if(msgobj == undefined || msgobj.giftfree == undefined)
            return ;

        this.Data = msgobj.giftfree;

        // if(this.Data.lastnums != 7)
        //     this.Data.lastnums = 0;
    },

    initGiftGame : function () {
        //return false;

        this.initGiftGame1();

        if(this.Data == undefined) {
            this.setState(-1);
            return false;
        }

        //this.Data.lastnums = this.Data.totalnums;

        this.refreshDisplay();

        if(this.Data.lastnums != this.Data.totalnums)
            this.setState(2);

        return true;
    },

    //! 显示
    showGiftGame : function (bcanshow) {
        //return false;

        if(this.showGiftGame1(bcanshow)) {
            return true;
        }

        if(this.Data == undefined) {
            this.setState(-1);
            return false;
        }

        this.refreshDisplay();

        if(bcanshow == undefined || bcanshow) {
            if(this.iState < 0) {
                if(this.Data.lastnums == this.Data.totalnums) {
                    //! 一次都没完过，则显示开始的流程
                    this.setState(0);
                }
                else if(this.Data.lastnums > 0) {
                    //! 还有没用完的
                    this.setState(2);
                }
                else if(this.Data.lastnums <= 0) {
                    this.setState(3);
                }
            }
            else if(this.iState == 2) {
                if(this.Data.lastnums <= 0) {
                    this.setState(3);
                }
            }
        }

        return true;
    },

    refreshDisplay : function () {
        if (this.Data == undefined)
            return;

        this.ggTimes.setString(this.Data.lastnums + '/' + this.Data.totalnums);
        this.ggWins.setString(this.chgString1(this.Data.totalwin));

        this.t3Times.setString(this.Data.totalnums.toString());
        this.t3Wins.setString(this.chgString1(this.Data.totalwin));

        this.TxtInfo.setString(this.Data.str);
        this.contentTimes.setString(this.Data.totalnums.toString());
        this.contentBets.setString(this.chgString2(this.Data.bet));
    },

    //! 使用一次
    runOne : function () {
        if (this.Data == undefined)
            return;

        if(this.Data.lastnums > 0)
            --this.Data.lastnums;

        this.refreshDisplay();
    },

    //! 增加胜利金额
    addTotalWin : function (num) {
        if (this.Data == undefined)
            return;

        this.Data.totalwin += num;
        this.refreshDisplay();
    },

    //! 是否显示了红包
    isShowGift : function () {
        return this.iState == 2 || this.iState == 3 || this.iState == 4;
    },

    getGiftState : function () {
        return this.iState;
    },

    //! 取数据
    getGiftData : function (ignorenum) {
        if(this.Data == undefined)
            return undefined;

        if(ignorenum == undefined || !ignorenum) {
            if(this.Data.lastnums <= 0)
                return undefined;
        }

        var data = {};

        data.bet = Math.floor(this.Data.bet / this.Data.line / this.Data.times);
        data.line = this.Data.line;
        data.times = this.Data.times;
        data.lastnums = this.Data.lastnums;
        data.totalnums = this.Data.totalnums;

        return data;
    },

    //! 清空数据
    clearGiftData : function () {
        this.Data = undefined;
    },

    //! 将一个数字变成字符串
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

    chgString1 : function (num) {
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
        else {
            if(num < 100000) {
                str += '.00';
            }
        }

        return str;
    },

    chgString2 : function (num) {
        var str = Math.floor(num / 100).toString();

        if(num % 100 != 0) {
            str += ".";
            var snum = num % 100;

            if(snum < 10) {
                str += "0";
                str += snum;
            }
            else {
                if(snum % 10 == 0) {
                    str += (snum / 10);
                }
                else
                    str += snum;
            }
        }

        return str;
    },

    //! 新的红包相关
    //! 载入
    _loadNewGift : function () {
        if(!res.CommonGiftGamLayer1_json)
            return ;

        var gamelayer1 = ccs.load(res.CommonGiftGamLayer1_json);
        this.addChild(gamelayer1.node);
        this.GameLayer1 = gamelayer1;

        gamelayer1.node.runAction(gamelayer1.action);

        this.gg1Back = findNodeByName(gamelayer1.node, "gg1Back");

        this.gg1Title = findNodeByName(gamelayer1.node, "gg1Title");
        this.gg1Money = findNodeByName(gamelayer1.node, "gg1Money");
        this.gg1Bet = findNodeByName(gamelayer1.node, "gg1Bet");

        this.gg1BtnOK = findNodeByName(gamelayer1.node, "gg1BtnOK");
        this.gg1BtnOK.addTouchEventListener(this.onTouchGG1OK, this);
    },

    onTouchGG1OK : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if(this.GameLayer1.action.isPlaying())
            return ;

        this.gg1BtnOK.setVisible(false);
        //this.setState1(1);

        if(this.iState1 == 0 || this.iState1 == 4) {
            var self = this;

            MainClient.singleton.getFreeCash(function (isok) {
                if (isok) {
                    self.setState1(1);
                }
            });
        }
        else if(this.iState1 == 2) {
            this.setState1(3);
        }
    },

    onData1 : function (msgobj) {
        if(msgobj == undefined || msgobj.userbaseinfo == undefined || msgobj.userbaseinfo.freecash == undefined)
            return ;

        this.Data1 = msgobj.userbaseinfo.freecash;

        if(this.Data1.curbet != undefined && this.Data1.limitbet != undefined && this.gg1Bet) {
            this.iGG1Bet = this.Data1.limitbet - this.Data1.curbet;

            if(this.iGG1Bet < 0)
                this.iGG1Bet = 0;

            this.gg1Bet.setString(this.chgString1(this.iGG1Bet));
        }
    },

    setState1 : function (state) {
        if(this.GameLayer1 == undefined)
            return false;

        if(this.iState1 == state)
            return ;

        if(state == 0) {
            if(this.iGG1Bet > 0)
                state = 2;
        }

        this.iState1 = state;

        if(state == 2 || state == 3)
            this.gg1Title.setString(this.gg1Str2);
        else
            this.gg1Title.setString(this.gg1Str1);

        this.gg1Back.setVisible(true);

        if(state == -1) {
            this.GameLayer1.node.setVisible(false);
        }
        else {
            this.GameLayer1.node.setVisible(true);

            this.GameLayer1.action.play((state + 1).toString(), false);
        }
    },

    initGiftGame1 : function () {
        if(this.GameLayer1 == undefined)
            return false;

        if(this.Data1 == undefined) {
            this.setState1(-1);
            return false;
        }

        this.refreshDisplay1();
        return true;
    },

    refreshDisplay1 : function () {
        if(this.GameLayer1 == undefined)
            return;

        if (this.Data1 == undefined)
            return;

        this.gg1Str1 = this.Data1.message;

        if(this.Data1.curbet != undefined) {
            StringMgrSys.gg1CurBet = (this.Data1.curbet / 100).toString();

            if(GameMgr.singleton.userbaseinfo.currency)
                StringMgrSys.gg1CurBet += GameMgr.singleton.userbaseinfo.currency;
        }
        else
            StringMgrSys.gg1CurBet = "";

        if(this.Data1.limitbet != undefined) {
            StringMgrSys.gg1MaxBet = (this.Data1.limitbet / 100).toString();

            if(GameMgr.singleton.userbaseinfo.currency)
                StringMgrSys.gg1MaxBet += GameMgr.singleton.userbaseinfo.currency;
        }
        else
            StringMgrSys.gg1MaxBet = "";

        this.gg1Str2 = StringMgrSys.getString_str("StringGift1");

        //this.gg1Title.setString(this.Data1.message);

        if(GameMgr.singleton.userbaseinfo != undefined && GameMgr.singleton.userbaseinfo.currency != undefined)
            this.gg1Money.setString(this.chgString2(this.Data1.amount) + GameMgr.singleton.userbaseinfo.currency);
        else
            this.gg1Money.setString(this.chgString2(this.Data1.amount));

        this.gg1BtnOK.setVisible(true);
    },

    showGiftGame1 : function (bcanshow) {
        if(this.GameLayer1 == undefined)
            return false;

        if(this.Data1 == undefined) {
            this.setState1(-1);
            return false;
        }

        this.refreshDisplay1();

        if(bcanshow == undefined || bcanshow) {
            if(this.iState1 < 0) {
                this.setState1(0);
            }
            else if(this.iState1 == 3 && this.iGG1Bet <= 0) {
                this.setState1(4);
            }
            // else if(this.iState == 2) {
            //     if(this.Data.lastnums <= 0) {
            //         this.setState(3);
            //     }
            // }
        }

        return true;
    },

    update_gg1 : function (dt) {
        if(this.iState1 == 1) {
            if(!this.GameLayer.action.isPlaying()) {
                this.Data1 = undefined;
                this.setState1(-1);
                GameMgr.singleton.leftGiftGame1();
                this.showGiftGame(true);
            }
        }
        else if(this.iState1 == 3) {
            if(!this.GameLayer.action.isPlaying()) {
                this.gg1Back.setVisible(false);
            }
        }
    },
});

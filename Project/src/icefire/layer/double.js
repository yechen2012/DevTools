/**
 * Created by ssscomic on 2016/8/6.
 */

var NarutoDoubleLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (gamelayer) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var doublelayer = ccs.load(res.NarutoDoubleLayer_json);
        this.addChild(doublelayer.node);

        this.gamelayer = gamelayer;

        var btnSelect0 = findNodeByName(doublelayer.node, "btnSelect0");
        btnSelect0.addTouchEventListener(this.onTouchSelect0, this);
        btnSelect0.setVisible(false);
        this.btnSelect0 = btnSelect0;

        var btnSelect1 = findNodeByName(doublelayer.node, "btnSelect1");
        btnSelect1.addTouchEventListener(this.onTouchSelect1, this);
        btnSelect1.setVisible(false);
        this.btnSelect1 = btnSelect1;

        var btnReturn = findNodeByName(doublelayer.node, "btnReturn");
        btnReturn.addTouchEventListener(this.onTouchReturn, this);
        btnReturn.setVisible(false);
        this.btnReturn = btnReturn;

        var textNum = findNodeByName(doublelayer.node, "textNum");
        textNum.setVisible(false);
        this.textNum = textNum;

        var textDouble = findNodeByName(doublelayer.node, "textDouble");
        textDouble.setVisible(false);
        this.textDouble = textDouble;

        this.lstHistorySprite = [];

        for(var ii = 0; ii < 5; ++ii) {
            var lst = [];
            for(var jj = 0; jj < 2; ++jj) {
                var spr = findNodeByName(doublelayer.node, "sprHistory" + ii.toString() + jj.toString());
                spr.setVisible(false);
                lst.push(spr);
            }
            this.lstHistorySprite.push(lst);
        }

        var sprCardBack = findNodeByName(doublelayer.node, "sprCardBack");
        sprCardBack.setVisible(false);
        this.sprCardBack = sprCardBack;

        this.lstCardSprite = [];

        for(var ii = 0; ii < 2; ++ii) {
            var spr = findNodeByName(doublelayer.node, "sprCard" + ii.toString());
            spr.setVisible(false);
            this.lstCardSprite.push(spr);
        }

        var nodAni = findNodeByName(doublelayer.node, "nodAni");
        this.nodAni = nodAni;

        this.iGameState = 0;        //! 0界面打开 1界面初始化完成 2选择完成 3收到结果

        this.iAniState = 0;         //! 0牌消失动画 1烟雾动画 2结果动画
        this.curAni = undefined;
        this.curResultAni = undefined;

        this.iResultCard = undefined;
        this.bGameEnd = false;     //! 游戏是否已经结束了
        this.bFull = false;         //! 是否已经满了
        this.ShowResultTime = 0;   //! 显示结果的时间
        this.ChgBetTime = 0;        //! 改变文字的时间
        this.iCurBet = 0;           //! 当前注
        this.lstHistory = [];

        this.BtnScale = [ 1, 1.05];
        this.BtnScaleTime = 1;
        this.BtnAniTime = 0;

        this.scheduleUpdate();
    },

    update : function(dt) {
        if(this.ShowResultTime > 0) {
            this.ShowResultTime -= dt;

            if(this.ShowResultTime <= 0) {
                this.ShowResultTime = 0;
                this.refreshResult();
            }
        }

        if(this.ChgBetTime > 0) {
            this.ChgBetTime -= dt;

            if(this.ChgBetTime <= 0) {
                this.ChgBetTime = 0;

                if(!this.bGameEnd) {
                    var curbet = this.gamelayer.chgString(this.iCurBet);
                    var doublebet = this.gamelayer.chgString(this.iCurBet * 2);

                    this.textNum.setVisible(true);
                    this.textNum.setString("￥" + curbet);

                    this.textDouble.setVisible(true);
                    this.textDouble.setString("￥" + doublebet);
                }
            }
        }

        this.update_Ani(dt);
    },

    update_Ani : function(dt) {
        this.update_BtnAni(dt);

        if(this.iGameState == 2) {
            if(this.iAniState == 0 || this.iAniState == 1) {
                if(this.curAni.action.getCurrentFrame() == this.curAni.action.getDuration()) {
                    if(this.iResultCard != undefined) {
                        this.playResultAni(this.iResultCard);
                        this.ShowResultTime = 2;
                        this.ChgBetTime = 27 / 24;

                        if(this.bGameEnd) {
                            this.textNum.setString("￥0");
                            this.textDouble.setString("￥0");
                        }
                    }
                    else {
                        this.playSmokeAni();
                    }
                }
            }
            else if(this.iAniState == 2) {
            }
        }
    },

    update_BtnAni : function(dt) {
        this.BtnAniTime += dt;

        var ctime = (Math.floor(this.BtnAniTime * 10000) % Math.floor(this.BtnScaleTime * 10000)) / 10000;

        if(ctime > this.BtnScaleTime / 2) {
            ctime = this.BtnScaleTime - ctime;
        }

        var bscale = this.BtnScale[0] + (this.BtnScale[1] - this.BtnScale[0]) * ctime / (this.BtnScaleTime / 2);
        this.btnSelect0.setScale(bscale);

        ctime = this.BtnScaleTime / 2 - ctime;

        bscale = this.BtnScale[0] + (this.BtnScale[1] - this.BtnScale[0]) * ctime / (this.BtnScaleTime / 2);
        this.btnSelect1.setScale(bscale);
    },

    onSGameInfo : function (msgobj) {
        if(this.iGameState == 0) {
            this.btnSelect0.setVisible(true);
            this.btnSelect1.setVisible(true);
            //this.btnReturn.setVisible(true);

            var curbet = this.gamelayer.chgString(msgobj.sgi.curbet);
            var doublebet = this.gamelayer.chgString(msgobj.sgi.curbet * 2);

            this.textNum.setVisible(true);
            this.textNum.setString("￥" + curbet);

            this.textDouble.setVisible(true);
            this.textDouble.setString("￥" + doublebet);

            this.sprCardBack.setVisible(true);

            if(msgobj.sgi.pokerarr != undefined && msgobj.sgi.pokerarr.length > 0) {
                this.lstHistory = [];

                for (var ii = 0; ii < msgobj.sgi.pokerarr.length; ++ii) {
                    this.lstHistory.push(msgobj.sgi.pokerarr[ii].color);
                }
            }

            this.refreshHistory();
            this.btnReturn.setVisible(this.lstHistory.length > 0);
        }
        else if(this.iGameState == 2) {
            if(msgobj.sgi.pokerarr != undefined && msgobj.sgi.pokerarr.length > 0) {
                var lindex = msgobj.sgi.pokerarr.length - 1;

                this.iResultCard = msgobj.sgi.pokerarr[lindex].color;

                // this.btnSelect0.setVisible(true);
                // this.btnSelect1.setVisible(true);
                //
                // var curbet = this.gamelayer.chgString(msgobj.sgi.curbet);
                // var doublebet = this.gamelayer.chgString(msgobj.sgi.curbet * 2);
                //
                // this.textNum.setVisible(true);
                // this.textNum.setString("￥" + curbet);
                //
                // this.textDouble.setVisible(true);
                // this.textDouble.setString("￥" + doublebet);

                this.lstHistory = [];

                for(var ii = 0; ii < msgobj.sgi.pokerarr.length; ++ii) {
                    this.lstHistory.push(msgobj.sgi.pokerarr[ii].color);
                }
            }

            this.bGameEnd = (msgobj.sgi.failindex >= 0);
            this.iCurBet = msgobj.sgi.curbet;
            this.bFull = (msgobj.sgi.isfull == 1);
        }
    },

    onTouchSelect0 : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.playBtnSound();
        this.selectCard(0);
    },

    onTouchSelect1 : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.playBtnSound();
        this.selectCard(1);
    },

    selectCard : function (card) {
        this.iGameState = 2;

        this.btnSelect0.setVisible(false);
        this.btnSelect1.setVisible(false);
        this.btnReturn.setVisible(false);
        this.sprCardBack.setVisible(false);
        this.lstCardSprite[0].setVisible(false);
        this.lstCardSprite[1].setVisible(false);

        this.iResultCard = undefined;

        this.iAniState = 0;

        if(this.curAni != undefined) {
            this.curAni.node.stopAllActions();
            this.curAni.node.getParent().removeChild(this.curAni.node);
            this.curAni = undefined;
        }

        var ani = ccs.load(res.NarutoDoubleAni1_json);
        this.nodAni.addChild(ani.node);
        ani.node.runAction(ani.action);
        ani.action.gotoFrameAndPlay(0, ani.action.getDuration(), false);
        this.curAni = ani;

        MainClient.singleton.sgamectrl(GameMgr.singleton.getCurGameID(), "pokerrb", "play", card, function(isok) {
        });
    },

    onTouchReturn : function(sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.playBtnSound();
        this.gamelayer.leftDouble(!this.bGameEnd);
    },

    playSmokeAni : function () {
        this.iAniState = 1;

        if(this.curAni != undefined) {
            this.curAni.node.stopAllActions();
            this.curAni.node.getParent().removeChild(this.curAni.node);
            this.curAni = undefined;
        }

        var ani = ccs.load(res.NarutoDoubleAni2_json);
        this.nodAni.addChild(ani.node);
        ani.node.runAction(ani.action);
        ani.action.gotoFrameAndPlay(0, ani.action.getDuration(), false);
        this.curAni = ani;
    },

    playResultAni : function (card) {
        this.iAniState = 2;

        if(this.curAni != undefined) {
            this.curAni.node.stopAllActions();
            this.curAni.node.getParent().removeChild(this.curAni.node);
            this.curAni = undefined;
        }

        var ani = ccs.load(res["NarutoDoubleAni" + (card + 3) + "_json"]);
        this.nodAni.addChild(ani.node);
        ani.node.runAction(ani.action);
        ani.action.gotoFrameAndPlay(0, ani.action.getDuration(), false);
        this.curAni = ani;

        if(this.curResultAni != undefined) {
            this.curResultAni.node.stopAllActions();
            this.curResultAni.node.getParent().removeChild(this.curResultAni.node);
            this.curResultAni = undefined;
        }

        var rindex = 5;

        if(this.bGameEnd)
            rindex = 6;

        var rani = ccs.load(res["NarutoDoubleAni" + rindex + "_json"]);
        this.nodAni.addChild(rani.node);
        rani.node.runAction(rani.action);
        rani.action.gotoFrameAndPlay(0, rani.action.getDuration(), false);
        this.curResultAni = rani;
    },

    refreshResult : function() {
        if(this.bGameEnd) {
            this.gamelayer.leftDouble(!this.bGameEnd);
        }
        else {
            if(this.curAni != undefined) {
                this.curAni.node.stopAllActions();
                this.curAni.node.getParent().removeChild(this.curAni.node);
                this.curAni = undefined;
            }

            if(this.curResultAni != undefined) {
                this.curResultAni.node.stopAllActions();
                this.curResultAni.node.getParent().removeChild(this.curResultAni.node);
                this.curResultAni = undefined;
            }

            this.btnSelect0.setVisible(!this.bFull);
            this.btnSelect1.setVisible(!this.bFull);
            this.btnReturn.setVisible(true);
            this.sprCardBack.setVisible(true);

            this.refreshHistory();
        }
    },

    refreshHistory : function () {
        for(var ii = 0; ii < this.lstHistorySprite.length; ++ii) {
            for(var jj = 0; jj < this.lstHistorySprite[ii].length; ++jj) {
                this.lstHistorySprite[ii][jj].setVisible(false);
            }
        }

        var cindex = 0;

        if(this.lstHistory.length > 5)
            cindex = this.lstHistory.length - 5;

        for(var ii = 0; ii < this.lstHistorySprite.length; ++ii) {
            if(cindex >= this.lstHistory.length)
                break;

            var jj = this.lstHistory[cindex];
            this.lstHistorySprite[ii][jj].setVisible(true);
            ++cindex;
        }
    },

    playBtnSound : function () {
        this.gamelayer.playBtnSound();
    },
});

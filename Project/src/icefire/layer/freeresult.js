/**
 * Created by ssscomic on 2016/8/10.
 */

var IceFireFreeGameLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (gamelayer, freenum, freewin, cnum, itype, nodeFreeResult1, nodeFreeResult2) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        this.gamelayer = gamelayer;

        this.iCurNum = cnum;

        this.iFreeType = itype;

        this.bCanTouch = false;

        this.ModuleUI = gamelayer.ModuleUI;

        if(this.FreeResultLayer1 == undefined){
            this.FreeResultLayer1 = ccs.load(res.IceFireGameNodeFreeResult_json);
            this.FreeResultLayer1.node.runAction(this.FreeResultLayer1.action);

            nodeFreeResult1.addChild(this.FreeResultLayer1.node);

            this.nodeFreeResult1 = nodeFreeResult1;
        }

        if(this.FreeResultLayer2 == undefined){
            this.FreeResultLayer2 = ccs.load(res.IceFireGameNodeFreeResult2_json);
            this.FreeResultLayer2.node.runAction(this.FreeResultLayer2.action);

            nodeFreeResult2.addChild(this.FreeResultLayer2.node);

            this.nodeFreeResult2 = nodeFreeResult2;

            this.aniIceA = findNodeByName(this.FreeResultLayer2.node, "aniIceA");
            this.aniIceA.setVisible(false);

            this.aniFireB = findNodeByName(this.FreeResultLayer2.node, "aniFireB");
            this.aniFireB.setVisible(false);
        }

        if(itype < 0 && this.FreeResultLayer3 == undefined){
            this.FreeResultLayer3 = CcsResCache.singleton.load(res.IceFireGameNodeFreeGameAni2_json);
            this.FreeResultLayer3.node.runAction(this.FreeResultLayer3.action);
            this.FreeResultLayer3.action.gotoFrameAndPlay(0, this.FreeResultLayer3.action.getDuration(), true);

            nodeFreeResult2.addChild(this.FreeResultLayer3.node);
            this.nodeFreeResult2 = nodeFreeResult2;
        }

        if(this.aniBanner == undefined){
            this.aniBanner = findNodeByName(this.FreeResultLayer1.node, "aniBanner");
        }
        this.aniBanner.setVisible(false);

        var textFreeWinNums = findNodeByName(this.FreeResultLayer1.node, "textFreeWinNums");
        if(freewin <= 0)
            textFreeWinNums.setString('0');
        else{
            textFreeWinNums.setString(gamelayer.chgString(freewin));
            //textFreeWinNums.setString(this.ModuleUI.getCoinOrCashNumber(freewin, false));
        }

        this.textFreeWin = textFreeWinNums;

        //var textFreeWinInfo = findNodeByName(this.FreeResultLayer1.node, "textFreeWinInfo");
        textFreeWinInfo = gamelayer.GameCanvasMgr.initTextEx("textFreeWinInfo", "textFreeWinInfo");
        textFreeWinInfo.setFontName('Ubuntu_M');
        textFreeWinInfo.setMultiLine(false);
        LanguageData.instance.showTextStr("sfs_summary_amount_won1",textFreeWinInfo);

        this.FreeGameAniFrameName = ['fireresult1', 'fireresult2', 'iceresult1', 'iceresult2'];

        this.nodeLong = findNodeByName(this.FreeResultLayer1.node, "nodeLong");
        this.aniSpine = sp.SkeletonAnimation.createWithJsonFile(res.IceFireMianFeiYouXi_json, res.IceFireMianFeiYouXi_atlas);
        this.nodeLong.addChild(this.aniSpine);

        var sprBack = findNodeByName(this.FreeResultLayer1.node, "sprBack");
        this.sprBack = sprBack;

        if(itype == 0){
            this.iFreeGameAniIndex = 2;

            this.aniSpine.setAnimation(0, 'icefire_mianfeiyouxi1', true);
        }
        else if(itype == 1){
            this.iFreeGameAniIndex = 0;

            this.aniSpine.setAnimation(0, 'icefire_mianfeiyouxi2', true);
        }
        else{
            this.iFreeGameAniIndex = 1;

            this.nodeLong.setVisible(false);
            this.sprBack.setVisible(false);
        }
        this.setFreeResultAni(false);
    },

    update:function(dt){
        if(this.FreeResultLayer1.action.getCurrentFrame() >= this.FreeResultLayer1.action.getEndFrame()){
            if(this.iFreeGameAniIndex == 0 || this.iFreeGameAniIndex == 2){
                this.iFreeGameAniIndex = 1;

                this.bCanTouch = true;

                this.aniIceA.setVisible(true);
                this.aniFireB.setVisible(true);
                if(this.iFreeType == 0){
                    this.aniIceA.animation.play('lan1_1', -1, true);
                    this.aniFireB.animation.play('lan1_2', -1, false);
                    this.aniFireB.animation.setMovementEventCallFunc(function(sender, type, movenentID){
                        if(type === ccs.MovementEventType.complete){
                            this.aniFireB.animation.play('lan1_3', -1, true);
                        }
                    }.bind(this), this);
                }
                else{
                    this.aniIceA.animation.play('hong1_2', -1, false);
                    this.aniFireB.animation.play('hong1_1', -1, true);
                    this.aniIceA.animation.setMovementEventCallFunc(function(sender, type, movenentID){
                        if(type === ccs.MovementEventType.complete){
                            this.aniIceA.animation.play('hong1_3', -1, true);
                        }
                    }.bind(this), this);
                }
            }
            else if(this.iFreeGameAniIndex == 1){
                this.iFreeGameAniIndex = -1;

                this.bCanTouch = true;

                if(this.iCurNum >= 5){
                    this.aniBanner.setVisible(true);
                    this.aniBanner.animation.play('wait_1', -1, false);
                }
            }
        }

        this.aniSpine.setPremultipliedAlpha(this.nodeLong.getOpacity());
    },

    setFreeResultAni:function(bloop){
        if(this.iFreeGameAniIndex < 0 || this.iFreeGameAniIndex > this.FreeGameAniFrameName.length - 1)
            return;

        this.FreeResultLayer1.action.play(this.FreeGameAniFrameName[this.iFreeGameAniIndex], bloop);
        this.FreeResultLayer2.action.play(this.FreeGameAniFrameName[this.iFreeGameAniIndex], bloop);
    },

    refreshStatus:function(gamelayer, freenum, freewin, cnum, itype){
        if(this.textFreeWin != undefined && this.textFreeWin != null){
            this.textFreeWin.setString(gamelayer.chgString(freewin));
            //this.textFreeWin.setString(gamelayer.ModuleUI.getCoinOrCashNumber(freewin, false));
        }

        if(itype == 0){
            this.iFreeGameAniIndex = 2;

            this.aniSpine.setAnimation(0, 'icefire_mianfeiyouxi1', true);

            this.sprBack.setVisible(true);
            this.nodeLong.setVisible(true);

            if(this.FreeResultLayer3 != undefined){
                CcsResCache.singleton.release(this.FreeResultLayer3);
                this.FreeResultLayer3 = undefined;
            }
        }
        else if(itype == 1){
            this.iFreeGameAniIndex = 0;

            this.aniSpine.setAnimation(0, 'icefire_mianfeiyouxi2', true);

            this.sprBack.setVisible(true);
            this.nodeLong.setVisible(true);

            if(this.FreeResultLayer3 != undefined){
                CcsResCache.singleton.release(this.FreeResultLayer3);
                this.FreeResultLayer3 = undefined;
            }
        }
        else{
            this.iFreeGameAniIndex = 1;
            this.nodeLong.setVisible(false);
            this.sprBack.setVisible(false);

            if(this.FreeResultLayer3 == undefined){
                this.FreeResultLayer3 = CcsResCache.singleton.load(res.IceFireGameNodeFreeGameAni2_json);
                this.FreeResultLayer3.node.runAction(this.FreeResultLayer3.action);
                this.FreeResultLayer3.action.gotoFrameAndPlay(0, this.FreeResultLayer3.action.getDuration(), true);

                this.nodeFreeResult2.addChild(this.FreeResultLayer3.node);
            }
        }

        this.bCanTouch = false;

        this.setFreeResultAni(false);

        this.aniBanner.setVisible(false);

        this.aniIceA.setVisible(false);

        this.aniFireB.setVisible(false);

        this.iCurNum = cnum;
        this.iFreeType = itype;
    },

    onTouchOK : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if(this.bEnd)
            return;

        this.bEnd = true;
        this.gamelayer.leftFreeResult();
        //this.setPlayEndAni();
        this.nodeAni2.setVisible(false);

        if(this.aniSpine){
            this.aniSpine.setAnimation(0, 'jiesuan3', false);
        }

    },
});

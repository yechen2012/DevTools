
var CommonMenuBarLayer = cc.Layer.extend({
    sprite:null,
    ctor:function (name, gamelayer) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var layer = ccs.load(res.CommonMenuBarLayer_json);
        this.addChild(layer.node);
        this.Layer = layer;

        this.nodeSetup = findNodeByName(this.Layer.node, "nodeSetup");
        this.Setup = ccs.load(res.CommonMenuBarSetup_json);
        this.nodeSetup.addChild(this.Setup.node);
        this.Setup.node.runAction(this.Setup.action);

        this.lstsetupanitime = [[0,5],[10,17],[20,25],[30,37]];

        this.laySetup = findNodeByName(this.Layer.node, "laySetup");
        this.laySetup.addTouchEventListener(this.onTouchClick, this);

        var btnHistory = findNodeByName(this.Layer.node, "btnHistory");
        btnHistory.addTouchEventListener(this.onTouchHistory, this);
        btnHistory.setVisible(g_clienttype != 1);

        var btnHelp = findNodeByName(this.Layer.node, "btnHelp");
        btnHelp.addTouchEventListener(this.onTouchHelp, this);
        btnHelp.setVisible(g_clienttype != 1);

        this.iRefreshTime = 0.01;
        this.textTime = findNodeByName(this.Layer.node, "textTime");

        if(this.textTime != undefined && this.textTime != null)
            this.textTime.setString('');

        this.textCurrency = findNodeByName(this.Layer.node, "textCurrency");

        if(this.textCurrency != undefined && this.textCurrency != null)
            this.textCurrency.setVisible(false);

        this.nodeUserNotice = findNodeByName(this.Layer.node, "nodeUserNotice");

        if(this.nodeUserNotice) {
            this.UserNotice = ccs.load(res.CommonMenuBarUserNotice_json);
            this.nodeUserNotice.addChild(this.UserNotice.node);
            this.UserNotice.node.runAction(this.UserNotice.action);
            this.textUserNotice = findNodeByName(this.UserNotice.node, "textUserNotice");
            this.richUserNotice = new ccui.RichText();
            this.textUserNotice.addChild(this.richUserNotice);
            // this.richUserNotice.ignoreContentAdaptWithSize(false);
            // this.richUserNotice.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            // this.nodeUserNotice.setCascadeColorEnabled(true);
            // this.nodeUserNotice.setCascadeOpacityEnabled(true);
            // this.textUserNotice.setCascadeColorEnabled(true);
            // this.textUserNotice.setCascadeOpacityEnabled(true);
            this.richUserNotice.setCascadeColorEnabled(true);
            this.richUserNotice.setCascadeOpacityEnabled(true);
            this.UserNotice.action.gotoFrameAndPlay(0, 4, false);
            //this.UserNotice.action.gotoFrameAndPlay(0, 21, true);

            this.lstUserNotice = [];
            this.iUserNoticeTime = 0;
            this.iUserRichElemmentNums = 0;
            this.lstUserLogo = [];

            // var re1 = new ccui.RichElementText(0, {r:255, g:197, b:84}, 255, "尊贵的", "Microsoft YaHei", 18);
            // this.richUserNotice.pushBackElement(re1);
            // ++this.iUserRichElemmentNums;
            //
            // var re2 = new ccui.RichElementImage(0, {r:255, g:255, b:255}, 255, res['CommonMenuBarUserLogo1']);
            // this.richUserNotice.pushBackElement(re2);
            // ++this.iUserRichElemmentNums;
            //
            // var re3 = new ccui.RichElementText(0, {r:255, g:197, b:84}, 255, 'zhs007' + '上线了！', "Microsoft YaHei", 18);
            // this.richUserNotice.pushBackElement(re3);
            // ++this.iUserRichElemmentNums;

            // var index = Math.floor(Math.random() * 6) + 1;
            // this.addUserNotice(COMMON_URLROOT + 'menubar_img_userlogo' + index + '.png', 'T_ZHS**007');
        }

        this.btnFunPlay = findNodeByName(this.Layer.node, "btnFunPlay ");

        if(this.btnFunPlay) {
            this.btnFunPlay.addTouchEventListener(this.onTouchFunPlay, this);

            if(typeof(IS_FUNPLAY) != 'undefined' && IS_FUNPLAY == false)
                this.btnFunPlay.setVisible(false);
            else if(g_isguest != undefined && g_isguest)
                this.btnFunPlay.setVisible(true);
            else
                this.btnFunPlay.setVisible(false);

            this.iRunNums = 0;
        }

        this.scheduleUpdate();

        this.GameName = name;
        this.GameLayer = gamelayer;

        this.iSetupState = -1;       //! 0不显示 1出现 2显示 3消失
        this.setSetupState(0);

        this.iTestTime = 0;

        this.setVisible(false);

        return true;
    },

    playBtnSound : function () {
        if(this.GameLayer != undefined && this.GameLayer.playBtnSound != undefined)
            this.GameLayer.playBtnSound();
    },

    onTouchSetup : function () {
        if (this.iSetupState == 0)
            this.setSetupState(1);
        else if (this.iSetupState == 2)
            this.setSetupState(3);
    },

    onTouchClick : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if (this.iSetupState != 2)
            return ;

        this.setSetupState(3);
    },

    onTouchHistory : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.playBtnSound();

        if(g_isguest != undefined && g_isguest && this.btnFunPlay) {
            this.openRealModeDlg();
        }
        else {
            open_history(g_bkurl);
        }
    },

    onTouchHelp : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.playBtnSound();
        open_help();
    },

    setSetupState : function (state) {
        this.iSetupState = state;

        this.Setup.action.gotoFrameAndPlay(this.lstsetupanitime[state][0], this.lstsetupanitime[state][1], false);
    },

    showSoundTips : function () {
        var layer = new MenuBarSoundTipsLayer(this);
        this.addChild(layer, 1);
        this.setSetupState(2);
    },

    setPlaySound : function (bplay) {
        if(this.GameLayer != undefined && this.GameLayer.setPlaySound != undefined)
            this.GameLayer.setPlaySound(bplay);

        this.setSetupState(3);
    },

    update : function(dt) {
        // this.richUserNotice._formatTextDirty = true;
        // this.richUserNotice.formatText();

        this.update_UserNotice(dt);

        if(this.iSetupState == 1) {
            if(this.Setup.action.getCurrentFrame() == this.lstsetupanitime[this.iSetupState ][1])
                this.setSetupState(2);
        }
        else if(this.iSetupState == 3) {
            if(this.Setup.action.getCurrentFrame() == this.lstsetupanitime[this.iSetupState ][1])
                this.setSetupState(0);
        }

        if(this.textTime != undefined && this.textTime != null) {
            this.iRefreshTime -= dt;

            if(this.iRefreshTime <= 0) {
                this.iRefreshTime = 1;

                var date = new Date(NetTime.singleton.getCurNetTime() * 1000);
                var tmpstr = '';
                var h = date.getHours();

                if(h < 10) {
                    tmpstr = '0';
                }

                tmpstr += h.toString() + ':';

                var m = date.getMinutes();

                if(m < 10) {
                    tmpstr += '0';
                }

                tmpstr += m.toString();

                this.textTime.setString(tmpstr);

                //! this.sprCurrency
                if(this.textCurrency != undefined && this.textCurrency != null) {
                    if(!this.textCurrency.isVisible()) {
                        if(GameMgr.singleton.userbaseinfo != undefined && GameMgr.singleton.userbaseinfo.currency != undefined) {
                            //GameMgr.singleton.userbaseinfo.currency = 'CNY';

                            this.textCurrency.setString(GameMgr.singleton.userbaseinfo.currency);
                            this.textCurrency.setVisible(true);
                        }
                    }
                }
            }
        }

        //cc.view._resizeEvent();
        // this.iTestTime += dt;
        //
        // if(this.iTestTime > 1) {
        //     cc.view._resizeEvent();
        //     this.iTestTime = 0;
        // }
    },

    onUserNoticeMsg : function (msg) {
        //this.addUserNotice(COMMON_URLROOT + 'menubar_img_userlogo' + msg.pictureName, msg.playerName);
        this.addUserNotice(msg.pictureName, msg.playerName);
    },

    loadUserLogo : function (urllogo) {
        for(var ii = 0; ii < this.lstUserLogo.length; ++ii) {
            var node = this.lstUserLogo[ii];

            if(node.urllogo == urllogo)
                return ;
        }

        var node = {};

        node.urllogo = urllogo;
        node.iloadstate = 0;     //! 0未下载 1载入中 2载入完成
        node.iloadtime = 0;
        node.iloadnums = 0;

        this.lstUserLogo.push(node);

        this._loadrUserLogo(node);
    },

    _loadrUserLogo : function (node) {
        node.iloadstate = 1;

        cc.loader.loadImg(node.urllogo, {isCrossOrigin : true }, function(err,img){
            if(!err) {
                cc.textureCache.handleLoadedTexture(node.urllogo, img);
                node.iloadstate = 2;
            }
            else {
                node.iloadstate = 0;
                node.iloadnums += 1;
                node.iloadtime = 5 * node.iloadnums;
            }
        });
    },

    isUserLogoLoaded : function (urllogo) {
        for(var ii = 0; ii < this.lstUserLogo.length; ++ii) {
            var node = this.lstUserLogo[ii];

            if(node.urllogo == urllogo)
                return node.iloadstate == 2;
        }

        return false;
    },

    addUserNotice : function (urllogo, username) {
        if(!this.nodeUserNotice)
            return ;

        //urllogo = 'https://www.baidu.com/img/xinshouye_034fec51df225fe8410f36ad3f2fccf6.png';
        //urllogo = res['CommonMenuBarUserLogo1'] ;

        this.loadUserLogo(urllogo);

        var node = {};

        node.urllogo = urllogo;
        node.username = username;
        node.time = 0;

        this.lstUserNotice.push(node);
    },

    showUserNotice : function () {
        if(!this.nodeUserNotice)
            return ;

        if(this.lstUserNotice.length <= 0)
            return ;

        // var node = this.lstUserNotice[0];
        // this.lstUserNotice.splice(0, 1);

        var node = undefined;

        for(var ii = 0; ii < this.lstUserNotice.length; ++ii) {
            if(this.lstUserNotice[ii].time > 10 || this.isUserLogoLoaded(this.lstUserNotice[ii].urllogo)) {
                node = this.lstUserNotice[ii];
                this.lstUserNotice.splice(ii, 1);
                break;
            }
        }

        if(node == undefined)
            return ;

        this.iUserNoticeTime = 3;
        this.UserNotice.action.gotoFrameAndPlay(5, 11, false);

        var re1 = new ccui.RichElementText(0, {r:255, g:197, b:84}, 255, "尊贵的", "Microsoft YaHei", 18);
        this.richUserNotice.pushBackElement(re1);
        ++this.iUserRichElemmentNums;

        if(this.isUserLogoLoaded(node.urllogo)) {
            var re2 = new ccui.RichElementImage(0, {r:255, g:255, b:255}, 255, node.urllogo);
            this.richUserNotice.pushBackElement(re2);
            ++this.iUserRichElemmentNums
        };

        var re3 = new ccui.RichElementText(0, {r:255, g:197, b:84}, 255, node.username + '上线了！', "Microsoft YaHei", 18);
        this.richUserNotice.pushBackElement(re3);
        ++this.iUserRichElemmentNums;

        //cc.textureCache.addImage(node.urllogo);
    },

    update_UserNotice : function (dt) {
        if(!this.nodeUserNotice)
            return ;

        // //! 测试
        // if(Math.random() * 100 < 1) {
        //     var index = Math.floor(Math.random() * 6) + 1;
        //
        //     //this.addUserNotice('https://nntiresource.dtservice.org/dtgames/web/common/activity/dt-hero/img/' + index + '.png', 'T_ZHS**007');
        //     this.addUserNotice(COMMON_URLROOT + 'menubar_img_userlogo' + index + '.png', 'T_ZHS**007');
        // }

        // this.richUserNotice._formatTextDirty = true;
        // this.richUserNotice.formatText();

        for(var ii = 0; ii < this.lstUserLogo.length; ++ii) {
            var node = this.lstUserLogo[ii];

            if(node.iloadstate == 0) {
                node.iloadtime -= dt;

                if(node.iloadtime <= 0) {
                    node.iloadtime = 0;
                    this._loadrUserLogo(node);
                }
            }
        }

        for(var ii = 0; ii < this.lstUserNotice.length; ++ii) {
            this.lstUserNotice[ii].time += dt;
        }

        if(this.UserNotice.action.getCurrentFrame() == 21) {
            for(var ii = 0; ii < this.iUserRichElemmentNums; ++ii) {
                this.richUserNotice.removeElement(0);
            }

            this.iUserRichElemmentNums = 0;
            this.UserNotice.action.gotoFrameAndPlay(3, 4, false);
        }

        if(this.iUserNoticeTime <= 0 && this.UserNotice.action.getCurrentFrame() == 4) {
            this.showUserNotice();
            return ;
        }

        if(this.iUserNoticeTime > 0) {
            this.iUserNoticeTime -= dt;

            if(this.iUserNoticeTime <= 0) {
                this.iUserNoticeTime = 0;
                this.UserNotice.action.gotoFrameAndPlay(15, 21, false);
            }
        }
    },

    onTouchFunPlay : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.playBtnSound();
        this.openRealModeDlg();
    },

    openRealModeDlg : function () {
        GameMgr.singleton.bPauseGame1 = true;

        this.dlgRealMode = new MenuBarDlg1(this, StringMgrSys.getString_str("StringDlgRealMode"));
        this.addChild(this.dlgRealMode);
    },

    closeRealModeDle : function (brealmode) {
        if(this.dlgRealMode) {
            this.removeChild(this.dlgRealMode);
        }

        if(brealmode) {
            if(typeof(chg2login) != 'undefined')
                chg2login();

            GameMgr.singleton.bPauseGame1 = false;
        }
        else {
            GameMgr.singleton.bPauseGame1 = false;
        }
    },

    runOne : function (bet) {
        if(this.btnFunPlay && this.btnFunPlay.isVisible()) {
            if(bet > 0)
                ++this.iRunNums;

            if(this.iRunNums >= 30) {
                this.iRunNums = 0;
                this.openRealModeDlg();
            }
        }
    },

    onAutoEnd : function (gamelayer) {
        if(res.CommonMenuBarAutoDlg_json == undefined)
            return ;

        var dlg = new MenuBarAutoDlg(gamelayer);
        gamelayer.addChild(dlg);
    }
});

var MenuBarSoundTipsLayer = cc.Layer.extend({
    ctor:function (gamelayer) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var soundtipslayer = ccs.load(res.CommonMenuBarSoundTips_json);
        this.addChild(soundtipslayer.node);

        this.gamelayer = gamelayer;

        var layClick = findNodeByName(soundtipslayer.node, "layClick");
        layClick.addTouchEventListener(this.onTouchClick, this);

        var btnCloseSound = findNodeByName(soundtipslayer.node, "btnCloseSound");
        btnCloseSound.addTouchEventListener(this.onTouchCloseSound, this);
    },

    onTouchClick : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.getParent().removeChild(this);
    },

    onTouchCloseSound : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.gamelayer.setPlaySound(true);
        this.getParent().removeChild(this);
    },
});

var MenuBarDlg = cc.Layer.extend({
    ctor:function (root, gamelayer, type, type1, strerror) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var dlgnode = ccs.load(res.CommonMenuBarDlg_json);
        this.addChild(dlgnode.node);

        this.gamelayer = gamelayer;
        this.root = root;

        var btnOK = findNodeByName(dlgnode.node, "btnOK");
        btnOK.addTouchEventListener(this.onTouchOK, this);

        var textError = dlgnode.node.getChildByName("textError");
        textError.setFontName("Microsoft YaHei");
        //textError.setVisible(false);
        this.textError = textError;

        this.iType = type;
        this.iTyp1 = type1;

        this.CloseTime = 0;

        if(strerror != undefined)
            this.textError.setString(strerror);
        else
            this.textError.setString("");

        if(this.iType == 1) {
            this.textError.setString(StringMgrSys.getString_str("StringDlgError1"));
            //sprDisconnect.setVisible(true);
        }
        else if(this.iType == 2){
            //this.textError.setString(StringMgrSys.getString_str("StringDlgError2"));
            //sprNotEnough.setVisible(true);

            if(this.iTyp1 == 0)
                this.textError.setString(StringMgrSys.getString_str("StringDlgError2"));
            else if(this.iTyp1 == 1)
                this.textError.setString(StringMgrSys.getString_str("StringDlgError6"));
            else if(this.iTyp1 == 2)
                this.textError.setString(StringMgrSys.getString_str("StringDlgError5"));
        }
        else if(this.iType == 3){
            if(this.iTyp1 == 0) {
                //sprError.setVisible(true);
                textError.setVisible(true);
                //layErrorBack.setVisible(true);
            }
            else if(this.iTyp1 == 1) {
                this.textError.setString(StringMgrSys.getString_str("StringDlgError3"));
                //sprError1.setVisible(true);
            }
            else {
                this.textError.setString(StringMgrSys.getString_str("StringDlgError4"));
                //sprError2.setVisible(true);
                btnOK.setVisible(false);
                this.CloseTime = 2;
            }
        }
        else if(this.iType == 4){
            textError.setVisible(true);
            //layErrorBack.setVisible(true);
        }

        var fsize = this.textError.getFontSize();
        var tsize = this.textError.getVirtualRendererSize();

        if(tsize.height < fsize * 2) {
            this.textError.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        }

        this.scheduleUpdate();
        GameMgr.singleton.bShowMenuBarDlg = true;
    },

    onTouchOK : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.gamelayer.playBtnSound != undefined)
            this.gamelayer.playBtnSound();

        if(this.iType == 1 || this.iType == 3) {
            //! 重启
            //location.reload();
            //self.location = g_mainurl;
            //cc.game.restart();
            refurbish_main();
            return ;
        }

        GameMgr.singleton.bShowMenuBarDlg = false;
        this.root.getParent().removeChild(this.root);
        //this.getParent().removeChild(this);

        if (this.iType == 3 || this.iType == 4) {
            this.gamelayer.ErrorLayer = undefined;
            this.gamelayer.bErrorPause = false;
        }
    },

    update : function (dt) {
        if(this.CloseTime <= 0)
            return ;

        this.CloseTime -= dt;

        if(this.CloseTime <= 0){
            this.CloseTime = 0;
            this.gamelayer.ErrorLayer = undefined;
            GameMgr.singleton.bShowMenuBarDlg = false;
            this.root.getParent().removeChild(this.root);
            //this.getParent().removeChild(this);
        }
    }

});

var MenuBarDlg1 = cc.Layer.extend({
    ctor:function (gamelayer, strerror) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var dlgnode = ccs.load(res.CommonMenuBarDlg1_json);
        this.addChild(dlgnode.node);

        this.gamelayer = gamelayer;

        var btnContinue = findNodeByName(dlgnode.node, "btnContinue");
        btnContinue.addTouchEventListener(this.onTouchContinue, this);

        var btnRealMode = findNodeByName(dlgnode.node, "btnRealMode");
        btnRealMode.addTouchEventListener(this.onTouchRealMode, this);

        var textError = dlgnode.node.getChildByName("textError");
        textError.setFontName("Microsoft YaHei");
        //textError.setVisible(false);
        this.textError = textError;

        if(strerror != undefined)
            this.textError.setString(strerror);
        else
            this.textError.setString("");

        var fsize = this.textError.getFontSize();
        var tsize = this.textError.getVirtualRendererSize();

        if(tsize.height < fsize * 2) {
            this.textError.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        }

        this.scheduleUpdate();
    },

    onTouchContinue : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.gamelayer.playBtnSound != undefined)
            this.gamelayer.playBtnSound();

        this.gamelayer.closeRealModeDle(false);
    },

    onTouchRealMode : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.gamelayer.playBtnSound != undefined)
            this.gamelayer.playBtnSound();

        this.gamelayer.closeRealModeDle(true);
    },

    update : function (dt) {
    }

});

var MenuBarAutoDlg = cc.Layer.extend({
    ctor:function (gamelayer) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var dlgnode = ccs.load(res.CommonMenuBarAutoDlg_json);
        this.addChild(dlgnode.node);

        this.gamelayer = gamelayer;

        var btnClose = findNodeByName(dlgnode.node, "btnClose");
        btnClose.addTouchEventListener(this.onTouchClose, this);

        var btnCancel = findNodeByName(dlgnode.node, "btnCancel");
        btnCancel.addTouchEventListener(this.onTouchClose, this);

        this.lstautonum = [25, 50, 100, 200, 500];
        this.lstBtnAuto = [];

        for(var ii = 0; ii < this.lstautonum.length; ++ii) {
            var btn = findNodeByName(dlgnode.node, "btnAuto" + this.lstautonum[ii]);
            btn.addTouchEventListener(this.onTouchAuto, this);
            this.lstBtnAuto.push(btn);
        }
    },

    onTouchClose : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.gamelayer.playBtnSound != undefined)
            this.gamelayer.playBtnSound();

        this.getParent().removeChild(this);
    },

    onTouchAuto : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.gamelayer.playBtnSound != undefined)
            this.gamelayer.playBtnSound();

        for(var ii = 0; ii < this.lstBtnAuto.length; ++ii) {
            if(this.lstBtnAuto[ii] == sender) {
                if(this.gamelayer.setAuto != undefined) {
                    this.gamelayer.setAuto(this.lstautonum[ii]);
                }
                break;
            }
        }

        this.getParent().removeChild(this);
    },
});

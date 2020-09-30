// var COMMON_URLROOT = "yggpublish/res/";
// var COMMON_SRCROOT = "";
// var ICEFIRE_URLROOT = "yggpublish/res/";
// var ICEFIRE_SRCROOT = "";
//
// var COMMON_RESNAME = "yggpublish/res/resource_common_FuD14uA7ecVahwq-WUyaM3_TzeDj.json";
// var ICEFIRE_RESNAME = "yggpublish/res/resource_icefire_Fj2NZd-6-9gGK6nZf9mFc-sx0aHm.json";

var CHEAT_DATA;

var YggLogic = cc.Class.extend ({
    iconvalue : {
        WILD : 0,
        HIGH_1 : 1,
        HIGH_2 : 2,
        HIGH_3 : 3,
        HIGH_4 : 4,
        LOW_1 : 5,
        LOW_2 : 6,
        LOW_3 : 7,
        LOW_4 : 8,
        LOW_5 : 9,
        SCATTER : 10,
        WILD_HIGH_1 : 1,
        WILD_HIGH_2 : 2,
        WILD_HIGH_3 : 3,
        WILD_HIGH_4 : 4,
        WILD_LOW_1 : 5,
        WILD_LOW_2 : 6,
        WILD_LOW_3 : 7,
        WILD_LOW_4 : 8,
        WILD_LOW_5 : 9,
    },

    fgcurkey : {
        fg0 : 1,
        fg1 : 0,
        fg2 : 2,
        fg3 : 3,
    },

    prcurkey : [1, 0, 2, 3],

    cheatmode : false,
    //cheatdata : '59,57,8,108,85,40 REELS 80,6',       // 出现Wild扩展
    //cheatdata : '26,47,51,23,68,39',                        // 进入免费游戏
    //cheatdata : '12,109,32,23,49,41',                        // 进入免费游戏
    cheatdata1 : '25,63,34,83,66,26',                        // 进入免费游戏
    cheatdata2 : '42,32,31,10,9,4,0,7,1,0,0,0',
    cheatdata3 : '47,103,7,93,33,63 REELS 78 SPIN 23,109,84,70,78,39 SPIN 28,71,14,61,7,35 SPIN 15,11,57,37,42,45 SPIN 15,95,28,35,47,57 SPIN 36,22,68,55,10,19 SPIN 52,107,30,5,80,50 REELS 39 SPIN 34,96,39,49,41,56 SPIN 35,48,38,24,24,40 SPIN 21,13,63,70,86,32 SPIN 69,102,8,62,6,4 REELS 86,83,7,8',
    //cheatdata3 : '47,103,7,93,33,63 REELS 78 SPIN 23,109,84,70,78,39 SPIN 28,71,14,61,7,35 SPIN 15,11,57,37,42,45 SPIN 15,95,28,35,47,57 SPIN 36,22,68,55,10,19 SPIN 52,107,30,5,80,50 REELS 39 SPIN 34,96,39,49,41,56 SPIN 35,48,38,24,24,40 SPIN 21,13,63,70,86,32 SPIN 69,102,8,62,6,4 REELS 86,83,7,8 SPIN 46,54,77,31,45,2',


    ctor: function () {
        //! 游戏部分静态配置
        this.sLine = 30;
        this.sRow = 3;
        this.sCol = 5;
        this.sIconNums = 11;
        this.sBgName = 'elemental_bg';
        this.sFgName = 'elemental_fg';

        this.Config = undefined;
        this.GameReadyRet = undefined;
        this.bInit = false;
        this.bGameReady = false;
        this.bLogin = false;
        this.bAutoSelect = false;

        this._iMaxWinLimit = 500000;
        this._iMaxPay = 2000;
        this._iLines = 25; // 线数

        //! 部分逻辑数据
        this.Paylines = [];
        this.Paytable = [];

        this.SpinCallBack = undefined;
        this.SelectFreeCallBack = undefined;

        this.SpinRet = undefined;
        this.SpinIndex = 0;
        this.TurnWin = 0;

        this.FgName = undefined;
        this.FgNums = 0;
        this.LastNums = 0;
        this.FgTurnNums = 0;
        this.TotalNums = 0;
        this.ExWilds = '';
        this.addFGNums = 0;

        this.bFree = false;
        this.bSuperFree = false;

        //! 记录的下注信息
        this.iCoin = 0;
        this.iAmount = 0;

        this.iRateNum = 2;           //! 小数的位数
        this.iRateValue = 100;       //! 小数的倍数
        this.hasLossLimit = false;
        this.isGameHistoryEnabled = false;

        this.bWaitRestore = false;      //! 是否需要等待用户恢复
        this.bReplay = false;              //! 是否是播放录像
        this.bRestore = false;             //! 是否是恢复数据
        this.iBgTotalWin = 0;             //! 在普通游戏中的赢得
        this.bCollect = false;

        this.iNewBalance = 0;
        this.bChgBalance = false;
        this.bSpin = false;
        this.yggnoticemsg = null;

        this.bPrepaid = false;              //! 当前是否是预付费
        this.iMaxBet = 0;

        this.minimalSpinningTime = 0;       //! Spin最小等待时间
        this.iWaitSpinTime = -1;                  //! 还需要等待的时间

        this.lastGameModuleInfo = undefined;           //! 保留的消息（数据经过调整）
        this.iRealBalance = 0;                                      //! 用户持有真实金额（不考虑下注）
        this.bSendLast = false;                                    //! 是否正在发送保留消息

        //! 免费选择相关
        this.iSelectFGTime = 0;
        this.iSelectFGKey = -1;
        this.iSelectFGMode = -1;
        this.iSelectFGNums = 0;
        this.iSelectFGMul = 0;
        this.iSelectFGSymbols = [];

        this.lstOtherFGNums = [];
        this.iOtherFGNumsIndex = 0;
        this.lstOtherFGMul = [];
        this.iOtherFGMulIndex = 0;
        this.lstOtherFGSymbols = [];
        this.iOtherFGSymbolsIndex = 0;

        this.bShowGambling = false;
        this.bGameExRules = false;

        this.bIsInit = true;

        this.spindata = undefined;

        this.bCanCtrl = true;

        // 新加Config相关
        this.bDisableSkip = false;

        this.lstAutoPlayLevels = undefined;
        this.bGameHistoryVisible = true;
        this.bMenuAudioVisible = true;
        this.bMenuFullScreenVisible = true;
        this.bMenuHomeVisible = true;
        this.bMenuPaytableVisible = true;
        this.bMenuRulesVisible = true;
        this.bMenuSettingsVisible = true;
    },

    onConfig : function (cfg) {
        this.Config = cfg;

        if(cfg.settings.slotConfig.Config.ver)
            console.log('ver :', cfg.settings.slotConfig.Config.ver);

        yggCurrencyFormatter = window.PartnerConnect.PreparedObjectsFactory.getCurrencyFormatter();

        //! 是否显示gambling
        if(this.Config && this.Config.customParameters && this.Config.customParameters.license) {
            var license = this.Config.customParameters.license.toLowerCase();

            if(license == 'agcc')
                this.bShowGambling = true;

            if(license == 'fin') {
                this.bGameExRules = true;
            }

            this._license = license;
        }

        //! Spin最小等待时间
        //if(this.Config && this.Config.settings && this.Config.settings.minimalSpinningTime) {
        //    //this.minimalSpinningTime = this.Config.settings.minimalSpinningTime;       //! Spin最小等待时间
        //    this.minimalSpinningTime = 0;
        //}

        //! 货币单位
        if(this.Config && this.Config.settings && this.Config.settings.currency) {
            var currency = this.Config.settings.currency;
            if (this._license == "cz")
                currency = "CZK";

            if(this.Config.settings.language)
                LanguageData.instance.changeCurrencyLan(this.Config.settings.language, currency);
            else
                LanguageData.instance.changeCurrency(currency);
        }

        //! 放入语言
        if(this.Config && this.Config.translations && this.Config.translations.shared) {
            var langObj = this.Config.translations.shared;
            if (this.Config.translations.game)
                langObj = Object.assign(langObj, this.Config.translations.game);

            LanguageData.instance.loadLanguageJson(langObj);
            LanguageData.instance.refreshShowedText();
        }

        if(this.Config && this.Config.wagers && this.Config.wagers.data && this.Config.wagers.data.length > 0 && this.Config.wagers.data[0].prepaid != undefined){
            this.iPrepaid = this.Config.wagers.data[0].prepaid;

            if(this.Config.wagers.data[0].bets && this.Config.wagers.data[0].bets.length > 0){
                this.iPbetmount = this.Config.wagers.data[0].bets[0].betamount;
            }
        }

        //! 赔付线
        if(cfg.settings && cfg.settings.slotConfig && cfg.settings.slotConfig.Paylines)
            this.Paylines = cfg.settings.slotConfig.Paylines;

        //! 是否需要等待用户恢复
        if(cfg.mode) {
            if(cfg.mode == 'RESTORE')
                this.bWaitRestore = true;
            else if(cfg.mode == 'REPLAY')
                this.bReplay = true;
        }

        //! 赔付倍数
        this.Paytable = [];

        for(var ii = 0; ii < this.sIconNums; ++ii) {
            var pt = [];

            for(var jj = 0; jj < this.sCol; ++jj)
                pt.push(0);

            this.Paytable.push(pt);
        }

        if(cfg.settings && cfg.settings.slotConfig && cfg.settings.slotConfig.Prizes) {
            for(var ii = 0; ii < cfg.settings.slotConfig.Prizes.length; ++ii) {
                var prize = cfg.settings.slotConfig.Prizes[ii];

                var icon = this.iconvalue[prize[0]];
                var ib = 5 - (prize.length - 1);

                if(icon != undefined) {
                    for(var jj = 1; jj < prize.length; ++jj) {
                        this.Paytable[icon][ib + jj] = parseInt(prize[jj]);
                    }
                }
            }
        }

        //是否使用ygg的自动规则
        if(this.Config && this.Config.settings && this.Config.settings.hasLossLimit){
            this.hasLossLimit = this.Config.settings.hasLossLimit;
        }
        //是否使用ygg历史记录
        if(this.Config && this.Config.settings && this.Config.settings.isGameHistoryEnabled){
            this.isGameHistoryEnabled = this.Config.settings.isGameHistoryEnabled;
        }

        //! 是否显示时间
        if(this.Config && this.Config.settings && this.Config.settings.shouldShowClock != undefined){
            this.shouldShowClock = this.Config.settings.shouldShowClock;
        }

        if(this.Config && this.Config.settings && this.Config.settings.clockVisibility != undefined){
            this.clockVisibility = this.Config.settings.clockVisibility;
        }

        //! 是否可以自动
        if(this.Config && this.Config.settings && this.Config.settings.isAutoSpinsDisabled != undefined){
            this.isAutoSpinsDisabled = this.Config.settings.isAutoSpinsDisabled;
        }

        //! 是否显示在线时间
        if (this.Config && this.Config.online_time !== undefined) {
            this.bShowOnlineTime = this.Config.online_time;
        }

        //! 是否只显示欧元（禁用硬币）
        if (this.Config && this.Config.settings && this.Config.settings.areCurrencyCoinsDisabled != undefined) {
            this.bDisableCurrencyCoins = this.Config.settings.areCurrencyCoinsDisabled;
        }

        //var ncfg = this._deepClone(cfg);

        // var str = JSON.stringify(cfg);
        // cc.log(str);

        //var grvalue = gameEmitter.gameReady({defaultBetValue: 6});
        // var strtime = window.PartnerConnect.ClockTime.getTime();
        // var fsreen = this.isFullScreen();
        if(this.Config && this.Config.customParameters && this.Config.customParameters.disableSkip != undefined) {
            this.bDisableSkip = this.Config.customParameters.disableSkip == "yes";
        }


        if (this.Config && this.Config.settings) {
            var settings = this.Config.settings;
            if (settings.autoplayLevels != undefined) {
                this.lstAutoPlayLevels = [];
                for (var i = 0; i < settings.autoplayLevels.length; ++i) {
                    var value = settings.autoplayLevels[i];
                    if (value == "Infinity")
                        value = "∞";

                    this.lstAutoPlayLevels.push(value);
                }
            }

            if (settings.menuVisibility) {
                this.bGameHistoryVisible = settings.menuVisibility.isGameHistoryVisible;
                this.bMenuAudioVisible = settings.menuVisibility.isMenuAudioVisible;
                this.bMenuFullScreenVisible = settings.menuVisibility.isMenuFullScreenVisible;
                this.bMenuHomeVisible = settings.menuVisibility.isMenuHomeVisible;
                this.bMenuPaytableVisible = settings.menuVisibility.isMenuPaytableVisible;
                this.bMenuRulesVisible = settings.menuVisibility.isMenuRulesVisible;
                this.bMenuSettingsVisible = settings.menuVisibility.isMenuSettingsVisible;
            }
        }

        // 处理与证书相关的限制/功能
        if (this._license == "fin") {
            this.isAutoSpinsDisabled = true;
        }

        if (this._license == "co" || this._license == "gib") {
            this.shouldShowClock = true;
        }
    },

    // 是否禁用快速结束
    isDisableSkip: function() {
        return this.bDisableSkip;
    },

    //! 判断游戏是否是特殊规则
    isGameExRules : function () {
        return this.bGameExRules;
    },

    isGameHistoryVisible: function() {
        return this.bGameHistoryVisible;
    },

    isMenuAudioVisible: function() {
        return this.bMenuAudioVisible;
    },

    isMenuFullScreenVisible: function() {
        return this.bMenuFullScreenVisible;
    },

    isMenuHomeVisible: function() {
        return this.isShowHome();
    },

    isMenuPaytableVisible: function() {
        return this.bMenuPaytableVisible;
    },

    isMenuRulesVisible: function() {
        return this.bMenuRulesVisible;
    },

    isMenuSettingsVisible: function() {
        return this.bMenuSettingsVisible;
    },

    //! 判断是否显示gambling
    isShowGambling : function () {
        return this.bShowGambling;
    },

    //! 判断是否全屏
    isFullScreen : function () {
        //return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen;
        //return (document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width);

        if (cc.sys.isMobile) {
            if(cc.screen.fullScreen())
                return true;
        }

        if(this.explorer == undefined){
            this.explorer = window.navigator.userAgent.toLowerCase();
        }

        if(this.explorer.indexOf('firefox') > 0){
            if (window.outerHeight === window.screen.height && window.outerWidth === window.screen.width) {
                return true;
            }
            else {
                return false;
            }
        }
        else{
            if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
                return true;
            }
            else {
                return false;
            }
        }
    },

    //! 是否可以自动转
    canAutoSpin : function () {
        if(this.isAutoSpinsDisabled == undefined)
            return true;

        return !this.isAutoSpinsDisabled;
    },

    //! 是否显示时间
    isShowTime : function () {
        //! 这个判断优先
        if(this.clockVisibility) {
            if(this.clockVisibility == "NEVER")
                return false;

            if(this.clockVisibility == "ALWAYS")
                return true;

            if(this.clockVisibility == "FULLSCREEN")
                return this.isFullScreen();
        }

        //! 全屏必然显示时间
        if(this.isFullScreen())
            return true;

        //! 手机必然显示时间
        if (cc.sys.isMobile)
            return true;

        return this.shouldShowClock;
    },

    //! 获取当前时间
    getTime : function () {
        if(window.PartnerConnect.ClockTime)
            return window.PartnerConnect.ClockTime.getTime();

        return '00:00';
    },

    //获取是否使用ygg的自动规则
    getHasLossLimit : function () {
        return this.hasLossLimit;
    },

    //获取是否使用ygg的历史记录
    getIsGameHistoryEnabled : function () {
        return this.isGameHistoryEnabled;
    },

    //!获取Spin最小等待时间
    getMinimalSpinningTime : function () {
        if(this.Config && this.Config.settings && this.Config.settings.minimalSpinningTime) {
            return this.Config.settings.minimalSpinningTime;
        }
        else
            return 0;
    },

    onGameReadyRet : function (ret) {
        // if(!uiComponents)
        //     uiComponents = slot.uiComponents();
        //
        // var ggee = slot.getGameEventsEmitter();
        // var cah = uiComponents.clickActionHandler();

        if(ret) {
            this.GameReadyRet = ret;

            // if(ret.restoreMode) {
            //     if(ret.restoreMode == 'RESTORE') {
            //
            //     }
            // }
            ////! 根据不同情况恢复不同的消息
            //if(this.GameReadyRet && this.GameReadyRet.restoreMode == 'RESTORE') {
            //    this._restoreBets();
            //
            //    gameEmitter.gameRoundStarted();
            //    gameEmitter.spinStarted();
            //
            //    var gmimsg = this._createGameModuleInfo();
            //
            //    gameEmitter.spinEnded();
            //
            //    gmimsg.mode = this.Config.mode;
            //    GameMgr.singleton.onGameModuleInfo(gmimsg);
            //}
            //else if(this.GameReadyRet && this.GameReadyRet.restoreMode == 'SKIP') {
            //    this._skipBets();
            //
            //    slot.collect({step:this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1})
            //        .then((ret) => {
            //            YggLogic.singleton.onCollect(ret);
            //        })
            //        .catch((err) => {
            //            console.log('collect ', err);
            //        });
            //
            //    //gmimsg = this._createGameModuleInfo();
            //
            //    //if(GameMgr.singleton.curGameLayer == undefined)
            //    //    cc.director.runScene(new GameScene());
            //
            //    //return;
            //}
        }

        this.bGameReady = true;

        var pamount = 0;

        if(ret.nextPrepaid && ret.nextPrepaid.amount)
            pamount = ret.nextPrepaid.amount;

        if(this.iPrepaid && this.iPbetmount)
            pamount = this.iPbetmount;

        this.setPrepaid(pamount);

        if(!this.bLogin && this.bInit)
            this._login();

        //! 恢复之前的局面视为prepaid
        //if(this.GameReadyRet && this.GameReadyRet.restoreMode == 'RESTORE' || this.GameReadyRet.restoreMode == 'SKIP')
        //    this.bPrepaid = true;

        if(this.iTotalBet) {
            this.sendTotalBetChanged(this.iTotalBet);
        }

        // ret.nextPrepaid = {};
        // ret.nextPrepaid.amount = 0.12;;

        if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
            GameMgr.singleton.curGameLayer.ModuleUI._setState('gameready', 'ready');
    },

    init : function () {
        this.bInit = true;

        // 文档上说是快要结束时就可以调用了
        gameEmitter.gameLoadingEnded();

        // var data = {title:'title',message:'test',theme:'DARK',primaryButtonText:'OK'};
        // //var popup = new window.PartnerConnect.showPopup();
        // //window.PartnerConnect.showPopup();
        // uiComponents.showPopup(data);

        //gameEmitter.gameReady()
        //    .then((ret) => {
        //        YggLogic.singleton.onGameReadyRet(ret);
        //    })
        //    .catch((err) => {
        //        console.log('spin ', err);
        //    });

        // if(!this.bWaitRestore)
        //     this.getGameReadyRet();

        if(GameMgr.singleton.curGameLayer == undefined)
            cc.director.runScene(new GameScene());

        //if(!this.bLogin && this.bInit)
        //    this._login();

        if(!this.bWaitRestore)
            this._login();
    },

    /*
    * 响应Event事件，spin/init
    * 注：目前的理解是自动旋转一次
    * */
    initSpin: function() {
        var gameLayer = GameMgr.singleton.curGameLayer;
        if (gameLayer && gameLayer.runOne) {
            gameLayer.runOne();
        }
    },

    //! 模拟发送下注消息
    newspin: function (gameid, bet, times, lines, bfree, callback) {
        // slot.play({test:true, cheat:[136,118,246,204,49,66,120,321]})
        //     .then((ret) => {
        //         var cret = ret;
        // });
        // return ;

        //var fsreen = this.isFullScreen();

        this.SpinCallBack = callback;

        if(this.bReplay || this.bRestore) {
            if(this.bRestore && this.isSpinEnd()) {
                this.bCollect = true;
                this._simCollect();
                // slot.collect({step:this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1})
                //     .then((ret) => {
                //         YggLogic.singleton.onCollect(ret);
                //     })
                //     .catch((err) => {
                //         console.log('collect Error ', err);
                //     });
            }
            else {
                //! 录像虚拟提交过程
                if(this.bReplay && this.isSpinEnd()) {
                    this.bWaitCollect = true;       //! 等待提交
                }

                var gmimsg = this._createGameModuleInfo();

                if(gmimsg) {
                    GameMgr.singleton.onGameModuleInfo(gmimsg);
                    this._addFGModuleInfo(gmimsg);

                    if(this.SpinCallBack)
                        this.SpinCallBack(true);

                    this.SpinCallBack = undefined;
                }

                // if(this.bAutoSelect)
                //     this._createSelectKey();
            }
        }
        else if(bet >= 0 && times >= 0 && lines >= 0 && !bfree) {
            //! 真实下注
            var spindata = {};

            this.iCoin = bet / this.iRateValue;

            spindata.coin = bet / this.iRateValue;
            spindata.amount = spindata.coin * lines;
            this.iAmount = spindata.amount;

            // if(CHEAT_DATA && CHEAT_DATA.length > 0) {
            //     spindata.test = true;
            //     spindata.cheat = CHEAT_DATA;
            // }
            // else if(this.cheatmode) {
            //     spindata.test = true;
            //     spindata.cheat = this.cheatdata1;
            // }
            this._addCheat(spindata, 0);

            this.spindata = spindata;
            if(this.minimalSpinningTime <= 0) {
                gameEmitter.gameRoundStarted()
                    .then((ret) => {
                        YggLogic.singleton.onRoundStarted(ret);
                    })
                    .catch((err) => {
                        console.log('gameRoundStarted Error', err);
                    });
            }
            else {
                this.iWaitSpinTime = this.minimalSpinningTime;

                if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
                    GameMgr.singleton.curGameLayer.ModuleUI._setState('waitappear', 1);
            }
        }
        else {
            //! 下一步
            //! 最后一回合需要collect
            if(this.isSpinEnd()) {
                this.bCollect = true;
                this._simCollect();
                // slot.collect({step:this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1})
                //     .then((ret) => {
                //         YggLogic.singleton.onCollect(ret);
                //     })
                //     .catch((err) => {
                //         console.log('collect Error ', err);
                //     });
            }
            else {
                //gameEmitter.spinStarted();

                var gmimsg = this._createGameModuleInfo();

                if(gmimsg) {
                    GameMgr.singleton.onGameModuleInfo(gmimsg);
                    this._addFGModuleInfo(gmimsg);

                    if(this.SpinCallBack)
                        this.SpinCallBack(true);

                    this.SpinCallBack = undefined;
                }

                //gameEmitter.spinEnded();
            }

            // if(this.isSpinEnd()) {
            //     slot.collect({step:this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1})
            //         .then((ret) => {
            //             YggLogic.singleton.onCollect(ret);
            //         })
            //         .catch((err) => {
            //             console.log('collect ', err);
            //         });
            // }
            //
            // var gmimsg = this._createGameModuleInfo();
            //
            // if(gmimsg) {
            //     GameMgr.singleton.onGameModuleInfo(gmimsg);
            //
            //     this.SpinCallBack(true);
            //     this.SpinCallBack = undefined;
            // }
        }
    },

    //! 模拟gamectrl2消息
    gamectrl2: function (gameid, ctrlname, ctrlparam, callback) {
        if(ctrlname == 'selectfree') {
            if(ctrlparam)
                this._selectFree(ctrlparam.curkey, callback);
        }
    },

    _selectFree : function (curkey, callback) {
        //gameEmitter.spinEnded();

        this.SelectFreeCallBack = callback;

        //! 如果是掉线重入，则不发消息，自动选择
        if(this.bAutoSelect) {
            this.iSelectFGTime = 1;
            //this.autoSelectFree();
            //this.bAutoSelect = false;
            return ;
        }

        this.iSelectFGKey = curkey;

        if(this.iSelectFGKey  < 10) {
            var selectdata = {};

            if(curkey == 0) {
                selectdata.cmd = 'FORTUNE';
            }
            else {
                selectdata.cmd = 'GLORY';
            }

            selectdata.step = this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1;
            //selectdata.wagerid = this.SpinRet.wager.wagerid;

            //! 下注数据
            selectdata.coin = this.iCoin;
            selectdata.amount = this.iAmount;

            // if(CHEAT_DATA && CHEAT_DATA.length > 0) {
            //     selectdata.test = true;
            //     selectdata.cheat = CHEAT_DATA;
            // }
            // else if(this.cheatmode) {
            //     selectdata.test = true;
            //     selectdata.cheat = this.cheatdata;
            // }

            // if(this.cheatmode) {
            //     selectdata.test = true;
            //     selectdata.cheat = this.cheatdata2;
            // }

            this._addCheat(selectdata, 1);

            slot.play(selectdata)
                .then((ret) => {
                    YggLogic.singleton.onSelectFreeRet(ret);
                })
                .catch((err) => {
                    console.log('play Error  ', err);
                });
        }
        else if(this.iSelectFGKey < 20){
            var selectdata = {};

            selectdata.cmd = 'BOX' + (this.iSelectFGKey % 10 + 1);

            selectdata.step = this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1;
            //selectdata.wagerid = this.SpinRet.wager.wagerid;

            //! 下注数据
            selectdata.coin = this.iCoin;
            selectdata.amount = this.iAmount;

            // if(CHEAT_DATA && CHEAT_DATA.length > 0) {
            //     selectdata.test = true;
            //     selectdata.cheat = CHEAT_DATA;
            // }
            // else if(this.cheatmode) {
            //     selectdata.test = true;
            //     selectdata.cheat = this.cheatdata;
            // }

            slot.play(selectdata)
                .then((ret) => {
                    YggLogic.singleton.onSelectFreeRet(ret);
                })
                .catch((err) => {
                    console.log('play Error  ', err);
                });
        }
        else {
            this.iSelectFGKey = curkey;

            var selectdata = {};

            selectdata.cmd = 'FEATURE_BOX_' + (this.iSelectFGKey % 10 + 1);

            selectdata.step = this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1;
            //selectdata.wagerid = this.SpinRet.wager.wagerid;

            //! 下注数据
            selectdata.coin = this.iCoin;
            selectdata.amount = this.iAmount;

            // if(CHEAT_DATA && CHEAT_DATA.length > 0) {
            //     selectdata.test = true;
            //     selectdata.cheat = CHEAT_DATA;
            // }
            // else if(this.cheatmode) {
            //     selectdata.test = true;
            //     selectdata.cheat = this.cheatdata;
            // }

            slot.play(selectdata)
                .then((ret) => {
                    YggLogic.singleton.onSelectFreeRet(ret);
                })
                .catch((err) => {
                    console.log('play Error  ', err);
                });
        }
    },

    isSpinEnd : function () {
        var ret = this.SpinRet;
        var ri = this.SpinIndex;

        //! 记录特殊判断
        if(this.bReplay) {
            if(ret.wager.bets.length >= 2) {
                if(ri == ret.wager.bets.length - 2) {
                    var edata = ret.wager.bets[ri].eventdata;

                    if(edata.nextCmds && edata.nextCmds == 'C')
                        return true;
                }
            }
        }

        if(ri < ret.wager.bets.length - 1)
            return false;

        if(ri > ret.wager.bets.length - 1)
            return true;

        var retdata = ret.wager.bets[ri].eventdata;

        if(retdata.nextCmds && retdata.nextCmds == 'GLORY,FORTUNE')
            return false;

        return true;
    },

    //! 判断是否需要collect
    canCollect : function () {
        if(!this.SpinRet)
            return false;

        var edata = this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].eventdata;

        if(!edata || !edata.nextCmds)
            return false;

        return edata.nextCmds == 'C';
    },

    // onCollect : function (ret) {
    //     if(ret) {
    //         // if(ret.resultBal && ret.resultBal.cash)
    //         //     GameMgr.singleton.onMyMoney(Math.round(ret.resultBal.cash * this.iRateValue));
    //
    //         // if((ret.cashRace && ret.cashRace.hasWon) || this.bPrepaid) {
    //         //     // if(ret.resultBal && ret.resultBal.cash)  {
    //         //     //     GameMgr.singleton.onMyMoney(Math.round(ret.resultBal.cash * this.iRateValue));
    //         //     // }
    //         //
    //         //     this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue);
    //         //     this.bChgBalance = true;
    //         // }
    //         // else {
    //         //     this.bChgBalance = false;
    //         // }
    //
    //         if(ret.resultBal && ret.resultBal.cash) {
    //             this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue);
    //             this.bChgBalance = true;
    //             this.iRealBalance = this.iNewBalance;
    //         }
    //
    //         // //! 测试
    //         // if(this.itestMoney == undefined)
    //         //     this.itestMoney = 1000;
    //         // else
    //         //     this.itestMoney += 1000;
    //         //
    //         // this.bChgBalance = true;
    //         // this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue + this.itestMoney);
    //
    //         var gmimsg = this._createGameModuleInfo();
    //
    //         if(gmimsg) {
    //             GameMgr.singleton.onGameModuleInfo(gmimsg);
    //             this._addFGModuleInfo(gmimsg);
    //
    //             this._createLastGameModuleInfo(gmimsg);
    //
    //             if(this.SpinCallBack)
    //                 this.SpinCallBack(true);
    //
    //             this.SpinCallBack = undefined;
    //         }
    //
    //         // gameEmitter.gameRoundEnded();
    //         // gameEmitter.spinEnded();
    //     }
    // },

    //! 调整提交流程
    onCollect : function (ret) {
        if(ret) {
            if(ret.resultBal && ret.resultBal.cash) {
                this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue);
                this.bChgBalance = true;
                this.iRealBalance = this.iNewBalance;

                //! 通知客户端飞钱解锁操作
                if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.setEndCollect){
                    GameMgr.singleton.curGameLayer.setEndCollect();
                }
            }
        }
    },

    onCollect_Replay : function () {
        var ret = this.SpinRet;
        var edata = ret.wager.bets[0].eventdata;

        //this.iNewBalance = 10;
        this.iNewBalance = Math.round(edata.resultBalance * this.iRateValue);
        this.bChgBalance = true;
        this.iRealBalance = this.iNewBalance;

        //! 通知客户端飞钱解锁操作
        if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.setEndCollect){
            GameMgr.singleton.curGameLayer.setEndCollect();
        }
    },

    onRoundStarted : function (ret) {
        gameEmitter.spinStarted()
            .then((ret) => {
                YggLogic.singleton.onSpinStarted(ret);
            })
            .catch((err) => {
                console.log('spinStarted Error ', err);
            });
    },

    onSpinStarted : function (ret) {
        // if(Math.random() > 0.5) {
        //     this._sendLastGameModuleInfo();
        //     return ;
        // }

        this.bSpin = true;
        slot.spin(this.spindata)
            .then((ret) => {
                YggLogic.singleton.onSpinRet(ret);
            })
            .catch((err) => {
                //console.log('spin Error ', err);
                YggLogic.singleton.onSpinError(err);
            });
    },

    onSpinError : function (err) {
        if(err)
            console.log('spin Error ', err);

        this._sendLastGameModuleInfo();

        if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
            GameMgr.singleton.curGameLayer.ModuleUI._setState('gameready', 'ready');
    },

    onSpinRet : function (ret) {
        this.SpinRet = ret;
        this.SpinIndex = 0;
        this.TurnWin = 0;

        if(ret) {
            if(ret.resultBal && ret.resultBal.cash) {
                this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue);
                this.bChgBalance = true;
                this.iRealBalance = this.iNewBalance;
            }

            //! gamemoduleinfo
            if(ret.wager && ret.wager.bets && ret.wager.bets.length > 0) {
                //! 没有中奖的情况
                if(this.isSpinEnd()) {
                    this.bCollect = true;

                    if(this.canCollect()) {
                        this._simCollect();
                        // slot.collect({step:this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1})
                        //     .then((ret) => {
                        //         YggLogic.singleton.onCollect(ret);
                        //     })
                        //     .catch((err) => {
                        //         console.log('collect Error ', err);
                        //     });

                        return ;
                    }
                }

                var gmimsg = this._createGameModuleInfo();

                if(gmimsg) {
                    GameMgr.singleton.onGameModuleInfo(gmimsg);
                    this._addFGModuleInfo(gmimsg);

                    this._createLastGameModuleInfo(gmimsg);
                }
            }

            if(this.SpinCallBack) {
                this.SpinCallBack(true);
                this.SpinCallBack = undefined;
            }
        }
        else {
            if(this.SpinCallBack) {
                this.SpinCallBack(false);
                this.SpinCallBack = undefined;
            }
        }
    },

    onSelectFreeRet : function (ret) {
        if(ret) {
            //var cret = ret;
            this.SpinRet = ret;
            this.SpinIndex = 0;

            //! 创造一个选择的消息
            //var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"icefire2_fg\",\"gameid\":468,\"gmi\":{\"isspinend\":true,\"lastnums\":10,\"totalnums\":10,\"totalwin\":0,\"turnwin\":0,\"turnnums\":0,\"bet\":1,\"lines\":“ + this.iLine  + ”,\"curm\":-1,\"fgnums\":10,\"exwilds\":150,\"curkey\":0}}";
            var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"medusa2_fg\",\"gameid\":498,\"gmi\":{\"isinit\":false,\"lastnums\":0,\"totalwin\":0,\"lstarr\":[[5,5,7,7,3,8],[5,4,4,9,2,4],[6,9,9,3,9,7],[6,9,9,4,6,2]],\"curnums\":0,\"bet\":10,\"lines\":10,\"fgmode\":-1,\"curkey\":-1,\"gameinfo\":{}}}";
            var gmimsg = JSON.parse(gmistr);

            var bdata = ret.wager.bets[0].betdata;
            var edata = ret.wager.bets[0].eventdata;

            if(this.iSelectFGMode < 0) {
                //! 选择类型
                if(bdata.cmd == 'FORTUNE') {
                    this.iSelectFGMode = 0;
                }
                else {
                    this.iSelectFGMode = 1;
                }

                this.iSelectFGKey = 0;
                this.iSelectFGNums = edata.wonFreeSpinNumber;

                this.lstOtherFGNums = [];
                this.iOtherFGNumsIndex = 0;

                for(var ii = 0; ii < edata.otherFreeSpinNumbers.length; ++ii) {
                    this.lstOtherFGNums.push(edata.otherFreeSpinNumbers[ii]);
                }
            }
            else if(this.iSelectFGKey >= 0 && this.iSelectFGKey < 20) {
                if(this.iSelectFGMode == 0) {
                    this.iSelectFGMul = edata.wonMultiplier;

                    this.lstOtherFGMul = [];
                    this.iOtherFGMulIndex = 0;

                    for(var ii = 0; ii < edata.otherMultipliers.length; ++ii) {
                        this.lstOtherFGMul.push(edata.otherMultipliers[ii]);
                    }
                }
                else {
                    if(edata.wonWildSymbols) {
                        this.iSelectFGSymbols = [];

                        for(var ii = 0; ii < edata.wonWildSymbols.length; ++ii) {
                            this.iSelectFGSymbols.push(this.iconvalue[edata.wonWildSymbols[ii]]);
                        }
                    }

                    this.lstOtherFGSymbols = [];
                    this.iOtherFGSymbolsIndex = 0;

                    for(var ii = 0; ii < edata.otherWildSymbols.length; ++ii) {
                        var node = edata.otherWildSymbols[ii];
                        var lst = [];

                        for(var jj = 0; jj < node.length; ++jj) {
                            lst.push(this.iconvalue[node[jj]]);
                        }

                        this.lstOtherFGSymbols.push(lst);
                    }
                }
            }
            else if(this.iSelectFGKey != -2){
                this.iSelectFGKey = -2;

                var selectdata = {};

                selectdata.cmd = 'START_SESSION';

                selectdata.step = this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1;
                //selectdata.wagerid = this.SpinRet.wager.wagerid;

                //! 下注数据
                selectdata.coin = this.iCoin;
                selectdata.amount = this.iAmount;

                // if(CHEAT_DATA && CHEAT_DATA.length > 0) {
                //     selectdata.test = true;
                //     selectdata.cheat = CHEAT_DATA;
                // }
                // else if(this.cheatmode) {
                //     selectdata.test = true;
                //     selectdata.cheat = this.cheatdata;
                // }

                // if(this.cheatmode) {
                //     selectdata.test = true;
                //     selectdata.cheat = this.cheatdata3;
                // }

                this._addCheat(selectdata, 2);

                slot.play(selectdata)
                    .then((ret) => {
                        YggLogic.singleton.onSelectFreeRet(ret);
                    })
                    .catch((err) => {
                        console.log('play Error  ', err);
                    });

                return ;
            }

            // //! 记录免费数据
            // this.iSelectFGKey = gmimsg.gmi.curkey;
            // this.iSelectFGNums = edata.freeSpins + 1;
            // this.iSelectFGMul = edata.fortuneMultiplier;
            //
            // this.iSelectFGSymbols = [];
            //
            // if(edata.gloryWildSymbols) {
            //     for(var ii = 0; ii < edata.gloryWildSymbols.length; ++ii) {
            //         this.iSelectFGSymbols.push(this.iconvalue[edata.gloryWildSymbols[ii]]);
            //     }
            // }

            gmimsg.gmi.curkey = this.iSelectFGKey;
            gmimsg.gmi.fgmode = this.iSelectFGMode;

            if(this.iSelectFGMode == 0) {
                gmimsg.gmi.gameinfo.nums = this.iSelectFGNums;
                gmimsg.gmi.gameinfo.mul = this.iSelectFGMul;
            }
            else {
                gmimsg.gmi.gameinfo.nums = this.iSelectFGNums;
                gmimsg.gmi.gameinfo.symbols = this.iSelectFGSymbols;
            }

            if(this.iSelectFGKey == -2) {
                this.FgNums = this.iSelectFGNums;
                this.LastNums = this.FgNums;
            }

            this.addFGNums = 10;

            // //! 免费次数
            // if(edata.reSpins)
            //     gmimsg.gmi.fgnums = edata.freeSpins;
            // else
            //     gmimsg.gmi.fgnums = edata.freeSpins + 1;
            //
            // this.addFGNums = gmimsg.gmi.fgnums;
            //
            // //! 增加W
            // if(edata.reelSet) {
            //     var bstr = "CascadeFreeSpinsReels";
            //     var eindex = edata.reelSet.indexOf("Wilds");
            //     var numstr = edata.reelSet.substring(bstr.length, eindex);
            //     gmimsg.gmi.exwilds = parseInt(numstr);
            // }

            this.bFree = true;
            //this.FgNums = gmimsg.gmi.fgnums;
            GameMgr.singleton.onGameModuleInfo(gmimsg);

            if(this.SelectFreeCallBack) {
                this.SelectFreeCallBack(true);
                this.SelectFreeCallBack = undefined;
            }
        }
        else {
            if(this.SelectFreeCallBack) {
                this.SelectFreeCallBack(false);
                this.SelectFreeCallBack = undefined;
            }
        }
    },

    //! 创建选择的类型
    _createSelectKey : function () {
        var ret = this.SpinRet;

        if(this.SpinIndex >= ret.wager.bets.length)
            return ;

        var bets = ret.wager.bets[this.SpinIndex];

        var bdata = bets.betdata;
        var edata = bets.eventdata;

        if(this.SpinIndex == 1) {
            //! 选择类型
            if (bdata.cmd == 'FORTUNE') {
                this.iSelectFGKey = 0;
            } else {
                this.iSelectFGKey = 1;
            }
        }
        else if(this.SpinIndex == 2) {
            var bindex = parseInt(bdata.cmd.slice(bdata.cmd.length - 1, bdata.cmd.length)) - 1;
            this.iSelectFGKey = 10 + bindex;
        }
        else if(this.SpinIndex == 3) {
            var bindex = parseInt(bdata.cmd.slice(bdata.cmd.length - 1, bdata.cmd.length)) - 1;
            this.iSelectFGKey = 20 + bindex;
        }

        if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.setSelectType)
            GameMgr.singleton.curGameLayer.setSelectType(this.iSelectFGKey);
    },

    //! 创建选择消息
    _createSelectFreeInfo : function (bets) {
        //! 创造一个选择的消息
        var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"medusa2_fg\",\"gameid\":498,\"gmi\":{\"isinit\":false,\"lastnums\":0,\"totalwin\":0,\"lstarr\":[[5,5,7,7,3,8],[5,4,4,9,2,4],[6,9,9,3,9,7],[6,9,9,4,6,2]],\"curnums\":0,\"bet\":10,\"lines\":10,\"fgmode\":-1,\"curkey\":-1,\"gameinfo\":{}}}";
        var gmimsg = JSON.parse(gmistr);

        var bdata = bets.betdata;
        var edata = bets.eventdata;

        if(this.iSelectFGMode < 0) {
            //! 选择类型
            if (bdata.cmd == 'FORTUNE') {
                this.iSelectFGMode = 0;
            } else {
                this.iSelectFGMode = 1;
            }

            this.iSelectFGKey = 0;
            this.iSelectFGNums = edata.wonFreeSpinNumber;

            this.lstOtherFGNums = [];
            this.iOtherFGNumsIndex = 0;

            for (var ii = 0; ii < edata.otherFreeSpinNumbers.length; ++ii) {
                this.lstOtherFGNums.push(edata.otherFreeSpinNumbers[ii]);
            }
        }
        else if(this.iSelectFGKey >= 0 && this.iSelectFGKey < 20) {
            if(this.iSelectFGMode == 0) {
                this.iSelectFGMul = edata.wonMultiplier;

                this.lstOtherFGMul = [];
                this.iOtherFGMulIndex = 0;

                for(var ii = 0; ii < edata.otherMultipliers.length; ++ii) {
                    this.lstOtherFGMul.push(edata.otherMultipliers[ii]);
                }
            }
            else {
                if(edata.wonWildSymbols) {
                    this.iSelectFGSymbols = [];

                    for(var ii = 0; ii < edata.wonWildSymbols.length; ++ii) {
                        this.iSelectFGSymbols.push(this.iconvalue[edata.wonWildSymbols[ii]]);
                    }
                }

                this.lstOtherFGSymbols = [];
                this.iOtherFGSymbolsIndex = 0;

                for(var ii = 0; ii < edata.otherWildSymbols.length; ++ii) {
                    var node = edata.otherWildSymbols[ii];
                    var lst = [];

                    for(var jj = 0; jj < node.length; ++jj) {
                        lst.push(this.iconvalue[node[jj]]);
                    }

                    this.lstOtherFGSymbols.push(lst);
                }
            }
        }
        else {
        }

        gmimsg.gmi.curkey = this.iSelectFGKey;
        gmimsg.gmi.fgmode = this.iSelectFGMode;

        if(this.iSelectFGMode == 0) {
            gmimsg.gmi.gameinfo.nums = this.iSelectFGNums;
            gmimsg.gmi.gameinfo.mul = this.iSelectFGMul;
        }
        else {
            gmimsg.gmi.gameinfo.nums = this.iSelectFGNums;
            gmimsg.gmi.gameinfo.symbols = this.iSelectFGSymbols;
        }

        this.addFGNums = 10;

        if(this.iSelectFGKey == -2) {
            this.FgNums = this.iSelectFGNums;
            this.LastNums = this.FgNums;
        }

        return gmimsg;
    },

    //! 本地发送免费选择消息
    _sendSelectFreeModuleInfo : function (curkey) {
        var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"medusa2_fg\",\"gameid\":498,\"gmi\":{\"isinit\":false,\"lastnums\":0,\"totalwin\":0,\"lstarr\":[[5,5,7,7,3,8],[5,4,4,9,2,4],[6,9,9,3,9,7],[6,9,9,4,6,2]],\"curnums\":0,\"bet\":10,\"lines\":10,\"fgmode\":-1,\"curkey\":-1,\"gameinfo\":{}}}";
        var gmimsg = JSON.parse(gmistr);

        if(curkey >= 20)
            curkey = -2;

        gmimsg.gmi.curkey = curkey;
        gmimsg.gmi.fgmode = this.iSelectFGMode;

        this.iSelectFGKey = curkey;

        if(this.iSelectFGMode == 0) {
            gmimsg.gmi.gameinfo.nums = this.iSelectFGNums;
            gmimsg.gmi.gameinfo.mul = this.iSelectFGMul;
        }
        else {
            gmimsg.gmi.gameinfo.nums = this.iSelectFGNums;
            gmimsg.gmi.gameinfo.symbols = this.iSelectFGSymbols;
        }

        if(this.iSelectFGKey == -2) {
            this.FgNums = this.iSelectFGNums;
            this.LastNums = this.FgNums;
        }

        GameMgr.singleton.onGameModuleInfo(gmimsg);

        if(this.SelectFreeCallBack) {
            this.SelectFreeCallBack(true);
            this.SelectFreeCallBack = undefined;
        }
    },

    //! 自动选择，bsend表示是否真实向游戏发消息
    autoSelectFree : function (bsend) {
        //! 创造一个选择的消息
        var ret = this.SpinRet;

        // var bdata = ret.wager.bets[this.SpinIndex].betdata;
        // var edata = ret.wager.bets[this.SpinIndex].eventdata;

        var gmimsg = this._createSelectFreeInfo(ret.wager.bets[this.SpinIndex]);

        if(this.SpinIndex == 3) {
            this.bAutoSelect = false;

            //! 特殊处理第三次选择
            if(ret.wager.bets.length > 4) {
                //++this.SpinIndex;
                this.iSelectFGKey = -2;

                gmimsg = this._createSelectFreeInfo(ret.wager.bets[this.SpinIndex]);
            }
            else {
                //! 还没有最后确认
                this.iSelectFGKey = -2;

                var selectdata = {};

                selectdata.cmd = 'START_SESSION';

                selectdata.step = this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1;
                //selectdata.wagerid = this.SpinRet.wager.wagerid;

                //! 下注数据
                selectdata.coin = this.iCoin;
                selectdata.amount = this.iAmount;

                slot.play(selectdata)
                    .then((ret) => {
                        YggLogic.singleton.onSelectFreeRet(ret);
                    })
                    .catch((err) => {
                        console.log('play Error  ', err);
                    });

                return ;
            }
        }

        this.bFree = true;

        if(bsend == undefined || bsend)
            GameMgr.singleton.onGameModuleInfo(gmimsg);

        this.SpinIndex += 1;

        if(this.bRestore) {
            //! 结束重播
            if(this.SpinIndex >= ret.wager.bets.length)
                this.bRestore = false;
        }

        if(this.bAutoSelect) {
            //! 结束自动选择
            if(this.SpinIndex >= ret.wager.bets.length)
                this.bAutoSelect = false;
        }

        if(this.SelectFreeCallBack) {
            this.SelectFreeCallBack(true);
            this.SelectFreeCallBack = undefined;
        }

        if(this.bAutoSelect)
            this._createSelectKey();1
    },

    //! 制造GameModuleInfo
    _createGameModuleInfo : function () {
        var ret = this.SpinRet;
        var ri = this.SpinIndex;
        var retdata = ret.wager.bets[ri].eventdata;

        console.log('retdata :', JSON.stringify(retdata));

        var cdata = retdata.response.clientData;

        var gmimsg = undefined;

        var reels = cdata.scenes[0].arr;
        //var reels = ret.wager.bets[ri].eventdata.reels;
        //var reels2 = ret.wager.bets[ri].eventdata.reels2;

        var wtw = cdata.results;
        //var wtw = ret.wager.bets[ri].eventdata.wtw;
        //var wtw2 = ret.wager.bets[ri].eventdata.wtw2;

        var realwin = Math.round(retdata.response.cashWin * this.iRateValue);
        //var realwin = Math.round(ret.wager.bets[ri].eventdata.wonMoney * this.iRateValue);

        //! 暂时特殊处理wonMoney和wonCoins不一致的情况
        // if(ret.wager.bets[ri].eventdata.wonMoney <= 0 && ret.wager.bets[ri].eventdata.wonCoins >= 0)
        //     realwin = Math.round(ret.wager.bets[ri].eventdata.wonCoins);

        this.TurnWin += realwin;

        var totalwin = Math.round(ret.wager.bets[ri].eventdata.accWa * this.iRateValue);
        var wonamount = Math.round(ret.wager.bets[ri].wonamount * this.iRateValue);

        //! 暂时特殊处理accWa和accC不一致的情况
        // if(ret.wager.bets[ri].eventdata.accWa * this.iRateValue < ret.wager.bets[ri].eventdata.accC)
        //     totalwin = Math.round(ret.wager.bets[ri].eventdata.accC);

        var fgname = ret.wager.bets[ri].eventdata.freeSpinsName;
        var fgnums = ret.wager.bets[ri].eventdata.freeSpinsAwarded;
        var lastnums = ret.wager.bets[ri].eventdata.freeSpins;

        // if(fgnums != undefined){
        //     this.FgNums = fgnums;
        // }

        // if(lastnums != undefined){
        //     this.LastNums = lastnums;
        // }

        if(reels) {
            //var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"icefire2_bg\",\"gameid\":468,\"gmi\":{\"spinret\":{\"realsuperfgnums\":0},\"curm\":5}}";
            var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"elemental_bg\",\"gameid\":493,\"gmi\":{\"isspinend\":true,\"lstarr\":[[5,2,10,3,0],[9,8,3,7,10],[3,1,6,8,6]],\"spinret\":{\"totalwin\":0,\"bet\":1,\"times\":1,\"lines\":30,\"lst\":[],\"fgnums\":0,\"realfgnums\":0,\"linewin\":0,\"curkey\":-1,\"multiplier\":1,\"specialWildsArr\":[[-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1]],\"realwin\":0},\"turnwin\":0,\"turnnums\":1,\"fgnums\":0,\"isinit\":false,\"curkey\":-1,\"multiplier\":1,\"collectWildsCnt\":0,\"specialWildsArr\":[[-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1]]}}";
            gmimsg = JSON.parse(gmistr);

            //gmimsg.gmi.turnwin = this.TurnWin;
            gmimsg.gmi.turnwin = realwin;
            gmimsg.gmi.totalwin = this.TurnWin;

            gmimsg.gmi.spinret.realwin = realwin;
            gmimsg.gmi.spinret.totalwin = realwin;

            gmimsg.gmi.spinret.wonamount = wonamount;

            if(ret.wager.bets[ri].betdata && ret.wager.bets[ri].betdata.coin)
                gmimsg.gmi.spinret.bet = Math.round(ret.wager.bets[ri].betdata.coin * this.iRateValue);
            else
                gmimsg.gmi.spinret.bet = this.iFreeBet;

            gmimsg.gmi.spinret.times = 1;
            gmimsg.gmi.spinret.lines = 30;

            gmimsg.gmi.lstarr = this._chgReels(reels);
            gmimsg.gmi.spinret.lst = this._createlst(wtw, gmimsg.gmi.lstarr, gmimsg.gmi.spinret.bet);

            if(this.bFree) {
                this._appendFGInfo(gmimsg, retdata);

                if(ri == ret.wager.bets.length - 1)
                    this.bFree = false;
            }
            else {
                this._appendPrincessInfo(gmimsg, retdata);
            }

            // //! 扩展Wild
            // for(var ii = 0; ii < 6; ++ii) {
            //     for(var jj = 0; jj < 4; ++jj) {
            //         var fdata = ret.wager.bets[ri].eventdata.finalBoard[ii][jj];
            //         var rdata = ret.wager.bets[ri].eventdata.reels[ii][jj];
            //
            //         if(fdata == 'WILD' && fdata != rdata) {
            //             var node = {};
            //             node.x = ii;
            //             node.y = jj;
            //
            //             gmimsg.gmi.spinret.wlst.push(node);
            //         }
            //     }
            // }
            //
            // //! 普通游戏
            // if(retdata.reelSet == 'BaseReels') {
            //     gmimsg.gamemodulename = this.sBgName;
            //
            //     if(retdata.nextCmds && retdata.nextCmds == 'GLORY,FORTUNE') {
            //         //! 进入选择免费环节
            //         gmimsg.gmi.spinret.fgnums = 1;
            //         gmimsg.gmi.spinret.realfgnums = 1;
            //
            //         //! 追加scatter的中奖结果
            //         var scatterdata = this._creatScatter(gmimsg.gmi.lstarr, gmimsg.gmi.spinret.bet);
            //
            //         if(scatterdata)
            //             gmimsg.gmi.spinret.lst.push(scatterdata);
            //
            //         // if(this.bAutoSelect) {
            //         //     //! 如果是重入，需要让UI自动选择
            //         //     var nextdata = ret.wager.bets[ri + 1].eventdata;
            //         //     var stype = nextdata.freeSpinsType == 'MODE_ICE' ? 0 : 1;
            //         //
            //         //     if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.setSelectType)
            //         //         GameMgr.singleton.curGameLayer.setSelectType(stype);
            //         // }
            //     }
            //
            //     this.iBgTotalWin = totalwin;
            // }
            // else {
            //     totalwin -= this.iBgTotalWin;
            //
            //     if(this.bFree) {
            //         //! 普通免费中
            //         gmimsg.gamemodulename = this.sFgName;
            //
            //         gmimsg.gmi.turnnums = this.FgTurnNums + 1;
            //
            //         if(retdata.reSpins) {
            //             gmimsg.gmi.isspinend = false;
            //
            //             if(retdata.freeSpins)
            //                 gmimsg.gmi.lastnums = retdata.freeSpins - 1;
            //             else
            //                 gmimsg.gmi.lastnums = 0;
            //
            //             this.FgTurnNums += 1;
            //
            //             // //! 测试代码
            //             // gmimsg.gmi.spinret.realwin = 1;
            //             // gmimsg.gmi.spinret.totalwin = 1;
            //         }
            //         else {
            //             gmimsg.gmi.isspinend = true;
            //
            //             if(retdata.freeSpins)
            //                 gmimsg.gmi.lastnums = retdata.freeSpins;
            //             else
            //                 gmimsg.gmi.lastnums = 0;
            //
            //             this.FgTurnNums = 0;
            //         }
            //
            //         // if(retdata.scatterFreeSpinsWon) {
            //         //     this.FgNums += 10;
            //         //     gmimsg.gmi.spinret.fgnums = 10;
            //         // }
            //
            //         // if(retdata.cascadeFreeSpinsWon) {
            //         //     this.FgNums += this.addFGNums;
            //         //     gmimsg.gmi.spinret.fgnums = this.addFGNums;
            //         // }
            //
            //         //! 追加scatter的中奖结果
            //         var scatterdata = this._creatScatter(gmimsg.gmi.lstarr, gmimsg.gmi.spinret.bet);
            //
            //         if(scatterdata) {
            //             gmimsg.gmi.spinret.lst.push(scatterdata);
            //             this.FgNums += this.addFGNums;
            //             this.LastNums += this.addFGNums;
            //             gmimsg.gmi.spinret.fgnums = this.addFGNums;
            //         }
            //
            //         // //! 测试
            //         // gmimsg.gmi.lastnums += 1;
            //         // this.FgNums += 1;
            //
            //         --this.LastNums;
            //         gmimsg.gmi.totalnums = this.FgNums;
            //         gmimsg.gmi.lastnums = this.LastNums;
            //         gmimsg.gmi.totalwin = totalwin;
            //         gmimsg.gmi.curnums = gmimsg.gmi.totalnums - gmimsg.gmi.lastnums;
            //
            //         gmimsg.gmi.curkey = this.iSelectFGKey;
            //         gmimsg.gmi.fgmode = this.iSelectFGMode;
            //         gmimsg.gmi.gameinfo = {};
            //
            //         if(this.iSelectFGMode == 0) {
            //             gmimsg.gmi.gameinfo.nums = this.iSelectFGNums;
            //             gmimsg.gmi.gameinfo.mul = this.iSelectFGMul;
            //         }
            //         else {
            //             gmimsg.gmi.gameinfo.nums = this.iSelectFGNums;
            //             gmimsg.gmi.gameinfo.symbols = this.iSelectFGSymbols;
            //         }
            //
            //         //gmimsg.gmi.curkey = retdata.freeSpinsType == 'MODE_ICE' ? 0 : 1;
            //
            //         if(ri == ret.wager.bets.length - 1)
            //             this.bFree = false;
            //
            //         // //if(retdata.scatterFreeSpinsWon) {
            //         // if(gmimsg.gmi.isspinend && gmimsg.gmi.lastnums == 0 && !this.isSpinEnd()) {
            //         //     //! 测试进超级免费……
            //         //     var nextdata = ret.wager.bets[ri + 1].eventdata;
            //         //
            //         //     if(nextdata.reSpins) {
            //         //         gmimsg.gmi.spinret.realsuperfgnums = nextdata.freeSpins;
            //         //         this.FgNums = nextdata.freeSpins;
            //         //         this.addFGNums = nextdata.freeSpins;
            //         //     }
            //         //     else {
            //         //         gmimsg.gmi.spinret.realsuperfgnums = nextdata.freeSpins + 1;
            //         //         this.FgNums = nextdata.freeSpins + 1;
            //         //         this.addFGNums = nextdata.freeSpins + 1;
            //         //     }
            //         //
            //         //     // gmimsg.gmi.spinret.realsuperfgnums = 10;
            //         //     // this.FgNums = 10;
            //         //     // this.addFGNums = 10;
            //         //
            //         //     //! 找出所有的scatter图标
            //         //     var sdata = {};
            //         //
            //         //     sdata.type = 'scatterex2';
            //         //     sdata.bet = gmimsg.gmi.spinret.bet;
            //         //     sdata.symbol = 11;
            //         //     sdata.multiplies = 0;
            //         //     sdata.win = 0;
            //         //
            //         //     sdata.positions = [];
            //         //
            //         //     for(var ii = 0; ii < gmimsg.gmi.lstarr.length; ++ii) {
            //         //         for(var jj = 0; jj < gmimsg.gmi.lstarr[ii].length; ++jj) {
            //         //             if(gmimsg.gmi.lstarr[ii][jj] == sdata.symbol) {
            //         //                 var node = {};
            //         //
            //         //                 node.x = jj;
            //         //                 node.y = ii;
            //         //
            //         //                 sdata.positions.push(node);
            //         //             }
            //         //         }
            //         //     }
            //         //
            //         //     gmimsg.gmi.spinret.lst.push(sdata);
            //         //
            //         //     this.bSuperFree = true;
            //         //     this.iBgTotalWin += totalwin;
            //         // }
            //     }
            // }
        }

        this.SpinIndex += 1;

        if(this.bRestore) {
            //! 结束重播
            if(this.SpinIndex >= ret.wager.bets.length)
                this.bRestore = false;
        }

        var str = JSON.stringify(gmimsg);
        cc.log('gmimsg ' + str);

        //! 判断是不是第一个消息
        if(this.bIsInit) {
            gmimsg.gmi.isinit = true;
            this.bIsInit = false;
        }

        return gmimsg;
    },

    //! 追加公主转数据
    _appendPrincessInfo : function (gmimsg, retdata) {
        if(!retdata || !retdata.response || !retdata.response.clientData || !retdata.response.clientData.curgamemodparams || retdata.response.clientData.curgamemodparams.princessspin < 0)
            return ;

        gmimsg.gmi.curkey = this.prcurkey[retdata.response.clientData.curgamemodparams.princessspin];

        switch (gmimsg.gmi.curkey) {
            case 0:
                this._appendPrincessInfo_Fire(gmimsg, retdata);
                break;
            case 1:
                this._appendPrincessInfo_Soil(gmimsg, retdata);
                break;
            case 2:
                this._appendPrincessInfo_Wind(gmimsg, retdata);
                break;
            case 3:
                this._appendPrincessInfo_Water(gmimsg, retdata);
                break;
        }
    },

    _appendPrincessInfo_Fire : function (gmimsg, retdata) {
        if(retdata.response && retdata.response.clientData) {
            if(retdata.response.clientData.curgamemodparams) {
                gmimsg.gmi.multiplier = retdata.response.clientData.curgamemodparams.princessspinfiremul;
                gmimsg.gmi.spinret.multiplier = retdata.response.clientData.curgamemodparams.princessspinfiremul;
            }
        }
    },

    _appendPrincessInfo_Soil : function (gmimsg, retdata) {
        if(retdata.response && retdata.response.clientData) {
            if(retdata.response.clientData.scenes && retdata.response.clientData.scenes.length > 1) {
                var arr0 = retdata.response.clientData.scenes[0].arr;
                var arr1 = retdata.response.clientData.scenes[1].arr;

                for(var ii = 0; ii < arr0.length; ++ii) {
                    for(var jj = 0; jj < arr0[ii].length; ++jj) {
                        if(arr0[ii][jj] != 0 && arr1[ii][jj] == 0) {
                            gmimsg.gmi.specialWildsArr[jj][ii] = 0;
                            gmimsg.gmi.spinret.specialWildsArr[jj][ii] = 0;
                        }
                    }
                }
            }
        }
    },

    _appendPrincessInfo_Wind : function (gmimsg, retdata) {
        if(retdata.response && retdata.response.clientData) {
            // if(retdata.response.clientData.curgamemodparams)
            //     gmimsg.gmi.collectWildsCnt = retdata.response.clientData.curgamemodparams.airnums;

            if(retdata.response && retdata.response.clientData) {
                if (retdata.response.clientData.curgamemodparams && retdata.response.clientData.curgamemodparams.airpos) {
                    var si = retdata.response.clientData.curgamemodparams.princessspinairsi;
                    var apos = retdata.response.clientData.curgamemodparams.airpos;

                    if(si == 0)
                        gmimsg.gmi.collectWildsCnt = 0;
                    else if(si == 1)
                        gmimsg.gmi.collectWildsCnt = 2;
                    else if(si == 2)
                        gmimsg.gmi.collectWildsCnt = 5;
                    else if(si == 3)
                        gmimsg.gmi.collectWildsCnt = 9;

                    var tx = apos[0];
                    var ty = apos[1];

                    var bw = 2;
                    var bh = 1;

                    if(si >= 3) {
                        bw = 3;
                        bh = 3;
                    } else if(si >= 2) {
                        bw = 2;
                        bh = 3;
                    } else if(si >= 1) {
                        bw = 2;
                        bh = 2;
                    }

                    for(var x = 0; x < bw; x++) {
                        for(var y = 0; y < bh; y++) {
                            gmimsg.gmi.specialWildsArr[ty+y][tx+x] = 0;
                            gmimsg.gmi.spinret.specialWildsArr[ty+y][tx+x] = 0;
                        }
                    }
                }
            }
        }
    },

    _appendPrincessInfo_Water : function (gmimsg, retdata) {
        if(retdata.response && retdata.response.clientData) {
            if(retdata.response.clientData.scenes && retdata.response.clientData.scenes.length > 1) {
                var arr0 = retdata.response.clientData.scenes[0].arr;
                var arr1 = retdata.response.clientData.scenes[1].arr;

                for(var ii = 0; ii < arr0.length; ++ii) {
                    for(var jj = 0; jj < arr0[ii].length; ++jj) {
                        if(arr0[ii][jj] != 0 && arr1[ii][jj] == 0) {
                            gmimsg.gmi.specialWildsArr[jj][ii] = 0;
                            gmimsg.gmi.spinret.specialWildsArr[jj][ii] = 0;
                        }
                    }
                }
            }
        }
        // if(retdata.response && retdata.response.clientData) {
        //     if(retdata.response.clientData.curgamemodparams && retdata.response.clientData.curgamemodparams.waterpos) {
        //         var wpos = retdata.response.clientData.curgamemodparams.waterpos;
        //
        //         for(var ii = 0; ii < wpos.length; ) {
        //             var x = wpos[ii];
        //             var y = wpos[ii + 1];
        //
        //             gmimsg.gmi.specialWildsArr[y][x] = 0;
        //             gmimsg.gmi.spinret.specialWildsArr[y][x] = 0;
        //
        //             ii += 2;
        //         }
        //     }
        // }
    },

    //! 追加免费游戏数据
    _appendFGInfo : function (gmimsg, retdata) {
        if(!this.bFree)
            return ;

        gmimsg.gamemodulename = this.sFgName;
        gmimsg.gmi.curkey = this.iFreeType;

        this.iFreeLastNums -= 1;
        gmimsg.gmi.lastnums = retdata.response.clientData.curgamemodparams.fgnums;

        if(gmimsg.gmi.lastnums > this.iFreeLastNums) {
            this.iFreeTotalNums += gmimsg.gmi.lastnums - this.iFreeLastNums;
            this.iFreeLastNums = gmimsg.gmi.lastnums;
        }

        gmimsg.gmi.totalnums = this.iFreeTotalNums;

        switch (this.iFreeType) {
            case 0:
                this._appendFGInfo_Fire(gmimsg, retdata);
                break;
            case 1:
                this._appendFGInfo_Soil(gmimsg, retdata);
                break;
            case 2:
                this._appendFGInfo_Wind(gmimsg, retdata);
                break;
            case 3:
                this._appendFGInfo_Water(gmimsg, retdata);
                break;
        }
    },

    _appendFGInfo_Fire : function (gmimsg, retdata) {
        if(retdata.response && retdata.response.clientData) {
            if(retdata.response.clientData.curgamemodparams) {
                gmimsg.gmi.multiplier = retdata.response.clientData.curgamemodparams.firemul;
                gmimsg.gmi.spinret.multiplier = retdata.response.clientData.curgamemodparams.firemul;
            }
        }
    },

    _appendFGInfo_Soil : function (gmimsg, retdata) {
        if(retdata.response && retdata.response.clientData) {
            if(retdata.response.clientData.scenes && retdata.response.clientData.scenes.length > 1) {
                var arr0 = retdata.response.clientData.scenes[0].arr;
                var arr1 = retdata.response.clientData.scenes[1].arr;

                for(var ii = 0; ii < arr0.length; ++ii) {
                    for(var jj = 0; jj < arr0[ii].length; ++jj) {
                        if(arr0[ii][jj] != 0 && arr1[ii][jj] == 0) {
                            gmimsg.gmi.specialWildsArr[jj][ii] = 0;
                            gmimsg.gmi.spinret.specialWildsArr[jj][ii] = 0;
                        }
                    }
                }
            }
        }
    },

    _appendFGInfo_Wind : function (gmimsg, retdata) {
        if(retdata.response && retdata.response.clientData) {
            if(retdata.response.clientData.curgamemodparams)
                gmimsg.gmi.collectWildsCnt = retdata.response.clientData.curgamemodparams.airnums;

            if(retdata.response && retdata.response.clientData) {
                if (retdata.response.clientData.curgamemodparams && retdata.response.clientData.curgamemodparams.airpos) {
                    var apos = retdata.response.clientData.curgamemodparams.airpos;

                    var tx = apos[0];
                    var ty = apos[1];

                    var bw = 2;
                    var bh = 1;

                    if(this.iFreeValue >= 9) {
                        bw = 3;
                        bh = 3;
                    } else if(this.iFreeValue >= 5) {
                        bw = 2;
                        bh = 3;
                    } else if(this.iFreeValue >= 2) {
                        bw = 2;
                        bh = 2;
                    }

                    for(var x = 0; x < bw; x++) {
                        for(var y = 0; y < bh; y++) {
                            gmimsg.gmi.specialWildsArr[ty+y][tx+x] = 0;
                            gmimsg.gmi.spinret.specialWildsArr[ty+y][tx+x] = 0;
                        }
                    }

                    this.iFreeValue = gmimsg.gmi.collectWildsCnt;
                }
            }

            // //! 测试数据，不完全正确
            // if(retdata.response.clientData.scenes && retdata.response.clientData.scenes.length > 1) {
            //     var arrtmp = retdata.response.clientData.scenes[1].arr;
            //
            //     for(var ii = 0; ii < arrtmp.length; ++ii) {
            //         for(var jj = 0; jj < arrtmp[ii].length; ++jj) {
            //             if(arrtmp[ii][jj] == 0) {
            //                 gmimsg.gmi.specialWildsArr[jj][ii] = 0;
            //                 gmimsg.gmi.spinret.specialWildsArr[jj][ii] = 0;
            //             }
            //         }
            //     }
            // }
        }
    },

    _appendFGInfo_Water : function (gmimsg, retdata) {
        if(retdata.response && retdata.response.clientData) {
            if(retdata.response.clientData.curgamemodparams && retdata.response.clientData.curgamemodparams.waterpos) {
                var wpos = retdata.response.clientData.curgamemodparams.waterpos;

                for(var ii = 0; ii < wpos.length; ) {
                    var x = wpos[ii];
                    var y = wpos[ii + 1];

                    gmimsg.gmi.specialWildsArr[y][x] = 0;
                    gmimsg.gmi.spinret.specialWildsArr[y][x] = 0;

                    ii += 2;
                }
            }
        }
    },

    //! 根据已有消息创建一个保留消息
    _createLastGameModuleInfo : function (gmimsg) {
        var lmsg = this._deepClone(gmimsg);

        lmsg.gamemodulename = this.sBgName;

        if(!lmsg.gmi.spinret)
            lmsg.gmi.spinret = {};

        //! 普通游戏编程未中奖局面
        lmsg.gmi.spinret.realwin = 0;
        lmsg.gmi.spinret.totalwin = 0;
        lmsg.gmi.spinret.lst = [];
        lmsg.gmi.spinret.curfg = undefined
        lmsg.gmi.spinret.realsuperfgnums = 0;


        lmsg.gmi.turnwin = 0;
        lmsg.gmi.turnnums = 1;
        lmsg.gmi.isspinend = true;

        //! 清除免费数据
        lmsg.gmi.spinret.fgnums = undefined;
        lmsg.gmi.lastnums = undefined;
        lmsg.gmi.supermul = undefined;
        lmsg.gmi.totalnums = undefined;
        lmsg.gmi.totalwin = undefined;
        lmsg.gmi.curkey = undefined;

        lmsg.gmi.isinit = false;

        this.lastGameModuleInfo = lmsg;
    },

    //! 追加进入免费时的消息
    _addFGModuleInfo : function (gmimsg, bSim) {
        var ret = this.SpinRet;
        var ri = this.SpinIndex;

        if(this.SpinIndex == 1 && this.SpinRet.wager.bets.length > 1 && this.SpinRet.wager.bets[1].eventdata && this.SpinRet.wager.bets[1].eventdata.response) {
            var retdata = ret.wager.bets[0].eventdata;
            var cdata = retdata.response.clientData;

            var fgstr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"elemental_fg\",\"gameid\":493,\"gmi\":{\"isspinend\":true,\"lastnums\":10,\"totalnums\":10,\"totalwin\":0,\"turnwin\":0,\"turnnums\":0,\"bet\":1,\"curkey\":0,\"multiplier\":1,\"collectWildsCnt\":0,\"specialWildsArr\":[[-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1]],\"isinit\":false}}";
            var fgmsg = JSON.parse(fgstr);

            fgmsg.gmi.bet = gmimsg.gmi.spinret.bet;
            fgmsg.gmi.curkey = this.fgcurkey[cdata.nextgamemod];
            fgmsg.gmi.lastnums = cdata.curgamemodparams.fgnums;
            fgmsg.gmi.totalnums = cdata.curgamemodparams.fgnums;
            fgmsg.gmi.multiplier = cdata.curgamemodparams.firemul;
            fgmsg.gmi.totalwin = this.TurnWin;

            if (!bSim)
                GameMgr.singleton.onGameModuleInfo(fgmsg);

            this.bFree = true;
            this.iFreeType = fgmsg.gmi.curkey;
            this.iFreeBet = fgmsg.gmi.bet;
            this.iFreeTotalNums = fgmsg.gmi.totalnums;
            this.iFreeLastNums = fgmsg.gmi.totalnums;
            this.iFreeValue = 0;
        }
        //
        // return ;
        //
        // if(gmimsg && gmimsg.gmi && gmimsg.gmi.spinret && gmimsg.gmi.spinret.realfgnums) {
        //     this.iSelectFGKey = -1;
        //     this.iSelectFGMode = -1;
        //
        //     var fgstr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"medusa2_fg\",\"gameid\":498,\"gmi\":{\"isinit\":false,\"lastnums\":0,\"totalwin\":0,\"lstarr\":[[5,5,7,7,3,8],[5,4,4,9,2,4],[6,9,9,3,9,7],[6,9,9,4,6,2]],\"curnums\":0,\"bet\":10,\"lines\":10,\"fgmode\":-1,\"curkey\":-1,\"gameinfo\":{}}}";
        //     var fgmsg = JSON.parse(fgstr);
        //
        //     fgmsg.gmi.bet = gmimsg.gmi.spinret.bet;
        //
        //     GameMgr.singleton.onGameModuleInfo(fgmsg);
        // }
    },

    _sendLastGameModuleInfo : function () {
        if(!this.lastGameModuleInfo)
            return ;

        GameMgr.singleton.onGameModuleInfo(this.lastGameModuleInfo);

        if(this.SpinCallBack)
            this.SpinCallBack(true);

        this.bSendLast = true;
    },

    //! 模拟之前的登陆流程
    _login : function () {
        this.bLogin = true;

        // if(this.Config.settings.language == 'zh' || this.Config.settings.language == 'zh_hans') {
        //     LanguageData.instance.setlanguageType('_zh');
        //     LanguageData.instance.refreshShowedText();
        // }

        //! userbaseinfo
        GameMgr.singleton.userbaseinfo = {};
        GameMgr.singleton.userbaseinfo.currency = this.Config.settings.currency;

        //! gamecfg
        if(this.Config.settings.organizationConfig && this.Config.settings.organizationConfig.Denoms) {
            var bindex = this.Config.settings.organizationConfig.Denoms.indexOf(':');

            var dstr = '[';
            dstr += this.Config.settings.organizationConfig.Denoms.slice(bindex + 1);
            dstr += ']';

            var denoms = JSON.parse(dstr);

            //! 计算小数位数
            for(var ii = 0; ii < denoms.length; ++ii) {
                var num = denoms[ii];
                var x = String(num).indexOf('.') + 1;
                var y = String(num).length - x;

                if(y > this.iRateNum) {
                    this.iRateNum = y;
                    this.iRateValue = Math.round(Math.pow(10, this.iRateNum));
                }
            }

            GameDataMgr.instance.setCoinValueRate(this.iRateValue);

            var linebets = [];

            for(var ii = 0; ii < denoms.length; ++ii) {
                linebets.push(Math.round(denoms[ii] * this.iRateValue));
            }

            this._handleLineBets(linebets);

            //! 记录最大下注值
            if(denoms.length > 0)
                this.iMaxBet = linebets[linebets.length - 1] / this.iRateValue * this.sLine;

            var bnum = undefined;

            if(this.bReplay) {
                //! 如果是录像则尝试恢复下注
                if(this.Config.wagers.data[0].bets.length > 0) {
                    bnum = Math.round(this.Config.wagers.data[0].bets[0].betamount * this.iRateValue / this.sLine);
                }

                //!回放红包游戏
                if(this.iPrepaid) {
                    this.bPrepaid = this.iPrepaid;
                }
                //GameMgr.singleton.onBetList(linebets, bnum);
            }
            else if(!this.GameReadyRet || this.GameReadyRet.restoreMode == 'NONE') {
                //! 游戏的话恢复默认值
                if(this.Config.settings.organizationConfig.DefaultDenom) {
                    var bindex = this.Config.settings.organizationConfig.DefaultDenom.indexOf(':');
                    var dstr = this.Config.settings.organizationConfig.DefaultDenom.slice(bindex + 1);

                    bnum = Math.round(Number(dstr) * this.iRateValue);
                }
                else {
                    bnum = linebets[0];
                }
                //GameMgr.singleton.onBetList(linebets);
            }
            else {
                //! 恢复RESTORE下注
                if(this.Config.wagers.data[0].bets.length > 0) {
                    bnum = Math.round(this.Config.wagers.data[0].bets[0].betamount * this.iRateValue / this.sLine);
                }
            }

            GameMgr.singleton.onBetList(linebets, bnum);
        }

        var mymoney = 0;

        if(this.Config.settings.balance != undefined) {
            mymoney = this.Config.settings.balance * this.iRateValue;
        }
        else {
            if(this.Config.wagers && this.Config.wagers.data[0].bets.length > 0) {
                mymoney = this.Config.wagers.data[0].bets[0].betdata.initialBalance * this.iRateValue;
            }
        }

        this.iRealBalance = mymoney;

        //! 如果是回放就扣减下注
        //if()

        // //! 跳过情况下调整最终金额
        // if(this.GameReadyRet && this.GameReadyRet.restoreMode == 'SKIP') {
        //     var ri = this.Config.wagers.data[0].bets.length - 1;
        //     mymoney += this.Config.wagers.data[0].bets[ri].eventdata.accWa * this.iRateValue;
        // }

        if(!this.GameReadyRet || this.GameReadyRet.restoreMode != 'SKIP') {
            GameMgr.singleton.onMyMoney(Math.round(mymoney));
        }

        GameMgr.singleton.myInfo.gameid = GameMgr.singleton.getCurGameID();

        //! comeingame
        //! gamemoduleinfo
        var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"elemental_bg\",\"gameid\":493,\"gmi\":{\"isspinend\":true,\"lstarr\":[[10,8,6,1,2],[3,4,10,7,8],[5,7,1,5,10]],\"turnwin\":0,\"turnnums\":0,\"fgnums\":0,\"isinit\":true,\"curkey\":-1,\"multiplier\":1,\"collectWildsCnt\":0,\"specialWildsArr\":[[-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1]]}}";
        var gmimsg = JSON.parse(gmistr);

        //! 根据不同情况恢复不同的消息
        if(this.GameReadyRet && (this.GameReadyRet.restoreMode == 'RESTORE' || (this.GameReadyRet.restoreMode == 'SKIP' && this.Config.wagers.data[0].bets.length == 1))) {
            //! 如果仅有一个消息的skip，处理流程应该和restore相同
            this._restoreBets();

            GameMgr.singleton.onMyMoney(Math.round(mymoney));

            //! 恢复成默认局面
            var cfg = this.Config;

            if(cfg && cfg.settings && cfg.settings.slotConfig && cfg.settings.slotConfig.Config && cfg.settings.slotConfig.Config.defaultscene && cfg.settings.slotConfig.Config.defaultscene.arr) {
                var reels = cfg.settings.slotConfig.Config.defaultscene.arr;

                gmimsg.gmi.lstarr = this._chgReels(reels);
            }

            this.bRestore = true;
        }
        else if(this.GameReadyRet && this.GameReadyRet.restoreMode == 'SKIP') {
            this._skipBets();
            //this.bRestore = true;

            if(!this.isPrepaid())
                GameMgr.singleton.onMyMoney(Math.round(mymoney + this.iBgTotalWin));
            else
                GameMgr.singleton.onMyMoney(Math.round(mymoney));

            // this.bCollect = true;
            // slot.collect({step:this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1})
            //     .then((ret) => {
            //         YggLogic.singleton.onCollect(ret);
            //     })
            //     .catch((err) => {
            //         console.log('collect Error ', err);
            //     });

            //gmimsg = this._createGameModuleInfo();

            if(GameMgr.singleton.curGameLayer == undefined)
                cc.director.runScene(new GameScene());

            return;
        }
        else {
            var cfg = this.Config;

            if(cfg && cfg.settings && cfg.settings.slotConfig && cfg.settings.slotConfig.Config && cfg.settings.slotConfig.Config.defaultscene && cfg.settings.slotConfig.Config.defaultscene.arr) {
                var reels = cfg.settings.slotConfig.Config.defaultscene.arr;

                gmimsg.gmi.lstarr = this._chgReels(reels);
            }
        }

        gmimsg.mode = this.Config.mode;

        if(this.GameReadyRet && this.GameReadyRet.restoreMode == 'SKIP')
            gmimsg.mode = 'SKIP';

        //! 判断是不是第一个消息
        if(this.bIsInit) {
            gmimsg.gmi.isinit = true;
            this.bIsInit = false;
        }

        GameMgr.singleton.onGameModuleInfo(gmimsg);
        //this._addFGModuleInfo(gmimsg);

        //! 如果是游戏则保留备份
        if(!this.bReplay && (!this.GameReadyRet || this.GameReadyRet.restoreMode == 'NONE')) {
            this._createLastGameModuleInfo(gmimsg);
        }

        //! 重播恢复旋转后的数据
        if(this.bReplay) {
            //this._createReplayData();
            this._restoreBets();
        }

        if(GameMgr.singleton.curGameLayer == undefined)
            cc.director.runScene(new GameScene());
    },

    _handleLineBets: function(lstLineBets) {
        if (this._license != "cz")
            return;

        var maxBet = this._iMaxWinLimit / (this._iMaxPay * this._iLines);
        for (var i = lstLineBets.length - 1; i >= 0; --i) {
            if (lstLineBets[i] > maxBet * this.iRateValue) {
                lstLineBets.splice(i, 1);
            }
        }
    },

    //! 恢复之前的消息显示
    _restoreBets : function () {
        this.SpinIndex = 0;

        this.SpinRet = {};
        this.SpinRet.wager = {};
        this.SpinRet.wager.bets = this.Config.wagers.data[0].bets;

        //! 恢复下注数据
        if(this.SpinRet.wager.bets.length > 0) {
            if(this.SpinRet.wager.bets[0].betamount)
                this.iAmount = this.SpinRet.wager.bets[0].betamount;

            if(this.SpinRet.wager.bets[0].betdata && this.SpinRet.wager.bets[0].betdata.coin)
                this.iCoin = this.SpinRet.wager.bets[0].betdata.coin;
        }

        //! 如果有超过一个数据，则必然需要自动选择
        if(this.SpinRet.wager.bets.length > 1)
            this.bAutoSelect = true;

        // var freetype = this._getFreeType(this.SpinRet.wager.bets);
        //
        // if(freetype != 1)
        //     return ;
        //
        // //! 普通免费情况比较特殊，可能会需要特殊处理
        // var bets = this.SpinRet.wager.bets;
        //
        // for(var ii = 0; ii < bets.length; ++ii) {
        //     var retdata = bets[ii].eventdata;
        //
        //     if(retdata.nextCmds && retdata.nextCmds == 'MODE_ICE,MODE_FIRE') {
        //         //! 还没有选择的情况下重入
        //         if(ii >= bets.length - 1)
        //             return ;
        //
        //         //! 需要选择并将UI选择的过程自动化
        //         //var nextdata = bets[ii + 1].eventdata;
        //         this.bAutoSelect = true;
        //         return ;
        //     }
        // }
    },

    //! 跳过部分消息显示结果
    _skipBets : function () {
        //! 走到这个分支应该一定在免费游戏中
        this.SpinIndex = 0;

        this.SpinRet = {};
        this.SpinRet.wager = {};
        this.SpinRet.wager.bets = this.Config.wagers.data[0].bets;

        //! 恢复下注数据
        if(this.SpinRet.wager.bets.length > 0) {
            if(this.SpinRet.wager.bets[0].betamount)
                this.iAmount = this.SpinRet.wager.bets[0].betamount;

            if(this.SpinRet.wager.bets[0].betdata && this.SpinRet.wager.bets[0].betdata.coin)
                this.iCoin = this.SpinRet.wager.bets[0].betdata.coin;
        }

        var gmimsg = this._createGameModuleInfo();
        this._addFGModuleInfo(gmimsg, true);
        this.bAutoSelect = true;
        // this._createSelectKey();
        //
        // this.autoSelectFree(false);
        // this.autoSelectFree(false);
        // this.autoSelectFree(false);

        //! 跳到最后一个消息等待collect
        while(this.SpinIndex < this.SpinRet.wager.bets.length - 1) {
            gmimsg = this._createGameModuleInfo();
        }

        // gmimsg.gmi.isinit = true;
        // GameMgr.singleton.onGameModuleInfo(gmimsg);

        this.bIsInit = true;
        this.bCollect = true;
        this._simCollect();
        // slot.collect({step:this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1})
        //     .then((ret) => {
        //         YggLogic.singleton.onCollect(ret);
        //     })
        //     .catch((err) => {
        //         console.log('collect Error ', err);
        //     });
    },

    //! 虚拟的collect（替换之前的collect方式）
    _simCollect : function () {
        this.bWaitCollect = true;       //! 等待提交
        this.iCollectStep = this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1;

        var gmimsg = this._createGameModuleInfo();

        if(gmimsg) {
            GameMgr.singleton.onGameModuleInfo(gmimsg);
            this._addFGModuleInfo(gmimsg);

            this._createLastGameModuleInfo(gmimsg);

            if(this.SpinCallBack)
                this.SpinCallBack(true);

            this.SpinCallBack = undefined;
        }
    },

    //! 提交
    collect : function () {
        //var nbalance = slot.updateGameBalance();

        if(!this.bWaitCollect)
            return false;

        this.bWaitCollect = false;

        //! 录像虚拟提交过程
        if(this.bReplay) {
            this.bReplayCollect = true;
            return true;
        }

        slot.collect({step:this.iCollectStep})
            .then((ret) => {
                YggLogic.singleton.onCollect(ret);
            })
            .catch((err) => {
                console.log('collect Error ', err);
            });

        return true;
    },

    //! 根据一组消息判断免费类型 0非免费 1普通免费 2超级免费
    _getFreeType : function (bets) {
        for(var ii = 0; ii < bets.length; ++ii) {
            var retdata = bets[ii].eventdata;

            if(retdata.nextCmds && retdata.nextCmds == 'MODE_ICE,MODE_FIRE')
                return 1;

            if (retdata.scatterFreeSpinsWon)
                return 2;
        }

        return 0;
    },

    //! 转换轮子上的数据
    _chgReels : function (reels) {
        var lstarr = [];

        for(var ii = 0; ii < this.sRow; ++ii) {
            var lst = [];

            for(var jj = 0; jj < this.sCol; ++jj) {
                var icon = reels[jj][ii];
                lst.push(icon);
            }

            lstarr.push(lst);
        }

        return lstarr;
    },
    // _chgReels : function (reels) {
    //     var lstarr = [];
    //
    //     for(var ii = 0; ii < this.sRow; ++ii) {
    //         var lst = [];
    //
    //         for(var jj = 0; jj < this.sCol; ++jj) {
    //             var icon = this.iconvalue[reels[jj][ii]];
    //             lst.push(icon);
    //         }
    //
    //         lstarr.push(lst);
    //     }
    //
    //     return lstarr;
    // },

    //! 创建sctter获奖数据
    _creatScatter : function (lstarr, bet) {
        var nums = 0;
        var data = {};

        data.type = 'scatter';
        data.symbol = this.iconvalue.SCATTER;
        data.bet = bet;
        data.multiplies = 5;
        data.win = Math.floor(data.bet * data.multiplies);

        data.positions = [];

        for(var ii = 0; ii < this.sCol; ++ii) {
            for(var jj = 0; jj < this.sRow; ++jj) {
                if(lstarr[jj][ii] == this.iconvalue.SCATTER) {
                    var pos = {x:ii, y:jj};
                    data.positions.push(pos);

                    ++nums;
                }
            }
        }

        if(nums >= 3)
            return data;
        else
            return undefined;
    },

    //! 创建获奖数据
    _createlst : function (wtw, lstarr, bet) {
        var lst = [];

        if(wtw) {
            for(var ii = 0; ii < wtw.length; ++ii) {
                var data = this._createlstdata(wtw[ii], 0, lstarr, bet);

                if(data)
                    lst.push(data);
            }
        }

        // if(wtw2) {
        //     for(var ii = 0; ii < wtw2.length; ++ii) {
        //         var data = this._createlstdata(wtw2[ii], 5, lstarr, bet);
        //
        //         if(data)
        //             lst.push(data);
        //     }
        // }

        return lst;
    },

    //! 填充lst里面的一个的数据
    _createlstdata : function (wtwdata, spy, lstarr, bet) {
        //var line = wtwdata[0] - 1;

        // if(line < 0 || line >= this.Paylines.length)
        //     return undefined;

        var data = {};

        if(wtwdata.type == 2)
            data.type = 'line';
        else
            data.type = 'scatter';

        data.bet = bet;

        data.data = {};
        data.data.line = wtwdata.lineindex + 1;
        data.data.paytype = 'lr';

        data.positions = [];

        for(var ii = 0; ii < wtwdata.pos.length; ) {
            var pos = {x:wtwdata.pos[ii], y:wtwdata.pos[ii + 1]};
            data.positions.push(pos);

            ii += 2;
        }

        data.symbol =  wtwdata.symbol;
        data.multiplies = wtwdata.mul;
        data.win = wtwdata.cashwin;

        return data;
    },

    //! 显示提示信息框，如果可以显示则返回true
    showDlg : function (type, type1, strerror, bshowcash) {
        var str = undefined;

        this.iType = type;
        this.iTyp1 = type1;

        if(this.iType == 2){
            if(this.iTyp1 == -1){
                //LanguageData.instance.setMapValue('TotalMax', strerror);
                //str = LanguageData.instance.getTextStr("uiScreen_TotalMax");
                // var test = slot.uiComponents();
                // var test1 = test.clickActionHandler();
                // var test2 = test1.maximumBetWarning(1);

                if(!uiComponents)
                    uiComponents = slot.uiComponents();

                uiComponents.clickActionHandler().maximumBetWarning(this.iMaxBet);
                return true;
            }
        }
        else if(this.iType == 5){
            if (bshowcash) {
                strerror = LanguageData.instance.formatMoney(strerror.toNumber());
            }

            LanguageData.instance.setMapValue('Limit', strerror);

            if(this.iTyp1 == 1){
                str = LanguageData.instance.getTextStr("common_popup_autoSpin_win");
            }
            else if(this.iTyp1 == 2){
                str = LanguageData.instance.getTextStr("common_popup_autoSpin_lose");
            }
        }

        if(!uiComponents)
            uiComponents = slot.uiComponents();

        if(uiComponents && str) {
            //var data = {title:'title',message:'test',theme:'DARK',primaryButtonText:'OK'};
            var data = {theme:'DARK'};

            data.message = str;
            data.primaryButtonText = LanguageData.instance.getTextStr("common_popup_button_ok");
            data.primaryButtonAction = this.onButton;

            uiComponents.showPopup(data);

            if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
                GameMgr.singleton.curGameLayer.ModuleUI._setState('disconnect', 'show');

            return true;
        }

        return false;
    },

    onButton : function () {
        if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
            GameMgr.singleton.curGameLayer.ModuleUI._setState('disconnect', 'hide');
    },

    stopAutoSpin : function () {
        if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI) {
            GameDataMgr.instance.setIAutoNum(0);
            GameMgr.singleton.curGameLayer.ModuleUI._setState('auto', 0);
        }
    },

    enableAudio : function () {
        if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.gamemenuLayer) {
            GameMgr.singleton.curGameLayer.gamemenuLayer.onBtnSoundClose();
        }
    },

    disableAudio : function () {
        if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.gamemenuLayer) {
            GameMgr.singleton.curGameLayer.gamemenuLayer.onBtnSoundOpen();
        }
    },

    getAudioVolume : function () {
        var volume = GameAssistant.singleton.getVolumeType(GameMgr.singleton.curGameLayer.name);
        if(volume === ""){
            volume = 1;
        }
        else{
            volume = parseInt(volume);
        }

        var svalue = GameAssistant.singleton.getVolumeValue(GameMgr.singleton.curGameLayer.name);

        if(volume)
            return svalue;

        return 0;
    },

    setCanCtrl : function (bctrl) {
        this.bCanCtrl = bctrl;
    },

    canCtrl : function () {
        return this.bCanCtrl;
    },

    updateBalance : function (val) {
        if (val == undefined)
            return;

        for (var i = 0; i < val.length; ++i) {
            if (val[i] != undefined) {
                this.iRealBalance = val[i] * this.iRateValue;
                break;
            }
        }

        this.bWaitRoundEnded = true;
        GameMgr.singleton.onMyMoney(this.iRealBalance);
        this.bWaitRoundEnded = false;
    },

    //向ygg发送totalBetChanged数据
    sendTotalBetChanged : function (value) {
        this.iTotalBet = value;

        if(this.GameReadyRet != undefined) {
            if(gameEmitter && gameEmitter.totalBetChanged) {
                if(this.iSendBet == undefined || this.iSendBet != this.iTotalBet) {
                    this.iSendBet = this.iTotalBet;
                    gameEmitter.totalBetChanged(this.iTotalBet / this.iRateValue);
                }
            }
        }
    },

    sendSpinEnd : function () {
        if(this.bSendLast) {
            this.bWaitRoundEnded = true;
            GameMgr.singleton.onMyMoney(this.iRealBalance);
            this.bWaitRoundEnded = false;
            this.bSendLast = false;
            return ;
        }

        if(this.bReplay && this.bChgBalance) {
            this.bWaitRoundEnded = true;
            GameMgr.singleton.onMyMoney(this.iNewBalance);
            this.bChgBalance = false;
            this.bWaitRoundEnded = false;
        }

        if(!this.bCollect)
            return ;

        this.bCollect = false;

        // if(!this.bSpin)
        //     return ;
        //
        // this.bSpin = false;

        if(this.bChgBalance)
            this.bWaitRoundEnded = true;

        if(gameEmitter) {
            gameEmitter.spinEnded()
                .then((ret) => {
                    YggLogic.singleton.onSpinEnded(ret);
                })
                .catch((err) => {
                    console.log('spinEnded Error ', err);
                });
        }

        if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
            GameMgr.singleton.curGameLayer.ModuleUI._setState('spinend', '1');
    },

    onSpinEnded : function (ret) {
        gameEmitter.gameRoundEnded()
            .then((ret) => {
                YggLogic.singleton.onRoundEnded(ret);
            })
            .catch((err) => {
                console.log('gameRoundEnded Error ', err);
            });
    },

    onRoundEnded : function (ret) {
        var pamount = 0;

        if(ret.nextPrepaid && ret.nextPrepaid.amount)
            pamount = ret.nextPrepaid.amount;

        this.setPrepaid(pamount);

        if(this.bChgBalance) {
            GameMgr.singleton.onMyMoney(this.iNewBalance);
            this.bChgBalance = false;
            this.bWaitRoundEnded = false;
        }

        if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
            GameMgr.singleton.curGameLayer.ModuleUI._setState('spinend', '0');
    },

    //! 是否需要等待回合结束
    isWaitRoundEnded : function () {
        if(this.bWaitRoundEnded == undefined)
            return false;

        return this.bWaitRoundEnded;
    },

    //！请求GameReadyRet数据
    getGameReadyRet: function () {
        gameEmitter.gameReady()
            .then((ret) => {
                YggLogic.singleton.onGameReadyRet(ret);
            })
            .catch((err) => {
                console.log('gameReady Error ', err);
            });
    },

    // ygg有通知栏时，设置游戏的宽高
    setSlotGameSize: function (msg) {
        //! 先处理boost/top-bar
        var top = 0;

        for(var ii = 0; ii < msg.length; ++ii) {
            for(var jj = 0; jj < msg[ii].length; ++jj) {
                var node = msg[ii][jj];

                if(!node.id || node.id != 'boost/top-bar')
                    continue ;

                if(!node.bounds || !node.bounds.height)
                    continue ;

                if(node.bounds.height > top)
                    top = node.bounds.height;
            }
        }

        if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.GameCanvasMgr)
            GameMgr.singleton.curGameLayer.GameCanvasMgr.setAdaptiveAdjustValue('boost/top-bar', top, 0, 0, 0);

        cc.view.setYggFrameSize(msg);
    },

    //! 创建录像数据
    _createReplayData : function () {
        if(this.Config.mode != 'REPLAY')
            return undefined;

        var rdata = this.Config.wagers.data[0];

        if(rdata.bets.length <= 0)
            return undefined;

        var rlen = rdata.bets.length;

        var data = {};

        data.roundid = rdata.wagerid;
        data.status = rdata.status;
        data.time = rdata.timestamp;
        data.bet = Math.round(rdata.bets[0].betamount * this.iRateValue) / this.iRateValue;
        data.win = Math.round(rdata.bets[rlen - 1].betdata.accWa * this.iRateValue) / this.iRateValue;
        data.startbalance = Math.round(rdata.bets[0].betdata.initialBalance * this.iRateValue) / this.iRateValue;
        data.endbalance = Math.round((data.startbalance + data.win - data.bet) * this.iRateValue) / this.iRateValue;

        data.lst = [];
        var totalwin = 0;

        for(var ii = 0; ii < rlen; ++ii) {
            var node = {};

            totalwin = Math.round(totalwin + rdata.bets[ii].eventdata.accWa * this.iRateValue);

            node.step = ii + 1;
            node.win = Math.round(rdata.bets[ii].eventdata.accWa * this.iRateValue) / this.iRateValue;
            node.totalwin = totalwin / this.iRateValue;
            node.freespinsleft = rdata.bets[ii].eventdata.freeSpins;

            var reels = rdata.bets[ii].eventdata.reels;
            var reels2 = rdata.bets[ii].eventdata.reels2;

            var wtw = rdata.bets[ii].eventdata.wtw;
            var wtw2 = rdata.bets[ii].eventdata.wtw2;

            node.symbols = this._chgReels_replay(reels, reels2);
            node.winningline = this._createlst_replay(wtw, wtw2);

            if(!node.freespinsleft)
                node.freespinsleft = 0;

            data.lst.push(node);
        }

        return data;
    },

    //! 转换轮子上的数据
    _chgReels_replay : function (reels, reels2) {
        var lstarr = [];

        for(var ii = 0; ii < 5; ++ii) {
            var lst = [];

            for(var jj = 0; jj < 5; ++jj) {
                var icon = this.iconvalue[reels[jj][ii]];
                lst.push(icon);
            }

            lstarr.push(lst);
        }

        for(var ii = 0; ii < 5; ++ii) {
            var lst = lstarr[ii];

            for(var jj = 0; jj < 5; ++jj) {
                var icon = this.iconvalue[reels2[jj][ii]];
                lst.push(icon);
            }
        }

        //! 复制wild
        for(var ii = 0; ii < 5; ++ii) {
            for(var jj = 0; jj < 10; ++jj) {
                var icon = lstarr[ii][jj];

                if(icon == 0) {
                    if(jj < 5)
                        lstarr[ii][jj + 5] = 0;
                    else
                        lstarr[ii][jj - 5] = 0;
                }
            }
        }

        //! 将右侧图标变大
        for(var ii = 0; ii < 5; ++ii) {
            for(var jj = 5; jj < 10; ++jj) {
                lstarr[ii][jj] += 12;
            }
        }

        return lstarr;
    },

    //! 创建获奖数据
    _createlst_replay : function (wtw, wtw2) {
        var lst = [];

        if(wtw) {
            for(var ii = 0; ii < wtw.length; ++ii) {
                var data = this._createlstdata_replay(wtw[ii], 0);

                if(data)
                    lst.push(data);
            }
        }

        if(wtw2) {
            for(var ii = 0; ii < wtw2.length; ++ii) {
                var data = this._createlstdata_replay(wtw2[ii], 5);

                if(data)
                    lst.push(data);
            }
        }

        return lst;
    },

    //! 填充lst里面的一个的数据
    _createlstdata_replay : function (wtwdata, spx) {
        var line = wtwdata[0] - 1;

        // if(line < 0 || line >= this.Paylines.length)
        //     return undefined;

        var data = [];

        for(var ii = 0; ii < 5; ++ii) {
            var lst = [];

            for(var jj = 0; jj < 10; ++jj)
                lst.push(0);

            data.push(lst);
        }

        for(var ii = 0; ii < wtwdata[2].length; ++ii) {
            var inum = parseInt(wtwdata[2].slice(ii, ii + 1));

            if(inum > 0) {
                px = Math.floor(ii / 5) + spx;
                py = ii % 5;

                if(spx == 0)
                    data[py][px] = 1;
                else
                    data[py][px] = 2;
            }
        }

        return data;
    },

    //! 设置预付费
    setPrepaid : function (amount) {
        if(amount <= 0) {
            this.bPrepaid = false;

            if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
                GameMgr.singleton.curGameLayer.ModuleUI._setState('prepaid', 'close');
        }
        else {
            this.bPrepaid = true;

            if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI) {
                var bnum = Math.round(amount * this.iRateValue / this.sLine);

                var curindex = GameDataMgr.instance.getNumberValue('_iCurCoinIndex');
                var lstconvalue = GameDataMgr.instance.getCoinValueList();
                for (var ii = 0; ii < lstconvalue.length; ++ii) {
                    if (bnum == lstconvalue[ii]) {
                        var index = ii;
                    }
                }
                if(curindex != index)
                    GameMgr.singleton.curGameLayer.ModuleUI.setCoinValue(bnum);

                GameMgr.singleton.curGameLayer.ModuleUI._setState('prepaid', 'open');
            }
        }
    },

    //! 是否是预付费游戏
    isPrepaid : function () {
        return true; this.bPrepaid;
    },

    update : function (dt) {
        if(this.iSelectFGTime > 0) {
            this.iSelectFGTime -= dt;

            if(this.iSelectFGTime <= 0) {
                this.iSelectFGTime = 0;
                //this._sendSelectFreeModuleInfo(this.iSelectFGKey);
                this.autoSelectFree();
            }
        }

        if(this.iWaitSpinTime > 0) {
            this.iWaitSpinTime -= dt;

            if(this.iWaitSpinTime <= 0) {
                this.iWaitSpinTime = -1;

                if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
                    GameMgr.singleton.curGameLayer.ModuleUI._setState('waitappear', 0);

                gameEmitter.gameRoundStarted()
                    .then((ret) => {
                        YggLogic.singleton.onRoundStarted(ret);
                    })
                    .catch((err) => {
                        console.log('gameRoundStarted Error ', err);
                    });
            }
        }

        if(this.bReplayCollect) {
            this.bReplayCollect = false;
            this.onCollect_Replay();
        }
    },

    isWaitSpin : function () {
        return this.iWaitSpinTime > 0;
    },

    //! 是否显示Home键
    isShowHome : function () {
        return cc.sys.isMobile && this.bMenuHomeVisible;
    },

    //! 点击Home键
    onClickHome : function () {
        if(!uiComponents)
            uiComponents = slot.uiComponents();

        uiComponents.clickActionHandler().home();
    },

    //!补充新增模块没有的函数----
    //! 判断是否只显示欧元
    isDisableCurrencyCoins : function () {
        if(this.bDisableCurrencyCoins == undefined){
            return false;
        }

        return this.bDisableCurrencyCoins;
    },

    isShowOnlineTime: function () {
        return this.bShowOnlineTime;
    },

    getOnlineTime: function () {
        if (this.iOnlineTimestamp <= 0) {
            return "00:00";
        }

        var curStamp = (new Date()).getTime();
        var diff = Math.floor((curStamp - this.iOnlineTimestamp) / 1000);

        var hours = Math.floor(diff / 3600);
        var minutes = Math.floor((diff - hours * 3600) / 60);
        var seconds = diff - hours * 3600 - minutes * 60;

        if (hours < 10)
            hours = '0' + hours;

        if (minutes < 10)
            minutes = '0' + minutes;

        if (seconds < 10)
            seconds = "0" + seconds;

        return hours + ':' + minutes + ":" + seconds;
    },

    startOnlineTime: function () {
        this.iOnlineTimestamp = (new Date()).getTime();
    },

    clearOnlineTime: function () {
        this.iOnlineTimestamp = 0;
    },

    needSaveBetNum: function () {
        if (this.bReplay) {
            return false;
        }
        return  true;
    },

    setUserAutoNums: function (num) {
        this.iUserAutoNums = num;
    },

    getUserAutoNums : function () {
        if(this.iUserAutoNums == undefined)
            return -1;
        return this.iUserAutoNums;
    },

    updateAndNext: function (dt) {
        this.update(dt);

        if (this.isWaitRoundEnded()) {
            return false;
        }
        return true;
    },

    isNoCofig: function () {
        if (this.Config == undefined) {
            return true;
        }
        return false;
    },

    nativeDisconnect: function () {
        return false;
    },

    getAutoSpinData: function () {
        if (this.lstAutoPlayLevels != undefined) {
            return this.lstAutoPlayLevels;
        }

        var temp = this.getHasLossLimit();
        if(temp){
            return ["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];
        }
        return ["10", "25", "50", "75", "100", "250", "500", "750", "1000", "∞"];
    },

    getAutoLossData: function () {
        var temp = this.getHasLossLimit();
        if(temp){
            return ["×10", "×20", "×50", "×100"];
        }
        return ["No Limit", "×10", "×20", "×50", "×100"];
    },

    getAutoWinData:function () {
        var temp = this.getHasLossLimit();
        if(temp){
            return ["×10", "×20", "×50", "×100"];
        }
        return ["No Limit", "×10", "×20", "×50", "×100"];
    },

    getRealBalance: function () {
        var balance = this.iRealBalance;
        return balance;
    },

    //! 获取当前的币种
    getCurrency: function () {
        if (this.Config && this.Config.currency)
            return this.Config.currency;

        return 'EUR';
    },

    //new 0615*************************
    onPressedSpace: function () {
        return !this.bCanCtrl;
    },

    //! 获取当前小数倍数
    getCurRateValue: function () {
        var rate = GameDataMgr.instance.getCoinValueRate();
        return rate;
    },

    isRoundRuning: function () {
        return this.bRunning;
    },

    getDefaultCoinValue: function () {
        return 0;
    },

    //! 获取其他免费次数
    getOtherFGNums : function () {
        if(this.iOtherFGNumsIndex >= this.lstOtherFGNums.length)
            return 0;

        var nums = this.lstOtherFGNums[this.iOtherFGNumsIndex]
        ++this.iOtherFGNumsIndex;

        return nums;;
    },

    //! 获取其他免费倍数
    getOtherFGMul : function () {
        if(this.iOtherFGMulIndex >= this.lstOtherFGMul.length)
            return 0;

        var mul = this.lstOtherFGMul[this.iOtherFGMulIndex]
        ++this.iOtherFGMulIndex;

        return mul;;
    },

    //! 获取其他免费符号
    getOtherFGSymbols : function () {
        if(this.iOtherFGSymbolsIndex >= this.lstOtherFGSymbols.length)
            return [];

        var symbols = this.lstOtherFGSymbols[this.iOtherFGSymbolsIndex]
        ++this.iOtherFGSymbolsIndex;

        return symbols;
    },

    //! 初始化作弊数据
    _initCheat : function () {
        this.bCheat = false;
        this.lstCheat = [];

        if(CHEAT_DATA && CHEAT_DATA.length > 0) {
            this.bCheat = true;
            this.lstCheat = CHEAT_DATA.split('|');
        }
        else if(this.cheatmode) {
            this.bCheat = true;
            this.lstCheat.push(this.cheatdata1);
            this.lstCheat.push(this.cheatdata2);
            this.lstCheat.push(this.cheatdata3);
        }
    },

    //! 添加作弊数据
    _addCheat : function (obj, index) {
        this._initCheat();

        if(!this.bCheat)
            return ;

        if(!index)
            index = 0;

        if(index >= this.lstCheat.length)
            return;

        obj.test = true;
        obj.cheat = this.lstCheat[index];
    },

    onMyMoney: function (money) {
    },

    setCurrency: function (currency) {
    },

    setIsWaitCommonFreeGame: function (bWait) {
    },

    getScQuickStopOn: function () {
        return true;
    },

    skipSplashScreen: function() {
        var gameLayer = GameMgr.singleton.curGameLayer;
        if (gameLayer && gameLayer.closeInfoLayer) {
            gameLayer.closeInfoLayer();
        }
    },

    openGameRules: function() {
        var gameLayer = GameMgr.singleton.curGameLayer;
        if (gameLayer && gameLayer.onTouchGameRules) {
            var layer = new SettingLayer(this._mgr);
            layer.setExNodeVisible(false);
            var h = cc.view.getFrameSize().height - (layer.Panel_buttom.getContentSize().height / layer.Panel_ui.getContentSize().height * cc.view.getFrameSize().height);

            gameLayer.onTouchGameRules(undefined, ccui.Widget.TOUCH_ENDED, h);

            layer.setOkCallFunction(this.onBtnOpen, this);
            gameLayer.addChild(layer, 1001);
            LanguageData.instance.showTextStr("common_label_gamerules",layer.textTitle,false,"textTitle");
        }
    },

    //!-----

    _deepClone : function (source) {
        //! 更换拷贝方式
        var jstr = JSON.stringify(source);
        var targetObj = JSON.parse(jstr);
        return targetObj;

        if (!source || typeof source !== 'object') {
            return source;
        }

        //var targetObj = source.constructor === Array ? [] : {};
        var targetObj = {};

        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (source[key] && typeof source[key] === 'object') {
                    targetObj[key] = this._deepClone(source[key]);
                } else {
                    var stype = typeof source[key];

                    if(stype != 'string' && stype != 'number' && stype != 'boolean')
                        continue ;

                    targetObj[key] = source[key];
                }
            }
        }

        return targetObj;
    },
});

YggLogic.singleton = new YggLogic();

var testconfig = {
    gamecode: 'taoist',

    license: 'uk',
    language: 'en',
    currency: 'EUR',
    clock_visible: true,
    loading_ukgc_logo: true,
    minimum_spintime: 0,
    realitycheck: 300,
    realitycheck_elapsed: 30,
    realitycheck_history: true,
    history_visible: true,
    online_time: true,

    autospin_visible: true,
    autospin_times: [0, 25, 50, 100, 250, 500],
    loss_limit: [0, 10, 20, 50, 100], // 注意：loseLimit仅支持5个选项
    single_win_limit: [0, 10, 20, 50, 100], // 注意：winLimit仅支持5个选项

    list_coin: [1, 2, 5, 10, 20, 50, 100],
    default_coin: 10,		//! 默认的下注值
    current_decimal: 2,
    coin_decimal: 0,

    game_mode: 'PLAY',			//! PLAY表示游戏 REPLAY表示录像 RESTORE表示继续未完成的游戏
    scquickstopon: true,//默认true(服务器没有配置项则是true),true则sc期待出现时，前端可以快速停止
    is_token: true // 玩家是否可以点击切换金额显示的类型（货币 or 代币）。默认true，可以
};
var BasePltLogic = cc.Class.extend({
    ctor: function () {
        this.iUserAutoNums = -1;
        this.scQuickStopOn = true;
        this._bSupportChgCoinType = true;

    },
    //! 设置玩家设置的自动次数（如果不使用自动或者自动次数使用完，则传-1）
    setUserAutoNums: function (num) {
        this.iUserAutoNums = num;
    },
    getUserAutoNums: function () {
        if (this.iUserAutoNums == undefined)
            return -1;
        return this.iUserAutoNums;
    },
    //! 判断是否全屏
    isFullScreen: function () {
        if (typeof (isIphoneFullScreen) != 'undefined' && isIphoneFullScreen) {
            return true;
        }

        if (cc.sys.isMobile) {
            return cc.screen.fullScreen();
        }

        var zoomnum = this.detectZoom();

        if (this.explorer.indexOf('firefox') > 0)
            return window.outerHeight === window.screen.height && window.outerWidth === window.screen.width;
        else
            return Math.round(document.body.scrollHeight * zoomnum / 100) == window.screen.height && Math.round(document.body.scrollWidth * zoomnum / 100) == window.screen.width;
    },
    detectZoom: function () {
        var ratio = 0,
            screen = window.screen,
            ua = navigator.userAgent.toLowerCase();
        if (window.devicePixelRatio !== undefined) {
            ratio = window.devicePixelRatio;
        } else if (~ua.indexOf('msie')) {
            if (screen.deviceXDPI && screen.logicalXDPI) {
                ratio = screen.deviceXDPI / screen.logicalXDPI;
            }
        } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
            ratio = window.outerWidth / window.innerWidth;
        }
        if (ratio) {
            ratio = Math.round(ratio * 100);
        }
        return ratio;
    },
    //! 获取当前时间
    getTime: function () {
        var myDate = new Date(NetTime.singleton.getCurNetTime() * 1000);
        var hours = myDate.getHours();
        var minutes = myDate.getMinutes();
        if (hours < 10)
            hours = '0' + hours;

        if (minutes < 10)
            minutes = '0' + minutes;

        return hours + ':' + minutes;
    },

    getScQuickStopOn: function () {
        return this.scQuickStopOn;
    },

    isSupportChgCoinType: function() {
        return this._bSupportChgCoinType;
    }
});

var RelaxPltLogic = BasePltLogic.extend({
    ctor: function () {
        BasePltLogic.prototype.ctor.call(this);
        this.GameReadyRet = undefined;
        this.bInit = false;
        this.bGameReady = false;
        this.bLogin = false;
        this.bAutoSelect = false;

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
        this.iBgTotalWin = 0;             //! 在普通游戏中的赢得
        this.bCollect = false;

        this.iNewBalance = 0;
        this.bChgBalance = false;
        this.bSpin = false;
        this.yggnoticemsg = null;

        this.bPrepaid = false;              //! 当前是否是预付费
        this.iMaxBet = 0;

        this.minimalSpinningTime = 0;       //! Spin最小等待时间


        this.lastGameModuleInfo = undefined;           //! 保留的消息（数据经过调整）
        this.iRealBalance = 0;                                      //! 用户持有真实金额（不考虑下注）
        this.bSendLast = false;                                    //! 是否正在发送保留消息

        this.bShowGambling = false;

        this.bReality = false;
        this.iRealityTime = -1;
        this.bRealityDlg = undefined;
        this.iRealityMoney = -1;
        this.iCurMoney = -1;
        this.bRunning = false;

        this.bShowOnlineTime = false;
        this.iOnlineTimestamp = 0;

        this.lstSpinTimes = ["OFF", "25", "50", "100", "200", "500"];
        this.lstLostLimit = ["No Limit", "×10", "×20", "×50", "×100"];
        this.lstSingleWin = ["No Limit", "×10", "×20", "×50", "×100"];

        this.bPauseGame = false;
        this.bRgPauseGame = false;          //! 根据Rg要求暂停游戏（如果游戏回合没结束，则不立刻暂停）

        this.bWaitCommonFreeGame = false; // 是否需要等待免费红包弹出
        this.iDefaultCoinVal = 10;  // 默认的下注值

        this.explorer = window.navigator.userAgent.toLowerCase();
    },

    onRgPause: function (event) {
        if (event.data && event.data.autoPlayOnly) {
            console.log('rg_pause autoPlayOnly');
            this.stopAutoSpin();
            // If event.data.autoPlayOnly is true, only pause autoPlay.
        } else {
            // Hard pause. Once any unfinished round has completed, disable controls
            // (so a new round cannot be started) and pause autoplay.
            this.bRgPauseGame = true;
            this.eventRgPauseGame = event;
            // this.bPauseGame = true;
            //
            // if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
            //     GameMgr.singleton.curGameLayer.ModuleUI._setState('gameready', 'wait');
            //
            // // Report game paused.
            // RgPostMessageAPI.reportPaused();
        }
    },

    onRgResume: function () {
        // Reality check was closed, game can now continue.
        // Re-enable controls and resume autoplay if it was paused by rg_pause.
        this.bRgPauseGame = false;
        this.bPauseGame = false;

        if (GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
            GameMgr.singleton.curGameLayer.ModuleUI._setState('gameready', 'ready');
    },

    onRgUpdateBalance: function () {
        // Account balance has changed.
        // Request balance by calling /game/getbalance.
    },

    // onOprgNavigateGame : function (event) {
    //     if (event) {
    //         console.log('onOprgNavigateGame');
    //     }
    // },

    onOprgMessage: function (event) {
        // if (event) {
        //     if(event.data && event.data.rgMessage) {
        //         if(event.data.rgMessage == 'oprg_NavigateGame') {
        //             if(event.data.payload && event.data.payload.url) {
        //                 RgPostMessageAPI.userAction(event.data.payload.url);
        //             }
        //         }
        //     }
        //     //window.location.href=url
        // }
    },

    goHome: function () {
        if (typeof RgPostMessageAPI != 'undefined' && this.Params && this.Params.homeurl) {
            RgPostMessageAPI.userAction(this.Params.homeurl);
            return true;
        }

        if (typeof (goHome) != 'undefined') {
            goHome();
            return true;
        }
        return false;
    },

    isPauseGame: function () {
        return this.bPauseGame;
    },

    onConfig: function (cfg, params) {
        this.Config = cfg;
        this.Params = params;

        //! 初始化relax框架
        if (typeof RgPostMessageAPI != 'undefined') {
            var self = this;

            window.addEventListener("message", (event) => {
                console.log('message');
                self.onOprgMessage(event);
            });

            RgPostMessageAPI.init(true);

            //! 添加事件侦听
            window.addEventListener('rg_pause', (event) => {
                console.log('rg_pause');
                self.onRgPause(event);
            });

            window.addEventListener('rg_resume', () => {
                console.log('rg_resume');
                self.onRgResume();
            });

            window.addEventListener('rg_updateBalance', () => {
                console.log('rg_updateBalance');
                self.onRgUpdateBalance();
            });

            // window.addEventListener('oprg_NavigateGame', (event) => {
            //     console.log('oprg_NavigateGame');
            //     self.onOprgNavigateGame(event);
            // });
        }
        this.explorer = window.navigator.userAgent.toLowerCase();
        //! 是否显示gambling
        if (this.Config && this.Config.loading_ukgc_logo)
            this.bShowGambling = true;

        //! Spin最小等待时间
        if (this.Config && this.Config.minimum_spintime) {
            this.minimalSpinningTime = this.Config.minimum_spintime;       //! Spin最小等待时间
        }

        if (this.Config && this.Config.scquickstopon != undefined) {
            this.scQuickStopOn = this.Config.scquickstopon;
        }

        if (this.Config && this.Config.is_token != undefined) {
            this._bSupportChgCoinType = this.Config.is_token;
        }

        //! 货币单位
        if (this.Config && this.Config.currency) {
            LanguageData.instance.changeCurrency(this.Config.currency);
        }

        // //! 赔付线
        // if(cfg.settings && cfg.settings.slotConfig && cfg.settings.slotConfig.Paylines)
        //     this.Paylines = cfg.settings.slotConfig.Paylines;

        //! 是否需要等待用户恢复
        if (this.Config && this.Config.game_mode) {
            // if(cfg.mode == 'RESTORE')
            //     this.bWaitRestore = true;
            // else if(cfg.mode == 'REPLAY')
            //     this.bReplay = true;
        }

        // //! 赔付倍数
        // this.Paytable = [];
        //
        // for(var ii = 0; ii < 12; ++ii) {
        //     var pt = [];
        //
        //     for(var jj = 0; jj < 5; ++jj)
        //         pt.push(0);
        //
        //     this.Paytable.push(pt);
        // }
        //
        // if(cfg.settings && cfg.settings.slotConfig && cfg.settings.slotConfig.Prizes) {
        //     for(var ii = 0; ii < cfg.settings.slotConfig.Prizes.length; ++ii) {
        //         var prize = cfg.settings.slotConfig.Prizes[ii];
        //
        //         var icon = this.iconvalue[prize[0]];
        //         var ib = 4 - (prize.length - 1);
        //
        //         if(icon != undefined) {
        //             for(var jj = 1; jj < prize.length; ++jj) {
        //                 this.Paytable[icon][ib + jj] = parseInt(prize[jj]);
        //             }
        //         }
        //     }
        // }

        //是否使用ygg的自动规则
        if (this.Config && this.Config.loss_limit) {
            this.hasLossLimit = (this.Config.loss_limit[0] > 0);
        }
        //是否使用ygg历史记录
        if (this.Config && this.Config.history_visible != undefined) {
            this.isGameHistoryEnabled = this.Config.history_visible;
        }

        //! 是否显示时间
        if (this.Config && this.Config.clock_visible != undefined) {
            this.shouldShowClock = this.Config.clock_visible;
        }

        //! 是否可以自动
        if (this.Config && this.Config.autospin_visible != undefined) {
            this.isAutoSpinsDisabled = !this.Config.autospin_visible;
        }

        //! 是否有时间提示
        if (this.Config && this.Config.realitycheck != undefined && this.Config.realitycheck > 0) {
            this.bReality = true;
        }

        if (this.Config && this.Config.realitycheck_elapsed != undefined)
            this.iRealityTime = parseInt(this.Config.realitycheck_elapsed);
        else
            this.iRealityTime = 0;

        //! 是否显示在线时间
        if (this.Config && this.Config.online_time !== undefined) {
            this.bShowOnlineTime = this.Config.online_time;
        }

        //! 自动转相关数据
        if (this.Config && this.Config.autospin_times) {
            this.lstSpinTimes = [];

            for (var ii = 0; ii < this.Config.autospin_times.length; ++ii) {
                if (this.Config.autospin_times[ii] > 0)
                    this.lstSpinTimes.push(this.Config.autospin_times[ii].toString());
            }

            if (this.Config.autospin_times[0] == 0)
                this.lstSpinTimes.push('∞');
        }

        if (this.Config && this.Config.loss_limit) {
            this.lstLostLimit = [];

            for (var ii = 0; ii < this.Config.loss_limit.length; ++ii) {
                if (this.Config.loss_limit[ii] == 0) {
                    this.lstLostLimit.push('No Limit');
                } else {
                    this.lstLostLimit.push('×' + this.Config.loss_limit[ii]);
                }
            }
        }

        if (this.Config && this.Config.single_win_limit) {
            this.lstSingleWin = [];

            for (var ii = 0; ii < this.Config.single_win_limit.length; ++ii) {
                if (this.Config.single_win_limit[ii] == 0) {
                    this.lstSingleWin.push('No Limit');
                } else {
                    this.lstSingleWin.push('×' + this.Config.single_win_limit[ii]);
                }
            }
        }

        if (this.Config && this.Config.default_coin) {
            this.iDefaultCoinVal = this.Config.default_coin;
        }
    },

    //! 设置当前的币种
    setCurrency: function (currency) {
        LanguageData.instance.changeCurrency(currency);

        if (this.Config)
            this.Config.currency = currency;
    },

    //! 获取当前的币种
    getCurrency: function () {
        if (this.Config && this.Config.currency)
            return this.Config.currency;

        return 'EUR';
    },

    //! 获取当前小数倍数
    getCurRateValue: function () {
        return this.iRateValue;
    },

    //! 判断是否显示gambling
    isShowGambling: function () {
        return this.bShowGambling;
    },


    //! 是否可以自动转
    canAutoSpin: function () {
        if (this.isAutoSpinsDisabled == undefined)
            return true;

        return !this.isAutoSpinsDisabled;
    },

    //! 是否显示时间
    isShowTime: function () {
        //! 全屏必然显示时间
        if (this.isFullScreen())
            return true;
        return this.shouldShowClock;
    },


    startOnlineTime: function () {
        this.iOnlineTimestamp = (new Date()).getTime();

        if (this.Config && this.Config.realitycheck_elapsed != undefined)
            this.iOnlineTimestamp -= parseInt(this.Config.realitycheck_elapsed) * 1000;
    },

    clearOnlineTime: function () {
        this.iOnlineTimestamp = 0;
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

    //获取是否使用ygg的自动规则
    getHasLossLimit: function () {
        return this.hasLossLimit;
    },

    //获取是否使用ygg的历史记录
    getIsGameHistoryEnabled: function () {
        return this.isGameHistoryEnabled;
    },

    isGameReady: function () {
        return this.bGameReady;
    },

    onGameReadyRet: function (ret) {
        if (ret) {
            this.GameReadyRet = ret;
        }

        this.bGameReady = true;

        var pamount = 0;

        //! 恢复之前的局面视为prepaid
        if (this.GameReadyRet && (this.GameReadyRet.restoreMode == 'RESTORE' || this.GameReadyRet.restoreMode == 'SKIP'))
            this.bPrepaid = true;

        if (!this.bLogin && this.bInit)
            this._login();

        if (this.iTotalBet) {
            this.sendTotalBetChanged(this.iTotalBet);
        }
        if (GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
            GameMgr.singleton.curGameLayer.ModuleUI._setState('gameReady', 'ready');

        if (typeof RgPostMessageAPI != 'undefined')
            RgPostMessageAPI.reportGameReady();
    },

    init: function () {
        //! 放入语言
        if (typeof (lang) != 'undefined') {
            LanguageData.instance.setLanguage(lang);
            LanguageData.instance.refreshShowedText();
        } else if (this.Config && this.Config.language) {
            var langobj = this.Config.language;
            LanguageData.instance.setLanguage(langobj);
            LanguageData.instance.refreshShowedText();
        }

        this.bInit = true;

        if (!this.bWaitRestore)
            this._login();
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

        if (this.bReplay) {
            var gmimsg = this._createGameModuleInfo();

            if (gmimsg) {
                GameMgr.singleton.onGameModuleInfo(gmimsg);

                if (this.SpinCallBack)
                    this.SpinCallBack(true);

                this.SpinCallBack = undefined;
            }
        } else if (bet >= 0 && times >= 0 && lines >= 0) {
            //! 真实下注
            var spindata = {};

            this.iCoin = bet / this.iRateValue;
            this.iAmount = spindata.coin * lines;

            spindata.coin = bet / this.iRateValue;
            spindata.amount = spindata.coin * lines;

            // if(CHEAT_DATA && CHEAT_DATA.length > 0) {
            //     spindata.test = true;
            //     spindata.cheat = CHEAT_DATA;
            // }
            // else if(this.cheatmode) {
            //     spindata.test = true;
            //     spindata.cheat = this.cheatdata;
            // }

            spindata.gameid = gameid;
            spindata.bet = bet;
            spindata.times = times;
            spindata.lines = lines;
            spindata.bfree = bfree;

            this.spindata = spindata;
            this.onSpinStarted();
        } else {
            var spindata = {};
            spindata.gameid = gameid;
            spindata.bet = bet;
            spindata.times = times;
            spindata.lines = lines;
            spindata.bfree = bfree;
            this.spindata = spindata;

            //! 直接发消息
            this.onSpinStarted();
        }
    },

    //! 模拟gamectrl2消息
    gamectrl2: function (gameid, ctrlname, ctrlparam, callback) {
        if (ctrlname == 'selectfree') {
            if (ctrlparam)
                this._selectFree(ctrlparam.curkey, callback);
        }
    },

    _selectFree: function (curkey, callback) {
        //gameEmitter.spinEnded();

        this.SelectFreeCallBack = callback;

        //! 如果是掉线重入，则不发消息，自动选择
        if (this.bAutoSelect) {
            this.autoSelectFree();
            this.bAutoSelect = false;
            return;
        }

        var selectdata = {};

        if (curkey == 0) {
            selectdata.cmd = 'MODE_ICE';
        } else {
            selectdata.cmd = 'MODE_FIRE';
        }

        selectdata.step = this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1;
        //selectdata.wagerid = this.SpinRet.wager.wagerid;

        //! 下注数据
        selectdata.coin = this.iCoin;
        selectdata.amount = this.iAmount;

        if (CHEAT_DATA && CHEAT_DATA.length > 0) {
            selectdata.test = true;
            selectdata.cheat = CHEAT_DATA;
        } else if (this.cheatmode) {
            selectdata.test = true;
            selectdata.cheat = this.cheatdata;
        }

        slot.play(selectdata)
            .then((ret) => {
                YggLogic.singleton.onSelectFreeRet(ret);
            })
            .catch((err) => {
                console.log('play Error  ', err);
            });
    },

    isSpinEnd: function () {
        var ret = this.SpinRet;
        var ri = this.SpinIndex;

        if (ri < ret.wager.bets.length - 1)
            return false;

        if (ri > ret.wager.bets.length - 1)
            return true;

        var retdata = ret.wager.bets[ri].eventdata;

        if (retdata.nextCmds && retdata.nextCmds == 'MODE_ICE,MODE_FIRE')
            return false;

        return true;
    },

    onCollect: function (ret) {
        if (ret) {
            // if(ret.resultBal && ret.resultBal.cash)
            //     GameMgr.singleton.onMyMoney(Math.round(ret.resultBal.cash * this.iRateValue));

            // if((ret.cashRace && ret.cashRace.hasWon) || this.bPrepaid) {
            //     // if(ret.resultBal && ret.resultBal.cash)  {
            //     //     GameMgr.singleton.onMyMoney(Math.round(ret.resultBal.cash * this.iRateValue));
            //     // }
            //
            //     this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue);
            //     this.bChgBalance = true;
            // }
            // else {
            //     this.bChgBalance = false;
            // }

            if (ret.resultBal && ret.resultBal.cash) {
                this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue);
                this.bChgBalance = true;
                this.iRealBalance = this.iNewBalance;
            }

            // //! 测试
            // if(this.itestMoney == undefined)
            //     this.itestMoney = 1000;
            // else
            //     this.itestMoney += 1000;
            //
            // this.bChgBalance = true;
            // this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue + this.itestMoney);

            var gmimsg = this._createGameModuleInfo();

            if (gmimsg) {
                GameMgr.singleton.onGameModuleInfo(gmimsg);

                this._createLastGameModuleInfo(gmimsg);

                if (this.SpinCallBack)
                    this.SpinCallBack(true);

                this.SpinCallBack = undefined;
            }

            // gameEmitter.gameRoundEnded();
            // gameEmitter.spinEnded();
        }
    },

    onRoundStarted: function (ret) {
        gameEmitter.spinStarted()
            .then((ret) => {
                YggLogic.singleton.onSpinStarted(ret);
            })
            .catch((err) => {
                console.log('spinStarted Error ', err);
            });
    },

    onSpinStarted: function (ret) {
        // if(Math.random() > 0.5) {
        //     this._sendLastGameModuleInfo();
        //     return ;
        // }

        this.bSpin = true;

        var self = this;
        MainClient.singleton.newspin(this.spindata.gameid, this.spindata.bet, this.spindata.times, this.spindata.lines, this.spindata.bfree, function (isok) {
            if (isok) {
                self.onSpinRet();
            }
        }, true);

        // slot.spin(this.spindata)
        //     .then((ret) => {
        //         YggLogic.singleton.onSpinRet(ret);
        //     })
        //     .catch((err) => {
        //         //console.log('spin Error ', err);
        //         YggLogic.singleton.opSpinError(err);
        //     });
    },

    opSpinError: function (err) {
        console.log('spin Error ', err);
        this._sendLastGameModuleInfo();
    },

    onSpinRet: function (ret) {
        //! 通知游戏收到消息
        if (this.SpinCallBack) {
            this.SpinCallBack(true);
            this.SpinCallBack = undefined;
        }

        return;

        this.SpinRet = ret;
        this.SpinIndex = 0;
        this.TurnWin = 0;

        // var str = JSON.stringify(ret);
        // cc.log(str);

        if (ret) {
            //! userbaseinfo
            //! 如果直接结束则更新balance
            // if(ret.wager && ret.wager.status == 'Finished') {
            //     if((ret.cashRace && ret.cashRace.hasWon) || this.bPrepaid) {
            //         // if(ret.resultBal && ret.resultBal.cash)  {
            //         //     GameMgr.singleton.onMyMoney(Math.round(ret.resultBal.cash * this.iRateValue));
            //         // }
            //
            //         this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue);
            //         this.bChgBalance = true;
            //     }
            //     else {
            //         this.bChgBalance = false;
            //     }
            // }

            if (ret.resultBal && ret.resultBal.cash) {
                this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue);
                this.bChgBalance = true;
                this.iRealBalance = this.iNewBalance;
            }

            // //! 测试
            // if(this.itestMoney == undefined)
            //     this.itestMoney = 1000;
            // else
            //     this.itestMoney += 1000;
            //
            // this.bChgBalance = true;
            // this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue + this.itestMoney);

            //! gamemoduleinfo
            if (ret.wager && ret.wager.bets && ret.wager.bets.length > 0) {
                // if(ret.wager.bets.length > 1) {
                //     var nret = this._deepClone(ret);
                // }

                var gmimsg = this._createGameModuleInfo();

                if (gmimsg) {
                    GameMgr.singleton.onGameModuleInfo(gmimsg);
                    this._createLastGameModuleInfo(gmimsg);
                }

                //! 没有中奖的情况
                if (this.isSpinEnd()) {
                    this.bCollect = true;
                    // //gameEmitter.gameRoundEnded();
                    // gameEmitter.spinEnded();
                    //
                    // gameEmitter.gameRoundEnded()
                    //     .then(() => {
                    //         YggLogic.singleton.onRoundEnded();
                    //     })
                    //     .catch((err) => {
                    //         console.log('spin ', err);
                    //     });
                }

                // var reels = ret.wager.bets[0].eventdata.reels;
                // var reels2 = ret.wager.bets[0].eventdata.reels2;
                //
                // if(reels && reels2) {
                //     var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"icefire2_bg\",\"gameid\":468,\"gmi\":{\"isspinend\":true,\"spinret\":{\"totalwin\":0,\"lst\":[],\"realsuperfgnums\":0,\"realwin\":0},\"turnwin\":0,\"turnnums\":1,\"curm\":5}}";
                //     var gmimsg = JSON.parse(gmistr);
                //
                //     gmimsg.gmi.spinret.bet = Math.floor(ret.wager.bets[0].betdata.coin * 100);
                //     gmimsg.gmi.spinret.times = 1;
                //     gmimsg.gmi.spinret.lines = ret.wager.bets[0].betdata.ncoins;
                //
                //     gmimsg.gmi.lstarr = this._chgReels(reels, reels2);
                //
                //     GameMgr.singleton.onGameModuleInfo(gmimsg);
                // }
            }

            if (this.SpinCallBack) {
                this.SpinCallBack(true);
                this.SpinCallBack = undefined;
            }
        } else {
            if (this.SpinCallBack) {
                this.SpinCallBack(false);
                this.SpinCallBack = undefined;
            }
        }
    },

    onSelectFreeRet: function (ret) {
        if (ret) {
            //var cret = ret;
            this.SpinRet = ret;
            this.SpinIndex = 0;

            //! 创造一个选择的消息
            var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"icefire2_fg\",\"gameid\":468,\"gmi\":{\"isspinend\":true,\"lastnums\":10,\"totalnums\":10,\"totalwin\":0,\"turnwin\":0,\"turnnums\":0,\"bet\":1,\"lines\":30,\"curm\":-1,\"fgnums\":10,\"exwilds\":150,\"curkey\":0}}";
            var gmimsg = JSON.parse(gmistr);

            var bdata = ret.wager.bets[0].betdata;
            var edata = ret.wager.bets[0].eventdata;

            //! 选择类型
            if (bdata.cmd == 'MODE_ICE')
                gmimsg.gmi.curkey = 0;
            else
                gmimsg.gmi.curkey = 1;

            //! 免费次数
            if (edata.reSpins)
                gmimsg.gmi.fgnums = edata.freeSpins;
            else
                gmimsg.gmi.fgnums = edata.freeSpins + 1;

            this.addFGNums = gmimsg.gmi.fgnums;

            //! 增加W
            if (edata.reelSet) {
                var bstr = "CascadeFreeSpinsReels";
                var eindex = edata.reelSet.indexOf("Wilds");
                var numstr = edata.reelSet.substring(bstr.length, eindex);
                gmimsg.gmi.exwilds = parseInt(numstr);
            }

            this.bFree = true;
            this.FgNums = gmimsg.gmi.fgnums;
            GameMgr.singleton.onGameModuleInfo(gmimsg);

            if (this.SelectFreeCallBack) {
                this.SelectFreeCallBack(true);
                this.SelectFreeCallBack = undefined;
            }
        } else {
            if (this.SelectFreeCallBack) {
                this.SelectFreeCallBack(false);
                this.SelectFreeCallBack = undefined;
            }
        }
    },

    autoSelectFree: function () {
        //! 创造一个选择的消息
        var ret = this.SpinRet;

        var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"icefire2_fg\",\"gameid\":468,\"gmi\":{\"isspinend\":true,\"lastnums\":10,\"totalnums\":10,\"totalwin\":0,\"turnwin\":0,\"turnnums\":0,\"bet\":1,\"lines\":30,\"curm\":-1,\"fgnums\":10,\"exwilds\":150,\"curkey\":0}}";
        var gmimsg = JSON.parse(gmistr);

        var bdata = ret.wager.bets[this.SpinIndex].betdata;
        var edata = ret.wager.bets[this.SpinIndex].eventdata;

        //! 选择类型
        if (bdata.cmd == 'MODE_ICE')
            gmimsg.gmi.curkey = 0;
        else
            gmimsg.gmi.curkey = 1;

        //! 免费次数
        if (edata.reSpins)
            gmimsg.gmi.fgnums = edata.freeSpins;
        else
            gmimsg.gmi.fgnums = edata.freeSpins + 1;

        this.addFGNums = gmimsg.gmi.fgnums;

        //! 增加W
        if (edata.reelSet) {
            var bstr = "CascadeFreeSpinsReels";
            var eindex = edata.reelSet.indexOf("Wilds");
            var numstr = edata.reelSet.substring(bstr.length, eindex);
            gmimsg.gmi.exwilds = parseInt(numstr);
        }

        this.bFree = true;
        this.FgNums = gmimsg.gmi.fgnums;
        GameMgr.singleton.onGameModuleInfo(gmimsg);

        if (this.SelectFreeCallBack) {
            this.SelectFreeCallBack(true);
            this.SelectFreeCallBack = undefined;
        }
    },

    //! 制造GameModuleInfo
    _createGameModuleInfo: function () {
        var ret = this.SpinRet;
        var ri = this.SpinIndex;
        var retdata = ret.wager.bets[ri].eventdata;

        var gmimsg = undefined;

        var reels = ret.wager.bets[ri].eventdata.reels;
        var reels2 = ret.wager.bets[ri].eventdata.reels2;

        var wtw = ret.wager.bets[ri].eventdata.wtw;
        var wtw2 = ret.wager.bets[ri].eventdata.wtw2;

        var realwin = Math.round(ret.wager.bets[ri].eventdata.wonMoney * this.iRateValue);

        //! 暂时特殊处理wonMoney和wonCoins不一致的情况
        if (ret.wager.bets[ri].eventdata.wonMoney <= 0 && ret.wager.bets[ri].eventdata.wonCoins >= 0)
            realwin = Math.round(ret.wager.bets[ri].eventdata.wonCoins);

        this.TurnWin += realwin;

        var totalwin = Math.round(ret.wager.bets[ri].eventdata.accWa * this.iRateValue);

        //! 暂时特殊处理accWa和accC不一致的情况
        if (ret.wager.bets[ri].eventdata.accWa * this.iRateValue < ret.wager.bets[ri].eventdata.accC)
            totalwin = Math.round(ret.wager.bets[ri].eventdata.accC);

        var fgname = ret.wager.bets[ri].eventdata.freeSpinsName;
        var fgnums = ret.wager.bets[ri].eventdata.freeSpinsAwarded;
        var lastnums = ret.wager.bets[ri].eventdata.freeSpins;

        // if(fgnums != undefined){
        //     this.FgNums = fgnums;
        // }

        if (lastnums != undefined) {
            this.LastNums = lastnums;
        }

        cc.log('');
        if (reels && reels2) {
            var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"icefire2_bg\",\"gameid\":468,\"gmi\":{\"spinret\":{\"realsuperfgnums\":0},\"curm\":5}}";
            gmimsg = JSON.parse(gmistr);

            gmimsg.gmi.turnwin = this.TurnWin;

            gmimsg.gmi.spinret.realwin = realwin;
            gmimsg.gmi.spinret.totalwin = realwin;
            gmimsg.gmi.spinret.bet = Math.round(ret.wager.bets[ri].betdata.coin * this.iRateValue);
            gmimsg.gmi.spinret.times = 1;
            gmimsg.gmi.spinret.lines = ret.wager.bets[ri].betdata.ncoins;

            gmimsg.gmi.lstarr = this._chgReels(reels, reels2);
            gmimsg.gmi.spinret.lst = this._createlst(wtw, wtw2, gmimsg.gmi.lstarr, gmimsg.gmi.spinret.bet);

            //! 普通游戏
            if (retdata.reelSet == 'BaseReels') {
                gmimsg.gamemodulename = 'icefire2_bg';

                if (retdata.nextCmds && retdata.nextCmds == 'MODE_ICE,MODE_FIRE') {
                    //! 进入选择冰火环节
                    gmimsg.gmi.spinret.curfg = {};
                    gmimsg.gmi.spinret.curfg.fgnums = 1;
                    gmimsg.gmi.spinret.curfg.exwilds = 1;
                    gmimsg.gmi.spinret.curfg.weight = 1;

                    if (this.bAutoSelect) {
                        //! 如果是重入，需要让UI自动选择
                        var nextdata = ret.wager.bets[ri + 1].eventdata;
                        var stype = nextdata.freeSpinsType == 'MODE_ICE' ? 0 : 1;

                        if (GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.setSelectType)
                            GameMgr.singleton.curGameLayer.setSelectType(stype);
                    }
                } else if (retdata.scatterFreeSpinsWon) {
                    //! 进超级免费
                    gmimsg.gmi.spinret.realsuperfgnums = retdata.freeSpins;
                    this.FgNums = retdata.freeSpins;
                    this.addFGNums = retdata.freeSpins;

                    //! 找出所有的scatter图标
                    var sdata = {};

                    sdata.type = 'scatterex2';
                    sdata.bet = gmimsg.gmi.spinret.bet;
                    sdata.symbol = 11;
                    sdata.multiplies = 0;
                    sdata.win = 0;

                    sdata.positions = [];

                    for (var ii = 0; ii < gmimsg.gmi.lstarr.length; ++ii) {
                        for (var jj = 0; jj < gmimsg.gmi.lstarr[ii].length; ++jj) {
                            if (gmimsg.gmi.lstarr[ii][jj] == sdata.symbol) {
                                var node = {};

                                node.x = jj;
                                node.y = ii;

                                sdata.positions.push(node);
                            }
                        }
                    }

                    gmimsg.gmi.spinret.lst.push(sdata);

                    this.bSuperFree = true;
                }

                // if(wtw.length <= 0 && wtw2.length <= 0)
                //     gmimsg.gmi.isspinend = true;
                // else
                //     gmimsg.gmi.isspinend = false;
                if (retdata.reSpins)
                    gmimsg.gmi.isspinend = false;
                else
                    gmimsg.gmi.isspinend = true;

                gmimsg.gmi.turnnums = ri + 1;
                this.iBgTotalWin = totalwin;
            }
            // else if(retdata.scatterFreeSpinsWon) {
            //     //! 进超级免费
            //     gmimsg.gmi.spinret.realsuperfgnums = retdata.freeSpins;
            //     this.FgNums = retdata.freeSpins;
            //     this.addFGNums = retdata.freeSpins;
            //
            //     //! 找出所有的scatter图标
            //     var sdata = {};
            //
            //     sdata.type = 'scatterex2';
            //     sdata.bet = gmimsg.gmi.spinret.bet;
            //     sdata.symbol = 11;
            //     sdata.multiplies = 0;
            //     sdata.win = 0;
            //
            //     sdata.positions = [];
            //
            //     for(var ii = 0; ii < gmimsg.gmi.lstarr.length; ++ii) {
            //         for(var jj = 0; jj < gmimsg.gmi.lstarr[ii].length; ++jj) {
            //             if(gmimsg.gmi.lstarr[ii][jj] == sdata.symbol) {
            //                 var node = {};
            //
            //                 node.x = jj;
            //                 node.y = ii;
            //
            //                 sdata.positions.push(node);
            //             }
            //         }
            //     }
            //
            //     gmimsg.gmi.spinret.lst.push(sdata);
            //
            //     this.bSuperFree = true;
            // }
            else {
                totalwin -= this.iBgTotalWin;

                if (this.bSuperFree) {
                    //! 超级免费中
                    gmimsg.gamemodulename = 'icefire2_fg2';

                    gmimsg.gmi.turnnums = this.FgTurnNums + 1;

                    if (retdata.reSpins) {
                        gmimsg.gmi.isspinend = false;

                        if (retdata.freeSpins)
                            gmimsg.gmi.lastnums = retdata.freeSpins - 1;
                        else
                            gmimsg.gmi.lastnums = 0;

                        gmimsg.gmi.supermul = retdata.multiplier + 1;

                        this.FgTurnNums += 1;
                    } else {
                        gmimsg.gmi.isspinend = true;

                        if (retdata.freeSpins)
                            gmimsg.gmi.lastnums = retdata.freeSpins;
                        else
                            gmimsg.gmi.lastnums = 0;

                        gmimsg.gmi.supermul = retdata.multiplier;

                        this.FgTurnNums = 0;
                    }

                    if (retdata.scatterFreeSpinsWon) {
                        this.FgNums += this.addFGNums;
                        gmimsg.gmi.spinret.fgnums = this.addFGNums;
                    }

                    gmimsg.gmi.totalnums = this.FgNums;
                    gmimsg.gmi.totalwin = totalwin;

                    if (ri == ret.wager.bets.length - 1)
                        this.bSuperFree = false;
                } else if (this.bFree) {
                    //! 普通免费中
                    gmimsg.gamemodulename = 'icefire2_fg';

                    gmimsg.gmi.turnnums = this.FgTurnNums + 1;

                    if (retdata.reSpins) {
                        gmimsg.gmi.isspinend = false;

                        if (retdata.freeSpins)
                            gmimsg.gmi.lastnums = retdata.freeSpins - 1;
                        else
                            gmimsg.gmi.lastnums = 0;

                        this.FgTurnNums += 1;

                        // //! 测试代码
                        // gmimsg.gmi.spinret.realwin = 1;
                        // gmimsg.gmi.spinret.totalwin = 1;
                    } else {
                        gmimsg.gmi.isspinend = true;

                        if (retdata.freeSpins)
                            gmimsg.gmi.lastnums = retdata.freeSpins;
                        else
                            gmimsg.gmi.lastnums = 0;

                        this.FgTurnNums = 0;
                    }

                    // if(retdata.scatterFreeSpinsWon) {
                    //     this.FgNums += 10;
                    //     gmimsg.gmi.spinret.fgnums = 10;
                    // }

                    if (retdata.cascadeFreeSpinsWon) {
                        this.FgNums += this.addFGNums;
                        gmimsg.gmi.spinret.fgnums = this.addFGNums;
                    }

                    gmimsg.gmi.totalnums = this.FgNums;
                    gmimsg.gmi.totalwin = totalwin;

                    gmimsg.gmi.curkey = retdata.freeSpinsType == 'MODE_ICE' ? 0 : 1;

                    if (ri == ret.wager.bets.length - 1)
                        this.bFree = false;

                    //if(retdata.scatterFreeSpinsWon) {
                    if (gmimsg.gmi.isspinend && gmimsg.gmi.lastnums == 0 && !this.isSpinEnd()) {
                        //! 测试进超级免费……
                        var nextdata = ret.wager.bets[ri + 1].eventdata;

                        if (nextdata.reSpins) {
                            gmimsg.gmi.spinret.realsuperfgnums = nextdata.freeSpins;
                            this.FgNums = nextdata.freeSpins;
                            this.addFGNums = nextdata.freeSpins;
                        } else {
                            gmimsg.gmi.spinret.realsuperfgnums = nextdata.freeSpins + 1;
                            this.FgNums = nextdata.freeSpins + 1;
                            this.addFGNums = nextdata.freeSpins + 1;
                        }

                        // gmimsg.gmi.spinret.realsuperfgnums = 10;
                        // this.FgNums = 10;
                        // this.addFGNums = 10;

                        //! 找出所有的scatter图标
                        var sdata = {};

                        sdata.type = 'scatterex2';
                        sdata.bet = gmimsg.gmi.spinret.bet;
                        sdata.symbol = 11;
                        sdata.multiplies = 0;
                        sdata.win = 0;

                        sdata.positions = [];

                        for (var ii = 0; ii < gmimsg.gmi.lstarr.length; ++ii) {
                            for (var jj = 0; jj < gmimsg.gmi.lstarr[ii].length; ++jj) {
                                if (gmimsg.gmi.lstarr[ii][jj] == sdata.symbol) {
                                    var node = {};

                                    node.x = jj;
                                    node.y = ii;

                                    sdata.positions.push(node);
                                }
                            }
                        }

                        gmimsg.gmi.spinret.lst.push(sdata);

                        this.bSuperFree = true;
                        this.iBgTotalWin += totalwin;
                    }
                }
            }

            // //!免费游戏
            // if(fgname != undefined || this.FgName != undefined){
            //     cc.log('in free');
            //
            //     //var totalnums = 0;
            //     var supermul = 1;
            //     for(var ii = 0; ii < ret.wager.bets.length; ii++){
            //         var rs = ret.wager.bets[ii].eventdata.reSpins;
            //         var rest = ret.wager.bets[ii].eventdata.reelSet;
            //
            //         if(rs){
            //             if(fgname == 'scatterFreeSpins' || this.FgName == 'scatterFreeSpins'){
            //                 if(ii <= ri){
            //                     supermul++;
            //                 }
            //             }
            //         }
            //         //else{
            //         //    totalnums ++;
            //         //}
            //
            //         if(rest){
            //             var arr = rest.split("");
            //
            //             if(this.ExWilds == ''){
            //                 for(var jj = 0; jj < arr.length; jj++){
            //                     if(Number(arr[jj]) >= 0){
            //                         this.ExWilds += arr[jj];
            //                     }
            //                 }
            //             }
            //         }
            //     }
            //
            //     //!第一次触发免费或者再次触发免费
            //     if(fgname != undefined){
            //         this.TotalNums += fgnums;
            //         //!第一次触发免费
            //         if(this.FgName == undefined){
            //             this.FgName = fgname;
            //
            //             gmimsg.gamemodulename = 'icefire2_bg';
            //
            //             //if(ret.wager.bets.length == ri + 1)
            //             //    gmimsg.gmi.isspinend = true;
            //             //else
            //             //    gmimsg.gmi.isspinend = false;
            //
            //             if(fgname == 'scatterFreeSpins'){
            //                 gmimsg.gmi.spinret.realsuperfgnums = this.FgNums;
            //             }
            //             else{
            //                 gmimsg.gmi.spinret.realsuperfgnums = 0;
            //                 gmimsg.gmi.spinret.curfg = {};
            //                 gmimsg.gmi.spinret.curfg.fgnums = this.FgNums;
            //                 gmimsg.gmi.spinret.curfg.exwilds = parseInt(this.ExWilds);
            //                 gmimsg.gmi.fgnums = this.FgNums;
            //                 gmimsg.gmi.exwilds = parseInt(this.ExWilds);
            //             }
            //
            //             this.bFirstFree = true;
            //         }
            //         else{
            //             this.LastNums += this.FgNums;
            //
            //             if(fgname == 'scatterFreeSpins'){
            //                 gmimsg.gamemodulename = 'icefire2_fg2';
            //                 gmimsg.gmi.spinret.fgnums = this.FgNums;
            //                 gmimsg.gmi.supermul = supermul;
            //             }
            //             else{
            //                 gmimsg.gamemodulename = 'icefire2_fg';
            //                 gmimsg.gmi.fgnums = this.FgNums;
            //                 gmimsg.gmi.exwilds = parseInt(this.ExWilds);
            //             }
            //         }
            //     }
            //     //!免费游戏中
            //     else{
            //         if(this.FgName == 'cascadeFreeSpins'){
            //             gmimsg.gamemodulename = 'icefire2_fg';
            //             gmimsg.gmi.fgnums = this.FgNums;
            //             gmimsg.gmi.exwilds = parseInt(this.ExWilds);
            //             gmimsg.gmi.spinret.fgnums = 0;
            //         }
            //         else if(this.FgName == 'scatterFreeSpins'){
            //             gmimsg.gamemodulename = 'icefire2_fg2';
            //             gmimsg.gmi.realsuperfgnums = this.FgNums;
            //             gmimsg.gmi.supermul = supermul;
            //             gmimsg.gmi.spinret.fgnums = 0;
            //         }
            //     }
            //
            //     gmimsg.gmi.lastnums = this.LastNums;
            //     gmimsg.gmi.totalnums = this.TotalNums;
            //     gmimsg.gmi.totalwin = totalwin;
            //
            //     if(ret.wager.bets.length == ri + 1/*!(this.LastNums + 1)*/){
            //         this.FgName = undefined;
            //         this.TotalNums = 0;
            //         //gmimsg.gamemodulename = 'icefire2_bg';
            //     }
            //
            //     if(ret.wager.bets[ri].eventdata.reSpins){
            //         gmimsg.gmi.isspinend = false;
            //         this.FgTurnNums ++;
            //     }
            //     else{
            //         gmimsg.gmi.isspinend = true;
            //         this.LastNums--;
            //         this.FgTurnNums = 0;
            //     }
            //
            //     gmimsg.gmi.turnnums = this.FgTurnNums;
            // }
            // //!普通游戏
            // else{
            //     gmimsg.gamemodulename = 'icefire2_bg';
            //
            //     if(ret.wager.bets.length == ri + 1)
            //         gmimsg.gmi.isspinend = true;
            //     else
            //         gmimsg.gmi.isspinend = false;
            //
            //     gmimsg.gmi.turnnums = ri + 1;
            // }

            //GameMgr.singleton.onGameModuleInfo(gmimsg);
        }

        this.SpinIndex += 1;

        var str = JSON.stringify(gmimsg);
        cc.log('gmimsg ' + str);
        return gmimsg;
    },

    //! 根据已有消息创建一个保留消息
    _createLastGameModuleInfo: function (gmimsg) {
        var lmsg = this._deepClone(gmimsg);

        lmsg.gamemodulename = 'icefire2_bg';

        if (!lmsg.gmi.spinret)
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

        this.lastGameModuleInfo = lmsg;
    },

    _sendLastGameModuleInfo: function () {
        if (!this.lastGameModuleInfo)
            return;

        GameMgr.singleton.onGameModuleInfo(this.lastGameModuleInfo);

        if (this.SpinCallBack)
            this.SpinCallBack(true);

        this.bSendLast = true;
    },

    //! 模拟之前的登陆流程
    _login: function () {
        this.bLogin = true;

        // if(this.Config.settings.language == 'zh' || this.Config.settings.language == 'zh_hans') {
        //     LanguageData.instance.setlanguageType('_zh');
        //     LanguageData.instance.refreshShowedText();
        // }

        // //! userbaseinfo
        // GameMgr.singleton.userbaseinfo = {};
        // GameMgr.singleton.userbaseinfo.currency = this.Config.currency;

        if (this.Config.current_decimal != undefined)
            this.iRateNum = this.Config.current_decimal;

        this.iRateValue = Math.round(Math.pow(10, this.iRateNum));
        GameDataMgr.instance.setCoinValueRate(this.iRateValue);

        GameMgr.singleton.myInfo.gameid = GameMgr.singleton.getCurGameID();
        return;

        //! gamecfg
        if (this.Config.settings.organizationConfig && this.Config.settings.organizationConfig.Denoms) {
            var bindex = this.Config.settings.organizationConfig.Denoms.indexOf(':');

            var dstr = '[';
            dstr += this.Config.settings.organizationConfig.Denoms.slice(bindex + 1);
            dstr += ']';

            var denoms = JSON.parse(dstr);

            //! 计算小数位数
            for (var ii = 0; ii < denoms.length; ++ii) {
                var num = denoms[ii];
                var x = String(num).indexOf('.') + 1;
                var y = String(num).length - x;

                if (y > this.iRateNum) {
                    this.iRateNum = y;
                    this.iRateValue = Math.round(Math.pow(10, this.iRateNum));
                }
            }

            GameDataMgr.instance.setCoinValueRate(this.iRateValue);

            var linebets = [];

            for (var ii = 0; ii < denoms.length; ++ii) {
                linebets.push(Math.round(denoms[ii] * this.iRateValue));
            }

            //! 记录最大下注值
            if (denoms.length > 0)
                this.iMaxBet = denoms[denoms.length - 1] * 30;

            var bnum = undefined;

            if (this.bReplay) {
                //! 如果是录像则尝试恢复下注
                if (this.Config.wagers.data[0].bets.length > 0) {
                    bnum = Math.round(this.Config.wagers.data[0].bets[0].betamount * this.iRateValue / 30);
                }

                //GameMgr.singleton.onBetList(linebets, bnum);
            } else if (!this.GameReadyRet || this.GameReadyRet.restoreMode == 'NONE') {
                //! 游戏的话恢复默认值
                if (this.Config.settings.organizationConfig.DefaultDenom) {
                    var bindex = this.Config.settings.organizationConfig.DefaultDenom.indexOf(':');
                    var dstr = this.Config.settings.organizationConfig.DefaultDenom.slice(bindex + 1);

                    bnum = Math.round(Number(dstr) * this.iRateValue);
                } else {
                    bnum = linebets[0];
                }
                //GameMgr.singleton.onBetList(linebets);
            } else {
                //! 恢复RESTORE下注
                if (this.Config.wagers.data[0].bets.length > 0) {
                    bnum = Math.round(this.Config.wagers.data[0].bets[0].betamount * this.iRateValue / 30);
                }
            }

            GameMgr.singleton.onBetList(linebets, bnum);
        }

        var mymoney = 0;

        if (this.Config.settings.balance != undefined) {
            mymoney = this.Config.settings.balance * this.iRateValue;
        } else {
            if (this.Config.wagers && this.Config.wagers.data[0].bets.length > 0) {
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

        if (!this.GameReadyRet || this.GameReadyRet.restoreMode != 'SKIP') {
            GameMgr.singleton.onMyMoney(Math.round(mymoney));
        }

        GameMgr.singleton.myInfo.gameid = GameMgr.singleton.getCurGameID();

        //! comeingame
        //! gamemoduleinfo
        var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"icefire2_bg\",\"gameid\":468,\"gmi\":{\"isspinend\":true,\"lstindex0\":[68,145,254,61,108],\"lstindex1\":[125,158,258,281,227],\"lstarr\":[[9,7,6,9,3],[9,3,6,9,7],[9,3,7,3,7],[9,3,7,3,7],[9,3,7,3,7],[9,4,7,5,2],[4,4,7,5,2],[4,8,7,8,10],[4,8,7,8,4],[4,8,7,8,4]],\"turnwin\":0,\"turnnums\":0,\"curm\":7}}";
        var gmimsg = JSON.parse(gmistr);

        //! 根据不同情况恢复不同的消息
        if (this.GameReadyRet && this.GameReadyRet.restoreMode == 'RESTORE') {
            // //this.SpinRet = this.Config;
            // this.SpinIndex = 0;
            //
            // this.SpinRet = {};
            // this.SpinRet.wager = {};
            // this.SpinRet.wager.bets = this.Config.wagers.data[0].bets;

            this._restoreBets();

            // gameEmitter.gameRoundStarted();
            // gameEmitter.spinStarted();

            gmimsg = this._createGameModuleInfo();

            //gameEmitter.spinEnded();
        } else if (this.GameReadyRet && this.GameReadyRet.restoreMode == 'SKIP') {
            //this.SpinRet = this.Config;

            // this.SpinRet = {};
            // this.SpinRet.wager = {};
            // this.SpinRet.wager.bets = this.Config.wagers.data[0].bets;
            // //this.SpinIndex = this.SpinRet.wager.bets.length - 1;
            //
            // this.SpinIndex = 0;
            //
            // while(this.SpinIndex < this.SpinRet.wager.bets.length - 1) {
            //     this._createGameModuleInfo();
            // }

            this._skipBets();

            if (!this.isPrepaid())
                GameMgr.singleton.onMyMoney(Math.round(mymoney + this.iBgTotalWin));
            else
                GameMgr.singleton.onMyMoney(Math.round(mymoney));

            this.bCollect = true;
            slot.collect({step: this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1})
                .then((ret) => {
                    YggLogic.singleton.onCollect(ret);
                })
                .catch((err) => {
                    console.log('collect Error ', err);
                });

            //gmimsg = this._createGameModuleInfo();

            if (GameMgr.singleton.curGameLayer == undefined)
                cc.director.runScene(new GameScene());

            return;
        } else {
            var cfg = this.Config;

            if (cfg && cfg.settings && cfg.settings.slotConfig && cfg.settings.slotConfig.InitialLeftReels && cfg.settings.slotConfig.InitialRightReels) {
                var reels = cfg.settings.slotConfig.InitialLeftReels;
                var reels2 = cfg.settings.slotConfig.InitialRightReels;

                gmimsg.gmi.lstarr = this._chgReels(reels, reels2);
            }
        }

        gmimsg.mode = this.Config.mode;
        GameMgr.singleton.onGameModuleInfo(gmimsg);

        //! 如果是游戏则保留备份
        if (!this.bReplay && (!this.GameReadyRet || this.GameReadyRet.restoreMode == 'NONE')) {
            this._createLastGameModuleInfo(gmimsg);
        }

        //! 重播恢复旋转后的数据
        if (this.bReplay) {
            //this._createReplayData();
            this._restoreBets();
        }

        if (GameMgr.singleton.curGameLayer == undefined)
            cc.director.runScene(new GameScene());
    },

    //! 恢复之前的消息显示
    _restoreBets: function () {
        this.SpinIndex = 0;

        this.SpinRet = {};
        this.SpinRet.wager = {};
        this.SpinRet.wager.bets = this.Config.wagers.data[0].bets;

        //! 恢复下注数据
        if (this.SpinRet.wager.bets.length > 0) {
            if (this.SpinRet.wager.bets[0].betamount)
                this.iAmount = this.SpinRet.wager.bets[0].betamount;

            if (this.SpinRet.wager.bets[0].betdata && this.SpinRet.wager.bets[0].betdata.coin)
                this.iCoin = this.SpinRet.wager.bets[0].betdata.coin;
        }

        var freetype = this._getFreeType(this.SpinRet.wager.bets);

        if (freetype != 1)
            return;

        //! 普通免费情况比较特殊，可能会需要特殊处理
        var bets = this.SpinRet.wager.bets;

        for (var ii = 0; ii < bets.length; ++ii) {
            var retdata = bets[ii].eventdata;

            if (retdata.nextCmds && retdata.nextCmds == 'MODE_ICE,MODE_FIRE') {
                //! 还没有选择的情况下重入
                if (ii >= bets.length - 1)
                    return;

                //! 需要选择并将UI选择的过程自动化
                //var nextdata = bets[ii + 1].eventdata;
                this.bAutoSelect = true;
                return;
            }
        }
    },

    //! 跳过部分消息显示结果
    _skipBets: function () {
        this.SpinRet = {};
        this.SpinRet.wager = {};
        this.SpinRet.wager.bets = this.Config.wagers.data[0].bets;
        //this.SpinIndex = this.SpinRet.wager.bets.length - 1;

        var freetype = this._getFreeType(this.SpinRet.wager.bets);

        if (freetype == 1)
            this.bFree = true;

        this.SpinIndex = 0;

        //! 跳到最后一个消息等待collect
        while (this.SpinIndex < this.SpinRet.wager.bets.length - 1) {
            this._createGameModuleInfo();
        }
    },

    //! 根据一组消息判断免费类型 0非免费 1普通免费 2超级免费
    _getFreeType: function (bets) {
        for (var ii = 0; ii < bets.length; ++ii) {
            var retdata = bets[ii].eventdata;

            if (retdata.nextCmds && retdata.nextCmds == 'MODE_ICE,MODE_FIRE')
                return 1;

            if (retdata.scatterFreeSpinsWon)
                return 2;
        }

        return 0;
    },

    //! 转换轮子上的数据
    _chgReels: function (reels, reels2) {
        var lstarr = [];

        for (var ii = 0; ii < 5; ++ii) {
            var lst = [];

            for (var jj = 0; jj < 5; ++jj) {
                var icon = this.iconvalue[reels[jj][ii]];
                lst.push(icon);
            }

            lstarr.push(lst);
        }

        for (var ii = 0; ii < 5; ++ii) {
            var lst = [];

            for (var jj = 0; jj < 5; ++jj) {
                var icon = this.iconvalue[reels2[jj][ii]];
                lst.push(icon);
            }

            lstarr.push(lst);
        }

        return lstarr;
    },

    //! 创建获奖数据
    _createlst: function (wtw, wtw2, lstarr, bet) {
        var lst = [];

        if (wtw) {
            for (var ii = 0; ii < wtw.length; ++ii) {
                var data = this._createlstdata(wtw[ii], 0, lstarr, bet);

                if (data)
                    lst.push(data);
            }
        }

        if (wtw2) {
            for (var ii = 0; ii < wtw2.length; ++ii) {
                var data = this._createlstdata(wtw2[ii], 5, lstarr, bet);

                if (data)
                    lst.push(data);
            }
        }

        return lst;
    },

    //! 填充lst里面的一个的数据
    _createlstdata: function (wtwdata, spy, lstarr, bet) {
        var line = wtwdata[0] - 1;

        if (line < 0 || line >= this.Paylines.length)
            return undefined;

        var data = {};

        data.type = 'line';
        data.bet = bet;

        data.data = {};
        data.data.line = line;
        data.data.paytype = 'lr';

        data.positions = [];

        var snum = 0;
        var symbol = 0;
        var px = 0;
        var py = 0;

        for (var ii = 0; ii < wtwdata[2].length; ++ii) {
            var inum = parseInt(wtwdata[2].slice(ii, ii + 1));

            if (inum > 0) {
                snum += 1;
                px = Math.floor(ii / 5);
                py = ii % 5 + spy;

                if (symbol <= 0) {
                    symbol = lstarr[py][px];
                }

                var pos = {x: px, y: py};
                data.positions.push(pos)
            }
        }

        if (symbol <= 0)
            symbol = 1;

        if (snum > 5)
            snum = 5;

        data.symbol = symbol;
        data.multiplies = this.Paytable[symbol][snum - 1];
        data.win = data.multiplies * bet;

        return data;
    },

    //! 显示提示信息框，如果可以显示则返回true
    showDlg: function (root, gamelayer, type, type1, strerror, bshowcash) {
        var str = undefined;

        this.iType = type;
        this.iTyp1 = type1;

        if (this.iType == 2) {
            if (this.iTyp1 == -1) {
                //LanguageData.instance.setMapValue('TotalMax', strerror);
                //str = LanguageData.instance.getTextStr("uiScreen_TotalMax");
                // var test = slot.uiComponents();
                // var test1 = test.clickActionHandler();
                // var test2 = test1.maximumBetWarning(1);

                if (!uiComponents)
                    uiComponents = slot.uiComponents();

                uiComponents.clickActionHandler().maximumBetWarning(this.iMaxBet);
                return true;
            }
        } else if (this.iType == 5) {
            LanguageData.instance.setMapValue('Limit', strerror);

            if (this.iTyp1 == 1) {
                if (bshowcash) {
                    str = LanguageData.instance.getTextStr("uiScreen_WinLimit2");
                } else {
                    str = LanguageData.instance.getTextStr("uiScreen_WinLimit1");
                }
            } else if (this.iTyp1 == 2) {
                if (bshowcash) {
                    str = LanguageData.instance.getTextStr("uiScreen_LossLimit2");
                } else {
                    str = LanguageData.instance.getTextStr("uiScreen_LossLimit1");
                }
            }
        }

        if (!uiComponents)
            uiComponents = slot.uiComponents();

        if (uiComponents && str) {
            //var data = {title:'title',message:'test',theme:'DARK',primaryButtonText:'OK'};
            var data = {theme: 'DARK'};

            data.message = str;
            data.primaryButtonText = LanguageData.instance.getTextStr("uiScreen_ButtonOk");
            data.primaryButtonAction = this.onButton;

            uiComponents.showPopup(data);

            if (GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
                GameMgr.singleton.curGameLayer.ModuleUI._setState('disconnect', 'show');

            return true;
        }

        return false;
    },

    onButton: function () {
        if (GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
            GameMgr.singleton.curGameLayer.ModuleUI._setState('disconnect', 'hide');
    },

    stopAutoSpin: function () {
        if (GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI) {
            GameDataMgr.instance.setIAutoNum(0);
            GameMgr.singleton.curGameLayer.ModuleUI._setState('auto', 0);
        }
    },

    updateBalance: function (val) {
    },

    //向ygg发送totalBetChanged数据
    sendTotalBetChanged: function (value) {
        this.iTotalBet = value;
        return;

        if (this.GameReadyRet != undefined) {
            if (gameEmitter && gameEmitter.totalBetChanged) {
                if (this.iSendBet == undefined || this.iSendBet != this.iTotalBet) {
                    this.iSendBet = this.iTotalBet;
                    gameEmitter.totalBetChanged(this.iTotalBet / this.iRateValue);
                }
            }
        }
    },

    onRoundEnded: function (ret) {
        var pamount = 0;

        if (ret.nextPrepaid && ret.nextPrepaid.amount)
            pamount = ret.nextPrepaid.amount;

        //this.setPrepaid(pamount);

        if (this.bChgBalance) {
            GameMgr.singleton.onMyMoney(this.iNewBalance);
            this.bChgBalance = false;
            this.bWaitRoundEnded = false;
        }
    },

    //! 是否需要等待回合结束
    isWaitRoundEnded: function () {
        if (this.bWaitRoundEnded == undefined)
            return false;

        return this.bWaitRoundEnded;
    },

    setIsWaitCommonFreeGame: function (bWait) {
        this.bWaitCommonFreeGame = bWait;
    },

    getDefaultCoinValue: function () {
        return this.iDefaultCoinVal;
    },

    //！请求GameReadyRet数据
    getGameReadyRet: function () {
        // //! 暂时直接返回
        if (!this.bWaitCommonFreeGame)
            this.onGameReadyRet();
    },

    // ygg有通知栏时，设置游戏的宽高
    setSlotGameSize: function (msg) {
        //! 先处理boost/top-bar
        var top = 0;

        for (var ii = 0; ii < msg.length; ++ii) {
            for (var jj = 0; jj < msg[ii].length; ++jj) {
                var node = msg[ii][jj];

                if (!node.id || node.id != 'boost/top-bar')
                    continue;

                if (!node.bounds || !node.bounds.height)
                    continue;

                if (node.bounds.height > top)
                    top = node.bounds.height;
            }
        }

        if (GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.GameCanvasMgr)
            GameMgr.singleton.curGameLayer.GameCanvasMgr.setAdaptiveAdjustValue('boost/top-bar', top, 0, 0, 0);

        cc.view.setYggFrameSize(msg);
    },

    //! 创建录像数据
    _createReplayData: function () {
        if (this.Config.mode != 'REPLAY')
            return undefined;

        var rdata = this.Config.wagers.data[0];

        if (rdata.bets.length <= 0)
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

        for (var ii = 0; ii < rlen; ++ii) {
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

            if (!node.freespinsleft)
                node.freespinsleft = 0;

            data.lst.push(node);
        }

        return data;
    },

    //! 转换轮子上的数据
    _chgReels_replay: function (reels, reels2) {
        var lstarr = [];

        for (var ii = 0; ii < 5; ++ii) {
            var lst = [];

            for (var jj = 0; jj < 5; ++jj) {
                var icon = this.iconvalue[reels[jj][ii]];
                lst.push(icon);
            }

            lstarr.push(lst);
        }

        for (var ii = 0; ii < 5; ++ii) {
            var lst = lstarr[ii];

            for (var jj = 0; jj < 5; ++jj) {
                var icon = this.iconvalue[reels2[jj][ii]];
                lst.push(icon);
            }
        }

        //! 复制wild
        for (var ii = 0; ii < 5; ++ii) {
            for (var jj = 0; jj < 10; ++jj) {
                var icon = lstarr[ii][jj];

                if (icon == 0) {
                    if (jj < 5)
                        lstarr[ii][jj + 5] = 0;
                    else
                        lstarr[ii][jj - 5] = 0;
                }
            }
        }

        //! 将右侧图标变大
        for (var ii = 0; ii < 5; ++ii) {
            for (var jj = 5; jj < 10; ++jj) {
                lstarr[ii][jj] += 12;
            }
        }

        return lstarr;
    },

    //! 创建获奖数据
    _createlst_replay: function (wtw, wtw2) {
        var lst = [];

        if (wtw) {
            for (var ii = 0; ii < wtw.length; ++ii) {
                var data = this._createlstdata_replay(wtw[ii], 0);

                if (data)
                    lst.push(data);
            }
        }

        if (wtw2) {
            for (var ii = 0; ii < wtw2.length; ++ii) {
                var data = this._createlstdata_replay(wtw2[ii], 5);

                if (data)
                    lst.push(data);
            }
        }

        return lst;
    },

    //! 填充lst里面的一个的数据
    _createlstdata_replay: function (wtwdata, spx) {
        var line = wtwdata[0] - 1;

        if (line < 0 || line >= this.Paylines.length)
            return undefined;

        var data = [];

        for (var ii = 0; ii < 5; ++ii) {
            var lst = [];

            for (var jj = 0; jj < 10; ++jj)
                lst.push(0);

            data.push(lst);
        }

        for (var ii = 0; ii < wtwdata[2].length; ++ii) {
            var inum = parseInt(wtwdata[2].slice(ii, ii + 1));

            if (inum > 0) {
                px = Math.floor(ii / 5) + spx;
                py = ii % 5;

                if (spx == 0)
                    data[py][px] = 1;
                else
                    data[py][px] = 2;
            }
        }

        return data;
    },

    //! 设置预付费
    setPrepaid: function (amount) {
        if (amount <= 0) {
            this.bPrepaid = false;

            if (GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
                GameMgr.singleton.curGameLayer.ModuleUI._setState('prepaid', 'close');

            GameDataMgr.instance.removeValueInCoinList();
        } else {
            this.bPrepaid = true;

            if (GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI) {
                var bnum = Math.round(amount / 20);

                // GameMgr.singleton.curGameLayer.ModuleUI.setCoinValue(bnum);
                GameMgr.singleton.curGameLayer.ModuleUI._setState('prepaid', 'open');
            }
        }
    },

    setFreeSpinCoinValue: function (bet) {
        GameDataMgr.instance.insertValueInCoinList(bet);
    },

    //! 是否是预付费游戏
    isPrepaid: function () {
        return this.bPrepaid;
    },

    update: function (dt) {
        if (this.bRgPauseGame) {
            if (this._canPauseGame()) {
                this.pauseGame();
            }
        }

        if (this.iRealityTime >= 0) {
            this.iRealityTime += dt;

            if (this.bReality && this.iRealityTime >= this.Config.realitycheck) {
                if (this.bRealityDlg == undefined) {
                    //! 显示提示框
                    if (this._canShowReality())
                        this._showRealityDlg();
                } else {
                    this._refreshReality();
                }
            }
        }
    },

    //! 判断是否可以显示时间提示
    _canShowReality: function () {
        //! 已经暂停不用
        if (this.bPauseGame)
            return false;

        //! 是否在游戏过程中
        return !this.bRunning;
    },

    //! 判断是否可以暂停游戏
    _canPauseGame: function () {
        //! 暂时只考虑是否在游戏过程中
        return !this.bRunning;
    },

    //! 暂停游戏
    pauseGame: function () {
        this.bRgPauseGame = false;
        this.bPauseGame = true;

        if (GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
            GameMgr.singleton.curGameLayer.ModuleUI._setState('gameready', 'wait');

        // Report game paused.
        RgPostMessageAPI.reportPaused();

        if (this.eventRgPauseGame && this.eventRgPauseGame.data && this.eventRgPauseGame.data.realityCheck && !this.eventRgPauseGame.data.sessionTime) {
            var delement = document.getElementById('rg_rc_iframe');

            if (delement && delement.contentWindow) {
                var rtime = Math.round(this.iRealityTime / 60);
                delement.contentWindow.postMessage({
                    rgMessage: 'gprg_RealityCheckData',
                    payload: {realityCheck: true, sessionTime: rtime * 60}
                }, '*');
            }
        }
        //RgPostMessageAPI.reportPaused(this.eventRgPauseGame);
    },

    //! 刷新提示时间
    _refreshReality: function () {
        if (this.bRealityDlg) {
            //this.bRealityDlg.setTime(Math.floor(this.iRealityTime));
            this.bRealityDlg.setTime(Math.floor(this.iRealityTime / 60));
        }
    },

    //! 显示时间提示
    _showRealityDlg: function () {
        if (this.iRealityMoney > 0) {
            var info = Math.abs(this.iRealityMoney - this.iCurMoney) / this.iRateValue;
            if (typeof (LanguageData) != 'undefined' && LanguageData.instance && LanguageData.instance.formatMoney) {
                info = LanguageData.instance.formatMoney(info);
            }

            this.bRealityDlg = new NoticeTimeDialog(Math.floor(this.iRealityTime / 60), info,
                this.iCurMoney > this.iRealityMoney ? 1 : 0, this.Config.realitycheck_history);
        } else
            this.bRealityDlg = new NoticeTimeDialog(Math.floor(this.iRealityTime / 60), 0, 1, this.Config.realitycheck_history);

        // 修改父节点为CurGameLayer，localzOrder暂定999，xujk 2020.4.14
        GameMgr.singleton.curGameLayer.addChild(this.bRealityDlg, 998);

        //this.stopAutoSpin();
        this.bPauseGame = true;
    },

    //! 收到时间提示关闭
    onCloseReality: function (bcontinue) {
        this.bRealityDlg = undefined;
        this.iRealityTime = 0;
        this.iRealityMoney = this.iCurMoney;

        if (!bcontinue) {
            var hashome = this.goHome();
            if (!hashome) {
                close_game();
            }
            return;
        }

        this.bPauseGame = false;
    },


    //! 是否显示Home键
    isShowHome: function () {
        return true;
    },

    //! 点击Home键
    onClickHome: function () {
        if (!uiComponents)
            uiComponents = slot.uiComponents();

        uiComponents.clickActionHandler().home();
    },

    _deepClone: function (source) {
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

                    if (stype != 'string' && stype != 'number' && stype != 'boolean')
                        continue;

                    targetObj[key] = source[key];
                }
            }
        }

        return targetObj;
    },

    //! 收到金额变化
    onMyMoney: function (money) {
        this.iCurMoney = money;

        if (this.iRealityMoney < 0)
            this.iRealityMoney = money;
    },

    //! 打开游戏记录
    openHistory: function () {
        if (g_isguest != undefined && g_isguest) {
            //this.openRealModeDlg();
            return;
        }

        if (typeof rchistoryurl != 'undefined') {
            if (rchistoryurl())
                return;
        }

        // open_history(g_bkurl);
        var gameLayer = GameMgr.singleton.curGameLayer;

        var layer = new SettingLayer();
        layer.setExNodeVisible(false);
        var h = cc.view.getFrameSize().height - (layer.Panel_buttom.getContentSize().height / layer.Panel_ui.getContentSize().height * cc.view.getFrameSize().height);
        //GameMgr.singleton.curGameLayer.onTouchGameRules(undefined, ccui.Widget.TOUCH_ENDED, h);
        gameLayer.openHistory(h);

        gameLayer.addChild(layer, 10001);
        LanguageData.instance.showTextStr("common_label_history", layer.textTitle, false, "textTitle");
    },

    startGameRound: function () {
        this.bRunning = true;
        if (typeof RgPostMessageAPI != 'undefined')
            RgPostMessageAPI.gameRoundStarted();
    },

    endGameRound: function () {
        this.bRunning = false;

        if (typeof RgPostMessageAPI != 'undefined')
            RgPostMessageAPI.gameRoundEnded();

        CommonServer.singleton.checkShowFreeGame();
        if (this.isPrepaid()) {
            this.stopAutoSpin();
        }
    },

    //! 是否有弹窗（如果有则游戏内不能操作）
    isShowDlg: function () {
        //! 是否显示了时间提示窗
        if (this.bRealityDlg)
            return true;

        return false;
    },

    // BaseLogic是否响应了空格键，如果响应了则屏蔽其他空格键操作
    onPressedSpace: function () {
        var ret = false;
        if (this.isShowDlg())
            ret = true;

        // 游戏还没准备好
        if (!this.isGameReady())
            ret = true;

        if (GameMgr.singleton.CommonFreeGame && GameMgr.singleton.CommonFreeGame.isCanPressed())
            ret = true;

        if (!ret) {
            var gameLayer = GameMgr.singleton.curGameLayer;
            if (gameLayer) {
                var gameMenuLayer = gameLayer.gamemenuLayer;
                if (gameMenuLayer && gameMenuLayer.isDisplaying()) {
                    gameMenuLayer.onBtnClose();
                    ret = true;
                }

                if (!ret) {
                    if (gameMenuLayer.isDisplaySetting()) {
                        ret = true;
                    }
                }

                if (!ret && gameLayer.ModuleUI) {
                    var moduleUI = gameLayer.ModuleUI;
                    if (moduleUI.multiplierLayer) {
                        moduleUI.remvoeMultiplierLayer();
                        ret = true;
                    }

                    if (!ret && moduleUI.autoLayer) {
                        moduleUI._onTouchAutoSelect();
                        ret = true;
                    }
                }
            }
        }

        return ret;
    },
    updateAndNext: function (dt) {
        if (this.isPauseGame() || !this.isGameReady()) {
            return false;
        }
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
    isRoundRuning: function () {
        return this.bRunning;
    },
    getAutoSpinData: function () {
        return this.lstSpinTimes;
    },
    getAutoLossData: function () {
        return this.lstLostLimit;
    },
    getAutoWinData: function () {
        return this.lstSingleWin;
    },
    nativeDisconnect: function () {
        return true;
    },
    needSaveBetNum: function () {
        return true;
    },
    getRealBalance: function () {
        return this.iCurMoney;
    },
    getMinimalSpinningTime: function () {
        return this.minimalSpinningTime;
    },

});

//YggPltLogic，验证
var CHEAT_DATA;
var YggPltLogic = BasePltLogic.extend({
    iconvalue: {
        WILD: 0,
        HIGH_1: 1,
        HIGH_2: 2,
        HIGH_3: 3,
        HIGH_4: 4,
        HIGH_5: 5,
        LOW_1: 6,
        LOW_2: 7,
        LOW_3: 8,
        LOW_4: 9,
        LOW_5: 10,
        SCATTER: 11,
    },

    cheatmode: false,
    //cheatdata : '3790,3046,209,28,220,119,75 REELS 148,25,259,182,270',
    cheatdata: '2074,1418,89,22,225,196,157 REELS 231,257,146,319,88',
    //3790,3046,209,28,220,119,75 REELS 148,25,259,182,270
    //2074,1418,89,22,225,196,157 REELS 231,257,146,319,88
    //1399,8200,261,153,217,170,184,32,29,10,319,20


    ctor: function () {
        BasePltLogic.prototype.ctor.call(this);
        this.Config = undefined;
        this.GameReadyRet = undefined;
        this.bInit = false;
        this.bGameReady = false;
        this.bLogin = false;
        this.bAutoSelect = false;

        //! 部分逻辑数据
        this.Paylines = [];
        this.Paytable = [];

        // this.SpinCallBack = undefined;
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
        this.iBgTotalWin = 0;             //! 在普通游戏中的赢得
        this.bCollect = false;

        this.iNewBalance = 0;
        this.bChgBalance = false;
        this.bSpin = false;
        this.yggnoticemsg = null;

        this.bPrepaid = false;              //! 当前是否是预付费
        this.iMaxBet = 0;

        this.minimalSpinningTime = 0;       //! Spin最小等待时间

        this.lastGameModuleInfo = undefined;           //! 保留的消息（数据经过调整）
        this.iRealBalance = 0;                                      //! 用户持有真实金额（不考虑下注）
        this.bSendLast = false;                                    //! 是否正在发送保留消息

        this.bShowGambling = false;

        this.iRealityTime = -1;
        this.bRealityDlg = undefined;
        this.iRealityMoney = -1;
        this.iCurMoney = -1;
        this.bRunning = false;

        this.bShowOnlineTime = false;
        this.iOnlineTimestamp = 0;

        this.lstSpinTimes = ["OFF", "25", "50", "100", "200", "500"];
        this.lstLostLimit = ["No Limit", "×10", "×20", "×50", "×100"];
        this.lstSingleWin = ["No Limit", "×10", "×20", "×50", "×100"];

        this.bPauseGame = false;

        this.explorer = window.navigator.userAgent.toLowerCase();
        this.onMymoney = -1;
    },

    onConfig: function (cfg) {
        this.Config = cfg;
        this.explorer = window.navigator.userAgent.toLowerCase();
        //! 是否显示gambling
        if (this.Config && this.Config.customParameters && this.Config.customParameters.license) {
            var license = this.Config.customParameters.license.toLowerCase();

            if (license == 'uk')
                this.bShowGambling = true;
        }

        //! Spin最小等待时间
        if (this.Config && this.Config.settings && this.Config.settings.minimalSpinningTime) {
            this.minimalSpinningTime = this.Config.settings.minimalSpinningTime;       //! Spin最小等待时间
        }
        if (this.Config&& this.Config.settings && this.Config.settings.scquickstopon != undefined) {
            this.scQuickStopOn = this.Config.settings.scquickstopon;
        }

        //! 货币单位
        if (this.Config && this.Config.settings && this.Config.settings.currency) {
            LanguageData.instance.changeCurrency(this.Config.settings.currency);
        }

        //! 放入语言
        if (this.Config && this.Config.translations && this.Config.translations.game) {
            LanguageData.instance.loadLanguageJson(this.Config.translations.game);
            LanguageData.instance.refreshShowedText();
        }

        //! 赔付线
        if (cfg.settings && cfg.settings.slotConfig && cfg.settings.slotConfig.Paylines)
            this.Paylines = cfg.settings.slotConfig.Paylines;

        //! 是否需要等待用户恢复
        if (cfg.mode) {
            if (cfg.mode == 'RESTORE')
                this.bWaitRestore = true;
            else if (cfg.mode == 'REPLAY')
                this.bReplay = true;
        }

        //! 赔付倍数
        this.Paytable = [];

        for (var ii = 0; ii < 12; ++ii) {
            var pt = [];

            for (var jj = 0; jj < 5; ++jj)
                pt.push(0);

            this.Paytable.push(pt);
        }

        if (cfg.settings && cfg.settings.slotConfig && cfg.settings.slotConfig.Prizes) {
            for (var ii = 0; ii < cfg.settings.slotConfig.Prizes.length; ++ii) {
                var prize = cfg.settings.slotConfig.Prizes[ii];

                var icon = this.iconvalue[prize[0]];
                var ib = 4 - (prize.length - 1);

                if (icon != undefined) {
                    for (var jj = 1; jj < prize.length; ++jj) {
                        this.Paytable[icon][ib + jj] = parseInt(prize[jj]);
                    }
                }
            }
        }

        //是否使用ygg的自动规则
        if (this.Config && this.Config.settings && this.Config.settings.hasLossLimit) {
            this.hasLossLimit = this.Config.settings.hasLossLimit;
        }
        //是否使用ygg历史记录
        if (this.Config && this.Config.settings && this.Config.settings.isGameHistoryEnabled) {
            this.isGameHistoryEnabled = this.Config.settings.isGameHistoryEnabled;
        }

        //! 是否显示时间
        if (this.Config && this.Config.settings && this.Config.settings.shouldShowClock != undefined) {
            this.shouldShowClock = this.Config.settings.shouldShowClock;
        }

        //! 是否可以自动
        if (this.Config && this.Config.settings && this.Config.settings.isAutoSpinsDisabled != undefined) {
            this.isAutoSpinsDisabled = this.Config.settings.isAutoSpinsDisabled;
            //this.isAutoSpinsDisabled = true;
        }
    },

    //! 判断是否显示gambling
    isShowGambling: function () {
        return this.bShowGambling;
    },


    //! 是否可以自动转
    canAutoSpin: function () {
        if (this.isAutoSpinsDisabled == undefined)
            return true;

        return !this.isAutoSpinsDisabled;
    },

    //获取是否使用ygg的自动规则
    getHasLossLimit: function () {
        return this.hasLossLimit;
    },

    //获取是否使用ygg的历史记录
    getIsGameHistoryEnabled: function () {
        return this.isGameHistoryEnabled;
    },

    onGameReadyRet: function (ret) {
        if (ret) {
            this.GameReadyRet = ret;
        }

        this.bGameReady = true;

        var pamount = 0;

        if (ret.nextPrepaid && ret.nextPrepaid.amount)
            pamount = ret.nextPrepaid.amount;

        this.setPrepaid(pamount);

        //! 恢复之前的局面视为prepaid
        if (this.GameReadyRet && this.GameReadyRet.restoreMode == 'RESTORE' || this.GameReadyRet.restoreMode == 'SKIP')
            this.bPrepaid = true;

        if (!this.bLogin && this.bInit)
            this._login();

        if (this.iTotalBet) {
            this.sendTotalBetChanged(this.iTotalBet);
        }
    },

    init: function () {
        this.bInit = true;

        // 文档上说是快要结束时就可以调用了
        gameEmitter.gameLoadingEnded();

        if (GameMgr.singleton.curGameLayer == undefined)
            cc.director.runScene(new GameScene());
        if (!this.bWaitRestore)
            this._login();
    },

    //! 模拟发送下注消息
    newspin: function (gameid, bet, times, lines, bfree) {
        // slot.play({test:true, cheat:[136,118,246,204,49,66,120,321]})
        //     .then((ret) => {
        //         var cret = ret;
        // });
        // return ;

        //var fsreen = this.isFullScreen();

        //change
        // this.SpinCallBack = callback;

        if (this.bReplay) {
            var gmimsg = this._createGameModuleInfo();

            if (gmimsg) {
                GameMgr.singleton.onGameModuleInfo(gmimsg);
                GameEmitterMgr.instance.emit("msg_spineResult", true);

                //change
                // if(this.SpinCallBack)
                //     this.SpinCallBack(true);
                //
                // this.SpinCallBack = undefined;
            }
        } else if (bet >= 0 && times >= 0 && lines >= 0) {
            //! 真实下注
            var spindata = {};

            this.iCoin = bet / this.iRateValue;

            spindata.coin = bet / this.iRateValue;
            spindata.amount = spindata.coin * lines;
            this.iAmount = spindata.amount;

            if (CHEAT_DATA && CHEAT_DATA.length > 0) {
                spindata.test = true;
                spindata.cheat = CHEAT_DATA;
            } else if (this.cheatmode) {
                spindata.test = true;
                spindata.cheat = this.cheatdata;
            }

            this.spindata = spindata;

            GameEmitterMgr.instance.emit("msg_gameRoundStarted");
            var self = this;
            gameEmitter.gameRoundStarted()
                .then((ret) => {
                    GameEmitterMgr.instance.emit("msg_gameRoundStartedSucc");
                    self.onRoundStarted(ret);
                })
                .catch((err) => {
                    console.log('gameRoundStarted Error', err);
                });
        } else {
            //! 下一步
            //! 最后一回合需要collect
            if (this.isSpinEnd()) {
                this.bCollect = true;
                var self = this;
                slot.collect({step: this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1})
                    .then((ret) => {
                        self.onCollect(ret);
                    })
                    .catch((err) => {
                        console.log('collect Error ', err);
                    });
            } else {
                //gameEmitter.spinStarted();

                var gmimsg = this._createGameModuleInfo();

                if (gmimsg) {
                    GameMgr.singleton.onGameModuleInfo(gmimsg);
                    GameEmitterMgr.instance.emit("msg_spineResult", true);
                }

            }
        }
    },

    //! 模拟gamectrl2消息
    gamectrl2: function (gameid, ctrlname, ctrlparam, callback) {
        if (ctrlname == 'selectfree') {
            if (ctrlparam)
                this._selectFree(ctrlparam.curkey, callback);
        }
    },

    _selectFree: function (curkey, callback) {
        this.SelectFreeCallBack = callback;

        //! 如果是掉线重入，则不发消息，自动选择
        if (this.bAutoSelect) {
            this.autoSelectFree();
            this.bAutoSelect = false;
            return;
        }

        var selectdata = {};

        if (curkey == 0) {
            selectdata.cmd = 'MODE_ICE';
        } else {
            selectdata.cmd = 'MODE_FIRE';
        }

        selectdata.step = this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1;
        //selectdata.wagerid = this.SpinRet.wager.wagerid;

        //! 下注数据
        selectdata.coin = this.iCoin;
        selectdata.amount = this.iAmount;

        if (CHEAT_DATA && CHEAT_DATA.length > 0) {
            selectdata.test = true;
            selectdata.cheat = CHEAT_DATA;
        } else if (this.cheatmode) {
            selectdata.test = true;
            selectdata.cheat = this.cheatdata;
        }
        var self = this;
        slot.play(selectdata)
            .then((ret) => {
                self.onSelectFreeRet(ret);
            })
            .catch((err) => {
                console.log('play Error  ', err);
            });
    },

    isSpinEnd: function () {
        var ret = this.SpinRet;
        var ri = this.SpinIndex;

        if (ri < ret.wager.bets.length - 1)
            return false;

        if (ri > ret.wager.bets.length - 1)
            return true;

        var retdata = ret.wager.bets[ri].eventdata;

        if (retdata.nextCmds && retdata.nextCmds == 'MODE_ICE,MODE_FIRE')
            return false;

        return true;
    },

    onCollect: function (ret) {
        if (ret) {
            // if(ret.resultBal && ret.resultBal.cash)
            //     GameMgr.singleton.onMyMoney(Math.round(ret.resultBal.cash * this.iRateValue));

            // if((ret.cashRace && ret.cashRace.hasWon) || this.bPrepaid) {
            //     // if(ret.resultBal && ret.resultBal.cash)  {
            //     //     GameMgr.singleton.onMyMoney(Math.round(ret.resultBal.cash * this.iRateValue));
            //     // }
            //
            //     this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue);
            //     this.bChgBalance = true;
            // }
            // else {
            //     this.bChgBalance = false;
            // }

            if (ret.resultBal && ret.resultBal.cash) {
                this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue);
                this.bChgBalance = true;
                this.iRealBalance = this.iNewBalance;
            }

            // //! 测试
            // if(this.itestMoney == undefined)
            //     this.itestMoney = 1000;
            // else
            //     this.itestMoney += 1000;
            //
            // this.bChgBalance = true;
            // this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue + this.itestMoney);

            var gmimsg = this._createGameModuleInfo();

            if (gmimsg) {
                GameMgr.singleton.onGameModuleInfo(gmimsg);

                this._createLastGameModuleInfo(gmimsg);
                GameEmitterMgr.instance.emit("msg_spineResult", true);
                //change
                // if(this.SpinCallBack)
                //     this.SpinCallBack(true);
                //
                // this.SpinCallBack = undefined;
            }

            // gameEmitter.gameRoundEnded();
            // gameEmitter.spinEnded();
        }
    },

    onRoundStarted: function (ret) {
        var self = this;
        gameEmitter.spinStarted()
            .then((ret) => {
                self.onSpinStarted(ret);
            })
            .catch((err) => {
                console.log('spinStarted Error ', err);
            });
    },

    onSpinStarted: function (ret) {
        // if(Math.random() > 0.5) {
        //     this._sendLastGameModuleInfo();
        //     return ;
        // }

        this.bSpin = true;
        GameEmitterMgr.instance.emit("msg_spin");
        var self = this;
        slot.spin(this.spindata)
            .then((ret) => {
                GameEmitterMgr.instance.emit("msg_spinSucc");
                self.onSpinRet(ret);
            })
            .catch((err) => {
                GameEmitterMgr.instance.emit("msg_spinFail");
                //console.log('spin Error ', err);
                self.opSpinError(err);
            });
    },

    opSpinError: function (err) {
        console.log('spin Error ', err);
        this._sendLastGameModuleInfo();
    },

    onSpinRet: function (ret) {
        this.SpinRet = ret;
        this.SpinIndex = 0;
        this.TurnWin = 0;

        // var str = JSON.stringify(ret);
        // cc.log(str);

        if (ret) {
            //! userbaseinfo
            //! 如果直接结束则更新balance
            // if(ret.wager && ret.wager.status == 'Finished') {
            //     if((ret.cashRace && ret.cashRace.hasWon) || this.bPrepaid) {
            //         // if(ret.resultBal && ret.resultBal.cash)  {
            //         //     GameMgr.singleton.onMyMoney(Math.round(ret.resultBal.cash * this.iRateValue));
            //         // }
            //
            //         this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue);
            //         this.bChgBalance = true;
            //     }
            //     else {
            //         this.bChgBalance = false;
            //     }
            // }

            if (ret.resultBal && ret.resultBal.cash) {
                this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue);
                this.bChgBalance = true;
                this.iRealBalance = this.iNewBalance;
            }

            // //! 测试
            // if(this.itestMoney == undefined)
            //     this.itestMoney = 1000;
            // else
            //     this.itestMoney += 1000;
            //
            // this.bChgBalance = true;
            // this.iNewBalance = Math.round(ret.resultBal.cash * this.iRateValue + this.itestMoney);

            //! gamemoduleinfo
            if (ret.wager && ret.wager.bets && ret.wager.bets.length > 0) {
                // if(ret.wager.bets.length > 1) {
                //     var nret = this._deepClone(ret);
                // }

                var gmimsg = this._createGameModuleInfo();

                if (gmimsg) {
                    GameMgr.singleton.onGameModuleInfo(gmimsg);
                    this._createLastGameModuleInfo(gmimsg);
                }

                //! 没有中奖的情况
                if (this.isSpinEnd()) {
                    this.bCollect = true;
                }
            }
            GameEmitterMgr.instance.emit("msg_spineResult", true);

        } else {
            GameEmitterMgr.instance.emit("msg_spineResult", false);
        }
    },

    onSelectFreeRet: function (ret) {
        if (ret) {
            //var cret = ret;
            this.SpinRet = ret;
            this.SpinIndex = 0;

            //! 创造一个选择的消息
            var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"icefire2_fg\",\"gameid\":468,\"gmi\":{\"isspinend\":true,\"lastnums\":10,\"totalnums\":10,\"totalwin\":0,\"turnwin\":0,\"turnnums\":0,\"bet\":1,\"lines\":30,\"curm\":-1,\"fgnums\":10,\"exwilds\":150,\"curkey\":0}}";
            var gmimsg = JSON.parse(gmistr);

            var bdata = ret.wager.bets[0].betdata;
            var edata = ret.wager.bets[0].eventdata;

            //! 选择类型
            if (bdata.cmd == 'MODE_ICE')
                gmimsg.gmi.curkey = 0;
            else
                gmimsg.gmi.curkey = 1;

            //! 免费次数
            if (edata.reSpins)
                gmimsg.gmi.fgnums = edata.freeSpins;
            else
                gmimsg.gmi.fgnums = edata.freeSpins + 1;

            this.addFGNums = gmimsg.gmi.fgnums;

            //! 增加W
            if (edata.reelSet) {
                var bstr = "CascadeFreeSpinsReels";
                var eindex = edata.reelSet.indexOf("Wilds");
                var numstr = edata.reelSet.substring(bstr.length, eindex);
                gmimsg.gmi.exwilds = parseInt(numstr);
            }

            this.bFree = true;
            this.FgNums = gmimsg.gmi.fgnums;
            GameMgr.singleton.onGameModuleInfo(gmimsg);

            if (this.SelectFreeCallBack) {
                this.SelectFreeCallBack(true);
                this.SelectFreeCallBack = undefined;
            }
        } else {
            if (this.SelectFreeCallBack) {
                this.SelectFreeCallBack(false);
                this.SelectFreeCallBack = undefined;
            }
        }
    },

    autoSelectFree: function () {
        //! 创造一个选择的消息
        var ret = this.SpinRet;

        var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"icefire2_fg\",\"gameid\":468,\"gmi\":{\"isspinend\":true,\"lastnums\":10,\"totalnums\":10,\"totalwin\":0,\"turnwin\":0,\"turnnums\":0,\"bet\":1,\"lines\":30,\"curm\":-1,\"fgnums\":10,\"exwilds\":150,\"curkey\":0}}";
        var gmimsg = JSON.parse(gmistr);

        var bdata = ret.wager.bets[this.SpinIndex].betdata;
        var edata = ret.wager.bets[this.SpinIndex].eventdata;

        //! 选择类型
        if (bdata.cmd == 'MODE_ICE')
            gmimsg.gmi.curkey = 0;
        else
            gmimsg.gmi.curkey = 1;

        //! 免费次数
        if (edata.reSpins)
            gmimsg.gmi.fgnums = edata.freeSpins;
        else
            gmimsg.gmi.fgnums = edata.freeSpins + 1;

        this.addFGNums = gmimsg.gmi.fgnums;

        //! 增加W
        if (edata.reelSet) {
            var bstr = "CascadeFreeSpinsReels";
            var eindex = edata.reelSet.indexOf("Wilds");
            var numstr = edata.reelSet.substring(bstr.length, eindex);
            gmimsg.gmi.exwilds = parseInt(numstr);
        }

        this.bFree = true;
        this.FgNums = gmimsg.gmi.fgnums;
        GameMgr.singleton.onGameModuleInfo(gmimsg);

        if (this.SelectFreeCallBack) {
            this.SelectFreeCallBack(true);
            this.SelectFreeCallBack = undefined;
        }
    },

    //! 制造GameModuleInfo
    _createGameModuleInfo: function () {
        var ret = this.SpinRet;
        var ri = this.SpinIndex;
        var retdata = ret.wager.bets[ri].eventdata;

        var gmimsg = undefined;

        var reels = ret.wager.bets[ri].eventdata.reels;
        var reels2 = ret.wager.bets[ri].eventdata.reels2;

        var wtw = ret.wager.bets[ri].eventdata.wtw;
        var wtw2 = ret.wager.bets[ri].eventdata.wtw2;

        var realwin = Math.round(ret.wager.bets[ri].eventdata.wonMoney * this.iRateValue);

        //! 暂时特殊处理wonMoney和wonCoins不一致的情况
        if (ret.wager.bets[ri].eventdata.wonMoney <= 0 && ret.wager.bets[ri].eventdata.wonCoins >= 0)
            realwin = Math.round(ret.wager.bets[ri].eventdata.wonCoins);

        this.TurnWin += realwin;

        var totalwin = Math.round(ret.wager.bets[ri].eventdata.accWa * this.iRateValue);

        //! 暂时特殊处理accWa和accC不一致的情况
        if (ret.wager.bets[ri].eventdata.accWa * this.iRateValue < ret.wager.bets[ri].eventdata.accC)
            totalwin = Math.round(ret.wager.bets[ri].eventdata.accC);

        var fgname = ret.wager.bets[ri].eventdata.freeSpinsName;
        var fgnums = ret.wager.bets[ri].eventdata.freeSpinsAwarded;
        var lastnums = ret.wager.bets[ri].eventdata.freeSpins;

        // if(fgnums != undefined){
        //     this.FgNums = fgnums;
        // }

        if (lastnums != undefined) {
            this.LastNums = lastnums;
        }

        cc.log('');
        if (reels && reels2) {
            var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"icefire2_bg\",\"gameid\":468,\"gmi\":{\"spinret\":{\"realsuperfgnums\":0},\"curm\":5}}";
            gmimsg = JSON.parse(gmistr);

            gmimsg.gmi.turnwin = this.TurnWin;

            gmimsg.gmi.spinret.realwin = realwin;
            gmimsg.gmi.spinret.totalwin = realwin;
            gmimsg.gmi.spinret.bet = Math.round(ret.wager.bets[ri].betdata.coin * this.iRateValue);
            gmimsg.gmi.spinret.times = 1;
            gmimsg.gmi.spinret.lines = ret.wager.bets[ri].betdata.ncoins;

            gmimsg.gmi.lstarr = this._chgReels(reels, reels2);
            gmimsg.gmi.spinret.lst = this._createlst(wtw, wtw2, gmimsg.gmi.lstarr, gmimsg.gmi.spinret.bet);

            //! 普通游戏
            if (retdata.reelSet == 'BaseReels') {
                gmimsg.gamemodulename = 'icefire2_bg';

                if (retdata.nextCmds && retdata.nextCmds == 'MODE_ICE,MODE_FIRE') {
                    //! 进入选择冰火环节
                    gmimsg.gmi.spinret.curfg = {};
                    gmimsg.gmi.spinret.curfg.fgnums = 1;
                    gmimsg.gmi.spinret.curfg.exwilds = 1;
                    gmimsg.gmi.spinret.curfg.weight = 1;

                    if (this.bAutoSelect) {
                        //! 如果是重入，需要让UI自动选择
                        var nextdata = ret.wager.bets[ri + 1].eventdata;
                        var stype = nextdata.freeSpinsType == 'MODE_ICE' ? 0 : 1;

                        GameEmitterMgr.instance.emit("ygg_setSelectType", stype);
                        //change
                        // if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.setSelectType)
                        //     GameMgr.singleton.curGameLayer.setSelectType(stype);
                    }
                } else if (retdata.scatterFreeSpinsWon) {
                    //! 进超级免费
                    gmimsg.gmi.spinret.realsuperfgnums = retdata.freeSpins;
                    this.FgNums = retdata.freeSpins;
                    this.addFGNums = retdata.freeSpins;

                    //! 找出所有的scatter图标
                    var sdata = {};

                    sdata.type = 'scatterex2';
                    sdata.bet = gmimsg.gmi.spinret.bet;
                    sdata.symbol = 11;
                    sdata.multiplies = 0;
                    sdata.win = 0;

                    sdata.positions = [];

                    for (var ii = 0; ii < gmimsg.gmi.lstarr.length; ++ii) {
                        for (var jj = 0; jj < gmimsg.gmi.lstarr[ii].length; ++jj) {
                            if (gmimsg.gmi.lstarr[ii][jj] == sdata.symbol) {
                                var node = {};

                                node.x = jj;
                                node.y = ii;

                                sdata.positions.push(node);
                            }
                        }
                    }

                    gmimsg.gmi.spinret.lst.push(sdata);

                    this.bSuperFree = true;
                }

                // if(wtw.length <= 0 && wtw2.length <= 0)
                //     gmimsg.gmi.isspinend = true;
                // else
                //     gmimsg.gmi.isspinend = false;
                if (retdata.reSpins)
                    gmimsg.gmi.isspinend = false;
                else
                    gmimsg.gmi.isspinend = true;

                gmimsg.gmi.turnnums = ri + 1;
                this.iBgTotalWin = totalwin;
            }
            // else if(retdata.scatterFreeSpinsWon) {
            //     //! 进超级免费
            //     gmimsg.gmi.spinret.realsuperfgnums = retdata.freeSpins;
            //     this.FgNums = retdata.freeSpins;
            //     this.addFGNums = retdata.freeSpins;
            //
            //     //! 找出所有的scatter图标
            //     var sdata = {};
            //
            //     sdata.type = 'scatterex2';
            //     sdata.bet = gmimsg.gmi.spinret.bet;
            //     sdata.symbol = 11;
            //     sdata.multiplies = 0;
            //     sdata.win = 0;
            //
            //     sdata.positions = [];
            //
            //     for(var ii = 0; ii < gmimsg.gmi.lstarr.length; ++ii) {
            //         for(var jj = 0; jj < gmimsg.gmi.lstarr[ii].length; ++jj) {
            //             if(gmimsg.gmi.lstarr[ii][jj] == sdata.symbol) {
            //                 var node = {};
            //
            //                 node.x = jj;
            //                 node.y = ii;
            //
            //                 sdata.positions.push(node);
            //             }
            //         }
            //     }
            //
            //     gmimsg.gmi.spinret.lst.push(sdata);
            //
            //     this.bSuperFree = true;
            // }
            else {
                totalwin -= this.iBgTotalWin;

                if (this.bSuperFree) {
                    //! 超级免费中
                    gmimsg.gamemodulename = 'icefire2_fg2';

                    gmimsg.gmi.turnnums = this.FgTurnNums + 1;

                    if (retdata.reSpins) {
                        gmimsg.gmi.isspinend = false;

                        if (retdata.freeSpins)
                            gmimsg.gmi.lastnums = retdata.freeSpins - 1;
                        else
                            gmimsg.gmi.lastnums = 0;

                        gmimsg.gmi.supermul = retdata.multiplier + 1;

                        this.FgTurnNums += 1;
                    } else {
                        gmimsg.gmi.isspinend = true;

                        if (retdata.freeSpins)
                            gmimsg.gmi.lastnums = retdata.freeSpins;
                        else
                            gmimsg.gmi.lastnums = 0;

                        gmimsg.gmi.supermul = retdata.multiplier;

                        this.FgTurnNums = 0;
                    }

                    if (retdata.scatterFreeSpinsWon) {
                        this.FgNums += this.addFGNums;
                        gmimsg.gmi.spinret.fgnums = this.addFGNums;
                    }

                    gmimsg.gmi.totalnums = this.FgNums;
                    gmimsg.gmi.totalwin = totalwin;

                    if (ri == ret.wager.bets.length - 1)
                        this.bSuperFree = false;
                } else if (this.bFree) {
                    //! 普通免费中
                    gmimsg.gamemodulename = 'icefire2_fg';

                    gmimsg.gmi.turnnums = this.FgTurnNums + 1;

                    if (retdata.reSpins) {
                        gmimsg.gmi.isspinend = false;

                        if (retdata.freeSpins)
                            gmimsg.gmi.lastnums = retdata.freeSpins - 1;
                        else
                            gmimsg.gmi.lastnums = 0;

                        this.FgTurnNums += 1;

                        // //! 测试代码
                        // gmimsg.gmi.spinret.realwin = 1;
                        // gmimsg.gmi.spinret.totalwin = 1;
                    } else {
                        gmimsg.gmi.isspinend = true;

                        if (retdata.freeSpins)
                            gmimsg.gmi.lastnums = retdata.freeSpins;
                        else
                            gmimsg.gmi.lastnums = 0;

                        this.FgTurnNums = 0;
                    }

                    // if(retdata.scatterFreeSpinsWon) {
                    //     this.FgNums += 10;
                    //     gmimsg.gmi.spinret.fgnums = 10;
                    // }

                    if (retdata.cascadeFreeSpinsWon) {
                        this.FgNums += this.addFGNums;
                        gmimsg.gmi.spinret.fgnums = this.addFGNums;
                    }

                    gmimsg.gmi.totalnums = this.FgNums;
                    gmimsg.gmi.totalwin = totalwin;

                    gmimsg.gmi.curkey = retdata.freeSpinsType == 'MODE_ICE' ? 0 : 1;

                    if (ri == ret.wager.bets.length - 1)
                        this.bFree = false;

                    //if(retdata.scatterFreeSpinsWon) {
                    if (gmimsg.gmi.isspinend && gmimsg.gmi.lastnums == 0 && !this.isSpinEnd()) {
                        //! 测试进超级免费……
                        var nextdata = ret.wager.bets[ri + 1].eventdata;

                        if (nextdata.reSpins) {
                            gmimsg.gmi.spinret.realsuperfgnums = nextdata.freeSpins;
                            this.FgNums = nextdata.freeSpins;
                            this.addFGNums = nextdata.freeSpins;
                        } else {
                            gmimsg.gmi.spinret.realsuperfgnums = nextdata.freeSpins + 1;
                            this.FgNums = nextdata.freeSpins + 1;
                            this.addFGNums = nextdata.freeSpins + 1;
                        }

                        // gmimsg.gmi.spinret.realsuperfgnums = 10;
                        // this.FgNums = 10;
                        // this.addFGNums = 10;

                        //! 找出所有的scatter图标
                        var sdata = {};

                        sdata.type = 'scatterex2';
                        sdata.bet = gmimsg.gmi.spinret.bet;
                        sdata.symbol = 11;
                        sdata.multiplies = 0;
                        sdata.win = 0;

                        sdata.positions = [];

                        for (var ii = 0; ii < gmimsg.gmi.lstarr.length; ++ii) {
                            for (var jj = 0; jj < gmimsg.gmi.lstarr[ii].length; ++jj) {
                                if (gmimsg.gmi.lstarr[ii][jj] == sdata.symbol) {
                                    var node = {};

                                    node.x = jj;
                                    node.y = ii;

                                    sdata.positions.push(node);
                                }
                            }
                        }

                        gmimsg.gmi.spinret.lst.push(sdata);

                        this.bSuperFree = true;
                        this.iBgTotalWin += totalwin;
                    }
                }
            }

            // //!免费游戏
            // if(fgname != undefined || this.FgName != undefined){
            //     cc.log('in free');
            //
            //     //var totalnums = 0;
            //     var supermul = 1;
            //     for(var ii = 0; ii < ret.wager.bets.length; ii++){
            //         var rs = ret.wager.bets[ii].eventdata.reSpins;
            //         var rest = ret.wager.bets[ii].eventdata.reelSet;
            //
            //         if(rs){
            //             if(fgname == 'scatterFreeSpins' || this.FgName == 'scatterFreeSpins'){
            //                 if(ii <= ri){
            //                     supermul++;
            //                 }
            //             }
            //         }
            //         //else{
            //         //    totalnums ++;
            //         //}
            //
            //         if(rest){
            //             var arr = rest.split("");
            //
            //             if(this.ExWilds == ''){
            //                 for(var jj = 0; jj < arr.length; jj++){
            //                     if(Number(arr[jj]) >= 0){
            //                         this.ExWilds += arr[jj];
            //                     }
            //                 }
            //             }
            //         }
            //     }
            //
            //     //!第一次触发免费或者再次触发免费
            //     if(fgname != undefined){
            //         this.TotalNums += fgnums;
            //         //!第一次触发免费
            //         if(this.FgName == undefined){
            //             this.FgName = fgname;
            //
            //             gmimsg.gamemodulename = 'icefire2_bg';
            //
            //             //if(ret.wager.bets.length == ri + 1)
            //             //    gmimsg.gmi.isspinend = true;
            //             //else
            //             //    gmimsg.gmi.isspinend = false;
            //
            //             if(fgname == 'scatterFreeSpins'){
            //                 gmimsg.gmi.spinret.realsuperfgnums = this.FgNums;
            //             }
            //             else{
            //                 gmimsg.gmi.spinret.realsuperfgnums = 0;
            //                 gmimsg.gmi.spinret.curfg = {};
            //                 gmimsg.gmi.spinret.curfg.fgnums = this.FgNums;
            //                 gmimsg.gmi.spinret.curfg.exwilds = parseInt(this.ExWilds);
            //                 gmimsg.gmi.fgnums = this.FgNums;
            //                 gmimsg.gmi.exwilds = parseInt(this.ExWilds);
            //             }
            //
            //             this.bFirstFree = true;
            //         }
            //         else{
            //             this.LastNums += this.FgNums;
            //
            //             if(fgname == 'scatterFreeSpins'){
            //                 gmimsg.gamemodulename = 'icefire2_fg2';
            //                 gmimsg.gmi.spinret.fgnums = this.FgNums;
            //                 gmimsg.gmi.supermul = supermul;
            //             }
            //             else{
            //                 gmimsg.gamemodulename = 'icefire2_fg';
            //                 gmimsg.gmi.fgnums = this.FgNums;
            //                 gmimsg.gmi.exwilds = parseInt(this.ExWilds);
            //             }
            //         }
            //     }
            //     //!免费游戏中
            //     else{
            //         if(this.FgName == 'cascadeFreeSpins'){
            //             gmimsg.gamemodulename = 'icefire2_fg';
            //             gmimsg.gmi.fgnums = this.FgNums;
            //             gmimsg.gmi.exwilds = parseInt(this.ExWilds);
            //             gmimsg.gmi.spinret.fgnums = 0;
            //         }
            //         else if(this.FgName == 'scatterFreeSpins'){
            //             gmimsg.gamemodulename = 'icefire2_fg2';
            //             gmimsg.gmi.realsuperfgnums = this.FgNums;
            //             gmimsg.gmi.supermul = supermul;
            //             gmimsg.gmi.spinret.fgnums = 0;
            //         }
            //     }
            //
            //     gmimsg.gmi.lastnums = this.LastNums;
            //     gmimsg.gmi.totalnums = this.TotalNums;
            //     gmimsg.gmi.totalwin = totalwin;
            //
            //     if(ret.wager.bets.length == ri + 1/*!(this.LastNums + 1)*/){
            //         this.FgName = undefined;
            //         this.TotalNums = 0;
            //         //gmimsg.gamemodulename = 'icefire2_bg';
            //     }
            //
            //     if(ret.wager.bets[ri].eventdata.reSpins){
            //         gmimsg.gmi.isspinend = false;
            //         this.FgTurnNums ++;
            //     }
            //     else{
            //         gmimsg.gmi.isspinend = true;
            //         this.LastNums--;
            //         this.FgTurnNums = 0;
            //     }
            //
            //     gmimsg.gmi.turnnums = this.FgTurnNums;
            // }
            // //!普通游戏
            // else{
            //     gmimsg.gamemodulename = 'icefire2_bg';
            //
            //     if(ret.wager.bets.length == ri + 1)
            //         gmimsg.gmi.isspinend = true;
            //     else
            //         gmimsg.gmi.isspinend = false;
            //
            //     gmimsg.gmi.turnnums = ri + 1;
            // }

            //GameMgr.singleton.onGameModuleInfo(gmimsg);
        }

        this.SpinIndex += 1;

        var str = JSON.stringify(gmimsg);
        cc.log('gmimsg ' + str);
        return gmimsg;
    },

    //! 根据已有消息创建一个保留消息
    _createLastGameModuleInfo: function (gmimsg) {
        var lmsg = this._deepClone(gmimsg);

        lmsg.gamemodulename = 'icefire2_bg';

        if (!lmsg.gmi.spinret)
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

        this.lastGameModuleInfo = lmsg;
    },

    _sendLastGameModuleInfo: function () {
        if (!this.lastGameModuleInfo)
            return;

        GameMgr.singleton.onGameModuleInfo(this.lastGameModuleInfo);
        GameEmitterMgr.instance.emit("msg_spineResult", true);
        //change
        // if(this.SpinCallBack)
        //     this.SpinCallBack(true);

        this.bSendLast = true;
    },

    //! 模拟之前的登陆流程
    _login: function () {
        this.bLogin = true;

        // if(this.Config.settings.language == 'zh' || this.Config.settings.language == 'zh_hans') {
        //     LanguageData.instance.setlanguageType('_zh');
        //     LanguageData.instance.refreshShowedText();
        // }

        //! userbaseinfo
        GameMgr.singleton.userbaseinfo = {};
        GameMgr.singleton.userbaseinfo.currency = this.Config.settings.currency;

        //! gamecfg
        if (this.Config.settings.organizationConfig && this.Config.settings.organizationConfig.Denoms) {
            var bindex = this.Config.settings.organizationConfig.Denoms.indexOf(':');

            var dstr = '[';
            dstr += this.Config.settings.organizationConfig.Denoms.slice(bindex + 1);
            dstr += ']';

            var denoms = JSON.parse(dstr);

            //! 计算小数位数
            for (var ii = 0; ii < denoms.length; ++ii) {
                var num = denoms[ii];
                var x = String(num).indexOf('.') + 1;
                var y = String(num).length - x;

                if (y > this.iRateNum) {
                    this.iRateNum = y;
                    this.iRateValue = Math.round(Math.pow(10, this.iRateNum));
                }
            }

            GameDataMgr.instance.setCoinValueRate(this.iRateValue);

            var linebets = [];

            for (var ii = 0; ii < denoms.length; ++ii) {
                linebets.push(Math.round(denoms[ii] * this.iRateValue));
            }

            //! 记录最大下注值
            if (denoms.length > 0)
                this.iMaxBet = denoms[denoms.length - 1] * 30;

            var bnum = undefined;

            if (this.bReplay) {
                //! 如果是录像则尝试恢复下注
                if (this.Config.wagers.data[0].bets.length > 0) {
                    bnum = Math.round(this.Config.wagers.data[0].bets[0].betamount * this.iRateValue / 30);
                }

                //GameMgr.singleton.onBetList(linebets, bnum);
            } else if (!this.GameReadyRet || this.GameReadyRet.restoreMode == 'NONE') {
                //! 游戏的话恢复默认值
                if (this.Config.settings.organizationConfig.DefaultDenom) {
                    var bindex = this.Config.settings.organizationConfig.DefaultDenom.indexOf(':');
                    var dstr = this.Config.settings.organizationConfig.DefaultDenom.slice(bindex + 1);

                    bnum = Math.round(Number(dstr) * this.iRateValue);
                } else {
                    bnum = linebets[0];
                }
                //GameMgr.singleton.onBetList(linebets);
            } else {
                //! 恢复RESTORE下注
                if (this.Config.wagers.data[0].bets.length > 0) {
                    bnum = Math.round(this.Config.wagers.data[0].bets[0].betamount * this.iRateValue / 30);
                }
            }

            GameMgr.singleton.onBetList(linebets, bnum);
        }

        var mymoney = 0;

        if (this.Config.settings.balance != undefined) {
            mymoney = this.Config.settings.balance * this.iRateValue;
        } else {
            if (this.Config.wagers && this.Config.wagers.data[0].bets.length > 0) {
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

        if (!this.GameReadyRet || this.GameReadyRet.restoreMode != 'SKIP') {
            GameMgr.singleton.onMyMoney(Math.round(mymoney));
        }

        GameMgr.singleton.myInfo.gameid = GameMgr.singleton.getCurGameID();

        //! comeingame
        //! gamemoduleinfo
        var gmistr = "{\"msgid\":\"gamemoduleinfo\",\"gamemodulename\":\"icefire2_bg\",\"gameid\":468,\"gmi\":{\"isspinend\":true,\"lstindex0\":[68,145,254,61,108],\"lstindex1\":[125,158,258,281,227],\"lstarr\":[[9,7,6,9,3],[9,3,6,9,7],[9,3,7,3,7],[9,3,7,3,7],[9,3,7,3,7],[9,4,7,5,2],[4,4,7,5,2],[4,8,7,8,10],[4,8,7,8,4],[4,8,7,8,4]],\"turnwin\":0,\"turnnums\":0,\"curm\":7}}";
        var gmimsg = JSON.parse(gmistr);

        //! 根据不同情况恢复不同的消息
        if (this.GameReadyRet && this.GameReadyRet.restoreMode == 'RESTORE') {
            // //this.SpinRet = this.Config;
            // this.SpinIndex = 0;
            //
            // this.SpinRet = {};
            // this.SpinRet.wager = {};
            // this.SpinRet.wager.bets = this.Config.wagers.data[0].bets;

            this._restoreBets();

            // gameEmitter.gameRoundStarted();
            // gameEmitter.spinStarted();

            gmimsg = this._createGameModuleInfo();

            //gameEmitter.spinEnded();
        } else if (this.GameReadyRet && this.GameReadyRet.restoreMode == 'SKIP') {
            //this.SpinRet = this.Config;

            // this.SpinRet = {};
            // this.SpinRet.wager = {};
            // this.SpinRet.wager.bets = this.Config.wagers.data[0].bets;
            // //this.SpinIndex = this.SpinRet.wager.bets.length - 1;
            //
            // this.SpinIndex = 0;
            //
            // while(this.SpinIndex < this.SpinRet.wager.bets.length - 1) {
            //     this._createGameModuleInfo();
            // }

            this._skipBets();

            if (!this.isPrepaid())
                GameMgr.singleton.onMyMoney(Math.round(mymoney + this.iBgTotalWin));
            else
                GameMgr.singleton.onMyMoney(Math.round(mymoney));

            this.bCollect = true;
            var self = this;
            slot.collect({step: this.SpinRet.wager.bets[this.SpinRet.wager.bets.length - 1].step + 1})
                .then((ret) => {
                    self.onCollect(ret);
                })
                .catch((err) => {
                    console.log('collect Error ', err);
                });

            //gmimsg = this._createGameModuleInfo();

            if (GameMgr.singleton.curGameLayer == undefined)
                cc.director.runScene(new GameScene());

            return;
        } else {
            var cfg = this.Config;

            if (cfg && cfg.settings && cfg.settings.slotConfig && cfg.settings.slotConfig.InitialLeftReels && cfg.settings.slotConfig.InitialRightReels) {
                var reels = cfg.settings.slotConfig.InitialLeftReels;
                var reels2 = cfg.settings.slotConfig.InitialRightReels;

                gmimsg.gmi.lstarr = this._chgReels(reels, reels2);
            }
        }

        gmimsg.mode = this.Config.mode;
        GameMgr.singleton.onGameModuleInfo(gmimsg);

        //! 如果是游戏则保留备份
        if (!this.bReplay && (!this.GameReadyRet || this.GameReadyRet.restoreMode == 'NONE')) {
            this._createLastGameModuleInfo(gmimsg);
        }

        //! 重播恢复旋转后的数据
        if (this.bReplay) {
            //this._createReplayData();
            this._restoreBets();
        }

        if (GameMgr.singleton.curGameLayer == undefined)
            cc.director.runScene(new GameScene());
    },

    //! 恢复之前的消息显示
    _restoreBets: function () {
        this.SpinIndex = 0;

        this.SpinRet = {};
        this.SpinRet.wager = {};
        this.SpinRet.wager.bets = this.Config.wagers.data[0].bets;

        //! 恢复下注数据
        if (this.SpinRet.wager.bets.length > 0) {
            if (this.SpinRet.wager.bets[0].betamount)
                this.iAmount = this.SpinRet.wager.bets[0].betamount;

            if (this.SpinRet.wager.bets[0].betdata && this.SpinRet.wager.bets[0].betdata.coin)
                this.iCoin = this.SpinRet.wager.bets[0].betdata.coin;
        }

        var freetype = this._getFreeType(this.SpinRet.wager.bets);

        if (freetype != 1)
            return;

        //! 普通免费情况比较特殊，可能会需要特殊处理
        var bets = this.SpinRet.wager.bets;

        for (var ii = 0; ii < bets.length; ++ii) {
            var retdata = bets[ii].eventdata;

            if (retdata.nextCmds && retdata.nextCmds == 'MODE_ICE,MODE_FIRE') {
                //! 还没有选择的情况下重入
                if (ii >= bets.length - 1)
                    return;

                //! 需要选择并将UI选择的过程自动化
                //var nextdata = bets[ii + 1].eventdata;
                this.bAutoSelect = true;
                return;
            }
        }
    },

    //! 跳过部分消息显示结果
    _skipBets: function () {
        this.SpinRet = {};
        this.SpinRet.wager = {};
        this.SpinRet.wager.bets = this.Config.wagers.data[0].bets;
        //this.SpinIndex = this.SpinRet.wager.bets.length - 1;

        var freetype = this._getFreeType(this.SpinRet.wager.bets);

        if (freetype == 1)
            this.bFree = true;

        this.SpinIndex = 0;

        //! 跳到最后一个消息等待collect
        while (this.SpinIndex < this.SpinRet.wager.bets.length - 1) {
            this._createGameModuleInfo();
        }
    },

    //! 根据一组消息判断免费类型 0非免费 1普通免费 2超级免费
    _getFreeType: function (bets) {
        for (var ii = 0; ii < bets.length; ++ii) {
            var retdata = bets[ii].eventdata;

            if (retdata.nextCmds && retdata.nextCmds == 'MODE_ICE,MODE_FIRE')
                return 1;

            if (retdata.scatterFreeSpinsWon)
                return 2;
        }

        return 0;
    },

    //! 转换轮子上的数据
    _chgReels: function (reels, reels2) {
        var lstarr = [];

        for (var ii = 0; ii < 5; ++ii) {
            var lst = [];

            for (var jj = 0; jj < 5; ++jj) {
                var icon = this.iconvalue[reels[jj][ii]];
                lst.push(icon);
            }

            lstarr.push(lst);
        }

        for (var ii = 0; ii < 5; ++ii) {
            var lst = [];

            for (var jj = 0; jj < 5; ++jj) {
                var icon = this.iconvalue[reels2[jj][ii]];
                lst.push(icon);
            }

            lstarr.push(lst);
        }

        return lstarr;
    },

    //! 创建获奖数据
    _createlst: function (wtw, wtw2, lstarr, bet) {
        var lst = [];

        if (wtw) {
            for (var ii = 0; ii < wtw.length; ++ii) {
                var data = this._createlstdata(wtw[ii], 0, lstarr, bet);

                if (data)
                    lst.push(data);
            }
        }

        if (wtw2) {
            for (var ii = 0; ii < wtw2.length; ++ii) {
                var data = this._createlstdata(wtw2[ii], 5, lstarr, bet);

                if (data)
                    lst.push(data);
            }
        }

        return lst;
    },

    //! 填充lst里面的一个的数据
    _createlstdata: function (wtwdata, spy, lstarr, bet) {
        var line = wtwdata[0] - 1;

        if (line < 0 || line >= this.Paylines.length)
            return undefined;

        var data = {};

        data.type = 'line';
        data.bet = bet;

        data.data = {};
        data.data.line = line;
        data.data.paytype = 'lr';

        data.positions = [];

        var snum = 0;
        var symbol = 0;
        var px = 0;
        var py = 0;

        for (var ii = 0; ii < wtwdata[2].length; ++ii) {
            var inum = parseInt(wtwdata[2].slice(ii, ii + 1));

            if (inum > 0) {
                snum += 1;
                px = Math.floor(ii / 5);
                py = ii % 5 + spy;

                if (symbol <= 0) {
                    symbol = lstarr[py][px];
                }

                var pos = {x: px, y: py};
                data.positions.push(pos)
            }
        }

        if (symbol <= 0)
            symbol = 1;

        if (snum > 5)
            snum = 5;

        data.symbol = symbol;
        data.multiplies = this.Paytable[symbol][snum - 1];
        data.win = data.multiplies * bet;

        return data;
    },

    //! 显示提示信息框，如果可以显示则返回true
    showDlg: function (type, type1, strerror, bshowcash) {
        var str = undefined;

        this.iType = type;
        this.iTyp1 = type1;

        if (this.iType == 2) {
            if (this.iTyp1 == -1) {
                //LanguageData.instance.setMapValue('TotalMax', strerror);
                //str = LanguageData.instance.getTextStr("uiScreen_TotalMax");
                // var test = slot.uiComponents();
                // var test1 = test.clickActionHandler();
                // var test2 = test1.maximumBetWarning(1);

                if (!uiComponents)
                    uiComponents = slot.uiComponents();

                uiComponents.clickActionHandler().maximumBetWarning(this.iMaxBet);
                return true;
            }
        } else if (this.iType == 5) {
            LanguageData.instance.setMapValue('Limit', strerror);

            if (this.iTyp1 == 1) {
                if (bshowcash) {
                    str = LanguageData.instance.getTextStr("uiScreen_WinLimit2");
                } else {
                    str = LanguageData.instance.getTextStr("uiScreen_WinLimit1");
                }
            } else if (this.iTyp1 == 2) {
                if (bshowcash) {
                    str = LanguageData.instance.getTextStr("uiScreen_LossLimit2");
                } else {
                    str = LanguageData.instance.getTextStr("uiScreen_LossLimit1");
                }
            }
        }

        if (!uiComponents)
            uiComponents = slot.uiComponents();

        if (uiComponents && str) {
            //var data = {title:'title',message:'test',theme:'DARK',primaryButtonText:'OK'};
            var data = {theme: 'DARK'};

            data.message = str;
            data.primaryButtonText = LanguageData.instance.getTextStr("uiScreen_ButtonOk");
            data.primaryButtonAction = this.onButton;

            uiComponents.showPopup(data);

            GameEmitterMgr.instance.emit("ygg_disconnectShow", "show");
            //change
            // if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
            //     GameMgr.singleton.curGameLayer.ModuleUI._setState('disconnect', 'show');

            return true;
        }

        return false;
    },

    onButton: function () {
        GameEmitterMgr.instance.emit("ygg_disconnectShow", "hide");
        //change
        // if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
        //     GameMgr.singleton.curGameLayer.ModuleUI._setState('disconnect', 'hide');
    },

    stopAutoSpin: function () {
        GameEmitterMgr.instance.emit("msg_stopAutoSpin");
        //change
        // if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI) {
        //     GameDataMgr.instance.setIAutoNum(0);
        //     GameMgr.singleton.curGameLayer.ModuleUI._setState('auto', 0);
        // }
    },

    updateBalance: function (val) {
    },

    //向ygg发送totalBetChanged数据
    sendTotalBetChanged: function (value) {
        this.iTotalBet = value;

        if (this.GameReadyRet != undefined) {
            if (gameEmitter && gameEmitter.totalBetChanged) {
                if (this.iSendBet == undefined || this.iSendBet != this.iTotalBet) {
                    this.iSendBet = this.iTotalBet;
                    gameEmitter.totalBetChanged(this.iTotalBet / this.iRateValue);
                }
            }
        }
    },

    sendSpinEnd: function () {
        if (this.bSendLast) {
            this.bWaitRoundEnded = true;
            GameMgr.singleton.onMyMoney(this.iRealBalance);
            this.bWaitRoundEnded = false;
            this.bSendLast = false;
            return;
        }

        if (!this.bCollect)
            return;

        this.bCollect = false;

        // if(!this.bSpin)
        //     return ;
        //
        // this.bSpin = false;

        if (this.bChgBalance)
            this.bWaitRoundEnded = true;
        var self = this;
        if (gameEmitter) {
            gameEmitter.spinEnded()
                .then((ret) => {
                    self.onSpinEnded(ret);
                })
                .catch((err) => {
                    console.log('spinEnded Error ', err);
                });
        }
    },

    onSpinEnded: function (ret) {
        GameEmitterMgr.instance.emit("msg_gameRoundEnded");
        gameEmitter.gameRoundEnded()
            .then((ret) => {
                GameEmitterMgr.instance.emit("msg_gameRoundEndedSucc");
                self.onRoundEnded(ret);
            })
            .catch((err) => {
                console.log('gameRoundEnded Error ', err);
            });
    },

    onRoundEnded: function (ret) {
        var pamount = 0;

        if (ret.nextPrepaid && ret.nextPrepaid.amount)
            pamount = ret.nextPrepaid.amount;

        this.setPrepaid(pamount);

        if (this.bChgBalance) {
            GameMgr.singleton.onMyMoney(this.iNewBalance);
            this.bChgBalance = false;
            this.bWaitRoundEnded = false;
        }
    },

    //! 是否需要等待回合结束
    isWaitRoundEnded: function () {
        if (this.bWaitRoundEnded == undefined)
            return false;

        return this.bWaitRoundEnded;
    },

    // ygg有通知栏时，设置游戏的宽高
    setSlotGameSize: function (msg) {
        //! 先处理boost/top-bar
        var top = 0;

        for (var ii = 0; ii < msg.length; ++ii) {
            for (var jj = 0; jj < msg[ii].length; ++jj) {
                var node = msg[ii][jj];

                if (!node.id || node.id != 'boost/top-bar')
                    continue;

                if (!node.bounds || !node.bounds.height)
                    continue;

                if (node.bounds.height > top)
                    top = node.bounds.height;
            }
        }

        GameEmitterMgr.instance.emit("ygg_adaptiveAdjust", top);
        //change
        // if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.GameCanvasMgr)
        //     GameMgr.singleton.curGameLayer.GameCanvasMgr.setAdaptiveAdjustValue('boost/top-bar', top, 0, 0, 0);

        cc.view.setYggFrameSize(msg);
    },

    //! 创建录像数据
    _createReplayData: function () {
        if (this.Config.mode != 'REPLAY')
            return undefined;

        var rdata = this.Config.wagers.data[0];

        if (rdata.bets.length <= 0)
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

        for (var ii = 0; ii < rlen; ++ii) {
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

            if (!node.freespinsleft)
                node.freespinsleft = 0;

            data.lst.push(node);
        }

        return data;
    },

    //! 转换轮子上的数据
    _chgReels_replay: function (reels, reels2) {
        var lstarr = [];

        for (var ii = 0; ii < 5; ++ii) {
            var lst = [];

            for (var jj = 0; jj < 5; ++jj) {
                var icon = this.iconvalue[reels[jj][ii]];
                lst.push(icon);
            }

            lstarr.push(lst);
        }

        for (var ii = 0; ii < 5; ++ii) {
            var lst = lstarr[ii];

            for (var jj = 0; jj < 5; ++jj) {
                var icon = this.iconvalue[reels2[jj][ii]];
                lst.push(icon);
            }
        }

        //! 复制wild
        for (var ii = 0; ii < 5; ++ii) {
            for (var jj = 0; jj < 10; ++jj) {
                var icon = lstarr[ii][jj];

                if (icon == 0) {
                    if (jj < 5)
                        lstarr[ii][jj + 5] = 0;
                    else
                        lstarr[ii][jj - 5] = 0;
                }
            }
        }

        //! 将右侧图标变大
        for (var ii = 0; ii < 5; ++ii) {
            for (var jj = 5; jj < 10; ++jj) {
                lstarr[ii][jj] += 12;
            }
        }

        return lstarr;
    },

    //! 创建获奖数据
    _createlst_replay: function (wtw, wtw2) {
        var lst = [];

        if (wtw) {
            for (var ii = 0; ii < wtw.length; ++ii) {
                var data = this._createlstdata_replay(wtw[ii], 0);

                if (data)
                    lst.push(data);
            }
        }

        if (wtw2) {
            for (var ii = 0; ii < wtw2.length; ++ii) {
                var data = this._createlstdata_replay(wtw2[ii], 5);

                if (data)
                    lst.push(data);
            }
        }

        return lst;
    },

    //! 填充lst里面的一个的数据
    _createlstdata_replay: function (wtwdata, spx) {
        var line = wtwdata[0] - 1;

        if (line < 0 || line >= this.Paylines.length)
            return undefined;

        var data = [];

        for (var ii = 0; ii < 5; ++ii) {
            var lst = [];

            for (var jj = 0; jj < 10; ++jj)
                lst.push(0);

            data.push(lst);
        }

        for (var ii = 0; ii < wtwdata[2].length; ++ii) {
            var inum = parseInt(wtwdata[2].slice(ii, ii + 1));

            if (inum > 0) {
                px = Math.floor(ii / 5) + spx;
                py = ii % 5;

                if (spx == 0)
                    data[py][px] = 1;
                else
                    data[py][px] = 2;
            }
        }

        return data;
    },

    //! 设置预付费
    setPrepaid: function (amount) {
        var iRateValue = this.iRateValue;
        GameEmitterMgr.instance.emit("ygg_setPrepaid", amount, iRateValue);
        this.bPrepaid = amount <= 0 ? false : true;
        //change
        // if(amount <= 0) {
        //     this.bPrepaid = false;
        //
        //     if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
        //         GameMgr.singleton.curGameLayer.ModuleUI._setState('prepaid', 'close');
        // }
        // else {
        //     this.bPrepaid = true;
        //
        //     if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI) {
        //         var bnum = Math.round(amount * this.iRateValue / 30);
        //
        //         GameMgr.singleton.curGameLayer.ModuleUI.setCoinValue(bnum);
        //         GameMgr.singleton.curGameLayer.ModuleUI._setState('prepaid', 'open');
        //     }
        // }
    },

    //! 是否是预付费游戏
    isPrepaid: function () {
        return this.bPrepaid;
    },

    update: function (dt) {
    },


    //! 是否显示Home键
    isShowHome: function () {
        return cc.sys.isMobile;
    },

    //! 点击Home键
    onClickHome: function () {
        if (!uiComponents)
            uiComponents = slot.uiComponents();

        uiComponents.clickActionHandler().home();
    },

    _deepClone: function (source) {
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

                    if (stype != 'string' && stype != 'number' && stype != 'boolean')
                        continue;

                    targetObj[key] = source[key];
                }
            }
        }

        return targetObj;
    },
    updateAndNext: function (dt) {
        this.update(dt);

        if (this.isWaitRoundEnded()) {
            return false;
        }
        return true;
    },
    needSaveBetNum: function () {
        if (this.bReplay) {
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
        var temp = this.getHasLossLimit();
        if (temp) {
            return ["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];
        }
        return ["10", "25", "50", "75", "100", "250", "500", "750", "1000", "∞"];
    },
    getAutoLossData: function () {
        var temp = this.getHasLossLimit();
        if (temp) {
            return ["×10", "×20", "×50", "×100"];
        }
        return ["No Limit", "×10", "×20", "×50", "×100"];
    },
    getAutoWinData: function () {
        var temp = this.getHasLossLimit();
        if (temp) {
            return ["×10", "×20", "×50", "×100"];
        }
        return ["No Limit", "×10", "×20", "×50", "×100"];
    },
    //! 获取当前的币种
    getCurrency: function () {
        if (this.Config && this.Config.currency)
            return this.Config.currency;

        return 'EUR';
    },
    //new 0615*************************
    onPressedSpace: function () {
        var canCtrl = YggLogic.singleton.canCtrl();
        return !canCtrl;
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
    //! 获取当前时间
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
    isShowTime: function () {
        //! 全屏必然显示时间
        if (this.isFullScreen())
            return true;
        return this.shouldShowClock;
    },
    isShowOnlineTime: function () {
        return this.bShowOnlineTime;
    },
    startOnlineTime: function () {
        this.iOnlineTimestamp = (new Date()).getTime();
    },

    clearOnlineTime: function () {
        this.iOnlineTimestamp = 0;
    },
    onMyMoney: function (money) {
        this.onMymoney = money;
    },
    setCurrency: function (currency) {
        //todo
    },
    setIsWaitCommonFreeGame: function (bWait) {
    },
    //未验证
    getRealBalance: function () {
        return this.onMymoney;
    },
    getMinimalSpinningTime: function () {
        return this.minimalSpinningTime;
    },
});


var NativePltLogic = BasePltLogic.extend({
    ctor: function () {
        BasePltLogic.prototype.ctor.call(this);
        this.bRunning = false;
        this.onMymoney = -1;
        this.minimalSpinningTime = 0;
    },
    //*********************
    updateAndNext: function (dt) {
        return true;
    },
    canAutoSpin: function () {
        return true;
    },
    needSaveBetNum: function () {
        return true;
    },
    isShowGambling: function () {
        return false;
    },
    isPrepaid: function () {
        return false;
    },
    getAutoSpinData: function () {
        return ["OFF", "25", "50", "100", "200", "500"]
    },
    getAutoLossData: function () {
        return ["No Limit", "×10", "×20", "×50", "×100"];
    },
    getAutoWinData: function () {
        return ["No Limit", "×10", "×20", "×50", "×100"];
    },
    getHasLossLimit: function () {
        return false;
    },
    isShowHome: function () {
        return true;
    },
    getCurrency: function () {
        return 'EUR';
    },
    nativeDisconnect: function () {
        return true;
    },
    getDefaultCoinValue: function () {
        return 0;
    },
    isNoCofig: function () {
        return false;
    },
    isShowTime: function () {
        return false;
    },
    isShowOnlineTime: function () {
        return false;
    },
    endGameRound: function () {
        this.bRunning = false;
    },
    startGameRound: function () {
        this.bRunning = true;
    },
    isRoundRuning: function () {
        return this.bRunning;
    },
    //! 获取当前小数倍数
    getCurRateValue: function () {
        var rate = GameDataMgr.instance.getCoinValueRate();
        return rate;
    },
    setIsWaitCommonFreeGame: function (bWait) {
    },
    setPrepaid: function (amount) {
    },
    onGameReadyRet: function () {
        if (GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ModuleUI)
            GameMgr.singleton.curGameLayer.ModuleUI._setState('gameReady', 'ready');
    },
    getGameReadyRet: function () {
        this.onGameReadyRet();
    },
    setCurrency: function (currency) {
        //native 直接用EUR
    },
    onMyMoney: function (money) {
        this.onMymoney = money;
    },
    onPressedSpace: function () {
        return false;
    },
    getRealBalance: function () {
        return this.onMymoney;
    },
    getMinimalSpinningTime: function () {
        return this.minimalSpinningTime;
    },
    init: function () {

    },
    onConfig: function (cfg) {
        this.explorer = window.navigator.userAgent.toLowerCase();
        if (cfg&& cfg.scquickstopon != undefined) {
            this.scQuickStopOn =cfg.scquickstopon;
        }

    },
});


var MainClient = WSClient.extend({
    ctor: function () {
        this._super();

        this.spinTimerID = 0;
        this.noSpinTimerID = 0;

        this.guesttoken = undefined;

        this.curBetID = -1;
        this.curSpinID = -1;

        this.curSGame = '';

        this.isapi2 = false;

        this.lstCtrl = [];
        this.lastCtrl = undefined;

        this.funcOnInited = undefined;

        this.isreconnect = false;
    },

    // curstate可能是checkver、dtlogin、comeingame
    // onInited(curstate)
    initEx: function (host, funcOpen, funcError, funcClose, funcOnInited) {
        this.funcOnInited = funcOnInited;
        this.init(host, funcOpen, funcError, funcClose);
    },

    __procCtrlList: function (iscomein) {
        var self = this;
        var curctrl = undefined;

        if (!iscomein) {
            if (self.lastCtrl != undefined) {
                return ;
            }
        }
        else {
            if (self.lastCtrl != undefined) {
                curctrl = self.lastCtrl;
            }
        }

        if (curctrl == undefined && self.lstCtrl.length > 0) {
            curctrl = self.lstCtrl[0];
            self.lstCtrl.shift();
            self.lastCtrl = curctrl;
        }

        if (curctrl != undefined) {
            self.clearSpinTimer();

            self.spinTimerID = setTimeout(function () {
                self.closeWS();
            }, 15 * 1000);

            self.clearNoSpinTimer();

            if(this.lastctrlid != undefined)
                this.lastsendctrlid = this.lastctrlid;

            if (curctrl.hasOwnProperty('msg')) {
                MainClient.singleton.mapCmd[CMDID_GAMECTRL3].sendex(curctrl.msg, curctrl.callback);
            }
            else {
                self.lastCtrl.msg = MainClient.singleton.mapCmd[CMDID_GAMECTRL3].send(curctrl.gameid, curctrl.ctrlname, curctrl.ctrlparam, curctrl.callback);
            }
        }
    },

    onMsgSendComplete : function (msgobj) {
        if(msgobj.cmdid == "gamectrl3") {
            if(this.lastCtrl != undefined) {
                this.lastCtrl.sendstate = 1;
            }
        }
    },

    refreshCtrlID : function () {
        if(this.lastctrlid == undefined)
            return ;

        if (this.lastCtrl != undefined) {
            if (this.lastCtrl.hasOwnProperty('msg')) {
                if(this.lastCtrl.msg.ctrlid != this.lastctrlid) {
                    if(this.lastsendctrlid == undefined || this.lastsendctrlid == this.lastctrlid) {
                        this.lastCtrl.msg.ctrlid = this.curctrlid;
                        this.bChgCtrlID = true;
                    }
                }
            }
        }
    },

    __onCtrlRet: function (isok) {
        if (isok) {
            this.lastCtrl = undefined;

            this.__procCtrlList(false);
        }
        else {
            this.lastCtrl = undefined;

            this.__procCtrlList(false);
        }
    },

    __addGameCtrl: function (gameid, ctrlname, ctrlparam, callback) {
        var curctrl = {gameid: gameid, ctrlname: ctrlname, ctrlparam: ctrlparam, callback: callback, sendstate : 0};
        this.lstCtrl.push(curctrl);

        this.__procCtrlList(false);
    },

    onOpen: function (evt) {
        this._super(evt);
        GameMgr.singleton.clearGameModuleInfo();

        if(typeof(GameAssistant) == 'undefined' || !GameAssistant.singleton.bNative)
            this.onConnect_h5();
        else
            this.onConnect();

        return;
        // if(cc.sys.isNative) return;
        // //! 测试，直接登录
        // MainClient.singleton.autologin(function (isok) {
        //     if(isok) {
        //         var gamecode = 'tgow';
        //         var tableid = 'n1';
        //
        //         var gameid = GameMgr.singleton.getCurGameID();
        //
        //         MainClient.singleton.comeingame(gamecode, tableid, function (isok) {
        //             if (isok) {
        //                 if (GameMgr.singleton.myInfo.curgamecode != '') {
        //                     GameMgr.singleton.onReconnnect();
        //                 }
        //                 else {
        //                     CommonJackpotMgr.singleton.startTimer(30 * 1000);
        //                 }
        //
        //                 GameMgr.singleton.myInfo.curgamecode = gamecode;
        //                 GameMgr.singleton.myInfo.curtableid = tableid;
        //
        //                 if(GameMgr.singleton.curGameLayer == undefined)
        //                     cc.director.runScene(new GameScene());
        //
        //                 //if (GameMgr.singleton.myInfo.isspin) {
        //                 //    MainClient.singleton.spin(
        //                 //        GameMgr.singleton.myInfo.gameid,
        //                 //        GameMgr.singleton.myInfo.bet,
        //                 //        GameMgr.singleton.myInfo.times,
        //                 //        GameMgr.singleton.myInfo.lines,
        //                 //        function (isok) {
        //                 //            if (isok) {
        //                 //                GameMgr.singleton.onSpinResult1();
        //                 //            }
        //                 //        }
        //                 //    );
        //                 //}
        //             }
        //         });
        //     }
        // });

        //if (UserMgr.singleton.my.hasToken()) {
        //    var self = this;
        //    MainClient.singleton.mapCmd[CMDID_TOKENLOGIN].send(UserMgr.singleton.my.token, function (isok) {
        //        if (isok) {
        //            self.onCmdCallback_connected();
        //        }
        //    });
        //}
        //else {
        //    this.onCmdCallback_connected();
        //}
    },

    onError: function (evt) {
        this._super(evt);

        GameMgr.singleton.onDisconnect();
    },

    onKeepalive: function () {
        MainClient.singleton.mapCmd[CMDID_KEEPALIVE].send();
    },

    sendex: function (msgobj, callback, isshowloading) {
        if (isshowloading == undefined) {
            isshowloading = true;
        }

        // if (isshowloading) {
        //     UIMgr.singleton.showWaitUI();
        // }

        var isIngame = false;
        if(GameMgr.singleton.curGameLayer){
            isIngame = true;
        }

        this.send(msgobj, function (isok) {

            // if (isshowloading) {
            //     UIMgr.singleton.hideWaitUI();
            // }

            if (callback != undefined) {
                if (GameMgr.singleton.curGameLayer) {
                    callback(isok);
                } else {
                    if (isIngame == false) {
                        callback(isok);
                    } else {
                        cc.log("在游戏里发消息，收消息时不在游戏里");
                    }
                }
            }
        });
    },

    autologin: function (callback) {
        if (g_isguest) {
            if (g_guestuname == undefined || g_guestuname == '') {
                this.guestlogin(undefined, callback);
            }
            else {
                this.guestlogin(g_guestuname, callback);
            }
        }
        else if (g_isflblogin) {
            this.flblogin(g_flblogintoken, callback);
        }
        else {
            this.plogin(g_pname, g_uname, callback);
        }
    },

    plogin: function (pname, uname, callback) {
        MainClient.singleton.mapCmd[CMDID_PLOGIN].send(pname, uname, callback);
    },

    // clienttype是android、ios、web、wap4种，其中android、ios是客户端native版，wap是手机浏览器，web是pc端浏览器
    dtlogin: function (business, playername, playerpwd, clienttype, callback) {
        MainClient.singleton.mapCmd[CMDID_DTLOGIN].send(business, playername, playerpwd, clienttype, callback);
    },

    login: function (uname, passwd, callback) {
        MainClient.singleton.mapCmd[CMDID_LOGIN].send(uname, passwd, callback);
    },

    // 注销用户，最好在callback里调用 forceClose
    logout: function (callback) {
        MainClient.singleton.mapCmd[CMDID_LOGOUT].send(callback);
    },

    tokenlogin: function (token, callback) {
        MainClient.singleton.mapCmd[CMDID_TOKENLOGIN].send(token, callback);
    },

    reg: function (uname, passwd, keycode, callback) {
        MainClient.singleton.mapCmd[CMDID_REG].send(uname, passwd, keycode, callback);
    },

    flblogin: function (token, callback) {
        MainClient.singleton.mapCmd[CMDID_FLBLOGIN].send(token, callback);
    },

    // 如果进入争霸赛，tableid传cpt
    comeingame: function (gamecode, tableid, callback) {
        // if (GAMETYPE_CURTYPE == GAMETYPE_DBZ || GAMETYPE_CURTYPE == GAMETYPE_SAN1) {
        //     this.isapi2 = true;
        // }
        // else {
        //     this.isapi2 = false;
        // }

        if(GAMEAPI_ISAPI2 != undefined && GAMEAPI_ISAPI2)
            this.isapi2 = true;
        else
            this.isapi2 = false;

        if (gamecode == 'sd' || gamecode == 'sd5' || gamecode == 'kof' || gamecode == 'naruto' || gamecode == 'onepiece') {
            gamecode = 'new' + gamecode;
        }

        if (this.isapi2) {
            this.comeingame3(gamecode, tableid, callback);

            return ;
        }

        if (GameMgr.singleton.myInfo.curgamecode != '') {
            MainClient.singleton.mapCmd[CMDID_COMEINGAMEEX].send(gamecode, tableid, callback);
        }
        else {
            MainClient.singleton.mapCmd[CMDID_COMEINGAME].send(gamecode, tableid, callback);
        }

        //MainClient.singleton.mapCmd[CMDID_COMEINGAME].send(gameid, callback);
    },

    leftgame: function (gamecode, callback) {
        if (gamecode == 'sd' || gamecode == 'sd5' || gamecode == 'kof' || gamecode == 'naruto' || gamecode == 'onepiece') {
            gamecode = 'new' + gamecode;
        }

        if(GAMEAPI_ISAPI2 != undefined && GAMEAPI_ISAPI2)
            this.isapi2 = true;
        else
            this.isapi2 = false;

        if (this.isapi2) {
            MainClient.singleton.mapCmd[CMDID_LEFTGAME2].send(gamecode, callback);
        }
        else {
            MainClient.singleton.mapCmd[CMDID_LEFTGAME].send(gamecode, callback);
        }

        this.isreconnect = false;
        //MainClient.singleton.mapCmd[CMDID_LEFTGAME].send(gameid, callback);
    },

    clearSpinTimer: function () {
        if (this.spinTimerID > 0) {
            clearTimeout(this.spinTimerID);

            this.spinTimerID = 0;
        }
    },

    clearNoSpinTimer: function () {
        if (this.noSpinTimerID > 0) {
            clearTimeout(this.noSpinTimerID);

            this.noSpinTimerID = 0;
        }
    },

    startNoSpinTimer: function () {
        this.clearNoSpinTimer();

        this.noSpinTimerID = setTimeout(function () {
            GameMgr.singleton.onError(1);
        }, 600 * 1000);
    },

    newspin: function (gameid, bet, times, lines, bfree, callback) {
        var cbet = bet;
        var ctimes = times;
        var clines = lines;

        // if(bfree) {
        //     cbet = -1;
        //     ctimes = -1;
        //     clines = -1;
        // }

        var giftfree = false;

        if(GameMgr.singleton.isShowGift() && !bfree) {
            var data = GameMgr.singleton.getCommonFreeGameData();

            if(data != undefined && data.lastnums > 0) {
                giftfree = true;

                if(bet >= 0)
                    GameMgr.singleton.runOneGift();
            }
        }

        if(!bfree)
            GameMgr.singleton.runOne(bet);

        this.spin(gameid, cbet, ctimes, clines, giftfree, callback);
    },

    spin: function (gameid, bet, times, lines, giftfree, callback) {
        var ctimes = times;
        var clines = lines;

        // if(GAMEAPI_CONSTTIMES != undefined && GAMEAPI_CONSTTIMES)
        //     ctimes = -1;
        //
        // if(GAMEAPI_CONSTLINES != undefined && GAMEAPI_CONSTLINES)
        //     clines = -1;

        if (this.isapi2) {
            var param = {bet:bet, times:times, lines:lines};

            // g_spinstate--;
            if (g_spinstate > 0) {
                param.state = g_spinstate;

                if (g_spinstate == 8) {
                    var curinputval = g_inputval;
                    var grouparr = g_inputval.split(';');
                    if (grouparr.length > 1) {
                        curinputval = grouparr[0];
                        g_inputval = '';
                        for (var i = 1; i < grouparr.length; ++i) {
                            g_inputval += grouparr[i];

                            if (i != grouparr.length - 1) {
                                g_inputval += ';';
                            }
                        }
                        reset_inputval(g_inputval);
                    }
                    else {
                        reset_inputval('');
                    }

                    var arr = curinputval.split(',');
                    param.lstrand = [];
                    for (var i = 0; i < arr.length; ++i) {
                        if (arr[i].length > 0) {
                            param.lstrand.push(parseInt(arr[i]));
                        }
                        else {
                            param.lstrand.push(null);
                        }
                    }
                    // param.lstrand = arr;
                }
            }

            if(giftfree) {
                param.giftfree = true;
                param.giftfreeid = GameMgr.singleton.CommonFreeGame.getGiftData().id;
            }
            param.autonums =GamelogicMgr.instance.getUserAutoNums();
            // if (g_spinstate > 0) {
            //     //this.gamectrl3(gameid, 'spin', {bet:bet, times:times, lines:lines, state: g_spinstate}, callback);
            //     param = {bet:bet, times:times, lines:lines, state: g_spinstate};
            // }
            // else {
            //     //this.gamectrl3(gameid, 'spin', {bet:bet, times:times, lines:lines}, callback);
            //     param = {bet:bet, times:times, lines:lines, state: g_spinstate};
            // }

            this.gamectrl3(gameid, 'spin', param, callback);

            //this.gamectrl3(gameid, 'spin', {bet:bet, times:times, lines:lines}, callback);
            //this.spin2(gameid, bet, ctimes, clines, callback);
            return ;
        }

        var self = this;

        self.clearSpinTimer();

        self.spinTimerID = setTimeout(function () {
            self.closeWS();
            //self._ws.close();
        }, 15 * 1000);

        self.clearNoSpinTimer();

        if (g_isflblogin) {
            MainClient.singleton.mapCmd[CMDID_FLBSPIN].send(gameid, bet, ctimes, clines, callback);
        }
        else {
            MainClient.singleton.mapCmd[CMDID_SPIN].send(gameid, bet, ctimes, clines, callback);
        }

        GameMgr.singleton.myInfo.isspin = true;
        GameMgr.singleton.myInfo.bet = bet;
        GameMgr.singleton.myInfo.times = ctimes;
        GameMgr.singleton.myInfo.lines = clines;

        // PlayerMgr.singleton.money = PlayerMgr.singleton.money - bet / 100;
        // UIMgr.singleton.topbar.refreshMoney(false);

        //MainClient.singleton.mapCmd[CMDID_SPIN].send(gameid, callback);
    },

    guestlogin: function (guestuname, callback) {
        MainClient.singleton.mapCmd[CMDID_GUESTLOGIN].send(this.guesttoken, guestuname, callback);
    },

    sgamectrl: function (gameid, sgame, ctrl, param0, callback) {
        MainClient.singleton.mapCmd[CMDID_SGAMECTRL].send(gameid, sgame, ctrl, param0, callback);
    },

    comeingame2: function (gameid, callback) {
        // if (GameMgr.singleton.myInfo.curgamecode != '') {
        //     MainClient.singleton.mapCmd[CMDID_COMEINGAME2].send(gameid, true, callback);
        // }
        // else {
        //     MainClient.singleton.mapCmd[CMDID_COMEINGAME2].send(gameid, false, callback);
        // }

        MainClient.singleton.mapCmd[CMDID_COMEINGAME2].send(gameid, MainClient.singleton.isreconnect, callback);

        //MainClient.singleton.mapCmd[CMDID_COMEINGAME].send(gameid, callback);
    },

    leftgame2: function (gameid, callback) {
        MainClient.singleton.mapCmd[CMDID_LEFTGAME2].send(gameid, callback);
        //MainClient.singleton.mapCmd[CMDID_LEFTGAME].send(gameid, callback);
        this.isreconnect = false;
    },

    spin2: function (gameid, bet, times, lines, callback) {
        var self = this;

        self.clearSpinTimer();

        self.spinTimerID = setTimeout(function () {
            self.closeWS();
            //self._ws.close();
        }, 15 * 1000);

        self.clearNoSpinTimer();

        // if (g_isflblogin) {
        //     MainClient.singleton.mapCmd[CMDID_FLBSPIN].send(gameid, bet, times, lines, callback);
        // }
        // else {
        MainClient.singleton.mapCmd[CMDID_SPIN2].send(gameid, bet, times, lines, callback);
        // }

        GameMgr.singleton.myInfo.isspin = true;
        GameMgr.singleton.myInfo.bet = bet;
        GameMgr.singleton.myInfo.times = times;
        GameMgr.singleton.myInfo.lines = lines;

        // PlayerMgr.singleton.money = PlayerMgr.singleton.money - bet / 100;
        // UIMgr.singleton.topbar.refreshMoney(false);

        //MainClient.singleton.mapCmd[CMDID_SPIN].send(gameid, callback);
    },

    gamectrl2: function (gameid, ctrlname, ctrlparam, callback) {
        if(g_spinstate > 0 && ctrlparam.state == undefined)
            ctrlparam.state = g_spinstate;

        this.gamectrl3(gameid, ctrlname, ctrlparam, callback);
        return ;

        var self = this;

        self.clearSpinTimer();

        self.spinTimerID = setTimeout(function () {
            self.closeWS();
        }, 15 * 1000);

        self.clearNoSpinTimer();

        MainClient.singleton.mapCmd[CMDID_GAMECTRL2].send(gameid, ctrlname, ctrlparam, callback);
    },

    comeingame3: function (gamecode, tableid, callback) {
        // if (GameMgr.singleton.myInfo.curgamecode != '') {
        //     MainClient.singleton.mapCmd[CMDID_COMEINGAME3].send(gamecode, tableid, true, callback);
        // }
        // else {
        //     MainClient.singleton.mapCmd[CMDID_COMEINGAME3].send(gamecode, tableid, false, callback);
        // }

        MainClient.singleton.mapCmd[CMDID_COMEINGAME3].send(gamecode, tableid, MainClient.singleton.isreconnect, callback);
    },

    gamectrl3: function (gameid, ctrlname, ctrlparam, callback) {
        // var self = this;
        //
        // self.clearSpinTimer();
        //
        // self.spinTimerID = setTimeout(function () {
        //     self.closeWS();
        // }, 15 * 1000);
        //
        // self.clearNoSpinTimer();

        //MainClient.singleton.mapCmd[CMDID_GAMECTRL3].send(gameid, ctrlname, ctrlparam, callback);
        this.__addGameCtrl(gameid, ctrlname, ctrlparam, callback);
    },

	reqCommonJackpot: function (callback) {
        MainClient.singleton.mapCmd[CMDID_REQCOMMONJACKPOT].send(callback);
    },

    // 请求大厅游戏列表
    // viewlevel是请求等级，0表示最开始的界面，1表示房间级别，2表示机台级别，3表示我的最爱游戏，4表示我的最爱机台
    // 其中 gamename 可以是 normal、vip、mylover、championship
    // gamecode就是游戏的gamecode
    requestHallGameInfo: function (viewlevel, roomname, gamecode, callback) {
        MainClient.singleton.mapCmd[CMDID_REQHALLGI].send(viewlevel, roomname, gamecode, callback);
    },

    // 操作我的最爱
    // 如果是添加游戏，tableid为vip或normal
    // 如果添加机台，tableid为机台id
    // ctrl为add时，加
    // ctrl为del时，删
    chgMyLover: function (ctrl, gamecode, tableid, callback) {
        MainClient.singleton.mapCmd[CMDID_CHGMYLOVER].send(ctrl, gamecode, tableid, callback);
    },

    // 获取折扣信息
    reqDiscount: function (callback) {
        MainClient.singleton.mapCmd[CMDID_REQDISCOUNT].send(callback);
    },

    // 使用折扣
    // 使用折扣以后，如果成功，自己的钱会变化
    procDiscount: function (discountcode, callback) {
        MainClient.singleton.mapCmd[CMDID_PROCDISCOUNT].send(discountcode, callback);
    },

    // 获得下注记录
    // 会收到MSGID_BETLOG消息
    regBetLog: function (callback) {
        MainClient.singleton.mapCmd[CMDID_REQBETLOG].send(callback);
    },

    // 获得下注记录
    // 会收到MSGID_CREDITLOG消息
    regCreditLog: function (callback) {
        MainClient.singleton.mapCmd[CMDID_REQCREDITLOG].send(callback);
    },

    // 获得排行榜数据
    // ranktype 是 player_bet, player_win, game_bet, game_win, table_bet, table_win
    // timetype 是 day, week, month
    // 会收到MSGID_RANKINGS消息
    regRankings: function (ranktype, timetype, callback) {
        MainClient.singleton.mapCmd[CMDID_REQRANKINGS].send(ranktype, timetype, callback);
    },

    // 修改头像
    // iconid是1-10之间的值
    // MSGID_USERBASEINFO
    chgMyIcon: function (iconid, callback) {
        MainClient.singleton.mapCmd[CMDID_CHGMYICON].send(iconid, callback);
    },

    // 争霸赛报名
    // 报名后，如果成功，自己的钱会变化
    joinChampionship: function (callback) {
        MainClient.singleton.mapCmd[CMDID_JOINCHAMPIONSHIP].send(callback);
    },

    // 验证版本号
    // clienttype 客户端类型，ios、android、html5
    // nativever，native包版本号，1705100，表示17年5月10号第一个版本
    // scriptver，script版本号，1705100，表示17年5月10号第一个版本
    checkVer: function (clienttype, nativever, scriptver, businessid, callback) {
        MainClient.singleton.mapCmd[CMDID_CHECKVER].send(clienttype, nativever, scriptver, businessid, callback);
    },

    // 统一刷新数据接口
    // mainscene是主场景，hall(大厅)、singlegame(单人游戏)、task(任务)、bill(账单)、rank(排行)、activity(活动)、mail(邮件)、
    // cpt(争霸赛)，也可以是任意合法有效的gamecode，如果是未定义页面，传空串 ''
    // childscene是子场景，一般用于非独占界面模块，目前只有 mylove，可以传空串 ''
    sendRefurbish: function (mainscene, childscene, callback) {
        MainClient.singleton.mapCmd[CMDID_REFURBISH].send(mainscene, childscene, callback);
    },

    // 获取比赛结果
    // type 是比赛类型，目前 cpt 可用，表示争霸赛
    reqCompetitionResult: function (type, callback) {
        MainClient.singleton.mapCmd[CMDID_REQCOMPETITIONRESULT].send(type, callback);
    },

    // 获取邮件列表
    reqMail: function (callback) {
        MainClient.singleton.mapCmd[CMDID_REQMAIL].send(callback);
    },

    // 领取邮件奖励
    // rsa、type都从邮件里取
    getMailAward: function (rsa, type, callback) {
        MainClient.singleton.mapCmd[CMDID_GETMAILAWARD].send(rsa, type, callback);
    },

    // 领取多封邮件奖励
    // lst => [{rsa, type}]
    getAllMailAward: function (lst, callback) {
        MainClient.singleton.mapCmd[CMDID_GETALLMAILAWARD].send(lst, callback);
    },

    getFreeCash: function (callback) {
        MainClient.singleton.mapCmd[CMDID_GETFREECASH].send(callback);
    },

    NotUsedGiftFree: function (giftfreeid,callback) {
        MainClient.singleton.mapCmd[CMDID_USEGIFTFREE].send(GameMgr.singleton.getCurGameID(),giftfreeid,callback);
    },

    // 通用的获取服务器数据接口
    // datatype:    gameinfo
    //              commonjackpot
    //              redpoint
    //              notice
    //              gamecodeinfo
    //              businessinfo
    // 登录建议调用顺序如下：gamecodeinfo、businessinfo、gameinfo、redpoint、notice、commonjackpot
    reqServData: function (datatype, callback) {
        MainClient.singleton.mapCmd[CMDID_REQDATA].send(datatype, callback);
    },

    // 连接上以后的处理，这里统一处理
    // 最底层的 checkver、login，甚至重连的 comeingame，都在这里统一处理，这里完成以后，才能走后面的流程
    onConnect: function () {
        var self = this;
        var name = loginusername;//cc.sys.localStorage.getItem("username");
        var password = loginpassword;//cc.sys.localStorage.getItem("password");
        var clienttype = loginclienttype;//cc.sys.localStorage.getItem("clienttype");

        MainClient.singleton.checkVer(clienttype,nativever,scriptver,business,function (isok_checkver) {
            if(isok_checkver) {
                // if (GameMgr.singleton.myInfo.uid <= 0) {
                //     if (self.funcOnInited != undefined) {
                //         self.funcOnInited('checkver');
                //     }
                //
                //     return ;
                // }
                if(DTTOKEN){
                    //MainClient.singleton.flblogin(DTTOKEN, login_back());
                    MainClient.singleton.flblogin(DTTOKEN, function (isok_flblogin) {
                        if (isok_flblogin) {
                            cc.log("断线重连后登录成功");
                            //isonloginlayer = null;
                            // GameMgr.singleton.onReconnnect();

                            if (GameMgr.singleton.curGameLayer) {

                                MainClient.singleton.comeingame(CurGameCode, CurGameTable, function (comein_isok) {
                                    if (comein_isok) {
                                        if (self.funcOnInited != undefined) {
                                            self.funcOnInited('comeingame');
                                        }
                                    } else {
                                        cc.log("游戏里断线重连进入游戏失败");
                                    }
                                });

                                return ;
                            }
                            else {
                                if (self.funcOnInited != undefined) {
                                    self.funcOnInited('flblogin');
                                }

                                cc.log("在大厅断线重连");
                                if (GameMgr.singleton.halllayer) {
                                    GameMgr.singleton.halllayer.checkingamesview();
                                }else {
                                    login_back();
                                }
                            }
                        }
                        else {
                            isBrokenLineReconnection = false;
                        }
                    });
                }else {
                    MainClient.singleton.dtlogin(business, name, password, clienttype, function (isok_dtlogin) {
                        if (isok_dtlogin) {
                            cc.log("断线重连后登录成功");
                            //isonloginlayer = null;
                            // GameMgr.singleton.onReconnnect();

                            if (GameMgr.singleton.curGameLayer) {

                                MainClient.singleton.comeingame(CurGameCode, CurGameTable, function (comein_isok) {
                                    if (comein_isok) {
                                        if (self.funcOnInited != undefined) {
                                            self.funcOnInited('comeingame');
                                        }
                                    } else {
                                        cc.log("游戏里断线重连进入游戏失败");
                                    }
                                });

                                return ;
                            }
                            else {
                                if (self.funcOnInited != undefined) {
                                    self.funcOnInited('dtlogin');
                                }

                                cc.log("在大厅断线重连");
                                if (GameMgr.singleton.halllayer) {
                                    GameMgr.singleton.halllayer.checkingamesview();
                                }
                            }
                        }
                        else {
                            isBrokenLineReconnection = false;
                        }
                    });
                }

            }
            else {
                if (self.funcOnInited != undefined) {
                    self.funcOnInited('checkver');
                }
                //this.setEditboxVisble(false);
                //cc.game.restart();
            }
        });
    },

    onConnect_h5 : function() {
        //! 测试，直接登录
        MainClient.singleton.autologin(function (isok) {
            if(isok) {
                var gameid = GameMgr.singleton.getCurGameID();
                var gamecode = GameMgr.singleton.getCurGameCode();

                MainClient.singleton.comeingame(gamecode, '', function (isok) {
                    if (isok) {
                        if (GameMgr.singleton.myInfo.gameid > 0) {
                            //GameMgr.singleton.onReconnnect();
                            MainClient.singleton.onReconnnect();
                        }
                        else {
                            CommonJackpotMgr.singleton.startTimer(30 * 1000);
                        }

                        GameMgr.singleton.myInfo.gameid = gameid;

                        if(GameMgr.singleton.curGameLayer == undefined)
                            cc.director.runScene(new GameScene());

                        //if (GameMgr.singleton.myInfo.isspin) {
                        //    MainClient.singleton.spin(
                        //        GameMgr.singleton.myInfo.gameid,
                        //        GameMgr.singleton.myInfo.bet,
                        //        GameMgr.singleton.myInfo.times,
                        //        GameMgr.singleton.myInfo.lines,
                        //        function (isok) {
                        //            if (isok) {
                        //                GameMgr.singleton.onSpinResult1();
                        //            }
                        //        }
                        //    );
                        //}
                    }
                });
            }
        });
    },

    onReconnnect : function () {
        if(this.bChgCtrlID) {
            this.bChgCtrlID = false;
            var self = this;

            this.delayCtrlTimerID = setTimeout(function () {
                if(self.delayCtrlTimerID > 0) {
                    clearTimeout(self.delayCtrlTimerID);
                    self.delayCtrlTimerID = 0;
                }

                GameMgr.singleton.onReconnnect();
            }, 3 * 1000);
        }
        else
            GameMgr.singleton.onReconnnect();
    },
});

MainClient.singleton = new MainClient();

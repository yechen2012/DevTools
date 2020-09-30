/**
 * Created by ssscomic on 2017/11/16.
 */
//wjh 测试
var GameModuleUI1 = cc.Class.extend({
    ctor: function (canvasmgr) {
        this._CanvasMgr = canvasmgr;
        //! 对各类gmc控件的初始化进行统一，方便后续初始化形式的调整
        //! 将各类gmc控件统一放在一个数组内，其中没有对象包含的内容包括：
        //! 通用项：
        //!     type（必填）: gmc控件的类型，包括'action' 'armature' 'button' 'node' 'resource' 'singlenode' 'sliderex' 'textbmfontex' 'textex' 'virtual'等
        //!     name（必填）: gmc控件在管理者中的名字，此项必须唯一，如果需要将同一名字指向别的控件，则需要先remove掉之前初始化的控件
        //!     resname（选填）: gmc控件对应的cocos控件（或者cocos资源），可以是string或者string数组，如果没有，则用name替代
        //!     defaulthide（选填）:默认不显示的控件（所有控件都可以设置部分控件可能没有效果）
        //!     defaultdisable（选填）:默认禁用的控件（所有控件都可以设置部分控件可能没有效果）
        //!     callfunc（选填）:一般
        //! 独特项：每种控件有自己独特的数据

        this.lstctrldata = [
            //! node
            {type: 'node', name: 'layAutoSelect', callfunc: this._onTouchAutoSelect, target: this, defaulthide: true},
            {type: 'node', name: 'layDisable', callfunc: this._onTouchDisable, target: this, defaulthide: true},
            {type: 'node', name: 'nodeTotalWin'},
            //! singlenode
            {type: 'singlenode', name: 'nodeWinAni'},
            //! resource
            {
                type: 'resource',
                name: 'resTotalWin',
                parent: 'nodeTotalWin',
                res: [res.NewTlodUINode_TotalWin1_json, res.NewTlodUINode_TotalWin2_json, res.NewTlodUINode_TotalWin2_json]
            },
            {type: 'resource', name: 'resWinAni', parent: 'nodeWinAni', res: res.NewTlodWinAni_json},
            //! textex
            {
                type: 'textex',
                name: 'textBet',
                str: 'BET',
                bmulline: true,
                scaletype: 0,
                horalignment: cc.TEXT_ALIGNMENT_CENTER,
                veralignment: cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM,
                fontname: 'SourceHanSansCN-Regular',
                fontsize: 26,
                textcolor: cc.color(161, 198, 243)
            },
            {type: 'textex', name: 'textCoinValue', str: 'COIN VALUE', fontname: 'SourceHanSansCN-Regular'},
            {type: 'textex', name: 'textTotalBet', str: 'TOTAL BET', fontname: 'SourceHanSansCN-Regular'},
            {type: 'textex', name: 'textWin', str: 'WIN', fontname: 'SourceHanSansCN-Regular'},
            {type: 'textex', name: 'textBalance', str: 'BALANCE', fontname: 'SourceHanSansCN-Regular'},
            {type: 'textex', name: 'textAutoStop', str: 'STOP', fontname: 'SourceHanSansCN-Regular'},
            {type: 'textex', name: 'textTotalWin', str: 'TOTAL WIN', fontname: 'SourceHanSansCN-Regular'},
            //! textbmfontex
            {type: 'textbmfontex', name: 'numBet', str: '0'},
            {type: 'textbmfontex', name: 'numCoinValue', str: '0'},
            {type: 'textbmfontex', name: 'numTotalBet', str: '0'},
            {type: 'textbmfontex', name: 'numWin', str: '0', defaulthide: true},
            {type: 'textbmfontex', name: 'numBalance', str: '0'},
            {type: 'textbmfontex', name: 'numAuto', str: '0'},
            {type: 'textbmfontex', name: 'numTotalWin', str: '0'},
            {type: 'textbmfontex', name: 'numWinAni', str: '0', scaletype: -1},
            {type: 'textbmfontex', name: 'textFreeNum', str: '0', scaletype: -1},
            //! button
            {type: 'button', name: 'btnCoinValueDec', btnname: 'btnCoinValueDec', areaname: 'areaCoinValueDec'},
            {type: 'button', name: 'btnCoinValueAdd', btnname: 'btnCoinValueAdd', areaname: 'areaCoinValueAdd'},
            {
                type: 'button',
                name: 'areaCoinCash1',
                areaname: 'areaCoinCash1',
                callfunc: this._onTouchCoinCash,
                target: this
            },
            {
                type: 'button',
                name: 'areaCoinCash2',
                areaname: 'areaCoinCash2',
                callfunc: this._onTouchCoinCash,
                target: this
            },
            {
                type: 'button',
                name: 'btnMaxBet',
                btnname: 'btnMaxBet',
                areaname: 'areaMaxBet',
                callfunc: this._onTouchMaxBet,
                target: this,
                lstbtnname: ['btnMaxBetBack']
            },
            {
                type: 'button',
                name: 'btnRun',
                btnname: 'btnRun',
                areaname: 'areaRun',
                callfunc: this._onTouchRun,
                target: this,
                lstbtnname: ['btnRunBack']
            },
            {
                type: 'button',
                name: 'btnBet',
                btnname: 'btnBet',
                areaname: 'areaBet',
                callfunc: this._onTouchBet,
                target: this,
                lstbtnname: ['btnBetBack']
            },
            {
                type: 'button',
                name: 'btnAuto',
                btnname: 'btnAuto',
                areaname: 'areaAuto',
                callfunc: this._onTouchAuto,
                target: this,
                lstbtnname: ['btnAutoBack']
            },
            {
                type: 'button',
                name: 'btnAutoStop',
                btnname: 'btnAutoStop',
                areaname: 'areaAutoStop',
                callfunc: this._onTouchAutoStop,
                target: this,
                lstbtnname: ['btnAutoStopBack']
            },
            {type: 'button', name: 'btnAuto25', btnname: 'btnAuto25', callfunc: this._onTouchAuto25, target: this},
            {type: 'button', name: 'btnAuto50', btnname: 'btnAuto50', callfunc: this._onTouchAuto50, target: this},
            {type: 'button', name: 'btnAuto100', btnname: 'btnAuto100', callfunc: this._onTouchAuto100, target: this},
            {type: 'button', name: 'btnAuto200', btnname: 'btnAuto200', callfunc: this._onTouchAuto200, target: this},
            {type: 'button', name: 'btnAuto500', btnname: 'btnAuto500', callfunc: this._onTouchAuto500, target: this},
            {type: 'button', name: 'btnMenu', btnname: 'btnMenu', callfunc: this._onTouchMenu, target: this},
            //! sliderex
            {
                type: 'sliderex',
                name: 'slidCoinValue',
                btndec: 'btnCoinValueDec',
                btnadd: 'btnCoinValueAdd',
                lstpertext: [],
                lstsvaluetext: ['numCoinValue'],
                lstsindextext: [],
                callfunc: this._onChgCoinValue,
                target: this
            },
            //! armature（在resource中）
            {type: 'armature', name: 'aniBigWin'},
            {type: 'armature', name: 'aniSuperWin'},
            {type: 'armature', name: 'aniMegaWin'},
            //! action
            {type: 'action', name: 'actBigWin', res: 'aniBigWin'},
            {type: 'action', name: 'actSuperWin', res: 'aniSuperWin'},
            {type: 'action', name: 'actMegaWin', res: 'aniMegaWin'},
            //! virtual
            {type: 'virtual', name: 'virWin', defaulthide: true},
            {type: 'virtual', name: 'virRun', defaulthide: true},
        ];


        //! 胜利动画相关的数据
        this.windata = {
            rootname: 'nodeWinAni',
            resname: 'resWinAni'
        };

        //!数字滚动时间
        this.timedata = {
            numwinspeed: 0.2,
            numbalancespeed: 0.2,
        };
        //win动画滚动配置
        this.winaniscrolldata = {
            speed: 20,
            delay: 0,
            addspeed: 20,
            callfunc: this._onChgWinNum,
            percallfunc: this._winAnichangStep,
            target: this,
            lstkeynum: [600, 1200, 2400],
            // beforechgkey: true, // 是否提前切换最后一个奖的展示
            syn: ['numWin']
        }
        //totalwin滚动配置
        this.totalwinscrolldata = {time: 0.2, callfunc: this._onChgWinNum, target: this};
        //! 状态数据：数组 show显示 hide隐藏 enable可用 disable禁用
        //! ani动画（name控件名 ani动画名 bloop是否循环（或者data数据）） oain其他动画（仅改变效果，不影响判断的动画，参数和ani一致）
        //! next后续状态（特定时间或者动画全部播放完之后切换） time状态持续时间 lock如果为true则必须播放完才能被替换
        //! opacity透明度（name控件名 value数值） color颜色（name控件名 value颜色值cc.color）

        //! 自动相关 0没有进入自动 1自动中
        this.autostatedata = {
            0: {
                show: ['btnAuto', 'btnBet'],
                hide: ['btnAutoStop', 'numAuto'],
                enable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet']
            },
            1: {
                show: ['btnAutoStop', 'numAuto'],
                hide: ['btnAuto', 'btnBet'],
                disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet']
            },
        };

        //! 游戏运行相关 0没有运行 1运行中
        this.runstatedata = {
            0: {enable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto']},
            1: {disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto']},
        };

        //! 游戏运行虚拟节点相关 0没有运行 1运行中
        this.virrunstatedata = {
            0: {hide: ['virRun'], enable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto']},
            1: {show: ['virRun'], disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto']},
        };

        //! 胜利动画相关 0没有显示 1开始显示 2普通结束 3开始Big 4循环Big 5结束Big 6开始Super 7循环Super 8结束Super 9开始Mega 10循环Mega 11结束Mega
        this.winanistatedata = {
            0: {hide: ['nodeWinAni', 'layDisable', 'virWin']},
            1: {
                show: ['nodeWinAni', 'layDisable', 'numWin', 'virWin'],
                hide: ['aniBigWin', 'aniSuperWin', 'aniMegaWin'],
                ani: [{name: 'resWinAni', ani: 'begin', bloop: false}],
                opacity: [{name: 'aniBigWin', value: 255}, {name: 'aniSuperWin', value: 255}, {
                    name: 'aniMegaWin',
                    value: 255
                },]
            },
            2: {hide: ['virWin'], ani: [{name: 'resWinAni', ani: 'end', bloop: false}], next: 0},
            3: {
                show: ['aniBigWin'],
                hide: ['aniSuperWin', 'aniMegaWin'],
                ani: [{name: 'aniBigWin', ani: 'bigwin1', bloop: false}],
                next: 4,
                lock: true
            },
            4: {
                show: ['aniBigWin'],
                hide: ['aniSuperWin', 'aniMegaWin'],
                ani: [{name: 'aniBigWin', ani: 'bigwin2', bloop: true}],
                lock: true
            },
            5: {
                show: ['aniBigWin'],
                hide: ['aniSuperWin', 'aniMegaWin', 'virWin'],
                ani: [{name: 'resWinAni', ani: 'end', bloop: false}, {name: 'aniBigWin', ani: 'bigwin3', bloop: false}],
                next: 0
            },
            6: {
                show: ['aniSuperWin', 'aniBigWin'],
                hide: ['aniMegaWin'],
                ani: [{name: 'aniSuperWin', ani: 'superwin1', bloop: false}, {
                    name: 'actBigWin',
                    ani: 'fade',
                    data: {bopa: 255, eopa: 0, time: 0.5}
                }],
                next: 7,
                lock: true
            },
            7: {
                show: ['aniSuperWin'],
                hide: ['aniBigWin', 'aniMegaWin'],
                ani: [{name: 'aniSuperWin', ani: 'superwin2', bloop: true}],
                lock: true
            },
            8: {
                show: ['aniSuperWin'],
                hide: ['aniBigWin', 'aniMegaWin', 'virWin'],
                ani: [{name: 'resWinAni', ani: 'end', bloop: false}, {
                    name: 'aniSuperWin',
                    ani: 'superwin3',
                    bloop: false
                }],
                next: 0
            },
            9: {
                show: ['aniMegaWin', 'aniSuperWin'],
                hide: ['aniBigWin'],
                ani: [{name: 'aniMegaWin', ani: 'megawin1', bloop: false}, {
                    name: 'actSuperWin',
                    ani: 'fade',
                    data: {bopa: 255, eopa: 0, time: 0.5}
                }],
                next: 10,
                lock: true
            },
            10: {
                show: ['aniMegaWin'],
                hide: ['aniBigWin', 'aniSuperWin'],
                ani: [{name: 'aniMegaWin', ani: 'megawin2', bloop: true}],
                lock: true
            },
            11: {
                show: ['aniMegaWin'],
                hide: ['aniBigWin', 'aniSuperWin', 'virWin'],
                ani: [{name: 'resWinAni', ani: 'end', bloop: false}, {
                    name: 'aniMegaWin',
                    ani: 'megawin3',
                    bloop: false
                }],
                next: 0
            },
        };

        //! TotalWin相关 0没有显示 1进入 2显示 3离开
        this.totalwinstatedata = {
            hide: {
                hide: ['layDisable'],
                enable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto'],
                ani: [{name: 'resTotalWin', ani: 'a0', bloop: false}]
            },
            begin: {
                show: ['layDisable'],
                disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto'],
                ani: [{name: 'resTotalWin', ani: 'a1', bloop: false}],
                next: 'show'
            },
            show: {
                show: ['layDisable'],
                disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto'],
                ani: [{name: 'resTotalWin', ani: 'a2', bloop: false}]
            },
            end: {
                show: ['layDisable'],
                disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto'],
                ani: [{name: 'resTotalWin', ani: 'a3', bloop: false}],
                next: 'hide'
            },
        };

        //!按钮音效相关
        this.lstBtnMusic = [{btnname : 'btnRun', resurl:undefined, bloop:false}];

        //! 控件状态（多因素影响同一个控件时协调控件状态）
        this._CtrlState = {};

        //! 回调函数
        this._CallFunc = {};

        //! 状态（通过整体状态控制一组控件的状态变化）
        this._State = {};
        //! 活跃状态（在一段时间后会改变的状态）
        this._lstActiveState = [];

        this.lstWaitAutoTime = {win: 0.5, enwin: 0.3,freeauto:0.3};
        this.iSaveCoinValue = -1;             //! 记录的筹码值（解决因为下注列表变化可能找不到对应值的问题）
        this.WaitAutoTime = 0;              //! 自动等待时间
        this.WaitFreeTime = 0;              //! 开始免费等待时间
        this._iAutoFinityScale = 2;         //!自动无限次文本缩放值
        this.WaitEndTime = 1;               //! 等待结束时间
    },

    initModule: function () {
        //!! 初始化控件
        this._init();
        //! 初始化状态
        this._addState('auto', this.autostatedata, 0);
        this._addState('run', this.runstatedata, 0);
        this._addState('winani', this.winanistatedata, 0, this._onChgWinAniState, this);
        this._addState('totalwin', this.totalwinstatedata, 'hide');
        this._addState('virRun', this.virrunstatedata, 0);
        this._refeshDisplay();
    },
    _init: function () {
        this._CanvasMgr.initCtrlList(this.lstctrldata);
        this._init_Win();
        this._initShowCoins();
    },

    _init_Win: function () {
        if (!this.windata)
            return;

        var root = this.getCtrl(this.windata.rootname);

        if (!root)
            return;

        this.WinAni = this.getCtrl(this.windata.resname);

        if (!this.WinAni)
            return;
        this.lstWinData = [];
        this.iWinState = -1;        //! 胜利动画的状态 -1没显示 0显示胜利动画 1金额进入TotalWin 2金额回到Win(暂定) 3金额进入Balance（暂定）
    },

    //!设置是否是免费，处理免费游戏的逻辑, bjuststart是否为游戏初始化（处理断线重连）
    setFreeGame: function (bfreegame, bjuststart, totalwin, ifreenums, freedelay) {
        var bfree = GameDataMgr.instance.getNumberValue('_bFreeGame');
        if (bfree == bfreegame)
            return;

        GameDataMgr.instance.setNumberValue('_bFreeGame', bfreegame);
        GameDataMgr.instance.setNumberValue('_bJustStart', bjuststart);
        if (!bfreegame) {
            var curTotalWin = totalwin;
            if (this.CurWinData != undefined && this.CurWinData.totalwin != undefined) {
                curTotalWin = this.CurWinData.totalwin;
            }
            if(!GamelogicMgr.instance.isPrepaid())
                GameDataMgr.instance.addScrollAniBy('numBalance', curTotalWin, {time: this.timedata.numbalancespeed});

            GamelogicMgr.instance.callRegistered("sendSpinEnd");

            var iautowin =  GameDataMgr.instance.getNumberValue('_iAutoWin');
            iautowin += curTotalWin;
            GameDataMgr.instance.setNumberValue('_iAutoWin', iautowin);
        } else {
            if(!GamelogicMgr.instance.isPrepaid()){
                if (bjuststart && totalwin) {
                    GameDataMgr.instance.addScrollAniBy('numBalance', -totalwin, {time: this.timedata.numbalancespeed})
                }
            }

            GameDataMgr.instance.setIFreeNum(ifreenums);

            this.WaitFreeTime = (freedelay == undefined || null ? this.WaitFreeTime : freedelay);
        }

        GameDataMgr.instance.setIWin(0);
    },

    //! 设置免费累计金额
    setFreeTotalWin: function (freeTotalWin, bjust) {
        if (bjust) {
            GameDataMgr.instance.setIFreeTotalWin(freeTotalWin);
        }
        this._refreshDisplay_CoinValue(true, bjust);
    },

    //!设置是否显示金币符号
    setShowCoins: function (bshowcoins) {
        GameDataMgr.instance.setNumberValue('_bShowCoins', bshowcoins);
        if (!bshowcoins) {
            GameDataMgr.instance.setNumberValue('_bShowCash', true);
            this._refeshDisplay();
        }
    },

    //! 设置胜利数据
    setWinData: function (iconvalue, turnnums, turnwin, realwin, balance, totalwin, wonamount) {
        if (!this.lstWinData)
            return;

        var data = {};

        data.iconvalue = iconvalue;
        data.turnnums = turnnums;
        data.turnwin = turnwin;
        data.realwin = realwin;
        data.balance = balance;
        data.totalwin = totalwin;
        data.wonamount = wonamount;

        //this.lstWinData.push(data);
        this.CurWinData = data;
    },

    //! 显示胜利动画
    showWin: function () {
        cc.log("GameModuleUI:showWin");

        if (!this.isVisible('virWin')) {
            this.iWinState = 0;
            //this.CurWinData = this.lstWinData[0];
            //this.lstWinData.splice(0, 1);

            GameDataMgr.instance.setAniWin(0);
            GameDataMgr.instance.setIWin(0);
            //numWinAni滚动节奏问题，用代币处理,原speed及addspeed.这里处理了数字单位
            var wincoin =this.CurWinData.realwin / this.CurWinData.iconvalue;
            if (wincoin > 0) {
                GameDataMgr.instance.addScrollAni('numWinAni', wincoin, this.winaniscrolldata);
            }

            if(GamelogicMgr.instance.isYggPlatform()){
                var iwin = this.CurWinData.realwin;
                if(this.CurWinData.wonamount && this.CurWinData.wonamount > 0){
                    var freeall = GameDataMgr.instance.getNumberValue('_iFreeTotalWin');
                    var iwonamount = this.CurWinData.wonamount - freeall;
                    iwin = Math.min(iwonamount, iwin);
                }

                iwin /= this.CurWinData.iconvalue;
                if (iwin > 0) {
                    var data = {};
                    data.speed = this.winaniscrolldata.speed;
                    data.delay = this.winaniscrolldata.delay;
                    data.addspeed = this.winaniscrolldata.addspeed;
                    data.lstkeynum = this.winaniscrolldata.lstkeynum;

                    GameDataMgr.instance.addScrollAni('numWin', iwin, data);
                }
            }

            if (this._getCurState('totalwin') == 'hide' && this._CanvasMgr.getResource('resTotalWin')) {
                GameDataMgr.instance.setITotalWin(0);
                this._setState('totalwin', 'begin');
            }

            this._setState('winani', 1);
            this._setState('actNumWin', 0);
            var bfree = GameDataMgr.instance.getNumberValue('_bFreeGame');
            var iAutoNum = GameDataMgr.instance.getNumberValue('_iAutoNum');
            if (!bfree && iAutoNum > 0) {
                this.WaitAutoTime = this.lstWaitAutoTime.win;
            }
        }
    },

    //! 是否正在显示胜利动画
    isShowWin: function () {
        return this.iWinState >= 0;
    },

    //!初始化是否显示金币符号
    _initShowCoins: function () {
        if (!GamelogicMgr.instance.existFunction("isSupportChgCoinType"))
            return;

        var bshowcoins = GamelogicMgr.instance.isSupportChgCoinType();

        GameDataMgr.instance.setNumberValue('_bShowCoins', bshowcoins);
        if (!bshowcoins) {
            GameDataMgr.instance.setNumberValue('_bShowCash', true);
            this._refeshDisplay();
        }
    },

    _setWinState: function (state) {

        this.iWinState = state;

        switch (state) {
            case 0: {
                //! 开始显示胜利动画
                this._setState('winani', 1);

                if (this._getCurState('totalwin') == 'hide')
                    this._setState('totalwin', 'begin');
            }
        }
    },
    _winAnichangStep:function(){
        if (this.windata.lstEffect.addurl){
            cc.audioEngine.playEffect(this.windata.lstEffect.addurl, false);
        }
    },
    //!胜利动画阶段改变时调用，iWinState变化
    _onChgWinNum: function (checkedindex, bend) {
        var keyindex = checkedindex;

        if (this.iWinState == 0) {
            if (!this.isVisible('virWin'))
                return;

            if(!bend){
                switch (keyindex) {
                    case 1:
                        this._setState('winani', 3);
                        break;
                    case 2:
                        this._setState('winani', 6);
                        break;
                    case 3:
                        this._setState('winani', 9);
                        break;
                }
            }
            else {
                switch (keyindex) {
                    case 0:
                        this._setState('winani', 2);
                        break;
                    case 1:
                        this._setState('winani', 5);
                        break;
                    case 2:
                        this._setState('winani', 8);
                        break;
                    case 3:
                        this._setState('winani', 11);
                        break;
                    default:
                        this._setState('winani', 0);
                        break;
                }
                if (this.windata.lstEffect.endurl){
                    cc.audioEngine.playEffect(this.windata.lstEffect.endurl,false);
                }
            }
        } else if (this.iWinState == 1) {
            if (bend) {
                this.iWinState = -1;
            }
        } else if (this.iWinState == 2) {
            var itotalwin = GameDataMgr.instance.getNumberValue('_iTotalWin');
            var coinvalue = GameDataMgr.instance.getCoinValue();
            var wincoin = Math.floor(itotalwin / coinvalue);
            GameDataMgr.instance.setIWin(wincoin);
            GameDataMgr.instance.setITotalWin(0);
            this._setState('totalwin', 'end');
            this._setState('actNumWin', 0);
            this._setState('allmoneyani', 1);

            GamelogicMgr.instance.callRegistered('onWinAniDone',this.CurWinData.turnwin);
            var tempfunc = function (dt) {
                this.iWinState = -1;
                this._setState('run', 0);
            };
            GameDataMgr.instance.insertTickCallback('runiiWinState2', 0.5, 0, this, tempfunc);
        } else if (this.iWinState == 3) {
            GameDataMgr.instance.setIWin(0);
            if (bend) {
                this.iWinState = -1;
                this._setState('run', 0);
            }
        }
    },

    //！胜利动画变状态时调用
    _onChgWinAniState: function (cstate, ostate) {
        //! 胜利动画结束
        if (cstate == 0) {
            if (this.iWinState == 0) {
                this.iWinState = 1;
                //numWin不能通过numTotalWin反向处理，两个数字单位不同,numWin与win动画单位一致
                var runtime = this.totalwinscrolldata.time;
                GameDataMgr.instance.addScrollAni('numWin', 0, {time: runtime});
                GameDataMgr.instance.addScrollAniBy('numTotalWin', this.CurWinData.realwin, this.totalwinscrolldata);
                var bfreegame = GameDataMgr.instance.getNumberValue('_bFreeGame');
                if (bfreegame) {
                    var itotalwin = this.CurWinData.totalwin;
                    if(GamelogicMgr.instance.isYggPlatform() && this.CurWinData.wonamount && this.CurWinData.wonamount > 0){
                        itotalwin = Math.min(itotalwin, this.CurWinData.wonamount);
                    }
                    GameDataMgr.instance.addScrollAni('textFreeTotalWin', itotalwin, {time: this.timedata.numwinspeed});
                } else {
                    var iautowin = this.CurWinData.turnwin;
                    GameDataMgr.instance.setNumberValue('_iAutoWin', iautowin);
                    this._setState('actNumWin', 1);
                    this._showAllMoneyAni(iautowin);
                }
            }

        }
    },
    update: function (dt) {
        var bfree = GameDataMgr.instance.getNumberValue('_bFreeGame');
        //!自动逻辑
        if (this._getCurState('auto') == 1 && !bfree) {
            if (this._getCurState('run') <= 0 && this._getCurState('virRun') <= 0) {
                if (this.WaitAutoTime <= 0) {
                    GameDataMgr.instance.reduceIAutoNum();
                    var iautoNum = GameDataMgr.instance.getNumberValue('_iAutoNum');
                    var iAutoTotalWin = GameDataMgr.instance.getIAutoTotalWin();
                    var iAutoWin = GameDataMgr.instance.getNumberValue('_iAutoWin');

                    var automax = GameDataMgr.instance.getNumberValue('_AutoMaxNum');
                    var automin = GameDataMgr.instance.getNumberValue('_AutoMinNum');

                    var beshowcash = GameDataMgr.instance.getNumberValue('_bShowCash');

                    if (automax > 0 && iAutoWin >= automax) {
                        var number = GameDataMgr.instance._getCoinOrCashNumber(iAutoWin, true, beshowcash);
                        var cfg = {};
                        cfg.bcash = beshowcash;
                        var info = GameDataMgr.instance._formatByConfig(number, cfg);
                        this._callFunc('disconnect', 5, 1, info);

                        GameDataMgr.instance.setIAutoNum(0);
                        this._setState('auto', 0);
                        GamelogicMgr.instance.setUserAutoNums(-1);
                    } else if (automin > 0 && iAutoTotalWin >= automin) {
                        var number = GameDataMgr.instance._getCoinOrCashNumber(iAutoTotalWin, true, beshowcash);
                        var cfg = {};
                        cfg.bcash = beshowcash;
                        var info = GameDataMgr.instance._formatByConfig(number, cfg);
                        this._callFunc('disconnect', 5, 2, info);

                        GameDataMgr.instance.setIAutoNum(0);
                        this._setState('auto', 0);
                        GamelogicMgr.instance.setUserAutoNums(-1);
                    } else if (iautoNum < 0) {
                        GameDataMgr.instance.setIAutoNum(0);
                        this._setState('auto', 0);
                        GamelogicMgr.instance.setUserAutoNums(-1);
                    } else {
                        var isInfinity=GameDataMgr.instance.getIAutoFinity();
                        if(!isInfinity){
                            GameDataMgr.instance.refreshText('numAuto');
                        }
                        this._callFunc('spin');
                        this.playBtnSound("btnRun");

                        this.WaitAutoTime = this.lstWaitAutoTime.enwin;
                    }
                } else {
                    this.WaitAutoTime -= dt;
                }
            }
        }

        //!免费逻辑
        if (this._getCurState('free') == 1) {
            var runstate = this._getCurState("run");
            var virFreeState = this._getCurState("virFree");
            cc.log("runState = ", runstate, "virFreeState = ", virFreeState);
            if (this._getCurState('run') <= 0 && this._getCurState('virFree') <= 0 ) {
                if (this.WaitFreeTime <= 0) {
                    GameDataMgr.instance.reduceIFreeNum();
                    var ifreeNum = GameDataMgr.instance.getNumberValue('_iFreeNum');

                    cc.log("GameModuleUI update , freeNum = ", ifreeNum);


                    if (ifreeNum < 0) {
                        GameDataMgr.instance.setIFreeNum(0);
                        this._setState('free', 0);
                        this._callFunc('openfreeresult');
                    } else {
                        GameDataMgr.instance.setIFreeNum(ifreeNum);
                        this._callFunc('spin');
                        this.WaitFreeTime =this.lstWaitAutoTime.freeauto;
                    }
                } else {
                    this.WaitFreeTime -= dt;
                }
            }
        }

        //!余额动画
        if(this._textAllMoneyAni != undefined && this._textAllMoneyAni._bShowAni){
            this._textAllMoneyAni.update(dt);
        }
    },

    //!显示余额数字动画
    _showAllMoneyAni: function (value) {
        if(!this._textAllMoneyAni || !this._textAllMoneyAni._bShowAni){
            return;
        }

        var curCanvasIndex = this._CanvasMgr.getCurCanvasIndex();
        this._textAllMoneyAni.setValue(value, curCanvasIndex);
        if(this._textAllMoneyAni.isPauseGame())
            this._setState('run', 1);

        GamelogicMgr.instance.callRegistered("sendSpinEnd");
    },

    //!余额数字动画结束回调
    _callAllMoneyAniEnd: function (self) {
        //self._setState('virRun', 0);
        //self._setState('virFree', 0);
        self._setState('run', 0);
    },

    //! 设置下注倍数
    //兼容之前逻辑,三版本中setBet，setLines需同步，
    setBet: function (bet) {
        GameDataMgr.instance.setNumberValue('_iBet', bet);
        GameDataMgr.instance.setNumberValue('_iLines',bet);
        this._refeshDisplay();
    },

    getBet: function () {
        var ibet = GameDataMgr.instance.getNumberValue('_iBet');
        return ibet;
    },

    //! 设置线数
    //三版本中，_iBet取代了_iLines,_iLines目前并没有实际逻辑
    //保留为了兼容之前逻辑写法，_iLines应该与ibet保持一致
    setLines: function (lines) {
        GameDataMgr.instance.setNumberValue('_iLines',lines);
    },

    getLines: function () {
        var iline = GameDataMgr.instance.getNumberValue('_iLines');
        return iline;
    },

    //! 设置用户结余
    setBalance: function (balance) {
        cc.log("GameModuleUI: setBalance = ", balance);

        if(this.canSetBalance(balance))
            GameDataMgr.instance.addScrollAni('numBalance', balance, {time: this.timedata.numbalancespeed});
    },

    //! 判断能否设置用户结余
    canSetBalance: function (balance) {
        return true;
    },

    winAniSetBalance: function (turnwin) {
        GameDataMgr.instance.addScrollAniBy('numBalance', turnwin, {
            time: this.timedata.numbalancespeed,
            delay: 0.5
        });
    },
    getCoinValueIndex: function (index) {
        var curindex = GameDataMgr.instance.getNumberValue('_iCurCoinIndex');
        return curindex;
    },

    //! 筹码值相关
    //! 设置筹码金额范围
    setCoinValueList: function (lst, index) {
        var ovalue = this.getCoinValue();

        if (this.iSaveCoinValue >= 0) {
            ovalue = this.iSaveCoinValue;
        }
        GameDataMgr.instance.setCoinValueList(lst);
        //! 刷新显示值
        var slider = this.getCtrl('slidCoinValue');
        if (slider) {
            var lstCoinString = GameDataMgr.instance.getCoinValueSliderStr();
            slider.setSegmentData(lstCoinString);
        }

        if (index != undefined) {
            this.setCoinValueIndex(index);
        } else {
            this.setCoinValue(ovalue);
        }
    },

    setCoinValueIndex: function (index) {
        var slider = this.getCtrl('slidCoinValue');
        if (slider) {
            slider.setSegmentIndex(index);
            GameDataMgr.instance.setICurCoinIndex(index);
            GameDataMgr.instance.setIWin(0);

        }
        this._refreshDisplay_CoinValue(true);
    },

    setCoinValue: function (value) {
        var lstconvalue = GameDataMgr.instance.getCoinValueList();
        for (var ii = 0; ii < lstconvalue.length; ++ii) {
            if (value == lstconvalue[ii]) {
                this.setCoinValueIndex(ii);
                return;
            }
        }

        //! 没有找到对应的值
        this.iSaveCoinValue = value;
        this.setCoinValueIndex(0);
    },

    getCoinValue: function () {
        var value = GameDataMgr.instance.getCoinValue();
        return value;
    },

    //!--------------设置回调函数相关
    //! 改变筹码值的回调，返回参数为当前的筹码值
    setChgCoinValueFunc: function (callfunc, target) {
        this._addCallFunc('chgcoinvalue', callfunc, target);
    },

    //! 按下旋转按钮的回调
    setSpinFunc: function (callfunc, target) {
        this._addCallFunc('spin', callfunc, target);
    },
    //! 按下快速停止按钮的回调
    setSpinStopFunc: function (callfunc, target) {
        this._addCallFunc('spinstop', callfunc, target);
    },
    //! 打开免费结算界面
    setOpenFreeResultFunc: function (callfunc, target) {
        this._addCallFunc('openfreeresult', callfunc, target);
    },

    //! 打开Disconnect界面
    setOpenDisconnectFunc: function (callfunc, target) {
        this._addCallFunc('disconnect', callfunc, target);
    },

    //!按下菜单按钮的回调
    setMenuFunc: function (callfunc, target) {
        this._addCallFunc('menu', callfunc, target);
    },

    //! 设置离开免费结算的回调
    setLeftFreeResultFunc: function (callfunc, target) {
        this._addCallFunc('leftfreeresult', callfunc, target);
    },

    //! 关闭icontips的回调
    setCloseTipsFunc: function (callfunc, target) {
        this._addCallFunc('closetips', callfunc, target);
    },

    //! 播放音效回调
    setPlaySoundFunc: function (callfunc, target) {
        this._addCallFunc('sound', callfunc, target);
    },

    //! 播放音效回调
    setTouchMaxBetFunc: function (callfunc, target) {
        this._addCallFunc('maxbet', callfunc, target);
    },

    //!播放按钮音效
    playBtnSound: function (sender) {
        //this._callFunc('sound');
        if(!sender || !this.lstBtnMusic || this.lstBtnMusic.length <= 0)
            return;

        if(sender._mgrname)
            var btnname = sender._mgrname;
        else
            var btnname = sender;

        var bplay = false;
        for(var ii = 0; ii < this.lstBtnMusic.length; ii++){
            if(btnname === this.lstBtnMusic[ii].btnname && this.lstBtnMusic[ii].resurl){
                cc.audioEngine.playEffect(this.lstBtnMusic[ii].resurl, this.lstBtnMusic[ii].bloop);
                bplay = true;
                break;
            }
        }

        if(bplay)
            return;

        //!如果播放列表没有对应播放的资源，播通用资源(特殊情况下连通用资源都不播，通用资源传undefined)
        if(this.lstBtnMusic[0].resurl)
            cc.audioEngine.playEffect(this.lstBtnMusic[0].resurl, this.lstBtnMusic[0].bloop);
    },

    _onTouchCloseTips: function (sender) {
        this._callFunc('closetips');
        //this._setState('icontips', 'hide');
        this.playBtnSound(sender);
    },

    //! 判断是否可以投注
    canBetting: function () {
        var totalbet = this.getTotalBet();
        var iscan = GameDataMgr.instance.canBetting(totalbet);
        return iscan;
    },

    //! 实际投注（扣费）
    betting: function () {
        if (!this.canBetting())
            return false;

        var totalbet = this.getTotalBet();
        GameDataMgr.instance.addScrollAniBy('numBalance', -totalbet, {time: this.timedata.numbalancespeed});
        return true;
    },

    //! 设置是否在运行中
    setRun: function (brun, bfree) {
        if (!brun && this._getCurState('totalwin') != 'hide') {
            var bfreegame = GameDataMgr.instance.getNumberValue('_bFreeGame');
            if (bfreegame) {
                this.iWinState = -1;
                this._setState('totalwin', 'end');
                this._setState('run', 0);
            } else {
                this.iWinState = 2;
                var tempfunc = function (dt) {
                    this._onChgWinNum(0, true);
                };
                GameDataMgr.instance.insertTickCallback('runiWinState', this.WaitEndTime, 0, this, tempfunc);
                this.setVisible('numWin', 'winani', true);
            }
        } else {
            this._setState('run', brun ? 1 : 0);
            if (brun) {
                GameDataMgr.instance.setIWin(0);
                GameDataMgr.instance.setITotalWin(0);
            }
            else {
                if(!bfree && !this.isShowWin()) {
                    GamelogicMgr.instance.callRegistered("sendSpinEnd");
                }
            }
        }
    },

    //! 获取总下注值
    getTotalBet: function () {
        var total = GameDataMgr.instance.getTotalBet();
        return total;
    },

    _onTouchCoinCash: function (sender) {
        var bshowcoins = GameDataMgr.instance.getNumberValue('_bShowCoins');
        if (!bshowcoins)
            return;
        if (this.isShowWin())
            return;
        GameDataMgr.instance.switchShowCash();
        GameDataMgr.instance.refreshCrashNumber();

        this.playBtnSound(sender);
    },

    _onTouchMaxBet: function (sender) {
        var canmaxbet = GameDataMgr.instance.canMaxBet();
        if (!canmaxbet)
            return;

        var slider = this.getCtrl('slidCoinValue');
        var icurindex = GameDataMgr.instance.maxBetOrOld();
        GameDataMgr.instance.setIWin(0);
        if (slider) {
            slider.setSegmentIndex(icurindex);
        }
        this._refreshDisplay_CoinValue(true);
        this._callFunc('maxbet', icurindex);

        this.playBtnSound(sender);
    },

    _onTouchRun: function (sender) {
        this._callFunc('spin');

        this.playBtnSound(sender);
    },
    _onTouchStop: function (sender) {
        this._callFunc('spinstop');

        this.playBtnSound(sender);
    },

    _onTouchBet: function (sender) {
        var lst = GameDataMgr.instance.getCoinValueSliderStr();
        var iline = GameDataMgr.instance.getNumberValue('_iLines');

        this.multiplierLayer = new MultiplierLayer(this._CanvasMgr);
        this.multiplierLayer.initData(2, lst, this.getCoinValueIndex(), iline, this._CanvasMgr);
        this.multiplierLayer.setColseCallFunction(this.remvoeMultiplierLayer, this);
        this.multiplierLayer.setOkCallFunction(this.onTouchMultiplier, this);
        cc.director.getRunningScene().addChild(this.multiplierLayer, 10001);

        this.playBtnSound(sender);
    },


    //!allmoney动画开始
    _onShowAllMoney: function (cstate) {
        if (cstate == 1) {
            if (this.windata.lstEffect.tomoneyurl)
                cc.audioEngine.playEffect(this.windata.lstEffect.tomoneyurl,false);

            GamelogicMgr.instance.callRegistered("sendSpinEnd");
        }
    },

    remvoeMultiplierLayer: function () {
        if (this.multiplierLayer) {
            this.multiplierLayer.removeFromParent(true);
            delete this.multiplierLayer;
        }
    },

    onTouchMultiplier: function (curBetId) {
        this.setCoinValueIndex(curBetId);
        this.remvoeMultiplierLayer();
    },

    _onTouchAuto: function (sender) {
        var canautoSpin = GamelogicMgr.instance.canAutoSpin();
        if (!canautoSpin) {
            return;
        }

        //this._setState('auto', 1);
        this.setVisible('layAutoSelect', 'auto', true);

        this.autoLayer = new NewAutoLayer(this._CanvasMgr);
        GamelogicMgr.instance.refreshAutolayer(this.autoLayer);
        this.autoLayer.setColseCallFunction(this._onTouchAutoSelect, this);
        this.autoLayer.setOkCallFunction(this.onTouchAutoCount, this);
        cc.director.getRunningScene().addChild(this.autoLayer, 10000);

        this.setVisible('nodeAutoSelect', 'auto', true);
        //!测试
        this.setVisible('nodeAutoSelect', 'auto', false);
        this.setVisible('layAutoSelect', 'auto', false);

        this.playBtnSound(sender);
    },

    onTouchAutoCount: function (arr) {
        GameDataMgr.instance.setNumberValue('_AutoMinNum', 0);
        GameDataMgr.instance.setNumberValue('_AutoMaxNum', 0);

        var count;
        if(arr[0] == "∞" || arr[0] == 'Infinity'){
            count = InFinityAutoNumber;
        }
        else{
            count = parseInt(arr[0]);
        }
        var min = parseInt(arr[1].split('×')[1]);
        var max = parseInt(arr[2].split('×')[1]);
        var totalBet = this.getTotalBet();

        if (count) {
            if (min) {
                var min = totalBet * min;
                GameDataMgr.instance.setNumberValue('_AutoMinNum', min);
            }

            if (max) {
                var max = totalBet * max;
                GameDataMgr.instance.setNumberValue('_AutoMaxNum', max);
            }
        } else {
            count = 0;
            GameDataMgr.instance.setNumberValue('_AutoMinNum', 0);
            GameDataMgr.instance.setNumberValue('_AutoMaxNum', 0);
        }

        GameDataMgr.instance.setNumberValue('_iAutoWin', 0);

        if(count!=0){
            var serverAuto=count==InFinityAutoNumber?0:count;
            GamelogicMgr.instance.setUserAutoNums(serverAuto);
        }
        this._touchAuto(count);
        this._onTouchAutoSelect();
    },

    _onTouchAutoStop: function (sender) {
        if (this._getCurState('winani') != 0 || this._getCurState('totalwin') != 'hide')
            return;

        this._setState('auto', 0);
        GameDataMgr.instance.setNumberValue('_iAutoNum', 0);
        GamelogicMgr.instance.setUserAutoNums(-1);
        this.playBtnSound(sender);
    },

    _onChgCoinValue: function (sender, type) {
        var slider = this.getCtrl('slidCoinValue');

        if (slider) {
            var index = slider.getSegmentIndex();
            GameDataMgr.instance.setICurCoinIndex(index);
            GameDataMgr.instance.setIWin(0);
            this._refreshDisplay_CoinValue(true);
        }

        this.playBtnSound(sender);
    },

    _onTouchAutoSelect: function (sender) {
        this.setVisible('layAutoSelect', 'auto', false);
        if (this.autoLayer) {
            this.autoLayer.removeFromParent(true);
            delete this.autoLayer;
        }

        this.setVisible('nodeAutoSelect', 'auto', false);

        this.playBtnSound(sender);
    },

    _onTouchDisable: function (sender) {
        if (this.isVisible('virWin')) {
            GameDataMgr.instance.endScrollAni('numWinAni');
            GameDataMgr.instance.endScrollAni('numWin');
        }

        if (this.isVisible('nodeFreeResult')) {
            this._callFunc('leftfreeresult');
        }

        this.playBtnSound(sender);
    },

    _onTouchOpenUi: function (sender) {
        this._setState('openUi', 1);

        this.playBtnSound(sender);
    },

    _onTouchCloseUi: function (sender) {
        this._setState('openUi', 0);

        this.playBtnSound(sender);
    },

    _onTouchAuto25: function (sender) {
        this._touchAuto(25);

        this.playBtnSound(sender);
    },

    _onTouchAuto50: function (sender) {
        this._touchAuto(50);

        this.playBtnSound(sender);
    },

    _onTouchAuto100: function (sender) {
        this._touchAuto(100);

        this.playBtnSound(sender);
    },

    _onTouchAuto200: function (sender) {
        this._touchAuto(200);

        this.playBtnSound(sender);
    },

    _onTouchAuto500: function (sender) {
        this._touchAuto(500);

        this.playBtnSound(sender);
    },

    _onTouchMenu: function (sender) {
        this._callFunc('menu');

        this.playBtnSound(sender);
    },

    _touchAuto: function (num) {
        if (this.autoLayer)
            this.autoLayer.onBtnClose();

        if (num <= 0)
            return;

        this.setVisible('layAutoSelect', 'auto', false);
        this.setVisible('nodeAutoSelect', 'auto', false);
        this._setState('auto', 1);
        var scale=this._iAutoFinityScale;
        GameDataMgr.instance.initIAutoNum(num,scale);
        GameDataMgr.instance.setAutoStartMoney();
    },

    //! 获取控件状态
    _getCtrlState: function (name) {
        if (!this._CtrlState[name])
            this._CtrlState[name] = {};

        return this._CtrlState[name];
    },

    //! 获取一个控件
    getCtrl: function (name) {
        return this._CanvasMgr.getCtrl(name);
    },

    //! 设置默认隐藏控件（当没有状态要求显示的时候就自动隐藏了）
    _setDefaultHide: function (ctrlname, bhide) {
        if (bhide)
            this._addCtrlState(ctrlname, 'defaulthide', 'default');
        else
            this._removeCtrlState(ctrlname, 'defaulthide', 'default');
    },

    //! 设置默认禁用控件（当没有状态要求可用的时候就自动禁用了）
    _setDefaultDisable: function (ctrlname, bdisable) {
        if (bdisable)
            this._addCtrlState(ctrlname, 'defaultdisable', 'default');
        else
            this._removeCtrlState(ctrlname, 'defaultdisable', 'default');
    },

    //! 增加控件状态
    _addCtrlState: function (ctrlname, statename, eventname) {
        var node = this._getCtrlState(ctrlname);

        if (!node[statename])
            node[statename] = {};

        node[statename][eventname] = true;
    },

    //! 移除控件状态
    _removeCtrlState: function (ctrlname, statename, eventname) {
        var node = this._getCtrlState(ctrlname);

        if (!node[statename] || !node[statename][eventname])
            return;

        delete node[statename][eventname];
    },

    //! 判断控件是否有某个状态
    _hasCtrlState: function (ctrlname, statename) {
        if (!this._CtrlState[ctrlname])
            return false;

        if (!this._CtrlState[ctrlname][statename])
            return false;

        for (var ii in this._CtrlState[ctrlname][statename])
            return true;

        return false;
    },

    //! 刷新某个控件
    _refreshCtrl: function (name) {
        // if(this._hasCtrlState(name, 'defaultdisable'))
        //     this._setEnabled(name, this._hasCtrlState(name, 'enable'));
        // else
        //     this._setEnabled(name, !this._hasCtrlState(name, 'disable'));
        //
        // if(this._hasCtrlState(name, 'defaulthide'))
        //     this._setVisible(name, this._hasCtrlState(name, 'show'));
        // else
        //     this._setVisible(name, !this._hasCtrlState(name, 'hide'));
    },

    //! 添加回调函数
    _addCallFunc: function (name, callfunc, target) {
        if (!this._CallFunc[name])
            this._CallFunc[name] = {};

        this._CallFunc[name].callfunc = callfunc;
        this._CallFunc[name].target = target;
    },

    //! 移除回调函数
    _removeCallFunc: function (name) {
        if (!this._CallFunc[name])
            return;

        delete this._CallFunc[name];
    },

    //! 调用某个函数
    _callFunc: function (name) {
        var node = this._CallFunc[name];

        if (!node)
            return;

        var nums = arguments.length;

        if (node.target) {
            switch (nums) {
                case 0:
                case 1:
                    node.callfunc.call(node.target);
                    break;
                case 2:
                    node.callfunc.call(node.target, arguments[1]);
                    break;
                case 3:
                    node.callfunc.call(node.target, arguments[1], arguments[2]);
                    break;
                case 4:
                    node.callfunc.call(node.target, arguments[1], arguments[2], arguments[3]);
                    break;
                case 5:
                    node.callfunc.call(node.target, arguments[1], arguments[2], arguments[3], arguments[4]);
                    break;
                case 6:
                    node.callfunc.call(node.target, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                    break;
                case 7:
                    node.callfunc.call(node.target, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                    break;
                case 8:
                    node.callfunc.call(node.target, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
                    break;
                case 9:
                    node.callfunc.call(node.target, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                    break;
                case 10:
                    node.callfunc.call(node.target, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
                    break;
                case 11:
                    node.callfunc.call(node.target, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9], arguments[10]);
                    break;
            }
        } else {
            switch (nums) {
                case 0:
                case 1:
                    node.callfunc.call();
                    break;
                case 2:
                    node.callfunc.call(arguments[1]);
                    break;
                case 3:
                    node.callfunc.call(arguments[1], arguments[2]);
                    break;
                case 4:
                    node.callfunc.call(arguments[1], arguments[2], arguments[3]);
                    break;
                case 5:
                    node.callfunc.call(arguments[1], arguments[2], arguments[3], arguments[4]);
                    break;
                case 6:
                    node.callfunc.call(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                    break;
                case 7:
                    node.callfunc.call(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                    break;
                case 8:
                    node.callfunc.call(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
                    break;
                case 9:
                    node.callfunc.call(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                    break;
                case 10:
                    node.callfunc.call(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
                    break;
                case 11:
                    node.callfunc.call(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9], arguments[10]);
                    break;
            }
        }
    },

    //! 状态相关
    //! 添加一个状态 curstate为初始状态值 callfunc为状态改变时的回调函数(可选,返回参数cstate改变后的状态值 ostate之前的状态值) target为回调目标(可选)
    _addState: function (name, data, curstate, callfunc, target) {
        this._CanvasMgr.addState(name, data, curstate, callfunc, target);
        return;
    },

    //! 移除一个状态（一般不使用）
    _removeState: function (name) {
        this._CanvasMgr.removeState(name);
        return;
    },

    //! 设置一个状态的当前状态值 delay是延迟多久后起效（可选） brefresh为true则强制刷新（可选，如果强制刷新则不考虑lock、time等状态）
    _setState: function (name, curstate, delay, brefresh) {
        this._CanvasMgr.setState(name, curstate, delay, brefresh);
        return;
    },

    //! 获取一个状态的当前状态值，如果不存在返回-1
    _getCurState: function (name) {
        return this._CanvasMgr.getCurState(name);
    },


    //! 改变控件属性，外部使用接口
    //! 设置是否显示，ctrlname为对应控件的名字，eventname为造成改变的事件名称
    setVisible: function (ctrlname, eventname, visible) {
        this._CanvasMgr.setVisible(ctrlname, visible, eventname);
    },

    isVisible: function (ctrlname) {
        return this._CanvasMgr.isVisible(ctrlname);

        var ctrl = this.getCtrl(ctrlname);

        if (!ctrl || ctrl.isVisible == undefined)
            return false;

        return ctrl.isVisible();
    },

    //! 设置是否可用
    setEnabled: function (ctrlname, eventname, enabled) {
        this._CanvasMgr.setEnabled(ctrlname, enabled, eventname);
    },

    isEnabled: function (ctrlname) {
        return this._CanvasMgr.isEnabled(ctrlname);

        var ctrl = this.getCtrl(ctrlname);

        if (!ctrl || ctrl.isEnabled == undefined)
            return false;

        return ctrl.isEnabled();
    },

    //! 设置透明度
    setOpacity: function (name, opacity) {
        this._CanvasMgr.setOpacity(name, opacity);
    },

    //! 设置颜色
    setColor: function (name, color) {
        this._CanvasMgr.setColor(name, color);
    },

    //! 设置是否显示
    _setVisible: function (name, visible) {
        var node = this.getCtrl(name);

        if (!node || node.setVisible == undefined)
            return;

        node.setVisible(visible);
    },

    //! 设置是否可用
    _setEnabled: function (name, enabled) {
        var node = this.getCtrl(name);

        if (!node || node.setEnabled == undefined)
            return;

        node.setEnabled(enabled);
    },

    //! 播放动画
    _playAni: function (name, ani, data) {
        this._CanvasMgr.play(name, ani, data);
    },

    //! 判断动画是否播放完了
    _isAniEnd: function (name) {
        return this._CanvasMgr.isEnd(name);
    },

    //! 判断动画是否循环
    _isAniLoop: function (name) {
        return this._CanvasMgr.isLoop(name);
    },

    //! 设置动画循环
    _setAniLoop: function (name, aniloop) {
        this._CanvasMgr.setLoop(name, aniloop);
    },

    //! 整体刷新显示
    _refeshDisplay: function () {
        this._refreshDisplay_CoinValue();
    },
    //! 刷新筹码金额相关内容
    _refreshDisplay_CoinValue: function (bchg, bjust) {
        GameDataMgr.instance.refreshText('numTotalBet', 'numBalance');
        if (bchg) {
            var coinvalue = this.getCoinValue();
            this._callFunc('chgcoinvalue', coinvalue);
        } else {
            GameDataMgr.instance.setIWin(0);
        }
        GameDataMgr.instance.refreshText('textFreeTotalWin');
    },
});

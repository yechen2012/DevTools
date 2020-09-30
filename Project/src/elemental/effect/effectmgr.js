var ELEMENTAL_ANI_STATE = {
    STATE_NONE : -1,

    STATE_FG_UI_FADEOUT : 0,
    STATE_FG_UI_FADEOUT_END : 1,
    STATE_FG_SELECT_ANI: 2,
    STATE_FG_SELECT_ANI_END : 3,
    STATE_FG_UI_FADEIN : 4,
    STATE_FG_UI_FADEIN_END : 5,

    STATE_FG_SOIL_ANI : 6,
    STATE_FG_SOIL_ANI_END : 7,

    STATE_FG_WATER_CHG_ICE: 9,
    STATE_FG_WATER_CHG_ICE_END : 10,
    STATE_FG_WATER_CHG_WATER : 12,
    STATE_FG_WATER_CHG_WATER_END : 13,

    STATE_FG_WIND_MOVE : 15,
    STATE_FG_WIND_MOVE_END : 16,
    STATE_FG_WIND_EXTEND : 18,
    STATE_FG_WIND_EXTEND_END : 19,
    STATE_FG_WIND_COLLECT : 23,
    STATE_FG_WIND_COLLECT_END : 24,
    STATE_FG_WIND_BOARD_UPGRADE : 25,
    STATE_FG_WIND_BOARD_UPGRADE_END : 26,

    STATE_BETA_ENTER : 27,
    STATE_BETA_ENTER_END : 28,
    STATE_BETA_EXIT : 29,
    STATE_BETA_EXIT_END : 30,
    STATE_BETA_DISPLAY_ICON : 31,
    STATE_BETA_DISPLAY_ICON_END : 32
};

var ELEMENTAL_WHEEL_DATA_KEY = [
    "normal",
    "free0",
    "free1",
    "free2",
    "free3"
];

var UNIT_TIME = 1 / 24;

var BETA_GAME_DELAY = 0.5;

var ElementalEffectMgr = cc.Class.extend({
    ctor: function() {
        this._bVia = true;

        this._bBetaGame = false; // 是否处在试玩版公主游戏中
        this._iLastType = 0;
        this._iGameType = 0;
        this._iFGWindExtendIndex = 0;
        this._iFGWindCollectIndex = 0;
        this._iFGSoilIndex = 0;

        this._lstWheel = undefined;

        this._gameLayer = undefined;
        this._logic = undefined;

        this._nodeIconMgr = undefined;
        this._boardMgr = undefined;

        this._freeSelectLayer = undefined;

        this._iState = ELEMENTAL_ANI_STATE.STATE_NONE;
        this._iAniTime = 0;
        this._bNeedRunOne = false;
        this._bStopWheel = false;

        this._lstBackNode = undefined;
        this._lstBackSpine = undefined;
        this._lstBackCollect = undefined;
        this._lstBackSpineParent = undefined;
        this._curSpine = undefined; // 背景人物动画
        this._curSpineParent = undefined; // 背景人物动画父节点
        this._lstCurSpine = undefined; // 背景元素动画
        this._lstCurSpineParent = undefined; // 背景元素动画父节点

        this._lstUIElement = undefined;

        this._lstAllWheelData = {};
    },

    init: function(logic, gameLayer, canvasMgr, moduleUI) {
        this._gameLayer = gameLayer;
        this._canvasMgr = canvasMgr;
        this._moduleUI = moduleUI;
        this._logic = logic;

        if (!this._freeSelectLayer) {
            var nodeFreeSelect = canvasMgr.getSingle("nodeFreeSelect");

            this._freeSelectLayer = new ElementalFreeSelectLayer(this);
            nodeFreeSelect.addChild(this._freeSelectLayer, 1);
            this._freeSelectLayer.setVisible(false);
        }

        this._iGameType = this._logic.getGameType();
        this._lstWheel = gameLayer.lstwheel;

        this._nodeIconMgr = new ElementalEffectNodeMgr(this, logic);
        this._nodeIconMgr.init(canvasMgr, this._lstWheel);

        this._boardMgr = new ElementalBoardMgr(this);
        this._boardMgr.init(this._lstWheel, canvasMgr);
        this._boardMgr.reset();
    },

    initBackArray: function(background) {
        if (background) {
            this._lstBackNode = new Array(5);
            this._lstBackNode[0] = findNodeByName(background.node, "nodeBG");
            this._lstBackNode[1] = findNodeByName(background.node, "nodeFG3");
            this._lstBackNode[2] = findNodeByName(background.node, "nodeFG1");
            this._lstBackNode[3] = findNodeByName(background.node, "nodeFG4");
            this._lstBackNode[4] = findNodeByName(background.node, "nodeFG2");
        }

        this._lstBackSpine = new Array(5);
        this._lstBackSpine[1] = this._canvasMgr.getCtrl("spineFGFire");
        this._lstBackSpine[2] = this._canvasMgr.getCtrl("spineFGSoil");
        this._lstBackSpine[3] = this._canvasMgr.getCtrl("spineFGWind");
        this._lstBackSpine[4] = this._canvasMgr.getCtrl("spineFGWater");

        this._lstBackSpineParent = new Array(5);
        this._lstBackSpineParent[1] = this._canvasMgr.getCtrl("nodeFGSpineFire");
        this._lstBackSpineParent[2] = this._canvasMgr.getCtrl("nodeFGSpineSoil");
        this._lstBackSpineParent[3] = this._canvasMgr.getCtrl("nodeFGSpineWind");
        this._lstBackSpineParent[4] = this._canvasMgr.getCtrl("nodeFGSpineWater");

        this._lstBackCollect = new Array(5);
        this._lstBackCollect[1] = this._canvasMgr.getCtrl("resCollectFire");

        // for (var i = 0; i < 3; ++i) {
        //     var node = this._lstBackCollect[1].getNode(i);
        //     if (node) {
        //         node.setCascadeOpacityEnabled(true);
        //     }
        // }

        // 背景元素动画
        var lstSpine = new Array(5);
        var temp = new Array(4);
        temp[0] = this._canvasMgr.getCtrl("spineBGHuabanLeft");
        temp[1] = this._canvasMgr.getCtrl("spineBGHuabanRight");
        temp[2] = this._canvasMgr.getCtrl("spineBGHuazhiLeft");
        temp[3] = this._canvasMgr.getCtrl("spineBGHuazhiRight");
        lstSpine[0] = temp;

        temp = new Array(4);
        temp[0] = this._canvasMgr.getCtrl("spineFGFireFengyeLeft");
        temp[1] = this._canvasMgr.getCtrl("spineFGFireFengyeRight");
        temp[2] = this._canvasMgr.getCtrl("spineFGFireYeLeft");
        temp[3] = this._canvasMgr.getCtrl("spineFGFireYeRight");
        lstSpine[1] = temp;

        temp = new Array(2);
        temp[0] = this._canvasMgr.getCtrl("spineFGWindLiushuLeft");
        temp[1] = this._canvasMgr.getCtrl("spineFGWindLiushuRight");
        lstSpine[3] = temp;

        temp = new Array(2);
        temp[0] = this._canvasMgr.getCtrl("spineFGWaterZhuziLeft");
        temp[1] = this._canvasMgr.getCtrl("spineFGWaterZhuziRight");
        lstSpine[4] = temp;

        this._lstBackSpine1 = lstSpine;


        var lstParent = new Array(5);
        temp = new Array(2);
        temp[0] = this._canvasMgr.getCtrl("nodeSpineBGLeft");
        temp[1] = this._canvasMgr.getCtrl("nodeSpineBGRight");
        lstParent[0] = temp;

        temp = new Array(2);
        temp[0] = this._canvasMgr.getCtrl("nodeSpineFGFireLeft");
        temp[1] = this._canvasMgr.getCtrl("nodeSpineFGFireRight");
        lstParent[1] = temp;

        temp = new Array(2);
        temp[0] = this._canvasMgr.getCtrl("nodeSpineFGSoilLeft");
        temp[1] = this._canvasMgr.getCtrl("nodeSpineFGSoilRight");
        lstParent[2] = temp;

        temp = new Array(2);
        temp[0] = this._canvasMgr.getCtrl("nodeSpineFGWindLeft");
        temp[1] = this._canvasMgr.getCtrl("nodeSpineFGWindRight");
        lstParent[3] = temp;

        temp = new Array(2);
        temp[0] = this._canvasMgr.getCtrl("nodeSpineFGWaterLeft");
        temp[1] = this._canvasMgr.getCtrl("nodeSpineFGWaterRight");
        lstParent[4] = temp;


        this._lstBackSpineParent1 = lstParent;

        // 注册UI节点，用于进入免费时的透明度变化动画；
        var lstElement = new Array(11);
        lstElement[0] = this._canvasMgr.getCtrl("nodeBoardDown");
        lstElement[1] = this._canvasMgr.getCtrl("nodeWheel");
        lstElement[2] = this._canvasMgr.getCtrl("nodeLine");
        lstElement[3] = this._canvasMgr.getCtrl("nodeBoardUp");
        lstElement[4] = this._canvasMgr.getCtrl("nodeTouchWheel");
        lstElement[5] = this._canvasMgr.getCtrl("nodeTopWheel");
        lstElement[6] = this._canvasMgr.getCtrl("nodeUI");
        lstElement[7] = this._canvasMgr.getCtrl("nodeFGSpin");
        lstElement[8] = this._canvasMgr.getCtrl("nodeBGSpin");
        lstElement[9] = this._canvasMgr.getCtrl("nodeCollectFire");
        lstElement[10] = this._canvasMgr.getCtrl("nodeCollectWind");

        this._lstUIElement = lstElement;
    },

    isVia: function() {
        return this._bVia;
    },

    showTop: function(x, y) {
        var ret = false;
        if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            ret = this._nodeIconMgr.playFGWindTopAni(x, y);
        }

        if (!ret) {
            this._nodeIconMgr.showTop(x, y);
        }

        return ret;
    },

    isDisplayFGWindMegaWild: function(wheelIndex, iconPosition) {
        var ret = false;
        if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            ret = this._nodeIconMgr.isDisplayFGWindMegaWild(wheelIndex, iconPosition);
        }

        return ret;
    },

    clearTop: function(x, y) {
        this._nodeIconMgr.clearTop();

        if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            this._nodeIconMgr.clearFGWindTopAni(x, y);
        }
    },

    hideFGSelectLayer: function() {
        if (this._freeSelectLayer) {
            this._freeSelectLayer.setVisible(false);
            this._freeSelectLayer.reset();
        }

        this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_FREE_SELECT, 0);
        this._setState(ELEMENTAL_ANI_STATE.STATE_FG_UI_FADEIN);
    },

    /*
    * 试玩版公主转的断线重连恢复，主要用于退出免费时扔处于公主转的情况；
    * 注：此时要直接显示各公主转的最终状态，跳过展示；
    * */
    onInitBetaGame: function() {
        cc.log("onInitBetaGame");

        this._bBetaGame = true;

        this._gameLayer.refreshGameSceneElements();
        this._nodeIconMgr.reset();
        this._boardMgr.reset();
        this._setCtrlGameType();
        this._refreshWheelImg();
        this._chgBackNodeZOrder(this._iGameType);

        switch (this._iGameType) {
            case ELEMENTAL_GAME_TYPE.GAME_FG_SOIL :
                this._onInitBetaSoil();
                break;
            case ELEMENTAL_GAME_TYPE.GAME_FG_WATER :
                this._onInitBetaWater();
                break;
            case ELEMENTAL_GAME_TYPE.GAME_FG_FIRE :
                this._onInitBetaFire();
                break;
            case ELEMENTAL_GAME_TYPE.GAME_FG_WIND :
                this._onInitBetaWind();
                break;
            default :
                break;
        }
    },

    // 进入试玩版公主游戏
    enterBetaGame: function() {
        this._bBetaGame = true;
        this._setState(ELEMENTAL_ANI_STATE.STATE_BETA_ENTER);
    },

    // 退出试玩版公主游戏
    exitBetaGame: function() {
        if (this._bBetaGame) {
            this._bBetaGame = false;
            this._setState(ELEMENTAL_ANI_STATE.STATE_BETA_EXIT);
        }
        else {
            this._gameLayer.stopFirstWheel();
        }
    },

    onSymbolStripes: function(wName, arr) {
        if (!this._lstAllWheelData) {
            this._lstAllWheelData = {};
        }

        var wheelData = [];
        if (arr) {
            for (var i = 0; i < arr.length; ++i) {
                wheelData.push(arr[i]);
            }
        }

        this._lstAllWheelData[wName] = wheelData;
    },

    onInitFinish: function() {
        this._refreshGameType();
        this._gameLayer.refreshGameSceneElements();
        this._setState(ELEMENTAL_ANI_STATE.STATE_NONE);
    },

    onGameModuleInfo: function(isInit) {
        this._iLastType = this._iGameType;
        this._iGameType = this._logic.getGameType();

        if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND && !this._logic.isBetaGame()) {
            this._setState(ELEMENTAL_ANI_STATE.STATE_FG_WIND_MOVE);
        }

        // 如果是普通游戏，有1%概率播放公主转xingxing动画
        if (!isInit && this._iGameType === ELEMENTAL_GAME_TYPE.GAME_BG) {
            var val = Math.random() * 100;
            if (val < 1) {
                this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_BETA_CHGSCENE, 3);
            }
        }

        // 设置一下TopWheel的轮子数据
        var logicDataFormat = this._logic.getLogicDataFormat();
        var logicDataEx = this._logic.getLogicDataEx();
        if (this._logic.isValidData(logicDataEx)) {
            logicDataEx = this._logic.server2client(logicDataEx);
            this._nodeIconMgr.setTopWheelIconData(logicDataEx);
        }
    },

    /*
    * EffectMgr入口函数，GameLayer:runOne之前的操作；
    * */
    onPreRunOne: function() {
        // RunOne之前的操作
        // 目前仅免费游戏-水需要
        switch (this._iGameType) {
            case ELEMENTAL_GAME_TYPE.GAME_FG_WATER :
                this._bNeedRunOne = true;
                this._setIsVia(false);
                this._setState(ELEMENTAL_ANI_STATE.STATE_FG_WATER_CHG_ICE);
                break;
            default:
                this._gameLayer.onRunOne();
                break;
        }

        this._nodeIconMgr.resetTopWheelRunAni();
    },

    /*
    * EffectMgr入口函数，GameLayer:showAllResult之前的操作；
    * */
    onPreShowAllResult: function() {
        // 播放winAni之前的操作
        switch (this._iGameType) {
            case ELEMENTAL_GAME_TYPE.GAME_FG_SOIL :
                this._onFGSoilWheelStop(4);
                break;
            case ELEMENTAL_GAME_TYPE.GAME_FG_WATER :
                this._onFGWaterWheelStop(4);
                break;
            default:
                this._gameLayer.showAllResult();
                break;
        }
    },

    /*
    * EffectMgr入口函数，GameLayer:WinAniEnd之后的操作；
    * */
    onWinAniEnd: function() {
        if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            var data = this._logic.getFGWindData();
            var freeNum = GameDataMgr.instance.getNumberValue('_iFreeNum');
            if (freeNum > 0 && data.collect && data.collect.lstCollect) {
                this._setIsVia(false);
                this._iFGWindExtendIndex = 0;
                this._iFGWindCollectIndex = 0;
                this._gameLayer.clearResultDis();
                this._setState(ELEMENTAL_ANI_STATE.STATE_FG_WIND_COLLECT);
            }
            else {
                this._gameLayer.onEffectMgrEnd();
            }
        }
        else {
            this._gameLayer.onEffectMgrEnd();
        }
    },

    /*
    * EffectMgr入口函数，WheelStop后的操作
    * */
    onWheelStop: function(index) {
        switch (this._iGameType) {
            case ELEMENTAL_GAME_TYPE.GAME_FG_FIRE :
                if (!this._logic.isBetaGame())
                    this._onFGFireWheelStop(index);
                break;
            default:
                break;
        }
    },

    onEnterFreeAniEnd: function() {
        this._setState(ELEMENTAL_ANI_STATE.STATE_FG_UI_FADEOUT);
    },

    onExitFreeGame: function() {
        this._iGameType = ELEMENTAL_GAME_TYPE.GAME_BG;
        this._refreshGameType();

        this._nodeIconMgr.reset();
        this._boardMgr.reset();
    },

    update: function(dt) {
        if (this._nodeIconMgr) {
            this._nodeIconMgr.update(dt);
        }

        if (this._soilLine) {
            this._soilLine.update(dt);
        }

        if (this._freeSelectLayer) {
            this._freeSelectLayer.update(dt);
        }

        if (this._curSpine && this._curSpineParent) {
            var spine = this._curSpine.getRes();
            var parent = this._curSpineParent.getNode(this._canvasMgr.getCurCanvasIndex());
            spine.node.setPremultipliedAlpha(parent.getOpacity());
        }

        if (this._lstCurSpine && this._lstCurSpineParent) {
            var parent = this._lstCurSpineParent[0].getNode(this._canvasMgr.getCurCanvasIndex());
            var opacity = parent.getOpacity();
            for (var i = 0; i < this._lstCurSpine.length; ++i) {
                var spine = this._lstCurSpine[i].getRes();
                spine.node.setPremultipliedAlpha(opacity);
            }
        }

        if (this.isVia()) {
            return;
        }

        if (this._iFGFireFlyTime > 0) {
            this._iFGFireFlyTime -= dt;

            if (this._iFGFireFlyTime <= 0) {
                this._iFGFireFlyTime = 0;
                this.onFGFireFlyEnd();
            }
        }

        if (this._iAniTime > 0) {
            this._iAniTime -= dt;

            if (this._iAniTime <= 0) {
                this._iAniTime = 0;

                this._setState(this._iState + 1);
            }
        }
    },

    _setIsVia: function(bVia) {
        this._bVia = bVia;

        if (bVia) {
            this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_VIR_FREE, 0);
        }
        else {
            this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_VIR_FREE, 1);
        }
    },

    _setAniTime: function(time) {
        this._iAniTime = time;
    },

    _setState: function(state) {
        if (this._iState !== state) {
            if (state !== ELEMENTAL_ANI_STATE.STATE_NONE) {
                this._setIsVia(false);
            }

            // 清空遗留的动画倒计时，防止出现错置状态的情况；
            this._setAniTime(0);

            this._iState = state;
            this._chgState();
        }
    },

    _chgState: function() {
        switch (this._iState) {
            case ELEMENTAL_ANI_STATE.STATE_NONE :
                this._onNoneState();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_UI_FADEOUT :
                this._onFGUIFadeOutAni();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_UI_FADEOUT_END :
                this._onFGUIFadeOutAniEnd();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_SELECT_ANI :
                this._onFGSelectAni();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_SELECT_ANI_END :
                this._onFGSelectAniEnd();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_UI_FADEIN :
                this._onFGUIFadeInAni();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_UI_FADEIN_END :
                this._onFGUIFadeInAniEnd();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_SOIL_ANI :
                this._onFGSoilAni();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_SOIL_ANI_END :
                this._onFGSoilEnd();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_WATER_CHG_ICE :
                this._onFGWaterChgIce();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_WATER_CHG_ICE_END :
                this._onFGWaterChgIceEnd();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_WATER_CHG_WATER :
                this._onFGWaterChgWater();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_WATER_CHG_WATER_END :
                this._onFGWaterChgWaterEnd();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_WIND_MOVE :
                this._onFGWindMove();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_WIND_MOVE_END :
                this._onFGWindMoveEnd();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_WIND_EXTEND :
                this._onFGWindExtend();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_WIND_EXTEND_END :
                this._onFGWindExtendEnd();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_WIND_COLLECT :
                this._onFGWindCollect();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_WIND_COLLECT_END :
                this._onFGWindCollectEnd();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_WIND_BOARD_UPGRADE :
                this._onFGWindBoardUpgrade();
                break;
            case ELEMENTAL_ANI_STATE.STATE_FG_WIND_BOARD_UPGRADE_END :
                this._onFGWindBoardUpgradeEnd();
                break;
            case ELEMENTAL_ANI_STATE.STATE_BETA_ENTER :
                this._onBetaGameEnter();
                break;
            case ELEMENTAL_ANI_STATE.STATE_BETA_ENTER_END :
                this._onBetaGameEnterEnd();
                break;
            case ELEMENTAL_ANI_STATE.STATE_BETA_EXIT :
                this._onBetaGameExit();
                break;
            case ELEMENTAL_ANI_STATE.STATE_BETA_EXIT_END :
                this._onBetaGameExitEnd();
                break;
            case ELEMENTAL_ANI_STATE.STATE_BETA_DISPLAY_ICON :
                this._onBetaGameDisplayIconAni();
                break;
            case ELEMENTAL_ANI_STATE.STATE_BETA_DISPLAY_ICON_END :
                this._onBetaGameDisplayIconAniEnd();
                break;
        }
    },

    _refreshGameType: function() {
        this._setCtrlGameType();
        this._refreshWheelData();
        this._refreshWheelImg();

        var logicData = this._logic.getLogicData();
        if (this._logic.isValidData(logicData))
            logicData = this._logic.server2client(logicData);

        for (var i = 0; i < this._lstWheel.length; ++i) {
            wheel = this._lstWheel[i];
            wheel.clearIconDisplayAni();
            if (this._logic.isValidData(logicData))
                wheel.refreshWheelDisplay(logicData[i]);

            wheel.clearBigIcon();
        }
    },

    _setCtrlGameType: function() {
        this._boardMgr.setGameType(this._iGameType);
        this._nodeIconMgr.setGameType(this._iGameType);
    },

    _refreshWheelData: function() {
        var wheel = undefined;
        var wheelKey = ELEMENTAL_WHEEL_DATA_KEY[this._iGameType];
        if (wheelKey && this._lstAllWheelData[wheelKey]) {
            var lstData = this._lstAllWheelData[wheelKey];
            var data = undefined;
            for (var i = 0; i < lstData.length; ++i) {
                wheel = this._lstWheel[i];
                data = lstData[i].Symbols;

                var lstNewData = [];
                for (var j = 0; j < data.length; ++j) {
                    lstNewData.push(data[j]);
                }

                var wheelIndex = wheel.curdataindex;
                wheel.setWheelData(lstNewData, wheelIndex, false);
            }
        }
    },

    _refreshWheelImg: function() {
        var lstImg = this._logic.getLstIconImg(this._iGameType);
        var lstBlurImg = this._logic.getLstIconBlurImg(this._iGameType);
        var lstAni = this._logic.getIconAniRun(this._iGameType);

        this._nodeIconMgr.setTopWheelRunAniDef(lstAni);

        for (var i = 0; i < this._lstWheel.length; ++i) {
            wheel = this._lstWheel[i];
            wheel.setIconImg(lstImg);
            wheel.setIconBlurImg(lstBlurImg);
            // wheel.setIconRunAni(lstAni);
        }
    },

    _onNoneState: function() {
        this._setIsVia(true);

        if (this._bNeedRunOne) {
            this._bNeedRunOne = false;
            this._gameLayer.onRunOne();
        }

        if (this._bNeedShowAllResult) {
            this._bNeedShowAllResult = false;
            this._gameLayer.showAllResult();
        }

        if (this._bMgrEnd) {
            this._bMgrEnd = false;
            this._gameLayer.onEffectMgrEnd();
        }

        if (this._bStopWheel) {
            this._bStopWheel = false;
            this._gameLayer.stopFirstWheel();
        }
    },

    _onFGSoilWheelStop: function(index) {
        // 土 只有在全部停止时才需要生效
        if (index !== 4)
            return;

        var lstData = this._logic.getFGSoilData();
        if (lstData.length > 0) {
            this._setIsVia(false);
            this._iFGSoilIndex = 0;
            this._setState(ELEMENTAL_ANI_STATE.STATE_FG_SOIL_ANI);
        }
        else {
            this._gameLayer.showAllResult();
        }
    },

    _onFGUIFadeOutAni: function() {
        this._setIsVia(false);
        var time = 0.01;

        if (this._lstUIElement) {
            time = 10 / 24;
            var canvasNum = this._canvasMgr.getCanvasNums();
            for (var i = 0; i < this._lstUIElement.length; ++i) {
                var element = this._lstUIElement[i];
                for (var j = 0; j < canvasNum; ++j) {
                    var node = element.getNode(j);
                    if (node) {
                        node.setOpacity(255);
                        node.runAction(cc.fadeOut(time));
                    }
                }
            }
        }

        this._setAniTime(time);
    },

    _onFGUIFadeOutAniEnd: function() {
        this._setState(ELEMENTAL_ANI_STATE.STATE_FG_SELECT_ANI);
    },

    _onFGSelectAni: function() {
        this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_FREE_SELECT, 1);
        this._freeSelectLayer.setVisible(true);
        this._freeSelectLayer.playDisplayAni(this._iGameType);
        this._nodeIconMgr.reset();

        this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_GAME_LOGO, 1);
    },

    _onFGSelectAniEnd: function() {
        this._setIsVia(false);
        this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_FGSELECT_CHGSCENE, 1);
        var self = this;
        this._freeSelectLayer.playExitAni(function() {
            self._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_GAME_LOGO, 0);
            self.onInitFinish();
        });

        var element = this._lstUIElement[9];
        for (var i = 0; i < 3; ++i) {
            this._setAniFireVisible(element.getNode(i), false);
        }
    },

    _onFGUIFadeInAni: function() {
        var time = 0.01;
        if (this._lstUIElement) {
            time = 5 / 24;
            var canvasNum = this._canvasMgr.getCanvasNums();
            for (var i = 0; i <this._lstUIElement.length; ++i) {
                var element = this._lstUIElement[i];
                for (var j = 0; j < canvasNum; ++j) {
                    var node = element.getNode(j);
                    if (node) {
                        if (i === 9) {
                            this._setAniFireVisible(node, true);
                        }

                        node.setOpacity(0);
                        node.runAction(cc.fadeIn(time));
                    }
                }
            }
        }

        this._setAniTime(time);
    },

    _onFGUIFadeInAniEnd: function() {
        this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_FREE, 1);

        this._gameLayer.playOneMusic();

        this._setIsVia(true);

        if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            this._displayFGWindMegaWild();
            this._displayFGWindBoard();
        }
        else if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_FIRE) {
            this._displayFGFireMul();
        }
        else if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_WATER) {
            this._setIsVia(false);
            this._setState(ELEMENTAL_ANI_STATE.STATE_FG_WATER_CHG_ICE);
        }
    },

    _onFGSoilAni: function() {
        var lstSoilData = this._logic.getFGSoilData();
        var time = 0.01;
        if (lstSoilData && this._iFGSoilIndex < lstSoilData.length) {
            var turnData = lstSoilData[this._iFGSoilIndex];

            for (var i = 0; i < turnData.length; ++i) {
                this._nodeIconMgr.playFGSoilReadyAni(turnData[i]);
                this._nodeIconMgr.playFGSoilLineAni(turnData[i], i);

                time = Math.max(time, this._nodeIconMgr.playFGSoilTransformAni(turnData[i]));

                cc.audioEngine.playEffect(res.ElementalFGSoilWildEffect_mp3, false);
            }
        }

        this._setAniTime(time);
    },

    _onFGSoilEnd: function() {
        this._nodeIconMgr.reset();

        var lstSoilData = this._logic.getFGSoilData();
        var lstLogicEx = this._logic.getFGSoilLogicDataEx();
        var logicEx = lstLogicEx[this._iFGSoilIndex];
        this._setNormalWheelData(this._logic.server2client(logicEx));

        ++this._iFGSoilIndex;

        if (this._iFGSoilIndex < lstSoilData.length) {
            this._setState(ELEMENTAL_ANI_STATE.STATE_FG_SOIL_ANI);
        }
        else {
            this._bNeedShowAllResult = true;
            this._setState(ELEMENTAL_ANI_STATE.STATE_NONE);
        }
    },

    _onFGWaterChgIce: function() {
        var lstData = this._logic.getFGWaterData();
        var time = this._nodeIconMgr.playFGWaterChgIceAni(lstData);

        this._setAniTime(time);
    },

    _onFGWaterChgIceEnd: function() {
        var logicDataEx = this._logic.server2client(this._logic.getLogicData());
        if (this._logic.isValidData(logicDataEx))
            this._setNormalWheelData(logicDataEx);

        this._setState(ELEMENTAL_ANI_STATE.STATE_NONE);
    },

    _onFGWaterChgWater: function() {
        var lstData = this._logic.getFGWaterData();
        var delayTime = 0;
        // if (this._bBetaGame) {
        //     delayTime = BETA_GAME_DELAY;
        // }

        var time = this._nodeIconMgr.playFGWaterChgWaterAni(lstData, delayTime);

        cc.audioEngine.playEffect(res.ElementalFGWaterWildEffect_mp3, false);

        this._setAniTime(time);
    },

    _onFGWaterChgWaterEnd: function() {
        var logicDataEx = this._logic.server2client(this._logic.getLogicDataEx());
        this._setNormalWheelData(logicDataEx);

        this._nodeIconMgr.reset();

        this._bNeedShowAllResult = true;
        this._setState(ELEMENTAL_ANI_STATE.STATE_NONE);
    },

    _displayFGWindBoard: function() {
        var data = this._logic.getFGWindData();
        var collect = data.collect;
        if (collect) {
            this._boardMgr.refreshFGWindBoard(collect.lastLv, collect.lastFire);
        }
    },

    _displayFGFireMul: function() {
        this._boardMgr.setFGFireMul(this._logic.getFGFireMul());
    },

    _displayFGWindMegaWild: function() {
        var data = this._logic.getFGWindData();
        if (data) {
            this._nodeIconMgr.displayFGWindMegaWild(data.rect);
        }
    },

    _onFGWindMove: function() {
        var data = this._logic.getFGWindData();
        if (!data.lastRect) {
            this._displayFGWindMegaWild();
            this._displayFGWindBoard();
            this._setState(ELEMENTAL_ANI_STATE.STATE_NONE);
        }
        else {
            var ret = this._nodeIconMgr.playFGWindMoveAni(data.lastRect, data.rect);
            if (ret) {
                this._setAniTime(1);
            }
            else {
                this._setAniTime(0.01);
            }
        }
    },

    _onFGWindMoveEnd: function() {
        this._bStopWheel = true;

        this._setState(ELEMENTAL_ANI_STATE.STATE_NONE);
    },

    _onFGWindCollect: function() {
        var data = this._logic.getFGWindData();
        if (data.collect && data.collect.lstCollect && this._iFGWindCollectIndex < data.collect.lstCollect.length) {
            this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_COLLECT, 1);

            var lst = data.collect.lstCollect;
            var lvData = lst[this._iFGWindCollectIndex];
            var time = this._boardMgr.playFGWindFly(lvData.point, lvData);

            this._setAniTime(time);
        }
        else {
            this._setState(ELEMENTAL_ANI_STATE.STATE_FG_WIND_COLLECT_END);
        }
    },

    _onFGWindCollectEnd: function() {
        var nextState = ELEMENTAL_ANI_STATE.STATE_FG_WIND_EXTEND;
        this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_COLLECT, 0);

        var collectData = this._logic.getFGWindData().collect;
        var lvData = collectData.lstCollect[this._iFGWindCollectIndex];
        if (lvData) {
            if (lvData.display) {
                this._boardMgr.refreshFGWindBoard(lvData.display.lv, lvData.display.fire);
            }

            if (lvData.upgrade) {
                this._onFGWindBoardUpgrade();
            }

            ++this._iFGWindCollectIndex;
            if (this._iFGWindCollectIndex < collectData.lstCollect.length) {
                // this._setState(ELEMENTAL_ANI_STATE.STATE_FG_WIND_COLLECT);
                nextState = ELEMENTAL_ANI_STATE.STATE_FG_WIND_COLLECT;
            }
        }
        else {
            this._boardMgr.refreshFGWindBoard(collectData.lv, collectData.fire);
        }

        this._setState(nextState);
    },

    _onFGWindBoardUpgrade: function() {
        var collectData = this._logic.getFGWindData().collect;
        var lvData = collectData.lstCollect[this._iFGWindCollectIndex];
        this._boardMgr.playFGWindUpgradeAni(lvData);
    },

    _onFGWindBoardUpgradeEnd: function() {

    },

    _onFGWindExtend: function() {
        var data = this._logic.getFGWindData();
        if (data.upgrade) {
            var rect = data.upgrade[this._iFGWindExtendIndex];
            var time = this._nodeIconMgr.playFGWindExtendAni(rect);

            if (this._bBetaGame) {
                time += BETA_GAME_DELAY;
            }

            this._setAniTime(time);
        }
        else {
            this._setState(ELEMENTAL_ANI_STATE.STATE_FG_WIND_EXTEND_END);
        }
    },

    _onFGWindExtendEnd: function() {
        var lstUpgrade = this._logic.getFGWindData().upgrade;
        if (lstUpgrade) {
            var rect = lstUpgrade[this._iFGWindExtendIndex];
            if (rect.display) {
                this._nodeIconMgr.displayFGWindMegaWild(rect.display);
            }
        }

        ++this._iFGWindExtendIndex;

        if (lstUpgrade && this._iFGWindExtendIndex < lstUpgrade.length) {
            this._setState(ELEMENTAL_ANI_STATE.STATE_FG_WIND_EXTEND);
        }
        else {
            if (this._bBetaGame) {
                this._bStopWheel = true;
            }
            else {
                this._bMgrEnd = true;
            }

            this._setState(ELEMENTAL_ANI_STATE.STATE_NONE);
        }
        //
        // var collectData = this._logic.getFGWindData().collect;
        // if (this._iFGWindCollectIndex < collectData.lstCollect.length) {
        //     this._setState(ELEMENTAL_ANI_STATE.STATE_FG_WIND_COLLECT);
        // }
        // else {
        //     this._setState(ELEMENTAL_ANI_STATE.STATE_NONE);
        //     this._gameLayer.onEffectMgrEnd();
        // }
    },

    _onFGFireWheelStop: function(index) {
        var lstPoint = this._logic.getLstIconPointInCol(index, LIST_SYMBOLS.WL);
        if (lstPoint.length > 0) {
            this._setIsVia(false);
            this._iFGFireFlyTime = 1.5;

            this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_COLLECT, 1);

            for (var i = 0; i < lstPoint.length; ++i) {
                this._lstWheel[index].playIconDisplayAni(LIST_SYMBOLS.WL);
                this._boardMgr.playFGFireFly(lstPoint[i], 1);
            }
        }
    },

    onFGFireFlyEnd: function() {
        if (this._iFGFireFlyTime <= 0 && this._boardMgr.isFlyNodesEmpty()) {
            this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_COLLECT, 0);
            this._setIsVia(true);
        }
    },

    _onFGWaterWheelStop: function(index) {
        if (index !== 4)
            return;

        var lstData = this._logic.getFGWaterData();
        if (lstData && lstData.length > 0) {
            this._setState(ELEMENTAL_ANI_STATE.STATE_FG_WATER_CHG_WATER);
        }
        else {
            this._gameLayer.showAllResult();
        }
    },

    _setNormalWheelData: function(lstData) {
        if (!this._logic.isValidData(lstData))
            return;

        var wheel = undefined;
        var index = 0;
        for (var i = 0; i < this._lstWheel.length; ++i) {
            wheel = this._lstWheel[i];
            index = wheel.curdataindex;
            wheel.setWheelIndex(index, true, lstData[i]);
        }
    },

    _onBetaGameEnter: function() {
        var time = 0.01;
        if (this._iLastType != this._iGameType) {
            time = 0.5;
        }

        this._setIsVia(false);

        // 火要提前刷收集面板
        if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_FIRE) {
            this._displayFGFireMul();
        }

        this._onBetaGameEnterChgScene();

        this._setAniTime(time);
    },

    _onBetaGameEnterChgScene: function() {
        var gameType = this._logic.getGameType();
        if (this._iLastType === gameType)
            return;

        var node = this._chgBackNodeZOrder(gameType);

        node.setOpacity(0);
        var self = this;
        node.runAction(this._createEnterAction(function() {
            self._curSpine = undefined;
            self._curSpineParent = undefined;

            self._gameLayer.refreshGameSceneElements();
        }));

        node = this._lstBackSpine[gameType];
        var parent = this._lstBackSpineParent[gameType];
        if (node && parent) {
            this._curSpine = node;
            this._curSpineParent = parent;

            var spine = node.getRes();
            if (spine && spine.node) {
                spine.node.setPremultipliedAlpha(0);
                parent.setOpacity(0);

                for (var i = 0; i < 3; ++i) {
                    parent.getNode(i).runAction(cc.fadeIn(9 * UNIT_TIME));
                }
            }
        }

        var lstSpine = this._lstBackSpine1[gameType];
        var lstParent = this._lstBackSpineParent1[gameType];
        if (lstSpine && lstParent) {
            this._lstCurSpine = lstSpine;
            this._lstCurSpineParent = lstParent;

            for (var i = 0; i < lstSpine.length; ++i) {
                var spine = lstSpine[i];
                spine.getRes().node.setPremultipliedAlpha(0);
            }

            for (var i = 0; i < lstParent.length; ++i) {
                var parent = lstParent[i];
                parent.setOpacity(0);
                for (var j = 0; j < 3; ++j) {
                    var node = parent.getNode(j);
                    node.runAction(cc.fadeIn(9 * UNIT_TIME));
                }
            }
        }

        node = this._lstBackCollect[gameType];
        if (node) {
            var collect = node.getRes();
            if (collect && collect.node) {
                collect.node.setOpacity(0);
                this._setAniFireVisible(collect.node, false, cc.sequence(
                    cc.delayTime(7 * UNIT_TIME),
                    cc.show()
                ));
                collect.node.runAction(this._createEnterAction());
            }
        }

        this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_FREE_UI, gameType + 9);
        this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_BETA_CHGSCENE, 1);
    },

    _onBetaGameEnterEnd: function() {
        this._nodeIconMgr.reset();

        this._setCtrlGameType();
        this._refreshWheelImg();

        var nextState = ELEMENTAL_ANI_STATE.STATE_NONE;
        if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            this._iFGWindExtendIndex = 0;
            nextState = ELEMENTAL_ANI_STATE.STATE_BETA_DISPLAY_ICON;
        }
        else if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_WATER) {
            nextState = ELEMENTAL_ANI_STATE.STATE_BETA_DISPLAY_ICON;
        }

        if (nextState == ELEMENTAL_ANI_STATE.STATE_NONE){
            this._bStopWheel = true;
        }

        this._setState(nextState);
    },

    _onBetaGameExit: function() {
        var time = 0.01;
        if (this._iLastType != this._iGameType) {
            time = 0.5;
        }

        this._setIsVia(false);
        this._setCtrlGameType();
        this._nodeIconMgr.reset();

        this._onBetaGameExitChgScene();

        this._setAniTime(time);
    },

    _onBetaGameExitChgScene: function() {
        var gameType = this._logic.getGameType();
        if (this._iLastType === gameType)
            return;

        var node = this._lstBackNode[this._iLastType];
        if (node) {
            var self = this;
            node.runAction(this._createExitAction(function() {
                self._curSpine = undefined;
                self._curSpineParent = undefined;
                self._gameLayer.refreshGameSceneElements();
            }))
        }

        node = this._lstBackSpine[this._iLastType];
        var parent = this._lstBackSpineParent[this._iLastType];
        if (node && parent) {
            this._curSpine = node;
            this._curSpineParent = parent;

            var spine = node.getRes();
            if (spine && spine.node) {
                spine.node.setPremultipliedAlpha(255);
                parent.setOpacity(255);

                for (var i = 0; i < 3; ++i) {
                    parent.getNode(i).runAction(cc.fadeOut(9 * UNIT_TIME));
                }
            }
        }

        var lstSpine = this._lstBackSpine1[this._iLastType];
        var lstParent = this._lstBackSpineParent1[this._iLastType];
        if (lstSpine && lstParent) {
            this._lstCurSpine = lstSpine;
            this._lstCurSpineParent = lstParent;

            for (var i = 0; i < lstSpine.length; ++i) {
                var spine = lstSpine[i];
                spine.getRes().node.setPremultipliedAlpha(255);
            }

            for (var i = 0; i < lstParent.length; ++i) {
                var parent = lstParent[i];
                parent.setOpacity(255);
                for (var j = 0; j < 3; ++j) {
                    var node = parent.getNode(j);
                    node.runAction(cc.fadeOut(9 * UNIT_TIME));
                }
            }
        }

        node = this._lstBackCollect[this._iLastType];
        if (node) {
            var collect = node.getRes();
            if (collect && collect.node) {
                collect.node.runAction(this._createExitAction());
            }
        }

        this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_FREE_UI, gameType + 9);
        this._moduleUI._setState(ELEMENTAL_UI_STATE.STATE_BETA_CHGSCENE, 2);
    },

    _onBetaGameExitEnd: function() {
        this._refreshWheelImg();

        this._bStopWheel = true;
        this._setState(ELEMENTAL_ANI_STATE.STATE_NONE);
    },


    _createEnterAction: function(callfunc) {
        return cc.sequence(
            cc.delayTime(7 * UNIT_TIME),
            cc.fadeIn(9 * UNIT_TIME),
            cc.callFunc(callfunc)
        )
    },

    _createExitAction: function(callfunc) {
        return cc.sequence(
            cc.delayTime(7 * UNIT_TIME),
            cc.fadeOut(9 * UNIT_TIME),
            cc.callFunc(callfunc)
        )
    },

    _chgBackNodeZOrder: function(gameType) {
        for (var i = 0; i < this._lstBackNode.length; ++i) {
            this._lstBackNode[i].setZOrder(0);
        }

        var node = this._lstBackNode[gameType];
        if (node) {
            node.setZOrder(1);
        }

        return node;
    },

    _onInitBetaSoil: function() {
        var logicDataEx = this._logic.server2client(this._logic.getLogicDataEx());
        this._setNormalWheelData(logicDataEx);
    },

    _onInitBetaWater: function() {
        var logicDataEx = this._logic.server2client(this._logic.getLogicDataEx());
        this._setNormalWheelData(logicDataEx);
    },

    _onInitBetaFire: function() {
        this._displayFGFireMul();
    },

    _onInitBetaWind: function() {
        var data = this._logic.getFGWindData();
        if (data) {
            var rect = data.rect;
            if (data.upgrade) {
                rect = data.upgrade[data.upgrade.length - 1];
            }

            this._nodeIconMgr.displayFGWindMegaWild(rect);
        }
    },

    _onBetaGameDisplayIconAni: function() {
        var time = 0.01;
        if (this._iGameType == ELEMENTAL_GAME_TYPE.GAME_FG_WATER) {
            var lstData = this._logic.getFGWaterData();
            time = this._nodeIconMgr.playFGWaterBetaDisplayAni(lstData);

            if (this._bBetaGame)
                time += BETA_GAME_DELAY;
        }
        else if (this._iGameType == ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            var data = this._logic.getFGWindData();
            if (data) {
                time = this._nodeIconMgr.playFGWindBetaDisplayAni(data.rect);

                if (this._bBetaGame)
                    time += BETA_GAME_DELAY;
            }
        }

        this._setAniTime(time);
    },

    _onBetaGameDisplayIconAniEnd: function() {
        var nextState = ELEMENTAL_ANI_STATE.STATE_NONE;

        if (this._iGameType == ELEMENTAL_GAME_TYPE.GAME_FG_WATER) {
            var lstData = this._logic.getFGWaterData();
            this._nodeIconMgr.displayFGWaterIceWild(lstData);
        }
        else if (this._iGameType == ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            this._displayFGWindMegaWild();
            this._iFGWindExtendIndex = 0;
            nextState = ELEMENTAL_ANI_STATE.STATE_FG_WIND_EXTEND;
        }

        if (nextState == ELEMENTAL_ANI_STATE.STATE_NONE) {
            this._bStopWheel = true;
        }

        this._setState(nextState);
    },

    _setAniFireVisible: function(node, visible, action) {
        if (node) {
            var aniFire = findNodeByName(node, "aniFire");
            if(aniFire) {
                aniFire.setVisible(visible);

                if (action) {
                    aniFire.runAction(action);
                }
            }
        }
    }
});
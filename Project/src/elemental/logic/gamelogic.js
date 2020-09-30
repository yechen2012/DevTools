var SPIN_DEF = {
    ROW : 3,
    COL : 5
};

var LIST_SYMBOLS = {
    WL: 0,
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    J: 9,
    K: 10,
    FG: 11
};

var ELEMENTAL_LIST_ICON_IMG = [
    ["elemental_icon00.png", "elemental_icon01.png", "elemental_icon02.png", "elemental_icon03.png", "elemental_icon04.png", "elemental_icon05.png", "elemental_icon06.png", "elemental_icon07.png", "elemental_icon08.png", "elemental_icon09.png", "elemental_icon10.png", "elemental_icon11.png"],
    ["elemental_icon14.png", "elemental_icon01.png", "elemental_icon02.png", "elemental_icon03.png", "elemental_icon04.png", "elemental_icon05.png", "elemental_icon06.png", "elemental_icon07.png", "elemental_icon08.png", "elemental_icon09.png", "elemental_icon10.png", "elemental_icon11.png"],
    ["elemental_icon12.png", "elemental_icon01.png", "elemental_icon02.png", "elemental_icon03.png", "elemental_icon04.png", "elemental_icon05.png", "elemental_icon06.png", "elemental_icon07.png", "elemental_icon08.png", "elemental_icon09.png", "elemental_icon10.png", "elemental_icon11.png"],
    ["elemental_icon15.png", "elemental_icon01.png", "elemental_icon02.png", "elemental_icon03.png", "elemental_icon04.png", "elemental_icon05.png", "elemental_icon06.png", "elemental_icon07.png", "elemental_icon08.png", "elemental_icon09.png", "elemental_icon10.png", "elemental_icon11.png"],
    ["elemental_icon13.png", "elemental_icon01.png", "elemental_icon02.png", "elemental_icon03.png", "elemental_icon04.png", "elemental_icon05.png", "elemental_icon06.png", "elemental_icon07.png", "elemental_icon08.png", "elemental_icon09.png", "elemental_icon10.png", "elemental_icon11.png"],
];

var ELEMENTAL_LIST_ICON_IMG_BLUR = [
    ["elemental_icon_blur_00.png", "elemental_icon_blur_01.png", "elemental_icon_blur_02.png", "elemental_icon_blur_03.png", "elemental_icon_blur_04.png", "elemental_icon_blur_05.png", "elemental_icon_blur_06.png", "elemental_icon_blur_07.png", "elemental_icon_blur_08.png", "elemental_icon_blur_09.png", "elemental_icon_blur_10.png", "elemental_icon_blur_11.png"],
    ["elemental_icon_blur_14.png", "elemental_icon_blur_01.png", "elemental_icon_blur_02.png", "elemental_icon_blur_03.png", "elemental_icon_blur_04.png", "elemental_icon_blur_05.png", "elemental_icon_blur_06.png", "elemental_icon_blur_07.png", "elemental_icon_blur_08.png", "elemental_icon_blur_09.png", "elemental_icon_blur_10.png", "elemental_icon_blur_11.png"],
    ["elemental_icon_blur_12.png", "elemental_icon_blur_01.png", "elemental_icon_blur_02.png", "elemental_icon_blur_03.png", "elemental_icon_blur_04.png", "elemental_icon_blur_05.png", "elemental_icon_blur_06.png", "elemental_icon_blur_07.png", "elemental_icon_blur_08.png", "elemental_icon_blur_09.png", "elemental_icon_blur_10.png", "elemental_icon_blur_11.png"],
    ["elemental_icon_blur_15.png", "elemental_icon_blur_01.png", "elemental_icon_blur_02.png", "elemental_icon_blur_03.png", "elemental_icon_blur_04.png", "elemental_icon_blur_05.png", "elemental_icon_blur_06.png", "elemental_icon_blur_07.png", "elemental_icon_blur_08.png", "elemental_icon_blur_09.png", "elemental_icon_blur_10.png", "elemental_icon_blur_11.png"],
    ["elemental_icon_blur_13.png", "elemental_icon_blur_01.png", "elemental_icon_blur_02.png", "elemental_icon_blur_03.png", "elemental_icon_blur_04.png", "elemental_icon_blur_05.png", "elemental_icon_blur_06.png", "elemental_icon_blur_07.png", "elemental_icon_blur_08.png", "elemental_icon_blur_09.png", "elemental_icon_blur_10.png", "elemental_icon_blur_11.png"],
];

var ELEMENTAL_LIST_ICON_ANI = [];

var GAME_MODULE_NAME_FG = "elemental_fg";
var GAME_MODULE_NAME_BG = "elemental_bg";

var LIST_BET = [1, 2, 5, 10, 20, 50, 100, 160, 500, 1000, 1600, 2000];

var ELEMENTAL_GAME_TYPE = {
    GAME_BG : 0,
    GAME_FG_FIRE : 1,
    GAME_FG_SOIL : 2,
    GAME_FG_WIND : 3,
    GAME_FG_WATER : 4
};

// 某坐标的周围八个坐标变化量
var ELEMENTAL_POINT_VAR = [
    { x: -1, y: -1},
    { x: 0, y: -1},
    { x: 1, y: -1},
    { x: -1, y: 0},
    { x: 1, y: 0},
    { x: -1, y: 1},
    { x: 0, y: 1},
    { x: 1, y: 1},
];

// 风元素游戏，收集wilds个数与等级的关系, 0, 1, 2, 3
var ELEMENTAL_WIND_LV_CNT = [0, 2, 5, 9];
var ELEMENTAL_WIND_LV_MAX = [2, 3, 4];

// 风元素游戏，Rect 等级与point个数关系
var ELEMENTAL_WIND_RECT_POINTS_CNT = [2, 4, 6, 9];

var ELEMENTAL_WIND_EXTEND_DIRECTION = {
    DIRECTION_UP : 0,
    DIRECTION_RIGHT : 1,
    DIRECTION_DOWN : 2,
    DIRECTION_LEFT : 3
};

var ELEMENTAL_WIND_EXTEND_POINT = [
    {x: 0, y: -1},
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 0}
];

var ELEMENTAL_WIND_LIMIT = [0, 4, 2, 0];

var ElementalLogic = cc.Class.extend({
    ctor: function() {

        this._logicData = undefined; // 服务器下发的原生轮子数据
        this._logicDataEx = undefined; // 经过变换处理的轮子数据
        this._logicDataExWind = undefined; // 经过变换处理的轮子数据，风元素专用
        this._specialData = undefined; // wild效果后的轮子，未受影响的icon为-1；

        this._logicDataFormat = undefined; // 转换成客户端格式的轮子数据

        this._bBetaGame = false; // 是否是体验版公主转游戏；
        this._iGameType = 0; // 免费游戏类型.0:普通游戏 1：地 2：水 3：火 4：风
        this._iWin = 0;
        this._iFreeNum = 0;
        this._bAddFreeNum = false;
        this._iFreeTotalWin = 0;
        this._bLuckyFree = false; // 是否是随机赠送的免费游戏；
        this._iMyMoney = 0;

        this._iBet = 0;
        this._iTurnNums = 0;
        this._iTurnWin = 0;
        this._iRealWin = 0;
        this._iBalance = 0;
        this._iTotalWin = 0;
        this._iWonaMount = 0;

        this._iFGFireMul = 0;
        this._iFGWindWildsCnt = 0;

        this._lstFGSoilData = [];
        this._lstFGSoilLogicDataEx = [];
        this._lstFGWaterData = [];
        this._lstFGFireData = [];
        this._FGWindData = {};
        this._lastFGWindData = undefined;
        this._lstFGWindWildPoints = [];

        this._resultData = undefined; // 结果数据

        this._lstCanLight = new Array(SPIN_DEF.COL);
        this._bHasLight = false;

        this._init();
    },

    getBet: function() {
        return this._iBet;
    },

    getTurnNums: function() {
        return this._iTurnNums;
    },

    getTurnWin: function() {
        return this._iTurnWin;
    },

    getRealWin: function() {
        return this._iRealWin;
    },

    getBalance: function() {
        return this._iBalance;
    },

    getTotalWin: function() {
        return this._iTotalWin;
    },

    // createTestData: function() {
    //     this._iGameType = ELEMENTAL_GAME_TYPE.GAME_FG_WIND;
    //
    //     var lastData = {};
    //     var data = {};
    //
    //     var points = [];
    //
    //     points.push(new ElementalPoint(0, 1));
    //     points.push(new ElementalPoint(1, 1));
    //
    //     lastData.lv = 0;
    //     lastData.rect = this._createRect(lastData.lv, points);
    //
    //     data.lastRect = lastData.rect;
    //     data.lastLv = lastData.lv;
    //     data.rect = lastData.rect;
    //     data.lv = 1;
    //     data.upgrade = this._createWindUpgradeList(data);
    //
    //     this._lastFGWindData = lastData;
    //     this._FGWindData = data;
    // },

    getLstSymbols: function() {
        return LIST_SYMBOLS;
    },

    /*
    * 获取Icon图片
    * @param type: number, 类型 0：普通游戏 1：Free1 2: Free2 3: Free3 4: Free4
    * @return list
    * */
    getLstIconImg: function(type) {
        if (type < 0 || type > 4)
            return [];

        return ELEMENTAL_LIST_ICON_IMG[type];
    },

    /*
    * 获取Icon模糊图片
    * @param type: number, 类型 0：普通游戏 1：Free1 2: Free2 3: Free3 4: Free4
    * @return list
    * */
    getLstIconBlurImg: function(type) {
        if (type < 0 || type > 4)
            return [];

        return ELEMENTAL_LIST_ICON_IMG_BLUR[type];
    },

    /*
    * 获取客户端概念上，某列的元素中，指定图标的位置数组
    * @param col: number 指定列
    * @param iconData: 指定图标
    * @return Array
    *
    * */
    getLstIconPointInCol: function(col, iconData) {
        var lst = [];
        if (col !== undefined && iconData !== undefined) {
            if (this._logicData) {
                var lstRow = undefined;
                for (var i = 0; i < this._logicData.length; ++i) {
                    lstRow = this._logicData[i];
                    if (lstRow[col] === iconData) {
                        lst.push(new ElementalPoint(col, i));
                    }
                }
            }
        }

        return lst;
    },

    getIconAniRun: function(type) {
        if (type < 0 || type > 4)
            return [];

        return ELEMENTAL_LIST_ICON_ANI[type]
    },

    getLogicData: function() {
        return this._logicData;
    },

    getLogicDataEx: function() {
        return this._logicDataEx;
    },

    getLogicDataFormat: function() {
        return this._logicDataFormat;
    },

    getSpinWin: function() {
        return this._iWin;
    },

    getMyMoney: function() {
        return this._iMyMoney;
    },

    isFreeGame: function() {
        return this._iGameType !== 0 && !this._bBetaGame;
    },

    isBetaGame: function() {
        return this._bBetaGame;
    },

    getGameType: function() {
        return this._iGameType;
    },

    getFreeNum: function() {
        return this._iFreeNum;
    },

    isAddFreeNum: function() {
        return this._bAddFreeNum;
    },

    getFreeTotalWin: function() {
        if (this._iWonaMount > 0) {
            return Math.min(this._iFreeTotalWin, this._iWonaMount);
        }

        return this._iFreeTotalWin;
    },

    getFGSoilData: function() {
        return this._lstFGSoilData;
    },

    getFGSoilLogicDataEx: function() {
        return this._lstFGSoilLogicDataEx;
    },

    getFGWaterData: function() {
        return this._lstFGWaterData;
    },

    getFGFireMul: function() {
        return this._iFGFireMul;
    },

    getFGWindData: function() {
        return this._FGWindData;
    },

    getFGWindCollectWildCnt: function() {
        return this._iFGWindWildsCnt;
    },

    /*
    * 判断轮子是否需要亮起来
    * @param wheelIndex: 轮子id
    * @return boolean
    * */
    canLight: function (wheelIndex) {
        var ret = this._lstCanLight[wheelIndex];

        this._bHasLight = this.hasNextLight(wheelIndex);

        return ret;
    },

    hasLight: function() {
        return this._bHasLight;
    },

    hasNextLight: function(wheelIndex) {
        var ret = false;
        for (var i = wheelIndex + 1; i < this._lstCanLight.length; ++i) {
            if (this._lstCanLight[i]) {
                ret = true;
                break;
            }
        }

        return ret;
    },

    /*
    * 获取到某列某个icon的总个数
    * @return number
    * */
    getIconCount: function(index, targetIcon) {
        var count = 0;

        if (this._logicDataFormat) {
            for (var i = 0; i <= index; ++i) {
                var lstIcon = this._logicDataFormat[i];
                for (var j = 0; j < lstIcon.length; ++j) {
                    if (targetIcon === lstIcon[j])
                        ++count;
                }
            }
        }

        return count;
    },

    isLuckyFree: function() {
        return this._bLuckyFree;
    },

    checkIsLuckyFree: function() {
        var count = 0;
        var ret = false;
        for (var i = 0; i < SPIN_DEF.COL; ++i) {
            if (this._hasIcon(i, LIST_SYMBOLS.FG)) {
                ++count;
            }
        }

        if (count < 3)
            ret = true;

        cc.log("_checkIsLuckyFree, isLuckyFree", ret);

        this._bLuckyFree = ret;

        return ret;
    },

    /*
    * 查找轮子数据中对应列有没有某个icon
    *
    * */
    _hasIcon: function(col, targetIcon) {
        var ret = false;
        for (var i = 0; i < this._logicData.length; ++i) {
            var lst = this._logicData[i];
            if (col >= lst.length)
                break;

            if (lst[col] == targetIcon) {
                ret = true;
                break;
            }
        }

        return ret;
    },

    onMyMoney: function(myMoney) {
        this._iMyMoney = myMoney;
        this._iBalance = myMoney;
    },

    onGameModuleInfo: function(msgObj) {
        if (!msgObj)
            return;

        this._iWin = 0;

        if (msgObj.gamemodulename === GAME_MODULE_NAME_BG) {
            this._iGameType = 0;

            this._resetFGData();
        }

        var gmi = msgObj.gmi;
        if (gmi) {
            this._resetLogicData(gmi.lstarr);

            if (gmi.lstarr) {
                this._logicData = this._cloneArr(gmi.lstarr);
                this._logicDataFormat = this.server2client(this._logicData);
            }

            if (gmi.curkey !== undefined) {
                this._iGameType = gmi.curkey + 1; // 服务端下发数据为0~3，因此此处+1处理
            }

            // 若
            if (msgObj.gamemodulename === GAME_MODULE_NAME_BG && this._iGameType !== ELEMENTAL_GAME_TYPE.GAME_BG) {
                this._bBetaGame = true;
            }
            else {
                this._bBetaGame = false;
            }

            // // 风元素游戏不能将普通轮子中的wild带入特殊轮子
            // if (this._iGameType !== ELEMENTAL_GAME_TYPE.GAME_FG_WIND)
                this._logicDataEx = this._clone(this._logicData);

            if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_FIRE && gmi.multiplier !== undefined) {
                // 火，freeType = 3; 奖励倍数
                this._iFGFireMul = gmi.multiplier;
            }

            if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND && gmi.collectWildsCnt !== undefined) {
                this._iFGWindWildsCnt = gmi.collectWildsCnt;

                // 最多只能收集9个，此处限定住
                if (this._iFGWindWildsCnt > 9) {
                    this._iFGWindWildsCnt = 9;
                }
            }

            if ((this._iGameType !== ELEMENTAL_GAME_TYPE.GAME_BG || this._bBetaGame) && gmi.specialWildsArr) {
                this._handleFreeWildsArr(gmi.specialWildsArr);
            }

            var lastFreeNum = this._iFreeNum;

            var spinRet = gmi.spinret;
            if (spinRet) {
                // 服务器新添加了转换过程，客户端不需要再转换了
                // this._handleScatterPosition(spinRet);
                if (spinRet.wonamount) {
                    this._iWonaMount = spinRet.wonamount;
                }

                this._iWin = spinRet.realwin;
                this._iFreeNum = spinRet.fgnums;

                this._iBet = spinRet.bet;
                this._iRealWin = spinRet.realwin;
                this._iTotalWin = spinRet.totalwin;
            }

            if (this.isFreeGame() && gmi.lastnums > lastFreeNum) {
                this.checkIsLuckyFree();
                this._bAddFreeNum = true;
            }

            this._iFreeNum = gmi.lastnums;
            this._iFreeTotalWin = gmi.totalwin;
            this._iWin = gmi.turnwin;

            this._iTurnWin = gmi.turnwin;
            this._iTurnNums = gmi.turnnums;
        }

        if (this._iGameType !== ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            this._lastFGWindData = undefined;
        }

        if (!this._logicData && this._iGameType !== 0) {
            // 这表示进免费的消息，清空一下免费的游戏数据
            this._lstFGSoilData = [];
            this._lstFGWaterData = [];
            this._lstFGFireData = [];
            this._FGWindData = {};
        }

        // 分模块处理一下免费游戏数据
        switch (this._iGameType) {
            case ELEMENTAL_GAME_TYPE.GAME_FG_SOIL :
                this._handleFGSoilData();
                break;
            case ELEMENTAL_GAME_TYPE.GAME_FG_WATER :
                this._handleFGWaterData();
                break;
            case ELEMENTAL_GAME_TYPE.GAME_FG_FIRE :
                break;
            case ELEMENTAL_GAME_TYPE.GAME_FG_WIND :
                if (this._bBetaGame) {
                    this._handleBetaFGWindData();
                }
                else {
                    this._addFGWindStartData();
                    this._handleFGWindData();
                }

                break;
        }

        this._checkCanLight();

        if (ELEMENTAL_DEBUG_FG_FIRE) {
            this._iGameType = ELEMENTAL_GAME_TYPE.GAME_FG_FIRE;
        }

        if (ELEMENTAL_DEBUG_FG_WIND) {
            this._iGameType = ELEMENTAL_GAME_TYPE.GAME_FG_WIND;
        }

        if (ELEMENTAL_DEBUG_FG_SOIL) {
            this._iGameType = ELEMENTAL_GAME_TYPE.GAME_FG_SOIL;
        }

        if (ELEMENTAL_DEBUG_FG_WATER) {
            this._iGameType = ELEMENTAL_GAME_TYPE.GAME_FG_WATER;
        }

        // this._creatTestDataFGSoil();
        // this._handleFGWaterData();
    },

    _checkCanLight: function() {
        for (var i = 0; i < this._lstCanLight.length; ++i) {
            var can = this._canLight(i);
            this._lstCanLight[i] = can;
            if (can) {
                this._bHasLight = true;
            }
        }
    },

    _canLight: function(wheelIndex) {
        var ret = false;

        if (wheelIndex == undefined) {
            ret = false;
        }
        else {
            var c1num = 0;
            for (var i = 0; i < wheelIndex; ++i) {
                if (this._hasIcon(i, LIST_SYMBOLS.FG)) {
                    ++c1num;
                }
            }

            if (c1num > 1) {
                ret = true;
            }

            if ((c1num === 1 && wheelIndex > 3) || (c1num === 2 && wheelIndex > 4)) {
                ret = false;
            }
        }

        if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            var rect = this._FGWindData.rect;
            if (rect.lv >= 3) {
                // 满级3x3风WILD，肯定不会出现SC期待动画
                ret = false;
            }
            else if (rect.lv === 2) {
                // 若该列被2x3的风WILD覆盖，也不会出现SC期待动画
                if (this._isPointInside(new ElementalPoint(wheelIndex, 0), rect.points)){
                    ret = false;
                }
            }
        }

        return ret;
    },

    _cloneArr: function(arr) {
        var ret = [];
        for (var i = 0; i < arr.length; ++i) {
            var temp = [];
            for (var j = 0; j < arr[i].length; ++j) {
                temp.push(arr[i][j]);
            }

            ret.push(temp);
        }

        return ret;
    },

    _handleScatterPosition: function(spinRet) {
        if (!spinRet || !spinRet.lst)
            return;

        var lstLine = spinRet.lst;
        var line = undefined;
        for (var i = 0; i < lstLine.length; ++i) {
            line = lstLine[i];
            if (line.type === "scatter") {
                this._convertLinePosition(line);
            }
        }
    },

    /*
    * 将type = scatter的中奖坐标转换为 客户端模式
    * */
    _convertLinePosition: function(lineData) {
        if (!lineData.positions)
            return;

        var lstPos = lineData.positions;
        var lstNewPos = [];
        for (var i = 0; i < lstPos.length; ++i) {
            lstNewPos.push({
                x: lstPos[i].y,
                y: lstPos[i].x
            });
        }

        lineData.positions = lstNewPos;
    },

    /*
    * 将轮子数据，由服务器格式转换为客户端格式
    * 例： 3行5列轮子
    * 由 [
    *       [0, 0, 0, 0, 0],
    *       [0, 0, 0, 0, 0],
    *       [0, 0, 0, 0, 0],
    *    ]
    * 转换为
    *    [
    *        -  -  -  -  -
    *        0  0  0  0  0
    *        0  0  0  0  0
    *        0  0  0  0  0
    *        -  -  -  -  -
    *    ]
    * */
    server2client: function(lstData) {
        var lstClient = [];
        if (lstData) {
            for (var i = 0; i < 5; i++) {
                var data = [0, 0, 0];
                for (var j = 0; j < 3; j++) {
                    data[j] = lstData[3 - j - 1][i];
                }

                lstClient.push(data);
            }
        }

        return lstClient;
    },

    isValidData: function(lstData) {
        var ret = false;
        if (lstData && lstData.length > 0) {
            if (lstData[0] instanceof Array && lstData[0].length > 0 && lstData[0][0] !== -1)
                ret = true;
        }

        return ret;
    },

    // 转换rect到显示格式（即basePoint为左下点）
    // 注意：此方法不会修改原rect，仅返回一个新的rect副本, 但points数据仍引用原rect的points数组
    convertToDisplayRect: function(rect) {
        var ret = {};
        if (rect) {
            ret.basePoint = this._findBasePoint(rect.points);
            ret.points = rect.points;
            ret.lv = rect.lv;
            ret.direction = rect.direction;
        }

        return ret;
    },

    isEqualRect: function(rect1, rect2) {
        var ret = true;
        if (rect1 && rect2) {
            if (!rect1.basePoint.isEqual(rect2.basePoint))
                ret = false;

            if (!rect1.points || !rect2.points)
                ret = false;

            if (ret) {
                if (rect1.points.length !== rect2.points.length)
                    ret = false;
            }

            if (ret) {
                for (var i = 0; i < rect1.points.length; ++i) {
                    if (!rect1.points[i].isEqual(rect2.points[i])){
                        ret = false;
                        break;
                    }
                }
            }
        }
        else {
            ret = false;
        }

        return ret;
    },

    _init: function() {
        ELEMENTAL_LIST_ICON_ANI.push([res.ElementalIconRunAni00_json, res.ElementalIconRunAni01_json, res.ElementalIconRunAni02_json, res.ElementalIconRunAni03_json, res.ElementalIconRunAni04_json, res.ElementalIconRunAni05_json, res.ElementalIconRunAni06_json, res.ElementalIconRunAni07_json, res.ElementalIconRunAni08_json, res.ElementalIconRunAni09_json, res.ElementalIconRunAni10_json, res.ElementalIconRunAni11_json]);

        ELEMENTAL_LIST_ICON_ANI.push([res.ElementalIconRunAni14_json, res.ElementalIconRunAni01_json, res.ElementalIconRunAni02_json, res.ElementalIconRunAni03_json, res.ElementalIconRunAni04_json, res.ElementalIconRunAni05_json, res.ElementalIconRunAni06_json, res.ElementalIconRunAni07_json, res.ElementalIconRunAni08_json, res.ElementalIconRunAni09_json, res.ElementalIconRunAni10_json, res.ElementalIconRunAni11_json]);

        ELEMENTAL_LIST_ICON_ANI.push([res.ElementalIconRunAni12_json, res.ElementalIconRunAni01_json, res.ElementalIconRunAni02_json, res.ElementalIconRunAni03_json, res.ElementalIconRunAni04_json, res.ElementalIconRunAni05_json, res.ElementalIconRunAni06_json, res.ElementalIconRunAni07_json, res.ElementalIconRunAni08_json, res.ElementalIconRunAni09_json, res.ElementalIconRunAni10_json, res.ElementalIconRunAni11_json]);

        ELEMENTAL_LIST_ICON_ANI.push([res.ElementalIconRunAni15_json, res.ElementalIconRunAni01_json, res.ElementalIconRunAni02_json, res.ElementalIconRunAni03_json, res.ElementalIconRunAni04_json, res.ElementalIconRunAni05_json, res.ElementalIconRunAni06_json, res.ElementalIconRunAni07_json, res.ElementalIconRunAni08_json, res.ElementalIconRunAni09_json, res.ElementalIconRunAni10_json, res.ElementalIconRunAni11_json]);

        ELEMENTAL_LIST_ICON_ANI.push([res.ElementalIconRunAni13_json, res.ElementalIconRunAni01_json, res.ElementalIconRunAni02_json, res.ElementalIconRunAni03_json, res.ElementalIconRunAni04_json, res.ElementalIconRunAni05_json, res.ElementalIconRunAni06_json, res.ElementalIconRunAni07_json, res.ElementalIconRunAni08_json, res.ElementalIconRunAni09_json, res.ElementalIconRunAni10_json, res.ElementalIconRunAni11_json]);

        this._initData();

        for (var i = 0; i < this._lstCanLight.length; ++i) {
            this._lstCanLight[i] = false;
        }
    },

    _initData: function() {
        this._iWin = 0;

        this._logicData = [];
        this._specialData = [];
        this._logicDataEx = [];

        for (var i = 0; i < SPIN_DEF.ROW; ++i) {
            var lst = [];
            for (var j = 0; j < SPIN_DEF.COL; ++j) {
                lst.push(-1);
            }

            this._logicData.push(lst);
        }

        this._specialData = this._clone(this._logicData);
        this._logicDataEx = this._clone(this._logicData);
        this._logicDataExWind = this._clone(this._logicData);
    },

    _resetLogicData: function(bResetLogicData) {
        this._bAddFreeNum = false;
        this._iFreeTotalWin = 0;

        for (var i = 0; i < SPIN_DEF.ROW; ++i) {
            for (var j = 0; j < SPIN_DEF.COL; ++j) {
                if (bResetLogicData)
                    this._logicData[i][j] = -1;

                this._specialData[i][j] = -1;
                this._logicDataEx[i][j] = -1;
                this._logicDataExWind[i][j] = -1;
            }

        }
    },

    _resetFGData: function() {
        this._iFGFireMul = 0;
        this._iFGWindWildsCnt = 0;
        this._iFreeNum = 0;
        this._bAddFreeNum = false;
        this._iFreeTotalWin = 0;

        this._lstFGSoilData = [];
        this._lstFGWaterData = [];
        this._lstFGFireData = [];
        this._FGWindData = {};
        this._lastFGWindData = undefined;
        this._lstFGWindWildPoints = [];
    },

    _handleFreeWildsArr: function(arr) {
        this._specialData = this._cloneArr(arr);

        // 添加特效处理后的轮子数据
        if (!this._logicDataEx || this._logicDataEx.length === 0)
            return;

        for (var i = 0; i < SPIN_DEF.ROW; ++i) {
            for (var j = 0; j < SPIN_DEF.COL; ++j) {
                if (arr[i][j] !== -1) {
                    this._logicDataEx[i][j] = arr[i][j];
                    this._logicDataExWind[i][j] = arr[i][j];
                }
            }
        }
    },

    _handleFGSoilData: function() {
        if (!this._logicData || this._logicData.length === 0)
            return;

        this._iSoilWildCount = 0;
        this._lstSourcePoint = []; // 拓展起源点数组
        this._lstNewSourcePoint = undefined;
        this._lstFGSoilData = [];
        this._lstFGSoilPointFlag = {};
        this._lstFGSoilLogicDataEx = [];

        // 第一步：获取所有受影响的图标数量，用作拓展对比
        for (var i = 0; i < SPIN_DEF.ROW; ++i) {
            for (var j = 0; j < SPIN_DEF.COL; ++j) {
                // 统计图标个数
                if (this._specialData[i][j] === LIST_SYMBOLS.WL) {
                    ++this._iSoilWildCount;
                }

                // 起源点
                if (this._logicData[i][j] === LIST_SYMBOLS.WL) {
                    this._lstSourcePoint.push(new ElementalPoint(j, i));
                }
            }
        }

        while (this._lstSourcePoint && this._lstSourcePoint.length > 0) {
            var lstTurnData = this._createFGSoilTurnData();
            this._lstFGSoilData.push(lstTurnData);

            this._addFGSoilLogicDataEx(lstTurnData);

            this._lstSourcePoint = this._lstNewSourcePoint;

            if (this._iSoilWildCount <= 0) {
                break;
            }
        }

        if (this._iSoilWildCount > 0) {
            cc.log("Elemental FGSoil error！！！！！！\n")

            for (var row = 0; row < SPIN_DEF.ROW; ++row) {
                for (var col = 0; col < SPIN_DEF.COL; ++col) {
                    if (this._specialData[row][col] === LIST_SYMBOLS.WL && !this._lstFGSoilPointFlag[col][row]) {
                        cc.log("More Point: { ", row, ", ", col, " };\n");
                    }
                }
            }
        }
    },

    _addFGSoilLogicDataEx: function(lstTurnData) {
        var logic = this._logicData;
        if (this._lstFGSoilLogicDataEx.length > 0) {
            logic = this._lstFGSoilLogicDataEx[this._lstFGSoilLogicDataEx.length - 1];
        }

        var logicEx = this._cloneArr(logic);
        for (var i = 0; i < lstTurnData.length; ++i) {
            var lstTurnPoints = lstTurnData[i].points;
            for (var j = 0; j < lstTurnPoints.length; ++j) {
                var point = lstTurnPoints[j];
                logicEx[point.y][point.x] = LIST_SYMBOLS.WL;
            }
        }

        this._lstFGSoilLogicDataEx.push(logicEx);
    },

    _createFGSoilTurnData: function() {
        var lstData = [];
        this._lstNewSourcePoint = [];

        for(var i = 0; i < this._lstSourcePoint.length; ++i) {
            var point = this._lstSourcePoint[i];
            var data = this._createFGSoilData(point.y, point.x);
            if (data)
                lstData.push(data);
        }

        if (this._lstNewSourcePoint.length === 0) {
            this._lstNewSourcePoint = undefined;
        }

        return lstData;
    },

    _createFGSoilData: function(row, col) {
        if (!this._lstFGSoilPointFlag[col]) {
            this._lstFGSoilPointFlag[col] = {};
        }

        this._lstFGSoilPointFlag[col][row] = true;

        var ret = {
            base : new ElementalPoint(col, row),
            points : []
        };

        for (var i = 0; i < ELEMENTAL_POINT_VAR.length; ++i) {
            var point = this._pointAdd(ret.base, ELEMENTAL_POINT_VAR[i]);
            if (!point)
                continue;

            if (!this._lstFGSoilPointFlag[point.x]) {
                this._lstFGSoilPointFlag[point.x] = {};
            }

            if (!this._lstFGSoilPointFlag[point.x][point.y]) {
                if (this._specialData[point.y][point.x] === LIST_SYMBOLS.WL) {
                    this._lstFGSoilPointFlag[point.x][point.y] = true;
                    ret.points.push(point);
                    this._lstNewSourcePoint.push(point);
                    --this._iSoilWildCount;
                }
            }
        }

        if (ret.points.length === 0) {
            ret = undefined;
        }

        return ret;
    },

    _handleFGWaterData: function() {
        if (!this._specialData)
            return;

        this._lstFGWaterData = [];

        for (var i = 0; i < this._specialData.length; i++) {
            var lst = this._specialData[i];
            for (var j = 0; j < lst.length; ++j) {
                if (lst[j] === LIST_SYMBOLS.WL) {
                    // this._lstFGWaterData.push({ x: j,y: i});
                    this._lstFGWaterData.push(new ElementalPoint(j, i));

                    // 若水wild需要覆盖的图标是SC，那么在数据层面将其替换成任一低级图标，以防穿帮
                    if (this._logicData[i][j] === LIST_SYMBOLS.FG) {
                        this._logicData[i][j] = this._getLowIconData();
                    }
                }
            }
        }
    },

    /*
    * 处理试玩版风元素游戏数据
    * */
    _handleBetaFGWindData: function() {
        if (!this._logicData || this._logicData.length == 0 || !this._specialData)
            return;

        var windData = {};
        var lv = this._collectCnt2Lv(this._iFGWindWildsCnt).lv;
        var points = [];
        for (var i = 0; i < this._specialData.length; ++i) {
            var lst = this._specialData[i];
            for (var j = 0; j < lst.length; ++j) {
                if (lst[j] === LIST_SYMBOLS.WL) {
                    points.push(new ElementalPoint(j, i));
                }
            }
        }

        cc.log("_handleBetaFGWindData, lv = ", lv, "; points.length = ", points.length);

        var startRect = this._createBetaFGWindStartRect(lv, points);

        // 试玩版风元素总是从0开始升级
        windData.rect = startRect;
        windData.lv = 0;

        if(lv > 0) {
            windData.upgrade = this._createBetaWindUpgradeList(windData, lv, points);
        }

        this._FGWindData = windData;

        this._chgLogicData();

        // 试玩版风不需要收集
        // this._handleFGWindCollectData();
    },

    _createBetaFGWindStartRect: function(lv, points) {
        // 获取左上方向极限值
        var leftVal = this._getLimitationValue(points, ELEMENTAL_WIND_EXTEND_DIRECTION.DIRECTION_LEFT);
        var upVal = this._getLimitationValue(points, ELEMENTAL_WIND_EXTEND_DIRECTION.DIRECTION_UP);

        var lstPoints = [];
        lstPoints.push(new ElementalPoint(leftVal, upVal));

        var rightPoint = new ElementalPoint(leftVal + 1, upVal);

        // 此处右边的点，正确的情况下是必然存在的
        if (this._isPointInside(rightPoint, points)) {
            lstPoints.push(rightPoint);
        }
        else {
            cc.log("ElementalLogic:_createBetaFGWindStartRect, rightPoint is error");
        }

        var rect = this._createRect(0, lstPoints);
        return rect;
    },

    // 免费开始时，添加风元素的初始数据
    _addFGWindStartData: function() {

        // 判断是否满足添加条件（所有SpecialData = -1为满足）
        for (var i = 0; i < this._specialData.length; ++i) {
            var lst = this._specialData[i];
            for (var j = 0; j < lst.length; ++j) {
                if (lst[j] !== -1) {
                    return;
                }
            }
        }

        var col = Math.floor(Math.random() * 4);
        var row = Math.floor(Math.random() * 2);

        this._specialData[row][col] = LIST_SYMBOLS.WL;
        this._specialData[row][col + 1] = LIST_SYMBOLS.WL;

        // 备注：若进入免费时的FG 与WL 图标也需要替换，则需要做如下操作；
        // this._logicDataEx[row][col] = LIST_SYMBOLS.WL;
        // this._logicDataEx[row][col + 1] = LIST_SYMBOLS.WL;
    },

    /*
    * 处理风元素游戏数据
    * this._FGWindData = {
            lastLv : 0,
            lv : 0,
            lastRect : { lv : 0, points : [] },
            rect: { lv : 0, points : [] },
            upgrade: [ rectObj, rectObj ],
            collect: {
                lastLv : 0,
                lastFire : 0,
                lv: 0,
                fire : 0, // fire点数
                lstCollect: [ { lv: 0, fire: 0, display: { lv: 0, fire: 0 }, upgrade: false } ],
            }
        };
    *
    *
    * */
    _handleFGWindData: function() {
        if (!this._logicData || this._logicData.length === 0 || !this._specialData)
            return;

        this._lastFGWindData = this._FGWindData;
        var windData = {};

        var lv = this._collectCnt2Lv(this._iFGWindWildsCnt).lv;

        var lastLv = this._lastFGWindData.lv;
        if (lastLv === undefined) {
            lastLv = lv;
        }

        windData.lastLv = lastLv;
        windData.lv = lv;

        if (this._lastFGWindData.upgrade) {
            windData.lastRect = this.convertToDisplayRect(this._lastFGWindData.upgrade[this._lastFGWindData.upgrade.length - 1]);
        }
        else {
            windData.lastRect = this._lastFGWindData.rect;
        }

        var points = [];
        for (var i = 0; i < this._specialData.length; ++i) {
            var lst = this._specialData[i];
            for (var j = 0; j < lst.length; ++j) {
                if (lst[j] === LIST_SYMBOLS.WL) {
                    points.push(new ElementalPoint(j, i));
                }
            }
        }

        windData.rect = this._createRect(windData.lastLv, points);

        if (lv > windData.lastLv) {
            windData.upgrade = this._createWindUpgradeList(windData);
        }

        this._FGWindData = windData;

        this._handleFGWindCollectData();

        var str = "";
        for (var i = 0; i < this._logicData.length; ++i) {
            var array = this._logicData[i];

            str += "[ ";
            for (var j = 0; j < array.length; ++j) {
                str += array[j] + ", "
            }

            str += "], \n";
        }

        cc.log("chg front: logic data: ==========================\n", str);

        str = "";
        for (var i = 0; i < this._logicDataEx.length; ++i) {
            var array = this._logicDataEx[i];

            str += "[ ";
            for (var j = 0; j < array.length; ++j) {
                str += array[j] + ", "
            }

            str += "], \n";
        }

        cc.log("chg front: logic data EX: ===========================\n", str);

        // 替换被WILD覆盖的图标；
        this._chgLogicData();

        str = "";
        for (var i = 0; i < this._logicData.length; ++i) {
            var array = this._logicData[i];

            str += "[ ";
            for (var j = 0; j < array.length; ++j) {
                str += array[j] + ", "
            }

            str += "], \n";
        }

        cc.log("chg back: logic data: =================================\n ", str);    },

    /*
    * 将被WILD覆盖的图标替换为随机低级图标
    * */
    _chgLogicData: function() {
        for (var i = 0; i < this._logicDataExWind.length; ++i) {
            var array = this._logicDataExWind[i];
            for (var j = 0; j < array.length; ++j) {
                if (array[j] !== -1 && this._logicData[i][j] === LIST_SYMBOLS.FG) {
                    var iconData = this._getLowIconData();;
                    this._logicData[i][j] = iconData;
                    this._logicDataEx[i][j] = iconData;
                }
            }
        }
    },

    _getLowIconData: function() {
        return Math.floor(Math.random() * 5) + 5;
    },

    _findFGWindWildPoint: function() {
        this._lstFGWindWildPoints = [];
        var lstCollect = [];

        // 仅收集
        for (var i = 0; i < 5; ++i) {
            for (var j = 0; j < this._logicData.length; ++j) {
                var icon = this._logicData[j][i];
                if (icon === LIST_SYMBOLS.WL && icon !== this._logicDataExWind[j][i]) {
                    lstCollect.push(new ElementalPoint(i, j));
                }
            }
        }

        // TODO：先收集，收集完成后再升级，因此屏蔽排序操作
        this._lstFGWindWildPoints = lstCollect;

        return;

        // 排序，注意：在收集过程中，将被升级后的大WILD新覆盖掉的点优先收集
        // 没有升级过程则可以避免掉排序
        if (!this._FGWindData.upgrade) {
            this._lstFGWindWildPoints = lstCollect;
            return;
        }

        var lstMask = [];
        for(var i = 0; i < this._FGWindData.upgrade.length; ++i) {
            var lst = undefined;
            if (i == 0) {
                lst = this._getDiffPoints(this._FGWindData.rect, this._FGWindData.upgrade[i]);
            }
            else {
                lst = this._getDiffPoints(this._FGWindData.upgrade[i - 1], this._FGWindData.upgrade[i]);
            }

            for (var j = 0; j < lst.length; ++j) {
                lstMask.push(lst[j]);
            }
        }

        // 排序，被遮盖的优先放入
        for (var i = lstCollect.length - 1; i >= 0; --i) {
            var hs = false;
            for (var j = 0; j < lstMask.length; ++j) {
                if (lstCollect[i].isEqual(lstMask[j])) {
                    var hs = true;
                    break;
                }
            }

            if (hs) {
                this._lstFGWindWildPoints.push(lstCollect[i]);
                lstCollect.splice(i, 1);
            }
        }

        // 剩余的也添加进去
        for (var i = 0; i < lstCollect.length; ++i) {
            this._lstFGWindWildPoints.push(lstCollect[i]);
        }
    },

    _getDiffPoints: function(rect1, rect2) {
        var lstPoints = [];

        if (rect1.lv !== rect2.lv) {

            // 若rect2等级低则翻转一下
            if (rect1.lv > rect2.lv) {
                var test = rect1;
                rect1 = rect2;
                rect2 = test;
            }

            for (var i = 0; i < rect2.points.length; ++i) {
                var hasEqual = false;

                for (var j = 0; j < rect1.points.length; ++j) {
                    if (rect2.points[i].isEqual(rect1.points[j])) {
                        hasEqual = true;
                        break;
                    }
                }

                if (!hasEqual) {
                    lstPoints.push(rect2.points[i]);
                }
            }
        }

        return lstPoints;
    },

    _handleFGWindCollectData: function() {
        // 查找可以收集的点
        this._findFGWindWildPoint();

        var lastData = this._lastFGWindData;
        var data = this._FGWindData;
        var collectData = {};

        // collect等级同大风图标等级：0， 1， 2， 3
        if (lastData.collect) {
            collectData.lastLv = lastData.collect.lv;
            collectData.lastFire = lastData.collect.fire;
        }
        else {
            collectData.lastLv = data.lv;
        }

        collectData.lv = data.lv;
        collectData.fire = this._collectCnt2Lv(this._iFGWindWildsCnt).fire;

        // 填充lastFire，若lastFire不存在，则直接显示当前的fire点数
        if (collectData.lastFire === undefined) {
            collectData.lastFire = collectData.fire;
        }

        // 收集过程, 等级提升，或者是fire点数提升都表示产生了收集过程
        if (collectData.lv > collectData.lastLv || collectData.fire > collectData.lastFire) {
            collectData.lstCollect = this._createCollectProgress(collectData);
        }

        data.collect = collectData;
    },

    _createCollectProgress: function(collectData) {
        var list = [];

        var fireStart = this._collectLv2Cnt(collectData.lastLv, collectData.lastFire) + 1;
        var fireEnd = this._collectLv2Cnt(collectData);

        for (var i = fireStart; i <= fireEnd; ++i) {
            var lvData = this._collectCnt2Lv(i);

            if (lvData.lv > 0 && lvData.fire === 0) {
                lvData.upgrade = {
                    lv: lvData.lv - 1,
                    fire: ELEMENTAL_WIND_LV_MAX[lvData.lv - 1],
                }
            }

            // // 收集满了，就不需要继续收集了, 等级到3级，或者点数>4个，就不需要收集了
            // if (lvData.lv > 2 || lvData.fire > 4) {
            //     break;
            // }

            if (this._lstFGWindWildPoints.length > 0) {
                // 添加收集物起始点
                lvData.point = this._lstFGWindWildPoints[0];
                this._lstFGWindWildPoints.splice(0, 1);

                list.push(lvData);
            }
            else {
                cc.log("FGWind collect data error!!!");
                // cc.pause();
            }
        }

        return list;
    },

    _collectCnt2Lv: function(cnt) {
        var lv = 0;
        var fire = 0;
        for (var i =  ELEMENTAL_WIND_LV_CNT.length - 1; i >= 0; --i) {
            if (cnt >= ELEMENTAL_WIND_LV_CNT[i]) {
                lv = i;
                fire = cnt - ELEMENTAL_WIND_LV_CNT[i];
                break;
            }
        }

        return {lv: lv, fire: fire};
    },

    _collectLv2Cnt: function(data, fire) {
        var cnt = 0;
        if (fire !== undefined) {
            cnt = ELEMENTAL_WIND_LV_CNT[data] + fire;
        }
        else {
            cnt = ELEMENTAL_WIND_LV_CNT[data.lv] + data.fire;
        }

        return cnt;
    },

    // 根据最终WindData及最终等级情况，创建升级历程中的Rect；
    _createWindUpgradeList: function(windData) {
        var ret = undefined;
        if (windData) {
            ret = [];
            var rect = windData.rect;
            for (var i = windData.lastLv; i < windData.lv; ++i) {
                rect = this._createRect(i + 1, rect.points, rect.display !== undefined ? rect.display.basePoint : rect.basePoint);
                rect.display = this.convertToDisplayRect(rect);
                ret.push(rect);
            }
        }

        return ret;
    },

    // 根据初始WindData及最终等级和listPoints情况，创建升级试玩版风元素升级历程中的Rect；
    _createBetaWindUpgradeList: function(windData, lv, lstPoints) {
        var ret = undefined;
        if (windData && lv != undefined && lstPoints) {
            ret = [];
            var rect = windData.rect;
            for (var i = windData.lv; i < lv; ++i) {
                rect = this._createRect(i + 1, rect.points, rect.display != undefined ? rect.display.basePoint : rect.basePoint);
                rect.display = this.convertToDisplayRect(rect);
                ret.push(rect);
            }
        }

        return ret;
    },

    /*
    * 创建一个rect
    * @param lv 等级
    * @param lstPoints rect必然包含的points数组
    * @param basePoint, rect的基础点，可缺省，默认左下点
    * */
    _createRect: function(lv, lstPoints, basePoint) {
        var rect = {};
        rect.lv = lv;
        rect.points = this._clone(lstPoints);

        if (basePoint && this._isPointInside(basePoint, rect.points)) {
            rect.basePoint = basePoint;
        }
        else {
            rect.basePoint = this._findBasePoint(rect.points);
        }

        if (ELEMENTAL_WIND_RECT_POINTS_CNT[lv] > rect.points.length) {
            rect.direction = this._extendPoints(lv, rect.points);
        }

        return rect;
    },

    _isPointInside: function(point, lstPoint) {
        var ret = false;
        for (var i = 0; i < lstPoint.length; ++i) {
            var temp = lstPoint[i];
            if (point.x === temp.x && point.y === temp.y) {
                ret = true;
                break;
            }
        }

        return ret;
    },

    _findBasePoint: function(lstPoints) {
        var basePoint = lstPoints[0];

        for (var i = 1; i < lstPoints.length; ++i) {
            var point = lstPoints[i];
            if (point.x <= basePoint.x && point.y >= basePoint.y) {
                basePoint = point;
            }
        }

        return basePoint;
    },

    // 拓展points
    _extendPoints: function(lv, lstPoints) {
        var targetCnt = ELEMENTAL_WIND_RECT_POINTS_CNT[lv];
        var diff = targetCnt - lstPoints.length;

        var direction = -1;
        if (diff === 2 && (lv === 1 || lv === 2)) {
            direction = this._getCanExtendType(lstPoints, [ELEMENTAL_WIND_EXTEND_DIRECTION.DIRECTION_DOWN, ELEMENTAL_WIND_EXTEND_DIRECTION.DIRECTION_UP]);
        }
        else if (diff === 3 && lv === 3) {
            direction = this._getCanExtendType(lstPoints, [ELEMENTAL_WIND_EXTEND_DIRECTION.DIRECTION_RIGHT, ELEMENTAL_WIND_EXTEND_DIRECTION.DIRECTION_LEFT]);
        }

        if (direction !== -1) {
            var temp = this._findPoints(lstPoints, direction);
            var varPoint = ELEMENTAL_WIND_EXTEND_POINT[direction];
            for (var i = 0; i < temp.length; ++i) {
                // var point = this._addPoint(temp[i], varPoint);
                var point = temp[i].add(varPoint);
                lstPoints.push(point);
            }
        }

        return direction;
    },

    _getCanExtendType: function(lstPoints, lstDir) {
        var ret = ELEMENTAL_WIND_EXTEND_DIRECTION.DIRECTION_DOWN;
        for (var i = 0; i < lstDir.length; ++i) {
            var dir = lstDir[i];
            var limitValue = this._getLimitationValue(lstPoints, dir);
            if (limitValue !== ELEMENTAL_WIND_LIMIT[dir]) {
                ret = dir;
                break;
            }
        }

        return ret;
    },

    /*
    * 查找对应位置的点集合
    * @param lstPoints, 点集合
    * @param type，位置，0上 1右 2下 3左
    * */
    _findPoints: function(lstPoints, type) {
        var ret = [];
        var value = this._getLimitationValue(lstPoints, type);
        if (type === ELEMENTAL_WIND_EXTEND_DIRECTION.DIRECTION_UP || type === ELEMENTAL_WIND_EXTEND_DIRECTION.DIRECTION_DOWN) {
            for (var i = 0; i < lstPoints.length; ++i) {
                if (value === lstPoints[i].y) {
                    ret.push(lstPoints[i]);
                }
            }
        }
        else {
            for (var i = 0; i < lstPoints.length; ++i) {
                if (value === lstPoints[i].x) {
                    ret.push(lstPoints[i]);
                }
            }
        }

        return ret;
    },

    /*
    * 查找对应位置的极限值
    * @param lstPoints, 点集合
    * @param type，位置，0上 1右 2下 3左
    * */
    _getLimitationValue: function(lstPoints, type) {
        var ret = 0;

        if (lstPoints && lstPoints.length > 0) {
            if (type === ELEMENTAL_WIND_EXTEND_DIRECTION.DIRECTION_UP || type === ELEMENTAL_WIND_EXTEND_DIRECTION.DIRECTION_DOWN) {
                lstPoints.sort(this._sortByY);

                if (type === ELEMENTAL_WIND_EXTEND_DIRECTION.DIRECTION_UP) {
                    ret = lstPoints[0].y;
                }
                else {
                    ret = lstPoints[lstPoints.length - 1].y;
                }
            }
            else {
                lstPoints.sort(this._sortByX);

                if (type === ELEMENTAL_WIND_EXTEND_DIRECTION.DIRECTION_RIGHT) {
                    ret = lstPoints[lstPoints.length - 1].x;
                }
                else {
                    ret = lstPoints[0].x;
                }
            }
        }
        else {
            cc.log("lstPoints is null");
        }

        return ret;
    },

    _sortByY: function(v1, v2) {
        var ret = 0;
        if (v1.y < v2.y) {
            ret =  -1;
        }
        else if (v1.y > v2.y) {
            ret = 1;
        }

        return ret;
    },

    _sortByX: function(v1, v2) {
        var ret = 0;
        if (v1.x < v2.x) {
            ret =  -1;
        }
        else if (v1.x > v2.x) {
            ret = 1;
        }

        return ret;
    },

    _clone: function(inArr) {
        var ret = [];

        if (inArr) {
            for (var i = 0; i < inArr.length; ++i) {
                if (inArr[i] instanceof Array) {
                    ret.push(this._clone(inArr[i]));
                }
                else {
                    var value = inArr[i];
                    if (value._name && value._name === "ElementalPoint")
                        value = value.clone();

                    ret.push(value);
                }
            }
        }

        return ret;
    },

    _pointAdd: function(point, variable) {
        var ret = {
            x: point.x + variable.x,
            y: point.y + variable.y
        };

        // 边界检查
        if (ret.x < 0 || ret.y < 0 || ret.x > 4 || ret.y > 2)
            ret = undefined;

        return ret;
    },


    _creatTestDataFGSoil: function() {
        this._logicData[1][1] = LIST_SYMBOLS.WL;
        this._logicData[2][3] = LIST_SYMBOLS.WL;

        this._specialData[1][1] = LIST_SYMBOLS.WL;
        this._specialData[2][3] = LIST_SYMBOLS.WL;

        this._specialData[0][0] = LIST_SYMBOLS.WL;
        // this._specialData[1][0] = LIST_SYMBOLS.WL;
        this._specialData[2][0] = LIST_SYMBOLS.WL;
        this._specialData[1][2] = LIST_SYMBOLS.WL;
        this._specialData[2][2] = LIST_SYMBOLS.WL;
        // this._specialData[0][2] = LIST_SYMBOLS.WL;
        this._specialData[2][1] = LIST_SYMBOLS.WL;


        // this._specialData[2][2] = LIST_SYMBOLS.WL;
        // this._specialData[1][3] = LIST_SYMBOLS.WL;
        // this._specialData[2][4] = LIST_SYMBOLS.WL;
        // this._specialData[1][4] = LIST_SYMBOLS.WL;

        this._handleFGSoilData();
    },

    createTestMsg01: function() {
        var lst = [];

        // 1
        lst.push({
            "msgid": "gamemoduleinfo",
            "gamemodulename": "elemental_fg",
            "gameid": 493,
            "gmi": {
                "isspinend": true,
                "lstarr": [
                    [1,4,2,10,6],
                    [9,5,7,7,2],
                    [ 2,0,4,4,8]
                ],
                "spinret": {
                    "totalwin": 50000,
                    "bet": 100,
                    "times": 1,
                    "lines": 30,
                    "lst": [
                        {
                            "type": "line",
                            "symbol": 2,
                            "data": {
                                "line": 23,
                                "paytype": "lr"
                            },
                            "bet": 100,
                            "multiplies": 500,
                            "win": 50000,
                            "positions": [
                                {
                                    "x": 0,
                                    "y": 2
                                },
                                {
                                    "x": 1,
                                    "y": 2
                                },
                                {
                                    "x": 2,
                                    "y": 0
                                },
                                {
                                    "x": 3,
                                    "y": 2
                                },
                                {
                                    "x": 4,
                                    "y": 2
                                }
                            ],
                            "hasw": true
                        }
                    ],
                    "fgnums": 0,
                    "linewin": 0,
                    "realwin": 50000
                },
                "lastnums": 4,
                "totalnums": 10,
                "totalwin": 79500,
                "turnwin": 50000,
                "turnnums": 1,
                "bet": 100,
                "curkey": 2,
                "multiplier": 1,
                "collectWildsCnt": 0,
                "specialWildsArr": [
                    [
                        -1,
                        -1,
                        -1,
                        0,
                        0
                    ],
                    [
                        -1,
                        -1,
                        -1,
                        -1,
                        -1
                    ],
                    [
                        -1,
                        -1,
                        -1,
                        -1,
                        -1
                    ]
                ],
                "isinit": false
            }
        });

        // 2
        lst.push({
            "msgid": "gamemoduleinfo",
            "gamemodulename": "elemental_fg",
            "gameid": 493,
            "gmi": {
                "isspinend": true,
                "lstarr": [
                    [1,4,2,10,6],
                    [9,5,7,7,2],
                    [ 2,0,4,4,8]
                ],
                "spinret": {
                    "totalwin": 50000,
                    "bet": 100,
                    "times": 1,
                    "lines": 30,
                    "lst": [
                        {
                            "type": "line",
                            "symbol": 2,
                            "data": {
                                "line": 23,
                                "paytype": "lr"
                            },
                            "bet": 100,
                            "multiplies": 500,
                            "win": 50000,
                            "positions": [
                                {
                                    "x": 0,
                                    "y": 2
                                },
                                {
                                    "x": 1,
                                    "y": 2
                                },
                                {
                                    "x": 2,
                                    "y": 0
                                },
                                {
                                    "x": 3,
                                    "y": 2
                                },
                                {
                                    "x": 4,
                                    "y": 2
                                }
                            ],
                            "hasw": true
                        }
                    ],
                    "fgnums": 0,
                    "linewin": 0,
                    "realwin": 50000
                },
                "lastnums": 4,
                "totalnums": 10,
                "totalwin": 79500,
                "turnwin": 50000,
                "turnnums": 1,
                "bet": 100,
                "curkey": 2,
                "multiplier": 1,
                "collectWildsCnt": 1,
                "specialWildsArr": [
                    [
                        -1,
                        -1,
                        -1,
                        -1,
                        -1
                    ],
                    [
                        -1,
                        -1,
                        -1,
                        -1,
                        -1
                    ],
                    [
                        -1,
                        -1,
                        -1,
                        0,
                        0
                    ]
                ],
                "isinit": false
            }
        });

        // 3
        lst.push({
            "msgid": "gamemoduleinfo",
            "gamemodulename": "elemental_fg",
            "gameid": 493,
            "gmi": {
                "isspinend": true,
                "lstarr": [
                    [0,0,0,2,6],
                    [0,0,7,0,0],
                    [0,0,4,0,0]
                ],
                "spinret": {
                    "totalwin": 50000,
                    "bet": 100,
                    "times": 1,
                    "lines": 30,
                    "lst": [
                        {
                            "type": "line",
                            "symbol": 2,
                            "data": {
                                "line": 23,
                                "paytype": "lr"
                            },
                            "bet": 100,
                            "multiplies": 500,
                            "win": 50000,
                            "positions": [
                                {
                                    "x": 0,
                                    "y": 2
                                },
                                {
                                    "x": 1,
                                    "y": 2
                                },
                                {
                                    "x": 2,
                                    "y": 0
                                },
                                {
                                    "x": 3,
                                    "y": 2
                                },
                                {
                                    "x": 4,
                                    "y": 2
                                }
                            ],
                            "hasw": true
                        }
                    ],
                    "fgnums": 0,
                    "linewin": 0,
                    "realwin": 50000
                },
                "lastnums": 4,
                "totalnums": 10,
                "totalwin": 79500,
                "turnwin": 50000,
                "turnnums": 1,
                "bet": 100,
                "curkey": 2,
                "multiplier": 1,
                "collectWildsCnt": 9,
                "specialWildsArr": [
                    [
                        -1,
                        -1,
                        -1,
                        0,
                        0
                    ],
                    [
                        -1,
                        -1,
                        -1,
                        -1,
                        -1
                    ],
                    [
                        -1,
                        -1,
                        -1,
                        -1,
                        -1
                    ]
                ],
                "isinit": false
            }
        });

        return lst;
    }
});
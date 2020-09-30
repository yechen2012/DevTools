var WIN2_ANIMATION_TYPE = {
    WIN_1: 0,
    WIN_2: 1,
    WIN_MAX: 4
};

var WIN2_ANIMATION_STATE = {
    STATE_SHOW: 0,         // 出现
    STATE_LOOP: 2,         // 循环
    STATE_DIS: 3,          // 消失
    STATE_MAX: 4
};

var GameModuleWin2 = cc.Class.extend({

    ctor: function (data) {

        this._gameLayer = data.gameLayer;

        this._gameNode = data.gameNode;

        this._lstWinAniChgNum = [0, 0, 1.9, 2.3];

        this._lstCallBack = [];

        this._touchCallBack = undefined;

        this._funcSelf = undefined;

        this._lstPlayOrder = [0, 1, 2];        // 播放顺序

        this._lstAnimationName = [];

        this._lstWinEffect = [];                // 音效

        this._finishMoney_mp3 = undefined;

        this._addMoney_mp3 = undefined;

        this._canLoopEnd = [];           //动画循环能否播完

        this._lstWinMul = [0, 3, 7];      // 赢钱倍数

        this._aniChgPos = undefined;     //!动画移动坐标值

        this._intwinpos = undefined;     //!动画初始坐标

        this._isTouch = false;           // 是否可以点击

        if (data.hasOwnProperty("lstPlayOrder")) {
            this._lstPlayOrder = data.lstPlayOrder
        }

        if (data.hasOwnProperty("animationName")) {
            this._lstAnimationName = data.animationName;
        }
        else {

            this._lstAnimationName.push({
                begin: {ctrlAniName: "win01", actionName: "winBegin"},
                loop: {ctrlAniName: "win02", actionName: "loop", time: 1.5},
                end: {ctrlAniName: "win03", actionName: "winEnd"}
            });

            this._lstAnimationName.push({
                begin: {ctrlAniName: "bigwin01", actionName: "bigwinBegin"},
                loop: {ctrlAniName: "bigwin02", actionName: "loop", time: 2},
                end: {ctrlAniName: "bigwin03", actionName: "bigwinEnd"}
            });

            this._lstAnimationName.push({
                begin: {ctrlAniName: "megawin01", actionName: "megawinBegin"},
                loop: {ctrlAniName: "megawin02", actionName: "loop", time: 5},
                end: {ctrlAniName: "megawin03", actionName: "megawinEnd"}
            });
        }

        if (data.hasOwnProperty("lstWinRes")) {
            //this._lstWinRes = [res.FranceWinAni1_json, res.FranceWinAni2_json, res.FranceWinAni3_json, res.FranceWinAni4_json];
            this._lstWinRes = data.lstWinRes;
        }
        else {
            if (lstWinRes) {
                this._lstWinRes = lstWinRes;
            }
        }

        if (data.hasOwnProperty("touchCallBack")) {
            this._touchCallBack = data.touchCallBack
        }

        if (data.hasOwnProperty("funcSelf")) {
            this._funcSelf = data.funcSelf
        }

        if (data.hasOwnProperty("lstWinEffect")) {
            this._lstWinEffect = data.lstWinEffect;
        }

        if (data.hasOwnProperty("lstWinAniType")) {
            this._lstWinAniType = data.lstWinAniType
        }
        else {
            this._lstWinAniType = [0, 1];        //! 0一次性 1分3阶段
        }

        if (data.hasOwnProperty("addMoney")) {
            this._addMoney_mp3 = data.addMoney;
        }

        // if (data.hasOwnProperty("finishMoney")) {
        //     this._finishMoney_mp3 = data.finishMoney;
        // }

        this._text = undefined;

        this._bHasTextAni = true;

        this._ctrlAni = undefined;

        this._winAni = undefined;

        this._curAniInfo = undefined;

        this._isChange = false;

        this._chgValueSpeed = 0;

        this._chgValue = 0;

        this._chgTime = 0;

        this._winValue = 0;

        this._winShowValue = 0;

        this._winBaseNum = 0;

        this._winSPTime = 0;

        this._winCurLevel = 0;

        this._winMaxLevel = 0;

        this._noTouchState = undefined;

        this._bTextAniLoop = false;

        this._state = WIN2_ANIMATION_STATE.STATE_MAX;

        this._type = WIN2_ANIMATION_TYPE.WIN_MAX;


        this.createLstCallBack();
    },

    createLstCallBack: function () {

        for (var nIndex = 0; nIndex < this._lstAnimationName.length + 1; ++nIndex) {
            this._lstCallBack.push([]);
        }
    },

    setOrderInfo: function (arr) {
        this._lstPlayOrder = arr;
    },

    setEndCallBack: function (func, self) {
        this._lstCallBack[2].push([func, self]);
    },

    setBeginCallBack: function (func, self) {
        this._lstCallBack[1].push([func, self]);
    },

    setPlayInfo: function (type, state) {

        this._type = type;

        this._state = state;
    },

    setWinValue: function (value) {
        this._winValue = value;
    },

    setWinAniChgPos: function (pos) {
        this._aniChgPos = pos;
    },

    setHasTextAni: function (bHasTextAni) {
        this._bHasTextAni = bHasTextAni;
    },

    setWinMul: function (lstWinMul) {
        this._lstWinMul = lstWinMul;
    },

    setCanLoopEnd: function (loopend) {
        this._canLoopEnd = loopend;
    },

    getCanLoopEnd: function (level) {
        return this._canLoopEnd[level];
    },

    getLoopAniName: function (level) {
        return this._lstAnimationName[level].loop.ctrlAniName;
    },

    setWinBaseNum: function (value) {
        this._winBaseNum = value;
    },

    setShowNums: function (value) {
        this._winShowValue = value;
    },

    setMaxLevel: function (level) {
        this._winMaxLevel = level;
    },

    setCurLevel: function (level) {
        this._winCurLevel = level;
    },

    //!检查动画循环是否结束
    checkAniLoopEnd: function (level) {
        if (this._canLoopEnd.length <= 0)
            return;

        var self = this;
        this._ctrlAni.animation.setMovementEventCallFunc(function (send, type, movenentID) {
            if (type === ccs.MovementEventType.loopComplete && movenentID === self.getLoopAniName(level)) {
                self._canLoopEnd[level] = false;
            }
        })
    },

    // 是否通过
    isVia: function () {
        return this._type === WIN2_ANIMATION_TYPE.WIN_MAX;
    },

    //!设置不能点击的动画状态
    setNoTouchState: function (notouchstate) {
        this._noTouchState = notouchstate;
    },

    //!设置文本动画是否循环
    setTextAniLoop:function(bloop){
        this._bTextAniLoop = bloop
    },
    
    isTouch : function () {
        return this._isTouch;
    },

    touchPanel: function () {

        if (this.isVia())
            return;

        if (!this.isTouch())
            return;

        if (this._lstWinAniType[this._type] === 0) {
            this.win1CallBack();
        }
        else {

            if (this._state === WIN2_ANIMATION_STATE.STATE_DIS)
                return;

            if (this._noTouchState != undefined && this._state == this._noTouchState)
                return;

            this.setCurLevel(this._winMaxLevel);

            this._isChange = false;

            this._state = WIN2_ANIMATION_STATE.STATE_DIS;
        }
    },

    createWinLayer: function () {

        this._winAni = ccs.load(this._lstWinRes[this._type]);

        this._text = findNodeByName(this._winAni.node, "txt_num");

        this._ctrlAni = findNodeByName(this._winAni.node, "ctrlani");

        this._nodeWin = findNodeByName(this._winAni.node, "nodeWin");

        if (this._nodeWin) {
            this._intwinpos = this._nodeWin.getPosition();
        }
        //if (this._text) {
        //    this._text.setString(this.chgString1(0));
        //}

        var exitPanel = findNodeByName(this._winAni.node, "Panel_1");
        exitPanel.setTouchEnabled(false);
        exitPanel.setTouchEnabled(true);

        if (this._touchCallBack && this._funcSelf) {
            exitPanel.addTouchEventListener(this._touchCallBack, this._funcSelf);
        }

        this._gameNode.addChild(this._winAni.node, 2);

        this._winAni.node.runAction(this._winAni.action);

        this._isTouch = true;
    },

    playWin1Animation: function () {

        if (this._winAni)
            return;

        this.createWinLayer();
        if (this._text) {
            this._text.setString(this.chgString1(this._winValue));
        }

        this._winAni.action.play("begin", false);

        this.playSoundEffect(this._type);

        var self = this;

        this._winAni.action.setLastFrameCallFunc(function () {
            self.win1CallBack();
        });
    },

    win1CallBack: function () {
        if(this._winAni) {
            this._winAni.action.clearLastFrameCallFunc();

            if(this._nodeWin)
                this._nodeWin.setPosition(this._intwinpos);

        }

        this.animationOvercallBack(2);

        this.clear();
    },

    playWin2Animation: function (dt) {

        switch (this._state) {
            case WIN2_ANIMATION_STATE.STATE_SHOW: {

                if (!this._winAni) {
                    this.createWinLayer();

                    if (this._text) {
                        this._text.setString(this.chgString1(0));
                    }
                }

                this.playShowAnimation();
            }
                break;
            case WIN2_ANIMATION_STATE.STATE_LOOP: {
                this.updateValue(dt);
            }
                break;
            case WIN2_ANIMATION_STATE.STATE_DIS: {
                this.playEndAnimation();
            }
                break;
            default:
                break;
        }
    },

    playAnimation: function (animationInfo, isPlayText) {

        if (this._ctrlAni) {
            this._ctrlAni.animation.play(animationInfo.ctrlAniName, -1, 0);
        }

        if (isPlayText) {
            if (this._winAni) {
                this._winAni.action.play(animationInfo.actionName, false);
            }
        }

        this._isChange = true;
    },

    playShowAnimation: function () {

        if (this._isChange) {

            if (this._ctrlAni.animation.getCurrentMovementID() === '') {
                this.win2ShowCallBack();
            }
        }
        else {

            this._curAniInfo = this.getAniInfo();

            this._chgValue = this._winBaseNum * this._curAniInfo.loop.time / 24;
            if (this._chgValue <= 0.5)
                this._chgValue = 0.5;

            this.playAnimation(this._curAniInfo.begin, true);

            this.playSoundEffect(this._winCurLevel + 1);

            this.animationBegincallBack(1);

        }
    },

    win2ShowCallBack: function () {

        this._ctrlAni.animation.play(this._curAniInfo.loop.ctrlAniName, -1, 1);

        this._winAni.action.play(this._curAniInfo.loop.actionName, this._bTextAniLoop);

        this._isChange = false;

        this._state = WIN2_ANIMATION_STATE.STATE_LOOP;
    },

    playChangeAnimation: function (level) {

        if (this._isChange) {

            if (this._ctrlAni.animation.getCurrentMovementID() === '') {
                this.win2ChangeCallBack();
            }

            return;
        }

        if (this._winCurLevel === level) {
            return;
        }

        this._curAniInfo = this.getAniInfo();

        this.playAnimation(this._curAniInfo.begin, false);

        this.playSoundEffect(this._winCurLevel + 1);

        if (this._bHasTextAni)
            this._text.runAction(cc.sequence(cc.scaleTo(0.1, 1.5), cc.scaleTo(0.1, 1)));
    },

    win2ChangeCallBack: function () {

        this._ctrlAni.animation.play(this._curAniInfo.loop.ctrlAniName, -1, 1);

        this._isChange = false;
    },

    playEndAnimation: function () {

        if (this._isChange) {

            if (this._ctrlAni) {

                if (this._ctrlAni.animation.getCurrentMovementID() === '') {
                    this.win2EndCallBack();
                }
            }
            else {
                this.win2EndCallBack();
            }
        }
        else {
            this._curAniInfo = this.getAniInfo();

            this.playAnimation(this._curAniInfo.end, true);

            if (this._text) {
                this._text.setString(this.chgString1(this._winValue));
            }
        }
    },

    win2EndCallBack: function () {
        this.animationOvercallBack(2);
        this.clear();

        if (this._nodeWin)
            this._nodeWin.setPosition(this._intwinpos);
    },

    getAniInfo: function () {
        return this._lstAnimationName[this._lstPlayOrder[this._winCurLevel]];
    },

    animationOvercallBack: function (animationNameIndex) {

        var arrFuncInfo = this._lstCallBack[animationNameIndex];

        if (arrFuncInfo.length === 0)
            return;

        var arr = undefined;

        for (var nIndex = 0; nIndex < arrFuncInfo.length; ++nIndex) {
            arr = arrFuncInfo[nIndex];

            arr[0](arr[1]);
        }
    },

    animationBegincallBack: function (animationNameIndex) {

        var arrFuncInfo = this._lstCallBack[animationNameIndex];

        if (arrFuncInfo.length === 0)
            return;

        var arr = undefined;

        for (var nIndex = 0; nIndex < arrFuncInfo.length; ++nIndex) {
            arr = arrFuncInfo[nIndex];

            arr[0](arr[1]);
        }
    },

    updateValue: function (dt) {

        this._winSPTime += dt;

        this._chgTime += dt;

        if (this._winSPTime < 1 / 24)
            return;

        var brefresh = false;
        while (this._winSPTime >= 1 / 24) {
            this._winSPTime -= 1 / 24;

            this._winShowValue += this._chgValue;

            if (this._chgTime > 4) {
                brefresh = true;
            }
        }

        if (brefresh) {
            this._chgValue += this._chgValueSpeed;
        }

        if (this._winShowValue > this._winValue)
            this.setShowNums(this._winValue);

        var curmul = this._winShowValue / this._winBaseNum;

        var level = this._winCurLevel;

        if (curmul >= this._lstWinMul[2])
            this.setCurLevel(2);
        else if (curmul >= this._lstWinMul[1])
            this.setCurLevel(1);
        else
            this.setCurLevel(0);

        this.playChangeAnimation(level);

        this.checkAniLoopEnd(level);

        if (this._winShowValue < this._winValue) {

            this._text.setString(this.chgString_Gray1(Math.floor(this._winShowValue), 20));

            if (this._addMoney_mp3)
                cc.audioEngine.playEffect(this._addMoney_mp3, false);

            return;
        }

        this._text.setString(this.chgString1(this._winValue));

        if (!this._isChange && !this.getCanLoopEnd(level)) {
            this._state = WIN2_ANIMATION_STATE.STATE_DIS;
        }
    },

    chgValueSpeed: function (chgValue) {
        this._chgValueSpeed = chgValue;
    },

    chgString1: function (value) {
        return this._gameLayer.chgString1(value);
    },

    chgString_Gray1: function (num, gnum) {
        return this._gameLayer.chgString_Gray1(num, gnum);
    },

    playSoundEffect: function (type) {
        if (this._lstWinEffect[type])
            cc.audioEngine.playEffect(this._lstWinEffect[type], false);
    },

    setWinPos: function () {
        if (this._aniChgPos == undefined || this._nodeWin == undefined)
            return;

        this._nodeWin.setPosition(this._intwinpos.x + this._aniChgPos.x, this._intwinpos.y + this._aniChgPos.y);

        this._aniChgPos = undefined;
    },

    update: function (dt) {

        if (this.isVia())
            return;

        if (this._lstWinAniType[this._type] === 0) {
            this.playWin1Animation();
        }
        else {
            this.playWin2Animation(dt);
        }

        this.setWinPos();
    },

    clear: function () {

        this._winValue = 0;

        this._winShowValue = 0;

        this._winBaseNum = 0;

        this._winSPTime = 0;

        this._winCurLevel = 0;

        this._chgTime = 0;

        this._chgValueSpeed = 0;

        this._chgValue = 0;

        this._isChange = false;

        this._canLoopEnd = [];

        this._type = WIN2_ANIMATION_TYPE.WIN_MAX;

        this._state = WIN2_ANIMATION_STATE.STATE_MAX;

        if(this._winAni) {
            this._winAni.action.clearLastFrameCallFunc();
            this._winAni.node.removeFromParent();
        }

        //CcsResCache.singleton.release(this._winAni);

        this._winAni = undefined;

        this._isTouch = false;
    }
});

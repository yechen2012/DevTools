var WIN_ANIMATION_TYPE = {
    WIN_1: 0,
    WIN_2: 1,
    WIN_3: 2,
    WIN_4: 3,
    WIN_MAX: 5
};

var WIN_ANIMATION_STATE = {
    STATE_SHOW: 0,         // 出现
    STATE_LOOP: 1,         // 循环
    STATE_DIS: 2,          // 消失
    STATE_MAX: 3
};

var GameModuleWin1 = cc.Class.extend({

    ctor: function (data) {

        this._gameLayer = data.gameLayer;

        this._gameNode = data.gameNode;

        this._lstWinAniChgNum = [0, 0, 1.9, 2.3];

        this._lstCallBack = [];


        this._touchCallBack = undefined;

        this._funcSelf = undefined;

        //this._lstWinEffect = data.lstWinEffect;                // 音效

        this._finishMoney_mp3 = undefined;

        this._addMoney_mp3 = undefined;

        if (data.hasOwnProperty("animationName")) {
            this._lstAnimationName = data.animationName;
        }
        else {
            this._lstAnimationName = [[], [], ["bigwin01", "bigwin02", "bigwin03"], ["megawin01", "megawin02", "megawin03"]];
        }

        if (data.hasOwnProperty("lstCtrlAnimationName")) {
            this._lstCtrlAnimationName = data.lstCtrlAnimationName;
        }
        else {
            this._lstCtrlAnimationName = ["begin", "loop", "end"];
        }

        if (data.hasOwnProperty("lstWinRes")) {
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
            this._lstWinAniType = [0, 0, 1, 1];        //! 0一次性 1分3阶段
        }

        if (data.hasOwnProperty("lstWinAniChgNum")) {
            this._lstWinAniChgNum = data.lstWinAniChgNum;
        }

        if (data.hasOwnProperty("addMoney")) {
            this._addMoney_mp3 = data.addMoney;
        }

        if (data.hasOwnProperty("finishMoney")) {
            this._finishMoney_mp3 = data.finishMoney;
        }

        this._text = undefined;

        this._ctrlAni = undefined;

        this._winValue = 0;

        this._arr = 0;

        this._nIndex = 0;

        this._isTouch = false;           // 是否可以点击

        this._winAni = undefined;

        this._type = WIN_ANIMATION_TYPE.WIN_MAX;

        this._state = WIN_ANIMATION_STATE.STATE_MAX;

        this._curAudio = undefined;

        this.WinAni2SPTime = 0;
        this.WinAni2ChgTime = 0;

        this.createLstCallBack();
    },

    //zjq_start 如果循环动画转到离开动画有跳帧的情况就调用此方法
    addWaitWinAniLoopComplete: function () {
        this._winWaitAniLoopComplete = false;
    },

    createLstCallBack: function () {

        for (var nIndex = 0; nIndex < this._lstCtrlAnimationName.length; ++nIndex) {
            this._lstCallBack.push([]);
        }
    },

    setBeginCallBack: function (func, self) {
        this._lstCallBack[0].push([func, self]);
    },

    setLoopCallBack: function (func, self) {
        this._lstCallBack[1].push([func, self]);
    },

    setEndCallBack: function (func, self) {
        this._lstCallBack[2].push([func, self]);
    },

    setPlayInfo: function (type, state) {

        this._type = type;

        this._state = state;
    },

    setWinValue: function (value) {
        this._winValue = value;

        //this._arr = this.getround(value, Math.floor(value * (1 / 23 ) / this.WinAni2AllTime));

        if (this._type > WIN_ANIMATION_TYPE.WIN_2) {

            var i = Math.floor(this.WinAni2AllTime / (1 / 23));

            this._arr = this.getround(value, i);
        }
    },

    setWinAniAllTime: function (winmul) {

        if (this._type > WIN_ANIMATION_TYPE.WIN_2) {
            this.WinAni2AllTime = winmul / this._lstWinAniChgNum[this._type];
        }
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
            if (this._winWaitAniLoopComplete != undefined && this._state == WIN_ANIMATION_STATE.STATE_LOOP) {
                this.WinAni2ChgTime = this.WinAni2AllTime;
            } else {
                this.playDisAnimation();
            }

        }
    },

    // 是否通过
    isVia: function () {
        return this._type === WIN_ANIMATION_TYPE.WIN_MAX;
    },

    isTouch : function () {
        return this._isTouch;
    },

    getCtrlAniName: function () {
        return this._lstAnimationName[this._type][this._state];
    },

    createWinLayer: function () {

        this._winAni = CcsResCache.singleton.load(this._lstWinRes[this._type]);

        this._text = findNodeByName(this._winAni.node, "txt_num");

        this._ctrlAni = findNodeByName(this._winAni.node, "ctrlani");

        var exitPanel = findNodeByName(this._winAni.node, "Panel_1");
        exitPanel.setTouchEnabled(false);
        exitPanel.setTouchEnabled(true);

        if (this._touchCallBack && this._funcSelf) {
            exitPanel.addTouchEventListener(this._touchCallBack, this._funcSelf);
        }

        this._gameNode.addChild(this._winAni.node, 2);

        this._winAni.node.runAction(this._winAni.action);
        if (this._winAni.action.isAnimationInfoExists(this._lstCtrlAnimationName[0])) {
            this._winAni.action.play(this._lstCtrlAnimationName[0], false);
        } else {
            this._winAni.action.gotoFrameAndPlay(0, this._winAni.action.getDuration(), false);
        }

        this._isTouch = true;
    },

    playWin1Animation: function () {

        if (this._winAni)
            return;

        this.createWinLayer();

        if (this._text) {
            this._text.setString(this.chgString1(this._winValue));
        }

        var self = this;

        this.playSoundEffect(this._type);

        this._winAni.action.setLastFrameCallFunc(function () {
            self.win1CallBack();
        });
    },

    win1CallBack: function () {

        this.animationOvercallBack(2);

        this.clear();
    },

    playWin3Animation: function (dt) {

        var self = this;

        switch (this._state) {
            case WIN_ANIMATION_STATE.STATE_SHOW: {

                if (this._winAni)
                    return;

                this.createWinLayer();

                if (this._text) {
                    this._text.setString(this.chgString1(0));
                }

                this.playSoundEffect(this._type);

                this._ctrlAni.animation.play(this.getCtrlAniName(), -1, 0);

                this._winAni.action.setLastFrameCallFunc(function () {
                    self.win3ShowCallBack();
                });
            }
                break;
            case WIN_ANIMATION_STATE.STATE_LOOP: {
                this.updateValue(dt);
            }
                break;
            case WIN_ANIMATION_STATE.STATE_DIS: {

            }
                break;
            default:
                break;
        }
    },

    win3ShowCallBack: function () {

        this.animationOvercallBack(0);

        this.playLoopAnimation();
    },

    playLoopAnimation: function () {

        this._winAni.action.clearLastFrameCallFunc();

        this._state = WIN_ANIMATION_STATE.STATE_LOOP;

        this._winAni.action.play(this._lstCtrlAnimationName[1], false);

        var actionName = this.getCtrlAniName();
        this._ctrlAni.animation.play(actionName, -1, 1);

        var self = this;
        if (this._winWaitAniLoopComplete != undefined) {
            self._winWaitAniLoopComplete = false;
            this._ctrlAni.animation.setMovementEventCallFunc(function (armatureNode, eventType, movenentID) {
                if (eventType == ccs.MovementEventType.loopComplete) {
                    if (movenentID == actionName && self.WinAni2ChgTime >= self.WinAni2AllTime) {
                        self._winWaitAniLoopComplete = true;
                    }
                }
            });
        }

        if (this._text)
            this._text.setString(this.chgString_Gray1(0, 20));
    },

    win3LoopOverCallBack: function () {

        this.animationOvercallBack(1);

        this.playDisAnimation();
    },

    playDisAnimation: function () {

        if (this._state === WIN_ANIMATION_STATE.STATE_DIS)
            return;

        this._state = WIN_ANIMATION_STATE.STATE_DIS;

        if (this._text)
            this._text.setString(this.chgString1(this._winValue));

        if (this._winAni) {

            this._ctrlAni.animation.play(this.getCtrlAniName(), -1, 0);

            this._winAni.action.play(this._lstCtrlAnimationName[2], false);

            var self = this;

            this._winAni.action.setLastFrameCallFunc(function () {
                self.win3DisCallBack();
            });
        }
    },

    win3DisCallBack: function () {

        this.animationOvercallBack(2);

        this.clear();
    },

    updateValue: function (dt) {

        this.WinAni2SPTime += dt;

        if (this.WinAni2SPTime < 1 / 23)
            return;

        while (this.WinAni2SPTime >= 1 / 23) {
            this.WinAni2ChgTime += 1 / 23;
            this.WinAni2SPTime -= 1 / 23;
        }

        var WinAni2ShowNums = 0;

        if (this.WinAni2ChgTime < this.WinAni2AllTime) {

            //WinAni2ShowNums = Math.floor(this._winValue * this.WinAni2ChgTime / this.WinAni2AllTime);

            // if (this._winValue > 10000) {
            //     WinAni2ShowNums -= ( Math.floor(Math.random() * 100) + Math.floor(Math.random() * 10));
            // }

            if (this._nIndex > this._arr.length) {
                return
            }

            for (var nIndex = 0; nIndex < this._nIndex; ++nIndex) {
                WinAni2ShowNums += this._arr[nIndex];
            }

            ++this._nIndex;

            if (this._addMoney_mp3) {
                cc.audioEngine.playEffect(this._addMoney_mp3, false);
            }

            if (this._text)
                this._text.setString(this.chgString_Gray1(WinAni2ShowNums, 20));
        }
        else {
            if (this._text)
                this._text.setString(this.chgString1(this._winValue));

            if (this._winWaitAniLoopComplete == undefined || this._winWaitAniLoopComplete == true) {
                if (this._winWaitAniLoopComplete != undefined) {
                    this._winWaitAniLoopComplete = false;
                }

                if (this._finishMoney_mp3) {
                    cc.audioEngine.playEffect(this._finishMoney_mp3, false);
                }

                this.win3LoopOverCallBack();
            }
        }
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

    clear: function () {
        this._type = WIN_ANIMATION_TYPE.WIN_MAX;

        this._state = WIN_ANIMATION_STATE.STATE_MAX;

        if (this._winAni) {
            this._winAni.action.clearLastFrameCallFunc();

            //this._winAni.node.removeFromParent();

            CcsResCache.singleton.release(this._winAni);
        }

        this._winAni = undefined;

        this.WinAni2SPTime = 0;

        this.WinAni2ChgTime = 0;

        this._arr = [];

        this._winValue = 0;

        this._nIndex = 0;

        this._isTouch = false;
    },

    chgString1: function (value) {
        return this._gameLayer.chgString1(value);
    },

    chgString_Gray1: function (num, gnum) {
        return this._gameLayer.chgString_Gray1(num, gnum);
    },

    playSoundEffect: function (type) {

        if (this._lstWinEffect == undefined && this._lstWinEffect.length === 0)
            return;

        this._curAudio = cc.audioEngine.playEffect(this._lstWinEffect[type], false);
    },

    stopSound: function () {

        if (this._curAudio) {
            cc.audioEngine.stopEffect(this._curAudio);
            this._curAudio = undefined;
        }
    },

    getround: function (allsum, maxcount) {

        var arr = [];

        var value = 0;

        var dValue = 0;

        var nIndex = 0;

        var value1 = 0;

        //if (allsum > 10000) {

        for (nIndex = 0; nIndex < maxcount; ++nIndex) {

            if (allsum <= maxcount) {
                value = 1;
            }
            else {
                value = Math.floor(allsum / maxcount);
            }

            if (dValue > 0) {
                value += dValue;
                dValue = 0;
            }
            else {
                value1 = Math.floor(Math.random() * Math.floor(value * 0.5));

                if (value1 > 1) {
                    dValue = value - value1;

                    value -= dValue;
                }
            }

            arr.push(value);
        }
        //}
        // else {
        //
        //     for (nIndex = 0; nIndex < maxcount; ++nIndex) {
        //
        //         value = Math.floor(allsum / maxcount);
        //         arr.push(value);
        //     }
        // }

        return arr;
    },

    update: function (dt) {

        if (this.isVia())
            return;

        if (this._lstWinAniType[this._type] === 0) {
            this.playWin1Animation();
        }
        else {
            this.playWin3Animation(dt);
        }
    }
});
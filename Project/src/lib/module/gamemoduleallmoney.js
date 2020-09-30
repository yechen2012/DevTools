/**
 * Created by admin on 2020/4/29.
 */
/*
 *  每轮结束后，本轮金额数字跳到余额动画 2019/5/22 wjh
 * */

var GameModuleAllMoney = cc.Layer.extend({
    ctor:function(data){
        this._super();

        if (data.hasOwnProperty("moduleUI")) {
            this._moduleUI = data.moduleUI;
        }

        if (data.hasOwnProperty("sound")) {
            this._aniSound = data.sound;
        }

        if (data.hasOwnProperty("txtWinRes")) {
            this._txtWinRes = data.txtWinRes;
        }

        if (data.hasOwnProperty("aniDelayTime")) {
            this._aniDelayTime = data.aniDelayTime;
        }

        if (data.hasOwnProperty("txt_num")) {
            this._txt_num = data.txt_num;
        }

        if (data.hasOwnProperty("statename")) {
            this._stateName = data.statename;
        }

        if (data.hasOwnProperty("lstAnimation")) {
            this._lstAnimation = data.lstAnimation;
        }

        if (data.hasOwnProperty("lstAniFrame")) {
            this._lstAniFrame = data.lstAniFrame;
        }

        if (data.hasOwnProperty("aniCallBack")) {
            this._aniCallBack = data.aniCallBack;
        }

        if (data.hasOwnProperty("target")) {
            this._target = data.target;
        }

        this._bShowAni = true;
        if(data == undefined || !data.txtWinRes){
            return  this._bShowAni = false;
        }

        this._txtWinAni = undefined;

        this._lstTxtWinAni = [];

        this._bTxtWinAni = false;

        this._bAniEnd = true;

        this._winValue = 0;

        this._iAniIndex = undefined;

        this.allMoneyFPS = undefined;
    },

    update:function(dt){
        if(this._winValue <= 0)
            return;

        if(!this._bTxtWinAni){
            this._bAniEnd = false;
            this.showTxtWinAni();
        }
        else{
            this.update_TxtWinAni(dt);
        }
    },

    showTxtWinAni:function(){
        if (this._moduleUI) {
            this._moduleUI._setState(this._stateName, 1);
        }

        var str = '';
        var arr = [];
        str = this.chgString(this._winValue);
        arr = str.split('');


        for(var ii = arr.length - 1; ii >= 0; ii--){
            var txt = arr[ii];

            var ani = {};

            ani.delay = (arr.length - ii - 1) * this._aniDelayTime + 0.01;
            ani.txt = txt;

            this._lstTxtWinAni.push(ani);
        }

        this._bTxtWinAni = true;

        if(this._aniSound)
            cc.audioEngine.playEffect(this._aniSound,false);
    },

    update_TxtWinAni:function(dt){
        if(this._lstTxtWinAni.length <= 0 || !this._bTxtWinAni)
            return;

        var aniEnd = true;
        for(var ii = 0; ii < this._lstTxtWinAni.length; ii++){
            var ani = this._lstTxtWinAni[ii];

            if(ani.ani != undefined){
                aniEnd = false;

                if (this._iAniIndex !== undefined && this._lstAniFrame && this._lstAniFrame.length > 0) {
                    if (ani.ani.action.getCurrentFrame() >= this._lstAniFrame[this._iAniIndex][1]) {
                        ani.ani.node.stopAllActions();
                        this.removeChild(ani.ani.node);
                        ani.ani = undefined;
                    }
                }
                else {
                    if(this.allMoneyFPS != undefined){
                        if(ani.ani.action.getCurrentFrame() >= this.allMoneyFPS.BG[1]){
                            ani.ani.node.stopAllActions();
                            this.removeChild(ani.ani.node);
                            ani.ani = undefined;
                        }
                    }else{
                        if(ani.ani.action.getCurrentFrame() >= ani.ani.action.getDuration()){
                            ani.ani.node.stopAllActions();
                            this.removeChild(ani.ani.node);
                            ani.ani = undefined;
                        }
                    }
                }
            }
            else{
                if(ani.delay > 0){
                    aniEnd = false;

                    ani.delay -= dt;

                    if(ani.delay <= 0){
                        ani.ani = ccs.load(this._txtWinRes);

                        var txt_num = findChildByName(ani.ani.node, this._txt_num);
                        txt_num.setString(ani.txt);

                        this.addChild(ani.ani.node,2);
                        ani.ani.node.runAction(ani.ani.action);

                        if (this._iAniIndex !== undefined && this._lstAnimation && this._lstAnimation.length > 0) {
                            var aniName = this._lstAnimation[this._iAniIndex];
                            ani.ani.action.play(aniName, false);
                        }
                        else {
                            if(this.allMoneyFPS != undefined){
                                ani.ani.action.gotoFrameAndPlay(this.allMoneyFPS.BG[0], this.allMoneyFPS.BG[1], false);
                            }else{
                                ani.ani.action.gotoFrameAndPlay(0, ani.ani.action.getDuration(), false);
                            }
                        }
                    }
                }
            }
        }

        if(aniEnd){
            this.clear();

            this.txtAniEndCallBack(0);
        }
    },

    txtAniEndCallBack:function(index){
        if(!this._aniCallBack || !this._target)
            return;

        this._aniCallBack(this._target);
    },

    isPauseGame: function () {
        if(!this._aniCallBack || !this._target)
            return false;

        return true;
    },

    setValue:function(winValue, aniIndex){
        this._winValue = winValue;
        this._iAniIndex = aniIndex;

        if(this._winValue > 0)
            this._bAniEnd = false;
    },

    chgString:function(num){
        var str = GameDataMgr.instance.getCashStrByConfig(num);

        return str;
    },

    setTextColor:function(txt, rgb){
        txt.setColor(rgb);
    },

    setEndAniCallBack: function (func, self) {
        this._lstCallBack = [];
        this._lstCallBack.push([func, self]);
    },

    isEnd:function(){
        return this._bAniEnd;
    },

    clear:function(){
        if (this._moduleUI) {
            this._moduleUI._setState(this._stateName, 0);
        }

        this._bAniEnd = true;

        this._txtWinAni = undefined;

        this._lstTxtWinAni = [];

        this._bTxtWinAni = false;

        this._winValue = 0;
    },

    // 设置普通和免费播放两种动画的帧数数组
    setAniFPS:function(allmoneyFPS){
        this.allMoneyFPS = allmoneyFPS;
    },
});

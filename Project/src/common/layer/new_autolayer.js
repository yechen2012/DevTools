/**
 * Created by admin on 2020/6/22.
 */
var NewAutoLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        this.GameCanvasMgr = new GameCanvasMgr(this);

        var lstvanvas = [res.CommonNewAutoLayer1_json, res.CommonNewAutoLayer2_json, res.CommonNewAutoLayer3_json];
        this.GameCanvasMgr.addCanvases(lstvanvas);

        this.GameCanvasMgr.gotoFrameAndPlay(-1, -1, true);

        var canvas = this.GameCanvasMgr.getCanvas(0);
        canvas.removeFlag(gmc.GMC_FLAG_MOBILE);

        // canvas = this.GameCanvasMgr.getCanvas(1);
        // canvas.removeFlag(gmc.GMC_FLAG_PC);

        canvas = this.GameCanvasMgr.getCanvas(2);
        canvas.removeFlag(gmc.GMC_FLAG_PC);

        var lstadaptive = ["layAdaptive"];

        this.GameCanvasMgr.addAdaptiveLayouts(lstadaptive);

        this.lstctrldata = [
            {type: 'node', name: 'Panel_AutoNum'},
            {type: 'node', name: 'Panel_AutoLoss'},
            {type: 'node', name: 'Panel_AutoWin'},

            {type: 'button', name: 'btnOk', areaname: 'btnOk', callfunc: this.onBtnOk, target: this},
            {type: 'button', name: 'btnCancel', areaname: 'btnCancel', callfunc: this.onBtnClose, target: this},
            {type: 'button', name: 'btnAuto0', btnname: 'btnAuto0', areaname: 'areaAuto0', callfunc: this.onTouchAuto, target: this, defaulthide: true},
            {type: 'button', name: 'btnAuto1', btnname: 'btnAuto1', areaname: 'areaAuto1', callfunc: this.onTouchAuto, target: this, defaulthide: true},
            {type: 'button', name: 'btnAuto2', btnname: 'btnAuto2', areaname: 'areaAuto2', callfunc: this.onTouchAuto, target: this, defaulthide: true},
            {type: 'button', name: 'btnAuto3', btnname: 'btnAuto3', areaname: 'areaAuto3', callfunc: this.onTouchAuto, target: this, defaulthide: true},
            {type: 'button', name: 'btnAuto4', btnname: 'btnAuto4', areaname: 'areaAuto4', callfunc: this.onTouchAuto, target: this, defaulthide: true},
            {type: 'button', name: 'btnAuto5', btnname: 'btnAuto5', areaname: 'areaAuto5', callfunc: this.onTouchAuto, target: this, defaulthide: true},
            {type: 'button', name: 'btnAuto6', btnname: 'btnAuto6', areaname: 'areaAuto6', callfunc: this.onTouchAuto, target: this, defaulthide: true},
            {type: 'button', name: 'btnAuto7', btnname: 'btnAuto7', areaname: 'areaAuto7', callfunc: this.onTouchAuto, target: this, defaulthide: true},
            {type: 'button', name: 'btnAuto8', btnname: 'btnAuto8', areaname: 'areaAuto8', callfunc: this.onTouchAuto, target: this, defaulthide: true},
            {type: 'button', name: 'btnAuto9', btnname: 'btnAuto9', areaname: 'areaAuto9', callfunc: this.onTouchAuto, target: this, defaulthide: true},
            {type: 'button', name: 'btnAutoLoss0', btnname: 'btnAutoLoss0', areaname: 'areaAutoLoss0', callfunc: this.onTouchAutoLoss, target: this, defaulthide: true},
            {type: 'button', name: 'btnAutoLoss1', btnname: 'btnAutoLoss1', areaname: 'areaAutoLoss1', callfunc: this.onTouchAutoLoss, target: this, defaulthide: true},
            {type: 'button', name: 'btnAutoLoss2', btnname: 'btnAutoLoss2', areaname: 'areaAutoLoss2', callfunc: this.onTouchAutoLoss, target: this, defaulthide: true},
            {type: 'button', name: 'btnAutoLoss3', btnname: 'btnAutoLoss3', areaname: 'areaAutoLoss3', callfunc: this.onTouchAutoLoss, target: this, defaulthide: true},
            {type: 'button', name: 'btnAutoLoss4', btnname: 'btnAutoLoss4', areaname: 'areaAutoLoss4', callfunc: this.onTouchAutoLoss, target: this, defaulthide: true},
            {type: 'button', name: 'btnAutoWin0', btnname: 'btnAutoWin0', areaname: 'areaAutoWin0', callfunc: this.onTouchAutoWin, target: this, defaulthide: true},
            {type: 'button', name: 'btnAutoWin1', btnname: 'btnAutoWin1', areaname: 'areaAutoWin1', callfunc: this.onTouchAutoWin, target: this, defaulthide: true},
            {type: 'button', name: 'btnAutoWin2', btnname: 'btnAutoWin2', areaname: 'areaAutoWin2', callfunc: this.onTouchAutoWin, target: this, defaulthide: true},
            {type: 'button', name: 'btnAutoWin3', btnname: 'btnAutoWin3', areaname: 'areaAutoWin3', callfunc: this.onTouchAutoWin, target: this, defaulthide: true},
            {type: 'button', name: 'btnAutoWin4', btnname: 'btnAutoWin4', areaname: 'areaAutoWin4', callfunc: this.onTouchAutoWin, target: this, defaulthide: true},

            {type: 'textex', name: 'textTitle', str: 'common_autoSpin_title', fontname: 'Ubuntu_R_0', fontsize: 48, bmulline: false},
            {type: 'textex', name: 'textTitleSpins', str: 'common_autoSpin_label_number', fontname: 'Ubuntu_R_0', fontsize: 26, bmulline: false},
            {type: 'textex', name: 'textTitleLosslimit', str: 'common_autoSpin_label_lost', fontname: 'Ubuntu_R_0', fontsize: 26, bmulline: false},
            {type: 'textex', name: 'textTitleSingleWinLimit', str: 'common_autoSpin_label_win', fontname: 'Ubuntu_R_0', fontsize: 26, bmulline: false},
            {type: 'textex', name: 'textBalance', str: 'common_autoSpin_label_Balance', fontname: 'Ubuntu_R_0', fontsize: 26, bmulline: false},
            {type: 'textex', name: 'textTotalBet', str: 'common_autoSpin_label_Totalbet', fontname: 'Ubuntu_R_0', fontsize: 26, bmulline: false},

            {type: 'textbmfontex', name: 'numBalance', str: '0.00', fontsize: 26},
            {type: 'textbmfontex', name: 'numTotalBet', str: '0.00', fontsize: 26},

            //!textgroup
            {type: 'textgroup', name: 'textAutoInfo1', lsttextgroup:['textBalance', 'textTotalBet']},
            {type: 'textgroup', name: 'textAutoInfo2', lsttextgroup:['textTitleSpins', 'textTitleLosslimit', 'textTitleSingleWinLimit']},
        ];

        this.scheduleUpdate();
        this.GameCanvasMgr.initCtrlList(this.lstctrldata);
        this.GameCanvasMgr.refresh();

        this.Panel_AutoNum = this.GameCanvasMgr.getNode('Panel_AutoNum');
        this.Panel_AutoLoss = this.GameCanvasMgr.getNode('Panel_AutoLoss');
        this.Panel_AutoWin = this.GameCanvasMgr.getNode('Panel_AutoWin');
        this.numBalance = this.GameCanvasMgr.getTextBMFontEx('numBalance');
        this.numTotalBet = this.GameCanvasMgr.getTextBMFontEx('numTotalBet');

        this.btnOk = this.GameCanvasMgr.getButton('btnOk');
    },

    initData : function (type, spinsList, lossLimitList, singleWinLimitList, blimit, balance, totalbet) {
        this.textList = [spinsList.concat(), lossLimitList.concat(), singleWinLimitList.concat()];

        //this.bLossLimit = (this.textList[1][0] != "No Limit");
        //this.bWinLimit = (this.textList[2][0] != "No Limit");
        //this.btnOk.setEnabled(!this.bLossLimit && !this.bWinLimit);

        //if(this.textList[1][0] != "No Limit") {
        //    this.textList[1].splice(0, 0, "No Limit");
        //}

        //if(this.textList[2][0] != "No Limit") {
        //    this.textList[2].splice(0, 0, "No Limit");
        //}

        //this.textList[0].splice(this.textList[0].length - 1, 1);
        //this.textList[1].splice(0, 1);
        //this.textList[2].splice(0, 1);

        for(var ii = 0; ii < this.textList.length; ii++){
            for(var jj = 0; jj < this.textList[ii].length; jj++){
                if(this.textList[ii][jj] == "OFF" || this.textList[ii][jj] == '0' || this.textList[ii][jj] == "No Limit" || this.textList[ii][jj] == '∞'){
                    this.textList[ii].splice(jj, 1);
                    this.textList[ii].push('∞');
                    if(ii == 0)
                        this.bAutoNums = '∞';
                    else if(ii == 1)
                        this.bAutoLoss = '∞';
                    else if(ii == 2)
                        this.bAutoWin = '∞';
                }
            }
        }

        if(this.bAutoNums != undefined && this.bAutoLoss != undefined && this.bAutoWin != undefined)
            this.btnOk.setEnabled(true);
        else
            this.btnOk.setEnabled(false);

        this.refreshBtns(this.textList[0], this.textList[1], this.textList[2]);
        this.refreshText(balance, totalbet);
    },

    refreshBtns: function (spinsList, lossLimitList, singleWinLimitList) {
        var taglen = spinsList.length;

        //!自动按钮相关
        this.lstAutoBtn = [];
        for(var ii = 0; ii < taglen; ii++){
            var btn = this.GameCanvasMgr.getButton('btnAuto'+ ii);
            btn.setVisible(true);
            if(ii == taglen - 1 && this.bAutoNums != undefined){
                btn.setEnabled(false);
                btn.setTitleText(undefined, undefined, cc.color(255, 255, 255));
            }
            this.lstAutoBtn.push(btn);

            var lstpos = [];
            for(var jj = 0; jj < 3; jj++){
                var node = this.Panel_AutoNum.getNode(jj);
                var wid = Math.round(node.getContentSize().width);
                var hei = Math.round(node.getContentSize().height);
                var pos = this.getBtnPos(ii, jj, wid, hei, taglen);
                lstpos.push(pos);
            }

            btn.setPosition(lstpos);

            var num = spinsList[ii];
            btn._num = num;

            if(num == "∞"){
                btn.setTitleText(num, 80);
                for(var kk = 0; kk < lstpos.length; kk++){
                    lstpos[kk].y += 5;
                }
                btn.setPosition(lstpos);
            }
            else
                btn.setTitleText(num);
        }

        //!赢钱停止自动相关
        this.lstAutoWinBtn = [];
        taglen = singleWinLimitList.length;
        for(var ii = 0; ii < taglen; ii++){
            var btn = this.GameCanvasMgr.getButton('btnAutoWin'+ ii);
            btn.setVisible(true);
            if(ii == taglen - 1 && this.bAutoWin != undefined){
                btn.setEnabled(false);
                btn.setTitleText(undefined, undefined, cc.color(255, 255, 255));
            }
            this.lstAutoWinBtn.push(btn);

            var lstpos = [];
            for(var jj = 0; jj < 3; jj++){
                var node = this.Panel_AutoWin.getNode(jj);
                var wid = Math.round(node.getContentSize().width);
                var hei = Math.round(node.getContentSize().height);
                var pos = this.getBtnPos(ii, jj, wid, hei, taglen);

                lstpos.push(pos);
            }

            btn.setPosition(lstpos);

            var num = singleWinLimitList[ii];
            btn._num = num;

            if(num == "∞"){
                btn.setTitleText(num, 80);
                for(var kk = 0; kk < lstpos.length; kk++){
                    lstpos[kk].y += 5;
                }
                btn.setPosition(lstpos);
            }
            else
                btn.setTitleText(num);
        }

        //!输钱停止自动相关
        this.lstAutoLossBtn = [];
        taglen = lossLimitList.length;
        for(var ii = 0; ii < taglen; ii++){
            var btn = this.GameCanvasMgr.getButton('btnAutoLoss'+ ii);
            btn.setVisible(true);
            if(ii == taglen - 1 && this.bAutoLoss != undefined){
                btn.setEnabled(false);
                btn.setTitleText(undefined, undefined, cc.color(255, 255, 255));
            }
            this.lstAutoLossBtn.push(btn);

            var lstpos = [];
            for(var jj = 0; jj < 3; jj++){
                var node = this.Panel_AutoLoss.getNode(jj);
                var wid = Math.round(node.getContentSize().width);
                var hei = Math.round(node.getContentSize().height);
                var pos = this.getBtnPos(ii, jj, wid, hei, taglen);

                lstpos.push(pos);
            }

            btn.setPosition(lstpos);

            var num = lossLimitList[ii];
            btn._num = num;

            if(num == "∞"){
                btn.setTitleText(num, 80);
                for(var kk = 0; kk < lstpos.length; kk++){
                    lstpos[kk].y += 5;
                }
                btn.setPosition(lstpos);
            }
            else
                btn.setTitleText(num);
        }
    },

    //!根据按钮数量计算按钮的坐标
    getBtnPos: function (ii, jj, wid, hei, taglen) {
        var maxlen = 10;
        var mindis = 8;
        var distance = 0;
        var pos = cc.p(0,0);
        if(jj != 1){
            distance = wid / maxlen + (maxlen - taglen) * mindis;
            pos.x = wid / 2 - ((taglen - 1) / 2 - ii) * distance;
            pos.y = hei / 2;
        }
        else{
            distance = wid / (maxlen / 2) + (maxlen - taglen) * mindis;
            if(taglen > maxlen / 2){
                var len1 = Math.floor(taglen / 2 + taglen % 2);
                var len2 = taglen - len1;

                if(ii < len1){
                    pos.x = wid / 2 - ((len1 - 1) / 2 - ii) * distance;
                    pos.y = hei / 2 - ((2 - 1) / 2 - 1) * hei / 2;
                }
                else{
                    pos.x = wid / 2 - ((len2 - 1) / 2 - (ii - len1)) * distance;
                    pos.y = hei / 2 - ((2 - 1) / 2 - 0) * hei / 2;
                }
            }
            else{
                distance = wid / (maxlen / 2) + (maxlen / 2 - taglen) * mindis;
                pos.x = wid / 2 - ((taglen - 1) / 2 - ii) * distance;
                pos.y = hei / 2;
            }
        }

        return pos;
    },

    onTouchAuto: function (sender) {
        for(var ii = 0; ii < this.lstAutoBtn.length; ii++){
            this.lstAutoBtn[ii].setEnabled(true);
            this.lstAutoBtn[ii].setTitleText(undefined, undefined, cc.color(84, 216, 255));
        }
        sender.setEnabled(false);
        sender.setTitleText(undefined, undefined, cc.color(255, 255, 255));

        this.bAutoNums = sender._num;
    },

    onTouchAutoLoss: function (sender) {
        for(var ii = 0; ii < this.lstAutoLossBtn.length; ii++){
            this.lstAutoLossBtn[ii].setEnabled(true);
            this.lstAutoLossBtn[ii].setTitleText(undefined, undefined, cc.color(84, 216, 255));
        }
        sender.setEnabled(false);
        sender.setTitleText(undefined, undefined, cc.color(255, 255, 255));

        this.bAutoLoss = sender._num;

        //if((this.bAutoLoss == 'No Limit' || this.bAutoLoss == '∞') && this.bLossLimit)
        //    this.btnOk.setEnabled(false);
        //else if((this.bAutoWin == 'No Limit' || this.bAutoWin == '∞') && this.bWinLimit)
        //    this.btnOk.setEnabled(false);
        //else
        //    this.btnOk.setEnabled(true);

        if(this.bAutoNums != undefined && this.bAutoLoss != undefined && this.bAutoWin != undefined)
            this.btnOk.setEnabled(true);
        else
            this.btnOk.setEnabled(false);
    },

    onTouchAutoWin: function (sender) {
        for(var ii = 0; ii < this.lstAutoWinBtn.length; ii++){
            this.lstAutoWinBtn[ii].setEnabled(true);
            this.lstAutoWinBtn[ii].setTitleText(undefined, undefined, cc.color(84, 216, 255));
        }
        sender.setEnabled(false);
        sender.setTitleText(undefined, undefined, cc.color(255, 255, 255));

        this.bAutoWin = sender._num;

        //if((this.bAutoLoss == 'No Limit' || this.bAutoLoss == '∞') && this.bLossLimit)
        //    this.btnOk.setEnabled(false);
        //else if((this.bAutoWin == 'No Limit' || this.bAutoWin == '∞') && this.bWinLimit)
        //    this.btnOk.setEnabled(false);
        //else
        //    this.btnOk.setEnabled(true);

        if(this.bAutoNums != undefined && this.bAutoLoss != undefined && this.bAutoWin != undefined)
            this.btnOk.setEnabled(true);
        else
            this.btnOk.setEnabled(false);
    },

    getCurCount : function () {
        var arr = [];

        arr.push(this.bAutoNums);
        arr.push(this.bAutoLoss);
        arr.push(this.bAutoWin);

        return arr;
    },

    refreshText: function (balance, totalbet) {
        var balance = GameDataMgr.instance.getCashStrByConfig(balance);
        var totalbet = GameDataMgr.instance.getCashStrByConfig(totalbet);

        this.numBalance.setString(balance);
        this.numTotalBet.setString(totalbet);
    },

    update : function (dt) {
        this.GameCanvasMgr.update(dt);
    },

    setColseCallFunction : function (callfunc, target) {
        if(callfunc) {
            this.closeCallfunc = callfunc;
            this.closeTarget = target;
        }
        else {
            this.closeCallfunc = undefined;
            this.closeTarget = undefined;
        }
    },

    setOkCallFunction : function (callfunc, target) {
        if(callfunc) {
            this.okCallfunc = callfunc;
            this.okTarget = target;
        }
        else {
            this.okCallfunc = undefined;
            this.okTarget = undefined;
        }
    },

    onBtnOk : function () {
        if(this.okCallfunc) {
            if(this.okCallfunc)
                this.okCallfunc.call(this.okTarget, this.getCurCount());
            else
                this.okCallfunc.call();
        } else {
            this.onBtnClose();
        }
    },

    onBtnClose : function () {
        if(this.closeCallfunc) {
            if(this.closeTarget)
                this.closeCallfunc.call(this.closeTarget);
            else
                this.closeCallfunc.call();
        } else {
            this.removeFromParent();
        }
    }
});

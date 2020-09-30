var AutoLayer = cc.Layer.extend({
    ctor:function (mgr) {
        this._super();
        var layer = ccs.load(res.CommonAutoLayer_json);
        this._action = layer.action;
        layer.node.runAction(layer.action);
        this.addChild(layer.node);
        this._curFrameSize = cc.size(0, 0);

        //! 尝试调整界面不影响设计分辨率
        this.Layer = layer;
        this.iResizeWidth = 0;
        this.iResizeHeight = 0;
        this._mgr = mgr;

        this.Panel_close = findNodeByName(layer.node, "Panel_close");
        this.Panel_close.addClickEventListener(this.onBtnClose.bind(this));
        this.Panel_ui = findNodeByName(layer.node, "Panel_ui");
        this.Panel_ui.defaultWidth = this.Panel_ui.width;
        this.Panel_ui.defaultHeight = this.Panel_ui.height;

        this.Panel_buttom = findNodeByName(layer.node, "Panel_buttom");
        this.Panel_buttom.addTouchEventListener(this.onTouch.bind(this), this);

        this.Panel_buttom_1 = findNodeByName(layer.node, "Panel_buttom_1");
        this.Panel_buttom_1._id = 0;
        this.Panel_buttom_1.addTouchEventListener(this.onTouch.bind(this), this);

        this.Panel_buttom_2 = findNodeByName(layer.node, "Panel_buttom_2");
        this.Panel_buttom_2._id = 1;
        this.Panel_buttom_2.addTouchEventListener(this.onTouch.bind(this), this);

        this.Panel_buttom_3 = findNodeByName(layer.node, "Panel_buttom_3");
        this.Panel_buttom_3._id = 2;
        this.Panel_buttom_3.addTouchEventListener(this.onTouch.bind(this), this);

        this.Panel_buttom_list = [this.Panel_buttom_1, this.Panel_buttom_2, this.Panel_buttom_3];

        this.text = findNodeByName(layer.node, "text");
        if (this.text) {
            this.text.setVisible(false);
            if (this.text instanceof ccui.Text) {

            } else if (this.text instanceof ccui.LabelBMFont) {

            }
        }

        this.Image_1 = findNodeByName(layer.node, "Image_1");

        this.Panel_9 = findNodeByName(layer.node, "Panel_9");
        this.frameHeight = this.Panel_9.height;

        this.Panel_btns = findNodeByName(layer.node, "Panel_btns");
        this.btnOk = findNodeByName(layer.node, "btnOk");
        if (this.btnOk) {
            this.btnOk.addClickEventListener(this.onBtnOk.bind(this));
            this.btnOk.setEnabled(false);
        }
        this.btnCancel = findNodeByName(layer.node, "btnCancel");
        if (this.btnCancel) {
            this.btnCancel.addClickEventListener(this.onBtnClose.bind(this));
        }

        var textCancel = findNodeByName(layer.node, "textCancel");
        this.textCancel = new TextEx(textCancel, false);
        this.textCancel.setFontName('Ubuntu_M');

        var textStart = findNodeByName(layer.node, "textStart");
        this.textStart = new TextEx(textStart, false);
        this.textStart.setFontName('Ubuntu_M');

        var textTitle = findNodeByName(layer.node, "textTitle");
        this.textTitle = new TextEx(textTitle, false);
        this.textTitle.setFontName('Ubuntu_M');
        this.textTitle.setVisible(false);

        var textTitleSpins = findNodeByName(layer.node, "textTitleSpins");
        this.textTitleSpins = new TextEx(textTitleSpins, false);
        this.textTitleSpins.setFontName('Ubuntu_M');

        var textTitleLosslimit = findNodeByName(layer.node, "textTitleLosslimit");
        this.textTitleLosslimit = new TextEx(textTitleLosslimit, false);
        this.textTitleLosslimit.setFontName('Ubuntu_M');

        var textTitleSingleWinLimit = findNodeByName(layer.node, "textTitleSingleWinLimit");
        this.textTitleSingleWinLimit = new TextEx(textTitleSingleWinLimit, false);
        this.textTitleSingleWinLimit.setFontName('Ubuntu_M');

        var lsttextgroup1 = [this.textCancel, this.textTitle, this.textStart];
        //this._mgr.initTextGroup('common_text_oldauto1', 'common_text_oldauto1', lsttextgroup1);
        this.TextGroup1 = new GameCanvasTextGroup(undefined, 'common_text_oldauto1', lsttextgroup1);

        var lsttextgroup2 = [this.textTitleSpins, this.textTitleLosslimit, this.textTitleSingleWinLimit];
        //this._mgr.initTextGroup('common_text_oldauto2', 'common_text_oldauto2', lsttextgroup2);
        this.TextGroup2 = new GameCanvasTextGroup(undefined, 'common_text_oldauto2', lsttextgroup2);

        this.scheduleUpdate();
        this.refreshAutoTexts();
    },

    onTouch:function (sender, type) {
        var touchEndPosition = sender.getTouchEndPosition();
        var touchMovePosition = sender.getTouchMovePosition();
        var touchBeganPosition = sender.getTouchBeganPosition();
        var i = sender._id;
        if(type == ccui.Widget.TOUCH_BEGAN){
            var locationInNode = sender.convertToNodeSpace(touchBeganPosition);
            this._lastPos = touchBeganPosition;
        }
        else if (type == ccui.Widget.TOUCH_MOVED) {
            var lastPosition = touchMovePosition;
            if (Math.abs(lastPosition.y - touchBeganPosition.y) < this.frameHeight / 2) {
                this.touchOffID[i] = 0;
                this.touchOffY[i] = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
            } else {
                if (lastPosition.y < touchBeganPosition.y) {
                    this.touchOffID[i] = -Math.floor(Math.abs(lastPosition.y - touchBeganPosition.y) / this.frameHeight);
                    this.touchOffY[i] = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
                    if (this.touchOffY[i] < -this.frameHeight / 2) {
                        this.touchOffID[i]--;
                        this.touchOffY[i] += this.frameHeight;
                    }
                } else {
                    this.touchOffID[i] = Math.floor(Math.abs(lastPosition.y - touchBeganPosition.y) / this.frameHeight);
                    this.touchOffY[i] = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
                    if (this.touchOffY[i] > this.frameHeight / 2) {
                        this.touchOffID[i]++;
                        this.touchOffY[i] -= this.frameHeight;
                    }
                }
            }
            this.rechangeTexts();
        }
        else if (type == ccui.Widget.TOUCH_ENDED) {
            var locationInNode = sender.convertToNodeSpace(touchEndPosition);
            var lastPosition = touchEndPosition;
            if (Math.abs(lastPosition.y - touchBeganPosition.y) < this.frameHeight / 2) {
                this.touchOffID[i] = 0;
                this.touchOffY[i] = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
            } else {
                if (lastPosition.y < touchBeganPosition.y) {
                    this.touchOffID[i] = -Math.floor(Math.abs(lastPosition.y - touchBeganPosition.y) / this.frameHeight);
                    this.touchOffY[i] = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
                    if (this.touchOffY[i] < -this.frameHeight / 2) {
                        this.touchOffID[i]--;
                        this.touchOffY[i] += this.frameHeight;
                    }
                } else {
                    this.touchOffID[i] = Math.floor(Math.abs(lastPosition.y - touchBeganPosition.y) / this.frameHeight);
                    this.touchOffY[i] = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
                    if (this.touchOffY[i] > this.frameHeight / 2) {
                        this.touchOffID[i]++;
                        this.touchOffY[i] -= this.frameHeight;
                    }
                }
            }
            this.curBetId[i] += this.touchOffID[i];
            this.touchOffID[i] = 0;
            this.textOffY[i] = this.touchOffY[i];
            this.touchOffY[i] = 0;
            this.rechangeTexts();
            delete this._lastPos;
        }
        else {
            var lastPosition = touchEndPosition;
            if (Math.abs(lastPosition.y - touchBeganPosition.y) < this.frameHeight / 2) {
                this.touchOffID[i] = 0;
                this.touchOffY[i] = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
            } else {
                if (lastPosition.y < touchBeganPosition.y) {
                    this.touchOffID[i] = -Math.floor(Math.abs(lastPosition.y - touchBeganPosition.y) / this.frameHeight);
                    this.touchOffY[i] = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
                    if (this.touchOffY[i] < -this.frameHeight / 2) {
                        this.touchOffID[i]--;
                        this.touchOffY[i] += this.frameHeight;
                    }
                } else {
                    this.touchOffID[i] = Math.floor(Math.abs(lastPosition.y - touchBeganPosition.y) / this.frameHeight);
                    this.touchOffY[i] = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
                    if (this.touchOffY[i] > this.frameHeight / 2) {
                        this.touchOffID[i]++;
                        this.touchOffY[i] -= this.frameHeight;
                    }
                }
            }
            this.curBetId[i] += this.touchOffID[i];
            this.touchOffID[i] = 0;
            this.textOffY[i] = this.touchOffY[i];
            this.touchOffY[i] = 0;
            this.rechangeTexts();
            delete this._lastPos;
        }
    },

    initData : function (type, spinsList, lossLimitList, singleWinLimitList, blimit) {
        this.type = type;
        this.realTextList = [spinsList, lossLimitList, singleWinLimitList];
        this.curBetId = [0, 0, 0];
        this.realityBetIdOffset = [0, 0, 0];
        this.bLossLimit = (lossLimitList[0] != "No Limit");
        this.bWinLimit = (singleWinLimitList[0] != "No Limit");
        this.btnOk.setEnabled(!this.bLossLimit && !this.bWinLimit);

        this.textList = [spinsList.concat(), lossLimitList.concat(), singleWinLimitList.concat()];
        this.textNodeList = [[],[],[]];

        if(this.textList[1][0] != "No Limit") {
            this.realityBetIdOffset[1] = -1;
            this.textList[1].splice(0, 0, "No Limit");
        }

        if(this.textList[2][0] != "No Limit") {
            this.realityBetIdOffset[2] = -1;
            this.textList[2].splice(0, 0, "No Limit");
        }

        for (var i = 0; i < this.textList.length; i++) {
            for (var j = 0; j < this.textList[i].length; j++) {
                var text = new ccui.Text(this.textList[i][j], "Ubuntu_M", 46); //
                if(j == 0){
                    if(i == 0){
                        if(this.textList[i][j] == "OFF")
                            LanguageData.instance.showTextStr("OFF",text);
                    }
                    else{
                        if(this.textList[i][j] == "No Limit") {
                            LanguageData.instance.showTextStr("common_autoSpin_label_noLimit",text);
                            text.setFontSize(30);
                        }
                    }
                }

                if(this.textList[i][j] == "∞"){
                    text.setFontSize(80);
                }else{
                    text.setFontSize(text.getFontSize());
                }
                
                //text.setTextAreaSize(cc.size(this.Panel_buttom_list[i].width, 100));
                //text.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                //text.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);

                this.Panel_buttom_list[i].addChild(text);
                cc.log(i + " " + j + this.textList[i][j]);
                var text1 = new TextEx(text, false);
                text1.refresh();
                text.setAnchorPoint(0.5, 0.5);
                text.setPosition(this.Panel_buttom_list[i].width / 2, i + this.frameHeight * i);
                text.setVisible(false);
                this.textNodeList[i].push(text1);
            }
        }
        this.textOffY = [0, 0, 0];
        this.touchOffID = [0, 0, 0];
        this.touchOffY = [0, 0, 0];
        var self = this;
        setTimeout(
            function () {
                self.resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height, true);
            }, 20
        )


    },

    rechangeTexts : function () {
        var minScale = 0.5;
        for (var i = 0; i < this.textNodeList.length; i++) {
            for (var j = 0; j < this.textNodeList[i].length; j++) {
                this.textNodeList[i][j].setPositionX(this.Panel_buttom_list[i].width / 2);
                this.textNodeList[i][j].setScale(1);
                this.textNodeList[i][j].setVisible(false);
                this.textNodeList[i][j].setOpacity(255);
                this.textNodeList[i][j].setColor(cc.color(255,255,255));
            }
        }
        this.maxLens = Math.round((this.Panel_buttom.height - this.frameHeight) / 2  / this.frameHeight);
        if (this.type == 1) {
            for (var i = 0; i < this.textList.length; i++) {
                while (this.maxLens * 2 + 1 > this.textList[i].length) {
                    this.textList[i] = this.textList[i].concat(this.realTextList[i]);
                    for (var i = this.textList[i].length - this.realTextList[i].length; i < this.textList[i].length; i++) {
                        var text = new ccui.Text(this.textList[i][j], "Ubuntu_M", 46); //
                        //text.setTextAreaSize(cc.size(this.Panel_buttom_1.width, text.getTextAreaSize().height));
                        //text.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                        //text.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                        this.Panel_buttom_list[i].addChild(text);
                        var text1 = new TextEx(text, false);
                        text1.refresh();

                        text.setAnchorPoint(0.5, 0.5);
                        text.setPosition(this.Panel_buttom_list[i].width / 2, i + this.frameHeight * i);
                        text.setVisible(false);
                        this.textNodeList[i].push(text1);
                    }
                }
            }
        }

        for (var i = 0; i < this.textList.length; i++) {
            var curBetId = this.curBetId[i] + this.touchOffID[i];

            if (this.type == 1) {
                curBetId = curBetId % this.textNodeList[i].length;
                while (curBetId < 0) {
                    curBetId += this.textNodeList[i].length;
                }
            } else {
                if (curBetId < 0 || curBetId == 0 && this.touchOffY[i] < 0) {
                    this.curBetId[i] = 0;
                    this.touchOffID[i] = 0;
                    curBetId = this.curBetId[i] + this.touchOffID[i];
                    this.touchOffY[i] = 0;
                    this.textOffY[i] = 0;
                } else if (curBetId > this.textNodeList[i].length - 1 || curBetId == this.textNodeList[i].length - 1 && this.touchOffY[i] > 0) {
                    this.curBetId[i] = this.textNodeList[i].length - 1;
                    this.touchOffID[i] = 0;
                    curBetId = this.curBetId[i] + this.touchOffID[i];
                    this.touchOffY[i] = 0;
                    this.textOffY[i] = 0;
                }
            }
            this.textNodeList[i][curBetId].setPositionY(this.Panel_buttom.height * 0.7 + this.textOffY[i] + this.touchOffY[i]);
            this.textNodeList[i][curBetId].setVisible(true);
            this.textNodeList[i][curBetId].setColor(cc.color(147,235,255));

            var scale = 1.1 - Math.abs(this.textNodeList[i][curBetId].getPositionY() - this.Panel_buttom.height * 0.7) / (this.Panel_buttom.height * 0.7) * (1 - minScale);
            var twid = this.textNodeList[i][curBetId].getTextCtrl().getTextAreaSize().width;
            var wid = scale * twid;
            if(wid > this.Panel_buttom_list[i].width){
                scale = this.Panel_buttom_list[i].width / twid;
            }
            this.textNodeList[i][curBetId].setScale(scale);

            var nextId = curBetId + 1;
            var y = this.Panel_buttom.height * 0.7;
            for (var j = nextId; j < nextId + this.maxLens && (this.type == 1 || this.type != 1 && j < this.textNodeList[i].length); j++) {
                y -= this.frameHeight - (j - nextId) * 0;
                var node = this.textNodeList[i][j % this.textNodeList[i].length];
                node.setPositionY(y + this.textOffY[i] + this.touchOffY[i]);
                node.setVisible(true);
                var offY = Math.abs(node.getPositionY() - this.Panel_buttom.height * 0.7) / (this.Panel_buttom.height * 0.7);
                node.setScale(0.9 - Math.abs(node.getPositionY() - this.Panel_buttom.height * 0.7) / (this.Panel_buttom.height * 0.7) * (1 - minScale));
                // node.setColor(cc.color(Math.floor(node.scale * 200), Math.floor(node.scale * 200), Math.floor(node.scale * 200)));
                node.setOpacity((1 - offY * (1 - 0.2)) * 255);
            }
            nextId = curBetId - 1;
            y = this.Panel_buttom.height  * 0.7;
            for (var j = nextId; j > nextId - this.maxLens && (this.type == 1 || this.type != 1 && j >= 0); j--) {
                y += this.frameHeight - (nextId - j) * 0;
                var node = this.textNodeList[i][(j + this.textNodeList[i].length + this.textNodeList[i].length) % this.textNodeList[i].length];
                node.setPositionY(y + this.textOffY[i] + this.touchOffY[i]);
                node.setVisible(true);
                var offY = Math.abs(node.getPositionY() - this.Panel_buttom.height * 0.7) / (this.Panel_buttom.height * 0.7);
                node.setScale(0.9 - offY * (1 - minScale));
                node.setOpacity((1 - offY * (1 - 0.2)) * 255);
            }
        }

        // if(/*parseInt(this.curBetId[0]) > 0 &&*/ parseInt(this.curBetId[1]) > 0 && parseInt(this.curBetId[2]) > 0){
        //     this.btnOk.setEnabled(true);
        // }
        // else{
        //     //this.btnOk.setEnabled(!this.bLimit);
        //     this.btnOk.setEnabled(!this.bLossLimit && !this.bWinLimit);
        // }

        if(parseInt(this.curBetId[1]) <= 0 && this.bLossLimit)
            this.btnOk.setEnabled(false);
        else if(parseInt(this.curBetId[2]) <= 0 && this.bWinLimit)
            this.btnOk.setEnabled(false);
        else
            this.btnOk.setEnabled(true);
    },

    refreshAutoTexts: function () {
        LanguageData.instance.showTextStr("common_autoSpin_label_cancel",this.textCancel);
        LanguageData.instance.showTextStr("common_autoSpin_title",this.textTitle);
        LanguageData.instance.showTextStr("common_autoSpin_label_start",this.textStart);
        LanguageData.instance.showTextStr("common_autoSpin_label_number",this.textTitleSpins);
        LanguageData.instance.showTextStr("common_autoSpin_label_lost",this.textTitleLosslimit);
        LanguageData.instance.showTextStr("common_autoSpin_label_win",this.textTitleSingleWinLimit);
    },

    getCurCount : function () {
        var arr = [];

        for(var ii = 0; ii < this.realTextList.length; ii++){
            var curBetId = this.curBetId[ii] + this.touchOffID[ii] + this.realityBetIdOffset[ii];
            arr.push(this.realTextList[ii][curBetId])
        }

        return arr;
    },

    resetSize : function (width, height, reset) {
        // if (width > height) {
        //     width = Math.round(900 / height * width);
        //     height = 900;
        // } else {
        //     height = Math.round(900 / width * height);
        //     width = 900;
        // }

        if(this.iResizeWidth == width && this.iResizeHeight == height)
            return ;

        this.iResizeWidth = width;
        this.iResizeHeight = height;

        var scale = 1;

        if (width > height) {
            scale = height / 900;
        } else {
            scale = width / 900;
        }

        this.Layer.node.setScale(scale);

        width /= scale;
        height /= scale;

        if (this.Panel_close) {
            if (reset || this.Panel_close.getContentSize().width != width || this.Panel_close.getContentSize().height != height) {
                this.Panel_close.setContentSize(width, height);
                if (this.Panel_ui) {
                    var component = this.Panel_ui.getComponent('__ui_layout');
                    if(component)
                        component.refreshLayout();

                    if (this.Panel_ui.defaultWidth > this.Panel_ui.parent.width) {
                        this.Panel_ui.setContentSize(this.Panel_ui.parent.width, this.Panel_ui.getContentSize().height);
                    }
                    if (this.Panel_ui.height > this.Panel_ui.parent.height) {
                        this.Panel_ui.setContentSize(this.Panel_ui.getContentSize().width, this.Panel_ui.parent.height);
                    }

                    var children = this.Panel_btns.getChildren();
                    var length = children.length;
                    for (var i = 0; i < length; i++) {
                        var child = children[i];
                        if (child) {
                            if (child.height > this.Panel_btns.height) {
                                child.scale = this.Panel_btns.height / child.height
                            } else {
                                child.scale = 1;
                            }
                        }
                    }
                    this.rechangeTexts();
                }
            }
        }
    },

    update : function (dt) {
        if(this.TextGroup1)
            this.TextGroup1.update(dt);

        if(this.TextGroup2)
            this.TextGroup2.update(dt);

        this.resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height);

        var rechange = false;
        for (var i = 0; i < this.textOffY.length; i++) {
            if (this.textOffY[i] != 0) {
                if (this.textOffY[i] > 0) {
                    this.textOffY[i] -= dt * this.frameHeight;
                    if (this.textOffY[i] < 0) {
                        this.textOffY[i] = 0;
                    }
                    rechange = true;
                } else {
                    this.textOffY[i] += dt * this.frameHeight;
                    if (this.textOffY[i] > 0) {
                        this.textOffY[i] = 0;
                    }
                    rechange = true;
                }
            }
        }
        if (rechange) {
            this.rechangeTexts();
        }
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

    changeAction:function(actionName, loop) {
        if (actionName == "") {
            this._action.gotoFrameAndPlay(0, 0, 0, false);
        } else {
            this._action.play(actionName, loop);
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
    },

    onExit: function () {
        //this._mgr.removeTextGroup('common_text_oldauto1');
        //this._mgr.removeTextGroup('common_text_oldauto2');
    }
});

var MultiplierLayer = cc.Layer.extend({
    ctor:function (mgr) {
        this._super();
        var layer = ccs.load(res.CommonMultiplierLayer_json);
        this._action = layer.action;
        layer.node.runAction(layer.action);
        this.addChild(layer.node);
        this._curFrameSize = cc.size(0, 0);

        //! 尝试调整界面不影响设计分辨率
        this.Layer = layer;
        this.iResizeWidth = 0;
        this.iResizeHeight = 0;
        this._mgr = mgr;

        this.Panel_swallowTouch = findNodeByName(layer.node, "Panel_swallowTouch");
        this.Panel_swallowTouch.setSwallowTouches(false);
        this.Panel_swallowTouch.addClickEventListener(this.onBtnClose.bind(this));
        this.Panel_close = findNodeByName(layer.node, "Panel_close");
        this.Panel_close.addClickEventListener(this.onBtnClose.bind(this));
        this.Panel_ui = findNodeByName(layer.node, "Panel_ui");
        this.Panel_ui.defaultWidth = this.Panel_ui.width;
        this.Panel_ui.defaultHeight = this.Panel_ui.height;

        this.Panel_buttom = findNodeByName(layer.node, "Panel_buttom");
        this.Panel_buttom.addTouchEventListener(this.onTouch.bind(this));

        this.text = findNodeByName(layer.node, "text");
        if (this.text) {
            this.text.setVisible(false);
            if (this.text instanceof ccui.Text) {

            } else if (this.text instanceof ccui.LabelBMFont) {

            }
        }

        this.Image_1 = findNodeByName(layer.node, "Image_1");

        this.Panel_9 = findNodeByName(layer.node, "Panel_9");
        this.frameHeight = this.Panel_9.height;

        this.Panel_btns = findNodeByName(layer.node, "Panel_btns");
        this.btnOk = findNodeByName(layer.node, "btnOk");
        if (this.btnOk) {
            this.btnOk.addClickEventListener(this.onBtnOk.bind(this));
        }
        this.btnCancel = findNodeByName(layer.node, "btnCancel");
        if (this.btnCancel) {
            this.btnCancel.addClickEventListener(this.onBtnClose.bind(this));
        }

        var textCancel = findNodeByName(layer.node, "textCancel");
        this.textCancel = new TextEx(textCancel, false);
        this.textCancel.setFontName('Ubuntu_M');

        var textStart = findNodeByName(layer.node, "textStart");
        this.textStart = new TextEx(textStart, false);
        this.textStart.setFontName('Ubuntu_M');

        var textTitle = findNodeByName(layer.node, "textTitle");
        this.textTitle = new TextEx(textTitle, false);
        this.textTitle.setFontName('Ubuntu_M');
        this.textTitle.setFontSize(30);

        var textTitle1 = findNodeByName(layer.node, "textTitle1");
        this.textTitle1 = new TextEx(textTitle1, false);
        this.textTitle1.setFontName('Ubuntu_M');
        this.textTitle1.setFontSize(30);

        var textTitle2 = findNodeByName(layer.node, "textTitle2");
        this.textTitle2 = new TextEx(textTitle2, false);
        this.textTitle2.setFontName('Ubuntu_M');
        this.textTitle2.setFontSize(30);

        var text_bet = findNodeByName(layer.node, "text_bet");
        this.text_bet = new TextEx(text_bet, false);
        this.text_bet.setFontName('Ubuntu_M');
        //this.text_bet.setFontSize(36);

        var text_totalBet = findNodeByName(layer.node, "text_totalBet");
        this.text_totalBet = new TextEx(text_totalBet, false);
        this.text_totalBet.setFontName('Ubuntu_M');

        var lsttextgroup1 = [this.textCancel, this.textStart];
        //this._mgr.initTextGroup('common_text_multiplier1', 'common_text_multiplier1', lsttextgroup1);
        this.TextGroup1 = new GameCanvasTextGroup(undefined, 'common_text_multiplier1', lsttextgroup1);

        var lsttextgroup2 = [this.textTitle, this.textTitle1, this.textTitle2];
        //this._mgr.initTextGroup('common_text_multiplier2', 'common_text_multiplier2', lsttextgroup2);
        this.TextGroup2 = new GameCanvasTextGroup(undefined, 'common_text_multiplier2', lsttextgroup2);

        this.scheduleUpdate();
        this.refreshMultiplierTexts();
    },

    refreshMultiplierTexts:function(){
        LanguageData.instance.showTextStr("common_autoSpin_label_cancel",this.textCancel);
        LanguageData.instance.showTextStr("common_autoSpin_label_start",this.textStart);
        LanguageData.instance.showTextStr("ui_label_bet",this.textTitle2);
        LanguageData.instance.showTextStr("ui_label_coinValue",this.textTitle);
        LanguageData.instance.showTextStr("common_autoSpin_label_Totalbet",this.textTitle1);
    },

    onTouch:function (sender, type) {
        var touchEndPosition = sender.getTouchEndPosition();
        var touchMovePosition = sender.getTouchMovePosition();
        var touchBeganPosition = sender.getTouchBeganPosition();
        if(type == ccui.Widget.TOUCH_BEGAN){
            var locationInNode = sender.convertToNodeSpace(touchBeganPosition);
            this._lastPos = touchBeganPosition;
        } else if (type == ccui.Widget.TOUCH_MOVED) {
            var lastPosition = touchMovePosition;
            if (Math.abs(lastPosition.y - touchBeganPosition.y) < this.frameHeight / 2) {
                this.touchOffID = 0;
                this.touchOffY = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
            } else {
                if (lastPosition.y < touchBeganPosition.y) {
                    this.touchOffID = -Math.floor(Math.abs(lastPosition.y - touchBeganPosition.y) / this.frameHeight);
                    this.touchOffY = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
                    if (this.touchOffY < -this.frameHeight / 2) {
                        this.touchOffID--;
                        this.touchOffY += this.frameHeight;
                    }
                } else {
                    this.touchOffID = Math.floor(Math.abs(lastPosition.y - touchBeganPosition.y) / this.frameHeight);
                    this.touchOffY = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
                    if (this.touchOffY > this.frameHeight / 2) {
                        this.touchOffID++;
                        this.touchOffY -= this.frameHeight;
                    }
                }
            }
            this.rechangeTexts();
        } else if (type == ccui.Widget.TOUCH_ENDED) {
            var locationInNode = sender.convertToNodeSpace(touchEndPosition);
            var lastPosition = touchEndPosition;
            if (Math.abs(lastPosition.y - touchBeganPosition.y) < this.frameHeight / 2) {
                this.touchOffID = 0;
                this.touchOffY = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
            } else {
                if (lastPosition.y < touchBeganPosition.y) {
                    this.touchOffID = -Math.floor(Math.abs(lastPosition.y - touchBeganPosition.y) / this.frameHeight);
                    this.touchOffY = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
                    if (this.touchOffY < -this.frameHeight / 2) {
                        this.touchOffID--;
                        this.touchOffY += this.frameHeight;
                    }
                } else {
                    this.touchOffID = Math.floor(Math.abs(lastPosition.y - touchBeganPosition.y) / this.frameHeight);
                    this.touchOffY = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
                    if (this.touchOffY > this.frameHeight / 2) {
                        this.touchOffID++;
                        this.touchOffY -= this.frameHeight;
                    }
                }
            }
            this.curBetId += this.touchOffID;
            this.touchOffID = 0;
            this.textOffY = this.touchOffY;
            this.touchOffY = 0;
            this.rechangeTexts();
            delete this._lastPos;
        } else {
            var lastPosition = touchEndPosition;
            if (Math.abs(lastPosition.y - touchBeganPosition.y) < this.frameHeight / 2) {
                this.touchOffID = 0;
                this.touchOffY = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
            } else {
                if (lastPosition.y < touchBeganPosition.y) {
                    this.touchOffID = -Math.floor(Math.abs(lastPosition.y - touchBeganPosition.y) / this.frameHeight);
                    this.touchOffY = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
                    if (this.touchOffY < -this.frameHeight / 2) {
                        this.touchOffID--;
                        this.touchOffY += this.frameHeight;
                    }
                } else {
                    this.touchOffID = Math.floor(Math.abs(lastPosition.y - touchBeganPosition.y) / this.frameHeight);
                    this.touchOffY = Math.floor((lastPosition.y - touchBeganPosition.y) % this.frameHeight);
                    if (this.touchOffY > this.frameHeight / 2) {
                        this.touchOffID++;
                        this.touchOffY -= this.frameHeight;
                    }
                }
            }
            this.curBetId += this.touchOffID;
            this.touchOffID = 0;
            this.textOffY = this.touchOffY;
            this.touchOffY = 0;
            this.rechangeTexts();
            delete this._lastPos;
        }
    },

    initData : function (type, textList, betId, iLine, canvasMgr) {
        this._CanvasMgr = canvasMgr;
        this.type = type;
        this.realTextList = textList;
        this.curBetId= betId;
        this.iLine = iLine;
        LanguageData.instance.setMapValue('Coins', this.iLine);
        LanguageData.instance.showTextStr("ui_label_coins",this.text_bet);
        this.textList = textList.concat();
        this.textNodeList = [];
        for (var i = 0; i < this.textList.length; i++) {
            var text = new ccui.Text(this.textList[i], "Ubuntu_M", 46); //
            this.Panel_buttom.addChild(text);

            var text1 = new TextEx(text, false);
            text1.refresh();
            text.setAnchorPoint(0.5, 0.5);
            text.setPosition(this.Panel_buttom.width / 2, i + this.frameHeight * i);
            text.setVisible(false);
            this.textNodeList.push(text1);
        }
        this.textOffY = 0;
        this.touchOffID = 0;
        this.touchOffY = 0;
        var self = this;
        setTimeout(
            function () {
                self.resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height, true);
            }, 20
        )

    },

    rechangeTexts : function () {
        var minScale = 0.5;
        for (var i = 0; i < this.textNodeList.length; i++) {
            this.textNodeList[i].setPositionX(this.Panel_buttom.width / 2);
            this.textNodeList[i].setScale(1);
            this.textNodeList[i].setVisible(false);
            this.textNodeList[i].setOpacity(255);
            //this.textNodeList[i].setTextColor(cc.color(255,255,255));
            this.textNodeList[i].setColor(cc.color(255,255,255));
        }
        this.maxLens = Math.round((this.Panel_buttom.height - this.frameHeight) / 2  / this.frameHeight);
        if (this.type == 1) {
            while (this.maxLens * 2 + 1 > this.textList.length) {
                this.textList = this.textList.concat(this.realTextList);
                for (var i = this.textList.length - this.realTextList.length; i < this.textList.length; i++) {
                    var text = new ccui.Text(this.textList[i], "Ubuntu_M", 46); //
                    this.Panel_buttom.addChild(text);
                    var text1 = new TextEx(text, false);
                    text1.refresh();

                    text.setAnchorPoint(0.5, 0.5);
                    text.setPosition(this.Panel_buttom.width / 2, i + this.frameHeight * i);
                    text.setVisible(false);
                    this.textNodeList.push(text1);
                }
            }
        }
        var curBetId = this.curBetId + this.touchOffID;

        if (this.type == 1) {
            curBetId = curBetId % this.textNodeList.length;
            while (curBetId < 0) {
                curBetId += this.textNodeList.length;
            }
        } else {
            if (curBetId < 0 || curBetId == 0 && this.touchOffY < 0) {
                this.curBetId = 0;
                this.touchOffID = 0;
                curBetId = this.curBetId + this.touchOffID;
                this.touchOffY = 0;
                this.textOffY = 0;
            } else if (curBetId > this.textNodeList.length - 1 || curBetId == this.textNodeList.length - 1 && this.touchOffY > 0) {
                this.curBetId = this.textNodeList.length - 1;
                this.touchOffID = 0;
                curBetId = this.curBetId + this.touchOffID;
                this.touchOffY = 0;
                this.textOffY = 0;
            }
        }
        //this.text_totalBet.setString(Math.round(this.realTextList[curBetId] * this.iLine * 100) / 100);
        var totalbet = Math.round(this.realTextList[curBetId] * this.iLine * 100) / 100;
        var cfg = {};
        cfg.bcash = true;
        var info = GameDataMgr.instance._formatByConfig(totalbet, cfg);
        this.text_totalBet.setString(info);

        this.textNodeList[curBetId].setPositionY(this.Panel_buttom.height * 0.7 + this.textOffY + this.touchOffY);
        this.textNodeList[curBetId].setVisible(true);
        this.textNodeList[curBetId].setColor(cc.color(147,235,255));
        //this.textNodeList[curBetId].setTextColor(cc.color(84,215,255));

        //this.textNodeList[curBetId].setScale(1.1 - Math.abs(this.textNodeList[curBetId].getPositionY() - this.Panel_buttom.height * 0.7) / (this.Panel_buttom.height * 0.7) * ( 1 - minScale));
        var scale = 1.1 - Math.abs(this.textNodeList[curBetId].getPositionY() - this.Panel_buttom.height * 0.7) / (this.Panel_buttom.height * 0.7) * (1 - minScale);
        var twid = this.textNodeList[curBetId].getTextCtrl().getTextAreaSize().width;
        var wid = scale * twid;
        if(wid > this.text.getContentSize().width){
            scale = this.text.getContentSize().width / twid;
        }
        this.textNodeList[curBetId].setScale(scale);

        var nextId = curBetId + 1;
        var y = this.Panel_buttom.height * 0.7;
        for (var i = nextId; i < nextId + this.maxLens && (this.type == 1 || this.type != 1 && i < this.textNodeList.length); i++) {
            y -= this.frameHeight - (i - nextId) * 0;
            var node = this.textNodeList[i % this.textNodeList.length];
            node.setPositionY(y + this.textOffY + this.touchOffY);
            node.setVisible(true);
            var offY = Math.abs(node.getPositionY() - this.Panel_buttom.height * 0.7) / (this.Panel_buttom.height * 0.7);
            node.setScale(0.9 - Math.abs(node.getPositionY() - this.Panel_buttom.height * 0.7) / (this.Panel_buttom.height * 0.7) * ( 1 - minScale));
            node.setOpacity((1 - offY * ( 1 - 0.2)) * 255);
        }
        nextId = curBetId - 1;
        y = this.Panel_buttom.height * 0.7;
        for (var i = nextId; i > nextId - this.maxLens && (this.type == 1 || this.type != 1 && i >= 0); i--) {
            y += this.frameHeight - (nextId - i) * 0;
            var node = this.textNodeList[(i + this.textNodeList.length + this.textNodeList.length) % this.textNodeList.length];
            node.setPositionY(y + this.textOffY + this.touchOffY);
            node.setVisible(true);
            var offY = Math.abs(node.getPositionY() - this.Panel_buttom.height * 0.7) / (this.Panel_buttom.height * 0.7);
            node.setScale(0.9 - offY * ( 1 - minScale));
            node.setOpacity((1 - offY * ( 1 - 0.2)) * 255);
        }
    },

    getCurCount : function () {
        var curBetId = this.curBetId + this.touchOffID;
        if (this.type == 1) {
            curBetId = curBetId % this.textNodeList.length;
            while (curBetId < 0) {
                curBetId += this.textNodeList.length;
            }
        } else {
            if (curBetId < 0 || curBetId == 0 && this.touchOffY < 0) {
                curBetId = this.curBetId + this.touchOffID;
            } else if (curBetId > this.textNodeList.length - 1 || curBetId == this.textNodeList.length - 1 && this.touchOffY > 0) {
                curBetId = this.curBetId + this.touchOffID;
            }
        }

        return curBetId;
    },

    resetSize : function (width, height, reset) {
        // if (width > height) {
        //     width = Math.round(900 / height * width);
        //     height = 900;
        // } else {
        //     height = Math.round(900 / width * height);
        //     width = 900;
        // }
        if(this.iResizeWidth == width && this.iResizeHeight == height)
            return ;

        this.iResizeWidth = width;
        this.iResizeHeight = height;

        var scale = 1;

        if (width > height) {
            scale = height / 900;
        } else {
            scale = width / 900;
        }

        this.Layer.node.setScale(scale);

        width /= scale;
        height /= scale;

        if (this.Panel_close) {
            if (reset || this.Panel_close.getContentSize().width != width || this.Panel_close.getContentSize().height != height) {
                this.Panel_close.setContentSize(width, height);
                this.Panel_swallowTouch.setContentSize(width, height);
                if (this.Panel_ui) {
                    var component = this.Panel_ui.getComponent('__ui_layout');
                    if(component)
                        component.refreshLayout();

                    if (this.Panel_ui.defaultWidth > this.Panel_ui.parent.width) {
                        this.Panel_ui.setContentSize(this.Panel_ui.parent.width, this.Panel_ui.getContentSize().height);
                    }
                    if (this.Panel_ui.height > this.Panel_ui.parent.height) {
                        this.Panel_ui.setContentSize(this.Panel_ui.getContentSize().width, this.Panel_ui.parent.height);
                    }

                    var children = this.Panel_btns.getChildren();
                    var length = children.length;
                    for (var i = 0; i < length; i++) {
                        var child = children[i];
                        if (child) {
                            if (child.height > this.Panel_btns.height) {
                                child.scale = this.Panel_btns.height / child.height
                            } else {
                                child.scale = 1;
                            }
                        }
                    }
                    this.rechangeTexts();
                }
            }
        }
    },

    update : function (dt) {
        if(this.TextGroup1)
            this.TextGroup1.update(dt);

        if(this.TextGroup2)
            this.TextGroup2.update(dt);

        this.resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height);

        if (this.textOffY != 0) {
            if (this.textOffY > 0) {
                this.textOffY -= dt * this.frameHeight;
                if (this.textOffY < 0) {
                    this.textOffY = 0;
                }
                this.rechangeTexts();
            } else {
                this.textOffY += dt * this.frameHeight;
                if (this.textOffY > 0) {
                    this.textOffY = 0;
                }
                this.rechangeTexts();
            }
        }

        if (this._CanvasMgr.getCurCanvasIndex() == 0) {
            this.Panel_close.visible = false;
            this.Panel_swallowTouch.visible = true;
        } else {
            this.Panel_close.visible = true;
            this.Panel_swallowTouch.visible = false;
        }
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

    changeAction:function(actionName, loop) {
        if (actionName == "") {
            this._action.gotoFrameAndPlay(0, 0, 0, false);
        } else {
            this._action.play(actionName, loop);
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
    },

    onExit: function () {
        //this._mgr.removeTextGroup('common_text_multiplier1');
        //this._mgr.removeTextGroup('common_text_multiplier2');
    }
});

var GamemenuLayer = cc.Layer.extend({
    ctor:function (name, mgr) {
        this._super();
        var layer = ccs.load(res.CommonGamemenu_json);
        this._action = layer.action;
        layer.node.runAction(layer.action);
        this.addChild(layer.node);
        this._curFrameSize = cc.size(0, 0);

        //! 尝试调整界面不影响设计分辨率
        this.Layer = layer;
        this.iResizeWidth = 0;
        this.iResizeHeight = 0;
        this._mgr = mgr;

        this.visible = false;
        this._settingLayer = undefined;
        this.Panel_swallowTouch = findNodeByName(layer.node, "Panel_swallowTouch");
        this.Panel_close = findNodeByName(layer.node, "Panel_close");
        this.Panel_close.addClickEventListener(this.onBtnClose.bind(this));
        this.Panel_ui = findNodeByName(layer.node, "Panel_ui");
        this.Panel_ui.defaultWidth = this.Panel_ui.width;
        this.Panel_ui.defaultHeight = this.Panel_ui.height;

        this.nodeBtnSound = findNodeByName(layer.node, "nodeBtnSound");

        this.btnSoundOpen = findNodeByName(layer.node, "btnSoundOpen");
        this.btnSoundOpen.setSwallowTouches(false);
        this.btnSoundOpen.addTouchEventListener(this.onTouchButtom.bind(this), this);

        this.btnSoundClose = findNodeByName(layer.node, "btnSoundClose");
        this.btnSoundClose.setSwallowTouches(false);
        this.btnSoundClose.addTouchEventListener(this.onTouchButtom.bind(this), this);

        this.btnPaytable = findNodeByName(layer.node, "btnPaytable");
        this.btnPaytable.setSwallowTouches(false);
        this.btnPaytable.addTouchEventListener(this.onTouchButtom.bind(this), this);

        //this.btnRecommend = findNodeByName(layer.node, "btnRecommend");
        //this.btnRecommend.setSwallowTouches(false);
        //this.btnRecommend.addTouchEventListener(this.onTouchButtom.bind(this), this);

        this.btnHits = findNodeByName(layer.node, "btnHits");
        this.btnHits.setSwallowTouches(false);
        this.btnHits.addTouchEventListener(this.onTouchButtom.bind(this), this);

        this.btnSettings = findNodeByName(layer.node, "btnSettings");
        this.btnSettings.setSwallowTouches(false);
        this.btnSettings.addTouchEventListener(this.onTouchButtom.bind(this), this);

        this.btnGameRules = findNodeByName(layer.node, "btnGameRules");
        this.btnGameRules.setSwallowTouches(false);
        this.btnGameRules.addTouchEventListener(this.onTouchButtom.bind(this), this);

        this.btnHome = findNodeByName(layer.node, "btnHome");
        this.btnHome.setSwallowTouches(false);
        this.btnHome.addTouchEventListener(this.onTouchButtom.bind(this), this);
        var isShowHome=GamelogicMgr.instance.isShowHome();
        this.btnHome.setVisible(isShowHome);

        var texts = [];
        var textGameRules = findNodeByName(layer.node, "textGameRules");
        this.textGameRules = new TextEx(textGameRules, false);
        this.textGameRules.setFontName('Ubuntu_M');
        //texts.push(this.textGameRules);
        var textSettings = findNodeByName(layer.node, "textSettings");
        this.textSettings = new TextEx(textSettings, false);
        this.textSettings.setFontName('Ubuntu_M');
        //texts.push(this.textSettings);
        var textHits = findNodeByName(layer.node, "textHits");
        this.textHits = new TextEx(textHits, false);
        this.textHits.setFontName('Ubuntu_M');
        //texts.push(this.textHits);
        //this.textRecommend = findNodeByName(layer.node, "textRecommend");
        //texts.push(this.textRecommend);
        var textPaytable = findNodeByName(layer.node, "textPaytable");
        this.textPaytable = new TextEx(textPaytable, false);
        this.textPaytable.setFontName('Ubuntu_M');
        //texts.push(this.textPaytable);
        //var textSoundClose = findNodeByName(layer.node, "textSoundClose");
        //this.textSoundClose = new TextEx(textSoundClose, false);
        //this.textSoundClose.setFontName('Ubuntu_M');
        //texts.push(this.textSoundClose);
        //var textSoundOpen = findNodeByName(layer.node, "textSoundOpen");
        //this.textSoundOpen = new TextEx(textSoundOpen, false);
        //this.textSoundOpen.setFontName('Ubuntu_M');
        //texts.push(this.textSoundOpen);
        var lsttextgroup = [this.textGameRules, this.textSettings, this.textHits, this.textPaytable];
        //this._mgr.initTextGroup('common_text_menu', 'common_text_menu', lsttextgroup);
        this.TextGroup = new GameCanvasTextGroup(undefined, 'common_text_menu', lsttextgroup);

        if(name){
            this.soundType = GameAssistant.singleton.getMusicType(name);
        }

        if(this.soundType === ""){
            this.soundType = 1;
        }
        else{
            this.soundType = parseInt(this.soundType);
        }

        if(this.soundType){
            this.btnSoundClose.setVisible(false);
            this.btnSoundOpen.setVisible(true);
        }
        else{
            this.btnSoundClose.setVisible(true);
            this.btnSoundOpen.setVisible(false);
        }

        // for (var i = 0; i < texts.length; i++) {
        //     var text1 = new TextEx(texts[i]);
        //     text1.setFontName('Ubuntu_M');
        // }

        this.Panel_topbuttom = findNodeByName(layer.node, "Panel_topbuttom");
        this.Panel_topbuttom.defaultWidth = this.Panel_topbuttom.width;
        this.Panel_topbuttom.addTouchEventListener(this.onTouch.bind(this), this);
        this.Panel_buttom = findNodeByName(layer.node, "Panel_buttom");
        this.Panel_top = findNodeByName(layer.node, "Panel_top");

        this.btnOpen = findNodeByName(layer.node, "btnOpen");
        this.btnOpen.addClickEventListener(this.onBtnOpen.bind(this));
        this.btnOpen.setVisible(false);

        this.changeAction("normal", false);

        this.scheduleUpdate();
        this.refreshGameMenuTexts();

        this.lstBtn = [[this.btnHits], [this.btnGameRules], [this.btnSettings], [this.btnPaytable], [this.nodeBtnSound, this.btnHome]];
        this.refreshBtns();
    },

    /*!
    * 设置按钮visible
    * @param btnname 可以是单个按钮名字或数组
    * @param visible 可以是单个按钮的visible状态或者数组，为数组时需要btnname也为数组且长度一致
    * */
    setBtnVisible: function (btnname, visible) {
        for(var ii = 0; ii < this.lstBtn.length; ii++){
            for(var jj = 0; jj < this.lstBtn[ii].length; jj++){
                var btn = this.lstBtn[ii][jj];

                if(cc.isArray(btnname)){
                    if (cc.isArray(visible) && btnname.length === visible.length) {
                        for(var kk = 0; kk < btnname.length; kk++){
                            if(btnname[kk] == btn.getName()){
                                btn.setVisible(visible[kk]);
                                btnname.splice(kk, 1);
                                visible.splice(kk, 1);
                                break;
                            }
                        }
                    }
                    else {
                        for(var kk = 0; kk < btnname.length; kk++){
                            if(btnname[kk] == btn.getName()){
                                btn.setVisible(visible);
                                btnname.splice(kk, 1);
                                break;
                            }
                        }
                    }

                    if(btnname.length <= 0){
                        this.refreshBtns();
                        return;
                    }

                }
                else{
                    if(btnname == btn.getName()){
                        btn.setVisible(visible);
                        this.refreshBtns();
                        return;
                    }
                }
            }
        }
    },

    //!刷新按钮
    refreshBtns: function () {
        var hei = this.Panel_buttom.getContentSize().height;
        var index = 1;
        for(var ii = 0; ii < this.lstBtn.length; ii++){
            var badd = false;
            for(var jj = 0; jj < this.lstBtn[ii].length; jj++){
                var btn = this.lstBtn[ii][jj];
                btn.setPositionY(hei * index);

                if(btn.isVisible()){
                    badd = true;
                }
            }

            if(badd)
                index ++;
        }
    },

    refreshGameMenuTexts:function(){
        // LanguageData.instance.showTextStr("uiScreenSlidein_Label1",this.textSoundOpen,false,"textSoundOpen");
        // LanguageData.instance.showTextStr("uiScreenSlidein_Label1",this.textSoundClose,false,"textSoundClose");
        LanguageData.instance.showTextStr("common_label_paytable",this.textPaytable,false,"textPaytable");
        LanguageData.instance.showTextStr("common_label_settings",this.textSettings);
        LanguageData.instance.showTextStr("common_label_gamerules",this.textGameRules);
        LanguageData.instance.showTextStr("common_label_history",this.textHits);
    },

    update : function (dt) {
        if(this.TextGroup)
            this.TextGroup.update(dt);

        this.resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height);
    },

    setSound:function(event){
        var btype = event.getUserData();
    },

    onTouchButtom:function (sender, type) {
        if(!this.isDisplaying())
            return;

        if(type == ccui.Widget.TOUCH_BEGAN){
            this._touchBegan = true;
        } else if (type == ccui.Widget.TOUCH_MOVED) {
            var touchBeganPosition = sender.getTouchBeganPosition();
            var touchMovePosition = sender.getTouchMovePosition();
            if (Math.abs(touchBeganPosition.x - touchMovePosition.x) > 5 || Math.abs(touchBeganPosition.y - touchMovePosition.y) > 5) {
                delete this._touchBegan;
            }
        } else if (type == ccui.Widget.TOUCH_ENDED) {
            if (this._touchBegan) {
                if (this.btnSettings == sender) {
                    this.onBtnSettings();
                }
                else if (this.btnSoundOpen == sender) {
                    this.onBtnSoundOpen();
                }
                else if (this.btnSoundClose == sender) {
                    this.onBtnSoundClose();
                }
                else if (this.btnPaytable == sender) {
                    this.onBtnPaytable();
                }
                else if (this.btnGameRules == sender) {
                    this.onBtnGameRules();
                }
                else if (this.btnHits == sender) {
                    this.onBtnHits();
                }
                else if (this.btnHome == sender) {
                    this.onBtnHome();
                }
            }
            delete this._touchBegan;
        } else {
            delete this._touchBegan;
        }
    },

    onTouch:function (sender, type) {
        var touchEndPosition = sender.getTouchEndPosition();
        var touchMovePosition = sender.getTouchMovePosition();
        var touchBeganPosition = sender.getTouchBeganPosition();
        if(type == ccui.Widget.TOUCH_BEGAN){
            this._lastPos = touchBeganPosition;
        } else if (type == ccui.Widget.TOUCH_MOVED) {
            var delta = cc.pSub(touchMovePosition, this._lastPos);
            var height = 0;
            if (this.Panel_buttom) {
                height += this.Panel_buttom.getBoundingBoxToWorld().height;
            }
            if (this.Panel_top) {
                height += this.Panel_top.getBoundingBoxToWorld().height;
            }
            this.Panel_topbuttom.setPositionY(this.Panel_topbuttom.getPositionY() + delta.y);
            if (this.Panel_topbuttom.getPositionY() > 0 || this.Panel_topbuttom.height > height) {
                this.Panel_topbuttom.setPositionY(0);
            }
            else if (-this.Panel_topbuttom.getPositionY() + this.Panel_topbuttom.height > height) {
                this.Panel_topbuttom.setPositionY(this.Panel_topbuttom.height - height);
            }
            this._lastPos = touchMovePosition;
        } else if (type == ccui.Widget.TOUCH_ENDED) {
            delete this._lastPos;
        } else {
            delete this._lastPos;
        }
    },

    initData : function (type, textList, betId) {
        var self = this;
        setTimeout(
            function () {
                self.resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height, true);
            }, 20
        )
    },

    resetSize : function (width, height, reset) {
        if (!this.visible && GameMgr.singleton.curGameLayer.InfoLayer == undefined) {
            this.visible = true;
        }

        if(this.btnOpen.isVisible()){
            this.btnOpen.setVisible(false);
        }

        // if (width > height) {
        //     width = Math.round(900 / height * width);
        //     height = 900;
        // } else {
        //     height = Math.round(900 / width * height);
        //     width = 900;
        // }

        if(this.iResizeWidth == width && this.iResizeHeight == height)
            return ;

        this.iResizeWidth = width;
        this.iResizeHeight = height;

        var scale = 1;

        if (width > height) {
            scale = height / 900;
        } else {
            scale = width / 900;
        }

        this.Layer.node.setScale(scale);

        width /= scale;
        height /= scale;

        var sw = width;
        var sh = height;

        if (this.Panel_close) {
            if (reset || this.Panel_close.getContentSize().width != width || this.Panel_close.getContentSize().height != height) {
                this.Panel_swallowTouch.setContentSize(width, height);
                this.Panel_close.setContentSize(width, height);
                if (this.Panel_ui) {
                    this.Panel_ui.setContentSize(this.Panel_ui.defaultWidth, this.Panel_ui.getContentSize().height);
                    if (this.Panel_ui.defaultHeight > this.Panel_ui.parent.height) {
                        this.Panel_ui.setContentSize(this.Panel_ui.getContentSize().width, this.Panel_ui.parent.height);
                    }
                    var component = this.Panel_ui.getComponent('__ui_layout');
                    if(component)
                        component.refreshLayout();

                    this.Panel_ui.setContentSize(this.Panel_ui.defaultWidth, this.Panel_ui.getContentSize().height);

                    var component = this.Panel_topbuttom.getComponent('__ui_layout');
                    if(component)
                        component.refreshLayout();

                    var height = 0;
                    if (this.Panel_buttom) {
                        height += this.Panel_buttom.getBoundingBoxToWorld().height;
                    }
                    if (this.Panel_top) {
                        height += this.Panel_top.getBoundingBoxToWorld().height;
                    }
                    if (height > this.Panel_topbuttom.height && this.Panel_top) {
                        this.Panel_top.setPositionY(this.Panel_top.getPositionY() + height - this.Panel_topbuttom.height);
                    }

                    if (this.Panel_buttom) {
                        if (this.btnGameRules.width > this.Panel_buttom.width) {
                            this.Panel_buttom.scale = this.Panel_buttom.width / this.btnGameRules.width;
                        } else {
                            this.Panel_buttom.scale = 1;
                        }
                    }

                    if (this.Panel_top) {
                        var children = this.Panel_top.getChildren();
                        var length = children.length;
                        for (var i = 0; i < length; i++) {
                            var child = children[i];
                            if (child) {
                                if (child.width > this.Panel_top.width) {
                                    child.scale = this.Panel_top.width / child.width;
                                } else {
                                    child.scale = 1;
                                }
                            }
                        }
                    }
                }
            }
        }

        this.refreshBtns();
    },

    /*
    * GameMenuLayer是否正在显示
    * @return boolean
    * */
    isDisplaying: function() {
        return this._state == "enter";
    },

    isDisplaySetting: function() {
        return this._settingLayer != undefined;
    },

    onBtnSettings:function(){
        if (this._settingLayer)
            return;

        var layer = new SettingLayer(this._mgr);
        layer.setOkCallFunction(this.onBtnOpen, this);
        layer.setColseCallFunction(this.closeSettingLayer, this);
        this.parent.addChild(layer, this.getLocalZOrder() + 1);
        this.onBtnClose();

        this._settingLayer = layer;
    },

    closeSettingLayer: function() {
        if (this._settingLayer) {
            this._settingLayer.removeFromParent();
            this._settingLayer = undefined;
        }
    },

    onBtnSoundOpen:function(){
        this.btnSoundClose.setVisible(true);
        this.btnSoundOpen.setVisible(false);

        GameMgr.singleton.curGameLayer.onTouchOpenEffect(undefined, ccui.Widget.TOUCH_ENDED);
        GameMgr.singleton.curGameLayer.onTouchOpenSound(undefined, ccui.Widget.TOUCH_ENDED);
        GameAssistant.singleton.setVolumeType(GameMgr.singleton.curGameLayer.name, 0);
        return;
        GameMgr.singleton.curGameLayer.setPlayEffect(false);
        GameMgr.singleton.curGameLayer.setPlaySound(false);
        GameAssistant.singleton.setVolumeType(GameMgr.singleton.curGameLayer.name, 0);
    },

    onBtnSoundClose:function(){
        this.btnSoundClose.setVisible(false);
        this.btnSoundOpen.setVisible(true);

        this.SliderValue = GameAssistant.singleton.getVolumeValue(GameMgr.singleton.curGameLayer.name);
        GameMgr.singleton.curGameLayer.SoundValue = this.SliderValue;
        GameMgr.singleton.curGameLayer.EffectValue = this.SliderValue;

        GameMgr.singleton.curGameLayer.onTouchCloseEffect(undefined, ccui.Widget.TOUCH_ENDED);
        GameMgr.singleton.curGameLayer.onTouchCloseSound(undefined, ccui.Widget.TOUCH_ENDED);
        GameAssistant.singleton.setVolumeType(GameMgr.singleton.curGameLayer.name, 1);
        return;
        var soundType = GameAssistant.singleton.getEffectType(GameMgr.singleton.curGameLayer.name);
        if(soundType === ""){
            soundType = 1;
        }
        else{
            soundType = parseInt(soundType);
        }
        if(soundType){
            GameMgr.singleton.curGameLayer.setPlayEffect(true);
        }

        var musicType = GameAssistant.singleton.getMusicType(GameMgr.singleton.curGameLayer.name);
        if(musicType === ""){
            musicType = 1;
        }
        else{
            musicType = parseInt(musicType);
        }
        if(musicType){
            GameMgr.singleton.curGameLayer.setPlaySound(true);
        }

        GameAssistant.singleton.setVolumeType(GameMgr.singleton.curGameLayer.name, 1);
    },

    onBtnPaytable:function(){
        var layer = new SettingLayer(this._mgr);
        layer.setExNodeVisible(false);
        var h = cc.view.getFrameSize().height - (layer.Panel_buttom.getContentSize().height / layer.Panel_ui.getContentSize().height * cc.view.getFrameSize().height);
        GameMgr.singleton.curGameLayer.onTouchHelp(undefined, ccui.Widget.TOUCH_ENDED, h);

        layer.setOkCallFunction(this.onBtnOpen, this);
        this.parent.addChild(layer, this.getLocalZOrder() + 1);
        LanguageData.instance.showTextStr("common_label_paytable",layer.textTitle,false,"textTitle");
        this.onBtnClose();
    },

    onBtnGameRules: function () {
        var layer = new SettingLayer(this._mgr);
        layer.setExNodeVisible(false);
        var h = cc.view.getFrameSize().height - (layer.Panel_buttom.getContentSize().height / layer.Panel_ui.getContentSize().height * cc.view.getFrameSize().height);
        GameMgr.singleton.curGameLayer.onTouchGameRules(undefined, ccui.Widget.TOUCH_ENDED, h);

        layer.setOkCallFunction(this.onBtnOpen, this);
        this.parent.addChild(layer, this.getLocalZOrder() + 1);
        LanguageData.instance.showTextStr("common_label_gamerules",layer.textTitle,false,"textTitle");
        this.onBtnClose();
    },

    onBtnHits : function () {
        //ygg较为特殊，由平台处理
        var isygg=GamelogicMgr.instance.isYggPlatform();
        if(isygg){
            GamelogicMgr.instance.callRegistered("onBtnHits");
            return;
        }
        var layer = new SettingLayer(this._mgr);
        layer.setExNodeVisible(false);
        var h = cc.view.getFrameSize().height - (layer.Panel_buttom.getContentSize().height / layer.Panel_ui.getContentSize().height * cc.view.getFrameSize().height);
        GameMgr.singleton.curGameLayer.openHistory(h);

        layer.setOkCallFunction(this.onBtnOpen, this);
        this.parent.addChild(layer, this.getLocalZOrder() + 1);
        LanguageData.instance.showTextStr("common_label_history",layer.textTitle,false,"textTitle");
        this.onBtnClose();
    },

    onBtnHome: function () {
        this._dialog = new BaseDialog(LanguageData.instance.getTextStr("common_popup_title"), LanguageData.instance.getTextStr("common_popup_home"), {
            title: LanguageData.instance.getTextStr("common_autoSpin_label_cancel"),
            callfunc: this.removeDialog,
            target: this
        },{
            title: LanguageData.instance.getTextStr("common_popup_button_ok"),
            callfunc: this.onHome,
            target: this
        });

        this.parent.addChild(this._dialog, this.getLocalZOrder() + 1);
        this.onBtnClose();
    },

    onHome: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if(this._dialog){
            this._dialog.removeFromParent(true);
            this._dialog = undefined;
        }

        GamelogicMgr.instance.callRegistered("onClickHome");
    },

    removeDialog: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if(this._dialog){
            this._dialog.removeFromParent(true);
            this._dialog = undefined;
        }
    },

    onBtnOk : function () {
        this.onBtnClose();
    },

    changeAction:function(actionName, loop) {
        this._state = actionName;
        if (actionName == "") {
            this._action.gotoFrameAndPlay(0, 0, 0, false);
        } else {
            this._action.play(actionName, loop);
        }
    },

    onBtnOpen : function () {
        if(GameMgr.singleton.curGameLayer.InfoLayer != undefined)
            return;

        this.changeAction("enter", false);

        var volume = GameAssistant.singleton.getVolumeType(GameMgr.singleton.curGameLayer.name);
        if(volume === ''){
            volume = 1;
        }
        else{
            volume = parseInt(volume);
        }

        this.btnSoundClose.setVisible(!volume);
        this.btnSoundOpen.setVisible(volume);

        GameAssistant.singleton.setVolumeType(GameMgr.singleton.curGameLayer.name, volume);
    },

    onBtnClose : function () {
        if (this._state != "leave") {
            this.changeAction("leave", false);
        }
    },

    onExit: function () {
        //this._mgr.removeTextGroup('common_text_menu');
    }
});

var SettingLayer = cc.Layer.extend({
    ctor:function (mgr) {
        this._super();
        var layer = ccs.load(res.CommonSetting_json);
        this._action = layer.action;
        layer.node.runAction(layer.action);
        this.addChild(layer.node);
        this._curFrameSize = cc.size(0, 0);

        //! 尝试调整界面不影响设计分辨率
        this.Layer = layer;
        this.iResizeWidth = 0;
        this.iResizeHeight = 0;
        this._mgr = mgr;

        this.Panel_close = findNodeByName(layer.node, "Panel_close");
        this.Panel_ui = findNodeByName(layer.node, "Panel_ui");
        this.Panel_buttom = findNodeByName(layer.node, "Panel_buttom");
        this.Panel_3 = findNodeByName(layer.node, "Panel_3");
        this.btnMenu = findNodeByName(layer.node, "btnMenu");
        this.btnMenu.addClickEventListener(this.onBtnMenu.bind(this));
        this.btnBack = findNodeByName(layer.node, "btnBack");
        this.btnBack.addClickEventListener(this.onBtnClose.bind(this));

        this.sliderSoundValue = findNodeByName(layer.node, "sliderSoundValue");
        this.sliderSoundValue.addEventListener(this.updateSoundValue, this);
        this.sliderSoundValue.addTouchEventListener(this._onTouchEnded, this);

        var volume = GameAssistant.singleton.getVolumeType(GameMgr.singleton.curGameLayer.name);
        if(volume === ""){
            volume = 1;
        }
        else{
            volume = parseInt(volume);
        }

        this.SliderValue = GameAssistant.singleton.getVolumeValue(GameMgr.singleton.curGameLayer.name);
        this.StartValue = 0;

        if(volume){
            this.sliderSoundValue.setPercent(this.SliderValue * 100);
        }
        else{
            this.sliderSoundValue.setPercent(0);
            //this.sliderSoundValue.setEnabled(false);
        }

        this.lstNode = [];
        this.nodeVolume = findNodeByName(layer.node, "nodeVolume");
        this.lstNode.push(this.nodeVolume);

        this.btnSoundClose = findNodeByName(layer.node, "btnSoundClose");
        this.btnSoundClose.addClickEventListener(this.onBtnSound.bind(this));
        this.btnSoundOpen = findNodeByName(layer.node, "btnSoundOpen");
        this.btnSoundOpen.addClickEventListener(this.onBtnSound.bind(this));
        this.nodeSound = findNodeByName(layer.node, "nodeSound");
        this.lstNode.push(this.nodeSound);

        this.btnMusicClose = findNodeByName(layer.node, "btnMusicClose");
        this.btnMusicClose.addClickEventListener(this.onBtnMusic.bind(this));
        this.btnMusicOpen = findNodeByName(layer.node, "btnMusicOpen");
        this.btnMusicOpen.addClickEventListener(this.onBtnMusic.bind(this));
        this.nodeMusic = findNodeByName(layer.node, "nodeMusic");
        this.lstNode.push(this.nodeMusic);

        this.btnQuickSpinClose = findNodeByName(layer.node, "btnQuickSpinClose");
        this.btnQuickSpinClose.addClickEventListener(this.onBtnQuickSpin.bind(this));
        this.btnQuickSpinOpen = findNodeByName(layer.node, "btnQuickSpinOpen");
        this.btnQuickSpinOpen.addClickEventListener(this.onBtnQuickSpin.bind(this));
        this.nodeQuickSpin = findNodeByName(layer.node, "nodeQuickSpin");
        this.lstNode.push(this.nodeQuickSpin);

        this.btnCoinsClose = findNodeByName(layer.node, "btnCoinsClose");
        this.btnCoinsClose.addClickEventListener(this.onBtnCoins.bind(this));
        this.btnCoinsOpen = findNodeByName(layer.node, "btnCoinsOpen");
        this.btnCoinsOpen.addClickEventListener(this.onBtnCoins.bind(this));
        this.nodeCoins = findNodeByName(layer.node, "nodeCoins");
        this.lstNode.push(this.nodeCoins);

        this.btnSetAutoClose = findNodeByName(layer.node, "btnSetAutoClose");
        this.btnSetAutoClose.addClickEventListener(this.onBtnSetAuto.bind(this));
        this.btnSetAutoOpen = findNodeByName(layer.node, "btnSetAutoOpen");
        this.btnSetAutoOpen.addClickEventListener(this.onBtnSetAuto.bind(this));
        this.nodeSetAuto = findNodeByName(layer.node, "nodeSetAuto");
        this.lstNode.push(this.nodeSetAuto);

        this.soundType = GameAssistant.singleton.getEffectType(GameMgr.singleton.curGameLayer.name);
        if(this.soundType === ""){
            this.soundType = 1;
        }
        else{
            this.soundType = parseInt(this.soundType);
        }

        this.musicType = GameAssistant.singleton.getMusicType(GameMgr.singleton.curGameLayer.name);
        if(this.musicType === ""){
            this.musicType = 1;
        }
        else{
            this.musicType = parseInt(this.musicType);
        }

        this.coinsType = GameMgr.singleton.curGameLayer.bShowCoins;
        this.quickSpinType = GameMgr.singleton.curGameLayer.bQuickSpin;
        this.setAutoType = GameMgr.singleton.curGameLayer.bSetAuto;

        this.btnSoundClose.visible = !this.soundType;
        this.btnSoundOpen.visible = this.soundType;
        this.btnMusicClose.visible = !this.musicType;
        this.btnMusicOpen.visible = this.musicType;

        this.btnQuickSpinClose.visible = !this.quickSpinType;
        this.btnQuickSpinOpen.visible = this.quickSpinType;
        this.btnCoinsClose.visible = !this.coinsType;
        this.btnCoinsOpen.visible = this.coinsType;

        this.btnSetAutoClose.visible = !this.setAutoType;
        this.btnSetAutoOpen.visible = this.setAutoType;

        var texts = [];
        var textVolume = findNodeByName(layer.node, "textVolume");
        this.textVolume = new TextEx(textVolume, false);
        this.textVolume.setFontName('Ubuntu_M');
        //texts.push(this.textVolume);
        var textTitle = findNodeByName(layer.node, "textTitle");
        this.textTitle = new TextEx(textTitle, false);
        this.textTitle.setFontName('Ubuntu_M');
        //texts.push(this.textTitle);
        var textTitle1 = findNodeByName(layer.node, "textTitle1");
        this.textTitle1 = new TextEx(textTitle1, false);
        this.textTitle1.setFontName('Ubuntu_M');
        //texts.push(this.textTitle1);
        var textSound = findNodeByName(layer.node, "textSound");
        this.textSound = new TextEx(textSound, false);
        this.textSound.setFontName('Ubuntu_M');
        //texts.push(this.textSound);
        var textMusic = findNodeByName(layer.node, "textMusic");
        this.textMusic = new TextEx(textMusic, false);
        this.textMusic.setFontName('Ubuntu_M');
        //texts.push(this.textMusic);
        var textQuickSpin = findNodeByName(layer.node, "textQuickSpin");
        this.textQuickSpin = new TextEx(textQuickSpin, false);
        this.textQuickSpin.setFontName('Ubuntu_M');
        //texts.push(this.textQuickSpin);
        var textCoins = findNodeByName(layer.node, "textCoins");
        this.textCoins = new TextEx(textCoins, false);
        this.textCoins.setFontName('Ubuntu_M');
        //texts.push(this.textCoins);
        var textSoundValue = findNodeByName(layer.node, "textSoundValue");
        this.textSoundValue = new TextEx(textSoundValue, false);
        this.textSoundValue.setFontName('Ubuntu_M');
        this.textSoundValue.setVisible(false);
        //texts.push(this.textSoundValue);
        var textSetAuto = findNodeByName(layer.node, "textSetAuto");
        this.textSetAuto = new TextEx(textSetAuto, false);
        this.textSetAuto.setFontName('Ubuntu_M');
        //texts.push(this.textSetAuto);

        var lsttextgroup = [this.textVolume, this.textSound, this.textMusic, this.textQuickSpin, this.textCoins, this.textSetAuto];
        //this._mgr.initTextGroup('common_text_setting', 'common_text_setting', lsttextgroup);
        this.TextGroup = new GameCanvasTextGroup(undefined, 'common_text_setting', lsttextgroup);

        //for (var i = 0; i < texts.length; i++) {
        //    var text1 = new TextEx(texts[i], false);
        //    text1.setMultiLine(false);
        //    text1.setFontName('Ubuntu_M');
        //}

        this.resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height, true);
        this.scheduleUpdate();
        this.resetTests();
        this.refreshBtns();
        if(typeof(isinspecialview) != 'undefined'){
            isinspecialview = true;
        }
    },

    setExNodeVisible: function (bvisible) {
        if(this.Panel_3){
            this.Panel_3.setVisible(bvisible);
        }
    },

    setSlider:function(event){
        this.sliderType = event.getUserData();

        if(this.sliderType){
            if(this.btnMusicOpen.isVisible())
                GameMgr.singleton.curGameLayer.setPlaySound(true);

            if(this.btnSoundOpen.isVisible())
                GameMgr.singleton.curGameLayer.setPlayEffect(true);
        }
        else{
            GameMgr.singleton.curGameLayer.setPlaySound(false);
            GameMgr.singleton.curGameLayer.setPlayEffect(false);
        }
    },

    initData : function (type, textList, betId) {
    },

    resetTests : function () {
        //this.textVolume.setString('thistextVolumethistextVolume');
        LanguageData.instance.showTextStr("common_settings_label_Volume",this.textVolume);
        LanguageData.instance.showTextStr("common_label_settings",this.textTitle,false,"textTitle");
        LanguageData.instance.showTextStr("common_label_settings",this.textTitle1,false,"textTitle1");
        LanguageData.instance.showTextStr("common_settings_label_Sound",this.textSound);
        LanguageData.instance.showTextStr("common_settings_label_Music",this.textMusic);
        // LanguageData.instance.showTextStr("uiScreenSlideinSettings_Lable5",this.textQuickSpin);
        LanguageData.instance.showTextStr("common_settings_label_Coins",this.textCoins);
        LanguageData.instance.showTextStr("common_autoSpin_title", this.textSetAuto);
    },

    refreshBtns:function(){
        if(GameMgr.singleton.curGameLayer.GameMenuStaus != undefined){
            this.nodeVolume.setVisible(GameMgr.singleton.curGameLayer.GameMenuStaus.volume);
            this.nodeSound.setVisible(GameMgr.singleton.curGameLayer.GameMenuStaus.sound);
            this.nodeMusic.setVisible(GameMgr.singleton.curGameLayer.GameMenuStaus.music);
            this.nodeQuickSpin.setVisible(GameMgr.singleton.curGameLayer.GameMenuStaus.quickspin);
            this.nodeCoins.setVisible(GameMgr.singleton.curGameLayer.GameMenuStaus.coins);
            this.nodeSetAuto.setVisible(GameMgr.singleton.curGameLayer.GameMenuStaus.setauto);
        }

        var hei = this.Panel_3.getBoundingBox().height;
        var ty = 78;
        var y = parseInt(100 / (this.lstNode.length + 1));
        var index = 0;
        for(var ii = 0; ii < this.lstNode.length; ii++){
            if(this.lstNode[ii].isVisible()){
                this.lstNode[ii].setPositionY(hei * (ty - index * y) / 100);
                index++;
            }
        }
    },

    _onTouchEnded : function (touch, event) {
        if(event == ccui.Widget.TOUCH_BEGAN){
            this.StartValue = touch.getPercent() / 100;

            if(this.StartValue <= 0.01){
                this.StartValue = 0;
            }
        }

        if (event != ccui.Widget.TOUCH_ENDED) {
            return;
        }

        if(this.SliderValue > 0){
            if(!this.soundType && !this.musicType){
                this.soundType = 1;
                this.musicType = 1;
            }

            if(this.StartValue == 0){
                this.btnSoundClose.setVisible(false);
                this.btnSoundOpen.setVisible(true);

                this.btnMusicClose.setVisible(false);
                this.btnMusicOpen.setVisible(true);

                GameAssistant.singleton.setMusicType(GameMgr.singleton.curGameLayer.name, 1);
                GameAssistant.singleton.setEffectType(GameMgr.singleton.curGameLayer.name, 1);
                GameAssistant.singleton.setVolumeType(GameMgr.singleton.curGameLayer.name, 1);
            }

            GameAssistant.singleton.setVolumeValue(GameMgr.singleton.curGameLayer.name, this.SliderValue);
        }
        else{
            this.soundType = 0;
            this.musicType = 0;

            this.btnSoundClose.setVisible(true);
            this.btnSoundOpen.setVisible(false);

            this.btnMusicClose.setVisible(true);
            this.btnMusicOpen.setVisible(false);

            GameAssistant.singleton.setMusicType(GameMgr.singleton.curGameLayer.name, 0);
            GameAssistant.singleton.setEffectType(GameMgr.singleton.curGameLayer.name, 0);
            GameAssistant.singleton.setVolumeType(GameMgr.singleton.curGameLayer.name, 0);
        }

        this.textSoundValue.setVisible(false);
    },

    updateSoundValue : function (sender, type) {
        //cc.log(type + " " + sender.getPercent());
        this.SliderValue = sender.getPercent() / 100;
        if(this.SliderValue <= 0.01){
            this.SliderValue = 0;
        }

        GameMgr.singleton.curGameLayer.SoundValue = this.SliderValue;
        GameMgr.singleton.curGameLayer.EffectValue = this.SliderValue;
        //GameAssistant.singleton.setVolumeValue(GameMgr.singleton.curGameLayer.name, this.SliderValue);

        if(this.SliderValue > 0){
            if(this.StartValue == 0){
                GameMgr.singleton.curGameLayer.setPlaySound(true);
                GameMgr.singleton.curGameLayer.setPlayEffect(true);
            }
            else{
                if(this.btnMusicOpen.isVisible())
                    GameMgr.singleton.curGameLayer.setPlaySound(true);

                if(this.btnSoundOpen.isVisible())
                    GameMgr.singleton.curGameLayer.setPlayEffect(true);
            }
        }
        else{
            GameMgr.singleton.curGameLayer.setPlaySound(false);
            GameMgr.singleton.curGameLayer.setPlayEffect(false);
        }

        this.textSoundValue.setVisible(true);
        this.textSoundValue.setString(parseInt(this.SliderValue * 100) + '%');
        this.textSoundValue.setPositionX(this.sliderSoundValue.getBoundingBox().width * this.SliderValue);
    },

    resetSize : function (width, height, reset) {
        if(this.iResizeWidth == width && this.iResizeHeight == height)
            return ;

        this.iResizeWidth = width;
        this.iResizeHeight = height;

        var w = width;
        var h = height;

        // if (width > height) {
        //     width = Math.round(900 / height * width);
        //     height = 900;
        // } else {
        //     height = Math.round(900 / width * height);
        //     width = 900;
        // }

        var scale = 1;

        if (width > height) {
            scale = height / 900;
        } else {
            scale = width / 900;
        }

        this.Layer.node.setScale(scale);

        width /= scale;
        height /= scale;

        if (this.Panel_close) {
            if (reset || this.Panel_close.getContentSize().width != width || this.Panel_close.getContentSize().height != height) {
                this.Panel_close.setContentSize(width, height);
                if (this.Panel_ui) {
                    if (this.Panel_ui.defaultWidth > this.Panel_ui.parent.width) {
                        this.Panel_ui.setContentSize(this.Panel_ui.parent.width, this.Panel_ui.getContentSize().height);
                    }
                    if (this.Panel_ui.defaultHeight > this.Panel_ui.parent.height) {
                        this.Panel_ui.setContentSize(this.Panel_ui.getContentSize().width, this.Panel_ui.parent.height);
                    }
                    var component = this.Panel_ui.getComponent('__ui_layout');
                    if(component)
                        component.refreshLayout();

                    var y = this.Panel_buttom.getContentSize().height / this.Panel_ui.getContentSize().height * h ;
                    var hei = h - y;
                    GameMgr.singleton.curGameLayer.setHelpSize(w, hei, y);
                    GameMgr.singleton.curGameLayer.setGameRulesSize(w, hei, y);
                    if(GameMgr.singleton.curGameLayer.setHistorySize){
                        GameMgr.singleton.curGameLayer.setHistorySize(w, hei, y);
                    }
                }
            }
        }

        this.refreshBtns();
    },

    update : function (dt) {
        if(this.TextGroup)
            this.TextGroup.update(dt);

        this.resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height);
    },

    changeAction:function(actionName, loop) {
        this._state = actionName;
        if (actionName == "") {
            this._action.gotoFrameAndPlay(0, 0, 0, false);
        } else {
            this._action.play(actionName, loop);
        }
    },

    onBtnOpen : function () {
        this.changeAction("enter", false);
    },

    onBtnClose : function () {
        if(typeof(isinspecialview) != 'undefined'){
            isinspecialview = false;
        }
        if(this.closeCallfunc) {
            if(this.closeTarget)
                this.closeCallfunc.call(this.closeTarget);
            else
                this.closeCallfunc.call();
        } else {
            this.removeFromParent();

            GameMgr.singleton.curGameLayer.closeHelp();
            GameMgr.singleton.curGameLayer.closeGameRules();
            if(GameMgr.singleton.curGameLayer.closeHistory){
                GameMgr.singleton.curGameLayer.closeHistory();
            }
        }
    },

    onExit: function () {
        //this._mgr.removeTextGroup('common_text_setting');
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

    onBtnMenu : function () {
        if(this.okCallfunc) {
            if(this.okTarget)
                this.okCallfunc.call(this.okTarget);
            else
                this.okCallfunc.call();
        }
        this.onBtnClose();
    },

    onBtnSound : function () {
        this.soundType = !this.soundType;
        this.btnSoundClose.visible = !this.soundType;
        this.btnSoundOpen.visible = this.soundType;
        if (this.soundType) {
            //if(this.SliderValue > 0)
            //    GameMgr.singleton.curGameLayer.onTouchCloseEffect(undefined, ccui.Widget.TOUCH_ENDED);
            //else{
            //    this.SliderValue = GameMgr.singleton.curGameLayer.EffectValue;
            //    this.sliderSoundValue.setPercent(this.SliderValue * 100);
            //}

            this.SliderValue = GameAssistant.singleton.getVolumeValue(GameMgr.singleton.curGameLayer.name);
            GameMgr.singleton.curGameLayer.SoundValue = this.SliderValue;
            GameMgr.singleton.curGameLayer.EffectValue = this.SliderValue;
            GameMgr.singleton.curGameLayer.onTouchCloseEffect(undefined, ccui.Widget.TOUCH_ENDED);

            this.sliderSoundValue.setPercent(this.SliderValue * 100);
            GameAssistant.singleton.setVolumeType(GameMgr.singleton.curGameLayer.name, 1);
        }
        else {
            GameMgr.singleton.curGameLayer.onTouchOpenEffect(undefined, ccui.Widget.TOUCH_ENDED);

            if(!this.musicType){
                this.sliderSoundValue.setPercent(0);

                GameAssistant.singleton.setVolumeType(GameMgr.singleton.curGameLayer.name, 0);
            }
        }
    },

    onBtnMusic : function () {
        this.musicType = !this.musicType;
        this.btnMusicClose.visible = !this.musicType;
        this.btnMusicOpen.visible = this.musicType;
        if (this.musicType) {
            //if(this.SliderValue > 0)
            //    GameMgr.singleton.curGameLayer.onTouchCloseSound(undefined, ccui.Widget.TOUCH_ENDED);
            //else{
            //    this.SliderValue = GameMgr.singleton.curGameLayer.EffectValue;
            //    this.sliderSoundValue.setPercent(this.SliderValue * 100);
            //}

            this.SliderValue = GameAssistant.singleton.getVolumeValue(GameMgr.singleton.curGameLayer.name);
            GameMgr.singleton.curGameLayer.SoundValue = this.SliderValue;
            GameMgr.singleton.curGameLayer.EffectValue = this.SliderValue;
            GameMgr.singleton.curGameLayer.onTouchCloseSound(undefined, ccui.Widget.TOUCH_ENDED);

            this.sliderSoundValue.setPercent(this.SliderValue * 100);
            GameAssistant.singleton.setVolumeType(GameMgr.singleton.curGameLayer.name, 1);
        }
        else {
            GameMgr.singleton.curGameLayer.onTouchOpenSound(undefined, ccui.Widget.TOUCH_ENDED);

            if(!this.soundType){
                this.sliderSoundValue.setPercent(0);

                GameAssistant.singleton.setVolumeType(GameMgr.singleton.curGameLayer.name, 0);
            }
        }
    },

    onBtnQuickSpin : function () {
        this.quickSpinType = !this.quickSpinType;
        this.btnQuickSpinClose.visible = !this.quickSpinType;
        this.btnQuickSpinOpen.visible = this.quickSpinType;

        GameMgr.singleton.curGameLayer.onTouchBtnQuickSpin(undefined, ccui.Widget.TOUCH_ENDED, this.quickSpinType);
    },

    onBtnCoins : function () {
        this.coinsType = !this.coinsType;
        this.btnCoinsClose.visible = !this.coinsType;
        this.btnCoinsOpen.visible = this.coinsType;

        GameMgr.singleton.curGameLayer.onTouchBtnCoins(undefined, ccui.Widget.TOUCH_ENDED, this.coinsType);
    },

    onBtnSetAuto:function(){
        this.setAutoType = !this.setAutoType;
        this.btnSetAutoClose.visible = !this.setAutoType;
        this.btnSetAutoOpen.visible = this.setAutoType;

        GameMgr.singleton.curGameLayer.onTouchBtnSetAuto(undefined, ccui.Widget.TOUCH_ENDED, this.setAutoType);
    }
});

var OnlineTimeLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        this.textTime = new ccui.Text('', "Ubuntu-R_0", 24);
        this.textTime.setAnchorPoint(cc.p(1, 1));
        this.textTime.setTextHorizontalAlignment(ccui.TEXT_ALIGNMENT_RIGHT);
        this.addChild(this.textTime);

        var showonline = GamelogicMgr.instance.isShowOnlineTime();
        if (showonline) {
            this.textOnlineTime = new ccui.Text("", "Ubuntu-R_0", 24);
            this.textOnlineTime.setAnchorPoint(cc.p(1, 1));
            this.textOnlineTime.setTextHorizontalAlignment(ccui.TEXT_ALIGNMENT_RIGHT);
            this.addChild(this.textOnlineTime);
        }

        this._resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height);
        this.scheduleUpdate();
    },

    update: function(dt) {
        //! 更新时间和是否显示
        if(this.textTime){
            GamelogicMgr.instance.refreshUiLayerTime(this.textTime);
            this.textTime.setVisible(GamelogicMgr.instance.isShowUiLayerTime());
        }

        if(this.textOnlineTime){
            GamelogicMgr.instance.refreshOnLineTime(this.textOnlineTime);
        }

        this._resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height);
    },

    _resetSize: function(width, height) {
        var scale = 1;

        if (width > height) {
            scale = height / 900;
        } else {
            scale = width / 900;
        }

        var offset = 10;

        if (this.textTime) {
            this.textTime.setScale(scale);
            this.textTime.setPosition(width - 10, height - offset);

            if (this.textTime.isVisible()) {
                offset = 10 + 24 * scale;
            }
        }

        if (this.textOnlineTime) {
            this.textOnlineTime.setScale(scale);
            this.textOnlineTime.setPosition(width - 10, height - offset);
        }
    }
});


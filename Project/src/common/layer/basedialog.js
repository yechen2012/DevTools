var BaseDialog = cc.Layer.extend({
    /*
    * @param strTitle: type string; 标题字符串，undefined为图片标题
    * @param strInfo: type string; 提示信息字符串，一般来说不能为undefined（总要表示点什么吧）
    * @param btnData1: type Object; 按钮1数据, 例：{ title: "Cancel", callfunc: undefined, target: undefined }
    * @param btnData1: type Object; 按钮2数据, 例：{ title: "OK", callfunc: undefined, target: undefined }
    * @param btnData1: type Object; 按钮3数据, 例：{ title: "Game History", callfunc: undefined, target: undefined }
    * */
    ctor: function(strTitle, strInfo, btnData1, btnData2, btnData3) {
        this._super();

        this._strTitle = strTitle;
        this._strInfo = strInfo;
        this._lstBtnData = [];

        if (btnData1) {
            this._lstBtnData.push(btnData1);
        }

        if (btnData2) {
            this._lstBtnData.push(btnData2);
        }

        if (btnData3) {
            this._lstBtnData.push(btnData3);
        }

        this._iWidth = 0;
        this._iHeight = 0;
        this._anchorPoint = undefined;

        this._ccLayer = undefined;
        this._uiLayer = undefined;
        this._textTitle = undefined;
        this._textInfo = undefined;
        this._lstBtn = [];
        this._lstBtnTitle = [];
        this._textGroup = undefined;

        this._init();
        this.scheduleUpdate();
    },

    setDialogAnchorPoint: function(point) {
        this._anchorPoint = point;
        this._resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height, true);
    },

    setButtonVisible: function(btnIndex, visible) {
        if (btnIndex !== undefined && btnIndex >= 0 && btnIndex < this._lstBtn.length) {
            this._lstBtn[btnIndex].setVisible(visible);
        }
        else {
            cc.log("BaseDialog:setButtonVisible btnIndex = ", btnIndex, "Button is undefined!")
        }
    },

    setInfoVisible: function(visible) {
        if (this._textInfo) {
            this._textInfo.setVisible(visible);
        }
    },

    setInfoStr: function(str) {
        this._strInfo = str;
        this._textInfo.setString(this._strInfo);
    },

    update: function(dt) {
        this._resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height);
        if (this._textGroup) {
            this._textGroup.update();
        }
    },

    _init: function() {
        var layer = ccs.load(res.CommonBaseDialog_json);
        this.addChild(layer.node);

        this._ccLayer = layer;
        this._panelClose = findNodeByName(layer.node, "Panel_close");
        this._uiLayer = findNodeByName(layer.node, "Panel_ui");

        // 设置显隐
        var titleIndex = 0;
        if (this._strTitle !== undefined) {
            titleIndex = 1;
        }

        for (var i = 0; i < 2; ++i) {
            var modeTitle = findNodeByName(layer.node, "mode_title" + i);
            if (modeTitle) {
                modeTitle.setVisible(i === titleIndex);
            }
        }

        var btnIndex = this._lstBtnData.length - 1;
        for (var i = 0; i < 3; ++i) {
            var modeBtn = findNodeByName(layer.node, "mode_btn" + i);
            if (modeBtn) {
                modeBtn.setVisible(i === btnIndex);
            }
        }

        if (titleIndex === 1) {
            this._textTitle = findNodeByName(layer.node, "text_title");
            this._textTitle = new TextEx(this._textTitle);
            this._textTitle.setFontName("Ubuntu_M");
            this._textTitle.setMultiLine(false);
            this._textTitle.setString(this._strTitle);
        }

        var _textInfo = findNodeByName(layer.node, "text_info");
        this._textInfo = new TextEx(_textInfo);
        this._textInfo.setFontName("Ubuntu_M");
        this._textInfo.setFontSize(26);
        this._textInfo.setString(this._strInfo);
        this._textInfo.setMultiLine(true);

        var nodeMode = findNodeByName(layer.node, "mode_btn" + btnIndex);
        if (nodeMode) {
            for (var i = 0; i <= btnIndex; ++i) {
                var btn = findNodeByName(nodeMode, "btn_control_" + i);
                var title = findNodeByName(nodeMode, "btn_title_" + i);
                var btnData = this._lstBtnData[i];
                if (btn && btnData) {
                    if (btnData.callfunc && btnData.target)
                        btn.addTouchEventListener(btnData.callfunc, btnData.target);

                    this._lstBtn.push(btn);

                    if (title) {
                        title = new TextEx(title, false);
                        title.setFontName("Ubuntu_M");
                        title.setString(btnData.title);

                        this._lstBtnTitle.push(title);
                    }
                }
            }

            if (btnIndex > 0 && this._lstBtnTitle.length > 1) {
                var lstTitle = [];
                for (var i = 0; i < 2; ++i) {
                    lstTitle.push(this._lstBtnTitle[i]);
                }

                this._textGroup = new GameCanvasTextGroup(undefined, "textGroupBtn", lstTitle);
            }
        }

        this._resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height);
    },

    _resetSize: function(width, height, bReset) {
        if (this._iWidth === width && this._iHeight === height && !bReset) {
            return;
        }

        this._iWidth = width;
        this._iHeight = height;

        var scale = 1;
        if (width > height) {
            scale = height / 900;
        } else {
            scale = width / 900;
        }

        this._uiLayer.setScale(scale);
        this._uiLayer.setPosition(width * 0.5, height * 0.5);
        this._panelClose.setContentSize(width, height);

        if (this._anchorPoint !== undefined) {
            var rw = -this._iWidth * this._anchorPoint.x;
            var ry = -this._iHeight * this._anchorPoint.y;

            this._ccLayer.node.setPosition(rw, ry);
        }
    }
});

var ELEMENTAL_LOADING_GROUP_RES = [
    res.ElementalInfoNode_Group1_json,
    res.ElementalInfoNode_Group2_json,
    res.ElementalInfoNode_Group3_json,
    res.ElementalInfoNode_Group4_json,
];

var ELEMENTAL_LOADING_TEXT_INFO = [
    ["uiLoadInfo_fire1", "uiLoadInfo_fire2"],
    ["uiLoadInfo_earth1", "uiLoadInfo_earth2"],
    ["uiLoadInfo_air1", "uiLoadInfo_air2"],
    ["uiLoadInfo_water1", "uiLoadInfo_water2"]
];

var ELEMENTAL_CGH_GROUP_TIME = 5;

var ELEMENTAL_LOADING_POINT_KEY = "loadingPointKey";

var ElementalInfoLayer = cc.Layer.extend({
    ctor: function(gameLayer) {
        this._super();

        this._gameLayer = gameLayer;
        this._lstGroups = [];
        this._lstPoints = [];
        this._lstPointBack = [];
        this._lstSpine = [];
        this._nodeScroll = undefined;
        this._layClip = undefined;
        this._nodeGroup = undefined;
        this._displayPosition = undefined;
        this._waitPosition = undefined;
        this._exitPosition = undefined;

        this._lstTextGroup = [];

        this._iChgGroupTime = 0;
        this._iCurGroupIndex = 0;

        //! 逻辑
        this.lstpresstime = [2, 0.5, 2, 0.5];
        this.iPressState = 0;       //! 0显示动画 1出现文字 2显示文字 3文字消失
        this.iPressTime = 0;

        this.GameCanvasMgr = new GameCanvasMgr(this);

        var lstCanvas = [res.ElementalInfoCanvas1_json, res.ElementalInfoCanvas2_json, res.ElementalInfoCanvas3_json];
        this.GameCanvasMgr.addCanvases(lstCanvas);

        var canvas = this.GameCanvasMgr.getCanvas(0);
        canvas.removeFlag(gmc.GMC_FLAG_MOBILE);

        canvas = this.GameCanvasMgr.getCanvas(2);
        canvas.removeFlag(gmc.GMC_FLAG_PC);

        var lstAdaptive = ["layAdaptive", "layPress"];
        this.GameCanvasMgr.addAdaptiveLayouts(lstAdaptive);
        
        // background
        var nodeBackground = this.GameCanvasMgr.initSingle("nodeBackground", "nodeBackground");
        var background = ccs.load(res.ElementalInfoNode_Background_json);
        background.node.runAction(background.action);
        nodeBackground.addChild(background.node);
        this.GameCanvasMgr.addBackNode_SingleNode("nodeBackground", nodeBackground);

        var nodeInfoSpine = findNodeByName(background.node, "nodeInfoSpine");
        if (nodeInfoSpine) {
            var spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineGrass_json, res.ElementalBackgroundSpineGrass_atlas);
            spineAni.setAnimation(0, "cao_zi_zou", true);
            spineAni.setPosition(cc.p(0, 0));
            nodeInfoSpine.addChild(spineAni);

            spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineGrass_json, res.ElementalBackgroundSpineGrass_atlas);
            spineAni.setAnimation(0, "cao_zi_you", true);
            spineAni.setPosition(cc.p(0, 0));
            nodeInfoSpine.addChild(spineAni);
        }

        // layPress
        var layPress = this.GameCanvasMgr.initNode("layPress", "layPress");
        layPress.setCallFunction(this._onTouchPress, this);

        this._nodeGroup = this.GameCanvasMgr.initSingle("nodeBackGroup", "nodeBackGroup");
        this._nodePress = this.GameCanvasMgr.initSingle("nodeBackPress", "nodeBackPress");

        var textPress = this.GameCanvasMgr.initTextEx("textLoadingPress", "textLoadingPress");
        textPress.setMultiLine(false);
        textPress.setFontName("NotoSans-R");
        LanguageData.instance.showTextStr("splashScreen_start_desktop", textPress);

        this.nodeGambling = this.GameCanvasMgr.initNode("nodeGambling", "nodeGambling");
        if (!GamelogicMgr.instance.isShowGambling()) {
            this.nodeGambling.setVisible(false);
        }

        var nodeSpineLeft = this.GameCanvasMgr.initSingle("nodeInfoSpineLeft", "nodeInfoSpineLeft");
        var nodeSpineRight = this.GameCanvasMgr.initSingle("nodeInfoSpineRight", "nodeInfoSpineRight");
        if (nodeSpineLeft && nodeSpineRight) {
            var spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineFlower_json, res.ElementalBackgroundSpineFlower_atlas);
            spineAni.setAnimation(0, "huaban_zuo", true);
            spineAni.setPosition(0, 0);
            nodeSpineLeft.addChild(spineAni);

            var spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineFlower_json, res.ElementalBackgroundSpineFlower_atlas);
            spineAni.setAnimation(0, "huazhi_zuo", true);
            spineAni.setPosition(0, 0);
            nodeSpineLeft.addChild(spineAni);

            var spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineFlower_json, res.ElementalBackgroundSpineFlower_atlas);
            spineAni.setAnimation(0, "huaban_you", true);
            spineAni.setPosition(0, 0);
            nodeSpineRight.addChild(spineAni);

            var spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineFlower_json, res.ElementalBackgroundSpineFlower_atlas);
            spineAni.setAnimation(0, "huazhi_you", true);
            spineAni.setPosition(0, 0);
            nodeSpineRight.addChild(spineAni);
        }

        for (var i = 0; i < 4; ++i) {
            var sprName = "sprPoint" + (i + 1);
            var backName = "sprBackPoint" + (i + 1);
            var point = this.GameCanvasMgr.initNode(sprName, sprName);
            var back = this.GameCanvasMgr.initNode(backName, backName);
            this._lstPointBack.push(back);
            this._lstPoints.push(point);
        }

        this._initScrollNode();
        this._initGroup();

        this._refreshGroup();
        this._refreshPointVisible();
    },

    start: function() {
        this._iChgGroupTime = ELEMENTAL_CGH_GROUP_TIME;
        this.scheduleUpdate();
    },

    update: function(dt) {
        this.GameCanvasMgr.update(dt);

        if (this._lstTextGroup) {
            for (var i = 0; i < this._lstTextGroup.length; ++i) {
                this._lstTextGroup[i].update();
            }
        }

        if (this._iChgTime > 0) {
            this._iChgTime -= dt;
            if (this._iChgTime <= 0) {
                this._iChgTime = 0;
                this._bAction = false;
            }
        }

        if (!this._bAction && this._iChgGroupTime > 0) {
            this._iChgGroupTime -= dt;

            if (this._iChgGroupTime <= 0) {
                this._iChgGroupTime = ELEMENTAL_CGH_GROUP_TIME;
                this._iCurGroupIndex = this._getNextIndex();

                this._refreshPointVisible();
                this._chgGroup();
            }
        }

        //! 提示动画
        this.iPressTime -= dt;

        if(this.iPressTime <= 0) {
            this.iPressState += 1;

            if(this.iPressState > 3)
                this.iPressState = 0;

            this.iPressTime = this.lstpresstime[this.iPressState] + this.iPressTime;
            this._refreshPress(true);
        }
        else {
            this._refreshPress(false);
        }
    },

    _initScrollNode: function() {
        var nodeScroll = ccs.load(res.ElementalInfoNode_Scroll_json);
        nodeScroll.node.runAction(nodeScroll.action);
        this._nodeGroup.addChild(nodeScroll.node);

        this._nodeScroll = nodeScroll.node;

        this._layClip = findNodeByName(this._nodeScroll, "layScrollClip");

        var nodeDisplay = findNodeByName(this._nodeScroll, "nodeDisplay");
        if (nodeDisplay) {
            this._displayPosition = nodeDisplay.getPosition();
        }

        var nodeWait = findNodeByName(this._nodeScroll, "nodeWait");
        if (nodeWait) {
            this._waitPosition = nodeWait.getPosition();
        }

        var nodeExit = findNodeByName(this._nodeScroll, "nodeExit");
        if (nodeExit) {
            this._exitPosition = nodeExit.getPosition();
        }

        var nodeSpine = findNodeByName(this._nodeScroll, "nodeSpine");
        if (nodeSpine) {
            for (var i = 1; i < 5; ++i) {
                var spineAtlas = res["ElementalFreeSelectSpine0" + i + "_atlas"];
                var spineJson = res["ElementalFreeSelectSpine0" + i + "_json"];

                var aniSpine = sp.SkeletonAnimation.createWithJsonFile(spineJson, spineAtlas, 0.8);
                aniSpine.setAnimation(0, 'daiji', true);
                aniSpine.setPosition(cc.p(0, -300));
                aniSpine.setVisible(false);
                nodeSpine.addChild(aniSpine);

                this._lstSpine.push(aniSpine);
            }
        }
    },

    _initGroup: function() {
        this._lstGroups = [];

        for (var i = 0; i < 4; ++i) {
            var group = ccs.load(ELEMENTAL_LOADING_GROUP_RES[i]);
            group.node.runAction(group.action);
            this._layClip.addChild(group.node);

            this._lstGroups.push(group.node);

            // 多语言适配
            var textInfo1 = findNodeByName(group.node, "textInfo1");
            if (textInfo1) {
                textInfo1 = new TextEx(textInfo1, false);
                var str = LanguageData.instance.getTextStr(ELEMENTAL_LOADING_TEXT_INFO[i][0]);
                textInfo1.setString(str.toUpperCase());
                // LanguageData.instance.showTextStr(ELEMENTAL_LOADING_TEXT_INFO[i], textInfo);
            }

            var textInfo2 = findNodeByName(group.node, "textInfo2");
            if (textInfo2) {
                textInfo2 = new TextEx(textInfo2, false);
                var str = LanguageData.instance.getTextStr(ELEMENTAL_LOADING_TEXT_INFO[i][1]);
                textInfo2.setString(str.toUpperCase());
                // LanguageData.instance.showTextStr(ELEMENTAL_LOADING_TEXT_INFO[i], textInfo);
            }

            var textGroup = new GameCanvasTextGroup(undefined, "ElementalInfoGroup" + i, [textInfo1, textInfo2]);
            this._lstTextGroup.push(textGroup);
        }
    },

    _refreshPointVisible: function() {
        for (var i = 0; i < 4; ++i) {
            this._lstPoints[i].setVisible(i === this._iCurGroupIndex, ELEMENTAL_LOADING_POINT_KEY);
            this._lstPointBack[i].setVisible(i !== this._iCurGroupIndex, ELEMENTAL_LOADING_POINT_KEY);
            this._lstSpine[i].setVisible(i === this._iCurGroupIndex);
        }
    },

    _refreshGroup: function() {
        for (var i = 0; i < 4; ++i) {
            this._lstGroups[i].setVisible(i === this._iCurGroupIndex);
        }

        this._lstGroups[this._iCurGroupIndex].setPosition(this._displayPosition);
        this._lstGroups[this._getNextIndex()].setPosition(this._waitPosition);
    },

    _chgGroup: function() {
        this._bAction = true;
        this._iChgTime = 0.5;

        var curGroup = this._lstGroups[this._getLastIndex()];
        var nextGroup = this._lstGroups[this._iCurGroupIndex];

        curGroup.setVisible(true);
        nextGroup.setVisible(true);
        nextGroup.setPosition(this._waitPosition);

        curGroup.stopAllActions();
        nextGroup.stopAllActions();
        curGroup.runAction(this._createAction(this._exitPosition));
        nextGroup.runAction(this._createAction(this._displayPosition));
    },

    _getLastIndex: function() {
        var ret = this._iCurGroupIndex - 1;
        if (ret < 0) {
            ret = 3;
        }

        return ret;
    },

    _getNextIndex: function() {
        var ret = this._iCurGroupIndex + 1;
        if (ret > 3) {
            ret = 0;
        }

        return ret;
    },

    _createAction: function(targetPos) {
        return cc.moveTo(0.5, targetPos);
    },

    _refreshPress : function (bChg) {
        if(bChg) {
            this._nodePress.setVisible(this.iPressState != 0);
        }

        switch(this.iPressState) {
            case 0:
                break;
            case 1:
                var opacity = Math.floor(255 * (1 - this.iPressTime / this.lstpresstime[1]));
                opacity = Math.min(255, opacity);
                opacity = Math.max(0, opacity);
                this._nodePress.setOpacity(opacity);
                break;
            case 2:
                this._nodePress.setOpacity(255);
                break;
            case 3:
                var opacity = Math.floor(255 * this.iPressTime / this.lstpresstime[3]);
                opacity = Math.min(255, opacity);
                opacity = Math.max(0, opacity);
                this._nodePress.setOpacity(opacity);
                break;
        }
    },

    _onTouchPress: function() {
        if (this._gameLayer) {
            this._gameLayer.closeInfoLayer();
        }
    }
});
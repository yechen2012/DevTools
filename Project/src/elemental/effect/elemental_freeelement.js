var ELEMENTAL_CHAR_TEXT_INFO = [
    ["uiLoadInfo_fire1", "uiLoadInfo_fire2"],
    ["uiLoadInfo_earth1", "uiLoadInfo_earth2"],
    ["uiLoadInfo_air1", "uiLoadInfo_air2"],
    ["uiLoadInfo_water1", "uiLoadInfo_water2"]
];

var ElementalFreeSelectElement = cc.Node.extend({
    ctor: function(type) {
        this._super();

        this._iType = type;

        if (type < 1 || type > 4)
            return;

        var aniFile = res["ElementalFreeSelectChar0" + type + "_json"];

        var node = ccs.load(aniFile);
        node.node.runAction(node.action);
        this.addChild(node.node);

        var nodeSpine = findNodeByName(node.node, "nodeSpine");
        if (nodeSpine) {
            var spineAtlas = res["ElementalFreeSelectSpine0" + type + "_atlas"];
            var spineJson = res["ElementalFreeSelectSpine0" + type + "_json"];
            var size = nodeSpine.getLayoutSize();

            var aniSpine = sp.SkeletonAnimation.createWithJsonFile(spineJson, spineAtlas);
            aniSpine.setAnimation(0, 'daiji', true);
            aniSpine.setPosition(cc.p(85, -300));
            nodeSpine.addChild(aniSpine);
        }

        var textInfo1 = findNodeByName(node.node, "textInfo1");
        if (textInfo1) {
            textInfo1 = new TextEx(textInfo1, true);
            var str = LanguageData.instance.getTextStr(ELEMENTAL_CHAR_TEXT_INFO[type - 1][0]);
            textInfo1.setString(str);
        }

        var textInfo2 = findNodeByName(node.node, "textInfo2");
        if (textInfo2) {
            textInfo2 = new TextEx(textInfo2, true);
            var str = LanguageData.instance.getTextStr(ELEMENTAL_CHAR_TEXT_INFO[type - 1][1]);
            textInfo2.setString(str);
        }

        this._textGroup = new GameCanvasTextGroup(undefined, "FreeElement", [textInfo1, textInfo2]);

        this.setCascadeColorEnabled(true);
        this.setCascadeOpacityEnabled(true);
    },

    getType: function() {
        return this._iType;
    },

    setRootIndex: function(index) {
        this._iRootIndex = index;
    },

    getRootIndex: function() {
        return this._iRootIndex;
    },

    playAppearAni: function() {
        this.runAction(cc.fadeIn(5 / 24));
    }
});
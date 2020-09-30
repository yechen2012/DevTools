var ELEMENTAL_LINE_ANI = {
    "0_1" : "xian_01",
    "-1_1" : "xian_08",
    "-1_0" : "xian_04",
    "-1_-1" : "xian_07",
    "0_-1" : "xian_03",
    "1_-1" : "xian_06",
    "1_0" : "xian_02",
    "1_1" : "xian_05"
};

var ElementalFGSoilLine = cc.Class.extend({
    ctor: function() {

        this._bOver = true;
        this._bVisible = false;
        this._basePoint = undefined;
        this._lstLines = {}; // 线动画,已中心点为基点，计算基点-目标点 xy坐标的差值相连的字符串作为key存储
        this._lstAniKey = [];

        this._iAniTime = 0;
    },

    init: function(parent) {
        this._basePoint = {x: 1, y: 1};
        var key = "";
        var line = undefined;

        ccs.armatureDataManager.addArmatureFileInfo(res.ElementalWildSoil_exjson);
        for (var i = 0; i < 3; ++i) {
            for (var j = 0; j < 3; ++j) {
                if (i === 1 && j === 1) {
                    continue;
                }

                key = this._createKey({y: i, x: j});
                line = new ccs.Armature("elemental_wild_tu");
                parent.addChild(line);

                this._lstLines[key] = line;
            }
        }

        this.setVisible(false);
    },

    reset: function() {
        this._lstAniKey = [];
        this.setVisible(false);
    },

    isOver: function() {
        return this._bOver;
    },

    setBasePoint: function(point) {
        this._basePoint = point;
    },

    addLinePoint: function(x, y) {
        if (x && y)
            this._lstAniKey.push(this._createKey({x: x, y: y}));
    },

    setLinePoints: function(lstPoint) {
        if (!lstPoint)
            return;

        var point = undefined;
        for (var i = 0; i < lstPoint.length; ++i) {
            point = lstPoint[i];
            var key = this._createKey(point);
            this._lstAniKey.push(key);
        }
    },

    setPosition: function(position) {
        for (var key in this._lstLines) {
            if (this._lstLines.hasOwnProperty(key)) {
                var line = this._lstLines[key];
                line.setPosition(position);
            }
        }
    },

    getAniTime: function() {
        return this._iAniTime;
    },

    playLineAni: function() {
        this._refreshVisible();
        this._playLineAni();

        this._bOver = false;
        this._iAniTime = 40 / 24;
    },

    isVisible: function() {
        return this._bVisible;
    },

    setVisible: function(visible) {
        this._bVisible = visible;

        this._refreshVisible();
    },

    update: function(dt) {
        if (this._bOver)
            return;

        if (this._iAniTime > 0) {
            this._iAniTime -= dt;

            if (this._iAniTime <= 0) {
                this._iAniTime = 0;

                this._bOver = true;
            }
        }
    },

    _refreshVisible: function() {
        if (!this._bVisible) {
            for (var key in this._lstLines) {
                if (this._lstLines.hasOwnProperty( key)) {
                    var value = this._lstLines[key];
                    value.setVisible(false);
                }
            }
        }
        else {
            for (var i = 0; i < this._lstAniKey.length; ++i) {
                var key = this._lstAniKey[i];
                if (this._lstLines[key]) {
                    this._lstLines[key].setVisible(this._bVisible);
                }
            }
        }
    },

    _playLineAni: function() {
        for (var i = 0; i < this._lstAniKey.length; ++i) {
            var key = this._lstAniKey[i];
            var line = this._lstLines[key];
            var aniName = ELEMENTAL_LINE_ANI[key];
            if (line && aniName) {
                line.animation.play(aniName, 0, 0);
            }
        }
    },

    _createKey: function(point) {
        return (this._basePoint.x - point.x) + "_" + (this._basePoint.y - point.y);
    }
});
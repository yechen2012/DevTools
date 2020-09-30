
/*
* ICON ID-POINT规则 ID = POINT.col * 3 + POINT.row
* 0 3 6 9  12    (0,0) (1,0) (2,0) (3,0) (4,0)
* 1 4 7 10 13    (0,1) (1,1) (2,1) (3,1) (4,1)
* 2 5 8 11 14    (0,2) (1,2) (2,2) (3,2) (4,2)
*
* */

// 风 MegaWild 图标 等级：0 1 2 3
var ELEMENTAL_WIND_ICON_IMG = [
    "elemental_icon16.png",
    "elemental_icon17.png",
    "elemental_icon18.png",
    "elemental_icon19.png"
];

// 风 MegaWild 图标 移动结束后的动画配置，等级 0123
var ELEMENTAL_WIN_MOVE_END_ANI = [
    ["xia_bc01", "shang_bc01"],
    ["xia_bc02", "shang_bc02"],
    ["xia_bc03", "shang_bc03"],
    ["xia_bc04", "shang_bc04"]
];

var ELEMENTAL_WIND_ICON_SIZE = [
    [102, 102],
    [102, 102],
    [102, 102],
    [102, 102]
];

var ELEMENTAL_WIND_ICON_ANI_RUN = [];

var ELEMENTAL_WIN_ICON_ANI_NAME = [
    ["huojiang1", "1x2", "2zhongjiang"],
    ["huojiang2", "2x2", "4zhongjiang"],
    ["huojiang3", "3x2", "6zhongjiang"],
    ["huojiang4", "3x3", "9zhongjiang"],
];

var ELEMENTAL_WIND_ICON_ANI_EXTEND = [];

var ELEMENTAL_WIND_ANI_CLIP = [];

var ELEMENTAL_WIND_CLIP_SIZE = [
    { width : 408, height: 204 },
    { width : 408, height: 408 },
    { width : 408, height: 612 }
];

var ElementalEffectNodeMgr = cc.Class.extend({
    ctor: function(effectMgr, logic) {

        this._logic = logic;
        this._effectMgr = effectMgr;
        this._nodeWheel = undefined;
        this._nodeTopEffectWheel = undefined;
        this._nodeTopWheel = undefined;
        this._soilLine = undefined;
        this._lstSoilLine = [];
        this._lstIcon = [];
        this._lstPosition = [];

        this._lstIconRunAniDef = undefined; // 图标中奖动画配置
        this._lstIconRunAni = undefined; // 总共5个数组元素
    },

    init: function(canvasMgr, lstWheel) {
        if (!canvasMgr || !lstWheel)
            return;

        ELEMENTAL_WIND_ICON_ANI_RUN.push(res.ElementalIconRunAni16_json);
        ELEMENTAL_WIND_ICON_ANI_RUN.push(res.ElementalIconRunAni17_json);
        ELEMENTAL_WIND_ICON_ANI_RUN.push(res.ElementalIconRunAni18_json);
        ELEMENTAL_WIND_ICON_ANI_RUN.push(res.ElementalIconRunAni19_json);

        ELEMENTAL_WIND_ICON_ANI_EXTEND = [
            {
                "0" : res.ElementalIconWindAni2_4_Up_json,
                "2" : res.ElementalIconWindAni2_4_Down_json
            },
            {
                "0" : res.ElementalIconWindAni4_6_Up_json,
                "2" : res.ElementalIconWindAni4_6_Down_json
            },
            {
                "1" : res.ElementalIconWindAni6_9_Right_json,
                "3" : res.ElementalIconWindAni6_9_Left_json
            }
        ];

        var nodeTopWheel = canvasMgr.getSingle("nodeTopWheel");

        var curIndex = canvasMgr.getCurCanvasIndex();

        this._lstIconRunAni = new Array(5);
        for (var i = 0; i < 5; ++i) {
            this._lstIconRunAni[i] = new Array(3);
        }

        this._nodeEffectWheel = findNodeByName(nodeTopWheel.getNode(curIndex), "layEffectWheel");
        this._nodeTopEffectWheel = findNodeByName(nodeTopWheel.getNode(curIndex), "layTopEffectWheel");
        this._nodeTopWheel = findNodeByName(nodeTopWheel.getNode(curIndex), "layTopWheel");
        this._initPosition(lstWheel);
        this._initIcon();
        this._createLine(3); // 预先创建3个line组件以供使用
    },

    reset: function() {
        for (var i = 0; i < this._lstSoilLine.length; ++i) {
            this._lstSoilLine[i].reset();
        }

        this._resetIcon();
    },

    getIconPosition: function() {
        return this._lstPosition;
    },

    setGameType: function(type) {
        for (var i = 0; i < this._lstIcon.length; ++i) {
            var lst = this._lstIcon[i];
            for (var j = 0; j < lst.length; ++j) {
                lst[j].setGameType(type);
            }
        }
    },

    setIconVisible: function(lstPoint, visible) {
        if (lstPoint) {
            for (var i = 0; i < lstPoint.length; ++i) {
                var icon = this._getIcon(lstPoint[i]);
                icon.setVisible(visible);
            }
        }
    },

    isDisplayFGWindMegaWild: function(wheelIndex, iconPosition) {
        var ret = false;
        if (wheelIndex != undefined && iconPosition != undefined) {
            var lstPosition = this._lstPosition[wheelIndex];
            if (lstPosition) {
                for (var i = 0; i < lstPosition.length; ++i) {
                    if (iconPosition.y >= lstPosition[i].y - 1 && iconPosition.y <= lstPosition[i].y + 1) {
                        var icon = this._getIcon(new ElementalPoint(wheelIndex, i));
                        if (icon && icon.isFGWindMegaWild()) {
                            ret = true;
                        }

                        break;
                    }
                }
            }
        }

        return ret;
    },

    playFGSoilReadyAni: function(data) {
        var time = 0.01;
        if (data) {
            var base = data.base;
            var icon = this._getIcon(base);
            icon.setVisible(true);
            icon.playSoilReadyAni();
            time = icon.getAniTime();

            var lstPoints = data.points;
            if (lstPoints) {
                for (var i = 0; i < lstPoints.length; ++i) {
                    icon = this._getIcon(lstPoints[i]);
                    icon.setVisible(true);
                    icon.playSoilWaitAni();
                }
            }
        }

        return time;
    },

    playFGSoilLineAni: function(data, index) {
        var time = 0.01;
        if (data) {
            if (index >= this._lstSoilLine.length) {
                // line组件数量不够了，加一下
                this._createLine(index - this._lstSoilLine.length + 1);
            }

            var line = this._lstSoilLine[index];

            line.setBasePoint(data.base);
            line.setPosition(this._getPosition(data.base));
            line.setLinePoints(data.points);

            line.setVisible(true);
            line.playLineAni();

            time = line.getAniTime();
        }

        return time;
    },

    playFGSoilTransformAni: function(data) {
        var time = 0.01;
        if (data) {
            var lstPoints = data.points;
            for (var i = 0; i < lstPoints.length; ++i) {
                var icon = this._getIcon(lstPoints[i]);
                icon.playSoilTransformAni();

                time = icon.getAniTime();
            }
        }

        return time;
    },

    displayFGWaterIceWild: function(lstData) {
        if (lstData) {
            var point = undefined;
            for (var i = 0; i < lstData.length; ++i) {
                point = lstData[i];
                var icon = this._getIcon(point);
                icon.setVisible(true);
                icon.displayWaterIceWild();
            }
        }
    },

    playFGWaterBetaDisplayAni: function(lstData) {
        var time = 0.01;
        if (lstData) {
            var point = undefined;
            var icon = undefined;
            for (var i = 0; i < lstData.length; ++i) {
                point = lstData[i];
                var icon = this._getIcon(point);
                icon.setVisible(true);
                icon.playIconBetaDisplayAni();
                icon.playWaterBetaDisplayAni();

                time = Math.max(icon.getAniTime(), time);
            }
        }

        return time;
    },

    playFGWaterChgWaterAni: function(lstData, delayTime) {
        var time = 0.01;
        if (lstData) {
            var data = undefined;
            for (var i = 0; i < lstData.length; ++i) {
                data = lstData[i];
                var icon = this._getIcon(data);
                icon.setVisible(true);
                icon.playWaterChgWaterAni(delayTime);

                time = Math.max(icon.getAniTime(), time);
            }
        }

        return time;
    },

    playFGWaterChgIceAni: function(lstData) {
        var time = 0.01;
        if (lstData) {
            var data = undefined;
            for (var i = 0; i < lstData.length; ++i) {
                data = lstData[i];
                var icon = this._getIcon(data);
                icon.setVisible(true);
                icon.playWaterChgIceAni();
                time = Math.max(icon.getAniTime(), time);
            }
        }

        return time;
    },

    // 显示风元素游戏MegaWild
    displayFGWindMegaWild: function(rect) {
        if (rect) {
            this._resetIcon();
            rect = this._logic.convertToDisplayRect(rect);

            var baseIcon = this._getIcon(rect.basePoint);
            if (baseIcon) {
                baseIcon.setIsActive(true);
                baseIcon.setVisible(true);
                baseIcon.clearElement();

                // 注：此处必须先行设置Element
                if (rect.points) {
                    var point = undefined;
                    var icon = undefined;
                    for (var i = 0; i < rect.points.length; ++i) {
                        point = rect.points[i];
                        if (!point.isEqual(rect.basePoint)) {
                            icon = this._getIcon(point);
                            if (icon) {
                                icon.reset();
                                icon.setIsActive(true);
                                icon.setRootElement(baseIcon);
                                baseIcon.addElement(icon);
                            }
                        }
                    }
                }

                baseIcon.displayWindMegaWild(rect.lv);
            }
        }
    },

    playFGWindMoveEndAni: function(rect) {
        if (!rect || !rect.basePoint)
            return;

        var baseIcon = this._getIcon(rect.basePoint);
        baseIcon.playWindMoveEndAni();
    },

    clearFGWindMegaWild: function(rect) {
        if(!rect)
            return;

        var icon = undefined;
        var point = undefined;

        icon = this._getIcon(rect.basePoint);
        if (icon) {
            icon.setVisible(false);
            icon.reset();
        }

        for (var i = 0; i < rect.points.length; ++i) {
            point = rect.points[i];
            icon = this._getIcon(point);
            if (icon) {
                icon.setVisible(false);
                icon.reset();
            }
        }
    },

    playFGWindBetaDisplayAni: function(rect) {
        var time = 0.01;
        if (rect) {
            var icon = this._getIcon(rect.basePoint);
            icon.setVisible(true);
            icon.playIconBetaDisplayAni();
            icon.playWindBetaDisplayAni();

            time = icon.getAniTime();
        }

        return time;
    },

    playFGWindMoveAni: function(startRect, endRect) {
        var ret = false;

        if (startRect && endRect) {
            if (!this._logic.isEqualRect(startRect, endRect)) {
                ret = true;

                var icon = this._getIcon(startRect.basePoint);

                if (icon) {
                    var self = this;
                    var start = this._getPosition(startRect.basePoint);
                    var end = this._getPosition(endRect.basePoint);

                    icon.setVisible(true);
                    icon.runAction(cc.sequence(
                        cc.moveTo(1, end),
                        cc.callFunc(function(){
                            icon.setPosition(start);
                            icon.setVisible(false);

                            self.clearFGWindMegaWild(startRect);
                            self.displayFGWindMegaWild(endRect);
                            self.playFGWindMoveEndAni(endRect);
                        })
                    ));
                }
            }
            else {
                this.playFGWindMoveEndAni(endRect);
            }
        }

        return ret;
    },

    playFGWindExtendAni: function(rect) {
        var time = 0.01;
        if (rect) {
            var baseIcon = this._getIcon(rect.basePoint);
            if (baseIcon) {
                var lstAni = ELEMENTAL_WIND_ICON_ANI_EXTEND[rect.lv - 1];
                var ani = lstAni[rect.direction];

                baseIcon.setVisible(true);
                baseIcon.playWindExtendAni(ani, rect);

                time = baseIcon.getAniTime();

                cc.audioEngine.playEffect(res.ElementalFGWindWildExtend_mp3, false);
            }
        }

        return time;
    },

    playFGWindTopAni: function(x, y) {
        var ret = false;
        var icon = this._getIconByXY(x, y);
        if (icon) {
            ret = icon.playWindRunAni();
        }

        return ret;
    },

    clearFGWindTopAni: function(x, y) {
        if (x !== undefined && y !== undefined) {
            var icon = this._getIconByXY(x, y);
            if (icon) {
                icon.clearWindRunAni();
            }
        }
        else {
            for (var i = 0; i < this._lstIcon.length; ++i) {
                var lst = this._lstIcon[i];
                for (var j = 0; j < lst.length; ++j) {
                    lst[j].clearWindRunAni();
                }
            }
        }
    },

    setTopWheelRunAniDef: function(lstAniDef) {
        this._lstIconRunAniDef = lstAniDef;
    },

    setTopWheelIconData: function(lstData) {
        this._lstIconData = lstData;
    },

    showTop: function(x, y) {
        if (!this._lstIconData)
            return;

        var node = this._lstIconRunAni[x][y];
        if (!node) {
            node = this.createTopRunAni(x, y);
        }

        node.node.setVisible(true);
        node.action.gotoFrameAndPlay(0, node.action.getDuration(), true);
    },

    createTopRunAni: function(x, y) {
        // 注：因轮子数据与服务器数据在列上市相反的，所以此处每列的数据需要顺序反一下
        var iconData = this._lstIconData[x][Math.abs(y - 2)];
        var file = this._lstIconRunAniDef[iconData];
        var node = CcsResCache.singleton.load(file);
        node.node.runAction(node.action);
        var zOrder = 0;
        if (iconData == LIST_SYMBOLS.FG)
            zOrder = 2;
        else if (iconData == LIST_SYMBOLS.WL)
            zOrder = 1;

        node.node.setPosition(this._getPosition(x, y));
        node.node.setVisible(false);
        this._nodeTopWheel.addChild(node.node, zOrder);

        this._lstIconRunAni[x][y] = node;

        return node;
    },

    clearTop: function(x, y) {
        if (x !== undefined && y !== undefined) {
            var node = this._lstIconRunAni[x][y];
            if (node)
                node.node.setVisible(false);
        }
        else {
            for (var i = 0; i < this._lstIconRunAni.length; ++i) {
                var lstAni = this._lstIconRunAni[i];
                for (var j = 0; j < lstAni.length; ++j) {
                    if (lstAni[j]) {
                        lstAni[j].node.setVisible(false);
                    }
                }
            }
        }
    },

    resetTopWheelRunAni: function() {
        for (var i = 0; i < this._lstIconRunAni.length; ++i) {
            var lstAni = this._lstIconRunAni[i];
            for (var j = 0; j < lstAni.length; ++j) {
                if (lstAni[j]) {
                    CcsResCache.singleton.release(lstAni[j]);
                    lstAni[j] = undefined;
                }
            }
        }
    },

    update: function(dt) {
        var line = undefined;
        for (var i = 0; i < this._lstSoilLine.length; ++i) {
            line = this._lstSoilLine[i];
            line.update(dt);

            if (line.isVisible() && line.isOver()) {
                line.setVisible(false);
            }
        }

        var icon = undefined;
        for (var i = 0; i < 5; ++i) {
            for (var j = 0; j < 3; ++j) {
                icon = this._lstIcon[i][j];
                icon.update(dt);
            }
        }
    },

    _resetIcon: function() {
        for (var i = 0; i < this._lstIcon.length; ++i) {
            var lst = this._lstIcon[i];
            for (var j = 0; j < lst.length; ++j) {
                var icon = lst[j];
                icon.setVisible(false);
                icon.reset();
            }
        }
    },

    _initPosition: function(lstWheel) {
        var wheel = lstWheel[0];
        var contentSize = wheel.layWheel;
        var sbx = contentSize.width * 0.5;
        var iconSp = wheel.iconsp;
        var bi = Math.floor(wheel.lsttopnode.length * 0.5) - Math.floor(wheel.iLogicNum * 0.5);
        var spy = wheel.spy;
        var sby = wheel.sby + bi * iconSp + 2 * iconSp + spy;

        for (var i = 0; i < 5; ++i) {
            var nodeWheel = lstWheel[i].layWheel;
            var lstPosition = [];
            var point = undefined;
            for (var j = 0; j < 3; ++j) {
                point = nodeWheel.convertToWorldSpace(cc.p(sbx, sby - j * iconSp));
                point = this._nodeEffectWheel.convertToNodeSpace(point);
                lstPosition.push(point);
            }

            this._lstPosition.push(lstPosition);
        }
    },

    _initIcon: function() {
        for (var i = 0; i < 5; ++i) {
            var lstIcon = [];
            for (var j = 0; j < 3; ++j) {
                var point = {x: j, y: i};
                var icon = new ElementalEffectIcon(this._point2id(point), point);
                icon.setPosition(this._lstPosition[i][j]);
                icon.setTopNode(this._nodeTopEffectWheel);
                this._nodeEffectWheel.addChild(icon.getNode());
                this._nodeTopEffectWheel.addChild(icon.getTopNode());
                lstIcon.push(icon);
            }

            this._lstIcon.push(lstIcon);
        }
    },

    _createLine: function(count) {
        for (var i = 0; i < count; ++i) {
            var line = new ElementalFGSoilLine();
            line.init(this._nodeEffectWheel);
            line.setVisible(false);

            this._lstSoilLine.push(line);
        }
    },

    _getIcon: function(point) {
        return this._lstIcon[point.x][point.y];
    },

    _getIconByXY: function(x, y) {
        return this._lstIcon[x][y];
    },

    _getPosition: function(point, y) {
        if (y !== undefined) {
            return this._lstPosition[point][y];
        }

        return this._lstPosition[point.x][point.y];
    },

    _point2id: function(point) {
        return point.x + point.y * 3;
    }
});
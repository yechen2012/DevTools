var ELEMENTAL_WIND_BOARD_LV = [
    "1X2",
    "2X2",
    "2X3",
    "3X3"
];

var ElementalBoardMgr = cc.Class.extend({
    ctor: function(effectMgr) {

        this._iGameType = ELEMENTAL_GAME_TYPE.GAME_BG;

        this._canvasMgr = undefined;
        this._effectMgr = effectMgr;
        this._textFire = undefined;
        this._textWind = undefined;
        this._backWind = undefined;
        this._nodeFly = undefined;

        this._iWildLv = 0;
        this._iFireCnt = 0;
        this._iCurFireMul = 1;

        this._lstFlyNodes = [];
        this._lstWindLevel = [];
        this._lstWindFire = [[], [], []];

        this._lstFirePosition = [];
        this._lstWindPosition = [];

        this._lstFlyPosition = []; // 飞行物的起始坐标点数组
        this._lstEndPosition = undefined; // 飞行物结束坐标点

        this._ctrlWindAni = undefined;
        this._ctrlFireAni = undefined;

        this._iFlyNodeCount = 0;
    },

    init: function(lstWheel, canvasMgr) {
        if (!lstWheel || !canvasMgr)
            return;

        this._canvasMgr = canvasMgr;
        this._nodeFly = canvasMgr.getNode("nodeFly");

        var nodeCollect = canvasMgr.getSingle("nodeCollectFire");
        var index = canvasMgr.getCurCanvasIndex();
        var nodeRoot = nodeCollect.getNode(index);
        if (!nodeRoot)
            return;

        var nodeFire = findNodeByName(nodeRoot, "nodeFGFireBoard");
        if (nodeFire) {
            this._textFire = findNodeByName(nodeFire, "txtFire");

            this._ctrlFireAni = findNodeByName(nodeFire, "ctrlFGFireAni");
            this._ctrlFireAni.setVisible(false);
        }

        nodeCollect = canvasMgr.getSingle("nodeCollectWind");
        index = canvasMgr.getCurCanvasIndex();
        nodeRoot = nodeCollect.getNode(index);
        if (!nodeRoot)
            return;

        var nodeWind = findNodeByName(nodeRoot, "nodeFGWindBoard");
        if (nodeWind) {
            this._textWind = findNodeByName(nodeWind, "txtWind");
            this._backWind = findNodeByName(nodeWind, "backwind");

            this._ctrlWindAni = findNodeByName(nodeWind, "ctrlFGWindAni");
            this._ctrlWindAni.setVisible(false);
            
            var name = "";
            for (var i = 1; i < 10; ++i) {
                if (i < 4) {
                    name = "nodeLevel0" + i;
                    var node = findNodeByName(nodeWind, name);
                    node.setVisible(false);
                    this._lstWindLevel.push(node);
                }

                name = "aniFire0" + i;
                var node = findNodeByName(nodeWind, name);
                node.setVisible(false);

                if (i < 3) {
                    this._lstWindFire[0].push(node);
                }
                else if (i < 6) {
                    this._lstWindFire[1].push(node);
                }
                else {
                    this._lstWindFire[2].push(node);
                }
            }
        }

        this._initFlyNodePosition(lstWheel);
    },

    reset: function() {
        this._iFireLv = 0;
        this._iFireCnt = 0;
        this._iCurFireMul = 1;

        this.refreshFGRFireMul();

        for (var i = 0; i < this._lstWindLevel.length; ++i) {
            this._lstWindLevel[i].setVisible(false);
        }

        for (var i = 0; i < this._lstWindFire.length; ++i) {
            var lst = this._lstWindFire[i];
            for (var j = 0; j < lst.length; ++j) {
                lst[j].setVisible(false);
            }
        }
    },

    setGameType: function(gameType) {
        this._iGameType = gameType;

        this._refreshGameType();
    },

    setFGFireMul: function(mul) {
        this._iCurFireMul = mul;

        this.refreshFGRFireMul();
    },

    /*
    * 播放火元素游戏飞行动画
    * @param startPoint 起始点坐标
    *
    * */
    playFGFireFly: function(startPoint, value) {
        if (!startPoint)
            return;

        var self = this;
        var group = this._createFlyGroup(startPoint, value);
        group.playWaitAni();
        group.setFlyNodeVisible(false);
        group.playFlyAni();

        group.runAction(this._createFlyActionList(group));

        cc.audioEngine.playEffect(res.ElementalFGFireWildCollect_mp3, false);
    },

    refreshFGRFireMul: function() {
        if (this._textFire) {
            this._textFire.setString("x" + this._iCurFireMul);
            if (this._iCurFireMul > 99) {
                this._textFire.setScale(0.45 * 0.75);
            }
            else {
                this._textFire.setScale(0.45);
            }
        }
    },

    isFlyNodesEmpty: function() {
        return this._lstFlyNodes.length === 0;
    },

    playFGWindFly: function(startPoint, value) {
        var self = this;
        var group = this._createFlyGroup(startPoint, value);
        group.playWaitAni();
        group.setFlyNodeVisible(false);
        group.playFlyAni();

        group.runAction(this._createFlyActionList(group));

        cc.audioEngine.playEffect(res.ElementalFGWindWildCollect_mp3, false);

        return 0.5 + 0.5;
    },

    playFGWindUpgradeAni: function(lvData) {
        if (lvData.display) {
            this.refreshFGWindBoard(lvData.display.lv, lvData.display.fire);
        }
        else {
            this.refreshFGWindBoard(lvData.lv, lvData.fire);
        }
    },

    setFGWindData: function(lv, fire) {
        if (lv === 3 && fire === 0) {
            fire = 4;
        }

        this._iFireLv = lv;
        this._iFireCnt = fire;
    },

    displayFGWindFire: function(lv, fireCnt) {
        this.setFGWindData(lv, fireCnt);

        var lstFire = this._lstWindFire[this._iFireLv];
        if (!lstFire)
            return;

        for (var i = 0; i < this._iFireCnt; ++i) {
            let fireNode = lstFire[i];
            if (fireNode && !fireNode.isVisible()) {
                fireNode.setVisible(true);
                fireNode.animation.play("chuxian", 0, 0);
                fireNode.animation.setMovementEventCallFunc(function(sender, type, movementID) {
                    if (type === ccs.MovementEventType.complete && movementID === "chuxian") {
                        fireNode.animation.play("xunhun", 0, 1);
                    }
                })
            }
        }
    },

    displayFGWindLvText: function() {
        var lv = this._iFireLv;

        if (this._textWind) {
            this._textWind.setString(ELEMENTAL_WIND_BOARD_LV[lv]);
        }
    },

    displayFGWinLvBoard: function() {
        var lv = this._iFireLv;

        // lv.3应该显示lv.2的面板
        if (lv > 2) {
            lv = 2;
        }

        for (var i = 0; i < this._lstWindLevel.length; ++i) {
            this._lstWindLevel[i].setVisible(i === lv);
        }
    },

    refreshFGWindBoard: function(lv, fireCnt) {
        this.setFGWindData(lv, fireCnt);

        this.displayFGWindLvText();
        this.displayFGWinLvBoard();

        lv = this._iFireLv;
        // lv.3应该显示lv.2的面板
        if (lv > 2) {
            lv = 2;
        }

        var lstFire = this._lstWindFire[lv];
        if (lstFire && this._iFireCnt <= lstFire.length) {
            for (var i = 0; i < this._iFireCnt; ++i) {
                var fire = lstFire[i];
                fire.setVisible(true);
                fire.animation.play("xunhun", 0, 1);
            }
        }
    },

    _refreshGameType: function() {
        if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_FIRE) {
            this._lstEndPosition = this._lstFirePosition;
        }
        else if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            this._lstEndPosition = this._lstWindPosition;
        }
        else {
            this._lstEndPosition = undefined;
        }
    },

    _initFlyNodePosition: function(lstWheel) {
        if (!lstWheel)
            return;

        var wheel = lstWheel[0];
        var contentSize = wheel.layWheel;
        var sbx = contentSize.width * 0.5;
        var iconSp = wheel.iconsp;
        var bi = Math.floor(wheel.lsttopnode.length * 0.5) - Math.floor(wheel.iLogicNum * 0.5);
        var sby = wheel.sby + bi * iconSp + 2 * iconSp;

        for (var i = 0; i < 5; ++i) {
            var nodeWheel = lstWheel[i].layWheel;
            var lstPosition = [];
            var point = undefined;
            for (var j = 0; j < 3; ++j) {
                point = cc.p(sbx, sby - j * iconSp);
                var lstPoint = this._canvasMgr.getPositionToParent(nodeWheel.getName(), "nodeWheel", point);
                lstPosition.push(lstPoint);
            }

            this._lstFlyPosition.push(lstPosition);
        }

        if (this._nodeFly) {
            var num = this._canvasMgr.getCanvasNums();
            for (var i = 0; i < num; ++i) {
                var nodeRoot = this._nodeFly.getNode(i);
                if (!nodeRoot)
                    continue;

                var nodeFGFirePoint = findNodeByName(nodeRoot, "nodeFGFirePoint");
                if (nodeFGFirePoint) {
                    this._lstFirePosition.push(nodeFGFirePoint.getPosition());
                }

                var nodeFGWindPoint = findNodeByName(nodeRoot, "nodeFGWindPoint");
                if (nodeFGWindPoint) {
                    this._lstWindPosition.push(nodeFGWindPoint.getPosition());
                }
            }
        }
    },

    _createFlyGroup: function(point, value) {
        var lstFlyPosition = this._lstFlyPosition[point.x][point.y];
        var node = new ElementalFlyGroup(this._iFlyNodeCount, this._nodeFly, this._canvasMgr.getCanvasNums(), this._canvasMgr.getCurCanvasIndex(), this._iGameType);
        node.setValue(value);
        node.setPosition(lstFlyPosition, this._lstEndPosition);
        node.setRotation(lstFlyPosition, this._lstEndPosition);

        this._lstFlyNodes.push(node);

        ++this._iFlyNodeCount;

        return node;
    },

    _createFlyActionList: function(node) {
        var lst = [];
        var self = this;
        for (var i = 0; i < this._lstEndPosition.length; ++i) {
            var point = this._lstEndPosition[i];
            if (point) {
                var action = cc.sequence(
                    cc.delayTime(0.417),
                    cc.show(),
                    cc.moveTo(0.5, point)
                );

                if (0 === i) {
                    action = cc.sequence(action, cc.callFunc(function() {
                        self._onFlyEndFunc(node);
                    }))
                }

                lst.push(action);
            }
            else {
                lst.push(undefined);
            }
        }

        return lst;
    },

    _onFlyEndFunc: function(node) {
        var value = node.getValue();

        for (var i = 0; i < this._lstFlyNodes.length; ++i) {
            if (node.getKey() === this._lstFlyNodes[i].getKey()) {
                this._lstFlyNodes.splice(i, 1);
                node.removeFromParent();
            }
        }

        if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_FIRE) {
            this._onFireFlyEnd(value);

            if (this._lstFlyNodes.length === 0) {
                this._effectMgr.onFGFireFlyEnd();
            }
        }
        else if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            this._onWindFlyEnd(value);
        }

        if (this._lstFlyNodes.length <= 0) {
            // end
        }
    },

    _onFireFlyEnd: function(value) {
        if (value !== undefined) {
            this._iCurFireMul += parseInt(value);

            this.refreshFGRFireMul();

            var self = this;
            this._ctrlFireAni.setVisible(true);
            this._ctrlFireAni.animation.play("wait_3", -1, 0);
            this._ctrlFireAni.animation.setMovementEventCallFunc(function(sender, type, movementID) {
                if (type === ccs.MovementEventType.complete && movementID === "wait_3") {
                    self._ctrlFireAni.setVisible(false);
                }
            });
        }
    },

    _onWindFlyEnd: function(value) {
        if (value !== undefined) {
            var self = this;
            this._ctrlWindAni.setVisible(true);
            this._ctrlWindAni.animation.play("wait_3", -1, 0);
            this._ctrlWindAni.animation.setMovementEventCallFunc(function(sender, type, movementID) {
                if (type === ccs.MovementEventType.complete && movementID === "wait_3") {
                    self._ctrlWindAni.setVisible(false);
                }
            });

            var lvData = value;
            if (lvData.upgrade) {
                lvData = lvData.upgrade;
            }

            this.displayFGWindFire(lvData.lv, lvData.fire);
        }
    }
});
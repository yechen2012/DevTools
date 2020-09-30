/*
* 飞行物组合
* 备注：
*   1.setPosition方法作用于 waitNode与 flyNode
*   2.runAction 仅作用于flyNode
*   3.playWaitAni 与 playFlyAni, 如其名，仅作用于对应节点
* */
var ElementalFlyGroup = cc.Class.extend({
    ctor: function(key, parent, numMax, mainIndex, gameType) {
        this._value = undefined; // 附带的数据
        this._key = key;
        this._iGameType = gameType;
        this._parent = parent;
        this._lstWaitNode = [];
        this._lstFlyNode = [];
        this._iMainIndex = mainIndex !== undefined ? mainIndex : 0;
        this._iNumMax = numMax;

        this._mainPoint = undefined;

        this._init();
    },

    setValue: function(value) {
        this._value = value;
    },

    getValue: function() {
        return this._value;
    },

    getKey: function() {
        return this._key;
    },

    setFlyNodeVisible: function(visible) {
        for (var i = 0; i < this._lstFlyNode.length; ++i) {
            var node = this._lstFlyNode[i];
            if (node) {
                node.setVisible(visible);
            }
        }
    },

    setPosition: function(lstPosition) {
        var point = undefined;
        if (lstPosition instanceof Array) {
            var limit = Math.min(lstPosition.length, this._lstFlyNode.length);
            for (var i = 0; i < limit; ++i) {
                point = this._lstFlyNode[i];
                if (point) {
                    point.setPosition(lstPosition[i]);
                }

                point = this._lstWaitNode[i];
                if (point) {
                    point.setPosition(lstPosition[i]);
                }
            }
        }
        else {
            for (var i = 0; i < this._lstFlyNode.length; ++i) {
                point = this._lstFlyNode[i];
                if (point) {
                    point.setPosition(lstPosition);
                }

                point = this._lstWaitNode[i];
                if (point) {
                    point.setPosition(lstPosition);
                }
            }
        }
    },

    setRotation: function(start, end) {
        if (!start || !end || start.length !== end.length)
            return;

        for (var i = 0; i < start.length; ++i) {
            var point = this._lstFlyNode[i];
            if (point) {
                var sPos = start[i];
                var ePos = end[i];

                var yy = ePos.y - sPos.y;
                var xx = ePos.x - sPos.x;

                // 计算旋转角度
                var range = Math.asin(Math.abs(yy) / Math.sqrt(Math.pow(yy, 2) + Math.pow(xx, 2))) * 180 / 3.14;
                if (yy > 0 && xx > 0) {
                    range = 90 - range;
                }
                else if (yy < 0 && xx > 0) {
                    range += 90;
                }
                else if (yy > 0 && xx < 0) {
                    range = range - 90;
                }
                else {
                    range = -(range + 90);
                }

                point.setRotation(range);
            }

        }
    },

    runAction: function(lstAction, callfunc){
        var point = undefined;
        if (lstAction instanceof Array) {
            var limit = Math.min(lstAction.length, this._lstFlyNode.length);
            for (var i = 0; i < limit; ++i) {
                point = this._lstFlyNode[i];
                if (point) {
                    point.runAction(lstAction[i]);
                }
            }
        }
        else {
            for (var i = 0; i < this._lstFlyNode.length; ++i) {
                point = this._lstFlyNode[i];
                if (point) {
                    if (i === this._iMainIndex) {
                        point.runAction(cc.sequence(lstAction, cc.callFunc(callfunc)));
                    }
                    else {
                        point.runAction(lstAction.clone());
                    }
                }
            }
        }
    },

    playWaitAni: function() {
        var node = undefined;
        for (var i = 0; i < this._lstWaitNode.length; ++i) {
            node = this._lstWaitNode[i];
            if (node) {
                node.playWaitAni();
            }
        }
    },

    playFlyAni: function() {
        var node = undefined;
        for (var i = 0; i < this._lstFlyNode.length; ++i) {
            node = this._lstFlyNode[i];
            if (node) {
                node.playFlyAni();
            }
        }
    },

    removeFromParent: function() {
        var point = undefined;
        for (var i = 0; i < this._lstFlyNode.length; ++i) {
            point = this._lstFlyNode[i];
            if (point) {
                point.removeFromParent();
            }
        }
    },

    _init: function() {
        if (!this._parent)
            return;

        var node = undefined;
        for (var i = 0; i < this._iNumMax; ++i) {
            node = this._parent.getNode(i);
            if (node) {
                var waitPoint = new ElementalFlyNode(this._iGameType, 1);
                node.addChild(waitPoint);
                this._lstWaitNode.push(waitPoint);

                var flyPoint = new ElementalFlyNode(this._iGameType, 2);
                node.addChild(flyPoint);
                this._lstFlyNode.push(flyPoint);
            }
            else {
                this._lstFlyNode.push(undefined);
                this._lstWaitNode.push(undefined);
            }
        }

        this._mainPoint = this._lstFlyNode[this._iMainIndex];
        if (!this._mainPoint) {
            this._mainPoint = this._lstFlyNode[0];
        }
    },
});

/*
* 飞行物
* */
var ElementalFlyNode = cc.Node.extend({
    ctor: function(gameType, type) {
        this._super();

        this._iGameType = gameType;
        this._iType = type !== undefined ? type : 1; // 1.wait 2.fly

        this._nodeAct = undefined; // 动画节点

        this._init();
    },

    playWaitAni: function() {
        this._nodeAct.setVisible(true);
        this._nodeAct.animation.play("wait_1", -1, 0);
        var self = this;
        this._nodeAct.animation.setMovementEventCallFunc(function(sender, type, movementID) {
            if (type === ccs.MovementEventType.complete && movementID === "wait_1") {
                self._nodeAct.setVisible(false);
                self.removeFromParent();
            }
        })
    },

    playFlyAni: function() {
        this._nodeAct.setVisible(true);
        this._nodeAct.animation.play("wait_2", -1, 1);
    },

    _init: function() {
        if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_FIRE) {
            ccs.armatureDataManager.addArmatureFileInfo(res.ElementalFlyPointFGFire_exjson);
            this._nodeAct = new ccs.Armature("elemental_hsj_1");
            // 火元素收集，调整方向为 x轴反方向
            if (this._iType !== 1) {
                this._nodeAct.setRotation(180);
                this._nodeAct.setPositionY(-120);
                this._nodeAct.setScale(0.5);
            }
            this.addChild(this._nodeAct);
        }
        else if (this._iGameType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            ccs.armatureDataManager.addArmatureFileInfo(res.ElementalFlyPointFGWind_exjson);
            this._nodeAct = new ccs.Armature("elemental_fsj_2");

            this.addChild(this._nodeAct);
        }

        if (this._nodeAct)
            this._nodeAct.setVisible(false);
    },
});
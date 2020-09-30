var ITEM_MAX = 12; // 节点个数
var ACTION_MIN = 8; // 选择动画最小的旋转节点数
var ACTION_SLOW_CNT = 16; // 减速位移挪动节点数
var MOVE_BASE_COUNT = 3; // 相邻的两个节点的基础位移次数，理论上越多越平滑

var ElementalFreeSelectLayer = cc.Layer.extend({
    ctor: function(effectMgr) {
        this._super();

        this._iGameType = -1;
        this._effectMgr = effectMgr;
        this._bOver = true;

        this._btnOK = undefined;

        this._lstRootNodes = [];
        this._lstDateNode = [];
        this._lstChar = [];
        this._lstDisplayArm = new Array(7);
        this._lstRootParam = []; // 下一个rootNode相对于本身rootNode的动画参数[位置， 缩放值，透明度]

        this._iArmAniTime = 0;
        this._iIndex = -1; // 当前处于中间位置的index
        this._iCurCount = 0;
        this._iMaxCount = 0;

        this._iMoveCnt = 0; // 每波位移动画经过多少次位移
        this._lstMoveParam = []; // 每个位置的char每次的位移量

        this._init();
    },

    isOver: function() {
        return this._bOver;
    },

    reset: function() {
        this._bOver = true;
        this._iMoveCnt = 0;
        this._iIndex = 0;
        this._setCenterIndex(this._iIndex, false);

        this._btnOK.setVisible(false);

        for (var i = 0; i < this._lstChar.length; ++i) {
            this._lstChar[i].setOpacity(0);
            this._lstChar[i].setVisible(false);
        }

        for (var i = 0; i < this._lstDisplayArm.length; ++i) {
            this._lstDisplayArm[i].setVisible(false);
        }
    },

    playDisplayAni: function(type) {
        this._bOver = false;
        this._iGameType = type;

        var self = this;
        var delayTime = 1 / 24;
        var fadeDelay = 3 / 24;
        var aniArm3 = this._lstDisplayArm[3];
        aniArm3.runAction(cc.sequence(
            cc.delayTime(delayTime),
            cc.show(),
            cc.callFunc(function() {
                aniArm3.animation.play("zhuan_mianfeixuanze", 0, 0);
            }),
            cc.delayTime(fadeDelay),
            cc.callFunc(function() {
                var char = self._lstChar[self._iIndex];
                char.setVisible(true);
                char.playAppearAni();
            })
        ));

        delayTime += 3 / 24;
        var aniArm2 = this._lstDisplayArm[2];
        aniArm2.runAction(cc.sequence(
            cc.delayTime(delayTime),
            cc.show(),
            cc.callFunc(function() {
                aniArm2.animation.play("zhuan_mianfeixuanze", 0, 0);
            }),
            cc.delayTime(fadeDelay),
            cc.callFunc(function() {
                var char = self._lstChar[self._chgIndex(self._iIndex, -1)];
                char.setVisible(true);
                char.playAppearAni();
            })
        ));

        var aniArm4 = this._lstDisplayArm[4];
        aniArm4.runAction(cc.sequence(
            cc.delayTime(delayTime),
            cc.show(),
            cc.callFunc(function() {
                aniArm4.animation.play("zhuan_mianfeixuanze", 0, 0);
            }),
            cc.delayTime(fadeDelay),
            cc.callFunc(function() {
                var char = self._lstChar[self._chgIndex(self._iIndex, 1)];
                char.setVisible(true);
                char.playAppearAni();
            })
        ));

        delayTime += 3 / 24;
        var aniArm1 = this._lstDisplayArm[1];
        aniArm1.runAction(cc.sequence(
            cc.delayTime(delayTime),
            cc.show(),
            cc.callFunc(function() {
                aniArm1.animation.play("zhuan_mianfeixuanze", 0, 0);
            }),
            cc.delayTime(fadeDelay),
            cc.callFunc(function() {
                var char = self._lstChar[self._chgIndex(self._iIndex, -2)];
                char.setVisible(true);
                char.playAppearAni();
            })
        ));

        var aniArm5 = this._lstDisplayArm[5];
        aniArm5.runAction(cc.sequence(
            cc.delayTime(delayTime),
            cc.show(),
            cc.callFunc(function() {
                aniArm5.animation.play("zhuan_mianfeixuanze", 0, 0);
            }),
            cc.delayTime(fadeDelay),
            cc.callFunc(function() {
                var char = self._lstChar[self._chgIndex(self._iIndex, 2)];
                char.setVisible(true);
                char.playAppearAni();
            })
        ));

        delayTime += 3 / 24;
        var aniArm0 = this._lstDisplayArm[0];
        aniArm0.runAction(cc.sequence(
            cc.delayTime(delayTime),
            cc.show(),
            cc.callFunc(function() {
                aniArm0.animation.play("zhuan_mianfeixuanze", 0, 0);
            }),
            cc.delayTime(fadeDelay),
            cc.callFunc(function() {
                var char = self._lstChar[self._chgIndex(self._iIndex, -3)];
                char.setVisible(true);
                char.playAppearAni();
            })
        ));

        var aniArm6 = this._lstDisplayArm[6];
        aniArm6.runAction(cc.sequence(
            cc.delayTime(delayTime),
            cc.show(),
            cc.callFunc(function() {
                aniArm6.animation.play("zhuan_mianfeixuanze", 0, 0);
            }),
            cc.delayTime(fadeDelay),
            cc.callFunc(function() {
                var char = self._lstChar[self._chgIndex(self._iIndex, 3)];
                char.setVisible(true);
                char.playAppearAni();
            })
        ));

        this._iArmAniTime = delayTime + 27 / 24;
    },

    playExitAni: function(callfunc) {
        this._bOver = false;
        var delayTime = 1 / 24;

        this._btnOK.setVisible(false);

        var char = this._lstChar[this._chgIndex(this._iIndex, 3)];
        char.runAction(cc.sequence(cc.delayTime(delayTime), cc.hide()));

        delayTime += 1 / 24;
        char = this._lstChar[this._chgIndex(this._iIndex, 2)];
        char.runAction(cc.sequence(cc.delayTime(delayTime), cc.hide()));

        delayTime += 1 / 24;
        char = this._lstChar[this._chgIndex(this._iIndex, 1)];
        char.runAction(cc.sequence(cc.delayTime(delayTime), cc.hide()));

        delayTime += 1 / 24;
        char = this._lstChar[this._chgIndex(this._iIndex, 0)];
        char.runAction(cc.sequence(cc.delayTime(delayTime), cc.hide()));

        delayTime += 2 / 24;
        char = this._lstChar[this._chgIndex(this._iIndex, -1)];
        char.runAction(cc.sequence(cc.delayTime(delayTime), cc.hide(), cc.callFunc(function() {
            if (callfunc) {
                callfunc();
            }
        })));

        delayTime += 1 / 24;
        char = this._lstChar[this._chgIndex(this._iIndex, -2)];
        char.runAction(cc.sequence(cc.delayTime(delayTime), cc.hide()));

        delayTime += 1 / 24;
        char = this._lstChar[this._chgIndex(this._iIndex, -3)];
        var self = this;
        char.runAction(cc.sequence(cc.delayTime(delayTime), cc.hide(), cc.callFunc(function(){
            for (var i = 0; i < self._lstChar.length; ++i) {
                self._lstChar[i].setVisible(false);
            }
        })));

        this._iExitAniTime = delayTime + 2 / 24;
    },

    playSelectAni: function(type) {
        this._bOver = false;
        this._iCurCount = 0;

        // 查找目标index
        var cnt = 0;
        for(var i = ITEM_MAX - 1 - Math.floor(ACTION_SLOW_CNT % 4); i >= 0; --i) {
            cnt++;
            var charNode = this._lstChar[i];
            if (charNode.getType() === type) {
                break;
            }
        }

        this._iMaxCount = ACTION_MIN + ACTION_SLOW_CNT + cnt;

        var self = this;
        this.runAction(cc.sequence(
            cc.delayTime(0.3),
            cc.callFunc(function(){
                self._startAction();
            })
        ));

        cc.audioEngine.playEffect(res.ElementalFGSelectRun_mp3, false);
    },

    update: function(dt) {
        if (this._bOver)
            return;

        if (this._iExitAniTime > 0) {
            this._iExitAniTime -= dt;

            if (this._iExitAniTime <= 0) {
                this._iExitAniTime = 0;

                this._bOver = true;
                this._effectMgr.hideFGSelectLayer();
            }
        }

        if (this._iArmAniTime > 0) {
            this._iArmAniTime -= dt;

            if (this._iArmAniTime <= 0) {
                this._iArmAniTime = 0;

                for (var i = 0; i < this._lstChar.length; ++i) {
                    this._lstChar[i].setOpacity(255);
                    this._lstChar[i].setVisible(true);
                }

                for (var i = 0; i < this._lstDisplayArm.length; ++i) {
                    this._lstDisplayArm[i].setVisible(false);
                }

                this.playSelectAni(this._iGameType);
            }
        }

        if (this._iMoveCnt > 0) {
            --this._iMoveCnt;

            this._updateCharMove();

            if (this._iMoveCnt <= 0) {
                this._chgParent();
                this._startAction();
            }
        }
    },

    _init: function() {
        var layer = ccs.load(res.ElementalGameNode_FreeSelect_json);
        layer.node.runAction(layer.action);
        this.addChild(layer.node);

        this._iIndex = 7;

        var name = "";
        var rootNode = undefined;
        var charNode = undefined;

        ccs.armatureDataManager.addArmatureFileInfo(res.ElementalFGSelect_exjson);
        for (var i = 0; i < ITEM_MAX; ++i) {
            name = "nodeChar" + i;
            rootNode = findNodeByName(layer.node, name);
            if (rootNode) {
                this._lstRootNodes.push(rootNode);

                var type = i % 4 + 1;
                charNode = new ElementalFreeSelectElement(type);
                rootNode.addChild(charNode);
                this._lstChar.push(charNode);

                var dateNode = findNodeByName(rootNode, name + "_0");
                this._lstDateNode.push(dateNode);

                if (i < 7) {
                    var aniArm = new ccs.Armature("elemental_mianfeixuanze");
                    aniArm.setVisible(false);
                    aniArm.setScale(dateNode.getScale());
                    rootNode.addChild(aniArm, 1);
                    this._lstDisplayArm[i] = aniArm;
                }
            }
        }

        var btnOK = findNodeByName(layer.node, "btnOk");
        if (btnOK) {
            this._btnOK = btnOK;
            btnOK.addTouchEventListener(this._onTouchOK, this);

            var strOK = LanguageData.instance.getTextStr("common_popup_button_ok");
            btnOK.setTitleText(strOK);
        }

        var parent = findNodeByName(layer.node, "nodeFreeSelect");
        var nextNode = undefined;
        var nextDateNode = undefined;
        for (var i = 0; i < ITEM_MAX; ++i) {
            var date = [];
            rootNode = this._lstRootNodes[i];
            nextNode = this._lstRootNodes[this._nextIndex(i)];
            nextDateNode = this._lstDateNode[this._nextIndex(i)];

            var world = parent.convertToWorldSpace(nextNode.getPosition());
            var nodePoint = rootNode.convertToNodeSpace(world);

            date.push(nodePoint);
            date.push(nextDateNode.getScale());
            date.push(nextDateNode.getOpacity());
            date.push(nextNode);

            this._lstRootParam.push(date);
            this._lstMoveParam.push([0, 0, 0]);
        }

        this.reset();
    },

    _startAction: function() {
        if (this._bOver)
            return;

        var count = this._iMaxCount - this._iCurCount;

        var baseCount = MOVE_BASE_COUNT;

        if (count <= 0) {
            this._btnOK.setVisible(true);
            this._bOver = true;
        }
        else {
            if (count < ACTION_SLOW_CNT) {
                this._iMoveCnt = baseCount + this._easeInOutQuint((ACTION_SLOW_CNT - count) / ACTION_SLOW_CNT) * baseCount;
            }
            else {
                this._iMoveCnt = baseCount;
            }

            ++this._iCurCount;
            this._setCenterIndex(this._lastIndex(this._iIndex));
        }
    },

    _setCenterIndex: function(index, bAction) {
        bAction = bAction !== undefined ? bAction : true;

        this._iIndex = index;
        index = this._chgIndex(index, -3);

        var rootNode = undefined;
        var charNode = undefined;
        for (var i = 0; i < ITEM_MAX; ++i) {
            charNode = this._lstChar[index];
            rootNode = this._lstRootNodes[i];

            charNode.setRootIndex(i);

            var scale = charNode.getScale();
            var opacity = charNode.getOpacity();

            if (bAction) {
                // 计算一下每次移动的位移量
                // 需要取存储器中上一个对应index的param，才是本RootNode的数据
                var param = this._lstRootParam[this._lastIndex(i)];
                var moveParam = this._lstMoveParam[index];

                moveParam[0] = (param[0].x - 0) / this._iMoveCnt;
                moveParam[1] = (param[1] - scale) / this._iMoveCnt;
                moveParam[2] = (param[2] - opacity) / this._iMoveCnt;
                moveParam[3] = param[3];
            }
            else {
                charNode.retain();
                charNode.removeFromParent(false);
                rootNode.addChild(charNode);
                charNode.release();
                this._resetCharNode(charNode);
            }

            index = this._nextIndex(index);
        }
    },

    _getStartIndex: function() {
        return this._chgIndex(this._iIndex, -3);
    },

    _updateCharMove: function() {
        for (var i = 0; i < ITEM_MAX; ++i) {
            var charNode = this._lstChar[i];
            var param = this._lstMoveParam[i];
            charNode.setPositionX(charNode.getPositionX() + param[0]);
            charNode.setScale(charNode.getScale() + param[1]);
            charNode.setOpacity(charNode.getOpacity() + param[2]);
        }
    },

    _chgParent: function() {
        for (var i = 0; i < ITEM_MAX; ++i) {
            var charNode = this._lstChar[i];
            var param = this._lstMoveParam[i];

            this._resetCharNode(charNode);
            charNode.retain();
            charNode.removeFromParent(false);
            param[3].addChild(charNode);
            charNode.release();
        }
    },

    _resetCharNode: function(charNode) {
        charNode.setPosition(cc.p(0, 0));

        var rootIndex = charNode.getRootIndex();

        // 因lstRootParam存储的是下一个RooNode的参数，因此此处需要取上一个param；
        var rootParam = this._lstRootParam[this._lastIndex(rootIndex)];
        if (rootParam) {
            charNode.setScale(rootParam[1]);
            charNode.setOpacity(rootParam[2]);
        }
    },

    _chgIndex: function(index, val) {
        index = index + val;
        if (index < 0) {
            index += ITEM_MAX;
        }

        if (index > ITEM_MAX - 1) {
            index = Math.abs(ITEM_MAX - index);
        }

        return index;
    },

    _nextIndex: function(index) {
        ++index;
        if (index > ITEM_MAX - 1) {
            index = 0;
        }

        return index;
    },

    _lastIndex: function(index) {
        --index;
        if (index < 0)
            index = ITEM_MAX - 1;

        return index;
    },

    _easeInOut: function(time, rate) {
        time *= 2;
        if (time < 1)
        {
            return 0.5 * Math.pow(time, rate);
        }
        else
        {
            return (1.0 - 0.5 * Math.pow(2 - time, rate));
        }
    },

    _easeInOutQuint: function(time) {
        time = time*2;
        var val = 0.5 * time * time * time * time * time;


        return val;
    },

    _onTouchOK: function(sender, type) {
        if (type !== ccui.Widget.TOUCH_ENDED)
            return;

        cc.audioEngine.playEffect(res.ElementalFGSelectOK_mp3, false);

        if (!this._bOver)
            return;

        this._effectMgr._onFGSelectAniEnd();
    }
});
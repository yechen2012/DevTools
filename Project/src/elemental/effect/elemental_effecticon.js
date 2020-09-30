var ELEMENTAL_ICON_DIR = {
    DIR_ORIGIN : 0,
    DIR_UP : 1,
    DIR_RIGHT: 2,
    DIR_DOWN: 3,
    DIR_LEFT: 34
};

var ELEMENTAL_ICON_STATE = {
    STATE_NONE : 0,
    STATE_FG_SOIL_ANI : 1,
    STATE_FG_WATER_ICE : 3,
    STATE_FG_WATER_WATER : 4,
    STATE_FG_WIND_ANI : 6
};

var ElementalEffectIcon = cc.Class.extend({
    ctor: function(index, point) {

        this._iType = 0;
        this._iIndex = index;
        this._iLv = 0;
        this._point = point;

        this._bActive = false;

        this._iAniTime = 0;
        this._lstElement = []; // 组件,被遮盖的icon
        this._rootElement = undefined; // 自身为组件时，依赖的根节点
        this._bElement = false;
        this._iDirection = ELEMENTAL_ICON_DIR.DIR_ORIGIN;

        this._rootNode = undefined;
        this._rootTopNode = undefined;
        this._topParent = undefined;

        this._iconImg = undefined;
        this._iconAni = undefined;

        this._lstModule = [];
        this._lstCurNodes = [];

        this._iState = ELEMENTAL_ICON_STATE.STATE_NONE;
        this._bResetState = false;

        // 土
        this._iconAniSoil01 = undefined;
        this._iconAniSoil02 = undefined;
        this._iconAniSoil03 = undefined;

        // 风
        this._nodeWindClip = undefined;
        this._lstArmature = undefined;
        this._lstClipData = undefined;
        this._iClipTime = 0;
        this._iCurClipIndex = 0;
        this._armatureWorldPoint = undefined;

        this._init();
    },

    setTopNode: function(node) {
        this._topParent = node;
    },

    getNode: function() {
        return this._rootNode;
    },

    getTopNode: function() {
        return this._rootTopNode;
    },

    isActive: function() {
        return this._bActive;
    },

    setIsActive: function(active) {
        this._bActive = active;
    },

    reset: function() {
        this._iState = ELEMENTAL_ICON_STATE.STATE_NONE;
        this._lstElement = [];
        this._rootElement = undefined;
        this._bElement = false;
        this._iDirection = ELEMENTAL_ICON_DIR.DIR_ORIGIN;
        this._iAniTime = 0;
        this._iLv = 0;
        this._bActive = false;

        if (this._armatureExtend) {
            this._armatureExtend.node.removeFromParent();
            this._armatureExtend = undefined;
        }

        for (var i = 0; i < 5; ++i) {
            this._refreshVisible(i, false);
        }
    },

    setPosition: function(position) {
        this._rootNode.setPosition(position);
        this._rootTopNode.setPosition(position);
    },

    runAction: function(action) {
        this._rootNode.runAction(action);
    },

    setVisible: function(visible) {
        this._rootNode.setVisible(visible);
        for(var i = 0; i < this._lstElement.length; ++i) {
            var icon = this._lstElement[i];
            icon.setVisible(visible);
        }
    },

    /*
    * 设置IconType，等同于FreeType
    * */
    setGameType: function(type) {
        this._iType = type;

        this._lstCurNodes = this._lstModule[this._iType];
    },

    addElement: function(icon) {
        var bHas = false;
        for (var i = 0; i < this._lstElement.length; ++i) {
            if (icon === this._lstElement[i]) {
                bHas = true;
                break;
            }
        }

        if (!bHas)
            this._lstElement.push(icon);
    },

    removeElement: function(icon) {
        for (var i = 0; i < this._lstElement.length; ++i) {
            if (this._lstElement[i] === icon) {
                this._lstElement.splice(i, 1);
                break;
            }
        }
    },

    clearElement: function() {
        this._lstElement = [];
    },

    setRootElement: function(element) {
        this._rootElement = element;

        //设置根节点说明自身作为组件存在
        this._bElement = true;
    },

    isElement:function() {
        return this._bElement;
    },

    getDirection: function() {
        return this._iDirection;
    },

    getAniTime: function() {
        return this._iAniTime;
    },

    playIconBetaDisplayAni: function() {
        if (this._iType === ELEMENTAL_GAME_TYPE.GAME_FG_WATER || this._iType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            ccs.armatureDataManager.addArmatureFileInfo(res.ElementalGongzhuZhuan_exjson);
            var displayAni = new ccs.Armature("elemental_gongzhuzhuan");
            this._rootNode.addChild(displayAni);
            if (this._iType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND)
                displayAni.setPosition(102, 0);

            var rotation = Math.floor(Math.random() * 360);
            displayAni.setRotation(rotation);

            displayAni.animation.play("gongzhuzhuan1", -1, false);
            displayAni.animation.setMovementEventCallFunc(function(sender, type, movementID) {
                if (type === ccs.MovementEventType.complete && movementID === "gongzhuzhuan1") {
                    displayAni.removeFromParent();
                }
            })
        }
    },

    playSoilReadyAni: function() {
        if (this._iType === ELEMENTAL_GAME_TYPE.GAME_FG_SOIL && this._iState === ELEMENTAL_ICON_STATE.STATE_NONE) {
            this._iAniTime = 35 / 24;
            this._setState(ELEMENTAL_ICON_STATE.STATE_FG_SOIL_ANI);

            var node = this._lstCurNodes[0];
            node.setVisible(true);
            node.animation.play("wild01", 0, 0);
        }
    },

    playSoilWaitAni: function() {
        if (this._iType === ELEMENTAL_GAME_TYPE.GAME_FG_SOIL) {
            var node = this._lstCurNodes[1];
            node.setVisible(true);
            node.animation.play("xuanzhong", 0, 1);

            node.runAction(cc.sequence(
                cc.delayTime(27 / 24),
                cc.hide()
            ))
        }
    },

    playSoilTransformAni: function() {
        if (this._iType === ELEMENTAL_GAME_TYPE.GAME_FG_SOIL && this._iAniTime <= 0) {
            this._iAniTime = 55 / 24;

            var node01 = this._lstCurNodes[2];
            node01.setVisible(true);
            node01.animation.play("tu_fuzhi", 0, 0);

            var node02 = this._lstCurNodes[3];
            node02.setVisible(true);
            node02.animation.play("wild02_1", 0, 0);
        }
    },

    displayWaterIceWild: function() {
        if (this._iType === ELEMENTAL_GAME_TYPE.GAME_FG_WATER) {
            var displayAni = this._lstCurNodes[2];
            if (displayAni && displayAni.isVisible())
                displayAni.setVisible(false);

            var img = this._lstCurNodes[3];
            if (img) {
                img.setVisible(true);
            }

            var iceNode = this._lstCurNodes[0];
            if (iceNode && iceNode.node) {
                iceNode.node.setVisible(true);
                this._setState(ELEMENTAL_ICON_STATE.STATE_FG_WATER_ICE);
            }
        }
    },

    playWaterBetaDisplayAni: function() {
        if (this._iType === ELEMENTAL_GAME_TYPE.GAME_FG_WATER) {
            var displayAni = this._lstCurNodes[2];
            if (displayAni) {
                displayAni.setVisible(true);
                displayAni.animation.play("gongzhuzhuan3", -1, false);

                this._iAniTime = 34 / 24;
            }
        }
    },

    playWaterChgWaterAni: function(delayTime) {
        if (this._iType === ELEMENTAL_GAME_TYPE.GAME_FG_WATER && this._iState === ELEMENTAL_ICON_STATE.STATE_FG_WATER_ICE) {
            var iceNode = this._lstCurNodes[0];
            // 只有冰块正在展示时，才需要融化
            if (iceNode.node.isVisible()) {

                this._setState(ELEMENTAL_ICON_STATE.STATE_FG_WATER_WATER);
                iceNode.node.setVisible(false);

                var img = this._lstCurNodes[3];
                if (img && img.isVisible()) {
                    img.setVisible(false);
                }

                var waterNode = this._lstCurNodes[1];
                waterNode.node.setVisible(true);
                var ctrlAni = findNodeByName(waterNode.node, "ctrlAni");
                if (ctrlAni) {
                    ctrlAni.animation.play("shui_huabing", 0, 0);
                }

                var duration = waterNode.action.getDuration();

                this._iAniTime = duration / 24 + delayTime;
                // this._bResetState = true;

                var self = this;
                waterNode.node.runAction(cc.sequence(
                    cc.delayTime(this._iAniTime),
                    cc.hide()
                    // cc.callFunc(function() {
                    //     self._setState(ELEMENTAL_ICON_STATE.STATE_NONE);
                    // })
                ))
            }
            else {
                this._iAniTime = 0;
            }
        }
    },

    playWaterChgIceAni: function() {
        if (this._iType === ELEMENTAL_GAME_TYPE.GAME_FG_WATER && (this._iState === ELEMENTAL_ICON_STATE.STATE_NONE || this._iState === ELEMENTAL_ICON_STATE.STATE_FG_WATER_WATER)) {
            var iceNode = this._lstCurNodes[0];
            if (!iceNode.node.isVisible()) {

                var waterNode = this._lstCurNodes[1];
                waterNode.node.setVisible(false);

                var img = this._lstCurNodes[3];
                if (img && img.isVisible()) {
                    img.setVisible(true);
                }

                this._setState(ELEMENTAL_ICON_STATE.STATE_FG_WATER_ICE);
                iceNode.node.setVisible(true);
                var ctrlAni = findNodeByName(iceNode.node, "ctrlAni");
                if (ctrlAni) {
                    ctrlAni.animation.play("shui_jiebing", 0, 0);
                }

                this._iAniTime = iceNode.action.getDuration() / 24;
            }
            else {
                this._iAniTime = 0;
            }
        }
    },

    isFGWindMegaWild: function() {
        var ret = false;

        if (this._bElement && this._rootElement) {
            ret = this._rootElement.isFGWindMegaWild();
        }
        else {
            if(this._iType == ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
                var spr = this._lstCurNodes[0];
                ret = spr && spr.isVisible();
            }
        }

        return ret;
    },

    displayWindMegaWild : function(lv) {
        if (this._iType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND && ELEMENTAL_WIND_ICON_IMG[lv]) {
            if (this._armatureExtend) {
                this._armatureExtend.node.removeFromParent();
                this._armatureExtend = undefined;
            }

            // 自身是节点则不需要展示；
            if (this._bElement &&  this._rootElement) {
                return;
            }

            this._iLv = lv;

            var displayAni = this._lstCurNodes[6];
            if (displayAni && displayAni.isVisible())
                displayAni.setVisible(false);

            var spr = this._lstCurNodes[0];
            spr.setVisible(true);

            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(ELEMENTAL_WIND_ICON_IMG[lv]);
            spr.setSpriteFrame(spriteFrame);

            var contentSize = spr.getContentSize();
            var size = ELEMENTAL_WIND_ICON_SIZE[lv];
            var anchor = cc.p(size[0] / contentSize.width, size[1] / contentSize.height);
            spr.setAnchorPoint(anchor);

            if (this._lstCurNodes[7] && this._lstCurNodes[8]) {
                var position = cc.p(contentSize.width * 0.5 - size[0], contentSize.height * 0.5 - size[1]);
                this._lstCurNodes[7].setPosition(position);
                this._lstCurNodes[8].setPosition(position);
            }
        }
    },

    playWindMoveEndAni: function() {
        if (this._rootElement && this._bElement)
            return;

        if (this._iType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND && ELEMENTAL_WIN_MOVE_END_ANI[this._iLv]) {
            var spr = this._lstCurNodes[0];
            if (!spr.isVisible())
                return;

            var armDown = this._lstCurNodes[7];
            var armUp = this._lstCurNodes[8];
            var lstAni = ELEMENTAL_WIN_MOVE_END_ANI[this._iLv];

            armDown.setVisible(true);
            armDown.animation.play(lstAni[0], -1, 0);
            armDown.animation.setMovementEventCallFunc(function(sender, type, movementID) {
                if (type === ccs.MovementEventType.complete && movementID === lstAni[0]) {
                    armDown.setVisible(false);
                }
            });

            armUp.setVisible(true);
            armUp.animation.play(lstAni[1], -1, 0);
            armUp.animation.setMovementEventCallFunc(function(sender, type, movementID) {
                if (type === ccs.MovementEventType.complete && movementID === lstAni[1]) {
                    armUp.setVisible(false);
                }
            })
        }
    },

    playWindBetaDisplayAni: function() {
        if (this._iType == ELEMENTAL_GAME_TYPE.GAME_FG_WIND) {
            var aniCtrl = this._lstCurNodes[6];
            if (aniCtrl) {
                aniCtrl.setVisible(true);
                aniCtrl.animation.play("gongzhuzhuan2", -1, false);

                this._iAniTime = 34 / 24;
            }
        }
    },

    playWindExtendAni: function(ani, rect) {
        if (!ani)
            return;

        if (this._iType === ELEMENTAL_GAME_TYPE.GAME_FG_WIND && this._iState === ELEMENTAL_ICON_STATE.STATE_NONE) {
            var img = this._lstCurNodes[0];
            if (img.isVisible()) {
                img.setVisible(false);

                if (this._armatureExtend) {
                    this._armatureExtend.node.removeFromParent();
                    this._armatureExtend = undefined;
                }

                var aniObj = CcsResCache.singleton.load(ani);
                aniObj.node.runAction(aniObj.action);
                this._rootNode.addChild(aniObj.node);

                aniObj.action.gotoFrameAndPlay(0, aniObj.action.getDuration(), 0, false);

                this._iAniTime = aniObj.action.getDuration() / 24;

                this._armatureExtend = aniObj;

                // var self = this;
                // aniObj.node.runAction(cc.sequence(
                //     cc.delayTime(this._iAniTime),
                //     cc.callFunc(function() {
                //         aniObj.node.removeFromParent();
                //         self._armatureExtend = undefined;
                //     }))
                // )
            }
        }
    },

    playWindRunAni: function() {
        if (!this._bActive)
            return false;

        if (this._iType !== ELEMENTAL_GAME_TYPE.GAME_FG_WIND)
            return false;

        if (this._bElement && this._rootElement) {
            this._rootElement.playWindRunAni();
            return true;
        }

        if (!this._bElement) {
            var lv = this._iLv + 2;
            if (!this._lstCurNodes[lv])
                return false;

            var ani = this._lstCurNodes[lv][0];
            var aniSpine = this._lstCurNodes[lv][1];

            if (ani) {
                var lstAniName = ELEMENTAL_WIN_ICON_ANI_NAME[this._iLv];
                ani.node.setVisible(true);

                var aniCtrl = findNodeByName(ani.node, "aniCtrl");
                if (aniCtrl) {
                    aniCtrl.animation.play(lstAniName[1], 0, 1);
                }

                aniCtrl = findNodeByName(ani.node, "aniCtrl1");
                if (aniCtrl) {
                    aniCtrl.animation.play(lstAniName[2], 0, 1);
                }

                if (aniSpine) {
                    aniSpine.setAnimation(0, lstAniName[0], true);
                }

                this._iAniTime = ani.action.getDuration() / 24;
            }
        }

        return true;
    },

    clearWindRunAni: function() {
        if (!this._bActive)
            return;

        if (this._iType !== ELEMENTAL_GAME_TYPE.GAME_FG_WIND)
            return;

        if (this._bElement && this._rootElement) {
            this._rootElement.clearWindRunAni();
            return;
        }

        if (!this._bElement) {
            var ani = this._lstCurNodes[this._iLv + 2][0];

            if (ani) {
                ani.node.setVisible(false);
            }
        }
    },

    update: function(dt) {
        if (this._iAniTime > 0) {
            this._iAniTime -= dt;

            if (this._iAniTime <= 0) {
                this._iAniTime = 0;

                if (this._bResetState) {
                    this._setState(ELEMENTAL_ICON_STATE.STATE_NONE);
                }
            }
        }
    },

    _init: function() {
        this._rootNode = new cc.Node();
        this._rootNode.setCascadeOpacityEnabled(true);
        this._rootNode.setAnchorPoint(cc.p(0, 0));

        this._rootTopNode = new cc.Node();
        this._rootTopNode.setCascadeOpacityEnabled(true);
        this._rootTopNode.setAnchorPoint(cc.p(0, 0));

        for (var i = 0; i < 5; ++i) {
            this._lstModule.push([]);
        }

        this._initSoilModule();
        this._initWaterModule();
        this._initWindModule();

        this.reset();
    },

    _initSoilModule: function() {
        ccs.armatureDataManager.addArmatureFileInfo(res.ElementalWildSoil_exjson);
        ccs.armatureDataManager.addArmatureFileInfo(res.ElementalWildMianfei_exjson);

        this._iconAniSoil01 = new ccs.Armature("elemental_wild_tu");
        this._iconAniSoil02 = new ccs.Armature("elemental_wild_tu");
        this._iconAniSoil03 = new ccs.Armature("elemental_wild_mianfei");
        this._iconAniSoil04 = new ccs.Armature("elemental_wild_tu");

        this._rootNode.addChild(this._iconAniSoil01);
        this._rootNode.addChild(this._iconAniSoil02);
        this._rootNode.addChild(this._iconAniSoil03);
        this._rootNode.addChild(this._iconAniSoil04);

        var lst = this._lstModule[ELEMENTAL_GAME_TYPE.GAME_FG_SOIL];
        lst.push(this._iconAniSoil01);
        lst.push(this._iconAniSoil02);
        lst.push(this._iconAniSoil03);
        lst.push(this._iconAniSoil04);
    },

    _initWaterModule: function() {
        var lst = this._lstModule[ELEMENTAL_GAME_TYPE.GAME_FG_WATER];

        var ice = CcsResCache.singleton.load(res.ElementalIconRunAniIce_json);
        ice.node.runAction(ice.action);
        this._rootNode.addChild(ice.node);
        lst.push(ice); // 0

        var water = CcsResCache.singleton.load(res.ElementalIconRunAniWater_json);
        water.node.runAction(water.action);
        this._rootNode.addChild(water.node);
        lst.push(water); // 1

        // 试玩版公主转wild出现动画
        ccs.armatureDataManager.addArmatureFileInfo(res.ElementalGongzhuZhuan_exjson);
        var iconAni = new ccs.Armature("elemental_gongzhuzhuan");
        this._rootNode.addChild(iconAni);
        lst.push(iconAni); // 2

        // 公主转结冰图片
        var iconImg = new cc.Sprite();
        iconImg.setSpriteFrame("elemental_icon20.png");
        this._rootNode.addChild(iconImg);
        lst.push(iconImg); // 3
    },

    _initWindModule: function() {
        var lst = this._lstModule[ELEMENTAL_GAME_TYPE.GAME_FG_WIND];

        var iconImg = new cc.Sprite();
        this._rootNode.addChild(iconImg, 1);
        lst.push(iconImg); // 0

        var topIcon = new cc.Sprite();
        this._rootTopNode.addChild(topIcon, 1);
        lst.push(topIcon); // 1

        // 因Spine动画第一帧会闪烁，因此将FGWind RunAni的Spine动画设置为常量，不再每次创建销毁
        for (var i = 0; i < 4; ++i) {
            var temp = [];

            var ani = ccs.load(ELEMENTAL_WIND_ICON_ANI_RUN[i]);
            ani.node.runAction(ani.action);
            ani.node.setVisible(false);
            this._rootTopNode.addChild(ani.node, 1);

            temp.push(ani);

            var lstAniName = ELEMENTAL_WIN_ICON_ANI_NAME[i];
            var nodeSpine = findNodeByName(ani.node, "nodeSpine");
            var aniSpine = sp.SkeletonAnimation.createWithJsonFile(res.ElementalIconWindWild_json, res.ElementalIconWindWild_atlas, 1);
            aniSpine.setAnimation(0, lstAniName[0], true);
            nodeSpine.addChild(aniSpine, 1);

            temp.push(aniSpine);

            lst.push(temp); // 2-5
        }

        // 试玩版公主转wild出现动画
        ccs.armatureDataManager.addArmatureFileInfo(res.ElementalGongzhuZhuan_exjson);
        var iconAni = new ccs.Armature("elemental_gongzhuzhuan");
        iconAni.setPosition(102, 0);
        this._rootNode.addChild(iconAni, 1);
        lst.push(iconAni); // 6

        ccs.armatureDataManager.addArmatureFileInfo(res.ElementalFGWindMoveEnd_exjson);
        var moveAniDown = new ccs.Armature("elemental_feng_bc");
        this._rootNode.addChild(moveAniDown, 0);
        lst.push(moveAniDown); // 7

        ccs.armatureDataManager.addArmatureFileInfo(res.ElementalFGWindMoveEnd_exjson);
        var moveAniUp = new ccs.Armature("elemental_feng_bc");
        this._rootNode.addChild(moveAniUp, 2);
        lst.push(moveAniUp); // 8
    },

    _setState: function(state) {
        this._iState = state;
    },

    _refreshVisible: function(type, visible) {
        var lst = this._lstModule[type];
        for (var i = 0; i < lst.length; ++i) {
            var node = lst[i];
            if (node instanceof Array) {
                if (node[0]) {
                    node[0].node.setVisible(visible);
                }
            }
            else if (node.node) {
                node.node.setVisible(visible);
            }
            else {
                node.setVisible(visible);
            }
        }
    }
});
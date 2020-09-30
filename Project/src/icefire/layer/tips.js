/**
 * Created by wjh on 2019/7/26.
 */

var IceFireTipsLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (gamelayer, index, windex, mgr) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        //!tips相关
        var lstTipsRes = [
            res.IceFireGameNodeTips1_json,
            res.IceFireGameNodeTips1_json,
            res.IceFireGameNodeTips1_json,
            res.IceFireGameNodeTips2_json,
            res.IceFireGameNodeTips2_json,

            res.IceFireGameNodeTips1_json,
            res.IceFireGameNodeTips1_json,
            res.IceFireGameNodeTips1_json,
            res.IceFireGameNodeTips2_json,
            res.IceFireGameNodeTips2_json
        ];

        var layer = ccs.load(lstTipsRes[windex]);
        this.addChild(layer.node);
        this._tipsLayer = layer;
        this._gameLayer = gamelayer;
        this.GameCanvasMgr = mgr;

        this.lsticon1 = ["icefire_icon_wl1.png", "icefire_icon_a1.png", "icefire_icon_b1.png", "icefire_icon_c1.png", "icefire_icon_d1.png", "icefire_icon_e1.png", "icefire_icon_f1.png", "icefire_icon_g1.png", "icefire_icon_h1.png", "icefire_icon_j1.png", "icefire_icon_k1.png", "icefire_icon_fg1.png"];
        this.lsticon2 = ["icefire_icon_wl2.png", "icefire_icon_a2.png", "icefire_icon_b2.png", "icefire_icon_c2.png", "icefire_icon_d2.png", "icefire_icon_e2.png", "icefire_icon_f2.png", "icefire_icon_g2.png", "icefire_icon_h2.png", "icefire_icon_j2.png", "icefire_icon_k2.png", "icefire_icon_fg2.png"];

        this.lstTipsIconAni1 = [res.IceFireIceIconAni_WL_json, res.IceFireIceIconAni_A_json, res.IceFireIceIconAni_B_json, res.IceFireIceIconAni_C_json, res.IceFireIceIconAni_D_json, res.IceFireIceIconAni_E_json, res.IceFireIceIconAni_F_json, res.IceFireIceIconAni_G_json, res.IceFireIceIconAni_H_json, res.IceFireIceIconAni_J_json, res.IceFireIceIconAni_K_json, res.IceFireIceIconAni_FG_json];
        this.lstTipsIconAni2 = [res.IceFireFireIconAni_WL_json, res.IceFireFireIconAni_A_json, res.IceFireFireIconAni_B_json, res.IceFireFireIconAni_C_json, res.IceFireFireIconAni_D_json, res.IceFireFireIconAni_E_json, res.IceFireFireIconAni_F_json, res.IceFireFireIconAni_G_json, res.IceFireFireIconAni_H_json, res.IceFireFireIconAni_J_json, res.IceFireFireIconAni_K_json, res.IceFireFireIconAni_FG_json];

        this.tipsIconRunAni = undefined;             //! icon动画
        this.tipsSprIcon = undefined;                //! icon图标

        // //富文本
        // {type:'richtextex',name:'textFreeWinInfo',str:'sfs_summary_amount_won',fontname:'Ubuntu_M'},
        // {type:'richtextex',name:'textFreeWinInfo',str:'sfs_summary_amount_won',fontname:'Ubuntu_M'},

        this._init(index, windex);

        this.scheduleUpdate();
    },

    _init: function (index, windex) {
        for (var ii = 0; ii < this.lsticon1.length; ii++) {
            var nodeIcon = findChildByName(this._tipsLayer.node, 'nodeIcon' + ii);

            if (nodeIcon != undefined && nodeIcon != null)
                nodeIcon.setVisible(ii == index);

            if (ii == index) {
                var node = nodeIcon;
            }
        }

        if (node) {
            for (var ii = 0; ii < node._children.length; ii++) {
                var text = node._children[ii];

                if (text && text.setFontName) {
                    text.setFontName('Ubuntu_M');
                }
            }
        }

        if (windex < 5) {
            this.tipsIconRunAni = CcsResCache.singleton.load(this.lstTipsIconAni1[index]);
            var frame = cc.spriteFrameCache.getSpriteFrame(this.lsticon1[index]);
        } else {
            this.tipsIconRunAni = CcsResCache.singleton.load(this.lstTipsIconAni2[index]);
            var frame = cc.spriteFrameCache.getSpriteFrame(this.lsticon2[index]);
        }

        this.tipsSprIcon = findChildByName(this._tipsLayer.node, 'sprIcon');
        if (frame != undefined && frame != null) {
            this.tipsSprIcon.setSpriteFrame(frame);
            this.tipsSprIcon.setVisible(false);
        }

        this.tipsIconRunAni.node.runAction(this.tipsIconRunAni.action);
        this.tipsIconRunAni.action.gotoFrameAndPlay(0, this.tipsIconRunAni.action.getDuration(), false);

        var aniIcon = findChildByName(this._tipsLayer.node, 'aniIcon');
        if (aniIcon)
            aniIcon.addChild(this.tipsIconRunAni.node);

        var textwl = findChildByName(this._tipsLayer.node, 'textwl');
        if (textwl) {
            textwl.setFontName('Ubuntu_M');
            textwl.setFontSize(20);
            LanguageData.instance.showTextStr("explanation_wild",textwl);
        }

        var textfg = findChildByName(this._tipsLayer.node, 'textfg');
        if (textfg) {
            //富文本处理之后，通过名字找不到该节点，如需需保存下 todo
            var nodeparent = textfg.getParent();
            var richtextfg = new RichTextEx(textfg, nodeparent);
            textfg.removeFromParent();
            richtextfg.setRichNodeName("textfg");
            richtextfg.setFontName('Ubuntu_M');
            LanguageData.instance.showTextStr("explanation_scatters",richtextfg);
        }
    },

    update: function (dt) {
        if (this.tipsIconRunAni == undefined)
            return;

        if (this.tipsIconRunAni.action.getCurrentFrame() >= this.tipsIconRunAni.action.getDuration()) {
            CcsResCache.singleton.release(this.tipsIconRunAni);
            this.tipsIconRunAni = undefined;

            this.tipsSprIcon.setVisible(true);
        }
    }
});
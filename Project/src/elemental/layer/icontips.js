var ElementalIconTipsLayer = cc.Layer.extend({
    /**
     type == 0，显示payleft
     type != 0, 显示payright
     */
    ctor: function(type, index, logic, bFreeGame) {
        this._super();

        this.type = type;
        this.index = index;
        this._logic = logic;
        this.tipsLayerObj = undefined;
        this.tipsLayer = undefined;
        this._bFreeGame = bFreeGame;

        this.init();
    },

    init: function() {

        var resName = res.ElementalTipsLeft_json;
        if (this.type !== 0)
            resName = res.ElementalTipsRight_json;

        this.tipsLayerObj = ccs.load(resName);
        this.tipsLayer = this.tipsLayerObj.node;
        this.addChild(this.tipsLayer);

        var sprIcon = findNodeByName(this.tipsLayer, "sprIcon");
        if (sprIcon)
            sprIcon.setVisible(false);

        var gameType = this._logic.getGameType();
        if (!this._bFreeGame && !this._logic.isBetaGame()){
            gameType = 0;
        }

        var lstIconAni = this._logic.getIconAniRun(gameType);

        if (lstIconAni[this.index]) {
            var aniNode = ccs.load(lstIconAni[this.index]);
            if (aniNode) {
                this.addChild(aniNode.node);

                aniNode.node.runAction(aniNode.action);
                 aniNode.action.gotoFrameAndPlay(0, aniNode.action.getDuration(), false);
            }
        }

        var node = undefined;
        var name = undefined;
        for (var i = 0; i < 12; i++) {
            name = "nodeIcon" + i;
            node = findNodeByName(this.tipsLayer, name);
            if (node) {
                node.setVisible(i === this.index);
            }
        }
    }
});
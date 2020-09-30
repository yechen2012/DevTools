var LINE_NUN = 25;

var ElementalLine = cc.Node.extend({
    ctor: function() {
        this._super();

        this._lstAniLine = [];

        ccs.armatureDataManager.addArmatureFileInfo(res.ElementalLine_exjson);

        for (var i = 0; i < LINE_NUN; i++) {
            var aniLine = new ccs.Armature("elemental_lianxian");
            aniLine.setPosition(cc.p(0, 0));
            aniLine.setVisible(false);
            this.addChild(aniLine);

            this._lstAniLine.push(aniLine);
        }
    },

    showLine: function(lineID) {
        if (lineID !== undefined && lineID > 0 && lineID < (LINE_NUN + 1)) {
            var self = this;
            var aniLine = this._lstAniLine[lineID - 1];
            if (aniLine) {
                aniLine.setVisible(true);
                aniLine.animation.play("xian" + lineID.toString(), -1, 0);
                aniLine.animation.setMovementEventCallFunc(function(sender, type, movementID){
                    if (type === ccs.MovementEventType.complete && movementID === lineID.toString()) {
                        aniLine.setVisible(false);
                    }
                });
            }

        }
    },

    hideAllLine: function() {
        for (var i = 0; i < LINE_NUN; i++) {
            var aniLine = this._lstAniLine[i];
            aniLine.animation.stop();
            aniLine.setVisible(false);
        }
    },
});
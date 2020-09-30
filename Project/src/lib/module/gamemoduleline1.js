/**
 * Created by ssscomic on 2017/11/16.
 */
var GameModuleLine1 = cc.Node.extend({
    ctor: function (linedata, lstline) {
        this.nodeRoot = linedata.root;

        this.linedata = linedata;
        this.lstSprLine = [];

        if(this.linedata.res != undefined)
            cc.spriteFrameCache.addSpriteFrames(this.linedata.res);

        this.setLine(lstline);
    },

    setLine : function (lstline) {
        if(lstline == undefined)
            return ;

        this.lstline = lstline;
        this.lstSprLine = [];

        for(var ii = 0; ii < this.lstline.length; ++ii) {
            var line = new cc.Node();
            this.nodeRoot.addChild(line);
            line.setVisible(false);

            var lcolor = ii % this.linedata.colornum + 1;

            for(var jj = 0; jj < this.linedata.wnum - 1; ++jj) {
                var bi = this.lstline[ii][jj];
                var chgi = this.lstline[ii][jj] - this.lstline[ii][jj + 1];

                var frame = cc.spriteFrameCache.getSpriteFrame(this.linedata.linename + lcolor + '_' + (Math.abs(chgi) + 1) + '.png');

                if(frame != undefined && frame != null) {
                    var spr = new cc.Sprite();
                    spr.setSpriteFrame(frame);
                    line.addChild(spr);

                    if(chgi > 0)
                        spr.setScaleX(-1);

                    var lx = this.linedata.cx + this.linedata.xsp * (jj + 0.5);
                    var ly = this.linedata.cy + this.linedata.ysp * ((this.linedata.hnum - 1) / 2 - bi) + this.linedata.ysp * chgi / 2;

                    spr.setPosition(lx, ly);
                }
            }

            for(var jj = 0; jj < this.linedata.wnum; ++jj) {
                var bi = this.lstline[ii][jj];

                var frame = cc.spriteFrameCache.getSpriteFrame(this.linedata.starname + '.png');

                if(frame == undefined || frame == null)
                    frame = cc.spriteFrameCache.getSpriteFrame(this.linedata.starname + lcolor + '.png');

                if(frame != undefined && frame != null) {
                    var spr = new cc.Sprite();
                    spr.setSpriteFrame(frame);
                    line.addChild(spr, 1);

                    var lx = this.linedata.cx + this.linedata.xsp * jj;
                    var ly = this.linedata.cy + this.linedata.ysp * ((this.linedata.hnum - 1) / 2 - bi);

                    spr.setPosition(lx, ly);
                }
            }

            this.lstSprLine.push(line);
        }
    },

    updtae : function (dt) {

    },

    showLine : function (index) {
        if(index < 0 || index >= this.lstSprLine.length)
            return ;

        this.lstSprLine[index].setVisible(true);
    },

    hideLine : function (index) {
        if(index < 0 || index >= this.lstSprLine.length)
            return ;

        this.lstSprLine[index].setVisible(false);
    },

    hideAllLine : function () {
        for(var ii = 0; ii < this.lstSprLine.length; ++ii) {
            this.lstSprLine[ii].setVisible(false);
        }
    }

});
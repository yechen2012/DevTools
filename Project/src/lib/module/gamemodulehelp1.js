/**
 * Created by ssscomic on 2017/11/16.
 */
var GameModuleHelp1 = cc.Node.extend({
    ctor: function (root, gamelayer, helpdata, lstres) {
        this.root = root;
        this.gamelayer = gamelayer;
        this.helpdata = helpdata;

        this.nodeHelp = new cc.Node();
        this.root.addChild(this.nodeHelp, 2);

        this.lstbtnexitname = [ 'btnClose', 'btnExit', 'btnOk', 'btnOK', 'btnCancel' ];
        this.lstbtnnextename = [ 'btnNext', 'btnRight' ];
        this.lstbtnfrontename = [ 'btnFront', 'btnLeft' ];

        this.lstHelp = [];              //! 帮助页面相关
        this.lstIcon = [];

        this.iCurIndex = -1;           //! 当前显示哪一页 -1表示不显示

        for(var jj = 0; jj < helpdata.iconnum; ++jj) {
            var icon = {};
            this.lstIcon.push(icon);
        }

        var iconname = helpdata.iconname;

        if(iconname == undefined)
            iconname = 'Node_';

        for(var ii = 0; ii < lstres.length; ++ii) {
            if(lstres[ii] == undefined)
                break;

            var help = {};
            this.lstHelp.push(help);

            help.layer = ccs.load(lstres[ii]);

            if(help.layer == null || help.layer == undefined) {
                help.layer = undefined;
                continue ;
            }

            this.nodeHelp.addChild(help.layer.node);
            help.layer.node.setVisible(false);

            //! 寻找图标对应的节点
            for(var jj = 0; jj < helpdata.iconnum; ++jj) {
                var node = findNodeByName(help.layer.node, iconname + jj);

                if(node == null || node == undefined)
                    continue ;

                var icon = this.lstIcon[jj];
                icon.node = node;

                icon.spr = node.getChildByName("sprIcon");
                icon.lstText = [];

                for(var kk = 0; kk < helpdata.wnum; ++kk) {
                    var text = node.getChildByName('text' + (kk + 1));

                    if(text == null || text == undefined)
                        text = node.getChildByName('txt' + (kk + 1));

                    if(text == null || text == undefined)
                        icon.lstText.push(undefined);
                    else
                        icon.lstText.push(text);
                }
            }

            //! 页面的按钮
            help.btnExit = undefined;

            for(var jj = 0; jj < this.lstbtnexitname.length; ++jj) {
                help.btnExit = findNodeByName(help.layer.node, this.lstbtnexitname[jj]);

                if(help.btnExit != null && help.btnExit != undefined)
                    break;
            }

            if(help.btnExit != null && help.btnExit != undefined) {
                help.btnExit.addTouchEventListener(this.onTouchExit, this);
            }

            help.btnNext = undefined;

            for(var jj = 0; jj < this.lstbtnnextename.length; ++jj) {
                help.btnNext = findNodeByName(help.layer.node, this.lstbtnnextename[jj]);

                if(help.btnNext != null && help.btnNext != undefined)
                    break;
            }

            if(help.btnNext != null && help.btnNext != undefined) {
                help.btnNext.addTouchEventListener(this.onTouchNext, this);
            }

            help.btnFront = undefined;

            for(var jj = 0; jj < this.lstbtnfrontename.length; ++jj) {
                help.btnFront = findNodeByName(help.layer.node, this.lstbtnfrontename[jj]);

                if(help.btnFront != null && help.btnFront != undefined)
                    break;
            }

            if(help.btnFront != null && help.btnFront != undefined) {
                help.btnFront.addTouchEventListener(this.onTouchFront, this);
            }
        }

        this.hideHelp();
    },

    update : function (dt) {

    },

    //! 显示帮助界面
    showHelp : function (index) {
        this.hideHelp();

        if(this.lstHelp.length <= 0)
            return ;

        var si = index;

        if(si == undefined)
            si = 0;

        if(this.lstHelp[si].layer != undefined)
            this.lstHelp[si].layer.node.setVisible(true);

        this.iCurIndex = si;
    },

    //! 隐藏帮助界面
    hideHelp : function () {
        for(var ii = 0; ii < this.lstHelp.length; ++ii) {
            var help = this.lstHelp[ii];

            if(help.layer != undefined) {
                help.layer.node.setVisible(false);
            }
        }

        this.iCurIndex = -1;
    },

    //! 帮助界面是否显示
    isShow : function () {
        return this.iCurIndex >= 0;
    },

    //! 清除中奖结果
    clearResult : function () {
        for(var ii = 0; ii < this.lstIcon.length; ++ii) {
            var icon = this.lstIcon[ii];

            if(icon.node == undefined)
                continue ;

            if(icon.spr != null && icon.spr != undefined) {
                icon.spr.stopAllActions();

                //! 有每个图标单独的数据
                if(this.helpdata.iconlstscale != undefined)
                    icon.spr.setScale(this.helpdata.iconlstscale[ii][0]);
                else if(this.helpdata.iconbscale != undefined)
                    icon.spr.setScale(this.helpdata.iconbscale);
            }

            for(var jj = 0; jj < icon.lstText.length; ++jj) {
                if(icon.lstText[ii] == undefined)
                    continue ;

                if(this.helpdata.textbcolor != undefined)
                    icon.lstText[ii].setColor(this.helpdata.textbcolor);
            }
        }
    },

    //! 设置中奖结果 type 0线 1其他
    setResult : function (type, symbol, line, num) {
        if(symbol < 0 || symbol >= this.lstIcon.length)
            return ;

        var icon = this.lstIcon[symbol];

        if(icon.node == undefined)
            return ;

        //! 图标闪烁
        if(icon.spr != null && icon.spr != undefined) {
            var bs = 1;
            var es = 1.1;
            var stime = 1;

            if(this.helpdata.iconlstscale != undefined) {
                bs = this.helpdata.iconlstscale[symbol][0];
                es = this.helpdata.iconlstscale[symbol][1];
            }
            else if(this.helpdata.iconbscale != undefined && this.helpdata.iconescale != undefined) {
                bs = this.helpdata.iconbscale;
                es = this.helpdata.iconescale;
            }

            if(this.helpdata.iconscaletime != undefined)
                stime = this.helpdata.iconscaletime;

            var sc1 = cc.scaleTo(stime / 2, es);
            var sc2 = cc.scaleTo(stime / 2, bs);
            var seq = cc.sequence(sc1, sc2);
            var ani = cc.repeatForever(seq);

            icon.spr.runAction(ani);
        }

        //! 倍数文字变色
        if(num > 0 && num <= icon.lstText.length) {
            var ni = numn - 1;

            if(icon.lstText[ni] != undefined) {

                if(this.helpdata.textwincolor != undefined)
                    icon.lstText[ni].setColor(this.helpdata.textwincolor);
            }
        }
    },

    onTouchExit : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if (this.helpdata.btnlstdound != undefined && this.helpdata.btnlstdound.length > 0)
            cc.audioEngine.playEffect(this.helpdata.btnlstdound[0], false);
        else if(this.helpdata.btnsound != undefined)
            cc.audioEngine.playEffect(this.helpdata.btnsound, false);

        this.hideHelp();
    },

    onTouchNext : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if (this.helpdata.btnlstdound != undefined && this.helpdata.btnlstdound.length > 2)
            cc.audioEngine.playEffect(this.helpdata.btnlstdound[2], false);
        else if(this.helpdata.btnsound != undefined)
            cc.audioEngine.playEffect(this.helpdata.btnsound, false);

        this.iCurIndex += 1;

        if(this.iCurIndex >= this.lstHelp.length)
            this.iCurIndex = 0;

        this.showHelp(this.iCurIndex);
    },

    onTouchFront : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if (this.helpdata.btnlstdound != undefined && this.helpdata.btnlstdound.length > 1)
            cc.audioEngine.playEffect(this.helpdata.btnlstdound[1], false);
        else if(this.helpdata.btnsound != undefined)
            cc.audioEngine.playEffect(this.helpdata.btnsound, false);

        this.iCurIndex -= 1;

        if(this.iCurIndex < 0)
            this.iCurIndex = this.lstHelp.length - 1;

        this.showHelp(this.iCurIndex);
    },

});
//! 载入完成时的提示界面
var TlodInfoLayer = cc.Layer.extend({
    ctor:function (glayer) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        //! 画布
        this.GameCanvasMgr = new GameCanvasMgr(this);

        var lstvanvas = [res.NewTlodInfoCanvas1_json, res.NewTlodInfoCanvas2_json, res.NewTlodInfoCanvas3_json];
        this.GameCanvasMgr.addCanvases(lstvanvas);

        this.GameCanvasMgr.gotoFrameAndPlay(-1, -1, true);

        var canvas = this.GameCanvasMgr.getCanvas(0);
        canvas.removeFlag(gmc.GMC_FLAG_MOBILE);

        // canvas = this.GameCanvasMgr.getCanvas(1);
        // canvas.removeFlag(gmc.GMC_FLAG_PC);

        canvas = this.GameCanvasMgr.getCanvas(2);
        canvas.removeFlag(gmc.GMC_FLAG_PC);

        var lstadaptive = ["layAdaptive", "layPress"];

        this.GameCanvasMgr.addAdaptiveLayouts(lstadaptive);

        this._gameLayer = glayer;

        //! 节点
        this.layPress = this.GameCanvasMgr.initNode("layPress", "layPress");
        //this.layPress.setCallFunction(this, this.onTouchPress);
        this.layPress.setCallFunction(this.onTouchPress, this);

        this.nodeInfo = this.GameCanvasMgr.initNode("nodeInfo", "nodeInfo");
        this.sprLogo = this.GameCanvasMgr.initNode("sprLogo", "sprLogo");

        //! 单一节点
        this.nodeBack1 = this.GameCanvasMgr.initSingle("nodeBack1", "nodeBack1");
        this.InfoBack1 = ccs.load(res.NewTlodInfoNode_Back1_json);
        this.InfoBack1.node.runAction(this.InfoBack1.action);
        this.nodeBack1.addChild(this.InfoBack1.node);

        //! 背景节点
        this.GameCanvasMgr.addBackNode_SingleNode("nodeBack1", this.nodeBack1);

        //! 导出动画
        this.aniPress = this.GameCanvasMgr.initArmature("aniPress", "aniPress");
        this.aniPress.setVisible(true);
        this.aniPress.play();

        //! 文字
        this.textPress = this.GameCanvasMgr.initTextEx("textPress", "textPress");
        this.textPress.setVisible(false);
        this.textPress.setFontName('SourceHanSansCN-Regular');

        this.textTap = this.GameCanvasMgr.initTextEx("textTap", "textTap");
        this.textTap.setVisible(false);
        this.textTap.setFontName('SourceHanSansCN-Regular');

        this.textInfo1 = this.GameCanvasMgr.initTextEx("textInfo1", "textInfo1");
        this.textInfo1.setFontName('SourceHanSansCN-Regular');
        // this.textInfo1.setTextColor(cc.color(255, 0, 0));
        // this.textInfo1.enableOutline(cc.color(0,0,0), 2);
        //this.textInfo1.setMultiLine(false);
        //this.textInfo1.setScaleType(2);

        this.textInfo2 = this.GameCanvasMgr.initTextEx("textInfo2", "textInfo2");
        this.textInfo2.setFontName('SourceHanSansCN-Regular');
        // this.textInfo2.setTextColor(cc.color(0, 255, 0));
        // this.textInfo2.setString('中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？');
        // this.textInfo2.enableOutline(cc.color(0,0,0), 2);
        // //this.textInfo2.setMultiLine(false);
        // this.textInfo2.setScaleType(2);

        //! 缩放
        var gamecanvas = this.GameCanvasMgr.getCanvas(1);
        var scaledata = new gmc.ScaleData();

        scaledata.minSize.width = 900;
        scaledata.minSize.height = 1000;
        scaledata.maxSize.width = 1200;
        scaledata.maxSize.height = 1400;
        scaledata.minScale = 1.2;
        scaledata.maxScale = 1.5;

        var wnode = this.nodeInfo.getNode(1);
        var gmcscale = new GameCanvasScale(wnode, scaledata);

        gamecanvas.addScale("nodeInfo", gmcscale);

        scaledata = new gmc.ScaleData();

        scaledata.minSize.width = 900;
        scaledata.minSize.height = 1000;
        scaledata.maxSize.width = 1200;
        scaledata.maxSize.height = 1400;
        scaledata.minScale = 1.0;
        scaledata.maxScale = 1.25;

        wnode = this.sprLogo.getNode(1);
        gmcscale = new GameCanvasScale(wnode, scaledata);

        gamecanvas.addScale("sprLogo", gmcscale);

        //! 逻辑
        this.lstpresstime = [2, 0.5, 2, 0.5];
        this.iPressState = 0;       //! 0显示动画 1出现文字 2显示文字 3文字消失
        this.iPressTime = this.lstpresstime[this.iPressState];

        // //! 测试
        // this.textPress = findChildByName(this, 'textPress');
        // this.textPress.setFontName('SourceHanSansSC-Bold');
        // //this.textPress.setFontName('BuzzSawAOE');
        // this.textPress.setString('中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果？中文是个啥效果');
        // this.iTestNums = 0;
        // this.iTextSize = this.textPress.getContentSize();
        // //this.textPress.setFontSize(200);
        // this.iFontSize = this.textPress.getFontSize();
        // //this.textPress.enableOutline(cc.color(255,0,0), 3);
        // // this.textPress.setTextVerticalAlignment(2);
        // // this.textPress.setAnchorPoint(0.5, 0);
        // // this.textPress.setPosition(0, -1);
        //
        // // this.textPress.setTextHorizontalAlignment(0);
        // // this.textPress.setAnchorPoint(0, 0.5);
        // // this.textPress.setPosition(-290, 54);
        //
        // //this.textPress.enableShadow(cc.color(128,128,128), cc.size(3, -3), 0);
        // //this.textPress.enableGlow(cc.color(128,128,128));

        // var bmfont = findChildByName(this, 'BitmapFontLabel_14');
        // this.bmgontex = new TextBMFontEx(bmfont);
        // this.bmgontex.setString('00000000000000000000');
        // this.iTestNums = 0;

        this.scheduleUpdate();

        return true;
    },

    onTouchPress : function () {
        this._gameLayer.InfoLayer = undefined;
        this.removeFromParent();
        // //! 测试代码
        // this.iTestNums += 1;
        //
        // if(this.iTestNums > 5)
        //     this.iTestNums = 0;
        //
        // this.textPress.setTextAreaSize(this.iTextSize);
        // this.textPress.setFontSize(this.iFontSize);
        // this.textPress.setScale(1);
        //
        // switch(this.iTestNums) {
        //     case 0:
        //         break;
        //     case 1:
        //         //! 尝试调整文字大小把所有文字放进去（多行）
        //         var osize = this.iTextSize;
        //         var fsize = this.iFontSize;
        //
        //         this.textPress.setTextAreaSize(cc.size(osize.width, 0));
        //         var lsize = this.textPress.getVirtualRendererSize();
        //
        //         while(lsize.height > osize.height) {
        //             fsize -= 1;
        //             this.textPress.setFontSize(fsize);
        //
        //             lsize = this.textPress.getVirtualRendererSize();
        //         }
        //
        //         this.textPress.setTextAreaSize(cc.size(osize.width, osize.height));
        //         break;
        //     case 2:
        //         //! 尝试调整文字大小把所有文字放进去（仅单行）
        //         var osize = this.iTextSize;
        //         var fsize = this.iFontSize;
        //
        //         this.textPress.setTextAreaSize(cc.size(osize.width, 0));
        //         var lsize = this.textPress.getVirtualRendererSize();
        //
        //         while(lsize.height > osize.height) {
        //             fsize -= 1;
        //             this.textPress.setFontSize(fsize);
        //
        //             lsize = this.textPress.getVirtualRendererSize();
        //         }
        //
        //         var asize = this.textPress.getAutoRenderSize();
        //
        //         while(lsize.height > asize.height) {
        //             fsize -= 1;
        //             this.textPress.setFontSize(fsize);
        //
        //             lsize = this.textPress.getVirtualRendererSize();
        //             asize = this.textPress.getAutoRenderSize();
        //         }
        //
        //         this.textPress.setTextAreaSize(cc.size(osize.width, osize.height));
        //         break;
        //     case 3:
        //         //! 尝试调整文字大小把所有文字放进去（单行挤扁）
        //         var osize = this.iTextSize;
        //         var fsize = this.iFontSize;
        //
        //         var asize = this.textPress.getAutoRenderSize();
        //
        //         this.textPress.setTextAreaSize(cc.size(asize.width, asize.height));
        //
        //         if(osize.width < asize.width)
        //             this.textPress.setScaleX(osize.width / asize.width);
        //
        //         if(osize.height < asize.height)
        //             this.textPress.setScaleY(osize.height / asize.height);
        //
        //         break;
        //     case 4:
        //         //! 尝试调整文字大小把所有文字放进去（多行挤扁）
        //         var osize = this.iTextSize;
        //         var fsize = this.iFontSize;
        //
        //         //! 防止一行都放不下的情况
        //         var asize = this.textPress.getAutoRenderSize();
        //         var sy = 1;
        //
        //         if(asize.height > osize.height) {
        //             sy = osize.height / asize.height;
        //         }
        //
        //         var cw = osize.width;
        //
        //         this.textPress.setTextAreaSize(cc.size(osize.width, 0));
        //         var lsize = this.textPress.getVirtualRendererSize();
        //
        //         while(lsize.height > osize.height / sy) {
        //             cw += 10;
        //
        //             this.textPress.setTextAreaSize(cc.size(cw, 0));
        //             lsize = this.textPress.getVirtualRendererSize();
        //         }
        //
        //         if(sy < 1)
        //             this.textPress.setTextAreaSize(cc.size(cw, asize.height));
        //         else
        //             this.textPress.setTextAreaSize(cc.size(cw, osize.height));
        //
        //         this.textPress.setScaleX(osize.width / cw);
        //         this.textPress.setScaleY(sy);
        //
        //         break;
        //     case 5:
        //         //! 尝试调整文字大小把所有文字放进去（多行压扁）
        //         var osize = this.iTextSize;
        //         var fsize = this.iFontSize;
        //
        //         this.textPress.setTextAreaSize(cc.size(osize.width, 0));
        //         var lsize = this.textPress.getVirtualRendererSize();
        //
        //         if(lsize.height > osize.height) {
        //             this.textPress.setTextAreaSize(cc.size(lsize.width, lsize.height));
        //             this.textPress.setScaleY(osize.height / lsize.height);
        //         }
        //         else {
        //             this.textPress.setTextAreaSize(this.iTextSize);
        //         }
        //
        //         break;
        // }

        // this.iTestNums += 1;
        //
        // if(this.iTestNums > 2)
        //     this.iTestNums = 0;
        //
        // switch(this.iTestNums) {
        //     case 0:
        //         this.bmgontex.setString('00000000000000000000');
        //         break;
        //     case 1:
        //         this.bmgontex.setString('0000000000');
        //         break;
        //     case 2:
        //         this.bmgontex.setString('00000');
        //         break;
        // }
    },

    update : function(dt) {
        this.GameCanvasMgr.update(dt);

        // var vrsize = this.textPress.getAutoRenderSize();
        // var csize = this.textPress.getContentSize();

        //! 提示动画
        this.iPressTime -= dt;

        if(this.iPressTime <= 0) {
            this.iPressState += 1;

            if(this.iPressState > 3)
                this.iPressState = 0;

            this.iPressTime = this.lstpresstime[this.iPressState] + this.iPressTime;
            this.refreshPress(true);
        }
        else {
            this.refreshPress(false);
        }

    },

    refreshPress : function (bChg) {
        if(bChg) {
            this.aniPress.setVisible(this.iPressState == 0);
            this.textPress.setVisible(this.iPressState != 0);
            this.textTap.setVisible(this.iPressState != 0);

            if(this.iPressState == 0)
                this.aniPress.play();
        }

        switch(this.iPressState) {
            case 0:
                break;
            case 1:
                var opacity = Math.floor(255 * (1 - this.iPressTime / this.lstpresstime[1]));
                opacity = Math.min(255, opacity);
                opacity = Math.max(0, opacity);
                this.textPress.setOpacity(opacity);
                this.textTap.setOpacity(opacity);
                break;
            case 2:
                this.textPress.setOpacity(255);
                this.textTap.setOpacity(255);
                break;
            case 3:
                var opacity = Math.floor(255 * this.iPressTime / this.lstpresstime[3]);
                opacity = Math.min(255, opacity);
                opacity = Math.max(0, opacity);
                this.textPress.setOpacity(opacity);
                this.textTap.setOpacity(opacity);
                break;
        }
    },
});

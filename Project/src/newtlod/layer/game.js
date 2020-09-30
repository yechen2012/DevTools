
var TlodGameLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        this.name = 'tlod';
        CcsResCache.singleton.setCurModule(this.name, this);

        var infolayer = new TlodInfoLayer(this);
        this.addChild(infolayer, 1000);
        this.InfoLayer = infolayer;

        //! 画布
        this.GameCanvasMgr = new GameCanvasMgr(this);

        var lstvanvas = [res.NewTlodGameCanvas1_json, res.NewTlodGameCanvas2_json, res.NewTlodGameCanvas3_json];
        //var lstvanvas = [res.NewTlodGameScene2_json];
        this.GameCanvasMgr.addCanvases(lstvanvas);

        var canvas = this.GameCanvasMgr.getCanvas(0);
        canvas.removeFlag(gmc.GMC_FLAG_MOBILE);

        canvas = this.GameCanvasMgr.getCanvas(2);
        canvas.removeFlag(gmc.GMC_FLAG_PC);

        // canvas = this.GameCanvasMgr.getCanvas(1);
        // canvas.removeFlag(gmc.GMC_FLAG_MOBILE);

        var lstadaptive = ["layAdaptive", "layDisable", "layAutoSelect", "layAdaptive1"];

        this.GameCanvasMgr.addAdaptiveLayouts(lstadaptive);

        // //! 资源类
        // this.resTotalWin = this.GameCanvasMgr.initResource("resTotalWin", [res.NewTlodUINode_TotalWin1_json, res.NewTlodUINode_TotalWin2_json, res.NewTlodUINode_TotalWin2_json]);
        // this.nodeTotalWin = this.GameCanvasMgr.initNode("nodeTotalWin", "nodeTotalWin");
        // this.nodeTotalWin.addChild(this.resTotalWin);
        //
        // this.resWinAni = this.GameCanvasMgr.initResource("resWinAni", res.NewTlodWinAni_json, true);
        // this.nodeWinAni = this.GameCanvasMgr.initSingle("nodeWinAni", "nodeWinAni");
        // this.nodeWinAni.addChild(this.resWinAni);

        //! UI模块
        this.ModuleUI = new GameModuleUI1(this.GameCanvasMgr);

        this.nodeTotalWin = this.GameCanvasMgr.initNode("nodeTotalWin", "nodeTotalWin");
        this.nodeWinAni = this.GameCanvasMgr.initSingle("nodeWinAni", "nodeWinAni");

        //! 节点
        // this.layDisable = this.GameCanvasMgr.initNode("layDisable", "layDisable");
        // this.layDisable.setVisible(false);
        // this.layDisable.setCallFunction(this, this.onTouchDisable);

        this.nodeAutoBack = this.GameCanvasMgr.initNode("nodeAutoBack", "nodeAutoBack");
        this.nodeAutoBack.setVisible(false);

        // this.layAutoSelect = this.GameCanvasMgr.initNode("layAutoSelect", "layAutoSelect");
        // this.layAutoSelect.setVisible(false);
        // this.layAutoSelect.setCallFunc(this, this.onTouchAutoSelectLayer);

        //! 按钮
        var btndata;
        // var btndata = new gmc.ButtonData();
        //
        // btndata.btnname = 'btnRun';
        // btndata.areaname = 'areaRun';
        // btndata.callfunc = this.onTouchRun;
        // btndata.target = this;
        //
        // this.btnRun = this.GameCanvasMgr.initButton("btnRun", btndata);

        btndata = new gmc.ButtonData();
        //
        // btndata.btnname = 'btnMaxBet';
        // btndata.areaname = 'areaMaxBet';
        // btndata.callfunc = this.onTouchMaxBet;
        // btndata.target = this;
        // btndata.lstbtnname = ['btnMaxBetBack'];
        //
        // this.btnMaxBet = this.GameCanvasMgr.initButton("btnMaxBet", btndata);

        // btndata = new gmc.ButtonData();
        //
        // btndata.btnname = 'btnAuto';
        // btndata.areaname = 'areaAuto';
        // btndata.callfunc = this.onTouchAuto;
        // btndata.target = this;
        // btndata.lstbtnname = ['btnAutoBack'];
        //
        // this.btnAuto = this.GameCanvasMgr.initButton("btnAuto", btndata);
        //
        // btndata = new gmc.ButtonData();
        //
        // btndata.btnname = 'btnAutoStop';
        // btndata.areaname = 'areaAutoStop';
        // btndata.callfunc = this.onTouchAutoStop;
        // btndata.target = this;
        // btndata.lstbtnname = ['btnAutoStopBack'];
        //
        // this.btnAutoStop = this.GameCanvasMgr.initButton("btnAutoStop", btndata);
        // this.btnAutoStop.setVisible(false);
        //
        // btndata = new gmc.ButtonData();
        //
        // btndata.btnname = 'btnLeft';
        // btndata.areaname = 'areaLeft';
        // btndata.callfunc = this.onTouchLeft2;
        // btndata.target = this;
        //
        // this.btnLeft2 = this.GameCanvasMgr.initButton("btnLeft2", btndata);
        //
        // btndata = new gmc.ButtonData();
        //
        // btndata.btnname = 'btnRight';
        // btndata.areaname = 'areaRight';
        // btndata.callfunc = this.onTouchRight2;
        // btndata.target = this;
        //
        // this.btnRight2 = this.GameCanvasMgr.initButton("btnRight2", btndata);

        // btndata.btnname = 'btnAuto25';
        // btndata.areaname = undefined;
        // btndata.callfunc = this.onTouchAuto25;
        // btndata.target = this;
        //
        // this.btnAuto25 = this.GameCanvasMgr.initButton("btnAuto25", btndata);
        //
        // btndata.btnname = 'btnAuto50';
        // btndata.areaname = undefined;
        // btndata.callfunc = this.onTouchAuto50;
        // btndata.target = this;
        //
        // this.btnAuto50 = this.GameCanvasMgr.initButton("btnAuto50", btndata);
        //
        // btndata.btnname = 'btnAuto100';
        // btndata.areaname = undefined;
        // btndata.callfunc = this.onTouchAuto100;
        // btndata.target = this;
        //
        // this.btnAuto100 = this.GameCanvasMgr.initButton("btnAuto100", btndata);
        //
        // btndata.btnname = 'btnAuto200';
        // btndata.areaname = undefined;
        // btndata.callfunc = this.onTouchAuto200;
        // btndata.target = this;
        //
        // this.btnAuto200 = this.GameCanvasMgr.initButton("btnAuto200", btndata);
        //
        // btndata.btnname = 'btnAuto500';
        // btndata.areaname = undefined;
        // btndata.callfunc = this.onTouchAuto500;
        // btndata.target = this;
        //
        // this.btnAuto500 = this.GameCanvasMgr.initButton("btnAuto500", btndata);

        //! 文字
        this.textBet = this.GameCanvasMgr.initTextBMFontEx("textBet1", "textBet1");
        this.textAllBet = this.GameCanvasMgr.initTextBMFontEx("textAllBet", "textAllBet");
        this.textAutoNum = this.GameCanvasMgr.initTextBMFontEx("textAutoNum", "textAutoNum");
        this.textWin = this.GameCanvasMgr.initTextBMFontEx("textWin1", "textWin1");
        this.textMoney = this.GameCanvasMgr.initTextBMFontEx("textMoney", "textMoney");
        this.textFreeNum = this.GameCanvasMgr.initTextBMFontEx("textFreeNum", "textFreeNum");
        this.textTotalWin = this.GameCanvasMgr.initTextBMFontEx("textTotalWin", "textTotalWin");

        // //! 滑条
        // this.textCoinValue = this.GameCanvasMgr.initTextEx("textCoinValue", "textCoinValue");
        // this.numCoinValue = this.GameCanvasMgr.initTextBMFontEx("numCoinValue", "numCoinValue");
        // this.numCoinValue.setScaleType(0);
        // this.numCashBet = this.GameCanvasMgr.initTextBMFontEx("numCashBet", "numCashBet");
        //
        // this.slidCoinValue = this.GameCanvasMgr.initSliderEx("slidCoinValue", "slidCoinValue");
        // this.slidCoinValue.setSegmentData(['0.10','0.20','0.50','1.0','1.00','2.000','3.0000','4','5','6','10000']);
        // this.slidCoinValue.addPercentText(this.textCoinValue);
        // this.slidCoinValue.addSegmentValueText(this.numCoinValue);
        // this.slidCoinValue.addSegmentIndexText(this.numCashBet);
        // //this.slidCoinValue.setEnabled(false);
        // this.slidCoinValue.setButton(this.btnLeft2, this.btnRight2);
        // //this.slidCoinValue.setVisible(false);

        //! 单一节点
        this.nodeBack1 = this.GameCanvasMgr.initSingle("nodeBack1", "nodeBack1");
        this.GameBack1 = ccs.load(res.NewTlodGameNode_Back1_json);
        this.GameBack1.node.runAction(this.GameBack1.action);
        this.nodeBack1.addChild(this.GameBack1.node);

        this.nodeWheel = this.GameCanvasMgr.initSingle("nodeWheel", "nodeWheel");
        this.GameWheel = ccs.load(res.NewTlodGameNode_Wheel_json);
        this.GameWheel.node.runAction(this.GameWheel.action);
        this.nodeWheel.addChild(this.GameWheel.node);

        this.nodeHit = this.GameCanvasMgr.initSingle("nodeHit", "nodeHit");
        this.GameHit = ccs.load(res.NewTlodGameNode_Hit_json);
        this.GameHit.node.runAction(this.GameHit.action);
        this.nodeHit.addChild(this.GameHit.node);

        // this.nodeWinAni = this.GameCanvasMgr.initSingle("nodeWinAni", "nodeWinAni");
        // this.WinAni = ccs.load(res.NewTlodWinAni_json);
        // this.WinAni.node.runAction(this.WinAni.action);
        // this.nodeWinAni.addChild(this.WinAni.node);
        //this.nodeWinAni = this.ModuleUI.getCtrl('nodeWinAni');
        // this.WinAni = ccs.load(res.NewTlodWinAni_json);
        // this.WinAni.node.runAction(this.WinAni.action);
        // this.nodeWinAni.addChild(this.WinAni.node);

        //this.nodeWin0 = this.GameCanvasMgr.initSingle("nodeWin0", "nodeWin0");

        this.nodeFreeResult = this.GameCanvasMgr.initSingle("nodeFreeResult", "nodeFreeResult");

        //! 背景节点
        this.GameCanvasMgr.addBackNode_SingleNode("nodeBack1", this.nodeBack1);

        //! 缩放
        var gamecanvas = this.GameCanvasMgr.getCanvas(0);
        var scaledata = new gmc.ScaleData();

        scaledata.minSize.width = 1000;
        scaledata.minSize.height = 900;
        scaledata.maxSize.width = 1400;
        scaledata.maxSize.height = 1200;
        scaledata.minScale = 1;
        scaledata.maxScale = 1.3;

        var wnode = this.nodeWheel.getNode(0);
        var gmcscale = new GameCanvasScale(wnode, scaledata);
        gamecanvas.addScale("nodeWheel", gmcscale);

        var hnode = this.nodeHit.getNode(0);
        gmcscale = new GameCanvasScale(hnode, scaledata);
        gamecanvas.addScale("nodeHit", gmcscale);

        var wnode1 = this.nodeWinAni.getNode(0);
        gmcscale = new GameCanvasScale(wnode1, scaledata);
        gamecanvas.addScale("nodeWinAni", gmcscale);

        gamecanvas = this.GameCanvasMgr.getCanvas(1);
        scaledata = new gmc.ScaleData();

        scaledata.minSize.width = 900;
        scaledata.minSize.height = 1000;
        scaledata.maxSize.width = 1200;
        scaledata.maxSize.height = 1400;
        scaledata.minScale = 1;
        scaledata.maxScale = 1.25;

        wnode = this.nodeWheel.getNode(1);
        gmcscale = new GameCanvasScale(wnode, scaledata);
        gamecanvas.addScale("nodeWheel", gmcscale);

        hnode = this.nodeHit.getNode(1);
        gmcscale = new GameCanvasScale(hnode, scaledata);
        gamecanvas.addScale("nodeHit", gmcscale);

        wnode1 = this.nodeWinAni.getNode(1);
        gmcscale = new GameCanvasScale(wnode1, scaledata);
        gamecanvas.addScale("nodeWinAni", gmcscale);

        //! 场景
        this.GameScene = new GameModuleScene1(this, true);

        //! 添加场景动画 0普通 1普通到免费 2免费 3免费到普通
        var backdata1 = [
            {res:res.NewTlod_ZhuanChang_ExportJson, resname:'investiture_zhuanchang', aniname:undefined, loop:true},
            {res:res.NewTlod_ZhuanChang_ExportJson, resname:'investiture_zhuanchang', aniname:'zhuanchang1', loop:false},
            {res:res.NewTlod_ZhuanChang_ExportJson, resname:'investiture_zhuanchang', aniname:'zhuanchang2_Copy1', loop:true},
            {res:res.NewTlod_ZhuanChang_ExportJson, resname:'investiture_zhuanchang', aniname:'zhuanchang2', loop:false},
        ];
        this.GameScene.addExportAni('aniBack1', backdata1);

        var backdata2 = [
            {bindex:0,eindex:5, loop:false},
            {bindex:10,eindex:55, loop:false},
            {bindex:60,eindex:65, loop:false},
            {bindex:70,eindex:86, loop:false},
        ];
        this.GameScene.addNodeAni('GameBack', this.GameBack1, backdata2);
        this.GameScene.addNodeAni('GameWheel', this.GameWheel, backdata2);

        var backdata3 = [
            {visible:true},
            {visible:true},
            {visible:false},
            {visible:true},
        ];
        var sprBack1 = findChildByName(this.GameBack1.node, 'sprBack1');
        this.GameScene.addVisibleAni('sprBack1', sprBack1, backdata3);

        var backdata4 = [
            {visible:false},
            {visible:true},
            {visible:true},
            {visible:true},
        ];
        var sprBack2 = findChildByName(this.GameBack1.node, 'sprBack2');
        this.GameScene.addVisibleAni('sprBack2', sprBack2, backdata4);

        //! 画布上
        for(var ii = 0; ii < this.GameCanvasMgr.getCanvasNums(); ++ii) {
            //! 画布上动画切换
            var tmpcanvas = this.GameCanvasMgr.getCanvas(ii);
            this.GameScene.addNodeAni('GameCanvas' + ii, tmpcanvas._layer, backdata2);

            //! 画布上节点（普通和免费）
            var nodeNormalUI = findChildByName(tmpcanvas._layer.node, 'nodeNormalUI');

            if(nodeNormalUI)
                this.GameScene.addVisibleAni('nodeNormalUI' + ii, nodeNormalUI, backdata3);

            var nodeFreeUI = findChildByName(tmpcanvas._layer.node, 'nodeFreeUI');

            if(nodeFreeUI)
                this.GameScene.addVisibleAni('nodeFreeUI' + ii, nodeFreeUI, backdata4);
        }

        // var backdata5 = [
        //     {visible:false},
        //     {visible:false},
        //     {visible:true},
        //     {visible:false},
        // ];
        // var aniBack2 = findChildByName(this.GameBack1.node, 'aniBack2');
        // this.GameScene.addVisibleAni('aniBack2', aniBack2, backdata5);

        this.GameScene.setState(0);

        //! 轮子
        //! 符号代码和图标的对应关系
        this.lstSymbol = { WW:0, C1:1, M1:2, M2:3, M3:4, M4:5, M5:6, M6:7, M7:8, M8:9, M9:10, MT:11, ME:12 };
        this.lstWheelDatas = [[8,11,10,9,6,7,10,11,9,8,5,11,10,9,7,11,6,10,7,9,11,5,8,6,10,4,9,7,1,8,11,9,7,5,3,11,8,6,10,4,5,8,9,11,7,3,10,6,4,2],
            [11,10,9,11,7,10,8,11,10,9,11,3,7,10,11,9,6,8,4,5,6,1,7,11,4,9,0,10,8,7,6,11,2,9,1,3,8,5,10,0,8,11,6,2,3,4,7,10,9,5],
            [8,11,5,7,10,11,6,9,2,11,9,10,1,7,8,3,11,10,4,9,6,8,10,5,6,1,7,11,4,9,0,10,8,7,6,11,2,9,1,3,8,5,10,0,9,7,2,10,3,5,4,11,8,6],
            [11,10,9,11,7,10,8,11,10,9,11,3,7,10,11,9,6,8,4,5,6,1,7,11,4,9,0,10,8,7,6,11,2,9,1,3,8,5,10,0,9,7,11,8,4,10,2,5,6,3],
            [8,11,10,9,6,7,10,11,9,8,5,11,10,9,7,11,6,10,7,9,11,5,8,6,10,4,9,7,1,8,11,9,7,5,3,11,8,6,4,10,7,2,9,3,6,5,4,11,10,8]];
        this.lstWinSymbol = { WW:0, C1:1, M1:2, M2:3, M3:4, M4:5, M5:6, M6:7, M7:8, M8:9, M9:10, MT:11, ME:12 };

        var lsticon = [ "newtlod_icon0.png", "newtlod_icon1.png", "newtlod_icon2.png", "newtlod_icon3.png", "newtlod_icon4.png", "newtlod_icon5.png", "newtlod_icon6.png", "newtlod_icon7.png", "newtlod_icon7.png", "newtlod_icon7.png", "newtlod_icon7.png", "newtlod_icon7.png", "newtlod_icon12.png" ];
        var lstexicon = [ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ];
        var lsticonani = [ res.NewTlodRunAni0_json, res.NewTlodRunAni1_json, res.NewTlodRunAni2_json, res.NewTlodRunAni3_json, res.NewTlodRunAni4_json, res.NewTlodRunAni5_json, res.NewTlodRunAni6_json, res.NewTlodRunAni7_json, res.NewTlodRunAni7_json, res.NewTlodRunAni7_json, res.NewTlodRunAni7_json, res.NewTlodRunAni7_json, res.NewTlodRunAni12_json];
        var lstdownani = [ 0, res.NewTlodDownAni1_json, res.NewTlodDownAni2_json];
        var lstappearani = [ res.NewTlodAppearAni0_json, res.NewTlodAppearAni1_json, res.NewTlodAppearAni2_json];
        //var lsticonani = undefined;

        this.lsticon = lsticon;
        //this.lstbicon = lstbicon;
        this.lsticonani = lsticonani;

        this.lstchgicon = [ "onepieceww0.png", "onepieceww1.png", "onepieceww2.png", "onepieceww3.png", "onepieceww4.png" ];
        this.lstchgbicon = [ "onepiecebww0.png", "onepiecebww1.png", "onepiecebww2.png", "onepiecebww3.png", "onepiecebww4.png" ];
        this.lstchgiconani = [ res.OnePieceRunAni13_json, res.OnePieceRunAni14_json, res.OnePieceRunAni15_json, res.OnePieceRunAni16_json, res.OnePieceRunAni17_json ];

        this.lstwheeldelay = [ 5 / 24, 6 / 24, 7 / 24, 8 / 24, 9 / 24 ];
        this.lstwheel = [];

        for(var ii = 0; ii < 5; ++ii) {
            var bindex = 1;

            var layWheel = findNodeByName(this.GameWheel.node, "layWheel" + (ii + 1));
            var wheel = new Wheel2(layWheel, lsticon, lstexicon, 3, 160, 160, 164, lstdownani, lstappearani, res.NewTlodDisappearAni_json, res.NewTlodEndAni_json, res.NewTlodDisappearAni_json, 8 / 24, 1 / 24 * ii, this.lstwheeldelay[ii], 1 / 24 * ii * 3);

            //wheel.setSound(undefined, undefined, res.TlodDisappearWheel_mp3, 1, undefined);
            wheel.setSound(undefined, undefined, undefined, 1, undefined);
            wheel.setIconAni(lsticonani);

            this.lstwheel.push(wheel);
        }

        //! 分数相关的逻辑
        this.iMyMoney = undefined;
        this.iNewMoney = undefined;
        this.iShowMoney = 0;
        this.iBet = 0;
        this.iLine = 30;
        this.iTimes = 1;
        this.iWin = 0;
        this.iNewWin = 0;
        this.lstBet = [1,2,4,10,20,40,100,200,500,1000];
        this.bAutoRun = false;
        this.iAutoNum = 0;
        this.WaitAutoTime = 0;
        this.DisRunTime = 0;

        this.iAutoLoss = 0;
        this.iAutoWin = 0;

        this.bShowResult = false;
        this.iShowResultIndex = 0;
        this.ShowResultTime = 0;

        this.bGameInfoDouble = false;
        this.bCanDouble = false;
        this.bCanOpenBox = false;
        this.WaitOpenBoxTime = 0;

        //! 胜利动画
        this.lstWinAni = [ res.NewTlodWinAni0_json ];
        this.lstWinAniTime = [ 24 / 24, 60 / 24, 60 / 24, 60 / 24 ];

        this.WinAni2 = undefined;

        this.bFreeGame = false;     //! 是否在免费游戏中
        this.iFreeNums = -1;         //! 免费次数
        this.iNewFreeNums = 0;         //! 免费次数
        this.iFreeMul = 0;          //! 免费倍数
        this.iFreeAll = -1;          //! 免费赢的金额
        this.iNewFreeAll = 0;          //! 免费赢的金额
        this.iFreeBeginWin = 0;     //! 免费游戏之前赢得的金额
        this.iFreeType = -1;          //! 免费游戏的类型
        this.iFreeAdd = 0;          //! 增加的选择船次数
        this.iTotalFreeNums = -1;         //! 总的免费次数
        this.iNewTotalFreeNums = -1;         //! 总的免费次数

        //! 逻辑
        this.bJustStart = true;

        this.iHitsNum = 0;

        this.lsthitsnum = [[1, 2, 3, 4, 5, 6], [3, 4, 5, 6, 7, 8]];
        this.lstHit = [];
        this.lstFHit = [];
        this.lstLHit = [];
        this.lstHitAni = [];
        this.lstHitSpr = [];

        this.lsthitsprname = ["newtlod_pngback08.png","newtlod_pngback09.png"];
        this.lsthitaniname = ["beishu1","beishu2","beishu3"];

        for(var ii = 0; ii < 6; ++ii) {
            var textHit = findNodeByName(this.GameHit.node, "textHit" + (ii + 1));
            var textFHit = findNodeByName(this.GameHit.node, "textFHit" + (ii + 1));
            var textLHit = findNodeByName(this.GameHit.node, "textLHit" + (ii + 1));
            var aniHit = findNodeByName(this.GameHit.node, "aniHit" + (ii + 1));
            var sprHit = findNodeByName(this.GameHit.node, "sprHit" + (ii + 1));

            aniHit.setVisible(false);

            this.lstHit.push(textHit);
            this.lstFHit.push(textFHit);
            this.lstLHit.push(textLHit);
            this.lstHitAni.push(aniHit);
            this.lstHitSpr.push(sprHit);
        }

        this.setHits(this.iHitsNum);
        this.refreshHits();

        this.scheduleUpdate();
        //this.GameCanvasMgr.refresh();

        // //! 测试
        // this.slidCoinValue = findChildByName(this, 'slidCoinValue');
        // this.slidCoinValue.addEventListener(this.onChgPercent, this);

        //! UI模块相关
        this.ModuleUI.setBet(30);
        this.ModuleUI.setLines(30);
        this.ModuleUI.setCoinValueList([1,2,4,10,20,40,100,200,500,1000]);
        this.ModuleUI.setChgCoinValueFunc(this.onChgCoinValue, this);
        this.ModuleUI.setSpinFunc(this.onTouchRun, this);

        this.restoreUserSetup();

        return ;

        // var gamelayer = ccs.load(res.TlodGameLayer_json);
        // this.addChild(gamelayer.node);
        // this.GameLayer = gamelayer;
        //
        // //! 增加menubar节点
        // this.nodeCommonMnueBar = new cc.Node();
        // this.addChild(this.nodeCommonMnueBar, 11);
        // this.MenuBarLayer = new CommonMenuBarLayer(this.name, this);
        // this.nodeCommonMnueBar.addChild(this.MenuBarLayer);
        // GameMgr.singleton.setGameMenuBar(this.MenuBarLayer);
        //
        // //this.addChild(CcsResCache.singleton.CcsRes["tlod"]._rootnode);
        //
        // this.lstscenenodename = [ "nodeGameBack", "nodeGameBack1", "nodeGameBack2", "nodeGameWheel", "nodeGameBtn" ];
        // this.lstscenenoderes = [ res.TlodGameBackNode_json, res.TlodGameBackNode1_json, res.TlodGameBackNode2_json, res.TlodGameWheelNode_json, res.TlodGameBtnNode_json ];
        // this.lstSceneNode = [];
        // this.iSceneState = -1;       //! 场景状态 0门外 1进门 2门内 3出门
        //
        // this.lstSceneFrame = [
        //     [[195,195],[195,195],[195,195],[115,116],[130,130]],
        //     [[0,50],[0,50],[0,50],[0,50],[0,50]],
        //     [[60,190],[60,190],[60,190],[115,116],[50,50]],
        //     [[200,250],[200,250],[200,250],[60,110],[60,120]],
        // ];
        //
        // this.lstSceneShow = [
        //     [true,false,false,true,true],
        //     [true,true,true,true,true],
        //     [false,true,false,true,true],
        //     [true,true,true,true,true],
        // ];
        //
        // this.lstSceneChg = [false, true, false, true];
        // this.lstSceneLoop = [false, false, true, false];
        //
        // for(var ii = 0; ii < this.lstscenenodename.length; ++ii) {
        //     var snode = findNodeByName(gamelayer.node, this.lstscenenodename[ii]);
        //     var sres = ccs.load(this.lstscenenoderes[ii]);
        //     snode.addChild(sres.node);
        //
        //     sres.node.runAction(sres.action);
        //     //sres.action.gotoFrameAndPlay(0, 79, false);
        //     //sres.action.gotoFrameAndPlay(0, sres.action.getDuration(), true);
        //
        //     this.lstSceneNode.push(sres);
        // }
        //
        // var node_run = findNodeByName(gamelayer.node, "node_run");
        // this.aniSpin = ccs.load(res.TlodSpinAni_json);
        // node_run.addChild(this.aniSpin.node);
        // this.aniSpin.node.runAction(this.aniSpin.action);
        // this.aniSpin.action.gotoFrameAndPlay(0, this.aniSpin.action.getDuration(), true);
        //
        // this.aniHua0 = findNodeByName(gamelayer.node, "ani_hua0");
        // this.aniHua1 = findNodeByName(gamelayer.node, "ani_hua1");
        // this.iHuaTime = 0;
        //
        // this.lsthuaani0 = [
        //     //[{time:0, bshow:true, ani:'hua-kai', loop:0},{time:14/24, bshow:true, ani:'hua-xunhuan', loop:-1}],
        //     [{time:0, bshow:true, ani:'hua-xunhuan', loop:-1}],
        //     [{time:0, bshow:true, ani:'hua-xunhuan', loop:-1},{time:10/24, bshow:false, ani:'hua-xunhuan', loop:-1},],
        //     [{time:0, bshow:false, ani:'hua-xunhuan', loop:-1}],
        //     [{time:0, bshow:false, ani:'hua-kai', loop:0},{time:50/24, bshow:true, ani:'hua-kai', loop:0},{time:(50 + 14) /24, bshow:true, ani:'hua-xunhuan', loop:-1}],
        // ];
        //
        // this.lsthuaani1 = [
        //     [{time:0, bshow:false, ani:'hua-xunhuan', loop:-1}],
        //     [{time:0, bshow:false, ani:'hua-kai', loop:0},{time:23/24, bshow:true, ani:'hua-kai', loop:0},{time:(23 + 14) /24, bshow:true, ani:'hua-xunhuan', loop:-1}],
        //     //[{time:0, bshow:true, ani:'hua-kai', loop:0},{time:14/24, bshow:true, ani:'hua-xunhuan', loop:-1}],
        //     [{time:0, bshow:true, ani:'hua-xunhuan', loop:-1}],
        //     [{time:0, bshow:true, ani:'hua-xunhuan', loop:-1},{time:35/24, bshow:false, ani:'hua-xunhuan', loop:-1},],
        // ];
        //
        // this.chgScene(0);
        //
        // // var nodScene = findNodeByName(gamelayer.node, "nodScene");
        // // this.nodScene = nodScene;
        // //
        // // this.lstSceneNode = [];
        // // this.lstSceneSpeed = [];
        // //
        // // this.sprChgScene = undefined;
        // // this.iChgSceneIndex = 0;
        // // this.curChgSceneTime = 0;
        // // this.allChgSceneTime = 0;
        // // this.iDestScene = -1;
        // //
        // // this.setScene(1);
        //
        // // var nodBackAni1 = findNodeByName(gamelayer.node, "nodBackAni1");
        // // var backani1 = ccs.load(res.DBZGameBackAni1_json);
        // // nodBackAni1.addChild(backani1.node);
        // // backani1.node.runAction(backani1.action);
        // // backani1.action.gotoFrameAndPlay(0, backani1.action.getDuration(), true);
        // //
        // // var nodBackAni2 = findNodeByName(gamelayer.node, "nodBackAni2");
        // // var backani2 = ccs.load(res.DBZGameBackAni2_json);
        // // nodBackAni2.addChild(backani2.node);
        // // backani2.node.runAction(backani2.action);
        // // backani2.action.gotoFrameAndPlay(0, backani2.action.getDuration(), true);
        // //
        // // var nodBackAni3 = findNodeByName(gamelayer.node, "nodBackAni3");
        // // var backani3 = ccs.load(res.DBZGameBackAni3_json);
        // // nodBackAni3.addChild(backani3.node);
        // // backani3.node.runAction(backani3.action);
        // // backani3.action.gotoFrameAndPlay(0, backani3.action.getDuration(), true);
        // //
        // // var nodeFreeBack = findNodeByName(gamelayer.node, "nodeFreeBack");
        // // var freebackani = ccs.load(res.DBZFreeBackAni_json);
        // // nodeFreeBack.addChild(freebackani.node, 10);
        // // freebackani.node.runAction(freebackani.action);
        // // freebackani.action.gotoFrameAndPlay(0, freebackani.action.getDuration(), true);
        // // this.nodeFreeBack = nodeFreeBack;
        // // this.nodeFreeBack.setVisible(false);
        //
        // //! 符号代码和图标的对应关系
        // this.lstSymbol = { WW:0, C1:1, M1:2, M2:3, M3:4, M4:5, M5:6, M6:7, M7:8, M8:9, M9:10, MT:11, ME:12 };
        // this.lstWheelDatas = [[8,11,10,9,6,7,10,11,9,8,5,11,10,9,7,11,6,10,7,9,11,5,8,6,10,4,9,7,1,8,11,9,7,5,3,11,8,6,10,4,5,8,9,11,7,3,10,6,4,2],
        //     [11,10,9,11,7,10,8,11,10,9,11,3,7,10,11,9,6,8,4,5,6,1,7,11,4,9,0,10,8,7,6,11,2,9,1,3,8,5,10,0,8,11,6,2,3,4,7,10,9,5],
        //     [8,11,5,7,10,11,6,9,2,11,9,10,1,7,8,3,11,10,4,9,6,8,10,5,6,1,7,11,4,9,0,10,8,7,6,11,2,9,1,3,8,5,10,0,9,7,2,10,3,5,4,11,8,6],
        //     [11,10,9,11,7,10,8,11,10,9,11,3,7,10,11,9,6,8,4,5,6,1,7,11,4,9,0,10,8,7,6,11,2,9,1,3,8,5,10,0,9,7,11,8,4,10,2,5,6,3],
        //     [8,11,10,9,6,7,10,11,9,8,5,11,10,9,7,11,6,10,7,9,11,5,8,6,10,4,9,7,1,8,11,9,7,5,3,11,8,6,4,10,7,2,9,3,6,5,4,11,10,8]];
        // this.lstWinSymbol = { WW:0, C1:1, M1:2, M2:3, M3:4, M4:5, M5:6, M6:7, M7:8, M8:9, M9:10, MT:11, ME:12 };
        //
        // var lsticon = [ "tlodicon0.png", "tlodicon1.png", "tlodicon2.png", "tlodicon3.png", "tlodicon4.png", "tlodicon5.png", "tlodicon6.png", "tlodicon7.png", "tlodicon7.png", "tlodicon7.png", "tlodicon7.png", "tlodicon7.png", "tlodicon12.png" ];
        // var lstexicon = [ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ];
        // var lsticonani = [ res.TlodRunAni0_json, res.TlodRunAni1_json, res.TlodRunAni2_json, res.TlodRunAni3_json, res.TlodRunAni4_json, res.TlodRunAni5_json, res.TlodRunAni6_json, res.TlodRunAni7_json, res.TlodRunAni7_json, res.TlodRunAni7_json, res.TlodRunAni7_json, res.TlodRunAni7_json, res.TlodRunAni12_json];
        // var lstdownani = [ 0, res.TlodDownAni1_json, res.TlodDownAni2_json];
        // var lstappearani = [ res.TlodAppearAni0_json, res.TlodAppearAni1_json, res.TlodAppearAni2_json];
        // //var lsticonani = undefined;
        //
        // this.lsticon = lsticon;
        // //this.lstbicon = lstbicon;
        // this.lsticonani = lsticonani;
        //
        // this.lstchgicon = [ "onepieceww0.png", "onepieceww1.png", "onepieceww2.png", "onepieceww3.png", "onepieceww4.png" ];
        // this.lstchgbicon = [ "onepiecebww0.png", "onepiecebww1.png", "onepiecebww2.png", "onepiecebww3.png", "onepiecebww4.png" ];
        // this.lstchgiconani = [ res.OnePieceRunAni13_json, res.OnePieceRunAni14_json, res.OnePieceRunAni15_json, res.OnePieceRunAni16_json, res.OnePieceRunAni17_json ];
        //
        // this.lstwheeldelay = [ 5 / 24, 6 / 24, 7 / 24, 8 / 24, 9 / 24 ];
        // this.lstwheel = [];
        //
        // for(var ii = 0; ii < 5; ++ii) {
        //     var bindex = 1;
        //
        //     var layWheel = findNodeByName(gamelayer.node, "layWheel" + (ii + 1));
        //     //var layTopWheel = findNodeByName(gamelayer.node, "layTopWheel" + (ii + 1));
        //     var wheel = new Wheel2(layWheel, lsticon, lstexicon, 3, 160, 160, 164, lstdownani, lstappearani, res.TlodDisappearAni_json, res.TlodEndAni_json, res.TlodDisappearAni_json, 8 / 24, 1 / 24 * ii, this.lstwheeldelay[ii], 1 / 24 * ii * 3);
        //     // wheel.setLogicNum(3);
        //     wheel.setSound(undefined, undefined, res.TlodDisappearWheel_mp3, 1, undefined);
        //     wheel.setIconAni(lsticonani);
        //     // wheel.setResultColor(64, 64, 64, 128);
        //     // wheel.setShowTopIcon(false);
        //     //
        //     // wheel.setLightAni(res.OnePieceLightAni1_json, res.OnePieceLightAni2_json, res.OnePieceFastWheel_mp3);
        //     //wheel.showLightAni(true);
        //
        //     // //! test
        //     // for(var jj = 0; jj < 3; ++jj) {
        //     //     var icon = Math.floor(Math.random() * 9);
        //     //
        //     //     wheel.setIcon(jj, icon);
        //     //     wheel.setNewIcon(jj, icon);
        //     // }
        //
        //     this.lstwheel.push(wheel);
        // }
        //
        // this.WheelAniTime = 1;         //! 轮子添加随机动画的时间
        //
        // this.WheelEndAni = undefined;           //! 轮子结束时候扫描动画
        // this.nodeWheelEndAni = findNodeByName(gamelayer.node, "nodeWheelEndAni");
        //
        // this.WheelBeginAni = undefined;         //! 轮子开始时灯光的动画
        // this.nodeWheelBeginAni = findNodeByName(gamelayer.node, "nodeWheelBeginAni");
        //
        // // this.lstwheel[0].setIcon(1, -1);
        // // this.lstwheel[1].setIcon(2, -1);
        // // this.lstwheel[2].setIcon(1, -1);
        // // this.lstwheel[2].setIcon(2, -1);
        // // this.lstwheel[3].setIcon(0, -1);
        // // this.lstwheel[3].setIcon(2, -1);
        // // this.lstwheel[4].setIcon(0, -1);
        // // this.lstwheel[4].setIcon(1, -1);
        // // this.lstwheel[4].setIcon(2, -1);
        //
        // this.SpinResult = [0, 0, 0, 0, 0];
        // this.bRun = false;
        // this.bCanStop = false;
        // this.bQuickStop = false;
        // this.bQuickStopTime = 0;
        //
        // this.WaitStopTime = -1;
        //
        // this.DisconnectLayer = undefined;
        // this.ErrorLayer = undefined;
        // this.bErrorPause = false;
        //
        // //! 容器相关
        // // var layAni = findNodeByName(gamelayer.node, "layAni");
        // // this.layAni = layAni;
        // //
        // // var kofani = ccs.load(res.KofAni_json);
        // //
        // // this.layAni.addChild(kofani.node);
        // // kofani.node.runAction(kofani.action);
        // // kofani.action.gotoFrameAndPlay(0, kofani.action.getDuration(), true);
        //
        // //! 按钮相关
        // var btnRun = findNodeByName(gamelayer.node, "btnRun");
        // btnRun.addTouchEventListener(this.onTouchRun, this);
        // this.btnRun = btnRun;
        //
        // var btnStop = findNodeByName(gamelayer.node, "btnStop");
        // btnStop.addTouchEventListener(this.onTouchStop, this);
        // this.btnStop = btnStop;
        // this.btnStop.setVisible(false);
        //
        // // var btnAll = findNodeByName(gamelayer.node, "btnAll");
        // // btnAll.addTouchEventListener(this.onTouchAll, this);
        // // this.btnAll = btnAll;
        //
        // var btnAuto = findNodeByName(gamelayer.node, "btnAuto");
        // btnAuto.addTouchEventListener(this.onTouchAuto, this);
        // this.btnAuto = btnAuto;
        //
        // var btnAutoStop = findNodeByName(gamelayer.node, "btnAutoStop");
        // btnAutoStop.addTouchEventListener(this.onTouchAutoStop, this);
        // this.btnAutoStop = btnAutoStop;
        //
        // var btnLeft2 = findNodeByName(gamelayer.node, "btnLeft2");
        // btnLeft2.addTouchEventListener(this.onTouchLeft2, this);
        // this.btnLeft2 = btnLeft2;
        //
        // var btnRight2 = findNodeByName(gamelayer.node, "btnRight2");
        // btnRight2.addTouchEventListener(this.onTouchRight2, this);
        // this.btnRight2 = btnRight2;
        //
        // var btnOpenSound = findNodeByName(this, "btnOpenSound");
        // btnOpenSound.addTouchEventListener(this.onTouchOpenSound, this);
        // this.btnOpenSound = btnOpenSound;
        //
        // var btnCloseSound = findNodeByName(this, "btnCloseSound");
        // btnCloseSound.addTouchEventListener(this.onTouchCloseSound, this);
        // this.btnCloseSound = btnCloseSound;
        //
        // var btnOpenEffect = findNodeByName(this, "btnOpenEffect");
        // btnOpenEffect.addTouchEventListener(this.onTouchOpenEffect, this);
        // this.btnOpenEffect = btnOpenEffect;
        //
        // var btnCloseEffect = findNodeByName(this, "btnCloseEffect");
        // btnCloseEffect.addTouchEventListener(this.onTouchCloseEffect, this);
        // this.btnCloseEffect = btnCloseEffect;
        //
        // var btnSetup = findNodeByName(this, "btnSetup");
        // btnSetup.addTouchEventListener(this.onTouchSetup, this);
        // this.btnSetup = btnSetup;
        // //this.btnSetup.setVisible(g_clienttype == 0);
        //
        // var btnClose = findNodeByName(this, "btnClose");
        // btnClose.addTouchEventListener(this.onTouchClose, this);
        // this.btnClose = btnClose;
        // this.btnClose.setVisible(g_clienttype != 0);
        //
        // var btnHelp = findNodeByName(gamelayer.node, "btnRule");
        // btnHelp.addTouchEventListener(this.onTouchHelp, this);
        // this.btnHelp = btnHelp;
        //
        // // this.lstBtnBlue = [];
        // // this.lstBtnLBlue = [];
        // // this.lstBtnGBlue = [];
        // //
        // // for(var ii = 1; ii <= 25; ++ii) {
        // //     var btnBlue = findNodeByName(gamelayer.node, "btnGBlue" + ii);
        // //     btnBlue.addTouchEventListener(this.onTouchBtnLine, this);
        // //
        // //     var btnLBlue = findNodeByName(gamelayer.node, "btnLBlue" + ii);
        // //     btnLBlue.addTouchEventListener(this.onTouchBtnLine, this);
        // //     btnLBlue.setVisible(false);
        // //
        // //     var btnGBlue = findNodeByName(gamelayer.node, "btnBlue" + ii);
        // //     btnGBlue.addTouchEventListener(this.onTouchBtnLine, this);
        // //
        // //     this.lstBtnBlue.push(btnBlue);
        // //     this.lstBtnLBlue.push(btnLBlue);
        // //     this.lstBtnGBlue.push(btnGBlue);
        // // }
        //
        // //! 文字
        // var textWin = findNodeByName(gamelayer.node, "textWin");
        // textWin.setString("0");
        // this.textWin = textWin;
        //
        // var textAllBet = findNodeByName(gamelayer.node, "textAllBet");
        // textAllBet.setString("0");
        // this.textAllBet = textAllBet;
        //
        // var textBet = findNodeByName(gamelayer.node, "textBet");
        // textBet.setString("0");
        // this.textBet = textBet;
        // this.BetX = textBet.getPositionX();
        //
        // // var textLine = findNodeByName(gamelayer.node, "textLine");
        // // textLine.setString("1");
        // // this.textLine = textLine;
        // // this.LineX = textLine.getPositionX();
        //
        // var textMoney = findNodeByName(this, "textMoney");
        // textMoney.setString("0");
        // this.textMoney = textMoney;
        //
        // var textAutoNum = findNodeByName(gamelayer.node, "textAutoNum");
        // textAutoNum.setString("000");
        // textAutoNum.setVisible(false);
        // this.textAutoNum = textAutoNum;
        //
        // var textName = findNodeByName(this, "textName");
        // var tname = textName.getFontName();
        // textName.setFontName("Microsoft YaHei");
        // textName.setString(GameMgr.singleton.myInfo.nickname);
        // //textName.setString("樱木花道的哥哥樱木花道的哥哥");
        // this.textName = textName;
        //
        // if(GameMgr.singleton.userbaseinfo != undefined && GameMgr.singleton.userbaseinfo.currency != undefined) {
        //     for(var ii = 1; ; ++ii) {
        //         var textGameCurrency = findNodeByName(this, "textGameCurrency" + ii);
        //
        //         if(textGameCurrency == undefined || textGameCurrency == null)
        //             break;
        //
        //         textGameCurrency.setString("(" + GameMgr.singleton.userbaseinfo.currency + ")");
        //     }
        // }
        //
        // //! 图片
        // var sprAutoNum = findNodeByName(gamelayer.node, "sprAutoNum");
        // sprAutoNum.setVisible(false);
        // this.sprAutoNum = sprAutoNum;
        //
        // // var sprRocker = gamelayer.node.getChildByName("sprRocker");
        // // this.sprRocker = sprRocker;
        // // this.iRockerTime = 0;
        //
        // // this.lstSprLine = [];
        // // this.ShowLineTime = 0;
        // // this.ShowLineFunc = undefined;
        // //
        // // for(var ii = 1; ii <= 25; ++ii) {
        // //     var sprLine = gamelayer.node.getChildByName("nodeLine" + ii);
        // //     sprLine.setVisible(false);
        // //     this.lstSprLine.push(sprLine);
        // // }
        //
        // //! 分数相关的逻辑
        // this.iMyMoney = undefined;
        // this.iNewMoney = undefined;
        // this.iShowMoney = 0;
        // this.iBet = 0;
        // this.iLine = 30;
        // this.iTimes = 1;
        // this.iWin = 0;
        // this.iNewWin = 0;
        // this.lstBet = [1,2,4,10,20,40,100,200,500,1000];
        // this.bAutoRun = false;
        // this.iAutoNum = 0;
        // this.WaitAutoTime = 0;
        // this.DisRunTime = 0;
        //
        // this.iAutoLoss = 0;
        // this.iAutoWin = 0;
        //
        // this.bShowResult = false;
        // this.iShowResultIndex = 0;
        // this.ShowResultTime = 0;
        //
        // this.bGameInfoDouble = false;
        // this.bCanDouble = false;
        // this.bCanOpenBox = false;
        // this.WaitOpenBoxTime = 0;
        //
        // //! 胜利动画
        // this.lstWinAni = [ res.TlodWinAni1_json, res.TlodWinAni2_json, res.TlodWinAni3_json, res.TlodWinAni4_json ];
        // //this.lstWinAni = [ ];
        // this.lstWinAniTime = [ 24 / 24, 60 / 24, 60 / 24, 60 / 24 ];
        // this.lstAniGoldNum = [ 15, 30, 40, 50 ];
        // this.lstAniGoldIndex = [ 26, 48, 48, 57 ];
        //
        // //this.lstWinAni = [];
        // this.WinAni = undefined;
        // this.WinAni2 = undefined;
        // // this.WinAni5 = undefined;
        // // this.WinAni6 = undefined;
        // this.lstWaitWinAni = [];
        //
        // var sprHero = gamelayer.node.getChildByName("sprHero");
        // this.sprHero = sprHero;
        //
        // var sprDarts = gamelayer.node.getChildByName("sprDarts");
        // this.sprDarts = sprDarts;
        // this.iDartsTime = 0;
        // this.iDartsRotation = 0;
        //
        // this.BtnScale = [ 1, 1.05];
        // this.BtnScaleTime = [ 1, 0.5 ];
        // this.BtnAniTime = 0;
        //
        // //! 飞镖动画
        // this.lstDartsNode = [];
        //
        // for(var ii = 0; ii < 5; ++ii) {
        //     var nodDartsAni = gamelayer.node.getChildByName("nodDartsAni" + ( ii + 1));
        //     this.lstDartsNode.push(nodDartsAni);
        // }
        //
        // this.lstWaitDartsAni = [];
        // this.lstPlayDartsAni = [];
        //
        // //! 金币动画
        // this.lstGoldAni = [];
        //
        // //! 免费游戏相关
        // // var sprFreeRunBack = findNodeByName(gamelayer.node, "sprFreeRunBack");
        // // //var sprFreeRunBack = gamelayer.node.getChildByName("sprFreeRunBack");
        // // sprFreeRunBack.setVisible(false);
        // // this.sprFreeRunBack = sprFreeRunBack;
        // //
        // var textFreeNum = findNodeByName(gamelayer.node, "txt_freegame");
        // this.textFreeNum = textFreeNum;
        //
        // var textFreeAll = findNodeByName(gamelayer.node, "textFreeAll");
        // this.textFreeAll = textFreeAll;
        //
        // //
        // // var sprFreeIcon = findNodeByName(gamelayer.node, "sprFreeIcon");
        // // this.sprFreeIcon = sprFreeIcon;
        // //
        // // var sprFreeMul = findNodeByName(gamelayer.node, "sprFreeMul");
        // // this.sprFreeMul = sprFreeMul;
        // //
        // // var textFreeMul = findNodeByName(gamelayer.node, "textFreeMul");
        // // this.textFreeMul = textFreeMul;
        // //
        // // var sprFreeAdd = findNodeByName(gamelayer.node, "sprFreeAdd");
        // // this.sprFreeAdd = sprFreeAdd;
        // //
        // // var textFreeAdd = findNodeByName(gamelayer.node, "textFreeAdd");
        // // this.textFreeAdd = textFreeAdd;
        //
        // this.bFreeGame = false;     //! 是否在免费游戏中
        // this.iFreeNums = -1;         //! 免费次数
        // this.iNewFreeNums = 0;         //! 免费次数
        // this.iFreeMul = 0;          //! 免费倍数
        // this.iFreeAll = -1;          //! 免费赢的金额
        // this.iNewFreeAll = 0;          //! 免费赢的金额
        // this.iFreeBeginWin = 0;     //! 免费游戏之前赢得的金额
        // this.iFreeType = -1;          //! 免费游戏的类型
        // this.iFreeAdd = 0;          //! 增加的选择船次数
        // this.iTotalFreeNums = -1;         //! 总的免费次数
        // this.iNewTotalFreeNums = -1;         //! 总的免费次数
        //
        // //! 音乐音效相关
        // this.lstMusic = [res.TlodMusci1_mp3, res.TlodMusci2_mp3, res.TlodMusci3_mp3];
        // this.lstWinEffect = [res.TlodEffWin1_mp3, res.TlodEffWin2_mp3, res.TlodEffWin3_mp3, res.TlodEffWin4_mp3];
        // this.lstWinEffectTime = [2,2,4,3];
        // this.lstFightSound = [res.DBZFight1_mp3, res.DBZFight2_mp3, res.DBZFight3_mp3];
        //
        // this.lstWaitMusic = [];
        // this.lstWaitWinEfect = [];
        // this.bPlayFreeMusic = false;
        //
        // this.WinEffectTime = 0;
        // this.bPlayKO = false;
        // this.bStopMusic = false;
        //
        // this.bInitMusic = false;
        //
        // this.SoundValue = 1;
        // this.ChgSValueTime = 0;
        //
        // //cc.sys.isMobile = true;
        // if(GameAssistant.singleton.isShowSoundTips()) {
        //     this.setPlaySound(false);
        //
        //     // var layer = new TlodSoundTipsLayer(this);
        //     // this.addChild(layer, 1);
        //     this.MenuBarLayer.showSoundTips();
        // }
        // else {
        //     this.setPlaySound(true);
        // }
        //
        // this.setPlayEffect(true);
        //
        // this.restoreUserSetup();
        //
        // this.refreshInfo();
        // this.refreshFreeInfo();
        // this.scheduleUpdate();
        //
        // this.lstHelp = []
        //
        // var helplayer1 = new TlodHelpLayer1(this);
        // this.addChild(helplayer1, 2);
        // //this.helpLayer1 = helplayer1;
        // this.lstHelp.push(helplayer1);
        //
        // var helplayer2 = new TlodHelpLayer2(this);
        // this.addChild(helplayer2, 2);
        // //this.helpLayer2 = helplayer2;
        // this.lstHelp.push(helplayer2);
        //
        // var helplayer3 = new TlodHelpLayer3(this);
        //
        // if(helplayer3.bInit) {
        //     this.addChild(helplayer3, 2);
        //     //this.helpLayer3 = helplayer3;
        //     this.lstHelp.push(helplayer3);
        // }
        //
        // var helplayer4 = new TlodHelpLayer4(this);
        //
        // if(helplayer4.bInit) {
        //     this.addChild(helplayer4, 2);
        //     //this.helpLayer4 = helplayer4;
        //     this.lstHelp.push(helplayer4);
        // }
        //
        // var helplayer5 = new TlodHelpLayer5(this);
        //
        // if(helplayer5.bInit) {
        //     this.addChild(helplayer5, 2);
        //     //this.helpLayer4 = helplayer4;
        //     this.lstHelp.push(helplayer5);
        // }
        //
        // this.showHelp(0);
        //
        // this.bJustStart = true;
        // this.bNewIcon = false;      //! 是否收到了新的图标
        // this.NewGameModuleInfo = undefined;
        //
        // this.bPasueWheel = false;
        //
        // this.AddFreeAni = undefined;
        // this.HitsAni = undefined;
        // this.iHitsNum = 0;
        //
        // this.lsthitsnum = [[1, 2, 3, 4, 5, 6], [3, 4, 5, 6, 7, 8]];
        // this.lstHits = [];
        // this.lstLHits = [];
        // this.lstHitsAni = [];
        // this.lstHHitsAni = [];
        // this.lstFHits = [];
        //
        // this.lsthitsname = [['xuanze1_xia', 'xuanze1_shang'], ['xuanze2_xia', 'xuanze2_shang']];
        //
        // for(var ii = 0; ; ++ii) {
        //     var textHits = findNodeByName(gamelayer.node, "textHits" + (ii + 1));
        //     var textLHits = findNodeByName(gamelayer.node, "textLHits" + (ii + 1));
        //     var aniHits = findNodeByName(gamelayer.node, "ani_sx" + (ii + 1));
        //     var aniHHits = findNodeByName(gamelayer.node, "ani_hsx" + (ii + 1));
        //
        //     if(textHits == undefined || textHits == null)
        //         break;
        //
        //     this.lstHits.push(textHits);
        //     this.lstLHits.push(textLHits);
        //     this.lstHitsAni.push(aniHits);
        //     this.lstHHitsAni.push(aniHHits);
        //
        //     var textFHits = findNodeByName(gamelayer.node, "textFHits" + (ii + 1));
        //
        //     if(textFHits != undefined && textFHits != null)
        //         this.lstFHits.push(textFHits);
        // }
        //
        // this.setHits(this.iHitsNum);
        // this.refreshHits();
        //
        // this.nodeRecord = findNodeByName(gamelayer.node, "nodeRecord");
        //
        // var btnOpenHis = findNodeByName(gamelayer.node, "btnOpenHis");
        // btnOpenHis.addTouchEventListener(this.onTouchOpenHis, this);
        // this.btnOpenHis = btnOpenHis;
        //
        // var btnCloseHis = findNodeByName(gamelayer.node, "btnCloseHis");
        // btnCloseHis.addTouchEventListener(this.onTouchCloseHis, this);
        // this.btnCloseHis = btnCloseHis;
        // this.btnCloseHis.setVisible(false);
        //
        // this.lstTextRecord = [];
        // this.lstRecordNum = [];
        // this.lstRecordHits = [];
        // this.iTotalWin = 0;
        //
        // for(var ii = 0; ; ++ii) {
        //     var textRecord = findNodeByName(gamelayer.node, "textRecord" + (ii + 1));
        //
        //     if(textRecord == undefined)
        //         break;
        //
        //     this.lstTextRecord.push(textRecord);
        // }
        //
        // //this.clearHis();
        // this.refreshHis();
        //
        // //! 战斗动画相关
        // this.lstFightAni = [
        //     [res.DBZFightAni1_json],
        //     [res.DBZFightAni2_json],
        //     [res.DBZFightAni3_json, res.DBZFightAni4_json, res.DBZFightAni5_json, res.DBZFightAni6_json],
        //     [res.DBZFightAni7_json],
        //     [res.DBZFightAni8_json],
        //     [res.DBZFightAni9_json],
        //     [res.DBZFightAni10_json],
        //     [res.DBZFightAni11_json, res.DBZFightAni12_json, res.DBZFightAni13_json, res.DBZFightAni14_json],
        //     [res.DBZFightAni15_json],
        //     [res.DBZFightAni16_json],
        //     [res.DBZFightAni17_json, res.DBZFightAni18_json, res.DBZFightAni19_json],
        //     [res.DBZFightAni20_json],
        //     [res.DBZFightAni21_json],
        //     [res.DBZFightAni22_json, res.DBZFightAni23_json, res.DBZFightAni24_json],
        //     [res.DBZFightAni25_json],
        //     [res.DBZFightAni26_json],
        // ];
        //
        // this.lstFightLoop = [true, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false];
        //
        // this.iCurFightState = -1;        //! 0待机 1进战斗 2战斗中 3离开战斗 4进入免费 5超级待机 6超级进战斗 7超级战斗中 8超级离开战斗 9进战斗2 10战斗中2 11离开战斗2 12超级进战斗2 13超级战斗中2 14超级离开战斗2 15离开免费
        // this.iCurFightIndex = 0;
        // this.iDestFightState = -1;
        // this.iFightNum = 0;
        //
        // var nodeFightAni = findNodeByName(gamelayer.node, "nodeFightAni");
        // this.nodeFightAni = nodeFightAni;
        // this.FightAni = undefined;
        //
        // this.setFightState(0);
        //
        // // //! 测试
        // // var sprfish = new cc.Sprite();
        // //
        // // var frame = cc.spriteFrameCache.getSpriteFrame("dbzbtn14_1.png");
        // // sprfish.setSpriteFrame(frame);
        // // this.addChild(sprfish, 100);
        // //
        // // this.testbeizer = new BezierObj(sprfish, 0, 0, 100);
        // // this.testbeizer.addPoint(600, 600, 200, 0, 400, 0);
        // // this.testbeizer.addPoint(0, 300, 400, 800, 200, 600);
        // // this.testbeizer.addPoint(1000, 0, 400, 100, 600, 0);
        //
        // //! 增加jackpot节点
        // this.nodeCommonJackpot = new cc.Node();
        // this.addChild(this.nodeCommonJackpot, 10);

        return true;
    },

    setRun : function (brun) {
        this.bRun = brun;
        this.ModuleUI.setRun(brun);
    },

    // onChgPercent : function () {
    //     var percent = this.slidCoinValue.getPercent();
    //     var num = 20;
    //     var spnum = (num - 1) * 2;
    //     var sp = 100 / spnum;
    //     var ci = Math.floor(percent / sp);
    //
    //     if(ci <= 0)
    //         this.slidCoinValue.setPercent(0);
    //     else if(ci >= spnum - 1)
    //         this.slidCoinValue.setPercent(100);
    //     else
    //         this.slidCoinValue.setPercent(sp * 2 * Math.floor((ci + 1)/ 2));
    // },

    //! 恢复之前记录的属性
    restoreUserSetup : function () {
        var soundopen = GameAssistant.singleton.getMusicType("tlod");
        var effectopen = GameAssistant.singleton.getEffectType("tlod");

        if(soundopen) {
            soundopen = parseInt(soundopen);

            if(!GameAssistant.singleton.isShowSoundTips() || soundopen != 1)
                this.setPlaySound(soundopen == 1);
        }

        if(effectopen) {
            effectopen = parseInt(effectopen);

            this.setPlayEffect(effectopen == 1);
        }

        var userbet = cc.sys.localStorage.getItem(this.name + "userbet");
        //var userline = cc.sys.localStorage.getItem("onepieceuserline");

        if(userbet) {
            userbet = parseInt(userbet);

            if(userbet < 0)
                userbet = 0;

            if(userbet >= this.lstBet.length)
                userbet = this.lstBet.length - 1;

            this.iBet = userbet;
        }

        // if(userline != undefined) {
        //     userline = parseInt(userline);
        //
        //     if(userline < 1)
        //         userline = 1;
        //
        //     if(userline > 25)
        //         userline = 25;
        //
        //     this.iLine = userline;
        // }

        // this.iBet = 0;
        // this.iLine = 1;

        this.restoreBetNum();

        var coinvalue = cc.sys.localStorage.getItem(this.name + 'coinvalue');

        //if(coinvalue)
        //    this.ModuleUI.setCoinValue(coinvalue);

        this.ModuleUI.setCoinValue(coinvalue);
    },

    onChgCoinValue : function (value) {
        this.setUserSetup('coinvalue', value);
    },

    //! 记录用户设置
    setUserSetup : function (sname, snum) {
        cc.sys.localStorage.setItem(this.name + sname, snum);
    },

    //! 收到下注列表
    onBetList : function (lst) {
        if(lst == undefined || lst.length <= 0)
            return ;

        this.lstBet = lst;

        if(this.lstBet.length == 1) {
            this.iBet = 0;
            this.iBetNum = this.lstBet[0];
        }
        else {
            this.iBet = -1;

            for(var ii = 0; ii < this.lstBet.length; ++ii) {
                if(this.iBetNum > this.lstBet[ii])
                    continue ;

                if(this.iBetNum == this.lstBet[ii]) {
                    this.iBet = ii;
                }
                else {
                    this.iBet = ii - 1;

                    if(this.iBet < 0)
                        this.iBet = 0;

                    this.iBetNum = this.lstBet[this.iBet];
                }

                break;
            }

            if(this.iBet < 0) {
                this.iBet = this.lstBet.length - 1;
                this.iBetNum = this.lstBet[this.iBet];
            }
        }

        this.setUserSetup('userbet', this.iBet);
        this.saveBetNum();

        this.refreshInfo();

        if(this.ModuleUI) {
            this.ModuleUI.setCoinValueList(lst);
        }
    },

    //! 恢复之前记录下注值
    restoreBetNum : function () {
        this.iBetNum = 0;

        var betnum = cc.sys.localStorage.getItem(this.name + 'betnum');

        if(betnum) {
            betnum = parseInt(betnum);
            this.iBetNum = betnum;
        }

        if(this.iBetNum <= 0) {
            this.iBetNum = this.lstBet[this.iBet];
        }
    },

    //! 记录下注值
    saveBetNum : function () {
        this.iBetNum = this.lstBet[this.iBet];
        this.setUserSetup('betnum', this.iBetNum);
    },

    update : function(dt) {
        if(this.InfoLayer != undefined)
            return;

        this.ModuleUI.update(dt);
        this.GameCanvasMgr.update(dt);
        //this.GameCanvasMgr.refresh();

        if(this.bWaitAppearTime != undefined && this.bWaitAppearTime) {
            this.bWaitAppearTime = false;

            for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                this.lstwheel[ii].appearIcon();
            }
        }

        this.update_Wheel(dt);
        this.update_Scene(dt);
        this.update_Hits(dt);

        this.update_ShowMoney(dt);

        if(this.WaitAutoTime > 0) {
            //! 如果在小游戏中，则不自动开始游戏
            if(!this.bErrorPause && !this.bRun && this.DoubleLayer == undefined  && !this.GameScene.isSceneChging() && this.BoxLayer == undefined && !this.bCanOpenBox) {
                this.WaitAutoTime -= dt;

                if(this.WaitAutoTime <= 0) {
                    this.WaitAutoTime = 0;
                    this.beginAuto();
                }
            }
        }

        return;

        // //! 测试
        // this.testbeizer.update(dt);

        if(GameMgr.singleton.isPauseGame())
            return ;

        if(this.bWaitAppearTime != undefined && this.bWaitAppearTime) {
            this.bWaitAppearTime = false;

            for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                this.lstwheel[ii].appearIcon();
            }
        }

        this.update_Wheel(dt);
        this.update_Scene(dt);
        this.update_Fight(dt);

        if(this.bInitMusic && !this.bStopMusic && !cc.audioEngine.isMusicPlaying()) {
            this.playOneMusic();
        }

        this.update_WinEffect(dt);
        this.update_ShowMoney(dt);
        this.update_Rocker(dt);

        this.update_Line(dt);
        this.update_ShowResult(dt);

        this.update_Ani(dt);
        //this.update_ScreenAni(dt);

        if(this.WaitOpenBoxTime > 0) {
            this.WaitOpenBoxTime -= dt;

            if(this.WaitOpenBoxTime <= 0) {
                this.WaitOpenBoxTime = 0;

                if(this.bCanOpenBox) {
                    this.openBoxGame();
                    this.bCanOpenBox = false;
                }
            }
        }

        if(this.bQuickStopTime > 0) {
            this.bQuickStopTime -= dt;

            if(this.bQuickStopTime <= 0)
                this.refreshInfo();
        }

        if(this.WaitAutoTime > 0) {
            //! 如果在小游戏中，则不自动开始游戏
            if(!this.bErrorPause && !this.bRun && this.DoubleLayer == undefined  && (this.iSceneState == 0 || this.iSceneState == 2) && this.BoxLayer == undefined && !this.bCanOpenBox) {
                this.WaitAutoTime -= dt;

                if(this.WaitAutoTime <= 0) {
                    this.WaitAutoTime = 0;
                    this.beginAuto();
                }
            }
        }

        if(this.DisRunTime > 0) {
            this.DisRunTime -= dt;

            if(this.DisRunTime <= 0) {
                this.DisRunTime = 0;
                this.refreshInfo();
            }
        }

        // if(this.WinAni2 != undefined) {
        //     if(this.WinAni2.action.getCurrentFrame() == this.WinAni2.action.getDuration()) {
        //         this.WinAni2.node.stopAllActions();
        //         this.GameLayer.node.removeChild(this.WinAni2.node);
        //         this.WinAni2 = undefined;
        //
        //         if(!this.bFreeGame && !this.bAutoRun && this.bGameInfoDouble) {
        //             this.bGameInfoDouble = false;
        //             this.bCanDouble = true;
        //
        //             this.refreshInfo();
        //         }
        //
        //         // this.WinAni5.node.stopAllActions();
        //         // this.GameLayer.node.removeChild(this.WinAni5.node);
        //         // this.WinAni5 = undefined;
        //         //
        //         // if(this.WinAni6 != undefined) {
        //         //     this.WinAni6.node.stopAllActions();
        //         //     this.GameLayer.node.removeChild(this.WinAni6.node);
        //         //     this.WinAni6 = undefined;
        //         // }
        //
        //         //this.showAllResult();
        //     }
        // }

        if(this.TransAni != undefined) {
            if(this.TransAni.action.getCurrentFrame() == this.TransAni.action.getDuration()) {
                this.TransAni.node.stopAllActions();
                this.GameLayer.node.removeChild(this.TransAni.node);
                this.TransAni = undefined;
            }
        }

        this.update_WinAni(dt);

        // for(var ii = 0; ii < this.lstwheel.length; ++ii) {
        //     this.lstwheel[ii].update(dt);
        // }
        //
        // if(this.bRun && this.bCanStop) {
        //     var allstop = true;
        //
        //     for(var ii = 0; ii < this.lstwheel.length; ++ii) {
        //         if(this.lstwheel[ii].bRun) {
        //             allstop = false;
        //             break;
        //         }
        //         else if(ii + 1 < this.lstwheel.length) {
        //             if(!this.lstwheel[ii + 1].bStoping) {
        //                 if(this.canLight(ii + 1)) {
        //                     this.lstwheel[ii + 1].RunTime = 1;
        //                     this.lstwheel[ii + 1].showLightAni(true);
        //                     this.lstwheel[ii + 1].stop_index(this.SpinResult[ii + 1]);
        //                 }
        //                 else {
        //                     //this.lstwheel[ii + 1].RunTime = 0.2;
        //                     this.lstwheel[ii + 1].RunTime = 0;
        //                     this.lstwheel[ii + 1].stop_index(this.SpinResult[ii + 1]);
        //                 }
        //                 this.addDartsAni(ii + 1, 0);
        //             }
        //         }
        //     }
        //
        //     if(allstop) {
        //         if(this.WaitStopTime < 0) {
        //             this.WaitStopTime = 0.2;
        //         }
        //         else {
        //             this.WaitStopTime -= dt;
        //
        //             if(this.WaitStopTime <= 0) {
        //                 this.WaitStopTime = 0;
        //
        //                 this.bRun = false;
        //
        //                 var oldmoney = this.iMyMoney;
        //
        //                 if(this.iNewMoney != undefined) {
        //                     this.iMyMoney = this.iNewMoney;
        //                     this.iNewMoney = undefined;
        //                 }
        //                 else {
        //                     this.iMyMoney += this.SpinWin;
        //                 }
        //
        //                 this.iWin = this.SpinWin;
        //                 this.iFreeNums = this.iNewFreeNums;
        //                 this.iFreeAll = this.iNewFreeAll;
        //                 this.iNewFreeNums = 0;
        //
        //                 if(this.iWin <= 0) {
        //                     this.setAniState(3);
        //                     this.SpriteInfoTime = 3;
        //                     this.bCanDouble = false;
        //
        //                     if(this.bCanOpenBox) {
        //                         this.WaitOpenBoxTime = 1;
        //                     }
        //                 }
        //                 else {
        //                     this.showWinAni(true, oldmoney);
        //                     this.setAniState(2);
        //                     this.SpriteInfoTime = 0;
        //
        //                     if(this.bCanOpenBox) {
        //                         this.WaitOpenBoxTime = 1.5 + 2;
        //                     }
        //                 }
        //
        //                 if(this.bAutoRun) {
        //                     if(this.iWin <= 0)
        //                         this.WaitAutoTime = 1;
        //                     else
        //                         this.WaitAutoTime = 1.8 + 2 + 1;
        //
        //                     if(this.bFreeGame) {
        //                         if(this.iWin <= 0)
        //                             this.WaitAutoTime = 0.5;
        //                         else
        //                             this.WaitAutoTime = 0.8 + 2 + 1;
        //                     }
        //
        //                     if(this.ErrorLayer != undefined)
        //                         this.WaitAutoTime += 3;
        //                 }
        //                 else {
        //                     if(this.iWin <= 0)
        //                         this.DisRunTime = 0;
        //                     else
        //                         this.DisRunTime = 2 + 1;
        //                 }
        //
        //                 this.refreshInfo();
        //             }
        //         }
        //     }
        // }
    },

    //! 更新显示的钱
    update_ShowMoney :function(dt) {
        if(this.iMyMoney == undefined)
            return ;

        if(this.iShowMoney == this.iMyMoney)
            return ;

        this.ShowMoneyTime += dt;

        this.ShowMoneyTime = 0;

        if(Math.abs(this.iShowMoney - this.iMyMoney) < 10) {
            this.iShowMoney = this.iMyMoney;
        }
        else {
            var chgm = Math.floor(Math.abs(this.iShowMoney - this.iMyMoney) / 2);

            if(chgm <= 0){
                this.iShowMoney = this.iMyMoney;
            }
            else if(this.iShowMoney > this.iMyMoney) {
                this.iShowMoney -= chgm;
            }
            else {
                this.iShowMoney += chgm;
            }
        }

        this.textMoney.setString(this.chgString_Gray1(this.iShowMoney, 20));
    },

    refreshShowMoney : function (binit) {
        if(binit) {
            this.iShowMoney = this.iMyMoney;
            this.textMoney.setString(this.chgString_Gray1(this.iShowMoney, 20));
        }
        else {
            if(this.iNewMoney != undefined) {
                this.setMyMoney_auto(this.iNewMoney);
                this.iNewMoney = undefined;
            }
        }
    },

    refreshInfo : function () {
        if(this.btnAutoStop == undefined)
            return ;

        if(this.bAutoRun) {
            this.btnAutoStop.setVisible(true);
            this.btnAutoStop.setEnabled(true);
            this.btnAutoStop.setBright(true);
            this.btnAuto.setVisible(false);
        }
        else {
            this.btnAutoStop.setVisible(false);
            this.btnAutoStop.setEnabled(true);
            this.btnAutoStop.setBright(true);
            this.btnAuto.setVisible(true);
        }

        if(this.bRun) {
            if(this.bQuickStop) {
                //this.btnStop.setVisible(false);
                //this.btnRun.setVisible(true);
            }
            else {
                //this.btnStop.setVisible(true);
                //this.btnRun.setVisible(false);

                if(this.bCanStop && this.bQuickStopTime <= 0) {
                    //this.btnStop.setEnabled(true);
                    //this.btnStop.setBright(true);
                }
                else {
                    //this.btnStop.setEnabled(false);
                    //this.btnStop.setBright(false);
                }
            }
        }
        else {
            //this.btnStop.setVisible(false);
            //this.btnRun.setVisible(true);
        }

        if(this.bAutoRun && !this.bFreeGame) {
            if(this.sprAutoNum != undefined && this.sprAutoNum != null)
                this.sprAutoNum.setVisible(true);

            this.textAutoNum.setVisible(true);
            //this.textAutoNum.setString(this.iAutoNum.toString());
            this.textAutoNum.setString(this.chgString_Gray(this.iAutoNum, 3));
        }
        else {
            if(this.sprAutoNum != undefined && this.sprAutoNum != null)
                this.sprAutoNum.setVisible(false);

            this.textAutoNum.setVisible(false);
        }

        if(this.bAutoRun || this.bRun || this.DisRunTime > 0) {
            // this.btnAll.setEnabled(false);
            // this.btnAll.setBright(false);

            this.btnAuto.setEnabled(false);
            this.btnAuto.setBright(false);
        }
        else {
            // this.btnAll.setEnabled(true);
            // this.btnAll.setBright(true);

            this.btnAuto.setEnabled(true);
            this.btnAuto.setBright(true);
        }

        var bnum = this.lstBet[this.iBet];
        var allbnum = bnum * this.iLine;

        this.textAllBet.setString(this.chgString(allbnum));

        if(this.textBet != undefined && this.textBet != null)
            this.textBet.setString(this.chgString(bnum));

        if(this.textLine != undefined && this.textLine != null)
            this.textLine.setString(this.iLine.toString());

        this.textWin.setString(this.chgString(this.iWin));
        //this.textWin.setString(this.chgString_Gray1(this.iWin, 7));

        // //! 修正位置……
        // if(this.iBet == 0)
        //     this.textBet.setPositionX(this.BetX + 5);
        // else
        //     this.textBet.setPositionX(this.BetX);
        //
        // if(this.iLine == 1)
        //     this.textLine.setPositionX(this.LineX + 5);
        // else
        //     this.textLine.setPositionX(this.LineX);

        if(this.bAutoRun || this.bRun) {
            // this.btnLeft1.setEnabled(false);
            // this.btnLeft1.setBright(false);
            // this.btnRight1.setEnabled(false);
            // this.btnRight1.setBright(false);

            // this.btnLeft2.setEnabled(false);
            // this.btnLeft2.setBright(false);
            // this.btnRight2.setEnabled(false);
            // this.btnRight2.setBright(false);
            // this.btnMaxBet.setEnabled(false);
            // this.btnMaxBet.setBright(false);
        }
        else {
            // if(this.iLine == 1) {
            //     this.btnLeft1.setEnabled(false);
            //     this.btnLeft1.setBright(false);
            // }
            // else {
            //     this.btnLeft1.setEnabled(true);
            //     this.btnLeft1.setBright(true);
            // }
            //
            // if(this.iLine == 25) {
            //     this.btnRight1.setEnabled(false);
            //     this.btnRight1.setBright(false);
            // }
            // else {
            //     this.btnRight1.setEnabled(true);
            //     this.btnRight1.setBright(true);
            // }

            // if(this.iBet == 0) {
            //     this.btnLeft2.setEnabled(false);
            //     this.btnLeft2.setBright(false);
            // }
            // else {
            //     this.btnLeft2.setEnabled(true);
            //     this.btnLeft2.setBright(true);
            // }

            if(this.iBet == this.lstBet.length - 1) {
                // this.btnRight2.setEnabled(false);
                // this.btnRight2.setBright(false);
                // this.btnMaxBet.setEnabled(false);
                // this.btnMaxBet.setBright(false);
            }
            else {
                // this.btnRight2.setEnabled(true);
                // this.btnRight2.setBright(true);
                // this.btnMaxBet.setEnabled(true);
                // this.btnMaxBet.setBright(true);
            }
        }

        if(!this.bAutoRun) {
            if (/*allbnum > this.iMyMoney || */this.DisRunTime > 0 || this.bRun) {
                // this.btnRun.setEnabled(false);
                // this.btnRun.setBright(false);
            }
            else {
                // this.btnRun.setEnabled(true);
                // this.btnRun.setBright(true);
            }
        }
        else {
            // this.btnRun.setEnabled(false);
            // this.btnRun.setBright(false);
        }

        if(!this.bAutoRun && !this.bRun) {
            if (this.DisRunTime > 0 || allbnum > this.iMyMoney) {
                this.btnAuto.setEnabled(false);
                this.btnAuto.setBright(false);
            }
            else {
                this.btnAuto.setEnabled(true);
                this.btnAuto.setBright(true);
            }
        }

        // for(var ii = 0; ii < 25; ++ii) {
        //     if(ii < this.iLine) {
        //         this.lstBtnBlue[ii].setVisible(true);
        //         this.lstBtnGBlue[ii].setVisible(false);
        //     }
        //     else {
        //         this.lstBtnBlue[ii].setVisible(false);
        //         this.lstBtnGBlue[ii].setVisible(true);
        //     }
        //
        //     if(this.bAutoRun || this.bRun) {
        //         this.lstBtnBlue[ii].setEnabled(false);
        //         this.lstBtnBlue[ii].setBright(false);
        //
        //         this.lstBtnLBlue[ii].setEnabled(false);
        //         this.lstBtnLBlue[ii].setBright(false);
        //
        //         this.lstBtnGBlue[ii].setEnabled(false);
        //         this.lstBtnGBlue[ii].setBright(false);
        //     }
        //     else {
        //         this.lstBtnBlue[ii].setEnabled(true);
        //         this.lstBtnBlue[ii].setBright(true);
        //
        //         this.lstBtnLBlue[ii].setEnabled(true);
        //         this.lstBtnLBlue[ii].setBright(true);
        //
        //         this.lstBtnGBlue[ii].setEnabled(true);
        //         this.lstBtnGBlue[ii].setBright(true);
        //     }
        // }

        // if(this.bCanDouble) {
        //     this.btnDouble.setEnabled(true);
        //     this.btnDouble.setBright(true);
        //     this.nodBtnAni3.setVisible(true);
        // }
        // else {
        //     this.btnDouble.setEnabled(false);
        //     this.btnDouble.setBright(false);
        //     this.nodBtnAni3.setVisible(false);
        // }

        // if(this.btnRun.isVisible() || !this.btnStop.isEnabled()) {
        //     this.nodBtnAni1.setVisible(true);
        //     this.nodBtnAni2.setVisible(false);
        // }
        // else {
        //     this.nodBtnAni1.setVisible(false);
        //     this.nodBtnAni2.setVisible(true);
        // }

        if(this.bFreeGame) {
            if(this.sprFreeRunBack != undefined && this.sprFreeRunBack != null)
                this.sprFreeRunBack.setVisible(true);

            if(this.textFreeNum != undefined && this.textFreeNum != null) {
                // if(this.iFreeNums >= 0)
                //     this.textFreeNum.setString(this.iFreeNums.toString());
                // else
                //     this.textFreeNum.setString("");

                this.textFreeNum.setString(this.iFreeNums.toString());
            }

            if(this.textTotalWin != undefined && this.textTotalWin != null) {
                if(this.iFreeAll >= 0)
                    this.textTotalWin.setString(this.chgString(this.iFreeAll));
                else
                    this.textTotalWin.setString("0");
            }

            //this.textFreeNum.setString(this.iFreeNums.toString());
            //this.textFreeMul.setString("X" + this.iFreeMul);
            //this.textFreeAll.setString("￥" + this.chgString_Gray1(this.iFreeAll, 7));

            // this.btnRun.setEnabled(false);
            // this.btnRun.setBright(false);

            // this.btnAll.setEnabled(false);
            // this.btnAll.setBright(false);

            this.btnAuto.setEnabled(false);
            this.btnAuto.setBright(false);
            this.btnAuto.setVisible(true);

            this.btnAutoStop.setEnabled(false);
            this.btnAutoStop.setBright(false);
            this.btnAutoStop.setVisible(false);

            // this.btnLeft1.setEnabled(false);
            // this.btnLeft1.setBright(false);
            //
            // this.btnRight1.setEnabled(false);
            // this.btnRight1.setBright(false);

            // this.btnLeft2.setEnabled(false);
            // this.btnLeft2.setBright(false);
            //
            // this.btnRight2.setEnabled(false);
            // this.btnRight2.setBright(false);

            // this.btnMaxBet.setEnabled(false);
            // this.btnMaxBet.setBright(false);

            // this.btnDouble.setEnabled(false);
            // this.btnDouble.setBright(false);
            // this.nodBtnAni3.setVisible(false);
        }
        else {
            if(this.sprFreeRunBack != undefined && this.sprFreeRunBack != null)
                this.sprFreeRunBack.setVisible(false);

            if(this.FreeLogoAni != undefined) {
                this.FreeLogoAni.node.stopAllActions();
                this.nodFreeLogo.removeChild(this.FreeLogoAni.node);
                this.FreeLogoAni = undefined;
            }
        }

        //this.aniSpin.node.setVisible(this.btnRun.isVisible() && this.btnRun.isEnabled());
        this.refreshGiftGame();
    },

    //! 根据红包进行刷新
    refreshGiftGame : function () {
        if(!GameMgr.singleton.isShowGift())
            return ;

        var data = GameMgr.singleton.getGiftData();

        if(data == undefined)
            return ;

        // this.btnLeft2.setEnabled(false);
        // this.btnLeft2.setBright(false);
        // this.btnRight2.setEnabled(false);
        // this.btnRight2.setBright(false);
        // this.btnMaxBet.setEnabled(false);
        // this.btnMaxBet.setBright(false);

        var bnum = data.bet;;
        var allbnum = bnum * data.line * data.times;

        this.textAllBet.setString(this.chgString(allbnum));
        this.textBet.setString(this.chgString(bnum));
    },

    //! 离开红包游戏
    leftGiftGame : function () {
        this.restoreUserSetup();
        this.refreshInfo();
    },

    //! 离开jackpot
    leftJackpotGame : function () {
        if(this.bRun)
            return ;

        GameMgr.singleton.showGiftGame(this.canShowGiftGame());
    },

    //! 是否可以显示红包游戏
    canShowGiftGame : function () {
        if(this.bFreeGame)
            return false;

        if(this.bCanOpenBox)
            return false;

        if(this.BoxLayer != undefined)
            return false;

        if(this.FreeGameAni != undefined || this.AddFreeAni != undefined)
            return false;

        if(this.ResultLayer != undefined || this.iResultType > 0)
            return false;

        return true;
    },

    //! 调整部分消息，在initFinish中调用（排除掉部分逻辑不使用的消息）
    adjustMsg : function () {
        if (this.GameModuleInfos == undefined)
            return ;

        // //! 在免费游戏中curkey>=0时，排除掉bg消息
        // if(this.GameModuleInfos['wrathofthor_fg'] != undefined) {
        //     if(this.GameModuleInfos['wrathofthor_bg'] != undefined) {
        //         this.GameModuleInfos['wrathofthor_bg'] = undefined;
        //     }
        // }
    },

    //! 将一个数字变成字符串
    chgString : function (num) {
        var tempnum=num/100;
        var tprecision=2;
        if(num%10==0){
            tprecision=0;
        }
        var str=LanguageData.instance.fixedformatNumber(tempnum,tprecision);
        return  str;
    },
    chgString1: function (num) {
        num=num/100;
        var str=LanguageData.instance.fixedformatNumber(num,2);
        return  str;
    },
    //原逻辑好像什么也没做
    chgString_Gray : function (num, gnum) {
        var nstr = num.toString();
        return nstr;
    },
    //原逻辑好像只是添加了分隔符
    chgString_Gray1 : function (num, gnum) {
        num=num/100;
        var str=LanguageData.instance.fixedformatNumber(num,2,",");
        return  str;
    },

    //! 消息处理
    //! 收到用户的钱数据
    onMyMoney : function (money) {
        if(this.iMyMoney == undefined) {
            this.iMyMoney = money;
            this.ModuleUI.setBalance(money);
        }
        else
            this.iNewMoney = money;

        this.refreshInfo();
    },

    //! 收到轮子数据
    onSymbolStripes : function (arr, wname) {
        return ;

        if(this.lstAllWheel == undefined)
            this.lstAllWheel = {};

        this.lstAllWheel[wname] = [];

        for(var ii = 0; ii < arr.length; ++ii) {
            var lstwdata = [];

            for(var jj = arr[ii].Symbols.length - 1; jj >= 0; --jj) {
                var wdata = this.lstSymbol[arr[ii].Symbols[jj]];
                lstwdata.push(wdata);
            }

            this.lstAllWheel[wname].push(lstwdata);
        }

        if(wname == "normal") {
            for(var ii = 0; ii < arr.length; ++ii) {
                var lstwdata = [];

                for(var jj = arr[ii].Symbols.length - 1; jj >= 0; --jj) {
                    var wdata = this.lstSymbol[arr[ii].Symbols[jj]];
                    lstwdata.push(wdata);
                }

                this.lstwheel[ii].setWheelData(lstwdata, 0, false);
            }

            this.curWheelName = "normal";
        }
    },

    //! 设置轮子
    setCurWheel : function (wname) {
        if(this.curWheelName != undefined && this.curWheelName == wname)
            return ;

        if(this.lstAllWheel == undefined || this.lstAllWheel[wname] == undefined)
            return ;

        var wheel = this.lstAllWheel[wname];

        for(var ii = 0; ii < wheel.length; ++ii) {
            this.lstwheel[ii].setWheelData(wheel[ii], 0, false);
        }

        this.curWheelName = wname;
    },

    //! 收到轮子位置
    onGenInit : function (data) {
        return ;

        for(var ii = 0; ii < 5; ++ii) {
            var wi = data[ii].Idx;
            var bindex = this.lstwheel[ii].lstwheeldata.length - (data[ii].Pos) - 1;

            while(bindex < 0)
                bindex += this.lstwheel[ii].lstwheeldata.length;

            while(bindex >= this.lstwheel[ii].lstwheeldata.length)
                bindex -= this.lstwheel[ii].lstwheeldata.length;

            this.lstwheel[wi].setWheelIndex(bindex, true);
        }
    },

    //! 收到转动结果
    onSpinResult : function (totalwin, result, winresult, winmul) {
        //! 排除重复收到的结果
        if(this.bCanStop)
            return ;
        
        this.totalwin = totalwin;
        this.result = result;
        this.winresult = winresult;

        this.iFreeMul = winmul;
    },

    onSpinResult1 : function () {
        //! 排除重复收到的结果
        if(this.bCanStop)
            return ;
        
        var totalwin = this.totalwin;
        var result = this.result;
        var winresult = this.winresult;

        for(var ii = 0; ii < 5; ++ii) {
            var wi = result[ii].Idx;
            var eindex = this.lstwheel[ii].lstwheeldata.length - (result[ii].Pos) - 1;

            while(eindex < 0)
                eindex += this.lstwheel[ii].lstwheeldata.length;

            while(eindex >= this.lstwheel[ii].lstwheeldata.length)
                eindex -= this.lstwheel[ii].lstwheeldata.length;

            this.SpinResult[wi] = eindex;
        }

        this.lstwheel[0].stop_index(this.SpinResult[0]);
        this.addDartsAni(0, this.lstwheel[0].RunTime + this.lstwheel[0].BeginAniTime);

        this.bCanStop = true;
        this.SpinWin = totalwin;

        // if(totalwin > 0) {
        //     this.WinType = this.lstWinSymbol[winresult[0].Symbol];
        // }
        // else {
        //     this.WinType = 0;
        // }

        this.refreshInfo();
    },

    onSGameInfo : function (msgobj) {
        if(msgobj.sgame == "fivedragon") {
            if(this.BoxLayer != undefined) {
                this.BoxLayer.onSGameInfo(msgobj);
            }
        }
    },

    //! 收到游戏信息
    onGameInfo : function(msgobj) {
        return ;

        if (msgobj.hasOwnProperty('wheelname')) {
            //this.setCurWheel(msgobj.wheelname);
            this.newWheelName = msgobj.wheelname;
        }

        if (msgobj.hasOwnProperty('gamescene')) {
            if(msgobj.gamescene == "fivedragon") {
                this.bCanOpenBox = true;

                //! 如果没有转，则应该是一开始就进入
                if(!this.bRun && this.BoxLayer == undefined) {
                    this.WaitOpenBoxTime = 0.1;
                }
            }
        }

        if (msgobj.hasOwnProperty('fgi')) {
            if(!this.bFreeGame) {
                this.bFreeGame = true;
                this.refreshHits();

                if(this.BoxLayer == undefined) {
                    this.playOneMusic();
                    this.playFreeLogoAni();
                }
            }

            this.bAutoRun = true;

            if(this.WaitAutoTime <= 0)
                this.WaitAutoTime = 1;

            if(this.iFreeNums < 0)
                this.iFreeNums = msgobj.fgi.lastnums;

            if(msgobj.fgi.val0 != undefined && msgobj.fgi.val0 != null) {
                if(this.iFreeType < 0 || this.iFreeType != msgobj.fgi.val0) {
                    //this.iFreeType = 0;
                    this.iFreeType = msgobj.fgi.val0;

                    for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                        this.lstwheel[ii].chgIcon(this.lstWinSymbol.WW, this.lstchgicon[this.iFreeType], this.lstchgbicon[this.iFreeType], this.lstchgiconani[this.iFreeType]);
                    }

                    if(this.sprFreeIcon != undefined && this.sprFreeIcon != null) {
                        var frame = cc.spriteFrameCache.getSpriteFrame(this.lstchgicon[this.iFreeType]);
                        this.sprFreeIcon.setSpriteFrame(frame);
                    }
                }
            }

            if(this.iFreeAll < 0)
                this.iFreeAll = msgobj.fgi.totalwin;

            //this.iFreeNums = msgobj.fgi.lastnums;
            this.iNewFreeNums = msgobj.fgi.lastnums;
            this.iFreeMul = msgobj.fgi.multiple;
            //this.iFreeAll = msgobj.fgi.totalwin;
            this.iNewFreeAll = msgobj.fgi.totalwin;
            this.iFreeBeginWin = msgobj.fgi.spinwin;

            if(this.iBet >= this.lstBet.length)
                this.iBet = this.lstBet.length - 1;

            for(var ii = 0; ii < this.lstBet.length; ++ii) {
                if(this.lstBet[ii] == msgobj.fgi.bet) {
                    this.iBet = ii;
                    break;
                }
            }

            if(msgobj.fgi.val1 != undefined) {
                this.iFreeAdd = msgobj.fgi.val1;

                //! 刚开始的时候初始化一次
                if(this.bJustStart) {
                    this.iFreeMul = 0;
                    this.refreshFreeInfo();
                    this.bJustStart = false;
                }
            }

            this.refreshInfo();
        }
        else {
            this.refreshInfo();
        }
    },

    //! 收到断线
    onDisconnect : function () {
        if(this.ErrorLayer != undefined)
            return ;

        var layer = new TlodDisconnectLayer(this, 1, 0);
        this.addChild(layer, 11);
        this.DisconnectLayer = layer;
    },

    //! 收到重连
    onReconnnect : function () {
        if(this.DisconnectLayer == undefined)
            return ;

        this.removeChild(this.DisconnectLayer);
        this.DisconnectLayer = undefined;
    },

    //! 清除游戏消息
    clearGameModuleInfo : function () {
        this.GameModuleInfos = {};
    },

    //! 收到错误信息
    onError : function (type, strerror, newtype) {
        if(this.ErrorLayer != undefined)
            return ;

        var ctype = 3;

        if(newtype != undefined && newtype == 1)
            ctype = 4;

        var layer = new TlodDisconnectLayer(this, ctype, type, strerror);
        this.addChild(layer, 12);
        this.ErrorLayer = layer;

        if(ctype == 4)
            this.bErrorPause = true;
        
        //! 会自动关闭
        if(type == 2) {
            if(this.WaitAutoTime > 0)
                this.WaitAutoTime += 3;
        }
    },
    
    //! 按钮
    onTouchRun : function (sender, type) {
        // if (type != ccui.Widget.TOUCH_ENDED)
        //     return ;

        if(this.bRun || this.bAutoRun)
            return ;

        //cc.audioEngine.playEffect(res.TlodBtnRun_mp3, false);
        this.runOne();
    },

    onTouchMaxBet : function () {
        if(this.bRun || this.bAutoRun)
            return ;

        this.playBtnSound();

        this.iBet = this.lstBet.length - 1;

        this.setUserSetup("userbet", this.iBet);
        this.saveBetNum();
        this.refreshInfo();
    },

    onTouchStop : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        cc.audioEngine.playEffect(res.OnePieceBtnStop_mp3, false);
        //this.playBtnSound();

        this.bQuickStop = true;
        this.refreshInfo();

        var stime = 0;

        for(var ii = 0; ii < this.lstwheel.length; ++ii) {
            // this.lstwheel[ii].RunTime = 0.1 * ii;
            //
            // if(this.lstwheel[ii].bRun && !this.lstwheel[ii].bStoping) {
            //     //this.lstwheel[ii].RunTime = 0;
            //     this.lstwheel[ii].stop_index(this.SpinResult[ii]);
            // }

            if(this.lstwheel[ii].bRun && !this.lstwheel[ii].bStoping) {
                this.lstwheel[ii].RunTime = 0.1 * ii;
                this.lstwheel[ii].stop_index(this.SpinResult[ii]);
            }
            else {
                if(this.lstwheel[ii].RunTime > 0) {
                    this.lstwheel[ii].RunTime = 0.1 * ii;
                }
            }

            if(this.lstwheel[ii].bRun) {
                // if(ii == this.lstwheel.length - 1)
                //     this.lstwheel[ii].stopWheel(true);
                // else
                //     this.lstwheel[ii].stopWheel(false);

                this.addDartsAni(ii, stime);
                stime += 0.1;
            }
        }

        // if(!this.bAutoRun) {
        //     this.bQuickStop = true;
        //     this.refreshInfo();
        //
        //     for(var ii = 0; ii < this.lstwheel.length; ++ii) {
        //         this.lstwheel[ii].RunTime = 0.05 * ii;
        //
        //         if(this.lstwheel[ii].bRun && !this.lstwheel[ii].bStoping) {
        //             //this.lstwheel[ii].RunTime = 0;
        //             this.lstwheel[ii].stop_index(this.SpinResult[ii]);
        //         }
        //
        //         if(this.lstwheel[ii].bRun)
        //             this.lstwheel[ii].stopWheel();
        //     }
        //
        //     return ;
        // }
        //
        // this.setAuto(0);
    },

    onTouchAll : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        // //! 测试
        // this.lstwheel[0].disappearIcon(1);
        // this.lstwheel[1].disappearIcon(2);
        // this.lstwheel[2].disappearIcon(1);
        // this.lstwheel[2].disappearIcon(2);
        // this.lstwheel[3].disappearIcon(0);
        // this.lstwheel[3].disappearIcon(2);
        // this.lstwheel[4].disappearIcon(0);
        // this.lstwheel[4].disappearIcon(1);
        // this.lstwheel[4].disappearIcon(2);
        // return ;

        if(this.bRun || this.bAutoRun)
            return ;

        this.playBtnSound();

        this.iBet = this.lstBet.length - 1;
        //this.iLine = 50;
        //this.setUserSetup("narutouserline", this.iLine);

        this.refreshInfo();

        // if(this.bRun || this.bAutoRun)
        //     return ;
        //
        // // cc.audioEngine.playEffect(res.KofBtnRun_mp3, false);
        // // this.runOne();
        //
        // this.showLine(this.iLine, 0.5, this.runOne);
    },

    onTouchAuto : function (sender, type) {
         // if (type != ccui.Widget.TOUCH_ENDED)
         //     return ;

        // //! 测试
        // for(var ii = 0; ii < this.lstwheel.length; ++ii) {
        //     this.lstwheel[ii].clearIcon();
        // }
        // return ;

         if(this.bRun || this.bAutoRun)
             return ;

         this.playBtnSound();

        //  var layer = new TlodAutoSelectLayer(this);
        // this.addChild(layer, 1);

        this.nodeAutoBack.setVisible(true);
        //this.layAutoSelect.setVisible(true);
    },

    onTouchAutoStop : function (sender, type) {
        // if (type != ccui.Widget.TOUCH_ENDED)
        //     return ;

        this.playBtnSound();

        if(!this.bAutoRun)
            return ;

        this.setAuto(0);
    },

    onTouchLeft1 : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.bRun || this.bAutoRun)
            return ;

        this.playBtnSound();

        // --this.iLine;
        //
        // if(this.iLine <= 0)
        //     this.iLine = 1;
        //
        // this.setUserSetup("kofuserline", this.iLine);
        // this.refreshInfo();

        this.setLine(this.iLine - 1);
        this.chgRocker(2);
    },

    onTouchRight1 : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.bRun || this.bAutoRun)
            return ;

        this.playBtnSound();

        // ++this.iLine;
        //
        // if(this.iLine > 9)
        //     this.iLine = 9;
        //
        // this.setUserSetup("kofuserline", this.iLine);
        // this.refreshInfo();

        this.setLine(this.iLine + 1);
        this.chgRocker(3);
    },

    chgRocker : function (type) {
        return ;

        var name = "img_rocker" + type + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(name);
        this.sprRocker.setSpriteFrame(frame);

        if(type == 1) {
            this.iRockerTime = 0;
        }
        else {
            this.iRockerTime = 0.2;
        }
    },

    update_Rocker : function (dt) {
        if(this.iRockerTime <= 0)
            return ;

        this.iRockerTime -= dt;

        if(this.iRockerTime <= 0)
            this.chgRocker(1);
    },

    onTouchLeft2 : function (sender, type) {
        // if (type != ccui.Widget.TOUCH_ENDED)
        //     return ;

        // //! 测试
        // // for(var ii = 0; ii < this.lstwheel.length; ++ii) {
        // //     this.lstwheel[ii].adjust();
        // // }
        // this.chgScene(2, 5);
        // return ;

        if(this.bRun || this.bAutoRun)
            return ;

        this.playBtnSound();

        --this.iBet;

        if(this.iBet < 0)
            this.iBet = 0;

        this.setUserSetup("userbet", this.iBet);
        this.saveBetNum();
        this.refreshInfo();
    },

    onTouchRight2 : function (sender, type) {
        // if (type != ccui.Widget.TOUCH_ENDED)
        //     return ;

        // //! 测试
        // for(var ii = 0; ii < this.lstwheel.length; ++ii) {
        //     this.lstwheel[ii].appearIcon();
        // }
        // return ;

        if(this.bRun || this.bAutoRun)
            return ;

        this.playBtnSound();

        ++this.iBet;

        if(this.iBet >= this.lstBet.length)
            this.iBet = this.lstBet.length - 1;

        this.setUserSetup("userbet", this.iBet);
        this.saveBetNum();
        this.refreshInfo();
    },

    // onTouchAuto25 : function () {
    //     this.playBtnSound();
    //     this.setAuto(25);
    //
    //     this.nodeAutoBack.setVisible(false);
    //     //this.layAutoSelect.setVisible(false);
    // },
    //
    // onTouchAuto50 : function () {
    //     this.playBtnSound();
    //     this.setAuto(50);
    //
    //     this.nodeAutoBack.setVisible(false);
    //     //this.layAutoSelect.setVisible(false);
    // },
    //
    // onTouchAuto100 : function () {
    //     this.playBtnSound();
    //     this.setAuto(100);
    //
    //     this.nodeAutoBack.setVisible(false);
    //     //this.layAutoSelect.setVisible(false);
    // },
    //
    // onTouchAuto200 : function () {
    //     this.playBtnSound();
    //     this.setAuto(200);
    //
    //     this.nodeAutoBack.setVisible(false);
    //     //this.layAutoSelect.setVisible(false);
    // },
    //
    // onTouchAuto500 : function () {
    //     this.playBtnSound();
    //     this.setAuto(500);
    //
    //     this.nodeAutoBack.setVisible(false);
    //     //this.layAutoSelect.setVisible(false);
    // },

    onTouchDouble : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.bRun || this.bAutoRun)
            return ;

        this.playBtnSound();
        this.bCanDouble = false;
        this.refreshInfo();

        var layer = new NarutoDoubleLayer(this);
        this.addChild(layer, 1);

        this.DoubleLayer = layer;

        MainClient.singleton.sgamectrl(GameMgr.singleton.getCurGameID(), "pokerrb", "comein", 0, function(isok) {
        });
    },

    leftDouble : function (bsendmsg) {
        if(this.DoubleLayer != undefined) {
            this.removeChild(this.DoubleLayer);
            this.DoubleLayer = undefined;
        }

        if(this.iNewMoney != undefined) {
            this.setMyMoney_auto(this.iNewMoney);
            this.iNewMoney = undefined;
        }

        if(bsendmsg) {
            MainClient.singleton.sgamectrl(GameMgr.singleton.getCurGameID(), "pokerrb", "left", 0, function(isok) {
            });
        }
    },

    openBoxGame : function () {
        this.iFreeNums = -1;
        this.iFreeAll = -1;

        var layer = new OnePieceBoxLayer(this);
        this.addChild(layer, 1);

        this.BoxLayer = layer;

        MainClient.singleton.sgamectrl(GameMgr.singleton.getCurGameID(), "fivedragon", "comein", 0, function(isok) {
        });
    },

    leftBoxGame : function () {
        if(this.iNewMoney != undefined) {
            this.setMyMoney_auto(this.iNewMoney);
            this.iNewMoney = undefined;
        }

        if(this.BoxLayer != undefined) {
            this.removeChild(this.BoxLayer);
            this.BoxLayer = undefined;

            if(!this.bFreeGame) {
                this.WaitAutoTime = 0;
                if(!this.bFreeGame) {
                    this.bFreeGame = true;
                    this.refreshHits();
                }
                this.bShowFreeResult = false;
            }

            this.clearResultDis();
            this.refreshInfo();

            this.iFreeMul = 0;
            this.refreshFreeInfo();

            this.playTransAni();

            if(!this.bPlayFreeMusic)
                this.playOneMusic();
            
            this.playFreeLogoAni();
        }

        if(this.WaitAutoTime > 1)
            this.WaitAutoTime = 1;
    },

    openFreeResult : function () {
        // for(var ii = 0; ii < this.lstwheel.length; ++ii) {
        //     this.lstwheel[ii].setExState(-1);
        // }
        //
        // this.clearResultDis();
        //
        // var self = this;
        // MainClient.singleton.spin(GameMgr.singleton.getCurGameID(), 1, 1, this.iLine, function (isok) {
        //     if (isok) {
        //         self.onGameModuleInfo1();
        //     }
        // });
        //
        // this.bQuickDown = true;
        // this.bPasueWheel = true;
        //
        // this.leftFreeResult();
        // return ;

        //var layer = new DBZFreeResultLayer(this, this.iTotalFreeNums, -1);
        // var layer = new TlodFreeResultLayer(this, this.iTotalFreeNums, this.iFreeAll);
        // this.addChild(layer, 1);

        var level = 0;

        var bnum = this.lstBet[this.iBet];
        var allbnum = bnum * this.iLine;

        var mul = this.iFreeAll / allbnum;

        if(mul >= 20)
            level = 3;
        else if(mul >= 10)
            level = 2;
        else if(mul >= 5)
            level = 1;

        // this.layDisable.setVisible(true);
        // this.layDisable.setOpacity(128);

        var layer = new TlodFreeResultLayer(this, this.iTotalFreeNums, this.iFreeAll, level);
        this.nodeFreeResult.addChild(layer);
        this.FreeResultLayer = layer;

        // var freeresult = ccs.load(res.NewTlodGameNode_FreeResult_json);;
        // this.nodeFreeResult.addChild(freeresult.node);
    },

    leftFreeResult : function () {
        for(var ii = 0; ii < this.lstwheel.length; ++ii) {
            this.lstwheel[ii].setExState(-1);
        }

        this.clearResultDis();

        var self = this;
        MainClient.singleton.newspin(GameMgr.singleton.getCurGameID(), -1, 1, -1, false, function (isok) {
            if (isok) {
                self.onGameModuleInfo1();
            }
        });

        // var self = this;
        // MainClient.singleton.spin(GameMgr.singleton.getCurGameID(), 1, 1, this.iLine, function (isok) {
        //     if (isok) {
        //         self.onGameModuleInfo1();
        //     }
        // });

        //this.bQuickDown = true;
        this.bPasueWheel = true;

        if(this.FreeResultLayer != undefined) {
            // this.removeChild(this.FreeResultLayer);
            // this.FreeResultLayer = undefined;
            this.FreeResultLayer.removeFromParent();
            // this.layDisable.setVisible(false);
            // this.layDisable.setOpacity(0);
        }

        if(this.bFreeGame) {
            this.bFreeGame = false;
            this.refreshHits();
            this.playOneMusic();

            if(this.iFreeType >= 0) {
                for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                    this.lstwheel[ii].chgIcon(this.lstWinSymbol.WW, this.lsticon[this.lstWinSymbol.WW], this.lstbicon[this.lstWinSymbol.WW], this.lsticonani[this.lstWinSymbol.WW]);
                }

                this.iFreeType = -1;
            }

            this.setWin_auto(this.iFreeAll);
        }
        //this.playOneMusic();
        this.iFreeNums = -1;
        this.iNewFreeNums = 0;
        this.iFreeMul = 0;
        this.iFreeAll = -1;
        this.iNewFreeAll = 0;
        this.iFreeBeginWin = 0;

        if(this.iAutoNum > 0) {
            this.bAutoRun = true;
            this.WaitAutoTime = 1;
        }
        else {
            this.bAutoRun = false;
        }

        //! 回到之前的局面继续
        this.setRun(true);
        //this.chgScene(3);
        this.GameScene.setState(3, 0);
        this.setHits(-1);

        this.refreshInfo();

        // if(this.bQuickDown != undefined && !this.bQuickDown)
        //     this.bPasueWheel = false;

        // var self = this;
        // MainClient.singleton.spin(GameMgr.singleton.getCurGameID(), 1, 1, this.iLine, function (isok) {
        //     if (isok) {
        //         //self.onSpinResult1();
        //     }
        // });
    },

    playFreeLogoAni : function () {
        return ;

        if(this.FreeLogoAni != undefined) {
            this.FreeLogoAni.node.stopAllActions();
            this.nodFreeLogo.removeChild(this.FreeLogoAni.node);
            this.FreeLogoAni = undefined;
        }

        this.FreeLogoAni = ccs.load(res.NarutoFreeLogoAni_json);
        this.nodFreeLogo.addChild(this.FreeLogoAni.node);
        this.FreeLogoAni.node.runAction(this.FreeLogoAni.action);
        this.FreeLogoAni.action.gotoFrameAndPlay(0, this.FreeLogoAni.action.getDuration(), false);
    },

    onTouchOpenSound : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.setPlaySound(false);
        GameAssistant.singleton.setMusicType("tlod", 0);
    },

    onTouchCloseSound : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.setPlaySound(true);
        GameAssistant.singleton.setMusicType("tlod", 1);
    },

    onTouchOpenEffect : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.setPlayEffect(false);
        GameAssistant.singleton.setEffectType("tlod", 0);
    },

    onTouchCloseEffect : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.setPlayEffect(true);
        GameAssistant.singleton.setEffectType("tlod", 1);
    },

    onTouchSetup : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.MenuBarLayer) {
            this.playBtnSound();
            this.MenuBarLayer.onTouchSetup();
            return ;
        }

        // GameMgr.singleton.onError(0, "测试一下报错是什么效果啊……");
        // return ;
        // //! 计算胜利倍数
        // if(this.wintype == undefined)
        //     this.wintype = 0;
        // else {
        //     ++this.wintype;
        //
        //     if(this.wintype > 3)
        //         this.wintype = 0;
        // }
        //
        // var wintype = this.wintype;
        // //wintype = 3;
        //
        // var person = 0;
        // var person2 = 0;
        //
        // var lstperson = [1, 2, 3, 4, 5, 6, 7];
        //
        // if(person2 < 1 || person2 > 7) {
        //     if(person >= 1 && person <= 7) {
        //         for(var ii = 0; ii < lstperson.length; ++ii) {
        //             if(person == lstperson[ii]) {
        //                 lstperson.splice(ii, 1);
        //                 break;
        //             }
        //         }
        //     }
        //     else {
        //         var ii = Math.floor(Math.random() * lstperson.length);
        //
        //         if(ii < 0)
        //             ii = 0;
        //
        //         if(ii >= lstperson.length)
        //             ii = lstperson.length - 1;
        //
        //         person = lstperson[ii];
        //         lstperson.splice(ii, 1);
        //     }
        //
        //     var ii = Math.floor(Math.random() * lstperson.length);
        //
        //     if(ii < 0)
        //         ii = 0;
        //
        //     if(ii >= lstperson.length)
        //         ii = lstperson.length - 1;
        //
        //     person2 = lstperson[ii];
        // }
        //
        // if(this.WinAni2 == undefined) {
        //     this.WinAni2 = ccs.load(this.lstWinAni[wintype]);
        //
        //     var wnum = Math.floor(Math.random() * 10000) * 10;
        //     var wstr = this.chgString(wnum);
        //
        //     var textNum1 = findNodeByName(this.WinAni2.node, "textNum1");
        //     textNum1.setString(wstr);
        //
        //     var sprPerson1 = findNodeByName(this.WinAni2.node, "sprPerson1");
        //
        //     if(sprPerson1 != undefined && sprPerson1 != null) {
        //         var frame = cc.spriteFrameCache.getSpriteFrame("kofaniperson" + wintype.toString() + "1" + person.toString() + ".png");
        //
        //         if(frame != undefined && frame != null)
        //             sprPerson1.setSpriteFrame(frame);
        //     }
        //
        //     var sprPerson2 = findNodeByName(this.WinAni2.node, "sprPerson2");
        //
        //     if(sprPerson2 != undefined && sprPerson2 != null) {
        //         var frame = cc.spriteFrameCache.getSpriteFrame("kofaniperson" + wintype.toString() + "1" + person2.toString() + ".png");
        //
        //         if(frame != undefined && frame != null)
        //             sprPerson2.setSpriteFrame(frame);
        //     }
        //
        //     this.GameLayer.node.addChild(this.WinAni2.node, 2);
        //     this.WinAni2.node.runAction(this.WinAni2.action);
        //     this.WinAni2.action.gotoFrameAndPlay(0, this.WinAni2.action.getDuration(), false);
        // }
        //
        // return ;

        //this.onError(2);
        //this.onDisconnect();
        // var layer = new KofDisconnectLayer(this, 2, 0);
        // this.addChild(layer, 1);
        //return ;
        // this.iWin = 100;
        // this.showWinAni(true, this.iMyMoney);
        // return ;
        // this.onDisconnect();
        // return ;
        // var layer = new SlamdunkDisconnectLayer(this, 3);
        // this.addChild(layer, 1);
        // var layer = new SD2DisconnectLayer(this, 3, 2, "出错了！！！");
        // this.addChild(layer, 1);
        // return ;

        this.playBtnSound();

        var layer = new TlodSetupLayer(this);
        this.addChild(layer, 1);
    },

    onTouchClose : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.playBtnSound();

        close_game();
    },

    onTouchHelp : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.playBtnSound();
        this.showHelp(1);
    },

    onTouchBtnLine : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        var lindex = -1;

        for(var ii = 0; ii < 25; ++ii) {
            if(this.lstBtnBlue[ii] == sender) {
                lindex = ii + 1;
                break;
            }

            if(this.lstBtnLBlue[ii] == sender) {
                lindex = ii + 1;
                break;
            }

            if(this.lstBtnGBlue[ii] == sender) {
                lindex = ii + 1;
                break;
            }
        }

        if(lindex > 0) {
            this.playBtnSound();
            this.setLine(lindex);
        }
    },

    onTouchOpenHis : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        this.btnOpenHis.setVisible(false);
        this.btnCloseHis.setVisible(true);

        this.nodeRecord.setVisible(false);
    },

    onTouchCloseHis : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        this.btnOpenHis.setVisible(true);
        this.btnCloseHis.setVisible(false);

        this.nodeRecord.setVisible(true);
    },

    setLine : function(lnum) {
        // this.iLine = lnum;
        //
        // if(this.iLine <= 0)
        //     this.iLine = 1;
        //
        // if(this.iLine > 25)
        //     this.iLine = 25;

        this.iLine = 50;

        //this.setUserSetup("narutouserline", this.iLine);
        this.refreshInfo();

        this.showLine(this.iLine, 2, undefined);
    },

    showLine : function(lnum, time, func) {
        for(var ii = 0; ii < this.lstBtnLBlue.length; ++ii) {
            this.lstBtnLBlue[ii].setVisible(false);
        }

        if(this.lstSprLine.length > 0) {
            for(var ii = 0; ii < 25; ++ii) {
                if(ii < lnum && time > 0)
                    this.lstSprLine[ii].setVisible(true);
                else
                    this.lstSprLine[ii].setVisible(false);
            }
        }

        if(time <= 0 ) {
            this.ShowLineTime = 0;

            if(func != undefined) {
                func();
            }

            this.ShowLineFunc = undefined;
        }
        else {
            this.ShowLineTime = time;
            this.ShowLineFunc = func;
        }
    },

    update_Line : function (dt) {
        if(this.ShowLineTime <= 0)
            return ;

        this.ShowLineTime -= dt;

        if(this.ShowLineTime <= 0) {

            if(this.lstSprLine.length > 0) {
                for(var ii = 0; ii < 25; ++ii)
                    this.lstSprLine[ii].setVisible(false);
            }

            if(this.ShowLineFunc != undefined) {
                this.ShowLineFunc();
                this.ShowLineFunc = undefined;
            }
        }
    },

    setPlaySound : function (bplay) {
        if(bplay) {
            if(!this.bInitMusic) {
                //cc.audioEngine.playMusic(res.SlamDunkEnd_mp3, true);
                this.bInitMusic = true;
                this.playOneMusic();
            }

            //cc.audioEngine.setEffectsVolume(1);
            cc.audioEngine.setMusicVolume(this.SoundValue);

            if(this.btnOpenSound != undefined)
                this.btnOpenSound.setVisible(true);

            if(this.btnCloseSound != undefined)
                this.btnCloseSound.setVisible(false);
        }
        else {
            //cc.audioEngine.setEffectsVolume(0);
            cc.audioEngine.setMusicVolume(0);

            if(this.btnOpenSound != undefined)
                this.btnOpenSound.setVisible(false);

            if(this.btnCloseSound != undefined)
                this.btnCloseSound.setVisible(true);
        }
    },

    setPlayEffect : function (bplay) {
        if(bplay) {
            cc.audioEngine.setEffectsVolume(1);
            //cc.audioEngine.setMusicVolume(1);

            if(this.btnOpenEffect != undefined)
                this.btnOpenEffect.setVisible(true);

            if(this.btnCloseEffect != undefined)
                this.btnCloseEffect.setVisible(false);
        }
        else {
            cc.audioEngine.setEffectsVolume(0);
            //cc.audioEngine.setMusicVolume(0);

            if(this.btnOpenEffect != undefined)
                this.btnOpenEffect.setVisible(false);

            if(this.btnCloseEffect != undefined)
                this.btnCloseEffect.setVisible(true);
        }
    },

    playBtnSound : function () {
        return ;
        cc.audioEngine.playEffect(res.TlodBtnClick_mp3, false);
    },

    //! 播放一个音乐
    playOneMusic : function () {
        if(!this.bInitMusic)
            return ;

        if(this.bFreeGame) {
            cc.audioEngine.playMusic(res.TlodFreeMusci1_mp3, false);
            this.bPlayFreeMusic = true;
            return ;
        }

        this.bPlayFreeMusic = false;

        if(this.lstWaitMusic.length <= 0)
            this.addWaitMusic();

        var index = this.lstWaitMusic[0];
        this.lstWaitMusic.splice(0, 1);

        cc.audioEngine.playMusic(this.lstMusic[index], false);

        //this.addWaitMusic();

        if(this.lstWaitMusic <= 1) {
            this.addWaitMusic();
        }
    },

    //! 增加一组随机音乐
    addWaitMusic : function () {
        if(this.lstWaitMusic.length == 0) {
            var lstwindex = [];
            var wnum = this.lstMusic.length;

            for(var ii = 0; ii < wnum; ++ii) {
                lstwindex.push(ii);
            }

            for(var ii = 0; ii < this.lstMusic.length; ++ii) {
                var sindex = Math.floor(Math.random() * wnum);

                if(sindex < 0)
                    sindex = 0;

                if(sindex >= wnum)
                    sindex = wnum - 1;

                var anum = lstwindex[sindex];
                this.lstWaitMusic.push(anum);
                lstwindex.splice(sindex, 1);
                wnum = lstwindex.length;
            }
        }
        else {
            var lstwindex = [];
            var wnum = this.lstMusic.length;
            var skipnum = this.lstWaitMusic[this.lstWaitMusic.length - 1];
            --wnum;

            for(var ii = 0; ii < this.lstMusic.length; ++ii) {
                if(ii != skipnum)
                    lstwindex.push(ii);
            }

            wnum = lstwindex.length;

            for(var ii = 0; ii < this.lstMusic.length; ++ii) {
                var sindex = Math.floor(Math.random() * wnum);

                if(sindex < 0)
                    sindex = 0;

                if(sindex >= wnum)
                    sindex = wnum - 1;

                var anum = lstwindex[sindex];
                this.lstWaitMusic.push(anum);
                lstwindex.splice(sindex, 1);

                if(ii == 0) {
                    //! 把跳过的图片加回来
                    lstwindex.push(skipnum);
                }

                wnum = lstwindex.length;
            }
        }
    },

    //! 根据胜利级别 播放一个胜利音效
    playWinEffectByWinType: function (wintype) {
        if(this.btnOpenEffect.isVisible()) {
            this.ChgSValueTime = 1;
            //this.SoundValue = 0.3;
        }

        if(this.btnCloseEffect.isVisible()) {
            this.WinEffectTime = 0;
        }
        else {
            this.WinEffectTime = this.lstWinEffectTime[wintype];

            if(cc.audioEngine.getMusicVolume() > 0)
                cc.audioEngine.setMusicVolume(this.SoundValue);

            cc.audioEngine.playEffect(this.lstWinEffect[wintype], false);
        }
    },

    //! 播放一个胜利音效
    playWinEffect : function () {
        if(this.lstWaitWinEfect.length <= 0)
            this.addWaitWinEffect();

        var index = this.lstWaitWinEfect[0];
        this.lstWaitWinEfect.splice(0, 1);

        if(this.btnOpenEffect.isVisible()) {
            this.ChgSValueTime = 1;
            this.SoundValue = 0.3;
        }

        // if(this.btnCloseEffect.isVisible()) {
        //     //! 如果没有音效则直接切换音乐
        //     this.WinEffectTime = 0;
        //     this.bStopMusic = false;
        //     this.playOneMusic();
        // }
        // else {
        //     this.WinEffectTime = this.lstWinEffectTime[index];
        //     this.bStopMusic = true;
        //
        //     if(cc.audioEngine.getMusicVolume() > 0)
        //         cc.audioEngine.setMusicVolume(this.SoundValue);
        //
        //     cc.audioEngine.stopMusic(false);
        //     cc.audioEngine.playEffect(this.lstWinEffect[index], false);
        // }

        if(this.btnCloseEffect.isVisible()) {
            this.WinEffectTime = 0;
        }
        else {
            this.WinEffectTime = this.lstWinEffectTime[index];

            if(cc.audioEngine.getMusicVolume() > 0)
                cc.audioEngine.setMusicVolume(this.SoundValue);

            cc.audioEngine.playEffect(this.lstWinEffect[index], false);
        }

        //this.addWaitWinEffect();

        if(this.lstWaitWinEfect <= 1) {
            this.addWaitWinEffect();
        }
    },

    //! 添加一组随机胜利音效
    addWaitWinEffect : function () {
        if(this.lstWaitWinEfect.length == 0) {
            var lstwindex = [];
            var wnum = this.lstWinEffect.length;

            for(var ii = 0; ii < wnum; ++ii) {
                lstwindex.push(ii);
            }

            for(var ii = 0; ii < this.lstWinEffect.length; ++ii) {
                var sindex = Math.floor(Math.random() * wnum);

                if(sindex < 0)
                    sindex = 0;

                if(sindex >= wnum)
                    sindex = wnum - 1;

                var anum = lstwindex[sindex];
                this.lstWaitWinEfect.push(anum);
                lstwindex.splice(sindex, 1);
                wnum = lstwindex.length;
            }
        }
        else {
            var lstwindex = [];
            var wnum = this.lstWinEffect.length;
            var skipnum = this.lstWaitWinEfect[this.lstWaitWinEfect.length - 1];
            --wnum;

            for(var ii = 0; ii < this.lstWinEffect.length; ++ii) {
                if(ii != skipnum)
                    lstwindex.push(ii);
            }

            wnum = lstwindex.length;

            for(var ii = 0; ii < this.lstWinEffect.length; ++ii) {
                var sindex = Math.floor(Math.random() * wnum);

                if(sindex < 0)
                    sindex = 0;

                if(sindex >= wnum)
                    sindex = wnum - 1;

                var anum = lstwindex[sindex];
                this.lstWaitWinEfect.push(anum);
                lstwindex.splice(sindex, 1);

                if(ii == 0) {
                    //! 把跳过的图片加回来
                    lstwindex.push(skipnum);
                }

                wnum = lstwindex.length;
            }
        }
    },

    // //! 播放一个胜利音效
    // playWinEffect : function (index) {
    //      if(this.btnOpenEffect.isVisible())
    //          this.SoundValue = 0.3;
    //
    //     if(this.btnCloseEffect.isVisible()) {
    //         //! 如果没有音效则直接切换音乐
    //         this.WinEffectTime = 0;
    //         //this.bStopMusic = false;
    //         //this.playOneMusic();
    //     }
    //     else {
    //         this.WinEffectTime = this.lstWinEffectTime[index];
    //         this.bPlayKO = true;
    //         this.bStopMusic = true;
    //
    //          if(cc.audioEngine.getMusicVolume() > 0)
    //              cc.audioEngine.setMusicVolume(this.SoundValue);
    //
    //         cc.audioEngine.stopMusic(false);
    //         cc.audioEngine.playEffect(this.lstWinEffect[index], false);
    //     }
    // },

    //! 胜利音效计时
    update_WinEffect : function (dt) {
        if(this.WinEffectTime <= 0)
            return ;

        if(this.ChgSValueTime > 0) {
            this.ChgSValueTime -= dt;

            if(this.ChgSValueTime <= 0) {
                this.ChgSValueTime = 0;
                this.SoundValue = 0.3;

                if(cc.audioEngine.getMusicVolume() > 0)
                    cc.audioEngine.setMusicVolume(this.SoundValue);
            }
        }

        this.WinEffectTime -= dt;

        if(this.WinEffectTime <= 0) {
            this.SoundValue = 1;
            this.ChgSValueTime = 0;
            this.WinEffectTime = 0;
            this.bStopMusic = false;

            if(cc.audioEngine.getMusicVolume() > 0)
                cc.audioEngine.setMusicVolume(this.SoundValue);
            //this.playOneMusic();
        }
    },

    //! 转一次
    runOne : function () {
        // //! 测试
        // if(this.GameScene.getState() == 0)
        //     this.GameScene.setState(1, 2);
        // else if(this.GameScene.getState() == 2)
        //     this.GameScene.setState(3, 0);
        //
        // return ;

        if(this.ErrorLayer != undefined)
            return false;

        if(this.bRun)
            return false;

        for(var ii = 0; ii < 5; ++ii) {
            if(this.lstwheel[ii].bRun)
                return false;
        }

        // //! 测试代码
        // for(var ii = 0; ii < 5; ++ii) {
        //     this.lstwheel[ii].run(1000 + Math.random() * 400, 0.5, 1, ii * 0.3);
        // }
        //
        // this.bRun = true;
        // this.bCanStop = false;
        // var self = this;
        // MainClient.singleton.spin(104, 1, 1, 1, function (isok) {
        //     if (isok) {
        //         self.onSpinResult1();
        //     }
        // });
        //
        // return true;

        var bnum = this.lstBet[this.iBet];
        var allbnum = bnum * this.iLine;

        bnum = this.ModuleUI.getCoinValue();
        allbnum = this.ModuleUI.getTotalBet();

        if(!GameMgr.singleton.isShowGift() && !this.bFreeGame && this.iMyMoney < allbnum) {
            var layer = new TlodDisconnectLayer(this, 2, 0);
            this.addChild(layer, 11);
            return false;
        }

        //! 轮子有改变
        if(this.newWheelName != undefined) {
            this.setCurWheel(this.newWheelName);
            this.newWheelName = undefined;
        }

        this.clearResultDis();

        //this.showWinAni(false, 0);
        this.setAniState(1);
        this.bCanDouble = false;

        if(!GameMgr.singleton.isShowGift() && !this.bFreeGame) {
            this.iMyMoney -= allbnum;
            this.ModuleUI.betting();
        }

        if(this.bFreeGame)
            bnum = -1;

        //this.iWin = 0;

        this.runBet = this.iBet;
        this.runLine = this.iLine;

        // this.SpriteInfoTime = 0;
        // var frame = cc.spriteFrameCache.getSpriteFrame("img_run.png");
        // this.sprInfo.setSpriteFrame(frame);

        var speed = 3000;
        var banitime = 0.5;

        if(this.bFreeGame) {
            speed *= 1.5;
            banitime /= 2;
        }

        // for(var ii = 0; ii < 5; ++ii) {
        //     //this.lstwheel[ii].run(1000 + Math.random() * 400, 0.5, 1, 0.3 + ii * 0.3);
        //     // if(ii == 0)
        //     //     this.lstwheel[ii].run(1000 + Math.random() * 400, 0.5, 1.5, ii * 0.2);
        //     // else
        //     //     this.lstwheel[ii].run(1000 + Math.random() * 400, 0.5, 1, ii * 0.2);
        //
        //     if(ii == 0)
        //         this.lstwheel[ii].run(speed, banitime, 1.5, ii * 0.2);
        //     else
        //         this.lstwheel[ii].run(speed, banitime, 1, ii * 0.2);
        // }

        this.iWin = 0;
        this.setRun(true);
        this.WaitStopTime = -1;
        this.bCanStop = false;
        this.bQuickStop = false;
        this.bQuickStopTime = 0.5 + 4 * 0.2;

        this.clearHis();
        this.refreshHis();

        var self = this;
        MainClient.singleton.newspin(GameMgr.singleton.getCurGameID(), bnum, 1, this.ModuleUI.getBet(), this.bFreeGame, function (isok) {
            if (isok) {
                self.onGameModuleInfo1();
            }
        });

        // var self = this;
        // MainClient.singleton.spin(GameMgr.singleton.getCurGameID(), bnum, 1, this.iLine, function (isok) {
        //     if (isok) {
        //         self.onGameModuleInfo1();
        //     }
        // });

        this.refreshInfo();
        this.refreshFreeInfo();
        this.setFightState(1);
        return true;
    },

    //! 设置自动转
    setAuto : function(num) {
        if(num > 0) {
            this.bAutoRun = true;
            this.iAutoNum = num;

            //this.btnRun.setVisible(false);
            //this.btnStop.setVisible(true);

            this.WaitAutoTime = 0.1;
        }
        else {
            this.bAutoRun = false;
            this.iAutoNum = 0;

            //this.btnRun.setVisible(true);
            //this.btnStop.setVisible(false);

            this.WaitAutoTime = 0;

            this.iAutoLoss = 0;
            this.iAutoWin = 0;
        }

        this.refreshInfo();
        //this.beginAuto();
    },

    //! 设置自动转
    setAutoEx : function(num, loss, win) {
        var bnum = this.lstBet[this.iBet];
        var allbnum = bnum * this.iLine;

        if(GameMgr.singleton.isShowGift()) {
            var data = GameMgr.singleton.getGiftData(true);

            if(data != undefined) {
                allbnum = data.bet * data.line * data.times;
            }
        }

        if(loss > 0)
            this.iAutoLoss = this.iMyMoney - allbnum * loss;
        else
            this.iAutoLoss = 0;

        if(win > 0)
            this.iAutoWin = allbnum * win;
        else
            this.iAutoWin = 0;

        this.setAuto(num);
    },

    setMyMoney_auto : function (money) {
        this.iMyMoney = money;
        this.ModuleUI.setBalance(money);

        if(this.iAutoNum > 0 && this.iAutoLoss > 0) {
            if(this.iMyMoney < this.iAutoLoss) {
                this.setAuto(0);

                var layer = new TlodDisconnectLayer(this, 2, 1);
                this.addChild(layer, 11);
            }
        }
    },

    setWin_auto : function (win) {
        if(this.iAutoNum > 0 && this.iAutoWin > 0) {
            if(win > this.iAutoWin) {
                this.setAuto(0);

                var layer = new TlodDisconnectLayer(this, 2, 2);
                this.addChild(layer, 11);
            }
        }
    },

    //! 开始自动转
    beginAuto : function() {
        if(!this.bFreeGame) {
            if(!this.bAutoRun)
                return ;

            if(this.iAutoNum <= 0) {
                this.iAutoNum = 0;
                this.setAuto(0);
                GameMgr.singleton.onAutoEnd();
                return ;
            }

            --this.iAutoNum;
        }
        else {
            //! 显示结果
            if(this.iFreeNums <= 0 && this.iFreeAdd <= 0) {
                this.setFightState(15);
                //this.openFreeResult();
                return ;
            }
            else {
                --this.iFreeNums;
            }
        }

        if(!this.runOne()) {
            this.setAuto(0);
            return ;
        }
    },

    //! 动画相关
    //! 设置动画状态 0普通 1转动 2胜利 3失败
    setAniState : function (state) {
        // if(state == 0 || state == 3)
        //     this.setLampState(0);
        // else
        //     this.setLampState(state);
        //
        // if(state == 1)
        //     this.setNeonState(1);
        // else if(state != 2)
        //     this.setNeonState(0);
        // else
        //     this.setNeonState(state);

        // //! 测试
        // if(state == 2) {
        //     this.showAllResult();
        // }
    },

    //! 动画计时
    update_Ani : function (dt) {
        this.update_BtnAni(dt);
        this.update_Darts(dt);
        this.update_GoldAni(dt);
        // this.updata_Lamp(dt);
        // this.updata_Neon(dt);
    },

    //! 设置是否显示胜利动画
    showWinAni : function (bshow, money) {
        if(bshow) {
            //cc.audioEngine.playEffect(res.SlamDunkEffWin_mp3, false);
            //this.playWinEffect();

            // if(this.WinAni == undefined) {
            //     this.WinAni = ccs.load(res.SlamDunkWinAni_json);
            //     this.GameLayer.node.addChild(this.WinAni.node);
            //     this.WinAni.node.runAction(this.WinAni.action);
            //     this.WinAni.action.gotoFrameAndPlay(0, this.WinAni.action.getDuration(), true);
            // }

            // if(this.WinAni2 == undefined) {
            //     this.WinAni2 = ccs.load(res.KofWinAni2_json);
            //
            //     var wstr = this.chgString(this.iWin);
            //
            //     var textNum1 = findNodeByName(this.WinAni2.node, "textNum1");
            //     textNum1.setString(wstr);
            //
            //     this.GameLayer.node.addChild(this.WinAni2.node, 2);
            //     this.WinAni2.node.runAction(this.WinAni2.action);
            //     this.WinAni2.action.gotoFrameAndPlay(0, this.WinAni2.action.getDuration(), false);
            //
            //     // this.WinAni5 = ccs.load(res.KofWinAni5_json);
            //     //
            //     // this.GameLayer.node.addChild(this.WinAni5.node);
            //     // this.WinAni5.node.runAction(this.WinAni5.action);
            //     // this.WinAni5.action.gotoFrameAndPlay(0, this.WinAni5.action.getDuration(), false);
            // }

            this.showAllResult();
        }
        else {
            // if(this.WinAni != undefined) {
            //     this.WinAni.node.stopAllActions();
            //     this.GameLayer.node.removeChild(this.WinAni.node);
            //     this.WinAni = undefined;
            // }
        }
    },
    
    //! 显示所有的结果
    showAllResult : function () {
        return ;
        
        for(var ii = 0; ii < this.lstwheel.length; ++ii) {
            this.lstwheel[ii].setState(1);
        }

        // if(this.helpLayer1 != undefined)
        //     this.helpLayer1.clearResult();
        //
        // if(this.helpLayer2 != undefined)
        //     this.helpLayer2.clearResult();

        for(var hpi = 0; hpi < this.lstHelp.length; ++hpi) {
            var helplayer = this.lstHelp[hpi];

            if(helplayer.clearResult != undefined)
                helplayer.clearResult.clearResult();
        }

        var mineff = -1;
        var mineff2 = -1;

        this.fixWinResult();

        for(var ii = 0; ii < this.fwinresult.length; ++ii) {
            var node = this.fwinresult[ii];

            if(node.Type == "Line") {
                var lindex = node.Data.Line;

                if(this.lstSprLine != undefined && this.lstSprLine.length > 0)
                    this.lstSprLine[lindex - 1].setVisible(true);

                if(this.lstBtnLBlue != undefined && this.lstBtnLBlue > 0)
                    this.lstBtnLBlue[lindex - 1].setVisible(true);
            }

            for(var jj = 0; jj < node.Positions.length; ++jj) {
                var x = node.Positions[jj].X;
                var y = 1 - node.Positions[jj].Y;

                this.lstwheel[x].showTop(y);
            }

            var type = (node.Type == "Line" ? 0 : 1);
            var symbol = this.lstSymbol[node.Symbol];
            var line = 0;
            var num = node.Positions.length;

            if(node.Data != undefined && node.Data.Line != undefined)
                line = node.Data.Line;
            else
                line = 0;

            for(var hpi = 0; hpi < this.lstHelp.length; ++hpi) {
                var helplayer = this.lstHelp[hpi];

                if(helplayer.setResult != undefined)
                    helplayer.setResult(type, symbol, line, num);
            }

            // if(this.helpLayer1 != undefined)
            //     this.helpLayer1.setResult(type, symbol, line, num);
            //
            // if(this.helpLayer2 != undefined)
            //     this.helpLayer2.setResult(type, symbol, line, num);

            var eff = symbol - 1;

            // if(eff >= this.lstWinEffect.length)
            //     eff = this.lstWinEffect.length - 1;

            if(mineff < 0 || eff < mineff) {
                if(mineff >= 0) {
                    if(mineff2 < 0 || mineff < mineff2)
                        mineff2 = mineff;
                }

                mineff = eff;
            }
        }

        //this.playWinEffect();

        // if(mineff >= 0 && mineff < 7) {
        //     //this.WinAni6 = ccs.load(res.KofWinAni6_json);
        //     this.WinAni6 = ccs.load(this.lstWinAni6[mineff]);
        //
        //     // var sprPerson = findNodeByName(this.WinAni6.node, "sprPerson");
        //     //
        //     // var frame = cc.spriteFrameCache.getSpriteFrame("kofwinani4_person" + (mineff + 1).toString() + ".png");
        //     // sprPerson.setSpriteFrame(frame);
        //
        //     this.GameLayer.node.addChild(this.WinAni6.node, 1);
        //     this.WinAni6.node.runAction(this.WinAni6.action);
        //     this.WinAni6.action.gotoFrameAndPlay(0, this.WinAni6.action.getDuration(), false);
        // }

        //! 计算胜利倍数
        var winmul = this.iWin / (this.lstBet[this.runBet] * this.runLine);

        if(this.bFreeGame && this.iFreeMul > 1)
            winmul = (this.iWin * this.iFreeMul) / (this.lstBet[this.runBet] * this.runLine);

        var wintype = 0;

        // if(winmul >= 17)
        //     wintype = 3;
        // else if(winmul >= 7)
        //     wintype = 2;
        // else if(winmul >= 3)
        //     wintype = 1;
        //
        // this.playWinEffectByWinType(wintype);

        if(this.WinAni2 == undefined && wintype < this.lstWinAni.length) {
            this.WinAni2 = CcsResCache.singleton.load(this.lstWinAni[wintype]);

            var wstr = this.chgString(this.iWin);

            var textNum1 = findNodeByName(this.WinAni2.node, "textNum1");
            //textNum1.setString(wstr);

            if(this.bFreeGame && this.iFreeMul > 1) {
                textNum1.setString(wstr + "X" + this.iFreeMul);
                this.iWin *= this.iFreeMul;
            }
            else
                textNum1.setString(wstr);

            var nodeGold = findNodeByName(this.WinAni2.node, "nodeGold");

            if(nodeGold != undefined && nodeGold != null) {
                //this.addGoldAni(nodeGold, 30, 48 / 24);
                this.addGoldAni(nodeGold, this.lstAniGoldNum[wintype], this.lstAniGoldIndex[wintype]);
            }

            if(wintype == 0) {
                var pindex = Math.floor(Math.random() * 5);

                if(pindex < 0)
                    pindex = 0;

                if(pindex >= 5)
                    pindex = 4;

                pindex += 8;
                var frame = undefined;

                if(pindex < 10)
                    frame = cc.spriteFrameCache.getSpriteFrame("narutowin1_0" + pindex + ".jpg");
                else
                    frame = cc.spriteFrameCache.getSpriteFrame("narutowin1_" + pindex + ".jpg");

                if(frame != undefined && frame != null) {
                    var sprPic = findNodeByName(this.WinAni2.node, "sprPic");
                    sprPic.setSpriteFrame(frame);
                }
            }

            //this.GameLayer.node.addChild(this.WinAni2.node, 2);
            //this.nodeWin0.addChild(this.WinAni2.node);
            this.WinAni2.node.runAction(this.WinAni2.action);
            this.WinAni2.action.gotoFrameAndPlay(0, this.WinAni2.action.getDuration(), false);
        }

        // var wintype = 0;
        //
        // if(this.WinAni2 == undefined && wintype < this.lstWinAni.length) {
        //     this.WinAni2 = ccs.load(this.lstWinAni[wintype]);
        //
        //     var wstr = this.chgString(this.iWin);
        //
        //     var textNum1 = findNodeByName(this.WinAni2.node, "textNum1");
        //     textNum1.setString(wstr);
        //
        //     this.GameLayer.node.addChild(this.WinAni2.node, 2);
        //     this.WinAni2.node.runAction(this.WinAni2.action);
        //     this.WinAni2.action.gotoFrameAndPlay(0, this.WinAni2.action.getDuration(), false);
        // }

        this.bShowResult = true;
        this.iShowResultIndex = -1;
        this.ShowResultTime = 3;

        this.refreshFreeInfo();
    },

    onTouchDisable : function () {
        if(this.WinAni2) {
            //! 关闭胜利动画
            this.onTouchExitPanel();
        }
    },

    onTouchAutoSelectLayer : function () {
        this.nodeAutoBack.setVisible(false);
        //this.layAutoSelect.setVisible(false);
    },

    onTouchExitPanel : function (sender, type) {
        // if (type != ccui.Widget.TOUCH_ENDED)
        //     return;

        if(!this.WinAni2)
            return ;

        // this.WinAni2.node.stopAllActions();
        // this.GameLayer.node.removeChild(this.WinAni2.node);
        CcsResCache.singleton.release(this.WinAni2);
        this.WinAni2 = undefined;
        //this.layDisable.setVisible(false);

        this.bShowResult = false;

        this.WaitAutoTime = 0.1;
        //this.DisRunTime = 0.1;

        this.refreshInfo();
        GameMgr.singleton.showGiftGame(this.canShowGiftGame());

        if(!this.bFreeGame)
            this.setWin_auto(this.iWin);
    },

    update_ShowResult : function (dt) {
        if(!this.bShowResult)
            return ;

        if(this.ShowLineTime > 0)
            return ;

        this.ShowResultTime -= dt;

        if(this.ShowResultTime <= 0) {
            ++this.iShowResultIndex;

            if(this.iShowResultIndex >= this.fwinresult.length)
                this.iShowResultIndex = 0;

            for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                this.lstwheel[ii].clearTop();
            }

            if(this.lstSprLine != undefined && this.lstSprLine.length > 0) {
                for(var ii = 0; ii < this.lstSprLine.length; ++ii) {
                    this.lstSprLine[ii].setVisible(false);
                }
            }

            if(this.lstBtnLBlue != undefined) {
                for(var ii = 0; ii < this.lstBtnLBlue.length; ++ii) {
                    this.lstBtnLBlue[ii].setVisible(false);
                }
            }

            var node = this.fwinresult[this.iShowResultIndex];

            if(node.Type == "Line") {
                var lindex = node.Data.Line;

                if(this.lstSprLine != undefined && this.lstSprLine.length > 0)
                    this.lstSprLine[lindex - 1].setVisible(true);

                if(this.lstBtnLBlue != undefined && this.lstBtnLBlue.length > 0)
                    this.lstBtnLBlue[lindex - 1].setVisible(true);
            }

            this.clearWaitWinAni();

            var wtime = 0;
            var lx = 0;
            var ly = 0;

            var lstfire = [];

            for(var jj = 0; jj < 5; ++jj) {
                var fires = [];

                for(var kk = 0; kk < 3; ++kk) {
                    fires.push(false);
                }

                lstfire.push(fires);
            }

            for(var jj = 0; jj < node.Positions.length; ++jj) {
                var x = node.Positions[jj].X;
                var y = 1 - node.Positions[jj].Y;

                this.lstwheel[x].showTop(y);

                //! 前几个点的移动动画
                if(jj < node.Positions.length - 1) {
                    var wani = {};
                    var wspr = this.lstwheel[x].getTopSprite(y);
                    
                    var nx = node.Positions[jj + 1].X;
                    var ny = 1 - node.Positions[jj + 1].Y;

                    var aindex = 2 - (y - ny);

                    wani.type = 0;
                    wani.time = wtime;
                    wani.res = res["OnePieceMoveAni" + aindex + "_json"];
                    wani.x = wspr.getPositionX();
                    wani.y = wspr.getPositionY();
                    wani.layer = this.lstwheel[x].layTopWheel;
                    wani.ani = undefined;

                    this.lstWaitWinAni.push(wani);
                    
                    if(!lstfire[x][y]) {
                        var wani1 = {};

                        wani1.type = 1;
                        wani1.time = wtime;
                        wani1.res = res["OnePieceFireAni0_json"];
                        wani1.x = wspr.getPositionX();
                        wani1.y = wspr.getPositionY();
                        wani1.layer = this.lstwheel[x].layTopWheel;
                        wani1.ani = undefined;

                        this.lstWaitWinAni.push(wani1);

                        lstfire[x][y] = true;

                        var wani2 = {};

                        wani2.type = 2;
                        wani2.time = wtime;
                        wani2.res = res["OnePieceFireAni1_json"];
                        wani2.x = wspr.getPositionX();
                        wani2.y = wspr.getPositionY();
                        wani2.layer = this.lstwheel[x].layTopWheel;
                        wani2.ani = undefined;

                        this.lstWaitWinAni.push(wani2);

                        lstfire[x][y] = true;
                    }

                    if(!lstfire[nx][ny]) {
                        var nspr = this.lstwheel[nx].getTopSprite(ny);

                        var wani1 = {};

                        wani1.type = 1;
                        wani1.time = wtime + 2 / 12;
                        wani1.res = res["OnePieceFireAni0_json"];
                        wani1.x = nspr.getPositionX();
                        wani1.y = nspr.getPositionY();
                        wani1.layer = this.lstwheel[nx].layTopWheel;
                        wani1.ani = undefined;

                        this.lstWaitWinAni.push(wani1);

                        var wani2 = {};

                        wani2.type = 2;
                        wani2.time = wtime + 2 / 12;
                        wani2.res = res["OnePieceFireAni1_json"];
                        wani2.x = nspr.getPositionX();
                        wani2.y = nspr.getPositionY();
                        wani2.layer = this.lstwheel[nx].layTopWheel;
                        wani2.ani = undefined;

                        this.lstWaitWinAni.push(wani2);

                        lstfire[nx][ny] = true;
                    }
                }
                else {
                    lx = x;
                    ly = y;
                }

                wtime += 2 / 12;
                
                // var wani = {};
                //
                // wani.spr = this.lstwheel[x].getTopSprite(y);
                // wani.time = jj / 12;
                // wani.type = 0;
                // wani.ani = undefined;
                //
                // this.lstWaitWinAni.push(wani);
                //
                // if(jj == 2) {
                //     var wani1 = {};
                //
                //     wani1.spr = this.lstwheel[x].getTopSprite(y);
                //     wani1.time = 5 / 24;
                //     wani1.type = 1;
                //     wani1.num = node.Win;
                //     wani1.ani = undefined;
                //
                //     this.lstWaitWinAni.push(wani1);
                // }
            }

            // //! 后续节点
            // for(var jj = 0; jj < node.lstLine.length; ++jj) {
            //     var btime = wtime;
            //     var bx = lx;
            //     var by = ly;
            //
            //     for(var kk = node.Positions.length; kk < 5; ++kk) {
            //         var x = bx;
            //         var y = by;
            //
            //         var nx = node.lstLine[jj][kk].X;
            //         var ny = 1 - node.lstLine[jj][kk].Y;
            //
            //         var wani = {};
            //         var wspr = this.lstwheel[x].getTopSprite(y);
            //
            //         var aindex = 2 - (y - ny);
            //
            //         wani.type = 0;
            //         wani.time = btime;
            //         wani.res = res["OnePieceMoveAni" + aindex + "_json"];
            //         wani.x = wspr.getPositionX();
            //         wani.y = wspr.getPositionY();
            //         wani.layer = this.lstwheel[x].layTopWheel;
            //         wani.ani = undefined;
            //
            //         this.lstWaitWinAni.push(wani);
            //
            //         // if(!lstfire[x][y]) {
            //         //     var wani1 = {};
            //         //
            //         //     wani1.type = 1;
            //         //     wani1.time = btime;
            //         //     wani1.res = res["OnePieceFireAni0_json"];
            //         //     wani1.x = wspr.getPositionX();
            //         //     wani1.y = wspr.getPositionY();
            //         //     wani1.layer = this.lstwheel[x].layTopWheel;
            //         //     wani1.ani = undefined;
            //         //
            //         //     this.lstWaitWinAni.push(wani1);
            //         //
            //         //     lstfire[x][y] = true;
            //         // }
            //
            //         // if(!lstfire[nx][ny]) {
            //         //     var nspr = this.lstwheel[nx].getTopSprite(ny);
            //         //     this.lstwheel[nx].showTopIcon(ny);
            //         //
            //         //     var wani1 = {};
            //         //
            //         //     wani1.type = 1;
            //         //     wani1.time = btime + 2 / 12;
            //         //     wani1.res = res["OnePieceFireAni0_json"];
            //         //     wani1.x = nspr.getPositionX();
            //         //     wani1.y = nspr.getPositionY();
            //         //     wani1.layer = this.lstwheel[nx].layTopWheel;
            //         //     wani1.ani = undefined;
            //         //
            //         //     this.lstWaitWinAni.push(wani1);
            //         //
            //         //     lstfire[nx][ny] = true;
            //         // }
            //
            //         btime += 2 / 12;
            //         bx = nx;
            //         by = ny;
            //     }
            // }

            // if(node.Positions.length < 3) {
            //     var jj = node.Positions.length - 1;
            //
            //     var x = node.Positions[jj].X;
            //     var y = 1 - node.Positions[jj].Y;
            //
            //     var wani1 = {};
            //
            //     wani1.spr = this.lstwheel[x].getTopSprite(y);
            //     wani1.time = 5 / 24;
            //     wani1.type = 1;
            //     wani1.num = node.Win;
            //     wani1.ani = undefined;
            //
            //     this.lstWaitWinAni.push(wani1);
            // }

            this.ShowResultTime = 2.5;
        }
    },

    //! 清除结果显示
    clearResultDis : function () {
        //cc.audioEngine.playEffect(res.TlodClearWheel_mp3, false);

        for(var ii = 0; ii < this.lstwheel.length; ++ii) {
            this.lstwheel[ii].clearIcon();
        }

        // if(this.nodeWheelEndAni != undefined && this.nodeWheelEndAni != null) {
        //     if(this.WheelEndAni == undefined) {
        //         this.WheelEndAni = ccs.load(res.DBZEndAni2_json);
        //
        //         this.nodeWheelEndAni.addChild(this.WheelEndAni.node);
        //         this.WheelEndAni.node.runAction(this.WheelEndAni.action);
        //         this.WheelEndAni.action.gotoFrameAndPlay(0, this.WheelEndAni.action.getDuration(), false);
        //     }
        //
        //     if(this.WheelBeginAni != undefined) {
        //         this.WheelBeginAni.node.stopAllActions();
        //         this.nodeWheelBeginAni.removeChild(this.WheelBeginAni.node);
        //         this.WheelBeginAni = undefined;
        //     }
        // }

        this.iHitsNum = 0;
        this.setHits(this.iHitsNum);

        // this.bShowResult = false;
        //
        // if(this.helpLayer1 != undefined)
        //     this.helpLayer1.clearResult();
        //
        // if(this.helpLayer2 != undefined)
        //     this.helpLayer2.clearResult();
        //
        // for(var ii = 0; ii < this.lstwheel.length; ++ii) {
        //     this.lstwheel[ii].setState(0);
        // }
        //
        // if(this.lstSprLine != undefined && this.lstSprLine.length > 0) {
        //     for(var ii = 0; ii < this.lstSprLine.length; ++ii) {
        //         this.lstSprLine[ii].setVisible(false);
        //     }
        // }
        //
        // if(this.lstBtnLBlue != undefined) {
        //     for(var ii = 0; ii < this.lstBtnLBlue.length; ++ii) {
        //         this.lstBtnLBlue[ii].setVisible(false);
        //     }
        // }
        //
        // this.clearWaitWinAni();
    },

    //! 清除等待胜利动画
    clearWaitWinAni : function() {
        for(var ii = 0; ii < this.lstWaitWinAni.length; ++ii) {
            var wani = this.lstWaitWinAni[ii];

            if(wani.ani != undefined) {
                wani.ani.node.stopAllActions();
                wani.ani.node.getParent().removeChild(wani.ani.node);
                wani.ani = undefined;
            }
        }

        this.lstWaitWinAni = [];
    },

    //! 胜利动画计时
    update_WinAni : function(dt) {
        if(!this.bShowResult) {
            return ;
        }

        for(var ii = 0; ii < this.lstWaitWinAni.length; ++ii) {
            var wani = this.lstWaitWinAni[ii];

            if(wani.time < 0)
                continue ;

            wani.time -= dt;

            if(wani.time < 0) {
                if(wani.type == 0) {
                    var winani = ccs.load(wani.res);

                    wani.layer.addChild(winani.node, 2);
                    winani.node.setPosition(wani.x, wani.y);
                    winani.node.runAction(winani.action);
                    winani.action.gotoFrameAndPlay(0, winani.action.getDuration(), false);

                    wani.ani = winani;
                }
                else if(wani.type == 1) {
                    var winani = ccs.load(wani.res);

                    wani.layer.addChild(winani.node, 3);
                    winani.node.setPosition(wani.x, wani.y);
                    winani.node.runAction(winani.action);
                    winani.action.gotoFrameAndPlay(0, winani.action.getDuration(), true);

                    wani.ani = winani;
                }
                else if(wani.type == 2) {
                    var winani = ccs.load(wani.res);

                    wani.layer.addChild(winani.node, 0);
                    winani.node.setPosition(wani.x, wani.y);
                    winani.node.runAction(winani.action);
                    winani.action.gotoFrameAndPlay(0, winani.action.getDuration(), true);

                    wani.ani = winani;
                }
            }
        }
    },

    showHelp : function(index) {
        for(var ii = 0; ii < this.lstHelp.length; ++ii) {
            this.lstHelp[ii].setVisible(ii == index - 1);
        }
        // if(index == 0) {
        //     if(this.helpLayer1 != undefined)
        //         this.helpLayer1.setVisible(false);
        //
        //     if(this.helpLayer2 != undefined)
        //         this.helpLayer2.setVisible(false);
        //
        //     if(this.helpLayer3 != undefined)
        //         this.helpLayer3.setVisible(false);
        //
        //     if(this.helpLayer4 != undefined)
        //         this.helpLayer4.setVisible(false);
        // }
        // else if(index == 1) {
        //     if(this.helpLayer1 != undefined)
        //         this.helpLayer1.setVisible(true);
        //
        //     if(this.helpLayer2 != undefined)
        //         this.helpLayer2.setVisible(false);
        //
        //     if(this.helpLayer3 != undefined)
        //         this.helpLayer3.setVisible(false);
        //
        //     if(this.helpLayer4 != undefined)
        //         this.helpLayer4.setVisible(false);
        // }
        // else if(index == 2) {
        //     if(this.helpLayer1 != undefined)
        //         this.helpLayer1.setVisible(false);
        //
        //     if(this.helpLayer2 != undefined)
        //         this.helpLayer2.setVisible(true);
        //
        //     if(this.helpLayer3 != undefined)
        //         this.helpLayer3.setVisible(false);
        //
        //     if(this.helpLayer4 != undefined)
        //         this.helpLayer4.setVisible(false);
        // }
        // else if(index == 3) {
        //     if(this.helpLayer1 != undefined)
        //         this.helpLayer1.setVisible(false);
        //
        //     if(this.helpLayer2 != undefined)
        //         this.helpLayer2.setVisible(false);
        //
        //     if(this.helpLayer3 != undefined)
        //         this.helpLayer3.setVisible(true);
        //
        //     if(this.helpLayer4 != undefined)
        //         this.helpLayer4.setVisible(false);
        // }
        // else if(index == 4) {
        //     if(this.helpLayer1 != undefined)
        //         this.helpLayer1.setVisible(false);
        //
        //     if(this.helpLayer2 != undefined)
        //         this.helpLayer2.setVisible(false);
        //
        //     if(this.helpLayer3 != undefined)
        //         this.helpLayer3.setVisible(false);
        //
        //     if(this.helpLayer4 != undefined)
        //         this.helpLayer4.setVisible(true);
        // }
    },

    beforeHelp : function (index) {
        var ni = index - 1;

        if(ni <= 0)
            ni = this.lstHelp.length;

        this.showHelp(ni);
    },

    nextHelp : function (index) {
        var ni = index + 1;

        if(ni >= this.lstHelp.length + 1)
            ni = 1;

        this.showHelp(ni);
    },

    //! 按钮动画
    update_BtnAni : function(dt) {
        return ;

        this.BtnAniTime += dt;

        //! 英雄动画
        if(this.sprHero != undefined && this.sprHero != null) {
            var halltime = 8;
            var htime = (Math.floor(this.BtnAniTime * 10000) % (halltime * 10000)) / 10000;

            if(htime > halltime / 2)
                htime = halltime - htime;

            var hx = 1280 + 8 * htime * 2 / halltime;
            var hy = -16 + 12 * htime * 2 / halltime;

            this.sprHero.setPosition(hx, hy);
        }

        //! 船舵动画
        if(this.sprDarts != undefined && this.sprDarts != null) {
            var crot = this.sprDarts.getRotation();

            if(this.iDartsTime > 0) {
                var ct = dt;

                if(dt > this.iDartsTime)
                    ct = this.iDartsTime;

                this.iDartsTime -= dt;

                crot += this.iDartsRotation * ct;
                this.sprDarts.setRotation(crot);
            }
            else {
                this.iDartsTime = Math.random() * 2 + 2;
                var chgr = Math.random() * 60 + 20;

                if(Math.random() > 0.5)
                    chgr = -chgr;

                if(crot + chgr > 90 || crot + chgr < -90)
                    chgr = -chgr;

                this.iDartsRotation = chgr / this.iDartsTime;
            }
        }

        var ii = 0;

        // if(this.btnRun.isVisible()/* || !this.btnStop.isEnabled()*/)
        //     ii = 0;
        // else
        //     ii = 1;

        var ctime = (Math.floor(this.BtnAniTime * 10000) % Math.floor(this.BtnScaleTime[ii] * 10000)) / 10000;
        //this.sprDarts.setRotation(ctime * 360 / this.BtnScaleTime[ii]);

        if(ctime > this.BtnScaleTime[ii] / 2) {
            ctime = this.BtnScaleTime[ii] - ctime;
        }

        var bscale = this.BtnScale[0] + (this.BtnScale[1] - this.BtnScale[0]) * ctime / (this.BtnScaleTime[ii] / 2);

        //this.btnRun.setScale(bscale);
        //this.btnStop.setScale(bscale);

        // if(!this.btnStop.isEnabled())
        //     this.btnStop.setScale(1);
    },

    //! 增加飞镖动画
    addDartsAni : function(index, time) {
        for(var ii = 0; ii < this.lstWaitDartsAni.length; ++ii) {
            if(this.lstWaitDartsAni[ii].index == index) {
                this.lstWaitDartsAni[ii].time = time;
                return ;
            }
        }

        var wani = {};

        wani.index = index;
        wani.time = time;

        this.lstWaitDartsAni.push(wani);
    },

    //! 飞镖动画计时
    update_Darts : function(dt) {
        return ;

        for(var ii = 0; ii < this.lstWaitDartsAni.length; ++ii) {
            var wani = this.lstWaitDartsAni[ii];
            wani.time -= dt;

            if(wani.time <= 0) {
                var dani = ccs.load(res["NarutoDartsAni" + (wani.index + 1) + "_json"]);
                this.lstDartsNode[wani.index].addChild(dani.node);
                dani.node.runAction(dani.action);
                dani.action.gotoFrameAndPlay(0, dani.action.getDuration(), false);

                this.lstPlayDartsAni.push(dani);

                this.lstWaitDartsAni.splice(ii, 1);
                --ii;
            }
        }

        for(var ii = 0; ii < this.lstPlayDartsAni.length; ++ii) {
            var dani = this.lstPlayDartsAni[ii];

            if(dani.action.getCurrentFrame() == dani.action.getDuration()) {
                dani.node.stopAllActions();
                dani.node.getParent().removeChild(dani.node);

                this.lstPlayDartsAni.splice(ii, 1);
                --ii;
            }
        }
    },

    //! 修正胜利结果
    fixWinResult : function() {
        this.fwinresult = [];

        for(var ii = 0; ii < this.winresult.length; ++ii) {
            var node = this.winresult[ii];
            var bfind = false;

            for(var jj = 0; jj < this.fwinresult.length; ++jj) {
                var fnode = this.fwinresult[jj];

                if(node.Positions.length != fnode.Positions.length)
                    continue ;

                var bsame = true;

                for(var kk = 0; kk < node.Positions.length; ++kk) {
                    if(node.Positions[kk].X != fnode.Positions[kk].X || node.Positions[kk].Y != fnode.Positions[kk].Y) {
                        bsame = false;
                        break;
                    }
                }

                if(bsame) {
                    if(node.Data != undefined && node.Data.Line != undefined) {
                        //fnode.lstLine.push(node.Data.Line);

                        // var lstpos = [];
                        // this.chgLine2Pos(node.Data.Line, 5, 3, lstpos);
                        // fnode.lstLine.push(lstpos);
                    }

                    fnode.Win += node.Win;
                    bfind = true;
                    break;
                }
            }

            if(!bfind) {
                var fnode = {};

                fnode.Type = node.Type;
                fnode.Positions = node.Positions;
                fnode.Symbol = node.Symbol;
                fnode.Win = node.Win;

                if(node.Data != undefined)
                    fnode.Data = node.Data;

                // fnode.lstLine = [];
                //
                // if(node.Data != undefined) {
                //     fnode.Data = node.Data;
                //
                //     if(node.Data.Line != undefined) {
                //         //fnode.lstLine.push(node.Data.Line);
                //
                //         var lstpos = [];
                //         this.chgLine2Pos(node.Data.Line, 5, 3, lstpos);
                //         fnode.lstLine.push(lstpos);
                //     }
                // }

                this.fwinresult.push(fnode);
            }
        }
    },

    //! 把Line转换成位置
    chgLine2Pos : function(line, width, height, lstpos) {
        var num = 1;

        for(var ii = 0; ii < width; ++ii) {
            num *= height;
        }

        for(var ii = 0; ii < width; ++ii) {
            var pos = {};

            pos.X = ii;
            pos.Y = Math.floor((line - 1)% num / (num / height));

            lstpos.push(pos);
            num /= height;
        }
    },
    
    //! 播放转场动画
    playTransAni : function () {
        this.TransAni = ccs.load(res.OnePieceTransAni1_json);

        this.GameLayer.node.addChild(this.TransAni.node, 10);
        this.TransAni.node.runAction(this.TransAni.action);
        this.TransAni.action.gotoFrameAndPlay(0, this.TransAni.action.getDuration(), false);
    },

    //! 金币动画相关
    //! 添加金币动画
    addGoldAni : function (root, num, index) {
        for(var ii = 0; ii < num; ++ii) {
            var node = {};

            node.root = root;
            node.time = index;
            node.ani = undefined;
            node.bx = Math.random() * 100 - 50;
            node.by = Math.random() * 100 - 50;
            //node.scale = 1.5 + Math.random() * 0.2;
            node.scale = 1 + Math.random() * 0.2;
            node.rotation = Math.random() * 360;

            var mlen = (Math.random() * 500 + 100) / 2;
            var blen = Math.sqrt(node.bx * node.bx + node.by * node.by);
            var ex = node.bx * (blen + mlen) / blen;
            var ey = node.by * (blen + mlen) / blen;

            node.sx = (ex - node.bx) / 10;
            node.sy = (ey - node.by) / 10;

            this.lstGoldAni.push(node);
        }
    },

    //! 金币动画计时
    update_GoldAni : function (dt) {
        return ;
        if(this.WinAni2 == undefined) {
            for(var ii = 0; ii < this.lstGoldAni.length; ++ii) {
                var node = this.lstGoldAni[ii];

                if (node.ani != undefined) {
                    node.ani.node.stopAllActions();

                    if(node.ani.node.getParent() != undefined && node.ani.node.getParent() != null)
                        node.ani.node.getParent().removeChild(node.ani.node);
                }
            }

            this.lstGoldAni.splice(0, this.lstGoldAni.length);
        }
        else {
            var cindex = this.WinAni2.action.getCurrentFrame();

            for(var ii = 0; ii < this.lstGoldAni.length; ) {
                var node = this.lstGoldAni[ii];

                if(node.ani != undefined) {
                    if(node.ani.action.getCurrentFrame() == node.ani.action.getDuration()){
                        node.ani.node.stopAllActions();
                        node.ani.node.getParent().removeChild(node.ani.node);

                        this.lstGoldAni.splice(ii, 1);
                        continue ;
                    }
                    else {
                        var cx = node.ani.node.getPositionX();
                        var cy = node.ani.node.getPositionY();

                        node.ani.node.setPosition(cx + node.sx, cy + node.sy);
                    }
                }
                else {
                    if(node.time <= cindex) {
                        node.ani = ccs.load(res.OnePieceGoldAni1_json);

                        node.ani.node.setPosition(node.bx, node.by);
                        node.ani.node.setScale(node.scale);
                        node.ani.node.setRotation(node.rotation);
                        node.root.addChild(node.ani.node);
                        node.ani.node.runAction(node.ani.action);
                        node.ani.action.gotoFrameAndPlay(0, node.ani.action.getDuration(), false);
                    }
                }

                ++ii;
            }
        }
    },

    //! 刷新免费游戏的信息显示
    refreshFreeInfo : function () {
        if(this.bRun)
            this.iFreeMul = 0;

        if(this.sprFreeMul != undefined && this.sprFreeMul != null) {
            this.sprFreeMul.setVisible(this.iFreeMul > 1);

            if(this.textFreeMul != undefined && this.textFreeMul != null)
                this.textFreeMul.setString("X" + this.iFreeMul);
        }


        if(this.sprFreeAdd != undefined && this.sprFreeAdd != null) {
            this.sprFreeAdd.setVisible(this.iFreeAdd > 0);

            if(this.textFreeAdd != undefined && this.textFreeAdd != null)
                this.textFreeAdd.setString("#" + this.iFreeAdd);
        }
    },

    //! 判断一个轮子是否需要亮起来
    canLight : function (index) {
        if(index == 0)
            return ;

        var c1num = 0;

        for(var ii = 0; ii < index; ++ii) {
            if(!this.lstwheel[ii].hasIcon(this.lstSymbol.C1, -1, 1) && !this.lstwheel[ii].hasIcon(this.lstSymbol.WW, -1, 1))
                return false;

            ++c1num;
        }

        return c1num < 3;
    },

    //! 场景相关
    //! 设置场景
    setScene : function (type) {
        if(this.nodScene == undefined)
            return ;

        if(this.iCurScene != undefined && type == this.iCurScene)
            return ;

        this.iCurScene = type;

        //this.nodScene.removeAllChildren();

        for(var ii = 0; ii < this.lstSceneNode.length; ++ii) {
            var lst = this.lstSceneNode[ii];

            for(var jj = 0; jj < lst.length; ++jj) {
                this.nodScene.removeChild(lst[jj]);
            }
        }

        this.lstSceneNode = [];
        this.lstSceneSpeed = [];

        if(type == 1) {
            if(this.nodeFreeBack != undefined && this.nodeFreeBack != null)
                this.nodeFreeBack.setVisible(false);

            //! 三层
            for(var ii = 1; ii <= 3; ++ii) {
                var sname = 'dbzgamescene1_' + ii + '.png';

                var lst = [];

                for(var jj = 0; jj < 2; ++jj) {
                    var spr = new cc.Sprite();
                    var frame = cc.spriteFrameCache.getSpriteFrame(sname);
                    var fsize = frame.getOriginalSizeInPixels();

                    spr.setAnchorPoint(0, 0);
                    spr.setSpriteFrame(frame);
                    spr.setScale(1280 / fsize.width);
                    spr.setPosition(1280 * jj, 0);

                    this.nodScene.addChild(spr, ii);
                    lst.push(spr);
                }

                this.lstSceneNode.push(lst);
            }

            this.lstSceneSpeed = [25, 50, 75];
        }
        else if(type == 2) {
            if(this.nodeFreeBack != undefined && this.nodeFreeBack != null)
                this.nodeFreeBack.setVisible(true);

            for(var ii = 1; ii <= 1; ++ii) {
                var sname = 'dbzgamescene2_' + ii + '.jpg';

                var lst = [];

                for(var jj = 0; jj < 2; ++jj) {
                    var spr = new cc.Sprite();
                    var frame = cc.spriteFrameCache.getSpriteFrame(sname);
                    var fsize = frame.getOriginalSizeInPixels();

                    spr.setAnchorPoint(0, 0);
                    spr.setSpriteFrame(frame);
                    spr.setScale(1280 / fsize.width);
                    spr.setPosition(1280 * jj, 0);

                    this.nodScene.addChild(spr, ii);
                    lst.push(spr);
                }

                this.lstSceneNode.push(lst);
            }

            this.lstSceneSpeed = [0];
        }
    },

    //! 改变场景
    chgScene : function (index) {
        if(index == this.iSceneState)
            return ;

        this.iSceneState = index;

        for(var ii = 0; ii < this.lstSceneNode.length; ++ii) {
            var sres = this.lstSceneNode[ii];

            if(this.lstSceneFrame[index][ii][0] == this.lstSceneFrame[index][ii][1])
                sres.action.gotoFrameAndPlay(this.lstSceneFrame[index][ii][0], this.lstSceneFrame[index][ii][1], false);
            else
                sres.action.gotoFrameAndPlay(this.lstSceneFrame[index][ii][0], this.lstSceneFrame[index][ii][1], this.lstSceneLoop[index]);

            sres.node.setVisible(this.lstSceneShow[index][ii]);
        }

        this.iHuaTime = 0;

        if(index == 1 || index == 3)
            this.setHits(-1);
        else {
            if(this.iHitsNum)
                this.setHits(this.iHitsNum);
        }

        // if(this.iSceneState == 0) {
        //     this.aniHua0.animation.play("hua-xunhuan");
        //     this.aniHua0.setVisible(true);
        //     this.aniHua1.setVisible(false);
        // }
        // else if(this.iSceneState == 2) {
        //     this.aniHua1.animation.play("hua-xunhuan");
        //     this.aniHua0.setVisible(false);
        //     this.aniHua1.setVisible(true);
        // }
    },

    //! 场景计时
    update_Scene : function (dt) {
        var ostate = this.GameScene.getState();

        this.GameScene.update(dt);

        var cstate = this.GameScene.getState();

        if(ostate == 1) {
            if(cstate == 2) {
                this.bPasueWheel = false;

                if(this.iHitsNum)
                    this.setHits(this.iHitsNum);
            }
        }
        else if(ostate == 3) {
            if(cstate == 0) {
                this.bPasueWheel = false;

                if(this.iHitsNum)
                    this.setHits(this.iHitsNum);
            }
        }

        return ;

        this.update_Hua(dt);

        if(!this.lstSceneChg[this.iSceneState])
            return;

        //! 是否所有的动画都结束了
        for(var ii = 0; ii < this.lstSceneNode.length; ++ii) {
            var sres = this.lstSceneNode[ii];

            if(sres.action.getCurrentFrame() != this.lstSceneFrame[this.iSceneState][ii][1])
                return;
        }

        //! 全结束了
        if(this.iSceneState == 1) {
            //this.clearHis();
            this.refreshHis();
            //this.chgScene(2);
            this.GameScene.setState(2);

            this.bPasueWheel = false;

            // if(this.bQuickDown != undefined && !this.bQuickDown)
            //     this.bPasueWheel = false;
        }
        else if(this.iSceneState == 3) {
            //this.clearHis();
            this.refreshHis();
            //this.chgScene(0);
            this.GameScene.setState(0);

            this.bPasueWheel = false;

            // if(this.bQuickDown != undefined && !this.bQuickDown)
            //     this.bPasueWheel = false;
        }
    },

    update_Hua : function (dt) {
        var otime = this.iHuaTime;
        this.iHuaTime += dt;
        var si = this.iSceneState;

        for(var ii = 0; ii < this.lsthuaani0[si].length; ++ii) {
            var aobj = this.lsthuaani0[si][ii];

            if(otime <= aobj.time && this.iHuaTime > aobj.time) {
                this.aniHua0.setVisible(aobj.bshow);
                this.aniHua0.animation.play(aobj.ani, -1, aobj.loop);
                break;
            }
        }

        for(var ii = 0; ii < this.lsthuaani1[si].length; ++ii) {
            var aobj = this.lsthuaani1[si][ii];

            if(otime <= aobj.time && this.iHuaTime > aobj.time) {
                this.aniHua1.setVisible(aobj.bshow);
                this.aniHua1.animation.play(aobj.ani, -1, aobj.loop);
                break;
            }
        }
    },

    // //! 场景改变
    // chgScene : function (dest, time) {
    //     return ;
    //
    //     this.iChgSceneIndex = 0;
    //     this.curChgSceneTime = 0;
    //     this.allChgSceneTime = time;
    //     this.iDestScene = dest;
    //
    //     if(this.sprChgScene == undefined) {
    //         this.sprChgScene = new cc.Sprite();
    //
    //         var sname = 'dbzchgscene' + (this.iChgSceneIndex + 1) + '.jpg';
    //         var frame = cc.spriteFrameCache.getSpriteFrame(sname);
    //         var fsize = frame.getOriginalSizeInPixels();
    //
    //         this.sprChgScene.setAnchorPoint(0, 0);
    //         this.sprChgScene.setSpriteFrame(frame);
    //         this.sprChgScene.setScaleX(1280 / fsize.width);
    //         this.sprChgScene.setScaleY(720 / fsize.height);
    //
    //         this.nodScene.addChild(this.sprChgScene, 100);
    //         this.sprChgScene.setOpacity(0);
    //     }
    // },
    //
    // //! 场景计时
    // update_Scene : function (dt) {
    //     return ;
    //
    //     if(this.nodScene == undefined || this.iCurScene == undefined)
    //         return ;
    //
    //     if(this.sprChgScene != undefined) {
    //         this.curChgSceneTime += dt;
    //
    //         if(this.curChgSceneTime >= this.allChgSceneTime) {
    //             this.nodScene.removeChild(this.sprChgScene);
    //             this.sprChgScene = undefined;
    //
    //             if(this.iCurFightState == 0)
    //                 this.refreshFightSatet();
    //         }
    //         else {
    //             if(this.curChgSceneTime - dt < this.allChgSceneTime / 2 && this.curChgSceneTime >= this.allChgSceneTime / 2)
    //                 this.setScene(this.iDestScene);
    //
    //             var opac = 255;
    //             var otime = 6 / 24;
    //
    //             if(this.curChgSceneTime <= otime) {
    //                 opac = Math.floor(this.curChgSceneTime * 255 / otime);
    //             }
    //             else if(this.allChgSceneTime - this.curChgSceneTime <= otime) {
    //                 opac = Math.floor((this.allChgSceneTime - this.curChgSceneTime) * 255 / otime);
    //             }
    //
    //             this.sprChgScene.setOpacity(opac);
    //
    //             var cindex = Math.floor(this.curChgSceneTime / (1 / 24)) % 4;
    //
    //             if(cindex != this.iChgSceneIndex) {
    //                 this.iChgSceneIndex = cindex;
    //
    //                 var sname = 'dbzchgscene' + (this.iChgSceneIndex + 1) + '.jpg';
    //                 var frame = cc.spriteFrameCache.getSpriteFrame(sname);
    //                 this.sprChgScene.setSpriteFrame(frame);
    //             }
    //         }
    //     }
    //
    //     for(var ii = 0; ii < this.lstSceneNode.length; ++ii) {
    //         if(this.lstSceneSpeed[ii] <= 0)
    //             continue ;
    //
    //         var lst = this.lstSceneNode[ii];
    //
    //         for(var jj = 0; jj < lst.length; ++jj) {
    //             var spr = lst[jj];
    //             spr.setPositionX(spr.getPositionX() - this.lstSceneSpeed[ii] * dt);
    //
    //             if(spr.getPositionX() <= -1280)
    //                 spr.setPositionX(spr.getPositionX() + 1280 * 2);
    //         }
    //     }
    // },

    //! 初始化的数据已经完成
    initFinish : function () {
        this.adjustMsg();

        if(GameMgr.singleton.showJackpotGame(true)) {
            this.refreshShowMoney(true);
            return ;
        }

        GameMgr.singleton.initGiftGame();
    },

    //! 收到游戏模块信息
    onGameModuleInfo : function(msgobj) {
        this.GameModuleInfo = msgobj;

        if(this.bJustStart)
            this.onGameModuleInfo1();
    },

    onGameModuleInfo1 : function() {
        if(this.GameModuleInfo == undefined)
            return ;

        var bjust = this.bJustStart;

        var msgobj = this.GameModuleInfo;
        this.GameModuleInfo = undefined;

        if(msgobj.gamemodulename == 'tlod_bg') {
            for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                for(var jj = 0; jj < 3; ++jj) {
                    var icon = msgobj.gmi.lstarr[jj][ii];
                    this.lstwheel[ii].setNewIcon(jj, icon);
                }

                // if(this.bJustStart) {
                //     this.lstwheel[ii].appearIcon();
                // }
            }

            if(this.bJustStart) {
                this.bJustStart = false;

                if(msgobj.gmi.spinret != undefined && msgobj.gmi.spinret.lst.length > 0) {
                    this.setRun(true);
                    this.refreshInfo();
                    this.setFightState(1);
                }

                this.iWin = msgobj.gmi.turnwin;
            }
            else {
                this.bNewIcon = true;
            }

            this.NewGameModuleInfo = msgobj.gmi;
            this.iNewWin = msgobj.gmi.turnwin;
            this.iHitsNum = msgobj.gmi.turnnums;

            if(msgobj.gmi.spinret != undefined)
                this.iTotalWin = msgobj.gmi.spinret.totalwin;
            else
                this.iTotalWin = 0;

            this.onHis(msgobj.gmi.history, false);
        }
        else if(msgobj.gamemodulename == 'tlod_fg') {
            for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                this.lstwheel[ii].setExState(0);

                for(var jj = 0; jj < 3; ++jj) {
                    var icon = msgobj.gmi.lstarr[jj][ii];
                    this.lstwheel[ii].setNewIcon(jj, icon);
                }

                // if(this.bJustStart) {
                //     this.lstwheel[ii].appearIcon();
                // }
            }

            if(this.bJustStart) {
                this.bJustStart = false;

                if(msgobj.gmi.bet != undefined && msgobj.gmi.bet > 0) {
                    this.iBet = 0;

                    for(var ii = 0; ii < this.lstBet.length; ++ii) {
                        if(this.lstBet[ii] == msgobj.gmi.bet) {
                            this.iBet = ii;
                            break;
                        }
                    }
                }

                if(msgobj.gmi.lines != undefined && msgobj.gmi.lines > 0) {
                    this.iLine = msgobj.gmi.lines;
                }

                if(this.iTimes != undefined && msgobj.gmi.times != undefined && msgobj.gmi.times > 0) {
                    this.iTimes = msgobj.gmi.times;
                }

                if(msgobj.gmi.spinret != undefined && msgobj.gmi.spinret.lst.length > 0) {
                    this.setRun(true);
                    //this.refreshInfo();
                    this.setFightState(1);
                }

                this.refreshInfo();

                this.bFreeGame = true;
                this.refreshHits();
                this.playOneMusic();

                this.bAutoRun = true;

                //this.chgScene(2);
                //this.setScene(2);
                this.GameScene.setState(2);

                this.iFreeNums = msgobj.gmi.lastnums;         //! 免费次数
                this.iTotalFreeNums = msgobj.gmi.totalnums;
                this.iFreeAll = msgobj.gmi.totalwin;
                this.iWin = msgobj.gmi.turnwin;
            }
            else {
                this.bNewIcon = true;
            }

            this.NewGameModuleInfo = msgobj.gmi;

            // this.iFreeNums = msgobj.gmi.lastnums;         //! 免费次数
            // this.iTotalFreeNums = msgobj.gmi.totalnums;
            // this.iFreeAll = msgobj.gmi.totalwin;

            this.iNewFreeNums = msgobj.gmi.lastnums;         //! 免费次数
            this.iNewTotalFreeNums = msgobj.gmi.totalnums;         //! 总的免费次数
            this.iNewFreeAll = msgobj.gmi.totalwin;          //! 免费赢的金额

            this.iNewWin = msgobj.gmi.turnwin;
            this.iHitsNum = msgobj.gmi.turnnums;

            if(msgobj.gmi.spinret != undefined)
                this.iTotalWin = msgobj.gmi.spinret.totalwin;
            else
                this.iTotalWin = 0;

            this.onHis(msgobj.gmi.history, true);
        }

        if(bjust) {
            this.setHits(this.iHitsNum);

            // if(this.iTotalWin != undefined && this.iHitsNum > 0)
            //     this.addHis(this.iTotalWin, this.iHitsNum);

            this.refreshHis();
            this.refreshInfo();
            // this.bPasueWheel = true;
            this.bWaitAppearTime = true;
        }
    },

    //! 轮子计时
    update_Wheel : function (dt) {
        if(!this.bRun) {
            if(this.WheelAniTime > 0) {
                this.WheelAniTime -= dt;

                if(this.WheelAniTime <= 0) {
                    for(var wi = 0; wi < 2; ++wi) {
                        var lstr = [];

                        for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                            if(!this.lstwheel[ii].canAddIconAni())
                                continue ;

                            lstr.push(ii);
                        }

                        while(lstr.length > 0) {
                            var ri = Math.floor(Math.random() * lstr.length);

                            if(this.lstwheel[lstr[ri]].randomIconAni(2)) {
                                break;
                            }
                            else {
                                lstr.splice(ri, 1);
                            }
                        }
                    }

                    this.WheelAniTime = Math.random() * 1 + 0.5;
                }
            }
        }

        if(this.WheelEndAni != undefined) {
            if(this.WheelEndAni.action.getCurrentFrame() == this.WheelEndAni.action.getDuration()) {
                this.WheelEndAni.node.stopAllActions();
                this.nodeWheelEndAni.removeChild(this.WheelEndAni.node);
                this.WheelEndAni = undefined;
            }

            if(this.WheelBeginAni == undefined) {
                this.WheelBeginAni = ccs.load(res.DBZBeginAni_json);

                this.nodeWheelBeginAni.addChild(this.WheelBeginAni.node);
                this.WheelBeginAni.node.runAction(this.WheelBeginAni.action);
                this.WheelBeginAni.action.gotoFrameAndPlay(0, this.WheelBeginAni.action.getDuration(), false);
            }
        }

        if(this.AddFreeAni != undefined) {
            if(this.AddFreeAni.action.getCurrentFrame() == this.AddFreeAni.action.getDuration()) {
                this.AddFreeAni.node.stopAllActions();
                this.GameLayer.node.removeChild(this.AddFreeAni.node);
                this.AddFreeAni = undefined;

                this.bPasueWheel = false;
            }
        }

        if(this.WinAni2 != undefined) {
            if(this.WinAni2.action.getCurrentFrame() == this.WinAni2.action.getDuration()) {
                // this.WinAni2.node.stopAllActions();
                // this.GameLayer.node.removeChild(this.WinAni2.node);
                CcsResCache.singleton.release(this.WinAni2);
                this.WinAni2 = undefined;
                //this.layDisable.setVisible(false);

                GameMgr.singleton.showGiftGame(this.canShowGiftGame());

                if(!this.bFreeGame)
                    this.setWin_auto(this.iWin);
            }
        }

        var allstate = 0;

        for(var ii = 0; ii < this.lstwheel.length; ++ii) {
            this.lstwheel[ii].update(dt);

            var wstate = this.lstwheel[ii].getCurState();

            if(allstate >= 0) {
                if(wstate >= 3)
                    allstate = -1;
                else
                    allstate = wstate;
            }
        }

        if(this.bQuickDown != undefined && this.bQuickDown) {
            if(allstate == 0) {
                if(this.bNewIcon) {
                    for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                        this.lstwheel[ii].quickAppearIcon();
                    }

                    this.bNewIcon = false;
                    this.bQuickDown = false;

                    if(this.bRun)
                        this.bPasueWheel = false
                }
            }
        }

        if(this.bPasueWheel)
            return ;

        if(allstate >= 0) {
            if(allstate == 0) {
                if(this.bNewIcon && !this.ModuleUI.isShowWin()) {
                    for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                        this.lstwheel[ii].appearIcon();
                    }

                    this.bNewIcon = false;
                }
            }
            else if(allstate == 1) {
                if(GameMgr.singleton.showJackpotGame())
                    return ;
                
                //! 判断需要消除
                if(this.NewGameModuleInfo != undefined) {
                    if(this.NewGameModuleInfo.spinret != undefined && this.NewGameModuleInfo.spinret.lst.length > 0) {
                        //! 准备进入免费
                        if(this.NewGameModuleInfo.spinret.lst.length == 1 && this.NewGameModuleInfo.spinret.lst[0].type == 'scatterex') {
                            var node = this.NewGameModuleInfo.spinret.lst[0];

                            for (var jj = 0; jj < node.positions.length; ++jj) {
                                var x = node.positions[jj].x;
                                var y = node.positions[jj].y;

                                this.lstwheel[x].exIcon(y);
                            }

                            for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                                this.lstwheel[ii].setCurState(0);
                                this.lstwheel[x].setExState(0);
                            }

                            this.bFreeGame = true;
                            this.refreshHits();
                            this.playOneMusic();
                            this.clearResultDis();

                            this.bAutoRun = true;

                            this.iFreeNums = 10;
                            this.iTotalFreeNums = 10;         //! 免费次数

                            this.setRun(false);
                            this.refreshInfo();
                            //this.chgScene(1);
                            this.GameScene.setState(1, 2);
                            this.setHits(-1);
                            this.bPasueWheel = true;
                            this.setFightState(4);

                            this.WaitAutoTime = 0;
                            this.beginAuto();
                        }
                        else {
                            for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                                this.lstwheel[ii].setCurState(2);
                            }

                            for(var ii = 0; ii < this.NewGameModuleInfo.spinret.lst.length; ++ii) {
                                var node = this.NewGameModuleInfo.spinret.lst[ii];

                                for (var jj = 0; jj < node.positions.length; ++jj) {
                                    var x = node.positions[jj].x;
                                    var y = node.positions[jj].y;

                                    this.lstwheel[x].disappearIcon(y);
                                }
                            }

                            this.ModuleUI.setWinData(this.NewGameModuleInfo.spinret.bet, this.NewGameModuleInfo.turnnums, this.NewGameModuleInfo.turnwin, this.NewGameModuleInfo.spinret.realwin, this.iNewMoney);
                            this.ModuleUI.showWin();
                            //this.bPasueWheel = true;

                            var self = this;
                            MainClient.singleton.newspin(GameMgr.singleton.getCurGameID(), -1, 1, -1, this.bFreeGame, function (isok) {
                                if (isok) {
                                    self.onGameModuleInfo1();
                                }
                            });

                            // var self = this;
                            // MainClient.singleton.spin(GameMgr.singleton.getCurGameID(), 1, 1, this.iLine, function (isok) {
                            //     if (isok) {
                            //         self.onGameModuleInfo1();
                            //     }
                            // });

                            var brefresh = false;

                            if(this.iNewWin != this.iWin) {
                                this.iWin = this.iNewWin;
                                brefresh = true;
                            }

                            this.setHits(this.iHitsNum);

                            // if(this.iTotalWin != undefined && this.iHitsNum > 0)
                            //     this.addHis(this.iTotalWin, this.iHitsNum);

                            this.refreshHis();

                            if(this.bFreeGame) {
                                // if(this.iTotalFreeNums >= 6 && this.iNewTotalFreeNums > this.iTotalFreeNums) {
                                //     if(this.AddFreeAni == undefined) {
                                //         this.AddFreeAni = ccs.load(res.DBZAddFreeAni_json);
                                //
                                //         this.GameLayer.node.addChild(this.AddFreeAni.node, 2);
                                //         this.AddFreeAni.node.runAction(this.AddFreeAni.action);
                                //         this.AddFreeAni.action.gotoFrameAndPlay(0, this.AddFreeAni.action.getDuration(), false);
                                //
                                //         this.bPasueWheel = true;
                                //     }
                                // }

                                if(this.iNewFreeNums != this.iFreeNums)
                                    this.iFreeNums = this.iNewFreeNums;

                                if(this.iNewTotalFreeNums != this.iTotalFreeNums)
                                    this.iTotalFreeNums = this.iNewTotalFreeNums;

                                if(this.iNewFreeAll != this.iFreeAll)
                                    this.iFreeAll = this.iNewFreeAll;

                                brefresh = true;
                            }

                            if(this.iNewMoney != undefined) {
                                this.setMyMoney_auto(this.iNewMoney);
                                this.iNewMoney = undefined;
                            }

                            if(brefresh)
                                this.refreshInfo();
                        }
                    }
                    else {
                        for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                            this.lstwheel[ii].setCurState(0);
                            //
                            // for(var jj = 0; jj < this.lstwheel[ii].lsticonnode.length; ++jj) {
                            //     this.lstwheel[ii].showIconAni(jj);
                            // }
                        }

                        if(this.bAutoRun)
                            this.WaitAutoTime = 0.5;

                        // if(this.iWin > 0) {
                        //     if(this.WinAni2 == undefined) {
                        //         // this.WinAni2 = ccs.load(res.DBZWinAni1_json);
                        //         //
                        //         // var wstr = this.chgString(this.iWin);
                        //         // var textNum1 = findNodeByName(this.WinAni2.node, "textNum1");
                        //         //
                        //         // if(textNum1 != undefined && textNum1 != null)
                        //         //     textNum1.setString(wstr);
                        //         //
                        //         // this.GameLayer.node.addChild(this.WinAni2.node, 2);
                        //         // this.WinAni2.node.runAction(this.WinAni2.action);
                        //         // this.WinAni2.action.gotoFrameAndPlay(0, this.WinAni2.action.getDuration(), false);
                        //         //
                        //         // if(this.bAutoRun)
                        //         //     this.WaitAutoTime += 2.5;
                        //
                        //         //! 计算胜利倍数
                        //         if(this.runBet == undefined)
                        //             this.runBet = this.iBet;
                        //
                        //         if(this.runLine == undefined)
                        //             this.runLine = this.iLine;
                        //
                        //         var winmul = this.iWin / (this.lstBet[this.runBet] * this.runLine);
                        //
                        //         if(GameMgr.singleton.isShowGift()) {
                        //             var data = GameMgr.singleton.getGiftData(true);
                        //
                        //             if(data != undefined) {
                        //                 winmul = this.iWin / (data.bet * data.line * data.times);
                        //             }
                        //         }
                        //
                        //         var wintype = 0;
                        //
                        //         // if(winmul >= 7)
                        //         //     wintype = 3;
                        //         // else if(winmul >= 3)
                        //         //     wintype = 2;
                        //         // else if(winmul >= 1)
                        //         //     wintype = 1;
                        //
                        //         if(wintype < this.lstWinAni.length) {
                        //             this.WinAni2 = CcsResCache.singleton.load(this.lstWinAni[wintype]);
                        //
                        //             var wstr = this.chgString(this.iWin);
                        //             var textNum1 = findNodeByName(this.WinAni2.node, "txt_num");
                        //
                        //             if(textNum1 != undefined && textNum1 != null)
                        //                 textNum1.setString(wstr);
                        //
                        //             //this.GameLayer.node.addChild(this.WinAni2.node, 3);
                        //             //this.nodeWin0.addChild(this.WinAni2.node, 3);
                        //             this.WinAni2.node.runAction(this.WinAni2.action);
                        //             this.WinAni2.action.gotoFrameAndPlay(0, this.WinAni2.action.getDuration(), false);
                        //
                        //             // var exitPanel = findNodeByName(this.WinAni2.node, "Panel_1");
                        //             // exitPanel.setTouchEnabled(false);
                        //             // exitPanel.setTouchEnabled(true);
                        //             // exitPanel.addTouchEventListener(this.onTouchExitPanel, this);
                        //             //
                        //             // this.playWinEffectByWinType(wintype);
                        //             //this.layDisable.setVisible(true);
                        //
                        //             if(this.bAutoRun)
                        //                 this.WaitAutoTime += this.lstWinAniTime[wintype];
                        //         }
                        //     }
                        // }
                        // else {
                        //     GameMgr.singleton.showGiftGame(this.canShowGiftGame());
                        // }

                        this.setRun(false);
                        //this.iWin = 0;
                        this.refreshInfo();
                        this.WheelAniTime = 1;

                        if(this.iNewMoney != undefined) {
                            this.setMyMoney_auto(this.iNewMoney);
                            this.iNewMoney = undefined;
                        }

                        if(this.iDestFightState == 2)
                            this.setFightState(3);
                        else if(this.iDestFightState == 10)
                            this.setFightState(11);

                        if(GameMgr.singleton.showJackpotWin()) {
                            if(this.iNewMoney != undefined) {
                                this.setMyMoney_auto(this.iNewMoney);
                                this.iNewMoney = undefined;
                            }
                        }
                    }
                }
            }
            else if(allstate == 2) {
                for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                    this.lstwheel[ii].adjust();
                }
            }
        }
    },

    //! 设置战斗状态
    setFightState : function (state) {
        if(state == this.iDestFightState)
            return ;

        if(state == 1 && this.iDestFightState == 9)
            return ;

        //! 两种战斗随机
        if(state == 1 && Math.floor(Math.random() * 2) >= 1)
            state = 9;

        this.iDestFightState = state;

        if(this.iCurFightState < 0) {
            this.iCurFightState = state;
            this.iCurFightIndex = 0;
            this.refreshFightSatet();
        }

        this.iCurFightState = this.iDestFightState;

        if(this.iCurFightState == 4) {
            this.iDestFightState = 0;
            this.iCurFightState = this.iDestFightState;
            this.iCurFightIndex = 0;

            this.refreshFightSatet();

            if(this.iCurScene == 1)
                this.lstSceneSpeed = [25, 50, 75];

            //this.bPasueWheel = false;

            if(this.WaitAutoTime <= 0)
                this.WaitAutoTime = 1;
        }
        else if(this.iCurFightState == 15) {
            this.iDestFightState = 0;
            this.iCurFightState = this.iDestFightState;
            this.iCurFightIndex = 0;

            this.refreshFightSatet();

            if(this.iCurScene == 1)
                this.lstSceneSpeed = [25, 50, 75];

            this.openFreeResult();
        }
    },

    //! 刷新战斗状态
    refreshFightSatet : function () {
        return ;

        if(this.FightAni != undefined) {
            this.FightAni.node.stopAllActions();
            this.nodeFightAni.removeChild(this.FightAni.node);
            this.FightAni = undefined;
        }

        //! 外太空用超级
        var cstate = this.iCurFightState;

        if(this.iCurScene == 2) {
            if(cstate >= 0 && cstate <= 3) {
                cstate += 5;
            }

            if(cstate >= 9 && cstate <= 11) {
                cstate += 3;
            }
        }

        this.FightAni = ccs.load(this.lstFightAni[cstate][this.iCurFightIndex]);
        this.nodeFightAni.addChild(this.FightAni.node);
        this.FightAni.node.runAction(this.FightAni.action);
        this.FightAni.action.gotoFrameAndPlay(0, this.FightAni.action.getDuration(), this.lstFightLoop[cstate])

        if(this.iCurFightState != 2) {
            this.nodeFightAni.setPosition(0, 0);
        }
        else {
            ++this.iFightNum;

            if(this.iFightNum  > 5) {
                this.nodeFightAni.setPosition(Math.random() * 500 - 250, Math.random() * 40 - 20);
                this.iFightNum = 0;
            }

            if(this.lstFightSound != undefined && this.lstFightSound.length > 0) {
                var sindex = Math.floor(Math.random() * 3);
                cc.audioEngine.playEffect(this.lstFightSound[sindex], false);
            }

            //this.FightAni.node.setScale(1 + Math.random() * 0.2 - 0.1);
        }

        if(this.iCurFightState == 10 || this.iCurFightState == 13) {
            if(this.iCurFightIndex == 0 || this.iCurFightIndex == 1) {
                cc.audioEngine.playEffect(res.DBZFight4_mp3, false);
            }
            else {
                cc.audioEngine.playEffect(res.DBZFight5_mp3, false);
            }
        }
        else if(this.iCurFightState == 15) {
            cc.audioEngine.playEffect(res.DBZFight6_mp3, false);
        }
        else if(this.iCurFightState == 4) {
            cc.audioEngine.playEffect(res.DBZFight7_mp3, false);
        }
    },

    //! 战斗状态计时
    update_Fight : function(dt) {
        return ;

        if(this.iCurFightState == 0) {
            if(this.iDestFightState != this.iCurFightState) {
                this.iCurFightState = this.iDestFightState;
                this.iCurFightIndex = 0;

                this.refreshFightSatet();

                if(this.iCurScene == 1)
                    this.lstSceneSpeed = [25*10, 50*10, 75*10];
            }
        }
        else if(this.iCurFightState == 1) {
            if(this.FightAni.action.getCurrentFrame() == this.FightAni.action.getDuration()) {
                if(this.iDestFightState != 4 && this.iDestFightState != 15)
                    this.iDestFightState = 2;

                this.iCurFightState = this.iDestFightState;
                this.iCurFightIndex = Math.floor(Math.random() * this.lstFightAni[this.iCurFightState].length) ;

                this.refreshFightSatet();
            }
        }
        else if(this.iCurFightState == 2) {
            if(this.FightAni.action.getCurrentFrame() == this.FightAni.action.getDuration()) {
                if(this.iDestFightState != 2) {
                    this.iCurFightState = this.iDestFightState;
                    this.iCurFightIndex = 0;
                }
                else {
                    var nindex = Math.floor(Math.random() * this.lstFightAni[this.iCurFightState].length) ;

                    while(nindex == this.iCurFightIndex)
                        nindex = Math.floor(Math.random() *this.lstFightAni[this.iCurFightState].length) ;

                    this.iCurFightIndex = nindex;
                }

                this.refreshFightSatet();
            }
        }
        else if(this.iCurFightState == 3) {
            if(this.FightAni.action.getCurrentFrame() == this.FightAni.action.getDuration()) {

                if(this.iDestFightState != 4 && this.iDestFightState != 15)
                    this.iDestFightState = 0;

                this.iCurFightState = this.iDestFightState;
                this.iCurFightIndex = 0;

                this.refreshFightSatet();

                if(this.iCurScene == 1)
                    this.lstSceneSpeed = [25, 50, 75];
            }
        }
        else if(this.iCurFightState == 4) {
            if(this.FightAni.action.getCurrentFrame() == this.FightAni.action.getDuration()) {
                this.iDestFightState = 0;
                this.iCurFightState = this.iDestFightState;
                this.iCurFightIndex = 0;

                this.refreshFightSatet();

                if(this.iCurScene == 1)
                    this.lstSceneSpeed = [25, 50, 75];

                this.bPasueWheel = false;

                if(this.WaitAutoTime <= 0)
                    this.WaitAutoTime = 1;
            }
        }
        else if(this.iCurFightState == 9) {
            if(this.FightAni.action.getCurrentFrame() == this.FightAni.action.getDuration()) {
                if(this.iDestFightState != 4 && this.iDestFightState != 15)
                    this.iDestFightState = 10;

                this.iCurFightState = this.iDestFightState;
                this.iCurFightIndex = Math.floor(Math.random() * this.lstFightAni[this.iCurFightState].length) ;

                this.refreshFightSatet();
            }
        }
        else if(this.iCurFightState == 10) {
            if(this.FightAni.action.getCurrentFrame() == this.FightAni.action.getDuration()) {
                if(this.iDestFightState != 10) {
                    this.iCurFightState = this.iDestFightState;
                    this.iCurFightIndex = 0;
                }
                else {
                    var nindex = Math.floor(Math.random() * this.lstFightAni[this.iCurFightState].length) ;

                    while(nindex == this.iCurFightIndex)
                        nindex = Math.floor(Math.random() *this.lstFightAni[this.iCurFightState].length) ;

                    this.iCurFightIndex = nindex;
                }

                this.refreshFightSatet();
            }
        }
        else if(this.iCurFightState == 11) {
            if(this.FightAni.action.getCurrentFrame() == this.FightAni.action.getDuration()) {
                if(this.iDestFightState != 4 && this.iDestFightState != 15)
                    this.iDestFightState = 0;
                
                this.iCurFightState = this.iDestFightState;
                this.iCurFightIndex = 0;

                this.refreshFightSatet();

                if(this.iCurScene == 1)
                    this.lstSceneSpeed = [25, 50, 75];
            }
        }
        else if(this.iCurFightState == 15) {
            if(this.FightAni.action.getCurrentFrame() == this.FightAni.action.getDuration()) {
                this.iDestFightState = 0;
                this.iCurFightState = this.iDestFightState;
                this.iCurFightIndex = 0;

                this.refreshFightSatet();

                if(this.iCurScene == 1)
                    this.lstSceneSpeed = [25, 50, 75];

                this.openFreeResult();
            }
        }
    },

    //! 设置连击数
    setHits : function(hits) {
        if(this.lstHit.length <= 0)
            return ;

        var sindex = 0;

        if(hits > 0)
            sindex = hits;

        if(sindex >= this.lstHit.length)
            sindex = this.lstHit.length - 1;

        for(var ii = 0; ii < this.lstHit.length; ++ii) {
            if(this.bFreeGame) {
                this.lstHit[ii].setVisible(false);
                this.lstFHit[ii].setVisible(ii != sindex);
            }
            else {
                this.lstFHit[ii].setVisible(false);
                this.lstHit[ii].setVisible(ii != sindex);
            }

            this.lstLHit[ii].setVisible(ii == sindex);
        }

        for(var ii = 0; ii < this.lstHitAni.length; ++ii) {
            if(ii == sindex) {
                if(!this.lstHitAni[ii].isVisible()) {
                    this.lstHitAni[ii].setVisible(true);
                    this.lstHitAni[ii].animation.play(this.lsthitaniname[0], -1, 0);
                }
            }
            else if(this.lstHitAni[ii].isVisible()){
                if(this.lstHitAni[ii].animation.getCurrentMovementID() == this.lsthitaniname[1])
                    this.lstHitAni[ii].animation.play(this.lsthitaniname[2], -1, 0);
            }
        }

        this.iShowHit = sindex;
    },

    refreshHits : function () {
        var bnum = 0;

        if(this.bFreeGame)
            ++bnum;

        for(var ii = 0; ii < this.lstHit.length; ++ii) {
            this.lstHit[ii].setString("X" + this.lsthitsnum[bnum][ii]);
            this.lstFHit[ii].setString("X" + this.lsthitsnum[bnum][ii]);
            this.lstLHit[ii].setString("X" + this.lsthitsnum[bnum][ii]);
        }

        var frame = cc.spriteFrameCache.getSpriteFrame(this.lsthitsprname[bnum]);

        for(var ii = 0; ii < this.lstHitSpr.length; ++ii) {
            this.lstHitSpr[ii].setSpriteFrame(frame);
        }
    },

    update_Hits : function (dt) {
        for(var ii = 0; ii < this.lstHitAni.length; ++ii) {
            var hani = this.lstHitAni[ii];
            if(hani.isVisible()){
                if(hani.animation.getCurrentMovementID() == "") {
                    if(ii == this.iShowHit)
                        hani.animation.play(this.lsthitaniname[1], -1, 1);
                    else
                        hani.setVisible(false);
                }
            }
        }
    },

    //! 刷新记录
    refreshHis : function () {
        return ;
        for(var ii = 0; ii < this.lstTextRecord.length; ++ii) {
            this.lstTextRecord[ii].setString("");
        }

        var tindex = 0;

        for(var ii = this.lstRecordNum.length - 1; ii >= 0; --ii) {
            if(tindex >= this.lstTextRecord.length)
                break;

            this.lstTextRecord[tindex].setString(this.chgString(this.lstRecordNum[ii]) + " X" + this.lstRecordHits[ii]);

            ++tindex;
        }
    },

    //! 清除记录
    clearHis : function () {
        this.lstRecordNum = [];
        this.lstRecordHits = [];
        //this.refreshHis();
    },

    //! 添加一条记录
    addHis : function (win, hitsnum) {
        if(win <= 0 || hitsnum <= 0)
            return ;

        var bnum = 0;

        if(this.bFreeGame)
            ++bnum;

        var hits = this.lsthitsnum[bnum][hitsnum - 1];
        var num = Math.floor(win / hits);

        this.lstRecordNum.push(num);
        this.lstRecordHits.push(hits);
        //this.refreshHis();
    },

    //! 收到记录数据
    onHis :function (data, bfree) {
        return ;
        this.clearHis();

        if(data == undefined)
            return ;

        var bnum = 0;

        if(bfree)
            ++bnum;

        var hi = 0;

        for(var ii = 0; ii < data.length; ++ii) {
            // if(data[ii] <= 0)
            //     continue ;

            var num = data[ii];
            var hits = this.lsthitsnum[bnum][hi];
            //this.addHis(num, hits);

            this.lstRecordNum.push(num);
            this.lstRecordHits.push(hits);

            ++hi;
        }
    },

    onExit : function () {
        CcsResCache.singleton.releaseModule(this.name);
        this._super();
    }

});

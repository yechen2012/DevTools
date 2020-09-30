var IceFire2GameLayer = cc.Layer.extend({
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

        this.name = 'icefire';
        CcsResCache.singleton.setCurModule(this.name, this);

        var infolayer = new IceFireInfoLayer(this);
        this.addChild(infolayer, 1000);
        this.InfoLayer = infolayer;

        this.onlinetimeLayer = new OnlineTimeLayer();
        this.addChild(this.onlinetimeLayer, 10);

        this.GameMenuStaus = {volume:true, sound:true, music:true, quickspin:false, coins:false, setauto: false};

        //! 画布
        this.GameCanvasMgr = new GameCanvasMgr(this);
        GameDataMgr.instance.init(this.GameCanvasMgr);

        var lstvanvas = [res.IceFireGameCanvas1_json, res.IceFireGameCanvas2_json, res.IceFireGameCanvas3_json];

        //var lstvanvas = [res.IceFireGameScene2_json];
        this.GameCanvasMgr.addCanvases(lstvanvas);
        var canvas = this.GameCanvasMgr.getCanvas(0);

        canvas.removeFlag(gmc.GMC_FLAG_MOBILE);
        canvas = this.GameCanvasMgr.getCanvas(2);

        canvas.removeFlag(gmc.GMC_FLAG_PC);

        // canvas = this.GameCanvasMgr.getCanvas(1);
        // canvas.removeFlag(gmc.GMC_FLAG_MOBILE);

        var lstadaptive = ["layAdaptive", "layAdaptive2", "layAdaptive_wheel", "layDisable", "layAutoSelect", "layAdaptive1", "layTips", 'layUiGmr', 'layDisconnect'];
        this.GameCanvasMgr.addAdaptiveLayouts(lstadaptive);

        //! ygg特殊处理：轮子接受特殊调整值
        if(GamelogicMgr.instance.isYggPlatform()) {
            this.GameCanvasMgr.addAdaptiveAdjust('layAdaptive_wheel', 'boost/top-bar');
        }

        this.gamemenuLayer = new GamemenuLayer(this.name, this.GameCanvasMgr);
        this.addChild(this.gamemenuLayer, 1000);

        //! UI模块
        this.ModuleUI = new IceFireUi(this.GameCanvasMgr);
        this.ModuleUI.initModule();
        // GamelogicMgr.instance.setGameLayer(this);
        //! 资源类
        //this.resTotalWin = this.GameCanvasMgr.initResource("resTotalWin", [res.IceFireUiNodeTotalWin1_json, res.IceFireUiNodeTotalWin2_json, res.IceFireUiNodeTotalWin2_json]);
        //this.nodeTotalWin = this.GameCanvasMgr.initNode("nodeTotalWin", "nodeTotalWin");
        //this.nodeTotalWin.addChild(this.resTotalWin);
        //
        //this.resWinAni = this.GameCanvasMgr.initResource("resWinAni", res.IceFireWinAni_json, true);
        //this.nodeWinAni = this.GameCanvasMgr.initSingle("nodeWinAni", "nodeWinAni");
        //this.nodeWinAni.addChild(this.resWinAni);

        this.nodeTotalWin = this.GameCanvasMgr.initNode("nodeTotalWin", "nodeTotalWin");
        this.nodeWinAni = this.GameCanvasMgr.initSingle("nodeWinAni", "nodeWinAni");
        this.nodeDisconnect = this.GameCanvasMgr.initSingle("nodeDisconnect", "nodeDisconnect");

        //! 增加menubar节点
        this.MenuBarLayer = new CommonMenuBarLayer(this.name, this);
        this.nodeDisconnect.addChild(this.MenuBarLayer);
        GameMgr.singleton.setGameMenuBar(this.MenuBarLayer);

        this.nodeFreeAni = this.GameCanvasMgr.initSingle("nodeFreeAni", "nodeFreeAni");
        this.aniSpine = sp.SkeletonAnimation.createWithJsonFile(res.IceFireMianFeiYouXi_json, res.IceFireMianFeiYouXi_atlas);
        //this.aniSpine.setPosition(800,450);
        this.nodeFreeAni.addChild(this.aniSpine);
        this.nodeFreeAni.setVisible(false);

        //旋转按钮节点
        this.nodeRun = this.GameCanvasMgr.initNode("nodeRun", "nodeRun");

        this.nodeAutoBack = this.GameCanvasMgr.initNode("nodeAutoBack", "nodeAutoBack");
        this.nodeAutoBack.setVisible(false);

        //!帮助节点
        //this.nodeHelp = this.GameCanvasMgr.initSingle("nodeHelp", "nodeHelp");

        //! 文字
        this.textBet = this.GameCanvasMgr.initTextBMFontEx("textBet1", "textBet1");
        this.textAllBet = this.GameCanvasMgr.initTextBMFontEx("textAllBet", "textAllBet");
        this.textAutoNum = this.GameCanvasMgr.initTextBMFontEx("textAutoNum", "textAutoNum");
        this.textWin = this.GameCanvasMgr.initTextBMFontEx("textWin1", "textWin1");
        this.textMoney = this.GameCanvasMgr.initTextBMFontEx("textMoney", "textMoney");
        this.textFreeNum = this.GameCanvasMgr.initTextBMFontEx("textFreeNum", "textFreeNum");
        this.textFreeTotalWin = this.GameCanvasMgr.initTextBMFontEx("textFreeTotalWin", "textFreeTotalWin");
        this.textTotalWin = this.GameCanvasMgr.initTextBMFontEx("textTotalWin", "textTotalWin");

        //! 游戏背景相关
        this.nodeBack1 = this.GameCanvasMgr.initSingle("nodeBack1", "nodeBack1");
        this.GameBack1 = ccs.load(res.IceFireGameNodeBack1_json);
        this.GameBack1.node.runAction(this.GameBack1.action);
        this.nodeBack1.addChild(this.GameBack1.node);
        this.sprFGBack = findChildByName(this.GameBack1.node, 'sprFGBack');
        this.sprFGBack.setVisible(false);

        //this.nodeBack2 = this.GameCanvasMgr.initSingle("nodeBack2", "nodeBack2");
        //this.GameBack2 = ccs.load(res.IceFireGameNodeBack2_json);
        //this.GameBack2.node.runAction(this.GameBack2.action);
        //this.nodeBack2.addChild(this.GameBack2.node);
        this.nodeBack2 = this.GameCanvasMgr.initNode("nodeBack2", "nodeBack2");
        this.GameBack2 = this.GameCanvasMgr.initResource('GameBack2', [res.IceFireGameNodeBack2_json, res.IceFireGameNodeBack2_1_json, res.IceFireGameNodeBack2_json]);
        this.nodeBack2.addChild(this.GameBack2);

        this.nodeBack3 = this.GameCanvasMgr.initNode("nodeBack3", "nodeBack3");
        this.GameBack3 = this.GameCanvasMgr.initResource('GameBack3', [res.IceFireGameNodeBack3_json, res.IceFireGameNodeBack3_1_json, res.IceFireGameNodeBack3_json]);
        this.nodeBack3.addChild(this.GameBack3);

        this.nodeBack5 = this.GameCanvasMgr.initNode("nodeBack5", "nodeBack5");
        this.GameBack5 = this.GameCanvasMgr.initResource('GameBack5', [res.IceFireGameNodeBack5_json, res.IceFireGameNodeBack5_1_json, res.IceFireGameNodeBack5_json]);
        this.nodeBack5.addChild(this.GameBack5);

        this.nodeBack6 = this.GameCanvasMgr.initSingle("nodeBack6", "nodeBack6");
        this.GameBack6 = ccs.load(res.IceFireGameNodeBack6_json);
        this.nodeBack6.addChild(this.GameBack6.node);

        this.nodeBack7 = this.GameCanvasMgr.initSingle("nodeBack7", "nodeBack7");
        this.GameBack7 = ccs.load(res.IceFireGameNodeBack7_json);
        this.nodeBack7.addChild(this.GameBack7.node);

        this.aniFGBack3 = this.GameCanvasMgr.initArmature('aniFGBack3', 'aniFGBack3');
        this.aniFGBack3._setVisible(false);
        this.aniFGBack4 = this.GameCanvasMgr.initArmature('aniFGBack4', 'aniFGBack4');
        this.aniFGBack4._setVisible(false);
        this.aniSuperFree1 = this.GameCanvasMgr.initArmature('aniSuperFree1', 'aniSuperFree1');
        this.aniSuperFree1._setVisible(false);
        this.aniSuperFree2 = this.GameCanvasMgr.initArmature('aniSuperFree2', 'aniSuperFree2');
        this.aniSuperFree2._setVisible(false);

        // this.nodeBack4 = this.GameCanvasMgr.initSingle("nodeBack4", "nodeBack4");
        // this.GameBack4 = ccs.load(res.IceFireGameNodeBack4_json);
        // this.GameBack4.node.runAction(this.GameBack4.action);
        // this.nodeBack4.addChild(this.GameBack4.node);
        // this.aniFGBack1 = findChildByName(this.GameBack4.node, 'aniFGBack1');
        // this.aniFGBack1.setVisible(false);
        // this.aniFGBack2 = findChildByName(this.GameBack4.node, 'aniFGBack2');
        // this.aniFGBack2.setVisible(false);

        this.nodeBack4 = this.GameCanvasMgr.initNode("nodeBack4", "nodeBack4");
        this.GameBack4 = this.GameCanvasMgr.initResource('GameBack4', res.IceFireGameNodeBack4_json);
        this.nodeBack4.addChild(this.GameBack4);
        this.aniFGBack1 =  this.GameCanvasMgr.initArmature('aniFGBack1', 'aniFGBack1');
        this.aniFGBack1.setVisible(false);
        // this.aniFGBack2 =  this.GameCanvasMgr.initArmature('aniFGBack2', 'aniFGBack2');
        // this.aniFGBack2.setVisible(false);

        this.nodeWheel1 = this.GameCanvasMgr.initSingle("nodeWheel1", "nodeWheel1");
        this.GameWheel1 = ccs.load(res.IceFireGameNodeWheel1_json);
        this.GameWheel1.node.runAction(this.GameWheel1.action);
        this.nodeWheel1.addChild(this.GameWheel1.node);

        this.nodeWheel2 = this.GameCanvasMgr.initSingle("nodeWheel2", "nodeWheel2");
        this.GameWheel2 = ccs.load(res.IceFireGameNodeWheel2_json);
        this.GameWheel2.node.runAction(this.GameWheel2.action);
        this.nodeWheel2.addChild(this.GameWheel2.node);

        this.nodeTopWheel1 = this.GameCanvasMgr.initSingle("nodeTopWheel1", "nodeTopWheel1");
        this.GameTopWheel1 = ccs.load(res.IceFireGameNodeTopWheel1_json);
        this.GameTopWheel1.node.runAction(this.GameTopWheel1.action);
        this.nodeTopWheel1.addChild(this.GameTopWheel1.node);

        this.nodeTopWheel2 = this.GameCanvasMgr.initSingle("nodeTopWheel2", "nodeTopWheel2");
        this.GameTopWheel2 = ccs.load(res.IceFireGameNodeTopWheel2_json);
        this.GameTopWheel2.node.runAction(this.GameTopWheel2.action);
        this.nodeTopWheel2.addChild(this.GameTopWheel2.node);

        this.nodeMoreTopWheel1 = this.GameCanvasMgr.initSingle("nodeTopMoreWheel1", "nodeMoreTopWheel1");
        this.GameMoreTopWheel1 = ccs.load(res.IceFireGameNodeMoreTopWheel1_json);
        this.GameMoreTopWheel1.node.runAction(this.GameMoreTopWheel1.action);
        this.nodeMoreTopWheel1.addChild(this.GameMoreTopWheel1.node);

        this.nodeMoreTopWheel2 = this.GameCanvasMgr.initSingle("nodeMoreTopWheel2", "nodeMoreTopWheel2");
        this.GameMoreTopWheel2 = ccs.load(res.IceFireGameNodeMoreTopWheel2_json);
        this.GameMoreTopWheel2.node.runAction(this.GameMoreTopWheel2.action);
        this.nodeMoreTopWheel2.addChild(this.GameMoreTopWheel2.node);

        this.nodeMostTopWheel1 = this.GameCanvasMgr.initSingle("nodeMostTopWheel1", "nodeMostTopWheel1");
        this.GameMostTopWheel1 = ccs.load(res.IceFireGameNodeMostTopWheel1_json);
        this.GameMostTopWheel1.node.runAction(this.GameMostTopWheel1.action);
        this.nodeMostTopWheel1.addChild(this.GameMostTopWheel1.node);

        this.nodeMostTopWheel2 = this.GameCanvasMgr.initSingle("nodeMostTopWheel2", "nodeMostTopWheel2");
        this.GameMostTopWheel2 = ccs.load(res.IceFireGameNodeMostTopWheel2_json);
        this.GameMostTopWheel2.node.runAction(this.GameMostTopWheel2.action);
        this.nodeMostTopWheel2.addChild(this.GameMostTopWheel2.node);

        this.nodeBox = this.GameCanvasMgr.initNode("nodeBox", "nodeBox");
        this.backBox = this.GameCanvasMgr.initResource('backBox', [res.IceFireGameNodeBackBox1_json, res.IceFireGameNodeBackBox2_json, res.IceFireGameNodeBackBox1_json]);
        this.nodeBox.addChild(this.backBox);

        this.aniSuperFree3 = this.GameCanvasMgr.initArmature('aniSuperFree3', 'aniSuperFree3');
        this.aniSuperFree3._setVisible(false);
        this.aniSuperFree4 = this.GameCanvasMgr.initArmature('aniSuperFree4', 'aniSuperFree4');
        this.aniSuperFree4._setVisible(false);
        this.aniIceBox = this.GameCanvasMgr.initArmature('aniIceBox', 'aniIceBox');
        this.aniIceBox._setVisible(false);

        this.btnRun = this.GameCanvasMgr.initButton('btnRun', 'btnRun');

        //!轮子框动画
        this.lstBoxAniName = ['ptloop', 'chgice', 'chgfire', 'chgsup', 'icetopt', 'firetopt', 'suptopt'];
        this.iBoxAniIndex = 0;
        this.setBoxAni(false);

        //!免费结算相关
        this.nodeFreeResult = this.GameCanvasMgr.initSingle("nodeFreeResult", "nodeFreeResult");
        this.nodeFreeResult2 = this.GameCanvasMgr.initSingle("nodeFreeResult2", "nodeFreeResult2");

        this.nodeFreeAddNums = this.GameCanvasMgr.initSingle("nodeFreeAddNums", "nodeFreeAddNums");

        //!tips相关
        this.nodeTips = this.GameCanvasMgr.initSingle("nodeTips", "nodeTips");
        this.tipsLayer = undefined;

        this.nodeUI1 = this.GameCanvasMgr.initNode("nodeUI1", "nodeUI1");
        this.nodeUI3 = this.GameCanvasMgr.initNode("nodeUI3", "nodeUI3");

        //!超级免费相关
        this.nodeSuperFreeUI1 = this.GameCanvasMgr.initSingle("nodeSuperFreeUI1", "nodeSuperFreeUI1");
        this.nodeSuperFreeUI2 = this.GameCanvasMgr.initSingle("nodeSuperFreeUI2", "nodeSuperFreeUI2");
        this.nodeSuperFreeUI1.setVisible(false);
        this.nodeSuperFreeUI2.setVisible(false);

        this.nodeSuperFreeGame = this.GameCanvasMgr.initSingle("nodeSuperFreeGame", "nodeSuperFreeGame");
        this.nodeSuperFreeGame2 = this.GameCanvasMgr.initSingle("nodeSuperFreeGame2", "nodeSuperFreeGame2");

        //!wl复制动画
        this.nodeCopyWlAni = this.GameCanvasMgr.initNode("nodeCopyWlAni", "nodeCopyWlAni");

        //!赢奖次数计数
        this.nodeWinCount = this.GameCanvasMgr.initNode("nodeWinCount", "nodeWinCount");
        this.winCount = this.GameCanvasMgr.initResource('winCount', [res.IceFireGameNodeWinCount_json, res.IceFireGameNodeWinCount1_json, res.IceFireGameNodeWinCount_json]);
        this.nodeWinCount.addChild(this.winCount);

        this.nodeNomalCount = this.GameCanvasMgr.initNode('nodeNomalCount', 'nodeNomalCount');
        this.nodeSuperCount = this.GameCanvasMgr.initNode('nodeSuperCount', 'nodeSuperCount');
        this.textMul = this.GameCanvasMgr.initTextBMFontEx('textMul', 'textMul');
        this.aniSuperFree = this.GameCanvasMgr.initArmature('aniSuperFree', 'aniSuperFree');
        this.aniSuperFree._setVisible(false);

        this.lstNodeDian = [];
        this.lstDianAni = [];
        for(var ii = 1; ii < 5; ii++){
            var nodeDian = this.GameCanvasMgr.initNode('nodeDian' + ii, 'nodeDian' + ii);
            var aniDian = this.GameCanvasMgr.initArmature('aniDian' + ii, 'aniDian' + ii);

            this.lstNodeDian.push(nodeDian);
            var obj = {};
            obj.ani = aniDian;
            obj.bplay = false;
            this.lstDianAni.push(obj);
        }

        this.aniChgMul =  this.GameCanvasMgr.initArmature('aniChgMul', 'aniChgMul');
        this.aniChgMul._setVisible(false);

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

        var wnode1 = this.nodeUI1.getNode(0);
        var gmcscale = new GameCanvasScale(wnode1, scaledata);
        //gamecanvas.addScale("nodeUI1", gmcscale);

        var winnode = this.nodeWinAni.getNode(0);
        gmcscale = new GameCanvasScale(winnode, scaledata);
        //gamecanvas.addScale("nodeWinAni", gmcscale);

        var tnode = this.nodeUI3.getNode(0);
        gmcscale = new GameCanvasScale(tnode, scaledata);
        //gamecanvas.addScale("nodeUI3", gmcscale);

        gamecanvas = this.GameCanvasMgr.getCanvas(1);
        scaledata = new gmc.ScaleData();

        scaledata.minSize.width = 900;
        scaledata.minSize.height = 1000;
        scaledata.maxSize.width = 1200;
        scaledata.maxSize.height = 1400;
        scaledata.minScale = 1;
        scaledata.maxScale = 1.25;

        var wnode1 = this.nodeUI1.getNode(1);
        var gmcscale = new GameCanvasScale(wnode1, scaledata);
        //gamecanvas.addScale("nodeUI1", gmcscale);

        var winnode = this.nodeWinAni.getNode(1);
        gmcscale = new GameCanvasScale(winnode, scaledata);
        //gamecanvas.addScale("nodeWinAni", gmcscale);

        var tnode = this.nodeUI3.getNode(1);
        gmcscale = new GameCanvasScale(tnode, scaledata);
        //gamecanvas.addScale("nodeUI3", gmcscale);

        this.aniBack = this.GameCanvasMgr.initArmature('aniBack', 'aniBack');
        this.aniBack_0 = this.GameCanvasMgr.initArmature('aniBack_0', 'aniBack_0');
        this.aniBack1 = this.GameCanvasMgr.initArmature('aniBack1', 'aniBack1');
        this.aniBack1_1 = this.GameCanvasMgr.initArmature('aniBack1_1', 'aniBack1_1');
        this.aniBack1_1._setVisible(false);
        this.aniBack2 = this.GameCanvasMgr.initArmature('aniBack2', 'aniBack2');
        this.aniBack2_1 = this.GameCanvasMgr.initArmature('aniBack2_1', 'aniBack2_1');
        this.aniBack2_1._setVisible(false);
        this.aniBack3 = this.GameCanvasMgr.initArmature('aniBack3', 'aniBack3');
        this.aniBack3_1 = this.GameCanvasMgr.initArmature('aniBack3_1', 'aniBack3_1');
        this.aniBack3_1._setVisible(false);
        this.aniBack4 = this.GameCanvasMgr.initArmature('aniBack4', 'aniBack4');
        this.aniBack4_1 = this.GameCanvasMgr.initArmature('aniBack4_1', 'aniBack4_1');
        this.nodeAniBack4 = this.GameCanvasMgr.initNode('nodeAniBack4', 'nodeAniBack4');
        this.nodeAniBack4_1 = this.GameCanvasMgr.initNode('nodeAniBack4_1', 'nodeAniBack4_1');
        //this.aniBack4_1._setVisible(false);
        this.nodeAniBack4_1._setVisible(false);
        this.aniBack5 = this.GameCanvasMgr.initArmature('aniBack5', 'aniBack5');
        this.aniBack5_1 = this.GameCanvasMgr.initArmature('aniBack5_1', 'aniBack5_1');
        this.aniBack5_1._setVisible(false);
        this.aniBack6 = this.GameCanvasMgr.initArmature('aniBack6', 'aniBack6');
        this.aniBack6_1 = this.GameCanvasMgr.initArmature('aniBack6_1', 'aniBack6_1');
        this.aniBack6_1._setVisible(false);

        this.aniRun = this.GameCanvasMgr.initArmature('aniRun', 'aniRun');

        //! 初始化场景
        this.GameScene = new GameModuleScene1(this);
        //! 添加场景动画 0普通 1普通到免费 2免费 3免费到普通
        var backdata1 = [
            {res: res.IceFire_huokuang_exjson, resname: 'icefire_huokuang', aniname: 'huokuang_beijing_huoxing', loop: true},
            {res: res.IceFire_huokuang_exjson, resname: 'icefire_huokuang', aniname: undefined, loop: false},
            {res: res.IceFire_huokuang_exjson, resname: 'icefire_huokuang', aniname: 'huokuang_beijing_huoxing', loop: true},
            {res: res.IceFire_huokuang_exjson, resname: 'icefire_huokuang', aniname: undefined, loop: false}
        ];

        var backdata2 = [
            {res: res.IceFire_binkuang_exjson, resname: 'icefire_binkuang', aniname: 'bingkuang_beijing_xue', loop: true},
            {res: res.IceFire_binkuang_exjson, resname: 'icefire_binkuang', aniname: undefined, loop: false},
            {res: res.IceFire_binkuang_exjson, resname: 'icefire_binkuang', aniname: 'bingkuang_beijing_xue', loop: true},
            {res: res.IceFire_binkuang_exjson, resname: 'icefire_binkuang', aniname: undefined, loop: false}
        ];

        var backdata3 = [
            {res: res.IceFire_huokuang_exjson, resname: 'icefire_huokuang', aniname: 'huokuang_beijing_shang', loop: true},
            {res: res.IceFire_huokuang_exjson, resname: 'icefire_huokuang', aniname: undefined, loop: false},
            {res: res.IceFire_huokuang_exjson, resname: 'icefire_huokuang', aniname: 'huokuang_mianfei_shang', loop: true},
            {res: res.IceFire_huokuang_exjson, resname: 'icefire_huokuang', aniname: undefined, loop: false}
        ];

        var backdata4 = [
            {res: res.IceFire_binkuang_exjson, resname: 'icefire_binkuang', aniname: undefined, loop: false},
            {res: res.IceFire_binkuang_exjson, resname: 'icefire_binkuang', aniname: undefined, loop: false},
            {res: res.IceFire_binkuang_exjson, resname: 'icefire_binkuang', aniname: 'bingkuang_mianfei_shang', loop: true},
            {res: res.IceFire_binkuang_exjson, resname: 'icefire_binkuang', aniname: undefined, loop: false}
        ];

        var backdata5 = [
            {res: res.IceFire_huokuang_exjson, resname: 'icefire_huokuang', aniname: 'huokuang_beijing_xia', loop: true},
            {res: res.IceFire_huokuang_exjson, resname: 'icefire_huokuang', aniname: undefined, loop: false},
            {res: res.IceFire_huokuang_exjson, resname: 'icefire_huokuang', aniname: 'huokuang_mianfei_xia', loop: true},
            {res: res.IceFire_huokuang_exjson, resname: 'icefire_huokuang', aniname: undefined, loop: false}
        ];

        var backdata6 = [
            {res: res.IceFire_binkuang_exjson, resname: 'icefire_binkuang', aniname: 'bingkuang_beijing_xia', loop: true},
            {res: res.IceFire_binkuang_exjson, resname: 'icefire_binkuang', aniname: undefined, loop: false},
            {res: res.IceFire_binkuang_exjson, resname: 'icefire_binkuang', aniname: 'bingkuang_mianfei_xia', loop: true},
            {res: res.IceFire_binkuang_exjson, resname: 'icefire_binkuang', aniname: undefined, loop: false}
        ];

        for(var ii = 0; ii < this.GameCanvasMgr.getCanvasNums();ii++){
            this.GameScene.addExportAni1(this.aniBack1.getNode(ii), backdata1, 'backdata1'+ ii);
            this.GameScene.addExportAni1(this.aniBack1_1.getNode(ii), backdata1, 'backdata1_1'+ ii);

            this.GameScene.addExportAni1(this.aniBack2.getNode(ii), backdata2, 'backdata2'+ ii);
            this.GameScene.addExportAni1(this.aniBack2_1.getNode(ii), backdata2, 'backdata2_1'+ ii);

            this.GameScene.addExportAni1(this.aniBack3.getNode(ii), backdata3, 'backdata3'+ ii);
            this.GameScene.addExportAni1(this.aniBack3_1.getNode(ii), backdata3, 'backdata3_1'+ ii);

            this.GameScene.addExportAni1(this.aniBack4.getNode(ii), backdata4, 'backdata4'+ ii);
            this.GameScene.addExportAni1(this.aniBack4_1.getNode(ii), backdata4, 'backdata4_1'+ ii);

            this.GameScene.addExportAni1(this.aniBack5.getNode(ii), backdata5, 'backdata5'+ ii);
            this.GameScene.addExportAni1(this.aniBack5_1.getNode(ii), backdata5, 'backdata5_1'+ ii);

            this.GameScene.addExportAni1(this.aniBack6.getNode(ii), backdata6, 'backdata6'+ ii);
            this.GameScene.addExportAni1(this.aniBack6_1.getNode(ii), backdata6, 'backdata6_1'+ ii);
        }

        var backdata6 = [
            {bindex:0,eindex:5, loop:false},
            {bindex:10,eindex:15, loop:false},
            {bindex:20,eindex:25, loop:false},
            {bindex:30,eindex:35, loop:false},
        ];
        this.GameScene.addNodeAni('GameBack', this.GameBack1, backdata6);

        var backdata7 = [
            {visible:true},
            {visible:true},
            {visible:false},
            {visible:true},
        ];
        var sprBack1 = findChildByName(this.GameBack1.node, 'sprBack1');
        this.GameScene.addVisibleAni('sprBack1', sprBack1, backdata7);

        var backdata8 = [
            {visible:false},
            {visible:true},
            {visible:true},
            {visible:true},
        ];
        var sprBack2 = findChildByName(this.GameBack1.node, 'sprBack2');
        this.GameScene.addVisibleAni('sprBack2', sprBack2, backdata8);

        //! 画布上
        for(var ii = 0; ii < this.GameCanvasMgr.getCanvasNums(); ++ii) {
            //! 画布上动画切换
            var tmpcanvas = this.GameCanvasMgr.getCanvas(ii);
            //this.GameScene.addNodeAni('GameCanvas' + ii, tmpcanvas._layer, backdata2);

            var baseName = ["nodeNormalUI",'' ,"nodeFreeUI",''];
            for (var i = 1; i <= 4; i++) {
                var id = 1;
                var _node;
                while (_node = findNodeByName(tmpcanvas._layer.node, baseName[i-1] + id)) {
                    var backdata = [];
                    for (var j = 1; j <= 4; j++) {
                        if (i == j) {
                            backdata.push({visible: true});
                        } else {
                            backdata.push({visible: false});
                        }
                    }
                    this.GameScene.addVisibleAni(baseName[i-1] + id + ii, _node, backdata);
                    id++;
                }
            }
        }
        this.GameScene.setState(0);

        //!game动画 0轮子出现
        this.lstGameAniName = ["wheelani"];
        this.iGameAniIndex = -1;

        //! 符号代码和图标的对应关系
        this.lstSymbol = { WL:0, A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8, J:9, K:10, FG:11, BK:12 };
        this.lstWheelDatas = [[8,11,10,9,6,7,10,11,9,8,5,11,10,9,7,11,6,10,7,9,11,5,8,6,10,4,9,7,1,8,11,9,7,5,3,11,8,6,10,4,5,8,9,11,7,3,10,6,4,2],
            [11,10,9,11,7,10,8,11,10,9,11,3,7,10,11,9,6,8,4,5,6,1,7,11,4,9,0,10,8,7,6,11,2,9,1,3,8,5,10,0,8,11,6,2,3,4,7,10,9,5],
            [8,11,5,7,10,11,6,9,2,11,9,10,1,7,8,3,11,10,4,9,6,8,10,5,6,1,7,11,4,9,0,10,8,7,6,11,2,9,1,3,8,5,10,0,9,7,2,10,3,5,4,11,8,6],
            [11,10,9,11,7,10,8,11,10,9,11,3,7,10,11,9,6,8,4,5,6,1,7,11,4,9,0,10,8,7,6,11,2,9,1,3,8,5,10,0,9,7,11,8,4,10,2,5,6,3],
            [8,11,10,9,6,7,10,11,9,8,5,11,10,9,7,11,6,10,7,9,11,5,8,6,10,4,9,7,1,8,11,9,7,5,3,11,8,6,4,10,7,2,9,3,6,5,4,11,10,8]];
        this.lstWinSymbol = { WL:0, A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8, J:9, K:10, FG:11, BK:12 };

        //!轮子中图标音效播放次数
        var lstSoundOverlap = { disappearSoundOverlap : false, disappearExSoundOverlap : false };

        var lsticon1 = [ "icefire_icon_wl1.png", "icefire_icon_a1.png", "icefire_icon_b1.png", "icefire_icon_c1.png", "icefire_icon_d1.png", "icefire_icon_e1.png", "icefire_icon_f1.png", "icefire_icon_g1.png", "icefire_icon_h1.png", "icefire_icon_j1.png", "icefire_icon_k1.png", "icefire_icon_fg1.png", "empty.png" ];
        var lsticon2 = [ "icefire_icon_wl2.png", "icefire_icon_a2.png", "icefire_icon_b2.png", "icefire_icon_c2.png", "icefire_icon_d2.png", "icefire_icon_e2.png", "icefire_icon_f2.png", "icefire_icon_g2.png", "icefire_icon_h2.png", "icefire_icon_j2.png", "icefire_icon_k2.png", "icefire_icon_fg2.png", "empty.png" ];

        var lsticonani1 = [ res.IceFireIceIconAni_WL_json, res.IceFireIceIconAni_A_json, res.IceFireIceIconAni_B_json, res.IceFireIceIconAni_C_json, res.IceFireIceIconAni_D_json, res.IceFireIceIconAni_E_json, res.IceFireIceIconAni_F_json, res.IceFireIceIconAni_G_json, res.IceFireIceIconAni_H_json, res.IceFireIceIconAni_J_json, res.IceFireIceIconAni_K_json, res.IceFireIceIconAni_FG_json, res.IceFireIconAni_BK_json];
        var lsticonani2 = [ res.IceFireFireIconAni_WL_json, res.IceFireFireIconAni_A_json, res.IceFireFireIconAni_B_json, res.IceFireFireIconAni_C_json, res.IceFireFireIconAni_D_json, res.IceFireFireIconAni_E_json, res.IceFireFireIconAni_F_json, res.IceFireFireIconAni_G_json, res.IceFireFireIconAni_H_json, res.IceFireFireIconAni_J_json, res.IceFireFireIconAni_K_json, res.IceFireFireIconAni_FG_json, res.IceFireIconAni_BK_json];

        var lstdownani = [ 0, res.IceFireDownAni1_json, res.IceFireDownAni2_json, res.IceFireDownAni3_json, res.IceFireDownAni4_json];
        var lstappearani = [ res.IceFireAppearAni0_json, res.IceFireAppearAni1_json, res.IceFireAppearAni2_json, res.IceFireAppearAni3_json, res.IceFireAppearAni4_json];

        var lsticonendani1 = [ res.IceFireEndIceAni_WL_json, res.IceFireEndIceAni_A_json, res.IceFireEndIceAni_B_json, res.IceFireEndIceAni_C_json, res.IceFireEndIceAni_D_json, res.IceFireEndIceAni_E_json, res.IceFireEndIceAni_F_json, res.IceFireEndIceAni_G_json, res.IceFireEndIceAni_H_json, res.IceFireEndIceAni_J_json, res.IceFireEndIceAni_K_json, res.IceFireEndIceAni_FG_json, res.IceFireEndIconAni_BK_json ];
        var lsticonendani2 = [ res.IceFireEndFireAni_WL_json, res.IceFireEndFireAni_A_json, res.IceFireEndFireAni_B_json, res.IceFireEndFireAni_C_json, res.IceFireEndFireAni_D_json, res.IceFireEndFireAni_E_json, res.IceFireEndFireAni_F_json, res.IceFireEndFireAni_G_json, res.IceFireEndFireAni_H_json, res.IceFireEndFireAni_J_json, res.IceFireEndFireAni_K_json, res.IceFireEndFireAni_FG_json, res.IceFireEndIconAni_BK_json ];

        var lstDisappearani1 = [res.IceFireDisappearAni1_json, res.IceFireDisappearAni1_json, res.IceFireDisappearAni1_json, res.IceFireDisappearAni1_json, res.IceFireDisappearAni1_json, res.IceFireDisappearAni1_json, res.IceFireDisappearAni1_json, res.IceFireDisappearAni1_json, res.IceFireDisappearAni1_json, res.IceFireDisappearAni1_json, res.IceFireDisappearAni1_json, res.IceFireDisappearFireFgAni_json, res.IceFireDisappearBKAni_json];
        var lstDisappearani2 = [res.IceFireDisappearAni2_json, res.IceFireDisappearAni2_json, res.IceFireDisappearAni2_json, res.IceFireDisappearAni2_json, res.IceFireDisappearAni2_json, res.IceFireDisappearAni2_json, res.IceFireDisappearAni2_json, res.IceFireDisappearAni2_json, res.IceFireDisappearAni2_json, res.IceFireDisappearAni2_json, res.IceFireDisappearAni2_json, res.IceFireDisappearIceFgAni_json, res.IceFireDisappearBKAni_json];
        var lstcopywlani = [res.IceFireCopyAni_WL4_json,res.IceFireCopyAni_WL3_json];
        var lsticonsound = [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,res.IceFireC1Sound_mp3];
        var lsticondisappearsound1 = [res.IceFireIceDisappear_mp3, res.IceFireIceDisappear_mp3, res.IceFireIceDisappear_mp3, res.IceFireIceDisappear_mp3, res.IceFireIceDisappear_mp3, res.IceFireIceDisappear_mp3, res.IceFireIceDisappear_mp3, res.IceFireIceDisappear_mp3, res.IceFireIceDisappear_mp3, res.IceFireIceDisappear_mp3, res.IceFireIceDisappear_mp3, res.IceFireFgDisappear_mp3];
        var lsticondisappearsound2 = [res.IceFireFireDisappear_mp3, res.IceFireFireDisappear_mp3, res.IceFireFireDisappear_mp3, res.IceFireFireDisappear_mp3, res.IceFireFireDisappear_mp3, res.IceFireFireDisappear_mp3, res.IceFireFireDisappear_mp3, res.IceFireFireDisappear_mp3, res.IceFireFireDisappear_mp3, res.IceFireFireDisappear_mp3, res.IceFireFireDisappear_mp3, res.IceFireFgDisappear_mp3];
        var lsttopicon = [this.lstSymbol.WL, this.lstSymbol.FG];
        var lstappeardata = {xb:0, xsp:0, yb:0, ysp:0};

        this.lsticon1 = lsticon1;
        this.lsticon2 = lsticon2;
        //this.lstexicon = lstexicon;
        //this.lsticonani = lsticonani;
        //this.lstexiconani = lstexiconani;

        this.lstwheeldelay = [ 5 / 24, 6 / 24, 7 / 24, 8 / 24, 9 / 24 ];
        this.lsticewheel = [];
        this.lstfirewheel = [];
        this.lstwheel = [];

        this.lstTopWheel = [];
        this.lsttopicewheel = [];
        this.lsttopfirewheel = [];

        this.lstLayTopWheel1 = [];
        this.lstLayTopWheel2 = [];

        this.lstMostTopWheel = [];
        this.lstmosttopicewheel = [];
        this.lstmosttopfirewheel = [];

        this.lstLayMostTopWheel1 = [];
        this.lstLayMostTopWheel2 = [];

        this.lstShowTopWheelDelay = [0, 0, 0, 0, 0];

        for(var ii = 0; ii < 5; ++ii) {
            var bindex = 1;

            var layWheel1 = findNodeByName(this.GameWheel1.node, "layWheel" + (ii + 1));
            var layWheel2 = findNodeByName(this.GameWheel2.node, "layWheel" + (ii + 6));
            var layTopWheel1 = findNodeByName(this.GameTopWheel1.node, "layTopWheel" + (ii + 1));
            var layTopWheel2 = findNodeByName(this.GameTopWheel2.node, "layTopWheel" + (ii + 6));
            var layMoreTopWheel1 = findNodeByName(this.GameMoreTopWheel1.node, "layMoreTopWheel" + (ii + 1));
            var layMoreTopWheel2 = findNodeByName(this.GameMoreTopWheel2.node, "layMoreTopWheel" + (ii + 6));
            var layMostTopWheel1 = findNodeByName(this.GameMostTopWheel1.node, "layMostTopWheel" + (ii + 1));
            var layMostTopWheel2 = findNodeByName(this.GameMostTopWheel2.node, "layMostTopWheel" + (ii + 6));

            var wheel1 = new Wheel2(layWheel1, lsticon1, undefined, 5, layWheel1.width, Math.floor(layWheel1.height / 5), Math.floor(layWheel1.height / 5), lstdownani, lstappearani, lstDisappearani2, lsticonendani1, res.IceFireDisappearAni_json, 5 / 24, 1 / 24 * ii, this.lstwheeldelay[ii], 1 / 24 * ii * 3, 4 / 24);
            var wheel2 = new Wheel2(layWheel2, lsticon2, undefined, 5, layWheel2.width, Math.floor(layWheel2.height / 5), Math.floor(layWheel2.height / 5), lstdownani, lstappearani, lstDisappearani1, lsticonendani2, res.IceFireDisappearAni_json, 5 / 24, 1 / 24 * ii, this.lstwheeldelay[ii], 1 / 24 * ii * 3, 4 / 24);

            // wheel.setLogicNum(3);
            wheel1.setSound(undefined, res.IceFireDown_mp3, lsticondisappearsound1, this.lstSymbol.FG, lsticonsound, res.IceFireDown_mp3);
            wheel1.setIconAni(lsticonani1,undefined);
            wheel1.setShowIconAni(lsticonani1);
            wheel1.setChgIconAni(lstcopywlani);
            wheel1.setSoundOverlap(lstSoundOverlap.disappearSoundOverlap, lstSoundOverlap.disappearExSoundOverlap);
            wheel1.setTopWheel(layTopWheel1);
            wheel1.setTopWheelIcon(lsttopicon);
            //wheel1.setTopWheelAni(res.IceFireFgDaijiAni_json);
            wheel1.setTouchIcon(layWheel1, this);
            //wheel1.setAppearEx(lstappeardata, 0);

            wheel2.setSound(undefined, res.IceFireDown_mp3, lsticondisappearsound2, this.lstSymbol.FG, lsticonsound, res.IceFireDown_mp3);
            wheel2.setIconAni(lsticonani2,undefined);
            wheel2.setShowIconAni(lsticonani2);
            wheel2.setChgIconAni(lstcopywlani);
            wheel2.setSoundOverlap(lstSoundOverlap.disappearSoundOverlap, lstSoundOverlap.disappearExSoundOverlap);
            wheel2.setTopWheel(layTopWheel2);
            wheel2.setTopWheelIcon(lsttopicon);
            //wheel2.setTopWheelAni(res.IceFireFgDaijiAni_json);
            wheel2.setTouchIcon(layWheel2, this);
            //wheel2.setAppearEx(lstappeardata, 0);

            this.lsticewheel.push(wheel1);
            this.lstfirewheel.push(wheel2);
            this.lstwheel.push(wheel1);
            this.lstwheel.push(wheel2);

            var topwheel1 = new Wheel2(layMoreTopWheel1, lsticon1, undefined, 5, layWheel1.width, Math.floor(layWheel1.height / 5), Math.floor(layWheel1.height / 5), lstdownani, lstappearani, lstDisappearani2, lsticonendani1, res.IceFireDisappearAni_json, 5 / 24, 1 / 24 * ii, this.lstwheeldelay[ii], 1 / 24 * ii * 3, 4 / 24);
            var topwheel2 = new Wheel2(layMoreTopWheel2, lsticon2, undefined, 5, layWheel2.width, Math.floor(layWheel2.height / 5), Math.floor(layWheel2.height / 5), lstdownani, lstappearani, lstDisappearani1, lsticonendani2, res.IceFireDisappearAni_json, 5 / 24, 1 / 24 * ii, this.lstwheeldelay[ii], 1 / 24 * ii * 3, 4 / 24);

            topwheel1.setIconAni(lsticonani1, undefined);
            topwheel1.setShowIconAni(lsticonani1);
            topwheel1.setChgIconAni(lstcopywlani);
            topwheel1.setSoundOverlap(lstSoundOverlap.disappearSoundOverlap, lstSoundOverlap.disappearExSoundOverlap);
            //topwheel1.setAppearEx(lstappeardata, 0);

            topwheel2.setIconAni(lsticonani2, undefined);
            topwheel2.setShowIconAni(lsticonani2);
            topwheel2.setChgIconAni(lstcopywlani);
            topwheel2.setSoundOverlap(lstSoundOverlap.disappearSoundOverlap, lstSoundOverlap.disappearExSoundOverlap);
            //topwheel2.setAppearEx(lstappeardata, 0);

            this.lstTopWheel.push(topwheel1);
            this.lstTopWheel.push(topwheel2);
            this.lsttopicewheel.push(topwheel1);
            this.lsttopfirewheel.push(topwheel2);

            this.lstLayTopWheel1.push(layMoreTopWheel1);
            this.lstLayTopWheel2.push(layMoreTopWheel2);

            var mosttopwheel1 = new Wheel2(layMostTopWheel1, lsticon1, undefined, 5, layWheel1.width, Math.floor(layWheel1.height / 5), Math.floor(layWheel1.height / 5), lstdownani, lstappearani, lstDisappearani2, lsticonendani1, res.IceFireDisappearAni_json, 5 / 24, 1 / 24 * ii, this.lstwheeldelay[ii], 1 / 24 * ii * 3, 4 / 24);
            var mosttopwheel2 = new Wheel2(layMostTopWheel2, lsticon2, undefined, 5, layWheel2.width, Math.floor(layWheel2.height / 5), Math.floor(layWheel2.height / 5), lstdownani, lstappearani, lstDisappearani1, lsticonendani2, res.IceFireDisappearAni_json, 5 / 24, 1 / 24 * ii, this.lstwheeldelay[ii], 1 / 24 * ii * 3, 4 / 24);

            mosttopwheel1.setIconAni(lsticonani1, undefined);
            mosttopwheel1.setShowIconAni(lsticonani1);
            mosttopwheel1.setChgIconAni(lstcopywlani);
            mosttopwheel1.setSoundOverlap(lstSoundOverlap.disappearSoundOverlap, lstSoundOverlap.disappearExSoundOverlap);
            //topwheel1.setAppearEx(lstappeardata, 0);

            mosttopwheel2.setIconAni(lsticonani2, undefined);
            mosttopwheel2.setShowIconAni(lsticonani2);
            mosttopwheel2.setChgIconAni(lstcopywlani);
            mosttopwheel2.setSoundOverlap(lstSoundOverlap.disappearSoundOverlap, lstSoundOverlap.disappearExSoundOverlap);
            //topwheel2.setAppearEx(lstappeardata, 0);

            this.lstMostTopWheel.push(mosttopwheel1);
            this.lstMostTopWheel.push(mosttopwheel2);
            this.lstmosttopicewheel.push(mosttopwheel1);
            this.lstmosttopfirewheel.push(mosttopwheel2);

            this.lstLayMostTopWheel1.push(layMostTopWheel1);
            this.lstLayMostTopWheel2.push(layMostTopWheel2);
        }

        this.lstWheelName = [];
        for(var ii = 0; ii < 10; ii++){
            this.lstWheelName.push("layWheel" + (ii + 1));
        }

        this.SpinResult = [0, 0, 0, 0, 0];
        this.bRun = false;
        this.bCanStop = false;
        this.bQuickStop = false;
        this.bQuickStopTime = 0;

        this.WaitStopTime = -1;

        this.DisconnectLayer = undefined;
        this.ErrorLayer = undefined;
        this.bErrorPause = false;

        this.pNode = undefined;

        this.lstIceWLPos = [];
        this.lstFireWLPos = [];
        this.lstWLAniNode = [];
        this.lstinode = [];

        this.lstFgIcon = [];

        this.lstIconWinSound = [
            res.IceFireWinA1_mp3,
            res.IceFireWinA2_mp3,
            res.IceFireWinB1_mp3,
            res.IceFireWinB2_mp3,
            res.IceFireWinC1_mp3,
            res.IceFireWinC2_mp3,
            res.IceFireWinD1_mp3,
            res.IceFireWinD2_mp3,
            res.IceFireWinFg_mp3,
            res.IceFireWinPt_mp3
        ];

        this.lstDisappearSoundEx = [res.IceFireTyDisappear_mp3];

        this.iCascade = 0;
        this.iSuperMul = 1;

        //! 免费选择
        this.iSelectFgNums = 0;
        this.ExWilds = 0;
        this.iSelectFGType = -1;  //!0选择冰 1选择火 -1普通游戏或超级免费

        this.tmpSelectFreeLayer = this.GameCanvasMgr.initResource("selectFree", res.IceFireGameNodeFreeSelect_json, true);
        this.nodeFreeSelect = this.GameCanvasMgr.initSingle("nodeFreeSelect", "nodeFreeSelect");
        this.nodeFreeSelect.addChild(this.tmpSelectFreeLayer);
        this.nodeFreeSelect.setVisible(false);

        var textChooseDragon = this.GameCanvasMgr.initTextEx("textChooseDragon", "textChooseDragon");
        textChooseDragon.setFontName('Ubuntu_M');
        textChooseDragon.setMultiLine(false);
        LanguageData.instance.showTextStr("fs_choose_a_dragon",textChooseDragon);

        this.tmpSelectFreeLayer2 = this.GameCanvasMgr.initResource("selectFree2", res.IceFireGameNodeFreeSelect2_json, true);
        this.nodeFreeSelect2 = this.GameCanvasMgr.initSingle("nodeFreeSelect2", "nodeFreeSelect2");
        this.nodeFreeSelect2.addChild(this.tmpSelectFreeLayer2);
        this.nodeFreeSelect2.setVisible(false);

        this.tmpSelectFreeLayer3 = this.GameCanvasMgr.initResource("selectFree3", res.IceFireGameNodeFreeSelect3_json, true);
        this.nodeFreeSelect3 = this.GameCanvasMgr.initSingle("nodeFreeSelect3", "nodeFreeSelect3");
        this.nodeFreeSelect3.addChild(this.tmpSelectFreeLayer3);
        this.nodeFreeSelect3.setVisible(false);

        this.tmpSelectFreeLayer4 = this.GameCanvasMgr.initResource("selectFree4", res.IceFireGameNodeFreeSelect4_json, true);
        this.nodeFreeSelect4 = this.GameCanvasMgr.initSingle("nodeFreeSelect4", "nodeFreeSelect4");
        this.nodeFreeSelect4.addChild(this.tmpSelectFreeLayer4);
        this.nodeFreeSelect4.setVisible(false);

        this.FreeSelectAniName = ['1', '2', '3', '4', '5', '6']; //1:龙移动到指定位置 2:按钮显示 3:选择循环阶段 4:按钮消失 5:冰龙消失次数数字出现 6:火龙消失次数数字出现
        this.iFreeSelectIndex = -1;
        this.tmpSelectFreeLayer.play([0,1], false);
        this.tmpSelectFreeLayer2.play([0,1], false);
        this.tmpSelectFreeLayer3.play([0,1], false);
        this.tmpSelectFreeLayer4.play([0,1], false);

        this.nodeInFreeSelect = this.GameCanvasMgr.initSingle("nodeInFreeSelect", "nodeInFreeSelect");

        var node = this.tmpSelectFreeLayer.getNode();
        var node2 = this.tmpSelectFreeLayer2.getNode();
        var node3 = this.tmpSelectFreeLayer3.getNode();
        var node4 = this.tmpSelectFreeLayer4.getNode();


        var temptextFreeWilds = findNodeByName(node, "textFreeWilds");
        var tempnodeparent = temptextFreeWilds.getParent();
        this.textFreeWilds= new RichTextEx(temptextFreeWilds,  tempnodeparent);
        this.textFreeWilds.setRichNodeName("textFreeWilds");
        temptextFreeWilds.removeFromParent();
        this.textFreeWilds.setFontName('Ubuntu_M');

        this.btnA = findNodeByName(node4, "btnA");
        this.btnA.addTouchEventListener(this.onTouchA, this);
        this.btnB = findNodeByName(node4, "btnB");
        this.btnB.addTouchEventListener(this.onTouchB, this);

        this.aniBtn = findNodeByName(node4, "aniBtn");
        this.aniBtn.setVisible(false);

        this.touchLayA = findNodeByName(node4, "touchLayA");
        this.touchLayA.addTouchEventListener(this.onTouchA, this);
        this.touchLayB = findNodeByName(node4, "touchLayB");
        this.touchLayB.addTouchEventListener(this.onTouchB, this);

        this.bSelectFree = false;
        this.bPlaySelectFreeMusic = false;

        this.aniFireB_1 = findNodeByName(node2, "aniFireB_1");
        this.aniFireB_2 = findNodeByName(node2, "aniFireB_2");
        this.aniFireB_3 = findNodeByName(node3, "aniFireB_3");
        this.aniIceA_1 = findNodeByName(node2, "aniIceA_1");
        this.aniIceA_2 = findNodeByName(node2, "aniIceA_2");
        this.aniIceA_3 = findNodeByName(node3, "aniIceA_3");
        this.aniFireIce_1 = findNodeByName(node2, "aniFireIce_1");
        this.aniFireIce_2 = findNodeByName(node2, "aniFireIce_2");
        this.aniFireB_1.setVisible(false);
        this.aniFireB_2.setVisible(false);
        this.aniFireB_3.setVisible(false);
        this.aniIceA_1.setVisible(false);
        this.aniIceA_2.setVisible(false);
        this.aniIceA_3.setVisible(false);
        this.aniFireIce_1.setVisible(false);
        this.aniFireIce_2.setVisible(false);

        this.nodeFreeLongA = findNodeByName(node4, "nodeFreeLongA");
        this.spineLongA = sp.SkeletonAnimation.createWithJsonFile(res.IceFireMianFeiYouXi_json, res.IceFireMianFeiYouXi_atlas);
        this.nodeFreeLongA.addChild(this.spineLongA);
        this.nodeFreeLongA.setVisible(false);

        this.nodeFreeLongB = findNodeByName(node4, "nodeFreeLongB");
        this.spineLongB = sp.SkeletonAnimation.createWithJsonFile(res.IceFireMianFeiYouXi_json, res.IceFireMianFeiYouXi_atlas);
        this.nodeFreeLongB.addChild(this.spineLongB);
        this.nodeFreeLongB.setVisible(false);

        //this.btnCloseSelect = findNodeByName(node, "btnOk");
        //this.btnCloseSelect.addTouchEventListener(this.onTouchCloseSelect, this);

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

        this.bShowResult = false;
        this.iShowResultIndex = 0;
        this.ShowResultTime = 0;

        this.bGameInfoDouble = false;
        this.bCanDouble = false;
        this.bCanOpenBox = false;
        this.WaitOpenBoxTime = 0;
        this.bNewGame = true;
        this.bShowSani = true;
        this.bChgFgScene = false;
        this.bChgBgScene = false;

        this.bShowCoins = true;
        this.bQuickSpin = true;
        this.bSetAuto = true;

        //!播放轮子停止音效
        this.playWheelSoundIndex = 0;
        this.playWheelSoundDelay = 0;

        this.WinAni = undefined;
        this.WinAni2 = undefined;

        this.lstWaitWinAni = [];

        this.iDartsTime = 0;
        this.iDartsRotation = 0;

        this.BtnScale = [1, 1.05];
        this.BtnScaleTime = [ 1, 0.5 ];
        this.BtnAniTime = 0;

        //! 金币动画
        this.lstGoldAni = [];

        this.bSuperFreeGame = false;
        this.bFreeGame = false;     //! 是否在免费游戏中
        this.iFreeNums = -1;         //! 免费次数
        this.iNewFreeNums = 0;         //! 免费次数
        this.iFreeAddNums = -1;       //!增加免费次数
        this.iFreeMul = 0;          //! 免费倍数
        this.iFreeAll = -1;          //! 免费赢的金额
        this.iNewFreeAll = 0;          //! 免费赢的金额
        this.iFreeBeginWin = 0;     //! 免费游戏之前赢得的金额
        this.iFreeType = -1;          //! 免费游戏的类型
        this.iFreeAdd = 0;          //! 增加的选择船次数
        this.iTotalFreeNums = -1;         //! 总的免费次数
        this.iNewTotalFreeNums = -1;         //! 总的免费次数
        this.bAddFree = false;              //!是否增加免费次数
        this.bAddFreeAniEnd = false;              //!是否增加免费次数动画结束

        //! 音乐音效相关
        this.lstMusic = [res.IceFireMusci1_mp3, res.IceFireMusci2_mp3, res.IceFireMusci3_mp3];
        this.lstWinEffect = [res.IceFireEffWin1_mp3, res.IceFireEffWin2_mp3, res.IceFireEffWin3_mp3];
        this.lstWinEffectTime = [3,3,3];
        this.lstFightSound = [res.IceFireFight1_mp3, res.IceFireFight2_mp3, res.IceFireFight3_mp3];

        this.lstWaitMusic = [];
        this.lstWaitWinEfect = [];
        this.bPlayFreeMusic = false;

        this.WinEffectTime = 0;
        this.bPlayKO = false;
        this.bStopMusic = false;

        this.bInitMusic = false;

        this.EffectValue = 1;
        this.SoundValue = 1;
        this.ChgSValueTime = 0;

        //cc.sys.isMobile = true;
        if(GameAssistant.singleton.isShowSoundTips()) {
            this.setPlaySound(false)
            this.setPlayEffect(false);

            // var layer = new DBZSoundTipsLayer(this);
            // this.addChild(layer, 1);
            //this.MenuBarLayer.showSoundTips();
        }
        else {
            this.setPlaySound(true);
            this.setPlayEffect(true);
        }

        //this.setPlayEffect(true);

        this.refreshInfo();
        this.scheduleUpdate();

        this.lstHelp = [];

        var helplayer1 = new IceFireHelpLayer1(this);
        this.addChild(helplayer1, 2);
        this.lstHelp.push(helplayer1);

        var helplayer2 = new IceFireHelpLayer2(this);
        this.addChild(helplayer2, 2);
        this.lstHelp.push(helplayer2);

        var helplayer3 = new IceFireHelpLayer3(this);
        this.addChild(helplayer3, 2);
        this.lstHelp.push(helplayer3);

        var helplayer4 = new IceFireHelpLayer4(this);
        this.addChild(helplayer4, 2);
        this.lstHelp.push(helplayer4);

        var helplayer5 = new IceFireHelpLayer5(this);

        if(helplayer5.bInit) {
            this.addChild(helplayer5, 2);
            this.lstHelp.push(helplayer5);
        }

        var helplayer6 = new IceFireHelpLayer6(this);

        if(helplayer6.bInit) {
            this.addChild(helplayer6, 2);
            this.lstHelp.push(helplayer6);
        }

        var helplayer7 = new IceFireHelpLayer7(this);

        if(helplayer7.bInit) {
            this.addChild(helplayer7, 2);
            this.lstHelp.push(helplayer7);
        }

        this.showHelp(0);

        this.bInFreeSelect = false;
        this.bInitOneGame = false;
        this.bJustStart = true;
        this.bNewIcon = false;      //! 是否收到了新的图标
        this.NewGameModuleInfo = undefined;

        this.bPasueWheel = false;

        this.AddFreeAni = undefined;
        this.HitsAni = undefined;
        this.iHitsNum = 0;

        //! 增加jackpot节点
        this.nodeCommonJackpot = new cc.Node();
        this.addChild(this.nodeCommonJackpot, 10);

        //! UI模块相关
        this.ModuleUI.setBet(30);
        this.ModuleUI.setLines(30);
        this.ModuleUI.setCoinValueList([1,2,5,10,20,50,100,200,300,500,1000]);
        this.ModuleUI.setChgCoinValueFunc(this.onChgCoinValue, this);
        this.ModuleUI.setSpinFunc(this.onTouchRun, this);
        this.ModuleUI.setCloseTipsFunc(this.onTouchCloseTips, this);
        this.ModuleUI.setPlaySoundFunc(this.playBtnSound, this);
        this.ModuleUI.setTouchMaxBetFunc(this.onTouchAll, this);
        this.ModuleUI.setLeftFreeResultFunc(this.leftFreeResult, this);
        this.ModuleUI.setMenuFunc(this.onTouchMenu, this);
        this.ModuleUI.setOpenFreeResultFunc(this.openFreeResult, this);
        this.ModuleUI.setOpenDisconnectFunc(this.setDisconnect, this);

        this.restoreUserSetup();
        this.GameCanvasMgr.showCanvas(false);
        return true;
    },

    setRun : function (brun) {
        this.bRun = brun;
        this.ModuleUI.setRun(brun, this.bFreeGame);
    },

    //! 恢复之前记录的属性
    restoreUserSetup : function () {
        var soundopen = GameAssistant.singleton.getMusicType("icefire");
        var effectopen = GameAssistant.singleton.getEffectType("icefire");
        var volumeopen = GameAssistant.singleton.getVolumeType("icefire");
        var volumevalue = GameAssistant.singleton.getVolumeValue("icefire");

        if(volumevalue){
            volumevalue = Number(volumevalue);
            this.EffectValue = volumevalue;
            this.SoundValue = volumevalue;
        }

        if(soundopen === ""){
            soundopen = 1;
        }
        else{
            soundopen = parseInt(soundopen);
        }

        if(effectopen === ""){
            effectopen = 1;
        }
        else{
            effectopen = parseInt(effectopen);
        }

        if(volumeopen === ""){
            volumeopen = 1;
        }
        else{
            volumeopen = parseInt(volumeopen);
        }

        if(volumeopen == 0){
            this.setPlaySound(false);
            this.setPlayEffect(false);
        }
        else{
            if(!GameAssistant.singleton.isShowSoundTips()) {
                this.setPlaySound(soundopen == 1);
                this.setPlayEffect(effectopen == 1);
            }
        }


        // if(effectopen) {
        //     effectopen = parseInt(effectopen);
        //
        //     this.setPlayEffect(effectopen == 1);
        // }

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

        var coinvalue = cc.sys.localStorage.getItem(this.name + 'coinvalue');

        //if(coinvalue)
        //    this.ModuleUI.setCoinValue(coinvalue);

        this.ModuleUI.setCoinValue(coinvalue);

        this.restoreBetNum();
    },

    closeSoundTips:function(){
        if(GameAssistant.singleton.isShowSoundTips()) {
            this.onTouchCloseSound(null, 2);
            this.onTouchCloseEffect(null, 2);
        }
    },

    //!关闭info
    closeInfoLayer: function () {
        this.removeChild(this.InfoLayer);
        this.InfoLayer = undefined;
        this.closeSoundTips();
        this.GameCanvasMgr.showCanvas(true);
        GamelogicMgr.instance.callRegistered('getGameReadyRet');
    },

    onChgCoinValue : function (value) {
        //仅YGG有注册，ygg是不管value有没变化都会发送消息
        GamelogicMgr.instance.callRegistered("onChgCoinValue");
        var _coinvalue = this.getUserSetup('coinvalue');
        _coinvalue = parseInt(_coinvalue);
        if(_coinvalue == value){
            return;
        }
        if(!this.bJustStart && !this.bRewatch){
            this.setUserSetup('coinvalue', value);
            this.setUserSetup('betnum', value);
        }
    },

    //! 记录用户设置
    setUserSetup : function (sname, snum) {
        cc.sys.localStorage.setItem(this.name + sname, snum);
    },

    //! 获取用户设置
    getUserSetup : function (sname) {
        return cc.sys.localStorage.getItem(this.name + sname);
    },

    //! 收到下注列表
    onBetList : function (lst, betnum) {
        if(lst == undefined || lst.length <= 0)
            return ;

        this.lstBet = lst;

        if(betnum != undefined)
            this.iBetNum = betnum;

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

        this.saveBetNum();

        this.refreshInfo();

        if(this.ModuleUI) {
            this.ModuleUI.setCoinValueList(lst, this.iBet);
        }
    },

    //! 恢复之前记录下注值
    restoreBetNum : function () {
        if(this.iBetNum != undefined)
            return;

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
        var needSave=GamelogicMgr.instance.needSaveBetNum();
        if(!needSave){
            return;
        }

        this.setUserSetup('userbet', this.iBet);
        this.iBetNum = this.lstBet[this.iBet];
        this.setUserSetup('betnum', this.iBetNum);
    },

    refreshWheel: function () {
        this.bPasueWheel = false;
        this.iGameAniIndex = -1;

        this.GameWheel1.action.gotoFrameAndPlay(30, 35, false);
        this.GameWheel2.action.gotoFrameAndPlay(30, 35, false);

        this.GameTopWheel1.action.gotoFrameAndPlay(30, 35, false);
        this.GameTopWheel2.action.gotoFrameAndPlay(30, 35, false);

        this.GameMoreTopWheel1.action.gotoFrameAndPlay(30, 35, false);
        this.GameMoreTopWheel2.action.gotoFrameAndPlay(30, 35, false);

        this.GameMostTopWheel1.action.gotoFrameAndPlay(30, 35, false);
        this.GameMostTopWheel2.action.gotoFrameAndPlay(30, 35, false);

        if(this.nodeWheel1)
            this.nodeWheel1.setVisible(true);

        if(this.nodeWheel2)
            this.nodeWheel2.setVisible(true);

        if(this.nodeMoreTopWheel1)
            this.nodeMoreTopWheel1.setVisible(true);

        if(this.nodeMoreTopWheel2)
            this.nodeMoreTopWheel2.setVisible(true);

        if(this.nodeMostTopWheel1)
            this.nodeMostTopWheel1.setVisible(true);

        if(this.nodeMostTopWheel2)
            this.nodeMostTopWheel2.setVisible(true);

        if(this.bInFreeSelect){
            this.inSelect();

            this.bInFreeSelect = false;
        }
    },

    update : function(dt) {

        if(this.InfoLayer != undefined)
            return;

        var updatenextp=GamelogicMgr.instance.update(dt);
        if(!updatenextp){
            return;
        }
        if(this.bInitOneGame){
            this.bInitOneGame = false;

            this.refreshWheel();
            //setTimeout(function(){
            //    this.playGameAni();
            //
            //    if(this.nodeWheel1)
            //        this.nodeWheel1.setVisible(true);
            //
            //    if(this.nodeWheel2)
            //        this.nodeWheel2.setVisible(true);
            //
            //    if(this.nodeMoreTopWheel1)
            //        this.nodeMoreTopWheel1.setVisible(true);
            //
            //    if(this.nodeMoreTopWheel2)
            //        this.nodeMoreTopWheel2.setVisible(true);
            //
            //    if(this.nodeMostTopWheel1)
            //        this.nodeMostTopWheel1.setVisible(true);
            //
            //    if(this.nodeMostTopWheel2)
            //        this.nodeMostTopWheel2.setVisible(true);
            //}.bind(this),200);
        }

        GameDataMgr.instance.update(dt);
        this.GameCanvasMgr.update(dt);

        this.ModuleUI.update(dt);

        if(this.FreeResultLayer){
            this.FreeResultLayer.update(dt);
        }

        this.update_Wheel(dt);
        this.update_Scene(dt);

        if(this.bInitMusic && !this.bStopMusic && !cc.audioEngine.isMusicPlaying()) {
            this.playOneMusic();
        }

        if(this._winAni)
            this._winAni.update(dt);

        this.update_WinEffect(dt);
        this.update_ShowMoney(dt);
        //this.update_Rocker(dt);

        this.update_Line(dt);
        this.update_ShowResult(dt);

        this.update_Ani(dt);
        this.update_StopWheelSound(dt);
        this.update_showTopWheel(dt);

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

        //if(this.WaitAutoTime > 0) {
        //    //! 如果在小游戏中，则不自动开始游戏
        //    if(!this.bErrorPause && !this.bRun && !this.ModuleUI.isShowWin() && !this.GameScene.isSceneChging() &&
        //        this.DoubleLayer == undefined && this.BoxLayer == undefined && !this.bCanOpenBox) {
        //        this.WaitAutoTime -= dt;
        //
        //        if(this.WaitAutoTime <= 0) {
        //            this.WaitAutoTime = 0;
        //            this.beginAuto();
        //        }
        //    }
        //}

        //if(this.DisRunTime > 0) {
        //    this.DisRunTime -= dt;
        //
        //    if(this.DisRunTime <= 0) {
        //        this.DisRunTime = 0;
        //        this.refreshInfo();
        //    }
        //}

        this.update_WinAni(dt);
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

    refreshInfo : function (bjust) {
        this.refreshFreeInfo(bjust);

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
                this.btnStop.setVisible(false);
                this.btnRun.setVisible(true);
            }
            else {
                this.btnStop.setVisible(true);
                this.btnRun.setVisible(false);

                if(this.bCanStop && this.bQuickStopTime <= 0) {
                    this.btnStop.setEnabled(true);
                    this.btnStop.setBright(true);
                }
                else {
                    this.btnStop.setEnabled(false);
                    this.btnStop.setBright(false);
                }
            }
        }
        else {
            this.btnStop.setVisible(false);
            this.btnRun.setVisible(true);
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
            if(this.btnAll != undefined && this.btnAll != null){
                this.btnAll.setEnabled(false);
                this.btnAll.setBright(false);
            }

            this.btnAuto.setEnabled(false);
            this.btnAuto.setBright(false);
        }
        else {
            if(this.btnAll != undefined && this.btnAll != null){
                this.btnAll.setEnabled(true);
                this.btnAll.setBright(true);
            }

            this.btnAuto.setEnabled(true);
            this.btnAuto.setBright(true);
        }

        var bnum = this.lstBet[this.iBet];
        var allbnum = bnum * this.iLine;

        this.textAllBet.setString(this.chgString(allbnum));
        this.textAllBet1.setString(this.chgString(allbnum));

        if(this.textBet != undefined && this.textBet != null)
            this.textBet.setString(this.chgString(bnum));

        if(this.textBet1 != undefined && this.textBet1 != null)
            this.textBet1.setString(this.chgString(bnum));

        if(this.textLine != undefined && this.textLine != null)
            this.textLine.setString(this.iLine.toString());

        //this.textWin.setString(this.chgString(this.iWin));
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

            this.btnLeft2.setEnabled(false);
            this.btnLeft2.setBright(false);
            this.btnRight2.setEnabled(false);
            this.btnRight2.setBright(false);
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

            if(this.iBet == 0) {
                this.btnLeft2.setEnabled(false);
                this.btnLeft2.setBright(false);
            }
            else {
                this.btnLeft2.setEnabled(true);
                this.btnLeft2.setBright(true);
            }

            if(this.iBet == this.lstBet.length - 1) {
                this.btnRight2.setEnabled(false);
                this.btnRight2.setBright(false);
            }
            else {
                this.btnRight2.setEnabled(true);
                this.btnRight2.setBright(true);
            }
        }

        if(!this.bAutoRun) {
            if (/*allbnum > this.iMyMoney || */this.DisRunTime > 0 || this.bRun) {
                this.btnRun.setEnabled(false);
                this.btnRun.setBright(false);
            }
            else {
                this.btnRun.setEnabled(true);
                this.btnRun.setBright(true);
            }
        }
        else {
            this.btnRun.setEnabled(false);
            this.btnRun.setBright(false);
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

                //this.textFreeAllNum.setString(this.iTotalFreeNums.toString());
                //this.textFreeNum.setString(this.iFreeNums.toString() + '/' + this.iTotalFreeNums.toString());
            }

            if(this.textFreeAll != undefined && this.textFreeAll != null) {
                if(this.iFreeAll >= 0)
                    this.textFreeAll.setString(this.chgString(this.iFreeAll));
                else
                    this.textFreeAll.setString("0");
            }

            //this.textFreeNum.setString(this.iFreeNums.toString());
            //this.textFreeMul.setString("X" + this.iFreeMul);
            //this.textFreeAll.setString("￥" + this.chgString_Gray1(this.iFreeAll, 7));

            this.btnRun.setEnabled(false);
            this.btnRun.setBright(false);

            if(this.btnAll != undefined && this.btnAll != null){
                this.btnAll.setEnabled(false);
                this.btnAll.setBright(false);
            }

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

            this.btnLeft2.setEnabled(false);
            this.btnLeft2.setBright(false);

            this.btnRight2.setEnabled(false);
            this.btnRight2.setBright(false);

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

        this.refreshGiftGame();
    },

    //!刷新本轮数字显示
    refreshtextWin:function(iShowWin){
        if(iShowWin){
            this.textWin.setString(this.chgString1(iShowWin));
        }
        else{
            if (this.bFreeGame){
                if(this.iFreeAll <= 0)
                    this.iFreeAll = 0;
                this.textWin.setString(this.chgString1(this.iFreeAll));
            }
            else{
                this.textWin.setString(this.chgString1(this.iWin));
            }
        }
    },

    //! 根据红包进行刷新
    refreshGiftGame : function () {
        if(!GameMgr.singleton.isShowGift())
            return ;

        var data = GameMgr.singleton.getGiftData();

        if(data == undefined)
            return ;

        if(this.btnAll != undefined && this.btnAll != null){
            this.btnAll.setEnabled(false);
            this.btnAll.setBright(false);
        }

        if(this.btnLeft2 != undefined && this.btnLeft2 != null){
            this.btnLeft2.setEnabled(false);
            this.btnLeft2.setBright(false);
        }

        if(this.btnRight2 != undefined && this.btnRight2 != null){
            this.btnRight2.setEnabled(false);
            this.btnRight2.setBright(false);
        }

        var bnum = data.bet;
        var allbnum = bnum * data.line * data.times;

        if(this.textAllBet != undefined && this.textAllBet != null){
            this.textAllBet.setString(this.chgString(allbnum));
        }
        if(this.textAllBet1 != undefined && this.textAllBet1 != null){
            this.textAllBet1.setString(this.chgString(allbnum));
        }
        if(this.textBet != undefined && this.textBet != null){
            this.textBet.setString(this.chgString(bnum));
        }
        if(this.textBet1 != undefined && this.textBet1 != null){
            this.textBet1.setString(this.chgString(bnum));
        }
    },

    //! 离开红包游戏
    leftGiftGame : function () {
        this.restoreUserSetup();
        this.refreshInfo();
        this.refreshtextWin();
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

        if(this.aniSSSWin != undefined)
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
        var tempnum=num / GameDataMgr.instance.getCoinValueRate();
        var tprecision=2;
        if(num%10==0){
            tprecision=0;
        }
        var str=LanguageData.instance.fixedformatNumber(tempnum,tprecision);
        return  str;
    },
    chgString1: function (num) {
        num=num / GameDataMgr.instance.getCoinValueRate();
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
        num=num / GameDataMgr.instance.getCoinValueRate();
        var str=LanguageData.instance.fixedformatNumber(num,2,",");
        return  str;
    },

    //! 消息处理
    //! 收到用户的钱数据
    onMyMoney : function (money) {
        //! 根据服务器的要求强制刷新balance
        GamelogicMgr.instance.callRegistered("onMyMoney",money);
        if(this.iMyMoney == undefined){
            this.iMyMoney = money;
              this.ModuleUI.setBalance(money);
        }
        else {
            this.iNewMoney = money;
        }

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

    //! 显示icon的提示
    showIconTips : function (index, sender, spr) {
        if(index < 0 || index >= this.lsticon1.length || index >= this.lsticon2.length){
            return;
        }

        if(this.nodeTips == undefined || this.nodeTips == null){
            cc.log('tips node no defined');
            return;
        }

        if(this.bAutoRun || this.bRun || this.ModuleUI._getCurState('auto') != 0 || this.ModuleUI._getCurState('virRun') != 0 || this.ModuleUI.isShowWin())
            return;

        if(this.tipsLayer != undefined)
            return;

        var name = sender.getName();
        var pos = this.GameCanvasMgr.getPositionToParent(name, 'nodeUI1', spr.getPosition());
        var windex = -1;

        for(var ii = 0; ii < this.lstWheelName.length; ii++){
            var wheelname = this.lstWheelName[ii];

            if(name == wheelname){
                windex = ii;

                break;
            }
        }

        //! index是图标数据 sender点击的轮子 windex是当前的轮子数
        this.tipsLayer = new IceFireTipsLayer(this, index, windex, this.GameCanvasMgr);

        this.nodeTips.addChild(this.tipsLayer);
        this.nodeTips.setPosition(pos);

        this.ModuleUI._setState("icontips", 'show');

        this.playBtnSound();
    },

    //!点击关闭icon的提示
    onTouchCloseTips:function(sender, type){
        //if (type != ccui.Widget.TOUCH_ENDED)
        //    return;

        this.closeIconTips();
        this.playBtnSound();
    },

    //! 关闭icon的提示
    closeIconTips : function (index) {
        if(this.tipsLayer != undefined){
            this.nodeTips.removeChild(this.tipsLayer);
            this.tipsLayer = undefined;
        }

        this.ModuleUI._setState("icontips", 'hide');
    },

    msgSelectA:function(){
        this.aniBtn.animation.play('click_2', -1, false);

        GamelogicMgr.instance.callRegistered("gameCtrl2",GameMgr.singleton.getCurGameID(), 'selectfree', {curkey:0});
    },

    msgSelectB:function(){
        this.aniBtn.animation.play('click_1', -1, false);

        GamelogicMgr.instance.callRegistered("gameCtrl2",GameMgr.singleton.getCurGameID(), 'selectfree', {curkey:1});
    },


    onTouchA:function(sender, type){
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(sender.getParent().getOpacity() < 255)
            return;

        if(this.bSelectFree){
            return;
        }

        this.bSelectFree = true;

        this.msgSelectA();
    },

    onTouchB:function(sender, type){
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(sender.getParent().getOpacity() < 255)
            return;

        if(this.bSelectFree){
            return;
        }

        this.bSelectFree = true;

        this.msgSelectB();
    },

    onShowFGInfo:function(type){
        if(this.GameModuleInfo && this.GameModuleInfo.gmi) {
            if(this.GameModuleInfo.gmi.fgnums)
                this.iSelectFgNums = this.GameModuleInfo.gmi.fgnums;

            if(this.GameModuleInfo.gmi.exwilds)
                this.ExWilds = this.GameModuleInfo.gmi.exwilds;

            LanguageData.instance.setMapValue('FreeGameNums', this.iSelectFgNums);
            LanguageData.instance.setMapValue('ExWlids', this.ExWilds);
            LanguageData.instance.showTextStr("freeSpinsPopupIntro_desc1",this.textFreeWilds);
        }

        this.iSelectFGType = type;

        this.aniBack1._setVisible(type == 1);
        this.aniBack1_1._setVisible(type == 1);
        this.aniBack2._setVisible(type == 0);
        this.aniBack2_1._setVisible(type == 0);
        this.aniBack3._setVisible(type == 1);
        this.aniBack3_1._setVisible(type == 1);
        // this.aniBack4._setVisible(type == 0);
        // this.aniBack4_1._setVisible(type == 0);
        this.nodeAniBack4._setVisible(type == 0);
        this.nodeAniBack4_1._setVisible(type == 0);
        this.aniBack5._setVisible(type == 1);
        this.aniBack5_1._setVisible(type == 1);
        this.aniBack6._setVisible(type == 0);
        this.aniBack6_1._setVisible(type == 0);

        this.aniFireIce_1.setVisible(true);
        this.aniFireIce_2.setVisible(true);

        if(type == 0){
            var frame = cc.spriteFrameCache.getSpriteFrame('icefire_back_05.jpg');
            this.sprFGBack.setSpriteFrame(frame);
            this.sprFGBack.setVisible(true);
            this.aniBack.setVisible(false);
            this.aniBack_0.setVisible(false);

            // this.aniFGBack1.setVisible(true);
            // this.aniFGBack1.animation.play('lan1_1', -1, true);
            // this.aniFGBack2.setVisible(true);
            // this.aniFGBack2.animation.play('lan1_3', -1, true);
            this.aniFGBack1.setVisible(true);
            this.aniFGBack1.play('mianfei_bin', true);
            // this.aniFGBack2.setVisible(true);
            // this.aniFGBack2.play('mianfei_bin2', true);

            this.aniFGBack3._setVisible(true);
            this.aniFGBack4._setVisible(false);

            if(this.iBoxAniIndex != 1){
                this.iBoxAniIndex = 1;
                this.setBoxAni(false);
            }

            if(!this.nodeFreeSelect.isVisible() || !this.nodeFreeSelect2.isVisible() || !this.nodeFreeSelect3.isVisible() || !this.nodeFreeSelect4.isVisible())
                return;

            this.iFreeSelectIndex = 3;
            this.setFreeSelectAni(false);
            this.tmpSelectFreeLayer2.play('3_5', false);

            // this.aniFireB_1.setVisible(false);
            // this.aniIceA_1.setVisible(false);

            this.aniFireIce_1.animation.play('lan1_2', -1, false);
            this.aniFireIce_2.animation.play('lan2_2', -1, false);
            this.aniFireB_3.setVisible(false);

            this.aniIceA_1.animation.play('lan1_1', -1, true);
            this.aniIceA_2.animation.play('lan2_1', -1, true);
            this.aniIceA_3.animation.play('lan_shang', -1, true);

            this.aniFireIce_1.animation.setMovementEventCallFunc(function(sender, type, movenentID){
                if(type === ccs.MovementEventType.complete){
                    this.aniFireIce_1.animation.play('lan1_3', -1, true);
                }
            }.bind(this), this);

            this.aniFireIce_2.animation.setMovementEventCallFunc(function(sender, type, movenentID){
                if(type === ccs.MovementEventType.complete){
                    this.aniFireIce_2.animation.play('lan2_3', -1, true);
                }
            }.bind(this), this);

            cc.audioEngine.playEffect(res.IceFireSelectIce_mp3,false);
        }
        else{
            cc.spriteFrameCache.addSpriteFrames(res.IceFireJpg5_plist);
            var frame = cc.spriteFrameCache.getSpriteFrame('icefire_back_07.jpg');
            this.sprFGBack.setSpriteFrame(frame);
            this.sprFGBack.setVisible(true);
            this.aniBack.setVisible(false);
            this.aniBack_0.setVisible(false);

            // this.aniFGBack1.setVisible(true);
            // this.aniFGBack1.animation.play('hong1_1', -1, true);
            // this.aniFGBack2.setVisible(true);
            // this.aniFGBack2.animation.play('hong1_3', -1, true);
            this.aniFGBack1.setVisible(true);
            this.aniFGBack1.play('mianfei_huo', true);
            // this.aniFGBack2.setVisible(true);
            // this.aniFGBack2.play('hong1_3', true);

            this.aniFGBack3._setVisible(false);
            this.aniFGBack4._setVisible(true);

            if(this.iBoxAniIndex != 2){
                this.iBoxAniIndex = 2;
                this.setBoxAni(false);
            }

            if(!this.nodeFreeSelect.isVisible() || !this.nodeFreeSelect2.isVisible() || !this.nodeFreeSelect3.isVisible() || !this.nodeFreeSelect4.isVisible())
                return;

            this.iFreeSelectIndex = 3;
            this.setFreeSelectAni(false);
            this.tmpSelectFreeLayer2.play('3_4', false);

            // this.aniFireB_1.setVisible(false);
            // this.aniIceA_1.setVisible(false);

            this.aniFireB_1.animation.play('hong1_1', -1, true);
            this.aniFireB_2.animation.play('hong2_1', -1, true);
            this.aniFireB_3.animation.play('hong_shang', -1, true);

            this.aniFireIce_1.animation.play('hong1_2', -1, false);
            this.aniFireIce_2.animation.play('hong2_2', -1, false);
            this.aniIceA_3.setVisible(false);

            this.aniFireIce_1.animation.setMovementEventCallFunc(function(sender, type, movenentID){
                if(type === ccs.MovementEventType.complete){
                    this.aniFireIce_1.animation.play('hong1_3', -1, true);
                }
            }.bind(this), this);

            this.aniFireIce_2.animation.setMovementEventCallFunc(function(sender, type, movenentID){
                if(type === ccs.MovementEventType.complete){
                    this.aniFireIce_2.animation.play('hong2_3', -1, true);
                }
            }.bind(this), this);

            cc.audioEngine.playEffect(res.IceFireSelectFire_mp3,false);
        }
    },

    onTouchCloseSelect : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.nodeFreeSelect.setVisible(false);
        this.ModuleUI._setState('freeselect', 'hide');
        this.sprFGBack.setVisible(true);
        this.aniBack.setVisible(false);
        this.aniBack_0.setVisible(false);

        this.inFree(true);
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
                        this.lstwheel[ii].chgIcon(this.lstWinSymbol.WL, this.lstchgicon[this.iFreeType], this.lstchgbicon[this.iFreeType], this.lstchgiconani[this.iFreeType]);
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

    //!设置disconnect界面
    setDisconnect: function (type1, type2, strerror) {
        GamelogicMgr.instance.callRegistered("setDisconnect",type1, type2, strerror);
        if(GamelogicMgr.instance.needNativeDisconnect()){
            // var layer = new IceFireDisconnectLayer(this.nodeDisconnect, this, type1, type2, strerror);
            // this.nodeDisconnect.addChild(layer, 11);

            var layer = new DisconnectDialog(this, type1, type2, strerror);
            this.addChild(layer, 11);

            this.ModuleUI._setState('disconnect', 'show');
        }
    },

    //! 收到断线
    onDisconnect : function () {
        if(this.ErrorLayer != undefined)
            return ;
        GamelogicMgr.instance.callRegistered("setDisconnect",1, 0);
        if(GamelogicMgr.instance.needNativeDisconnect()){
            var layer = new IceFireDisconnectLayer(this.nodeDisconnect, this, 1, 0);
            this.nodeDisconnect.addChild(layer, 11);
            this.DisconnectLayer = layer;

            this.ModuleUI._setState('disconnect', 'show');
        }
    },

    //! 收到重连
    onReconnnect : function () {
        if(this.DisconnectLayer == undefined)
            return ;

        this.nodeDisconnect.removeChild(this.DisconnectLayer);
        this.DisconnectLayer = undefined;

        this.ModuleUI._setState('disconnect', 'hide');
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
        GamelogicMgr.instance.callRegistered("setDisconnect",ctype, type, strerror);
        if(GamelogicMgr.instance.needNativeDisconnect()){
            var layer = new IceFireDisconnectLayer(this.nodeDisconnect, this, ctype, type, strerror);
            this.nodeDisconnect.addChild(layer, 12);
            this.ErrorLayer = layer;

            this.ModuleUI._setState('disconnect', 'show');
        }
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
        //if (type != ccui.Widget.TOUCH_ENDED)
        //    return ;

        //if(this.bRun || this.bAutoRun)
        //    return ;

        this.runOne();
    },

    onTouchMenu : function ( sender, type) {
        if(this.gamemenuLayer == undefined)
            return;

        this.gamemenuLayer.onBtnOpen();
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

    onTouchAll : function (value, sender, type) {
        //if (type != ccui.Widget.TOUCH_ENDED)
        //    return ;

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

        this.iBet = value;

        if(this.iBet == this.lstBet.length - 1){
            var rate=GameDataMgr.instance.getCoinValueRate();
            var allbnumber = this.lstBet[this.iBet] * this.iLine / rate;
            // var cfg = {};
            // cfg.bcash = true;
            // allbnum = GameDataMgr.instance._formatByConfig(allbnum, cfg);
            var allbnum = LanguageData.instance.formatCustomMoney(allbnumber,0);

            this.setDisconnect(2, -1, allbnum);
        }

        //this.iLine = 50;
        //this.setUserSetup("narutouserline", this.iLine);

        this.saveBetNum();

        this.refreshInfo();

        this.playBtnSound();

        // if(this.bRun || this.bAutoRun)
        //     return ;
        //
        // // cc.audioEngine.playEffect(res.KofBtnRun_mp3, false);
        // // this.runOne();
        //
        // this.showLine(this.iLine, 0.5, this.runOne);
    },

    onTouchAuto : function (sender, type) {
         if (type != ccui.Widget.TOUCH_ENDED)
             return ;

        // //! 测试
        // for(var ii = 0; ii < this.lstwheel.length; ++ii) {
        //     this.lstwheel[ii].clearIcon();
        // }
        // return ;

         if(this.bRun || this.bAutoRun)
             return ;

         this.playBtnSound();

         var layer = new IceFireAutoSelectLayer(this);
        this.addChild(layer, 1);
    },

    onTouchAutoStop : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

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
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

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

        //this.setUserSetup("userbet", this.iBet);
        this.saveBetNum();
        this.refreshInfo();
    },

    onTouchRight2 : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

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

        //this.setUserSetup("userbet", this.iBet);
        this.saveBetNum();
        this.refreshInfo();
    },

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
                    this.ModuleUI.setFreeGame(this.bFreeGame, undefined, undefined, this.iFreeNums);
                }
                this.bShowFreeResult = false;
            }

            this.clearResultDis();
            this.refreshInfo();

            this.iFreeMul = 0;

            if(!this.bPlayFreeMusic)
                this.playOneMusic();

            this.playFreeLogoAni();
        }

        if(this.WaitAutoTime > 1)
            this.WaitAutoTime = 1;
    },

    openFreeResult : function () {
        var allbnum = this.ModuleUI.getTotalBet();

        var cnum = this.iFreeAll / allbnum;

        var freewin = this.iFreeAll / (this.ModuleUI.getCoinValue() / GameDataMgr.instance.getCoinValueRate());
        if(cnum >= 1){
            if(this.FreeResultLayer == undefined){
                this.FreeResultLayer = new IceFireFreeGameLayer(this, this.iTotalFreeNums, freewin, cnum, this.iSelectFGType, this.nodeFreeResult, this.nodeFreeResult2);
            }
            else{
                this.FreeResultLayer.refreshStatus(this, this.iTotalFreeNums, freewin, cnum, this.iSelectFGType);
            }

            this.ModuleUI._setState('freeresult', 'show');

            if(res.IceFireFreeResult_mp3)
                cc.audioEngine.playEffect(res.IceFireFreeResult_mp3, false);
        }
        else{
            this.leftFreeResult();
        }

        return;
        if(this.FreeResultLayer != undefined){
            this.FreeResultLayer.setVisible(true);
            this.FreeResultLayer.setPlayBeginAni();
            this.ModuleUI._setState('freeresult', 'show');
            this.FreeResultLayer.refreshText(this, this.iTotalFreeNums, this.iFreeAll, this.iSelectFGType);
        }
        else{
            var layer = new IceFireFreeGameLayer(this, this.iTotalFreeNums, this.iFreeAll, this.iSelectFGType);
            this.nodeFreeResult.addChild(layer);

            this.ModuleUI._setState('freeresult', 'show');

            this.FreeResultLayer = layer;

            this.FreeResultLayer.setPlayBeginAni();
        }

    },

    leftFreeResult : function () {
        if(this.ModuleUI._getCurState('freeresult') == 'show'){
            if(this.FreeResultLayer != undefined){
                if(!this.FreeResultLayer.bCanTouch)
                    return;
                else
                    this.FreeResultLayer.bCanTouch = false;
            }
        }

        if(this.bFreeGame) {
            this.bFreeGame = false;
            this.ModuleUI.setFreeGame(this.bFreeGame, undefined, undefined, 0);

            this.iCascade = 0;

            this.playOneMusic();

            if(this.iFreeType >= 0) {
                for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                    this.lstwheel[ii].chgIcon(this.lstWinSymbol.WL, this.lsticon[this.lstWinSymbol.WL], this.lstbicon[this.lstWinSymbol.WL], this.lsticonani[this.lstWinSymbol.WL]);
                }

                this.iFreeType = -1;
            }

            this.GameScene.setState(3, 0);
            this.setWin_auto(this.iFreeAll);

            this.bSuperFreeGame = false;

            this.refreshInfo();
        }
        //this.playOneMusic();
        this.iFreeNums = -1;
        this.iNewFreeNums = 0;
        this.iFreeMul = 0;
        this.iFreeAll = -1;
        this.iNewFreeAll = 0;
        this.iFreeBeginWin = 0;
        this.iWin = 0;

        if(this.iAutoNum > 0) {
            this.bAutoRun = true;
            this.WaitAutoTime = 1;
        }
        else {
            this.bAutoRun = false;
        }

        if(this.iSelectFGType == 0){
            this.iBoxAniIndex = 4;
            this.setBoxAni(false);
        }
        else if(this.iSelectFGType == 1){
            this.iBoxAniIndex = 5;
            this.setBoxAni(false);
        }
        else{
            this.iBoxAniIndex = 6;
            this.setBoxAni(false);
        }

        this.iSelectFGType = -1;

        //! 回到之前的局面继续
        //this.setRun(true);
        //this.GameScene.setState(3, 0);

        this.refreshtextWin();

        this.ModuleUI._setState('freeresult', 'hide');
        this.ModuleUI._setState('virRun', 0);
        this.ModuleUI._setState('free', 0);

        this.sprFGBack.setVisible(false);
        this.aniBack.setVisible(true);
        this.aniBack_0.setVisible(true);

        this.aniFGBack1.setVisible(false);
        //this.aniFGBack2.setVisible(false);
        this.aniFGBack3._setVisible(false);
        this.aniFGBack4._setVisible(false);
        //if(this.bQuickDown != undefined && !this.bQuickDown)
        //    this.bPasueWheel = false;

        // var self = this;
        // MainClient.singleton.spin(GameMgr.singleton.getCurGameID(), 1, 1, this.iLine, function (isok) {
        //     if (isok) {
        //         //self.onSpinResult1();
        //     }
        // });

        if(this.NewGameModuleInfo.spinret.realsuperfgnums > 0) {
            this.inFree(false);
        }
    },

    inFree : function (bselect) {
        if(bselect) {
            this.bSuperFreeGame = false;
            this.iFreeNums = this.iSelectFgNums;
            this.iTotalFreeNums = this.iSelectFgNums;         //! 免费次数
        }
        else if(this.NewGameModuleInfo.spinret) {
            if (this.NewGameModuleInfo.spinret.realsuperfgnums > 0) {
                //this.bSuperFreeGame = true;
                this.iFreeNums = this.NewGameModuleInfo.spinret.realsuperfgnums;
                this.iTotalFreeNums = this.NewGameModuleInfo.spinret.realsuperfgnums;         //! 免费次数
            }
        }
        else {
            this.bSuperFreeGame = false;
        }

        this.iCascade = 0;
        this.iSuperMul = 1;

        this.bFreeGame = true;
        this.ModuleUI.setFreeGame(this.bFreeGame, undefined, undefined, this.iFreeNums, 1);

        this.bPlaySelectFreeMusic = false;
        this.playOneMusic();

        //this.bAutoRun = true;

        // this.iFreeNums = 10;
        // this.iTotalFreeNums = 10;         //! 免费次数

        this.setRun(false);
        //this.chgScene(2, 101 / 24);
        //this.ModuleUI._setState('freeani', 'show');

        this.iFreeAll = 0;
        this.refreshtextWin();
        this.refreshInfo(true);

        //this.ModuleUI._setState('freeani', 'hide');
        //this.ModuleUI._setState('free', 1);

        if(bselect){
            this.chgScene(1);
        }
        else{
            this.chgScene(2);
            this.bPasueWheel = true;
        }
    },

    //!开始进入选择免费模式
    inSelect : function () {
        if(this.NewGameModuleInfo.spinret && this.NewGameModuleInfo.spinret.curfg) {
            this.iSelectFgNums = this.NewGameModuleInfo.spinret.curfg.fgnums;
            this.ExWilds = this.NewGameModuleInfo.spinret.curfg.exwilds;
        }
        else {
            this.iSelectFgNums = this.NewGameModuleInfo.fgnums;
            this.ExWilds = this.NewGameModuleInfo.exwilds;
        }

        this.bSelectFree = false;

        this.ModuleUI._setState('freeselect', 'show');
        this.ModuleUI._setState('virRun', 1);

        ////!测试代码
        //this.setSelectType(0);
        //this.nodeFreeSelect.setVisible(true);
        //this.nodeFreeSelect2.setVisible(true);
        //this.nodeFreeSelect3.setVisible(true);
        //
        //this.spineLongA.setAnimation(0, 'icefire_mianfeiyouxi1', true);
        //this.spineLongB.setAnimation(0, 'icefire_mianfeiyouxi2', true);
        //
        //this.nodeFreeLongA.setVisible(true);
        //this.nodeFreeLongB.setVisible(true);
        //
        //this.iFreeSelectIndex = 0;
        //this.setFreeSelectAni(false);
        //return;

        this.tmpInSelectFreeLayer = CcsResCache.singleton.load(res.IceFireGameNodeInFreeSelect_json);

        this.nodeInFreeSelect.addChild(this.tmpInSelectFreeLayer.node);
        this.tmpInSelectFreeLayer.node.runAction(this.tmpInSelectFreeLayer.action);
        this.tmpInSelectFreeLayer.action.gotoFrameAndPlay(0, this.tmpInSelectFreeLayer.action.getDuration(), false);

        LanguageData.instance.setMapValue('FreeGameNums', this.iSelectFgNums);
        LanguageData.instance.setMapValue('ExWlids', this.ExWilds);
        LanguageData.instance.showTextStr("freeSpinsPopupIntro_desc1",this.textFreeWilds);

        if(res.IceFireChgFree_mp3)
            cc.audioEngine.playEffect(res.IceFireChgFree_mp3, false);

        if(!this.bPlaySelectFreeMusic){
            this.bPlaySelectFreeMusic = true;
            this.playOneMusic();
        }
    },

    update_inSelectFree:function(){
        if(this.tmpInSelectFreeLayer == undefined)
            return;

        if(this.tmpInSelectFreeLayer.action.getCurrentFrame() >= this.tmpInSelectFreeLayer.action.getDuration()){
            CcsResCache.singleton.release(this.tmpInSelectFreeLayer);
            this.tmpInSelectFreeLayer = undefined;

            this.nodeFreeSelect.setVisible(true);
            this.nodeFreeSelect2.setVisible(true);
            this.nodeFreeSelect3.setVisible(true);
            this.nodeFreeSelect4.setVisible(true);

            this.spineLongA.setAnimation(0, 'icefire_mianfeiyouxi1', true);
            this.spineLongB.setAnimation(0, 'icefire_mianfeiyouxi2', true);

            this.nodeFreeLongA.setVisible(true);
            this.nodeFreeLongB.setVisible(true);

            this.iFreeSelectIndex = 0;
            this.setFreeSelectAni(false);
        }
    },

    update_selectFree:function(dt){
        if(this.iFreeSelectIndex == -1)
            return;

        if(this.tmpSelectFreeLayer.isEnd()){
            if(this.iFreeSelectIndex == 0){
                this.iFreeSelectIndex = 1;
                this.setFreeSelectAni(false);

                this.aniFireB_1.setVisible(false);
                this.aniFireB_2.setVisible(true);
                this.aniFireB_3.setVisible(true);
                this.aniIceA_1.setVisible(false);
                this.aniIceA_2.setVisible(true);
                this.aniIceA_3.setVisible(true);
                this.aniFireIce_1.setVisible(false);
                this.aniFireIce_2.setVisible(false);

                this.aniFireB_1.animation.play('hong1_1', -1, true);
                this.aniFireB_2.animation.play('hong2_1', -1, true);
                this.aniFireB_3.animation.play('hong_shang', -1, true);

                this.aniIceA_1.animation.play('lan1_1', -1, true);
                this.aniIceA_2.animation.play('lan2_1', -1, true);
                this.aniIceA_3.animation.play('lan_shang', -1, true);

                this.aniBtn.setVisible(true);
                this.aniBtn.animation.play('wait_1', -1, true);
                //this.aniA.setVisible(true);
                //this.aniB.setVisible(true);
                //this.aniA.animation.play('wait_2', -1, true);
            }
            else if(this.iFreeSelectIndex == 1){
                this.iFreeSelectIndex = -1;
                this.aniFireB_1.setVisible(true);
                this.aniIceA_1.setVisible(true);

                //!直接跳过选择测试
                if(this.iSelectFGType >= 0){
                    if(this.iSelectFGType == 0){
                        this.msgSelectA();
                    }
                    else{
                        this.msgSelectB();
                    }
                }
            }
            else if(this.iFreeSelectIndex == 3){
                if(this.iSelectFGType == 0){
                    this.spineLongA.setAnimation(0, 'icefire_mianfeiyouxi3', false);

                    this.iFreeSelectIndex = 5;
                    this.setFreeSelectAni(false);
                }
                else if(this.iSelectFGType == 1){
                    this.spineLongB.setAnimation(0, 'icefire_mianfeiyouxi4', false);

                    this.iFreeSelectIndex = 4;
                    this.setFreeSelectAni(false);
                }
            }
            else if(this.iFreeSelectIndex == 4 || this.iFreeSelectIndex == 5){
                this.iFreeSelectIndex = -1;

                this.aniFireB_1.setVisible(true);
                this.aniIceA_1.setVisible(true);

                setTimeout(function(){
                    this.nodeFreeSelect.setVisible(false);
                    this.nodeFreeSelect2.setVisible(false);
                    this.nodeFreeSelect3.setVisible(false);
                    this.nodeFreeSelect4.setVisible(false);

                    this.ModuleUI._setState('freeselect', 'hide');
                    this.sprFGBack.setVisible(true);
                    this.aniBack.setVisible(false);
                    this.aniBack_0.setVisible(false);

                    //this.ModuleUI._setState('virRun', 0);
                    this.inFree(true);
                }.bind(this), 2000);
            }
        }
    },

    setFreeSelectAni:function(bloop){
        if(this.iFreeSelectIndex < 0 || this.iFreeSelectIndex >= this.FreeSelectAniName.length)
            return;

        // //! 暂时屏蔽3的动画
        // if(this.iFreeSelectIndex == 3)
        //     return ;

        this.tmpSelectFreeLayer.play(this.FreeSelectAniName[this.iFreeSelectIndex], bloop);

        if(this.iFreeSelectIndex != 3)
            this.tmpSelectFreeLayer2.play(this.FreeSelectAniName[this.iFreeSelectIndex], bloop);

        this.tmpSelectFreeLayer3.play(this.FreeSelectAniName[this.iFreeSelectIndex], bloop);
        this.tmpSelectFreeLayer4.play(this.FreeSelectAniName[this.iFreeSelectIndex], bloop);
    },

    //!0选择冰 1选择火 -1普通游戏或超级免费
    setSelectType:function(type){
        this.iSelectFGType = type;

        this.bSelectFree = true;
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
        GameAssistant.singleton.setMusicType("icefire", 0);
    },

    onTouchCloseSound : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.setPlaySound(true);
        GameAssistant.singleton.setMusicType("icefire", 1);
    },

    onTouchOpenEffect : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.setPlayEffect(false);
        GameAssistant.singleton.setEffectType("icefire", 0);
    },

    onTouchCloseEffect : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.setPlayEffect(true);
        GameAssistant.singleton.setEffectType("icefire", 1);
    },

    onTouchBtnCoins:function(sender, type, bshowcoins){
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.bShowCoins = bshowcoins;
        this.ModuleUI.setShowCoins(bshowcoins);
    },

    onTouchBtnQuickSpin:function(sender, type, bquickspin){
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.bQuickSpin = bquickspin;
    },

    onTouchBtnSetAuto:function(sender, type, bsetauto){
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.bSetAuto = bsetauto;
    },

    onTouchSetup : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.MenuBarLayer) {
            this.playBtnSound();
            this.MenuBarLayer.onTouchSetup();
            return ;
        }

        this.playBtnSound();

        var layer = new IceFireSetupLayer(this);
        this.addChild(layer, 1);
    },

    onTouchClose : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.playBtnSound();

        close_game();
    },

    onTouchHelp : function (sender, type, hei) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.InfoLayer != undefined)
            return;

        //if(res.IceFireBtnRule_mp3)
        //    cc.audioEngine.playEffect(res.IceFireBtnRule_mp3,false);

        this.openHelp(hei);
        //open_help('res/icefire/icefire_help/icefire_index.html');
        //this.playBtnSound();
        //this.showHelp(1);
    },

    openHelp:function(hei){
        var size = cc.winSize;

        //var webView = new ccui.WebView('res/icefire/icefire_help/icefire_index.html');
        //var webView = new ccui.WebView('https://www.baidu.com/');

        var webView;

        if(ICEFIRE_HELP) {
            webView = new ccui.WebView(ICEFIRE_HELP);
        }
        else if (ICEFIRE_SRCROOT) {
            webView = new ccui.WebView(ICEFIRE_SRCROOT + 'help.html');
        }
        else
            webView = new ccui.WebView('res/icefire/help/help.html');

        var w = cc.view.getFrameSize().width;
        var h = cc.view.getFrameSize().height;

        webView.setContentSize(w, hei);
        webView.setPosition(0, h - hei);
        webView.attr({anchorX: 0, anchorY: 0});
        webView.setScalesPageToFit(true);
        webView._renderCmd._div.style["background"] = "#000";

        var node = new cc.Node();
        this.addChild(webView);

        this.webView = webView;
        this.webView.visit();

        // if(webView) {
        //     // var iframe = webView._renderCmd._iframe;x
        //     // iframe.contentWindow.postMessage('MessageFromIndex1','*');
        //     webView.setEventListener("load",  function () {
        //         var iframe = webView._renderCmd._iframe;
        //         iframe.contentWindow.postMessage(LanguageData.languageForHtml(),'*');
        //     });
        // }

        if(webView) {
            var iframe = webView._renderCmd._iframe;
            // iframe.contentWindow.postMessage('MessageFromIndex1','*');
            webView.setEventListener("load",  function () {
                var data={
                    size:{
                        w:w,
                        h:hei,
                    },
                    data:LanguageData.languageForHtml(),
                }
                iframe.contentWindow.postMessage(data,'*');
            });
        }
    },

    closeHelp:function(){
        if(this.webView){
            this.webView.removeFromParent(true);
            this.webView = undefined;
        }
    },

    setHelpSize:function(w, h, y){
        if(this.webView == undefined || this.webView == null)
            return;

        var iframe = this.webView._renderCmd._iframe;
        var data={
            size:{
                w:w,
                h:h,
            },
            data:{},
        }
        iframe.contentWindow.postMessage(data,'*');

        this.webView.setContentSize(w, h);
        this.webView.setPosition(0, y);
    },

    onTouchGameRules: function (sender, type, hei) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.InfoLayer != undefined)
            return;

        this.openGameRules(hei);
    },

    openGameRules: function (hei) {
        var size = cc.winSize;

        //var webView = new ccui.WebView('res/icefire/icefire_help/icefire_index.html');
        //var webView = new ccui.WebView('https://www.baidu.com/');

        var webView_gameRules;

        if(ICEFIRE_GAMERULES) {
            webView_gameRules = new ccui.WebView(ICEFIRE_GAMERULES);
        }
        else if (ICEFIRE_SRCROOT) {
            webView_gameRules = new ccui.WebView(ICEFIRE_SRCROOT + 'index.html');
        }
        else
            webView_gameRules = new ccui.WebView('res/icefire/gamerules/index.html');

        var w = cc.view.getFrameSize().width;
        var h = cc.view.getFrameSize().height;

        webView_gameRules.setContentSize(w, hei);
        webView_gameRules.setPosition(0, h - hei);
        webView_gameRules.attr({anchorX: 0, anchorY: 0});
        webView_gameRules.setScalesPageToFit(true);
        webView_gameRules._renderCmd._div.style["background"] = "#000";

        var node = new cc.Node();
        this.addChild(webView_gameRules);

        this.webView_gameRules = webView_gameRules;
        this.webView_gameRules.visit();

        if(webView_gameRules) {
            var iframe = webView_gameRules._renderCmd._iframe;
            // iframe.contentWindow.postMessage('MessageFromIndex1','*');
            webView_gameRules.setEventListener("load",  function () {
                var data={
                    size:{
                        w:w,
                        h:hei,
                    },
                    data:LanguageData.languageForHtml(),
                }
                iframe.contentWindow.postMessage(data,'*');
            });
        }
    },

    closeGameRules:function(){
        if(this.webView_gameRules){
            this.webView_gameRules.removeFromParent(true);
            this.webView_gameRules = undefined;
        }
    },

    setGameRulesSize:function(w, h, y){
        if(this.webView_gameRules == undefined || this.webView_gameRules == null)
            return;

        var iframe = this.webView_gameRules._renderCmd._iframe;
        var data={
            size:{
                w:w,
                h:h,
            },
            data:{},
        };
        iframe.contentWindow.postMessage(data,'*');

        this.webView_gameRules.setContentSize(w, h);
        this.webView_gameRules.setPosition(0, y);
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
            var volume = GameAssistant.singleton.getVolumeValue('icefire');
            if(volume){
                this.SoundValue = volume;
            }
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
            var volume = GameAssistant.singleton.getVolumeValue('icefire');
            if(volume){
                this.EffectValue = volume;
            }
            cc.audioEngine.setEffectsVolume(this.EffectValue);
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
        cc.audioEngine.playEffect(res.IceFireBtnClick_mp3, false);
    },

    //! 播放一个音乐
    playOneMusic : function () {
        if(!this.bInitMusic)
            return ;

        // if(this.bFreeGame) {
        //     cc.audioEngine.playMusic(res.IceFireFreeMusci1_mp3, false);
        //     this.bPlayFreeMusic = true;
        //     return ;
        // }
        if(this.bPlaySelectFreeMusic && res.IceFireFreeMusciSelect_mp3){
            cc.audioEngine.playMusic(res.IceFireFreeMusciSelect_mp3, false);
            return;
        }

        if(this.bFreeGame) {
            if(this.bSuperFreeGame) {
                cc.audioEngine.playMusic(res.IceFireFreeMusci1_mp3, false);
            }
            else {
                cc.audioEngine.playMusic(res.IceFireFreeMusci2_mp3, false);
            }

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

    num:0,
    //! 转一次
    runOne : function () {
        if(this.ErrorLayer != undefined)
            return false;

        if(this.nodeDisconnect.isVisible())
            return false;

        if(this.bRun)
            return false;

        for(var ii = 0; ii < 5; ++ii) {
            if(this.lstwheel[ii].bRun)
                return false;

            if(this.lstTopWheel[ii].bRun)
                return false;

            if(this.lstMostTopWheel[ii].bRun)
                return false;
        }

        var cnums = this.GameCanvasMgr.getCurCanvasIndex();
        var cnode = this.GameCanvasMgr._getNode('layUiGmr',cnums);

        if(cnode != null && cnode.isVisible()){
            this.ModuleUI._setState('openUi', 0);
            if(this.ModuleUI._getCurState('auto') != 1){
                return false;
            }
        }

        var bnum = this.lstBet[this.iBet];
        var allbnum = bnum * this.iLine;

        bnum = this.ModuleUI.getCoinValue();
        allbnum = this.ModuleUI.getTotalBet();

        if(!GameMgr.singleton.isShowGift() && !this.bFreeGame && !this.ModuleUI.canBetting() && !this.bRewatch && !this.isPrepaid()) {
            //! 如果是ygg则直接发送错误下注触发底层对话框
            //参数在各自平台内能取到，不用传参
            GamelogicMgr.instance.callRegistered("spineError");

            this.ModuleUI._setState('auto', 0);
            return false;
        }

        if(this.bFreeGame)
            bnum = -1;

        //! 轮子有改变
        if(this.newWheelName != undefined) {
            this.setCurWheel(this.newWheelName);
            this.newWheelName = undefined;
        }

        this.clearResultDis();
        this.closeIconTips();

        //this.showWinAni(false, 0);
        this.setAniState(1);
        this.bCanDouble = false;

        if(!GameMgr.singleton.isShowGift() && !this.bFreeGame && !this.isPrepaid()/*&& !this.bRewatch*/) {
            this.iMyMoney -= allbnum;
            this.ModuleUI.betting();
        }

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

        this.iWin = 0;
        this.bRun = true;
        this.WaitStopTime = -1;
        this.bCanStop = false;
        this.bQuickStop = false;
        this.bQuickStopTime = 0.5 + 4 * 0.2;
        this.bNewGame = true;
        this.iFreeNums = GameDataMgr.instance.getNumberValue('_iFreeNum');

        this.setRun(true);

        var self = this;
        //! 之前流程
        GamelogicMgr.instance.callRegistered("spinActionPre",GameMgr.singleton.getCurGameID(), bnum, 1, this.ModuleUI.getBet(), this.bFreeGame);

        this.iCascade = 0;

        this.refreshInfo();
        this.refreshtextWin();

        if(res.IceFireBtnRun_mp3)
            cc.audioEngine.playEffect(res.IceFireBtnRun_mp3,false);

        if(this.ModuleUI._getCurState('auto') != 1  && !this.bFreeGame)
            this.ModuleUI._setState('anirun', 1);

        if(this.bRewatch){
            this.bRewatch = false;
            this.ModuleUI._setState('rewatch', 2);
        }

        return true;
    },

    //! 是否是预付费游戏（根据YGG消息增加）
    isPrepaid : function () {
        var result=GamelogicMgr.instance.isPrepaid();
        return result;
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

                this.setDisconnect(2, 1);
            }
        }
    },

    setWin_auto : function (win) {
        if(this.iAutoNum > 0 && this.iAutoWin > 0) {
            if(win > this.iAutoWin) {
                this.setAuto(0);

                this.setDisconnect(2, 2);
            }
        }
    },

    //! 开始自动转
    beginAuto : function() {
        return;
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
                //this.setFightState(15);
                this.openFreeResult();
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
        //this.update_GoldAni(dt);
        // this.updata_Lamp(dt);
        // this.updata_Neon(dt);
        this.update_chgFreeAniEnd(dt);
        this.update_chgWLAniEnd(dt);
        this.update_inSelectFree(dt);
        this.update_selectFree(dt);
        this.update_supFreeAni(dt);
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

        //for(var ii = 0; ii < this.lstwheel.length; ++ii) {
        //    this.lstwheel[ii].setState(1);
        //}

        if(this.helpLayer1 != undefined)
            this.helpLayer1.clearResult();

        if(this.helpLayer2 != undefined)
            this.helpLayer2.clearResult();

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

            if(this.helpLayer1 != undefined)
                this.helpLayer1.setResult(type, symbol, line, num);

            if(this.helpLayer2 != undefined)
                this.helpLayer2.setResult(type, symbol, line, num);

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

        if(winmul >= 17)
            wintype = 3;
        else if(winmul >= 7)
            wintype = 2;
        else if(winmul >= 3)
            wintype = 1;

        this.playWinEffectByWinType(wintype);

        //wintype = 3;

        // if(winmul >= 34)
        //     wintype = 4;
        // else if(winmul >= 26)
        //     wintype = 3;
        // else if(winmul >= 17)
        //     wintype = 2;
        // else if(winmul >= 7)
        //     wintype = 1;

        // var person = mineff + 1;
        // var person2 = mineff2 + 1;
        //
        // // wintype = 1;
        // // person = 2;
        //
        // var lstperson = [0, 1, 2, 3, 4, 5, 6, 7];
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

        if(this.WinAni2 == undefined && wintype < this.lstWinAni.length) {
            //this.WinAni2 = ccs.load(this.lstWinAni[wintype]);
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

            // var sprPerson1 = findNodeByName(this.WinAni2.node, "sprPerson1");
            //
            // if(sprPerson1 != undefined && sprPerson1 != null) {
            //     var frame = cc.spriteFrameCache.getSpriteFrame("sd2aniperson" + wintype.toString() + "1" + person.toString() + ".jpg");
            //
            //     if(frame != undefined && frame != null) {
            //         sprPerson1.setSpriteFrame(frame);
            //         sprPerson1.setBlendFunc(gl.ONE_MINUS_DST_ALPHA, gl.SRC_COLOR);
            //     }
            // }

            // var sprPerson2 = findNodeByName(this.WinAni2.node, "sprPerson2");
            //
            // if(sprPerson2 != undefined && sprPerson2 != null) {
            //     var frame = cc.spriteFrameCache.getSpriteFrame("sd2aniperson" + wintype.toString() + "2" + person2.toString() + ".jpg");
            //
            //     if(frame != undefined && frame != null)
            //         sprPerson2.setSpriteFrame(frame);
            // }

            this.GameLayer.node.addChild(this.WinAni2.node, 2);
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
    },

    //!显示胜利动画
    showAllResult_ani: function () {
        return;
        if (this.aniMeiMei1 != undefined) {
            this.aniMeiMei1.setAnimation(0, 'loading3', false);
            var self = this;
            this.aniMeiMei1.setCompleteListener(function () {
                if (self.bFreeGame)
                    self.aniMeiMei1.setAnimation(0, 'loading2', true);
                else
                    self.aniMeiMei1.setAnimation(0, 'loading1', true);

                self.aniMeiMei1.setCompleteListener(null);
            });
        }

        if (this.aniMeiMei2 != undefined) {
            this.aniMeiMei2.setAnimation(0, 'loading3', false);
            var self = this;
            this.aniMeiMei2.setCompleteListener(function () {
                if (self.bFreeGame)
                    self.aniMeiMei2.setAnimation(0, 'loading2', true);
                else
                    self.aniMeiMei2.setAnimation(0, 'loading1', true);

                self.aniMeiMei2.setCompleteListener(null);
            });
        }

        this.bShowReSpin = false;

        //! 计算胜利倍数
        var winmul = this.iWin / (this.lstBet[this.iBet] * this.iLine * this.iTimes);

        this.WinAni2CurLevel = 0;
        this.WinAni2MaxLevel = 0;
        this.WinAni2BaseNum = this.lstBet[this.iBet] * this.iLine;

        if (GameMgr.singleton.isShowGift()) {
            var data = GameMgr.singleton.getGiftData(true);

            if (data != undefined) {
                winmul = this.iWin / (data.bet * data.line * data.times);
                this.WinAni2BaseNum = data.bet * data.line * data.times;
            }
        }

        if(this.iReSpinAllBnum > 0){
            winmul = this.iWin / this.iReSpinAllBnum;
            this.WinAni2BaseNum = this.iReSpinAllBnum;
        }

        // if(this.bFreeGame && this.iFreeMul > 0)
        //     winmul = (this.iWin * this.iFreeMul) / (this.lstBet[this.runBet] * this.runLine);

        var wintype = 0;

        if(winmul >= 1.5){
            wintype = 1;
        }

        if (winmul >= 7)
            this.WinAni2MaxLevel = 2;
        else if (winmul >= 3)
            this.WinAni2MaxLevel = 1;
        else
            this.WinAni2MaxLevel = 0;

        if (wintype === 0) {
            this._winAni.setPlayInfo(WIN2_ANIMATION_TYPE.WIN_1, WIN2_ANIMATION_STATE.STATE_SHOW);
            if(this.aniBenLun){
                this.aniBenLun.setVisible(true);
                this.aniPic.setVisible(false);
                this.aniBenLun.animation.play("benlun2", -1, false);
            }
        }
        else {
            this._winAni.setPlayInfo(WIN2_ANIMATION_TYPE.WIN_2, WIN2_ANIMATION_STATE.STATE_SHOW);

            this._winAni.setWinBaseNum(this.WinAni2BaseNum);

            this._winAni.setMaxLevel(this.WinAni2MaxLevel);

            this._winAni.setCurLevel(0);

            this._winAni.setShowNums(0);
        }

        this._winAni.setWinValue(this.iWin);

        //!设置胜利动画循环段需不需要播完再播放结束段
        var lstLoopEnd = [false, false, true];
        this._winAni.setCanLoopEnd(lstLoopEnd);

        //!设置有没有数字动画
        this._winAni.setHasTextAni(false);

        //var chgValue = this.iWin / 5000;
        //this._winAni.chgValueSpeed(chgValue);

        //if (wintype === 4) {
        //    this._winAni.setWinValue(this._effectMgr.getWinValue());
        //}
    },

    //!胜利动画结束时回调
    winAnimationEndCallBack: function () {

        //self._winAni.stopSound();
        //cc.audioEngine.stopAllEffects();

        if(this.textFreeTotalWin != undefined && this.textFreeTotalWin != null) {
            if(this.iFreeAll >= 0){
                GameDataMgr.instance.addScrollAni('textFreeTotalWin',this.iFreeAll,{time:0.5});
            }
            else
                this.textFreeTotalWin.setString("0");
        }

        if (cc.audioEngine.getMusicVolume() > 0 && this.SoundValue)
            cc.audioEngine.setMusicVolume(this.SoundValue);

        return;

        if (!this.bFreeGame && this.iFreeNums > 0 && !this.bFreeGameEx) {

            this.newWheelName = "free";
            this.bFreeGame = true;
            this.bAutoRun = true;
            this.WaitAutoTime = 1;

            this.clearResultDis();
            this.playOneMusic();
        }
        else {
            //if(self.bFreeReSpinNum >= 0 && this.FreeReSpinAni == undefined){
            //    self.beginFreeRespin();
            //}

            //if(self.addFreeNums > 0 && self.FreeAddNumAni == undefined) {
            //    self.addFreeNumAni();
            //}

            if (this.bCanOpenBox) {
                this.openBoxGame();
            }
            else
                GameMgr.singleton.showGiftGame(this.canShowGiftGame());
        }

        if (this.WaitAutoTime > 0)
            this.WaitAutoTime = 0.5;

        if (this.DisRunTime > 0)
            this.DisRunTime = 0.1;

        this.refreshInfo();
        this.refreshtextWin();
        this.bShowReSpin = true;

        if(!this.bFreeGame)
            this.setWin_auto(this.iWin);
    },


    //!胜利动画开始时回调
    winAnimationBeginCallBack:function(self){
        var soundValue;

        if(self.btnOpenEffect.isVisible())
            soundValue = 0.3;
        else
            soundValue = self.SoundValue;

        if (cc.audioEngine.getMusicVolume() > 0)
            cc.audioEngine.setMusicVolume(soundValue);

    },

    onTouchExitPanel : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        this._winAni.touchPanel();
        return;

        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        // this.WinAni2.node.stopAllActions();
        // this.GameLayer.node.removeChild(this.WinAni2.node);
        CcsResCache.singleton.release(this.WinAni2);
        this.WinAni2 = undefined;

        this.bShowResult = false;

        this.WaitAutoTime = 0.1;
        this.DisRunTime = 0.1;

        this.refreshInfo();
        GameMgr.singleton.showGiftGame(this.canShowGiftGame());
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

    playGameAni:function(){
        if(this.iGameAniIndex < 0)
            return;

        //this.setClip(this.iGameAniIndex != 0 && this.iGameAniIndex != 2);

        this.GameWheel1.action.gotoFrameAndPlay(0, 27, false);
        this.GameWheel2.action.gotoFrameAndPlay(0, 27, false);

        this.GameTopWheel1.action.gotoFrameAndPlay(0, 27, false);
        this.GameTopWheel2.action.gotoFrameAndPlay(0, 27, false);

        this.GameMoreTopWheel1.action.gotoFrameAndPlay(0, 27, false);
        this.GameMoreTopWheel2.action.gotoFrameAndPlay(0, 27, false);

        this.GameMostTopWheel1.action.gotoFrameAndPlay(0, 27, false);
        this.GameMostTopWheel2.action.gotoFrameAndPlay(0, 27, false);

        this.gameAniCallBack();

        for(var ii = 0; ii < 5; ii++){
            this.lstLayTopWheel1[ii].setVisible(false);
            this.lstLayTopWheel2[ii].setVisible(false);

            this.lstLayMostTopWheel1[ii].setVisible(false);
            this.lstLayMostTopWheel2[ii].setVisible(false);

            this.lstShowTopWheelDelay[ii] = (12 + ii * 3) / 36;
        }

        if(this.iGameAniIndex == 0){
            this.playWheelSoundIndex = 5;
            this.playWheelSoundDelay = 10 / 36;
        }
    },

    update_showTopWheel:function(dt){
        for(var ii = 0; ii < this.lstShowTopWheelDelay.length; ii++){
            if(this.lstShowTopWheelDelay[ii] > 0){
                this.lstShowTopWheelDelay[ii] -= dt;

                if(this.lstShowTopWheelDelay[ii] <= 0){
                    this.lstLayTopWheel1[ii].setVisible(true);
                    this.lstLayTopWheel2[ii].setVisible(true);

                    this.lstLayMostTopWheel1[ii].setVisible(true);
                    this.lstLayMostTopWheel2[ii].setVisible(true);
                }
            }
        }
    },

    update_StopWheelSound:function(dt){
        if(this.playWheelSoundIndex <= 0)
            return;

        if(this.playWheelSoundDelay > 0){
            this.playWheelSoundDelay -= dt;
        }
        else{
            this.playWheelSoundIndex --;
            this.playWheelSoundDelay = 3 / 36;

            if(res.IceFireStopWheel_mp3)
                cc.audioEngine.playEffect(res.IceFireStopWheel_mp3);
        }
    },

    //! 清除结果显示
    clearResultDis : function () {
        if(res.IceFireClearWheel_mp3)
            cc.audioEngine.playEffect(res.IceFireClearWheel_mp3, false);

        for (var ii = 0; ii < this.lstwheel.length; ++ii) {
            this.lstwheel[ii].clearIcon();

            this.lstTopWheel[ii].clearIcon();

            this.lstMostTopWheel[ii].clearIcon();
        }

        for(var ii = 0; ii < this.lstDianAni.length; ii++){
            this.lstDianAni[ii].bplay = false;
        }
    },

    //!game动画播完一阶段后的处理
    gameAniCallBack:function(aniName){
        var self = this;
        this.GameTopWheel2.action.setLastFrameCallFunc(function () {
            if(self.GameTopWheel2.action.getCurrentFrame() >= self.GameTopWheel2.action.getEndFrame()) {
                if(self.iGameAniIndex == 0){
                    self.iGameAniIndex = -1;
                    self.bPasueWheel = false;

                    self.GameWheel1.action.gotoFrameAndPlay(30, 35, false);
                    self.GameWheel2.action.gotoFrameAndPlay(30, 35, false);

                    self.GameTopWheel1.action.gotoFrameAndPlay(30, 35, false);
                    self.GameTopWheel2.action.gotoFrameAndPlay(30, 35, false);

                    self.GameMoreTopWheel1.action.gotoFrameAndPlay(30, 35, false);
                    self.GameMoreTopWheel2.action.gotoFrameAndPlay(30, 35, false);

                    self.GameMostTopWheel1.action.gotoFrameAndPlay(30, 35, false);
                    self.GameMostTopWheel2.action.gotoFrameAndPlay(30, 35, false);

                    if(self.nodeTopWheel1)
                        self.nodeTopWheel1.setVisible(true);

                    if(self.nodeTopWheel2)
                        self.nodeTopWheel2.setVisible(true);

                    if(self.nodeMoreTopWheel1)
                        self.nodeTopWheel1.setVisible(true);

                    if(self.nodeMoreTopWheel2)
                        self.nodeTopWheel2.setVisible(true);

                    if(self.nodeMoreTopWheel1)
                        self.nodeTopWheel1.setVisible(true);

                    if(self.nodeMostTopWheel1)
                        self.nodeMostTopWheel2.setVisible(true);

                    if(self.bInFreeSelect){
                        self.inSelect();

                        self.bInFreeSelect = false;
                    }

                    self.GameTopWheel2.action.clearLastFrameCallFunc();
                }
            }


        });
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

    showHelp : function (index) {
		this.bShowHelp = (index == 0 ? false : true);
        for (var ii = 0; ii < this.lstHelp.length; ++ii) {
            this.lstHelp[ii].setVisible(index - 1 == ii);
        }
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
    refreshFreeInfo : function (bjust) {
        if(this.bFreeGame) {
            //if(this.textFreeNum != undefined && this.textFreeNum != null) {
            //    this.textFreeNum.setString(this.iFreeNums.toString());
            //}

            if(this.iFreeAll < 0){
                this.iFreeAll = 0;
            }

            this.ModuleUI.setFreeTotalWin(this.iFreeAll, bjust);

            if(this.iSelectFGType >= 0){
                this.onShowFGInfo(this.iSelectFGType);

                this.aniSuperFree2._setVisible(false);
                this.aniSuperFree1._setVisible(false);
            }
            else{
                this.aniBack1._setVisible(false);
                this.aniBack1_1._setVisible(false);
                this.aniBack2._setVisible(false);
                this.aniBack2_1._setVisible(false);
                this.aniBack3._setVisible(false);
                this.aniBack3_1._setVisible(false);
                // this.aniBack4._setVisible(false);
                // this.aniBack4_1._setVisible(false);
                this.nodeAniBack4._setVisible(false);
                this.nodeAniBack4_1._setVisible(false);
                this.aniBack5._setVisible(false);
                this.aniBack5_1._setVisible(false);
                this.aniBack6._setVisible(false);
                this.aniBack6_1._setVisible(false);
            }
        }
        else{
            this.aniBack1._setVisible(true);
            this.aniBack1_1._setVisible(false);
            this.aniBack2._setVisible(true);
            this.aniBack2_1._setVisible(false);
            this.aniBack3._setVisible(true);
            this.aniBack3_1._setVisible(false);
            // this.aniBack4._setVisible(true);
            // this.aniBack4_1._setVisible(false);
            this.nodeAniBack4._setVisible(true);
            this.nodeAniBack4_1._setVisible(false);
            this.aniBack5._setVisible(true);
            this.aniBack5_1._setVisible(false);
            this.aniBack6._setVisible(true);
            this.aniBack6_1._setVisible(false);

            this.aniSuperFree2._setVisible(false);
            this.aniSuperFree1._setVisible(false);
        }

        this.nodeNomalCount.setVisible(!this.bSuperFreeGame);
        this.nodeSuperCount.setVisible(this.bSuperFreeGame);

        for(var ii = 0; ii < this.lstNodeDian.length; ii++){
            this.lstNodeDian[ii].setVisible(this.iCascade > ii);

            if(this.iCascade > ii && !this.lstDianAni[ii].bplay){
                this.lstDianAni[ii].bplay = true;
                this.lstDianAni[ii].ani.play('wait_1', false);
            }
        }

        this.textMul.setString('x' + this.iSuperMul.toString());
    },

    //! 判断一个轮子是否需要亮起来
    canLight : function (index) {
        if(index == 0)
            return ;

        var c1num = 0;

        for(var ii = 0; ii < index; ++ii) {
            if(!this.lstwheel[ii].hasIcon(this.lstSymbol.C1, -1, 1) && !this.lstwheel[ii].hasIcon(this.lstSymbol.WL, -1, 1))
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

    //! 场景改变
    chgScene : function (index) {
        //！播放进免费游戏动画
        if(index == 1){
            this.GameScene.setState(1, 2);
            this.bPasueWheel = false;
            this.nodeFreeAni.setVisible(false);
            if(this.WaitAutoTime <= 0)
                this.WaitAutoTime = 1;
            //this.beginAuto();

            this.ModuleUI._setState('free', 1);
        }
        else{
            this.iSelectFGType = -1;

            this.ModuleUI._setState('freeani', 'show');

            if(this.SuperFreeGameAni != undefined){
                CcsResCache.singleton.release(this.SuperFreeGameAni);
                this.SuperFreeGameAni = undefined;
            }

            this.SuperFreeGameAni = CcsResCache.singleton.load(res.IceFireGameNodeFreeGameAni_json);
            if(this.SuperFreeGameAni != undefined && this.SuperFreeGameAni != null) {
                this.nodeSuperFreeGame.addChild(this.SuperFreeGameAni.node, 2);
                this.SuperFreeGameAni.node.runAction(this.SuperFreeGameAni.action);
                this.SuperFreeGameAni.action.gotoFrameAndPlay(0, this.SuperFreeGameAni.action.getDuration(), false);

                var btnOk = findChildByName(this.SuperFreeGameAni.node, 'btnOk');
                btnOk.addTouchEventListener(this.startSuperFreeGame, this);

                var textFreeNums = findChildByName(this.SuperFreeGameAni.node, 'textFreeNums');
                textFreeNums.setString(this.iFreeNums.toString());

                var textFreeInfo1 = findChildByName(this.SuperFreeGameAni.node, 'textFreeInfo1');
                textFreeInfo1.setFontName('Ubuntu_M');
                LanguageData.instance.showTextStr("superFreeSpinPopupIntro_title",textFreeInfo1);

                var textFreeInfo2 = findChildByName(this.SuperFreeGameAni.node, 'textFreeInfo2');
                textFreeInfo2.setFontName('Ubuntu_M');
                LanguageData.instance.showTextStr("superFreeSpinPopupIntro_desc1", textFreeInfo2);
            }

            this.SuperFreeGameAni2 = CcsResCache.singleton.load(res.IceFireGameNodeFreeGameAni2_json);
            if(this.SuperFreeGameAni2 != undefined && this.SuperFreeGameAni2 != null) {
                this.nodeSuperFreeGame2.addChild(this.SuperFreeGameAni2.node, 2);
                this.SuperFreeGameAni2.node.runAction(this.SuperFreeGameAni2.action);
                this.SuperFreeGameAni2.action.gotoFrameAndPlay(0, this.SuperFreeGameAni2.action.getDuration(), true);
            }

            if(res.IceFireChgFree_mp3)
                cc.audioEngine.playEffect(res.IceFireChgFree_mp3, false);
        }
    },

    //!开始超级免费
    startSuperFreeGame:function(sender, type){
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        CcsResCache.singleton.release(this.SuperFreeGameAni);
        this.SuperFreeGameAni = undefined;

        CcsResCache.singleton.release(this.SuperFreeGameAni2);
        this.SuperFreeGameAni2 = undefined;

        this.ModuleUI._setState('freeani', 'hide');
        this.ModuleUI._setState('free', 1);

        this.aniSuperFree2._setVisible(true);
        this.aniSuperFree2.play('wait_2', true);
        this.aniSuperFree1._setVisible(true);
        this.aniSuperFree1.play('wait_1', true);

        this.aniSuperFree.play('wait_5');
        this.aniSuperFree._setVisible(true);

        this.bSuperFreeGame = true;
        this.refreshFreeInfo();

        if(this.iBoxAniIndex != 3){
            this.iBoxAniIndex = 3;
            this.setBoxAni(false);
        }

        this.bPasueWheel = false;

        if(this.WaitAutoTime <= 0)
            this.WaitAutoTime = 1;
        //this.beginAuto();
        this.GameScene.setState(1, 2);
    },

    update_supFreeAni:function(dt){
        if(this.aniSuperFree.isEnd()){
            this.aniSuperFree._setVisible(false);
        }

        if(this.aniChgMul.isEnd()){
            this.aniChgMul._setVisible(false);
        }
    },

    //!免费动画结束计时
    update_chgFreeAniEnd:function(dt){
        if(!this.nodeFreeSelect.isVisible() || !this.nodeFreeSelect2.isVisible() || !this.nodeFreeSelect3.isVisible() || !this.nodeFreeSelect4.isVisible())
            return;

        var state = this.spineLongA.getCurrent(0);

        if(state != null && !state.loop) {
            if(state.trackTime >= state.animationEnd - state.animationStart) {
                this.spineLongA.setAnimation(0, 'icefire_mianfeiyouxi1', false);
            }
        }

        var state2 = this.spineLongB.getCurrent(0);

        if(state2 != null && !state2.loop) {
            if(state2.trackTime >= state2.animationEnd - state2.animationStart) {
                this.spineLongB.setAnimation(0, 'icefire_mianfeiyouxi2', false);
            }
        }

        this.spineLongA.setPremultipliedAlpha(this.nodeFreeLongA.getOpacity());
        this.spineLongB.setPremultipliedAlpha(this.nodeFreeLongB.getOpacity());

        return;
        if(!this.nodeFreeAni.isVisible())
            return;

        var state = this.aniSpine.getCurrent(0);

        if(!state.loop) {
            if(state.trackTime >= state.animationEnd - state.animationStart) {
                //this.aniSpine = undefined;
                this.refreshInfo();
                this.ModuleUI._setState('freeani', 'hide');
                this.ModuleUI._setState('free', 1);
                this.GameScene.setState(1, 2);
                this.bPasueWheel = false;
                this.nodeFreeAni.setVisible(false);
                this.beginAuto();
            }
        }
    },

    //!icon变wl动画结束计时
    update_chgWLAniEnd:function(dt){
        if(this.lstWLAniNode.length <= 0)
            return;

        var bend = true;
        var delayTime = 0;
        var aniIndex = -1;
        for(var ii = 0 ; ii < this.lstWLAniNode.length; ii++){
            if(this.lstWLAniNode[ii] && this.lstWLAniNode[ii].isEnd()){
                var inode = this.lstinode[ii];

                if(inode.bright){
                    aniIndex = 0;
                    this.lstfirewheel[inode.indexPos.x].chgIcon(inode.indexPos.y, this.lstSymbol.WL, aniIndex, delayTime, false, false);

                    this.lsttopfirewheel[inode.indexPos.x].chgIcon(inode.indexPos.y, this.lstSymbol.WL, aniIndex, delayTime, false, false);

                    //this.lstmosttopfirewheel[inode.indexPos.x].chgIcon(inode.indexPos.y, this.lstSymbol.WL, aniIndex, delayTime, false, false);
                }

                else{
                    aniIndex = 1;
                    this.lsticewheel[inode.indexPos.x].chgIcon(inode.indexPos.y, this.lstSymbol.WL, aniIndex, delayTime, false, false);

                    this.lsttopicewheel[inode.indexPos.x].chgIcon(inode.indexPos.y, this.lstSymbol.WL, aniIndex, delayTime, false, false);

                    //this.lstmosttopicewheel[inode.indexPos.x].chgIcon(inode.indexPos.y, this.lstSymbol.WL, aniIndex, delayTime, false, false);
                }

                //this.lstWLAniNode[ii].removeFromParent();
                this.lstWLAniNode[ii] = undefined;
                this.GameCanvasMgr.removeResource(inode.resname);
            }
        }

        for(var jj = 0; jj < this.lstWLAniNode.length; jj++){
            if(this.lstWLAniNode[jj]){
                bend = false;
            }
        }

        if(bend){
            this.lstWLAniNode = [];
            this.lstinode = [];
            this.lstIceWLPos = [];
            this.lstFireWLPos = [];
            this.bPasueWheel = false;
            this.nodeCopyWlAni.removeAllChildren();
        }
    },

    //! 场景计时
    update_Scene : function (dt) {
        var ogsstate = this.GameScene.iCurState;
        this.GameScene.update(dt);

        if(this.GameScene.iCurState == 0 && ogsstate != 0){
            this.refreshFreeInfo();
        }

        if(this.GameScene.iCurState == 2 && ogsstate != 2){
            this.refreshFreeInfo();
        }
        //if(this.GameWheel1.action.getCurrentFrame() >= 27){
        //    if(this.nodeTopWheel1)
        //        this.nodeTopWheel1.setVisible(true);
        //
        //    if(this.nodeTopWheel2)
        //        this.nodeTopWheel2.setVisible(true);
        //}
    },

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

        var msgobj = this.GameModuleInfo;
        this.GameModuleInfo = undefined;

        if(msgobj.gmi.isspinend){
            this.bShowSani = true;
        }

        this.lstFgIcon = [];

        var bJustStart = this.bJustStart;

        if(msgobj.mode && msgobj.mode == "REPLAY"){
            if(this.bJustStart)
                this.closeInfoLayer();

            this.bRewatch = true;
            cc.log(msgobj.mode);
            this.ModuleUI._setState('rewatch', 1)
        }

        //!测试专用
        //if(this.num == 1){
        //    msgobj = {"msgid":"gamemoduleinfo","gamemodulename":"icefire2_bg","gameid":468,"gmi":{"isspinend":false,"lstindex0":[47,193,3,190,1],"lstindex1":[48,161,123,159,125],"lstarr":[[3,8,7,1,7],[3,8,5,1,5],[3,2,5,10,5],[3,2,5,7,5],[6,2,5,7,5],[6,6,0,5,3],[6,6,0,5,3],[6,6,0,5,3],[6,8,0,5,3],[6,4,11,5,3]],"spinret":{"totalwin":130,"bet":1,"times":1,"lines":30,"lst":[{"type":"line","symbol":6,"data":{"line":11,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":6},{"x":1,"y":6},{"x":2,"y":6}],"hasw":true},{"type":"line","symbol":6,"data":{"line":12,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":6},{"x":1,"y":7},{"x":2,"y":7}],"hasw":true},{"type":"line","symbol":6,"data":{"line":15,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":6},{"x":1,"y":5},{"x":2,"y":5}],"hasw":true},{"type":"line","symbol":6,"data":{"line":16,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":6},{"x":1,"y":6},{"x":2,"y":7}],"hasw":true},{"type":"line","symbol":6,"data":{"line":17,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":6},{"x":1,"y":7},{"x":2,"y":6}],"hasw":true},{"type":"line","symbol":6,"data":{"line":18,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":6},{"x":1,"y":5},{"x":2,"y":6}],"hasw":true},{"type":"line","symbol":6,"data":{"line":19,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":5},{"x":0,"y":6},{"x":1,"y":7},{"x":2,"y":8}],"hasw":true},{"type":"line","symbol":6,"data":{"line":21,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":7},{"x":1,"y":7},{"x":2,"y":7}],"hasw":true},{"type":"line","symbol":6,"data":{"line":24,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":7},{"x":1,"y":5},{"x":2,"y":5}],"hasw":true},{"type":"line","symbol":6,"data":{"line":25,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":7},{"x":1,"y":6},{"x":2,"y":6}],"hasw":true},{"type":"line","symbol":6,"data":{"line":26,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":7},{"x":1,"y":7},{"x":2,"y":8}],"hasw":true},{"type":"line","symbol":6,"data":{"line":28,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":7},{"x":1,"y":6},{"x":2,"y":6}],"hasw":true},{"type":"line","symbol":6,"data":{"line":30,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":7},{"x":1,"y":6},{"x":2,"y":5}],"hasw":true},{"type":"line","symbol":6,"data":{"line":33,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":8},{"x":1,"y":5},{"x":2,"y":5}],"hasw":true},{"type":"line","symbol":6,"data":{"line":34,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":8},{"x":1,"y":6},{"x":2,"y":6}],"hasw":true},{"type":"line","symbol":6,"data":{"line":35,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":8},{"x":1,"y":7},{"x":2,"y":7}],"hasw":true},{"type":"line","symbol":6,"data":{"line":38,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":8},{"x":1,"y":7},{"x":2,"y":8}],"hasw":true},{"type":"line","symbol":6,"data":{"line":39,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":8},{"x":1,"y":7},{"x":2,"y":6}],"hasw":true},{"type":"line","symbol":6,"data":{"line":42,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":9},{"x":1,"y":5},{"x":2,"y":5}],"hasw":true},{"type":"line","symbol":6,"data":{"line":43,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":4},{"x":1,"y":1},{"x":2,"y":1}],"hasw":true},{"type":"line","symbol":6,"data":{"line":44,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":9},{"x":1,"y":7},{"x":2,"y":7}],"hasw":true},{"type":"line","symbol":6,"data":{"line":50,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":9},{"x":1,"y":5},{"x":2,"y":6}],"hasw":true},{"type":"line","symbol":6,"data":{"line":54,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":7},{"x":1,"y":5},{"x":2,"y":7}],"hasw":true},{"type":"line","symbol":6,"data":{"line":55,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":3},{"x":1,"y":1},{"x":2,"y":3}],"hasw":true},{"type":"line","symbol":6,"data":{"line":59,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":2},{"x":1,"y":0},{"x":2,"y":3}],"hasw":true},{"type":"line","symbol":6,"data":{"line":60,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":9},{"x":1,"y":7},{"x":2,"y":5}],"hasw":true}],"realsuperfgnums":0,"realwin":130},"turnwin":130,"turnnums":1,"curm":5}}
        //    this.num ++;
        //}
        //else if(this.num == 2){
        //    msgobj = {"msgid":"gamemoduleinfo","gamemodulename":"icefire2_bg","gameid":468,"gmi":{"isspinend":false,"lstindex0":[46,192,2,190,1],"lstindex1":[48,161,123,159,125],"lstarr":[[3,8,0,1,7],[3,8,0,1,5],[3,2,0,10,5],[3,2,0,7,5],[6,2,5,7,5],[8,1,9,5,3],[3,6,9,5,3],[3,6,9,5,3],[11,8,9,5,3],[3,4,11,5,3]],"spinret":{"totalwin":5,"bet":1,"times":1,"lines":30,"lst":[{"type":"line","symbol":8,"data":{"line":4,"paytype":"lr"},"bet":1,"multiplies":5,"win":5,"positions":[{"x":0,"y":0},{"x":1,"y":3},{"x":2,"y":3}],"hasw":true}],"realsuperfgnums":0,"realwin":5},"turnwin":135,"turnnums":2,"curm":5}}
        //    this.num = 1;
        //}
        //
        //if(this.num == 0)
        //    this.num ++;
        //msgobj = {"msgid":"gamemoduleinfo","gamemodulename":"icefire2_fg2","gameid":468,"gmi":{"isspinend":false,"lstindex0":[86,210,60,310,5],"lstindex1":[184,126,191,260,80],"lstarr":[[10,10,2,6,3],[10,0,8,6,3],[11,5,8,4,3],[8,5,8,4,8],[8,5,3,4,8],[6,11,9,8,2],[6,10,9,8,2],[6,10,9,9,2],[6,10,9,4,2],[6,2,0,4,2]],"spinret":{"totalwin":20000,"bet":1000,"times":1,"lines":30,"lst":[{"type":"line","symbol":10,"data":{"line":20,"paytype":"lr"},"bet":1000,"multiplies":5,"win":5000,"positions":[{"x":0,"y":1},{"x":1,"y":0},{"x":2,"y":4}],"hasw":true},{"type":"line","symbol":8,"data":{"line":34,"paytype":"lr"},"bet":1000,"multiplies":5,"win":5000,"positions":[{"x":0,"y":3},{"x":1,"y":1},{"x":2,"y":1}],"hasw":true},{"type":"line","symbol":8,"data":{"line":43,"paytype":"lr"},"bet":1000,"multiplies":5,"win":5000,"positions":[{"x":0,"y":4},{"x":1,"y":1},{"x":2,"y":1}],"hasw":true},{"type":"line","symbol":8,"data":{"line":55,"paytype":"lr"},"bet":1000,"multiplies":5,"win":5000,"positions":[{"x":0,"y":3},{"x":1,"y":1},{"x":2,"y":3}],"hasw":true}],"fgnums":0,"realwin":240000},"lastnums":1,"totalnums":10,"totalwin":8410000,"turnwin":6665000,"turnnums":7,"bet":1000,"lines":30,"curm":6,"supermul":13}}

        if(msgobj.gamemodulename == 'icefire2_bg') {
            for(var ii = 0; ii < 5; ++ii) {
                for(var jj = 0; jj < 10; ++jj) {
                    var icon = msgobj.gmi.lstarr[jj][ii];
                    if(jj < 5){
                        this.lsticewheel[ii].setNewIcon(jj, icon);

                        if(icon != this.lstSymbol.WL){
                            this.lsttopicewheel[ii].setNewIcon(jj, this.lstSymbol.BK);
                        }
                        else{
                            this.lsttopicewheel[ii].setNewIcon(jj, icon);
                        }

                        if(icon != this.lstSymbol.FG){
                            this.lstmosttopicewheel[ii].setNewIcon(jj, this.lstSymbol.BK);
                        }
                        else{
                            this.lstmosttopicewheel[ii].setNewIcon(jj, icon);
                        }
                    }
                    else {
                        this.lstfirewheel[ii].setNewIcon(jj - 5, icon);

                        if(icon != this.lstSymbol.WL){
                            this.lsttopfirewheel[ii].setNewIcon(jj - 5, this.lstSymbol.BK);
                        }
                        else{
                            this.lsttopfirewheel[ii].setNewIcon(jj - 5, icon);
                        }

                        if(icon != this.lstSymbol.FG){
                            this.lstmosttopfirewheel[ii].setNewIcon(jj - 5, this.lstSymbol.BK);
                        }
                        else{
                            this.lstmosttopfirewheel[ii].setNewIcon(jj - 5, icon);
                        }
                    }
                }

                if(this.bJustStart) {
                    this.lsticewheel[ii].quickAppearIcon();
                    this.lstfirewheel[ii].quickAppearIcon();

                    this.lsttopicewheel[ii].quickAppearIcon();
                    this.lsttopfirewheel[ii].quickAppearIcon();

                    this.lstmosttopicewheel[ii].quickAppearIcon();
                    this.lstmosttopfirewheel[ii].quickAppearIcon();

                    if(this.lsticewheel[ii].isRun() || this.lstfirewheel[ii].isRun()){
                        this.btnRun.setEnabled(false);
                        this.btnRun.setBright(false);
                    }
                }
            }

            if(this.bJustStart) {
                this.bJustStart = false;

                this.bRun = true;
                this.setRun(true);
                if(this.nodeWheel1)
                    this.nodeWheel1.setVisible(false);

                if(this.nodeWheel2)
                    this.nodeWheel2.setVisible(false);

                if(this.nodeTopWheel1)
                    this.nodeTopWheel1.setVisible(false);

                if(this.nodeTopWheel2)
                    this.nodeTopWheel2.setVisible(false);

                if(this.nodeMoreTopWheel1)
                    this.nodeMoreTopWheel1.setVisible(false);

                if(this.nodeMoreTopWheel2)
                    this.nodeMoreTopWheel2.setVisible(false);

                if(this.nodeMostTopWheel1)
                    this.nodeMostTopWheel1.setVisible(false);

                if(this.nodeMostTopWheel2)
                    this.nodeMostTopWheel2.setVisible(false);

                var iShowWin;
                if(msgobj.gmi.spinret != undefined && msgobj.gmi.spinret.lst.length > 0) {
                    this.setRun(true);
                    //this.refreshInfo();
                    //this.setFightState(1);
                    iShowWin = Math.round(msgobj.gmi.turnwin - msgobj.gmi.spinret.realwin);
                    this.refreshtextWin(iShowWin);

                    for(var ii = 0; ii < 5; ++ii) {
                        for(var jj = 0; jj < 10; ++jj) {
                            var icon = msgobj.gmi.lstarr[jj][ii];
                            if(icon == this.lstSymbol.WL){
                                var pos;
                                if(jj < 5){
                                    pos = cc.p(ii,jj);
                                    this.lstFireWLPos.push(pos);
                                }else{
                                    pos = cc.p(ii,jj - 5);
                                    this.lstIceWLPos.push(pos);
                                }
                            }

                            if(icon == this.lstSymbol.FG){
                                this.lstFgIcon.push(icon);
                            }
                        }
                    }
                }
                else{
                    iShowWin = Math.round(msgobj.gmi.totalwin);
                    this.refreshtextWin(iShowWin);
                }

                this.iWin = msgobj.gmi.turnwin;

                if(msgobj.gmi.spinret != undefined){
                    var bnum =  msgobj.gmi.spinret.bet;
                    for(var ii = 0; ii < this.lstBet.length; ii++){
                        if(bnum == this.lstBet[ii]){
                            this.iBet = ii;
                            break;
                        }
                    }
                    this.iLine = msgobj.gmi.spinret.lines;
                    this.iTimes = msgobj.gmi.spinret.times;

                    if(this.ModuleUI)
                        this.ModuleUI.setCoinValueIndex(this.iBet);
                }

                this.iCascade = msgobj.gmi.turnnums - 1;

                if(this.iCascade < 0)
                    this.iCascade = 0;

                this.refreshInfo(true);
            }
            else {
                this.bNewIcon = true;

                for(var ii = 0; ii < 5; ++ii) {
                    for(var jj = 0; jj < 10; ++jj) {
                        var icon = msgobj.gmi.lstarr[jj][ii];
                        if(icon == this.lstSymbol.WL){
                            var pos;
                            if(jj < 5){
                                pos = cc.p(ii,jj);
                                this.lstFireWLPos.push(pos);
                            }else{
                                pos = cc.p(ii,jj - 5);
                                this.lstIceWLPos.push(pos);
                            }
                        }

                        if(icon == this.lstSymbol.FG){
                            this.lstFgIcon.push(icon);
                        }
                    }
                }
            }

            this.NewGameModuleInfo = msgobj.gmi;
            this.iNewWin = msgobj.gmi.turnwin;
            this.iHitsNum = msgobj.gmi.turnnums;
        }
        else if(msgobj.gamemodulename == 'icefire2_fg' || msgobj.gamemodulename == 'icefire2_fg2') {
            this.bSuperFreeGame = msgobj.gamemodulename == 'icefire2_fg2';

            if (msgobj.gmi.bet != undefined && msgobj.gmi.bet > 0) {
                this.iBet = 0;

                for (var ii = 0; ii < this.lstBet.length; ++ii) {
                    if (this.lstBet[ii] == msgobj.gmi.bet) {
                        this.iBet = ii;
                        break;
                    }
                }

                if(this.ModuleUI)
                    this.ModuleUI.setCoinValueIndex(this.iBet);
            }

            if (msgobj.gmi.lines != undefined && msgobj.gmi.lines > 0) {
                this.iLine = msgobj.gmi.lines;
            }

            if (this.iTimes != undefined && msgobj.gmi.times != undefined && msgobj.gmi.times > 0) {
                this.iTimes = msgobj.gmi.times;
                this.setTimes(this.iTimes);
            }

            for(var ii = 0; ii < 5; ++ii) {
                this.lsticewheel[ii].setExState(0);
                this.lstfirewheel[ii].setExState(0);

                this.lsttopicewheel[ii].setExState(0);
                this.lsttopfirewheel[ii].setExState(0);

                this.lstmosttopicewheel[ii].setExState(0);
                this.lstmosttopfirewheel[ii].setExState(0);

                for(var jj = 0; jj < 10; ++jj) {
                    var icon = msgobj.gmi.lstarr[jj][ii];
                    if(jj < 5){
                        this.lsticewheel[ii].setNewIcon(jj, icon);

                        if(icon != this.lstSymbol.WL){
                            this.lsttopicewheel[ii].setNewIcon(jj, this.lstSymbol.BK);
                        }
                        else{
                            this.lsttopicewheel[ii].setNewIcon(jj, icon);
                        }

                        if(icon != this.lstSymbol.FG){
                            this.lstmosttopicewheel[ii].setNewIcon(jj, this.lstSymbol.BK);
                        }
                        else{
                            this.lstmosttopicewheel[ii].setNewIcon(jj, icon);
                        }
                    }
                    else{
                        this.lstfirewheel[ii].setNewIcon(jj - 5, icon);

                        if(icon != this.lstSymbol.WL){
                            this.lsttopfirewheel[ii].setNewIcon(jj - 5, this.lstSymbol.BK);
                        }
                        else{
                            this.lsttopfirewheel[ii].setNewIcon(jj - 5, icon);
                        }

                        if(icon != this.lstSymbol.FG){
                            this.lstmosttopfirewheel[ii].setNewIcon(jj - 5, this.lstSymbol.BK);
                        }
                        else{
                            this.lstmosttopfirewheel[ii].setNewIcon(jj - 5, icon);
                        }
                    }
                }

                if(this.bJustStart) {
                    this.lsticewheel[ii].quickAppearIcon();
                    this.lstfirewheel[ii].quickAppearIcon();

                    this.lsttopicewheel[ii].quickAppearIcon();
                    this.lsttopfirewheel[ii].quickAppearIcon();

                    this.lstmosttopicewheel[ii].quickAppearIcon();
                    this.lstmosttopfirewheel[ii].quickAppearIcon();

                    if(this.lsticewheel[ii].isRun() || this.lstfirewheel[ii].isRun()){
                        this.btnRun.setEnabled(false);
                        this.btnRun.setBright(false);
                    }
                }
            }

            if(this.bJustStart) {
                this.bJustStart = false;

                this.bRun = true;
                this.setRun(true);
                if(this.nodeWheel1)
                    this.nodeWheel1.setVisible(false);

                if(this.nodeWheel2)
                    this.nodeWheel2.setVisible(false);

                if(this.nodeTopWheel1)
                    this.nodeTopWheel1.setVisible(false);

                if(this.nodeTopWheel2)
                    this.nodeTopWheel2.setVisible(false);

                if(this.nodeMoreTopWheel1)
                    this.nodeMoreTopWheel1.setVisible(false);

                if(this.nodeMoreTopWheel2)
                    this.nodeMoreTopWheel2.setVisible(false);

                if(this.nodeMostTopWheel1)
                    this.nodeMostTopWheel1.setVisible(false);

                if(this.nodeMostTopWheel2)
                    this.nodeMostTopWheel2.setVisible(false);

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

                var iShowWin;
                if(msgobj.gmi.spinret != undefined && msgobj.gmi.spinret.lst.length > 0) {
                    this.setRun(true);
                    //this.refreshInfo();
                    //this.setFightState(1);
                    iShowWin = Math.round(msgobj.gmi.turnwin - msgobj.gmi.spinret.realwin);
                    this.refreshtextWin(iShowWin);

                    for(var ii = 0; ii < 5; ++ii) {
                        for(var jj = 0; jj < 10; ++jj) {
                            var icon = msgobj.gmi.lstarr[jj][ii];
                            if(icon == this.lstSymbol.WL){
                                var pos;
                                if(jj < 5){
                                    pos = cc.p(ii,jj);
                                    this.lstFireWLPos.push(pos);
                                }else{
                                    pos = cc.p(ii,jj - 5);
                                    this.lstIceWLPos.push(pos);
                                }
                            }

                            if(icon == this.lstSymbol.FG){
                                this.lstFgIcon.push(icon);
                            }
                        }
                    }
                }
                else{
                    iShowWin = Math.round(msgobj.gmi.totalwin);
                    this.refreshtextWin(iShowWin);
                }

                if(msgobj.gmi.curkey < 0) {
                    this.bInFreeSelect = true;
                    this.NewGameModuleInfo = msgobj.gmi;
                }
                else{
                    this.bFreeGame = true;
                    this.ModuleUI.setFreeGame(this.bFreeGame, bJustStart, msgobj.gmi.totalwin, msgobj.gmi.lastnums, 0.3);
                    this.playOneMusic();

                    //this.bAutoRun = true;

                    //this.setScene(2);
                    this.GameScene.setState(2);
                    this.ModuleUI._setState('free', 1);

                    this.iFreeNums = msgobj.gmi.lastnums;         //! 免费次数
                    this.iTotalFreeNums = msgobj.gmi.totalnums;
                    this.iFreeAll = msgobj.gmi.totalwin;
                    this.iWin = msgobj.gmi.turnwin;

                    if(this.ModuleUI)
                        this.ModuleUI.setWinData(msgobj.gmi.bet, msgobj.gmi.turnnums, msgobj.gmi.turnwin, 0, this.iMyMoney, msgobj.gmi.totalwin == undefined ? 0 : msgobj.gmi.totalwin);

                    if(msgobj.gmi.curkey != undefined){
                        this.iSelectFGType = msgobj.gmi.curkey;

                        if(this.iSelectFGType == 0){
                            if(this.iBoxAniIndex != 1){
                                this.iBoxAniIndex = 1;
                                this.setBoxAni(false);
                            }
                        }
                        else if(this.iSelectFGType == 1){
                            if(this.iBoxAniIndex != 2){
                                this.iBoxAniIndex = 2;
                                this.setBoxAni(false);
                            }
                        }
                    }
                    else{
                        this.iSelectFGType = -1;

                    }

                    this.iCascade = msgobj.gmi.turnnums - 1;

                    if(msgobj.gmi.supermul){
                        this.iSuperMul = msgobj.gmi.supermul;

                        if(this.iBoxAniIndex != 3){
                            this.iBoxAniIndex = 3;
                            this.setBoxAni(false);
                        }
                    }

                    if(this.iCascade < 0)
                        this.iCascade = 0;
                }

                this.refreshInfo(true);
            }
            else {
                this.bNewIcon = true;

                for(var ii = 0; ii < 5; ++ii) {
                    for(var jj = 0; jj < 10; ++jj) {
                        var icon = msgobj.gmi.lstarr[jj][ii];
                        if(icon == this.lstSymbol.WL){
                            var pos;
                            if(jj < 5){
                                pos = cc.p(ii,jj);
                                this.lstFireWLPos.push(pos);
                            }else{
                                pos = cc.p(ii,jj - 5);
                                this.lstIceWLPos.push(pos);
                            }
                        }

                        if(icon == this.lstSymbol.FG){
                            this.lstFgIcon.push(icon);
                        }
                    }
                }

            }

            this.NewGameModuleInfo = msgobj.gmi;

            // this.iTotalFreeNums = msgobj.gmi.totalnums;
            // this.iFreeAll = msgobj.gmi.totalwin;

            this.iFreeAddNums = msgobj.gmi.lastnums - this.iFreeNums;
            this.iFreeNums = msgobj.gmi.lastnums;         //! 免费次数

            this.iNewFreeNums = msgobj.gmi.lastnums;         //! 免费次数
            this.iNewTotalFreeNums = msgobj.gmi.totalnums;         //! 总的免费次数
            this.iNewFreeAll = msgobj.gmi.totalwin;          //! 免费赢的金额

            this.iNewWin = msgobj.gmi.turnwin;
            this.iHitsNum = msgobj.gmi.turnnums;
        }

        //!第一次进游戏刷新图标
        if(bJustStart){
            this.bInitOneGame = true;
        }
    },

    //! 轮子计时
    update_Wheel : function (dt) {
        if(this.AddFreeAni != undefined){
            if(this.AddFreeAni.action.getCurrentFrame() == this.AddFreeAni.action.getDuration()){
                CcsResCache.singleton.release(this.AddFreeAni);
                this.AddFreeAni = undefined;
                this.bPasueWheel = false;

                this.setRun(false);
                this.refreshInfo();

                if(this.bAutoRun)
                    this.WaitAutoTime = 0.5;

                this.ModuleUI._setState('freeaddnums', 'hide');

                GameDataMgr.instance.setIFreeNum(this.iFreeNums);
            }
        }

        var allstate = 0;

        for(var ii = 0; ii < this.lstwheel.length; ++ii) {
            this.lstwheel[ii].update(dt);
            this.lstTopWheel[ii].update(dt);
            this.lstMostTopWheel[ii].update(dt);

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
                        this.bPasueWheel = false;

                    for(var ii = 0; ii < this.lstwheel.length; ii++){
                        this.lstwheel[ii].setState(1, -1);

                        this.lstTopWheel[ii].setState(1, -1);

                        this.lstMostTopWheel[ii].setState(1, -1);
                    }

                    if(this.NewGameModuleInfo != undefined && this.NewGameModuleInfo.spinret != undefined && this.NewGameModuleInfo.spinret.lst.length > 0){
                        for(var ii = 0; ii < this.NewGameModuleInfo.spinret.lst.length; ++ii) {
                            var node = this.NewGameModuleInfo.spinret.lst[ii];

                            for (var jj = 0; jj < node.positions.length; ++jj) {
                                var x = node.positions[jj].x;
                                var y = node.positions[jj].y;

                                if(y < 5){
                                    this.lsticewheel[x].setState(0,y);
                                    this.lsttopicewheel[x].setState(0,y);
                                    this.lstmosttopicewheel[x].setState(0,y);
                                }
                                else{
                                    this.lstfirewheel[x].setState(0, y - 5);
                                    this.lsttopfirewheel[x].setState(0, y - 5);
                                    this.lstmosttopfirewheel[x].setState(0, y - 5);
                                }

                            }
                        }
                    }
                }
            }
        }

        if(this.bPasueWheel)
            return ;

        if(allstate >= 0) {
            if(allstate == 0) {
                if(this.bNewIcon && !this.ModuleUI.isShowWin()) {
                    if(this.bNewGame){
                        for(var ii = 0; ii < this.lsticewheel.length; ++ii) {
                            for(var jj = 0; jj < 3; jj++){
                                this.lsticewheel[ii].appearNewIcon();
                                this.lstfirewheel[ii].appearNewIcon();

                                this.lsttopicewheel[ii].appearNewIcon();
                                this.lsttopfirewheel[ii].appearNewIcon();

                                this.lstmosttopicewheel[ii].appearNewIcon();
                                this.lstmosttopfirewheel[ii].appearNewIcon();
                            }
                        }

                        this.bPasueWheel = true;

                        if(this.nodeTopWheel1)
                            this.nodeTopWheel1.setVisible(false);

                        if(this.nodeTopWheel2)
                            this.nodeTopWheel2.setVisible(false);

                        this.iGameAniIndex = 0;
                        this.playGameAni();
                    }
                    else{
                        for(var ii = 0; ii < this.lsticewheel.length; ++ii) {
                            this.lsticewheel[ii].appearIcon();
                            this.lstfirewheel[ii].appearIcon();

                            this.lsttopicewheel[ii].appearIcon();
                            this.lsttopfirewheel[ii].appearIcon();

                            this.lstmosttopicewheel[ii].appearIcon();
                            this.lstmosttopfirewheel[ii].appearIcon();

                        }
                    }

                    this.bNewIcon = false;
                    for(var ii = 0; ii < this.lsticewheel.length; ii++){
                        this.lsticewheel[ii].setState(0,-1);
                        this.lstfirewheel[ii].setState(0,-1);

                        this.lsttopicewheel[ii].setState(0,-1);
                        this.lsttopfirewheel[ii].setState(0,-1);

                        this.lstmosttopicewheel[ii].setState(0,-1);
                        this.lstmosttopfirewheel[ii].setState(0,-1);
                    }

                    for (var jj = 0; jj < this.lstwheel.length; ++jj) {
                        this.lstwheel[jj].setDisappearSoundEx(undefined);
                        //this.lstwheel[jj].setSoundOverlap(this.lstSoundOverlap.DisappearSoundNum);
                    }
                }
            }
            else if(allstate == 1) {
                if(GameMgr.singleton.showJackpotGame())
                    return ;

                var bshowani = false;
                if (this.lstFgIcon.length >= 3) {
                    if(this.lstIceWLPos.length > 0 || this.lstFireWLPos.length > 0) {
                        bshowani = true;
                    }
                    else{
                        bshowani = false
                    }
                }
                else{
                    bshowani = true;
                }
                if (bshowani) {
                    //for (var ii = 0; ii < this.lstwheel.length; ii++) {
                    //    this.lstwheel[ii].showIconAni_data(this.lstSymbol.FG, 1);
                    //}
                }

                if(this.lstIceWLPos.length > 0 || this.lstFireWLPos.length > 0 ){

                    this.bPasueWheel = true;
                    this.chgWLStatus();
                    return;
                }

                //! 判断需要消除
                if(this.NewGameModuleInfo != undefined) {
                    if(this.NewGameModuleInfo.spinret != undefined && this.NewGameModuleInfo.spinret.lst.length > 0 && this.NewGameModuleInfo.spinret.lst[0].type != 'scatterex2') {
                        this.bNewGame = false;          // 判斷是否是新游戲

                        this.iCascade = this.NewGameModuleInfo.turnnums;

                        if(this.iCascade < 0)
                            this.iCascade = 0;

                        for(var ii = 0; ii < this.lstwheel.length; ++ii) {
                            this.lstwheel[ii].setCurState(2);
                            this.lstwheel[ii].setState(1,-1);

                            this.lstTopWheel[ii].setCurState(2);
                            this.lstTopWheel[ii].setState(1,-1);

                            this.lstMostTopWheel[ii].setCurState(2);
                            this.lstMostTopWheel[ii].setState(1,-1);
                        }

                        var bmore = false;
                        var bmoredisappear = false;
                        for(var ii = 0; ii < this.NewGameModuleInfo.spinret.lst.length; ++ii) {
                            var node = this.NewGameModuleInfo.spinret.lst[ii];

                            for (var jj = 0; jj < node.positions.length; ++jj) {
                                var x = node.positions[jj].x;
                                var y = node.positions[jj].y;

                                //this.lstwheel[x].disappearIcon(y);
                                if(y < 5){
                                    this.lsticewheel[x].beginShowIconAni(y,true);
                                    this.lsticewheel[x].setState(0,y);

                                    this.lsttopicewheel[x].beginShowIconAni(y,true);
                                    this.lsttopicewheel[x].setState(0,y);

                                    this.lstmosttopicewheel[x].beginShowIconAni(y,true);
                                    this.lstmosttopicewheel[x].setState(0,y);
                                }else{
                                    this.lstfirewheel[x].beginShowIconAni(y - 5,true);
                                    this.lstfirewheel[x].setState(0,y - 5);

                                    this.lsttopfirewheel[x].beginShowIconAni(y - 5,true);
                                    this.lsttopfirewheel[x].setState(0,y - 5);

                                    this.lstmosttopfirewheel[x].beginShowIconAni(y - 5,true);
                                    this.lstmosttopfirewheel[x].setState(0,y - 5);
                                }
                                //this.lstwheel[x].beginShowIconAni(y,true);
                                //this.lstwheel[x].setState(0,y);
                            }

                            for(var kk = ii + 1; kk < this.NewGameModuleInfo.spinret.lst.length; kk++){
                                var tempnode = this.NewGameModuleInfo.spinret.lst[kk];

                                var x2 = node.positions[0].x;
                                var y2 = node.positions[0].y;

                                var x3 = tempnode.positions[0].x;
                                var y3 = tempnode.positions[0].y;
                                if(y3 < 5){
                                    if(y2 < 5 ){
                                        if(node.symbol != tempnode.symbol){
                                            bmore = true;
                                        }
                                    }
                                    else if(y2 > 5){
                                        bmore = true;
                                        bmoredisappear = true;
                                    }
                                }
                                else{
                                    if(y2 < 5 ){
                                        bmore = true;
                                        bmoredisappear = true;
                                    }
                                    else if(y2 > 5){
                                        if(node.symbol != tempnode.symbol){
                                            bmore = true;
                                        }
                                    }
                                }

                            }
                        }

                        var tempy = node.positions[0].y;

                        this.playIconWinSound(node,bmore,tempy);

                        if(bmoredisappear){
                            for (var hh = 0; hh < this.lstwheel.length; ++hh) {
                                this.lstwheel[hh].setDisappearSoundEx(this.lstDisappearSoundEx);
                            }
                        }

                        this.ModuleUI.setFreeGame(this.bFreeGame, undefined, undefined, this.iFreeNums);
                        this.ModuleUI.setWinData(this.NewGameModuleInfo.spinret.bet, this.NewGameModuleInfo.turnnums, this.NewGameModuleInfo.turnwin, this.NewGameModuleInfo.spinret.realwin, this.iNewMoney, this.NewGameModuleInfo.totalwin == undefined ? 0 : this.NewGameModuleInfo.totalwin);
                        this.ModuleUI.showWin();

                        var brefresh = false;

                        if(this.iNewWin != this.iWin) {
                            this.iWin = this.iNewWin;
                            brefresh = true;
                        }

                        if(this.bFreeGame) {
                            //if(this.iNewFreeNums != this.iFreeNums)
                            //    this.iFreeNums = this.iNewFreeNums;

                            //if(this.iNewTotalFreeNums != this.iTotalFreeNums)
                            //    this.iTotalFreeNums = this.iNewTotalFreeNums;

                            if(this.iNewFreeAll != this.iFreeAll)
                                this.iFreeAll = this.iNewFreeAll;

                            brefresh = true;

                            if(this.NewGameModuleInfo.supermul && this.iSuperMul != this.NewGameModuleInfo.supermul){
                                this.iSuperMul = this.NewGameModuleInfo.supermul;

                                this.aniChgMul._setVisible(true);
                                this.aniChgMul.play('wait_1', false);
                            }
                        }

                        //if(this.iNewMoney != undefined) {
                        //    this.setMyMoney_auto(this.iNewMoney);
                        //    this.iNewMoney = undefined;
                        //}

                        if(brefresh)
                            this.refreshInfo();

                        GamelogicMgr.instance.callRegistered("spinActionPre",GameMgr.singleton.getCurGameID(), -1, 1, -1, this.bFreeGame);
                    }
                    else {
                        if(this.bFreeGame) {
                            //if(this.iNewFreeNums != this.iFreeNums)
                            //    this.iFreeNums = this.iNewFreeNums;

                            if(this.iNewFreeAll != this.iFreeAll)
                                this.iFreeAll = this.iNewFreeAll;

                            if(this.NewGameModuleInfo.supermul)
                                this.iSuperMul = this.NewGameModuleInfo.supermul;
                        }

                        for (var ii = 0; ii < this.lstwheel.length; ++ii) {
                            this.lstwheel[ii].setCurState(0);
                            this.lstTopWheel[ii].setCurState(0);
                            this.lstMostTopWheel[ii].setCurState(0);
                        }

                        var bhas = false;

                        if (!this.bFreeGame && this.NewGameModuleInfo.spinret) {
                            if (this.NewGameModuleInfo.spinret.curfg) {
                                bhas = true;

                                this.setRun(false);
                                this.refreshInfo();
                                this.inSelect();
                            }
                            else if (this.NewGameModuleInfo.spinret.realsuperfgnums > 0) {
                                this.showFGAni();

                                bhas = true;

                                this.setRun(false);
                                this.ModuleUI._setState('virRun', 1);
                                setTimeout(function () {
                                    this.inFree();
                                }.bind(this), 25 / 24 * 1000);
                            }
                        }
                        else if (this.bFreeGame && this.iFreeAddNums > 0) {
                            this.bPasueWheel = true;
                            this.showFGAni();

                            bhas = true;
                            setTimeout(function () {
                                //var nums = this.iNewFreeNums - this.iFreeNums;
                                this.playAddFreeNumAni(this.iFreeAddNums);

                                this.iFreeNums = this.iNewFreeNums;
                                this.iTotalFreeNums = this.iNewTotalFreeNums;
                            }.bind(this), 25 / 24 * 1000);
                        }

                        if(!bhas){
                            this.setRun(false);
                            this.refreshInfo();

                            if(this.ModuleUI._getCurState('auto') == 1)
                                this.ModuleUI.WaitAutoTime = 0.3;

                            if(this.bAutoRun)
                                this.WaitAutoTime = 0.5;
                        }

                        GameMgr.singleton.showGiftGame(this.canShowGiftGame());

                        //if(this.iNewMoney != undefined) {
                        //    this.setMyMoney_auto(this.iNewMoney);
                        //    this.iNewMoney = undefined;
                        //}

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
                    this.lstwheel[ii].setState(0,-1);

                    this.lstTopWheel[ii].adjust();
                    this.lstTopWheel[ii].setState(0,-1);

                    this.lstMostTopWheel[ii].adjust();
                    this.lstMostTopWheel[ii].setState(0,-1);
                }

                if(res.IceFireDown_mp3){
                    cc.audioEngine.playEffect(res.IceFireDown_mp3,false);
                }

                this.refreshtextWin();
            }
        }
    },

    showFGAni:function(){
        if(this.NewGameModuleInfo.spinret.lst.length == 1 && this.NewGameModuleInfo.spinret.lst[0].type == 'scatterex2') {
            var node = this.NewGameModuleInfo.spinret.lst[0];

            for (var jj = 0; jj < node.positions.length; ++jj) {
                var x = node.positions[jj].x;
                var y = node.positions[jj].y;

                if(y < 5){
                    this.lsticewheel[x].showExIconAni(y, true);
                    this.lsttopicewheel[x].showExIconAni(y, true);
                    this.lstmosttopicewheel[x].showExIconAni(y, true);
                }else{
                    this.lstfirewheel[x].showExIconAni(y - 5, true);
                    this.lsttopfirewheel[x].showExIconAni(y - 5, true);
                    this.lstmosttopfirewheel[x].showExIconAni(y - 5, true);
                }
            }
        }
    },

    //!播放icon中奖展示时的音效
    playIconWinSound:function(node,bmore,tempy){
        var indexSound = -1;

        if(bmore || node.symbol == this.lstSymbol.E || node.symbol == this.lstSymbol.F || node.symbol == this.lstSymbol.G || node.symbol == this.lstSymbol.H || node.symbol == this.lstSymbol.J || node.symbol == this.lstSymbol.K){
            indexSound = 9;
        }
        else{
            if(tempy < 5){
                if(node.symbol == this.lstSymbol.A)
                    indexSound = 0;
                else if(node.symbol == this.lstSymbol.B)
                    indexSound = 2;
                else if(node.symbol == this.lstSymbol.C)
                    indexSound = 4;
                else if(node.symbol == this.lstSymbol.D)
                    indexSound = 6;
            }
            else{
                if(node.symbol == this.lstSymbol.A)
                    indexSound = 1;
                else if(node.symbol == this.lstSymbol.B)
                    indexSound = 3;
                else if(node.symbol == this.lstSymbol.C)
                    indexSound = 5;
                else if(node.symbol == this.lstSymbol.D)
                    indexSound = 7;
            }

            if(node.symbol == this.lstSymbol.FG)
                indexSound = 8;
        }

        if(indexSound >= 0 && this.lstIconWinSound[indexSound]){
            cc.audioEngine.playEffect(this.lstIconWinSound[indexSound],false);
        }
    },

    //!播放增加免费次数动画
    playAddFreeNumAni:function(nums){
        if(this.AddFreeAni != undefined){
            CcsResCache.singleton.release(this.AddFreeAni);
            this.AddFreeAni = undefined;
        }

        this.AddFreeAni = CcsResCache.singleton.load(res.IceFireAddFgAni_json);

        if(this.AddFreeAni != undefined && this.AddFreeAni != null) {
            this.nodeFreeAddNums.addChild(this.AddFreeAni.node, 2);
            this.AddFreeAni.node.runAction(this.AddFreeAni.action);
            this.AddFreeAni.action.gotoFrameAndPlay(0, this.AddFreeAni.action.getDuration(), false);

            var txtAddFgNums = findChildByName(this.AddFreeAni.node, 'txtAddFgNums');
            txtAddFgNums.setString(nums.toString());
        }

        if(res.IceFireAddFg_mp3){
            cc.audioEngine.playEffect(res.IceFireAddFg_mp3,false);
        }

        this.ModuleUI._setState('freeaddnums', 'show');
    },

    //!改变局面WL
    chgWLStatus:function(){
        ////!测试
        //var inode = this.lsticewheel[0].lsticonnode[0];
        //var ipos = inode.rnode.getPosition();
        //
        //for(var ii = 0; ii < 10; ii++){
        //    var pos = this.GameCanvasMgr.getPositionToParent(this.lstWheelName[ii], 'nodeUI1', ipos);
        //
        //    var spr = new cc.Sprite();
        //    spr.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("icefire_icon_wl.png"));
        //
        //    var spr1 = new cc.Sprite();
        //    spr1.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("icefire_icon_wl.png"));
        //
        //    var spr2 = new cc.Sprite();
        //    spr2.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("icefire_icon_wl.png"));
        //
        //    spr.setPosition(pos[0].x, pos[0].y);
        //    spr1.setPosition(pos[1].x, pos[1].y);
        //    spr2.setPosition(pos[2].x, pos[2].y);
        //
        //    this.nodeCopyWlAni.getNode(0).addChild(spr, 1);
        //    this.nodeCopyWlAni.getNode(1).addChild(spr1, 1);
        //    this.nodeCopyWlAni.getNode(2).addChild(spr2, 1);
        //}
        //
        //return;

        var icePos,firePos;
        var bplayani = false;
        var playicesound = -1;
        var playfiresound = -1;
        var iname = 0;

        for(var ii = 0; ii < this.lstIceWLPos.length; ii++){
            icePos = this.lstIceWLPos[ii];

            var idata = this.lsticewheel[icePos.x].getIconData(icePos.y);
            if(idata == this.lstSymbol.FG || idata == this.lstSymbol.WL)
                continue;

            var inode = this.lsticewheel[icePos.x].lsticonnode[icePos.y];

            var ipos = inode.rnode.getPosition();

            var pos = this.GameCanvasMgr.getPositionToParent(this.lstWheelName[icePos.x], 'nodeUI1', ipos);

            this.playChgWLAni(icePos, pos, false, iname);
            bplayani = true;
            playicesound = 0;
            iname++;
        }

        for(var jj = 0; jj < this.lstFireWLPos.length; jj++){
            firePos = this.lstFireWLPos[jj];

            var idata = this.lstfirewheel[firePos.x].getIconData(firePos.y);
            if(idata == this.lstSymbol.FG || idata == this.lstSymbol.WL)
                continue;

            var inode = this.lstfirewheel[firePos.x].lsticonnode[firePos.y];

            var ipos = inode.rnode.getPosition();

            var pos = this.GameCanvasMgr.getPositionToParent(this.lstWheelName[firePos.x + 5], 'nodeUI1', ipos);

            this.playChgWLAni(firePos, pos, true, iname);
            bplayani = true;
            playfiresound = 0;
            iname++;
        }

        if(!bplayani){
            this.bPasueWheel = false;
            this.lstIceWLPos = [];
            this.lstFireWLPos = [];
        }
        else{
            if(playicesound >= 0){
                playicesound = -1;

                if(res.IceFireWLCopy2_mp3)
                    cc.audioEngine.playEffect(res.IceFireWLCopy2_mp3,false);
            }

            if(playfiresound >= 0){
                playfiresound = -1;

                if(res.IceFireWLCopy1_mp3)
                    cc.audioEngine.playEffect(res.IceFireWLCopy1_mp3,false);
            }
        }
    },

    // 获取轮子的屏幕坐标
    getWheelIconWoldPos: function (x, y, bright) {

        if(bright)
            var nodeWheel = this.lstfirewheel[x];
        else
            var nodeWheel = this.lsticewheel[x];

        return nodeWheel.getRealPosition(y);
    },

    //! 取一个图标对应的真实
    getRealPosition: function (index) {
        var pos = {x: 0, y: 0};

        var inode = this.lsticonnode[index];

        if (this.laynode) {
            pos.x = this.laynode.getPositionX() + inode.rnode.getPositionX();
            pos.y = this.laynode.getPositionY() + inode.rnode.getPositionY();
        }
        else {
            pos = inode.rnode.getParent().convertToWorldSpace(inode.rnode.getPosition());
        }

        return pos;
    },

    //!播放改变WL动画
    playChgWLAni:function(indexPos, pos, bright, iname){
        var resname = "resCopyWlAni" + iname;

        if(bright){
            var aninode = this.GameCanvasMgr.initResource(resname, [res.IceFireCopyAni_WL1_1_json, res.IceFireCopyAni_WL1_2_json, res.IceFireCopyAni_WL1_3_json]);
        }
        else{
            var aninode = this.GameCanvasMgr.initResource(resname, [res.IceFireCopyAni_WL2_1_json, res.IceFireCopyAni_WL2_2_json, res.IceFireCopyAni_WL2_3_json]);
        }

        this.nodeCopyWlAni.addChild(aninode);

        aninode.setPosition(pos);
        aninode.play([0, -1], false);

        var inode = {};

        inode.aninode = aninode;
        inode.indexPos = indexPos;
        inode.bright = bright;
        inode.resname = resname;

        this.lstWLAniNode.push(aninode);
        this.lstinode.push(inode);
    },

    setBoxAni:function(bloop){
        if(this.iBoxAniIndex < 0 || this.iBoxAniIndex > this.lstBoxAniName.length - 1)
            return;

        this.backBox.play(this.lstBoxAniName[this.iBoxAniIndex], bloop);

        if(this.iBoxAniIndex == 3 || this.iBoxAniIndex == 6){
            this.aniSuperFree3._setVisible(true);
            this.aniSuperFree4._setVisible(true);
        }
        else{
            this.aniSuperFree3._setVisible(false);
            this.aniSuperFree4._setVisible(false);
        }

        if(this.iBoxAniIndex == 1 || this.iBoxAniIndex == 4){
            this.aniIceBox._setVisible(true);
        }
        else{
            this.aniIceBox._setVisible(false);
        }
    },

    onExit : function () {
        CcsResCache.singleton.releaseModule(this.name);
        this._super();
    }

});

var ElementalGameLayer = cc.Layer.extend({
    sprite: null,
    ctor: function () {
        this._super();

        // 加载icon资源
        cc.spriteFrameCache.addSpriteFrames(res.ElementalIcon_plist);

        this.name = 'elemental';
        CcsResCache.singleton.setCurModule(this.name, this);

        this.InfoLayer = new ElementalInfoLayer(this);
        this.addChild(this.InfoLayer, 1000);
        this.InfoLayer.start();

        this.onlineTimeLayer = new OnlineTimeLayer();
        this.addChild(this.onlineTimeLayer, 10);

        // ver-3 begin
        this.GameMenuStaus = {volume:true, sound:true, music:true, quickspin:false, coins:false, setauto: false};

        // 画布
        this.GameCanvasMgr = new GameCanvasMgr(this);
        GameDataMgr.instance.init(this.GameCanvasMgr);

        this.gamemenuLayer = new GamemenuLayer(this.name, this.GameCanvasMgr);
        this.addChild(this.gamemenuLayer, 1000);

        var lstCanvas = [res.ElementalGameCanvas1_json, res.ElementalGameCanvas2_json, res.ElementalGameCanvas3_json];
        this.GameCanvasMgr.addCanvases(lstCanvas);

        var canvas = this.GameCanvasMgr.getCanvas(0);
        canvas.removeFlag(gmc.GMC_FLAG_MOBILE);

        canvas = this.GameCanvasMgr.getCanvas(2);
        canvas.removeFlag(gmc.GMC_FLAG_PC);

        // adaptive
        var lstAdaptive = ["layBackground", "layAdaptive", "layTips", "layFreeSelect", "layGameLogo", "layMask", "layElements", "layDisable", "layDisconnect"];
        this.GameCanvasMgr.addAdaptiveLayouts(lstAdaptive);

        // TODO: 暂时还没添加layAdaptive_wheel节点
        if(GamelogicMgr.instance.isYggPlatform()) {
            this.GameCanvasMgr.addAdaptiveAdjust('layAdaptive_wheel', 'boost/top-bar');
        }

        this._nodeBackground = this.GameCanvasMgr.initSingle("nodeBack1", "nodeBack1");
        // background
        var background = ccs.load(res.ElementalBackground_json);
        background.node.runAction(background.action);
        this._nodeBackground.addChild(background.node);
        this.GameCanvasMgr.addBackNode_SingleNode("nodeBack1", this._nodeBackground);

        var nodeBackFreeSelect = this.GameCanvasMgr.initSingle("nodeBackFreeSelect", "nodeBackFreeSelect");
        var backFreeSelect = ccs.load(res.ElementalInfoNode_Background_json);
        backFreeSelect.node.runAction(backFreeSelect.action);
        nodeBackFreeSelect.addChild(backFreeSelect.node);
        this.GameCanvasMgr.addBackNode_SingleNode("nodeBackFreeSelect", nodeBackFreeSelect);

        this._addBackgroundSpine(background, backFreeSelect);


        // UI模块
        this.ModuleUI = new ElementalUI(this.GameCanvasMgr);
        this.ModuleUI.initModule();

        GamelogicMgr.instance.setGameLayer(this);

        this._nodeDisconnect = this.GameCanvasMgr.initSingle("nodeDisconnect", "nodeDisconnect");
        this._nodeWheel = this.GameCanvasMgr.initSingle("nodeWheel", "nodeWheel");
        this._nodeTopWheel = this.GameCanvasMgr.initSingle("nodeTopWheel", "nodeTopWheel");
        this._nodeTouchWheel = this.GameCanvasMgr.initSingle("nodeTouchWheel", "nodeTouchWheel");
        this._nodeFreeResult = this.GameCanvasMgr.getSingle("nodeFreeResult");
        this._nodeIconTips = this.GameCanvasMgr.initSingle("nodeIconTips", "nodeIconTips");

        // 修改手机竖屏缩放值
        var gameCanvas = this.GameCanvasMgr.getCanvas(1);
        var scaleData = new gmc.ScaleData();

        scaleData.minSize.width = 900;
        scaleData.minSize.height = 1000;
        scaleData.maxSize.width = 1200;
        scaleData.maxSize.height = 1400;
        scaleData.minScale = 1;
        scaleData.maxScale = 1.1;

        var gmcNode = this.GameCanvasMgr.initNode("nodeFGCollect", "nodeFGCollect");
        var node = gmcNode.getNode(1);
        var gmcScale = new GameCanvasScale(node, scaleData);
        gameCanvas.addScale("nodeFGCollect", gmcScale);

        gmcNode = this.GameCanvasMgr.initSingle("nodeBoardDown", "nodeBoardDown");
        node = gmcNode.getNode(1);
        gmcScale = new GameCanvasScale(node, scaleData);
        gameCanvas.addScale("nodeBoardDown", gmcScale);

        node = this._nodeWheel.getNode(1);
        gmcScale = new GameCanvasScale(node, scaleData);
        gameCanvas.addScale("nodeWheel", gmcScale);

        node = this._nodeTopWheel.getNode(1);
        gmcScale = new GameCanvasScale(node, scaleData);
        gameCanvas.addScale("nodeTopWheel", gmcScale);

        node = this._nodeTouchWheel.getNode(1);
        gmcScale = new GameCanvasScale(node, scaleData);
        gameCanvas.addScale("nodeTouchWheel", gmcScale);

        gmcNode = this.GameCanvasMgr.initSingle("nodeBoardUp", "nodeBoardUp");
        node = gmcNode.getNode(1);
        gmcScale = new GameCanvasScale(node, scaleData);
        gameCanvas.addScale("nodeBoardUp", gmcScale);

        gmcNode = this.GameCanvasMgr.initNode("nodeFly", "nodeFly");
        node = gmcNode.getNode(1);
        gmcScale = new GameCanvasScale(node, scaleData);
        gameCanvas.addScale("nodeFly", gmcScale);

        gmcNode = this.GameCanvasMgr.initNode("nodeTipsScale", "nodeTipsScale");
        node = gmcNode.getNode(1);
        gmcScale = new GameCanvasScale(node, scaleData);
        gameCanvas.addScale("nodeTipsScale", gmcScale);

        gmcNode = this.GameCanvasMgr.initNode("nodeUI", "nodeUI");
        node = gmcNode.getNode(1);
        gmcScale = new GameCanvasScale(node, scaleData);
        gameCanvas.addScale("nodeUI", gmcScale);

        gmcNode = this.GameCanvasMgr.initNode("nodeBGSpin", "nodeBGSpin");
        node = gmcNode.getNode(1);
        gmcScale = new GameCanvasScale(node, scaleData);
        gameCanvas.addScale("nodeBGSpin", gmcScale);

        gmcNode = this.GameCanvasMgr.initNode("nodeFGSpin", "nodeFGSpin");
        node = gmcNode.getNode(1);
        gmcScale = new GameCanvasScale(node, scaleData);
        gameCanvas.addScale("nodeFGSpin", gmcScale);

        for (var i = 0; i < this.GameCanvasMgr.getCanvasNums(); ++i) {
            canvas = this.GameCanvasMgr.getCanvas(i);
            if (canvas && canvas._refreshScale) {
                canvas._refreshScale();
            }
        }

        this.MenuBarLayer = new CommonMenuBarLayer(this.name, this);
        this._nodeDisconnect.addChild(this.MenuBarLayer);
        GameMgr.singleton.setGameMenuBar(this.MenuBarLayer);

        // ver-3 end

        // h5 game
        this.SpinResult = [0, 0, 0, 0, 0];
        this.SpinResultData = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];

        this.bRun = false;
        this.bCanStop = false;
        this.bQuickStopTime = 0;
        this._iMinSpinTime = 0;

        this.WaitStopTime = 0;

        this.DisconnectLayer = undefined;
        this.ErrorLayer = undefined;
        this.bErrorPause = false;

        //! 分数相关的逻辑
        this.iMyMoney = undefined;
        this.iNewMoney = undefined;
        this.iShowMoney = 0;
        this.iBet = 0;
        this.iLine = 30;
        this.iWin = 0;
        this.iTotalWin = 0;
        this.lstBet = [1, 2, 5, 10, 20, 50, 100, 160, 500, 1000, 1600, 2000];
        this.bAutoRun = false;
        this.iAutoNum = 0;
        this.WaitAutoTime = 0;
        this.DisRunTime = 0;
        this.bQuick = true;
        this.iTimes = 1;

        this.bFreeGameInit = false;
        this.bShowResult = false;
        this.iShowResultIndex = -1;
        this.ShowResultTime = 0;

        this.bCanOpenBox = false;

        this.WinAni = undefined;
        this.WinAni2 = false;

        this.bFreeGame = false;     //! 是否在免费游戏中
        this.iFreeNums = -1;         //! 免费次数

        this._freeGameAni = undefined;              //! 免费游戏动画

        //! 音乐音效相关
        this.lstMusic = undefined;

        this.lstWaitMusic = [];
        this.lstHelp = [];
        this.bPlayFreeMusic = false;

        this.bStopMusic = false;
        this.bInitMusic = false;
        this.SoundValue = 1;
        this.EffectValue = 1;
        this.bJustStart = true;

        // node
        this.nodeCommonMnueBar = undefined;
        this.MenuBarLayer = undefined;
        this.GameLayer = undefined;

        this.btnRun = undefined;
        this.btnStop = undefined;
        this.btnAuto = undefined;
        this.btnAutoStop = undefined;
        this.btnMax = undefined;
        this.btnNeg = undefined;
        this.btnAdd = undefined;
        this.btnOpenSound = undefined;
        this.btnCloseSound = undefined;
        this.btnOpenEffect = undefined;
        this.btnCloseEffect = undefined;
        this.btnSetup = undefined;
        this.btnClose = undefined;
        this.btnHelp = undefined;

        this.textWin = undefined;
        this.textAllBet = undefined;
        this.textBet = undefined;
        this.textMoney = undefined;
        this.textAutoNum = undefined;
        this.textName = undefined;
        this.textFreeNum = undefined;

        this.textWinAni = undefined;

        this.sprAutoNum = undefined;

        this._effectMgr = undefined;
        this._logic = undefined;

        this.bShowCoins = true;

        this.bCollect = true;
        this.bCollectNums = 0;
        this.iWonaMount = 0;

        this.bRestore = false;
        this.bRewatch = false;
        this.bReplay = false;
        this.bSkip = false;

        // 初始化游戏控制器
        this.initGameController();
        this.initWheel();
        this.initResource();
        this.initLine();
        this.initMusic();

        if (GameAssistant.singleton.isShowSoundTips()) {
            this.setPlaySound(false);
        }
        else {
            this.setPlaySound(true);
        }

        this.setPlayEffect(true);

        this.restoreUserSetup();

        this.refreshInfo();
        this.scheduleUpdate();

        //! 增加jackpot节点
        this.nodeCommonJackpot = new cc.Node();
        this.addChild(this.nodeCommonJackpot, 10);

        //!欧元余额是否始终可见
        this.platformCtrl = GamelogicMgr.instance.getPlatformCtrl();
        var bshowcoins = !GamelogicMgr.instance.callFuncByName("isDisableCurrencyCoins");
        this.onTouchBtnCoins(undefined, 2, bshowcoins);

        this._refreshGameMenuBtnVisible();

        GameDataMgr.instance.setNumberValue('_bJustStart', true);

        //! UI模块相关
        this.ModuleUI.setBet(30);
        this.ModuleUI.setLines(30);
        this.ModuleUI.setCoinValueList([1,2,5,10,20,50,100,200,300,500,1000]);
        this.ModuleUI.setChgCoinValueFunc(this.onChgCoinValue, this);
        this.ModuleUI.setSpinFunc(this.runOne, this);
        this.ModuleUI.setCloseTipsFunc(this.onTouchCloseTips, this);
        this.ModuleUI.setPlaySoundFunc(this.playBtnSound, this);
        this.ModuleUI.setTouchMaxBetFunc(this.onTouchMax, this);
        this.ModuleUI.setLeftFreeResultFunc(this.leftFreeResult, this);
        this.ModuleUI.setOnWinAniEndFunc(this.onWinAniEnd, this);
        this.ModuleUI.setSpinStopFunc(this.onTouchStop, this);
        // this.ModuleUI.setOnWinAniScrollEndFunc(this.onTouchWinPanel, this);
        this.ModuleUI.setMenuFunc(this.onTouchMenu, this);
        this.ModuleUI.setOpenFreeResultFunc(this.openFreeResult, this);
        this.ModuleUI.setOpenDisconnectFunc(this.setDisconnect, this);

        // 初始化特效控制器
        this._effectMgr.init(this._logic, this, this.GameCanvasMgr, this.ModuleUI);
        this._effectMgr.initBackArray(background);

        this._initVersion();

        return true;
    },

    _refreshGameMenuBtnVisible: function() {
        var lstBtnName = [];
        var lstBtnVisible = [];

        if (GamelogicMgr.instance.callFuncByName("isGameExRules") === true || GamelogicMgr.instance.callFuncByName("isMenuRulesVisible") === false) {
            lstBtnName.push("btnGameRules");
            lstBtnVisible.push(false);
        }

        if (GamelogicMgr.instance.callFuncByName("isGameHistoryVisible") === false) {
            lstBtnName.push("btnHits");
            lstBtnVisible.push(false);
        }

        if (GamelogicMgr.instance.callFuncByName("isMenuAudioVisible") === false) {
            lstBtnName.push("nodeBtnSound");
            lstBtnVisible.push(false);
        }

        if (GamelogicMgr.instance.callFuncByName("isMenuHomeVisible") === false) {
            lstBtnName.push("btnHome");
            lstBtnVisible.push(false);
        }

        if (GamelogicMgr.instance.callFuncByName("isMenuPaytableVisible") === false) {
            lstBtnName.push("btnPaytable");
            lstBtnVisible.push(false);
        }

        if (GamelogicMgr.instance.callFuncByName("isMenuSettingsVisible") === false) {
            lstBtnName.push("btnSettings");
            lstBtnVisible.push(false);
        }

        this.gamemenuLayer.setBtnVisible(lstBtnName, lstBtnVisible);
    },

    _initVersion: function() {
        if (typeof(GAME_DEV_VERSION) != "undefined") {
            var textVer = new ccui.Text(GAME_DEV_VERSION, "NotoSans-R", 24);
            textVer.setAnchorPoint(cc.p(0, 1));
            textVer.setPosition(10, cc.view.getFrameSize().height - 10);
            this.addChild(textVer, 9999);
        }
    },

    _addBackgroundSpine: function(background, backFreeSelect) {
        var nodeSpine = findNodeByName(background.node, "nodeSpineBG");
        if (nodeSpine) {
            var spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineGrass_json, res.ElementalBackgroundSpineGrass_atlas);
            spineAni.setAnimation(0, "cao_zi_zou", true);
            spineAni.setPosition(cc.p(0, 0));
            nodeSpine.addChild(spineAni);

            spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineGrass_json, res.ElementalBackgroundSpineGrass_atlas);
            spineAni.setAnimation(0, "cao_zi_you", true);
            spineAni.setPosition(cc.p(0, 0));
            nodeSpine.addChild(spineAni);
        }

        nodeSpine = findNodeByName(background.node, "nodeSpineFG1");
        if (nodeSpine) {
            var spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineGrass_json, res.ElementalBackgroundSpineGrass_atlas);
            spineAni.setAnimation(0, "cao_huang_zou", true);
            spineAni.setPosition(cc.p(0, 0));
            nodeSpine.addChild(spineAni);

            spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineGrass_json, res.ElementalBackgroundSpineGrass_atlas);
            spineAni.setAnimation(0, "cao_huang_you", true);
            spineAni.setPosition(cc.p(0, 0));
            nodeSpine.addChild(spineAni);
        }

        nodeSpine = findNodeByName(background.node, "nodeSpineFG2");
        if (nodeSpine) {
            var spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineGrass_json, res.ElementalBackgroundSpineGrass_atlas);
            spineAni.setAnimation(0, "cao_lan_zou", true);
            spineAni.setPosition(cc.p(0, 0));
            nodeSpine.addChild(spineAni);

            spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineGrass_json, res.ElementalBackgroundSpineGrass_atlas);
            spineAni.setAnimation(0, "cao_lan_you", true);
            spineAni.setPosition(cc.p(0, 0));
            nodeSpine.addChild(spineAni);
        }

        nodeSpine = findNodeByName(background.node, "nodeSpineFG3");
        if (nodeSpine) {
            var spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineGrass_json, res.ElementalBackgroundSpineGrass_atlas);
            spineAni.setAnimation(0, "cao_hong_zou", true);
            spineAni.setPosition(cc.p(0, 0));
            nodeSpine.addChild(spineAni);

            spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineGrass_json, res.ElementalBackgroundSpineGrass_atlas);
            spineAni.setAnimation(0, "cao_hong_you", true);
            spineAni.setPosition(cc.p(0, 0));
            nodeSpine.addChild(spineAni);
        }

        nodeSpine = findNodeByName(background.node, "nodeSpineFG4");
        if (nodeSpine) {
            var spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineGrass_json, res.ElementalBackgroundSpineGrass_atlas);
            spineAni.setAnimation(0, "cao_lv_zou", true);
            spineAni.setPosition(cc.p(0, 0));
            nodeSpine.addChild(spineAni);

            spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineGrass_json, res.ElementalBackgroundSpineGrass_atlas);
            spineAni.setAnimation(0, "cao_lv_you", true);
            spineAni.setPosition(cc.p(0, 0));
            nodeSpine.addChild(spineAni);
        }

        nodeSpine = findNodeByName(backFreeSelect.node, "nodeInfoSpine");
        if (nodeSpine) {
            var spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineGrass_json, res.ElementalBackgroundSpineGrass_atlas);
            spineAni.setAnimation(0, "cao_lv_zou", true);
            spineAni.setPosition(cc.p(0, 0));
            nodeSpine.addChild(spineAni);

            spineAni = sp.SkeletonAnimation.createWithJsonFile(res.ElementalBackgroundSpineGrass_json, res.ElementalBackgroundSpineGrass_atlas);
            spineAni.setAnimation(0, "cao_lv_you", true);
            spineAni.setPosition(cc.p(0, 0));
            nodeSpine.addChild(spineAni);
        }
    },

    //!设置disconnect界面
    setDisconnect: function (type1, type2, strerror) {
        GamelogicMgr.instance.callRegistered("setDisconnect", type1, type2, strerror);

        if (GamelogicMgr.instance.needNativeDisconnect()) {
            var layer = new DisconnectDialog(this, type1, type2, strerror);
            this.addChild(layer, 12);

            this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_DISCONNECT, 1);
        }
    },

    initLine: function() {
        //! 初始化线
        this.nodeLine = this.GameCanvasMgr.initSingle("nodeLine", "nodeLine");

        this.GameLine = new ElementalLine();
        this.nodeLine.addChild(this.GameLine);
    },

    initWheel: function() {
        //! 符号代码和图标的对应关系
        this.lstSymbol = this._logic.getLstSymbols();

        this.lstWheelDatas = [
            [1,8,10,3,5,11,9,4,7,10,1,5,9,3,6,10,0,6,10,4,6,10,2,5,9,4,8,1,9,2,8,10],
            [3,5,7,11,10,7,1,8,3,7,4,6,0,7,3,9,6,1,9,7,4,5,8,0,5,8,4,7,10,2,8,6],
            [4,10,8,2,7,4,6,0,4,6,10,3,6,10,1,5,8,2,10,4,6,0,4,6,9,11,5,9,2,8,10,1,7,3,8,1,9,2,8],
            [3,5,9,11,6,1,10,4,5,3,9,4,7,8,0,7,8,1,7,5,3,7,8,0,7,8,2,10,7,4,6,1,9],
            [4,9,8,3,10,6,0,10,6,1,9,5,3,10,2,8,11,9,7,4,10,6,0,10,6,4,5,9,2,8,10,3,5]
        ];

        var lstIcon = this._logic.getLstIconImg(0);
        var lstBlurIcon = this._logic.getLstIconBlurImg(0);
        var lstIconAni = this._logic.getIconAniRun(0);

        this.lstwheel = [];

        var wheelObj = ccs.load(res.ELementalGameNode_Wheel_json);
        wheelObj.node.runAction(wheelObj.action);
        this._nodeWheel.addChild(wheelObj.node);

        var topWheelObj = ccs.load(res.ELementalGameNode_TopWheel_json);
        topWheelObj.node.runAction(topWheelObj.action);
        this._nodeTopWheel.addChild(topWheelObj.node);

        var touchWheelObj = ccs.load(res.ELementalGameNode_TouchWheel_json);
        touchWheelObj.node.runAction(touchWheelObj.action);
        this._nodeTouchWheel.addChild(touchWheelObj.node);

        for (var ii = 0; ii < 5; ++ii) {
            var bindex = 1;

            var layWheel = findNodeByName(wheelObj.node, "layWheel" + (ii + 1));
            var layTopWheel = findNodeByName(topWheelObj.node, "layTopWheel" + (ii + 1));
            var layTouchWheel = findNodeByName(touchWheelObj.node, "layTouchWheel" + (ii + 1));

            var wheel = new ElementalWheel(layWheel, lstIcon, lstBlurIcon, 236, 236, 230, this.lstWheelDatas[ii], bindex, layTopWheel, undefined, 0, this);
            wheel.setLogicNum(3);
            wheel.setIndex(ii);
            wheel.setSound(undefined, res.ElementalStopWheel_mp3/*, this.lstSymbol.J, res.FourBeautyJ_mp3*/);
            wheel.setResultColor(96, 96, 96, 255);
            wheel.setShowTopIcon(false);
            wheel.setSpringBack(50, 10);
            wheel.setStopFunc(this.onWheelStop, this, ii);
            wheel.setIconDisplayAni([res.ElementalIconRunAniFire_json]);
            wheel.setLightAni(res.ElementalWheelLightAni_json, undefined, res.ElementalLightWheel_mp3);

            wheel.setTouchNode(layTouchWheel);

            this.lstwheel.push(wheel);

            wheel.wheelIndex = ii;
        }
    },

    initResource: function() {
        this._freeGameAni = this.GameCanvasMgr.getResource("resFreeAni");
        this._freeGameAddAni = this.GameCanvasMgr.getResource("resFreeAddAni");
        var textFreeExInfo = this.GameCanvasMgr.initTextEx("textFreeExInfo", "textFreeExInfo");
        textFreeExInfo.setMultiLine(false);
        textFreeExInfo.setFontName("NotoSans-R");
        LanguageData.instance.showTextStr("fs_summary_amount_won4", textFreeExInfo);

        var textFreeLucky = this.GameCanvasMgr.initTextEx("textInfoLucky", "textInfoLucky");
        textFreeLucky.setMultiLine(false);
        textFreeLucky.setFontName("NotoSans-R");
        LanguageData.instance.showTextStr("fs_summary_amount_won3", textFreeLucky);
        textFreeLucky.setVisible(false);
        this._freeAddLuckyText = textFreeLucky;

        this.btnRun = this.GameCanvasMgr.initButton("btnRun", "btnRun");
        this.btnStop = this.GameCanvasMgr.initButton("btnStop", "btnStop");
    },

    initMusic: function() {
        this.lstMusic = [res.ElementalMusic1_mp3];

    },

    initGameController: function () {
        if (!this._effectMgr) {
            this._effectMgr = new ElementalEffectMgr();
        }

        if (!this._logic) {
            this._logic = new ElementalLogic();
        }
    },

    //! 恢复之前记录的属性
    restoreUserSetup: function () {
        var soundopen = GameAssistant.singleton.getMusicType("elemental");
        var effectopen = GameAssistant.singleton.getEffectType("elemental");
        var volumeopen = GameAssistant.singleton.getVolumeType("elemental");
        var volumevalue = GameAssistant.singleton.getVolumeValue("elemental");

        if(volumevalue){
            volumevalue = Number(volumevalue);
            this.EffectValue = volumevalue;
            this.SoundValue = volumevalue;
        }

        if (soundopen === "") {
            soundopen = 1;
        }
        else {
            soundopen = parseInt(soundopen);
        }

        if (effectopen === "") {
            effectopen = 1;
        }
        else {
            effectopen = parseInt(effectopen);
        }

        if (volumeopen === "") {
            volumeopen = 1;
        }
        else {
            volumeopen = parseInt(volumeopen);
        }

        if (volumeopen === 0) {
            this.setPlaySound(false);
            this.setPlayEffect(false);
        }
        else {
            if(!GameAssistant.singleton.isShowSoundTips()) {
                this.setPlaySound(soundopen == 1);
                this.setPlayEffect(effectopen == 1);
            }
        }
    },

    //! 记录用户设置
    setUserSetup: function (sname, snum) {
        cc.sys.localStorage.setItem(this.name + sname, snum);
    },

    //! 收到下注列表
    onBetList: function (lst, betNum) {
        if (lst == undefined || lst.length <= 0)
            return;

        this.lstBet = lst;

        if (this.ModuleUI) {
            var defaultVal = betNum;
            if (defaultVal == undefined)
                defaultVal = GamelogicMgr.instance.getDefaultCoinValue();

            var defaultIndex = 0;
            for (var i = 0; i < lst.length; ++i) {
                if (defaultVal == lst[i]) {
                    defaultIndex = i;
                    break;
                }
            }

            this.ModuleUI.setCoinValueList(lst, defaultIndex);
        }

        this.saveBetNum();
    },

    //! 记录下注值
    saveBetNum : function () {
        //if(typeof(YggLogic) != 'undefined' && YggLogic.singleton && YggLogic.singleton.bReplay) {
        //    return;
        //}

        var needSave = GamelogicMgr.instance.needSaveBetNum();
        if(!needSave){
            return;
        }

        var lstBet = GameDataMgr.instance.getCoinValueList();
        var iBet = GameDataMgr.instance.getCurCoinIndex();

        this.iBetNum = lstBet[iBet];
        this.setUserSetup('betnum', this.iBetNum);
    },

    closeInfoLayer: function() {
        if (!this.InfoLayer)
            return;

        this.removeChild(this.InfoLayer);
        this.InfoLayer = undefined;
        this.closeSoundTips();

        this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_GAME_LOGO, 0);

        GamelogicMgr.instance.callRegistered("getGameReadyRet");
    },

    closeSoundTips: function() {
        if(GameAssistant.singleton.isShowSoundTips()) {
            this.onTouchCloseSound(null, 2);
            this.onTouchCloseEffect(null, 2);
        }
    },

    update: function (dt) {
        if (this.InfoLayer)
            return;

        // if (GameMgr.singleton.isPauseGame())
        //     return;
        this.GameCanvasMgr.update(dt);
        GameDataMgr.instance.update(dt);

        if (!GamelogicMgr.instance.update(dt))
            return;

        this.ModuleUI.update(dt);

        if (this.bInitMusic && !this.bStopMusic && !cc.audioEngine.isMusicPlaying()) {
            this.playOneMusic();
        }

        if (this._effectMgr) {
            this._effectMgr.update(dt);
        }

        if (this.WinAni)
            this.WinAni.update(dt);

        if (this.textWinAni)
            this.textWinAni.update(dt);

        this.update_ShowMoney(dt);
        this.update_ShowResult(dt);

        if (this._iMinSpinTime > 0) {
            this._iMinSpinTime -= dt;
            if (this._iMinSpinTime <= 0) {
                this._iMinSpinTime = 0;

                this.stopFirstWheel();
            }
        }

        if (this.bQuickStopTime > 0) {
            this.bQuickStopTime -= dt;

            if (this.bQuickStopTime <= 0) {
                this.bQuickStopTime = 0;

                this.refreshInfo();
            }
        }

        this.update_FreeGameAni(dt);
        this.update_Wheel(dt);

        if (this.bRestore) {
            this.runOne();
            this.bRestore = false;
        }

        if (this.bSkip) {
            this.bSkip = false;
            this.bExSkip = true;
            this.showSkipResult();
        }
    },

    update_FreeGameAni: function(dt) {
        if (this._freeGameAni != undefined && this.ModuleUI._getCurState(ELEMENTAL_UI_STATE.STATE_FREE_ANI) != 0) {
            if (this.iEnterFreeGameTime > 0)
                this.iEnterFreeGameTime -= dt;

            if (this.iEnterFreeGameTime <= 0) {
                this.iEnterFreeGameTime = 0;

                this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_FREE_ANI, 0);

                this.onGameModuleInfo1();

                // this.iWin = 0;
                // this.iTotalWin = 0;
                this.refreshFreeGameInfo(true);

                this.ModuleUI.setFreeGame(this.bFreeGame, undefined, this.iTotalWin, this.iFreeNums);

                this.refreshInfo();
                cc.audioEngine.playEffect(res.ElementalChgScene_mp3, false);

                if (this._effectMgr) {
                    this._effectMgr.onEnterFreeAniEnd();
                }

                this.bFreeGameInit = false;
            }
        }

        if (this._freeGameAddAni !== undefined && this.ModuleUI._getCurState(ELEMENTAL_UI_STATE.STATE_FREE_ADD_ANI) === 1) {
            if (this._iFreeAddTime > 0) {
                this._iFreeAddTime -= dt;
            }

            if (this._iFreeAddCloseTime > 0) {
                this._iFreeAddCloseTime -= dt;

                if (this._iFreeAddCloseTime <= 0) {
                    this._iFreeAddCloseTime = 0;

                    var node = this._freeGameAddAni.getNode();
                    var aniCtrlBack = findNodeByName(node, "aniCtrlBack");
                    aniCtrlBack.animation.play("wait_3", 0, false);

                    this._freeGameAddAni.play("wait_3", false);
                }
            }

            if (this._iFreeAddTime <= 0) {
                this._iFreeAddTime = 0;

                this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_FREE_ADD_ANI, 0);
                this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_VIR_FREE, 0);

                this.iFreeNums = this._logic.getFreeNum();
                GameDataMgr.instance.setIFreeNum(this.iFreeNums);

                if(this.ModuleUI._getCurState(ELEMENTAL_UI_STATE.STATE_ACT_FREE_NUM) == 1) {
                    this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_ACT_FREE_NUM, 0);
                }
            }
        }

        if (this.ExitFreeGameAni != undefined) {
            if (this.iExitFreeGameTime > 0) {
                this.iExitFreeGameTime -= dt;

                if (this.iExitFreeGameTime <= 0) {
                    this.iExitFreeGameTime = 0;
                    this.ExitFreeGameAni = undefined;

                    this.onLeftFreeCallback();
                }
            }
        }
    },

    update_Wheel: function(dt) {
        for (var ii = 0; ii < this.lstwheel.length; ++ii) {
            this.lstwheel[ii].update(dt);
        }

        if (this.bRun && this.bCanStop) {
            var allstop = true;

            var canLight = false;
            for (var ii = 0; ii < this.lstwheel.length; ++ii) {
                if (this.lstwheel[ii].bRun) {
                    allstop = false;
                    break;
                }
                else if (ii + 1 < this.lstwheel.length) {
                    if (!this.lstwheel[ii + 1].bStoping) {
                        if (this._logic.canLight(ii + 1)) {
                            canLight = true;

                            this.lstwheel[ii + 1].setIsChgSpeed(true);
                            this.lstwheel[ii + 1].RunTime = 1.5;
                            this.lstwheel[ii + 1].showLightAni(true);
                            this.lstwheel[ii + 1].chgSpeed(6000);
                            this.lstwheel[ii + 1].stop_index(this.SpinResult[ii + 1], this.SpinResultData[ii + 1]);
                            //this.addDartsAni(ii + 1, 1);
                        }
                        else {
                            this.lstwheel[ii + 1].RunTime = 0;
                            this.lstwheel[ii + 1].stop_index(this.SpinResult[ii + 1], this.SpinResultData[ii + 1]);
                            //this.addDartsAni(ii + 1, 0);

                            if (!this._logic.hasLight()) {
                                this.refreshInfo();
                            }
                        }
                    }
                }
            }

            if (allstop) {
                if (GameMgr.singleton.showJackpotGame())
                    return;

                var bshowresult = false;

                if (this.platformCtrl && this.platformCtrl.collect != undefined && this.bCollectNums == 0) {
                    this.bCollect = this.platformCtrl.collect();
                    ++this.bCollectNums;

                    if (this.bCollect) {
                        this.ModuleUI._setState("gamecollect", 1);
                        this.ModuleUI.bWaitCollect = true;
                    }
                }

                if (this.WaitStopTime < 0) {
                    this.WaitStopTime = 0.2;
                }
                else {

                    this.WaitStopTime -= dt;

                    if (this.WaitStopTime > 0) {
                        return;
                    }

                    if (this._effectMgr) {
                        if (!this._effectMgr.isVia()) {
                            return;
                        }
                    }

                    bshowresult = true;
                }

                if (bshowresult) {
                    this.bRun = false;
                    this.ModuleUI.setRunState(4);
                    var oldmoney = this.iMyMoney;

                    if (this.iNewMoney != undefined) {
                        this.iMyMoney = this.iNewMoney;
                        this.iNewMoney = undefined;
                    }
                    else {
                        this.iMyMoney += this.SpinWin;
                    }

                    // this.iFreeNums = this._logic.getFreeNum();
                    // GameDataMgr.instance.setIFreeNum(this.iFreeNums);

                    this.iWin = this._logic.getSpinWin();
                    this.iTotalWin = this._logic.getFreeTotalWin();

                    var bshowwin = false;

                    if (this.iWin <= 0 && this.winresult != undefined && this.winresult.length > 0)
                        bshowwin = true;

                    if (this.iWin <= 0 && !bshowwin) {
                        if (this._effectMgr) {
                            this._effectMgr.onPreShowAllResult();
                        }
                    }
                    else {
                        if (this._effectMgr) {
                            this._effectMgr.onPreShowAllResult();
                        }

                        if (this.aniWL != undefined) {
                            CcsResCache.singleton.release(this.aniWL);
                            this.aniWL = undefined;
                        }
                    }

                    if (this.bAutoRun) {
                        if (this.iWin <= 0 && !bshowwin)
                            this.WaitAutoTime = 0.3;
                        else
                            this.WaitAutoTime = 0.5;

                        if (this.bFreeGame) {
                            if (this.iWin <= 0 && !bshowwin)
                                this.WaitAutoTime = 0.3;
                            else
                                this.WaitAutoTime = 0.5;
                        }

                        if (this.ErrorLayer != undefined)
                            this.WaitAutoTime += 3;
                    }
                    else {
                        if (this.iWin <= 0 && !bshowwin)
                            this.DisRunTime = 0;
                        else
                            this.DisRunTime = 2;
                    }

                    this.refreshInfo();

                    if (GameMgr.singleton.showJackpotWin()) {
                        if (this.iNewMoney != undefined) {
                            this.iMyMoney = this.iNewMoney;
                            this.iNewMoney = undefined;
                        }
                    }
                }
            }
        }
    },

    //! 更新显示的钱
    update_ShowMoney: function (dt) {
        if (this.iMyMoney == undefined)
            return;

        if (this.iShowMoney == this.iMyMoney)
            return;

        this.ShowMoneyTime += dt;

        this.ShowMoneyTime = 0;

        if (Math.abs(this.iShowMoney - this.iMyMoney) < 10) {
            this.iShowMoney = this.iMyMoney;
        }
        else {
            var chgm = Math.floor(Math.abs(this.iShowMoney - this.iMyMoney) / 2);

            if (chgm <= 0) {
                this.iShowMoney = this.iMyMoney;
            }
            else if (this.iShowMoney > this.iMyMoney) {
                this.iShowMoney -= chgm;
            }
            else {
                this.iShowMoney += chgm;
            }
        }

        //this.textMoney.setString(this.chgString_Money(this.iShowMoney));
        // this.textMoney.setString(this.chgString_Gray1(this.iShowMoney, 8));
    },

    refreshShowMoney: function (binit) {
        if (binit) {
            this.iShowMoney = this.iMyMoney;
            this.textMoney.setString(this.chgString_Gray1(this.iShowMoney, 8));
        }
        else {
            if (this.iNewMoney != undefined) {
                this.iMyMoney = this.iNewMoney;
                this.iNewMoney = undefined;
            }
        }

        this.refreshTextTotal(binit);
    },

    refreshInfo: function () {
        if (GamelogicMgr.instance.callFuncByName("isDisableSkip"))
            return;

        var state = this.ModuleUI._getCurState(ELEMENTAL_UI_STATE.STATE_RUN);
        if ((state === 2 || state === 1)  && this.bCanStop && this.bQuickStopTime <= 0) {
            if ((!GamelogicMgr.instance.getScQuickStopOn() && !this._logic.hasLight()) || GamelogicMgr.instance.getScQuickStopOn())
                this.ModuleUI.setRunState(3);
        }
    },

    refreshFreeGameInfo: function(bJust) {
        this.ModuleUI.setFreeTotalWin(this._logic.getFreeTotalWin(), bJust);
    },

    refreshTextTotal: function(bJustStart) {},

    //! 根据红包进行刷新
    refreshGiftGame : function () {
        if(!GameMgr.singleton.isShowGift())
            return ;

        var data = GameMgr.singleton.getGiftData();

        if(data == undefined)
            return ;

        this.btnNeg.setEnabled(false);
        this.btnNeg.setBright(false);
        this.btnAdd.setEnabled(false);
        this.btnAdd.setBright(false);
        this.btnMax.setEnabled(false);
        this.btnMax.setBright(false);

        var bnum = data.bet;
        var allbnum = bnum * data.line * data.times;

        this.textAllBet.setString(this.chgString(allbnum));
        this.textBet.setString(this.chgString(bnum));

        if (this._effectMgr) {
            // this._effectMgr.changeBet();
        }
    },

    //! 离开红包游戏
    leftGiftGame : function () {
        var realbalance = GamelogicMgr.instance.getRealBalance();
        this.ModuleUI.setBalance(realbalance);
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

        return true;
    },

    //! 调整部分消息，在initFinish中调用（排除掉部分逻辑不使用的消息）
    adjustMsg : function () {
        if (this.GameModuleInfos == undefined)
            return ;
    },

    //! 将一个数字变成字符串
    chgString: function (num) {

        // if(num < 0) {
        //     num = 0;
        // }

        var str = Math.floor(num / 100).toString();

        if (num % 100 != 0) {
            str += ".";
            var snum = num % 100;

            if (snum < 10) {
                str += "0";
                str += snum;
            }
            else {
                str += snum;
            }
        }

        return str;
    },

    chgString1: function (num) {
        var str = Math.floor(num / 100).toString();

        if (num % 100 != 0) {
            str += ".";
            var snum = num % 100;

            if (snum < 10) {
                str += "0";
                str += snum;
            }
            else {
                str += snum;
            }
        }
        else {
            if (num < 100000) {
                str += '.00';
            }
        }

        return str;
    },

    chgString_Gray1: function (num, gnum) {
        var tstr = "";

        var znum = Math.floor(num / 100);

        var zstr = znum.toString();
        var anum = gnum - zstr.length;
        var comma = 3 - gnum % 3;

        if (comma >= 3)
            comma = 0;

        if (anum > 0) {
            //! 需要补灰色的0
            for (var ii = 0; ii < anum; ++ii) {
                //tstr += "a";

                ++comma;
                if (comma >= 3) {
                    comma = 0;
                    //tstr += "b";
                }
            }
        }

        for (var ii = 0; ii < zstr.length; ++ii) {
            tstr += zstr[ii];

            ++comma;
            if (comma >= 3) {
                comma = 0;
                tstr += ",";
            }
        }

        var str = tstr.slice(0, tstr.length - 1);

        if (num % 100 != 0) {
            str += ".";
            var snum = num % 100;

            if (snum < 10) {
                str += "0";
                str += snum;
            }
            else {
                str += snum;
            }
        }
        else {
            str += ".00";
        }

        return str;
    },

    //! 消息处理
    //! 收到用户的钱数据
    onMyMoney : function (money, brefresh) {
        GamelogicMgr.instance.callRegistered("onMyMoney", money);
        // if (this.iMyMoney == undefined || brefresh)
        //     this.iMyMoney = money;
        // else
        //     this.iNewMoney = money;

        this._logic.onMyMoney(money);

    },

    onSymbolStripes_num: function(arr, wname) {
        this._effectMgr.onSymbolStripes(wname, arr);
    },

    //! 收到转动结果
    onSpinResult: function (totalwin, result, winresult) {
        //! 排除重复收到的结果
        if (this.bCanStop)
            return;

        this.totalwin = totalwin;
        this.result = result;
        this.winresult = winresult;
    },

    onSpinResult1: function () {
    },

    onSGameInfo: function (msgobj) {
        cc.log("GameLayer: onSGameInfo");
    },

    //! 收到游戏信息
    onGameInfo: function (msgobj) {
        if (msgobj.hasOwnProperty('gamescene')) {
            if (msgobj.gamescene == "pickshell") {
                this.bCanOpenBox = true;
            }
            else if (msgobj.gamescene == "pokerrb") {
                if (msgobj.gamescenestate == 0) {
                    this.bGameInfoDouble = true;
                }
                else if (msgobj.gamescenestate == 1) {
                    if (this.DoubleLayer == undefined) {
                        this.refreshInfo();

                        var layer = new NarutoDoubleLayer(this);
                        this.addChild(layer, 1);

                        this.DoubleLayer = layer;

                        MainClient.singleton.sgamectrl(GameMgr.singleton.getCurGameID(), "pokerrb", "comein", 0, function (isok) {
                        });
                    }
                }
            }
        }

        if (msgobj.hasOwnProperty('fgi')) {
            if (!this.bFreeGame) {
                this.bFreeGame = true;
            }
            this.bAutoRun = true;

            if (this.WaitAutoTime <= 0)
                this.WaitAutoTime = 1;

            if (this.iFreeNums < 0)
                this.iFreeNums = msgobj.fgi.lastnums;

            if (this.iBet >= this.lstBet.length)
                this.iBet = this.lstBet.length - 1;

            for (var ii = 0; ii < this.lstBet.length; ++ii) {
                if (this.lstBet[ii] == msgobj.fgi.bet) {
                    this.iBet = ii;
                    break;
                }
            }

            this.refreshInfo();
        }
        else {
            this.refreshInfo();
        }
    },

    //! 收到断线
    onDisconnect: function () {
        if (this.ErrorLayer != undefined)
            return;

        GamelogicMgr.instance.callRegistered("setDisconnect", 1, 0);

        if (GamelogicMgr.instance.needNativeDisconnect()) {
            var layer = new DisconnectDialog(this, 1, 0);
            this.addChild(layer, 999);
            this.DisconnectLayer = layer;
            this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_DISCONNECT, 1);
        }
    },

    //! 收到重连
    onReconnnect: function () {
        if (this.DisconnectLayer == undefined)
            return;

        this.removeChild(this.DisconnectLayer);
        this.DisconnectLayer = undefined;

        this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_DISCONNECT, 0);
    },

    //! 清除游戏消息
    clearGameModuleInfo: function () {
        this.GameModuleInfos = {};
    },

    //! 收到错误信息
    onError: function (type, strerror, newtype) {
        if (this.ErrorLayer != undefined)
            return;

        var ctype = 3;

        if (newtype != undefined && newtype == 1)
            ctype = 4;

        GamelogicMgr.instance.callRegistered("setDisconnect", ctype, type, strerror);

        if(GamelogicMgr.instance.needNativeDisconnect()) {
            var layer = new DisconnectDialog(this, ctype, type, strerror);
            this.addChild(layer, 12);
            this.ErrorLayer = layer;
            this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_DISCONNECT, 1);
        }
    },

    onChgCoinValue : function (value) {
        GamelogicMgr.instance.callRegistered("onChgCoinValue");
        this.setUserSetup('coinvalue', value);
    },

    //! 按钮
    onTouchRun: function (sender, type) {

        // this._effectMgr.onEnterFreeAniEnd();
        //
        // return;

        cc.audioEngine.playEffect(res.ElementalBtnRun_mp3, false);

        this.runOne();
    },

    onTouchStop: function (sender, type) {
        this.ModuleUI.setRunState(4);

        this.refreshInfo();

        for (var ii = 0; ii < this.lstwheel.length; ++ii) {
            this.lstwheel[ii].stopWheelAtOnce(this.SpinResultData[ii]);
        }
    },

    onTouchMenu: function(sender, type) {
        if(this.gamemenuLayer == undefined)
            return;

        // var elemental = this._effectMgr._lstUIElement[9];
        // for (var i = 0; i < 3; ++i) {
        //     var node = elemental.getNode(i);
        //     if (node) {
        //         node.setOpacity(0);
        //         node.runAction(cc.fadeIn(3));
        //     }
        // }
        //
        // return;

        this.playBtnSound();

        this.gamemenuLayer.onBtnOpen();
    },

    onTouchHelp : function (sender, type, hei) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.InfoLayer != undefined)
            return;

        this.openHelp(hei);
    },

    openHelp:function(hei){
        var size = cc.winSize;
        var webView;

        if(ELEMENTAL_HELP) {
            webView = new ccui.WebView(ELEMENTAL_HELP);
        }
        else if (ELEMENTAL_SRCROOT) {
            webView = new ccui.WebView(ELEMENTAL_SRCROOT + 'help.html');
        }
        else
            webView = new ccui.WebView('res/elemental/iframe/help.html');

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
        };
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
        var webView_gameRules;

        if(ELEMENTAL_GAMERULES) {
            webView_gameRules = new ccui.WebView(ELEMENTAL_GAMERULES);
        }
        else if (ELEMENTAL_SRCROOT) {
            webView_gameRules = new ccui.WebView(ELEMENTAL_SRCROOT + 'gamerules.html');
        }
        else
            webView_gameRules = new ccui.WebView('res/elemental/iframe/gamerules.html');

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
                };
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

    openHistory:function(hei){
        var size = cc.winSize;

        //var webView = new ccui.WebView('res/icefire/icefire_help/icefire_index.html');
        //var webView = new ccui.WebView('https://www.baidu.com/');

        var webView_History;

        if(ELEMENTAL_HISTORY) {
            webView_History = new ccui.WebView(ELEMENTAL_HISTORY);
        }
        else if (ELEMENTAL_SRCROOT) {
            webView_History = new ccui.WebView(ELEMENTAL_SRCROOT + 'history.html');
        }
        else
            webView_History = new ccui.WebView('res/elemental/history/history.html');

        var w = cc.view.getFrameSize().width;
        var h = cc.view.getFrameSize().height;

        webView_History.setContentSize(w, hei);
        webView_History.setPosition(0, h - hei);
        webView_History.attr({anchorX: 0, anchorY: 0});
        webView_History.setScalesPageToFit(true);
        webView_History._renderCmd._div.style["background"] = "#000";

        var node = new cc.Node();
        this.addChild(webView_History);

        this.webView_History = webView_History;
        this.webView_History.visit();

        // if(webView) {
        //     // var iframe = webView._renderCmd._iframe;x
        //     // iframe.contentWindow.postMessage('MessageFromIndex1','*');
        //     webView.setEventListener("load",  function () {
        //         var iframe = webView._renderCmd._iframe;
        //         iframe.contentWindow.postMessage(LanguageData.languageForHtml(),'*');
        //     });
        // }

        if(webView_History) {
            var iframe = webView_History._renderCmd._iframe;
            // iframe.contentWindow.postMessage('MessageFromIndex1','*');
            webView_History.setEventListener("load",  function () {
                var data={
                    size:{
                        w:w,
                        h:hei,
                    },
                    data:LanguageData.languageForHtml(),
                };

                if(typeof(getGameParameter) != 'undefined'){
                    data.GameParameter = getGameParameter();
                }
                else
                    data.GameParameter = [];

                data.currency = GamelogicMgr.instance.getCurrency();
                iframe.contentWindow.postMessage(data,'*');
            });
        }
    },

    closeHistory: function(){
        if(this.webView_History){
            this.webView_History.removeFromParent(true);
            this.webView_History = undefined;
        }
    },

    setHistorySize:function(w, h, y){
        if(this.webView_History == undefined || this.webView_History == null)
            return;

        var iframe = this.webView_History._renderCmd._iframe;
        var data={
            size:{
                w:w,
                h:h,
            },
            data:{},
        };
        iframe.contentWindow.postMessage(data,'*');

        this.webView_History.setContentSize(w, h);
        this.webView_History.setPosition(0, y);
    },

    onTouchMax: function(value) {
        if(this.bRun || this.bAutoRun)
            return ;

        this.iBet = value;

        if(this.iBet == this.lstBet.length - 1){
            var rate = GameDataMgr.instance.getCoinValueRate();
            var allbnumber = this.lstBet[this.iBet] * this.iLine / rate;
            var allbnum = LanguageData.instance.formatCustomMoney(allbnumber,0);

            this.setDisconnect(2, -1, allbnum);
        }

        this.saveBetNum();
        this.refreshInfo();
        this.playBtnSound();
    },

    onTouchBtnCoins:function(sender, type, bshowcoins){
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.bShowCoins = bshowcoins;
        this.ModuleUI.setShowCoins(bshowcoins);
    },

    openBoxGame: function (type) {
        this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_VIR_RUN, 1);

        this.refreshInfo();
        this.beginFreeGame();
        this.clearResultDis();

        this.bCanOpenBox = false;
    },

    setRun: function(bRun) {
        this.bRun = bRun;
        this.ModuleUI.setRun(bRun, this.bFreeGame);
    },

    openFreeResult: function () {
        if (this.platformCtrl && this.platformCtrl.collect != undefined && this.bCollectNums == 0) {
            this.bCollect = this.platformCtrl.collect();
            ++this.bCollectNums;

            if (this.bCollect) {
                this.ModuleUI._setState("gamecollect", 0);
                this.ModuleUI.bWaitCollect = true;
            }
        }

        // var freewin = this.iTotalWin / (this.ModuleUI.getCoinValue() / GameDataMgr.instance.getCoinValueRate());
        var allbnum = this.ModuleUI.getTotalBet();
        var cnum = this.iTotalWin / allbnum;

        this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_FREE_RESULT, 1);
        var layer = new ElementalFreeResultLayer(this, this.iTotalWin, cnum);
        this._nodeFreeResult.addChild(layer, 1);

        // cc.audioEngine.playEffect(res.ElementalFGEnd_mp3, false);

        this.FreeResultLayer = layer;
    },

    leftFreeResult: function() {
        if (this.bFreeGame) {
            this.exitFreeGame();
        }
    },

    onLeftFreeCallback: function () {
        if (this.bFreeGame) {
            GameMgr.singleton.showGiftGame(this.canShowGiftGame());
        }

        this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_FREE_RESULT, 0);

        if (this.FreeResultLayer != undefined) {
            this.FreeResultLayer.removeFromParent();
            this.FreeResultLayer = undefined;
        }

        this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_VIR_RUN, 0);

        if (this._effectMgr) {
            this._effectMgr.onExitFreeGame();
        }

        this.bFreeGame = false;
        this.ModuleUI.setFreeGame(this.bFreeGame, false, this.iTotalWin, 0);

        var freeTotalWin = this._logic.getFreeTotalWin();
        if (freeTotalWin > 0) {
            this.ModuleUI._setState("actNumWin", 0);
            var coinValue = GameDataMgr.instance.getCoinValue();

            var iWin = freeTotalWin / coinValue;
            GameDataMgr.instance.setIWin(iWin);

            this.ModuleUI._showAllMoneyAni(freeTotalWin);
        }

        //this.playOneMusic();
        this.iFreeNums = -1;
        this.iTotalWin = 0;
        this.iWin = 0;

        if (this.iAutoNum > 0) {
            this.bAutoRun = true;
            this.WaitAutoTime = 1;
        }
        else {
            this.bAutoRun = false;
        }

        this.refreshInfo();
        this.refreshGameSceneElements();

        this.onGameModuleInfo1();

        cc.audioEngine.stopMusic();
        this.playOneMusic();

        GamelogicMgr.instance.callRegistered('endGameRound');
    },

    onTouchOpenSound: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        this.setPlaySound(false);
        GameAssistant.singleton.setMusicType("elemental", 0);
    },

    onTouchCloseSound: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        this.setPlaySound(true);
        GameAssistant.singleton.setMusicType("elemental", 1);
    },

    onTouchOpenEffect: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        this.setPlayEffect(false);
        GameAssistant.singleton.setEffectType("elemental", 0);
    },

    onTouchCloseEffect: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        this.setPlayEffect(true);
        GameAssistant.singleton.setEffectType("elemental", 1);
    },

    onTouchSetup: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if (this.MenuBarLayer) {
            this.playBtnSound();
            this.MenuBarLayer.onTouchSetup();
            return;
        }

        this.playBtnSound();

        var layer = new ElementalSetupLayer(this);
        this.addChild(layer, 1);
    },

    onTouchClose: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        this.playBtnSound();

        close_game();
    },

    onTouchQuickOn: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        this.playBtnSound();
        this.setQuick(false);
    },

    onTouchQuickOff: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        this.playBtnSound();
        this.setQuick(true);
    },

    setQuick: function (bquick) {
        this.bQuick = bquick;
        this.setUserSetup("userquick", this.bQuick ? 1 : 0);
        this.refreshInfo();
    },

    setPlaySound: function (bplay) {
        if (bplay) {
            if (!this.bInitMusic) {
                this.bInitMusic = true;
                this.playOneMusic();
            }

            if (this.SoundValue <= 0) {
                this.SoundValue = parseFloat(GameAssistant.singleton.getVolumeValue("elemental"));
            }

            cc.audioEngine.setMusicVolume(this.SoundValue * 0.5);
        }
        else {
            this.SoundValue = 0;
            cc.audioEngine.setMusicVolume(this.SoundValue * 0.5);
        }
    },

    setPlayEffect: function (bplay) {
        if(bplay) {
            if (this.EffectValue <= 0) {
                this.EffectValue = parseFloat(GameAssistant.singleton.getVolumeValue("elemental"));
            }

            cc.audioEngine.setEffectsVolume(this.EffectValue);
        }
        else {
            this.EffectValue = 0;
            cc.audioEngine.setEffectsVolume(this.EffectValue);
        }
    },

    playBtnSound: function () {
        cc.audioEngine.playEffect(res.ElementalBtnClick_mp3, false);
    },

    _playFreeGameMusic: function(bLoop) {
        var gameType = this._logic.getGameType();
        if (gameType == ELEMENTAL_GAME_TYPE.GAME_BG)
            return;

        var resName = "ElementalFreeMusic" + gameType + "_mp3";
        if (res[resName]) {
            cc.audioEngine.playMusic(res[resName], bLoop);
        }
    },

    //! 播放一个音乐
    playOneMusic: function () {
        if (!this.bInitMusic)
            return;

        if (this.bFreeGame) {

            if(this.bFreeGameInit)
                return;

            this._playFreeGameMusic(false);
            return;
        }

        if (cc.audioEngine.isMusicPlaying())
            return;

        if (this.lstWaitMusic.length <= 0)
            this.addWaitMusic();

        var index = this.lstWaitMusic[0];
        this.lstWaitMusic.splice(0, 1);

        cc.audioEngine.playMusic(this.lstMusic[index], false);

        //this.addWaitMusic();

        if (this.lstWaitMusic <= 1) {
            this.addWaitMusic();
        }
    },

    //! 增加一组随机音乐
    addWaitMusic: function () {
        if (this.lstWaitMusic.length == 0) {
            var lstwindex = [];
            var wnum = this.lstMusic.length;

            for (var ii = 0; ii < wnum; ++ii) {
                lstwindex.push(ii);
            }

            for (var ii = 0; ii < this.lstMusic.length; ++ii) {
                var sindex = Math.floor(Math.random() * wnum);

                if (sindex < 0)
                    sindex = 0;

                if (sindex >= wnum)
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

            for (var ii = 0; ii < this.lstMusic.length; ++ii) {
                if (ii != skipnum)
                    lstwindex.push(ii);
            }

            wnum = lstwindex.length;

            for (var ii = 0; ii < this.lstMusic.length; ++ii) {
                var sindex = Math.floor(Math.random() * wnum);

                if (sindex < 0)
                    sindex = 0;

                if (sindex >= wnum)
                    sindex = wnum - 1;

                var anum = lstwindex[sindex];
                this.lstWaitMusic.push(anum);
                lstwindex.splice(sindex, 1);

                if (ii == 0) {
                    //! 把跳过的图片加回来
                    lstwindex.push(skipnum);
                }

                wnum = lstwindex.length;
            }
        }
    },

    //! 转一次
    runOne: function () {
        if (this.ErrorLayer != undefined)
            return false;

        if (this.bRun)
            return false;

        for (var ii = 0; ii < this.lstwheel.length; ++ii) {
            if (this.lstwheel[ii].bRun)
                return false;
        }

        if (!this._effectMgr.isVia())
            return false;

        if (this.bCanOpenBox)
            return false;

        if (this._effectMgr) {
            this.clearResultDis();
            this._effectMgr.onPreRunOne();

            GamelogicMgr.instance.callRegistered('startGameRound');

            return true;
        }

        return false;
    },

    onRunOne: function() {
        var bnum = this.ModuleUI.getCoinValue();
        var allbnum = this.ModuleUI.getTotalBet();

        if(!GameMgr.singleton.isShowGift() && !this.bFreeGame && !this.ModuleUI.canBetting() && !this.bRewatch && !this.isPrepaid()) {
            GamelogicMgr.instance.callRegistered("spineError");

            this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_AUTO_RUN, 0);
            return false;
        }

        this.clearResultDis();

        if(!GameMgr.singleton.isShowGift() && !this.bFreeGame && !this.isPrepaid() && !this.bRestore) {
            this.ModuleUI.betting();
        }

        this.iWin = 0;
        var speed = 3000;
        var banitime = 0.2;

        for (var ii = 0; ii < this.lstwheel.length; ++ii) {
            if (ii == 0)
                this.lstwheel[ii].run(speed, banitime, 1, ii * 0.2);
            else
                this.lstwheel[ii].run(speed, banitime, 0.5, ii * 0.2);
        }

        cc.audioEngine.playEffect(res.ElementalRunWheel_mp3, false);

        this.WaitStopTime = 0;
        this.bCanStop = false;
        this.bQuickStopTime = 1;
        this.bCollectNums = 0;

        var minSpinTime = GamelogicMgr.instance.getMinimalSpinningTime();
        if (minSpinTime > 0) {
            this.bQuickStopTime = Math.max(this.bQuickStopTime, minSpinTime);

            if (minSpinTime > 1.1) {
                this._iMinSpinTime = minSpinTime - 1.1;
            }
            else {
                this._iMinSpinTime = 0;
            }
        }

        var gameId = GameMgr.singleton.getCurGameID();

        this.setRun(true);
        this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_VIR_FREE, 0);
        this.refreshInfo();

        this.closeIconTips();

        GamelogicMgr.instance.callRegistered("spinActionPre", gameId, bnum, 1, this.ModuleUI.getBet(), this.bFreeGame);

        if (this.bRewatch) {
            this.bRewatch = false;
            this.ModuleUI._setState("rewatch", 2);
        }

        return true;
    },

    //! 是否是预付费游戏（根据YGG消息增加）
    isPrepaid : function () {
        var result = GamelogicMgr.instance.isPrepaid();
        return result;
    },

    //! 设置自动转
    setAuto: function (num) {
        if (num > 0) {
            this.bAutoRun = true;
            this.iAutoNum = num;

            this.WaitAutoTime = 0.1;
        }
        else {
            this.bAutoRun = false;
            this.iAutoNum = 0;

            this.WaitAutoTime = 0;
        }

        this.refreshInfo();
    },

    //! 开始自动转
    beginAuto: function () {
        if (!this.bFreeGame) {
            if (!this.bAutoRun)
                return;

            if (this.iAutoNum <= 0) {
                this.iAutoNum = 0;
                this.setAuto(0);
                GameMgr.singleton.onAutoEnd();
                return;
            }

            --this.iAutoNum;
        }
        else {
            //! 显示结果
            if (this.iFreeNums <= 0) {
                this.openFreeResult();
                return;
            }
            else {
                --this.iFreeNums;
            }
        }

        if (!this.runOne()) {
            this.setAuto(0);
            return;
        }
    },

    //! 显示所有的结果
    showAllResult: function (bActive) {
        if (this.iWin <= 0) {
            this._effectMgr.onWinAniEnd();
            return;
        }

        for (var ii = 0; ii < this.lstwheel.length; ++ii) {
            this.lstwheel[ii].setState(1);
        }

        for (var ii = 0; ii < this.winresult.length; ++ii) {
            var node = this.winresult[ii];

            if (node.type == "line") {
                var lindex = node.data.line;

                if (this.GameLine != undefined)
                    this.GameLine.showLine(lindex);
            }

            for (var jj = 0; jj < node.positions.length; ++jj) {
                var x = node.positions[jj].x;
                var y = node.positions[jj].y;
                var wheelY = 1 - y;

                if (!this._effectMgr.showTop(x, y))
                    this.lstwheel[x].showTop(wheelY, undefined);
            }
        }

        this.bShowResult = true;
        this.iShowResultIndex = -1;
        this.ShowResultTime = 24 / 24 * 2;

        this.showAllResult_ani();
    },

    showAllResult_ani: function () {
        if (!this.ModuleUI)
            return;

        this.WinAni2 = true;

        this.ModuleUI.setWinData(this._logic.getBet(), this._logic.getTurnNums(), this._logic.getTurnWin(), this._logic.getRealWin(), this._logic.getBalance(), this._logic.getFreeTotalWin(), this.iWonaMount);
        this.ModuleUI.showWin();
    },

    showResultLineAni: function() {
        ++this.iShowResultIndex;

        if (this.iShowResultIndex >= this.winresult.length)
            this.iShowResultIndex = 0;

        for (var ii = 0; ii < this.lstwheel.length; ++ii) {
            this.lstwheel[ii].clearTop();
        }

        this._effectMgr.clearTop();

        if (this.GameLine != undefined)
            this.GameLine.hideAllLine();

        var node = this.winresult[this.iShowResultIndex];

        if (node.type == "line") {
            var lindex = node.data.line;

            if (this.GameLine != undefined)
                this.GameLine.showLine(lindex);
        }

        for (var jj = 0; jj < node.positions.length; ++jj) {
            var x = node.positions[jj].x;
            var y = node.positions[jj].y;
            var wheelY = 1 - y;

            if (!this._effectMgr.showTop(x, y))
                this.lstwheel[x].showTop(wheelY, undefined);
        }

        this.ShowResultTime = 24 / 24 * 2;
    },

    onTouchExitPanel: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        this.ModuleUI._onTouchDisable();
    },

    update_ShowResult: function (dt) {
        if (!this.bShowResult)
            return;

        if (this.ShowLineTime > 0)
            return;

        if (this.winresult.length <= 0)
            return;

        this.ShowResultTime -= dt;

        if (this.ShowResultTime <= 0) {
            this.showResultLineAni();
        }
    },

    //! 清除结果显示
    clearResultDis: function () {
        this.bShowResult = false;
        this.ShowResultTime = 0;

        for (var ii = 0; ii < this.lstHelp.length; ++ii) {
            var help = this.lstHelp[ii];

            if (help != undefined && help.clearResult != undefined)
                help.clearResult();
        }

        for (var ii = 0; ii < this.lstwheel.length; ++ii) {
            this.lstwheel[ii].setState(0);
        }

        this._effectMgr.clearTop();

        if (this.GameLine != undefined)
            this.GameLine.hideAllLine();
    },

    //! 初始化的数据已经完成
    initFinish: function () {
        this.adjustMsg();
        this.onGameModuleInfo1();

        if (this.GameModuleInfos != undefined && this.GameModuleInfos['elemental_jackpot'] != undefined && !this.bRun && this.SmallGameLayer == undefined) {
            //! 上线恢复的时点
            this.openSmallGame(false);
        }

        if(this.canShowGiftGame())
            GameMgr.singleton.showGiftGame(true);
        else
            GameMgr.singleton.initGiftGame();

    },

    //! 收到游戏模块信息
    onGameModuleInfo: function (msgobj) {
        if (this.GameModuleInfos == undefined)
            this.GameModuleInfos = {};

        if (msgobj.gamemodulename == undefined)
            return;

        if (msgobj.gmi.lstgamejackpot != undefined) {
            this.setJackpotNums(msgobj.gmi.lstgamejackpot);
            this.iJackpotTime = 30;
        }

        if (msgobj.gamemodulename == 'common') {
            this.bJackpotMsg = true;
            return;
        }

        if (this.bJackpotMsg)
            return;

        this.GameModuleInfos[msgobj.gamemodulename] = msgobj;

        if (this.bJustStart) {
            this.onGameModuleInfo1();
        }
    },

    //! 仅处理游戏主消息
    onGameModuleInfo1: function () {
        if (this.GameModuleInfos == undefined)
            return;

        var msgobj = undefined;

        if (this.GameModuleInfos['elemental_fg'] !== undefined && this.GameModuleInfos['elemental_bg'] != undefined) {
            this._msgobj = this.GameModuleInfos['elemental_bg'];
            if (this.bJustStart) {
                this.GameModuleInfos['elemental_bg'] = undefined;
            }
        }

        if (this.GameModuleInfos['elemental_fg'] !== undefined && this.GameModuleInfos['elemental_fg'].gmi.lastnums === 0) {
            msgobj = this.GameModuleInfos['elemental_fg'];
            this.GameModuleInfos['elemental_fg'] = undefined;
        }
        else {
            if (this.GameModuleInfos['elemental_bg'] != undefined) {
                msgobj = this.GameModuleInfos['elemental_bg'];
                this.GameModuleInfos['elemental_bg'] = undefined;
            }
            else if (this.GameModuleInfos['elemental_fg'] != undefined) {
                msgobj = this.GameModuleInfos['elemental_fg'];
                this.GameModuleInfos['elemental_fg'] = undefined;
            }
        }

        if (!msgobj)
            return;

        if (msgobj.mode) {
            cc.log(msgobj.mode);

            if(msgobj.mode == "REPLAY"){
                if(this.bJustStart)
                    this.closeInfoLayer();

                this.bRewatch = true;
                this.ModuleUI._setState('rewatch', 1);

                this.bReplay = true;
                this.playOneMusic();
            }
            else if(msgobj.mode == "RESTORE"){
                this.bRestore = true;
            }
            else if(msgobj.mode == "SKIP"){
                this.bSkip = true;
            }
        }

        // // 本地测试模式代码
        // if (msgobj && msgobj.gmi && !msgobj.gmi.isinit) {
        //     if (ELEMENTAL_DEBUG_FG_WIND) {
        //         if (this._iCurTestMsgIndex === undefined) {
        //             this._iCurTestMsgIndex = 0;
        //         }
        //         else {
        //             ++this._iCurTestMsgIndex;
        //         }
        //
        //         var lst = this._logic.createTestMsg01();
        //         var testMsg = lst[this._iCurTestMsgIndex];
        //
        //         if (testMsg) {
        //             msgobj = testMsg;
        //         }
        //     }
        // }

        this._logic.onGameModuleInfo(msgobj);
        this._effectMgr.onGameModuleInfo(msgobj.gmi && msgobj.gmi.isinit);

        if (this.bJustStart) {
            this.refreshGameSceneElements();
            this.bJustStart = false;
        }

        var baseWheelData = this._logic.getLogicData();

        if (msgobj.gamemodulename == 'elemental_bg' || msgobj.gamemodulename == 'elemental_fg') {

            if(msgobj.gmi.spinret != undefined){
                if (msgobj.gmi.spinret.wonamount != undefined)
                    this.iWonaMount = msgobj.gmi.spinret.wonamount;

                // if (msgobj.gmi.spinret.bet != undefined && msgobj.gmi.spinret.bet > 0) {
                //     if (this.ModuleUI) {
                //         this.ModuleUI.setCoinValue(msgobj.gmi.spinret.bet);
                //     }
                //
                //     this.iBet = GameDataMgr.instance.getCurCoinIndex();
                // }
            }

            if (msgobj.gamemodulename == 'elemental_fg') {
                var ofg = this.bFreeGame;
                this.bFreeGame = true;
                this.bAutoRun = true;

                if (msgobj.gmi.isinit || !ofg) {
                    this.iFreeNums = parseInt(msgobj.gmi.lastnums);         //! 免费次数

                    if (this.WaitAutoTime <= 0)
                        this.WaitAutoTime = 1;
                }
            }

            if (msgobj.gmi.isinit) {
                //! 初始化
                if (baseWheelData) {
                    for (var ii = 0; ii < 5; ++ii) {
                        var bindex = 0;
                        var data = [0, 0, 0];

                        for (var jj = 0; jj < 3; ++jj) {
                            data[jj] = baseWheelData[3 - jj - 1][ii];
                        }

                        this.lstwheel[ii].setWheelIndex(bindex, true, data);
                    }
                }

                //! 重入开Box（xq）
                if (msgobj.gamemodulename == 'elemental_bg' && this.GameModuleInfos['elemental_fg'] != undefined) {
                    this._logic.checkIsLuckyFree();
                    this.openBoxGame();
                }

                //! 直接在免费游戏中
                if (msgobj.gamemodulename == 'elemental_fg') {
                    this.playOneMusic();

                    if (msgobj.gmi.bet != undefined && msgobj.gmi.bet > 0) {
                        if (this.ModuleUI) {
                            this.ModuleUI.setCoinValue(msgobj.gmi.bet);
                        }

                        this.iBet = GameDataMgr.instance.getCurCoinIndex();
                    }

                    this.iTotalWin = msgobj.gmi.totalwin;
                    this.ModuleUI.setFreeGame(this.bFreeGame, true, this.iTotalWin, this.iFreeNums);
                    this.ModuleUI.setFreeTotalWin(this.iTotalWin, true);
                    this.refreshGameSceneElements();
                    this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_FREE, 1);
                    this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_VIR_RUN, 1);

                    if (this._effectMgr) {
                        this._effectMgr.onInitFinish();
                        this._effectMgr._onFGUIFadeInAniEnd();
                    }

                    GamelogicMgr.instance.callRegistered('startGameRound');
                }
                else {
                    this._effectMgr.onInitFinish();
                }

                // 试玩版公主转初始化操作
                if (this._logic.isBetaGame()) {
                    this._effectMgr.onInitBetaGame();
                }

                this.refreshInfo();

                return;
            }

            if (!this.bRun)
                return;

            // 试玩场景切换
            if (this._logic.isBetaGame()) {
                this._effectMgr.enterBetaGame();
            }
            else {
                this._effectMgr.exitBetaGame();
            }

            if (msgobj && msgobj.gmi && msgobj.gmi.spinret) {
                this.SpinWin = msgobj.gmi.spinret.realwin;
                this.winresult = msgobj.gmi.spinret.lst;
            }

            if (this.bQuickStopTime <= 0) {
                this.refreshInfo();
            }

            if (msgobj.gamemodulename == 'elemental_bg' && this.GameModuleInfos['elemental_fg'] != undefined) {
                this._logic.checkIsLuckyFree();
                this.bCanOpenBox = true;
            }

            this.refreshInfo();
        }
    },

    stopFirstWheel: function() {
        if (!this._effectMgr.isVia())
            return;

        if (this._iMinSpinTime > 0)
            return;

        //! 转动结束
        //! 排除重复收到的结果
        if (this.bCanStop)
            return;

        var baseWheelData = this._logic.getLogicData();
        for (var ii = 0; ii < 5; ++ii) {
            this.SpinResult[ii] = -1;

            for (var jj = 0; jj < 3; ++jj) {
                this.SpinResultData[ii][jj] = baseWheelData[3 - jj - 1][ii];
            }
        }

        this.lstwheel[0].stop_index(this.SpinResult[0], this.SpinResultData[0]);
        this.bCanStop = true;

        this.refreshInfo();
    },

    onWheelStop: function (self, index) {
        if (index > 0) {
            if (self._logic.getIconCount(index, LIST_SYMBOLS.FG) >= 3 && self._logic.getIconCount(index - 1, LIST_SYMBOLS.FG) < 3) {
                cc.log("onWheelStop, index = ", index, ", sc count = 3");
                cc.audioEngine.playEffect(res.ElementalIconSC3_mp3, false);
            }
        }

        self._effectMgr.onWheelStop(index);
    },

    //! 进入免费游戏阶段
    beginFreeGame: function (binit) {
        if (this.ModuleUI._getCurState(ELEMENTAL_UI_STATE.STATE_FREE_ANI) == 0) {

            var state = 1;
            if (this._logic.isLuckyFree()) {
                state = 2;
                cc.audioEngine.playEffect(res.ElementalIconSC3_mp3, false);
            }

            this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_FREE_ANI, state);

            // cc.audioEngine.playEffect(res.ElementalFGIN_mp3, false);

            this.bFreeGameInit = true;
            this.iEnterFreeGameTime = 61 / 24;

            return;
        }

        this.iTotalWin = 0;

        GameMgr.singleton.showGiftGame(false);
    },

    beginFreeGameAdd: function() {
        if (this.ModuleUI._getCurState(ELEMENTAL_UI_STATE.STATE_FREE_ADD_ANI) !== 1) {
            this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_FREE_ADD_ANI, 1);
            this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_VIR_FREE, 1);

            this._iFreeAddTime = 29 / 24;
            this._iFreeAddCloseTime = 18 / 24;

            if (this._freeGameAddAni) {
                var freeAddRes = this._freeGameAddAni.getRes();
                var aniCtrlBack = findNodeByName(freeAddRes.node, "aniCtrlBack");
                aniCtrlBack.animation.play("wait_1", 0, false);
                aniCtrlBack.animation.setMovementEventCallFunc(function(sencer ,type, movementID) {
                    if (type === ccs.MovementEventType.complete && movementID === "wait_1") {
                        aniCtrlBack.animation.play("wait_2", 0, false);
                    }
                });

                this._freeGameAddAni.play("wait_1", false);

                if (this._logic.isLuckyFree()) {
                    cc.audioEngine.playEffect(res.ElementalIconSC3_mp3, false);
                    this._freeAddLuckyText.setVisible(true);
                }
                else {
                    this._freeAddLuckyText.setVisible(false);
                }
            }
        }
    },

    exitFreeGame: function() {
        // cc.audioEngine.playEffect(res.ElementalChgScene_mp3, false);

        this.clearResultDis();
        this.refreshInfo();

        if (this._msgobj) {
            this._msgobj.gmi.isinit = true;
            this.GameModuleInfos['elemental_bg'] = this._msgobj;
        }

        this.ExitFreeGameAni = true;
        this.iExitFreeGameTime = 12 / 24;
    },

    refreshGameSceneElements: function() {
        var gameType = this._logic.getGameType();
        if (!ELEMENTAL_DEBUG_FG_FIRE && !ELEMENTAL_DEBUG_FG_WIND && !ELEMENTAL_DEBUG_FG_SOIL && !ELEMENTAL_DEBUG_FG_WATER) {
            if (!this.bFreeGame && !this._logic.isBetaGame()) {
                gameType = 0;
            }
        }

        var state = gameType;
        if (this._logic.isBetaGame()) {
            state += 4;
        }

        this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_FREE_UI, state);
    },

    //! 小游戏相关
    //! 小游戏消息
    onGameModuleInfo_sg: function () {
        if (this.GameModuleInfos == undefined || this.GameModuleInfos['elemental_jackpot'] == undefined)
            return;

        if (this.SmallGameLayer == undefined)
            return;

        this.SmallGameLayer.onData(this.GameModuleInfos['elemental_jackpot']);

        this.GameModuleInfos['elemental_jackpot'] = undefined;
    },

    openSmallGame: function (bnew) {},

    leftSmallGame: function () {},

    setJackpotNums: function (lst) {},

    setJackpotNums_index: function (index, num) {},

    update_Jackpot: function (dt) {},

    onWinAniEnd: function() {
        this.WinAni2 = false;

        if (this._effectMgr) {
            this._effectMgr.onWinAniEnd();
        }
    },

    onEffectMgrEnd: function(bSetRun) {
        if (bSetRun != false)
            this.setRun(false);

        if(!this.bCollect && this.iWin > 0 && !this.bFreeGame && !this.bCanOpenBox){
            this.ModuleUI._showAllMoneyAni( this._logic.getTurnWin());
        }

        if (this.bFreeGame && this._logic.isAddFreeNum()) {
            this.beginFreeGameAdd();
            return;
        }

        if (this.bCanOpenBox)
            this.openBoxGame();
        else {
            GamelogicMgr.instance.callRegistered('endGameRound');
        }
    },

    showIconTips: function(index, sender, spr, wheel) {
        if (index < 0 || index > this.lstSymbol.length)
            return;

        var autoState = parseInt(this.ModuleUI._getCurState(ELEMENTAL_UI_STATE.STATE_AUTO_RUN));
        var virRun = parseInt(this.ModuleUI._getCurState(ELEMENTAL_UI_STATE.STATE_VIR_RUN));
        var isShowWin = this.ModuleUI.isShowWin();

        if (this.bAutoRun || this.bRun || autoState !== 0 || virRun !== 0 || isShowWin)
            return;

        if (!this._nodeIconTips || this.iconTips)
            return;

        if (!this._effectMgr.isVia())
            return;

        var pos = spr.getPosition();
        var wheelIndex = wheel.getWheelIndex();

        if (this._effectMgr.isDisplayFGWindMegaWild(wheelIndex, pos))
            return;

        // 左侧三轴显示在右侧，右侧两轴显示在左侧
        var type = 1;
        if (wheelIndex > 2)
            type = 0;

        if (!this.iconTips)
            this.iconTips = new ElementalIconTipsLayer(type, index, this._logic, this.bFreeGame);

        var name = sender.getName();
        var lstPoint = this.GameCanvasMgr.getPositionToParent(name, "nodeWheel", pos);
        this._nodeIconTips.addChild(this.iconTips);
        this._nodeIconTips.setPosition(lstPoint);

        this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_ICON_TIPS, 1);

        this.playBtnSound();
    },

    //! 关闭icon的提示
    closeIconTips : function (index) {
        if(this.iconTips != undefined){
            this.iconTips.removeFromParent();
            this.iconTips = undefined;
        }

        this.ModuleUI._setState(ELEMENTAL_UI_STATE.STATE_ICON_TIPS, 0);
    },

    //!点击关闭icon的提示
    onTouchCloseTips:function(sender, type){
        this.closeIconTips();
        this.playBtnSound();
    },

    //!传回的是collect成功消息
    setEndCollect:function(){
        cc.log("ElementalGameLayer: setEndCollect");

        this.bCollect = false;
        this.bCollectNums = 0;

        if(this._logic.getTurnWin() > 0){
            if(!this.WinAni2 && this._effectMgr.isVia()){
                if(!this.bFreeGame)
                    this.ModuleUI._showAllMoneyAni( this._logic.getTurnWin());
            }
        }

        this.ModuleUI._setState('gamecollect', 0);
        this.ModuleUI.bWaitCollect = false;

        if(this.bExSkip){
            this.bExSkip = false;
            GamelogicMgr.instance.callRegistered("sendSpinEnd");
        }

        //if(this.bFreeGameEx){
        //    this.bFreeGameEx = false;
        //    this.ModuleUI.setNewBalance();
        //}

        if(this.FreeResultLayer != undefined){
            this.FreeResultLayer.refreshBtnState();
        }
    },

    //! 显示skip结果
    showSkipResult: function () {
        var self = this;
        var bnum = this.ModuleUI.getCoinValue();
        GamelogicMgr.instance.callRegistered("spinActionPre",GameMgr.singleton.getCurGameID(), bnum, 1, this.ModuleUI.getBet(), this.bFreeGame, function (isok) {
            if (isok) {
                self.onGameModuleInfo1();

                RefreshWheel();
                RefreshDataReult();
            }
        });

        //!skip刷新轮子显示
        function RefreshWheel(){
            var baseWheelData = self._logic.getLogicData();
            for (var ii = 0; ii < 5; ++ii) {
                var bindex = 0;
                var data = [0, 0, 0];

                for (var jj = 0; jj < 3; ++jj) {
                    data[jj] = baseWheelData[3 - jj - 1][ii];
                }

                self.lstwheel[ii].setWheelIndex(bindex, true, data);
            }
        }

        //!skip刷新数据结果显示
        function RefreshDataReult(){
            if(GameMgr.singleton.showJackpotGame())
                return ;

            if(self.platformCtrl && self.platformCtrl.collect != undefined && self.bCollectNums == 0){
                self.bCollect = self.platformCtrl.collect();
                self.bCollectNums++;

                if(self.bCollect){
                    self.ModuleUI._setState('gamecollect', 1);
                    self.ModuleUI.bWaitCollect = true;
                }
                else{
                    self.bExSkip = false;
                    GamelogicMgr.instance.callRegistered("sendSpinEnd");
                }
            }

            self.iFreeNums = self._logic.getFreeNum();
            self.SpinWin = self._logic.getSpinWin();
            self.iWin = self.SpinWin;
            self.iTotalWin = self._logic.getFreeTotalWin();
            self.iFreeAll = self._logic.getFreeTotalWin();

            self.ModuleUI.setFreeGame(self.bFreeGame, undefined, undefined, self.iFreeNums);

            self.onEffectMgrEnd(false);
            if(self.iWin > 0){
                self.ModuleUI._setState('actNumWin', 0);

                if(self.iWonaMount > 0)
                    self.iWin = Math.min(self.iWin, self.iWonaMount);

                var iwin = self.iWin / GameDataMgr.instance.getCoinValue();
                GameDataMgr.instance.setIWin(iwin);
            }

            if(GameMgr.singleton.showJackpotWin()) {
                if(self.iNewMoney != undefined) {
                    self.setMyMoney_auto(self.iNewMoney);
                    self.iNewMoney = undefined;
                }
            }

            self.NewGameModuleInfo = undefined;
        }
    },

    onExit: function () {
        CcsResCache.singleton.releaseModule(this.name);
        this._super();
    }
});


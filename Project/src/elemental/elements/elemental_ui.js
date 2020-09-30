var ElementalUI = GameModuleUI1.extend({
    ctor: function(canvasMgr) {
        GameModuleUI1.prototype.ctor.call(this, canvasMgr);

        this.lstctrldata = [
            // node
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeBack1" },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeWheel" },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeLine" },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeTopWheel" },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeTouchWheel" },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeBack2" },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeUI" },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "layTips", callfunc: this._onTouchCloseTips, target: this, defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "layDisable", callfunc: this._onTouchDisable, target: this, defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "layDisconnect", callfunc: undefined, target: undefined, defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "layElements", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "layMask", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeBetaChgScene", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeFGSelectChgScene", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeGameLogo" },

            // singlenode
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeDisconnect", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeWinAni", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeFreeAni", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeFreeAddAni", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeFreeResult", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeFreeSelect", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeBoardDown" },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeBoardUp" },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeCollectFire", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeCollectWind", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeIconTips", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeAllMoneyAni" },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeFGSpineFire", res: "nodeFGSpineFire", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeFGSpineSoil", res: "nodeFGSpineSoil", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeFGSpineWind", res: "nodeFGSpineWind", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeFGSpineWater", res: "nodeFGSpineWater", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeSpineBGLeft", res: "nodeSpineBGLeft", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeSpineBGRight", res: "nodeSpineBGRight", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeSpineFGFireLeft", res: "nodeSpineFGFireLeft", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeSpineFGFireRight", res: "nodeSpineFGFireRight", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeSpineFGSoilLeft", res: "nodeSpineFGSoilLeft", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeSpineFGSoilRight", res: "nodeSpineFGSoilRight", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeSpineFGWindLeft", res: "nodeSpineFGWindLeft", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeSpineFGWindRight", res: "nodeSpineFGWindRight", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeSpineFGWaterLeft", res: "nodeSpineFGWaterLeft", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeSpineFGWaterRight", res: "nodeSpineFGWaterRight", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeSpineFGSelectLeft", res: "nodeSpineFGSelectLeft", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SINGLE_NODE, name: "nodeSpineFGSelectRight", res: "nodeSpineFGSelectRight", defaulthide: true },

            // resource
            { type: COMMON_CTRL_TYPE.CTRL_RESOURCE, name: "resWinAni", parent: "nodeWinAni", res: res.ElementalWinAni1_json },
            { type: COMMON_CTRL_TYPE.CTRL_RESOURCE, name: "resBackBoard1", parent: "nodeBoardDown", res: res.ElementalGameNode_BoardDown_json },
            { type: COMMON_CTRL_TYPE.CTRL_RESOURCE, name: "resBackBoard2", parent: "nodeBoardUp", res: res.ElementalGameNode_BoardUp_json },
            { type: COMMON_CTRL_TYPE.CTRL_RESOURCE, name: "resFreeAni", parent: "nodeFreeAni", res: res.ElementalGameNode_FreeAni_json },
            { type: COMMON_CTRL_TYPE.CTRL_RESOURCE, name: "resFreeAddAni", parent: "nodeFreeAddAni", res: res.ElementalGameNode_FreeAddAni_json },
            { type: COMMON_CTRL_TYPE.CTRL_RESOURCE, name: "resCollectFire", parent: "nodeCollectFire", res: res.ElementalGameNode_CollectFire_json, defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_RESOURCE, name: "resCollectWind", parent: "nodeCollectWind", res: res.ElementalGameNode_CollectWind_json, defaulthide: true },

            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGSoil", parent: "nodeFGSpineSoil", res: [[res.ElementalFreeSelectSpine02_json, res.ElementalFreeSelectSpine02_atlas]], defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGWater", parent: "nodeFGSpineWater", res: [[res.ElementalFreeSelectSpine04_json, res.ElementalFreeSelectSpine04_atlas]], defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGFire", parent: "nodeFGSpineFire", res: [[res.ElementalFreeSelectSpine01_json, res.ElementalFreeSelectSpine01_atlas]], defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGWind", parent: "nodeFGSpineWind", res: [[res.ElementalFreeSelectSpine03_json, res.ElementalFreeSelectSpine03_atlas]], defaulthide: true },

            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineBGHuabanLeft", parent: "nodeSpineBGLeft", res: [[res.ElementalBackgroundSpineFlower_json, res.ElementalBackgroundSpineFlower_atlas]]},
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineBGHuabanRight", parent: "nodeSpineBGRight", res: [[res.ElementalBackgroundSpineFlower_json, res.ElementalBackgroundSpineFlower_atlas]]},
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineBGHuazhiLeft", parent: "nodeSpineBGLeft", res: [[res.ElementalBackgroundSpineFlower_json, res.ElementalBackgroundSpineFlower_atlas]]},
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineBGHuazhiRight", parent: "nodeSpineBGRight", res: [[res.ElementalBackgroundSpineFlower_json, res.ElementalBackgroundSpineFlower_atlas]]},
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGWindLiushuLeft", parent: "nodeSpineFGWindLeft", res: [[res.ElementalBackgroundSpineWillow_json, res.ElementalBackgroundSpineWillow_atlas]]},
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGWindLiushuRight", parent: "nodeSpineFGWindRight", res: [[res.ElementalBackgroundSpineWillow_json, res.ElementalBackgroundSpineWillow_atlas]]},
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGWaterZhuziLeft", parent: "nodeSpineFGWaterLeft", res: [[res.ElementalBackgroundSpineBamboo_json, res.ElementalBackgroundSpineBamboo_atlas]]},
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGWaterZhuziRight", parent: "nodeSpineFGWaterRight", res: [[res.ElementalBackgroundSpineBamboo_json, res.ElementalBackgroundSpineBamboo_atlas]]},
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGFireFengyeLeft", parent: "nodeSpineFGFireLeft", res: [[res.ElementalBackgroundSpineMaple_json, res.ElementalBackgroundSpineMaple_atlas]]},
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGFireFengyeRight", parent: "nodeSpineFGFireRight", res: [[res.ElementalBackgroundSpineMaple_json, res.ElementalBackgroundSpineMaple_atlas]]},
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGFireYeLeft", parent: "nodeSpineFGFireLeft", res: [[res.ElementalBackgroundSpineMaple_json, res.ElementalBackgroundSpineMaple_atlas]]},
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGFireYeRight", parent: "nodeSpineFGFireRight", res: [[res.ElementalBackgroundSpineMaple_json, res.ElementalBackgroundSpineMaple_atlas]]},

            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGSelectHuabanLeft", parent: "nodeSpineFGSelectLeft", res: [[res.ElementalBackgroundSpineFlower_json, res.ElementalBackgroundSpineFlower_atlas]]},
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGSelectHuabanRight", parent: "nodeSpineFGSelectRight", res: [[res.ElementalBackgroundSpineFlower_json, res.ElementalBackgroundSpineFlower_atlas]]},
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGSelectHuazhiLeft", parent: "nodeSpineFGSelectLeft", res: [[res.ElementalBackgroundSpineFlower_json, res.ElementalBackgroundSpineFlower_atlas]]},
            { type: COMMON_CTRL_TYPE.CTRL_SPINE, name: "spineFGSelectHuazhiRight", parent: "nodeSpineFGSelectRight", res: [[res.ElementalBackgroundSpineFlower_json, res.ElementalBackgroundSpineFlower_atlas]]},

            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeBG", res: "nodeBG" },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeFG1", res: "nodeFG1", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeFG2", res: "nodeFG2", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeFG3", res: "nodeFG3", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeFG4", res: "nodeFG4", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeBGSpin", res: "nodeBGSpin" },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeFGSpin", res: "nodeFGSpin", defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_NODE, name: "nodeFly", res: "nodeFly", defaulthide: true },

            // textex
            {type:COMMON_CTRL_TYPE.CTRL_TEXT_EX,name:'textBet', res: "textBet", str:'ui_label_bet', fontname: 'NotoSans-R', bmulline: false, outline: {color: cc.color(0x3c, 0x5a, 0x5c), size: 2 } },
            {type:COMMON_CTRL_TYPE.CTRL_TEXT_EX,name:'textCoinValue', res: "textCoinValue",str:'ui_label_coinValue', fontname: 'NotoSans-R', bmulline: false, outline: {color: cc.color(0x3c, 0x5a, 0x5c), size: 2 }},
            {type:COMMON_CTRL_TYPE.CTRL_TEXT_EX,name:'textTotalBet', res: "textTotalBet",str:'common_autoSpin_label_Totalbet', fontname: 'NotoSans-R', bmulline: false, outline: {color: cc.color(0x3c, 0x5a, 0x5c), size: 2 }},
            {type:COMMON_CTRL_TYPE.CTRL_TEXT_EX,name:'textWin', res: "textWin",str:'common_history_label_win', fontname: 'NotoSans-R', bmulline: false, outline: {color: cc.color(0x3c, 0x5a, 0x5c), size: 2 }},
            {type:COMMON_CTRL_TYPE.CTRL_TEXT_EX,name:'textBalance', res: "textBalance",str:'common_autoSpin_label_Balance', fontname: 'NotoSans-R', bmulline: false, outline: {color: cc.color(0x3c, 0x5a, 0x5c), size: 2 }},
            {type:COMMON_CTRL_TYPE.CTRL_TEXT_EX,name:'textTotalWin', res: "textFreeAll",str:'ui_label_totalWin', fontname: 'NotoSans-R', bmulline: false, outline: {color: cc.color(0x3c, 0x5a, 0x5c), size: 2 }},
            {type:COMMON_CTRL_TYPE.CTRL_TEXT_EX,name:'textFreeGame', res: "textFreeNum",str:'ui_label_freeSpins', fontname: 'NotoSans-R', bmulline: false, outline: {color: cc.color(0x3c, 0x5a, 0x5c), size: 2 }},

            // textex
            { type: COMMON_CTRL_TYPE.CTRL_TEXT_EX, name: 'numBet', res: "numBet", bmulline: false, str: "30" },
            { type: COMMON_CTRL_TYPE.CTRL_TEXT_EX, name: 'numTotalBet', res: "numTotalBet", bmulline: false, str: 0 },
            { type: COMMON_CTRL_TYPE.CTRL_TEXT_EX, name: "numCoinValue", res: "numCoinValue", bmulline: false, str: 0 },
            { type: COMMON_CTRL_TYPE.CTRL_TEXT_EX, name: "numWin", res: "numWin", bmulline: false, str: 0, defaulthide: true},
            { type: COMMON_CTRL_TYPE.CTRL_TEXT_EX, name: "numBalance", res: "numBalance", defaulthide: true, bmulline: false, str: 0 },
            { type: COMMON_CTRL_TYPE.CTRL_TEXT_EX, name: "textFreeNum", res: "numFreeNum", bmulline: false, str: 0 },
            { type: COMMON_CTRL_TYPE.CTRL_TEXT_EX, name: "textFreeTotalWin", res: "numFreeAll", bmulline: false, str: 0 },
            { type: COMMON_CTRL_TYPE.CTRL_TEXT_BMFONT_EX, name: "numWinAni", res: "txt_win_num", str: 0 },
            { type: COMMON_CTRL_TYPE.CTRL_TEXT_BMFONT_EX, name: "numAuto", res: "numAutoNum", str: 0, defaulthide: true },

            // button
            { type: COMMON_CTRL_TYPE.CTRL_BUTTON, name: "btnCoinValueDec", btnname: "btnCoinValueDec", areaname: "areaCoinValueDec" },
            { type: COMMON_CTRL_TYPE.CTRL_BUTTON, name: "btnCoinValueAdd", btnname: "btnCoinValueAdd", areaname: "areaCoinValueAdd" },
            { type: COMMON_CTRL_TYPE.CTRL_BUTTON, name:'areaCoinCash1', areaname:'areaCoinCash1',callfunc:this._onTouchCoinCash,target:this},
            { type: COMMON_CTRL_TYPE.CTRL_BUTTON, name:'areaCoinCash2', areaname:'areaCoinCash2',callfunc:this._onTouchCoinCash,target:this},
            { type: COMMON_CTRL_TYPE.CTRL_BUTTON, name:'areaCoinCash3', areaname:'areaCoinCash3',callfunc:this._onTouchCoinCash,target:this},
            { type: COMMON_CTRL_TYPE.CTRL_BUTTON, name: "btnMaxBet", btnname: "btnMax", areaname: "areaBtnMax", callfunc: this._onTouchMaxBet, target: this, lstbtnname: ["btnMaxBack"] },
            { type: COMMON_CTRL_TYPE.CTRL_BUTTON, name: 'btnBet', btnname: 'btnBet', areaname: "areaBtnBet", callfunc:this._onTouchBet, target:this, lstbtnname:['btnBetBack']},
            { type: COMMON_CTRL_TYPE.CTRL_BUTTON, name: "btnAutoStop", btnname: "btnAutoStop", areaname: "areaBtnAutoStop", callfunc: this._onTouchAutoStop, target: this, lstbtnname: ["btnAutoStopBack"] },
            { type: COMMON_CTRL_TYPE.CTRL_BUTTON, name: "btnAuto", btnname: "btnAuto", areaname: "areaBtnAuto", callfunc: this._onTouchAuto, target: this, lstbtnname: ["btnAutoBack"] },
            { type: COMMON_CTRL_TYPE.CTRL_BUTTON, name: "btnRun", btnname: "btnRun", areaname: "areaBtnRun", callfunc: this._onTouchRun, target: this, lstbtnname: ["btnRunBack"] },
            { type: COMMON_CTRL_TYPE.CTRL_BUTTON, name: "btnStop", btnname: "btnStop", areaname: "areaBtnStop", callfunc: this._onTouchStop, target: this, lstbtnname: ["btnStopBack"] },
            { type: COMMON_CTRL_TYPE.CTRL_BUTTON, name: "btnMenu", btnname: "btnMenu", callfunc: this._onTouchMenu, target: this },

            { type: COMMON_CTRL_TYPE.CTRL_TEXT_GROUP, name: "textUIGroup", lsttextgroup: ["textBet", "textCoinValue", "textTotalBet", "textWin", "textBalance"] },
            { type: COMMON_CTRL_TYPE.CTRL_TEXT_GROUP, name: "textUIFreeGroup", lsttextgroup: ["textTotalWin", "textFreeGame"] },

            // sliderex
            {
                type: COMMON_CTRL_TYPE.CTRL_SLIDER_EX,
                name: 'slidCoinValue',
                btndec: 'btnCoinValueDec',
                btnadd: 'btnCoinValueAdd',
                lstpertext: [],
                lstsvaluetext: ['numCoinValue'],
                lstsindextext: [],
                bshowmin: true,
                callfunc: this._onChgCoinValue,
                target: this
            },

            // armature
            { type: COMMON_CTRL_TYPE.CTRL_ARMATURE, name: "aniWin1", res: "ctrlWinAni1" },
            { type: COMMON_CTRL_TYPE.CTRL_ARMATURE, name: "aniWin2", res: "ctrlWinAni2" },
            { type: COMMON_CTRL_TYPE.CTRL_ARMATURE, name: "aniWin3", res: "ctrlWinAni3" },
            { type: COMMON_CTRL_TYPE.CTRL_ARMATURE, name: "aniFreeAni", res: "aniFreeAniCtrl", aniname: "mianfeiyouxi", aniloop: false, defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_ARMATURE, name: "aniCtrlRun", aniname: "xuanzhuan", aniloop: false, defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_ARMATURE, name: "aniBetaChgScene", res: "aniBetaChgScene" },
            { type: COMMON_CTRL_TYPE.CTRL_ARMATURE, name: "aniFGSelectChgScene", res: "aniFGSelectChgScene" },

            // action
            { type: COMMON_CTRL_TYPE.CTRL_ACTION, name: "actBtnRun", res: "btnRun" },
            { type: COMMON_CTRL_TYPE.CTRL_ACTION, name: "actNumWin", res: "numWin" },
            { type: COMMON_CTRL_TYPE.CTRL_ACTION, name: "actFreeNum", res: "textFreeNum" },
            { type: COMMON_CTRL_TYPE.CTRL_ACTION, name: "actFreeTotalWin", res: "textFreeTotalWin" },
            { type: COMMON_CTRL_TYPE.CTRL_ACTION, name: "actNumAuto", res: "numAuto" },

            // virtual
            { type: COMMON_CTRL_TYPE.CTRL_VIRTUAL, name: 'virWin', defaulthide: true },
            { type: COMMON_CTRL_TYPE.CTRL_VIRTUAL, name: 'virRun', defaulthide: true },
        ];

        // bcash 是否现金，默认fasel,bseparator千位分隔符，默认fasle,decimalnums小数个数，默认0
        // bcash 为true，会默认分隔符，默认两位小数点
        this.txtstyledata = {
            numWinAni: {bseparator: true},
            numWin: {bcash: true},
            numTotalWin: {bcash: true},
            numAuto: {},
            numBalance: {bcash: true, bseparator: true},
            numBet: {},
            numTotalBet: {bcash: true},
            textFreeTotalWin: {bcash: true},
            textFreeGameNums: {}
        };

        this.windata = {
            rootname: "nodeWinAni",
            resname: "resWinAni",
            numname: "numWinAni",
            lstnumani: ["begin", "end", "loop"],
            lstani: [
                { name: "aniWin", lstaniname: ["big1", "big2", "big3"] },
                { name: "aniWin", lstaniname: ["super1", "super2", "super3"] },
                { name: "aniWin", lstaniname: ["mega1", "mega2", "mega3"] },
            ],
            lstEffect: {
                addurl : res.ElementalAddMoney_mp3
            }
        };

        //! 状态数据：数组 show显示 hide隐藏 enable可用 disable禁用
        //! ani动画（name控件名 ani动画名 bloop是否循环（或者data数据）） oain其他动画（仅改变效果，不影响判断的动画，参数和ani一致）
        //! next后续状态（特定时间或者动画全部播放完之后切换） time状态持续时间 lock如果为true则必须播放完才能被替换
        //! opacity透明度（name控件名 value数值） color颜色（name控件名 value颜色值cc.color）

        //! 自动相关 0没有进入自动 1自动中
        this.autostatedata = {
            0: {
                show: ["btnAuto", "btnRun"],
                hide: ["btnAutoStop"],
                enable: ["btnRun", "btnMaxBet", "btnBet", "slidCoinValue", "btnAuto", "btnMenu"],
                disable: ["btnAutoStop"]
            },

            1: {
                show: ["btnAutoStop"],
                hide: ["btnAuto"],
                enable: ["btnAutoStop"],
                disable: ["btnRun", "slidCoinValue", "btnMaxBet", "btnBet", "btnAuto", "btnMenu"]
            }
        };

        //! 游戏运行相关 0没有运行 1运行中不可停止状态， 2，运行中可停止， 3、点击快速停止后
        this.runstatedata = {
            0: {
                show: ["btnRun", "btnAuto", "btnMax", "slidCoinValue"],
                hide: ["btnStop", "aniCtrlRun"],
                enable: ["btnRun", "btnMaxBet", "btnBet", "slidCoinValue", "btnAuto", "btnCoinValueAdd", "btnCoinValueDec", "btnMenu"],
                disable: ["btnStop"]
            },

            1: {
                show: ["aniCtrlRun", "btnStop"],
                hide: ["btnRun"],
                disable: ["btnRun", "btnStop", "btnMaxBet", "btnBet", "btnAuto", "slidCoinValue", "btnCoinValueAdd", "btnCoinValueDec", "btnMenu"],
                ani: [
                    {
                        name: "aniCtrlRun", ani: "xuanzhuan", bloop: false
                    },
                    // {
                    //     name: "actBtnRun", ani: "delayTime", data: { time: 0.5 }
                    // }
                ],
                next: 2,
            },

            2: {
                show: ["btnStop"],
                hide: ["btnRun"],
                disable: ["btnStop", "btnMaxBet", "btnBet", "btnAuto", "slidCoinValue", "btnCoinValueAdd", "btnCoinValueDec", "btnMenu"]
            },

            3: {
                show: ["btnStop"],
                hide: ["btnRun"],
                enable: ["btnStop"],
                disable: ["btnMaxBet", "btnBet", "btnAuto", "slidCoinValue", "btnCoinValueAdd", "btnCoinValueDec", "btnMenu"]
            },

            4: {
                show: ["btnRun"],
                hide: ["btnStop"],
                disable: ["btnRun", "btnStop", "btnMaxBet", "btnBet", "btnAuto", "slidCoinValue", "btnCoinValueAdd", "btnCoinValueDec", "btnMenu"]
            },
        };

        // 游戏运行虚拟节点相关
        this.virRunStateData = {
            0: {
                hide: ["virRun"],
                enable: ["btnRun", "slidCoinValue", "btnMaxBet", "btnBet", "btnCoinValueAdd", "btnCoinValueDec", "btnAuto", "btnMenu"]
            },

            1: {
                show: ["virRun"],
                disable: ["btnRun", "slidCoinValue", "btnMaxBet", "btnBet", "btnCoinValueAdd", "btnCoinValueDec", "btnAuto", "btnMenu"]
            }
        };

        this.virFreeStateData = {
            0: {},
            1: {}
        };

        this.freeStateData = {
            0: {
                enable: ["slidCoinValue", "btnMenu"]
            },

            1: {
                disable: ["slidCoinValue", "btnMenu"]
            }
        };

        this.bgSpineAniState = {
            0: {
                ani: [
                    { name: "spineFGFire", ani: "daiji", data: true },
                    { name: "spineFGSoil", ani: "daiji", data: true },
                    { name: "spineFGWind", ani: "daiji", data: true },
                    { name: "spineFGWater", ani: "daiji", data: true },
                    { name: "spineBGHuabanLeft", ani: "huaban_zuo", data: true },
                    { name: "spineBGHuabanRight", ani: "huaban_you", data: true },
                    { name: "spineBGHuazhiLeft", ani: "huazhi_zuo", data: true },
                    { name: "spineBGHuazhiRight", ani: "huazhi_you", data: true },
                    { name: "spineFGWindLiushuLeft", ani: "liushu_zuo", data: true },
                    { name: "spineFGWindLiushuRight", ani: "liushu_you", data: true },
                    { name: "spineFGWaterZhuziLeft", ani: "zhuzi_zuo", data: true },
                    { name: "spineFGWaterZhuziRight", ani: "zhuzi_you", data: true },
                    { name: "spineFGSelectHuabanLeft", ani: "huaban_zuo", data: true },
                    { name: "spineFGSelectHuabanRight", ani: "huaban_you", data: true },
                    { name: "spineFGSelectHuazhiLeft", ani: "huazhi_zuo", data: true },
                    { name: "spineFGSelectHuazhiRight", ani: "huazhi_you", data: true },
                    { name: "spineFGFireFengyeLeft", ani: "fengye_zuo", data: true },
                    { name: "spineFGFireFengyeRight", ani: "fengye_you", data: true },
                    { name: "spineFGFireYeLeft", ani: "ye_zuo", data: true },
                    { name: "spineFGFireYeRight", ani: "ye_you", data: true },
                ]
            }
        };

        //! 免费UI相关 0没有进入免费 1: 免费游戏-火 2：免费游戏-土 3：免费游戏-风 4：免费游戏-水
        //! 5: 试玩版公主转-火 6: 试玩版公主转-土 7: 试玩版公主转-风 8: 试玩版公主转-水
        this.freeUIStateData = {
            0: {
                show: ["nodeBG", "nodeBGSpin", "spineFGWind", "nodeSpineBGLeft", "nodeSpineBGRight"],
                hide: ["nodeFG1", "nodeFG2", "nodeFG3", "nodeFG4", "nodeFGSpin", "nodeCollectFire", "resCollectFire", "nodeCollectWind", "resCollectWind", "nodeFGSpineWind", "spineFGWind", "nodeFGSpineSoil", "spineFGSoil", "nodeFGSpineFire", "spineFGFire", "nodeFGSpineWater", "spineFGWater", "nodeSpineFGFireLeft", "nodeSpineFGFireRight", "nodeSpineFGSoilLeft", "nodeSpineFGSoilRight", "nodeSpineFGWindLeft", "nodeSpineFGWindRight", "nodeSpineFGWaterLeft", "nodeSpineFGWaterRight"],
                opacity: [
                    { name: "nodeBg", value: 255 },
                    { name: "nodeFG1", value: 255 },
                    { name: "nodeFG2", value: 255 },
                    { name: "nodeFG3", value: 255 },
                    { name: "nodeFG4", value: 255 },
                    { name: "resCollectFire", value: 255 },
                    { name: "nodeFGSpineWind", value: 255 },
                    { name: "nodeFGSpineSoil", value: 255 },
                    { name: "nodeFGSpineFire", value: 255 },
                    { name: "nodeFGSpineWater", value: 255 },
                    { name: "spineFGWind", value: 255 },
                    { name: "spineFGSoil", value: 255 },
                    { name: "spineFGFire", value: 255 },
                    { name: "nodeFGSpineWater", value: 255 },
                    { name: "nodeSpineBGLeft", value: 255 },
                    { name: "nodeSpineBGRight", value: 255 },
                    { name: "nodeSpineFGFireLeft", value: 255 },
                    { name: "nodeSpineFGFireRight", value: 255 },
                    { name: "nodeSpineFGSoilLeft", value: 255 },
                    { name: "nodeSpineFGSoilRight", value: 255 },
                    { name: "nodeSpineFGWindLeft", value: 255 },
                    { name: "nodeSpineFGWindRight", value: 255 },
                    { name: "nodeSpineFGWaterLeft", value: 255 },
                    { name: "nodeSpineFGWaterRight", value: 255 }
                ]
            },

            1: {
                show: ["nodeFG3", "nodeFGSpin", "nodeCollectFire", "resCollectFire", "nodeFGSpineFire", "spineFGFire", "nodeSpineFGFireLeft", "nodeSpineFGFireRight"],
                hide: ["nodeBG", "nodeFG1", "nodeFG2", "nodeFG4", "nodeBGSpin", "nodeFGSpineSoil", "nodeFGSpineWind", "nodeFGSpineWater", "spineFGSoil", "spineFGWind", "spineFGWater", "nodeCollectWind", "resCollectWind", "nodeSpineBGLeft", "nodeSpineBGRight", "nodeSpineFGSoilLeft", "nodeSpineFGSoilRight", "nodeSpineFGWindLeft", "nodeSpineFGWindRight", "nodeSpineFGWaterLeft", "nodeSpineFGWaterRight"],
                opacity: [
                    { name: "nodeBg", value: 255 },
                    { name: "nodeFG1", value: 255 },
                    { name: "nodeFG2", value: 255 },
                    { name: "nodeFG3", value: 255 },
                    { name: "nodeFG4", value: 255 },
                    { name: "resCollectFire", value: 255 },
                    { name: "nodeFGSpineWind", value: 255 },
                    { name: "nodeFGSpineSoil", value: 255 },
                    { name: "nodeFGSpineFire", value: 255 },
                    { name: "nodeFGSpineWater", value: 255 },
                    { name: "spineFGWind", value: 255 },
                    { name: "spineFGSoil", value: 255 },
                    { name: "spineFGFire", value: 255 },
                    { name: "spineFGWater", value: 255 },
                    { name: "nodeSpineBGLeft", value: 255 },
                    { name: "nodeSpineBGRight", value: 255 },
                    { name: "nodeSpineFGFireLeft", value: 255 },
                    { name: "nodeSpineFGFireRight", value: 255 },
                    { name: "nodeSpineFGSoilLeft", value: 255 },
                    { name: "nodeSpineFGSoilRight", value: 255 },
                    { name: "nodeSpineFGWindLeft", value: 255 },
                    { name: "nodeSpineFGWindRight", value: 255 },
                    { name: "nodeSpineFGWaterLeft", value: 255 },
                    { name: "nodeSpineFGWaterRight", value: 255 }
                ]
            },

            2: {
                show: ["nodeFG1", "nodeFGSpin", "nodeFGSpineSoil", "spineFGSoil", "nodeSpineFGSoilLeft", "nodeSpineFGSoilRight"],
                hide: ["nodeBG", "nodeFG2", "nodeFG3", "nodeFG4", "nodeBGSpin", "nodeCollectFire", "nodeCollectWind", "resCollectFire", "resCollectWind", "nodeFGSpineFire", "nodeFGSpineWind", "nodeFGSpineWater", "spineFGFire", "spineFGWind", "spineFGWater", "nodeSpineFGFireLeft", "nodeSpineFGFireRight", "nodeSpineBGLeft", "nodeSpineBGRight", "nodeSpineFGWindLeft", "nodeSpineFGWindRight", "nodeSpineFGWaterLeft", "nodeSpineFGWaterRight"],
                opacity: [
                    { name: "nodeBg", value: 255 },
                    { name: "nodeFG1", value: 255 },
                    { name: "nodeFG2", value: 255 },
                    { name: "nodeFG3", value: 255 },
                    { name: "nodeFG4", value: 255 },
                    { name: "resCollectFire", value: 255 },
                    { name: "nodeFGSpineWind", value: 255 },
                    { name: "nodeFGSpineSoil", value: 255 },
                    { name: "nodeFGSpineFire", value: 255 },
                    { name: "nodeFGSpineWater", value: 255 },
                    { name: "spineFGWind", value: 255 },
                    { name: "spineFGSoil", value: 255 },
                    { name: "spineFGFire", value: 255 },
                    { name: "spineFGWater", value: 255 },
                    { name: "nodeSpineBGLeft", value: 255 },
                    { name: "nodeSpineBGRight", value: 255 },
                    { name: "nodeSpineFGFireLeft", value: 255 },
                    { name: "nodeSpineFGFireRight", value: 255 },
                    { name: "nodeSpineFGSoilLeft", value: 255 },
                    { name: "nodeSpineFGSoilRight", value: 255 },
                    { name: "nodeSpineFGWindLeft", value: 255 },
                    { name: "nodeSpineFGWindRight", value: 255 },
                    { name: "nodeSpineFGWaterLeft", value: 255 },
                    { name: "nodeSpineFGWaterRight", value: 255 }
                ]
            },

            3: {
                show: ["nodeFG4", "nodeFGSpin", "nodeCollectWind", "resCollectWind", "nodeFGSpineWind", "spineFGWind", "nodeSpineFGWindLeft", "nodeSpineFGWindRight"],
                hide: ["nodeBG", "nodeFG1", "nodeFG2", "nodeFG3", "nodeBGSpin", "nodeCollectFire", "resCollectFire", "nodeFGSpineSoil", "nodeFGSpineFire", "nodeFGSpineWater", "spineFGSoil", "spineFGFire", "spineFGWater", "nodeSpineFGFireLeft", "nodeSpineFGFireRight", "nodeSpineFGSoilLeft", "nodeSpineFGSoilRight", "nodeSpineBGLeft", "nodeSpineBGRight", "nodeSpineFGWaterLeft", "nodeSpineFGWaterRight"],
                opacity: [
                    { name: "nodeBg", value: 255 },
                    { name: "nodeFG1", value: 255 },
                    { name: "nodeFG2", value: 255 },
                    { name: "nodeFG3", value: 255 },
                    { name: "nodeFG4", value: 255 },
                    { name: "resCollectFire", value: 255 },
                    { name: "nodeFGSpineWind", value: 255 },
                    { name: "nodeFGSpineSoil", value: 255 },
                    { name: "nodeFGSpineFire", value: 255 },
                    { name: "nodeFGSpineWater", value: 255 },
                    { name: "spineFGWind", value: 255 },
                    { name: "spineFGSoil", value: 255 },
                    { name: "spineFGFire", value: 255 },
                    { name: "spineFGWater", value: 255 },
                    { name: "nodeSpineBGLeft", value: 255 },
                    { name: "nodeSpineBGRight", value: 255 },
                    { name: "nodeSpineFGFireLeft", value: 255 },
                    { name: "nodeSpineFGFireRight", value: 255 },
                    { name: "nodeSpineFGSoilLeft", value: 255 },
                    { name: "nodeSpineFGSoilRight", value: 255 },
                    { name: "nodeSpineFGWindLeft", value: 255 },
                    { name: "nodeSpineFGWindRight", value: 255 },
                    { name: "nodeSpineFGWaterLeft", value: 255 },
                    { name: "nodeSpineFGWaterRight", value: 255 }
                ]
            },

            4: {
                show: ["nodeFG2", "nodeFGSpin", "nodeFGSpineWater", "spineFGWater", "nodeSpineFGWaterLeft", "nodeSpineFGWaterRight"],
                hide: ["nodeBG", "nodeFG1", "nodeFG3", "nodeFG4", "nodeBGSpin", "nodeCollectFire", "nodeCollectWind", "resCollectFire", "resCollectWind", "nodeFGSpineSoil", "nodeFGSpineWind", "nodeFGSpineFire", "spineFGSoil", "spineFGWind", "spineFGFire", "nodeSpineFGFireLeft", "nodeSpineFGFireRight", "nodeSpineFGSoilLeft", "nodeSpineFGSoilRight", "nodeSpineFGWindLeft", "nodeSpineFGWindRight", "nodeSpineBGLeft", "nodeSpineBGRight"],
                opacity: [
                    { name: "nodeBg", value: 255 },
                    { name: "nodeFG1", value: 255 },
                    { name: "nodeFG2", value: 255 },
                    { name: "nodeFG3", value: 255 },
                    { name: "nodeFG4", value: 255 },
                    { name: "resCollectFire", value: 255 },
                    { name: "nodeFGSpineWind", value: 255 },
                    { name: "nodeFGSpineSoil", value: 255 },
                    { name: "nodeFGSpineFire", value: 255 },
                    { name: "nodeFGSpineWater", value: 255 },
                    { name: "spineFGWind", value: 255 },
                    { name: "spineFGSoil", value: 255 },
                    { name: "spineFGFire", value: 255 },
                    { name: "spineFGWater", value: 255 },
                    { name: "nodeSpineBGLeft", value: 255 },
                    { name: "nodeSpineBGRight", value: 255 },
                    { name: "nodeSpineFGFireLeft", value: 255 },
                    { name: "nodeSpineFGFireRight", value: 255 },
                    { name: "nodeSpineFGSoilLeft", value: 255 },
                    { name: "nodeSpineFGSoilRight", value: 255 },
                    { name: "nodeSpineFGWindLeft", value: 255 },
                    { name: "nodeSpineFGWindRight", value: 255 },
                    { name: "nodeSpineFGWaterLeft", value: 255 },
                    { name: "nodeSpineFGWaterRight", value: 255 }
                ]
            },

            5: {
                show: ["nodeBGSpin", "nodeFG3", "nodeCollectFire", "resCollectFire", "nodeFGSpineFire", "spineFGFire", "nodeSpineFGFireLeft", "nodeSpineFGFireRight"],
                hide: ["nodeBG", "nodeFG1", "nodeFG2", "nodeFG4", "nodeFGSpin", "nodeFGSpineSoil", "nodeFGSpineWind", "nodeFGSpineWater", "spineFGSoil", "spineFGWind", "spineFGWater", "nodeCollectWind", "resCollectWind", "nodeSpineBGLeft", "nodeSpineBGRight", "nodeSpineFGSoilLeft", "nodeSpineFGSoilRight", "nodeSpineFGWindLeft", "nodeSpineFGWindRight", "nodeSpineFGWaterLeft", "nodeSpineFGWaterRight"],
                opacity: [
                    { name: "nodeBg", value: 255 },
                    { name: "nodeFG1", value: 255 },
                    { name: "nodeFG2", value: 255 },
                    { name: "nodeFG3", value: 255 },
                    { name: "nodeFG4", value: 255 },
                    { name: "resCollectFire", value: 255 },
                    { name: "nodeFGSpineWind", value: 255 },
                    { name: "nodeFGSpineSoil", value: 255 },
                    { name: "nodeFGSpineFire", value: 255 },
                    { name: "nodeFGSpineWater", value: 255 },
                    { name: "spineFGWind", value: 255 },
                    { name: "spineFGSoil", value: 255 },
                    { name: "spineFGFire", value: 255 },
                    { name: "spineFGWater", value: 255 },
                    { name: "nodeSpineBGLeft", value: 255 },
                    { name: "nodeSpineBGRight", value: 255 },
                    { name: "nodeSpineFGFireLeft", value: 255 },
                    { name: "nodeSpineFGFireRight", value: 255 },
                    { name: "nodeSpineFGSoilLeft", value: 255 },
                    { name: "nodeSpineFGSoilRight", value: 255 },
                    { name: "nodeSpineFGWindLeft", value: 255 },
                    { name: "nodeSpineFGWindRight", value: 255 },
                    { name: "nodeSpineFGWaterLeft", value: 255 },
                    { name: "nodeSpineFGWaterRight", value: 255 }
                ]
            },

            6: {
                show: ["nodeBGSpin", "nodeFG1", "nodeFGSpineSoil", "spineFGSoil", "nodeSpineFGSoilLeft", "nodeSpineFGSoilRight"],
                hide: ["nodeBG", "nodeFG2", "nodeFG3", "nodeFG4", "nodeFGSpin", "nodeCollectFire", "resCollectFire", "nodeCollectWind", "resCollectWind", "nodeFGSpineFire", "nodeFGSpineWind", "nodeFGSpineWater", "spineFGFire", "spineFGWind", "spineFGWater", "nodeSpineFGFireLeft", "nodeSpineFGFireRight", "nodeSpineBGLeft", "nodeSpineBGRight", "nodeSpineFGWindLeft", "nodeSpineFGWindRight", "nodeSpineFGWaterLeft", "nodeSpineFGWaterRight"],
                opacity: [
                    { name: "nodeBg", value: 255 },
                    { name: "nodeFG1", value: 255 },
                    { name: "nodeFG2", value: 255 },
                    { name: "nodeFG3", value: 255 },
                    { name: "nodeFG4", value: 255 },
                    { name: "resCollectFire", value: 255 },
                    { name: "nodeFGSpineWind", value: 255 },
                    { name: "nodeFGSpineSoil", value: 255 },
                    { name: "nodeFGSpineFire", value: 255 },
                    { name: "nodeFGSpineWater", value: 255 },
                    { name: "spineFGWind", value: 255 },
                    { name: "spineFGSoil", value: 255 },
                    { name: "spineFGFire", value: 255 },
                    { name: "spineFGWater", value: 255 },
                    { name: "nodeSpineBGLeft", value: 255 },
                    { name: "nodeSpineBGRight", value: 255 },
                    { name: "nodeSpineFGFireLeft", value: 255 },
                    { name: "nodeSpineFGFireRight", value: 255 },
                    { name: "nodeSpineFGSoilLeft", value: 255 },
                    { name: "nodeSpineFGSoilRight", value: 255 },
                    { name: "nodeSpineFGWindLeft", value: 255 },
                    { name: "nodeSpineFGWindRight", value: 255 },
                    { name: "nodeSpineFGWaterLeft", value: 255 },
                    { name: "nodeSpineFGWaterRight", value: 255 }
                ]
            },

            7: {
                show: ["nodeBGSpin", "nodeFG4", "nodeFGSpineWind", "spineFGWind", "nodeSpineFGWindLeft", "nodeSpineFGWindRight"],
                hide: ["nodeBG", "nodeFG1", "nodeFG2", "nodeFG3", "nodeFGSpin", "nodeCollectFire", "resCollectFire", "nodeCollectWind", "resCollectWind", "nodeFGSpineSoil", "nodeFGSpineFire", "nodeFGSpineWater", "spineFGSoil", "spineFGFire", "spineFGWater", "nodeSpineFGFireLeft", "nodeSpineFGFireRight", "nodeSpineFGSoilLeft", "nodeSpineFGSoilRight", "nodeSpineBGLeft", "nodeSpineBGRight", "nodeSpineFGWaterLeft", "nodeSpineFGWaterRight"],
                opacity: [
                    { name: "nodeBg", value: 255 },
                    { name: "nodeFG1", value: 255 },
                    { name: "nodeFG2", value: 255 },
                    { name: "nodeFG3", value: 255 },
                    { name: "nodeFG4", value: 255 },
                    { name: "resCollectFire", value: 255 },
                    { name: "nodeFGSpineWind", value: 255 },
                    { name: "nodeFGSpineSoil", value: 255 },
                    { name: "nodeFGSpineFire", value: 255 },
                    { name: "nodeFGSpineWater", value: 255 },
                    { name: "spineFGWind", value: 255 },
                    { name: "spineFGSoil", value: 255 },
                    { name: "spineFGFire", value: 255 },
                    { name: "spineFGWater", value: 255 },
                    { name: "nodeSpineBGLeft", value: 255 },
                    { name: "nodeSpineBGRight", value: 255 },
                    { name: "nodeSpineFGFireLeft", value: 255 },
                    { name: "nodeSpineFGFireRight", value: 255 },
                    { name: "nodeSpineFGSoilLeft", value: 255 },
                    { name: "nodeSpineFGSoilRight", value: 255 },
                    { name: "nodeSpineFGWindLeft", value: 255 },
                    { name: "nodeSpineFGWindRight", value: 255 },
                    { name: "nodeSpineFGWaterLeft", value: 255 },
                    { name: "nodeSpineFGWaterRight", value: 255 }
                ]
            },

            8: {
                show: ["nodeBGSpin", "nodeFG2", "nodeFGSpineWater", "spineFGWater", "nodeSpineFGWaterLeft", "nodeSpineFGWaterRight"],
                hide: ["nodeBG", "nodeFG1", "nodeFG3", "nodeFG4", "nodeFGSpin", "nodeCollectFire", "resCollectFire", "nodeCollectWind", "resCollectWind", "nodeFGSpineSoil", "nodeFGSpineWind", "nodeFGSpineFire", "spineFGSoil", "spineFGWind", "spineFGFire", "nodeSpineFGFireLeft", "nodeSpineFGFireRight", "nodeSpineFGSoilLeft", "nodeSpineFGSoilRight", "nodeSpineFGWindLeft", "nodeSpineFGWindRight", "nodeSpineBGLeft", "nodeSpineBGRight"],
                opacity: [
                    { name: "nodeBg", value: 255 },
                    { name: "nodeFG1", value: 255 },
                    { name: "nodeFG2", value: 255 },
                    { name: "nodeFG3", value: 255 },
                    { name: "nodeFG4", value: 255 },
                    { name: "resCollectFire", value: 255 },
                    { name: "nodeFGSpineWind", value: 255 },
                    { name: "nodeFGSpineSoil", value: 255 },
                    { name: "nodeFGSpineFire", value: 255 },
                    { name: "nodeFGSpineWater", value: 255 },
                    { name: "spineFGWind", value: 255 },
                    { name: "spineFGSoil", value: 255 },
                    { name: "spineFGFire", value: 255 },
                    { name: "spineFGWater", value: 255 },
                    { name: "nodeSpineBGLeft", value: 255 },
                    { name: "nodeSpineBGRight", value: 255 },
                    { name: "nodeSpineFGFireLeft", value: 255 },
                    { name: "nodeSpineFGFireRight", value: 255 },
                    { name: "nodeSpineFGSoilLeft", value: 255 },
                    { name: "nodeSpineFGSoilRight", value: 255 },
                    { name: "nodeSpineFGWindLeft", value: 255 },
                    { name: "nodeSpineFGWindRight", value: 255 },
                    { name: "nodeSpineFGWaterLeft", value: 255 },
                    { name: "nodeSpineFGWaterRight", value: 255 }
                ]
            },

            9: {
                show: ["nodeBG", "nodeBGSpin"],
                hide: ["nodeFGSpin", "nodeCollectWind", "resCollectWind"]
            },

            // 火
            10: {
                show: ["nodeBGSpin", "nodeFG3", "nodeCollectFire", "resCollectFire", "nodeFGSpineFire", "spineFGFire", "nodeSpineFGFireLeft", "nodeSpineFGFireRight"],
                hide: ["nodeFGSpin", "nodeCollectWind", "resCollectWind", "nodeFGSpineSoil", "nodeFGSpineWind", "nodeFGSpineWater", "spineFGWind", "spineFGSoil", "spineFGWater", "nodeSpineBGLeft", "nodeSpineBGRight", "nodeSpineFGSoilLeft", "nodeSpineFGSoilRight", "nodeSpineFGWindLeft", "nodeSpineFGWindRight", "nodeSpineFGWaterLeft", "nodeSpineFGWaterRight"],
            },

            // 土
            11: {
                show: ["nodeBGSpin", "nodeFG1", "nodeFGSpineSoil", "spineFGSoil", "nodeSpineFGSoilLeft", "nodeSpineFGSoilRight"],
                hide: ["nodeFGSpin", "nodeCollectWind", "resCollectWind", "nodeCollectFire", "resCollectFire", "nodeFGSpineFire", "nodeFGSpineWind", "nodeFGSpineWater", "spineFGWind", "spineFGFire", "spineFGWater", "nodeSpineFGFireLeft", "nodeSpineFGFireRight", "nodeSpineBGLeft", "nodeSpineBGRight", "nodeSpineFGWindLeft", "nodeSpineFGWindRight", "nodeSpineFGWaterLeft", "nodeSpineFGWaterRight"],
            },

            // 风
            12: {
                show: ["nodeBGSpin", "nodeFG4", "nodeFGSpineWind", "spineFGWind", "nodeSpineFGWindLeft", "nodeSpineFGWindRight"],
                hide: ["nodeFGSpin", "nodeCollectWind", "resCollectWind", "nodeCollectFire", "resCollectFire", "nodeFGSpineSoil", "nodeFGSpineFire", "nodeFGSpineWater", "spineFGSoil", "spineFGFire", "spineFGWater", "nodeSpineFGFireLeft", "nodeSpineFGFireRight", "nodeSpineFGSoilLeft", "nodeSpineFGSoilRight", "nodeSpineBGLeft", "nodeSpineBGRight", "nodeSpineFGWaterLeft", "nodeSpineFGWaterRight"],
            },

            // 水
            13: {
                show: ["nodeBGSpin", "nodeFG2", "nodeFGSpineWater", "spineFGWater", "nodeSpineFGWaterLeft", "nodeSpineFGWaterRight"],
                hide: ["nodeFGSpin", "nodeCollectWind", "resCollectWind", "nodeCollectFire", "resCollectFire", "nodeFGSpineSoil", "nodeFGSpineWind", "nodeFGSpineFire", "spineFGWind", "spineFGSoil", "spineFGFire", "nodeSpineFGFireLeft", "nodeSpineFGFireRight", "nodeSpineFGSoilLeft", "nodeSpineFGSoilRight", "nodeSpineFGWindLeft", "nodeSpineFGWindRight", "nodeSpineBGLeft", "nodeSpineBGRight"],
            },
        };

        //! 胜利动画相关 0没有显示 1开始显示 2普通结束 3开始Big 4循环Big 5结束Big 6开始Super 7循环Super 8结束Super 9开始Mega 10循环Mega 11结束Mega
        this.winanistatedata = {
            0: {
                hide: ["nodeWinAni", "virWin", "aniWin1", "aniWin2", "aniWin3", "layElements", "layDisable", "resWinAni"],
                enable: ["btnMenu"]
            },

            1: {
                show: ["numWin", "numWinAni", "layElements", "nodeWinAni", "virWin", "resWinAni", "layDisable"],
                hide: ["aniWin1", "aniWin2", "aniWin3"],
                ani: [
                    { name: "resWinAni", ani: "begin", bloop: false}
                ],
                effect: [{url: res.ElementalEffWin1_mp3, bloop: false }]
            },

            2: {
                hide: ["virWin", "aniWin1", "aniWin2", "aniWin3", "layDisable"],
                ani: [ { name: "resWinAni", ani: "end", bloop: false } ],
                next: 0
            },

            3: {
                show: ["aniWin1"],
                hide: ["aniWin2", "aniWin3"],
                ani: [
                    { name: "resWinAni", ani: "loop", bloop: true },
                    { name: "aniWin1", ani: "big1", bloop: false },
                ],
                next: 4,
                effect: [{url: res.ElementalEffWin2_mp3, bloop: false }],
                lock: false
            },

            4: {
                show: ["aniWin1"],
                hide: ["aniWin2", "aniWin3"],
                ani: [ { name: "aniWin1", ani: "big2", bloop: true}],
                lock: false
            },

            5: {
                show: ["aniWin1"],
                hide: ["virWin", "layDisable", "aniWin2", "aniWin3"],
                ani: [
                    { name: "resWinAni", ani: "end", bloop: false },
                    { name: "aniWin1", ani: "big3", bloop: false }
                ],
                next: 0
            },

            6: {
                show: ["aniWin2", "aniWin1"],
                hide: ["ainWin3"],
                ani: [
                    { name: "aniWin2", ani: "super1", bloop: false },
                ],
                next: 7,
                effect: [{url: res.ElementalEffWin3_mp3, bloop: false }],
                lock: false
            },

            7: {
                show: ["aniWin2"],
                hide: ["aniWin1", "aniWin3"],
                ani: [
                    { name: "aniWin2", ani: "super2", bloop: true }
                ],
                lock: false
            },

            8: {
                show: ["aniWin2"],
                hide: ["virWin", "layDisable", "aniWin1", "aniWin3"],
                ani: [
                    { name: "aniWin2", ani: "super3", bloop: false },
                    { name: "resWinAni", ani: "end", bloop: false }
                ],
                next: 0
            },

            9: {
                show: ["aniWin3", "aniWin2"],
                hide: ["aniWin1"],
                ani: [ { name: "aniWin3", ani: "mega1", bloop: false } ],
                next: 10,
                effect: [{url: res.ElementalEffWin4_mp3, bloop: false }],
                lock: false
            },

            10: {
                show: ["aniWin3"],
                hide: ["aniWin1", "aniWin2"],
                ani: [{ name: "aniWin3", ani: "mega2", bloop: true}],
                lock: false
            },

            11: {
                show: ["aniWin3"],
                hide: ["virWin", "layDisable", "aniWin1", "aniWin2"],
                ani: [
                    { name: "resWinAni", ani: "end", bloop: false},
                    { name: "aniWin3", ani: "mega3", bloop: false}
                ],
                next: 0
            }

        };

        //!numwin显示透明度动画
        this.numwinstatedata = {
            0: {opacity: [{name: 'numWin', value: 255}]},
            1: {ani: [{name: 'actNumWin', ani: 'fade', data: {bopa: 255, eopa: 0, time: 0.2}}]},
            2: {opacity: [{name: 'numWin', value: 0}]},
            3: {
                ani: [
                    {name: 'actNumWin', ani: 'delayTime', data: {time: 0.4}}
                ],
                next: 1
            }
        };

        //!textFreeNum显示透明度动画
        this.freeNumStateData = {
            0: {
                show: ["textFreeNum"],
            },

            1: {
                hide: ["textFreeNum"]
            }
        };

        //!textFreeTotalWin显示透明度动画
        this.freeTotalWinStateData = {
            0: {
                show: ["textFreeTotalWin"],
            },

            1: {
                hide: ["textFreeTotalWin"]
            }
        };

        // //! FreeAni 0没有开始播放 1播放动画中
        this.freeAniStateData = {
            0: {
                hide: ["nodeFreeAni", "layElements"]
            },

            1: {
                show: ["nodeFreeAni", "layElements", "aniFreeAni"],
                hide: ["nodeFly", "nodeWinAni", "nodeFreeAddAni", "nodeFreeSelect", "nodeFreeResult"],
                ani: [
                    { name: "aniFreeAni", ani: "mianfeiyouxi", bloop: false }
                ]
            },

            2: {
                show: ["nodeFreeAni", "layElements", "aniFreeAni"],
                hide: ["nodeFly", "nodeWinAni", "nodeFreeAddAni", "nodeFreeSelect", "nodeFreeResult"],
                ani: [
                    { name: "aniFreeAni", ani: "mianfeiyouxi_lucky", bloop: false }
                ]
            }
        };

        this.freeSelectStateData = {
            0: {
                hide: ["nodeFreeSelect", "layElements", "nodeBackFreeSelect", "nodeSpineFGSelectLeft", "nodeSpineFGSelectRight"]
            },

            1: {
                show: ["nodeFreeSelect", "layElements"],
                hide: ["nodeFly", "nodeWinAni", "nodeFreeAni", "nodeFreeAddAni", "nodeFreeResult"]
            }
        };

        // //! FreeAddAni 0没有开始播放 1播放动画中
        this.freeAddAniStateData = {
            0: {
                hide: ["nodeFreeAddAni", "layElements", "layMask"]
            },

            1: {
                show: ["nodeFreeAddAni", "layMask", "layElements", "aniFreeAni"],
                hide: ["nodeFly", "nodeWinAni", "nodeFreeAni", "nodeFreeSelect", "nodeFreeResult"]
            }
        };

        // // Free退出动画，0没有播放， 1动画中
        // this.freeExitAniStateData = {
        //     0: {
        //         hide: ["layMask", "nodeMask"],
        //     },
        //
        //     1: {
        //         show: ["layMask", "nodeMask"],
        //     }
        // };

        // this.freeanistatedata = {
        //     hide:{hide:['layDisable','nodeSuperFreeGame','nodeSuperFreeGame2'],opacity:[{name:'layDisable',value:0}]},
        //     show:{show:['layDisable','nodeSuperFreeGame','nodeSuperFreeGame2'],opacity:[{name:'layDisable',value:180}]}
        // };
        //
        // //! FreeResult 0没有开始播放 1播放动画中
        this.freeResultStateData = {
            0: {
                hide: ["nodeFreeResult", "layElements", "layMask"],
            },

            1: {
                show: ["nodeFreeResult", "layMask", "layElements"],
                hide: ["nodeFly", "nodeWinAni", "nodeFreeAni", "nodeFreeAddAni", "nodeFreeSelect"],
            }
        };

        //! icontips 0:不显示 1：显示
        this.iconTipsStateData = {
            0: {
                hide: ["layElements", "layTips", "nodeIconTips"],
            },

            1: {
                show: ["layElements", "layTips", "nodeIconTips"],
            }
        };

        // 断线提示, 0:不显示, 1:显示
        this.disconnectStateData = {
            0: {
                hide: ["layDisconnect", "nodeDisconnect"],
                enable: ["btnRun"]
            },

            1: {
                show: ["layDisconnect", "nodeDisconnect"],
                disable: ["btnRun"]
            }
        };

        //! 禁止使用自动下注
        this.autodisableddata = {
            disabled: {hide: ['btnAuto', 'btnAutoStop', "numAuto"]},
        };

        // help
        this.helpStateData = {
            0: {
                show: ["nodeUI"],
                hide: ["layAdaptive1"],
                enable: ["btnMenu"]
            },

            1: {
                show: ["layAdaptive1"],
                hide: ["nodeUI"],
                disable: ["btnMenu"]
            }
        };

        // collect
        this.collectStateData = {
            0: {
                hide: ["layElements", "nodeFly"]
            },

            1: {
                show: ["layElements", "nodeFly"]
            }
        };

        // 公主转转场动画；0：不显示，1：入场，2：离场
        this.betaChgSceneStateData = {
            0: {
                hide: ["nodeBetaChgScene", "aniBetaChgScene"],
            },

            1: {
                show: ["nodeBetaChgScene", "aniBetaChgScene"],
                ani: [
                    {
                        name: "aniBetaChgScene", ani: "zhuanchang1", bloop: false
                    }
                ],
                next: 0
            },

            2: {
                show: ["nodeBetaChgScene", "aniBetaChgScene"],
                ani: [
                    {
                        name: "aniBetaChgScene", ani: "zhuanchang2", bloop: false
                    }
                ],
                next: 0
            },

            3: {
                show: ["nodeBetaChgScene", "aniBetaChgScene"],
                ani: [
                    {
                        name: "aniBetaChgScene", ani: "xingxing", bloop: false
                    }
                ],
                next: 0
            }
        };

        this.FGSelectChgSceneStateData = {
            0 : {
                hide: ["layElements", "nodeFGSelectChgScene", "aniFGSelectChgScene"]
            },

            1 : {
                show: ["layElements", "nodeFGSelectChgScene", "aniFGSelectChgScene"],
                ani: [
                    {
                        name: "aniFGSelectChgScene", ani: "zhuanchang1", bloop: false
                    }
                ],
                next: 0
            }
        };

        this.gameLogoStateData = {
            0 : {
                hide: ["nodeGameLogo"]
            },

            1: {
                show: ["nodeGameLogo"]
            }
        },

        this.balanceScrollData = { delay: 0.4, time:0.2 ,callfunc: this._onChgWinNum, target: this};

        //win动画滚动配置
        this.winaniscrolldata = {
            speed: 20,
            delay: 0,
            addspeed: 20,
            callfunc: this._onChgWinNum,
            percallfunc: this._winAnichangStep,
            target: this,
            lstkeynum: [450, 750, 1200],
            // syn: ['numWin']
        };

        this.lstBtnMusic = [
            {btnname: "btnRun", resurl: res.ElementalBtnRun_mp3, bloop: false},
            {btnname: "btnAuto", resurl: res.ElementalBtnClick_mp3, bloop: false},
            {btnname: "btnAutoStop", resurl: res.ElementalBtnClick_mp3, bloop: false},
            {btnname: "btnCoinValueDec", resurl: res.ElementalBtnClick_mp3, bloop: false},
            {btnname: "btnCoinValueAdd", resurl: res.ElementalBtnClick_mp3, bloop: false},
            {btnname: "slidCoinValue", resurl: res.ElementalBtnClick_mp3, bloop: false},
        ];

        this.allmoneystatedata = {
            0: {
                hide: ["nodeAllMoneyAni"]
            },

            1: {
                show: ["nodeAllMoneyAni"]
            }
        };

        //! 游戏rewatch相关 0没有运行 1运行中
        this.rewatchstatedata = {
            0: {
                enable: ['btnRun','slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnMenu']
            },
            1: {
                disable: ['slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnMenu']
            },
            2: {
                disable: ['btnRun']
            },
        };

        //! 等待collect就绪
        this.gamecollectdata = {
            0: {enable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnMenu']},
            1: {disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnMenu']},
        };

        //! 等待真实的spin结束
        this.spinenddata = {
            0: {enable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnMenu']},
            1: {disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnMenu']},
        };

        //! 等待游戏准备就绪
        this.gamereadydata = {
            wait: {disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnMenu']},
            ready: {enable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnMenu']},
        };

        //! 禁止修改下注
        //! 游戏rewatch相关 0没有运行 1运行中
        this.prepaiddata = {
            close: {enable: ['slidCoinValue', 'btnMaxBet', 'btnBet']},
            open: {disable: ['slidCoinValue', 'btnMaxBet', 'btnBet']},
        };

        //! TotalWin相关 0没有显示 1进入 2显示 3离开
        this.totalwinstatedata = {
            hide: {
                hide: ['layDisable'],
                enable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto'],
                ani: [{name: 'resTotalWin', ani: 'a0', bloop: false}]
            },
            begin: {
                show: ['layDisable'],
                disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto'],
                ani: [{name: 'resTotalWin', ani: 'a1', bloop: false}],
                next: 'show'
            },
            show: {
                show: ['layDisable'],
                disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto'],
                ani: [{name: 'resTotalWin', ani: 'a2', bloop: false}]
            },
            end: {
                show: ['layDisable'],
                disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto'],
                ani: [{name: 'resTotalWin', ani: 'a3', bloop: false}],
                next: 'hide'
            },
        };


        this.allmoneyData = {
            moduleUI: this,
            txtWinRes: res.ElementalAllMoney_json,
            aniDelayTime: 0.05,
            txt_num: "textAni_textNum",
            statename: 'allmoneyani',
            lstAnimation: ["animation0", "animation1", "animation2"],
            lstAniFrame: [[0,15], [20,35], [40,55]],
            aniCallBack:this._callAllMoneyAniEnd,
            target: this
        }
    },

    initModule: function() {
        this._init();
        //! 初始化状态
        this._addState(ELEMENTAL_UI_STATE.STATE_AUTO_RUN, this.autostatedata, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_RUN, this.runstatedata, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_FREE, this.freeStateData, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_FREE_UI, this.freeUIStateData, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_WIN_ANI, this.winanistatedata, 0, this._onChgWinAniState, this);
        this._addState(ELEMENTAL_UI_STATE.STATE_FREE_ANI, this.freeAniStateData, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_FREE_SELECT, this.freeSelectStateData, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_FREE_ADD_ANI, this.freeAddAniStateData, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_FREE_RESULT, this.freeResultStateData, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_VIR_RUN, this.virRunStateData, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_ICON_TIPS, this.iconTipsStateData, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_DISCONNECT, this.disconnectStateData, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_HELP, this.helpStateData, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_COLLECT, this.collectStateData, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_VIR_FREE, this.virFreeStateData, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_BETA_CHGSCENE, this.betaChgSceneStateData, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_FGSELECT_CHGSCENE, this.FGSelectChgSceneStateData, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_GAME_LOGO, this.gameLogoStateData, 1);
        this._addState("bgSpineAniState", this.bgSpineAniState, 0);
        this._addState('totalwin', this.totalwinstatedata, 'hide');

        // act
        this._addState(ELEMENTAL_UI_STATE.STATE_ACT_NUM_WIN, this.numwinstatedata, 0);
        this._addState(ELEMENTAL_UI_STATE.STATE_ACT_FREE_NUM, this.freeNumStateData, 1);
        this._addState(ELEMENTAL_UI_STATE.STATE_ACT_FREE_TOTAL_WIN, this.freeTotalWinStateData, 1);
        this._addState("allmoneyani", this.allmoneystatedata, 0);
        this._addState('rewatch', this.rewatchstatedata, 0);
        this._addState('gamecollect', this.gamecollectdata, 0);

        var isYgg = GamelogicMgr.instance.isYggPlatform();
        if (isYgg) {
            if (!GamelogicMgr.instance.canAutoSpin()) {
                this._addState("autodisabled", this.autodisableddata, "disabled");
            }


            this._addState('prepaid', this.prepaiddata, 'close', this._onChgPrepaidState, this);
            this._addState('gameready', this.gamereadydata, 'wait');
            this._addState('spinend', this.spinenddata, 0);
        }

        this._refeshDisplay();

        GameDataMgr.instance.setTxtStyleData('numWinAni',{numberkey: '_aniWin',bcash: true, nosym: true});

        var hidenumWin = function (value) {
            this.setVisible('numWin', 'winani', value > 0);
        };
        GameDataMgr.instance.addNumberValueListener('_iWin', 0, this, hidenumWin, true);

        var hideNumAuto = function (value) {
            this.setVisible('numAuto', 'autoPlayNum', value > 0);
        };
        GameDataMgr.instance.addNumberValueListener('_iAutoNum', 0, this, hideNumAuto, true);

        //注册监听回调
        var hidetotalnumWin = function () {
            this._setState(ELEMENTAL_UI_STATE.STATE_ACT_FREE_TOTAL_WIN, 1);
        };

        GameDataMgr.instance.addNumberValueListener('_iFreeTotalWin', 0, this, hidetotalnumWin);

        var hidetextFreeNum = function () {
            this._setState(ELEMENTAL_UI_STATE.STATE_ACT_FREE_NUM, 1);
        };
        GameDataMgr.instance.addNumberValueListener('_iFreeNum', 0, this, hidetextFreeNum);

        var refreshWinFunc = function(value) {
            if (value == 0) {
                this._setState(ELEMENTAL_UI_STATE.STATE_ACT_NUM_WIN, 2);
            }
            else {
                this._setState(ELEMENTAL_UI_STATE.STATE_ACT_NUM_WIN, 0);
            }
        };
        GameDataMgr.instance.addNumberValueListener("_iWin", 0, this, refreshWinFunc, true);

        // 余额飞数字动画
        this._textAllMoneyAni = new GameModuleAllMoney(this.allmoneyData);
        if (this._textAllMoneyAni._bShowAni) {
            var nodeAllMoneyAni = this.getCtrl("nodeAllMoneyAni");
            nodeAllMoneyAni.addChild(this._textAllMoneyAni);
        }
    },

    //! 设置是否在运行中
    setRun : function (brun, bFreeGame) {
        this._super(brun, bFreeGame);

        this._setState(ELEMENTAL_UI_STATE.STATE_RUN, brun ? 1 : 0);
        if (brun) {
            if (this._getCurState(ELEMENTAL_UI_STATE.STATE_ACT_NUM_WIN) == 0) {
                this._setState(ELEMENTAL_UI_STATE.STATE_ACT_NUM_WIN, 2);
            }

            GameDataMgr.instance.setIWin(0);
        }
    },

    setRunState: function(state) {
        this._setState(ELEMENTAL_UI_STATE.STATE_RUN, state);
    },

    setOnWinAniScrollEndFunc: function(func, target) {
        this._addCallFunc("winAniScrollEnd", func, target);
    },

    setOnWinAniEndFunc: function(callfunc, target) {
        this._addCallFunc("winAniEnd", callfunc, target);
    },

    //!设置是否是免费，处理免费游戏的逻辑, bjuststart是否为游戏初始化（处理断线重连）
    setFreeGame: function(bfreegame, bjuststart, totalwin, ifreenums, freedelay) {
        var bfree = GameDataMgr.instance.getNumberValue('_bFreeGame');
        if (bfree == bfreegame)
            return;

        GameDataMgr.instance.setNumberValue('_bFreeGame', bfreegame);
        GameDataMgr.instance.setNumberValue('_bJustStart', bjuststart);
        if (!bfreegame) {
            var curTotalWin = totalwin;
            if (this.CurWinData != undefined && this.CurWinData.totalwin != undefined) {
                curTotalWin = this.CurWinData.totalwin;
            }

            GamelogicMgr.instance.callRegistered("sendSpinEnd");

            var iautowin =  GameDataMgr.instance.getNumberValue('_iAutoWin');
            iautowin += curTotalWin;
            GameDataMgr.instance.setNumberValue('_iAutoWin', iautowin);
        } else {
            if(!GamelogicMgr.instance.isPrepaid()){
                if (bjuststart && totalwin) {
                    GameDataMgr.instance.addScrollAniBy('numBalance', -totalwin, {time: this.timedata.numbalancespeed})
                }
            }

            GameDataMgr.instance.setIFreeNum(ifreenums);

            this.WaitFreeTime = (freedelay == undefined || null ? this.WaitFreeTime : freedelay);
        }

        GameDataMgr.instance.setIWin(0);

        // 进入免费时，若freenum>0则需要显示textFreeNum
        if (ifreenums > 0 && this._getCurState(ELEMENTAL_UI_STATE.STATE_ACT_FREE_NUM) != 0) {
            this._setState(ELEMENTAL_UI_STATE.STATE_ACT_FREE_NUM, 0);
        }

        if (totalwin > 0 && this._getCurState(ELEMENTAL_UI_STATE.STATE_ACT_FREE_TOTAL_WIN) != 0) {
            this._setState(ELEMENTAL_UI_STATE.STATE_ACT_FREE_TOTAL_WIN, 0);
        }

        var winVal = GameDataMgr.instance.getNumberValue("_iWin");
        if (winVal <= 0 && this._getCurState(ELEMENTAL_UI_STATE.STATE_ACT_NUM_WIN) == 0) {
            this._setState(ELEMENTAL_UI_STATE.STATE_ACT_NUM_WIN, 2);
        }
    },

    //! 判断是否可以投注
    canBetting: function () {
        var totalbet = this.getTotalBet();

        var realBance = GamelogicMgr.instance.getRealBalance();
        if(realBance){
            if (realBance >= totalbet) {
                return true;
            }
            return false;
        }
        else{
            var iscan = GameDataMgr.instance.canBetting(totalbet);
        }

        return iscan;
    },

    betting: function () {
        //this._super();
        if (!this.canBetting())
            return false;

        var totalbet = this.getTotalBet();

        if(this._iNewBlance){
            this._iNewBlance -= totalbet;
            return;
        }

        GameDataMgr.instance.addScrollAniBy('numBalance', -totalbet, {time: this.timedata.numbalancespeed});
    },

    canSetBalance: function (balance) {
        var bjust = GameDataMgr.instance.getNumberValue('_bJustStart');
        if((this.isShowWin() || !this._textAllMoneyAni.isEnd() || this.bWaitCollect || GamelogicMgr.instance.isPrepaid()) && !bjust){
            this._iNewBlance = balance;
            return false;
        }

        var numBalance = this.getCtrl('numBalance');
        if(!numBalance.isVisible())
            this.setVisible('numBalance', 'balance', true);

        return true;
    },

    onTouchAutoCount: function (arr) {
        if(arr[0] == "∞" || arr[0] == 'Infinity'){
            this.setVisible('numAuto', 'autoPlayNum', true);
        }

        this._super(arr);
    },
    
    _onTouchAuto: function(sender) {
        this._super(sender);

        GamelogicMgr.instance.refreshAutolayer(this.autoLayer);
    },

    _onTouchAutoStop : function (sender) {
        if(this._getCurState(ELEMENTAL_UI_STATE.STATE_WIN_ANI) != 0)
            return ;

        this._setState(ELEMENTAL_UI_STATE.STATE_AUTO_RUN, 0);
        GameDataMgr.instance.setNumberValue('_iAutoNum', 0);
        GamelogicMgr.instance.setUserAutoNums(-1);
        this.playBtnSound(sender);
    },

    _onTouchDisable: function (sender) {
        if (GamelogicMgr.instance.callFuncByName("isDisableSkip"))
            return;

        this._super(sender);

        if (this.isVisible('virWin')) {
            this._callFunc("winAniScrollEnd");
        }
    },

    //！Prepaid变状态时调用
    _onChgPrepaidState: function (cstate) {
        if(cstate == 'close'){
            this.prepaidState = 2;
        }
        else{
            this.prepaidState = 1;
        }
    },

    //！胜利动画变状态时调用
    _onChgWinAniState: function (cstate, ostate) {
        //! 胜利动画结束
        if (cstate == 0) {
            if (this.iWinState == 0) {
                this.iWinState = 1;

                var bfreegame = GameDataMgr.instance.getNumberValue('_bFreeGame');
                if (bfreegame) {
                    if (this.CurWinData.totalwin > 0 && this._getCurState(ELEMENTAL_UI_STATE.STATE_ACT_FREE_TOTAL_WIN) != 0) {
                        this._setState(ELEMENTAL_UI_STATE.STATE_ACT_FREE_TOTAL_WIN, 0, 0.4);
                    }

                    var itotalwin = this.CurWinData.totalwin;
                    if(this.CurWinData.wonamount && this.CurWinData.wonamount > 0){
                        itotalwin = Math.min(itotalwin, this.CurWinData.wonamount);
                    }
                    GameDataMgr.instance.addScrollAni('textFreeTotalWin', itotalwin, this.balanceScrollData);

                    var freeNum = GameDataMgr.instance.getNumberValue("_iFreeNum");
                    if (freeNum <= 0) {
                        if (this._getCurState(ELEMENTAL_UI_STATE.STATE_ACT_NUM_WIN) == 0) {
                            this._setState(ELEMENTAL_UI_STATE.STATE_ACT_NUM_WIN, 2);
                        }
                    }
                } else {
                    // GameDataMgr.instance.addScrollAniBy('numBalance', this.CurWinData.turnwin, this.balanceScrollData);
                    // GamelogicMgr.instance.callRegistered("onWinAniDone", this.CurWinData.turnwin);

                    var iautowin = this.CurWinData.turnwin;
                    GameDataMgr.instance.setNumberValue('_iAutoWin', iautowin);

                    // this._showAllMoneyAni(iautowin);
                    GamelogicMgr.instance.callRegistered("sendSpinEnd");
                }

                var tempFunc = function() {
                    this.iWinState = -1;
                    this._callFunc("winAniEnd");
                };
                GameDataMgr.instance.insertTickCallback('runWinState2', 0.5, 0, this, tempFunc);
            }
        }
    },

    _showAllMoneyAni: function (value) {
        if(GamelogicMgr.instance.isPrepaid())
            return;

        if(this.prepaidState > 0){
            if(this.prepaidState == 2){
                this.prepaidState = -1;
            }

            return;
        }

        if(!this._textAllMoneyAni || !this._textAllMoneyAni._bShowAni){
            return;
        }

        var curCanvasIndex = this._CanvasMgr.getCurCanvasIndex();
        this._textAllMoneyAni.setValue(value, curCanvasIndex);
    },

    //!余额数字动画结束回调
    _callAllMoneyAniEnd: function (self) {
        if(self._iNewBlance != undefined){
            self.setBalance(self._iNewBlance);
            self._iNewBlance = undefined;
        }
        else{
            var realBance = GamelogicMgr.instance.getRealBalance();
            if(realBance && realBance > 0)
                self.setBalance(realBance);
        }
    },
});
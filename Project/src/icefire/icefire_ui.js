var IceFireUi = GameModuleUI1.extend({
    ctor: function (canvasmgr) {
        GameModuleUI1.prototype.ctor.call(this, canvasmgr);
        this.lstctrldata = [
            //! node
            {type: 'node', name: 'layAutoSelect', callfunc: this._onTouchAutoSelect, target: this, defaulthide: true},
            {type: 'node', name: 'layDisable', callfunc: this._onTouchDisable, target: this, defaulthide: true},
            {type: 'node', name: 'layTips', callfunc: this._onTouchCloseTips, target: this, defaulthide: true},
            {type: 'node', name: 'layUiGmr', callfunc: this._onTouchCloseUi, target: this, defaulthide: true},
            {type: 'node', name: 'nodeRun', callfunc: undefined, target: this, defaulthide: true},
            {type: 'node', name: 'nodeUiGmr', callfunc: undefined, target: this, defaulthide: true},
            {type: 'node', name: 'nodeTotalWin'},
            {type: 'node', name: 'layDisconnect', defaulthide: true},
            {type: 'node', name: 'nodeWinCount'},
            {type: 'node', name: 'nodeAllMoneyAni'},
            {type: 'node', name: 'nodeOpenUi'},
            //! singlenode
            {type: 'singlenode', name: 'nodeWinAni'},
            {type: 'singlenode', name: 'nodeFreeAni'},
            {type: 'singlenode', name: 'nodeDisconnect'},
            {type: 'singlenode', name: 'nodeFreeResult', defaulthide: true},
            {type: 'singlenode', name: 'nodeFreeResult2', defaulthide: true},
            {type: 'singlenode', name: 'nodeSuperFreeGame', defaulthide: true},
            {type: 'singlenode', name: 'nodeSuperFreeGame', defaulthide: true},
            {type: 'singlenode', name: 'nodeWaitAppear1', defaulthide: true},
            {type: 'singlenode', name: 'nodeWaitAppear2', defaulthide: true},
            //! resource
            {
                type: 'resource',
                name: 'resTotalWin',
                parent: 'nodeTotalWin',
                res: [res.IceFireUiNodeTotalWin1_json, res.IceFireUiNodeTotalWin2_json, res.IceFireUiNodeTotalWin2_json]
            },
            {type: 'resource', name: 'resWinAni', parent: 'nodeWinAni', res: res.IceFireWinAni_json},
            {type: 'resource', name: 'resWaitAppearAni1', parent: 'nodeWaitAppear1', res: res.IceFireGameNodeWaitAppearAni1_json},
            {type: 'resource', name: 'resWaitAppearAni2', parent: 'nodeWaitAppear2', res: res.IceFireGameNodeWaitAppearAni2_json},
            {
                type: 'resource',
                name: 'resAllMoneyAni',
                parent: 'nodeAllMoneyAni',
                res: [res.IceFireUiNodeAllMoney1_json, res.IceFireUiNodeAllMoney2_json, res.IceFireUiNodeAllMoney3_json]
            },
            //! node
            {type: 'node', name: 'nodeSpineAni', callfunc: undefined, target: this, defaulthide: true},
            {type: 'node', name: 'nodeAutoSelect', callfunc: undefined, target: this, defaulthide: true},
            //! textex
            {
                type: 'textex',
                name: 'textBet',
                str: 'uiScreen_Label1',
                bmulline: false,
                scaletype: 0,
                horalignment: cc.TEXT_ALIGNMENT_CENTER,
                veralignment: cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM,
                fontname: 'Ubuntu_M',
                fontsize: 24,
                textcolor: cc.color(125, 235, 255)
            },
            {type: 'textex', name: 'textCoinValue', str: 'uiScreen_Label2', fontname: 'Ubuntu_M', fontsize: 24, bmulline: false},
            //! textex
            {type: 'textex', name: 'textTotalBet', str: 'uiScreen_Label3', fontname: 'Ubuntu_M', fontsize: 24, bmulline: false},
            {type: 'textex', name: 'textWin', str: 'uiScreen_Label4', fontname: 'Ubuntu_M', fontsize: 24, bmulline: false},
            {type: 'textex', name: 'textBalance', str: 'uiScreen_Label5', fontname: 'Ubuntu_M', fontsize: 24, bmulline: false},
            //{type:'textex',name:'textAutoStop',str:'STOP',fontname:'Ubuntu_M'},
            {type: 'textex', name: 'textTotalWin', str: 'uiScreen_Label6', fontname: 'Ubuntu_M', bmulline: false},
            {type: 'textex', name: 'textTotalWin2', str: 'uiScreen_Label6', fontname: 'Ubuntu_M', bmulline: false},
            {type: 'textex', name: 'textFreeGame', str: 'uiScreen_Label7', fontname: 'Ubuntu_M', bmulline: false},
            //{type: 'textex', name: 'textFreeWinInfo', str: 'sfs_summary_amount_won', fontname: 'Ubuntu_M'},
            {type: 'textex', name: 'textCoins', str: 'uiScreen_Label8', fontname: 'Ubuntu_M', fontsize: 28, bmulline: false},
            //! textbmfontex
            //{type: 'textbmfontex', name: 'numBet', str: '0'},
            {type: 'textbmfontex', name: 'numCoinValue', str: '0.00', fontsize: 28},
            {type: 'textbmfontex', name: 'numTotalBet', str: '0.0'},
            {type: 'textbmfontex', name: 'numWin', str: '0.00', defaulthide: true, fontsize: 28},
            {type: 'textbmfontex', name: 'numBalance', str: '0.00', fontsize: 28},
            {type: 'textbmfontex', name: 'numAuto', str: '0'},
            {type: 'textbmfontex', name: 'numTotalWin', str: '0.00'},
            {type: 'textbmfontex', name: 'numWinAni', str: '0', scaletype: -1},
            {type: 'textbmfontex', name: 'textFreeTotalWin', str: '0'},
            {type: 'textbmfontex', name: 'txtAddFgNums', str: '0'},
            //{type:'textbmfontex',name:'textFreeGameNums',str:'0'},
            //{type:'textbmfontex',name:'textExWilds',str:'0'},
            {type: 'textbmfontex', name: 'txt_num', str: '0.00'},
            {type: 'textbmfontex', name: 'textFreeNum', str: '0', scaletype: -1},
            //! button
            {type: 'button', name: 'btnCoinValueDec', btnname: 'btnCoinValueDec', areaname: 'areaCoinValueDec'},
            {type: 'button', name: 'btnCoinValueAdd', btnname: 'btnCoinValueAdd', areaname: 'areaCoinValueAdd'},
            {
                type: 'button',
                name: 'areaCoinCash1',
                areaname: 'areaCoinCash1',
                callfunc: this._onTouchCoinCash,
                target: this
            },
            {
                type: 'button',
                name: 'areaCoinCash2',
                areaname: 'areaCoinCash2',
                callfunc: this._onTouchCoinCash,
                target: this
            },
            {
                type: 'button',
                name: 'btnMaxBet',
                btnname: 'btnMaxBet',
                areaname: 'areaMaxBet',
                callfunc: this._onTouchMaxBet,
                target: this,
                lstbtnname: ['btnMaxBetBack']
            },
            {
                type: 'button',
                name: 'btnRun',
                btnname: 'btnRun',
                areaname: 'areaRun',
                callfunc: this._onTouchRun,
                target: this,
                lstbtnname: ['btnRunBack']
            },
            {
                type: 'button',
                name: 'btnBet',
                btnname: 'btnBet',
                areaname: 'areaBet',
                callfunc: this._onTouchBet,
                target: this,
                lstbtnname: ['btnBetBack']
            },
            {
                type: 'button',
                name: 'btnAuto',
                btnname: 'btnAuto',
                areaname: 'areaAuto',
                callfunc: this._onTouchAuto,
                target: this,
                lstbtnname: ['btnAutoBack']
            },
            {
                type: 'button',
                name: 'btnAutoStop',
                btnname: 'btnAutoStop',
                areaname: 'areaAutoStop',
                callfunc: this._onTouchAutoStop,
                target: this,
                lstbtnname: ['btnAutoStopBack']
            },
            {type: 'button', name: 'btnAuto25', btnname: 'btnAuto25', callfunc: this._onTouchAuto25, target: this},
            {type: 'button', name: 'btnAuto50', btnname: 'btnAuto50', callfunc: this._onTouchAuto50, target: this},
            {type: 'button', name: 'btnAuto100', btnname: 'btnAuto100', callfunc: this._onTouchAuto100, target: this},
            {type: 'button', name: 'btnAuto200', btnname: 'btnAuto200', callfunc: this._onTouchAuto200, target: this},
            {type: 'button', name: 'btnAuto500', btnname: 'btnAuto500', callfunc: this._onTouchAuto500, target: this},
            {
                type: 'button',
                name: 'btnNumAuto',
                btnname: 'btnNumAuto',
                callfunc: this._onTouchAutoStop,
                target: this,
                lstbtnname: ['btnNumAutoBack']
            },
            {
                type: 'button',
                name: 'btnOpenUi',
                btnname: 'btnOpenUi',
                areaname: 'areaOpenUi',
                callfunc: this._onTouchOpenUi,
                target: this
            },
            {
                type: 'button',
                name: 'btnCloseUi',
                btnname: 'btnCloseUi',
                areaname: 'areaCloseUi',
                callfunc: this._onTouchCloseUi,
                target: this
            },
            {type: 'button', name: 'btnMenu', btnname: 'btnMenu', callfunc: this._onTouchMenu, target: this},
            //! sliderex
            {
                type: 'sliderex',
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
            //! armature（在resource中）
            {type: 'armature', name: 'aniWin'},
            {type: 'armature', name: 'aniWinLight'},
            {type: 'armature', name: 'aniRun'},
            {type: 'armature', name: 'aniRun2'},
            {type: 'armature', name: 'aniGold'},
            //! action
            {type: 'action', name: 'actRun', res: 'nodeRun'},
            {type: 'action', name: 'actNumWin', res: 'numWin'},
            //! virtual
            {type: 'virtual', name: 'virWin', defaulthide: true},
            {type: 'virtual', name: 'virRun', defaulthide: true},
            //! spine
            {
                type: 'spine',
                name: 'aniWinSpine',
                parent: 'nodeSpineAni',
                res: [[res.IceFireMegaRen_json, res.IceFireMegaRen_atlas], [res.IceFireMegaRen_json, res.IceFireMegaRen_atlas], [res.IceFireMegaRen_json, res.IceFireMegaRen_atlas]]
            },
            //! sprite
            {type: 'sprite', name: 'sprRun', defaulthide: true},
        ];
        //! 胜利动画相关的数据
        this.windata = {
            rootname: 'nodeWinAni',
            resname: 'resWinAni',
            numname: 'numWinAni',
            lstnumani: ['begin', 'end', 'loop'],
            numdata: {
                speed: 20,
                delay: 0,
                addspeed: 20,
                callfunc: this._onChgWinNum,
                target: this,
                lstkeynum: [600, 1200, 2400]
            },
            lstani: [{name: 'aniWin', lstaniname: ['bigwin1', 'bigwin2', 'bigwin3']},
                {name: 'aniWin', lstaniname: ['superwin1', 'superwin2', 'superwin3']},
                {name: 'aniWin', lstaniname: ['megawin1', 'megawin2', 'megawin3']},
                {name: 'aniWinLight', lstaniname: ['megawin1_xia', 'megawin2_xia', 'megawin3_xia']},
                {name: 'aniWinSpine', lstaniname: ['megawin_ren1', 'megawin_ren2', 'megawin_ren3']}
            ],
            //lstEffect:[res.IceFireEffWin1_mp3, res.IceFireEffWin2_mp3, res.IceFireEffWin3_mp3, res.IceFireEffWin4_mp3]
            lstEffect: {
                addurl: res.IceFireAddMoney_mp3,
                endurl: res.IceFireFinishMoney_mp3,
                tomoneyurl: res.IceFireWinToMoney_mp3
            }
        };


        //! 状态数据：数组 show显示 hide隐藏 enable可用 disable禁用
        //! ani动画（name控件名 ani动画名 bloop是否循环（或者data数据）） oain其他动画（仅改变效果，不影响判断的动画，参数和ani一致）
        //! next后续状态（特定时间或者动画全部播放完之后切换） time状态持续时间 lock如果为true则必须播放完才能被替换
        //! opacity透明度（name控件名 value数值） color颜色（name控件名 value颜色值cc.color）

        //! 自动相关 0没有进入自动 1自动中
        this.autostatedata = {
            0: {
                show: ['btnAuto', 'btnBet', 'btnRun', 'nodeOpenUi'],
                hide: ['btnAutoStop', 'numAuto', 'btnNumAuto', 'nodeRun'],
                enable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnOpenUi', 'btnMenu'],
                opacity: [{name: 'nodeRun', value: 255}]
            },
            1: {
                show: ['btnAutoStop', 'numAuto', 'btnNumAuto', 'nodeRun'],
                hide: ['btnAuto', 'btnBet', 'btnRun', 'nodeOpenUi'],
                disable: ['slidCoinValue', 'btnMaxBet', 'btnBet', 'btnOpenUi', 'btnMenu'],
                //opacity: [{name: 'nodeRun', value: 150}]
            },
        };

        //! 游戏运行相关 0没有运行 1运行中
        this.runstatedata = {
            0: {
                show: ['nodeRun'],
                enable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnOpenUi', 'btnMenu']/*,ani:[{name:'actRun', ani:'fade', data:{bopa:0, eopa:255, time:0.01}}]*//*,lock:true*//*opacity:[{name:'nodeRun',value:255}*/
            },
            1: {
                hide: ['nodeRun'],
                disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnOpenUi', 'btnMenu']/*,ani:[{name:'actRun', ani:'fade', data:{bopa:255, eopa:0, time:0.01}}]*//*,lock:true*/
            },
        };

        //! 游戏rewatch相关 0没有运行 1运行中
        this.rewatchstatedata = {
            0: {
                enable: ['btnRun','slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnMenu', 'btnOpenUi']
            },
            1: {
                disable: ['slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnMenu', 'btnOpenUi']
            },
            2: {
                disable: ['btnRun']
            },
        };

        //! 游戏UI相关 0不显示 1显示
        this.uistatedata = {
            0: {show: ['btnOpenUi'], hide: ['btnCloseUi', 'nodeUiGmr', 'layUiGmr']},
            1: {show: ['btnCloseUi', 'nodeUiGmr', 'layUiGmr'], hide: ['btnOpenUi']},
        };

        //! 免费相关 0没有进入免费 1免费中
        this.freestatedata = {
            0: {enable: ['slidCoinValue', 'btnMenu']},
            1: {disable: ['slidCoinValue', 'btnMenu']},
        };

        //! 游戏运行虚拟节点相关 0没有运行 1运行中
        this.virrunstatedata = {
            0: {hide: ['virRun'], enable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto']},
            1: {show: ['virRun'], disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto']},
        };

        //! 胜利动画相关 0没有显示 1开始显示 2普通结束 3开始Big 4循环Big 5结束Big 6开始Super 7循环Super 8结束Super 9开始Mega 10循环Mega 11结束Mega
        this.winanistatedata = {
            0: {
                hide: ['nodeWinAni', 'layDisable', 'virWin', 'aniWin', 'aniWinLight', 'nodeSpineAni'],
                opacity: [{name: 'layDisable', value: 0}]
            },
            1: {
                show: ['nodeWinAni', 'layDisable', 'numWin', 'virWin'],
                hide: ['aniWin', 'aniWinLight', 'nodeSpineAni'],
                ani: [{name: 'resWinAni', ani: 'begin', bloop: false}],
                opacity: [{name: 'layDisable', value: 0}],
                effect: [{url: res.IceFireEffWin1_mp3, bloop: false}]
            },
            2: {
                hide: ['virWin', 'aniWin', 'aniWinLight', 'nodeSpineAni'],
                ani: [{name: 'resWinAni', ani: 'end', bloop: false}],
                effect: [{url: res.IceFireFinishMoney_mp3, bloop: false}],
                next: 0
            },

            3: {
                show: ['aniWin'],
                hide: ['aniWinLight', 'nodeSpineAni'],
                ani: [{name: 'resWinAni', ani: 'loop', bloop: true}, {name: 'aniWin', ani: 'bigwin1', bloop: false}],
                effect: [{url: res.IceFireEffWin2_mp3, bloop: false}],
                next: 4,
                lock: false
            },
            4: {
                show: ['aniWin'],
                hide: ['aniWinLight', 'nodeSpineAni'],
                ani: [{name: 'aniWin', ani: 'bigwin2', bloop: true}],
                lock: false
            },
            5: {
                show: ['aniWin'],
                hide: ['virWin', 'aniWinLight', 'nodeSpineAni'],
                ani: [{name: 'resWinAni', ani: 'end', bloop: false}, {name: 'aniWin', ani: 'bigwin3', bloop: false}],
                effect: [{url: res.IceFireFinishMoney_mp3, bloop: false}],
                next: 0
            },

            6: {
                show: ['aniWin'],
                hide: ['aniWinLight', 'nodeSpineAni'],
                ani: [{name: 'aniWin', ani: 'superwin1', bloop: false}],
                effect: [{url: res.IceFireEffWin3_mp3, bloop: false}],
                next: 7,
                lock: false
            },
            7: {
                show: ['aniWin'],
                hide: ['aniWinLight', 'nodeSpineAni'],
                ani: [{name: 'aniWin', ani: 'superwin2', bloop: true}],
                lock: false
            },
            8: {
                show: ['aniWin'],
                hide: ['virWin', 'aniWinLight', 'nodeSpineAni'],
                ani: [{name: 'resWinAni', ani: 'end', bloop: false}, {name: 'aniWin', ani: 'superwin3', bloop: false}],
                effect: [{url: res.IceFireFinishMoney_mp3, bloop: false}],
                next: 0
            },

            9: {
                show: ['aniWin', 'aniWinLight', 'nodeSpineAni'],
                ani: [{name: 'aniWin', ani: 'megawin1', bloop: false}, {
                    name: 'aniWinLight',
                    ani: 'megawin1_xia',
                    bloop: false
                }, {name: 'aniWinSpine', ani: 'megawin_ren1', bloop: false}],
                effect: [{url: res.IceFireEffWin4_mp3, bloop: false}],
                next: 10,
                lock: false
            },
            10: {
                show: ['aniWin', 'aniWinLight', 'nodeSpineAni'],
                ani: [{name: 'aniWin', ani: 'megawin2', bloop: true}, {
                    name: 'aniWinLight',
                    ani: 'megawin2_xia',
                    bloop: true
                }, {name: 'aniWinSpine', ani: 'megawin_ren2', bloop: true}],
                lock: false
            },
            11: {
                show: ['aniWin', 'aniWinLight', 'nodeSpineAni'],
                hide: ['virWin'],
                ani: [{name: 'resWinAni', ani: 'end', bloop: false}, {
                    name: 'aniWin',
                    ani: 'megawin3',
                    bloop: false
                }, {name: 'aniWinLight', ani: 'megawin3_xia', bloop: false}, {
                    name: 'aniWinSpine',
                    ani: 'megawin_ren3',
                    bloop: false
                }],
                effect: [{url: res.IceFireFinishMoney_mp3, bloop: false}],
                next: 0
            }
        };

        //! TotalWin相关 0没有显示 1进入 2显示 3离开
        this.totalwinstatedata = {
            hide: {
                show: ['btnMaxBet', 'btnAuto', 'btnAutoStop'],
                hide: ['layDisable'],
                enable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto'],
                ani: [{name: 'resTotalWin', ani: 'a0', bloop: false}]
            },
            begin: {/*show:['layDisable'],*/
                hide: [/*'btnMaxBet','btnAuto','btnAutoStop'*/],
                disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto'],
                ani: [{name: 'resTotalWin', ani: 'a1', bloop: false}],
                next: 'show'
            },
            show: {/*show:['layDisable'],*/
                disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto'],
                ani: [{name: 'resTotalWin', ani: 'a2', bloop: false}]
            },
            end: {/*show:['layDisable'],*/
                disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto'],
                ani: [{name: 'resTotalWin', ani: 'a3', bloop: false}],
                next: 'hide'
            },
        };

        //! FreeAni 0没有开始播放 1播放动画中
        this.freeanistatedata = {
            hide: {
                hide: ['layDisable', 'nodeSuperFreeGame', 'nodeSuperFreeGame2'],
                opacity: [{name: 'layDisable', value: 0}]
            },
            show: {
                show: ['layDisable', 'nodeSuperFreeGame', 'nodeSuperFreeGame2'],
                opacity: [{name: 'layDisable', value: 180}]
            }
        };

        //! FreeResult 0没有开始播放 1播放动画中
        this.freeresultstatedata = {
            hide: {
                hide: ['layDisable', 'nodeFreeResult', 'nodeFreeResult2'],
                opacity: [{name: 'layDisable', value: 0}]
            },
            show: {
                show: ['layDisable', 'nodeFreeResult', 'nodeFreeResult2'],
                opacity: [{name: 'layDisable', value: 180}]
            }
        };

        //! FreeAddNums 0没有开始播放 1播放动画中
        this.freeaddnumsstatedata = {
            hide: {hide: ['layDisable', 'nodeFreeAddNums'], opacity: [{name: 'layDisable', value: 0}]},
            show: {show: ['layDisable', 'nodeFreeAddNums'], opacity: [{name: 'layDisable', value: 120}]}
        };

        //! FreeSelect 0没有开始播放 1播放动画中
        this.freeselectstatedata = {
            hide: {hide: ['layDisable', 'nodeFreeSelect'], opacity: [{name: 'layDisable', value: 0}]},
            show: {show: ['layDisable', 'nodeFreeSelect'], opacity: [{name: 'layDisable', value: 180}]}
        };

        //! icontips hide不显示 show显示
        this.icontipsstatedata = {
            hide: {hide: ['layTips', 'nodeTips'], opacity: [{name: 'layTips', value: 0}]},
            show: {show: ['layTips', 'nodeTips'], opacity: [{name: 'layTips', value: 120}]}
        };

        //! disconnect hide不显示 show显示
        this.disconnectstatedata = {
            hide: {hide: ['layDisconnect', 'nodeDisconnect']},
            show: {show: ['layDisconnect', 'nodeDisconnect']}
        };

        //!numwin显示透明度动画
        this.numwinstatedata = {
            0: {opacity: [{name: 'numWin', value: 255}]},
            1: {ani: [{name: 'actNumWin', ani: 'fade', data: {bopa: 255, eopa: 0, time: 0.2}}]}
        };

        //!allMoneyAni相关
        this.allmoneystatedate = {
            0: {hide: ['nodeAllMoneyAni']},
            1: {
                show: ['nodeAllMoneyAni'],
                ani: [{name: 'aniGold', ani: 'jinbi', bloop: false}, {name: 'resAllMoneyAni', ani: 'a0', bloop: false}],
                next: 0
            }
        };

        //! 点击Run按钮
        this.anirundate = {
            0: {hide: ['aniRun', 'aniRun2', 'sprRun'], show: ['btnRun']},
            1: {
                hide: ['btnRun'],
                show: ['aniRun', 'aniRun2', 'sprRun'],
                ani: [{name: 'aniRun', ani: 'xuanzhuan1', bloop: false}, {
                    name: 'aniRun2',
                    ani: 'xuanzhuan2',
                    bloop: false
                }],
                next: 0
            }
        };

        this.waitappearstatedata = {
            0: {hide: ["nodeWaitAppear1", "nodeWaitAppear2"]},
            1: {
                show: ["nodeWaitAppear1", "nodeWaitAppear2"],
                ani: [
                    {name: 'resWaitAppearAni1', ani: 'ani0', bloop: true},
                    {name: 'resWaitAppearAni2', ani: 'ani0', bloop: true},
                ],
            },
        }

        LanguageData.instance.setMapValue('coins', 30);

        //! 禁止使用自动下注
        this.autodisableddata = {
            disabled: {hide: ['btnAuto', 'btnAutoStop']},
        };

        //! 禁止修改下注
        //! 游戏rewatch相关 0没有运行 1运行中
        this.prepaiddata = {
            close: {enable: ['slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnMenu', 'btnOpenUi']},
            open: {disable: ['slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnMenu', 'btnOpenUi']},
        };

        //! 等待游戏准备就绪
        this.gamereadydata = {
            wait: {disable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnMenu', 'btnOpenUi']},
            ready: {enable: ['btnRun', 'slidCoinValue', 'btnMaxBet', 'btnBet', 'btnAuto', 'btnMenu', 'btnOpenUi']},
        };
    },
    initModule:function(){
        //!! 初始化控件
        this._init();
        //! 初始化状态
        this._addState('auto', this.autostatedata, 0);
        this._addState('run', this.runstatedata, 0);
        this._addState('winani', this.winanistatedata, 0, this._onChgWinAniState, this);
        this._addState('totalwin', this.totalwinstatedata, 'hide');
        this._addState('freeani', this.freeanistatedata, 'hide');
        this._addState('freeresult', this.freeresultstatedata, 'hide');
        this._addState('freeaddnums', this.freeaddnumsstatedata, 'hide');
        this._addState('freeselect', this.freeselectstatedata, 'hide');
        this._addState('icontips', this.icontipsstatedata, 'hide');
        this._addState('virRun', this.virrunstatedata, 0);
        this._addState('openUi', this.uistatedata, 0);
        this._addState('free', this.freestatedata, 0);
        this._addState('disconnect', this.disconnectstatedata, 'hide');
        this._addState('actNumWin', this.numwinstatedata, 0);
        this._addState('allmoneyani', this.allmoneystatedate, 0, this._onShowAllMoney, this);
        this._addState('anirun', this.anirundate, 0);
        this._addState('rewatch', this.rewatchstatedata, 0);
        this._addState('waitappear', this.waitappearstatedata, 0);

        var isygg=GamelogicMgr.instance.isYggPlatform();
        if(isygg) {
            if (!GamelogicMgr.instance.canAutoSpin()){
                this._addState('autodisabled', this.autodisableddata, 'disabled');
            }

            this._addState('prepaid', this.prepaiddata, 'close');
            this._addState('gameready', this.gamereadydata, 'wait');
        }


        this._refeshDisplay();

        //注册监听回调
        var hidenumWin = function () {
            this.setVisible('numWin', 'winani', false);
        }
        GameDataMgr.instance.addNumberValueListener('_iWin', 0, this, hidenumWin);


        var refreshui = function () {
            var slider = this.getCtrl('slidCoinValue');
            if (slider) {
                var lstCoinString = GameDataMgr.instance.getCoinValueSliderStr();
                slider.setSegmentData(lstCoinString);
            }
            GameDataMgr.instance.refreshCrashNumber();
        }
        GameDataMgr.instance.addAttriValueListener('_lstCoinRate', this, refreshui);

        var refreshsliderui = function () {
            var slider = this.getCtrl('slidCoinValue');
            if (slider) {
                var lstCoinString = GameDataMgr.instance.getCoinValueSliderStr();
                slider.setSegmentData(lstCoinString);
            }
            GameDataMgr.instance.refreshCrashNumber();
        }
        GameDataMgr.instance.addAttriValueListener('_lstCoinValue', this, refreshsliderui);
    },
});

// // yggslot.load({companyName: 'DT', renderTo: document.getElementById('pc-root')})
// //     .then(function (ret) {
// //       cc.log('ygg load', ret);
// //     })
//
// var slot = new window.PartnerConnect.SlotGame();
//
// slot.subscribeOnEvents({
//     skipSplashScreen: (...val) => {
//     console.log('skipSplashScreen ', val);
// },
// skipVideoIntro: (...val) => {
//     console.log('skipVideoIntro ', val);
// },
// setMinBet: (...val) => {
//     console.log('setMinBet ', val);
// },
// initSpin: (...val) => {
//     console.log('initSpin ', val);
// },
// pauseGame: (...val) => {
//     console.log('pauseGame ', val);
// },
// resumeGame: (...val) => {
//     console.log('resumeGame ', val);
// },
// updateBalance: (...val) => {
//     console.log('updateBalance ', val);
// },
// getBalance: (...val) => {
//     console.log('getBalance ', val);
//
//     return {
//         cash: '$ 123,456.78',
//         coins: 567,
//     };
// },
// enableAudio: (...val) => {
//     console.log('enableAudio ', val);
// },
// disableAudio: (...val) => {
//     console.log('disableAudio ', val);
// },
// getAudioVolume: (...val) => {
//     console.log('getAudioVolume ', val);
//
//     return 0.5;
// },
// stopAutoSpin: (...val) => {
//     console.log('stopAutoSpin ', val);
// },
// openGameRules: (...val) => {
//     console.log('openGameRules ', val);
// },
// closeGameSession: (...val) => {
//     console.log('closeGameSession ', val);
//
//     return true;
// },
// errorPopupOpened: (...val) => {
//     console.log('errorPopupOpened ', val);
// },
// errorPopupClosed: (...val) => {
//     console.log('errorPopupClosed ', val);
// },
// additiveExperimentalCustomGameSpecificEvent: (...val) => {
//     console.log('additiveExperimentalCustomGameSpecificEvent ', val);
// },
// });
//
// var gameEmitter = slot.getGameEventsEmitter();
// var uiComponents = undefined;
//
// // 开始加载是调用
// gameEmitter.gameLoadingStarted();
//
// // async function game() {
// //   slot
// //       .load({companyName: 'DT', renderTo: document.getElementById('pc-root')})
// //       .then((cfg) => {
// //         console.log('load ', cfg);
// //       })
// //       .catch((err) => {
// //         console.log('load ', err);
// //       });
//
// //   slot
// //       .spin({})
// //       .then((ret) => {
// //         console.log('spin ', ret);
// //       })
// //       .catch((err) => {
// //         console.log('spin ', err);
// //       });
// // }
//
// slot
//     .load({companyName: 'DreamTech', renderTo: document.getElementById('pc-root')/*, userName: 'zhs008'*/})
//     .then((cfg) => {
//         YggLogic.singleton.onConfig(cfg);
//     //console.log('load ', cfg);
// // slot
// //     .spin({amount: 6, coin: 0.2})
// //     .then((ret) => {
// //     console.log('spin ', ret);
// // })
// // .catch((err) => {
// //     console.log('spin ', err);
// // });
//     })
//     .catch((err) => {
//         console.log('load ', err);
//     });

var slot = undefined;

var gameEmitter = undefined;
var uiComponents = undefined;
var yggCurrencyFormatter = undefined;

function initSlot() {
    if(slot != undefined)
        return false;

    if(typeof(window.PartnerConnect) == 'undefined')
        return false;

    slot = new window.PartnerConnect.SlotGame();
    //objFactory = window.PartnerConnect.PreparedObjectsFactory();

    slot.subscribeOnEvents({
        skipSplashScreen: (...val) => {
            console.log('skipSplashScreen ', val);

            if(typeof(YggLogic) != 'undefined' && YggLogic.singleton)
                YggLogic.singleton.skipSplashScreen();
        },
        skipVideoIntro: (...val) => {
            console.log('skipVideoIntro ', val);
        },
        setMinBet: (...val) => {
            console.log('setMinBet ', val);
        },
        initSpin: (...val) => {
            console.log('initSpin ', val);

            if(typeof(YggLogic) != 'undefined' && YggLogic.singleton)
                YggLogic.singleton.initSpin();
        },
        pauseGame: (...val) => {
            console.log('pauseGame ', val);

            if(typeof(YggLogic) != 'undefined' && YggLogic.singleton)
                YggLogic.singleton.setCanCtrl(false);
        },
        resumeGame: (...val) => {
            console.log('resumeGame ', val);

            if(typeof(YggLogic) != 'undefined' && YggLogic.singleton)
                YggLogic.singleton.setCanCtrl(true);
        },
        updateBalance: (...val) => {
            console.log('updateBalance ', val);

            if(typeof(YggLogic) != 'undefined' && YggLogic.singleton)
                YggLogic.singleton.updateBalance(val);
        },
        getBalance: (...val) => {
            console.log('getBalance ', val);

            return {
                cash: '$ 123,456.78',
                coins: 567,
            };
        },
        enableAudio: (...val) => {
            //console.log('enableAudio ', val);

            if(typeof(YggLogic) != 'undefined' && YggLogic.singleton)
                YggLogic.singleton.enableAudio();
        },
        disableAudio: (...val) => {
            //console.log('disableAudio ', val);

            if(typeof(YggLogic) != 'undefined' && YggLogic.singleton)
                YggLogic.singleton.disableAudio();
        },
        getAudioVolume: (...val) => {
            console.log('getAudioVolume ', val);

            if(typeof(YggLogic) != 'undefined' && YggLogic.singleton)
                return YggLogic.singleton.getAudioVolume();

            return 0;
        },
        stopAutoSpin: (...val) => {
            console.log('stopAutoSpin ', val);

            // if(GameMgr.singleton.curGameLayer)
            //     GameMgr.singleton.curGameLayer.onTouchRun();
            // return ;

            // if(GameMgr.singleton.curGameLayer)
            //     GameMgr.singleton.curGameLayer.iTestTime =3;;
            // return ;

            if(typeof(YggLogic) != 'undefined' && YggLogic.singleton)
                YggLogic.singleton.stopAutoSpin();
        },
        openGameRules: (...val) => {
            console.log('openGameRules ', val);

            if(typeof(YggLogic) != 'undefined' && YggLogic.singleton)
                YggLogic.singleton.openGameRules();
        },
        closeGameSession: (...val) => {
            console.log('closeGameSession ', val);

            return true;
        },
        errorPopupOpened: (...val) => {
            console.log('errorPopupOpened ', val);

            if(typeof(YggLogic) != 'undefined' && YggLogic.singleton)
                YggLogic.singleton.setCanCtrl(false);
        },
        errorPopupClosed: (...val) => {
            console.log('errorPopupClosed ', val);

            if(typeof(YggLogic) != 'undefined' && YggLogic.singleton)
                YggLogic.singleton.setCanCtrl(true);
        },
        additiveExperimentalCustomGameSpecificEvent: (...val) => {
            console.log('additiveExperimentalCustomGameSpecificEvent ', val);
        },
        uiChanged: (...val) => {
            console.log('uiChanged ', val);
            if(val && val.length>0 && val[0] && val[0].length > 0/* && val[0][0] && val[0][0].bounds.height > 0*/) {
                YggLogic.singleton.setSlotGameSize(val);
            }
        },
        resize: (...val) => {
            console.log('resize ', val);
        },
        launchGame: (...val) => {
            console.log('launchGame ', val);
        },
        startReplay: (...val) => {
            console.log('stopReplay ', val);
        },
        stopReplay: (...val) => {
            console.log('stopReplay ', val);
        },
        willClosingGameLeaveUnfinishedGame: (...val) => {
            console.log('willClosingGameLeaveUnfinishedGame ', val);
        },
    });

    gameEmitter = slot.getGameEventsEmitter();

    gameEmitter.gameLoadingStarted();

    slot
        .load({companyName: 'DreamTech', renderTo: document.getElementById('pc-root'), deprecatedReplayReload: true/*, pcFeatures: {areEventsReplayEnabled: true}, userName: 'zhs008'*/})
        .then((cfg) => {
            YggLogic.singleton.onConfig(cfg);
        })
        .catch((err) => {
            console.log('load ', err);
        });

    return true;
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

(async function() {
    while (true) {
        if(initSlot())
            break;

        await sleep(500);
    }
})();

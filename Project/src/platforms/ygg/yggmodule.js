var slot = undefined;

var gameEmitter = undefined;
var uiComponents = undefined;

function initSlot() {
    if(slot != undefined)
        return false;

    if(typeof(window.PartnerConnect) == 'undefined')
        return false;

    slot = new window.PartnerConnect.SlotGame();

    slot.subscribeOnEvents({
        skipSplashScreen: (...val) => {
            console.log('skipSplashScreen ', val);
        },
        skipVideoIntro: (...val) => {
            console.log('skipVideoIntro ', val);
        },
        setMinBet: (...val) => {
            console.log('setMinBet ', val);
        },
        initSpin: (...val) => {
            console.log('initSpin ', val);
        },
        pauseGame: (...val) => {
            console.log('pauseGame ', val);
        },
        resumeGame: (...val) => {
            console.log('resumeGame ', val);
        },
        updateBalance: (...val) => {
            console.log('updateBalance ', val);
            GameEmitterMgr.instance.emit("ygg_updateBalance",val);
        },
        getBalance: (...val) => {
            console.log('getBalance ', val);

            return {
                cash: '$ 123,456.78',
                coins: 567,
            };
        },
        enableAudio: (...val) => {
            console.log('enableAudio ', val);
        },
        disableAudio: (...val) => {
            console.log('disableAudio ', val);
        },
        getAudioVolume: (...val) => {
            console.log('getAudioVolume ', val);

            return 0.5;
        },
        stopAutoSpin: (...val) => {
            console.log('stopAutoSpin ', val);
            GameEmitterMgr.instance.emit('msg_stopAutoSpin');
        },
        openGameRules: (...val) => {
            console.log('openGameRules ', val);
        },
        closeGameSession: (...val) => {
            console.log('closeGameSession ', val);

            return true;
        },
        errorPopupOpened: (...val) => {
            console.log('errorPopupOpened ', val);
        },
        errorPopupClosed: (...val) => {
            console.log('errorPopupClosed ', val);
        },
        additiveExperimentalCustomGameSpecificEvent: (...val) => {
            console.log('additiveExperimentalCustomGameSpecificEvent ', val);
        },
        uiChanged: (...val) => {
            console.log('uiChanged ', val);
            if(val && val.length>0 && val[0] && val[0].length > 0/* && val[0][0] && val[0][0].bounds.height > 0*/) {
                GameEmitterMgr.instance.emit('ygg_setSlotGameSize',val);
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
        .load({companyName: 'DreamTech', renderTo: document.getElementById('pc-root')/*, userName: 'zhs008'*/})
        .then((cfg) => {
            GameEmitterMgr.instance.emit('msg_onConfig',cfg);
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

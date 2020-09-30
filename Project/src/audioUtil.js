var AudioUtil = {
    isMusic : false,
    isEffect : false,
    playEffect : function (url, loop) {
        var audio = undefined;
        if (AudioUtil.isEffect) {
            if (url) {
                audio = cc.audioEngine.playEffect(url, loop);
            } else {
                cc.warn("playEffect " + url);
            }
        }
        return audio;
    },

    isMusicPlaying : function () {
        return cc.audioEngine.isMusicPlaying();
    },

    playMusic : function (url, loop) {
        if (AudioUtil.isMusic) {
            if (url) {
                cc.audioEngine.playMusic(url, loop);
            } else {
                cc.warn("playMusic " + url);
            }
        }
    },

    setMusicVolume : function (volume) {
        cc.audioEngine.setMusicVolume(volume);
    },

    setEffectsVolume : function (volume) {
        cc.audioEngine.setEffectsVolume(volume);
    },

    getMusicVolume : function () {
        return cc.audioEngine.getMusicVolume();
    },

    getEffectsVolume : function () {
        return cc.audioEngine.getEffectsVolume();
    },

    stopMusic : function (releaseData) {
        cc.audioEngine.stopMusic(releaseData);
    },

    pauseMusic : function () {
        cc.audioEngine.pauseMusic();
    },

    resumeMusic : function () {
        cc.audioEngine.resumeMusic();
    },

    rewindMusic : function () {
        cc.audioEngine.rewindMusic();
    },

    pauseEffect : function (audio) {
        cc.audioEngine.pauseEffect(audio);
    },

    pauseAllEffects : function () {
        cc.audioEngine.pauseAllEffects();
    },

    resumeEffect : function (audio) {
        cc.audioEngine.resumeEffect(audio);
    },

    resumeAllEffects : function () {
        cc.audioEngine.resumeAllEffects();
    },

    stopEffect : function (audio) {
        cc.audioEngine.stopEffect(audio);
    },

    stopAllEffects : function () {
        cc.audioEngine.stopAllEffects();
    },

    unloadEffect : function (url) {
        cc.audioEngine.unloadEffect(url);
    }
};
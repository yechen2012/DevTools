var TextManager = function () {
    this.commonTexts = undefined;
    this.defaultCommonTextPath = res.CommonStrings_json;
    this.defaultCommonFontName = "Ubuntu_M";
    this.gameTexts = undefined;
    this.defaultGameTextPath = undefined;
    this.defaultGameFontName = "Ubuntu_M";

    this.setDefaultCommonTextPath = function (path) {
        this.defaultCommonTextPath = path;
    };

    this.getCommonText = function (text) {
        if (!this.commonTexts) {
            this.commonTexts = cc.loader.getRes(this.defaultCommonTextPath);
        }
        if (this.commonTexts) {
            return this.commonTexts[text]["fontString"];
        } else {
            return undefined;
        }
    };

    this.getCommonFontName = function (text) {
        if (!this.commonTexts) {
            this.commonTexts = cc.loader.getRes(this.defaultCommonTextPath);
        }
        if (this.commonTexts) {
            return this.commonTexts[text]["fontName"] || this.defaultCommonFontName;
        } else {
            return this.defaultCommonFontName;
        }
    };

    this.setDefaultCommonFontName = function (fontName) {
        this.defaultCommonFontName = fontName;
    };

    this.setDefaultGameTextPath = function (path) {
        this.defaultGameTextPath = path;
    };

    this.getGameText = function (text) {
        if (!this.gameTexts) {
            this.gameTexts = cc.loader.getRes(this.defaultGameTextPath);
        }
        if (this.gameTexts) {
            return this.gameTexts[text]["fontString"];
        } else {
            return undefined;
        }
    };

    this.setDefaultGameFontName = function (fontName) {
        this.defaultGameFontName = fontName;
    };

    this.getGameFontName = function (text) {
        if (!this.gameTexts) {
            this.gameTexts = cc.loader.getRes(this.defaultGameTextPath);
        }
        if (this.gameTexts) {
            return this.gameTexts[text]["fontName"] || this.defaultGameFontName;
        } else {
            return this.defaultGameFontName;
        }
    };

};
var textManager = new TextManager();
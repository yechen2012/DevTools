var g_resources = [];

function pushres() {
    if(typeof(GameAssistant) == 'undefined' || !GameAssistant.singleton.bNative) {
        for (var i in res) {
            if(typeof(cc) != 'undefined' && typeof(cc.loader) != 'undefined' && typeof(cc.loader._fixUrl) != 'undefined')
                res[i] = cc.loader._fixUrl(res[i]);

            g_resources.push(res[i]);
        }
    }
    if(cc.sys.isMobile && !cc.sys.isNative && typeof(isFullscreen) != 'undefined' && isFullscreen()){
        setTimeout(function () {
            StartFullScreen();
        },10);
    }
}


/*****
 ******
 ****** android and ios safari 下全屏
 ******
 ******/
//只在手机浏览器下
if(cc.sys.isMobile && !cc.sys.isNative) {

    var GameParam=(function(){
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    })()

    //屏幕旋转是否监听了
    var isscreenlistener = false;
    //特殊界面不现实全屏动画
    var isinspecialview = false;
    var ua=navigator.userAgent;
    var system={
        win:false,
        mac:false,
        x11:false,
        //mobile
        iphone:false,
        ipad:false,
        ios:false,
        android:false,
        winMobile:false
    };
    var p=navigator.platform;
    system.win=p.indexOf('Win')==0;
    system.mac=p.indexOf('Mac')==0;
    system.x11=(p=='x11')||(p.indexOf('Linux')==0);
    system.iphone=ua.indexOf('iPhone')>-1;
    system.ipad=ua.indexOf('iPad')>-1;
    system.android=ua.indexOf('Android')>-1;

    var d = document;
    var isshow = false;
    if(d.fullscreenEnabled || d.mozFullScreenEnabled || d.webkitFullscreenEnabled || d.msFullscreenEnabled){
        cc.log("有一个为true");
        isshow = true;
    }else{
        isshow = false;
        cc.log("一个都不为true");
    }

    //vivo浏览器不使用全屏
    function isVivoBroeser(){
        var dInfo = window.navigator.userAgent;
        var keyindex = dInfo.indexOf("VivoBrowser");
        if(keyindex == -1){
            return false;
        }else{
            return true;
        }
    }

    //安卓，苹果手机全屏处理方法
    function StartFullScreen(){

        if(system.android && GameParam.clientType != 1 && isshow){
            if(cc.screen.fullScreen()){
                HideFullScreenOrgin();
            }else{
                ShowFullScreenOrgin();
            }
            addFullScreen();
        }
        if(system.iphone && GameParam.clientType != 1){
            var _size = cc.view.getFrameSize();
            cc.view.setFrameSize(_size.width,_size.height + 1);
            document.body.scrollTop = 0;
            addFullScreen();
        }
    }

    //监听屏幕的朝向
    function addFullScreen() {
        if(!isscreenlistener){
            isscreenlistener = true;
        }else {
            return;
        }
        var evt = "onorientationchange" in window ? "orientationchange" : "resize";
        window.addEventListener(evt, function(){
            setTimeout(function(){
                resize();
            },1)
        }, false);
    }
    //屏幕横竖屏切换及全屏点击后的回调
    function resize(fals) {
        if (window.orientation == 0 || window.orientation == 180) {
            if (system.android && GameParam.clientType != 1 && isshow) {
                show_android_screen(cc.screen.fullScreen());
            } else if (system.iphone && GameParam.clientType != 1) {
                //竖屏不做任何处理
                var _size = cc.view.getFrameSize();
                cc.view.setFrameSize(_size.width,_size.height + 1);
                document.body.scrollTop = 0;
            }
        } else {
            //横屏下调用方法
            if (system.android && GameParam.clientType != 1 && isshow) {
                show_android_screen(cc.screen.fullScreen());
            } else if(system.iphone && GameParam.clientType != 1){
                var _size = cc.view.getFrameSize();
                cc.view.setFrameSize(_size.width,_size.height/3);
                document.body.scrollTop = 0;
            }
        }
    }

    function show_android_screen(is_screen) {
        if(!is_screen){
            setTimeout(function () {
                ShowFullScreenOrgin();
            },301);
        }else{
            HideFullScreenOrgin();
        }
    }

    function requestFullScreen() {
        cc.screen.requestFullScreen('', function () {
            //全屏点击后的回调
            resize(true);
        });
    }

    var isIphoneFullScreen = false;

    (function addResizeListener() {
        if (system.android) {
            return;
        }
        setTimeout(function () {
            isIphoneFullScreen = isFullScreenEx();
        },1000);
        window.addEventListener('resize', function () {
            setTimeout(function () {
                isIphoneFullScreen = isFullScreenEx();
            }, 300)
        }, false);
    })()

    //在普通状态下为非全屏时，增加一条判断方法
    function isFullScreenEx() {
        var isFull = false;
        var div = document.getElementsByTagName("div");
        var cocosdiv = null;
        if(div){
            for(var i = 0; i < div.length; i++){
                if(div[i].id == "Cocos2dGameContainer"){
                    cocosdiv = div[i];
                    return parseInt(cocosdiv.style.height) === window.screen.width;
                }
            }
        }
        return false;
    }
}

var FullScreenOrgin = ccui.Layout.extend({
    isLayerOn : false,
    spCircle : null,
    spArrow : null,
    spHand : null,
    actCircle : null,
    actArrow : null,
    actHand : null,
    safeLock : false,
    ctor : function()
    {
        this._super();
        var framesize = cc.view.getFrameSize();
        var viewPortRect = cc.view.getViewPortRect();
        var designsize = cc.view.getDesignResolutionSize();
        cc.log("framesize",framesize.width,framesize.height);
        cc.log("viewPortRect",viewPortRect.x,viewPortRect.y,viewPortRect.width,viewPortRect.height);
        cc.log("designsize",designsize.width,designsize.height);
        var scenesize = cc.director.getRunningScene();
        cc.log("scenesize",scenesize.width,scenesize.height);
        var width = Math.max(framesize.width,viewPortRect.width,designsize.width,scenesize.width);
        var height = Math.max(framesize.height,viewPortRect.height,designsize.height,scenesize.height);
        cc.log("最终",framesize.width,framesize.height);
        this.setContentSize(cc.size(framesize.width,framesize.height));
        //if(GameParam.isOldResolution) this.setScale(1.5);
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setBackGroundColor(cc.color(0,0,0));
        this.setBackGroundColorOpacity(190);
        this.setTouchEnabled(true);
        this._clickEventListener = this.OnClick;
        this.setName("FullScreenOrgin");
        this.aninode = new cc.Node();
        this.aninode.setAnchorPoint(0.5,0.5);
        this.aninode.setScale(0.5);
        this.addChild(this.aninode);
        //cc.director._runningScene.addChild(this, 10);
    },

    // AddSp : function(str, sx, sy, ax, ay, x, y) {
    //     var queue = cc.sequence; var combo = cc.spawn; var delay = cc.delayTime; var callf = cc.callFunc;
    //     var move = cc.moveTo; var fade = cc.fadeTo; var scale = cc.scaleTo; var inout = cc.easeSineInOut;
    //     var self = this;
    //     cc.loader.loadImg(str, {isCrossOrigin : false }, function(err, img){

    //         var texture2d = new cc.Texture2D();
    //         texture2d.initWithElement(img);
    //         texture2d.handleLoadedTexture();
    //         var sp = new cc.Sprite(texture2d);
    //         sp.setScale(sx, sy);
    //         sp.setAnchorPoint(ax, ay);
    //         sp.setPosition(x, y);
    //         sp.setOpacity(190);
    //         self.addChild(sp);
    //         if(str == iArrow){
    //             self.spArrow = sp;
    //             self.actArrow = queue(move(0.3, 640, 213).easing(inout()), move(0.1, 640, 178), delay(0.5)).repeatForever();
    //             // self.spArrow.runAction(self.actArrow);
    //         }

    //         if(str == iHand){
    //             self.spHand = sp;
    //             var handReset = function(){self.spHand.setPositionY(0); self.spHand.setOpacity(190);};
    //             var temp0 = combo(move(0.9, 655, 44).easing(inout()), queue(delay(0.6), fade(0.3, 0)));
    //             self.actHand = queue(callf(handReset), temp0, delay(0.6)).repeatForever();
    //             // self.spHand.runAction(self.actHand);
    //         }

    //         if(str == iCircle){
    //             self.spCircle = sp;
    //             var circReset = function(){self.spCircle.setPositionY(93); self.spCircle.setOpacity(190); self.spCircle.setScale(1 * 0.48125);};
    //             var temp1 = combo(move(0.9, 639, 137), scale(0.9, 1.5 * 0.48125)).easing(inout());
    //             var temp2 = combo(temp1, queue(delay(0.6), fade(0.3, 0)));
    //             self.actCircle = queue(callf(circReset), temp2, delay(0.6)).repeatForever();
    //             // self.spCircle.runAction(self.actCircle);
    //         }

    //         if(self.spArrow && self.spHand && self.spCircle){
    //             self.spArrow.runAction(self.actArrow);
    //             self.spHand.runAction(self.actHand);
    //             self.spCircle.runAction(self.actCircle);
    //         }

    //         self.isLayerOn = true;
    //         self.setVisible(true);
    //     });
    // },

    AddSp : function(str, sx, sy, ax, ay, x, y) {
        var queue = cc.sequence; var combo = cc.spawn; var delay = cc.delayTime; var callf = cc.callFunc;
        var move = cc.moveTo; var fade = cc.fadeTo; var scale = cc.scaleTo; var inout = cc.easeSineInOut;
        var self = this;
        cc.loader.loadImg(str, {isCrossOrigin : false }, function(err, img){

            var texture2d = new cc.Texture2D();
            texture2d.initWithElement(img);
            texture2d.handleLoadedTexture();
            var sp = new cc.Sprite(texture2d);
            sp.setScale(sx, sy);
            sp.setAnchorPoint(ax, ay);
            sp.setPosition(x, y);
            sp.setOpacity(190);
            self.aninode.addChild(sp);
            var size = cc.view.getFrameSize();
            var sizeheithtA1 = 0, sizeheithtA2 = 0;
            var sizeheithtH1 = 0, sizeheightH2 = 0;
            var sizeheithtC1 = 0, sizeheightC2 = 0;
            if(size.width > size.height){
                sizeheithtA1 = size.height*0.45, sizeheithtA2 = size.height*0.35;
                sizeheithtH1 = size.height*0.05, sizeheightH2 = 0;
                sizeheithtC1 = size.height*0.35, sizeheightC2 = 0;
            }else{
                sizeheithtA1 = size.height*0.3, sizeheithtA2 = size.height*0.2;
                sizeheithtH1 = size.height*0.05, sizeheightH2 = 0;
                sizeheithtC1 = size.height*0.21, sizeheightC2 = 0;
            }
            if(str == iArrow){
                self.spArrow = sp;
                self.actArrow = queue(move(0.3, x, sizeheithtA1).easing(inout()), move(0.1, x, sizeheithtA2), delay(0.5)).repeatForever();
                // self.spArrow.runAction(self.actArrow);
            }

            if(str == iHand){
                self.spHand = sp;
                x = size.width+sp.width*0.14;
                sp.setPosition(x,y)
                var handReset = function(){self.spHand.setPositionY(0); self.spHand.setOpacity(190);};
                var temp0 = combo(move(0.9, x, sizeheithtH1).easing(inout()), queue(delay(0.6), fade(0.3, 0)));
                self.actHand = queue(callf(handReset), temp0, delay(0.6)).repeatForever();
                // self.spHand.runAction(self.actHand);
            }

            if(str == iCircle){
                self.spCircle = sp;
                var circReset = function(){self.spCircle.setPositionY(93); self.spCircle.setOpacity(190); self.spCircle.setScale(1 * 0.48125);};
                var temp1 = combo(move(0.9, x, sizeheithtC1), scale(0.9, 1.5 * 0.48125)).easing(inout());
                var temp2 = combo(temp1, queue(delay(0.6), fade(0.3, 0)));
                self.actCircle = queue(callf(circReset), temp2, delay(0.6)).repeatForever();
                // self.spCircle.runAction(self.actCircle);
            }

            if(self.spArrow && self.spHand && self.spCircle){
                self.spArrow.runAction(self.actArrow);
                self.spHand.runAction(self.actHand);
                self.spCircle.runAction(self.actCircle);
            }

            self.isLayerOn = true;
            self.setVisible(true);
        });
    },

    show : function() {
        var size = cc.view.getFrameSize();
        var sizewidth1 = 0;
        var sizeheight1 = 0;
        var sizewidth2 = 0;
        var sizeheight2 = 0;
        var sizewidth3 = 0;
        var sizeheight3 = 0;
        if(size.width > size.height){
            sizewidth1 = size.width, sizeheight1 = size.height*0.4;
            sizewidth2 = size.width, sizeheight2 = size.height*0;
            sizewidth3 = size.width, sizeheight3 = size.height*0.3;
        }else{
            sizewidth1 = size.width, sizeheight1 = size.height*0.3;
            sizewidth2 = size.width, sizeheight2 = size.height*0;
            sizewidth3 = size.width, sizeheight3 = size.height*0.15;
        }

        this.AddSp(iArrow, 0.60156, 0.50654, 0.5, 0, sizewidth1, sizeheight1); //to 213 Sine.easeInOut
        this.AddSp(iHand, 0.58327, 0.58677, 0.5, 0, sizewidth2, sizeheight2);    //to 44 Sine.easeInOut  opa 5 to 0
        this.AddSp(iCircle, 0.48125, 0.48125, 0.5, 0.5, sizewidth3, sizeheight3);       //to 128 Sine.easeInOut  opa 5 to 0  scale to 1.5
    },

    // show : function() {
    //     this.AddSp(iArrow, 0.60156, 0.50654, 0.5, 0, 640, 178); //to 213 Sine.easeInOut
    //     this.AddSp(iHand, 0.58327, 0.58677, 0.5, 0, 655, 0);    //to 44 Sine.easeInOut  opa 5 to 0
    //     this.AddSp(iCircle, 0.48125, 0.48125, 0.5, 0.5, 639, 93);       //to 128 Sine.easeInOut  opa 5 to 0  scale to 1.5
    // },

    hide : function(){
        if(this.spArrow)
            this.spArrow.stopAllActions();
        if(this.spHand)
            this.spHand.stopAllActions();
        if(this.spCircle)
            this.spCircle.stopAllActions();
        this.spArrow = null;
        this.spHand = null;
        this.spCircle = null;
        this.safeLock = true;
        this.isLayerOn = false;
        this.setVisible(false);
        this.removeFromParent(true);
    },

    OnClick : function() {
        requestFullScreen();
    }


});
var iCircle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAQAAAAkGDomAAAC5klEQVR4Ae3aJ4zzSBjG8RdZivSVLVHQkMBlCecKNdvOjIOiKJzrOgtXYOjXAq+EXa+WBhgabble/tfvZiY9LjNXftzdzztViqFJjz5vMOMTcm6A78hJeZcZb9CnR1N8oEHMy7zLNt7lZWIaUhd6TPiSXX3JhJ5Uiwf00RSh6fOgqo86IKcMOcPSPzhnaMqkOZOy0OYJVXhCW4rjihvWSZkwIqaL4sEff6qiS8yICSnr3HBV9L8bs9qMBCUboEiYsdp47/+RFm+xXMYQJTtAMSRjubdo7ffnpSyTkhDJHohIVp6zLbvhhAwX3DAgkgKIGHCDCzJOdnt7GS6YoqQEKKa4IKO9fQcgxfUliZSIhC9xpTS3+whzXJqOlIwOGtecSDZhjOtdlFSAFu/iGm8uy645B1IRDpjjulofjhts73IgFeKAd7HdrAkLT7BlKKkYigzbk9U9FtuXdKUGdPgS2/nydldjS6QmJNg0DXExxDaVGjHFNhQbD8gx3aCkRignnjkPxEQf20BqxgBbX0xoTCmR1IyIFJO2B5LF41F6VIxBKhNMGZF4QESGafJ3gfnSSZAnDDF9+UdQiDF9R0s8ocV3mOJl/Zcn4hFPlvRtSJcHJICgpCJCC5sSj1DYWm6J0eIZqVNqGDnR9owJppEbkZF4xsiJCTMn2J4RY5oJn2Dqimd0MX0i5Jja4hkKUy7cYGqKZzzAdCPYIvEOi/Bd6DeYh/6JdegheTfwMhN+oQ6tqRtiGoffWQi/uxV6hzX4Ln/4g6bwh508CHzgHvzUR/iTR+FPv4U/gRnkFHDwk+jhL0O4OMf2JR3PCzkunmDTNKViNNHYnoS/mLga196XY693X9D+EFVRafkQ13i/LQFZJVsCMlxzGsFvqiiwLUVKVGBbirOxp64bzDgp/AtLiUqJIQe8VcsNvrV3ISPijcpv8A0iKYKYm8pu8Ia4xC2iUiJni2hxnKOlRGjOpVw0/J/tf//z4WcejisfTUX27QAAAABJRU5ErkJggg==";
var iArrow = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABMCAQAAAB3onkuAAACFklEQVR4AcTOpUKDUQBA4RXcpa2t4A4Fd0t4W1pcWturLa4t/hH3hLvDoeB6/X4vcE5ID0mSIX9IAJDwlY/zKu4jH+OjmOt8lAc+eiDqMr/AA189sOAqP80tP7ll2kV+klt+c8uk7fww1/zlmlGb+T4u+c8lfbbyXVwi4pIuG/kOThB1QofpfAvHyDimxWS+nn1k7VNvKl/NPir2qTaRj7CLql0i+vltdGxrLRBmHV3rhNXzS5iwpLRAJUuYskSlfD7ApEBqgRICTAsoEc9nsCEjtEA+aWxJk28zr79ANilsS/Hcjl0jRAxGURS+6MZwVoJUdOnw7u/S4R3eZT0sAHeHO9W4HbR6t5xJ8r76DLY/X5jshPzTYUVLgvt8bLLkabfbtJPJjt3XfH6PnZc6ASRI2CsTyud3TLYqdQNIXjXZTg3B6yZbkAhA8oLJ1svnc5NlEgVIzkyWS3LC5zmAE5JMNidhQG09ACOAWYkDGgvCzwHTEgewZzngvTY8cEBDyHjnAIPogAG1MQMAyHkO4IQygPcOCABNpQzgrYMDeFcRP88AXQgA8ORJ6dcB5bzz1A3w4FHprwCSR/3QCfDgYelnAFCZ6gjidYcDeGmqBdzCsgMAoDbdNgKu6XkGAITrWsAVj0oUAKLXVRlwxoMSB6DwdWaLn5c4gBPEWxYH8PHrHPDzBSAAAQhAAAIQgAAEIAAB+F9ACcOignwzKE+KAAAAAElFTkSuQmCC";
var iHand = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAACqCAMAAABGbusNAAAAsVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+3mHKcAAAAOnRSTlMAeEvxLfrd7mZUD8MF6wvM9TQWWx+0rkQaKZiTCG3g2LdjQBMC07+HfHJQPMinoZx1y7qMJObQgOJYfKQYiQAABM9JREFUeAHt3IVy8koAxfEDYdEQnOLuTr3n/d/rCrsp2fmgt9DsXstvNGP/uCe4ptqtJx3SSdZiTdhQqjEgF4dp2R2pGzRgVLPPX+TXMCiR5wXFEYwpv/OiYgKmPPKKfgdmfPBMJF/zPHuDEW6Svk3GA/A8d6g4Y5jwQEUsoVQLVJYwoUUljU/ZKaUjTHihtENAU1AaI3wNKlUE7SmNEL41pQ00I0pDhC9OqQ2NR6lrMLmArsiTmMFkDDonSkbJKBklo2SUjJJRMkpGySgZJaNklPzXJ93mQybzkOjYSo6XM8ETsYk1bCSnRQaIVtlw8oJUxmpSmuNPk9F89l6kyB/3H57ZpGy66T7Piu2G4SQr6z51Ttdwsij4i7oXajK5WFeb8bbDr+S88JJi6eJkvOVX6qElRRyfnviVZVjJA84mjwwSyUKSZ8VGOMm+i4Amz3rpMYDy8oW+VjjJAzQ5+nYdSN6WSjEbSnINzeLSFNWpVEJJjqEZUpq6OPN6gScC2dHwEIt14427k1loKpQyCEpTmnbSOfr6i0aYScdFUFbwRLwwqPjkhZfMQdfnZclSaMkadDleUVxZT1KMrCeZqlpPcmY8KR4PH5nlQPDT6rvJHv8kOtCs/yo5a+LkeUDf8bvJN/5pD93kyD8driW3Lnxz+hLfTE7mgqx3AF35kRRvuJLsezjbUll8IylVVyVckMhUcS2ZQUCjSGlwPXk/lXQ6CNpR6hlM5qD5oFQ0mKxDU6JiIjngyRaahMlklycti0m3TpKbssUkJpV6bejCZlKKklEyDFGyEXu1m0xsBWkzWd5RspaMp2g5uaRuaDx5oG7aMZ3MUPMyH8NwsurwTOxLkEwmB4FgqwqYT8apX0NYSOb0NzctJEtUxAqWkm0qQ9hKvlMawFaySaVkLZmmVICtZLwMqQFrZpRW1qYSSUpNe8kUpbG9JJWO/aRrLykole0vy2d7yT6lkq2kgxmluK1kD3tKBxhWovSKA6U9DHugNMPoM25YhVIdWVtbyYFSG9hQqsCsNqUF8EZpC7MG50lb60/ijOlRKgGTPKU0TPKolAMzeWNlsywGB7iGQUPtCcKUUg0GtbRdTpdKAuYUtG99vLz5ycwK/SOqN/NLM05JZHFSLhpfaZ8ovUJ5Mn4pNKXUhjJ2KKXKMKJK5QO+BZUdjEhTaWgvA0hxo5+uTnGWofIyRvjGgtITAgZU6gb3dhwhoOpQ6Zq7vMu7l5ewKBlbX/dXFjGTWYRrQeUBumqKSm2CME162nwNWhn6AnpFpX35mCZVEKLBFwfHTsHEKpSgUsAF1TyV/DPCsqOSxiUPgkqyjHBUBaWUh4u69G2yCEWbyhOuaNE38xCCcpGSqOIKd0BfzQ1zIne4ytvQV/9581lQaeK68jTE5pbKFl9pvIfWLFERz/hSM09frYMfmByptG74r8ejF8YpT6qMG5rHMu5VTlHpArc0k03cqU5l6uK2prPCXbr0jYAbm2x3cLuhoLLHNzVf+Klfwo28Nn29LL7rOclP4snDDRqLPG+crVKjwLOX7oMvoxmmg5ax2KL1yoAn3MKr8cdyLm4ymfOH8g3cauXwJ5wSbvd85P3eE7hHZ857PTZwp3WP9+hVcL9si76UJp/U9Atn9dUEF/0O4PZVRNGliKoAAAAASUVORK5CYII=";
FullScreenOrgin.create = function(){
    FullScreenOrgin.it = new FullScreenOrgin();
    return FullScreenOrgin.it;
};

function ShowFullScreenOrgin() {
    if(isVivoBroeser()){
        return;
    }
    HideFullScreenOrgin();
    if(isinspecialview){
        return;
    }
    if(cc.director.getRunningScene()){
        var layer = FullScreenOrgin.create();
        cc.log("foripade    LoadingLayer");
        //if(!cc.director.getRunningScene().getChildByName("loadinglayer"))
            cc.director.getRunningScene().addChild(layer,998);
        layer.show();
    }
}

function HideFullScreenOrgin() {
    if(cc.director.getRunningScene()){
        var layer = cc.director.getRunningScene().getChildByName("FullScreenOrgin");
        if(layer){
            layer.hide();
        }
    }

}






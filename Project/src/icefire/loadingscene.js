/**
 * Created by chowray on 16/5/28.
 */

var LoadingScene = cc.Scene.extend({
    /**
     * Contructor of cc.LoaderScene
     * @returns {boolean}
     */
    init : function(){
        //! 节点一些状态的时长
        this.lstnodetime = [0, 0.3, 1.5, 0.1, 0];
        this._curFrameSize = cc.size(0, 0);

        this._lstTexture = [];
        this._iWaitImgNums = LoadingScene._lstPicture.length;

        var self = this;

        this._bgLayer = new cc.LayerColor(cc.color(0, 0, 0, 255));
        this.addChild(this._bgLayer, 0);

        //! 载图
        for(var ii = 0; ii < LoadingScene._lstPicture.length; ++ii) {
            cc.loader.loadImg(LoadingScene._lstPicture[ii], {isCrossOrigin : false}, function(err, img){
                self._onLoadImg(img);
            });
        }

        this.bLoadEnd = false;
        return true;
    },

    _onLoadImg : function (img) {
        var src = img.src;
        var index = -1;

        for(var ii = 0; ii < LoadingScene._lstPicture.length; ++ii) {
            if(src == LoadingScene._lstPicture[ii]) {
                index = ii;
                break;
            }
        }

        if(index < 0)
            return ;

        while(index >= this._lstTexture.length) {
            this._lstTexture.push(undefined);
        }

        var texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();

        this._lstTexture[index] = texture2d;
        --this._iWaitImgNums;

        if(this._iWaitImgNums <= 0)
            this._initStage();
    },

    _initStage: function () {
        //! 根节点
        this.nodeStage = new cc.Node();
        this._bgLayer.addChild(this.nodeStage);

        var fsize = cc.view.getFrameSize();
        //this.nodeStage.setPosition(fsize.width / 2, fsize.height / 2);
        this.nodeStage.setPosition(640, 360);

        //! LOGO
        var texture2d = this._lstTexture[0];
        this.sprLogo = new cc.Sprite(texture2d);
        this.nodeStage.addChild(this.sprLogo, 1);
        this.sprLogo.setPosition(10, 52);

        //! YGG
        texture2d = this._lstTexture[5];
        this.sprYGG = new cc.Sprite(texture2d);
        this._bgLayer.addChild(this.sprYGG, 1);
        this.sprYGG.setPosition(640, 60);

        //! 遮挡层
        var bw = 400 - 8;
        var bh = 300 - 8;

        this.layBack = new ccui.Layout();
        this.layBack.setAnchorPoint(0.5, 0.5);
        this.layBack.setContentSize(bw, bh);
        this.layBack.setClippingEnabled(true);
        this.layBack.setPosition(10, 52);
        this.nodeStage.addChild(this.layBack);

        //! 白色底层
        this.layWhite = new ccui.Layout();
        this.layWhite.setAnchorPoint(0.5, 0.5);
        this.layWhite.setContentSize(bw, bh);
        this.layWhite.setPosition(bw / 2, bh / 2);
        this.layWhite.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.layWhite.setBackGroundColor(cc.color(255, 255, 255));
        this.layBack.addChild(this.layWhite);

        //! 蓝色层
        texture2d = this._lstTexture[3];
        this.sprBlue = new cc.Sprite(texture2d);
        this.sprBlue.setAnchorPoint(1, 0);
        this.sprBlue.setPosition(bw, 0);
        this.layBack.addChild(this.sprBlue, 1);

        //! 黑色层
        texture2d = this._lstTexture[4];
        this.sprBlack = new cc.Sprite(texture2d);
        this.sprBlack.setAnchorPoint(1, 0);
        this.sprBlack.setPosition(bw, 0);
        this.layBack.addChild(this.sprBlack, 2);

        //! 小点
        this.nodeProNode = new cc.Node();
        this.nodeStage.addChild(this.nodeProNode);
        //this.nodeProNode.setVisible(false);

        this.lstProNode = [];

        var bx = -162;
        var by = -157;

        var ctextrue = this._lstTexture[2];
        var btextrue = this._lstTexture[1];

        for(var ii = 0; ii < 10; ++ii) {
            var pnode = {};

            pnode.sprBack = new cc.Sprite(btextrue);
            this.nodeProNode.addChild(pnode.sprBack);
            pnode.sprBack.setPosition(bx, by);

            pnode.sprNode = new cc.Sprite(ctextrue);
            this.nodeProNode.addChild(pnode.sprNode, 1);
            pnode.sprNode.setPosition(bx, by);

            pnode.state = 0;        //! 0不显示 1出现中 2旋转中 3停止中 4显示
            pnode.delay = 0;
            pnode.time = this.lstnodetime[pnode.state];
            pnode.index = this.lstProNode.length;

            this.lstProNode.push(pnode);
            this._refreshProNode(pnode);

            bx += 36;
        }

        this.iCurPerent = 0;
        this.iProNodeIndex = -1;

        //this.iTest = 0;

        this.iState = 0;        //! 0显示logo
        this.iTime = 0;

        this.lstblackpos = [bw, bw+180, bw+406];
        this.lstblacktime = [0, 4/24, 14/24];

        this.lstbluepos = [bw, bw+286, bw+618];
        this.lstbluetime = [7/24, 14/24, 25/24];

        this.scheduleUpdate();
    },

    update : function(dt) {
        //! 分辨率变化
        var fsize = cc.view.getFrameSize();

        if(fsize.width != this._curFrameSize.width || fsize.height != this._curFrameSize.height) {
            this._curFrameSize = fsize;

            if(this.nodeStage) {
                this.nodeStage.setPositionX(fsize.width / 2);
                this.nodeStage.setPositionY(fsize.height / 2);

                var minsize = fsize.width;

                if(fsize.height < fsize.width)
                    minsize = fsize.height;

                var nscale = minsize / 720;

                if(nscale > 1)
                    nscale = 1;

                this.nodeStage.setScale(nscale);
                //this.sprYGG.setPosition(0, -fsize.height / 2 * nscale);
                this.sprYGG.setPosition(fsize.width / 2, 60 * nscale);
                this.sprYGG.setScale(nscale);
            }

            cc.view.setDesignResolutionSize(fsize.width, fsize.height, cc.ResolutionPolicy.SHOW_ALL);;
        }

        //! LOGO
        if(this.iState == 0) {
            this.iTime += dt;

            //! 黑色
            var blen = this.lstblacktime.length;

            if(this.iTime >= this.lstblacktime[blen - 1]) {
                this.sprBlack.setVisible(false);
            }
            else {
                this.sprBlack.setVisible(true);

                if(this.iTime >= this.lstblacktime[0]) {
                    for(var ii = 0; ii < blen - 1; ++ii) {
                        if(this.iTime >= this.lstblacktime[ii] && this.iTime < this.lstblacktime[ii + 1]) {
                            var bt = this.lstblacktime[ii];
                            var et = this.lstblacktime[ii + 1];
                            var bp = this.lstblackpos[ii];
                            var ep = this.lstblackpos[ii + 1];

                            this.sprBlack.setPositionX(bp + (ep - bp) * (this.iTime - bt) / (et - bt));
                            break;
                        }
                    }
                }
            }

            //! 蓝色
            blen = this.lstbluetime.length;

            if(this.iTime >= this.lstbluetime[blen - 1]) {
                this.sprBlue.setVisible(false);
            }
            else {
                this.sprBlue.setVisible(true);

                if(this.iTime >= this.lstbluetime[0]) {
                    for(var ii = 0; ii < blen - 1; ++ii) {
                        if(this.iTime >= this.lstbluetime[ii] && this.iTime < this.lstbluetime[ii + 1]) {
                            var bt = this.lstbluetime[ii];
                            var et = this.lstbluetime[ii + 1];
                            var bp = this.lstbluepos[ii];
                            var ep = this.lstbluepos[ii + 1];

                            this.sprBlue.setPositionX(bp + (ep - bp) * (this.iTime - bt) / (et - bt));
                            break;
                        }
                    }
                }
            }

            if(!this.sprBlack.isVisible() && !this.sprBlue.isVisible())
                this.iState = 1;
        }

        for(var ii = 0; ii < this.lstProNode.length; ++ii) {
            var pnode = this.lstProNode[ii];
            this._updateProNode(dt, pnode);
        }

        // var add = Math.random() * 0.1;
        // this.iTest += add;
        //
        // if(this.iTest > 100)
        //     this.iTest = 100;
        //
        // this.onPerecnt(this.iTest);

        //! 结束
        if(this.bLoadEnd) {
            var temp=GamelogicMgr.instance.isNoCofig();
            if(temp){
                return ;
            }

            if (this.cb) {
                this.bLoadEnd = false;
                this.cb.call(this.target);
            }
        }
    },

    _updateProNode : function (dt, pnode) {
        if(dt <= 0)
            return ;

        var lt = dt;

        if(pnode.delay > 0) {
            pnode.delay -= lt;

            if(pnode.delay > 0)
                return ;

            lt = -pnode.delay;
        }

        if(pnode.state == 0 || pnode.state == 4)
            return ;

        if(pnode.state == 1 || pnode.state == 3) {
            pnode.time -= lt;

            if(pnode.time <= 0) {
                lt = -pnode.time;

                if(pnode.state == 1 && pnode.index != this.iProNodeIndex) {
                    this._setProNodeState(pnode.index, 3, 0);
                }
                else {
                    pnode.state +=1;
                    pnode.time = 0;

                    this._refreshProNode(pnode);
                }

                if(lt > 0)
                    this._updateProNode(lt, pnode);
            }
        }

        if(pnode.state == 2) {
            if(pnode.index != this.iProNodeIndex) {
                this._setProNodeState(pnode.index, 3, 0);
            }
            else {
                pnode.time += lt;

                while(pnode.time >= this.lstnodetime[2])
                    pnode.time -= this.lstnodetime[2];
            }
        }

        this._refreshProNode(pnode);
    },

    _refreshProNode : function (pnode) {
        if(pnode.state != 2)
            pnode.sprNode.setRotation(0);

        pnode.sprNode.setVisible(pnode.state != 0);

        switch (pnode.state) {
            case 0:
                break;
            case 1:
                pnode.sprNode.setScale(1.5 * (this.lstnodetime[1] - pnode.time) / this.lstnodetime[1]);
                break;
            case 2:
                pnode.sprNode.setScale(1.5);
                pnode.sprNode.setRotation(360 * pnode.time / this.lstnodetime[2]);
                break;
            case 3:
                pnode.sprNode.setScale(1 + 0.5 * pnode.time / this.lstnodetime[3]);
                break;
            case 4:
                pnode.sprNode.setScale(1);
                break;
        }
    },

    _setProNodeState : function (index, state, delay) {
        if(index < 0 || index >= this.lstProNode.length)
            return ;

        var pnode = this.lstProNode[index];
        pnode.state = state;

        if(delay)
            pnode.delay = delay;
        else
            pnode.delay = 0;

        if(state == 2)
            pnode.time = 0;
        else
            pnode.time = this.lstnodetime[state];

        this._refreshProNode(pnode);
    },

    onPerecnt : function (percent) {
        if(this.lstProNode == undefined)
            return ;

        var cindex = Math.floor(percent / 10);

        // if(cindex > 9)
        //     cindex = 9;

        if(cindex != this.iProNodeIndex) {
            this.iProNodeIndex = cindex;
            //this._setProNodeState(this.iProNodeIndex, 1);

            var delay = 0;

            for(var ii = 0; ii <= cindex; ++ii) {
                if(ii >= this.lstProNode.length)
                    continue ;

                var pnode = this.lstProNode[ii];

                if(pnode.delay > delay) {
                    delay = pnode.delay;
                }
            }

            delay += 0.05;

            for(var ii = 0; ii <= cindex; ++ii) {
                if(ii >= this.lstProNode.length)
                    continue ;

                var pnode = this.lstProNode[ii];

                if(pnode.state == 0) {
                    this._setProNodeState(ii, 1, delay);

                    delay += 0.05;
                }
            }
        }
    },

    /**
     * custom onEnter
     */
    onEnter: function () {
        var self = this;
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.3);

    },
    /**
     * custom onExit
     */
    onExit: function () {
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} cb
     * @param {Object} target
     */
    initWithResources: function (resources, cb, target) {
        if(cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
        this.target = target;
    },

    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        cc.loader.load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 99.9);
                self.onPerecnt(percent);
            }, function () {
                self.onPerecnt(99.9);
                self.bLoadEnd = true;

                // if (self.cb) {
                //     self.cb.call(self.target);
                // }
            });
    },

    _updateTransform: function(){
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        this._bgLayer._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
    },

});

LoadingScene.preload = function(resources, cb, target){
    var _LoadingScene = null;
    if(!_LoadingScene) {
        _LoadingScene = new LoadingScene();
        _LoadingScene.init();
        cc.eventManager.addCustomListener(cc.Director.EVENT_PROJECTION_CHANGED, function(){
            _LoadingScene._updateTransform();
        });
    }
    _LoadingScene.initWithResources(resources, cb, target);

    cc.director.runScene(_LoadingScene);

    return _LoadingScene;
};

LoadingScene._lstPicture = [];

//! LOGO
LoadingScene._lstPicture.push("data:image/png;base64,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");
//! 灰点
LoadingScene._lstPicture.push("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEUAAAAOXqkOXqkOXqljUpuEAAAAA3RSTlMAgn5EfmIsAAAAOUlEQVQI1x2MuQ0AMAgDrbQZJiuwOSswDC1y0DUn+ZVOSLq1eL3IWcsOXbv07FbaA5AEVCgz44CrD/N0H+Hhls2hAAAAAElFTkSuQmCC");
//! 亮点
LoadingScene._lstPicture.push("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEUAAABRweNRweNRweOFdXwlAAAAA3RSTlMAf318ZaxmAAAAQklEQVQI12NgYHRgYGBgvwAk5H8Aifp/QKH//xsYuP//f8Cg////D4b9////gxDyIC47UAKkxAGo+C9I2xeIAWCjAOtDH5DyuyHOAAAAAElFTkSuQmCC");
//! 蓝渐变
LoadingScene._lstPicture.push("data:image/png;base64,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");
//! 黑渐变
LoadingScene._lstPicture.push("data:image/png;base64,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");
//! YGG
LoadingScene._lstPicture.push("data:image/png;base64,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");

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
            }

            cc.view.setDesignResolutionSize(fsize.width, fsize.height, cc.ResolutionPolicy.SHOW_ALL);
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
                percent = Math.min(percent, 100);
                self.onPerecnt(percent);
            }, function () {
                //self.onPerecnt(100);
                //return ;
                if (self.cb) {
                    self.cb.call(self.target);
                }
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
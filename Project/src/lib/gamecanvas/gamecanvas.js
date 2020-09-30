/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

gmc.GMC_FLAG_H5 = 1 << 0;           //! 是否可以在网页上使用
gmc.GMC_FLAG_NATIVE = 1 << 1;           //! 是否可以在客户端使用
gmc.GMC_FLAG_PC = 1 << 2;           //! 是否可以在电脑上使用
gmc.GMC_FLAG_MOBILE = 1 << 3;           //! 是否可以在手机上使用

//! 取一个元素（如果是单一对象就返回，如果是数组就换回index对应的值）
gmc.getElement = function (elements, index) {
    if(!elements)
        return elements;

    if(cc.isArray(elements)) {
        if(index < 0 || index >= elements.length)
            return undefined;

        return elements[index];
    }

    return elements;
};

//! 查找一个子节点（优先查找资源列表，如果找不到再找根节点）
gmc.findChildByName = function (root, name, lstres, index) {
    if(lstres == undefined || index == undefined || lstres.length <= 0)
        return findChildByName(root, name);

    for(var ii = 0; ii < lstres.length; ++ii) {
        var gmcres = lstres[ii];

        if(gmcres.getNode) {
            var rnode = gmcres.getNode(index);

            if(rnode) {
                var cnode = findChildByName(rnode, name);

                if(cnode)
                    return cnode;
            }
        }
    }

    return findChildByName(root, name);
};

//! 根据画布进行缩放
//! 画布缩放的数据
gmc.ScaleData = cc.Class.extend(/** @lends cc.Action# */{
    ctor : function () {
        //! 基本信息
        this.minSize = new cc.Size();           //! 最小区域
        this.maxSize = new cc.Size();           //! 最大区域
        this.minScale = 1;                       //! 最小比例
        this.maxScale = 1;                      //! 最大比例
    },
});

//! 用于画布的缩放
var GameCanvasScale = cc.Class.extend({
    ctor : function (node, data) {
        if(!node || !data)
            return ;

        if(data.minScale == data.maxScale)
            return ;

        this._node = node;
        this._data = data;

        this._scale = this._node.getScale();
    },

    onChgSize : function (width, height) {
        if(!this._node)
            return ;

        if(width <= this._data.minSize.width || height <= this._data.minSize.height) {
            this._node.setScale(this._scale * this._data.minScale);
            return ;
        }

        if(width >= this._data.maxSize.width && height >= this._data.maxSize.height) {
            this._node.setScale(this._scale * this._data.maxScale);
            return ;
        }

        var cscale = this._data.maxScale;

        if(width <= this._data.maxSize.width) {
            var wscale = this._data.minScale + (this._data.maxScale - this._data.minScale) * (width - this._data.minSize.width) / (this._data.maxSize.width - this._data.minSize.width);

            if(wscale < cscale)
                cscale = wscale;
        }

        if(height <= this._data.maxSize.height) {
            var hscale = this._data.minScale + (this._data.maxScale - this._data.minScale) * (height - this._data.minSize.height) / (this._data.maxSize.height - this._data.minSize.height);

            if(hscale < cscale)
                cscale = hscale;
        }

        this._node.setScale(this._scale * cscale);
    },
});

//! 游戏的画布
var GameCanvas = cc.Node.extend({
    ctor: function (canvasres) {
        this._super();

        this._flags = gmc.GMC_FLAG_H5 | gmc.GMC_FLAG_NATIVE | gmc.GMC_FLAG_PC | gmc.GMC_FLAG_MOBILE;         //! 默认所有环境下使用
        this._layer = undefined;

        this._maxsize = undefined;           //! 最大显示区域
        this._minsize = undefined;           //! 最小显示区域
        this._minposition = undefined;      //! 最小显示区域所处的位置（左下角）

        this._designsize = cc.size(0, 0);       //! 评估出的设计尺寸
        this._designscale = 0;                   //! 评估出的缩放比例

        this._framesize = cc.size(0, 0);       //! 当前实际的显示大小

        this._lstAdaptiveLayout = [];
        this._AdaptiveAdjust = {};           //! 自适应容器调整值
        this._lstBackNode = [];
        this._lstScale = [];

        if(!canvasres)
            return ;

        this.init(canvasres);
    },

    //! 初始化
    init : function (canvasres) {
        this._layer = ccs.load(canvasres);

        if(!this._layer || !this._layer.node)
            return ;

        if(this._layer.action)
            this._layer.node.runAction(this._layer.action);

        this.addChild(this._layer.node);

        this._maxsize = this._layer.node.getContentSize();

        var rectMin = findChildByName(this._layer.node, 'rectMin');

        if(rectMin) {
            this._minsize = rectMin.getContentSize();
            this._minposition = rectMin.getPosition();

            var apoint = rectMin.getAnchorPoint();

            if(apoint.x > 0) {
                this._minposition.x -= this._minsize.width * apoint.x;
            }

            if(apoint.y > 0) {
                this._minposition.y -= this._minsize.height * apoint.y;
            }
        }
    },

    //! 页面大小改变
    onChgSize : function (width, height) {
        var ww = window.screen.width;
        var wh = window.screen.height;
        var wdd = window.screen.deviceXDPI;

        this._framesize.width = width;
        this._framesize.height = height;

        //! 没有最小区域则直接使用最大区域
        if(!this._minsize) {
            this._designsize.width = this._maxsize.width;
            this._designsize.height = this._maxsize.height;
        }
        else {
            //! 设计分辨率应该在最大和最小区域之间
            var cw = (width > this._maxsize.width ? this._maxsize.width : width);
            var ch = (height > this._maxsize.height ? this._maxsize.height : height);

            cw = (cw < this._minsize.width ? this._minsize.width : cw);
            ch = (ch < this._minsize.height ? this._minsize.height : ch);

            //! 根据宽度评估对应的高度，根据高度评估对应的宽度
            var cwh = -1;
            var chw = -1;

            if(cw < this._maxsize.width) {
                var wh = height * cw / width;

                if(wh > this._maxsize.height)
                    cwh = this._maxsize.height;
                else if(wh < this._minsize.height)
                    cwh = this._minsize.height;
                else
                    cwh = wh;
            }

            if(ch < this._maxsize.height) {
                var hw = width * ch / height;

                if(hw > this._maxsize.width)
                    chw = this._maxsize.width;
                else if(hw < this._minsize.width)
                    chw = this._minsize.width;
                else
                    chw = hw;
            }

            //! 根据评估结果调整设计宽高
            if(cwh > 0 && chw > 0) {
                //! 如果两组评估值都存在，则使用面积大的一组
                if(cw * cwh > ch * chw) {
                    //ch = Math.floor(cwh);
                    ch = cwh;
                }
                else {
                    //cw = Math.floor(chw);
                    cw = chw;
                }
            }
            else if(cwh > 0) {
                //ch = Math.floor(cwh);
                ch = cwh;
            }
            else if(chw > 0) {
                //cw = Math.floor(chw);
                cw = chw;
            }

            // //! 调整中心位置
            // var cx = this._minposition.x * (cw - this._maxsize.width) / (this._maxsize.width - this._minsize.width);
            // var cy = this._minposition.y * (ch - this._maxsize.height) / (this._maxsize.height - this._minsize.height);
            //
            // this.setPositionX(cx);
            // this.setPositionY(cy);

            this._designsize.width = cw;
            this._designsize.height = ch;
        }

        var scalew = width / this._designsize.width;
        var scaleh = height / this._designsize.height;

        this._designscale = (scalew > scaleh ? scaleh : scalew);

        this.setScale(this._designscale);

        //! 调整中心位置
        var cx = (width - this._maxsize.width * this._designscale) / 2;
        var cy = (height - this._maxsize.height * this._designscale) / 2;

        this.setPositionX(cx);
        this.setPositionY(cy);

        this._refreshAdaptiveLayout();
        this._refreshBackNode();
        this._refreshScale();
    },

    //! 取评估出的设计显示面积
    //实际显示面积需要*this._designscale次方
    //返回rate,是取最接近设计比例的显示,两套canvas,缩小0.9比放大1.2好,外层取最大值,所以返回1/rate
    getDesignArea : function () {
        return (this._designsize.width *this._designscale)* (this._designsize.height * this._designscale);
        // var rate=this._designscale>1?this._designscale:(1/this._designscale);
        // return 1/rate;
    },

    //! 取评估的设计分辨率
    getDesignSize : function () {
        return cc.size(this._designsize.width, this._designsize.height);
    },

    //! 取评估的设计缩放比例
    getDesignScale : function () {
        return this._designscale;
    },

    //! 是否满足某个Flag
    hasFlag : function (flag) {
        return this._flags & flag;
    },

    //! 设置使用范围的Flags（默认可以在所有环境下使用）
    setFlags : function (flags) {
        this._flags = flags;
    },

    //! 添加使用范围的Flag（默认可以在所有环境下使用）
   addFlag : function (flag) {
       this._flags = this._flags | flag;
   },

    //! 移除使用范围的Flag（默认可以在所有环境下使用）
    removeFlag : function (flag) {
        this._flags = this._flags & (~flag);
    },

    //! 增加自适应容器（自适应容器大小永远等于当前的设计分辨率）
    addAdaptiveLayout : function (name) {
        if(!name)
            return false;

        for(var ii = 0; ii < this._lstAdaptiveLayout.length; ++ii) {
            if(this._lstAdaptiveLayout[ii].name == name)
                return true;
        }

        var layout = findChildByName(this, name);

        if(!layout)
            return false;

        //layout.setAnchorPoint(0, 0);

        var node = {};

        node.name = name;
        node.layout = layout;

        this._lstAdaptiveLayout.push(node);
        return true;
    },

    //! 为一个自适应容器增加受影响的调整id
    addAdaptiveAdjust : function (name, id) {
        if(!name || !id)
            return ;

        for(var ii = 0; ii < this._lstAdaptiveLayout.length; ++ii) {
            if(this._lstAdaptiveLayout[ii].name == name) {
                var node = this._lstAdaptiveLayout[ii];

                if(!node.adjust)
                    node.adjust = [];

                for(var jj = 0; jj < node.adjust.length; ++jj) {
                    if(node.adjust[jj] == id)
                        return ;
                }

                node.adjust.push(id);

                return ;
            }
        }

        this._refreshAdaptiveLayout();
    },

    //! 设置自适容器的调整值
    setAdaptiveAdjustValue : function (id, top, bottom, left, right) {
        if(!id)
            return ;

        var node = { top : 0, bottom : 0, left : 0, right : 0 };

        if(top)
            node.top = top;

        if(bottom)
            node.bottom = bottom;

        if(left)
            node.left = left;

        if(top)
            node.right = right;

        this._AdaptiveAdjust[id] = node;

        this._refreshAdaptiveLayout();
    },

    //! 获取一个自适应容器的调整值
    _getAdjustValue : function (node) {
        var vnode = { top : 0, bottom : 0, left : 0, right : 0 };

        if(!node.adjust)
            return vnode;

        for(var jj = 0; jj < node.adjust.length; ++jj) {
            var id = node.adjust[jj];

            if(this._AdaptiveAdjust[id]) {
                var anode = this._AdaptiveAdjust[id];

                if(anode.top > vnode.top)
                    vnode.top = anode.top;

                if(anode.bottom > vnode.bottom)
                    vnode.bottom = anode.bottom;

                if(anode.left > vnode.left)
                    vnode.left = anode.left;

                if(anode.right > vnode.right)
                    vnode.right = anode.right;
            }
        }

        return vnode;
    },

    //! 移除自适应容器
    removeAdaptiveLayout : function (name) {
        for(var ii = 0; ii < this._lstAdaptiveLayout.length; ++ii) {
            if(this._lstAdaptiveLayout[ii].name == name) {
                this._lstAdaptiveLayout.splice(ii, 1);
                return true;
            }
        }

        return false;
    },

    //! 刷新自适应容器
    _refreshAdaptiveLayout : function () {
        var pos = this.getPosition();
        pos.x = -pos.x / this._designscale;
        pos.y = -pos.y / this._designscale;

        var lsize = new cc.Size(this._framesize.width / this._designscale, this._framesize.height / this._designscale);

        for(var ii = 0; ii < this._lstAdaptiveLayout.length; ++ii) {
            var node = this._lstAdaptiveLayout[ii];

            //node.layout.setLayoutComponentEnabled(true);
            //node.layout.setContentSize(this._designsize.width, this._designsize.height);
            if(!node.adjust) {
                node.layout.setContentSize(lsize);
                node.layout.setPosition(pos);
            }
            else {
                var vnode = this._getAdjustValue(node);

                var apos = this.getPosition();

                apos.x = (-apos.x + vnode.left) / this._designscale;
                apos.y = (-apos.y + vnode.bottom) / this._designscale;

                var alsize = new cc.Size((this._framesize.width - vnode.left - vnode.right) / this._designscale, (this._framesize.height - vnode.top - vnode.bottom) / this._designscale);

                node.layout.setContentSize(alsize);
                node.layout.setPosition(apos);
            }

            var locChildren = node.layout.getChildren();
            for (var i = 0, len = locChildren.length; i < len; i++) {
                var child = locChildren[i];
                var component = child.getComponent('__ui_layout');

                if(component)
                    component.refreshLayout();
            }
        }
    },

    //! 增加背景节点（背景遵循如下规律：首先尽量维持原始比例，如果原始比例不能覆盖全屏，则调整比例和位置）
    addBackNode : function (name, rectarea) {
        if(!name || !rectarea)
            return false;

        for(var ii = 0; ii < this._lstBackNode.length; ++ii) {
            if(this._lstBackNode[ii].name == name)
                return true;
        }

        var bnode = findChildByName(this, name);

        if(!bnode)
            return false;

        var node = {};

        node.name = name;
        node.bnode = bnode;
        node.scale = bnode.getScale();
        node.pos = new cc.Point(bnode.getPositionX(), bnode.getPositionY());
        node.rect = new cc.Rect(rectarea.x, rectarea.y, rectarea.width, rectarea.height);

        this._lstBackNode.push(node);
        return true;
    },

    //! 移除背景节点
    removeBackNode : function (name) {
        for(var ii = 0; ii < this._lstBackNode.length; ++ii) {
            if(this._lstBackNode[ii].name == name) {
                this._lstBackNode.splice(ii, 1);
                return true;
            }
        }

        return false;
    },

    //! 刷新背景节点
    _refreshBackNode : function () {
        var frect = new cc.rect();
        var pos = this.getPosition();

        frect.x = -pos.x / this._designscale;
        frect.y = -pos.y / this._designscale;
        frect.width = this._framesize.width / this._designscale;
        frect.height = this._framesize.height / this._designscale;

        for(var ii = 0; ii < this._lstBackNode.length; ++ii) {
            var node = this._lstBackNode[ii];
            this._refreshOneBack(node, frect);
        }
    },

    _refreshOneBack : function (node, frect) {
        var mrect = new cc.rect(node.rect.x, node.rect.y, node.rect.width, node.rect.height);

        //! 评估缩放
        var mscale = node.scale;

        if(frect.width / mrect.width > mscale)
            mscale = frect.width / mrect.width;

        if(frect.height / mrect.height > mscale)
            mscale = frect.height / mrect.height;

        mrect.width *= mscale;
        mrect.height *= mscale;

        node.bnode.setScale(mscale);

        //! 评估位置
        var mx = mrect.x * mscale + node.pos.x;
        var my = mrect.y * mscale + node.pos.y;

        if(mx > frect.x) {
            mx = frect.x;
        }

        if(mx + mrect.width < frect.x + frect.width) {
            mx = frect.x + frect.width - mrect.width;
        }

        if(my > frect.y) {
            my = frect.y;
        }

        if(my + mrect.height < frect.y + frect.height) {
            my = frect.y + frect.height - mrect.height;
        }

        node.bnode.setPositionX(mx - mrect.x * mscale);
        node.bnode.setPositionY(my - mrect.y * mscale);
    },

    //! 增加缩放
    addScale : function (name, gmcscale) {
        if(!name || !gmcscale)
            return false;

        for(var ii = 0; ii < this._lstScale.length; ++ii) {
            if(this._lstScale[ii].name == name)
                return true;
        }

        var node = {};

        node.name = name;
        node.gmcscale = gmcscale;

        this._lstScale.push(node);

        this._refreshScale();
        return true;
    },

    //! 移除缩放
    removeScale : function (name) {
        for(var ii = 0; ii < this._lstScale.length; ++ii) {
            if(this._lstScale.name == name) {
                this._lstScale[ii].splice(ii, 1);
                return true;
            }
        }

        return false;
    },

    //! 刷新缩放
    _refreshScale : function () {
        var frect = new cc.rect();
        var pos = this.getPosition();

        frect.x = -pos.x / this._designscale;
        frect.y = -pos.y / this._designscale;
        frect.width = this._framesize.width / this._designscale;
        frect.height = this._framesize.height / this._designscale;

        for(var ii = 0; ii < this._lstScale.length; ++ii) {
            var node = this._lstScale[ii];
            node.gmcscale.onChgSize(frect.width, frect.height);
        }
    },

    //! 是否可以使用
    canUser : function (flags) {
        if(!this._layer)
            return false;

        return (this._flags & flags) == flags;
    },

    //! 设置显示
    show : function (bshow) {
        this.setVisible(bshow);
    },

    isShow : function () {
        return this.isVisible();
    },

    //! 播放动画，startIndex和endIndex都为-1，则播放完整的动画
    gotoFrameAndPlay : function (startIndex, endIndex, loop) {
        if(!this._layer || !this._layer.action)
            return ;

        if(this._layer.action.getDuration() <= 0)
            return ;

        if(startIndex < 0 || endIndex < 0) {
            this._layer.action.refreshCurTime();
            this._layer.action.gotoFrameAndPlay(0, this._layer.action.getDuration(), loop);
        }
        else if(startIndex <= this._layer.action.getDuration() && endIndex <= this._layer.action.getDuration()) {
            this._layer.action.refreshCurTime();
            this._layer.action.gotoFrameAndPlay(startIndex, endIndex, loop);
        }
    },
});

//! 游戏画布管理者
var GameCanvasMgr = cc.Class.extend({
    ctor: function (root) {
        //this._super();

        this._root = root;

        this._lstCanvas = [];
        this._flags = 0;

        this._curCanvasIndex = -1;
        this._curFrameSize = cc.size(0, 0);
        this._bShowCanvas = true;

        this._Button = {};
        this._TextBMFontEx = {};
        this._TextEx = {};
        this._RichTextEx = {};
        this._SliderEx = {};
        this._Node = {};
        this._Sprite = {};
        this._Armature = {};
        this._Spine = {};
        this._SingleNode = {};
        this._Resource = {};
        this._Action = {};
        this._Virtual = {};
        this._Probar = {};
        this._TextGroup = {};

        this._curModuleIndex = 0;       //! 当前的模块索引
        this._Module = {};               //! 模块

        this._StateMgr = undefined;     //! 状态管理

        this.canvasChangedCallBack = undefined;    //canvas改变后的回调

        //! 初始化Flags
        if(cc.sys.isNative) {
            this._flags = gmc.GMC_FLAG_NATIVE;
        }
        else {
            this._flags = gmc.GMC_FLAG_H5;

            if(cc.sys.isMobile)
                this._flags = this._flags | gmc.GMC_FLAG_MOBILE;
            else
                this._flags = this._flags | gmc.GMC_FLAG_PC;
        }

        //this.scheduleUpdate();
    },

    //! 设置使用范围的Flags（初值已根据真实情况初始化，一般测试环境下才改变初值）
    setFlags : function (flags) {
        this._flags = flags;
    },

    //! 添加一个画布
    addCanvas : function (canvasres) {
        var canvas = new GameCanvas(canvasres);
        this._root.addChild(canvas);
        canvas.setVisible(false);

        this._lstCanvas.push(canvas);
    },

    //! 添加多个画布
    addCanvases : function (lstres) {
        for(var ii = 0; ii < lstres.length; ++ii) {
            this.addCanvas(lstres[ii]);
        }

        this.update(0.01);
    },

    //! 播放动画，startIndex和endIndex都为-1，则播放完整的动画
    gotoFrameAndPlay : function (startIndex, endIndex, loop) {
        for(var ii = 0; ii < this._lstCanvas.length; ++ii) {
            this._lstCanvas[ii].gotoFrameAndPlay(startIndex, endIndex, loop);
        }
    },

    //! 增加自适应容器（自适应容器大小永远等于当前的设计分辨率），如果传入数组则每个画布使用不同参数
    addAdaptiveLayout : function (name) {
        for(var ii = 0; ii < this._lstCanvas.length; ++ii) {
            this._lstCanvas[ii].addAdaptiveLayout(gmc.getElement(name, ii));
        }
    },

    //! 添加多个自适应容器，传入参数为数组，数组内部可以包含数组
    addAdaptiveLayouts : function (lstname) {
        for(var ii = 0; ii < lstname.length; ++ii) {
            this.addAdaptiveLayout(lstname[ii]);
        }
    },

    //! 为一个自适应容器增加受影响的调整id
    addAdaptiveAdjust : function (name, id) {
        for(var ii = 0; ii < this._lstCanvas.length; ++ii) {
            var cname = gmc.getElement(name, ii);
            var cid = gmc.getElement(id, ii);

            this._lstCanvas[ii].addAdaptiveAdjust(cname, cid);
        }
    },

    //! 设置自适容器的调整值
    setAdaptiveAdjustValue : function (id, top, bottom, left, right) {
        for(var ii = 0; ii < this._lstCanvas.length; ++ii) {
            var cid = gmc.getElement(id, ii);
            var ctop = gmc.getElement(top, ii);
            var cbottom = gmc.getElement(bottom, ii);
            var cleft = gmc.getElement(left, ii);
            var cright = gmc.getElement(right, ii);

            this._lstCanvas[ii].setAdaptiveAdjustValue(cid, ctop, cbottom, cleft, cright);
        }
    },

    //! 增加背景节点，如果传入数组则每个画布使用不同参数
    addBackNode_SingleNode : function (name, snode) {
        var rectArea = snode.findChildByName("rectArea");

        if(rectArea) {
            var rpos = rectArea.getPosition();
            var rsize = rectArea.getLayoutSize();
            var apoint = rectArea.getAnchorPoint();

            var rectarea = new cc.rect(rpos.x - rsize.width * apoint.x, rpos.y - rsize.height * apoint.y, rsize.width, rsize.height);

            for(var ii = 0; ii < this._lstCanvas.length; ++ii) {
                this._lstCanvas[ii].addBackNode(gmc.getElement(name, ii), rectarea);
            }
        }

        if(this._curFrameSize.width > 0 && this._curFrameSize.height > 0)
            this.refreshCanvas(this._curFrameSize);
    },

    //! 增加一个模块，lstdata是模块内包含的gmc控件
    addModule : function (lstdata) {
        var name = 'mod' + this._curModuleIndex + '_';
        this._curModuleIndex += 1;

        var module = new GameCanvasModule(this, name, lstdata);

        this._Module[name] = module;
        return module;
    },

    //! 获取一个模块 module可以是模块名称，也可以是模块本身
    getModule : function (module) {
        if(!module)
            return undefined;

        if(cc.isString(module))
            return this._Module[module];

        //! 不是字符串应该就是模块本身
        if(!cc.isObject(module) || !module.gmcmodule)
            return undefined;

        return module;
    },

    //! 获取一个模块名称 module可以是模块本身，也可以是模块名称
    getModuleName : function (module) {
        if(!module)
            return undefined;

        if(cc.isString(module) && this._Module[module] != undefined)
            return module;

        //! 不是字符串应该就是模块本身
        if(!cc.isObject(module) || !module.gmcmodule)
            return undefined;

        return module._mgrname;
    },

    //! 移除一个模块 module可以是模块本身，也可以是模块名称
    removeModule : function (module) {
        var name = this.getModuleName(module);

        if(!name)
            return ;

        this._Module[name] = undefined;
    },

    //! 销毁一个模块（移除模块和它下面的所有gmc控件） module可以是模块本身，也可以是模块名称
    destoryModule : function (module) {
        var mod = this.getModule(module);

        if(mod && mod.destory)
            mod.destory();
    },

    //! 获取状态管理者（部分高级功能获取状态管理者之后调用内部的接口）
    getStateMgr : function () {
        this._initStateMgr();

        return this._StateMgr;
    },

    //! 添加状态（部分高级功能getStateMgr之后调用内部的接口）
    addState : function (name, data, curstate, callfunc, target, module) {
        if(arguments.length > 2) {
            //! 最后的参数都有可能是module
            var mod = this.getModule(arguments[arguments.length - 1]);

            if(mod) {
                mod.addState(name, data, curstate, callfunc, target);
                return ;
            }
        }

        this._initStateMgr();

        this._StateMgr.add(name, data, curstate, callfunc, target);
    },

    //! 移除状态（一般不用）
    removeState : function (name, module) {
        if(module) {
            var mod = this.getModule(module);

            if(mod)
                mod.removeState(name);

            return ;
        }

        if(!this._StateMgr)
            return ;

        this._StateMgr.remove(name);
    },

    //! 设置一个状态的当前状态值 delay是延迟多久后起效（可选） brefresh为true则强制刷新（可选，如果强制刷新则不考虑lock、time等状态）
    setState : function (name, curstate, delay, brefresh, module) {
        if(arguments.length > 2) {
            //! 最后的参数都有可能是module
            var mod = this.getModule(arguments[arguments.length - 1]);

            if(mod) {
                mod.setState(name, curstate, delay, brefresh);
                return ;
            }
        }

        if(!this._StateMgr)
            return ;

        this._StateMgr.setState(name, curstate, delay, brefresh);
    },

    //! 获取一个状态的当前状态值，如果不存在返回-1
    getCurState : function (name, module) {
        if(module) {
            var mod = this.getModule(module);

            if(mod)
                return mod.getCurState(name);

            return -1;
        }

        if(!this._StateMgr)
            return -1;

        return this._StateMgr.getCurState(name);
    },

    _initStateMgr : function () {
        if(this._StateMgr)
            return ;

        this._StateMgr = new GameCanvasStateMgr(this);
    },

    //! 初始化一组控件，一般来说，顺序应该是先初始化画布上的cocos控件（slider类尽量放最后），然后是添加的resource，最后是action和virtual
    initCtrlList : function (lstdata, lstres) {
        if(!lstdata)
            return ;

        if(!cc.isArray(lstdata)) {
            this.initCtrl(lstdata, lstres);
            return ;
        }

        for(var ii = 0, len = lstdata.length; ii < len; ++ii) {
            var data = lstdata[ii];
            this.initCtrl(data, lstres);
        }
    },

    //! 初始化一个控件
    initCtrl : function (data, lstres) {
        if(!data.type || !data.name)
            return ;

        switch(data.type) {
            case 'action':
                this.initAction_data(data);
                break;
            case 'armature':
                this.initArmature_data(data, lstres);
                break;
            case 'button':
                this.initButton_data(data, lstres);
                break;
            case 'node':
                this.initNode_data(data, lstres);
                break;
            case 'resource':
                this.initResource_data(data);
                break;
            case 'singlenode':
                this.initSingleNode_data(data, lstres);
                break;
            case 'sliderex':
                this.initSliderEx_data(data, lstres);
                break;
            case 'textbmfontex':
                this.initTextBMFontEx_data(data, lstres);
                break;
            case 'textex':
                this.initTextEx_data(data, lstres);
                break;
            case 'richtextex':
                this.initRichTextEx_data(data, lstres);
                break;
            case 'virtual':
                this.initVirtual_data(data);
                break;
            case 'spine':
                this.initSpine_data(data);
                break;
            case 'sprite':
                this.initSprite_data(data);
                break;
            case 'probar':
                this.initProbar_data(data);
                break;
            case 'textgroup':
                this.initTextGroup_data(data);
                break;
        }
    },

    //! 获取一个被管理的控件
    getCtrl : function (name, module) {
        if(module) {
            var mod = this.getModule(module);

            if(mod) {
                return mod.getCtrl(name);
            }
        }

        if(this._Button[name])
            return this._Button[name];

        if(this._TextBMFontEx[name])
            return this._TextBMFontEx[name];

        if(this._TextEx[name])
            return this._TextEx[name];

        if(this._RichTextEx[name])
            return this._RichTextEx[name];

        if(this._SliderEx[name])
            return this._SliderEx[name];

        if(this._Node[name])
            return this._Node[name];

        if(this._Sprite[name])
            return this._Sprite[name];

        if(this._Armature[name])
            return this._Armature[name];

        if(this._Resource[name])
            return this._Resource[name];

        if(this._SingleNode[name])
            return this._SingleNode[name];

        if(this._Action[name])
            return  this._Action[name];

        if(this._Virtual[name])
            return this._Virtual[name];

        if(this._Spine[name])
            return this._Spine[name];

        return undefined;
    },

    //! 设置一种控件的数据
    setData : function (name, data, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl || !ctrl.setData)
            return false;

        ctrl.setData(data);
        return true;
    },

    //! 设置回调函数（仅返回某一控件最重要事件 如：点击按钮、滑挑进度改变、播放的动画结束等）
    setCallFunction : function (name, callfunc, target, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl || !ctrl.setCallFunction)
            return ;

        ctrl.setCallFunction(callfunc, target);
    },

    //! 设置高级回调函数（返回和控件相关的多种状态）
    setCallFunctionEx : function (name, callfunc, target, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl || !ctrl.setCallFunctionEx)
            return ;

        ctrl.setCallFunctionEx(callfunc, target);
    },

    //! 设置是否显示
    setVisible : function (name, visible, eventname, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl)
            return ;

        ctrl.setVisible(visible, eventname);
    },

    isVisible : function (name, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl)
            return false;

        return ctrl.isVisible();
    },

    //! 设置是否可以使用
    setEnabled : function (name, enabled, eventname, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl)
            return ;

        ctrl.setEnabled(enabled, eventname);
    },

    isEnabled : function (name, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl)
            return false;

        return ctrl.isEnabled();
    },

    //! 设置透明度
    setOpacity : function (name, opacity, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl || !ctrl.setOpacity)
            return ;

        ctrl.setOpacity(opacity);
    },

    //! 设置颜色
    setColor : function (name, color, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl || !ctrl.setColor)
            return ;

        ctrl.setColor(color);
    },

    //! 设置字符串
    setString : function (name, str, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl || !ctrl.setString)
            return ;

        ctrl.setString(str);
    },

    //! 设置位置，如果有y 则x和y是number（number数组），否则x是position（position数组）
    setPosition : function (name, x, y, module) {
        var mod = undefined;
        var ctrl = undefined;

        if(module == undefined) {
            if(y != undefined && (cc.isString(y) || y.gmcmodule)) {
                //! 只有三个参数，并且第三个参数其实是module
                mod = y;
            }

            ctrl = this.getCtrl(name, mod);
        }
        else {
            ctrl = this.getCtrl(name, module);
        }

        if(!ctrl || !ctrl.setPosition)
            return ;

        if(mod)
            ctrl.setPosition(x);
        else
            ctrl.setPosition(x, y);
    },

    //! 设置图片 newFrame可以是frame（frame数组），也可以是字符串（字符串数组）
    setSpriteFrame : function (name, newFrame, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl || !ctrl.setSpriteFrame)
            return ;

        ctrl.setSpriteFrame(newFrame);
    },

    //! 获取图片
    getSpriteFrame: function (name, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl || !ctrl.getSpriteFrame)
            return ;

        return ctrl.getSpriteFrame();
    },

    //! 添加管理的gmc控件 gmcname可以是gmc控件名称，也可以是gmc空间本身
    addCtrl : function (name, gmcname, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl || !ctrl.addCtrl)
            return ;

        return ctrl.addCtrl(gmcname);
    },

    //!音效相关
    playEffect: function (url, bloop, module) {
        if(url){
            cc.audioEngine.playEffect(url, bloop);
        }
        else {
            cc.log("playEffect " + url);
        }
    },

    //! 动画相关
    //! 播放动画
    play : function (name, ani, data, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl || !ctrl.play)
            return ;

        ctrl.play(ani, data);
    },

    //! 判断动画是否播放完了
    isEnd : function (name, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl || !ctrl.isEnd)
            return true;

        return ctrl.isEnd();
    },

    //! 判断动画是否循环
    isLoop : function (name, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl || !ctrl.isLoop)
            return false;

        return ctrl.isLoop();
    },

    //! 设置动画循环
    setLoop : function (name, aniloop, module) {
        var ctrl = this.getCtrl(name, module);

        if(!ctrl || !ctrl.setLoop)
            return ;

        ctrl.setLoop(aniloop);
    },

    //! 初始化一个按钮，返回值为GameCanvasButton，传入data为gmc.ButtonData
    initButton : function (name, data, lstres) {
        //! 不能初始化同名按钮
        if(this._Button[name])
            return this._Button[name];

        var btn = new GameCanvasButton(this, data, lstres);

        this._Button[name] = btn;
        btn._mgrname = name;
        return btn;
    },

    initButton_data : function (data, lstres) {
        if(!data.name)
            return ;

        return this.initButton(data.name, data, lstres);
    },

    removeButton : function (name) {
        this._Button[name] = undefined;
    },

    getButton : function (name) {
        if(this._Button[name])
            return this._Button[name];

        return undefined;
    },

    //! 初始化一个文字控件，返回值为GameCanvasText，传入textname可以是string或者string数组
    initTextBMFontEx : function (name, textname, lstres) {
        //! 不能初始化同名按钮
        if(this._TextBMFontEx[name])
            return this._TextBMFontEx[name];

        var text = new GameCanvasTextBMFontEx(this, textname, lstres);

        this._TextBMFontEx[name] = text;
        text._mgrname = name;
        return text;
    },

    initTextBMFontEx_data : function (data, lstres) {
        if(!data.name)
            return ;

        var ctrl = undefined;

        if(data.res)
            ctrl = this.initTextBMFontEx(data.name, data.res, lstres);
        else
            ctrl = this.initTextBMFontEx(data.name, data.name, lstres);

        if(ctrl)
            ctrl.setData(data);

        return ctrl;
    },

    removeTextBMFontEx : function (name) {
        this._TextBMFontEx[name] = undefined;
    },

    getTextBMFontEx : function (name) {
        if(this._TextBMFontEx[name])
            return this._TextBMFontEx[name];

        return undefined;
    },

    //! 初始化一个文字控件，GameCanvasTextEx，传入textname可以是string或者string数组
    initTextEx : function (name, textname, lstres) {
        //! 不能初始化同名按钮
        if(this._TextEx[name])
            return this._TextEx[name];

        var text = new GameCanvasTextEx(this, textname, lstres);

        this._TextEx[name] = text;
        text._mgrname = name;
        return text;
    },
    //! 初始化一个富文本文字控件
    initRichTextEx : function (name, textname, lstres) {
        //! 不能初始化同名按钮
        if(this._RichTextEx[name])
            return this._RichTextEx[name];

        var text = new GameCanvasRichTextEx(this, textname, lstres);

        this._RichTextEx[name] = text;
        text._mgrname = name;
        return text;
    },
    initTextEx_data : function (data, lstres) {
        if(!data.name)
            return ;

        var ctrl = undefined;

        if(data.res)
            ctrl = this.initTextEx(data.name, data.res, lstres);
        else
            ctrl = this.initTextEx(data.name, data.name, lstres);

        if(ctrl)
            ctrl.setData(data);

        return ctrl;
    },
    initRichTextEx_data : function (data, lstres) {
        if(!data.name)
            return ;

        var ctrl = undefined;

        if(data.res)
            ctrl = this.initRichTextEx(data.name, data.res, lstres);
        else
            ctrl = this.initRichTextEx(data.name, data.name, lstres);

        if(ctrl)
            ctrl.setData(data);

        return ctrl;
    },
    removeTextEx : function (name) {
        this._TextEx[name] = undefined;
    },

    getTextEx : function (name) {
        if(this._TextEx[name])
            return this._TextEx[name];

        return undefined;
    },
    removeRichTextEx : function (name) {
        this._RichTextEx[name] = undefined;
    },

    getRichTextEx : function (name) {
        if(this._RichTextEx[name])
            return this._RichTextEx[name];

        return undefined;
    },

    //! 初始化一个滑条控件，GameCanvasSliderEx，传入slidername可以是string或者string数组
    initSliderEx : function (name, slidername, bshowmin, lstres) {
        //! 不能初始化同名按钮
        if(this._SliderEx[name])
            return this._SliderEx[name];

        var slider = new GameCanvasSliderEx(this, slidername, bshowmin, lstres);

        this._SliderEx[name] = slider;
        slider._mgrname = name;
        return slider;
    },

    initSliderEx_data : function (data, lstres) {
        //! 不完全正确
        if(!data.name)
            return ;

        var ctrl = undefined;

        if(data.res)
            ctrl = this.initSliderEx(data.name, data.res, data.bshowmin, lstres);
        else
            ctrl = this.initSliderEx(data.name, data.name, data.bshowmin, lstres);

        if(ctrl)
            ctrl.setData(data);

        return ctrl;
    },

    removeSliderEx : function (name) {
        this._SliderEx[name] = undefined;
    },

    getSliderEx : function (name) {
        if(this._SliderEx[name])
            return this._SliderEx[name];

        return undefined;
    },

    //! 初始化一个节点控件，返回值为GameCanvasNode，传入nodename可以是string或者string数组
    initNode : function (name, nodename, lstres) {
        //! 不能初始化同名按钮
        if(this._Node[name])
            return this._Node[name];

        var node = new GameCanvasNode(this, nodename, lstres);

        this._Node[name] = node;
        node._mgrname = name;
        return node;
    },

    initNode_data : function (data, lstres) {
        if(!data.name)
            return ;

        var ctrl = undefined;

        if(data.res)
            ctrl = this.initNode(data.name, data.res, lstres);
        else
            ctrl = this.initNode(data.name, data.name, lstres);

        if(ctrl)
            ctrl.setData(data);

        return ctrl;
    },

    removeNode : function (name) {
        this._Node[name] = undefined;
    },

    getNode : function (name) {
        if(this._Node[name])
            return this._Node[name];

        return undefined;
    },

    //! 初始化一个图片精灵控件，返回值为GameCanvasSprite，传入spritename可以是string或者string数组
    initSprite : function (name, spritename, lstres) {
        //! 不能初始化同名控件
        if(this._Sprite[name])
            return this._Sprite[name];

        var snode = new GameCanvasSprite(this, spritename, lstres);

        this._Sprite[name] = snode;
        snode._mgrname = name;
        return snode;
    },

    initSprite_data : function (data, lstres) {
        if(!data.name)
            return ;

        var ctrl = undefined;

        if(data.res)
            ctrl = this.initSprite(data.name, data.res, lstres);
        else
            ctrl = this.initSprite(data.name, data.name, lstres);

        if(ctrl)
            ctrl.setData(data);

        return ctrl;
    },

    removeSprite : function (name) {
        this._Sprite[name] = undefined;
    },

    getSprite : function (name) {
        if(this._Sprite[name])
            return this._Sprite[name];

        return undefined;
    },

    //! 初始化一个进度条控件，返回值为GameCanvasProbar，传入resname可以是string或者string数组
    initProbar : function (name, resname, lstres) {
        //! 不能初始化同名控件
        if(this._Probar[name])
            return this._Probar[name];

        var snode = new GameCanvasProbar(this, resname, lstres);

        this._Probar[name] = snode;
        snode._mgrname = name;
        return snode;
    },

    initProbar_data: function (data, lstres) {
        if(!data.name)
            return ;

        var ctrl = undefined;

        if(data.res)
            ctrl = this.initProbar(data.name, data.res, lstres);
        else
            ctrl = this.initProbar(data.name, data.name, lstres);

        if(ctrl)
            ctrl.setData(data);

        return ctrl;
    },

    removeProbar : function (name) {
        this._Probar[name] = undefined;
    },

    getProbar : function (name) {
        if(this._Probar[name])
            return this._Probar[name];

        return undefined;
    },

    //! 初始化一个文本数组控件，返回值为GameCanvasTextGroup，传入resname可以是string或者string数组
    initTextGroup : function (name, resname, lstgroup, lstres) {
        //! 不能初始化同名控件
        if(this._TextGroup[name])
            return this._TextGroup[name];

        var snode = new GameCanvasTextGroup(this, resname, lstgroup, lstres);

        this._TextGroup[name] = snode;
        snode._mgrname = name;
        return snode;
    },

    initTextGroup_data: function (data, lstres) {
        if(!data.name)
            return ;

        var ctrl = undefined;

        if(data.res)
            ctrl = this.initTextGroup(data.name, data.res, data.lsttextgroup, lstres);
        else
            ctrl = this.initTextGroup(data.name, data.name, data.lsttextgroup, lstres);

        if(ctrl)
            ctrl.setData(data);

        return ctrl;
    },

    removeTextGroup : function (name) {
        this._TextGroup[name] = undefined;
    },

    getTextGroup : function (name) {
        if(this._TextGroup[name])
            return this._TextGroup[name];

        return undefined;
    },

    //! 初始化一个导出动画控件，返回值为GameCanvasArmature，传入nodename可以是string或者string数组，aniname可以是string或者string数组（可不传），aniloop可以是boolean或者boolean数组（可不传）
    initArmature : function (name, nodename, aniname, aniloop, lstres) {
        //! 不能初始化同名动画
        if(this._Armature[name])
            return this._Armature[name];

        var anode = new GameCanvasArmature(this, nodename, aniname, aniloop, lstres);

        this._Armature[name] = anode;
        anode._mgrname = name;
        return anode;
    },

    initArmature_data : function (data, lstres) {
        if(!data.name)
            return ;

        var ctrl = undefined;

        if(data.res)
            ctrl = this.initArmature(data.name, data.res, data.aniname, data.aniloop, lstres);
        else
            ctrl = this.initArmature(data.name, data.name, data.aniname, data.aniloop, lstres);

        if(ctrl)
            ctrl.setData(data);

        return ctrl;
    },

    removeArmature : function (name) {
        this._Armature[name] = undefined;
    },

    getArmature : function (name) {
        if(this._Armature[name])
            return this._Armature[name];

        return undefined;
    },

    //! 初始化一组资源，返回值为GameCanvasResource，传入resname可以是string或者string数组 bsingle为true则仅加载单一资源 如果没有name也可以加载 但是不管理
    initSpine : function (name, resname, bsingle) {
        //! 不能初始化同名动画
        if(this._Spine[name])
            return this._Spine[name];

        var snode = new GameCanvasSpine(this, resname, bsingle);

        this._Spine[name] = snode;
        snode._mgrname = name;
        return snode;
    },

    initSpine_data : function(data){
        if(!data.name)
            return ;

        //! 如果父节点是单一节点，则加载资源的bsingle也只能是true，在这里先判断一下
        var bsingle = data.bsingle;
        var pctrl = undefined;

        if(data.parent) {
            pctrl = this.getCtrl(data.parent);

            if(pctrl.gmcsinglenode)
                bsingle = true;
        }

        var ctrl = undefined;

        if(data.res)
            ctrl = this.initSpine(data.name, data.res, bsingle);
        else
            ctrl = this.initSpine(data.name, data.name, bsingle);

        if(ctrl) {
            ctrl.setData(data);

            //! 增加绑定到父节点的方式（父节点应该为gmc类对象，并且在之前已经完成初始化）
            if(pctrl && pctrl.addChild) {
                pctrl.addChild(ctrl);
            }
        }
    },

    //! bdestroy（可不传，默认为true），如果是false则仅取消管理，资源不会从父节点上移除
    removeSpine : function (name, bdestroy) {
        if(this._Spine[name]) {
            if(bdestroy == undefined || bdestroy == true) {
                this._Spine[name].removeFromParent();
            }

            this._Spine[name]._mgr = undefined;
            this._Spine[name]._mgrname = undefined;
        }

        this._Spine[name] = undefined;
    },

    getSpine : function (name) {
        if(this._Spine[name])
            return this._Spine[name];

        return undefined;
    },

    //! 初始化一组资源，返回值为GameCanvasResource，传入resname可以是string或者string数组 bsingle为true则仅加载单一资源 如果没有name也可以加载 但是不管理
    initResource : function (name, resname, bsingle) {
        if(!name)
            return new GameCanvasResource(this, resname, bsingle);

        //! 不能初始化同名动画
        if(this._Resource[name])
            return this._Resource[name];

        var rnode = new GameCanvasResource(this, resname, bsingle);

        this._Resource[name] = rnode;
        rnode._mgrname = name;
        return rnode;
    },

    initResource_data : function (data) {
        if(!data.name)
            return ;

        //! 如果父节点是单一节点，则加载资源的bsingle也只能是true，在这里先判断一下
        var bsingle = data.bsingle;
        var pctrl = undefined;

        if(data.parent) {
            pctrl = this.getCtrl(data.parent);

            if(pctrl.gmcsinglenode)
                bsingle = true;
        }

        var ctrl = undefined;

        if(data.res)
            ctrl = this.initResource(data.name, data.res, bsingle);
        else
            ctrl = this.initResource(data.name, data.name, bsingle);

        if(ctrl) {
            ctrl.setData(data);

            //! 增加绑定到父节点的方式（父节点应该为gmc类对象，并且在之前已经完成初始化）
            if(pctrl && pctrl.addChild) {
                pctrl.addChild(ctrl);
            }
        }

        return ctrl;
    },

    //! bdestroy（可不传，默认为true），如果是false则仅取消管理，资源不会从父节点上移除
    removeResource : function (name, bdestroy) {
        if(this._Resource[name]) {
            if(bdestroy == undefined || bdestroy == true) {
                this._Resource[name].removeFromParent();
            }

            this._Resource[name]._mgr = undefined;
            this._Resource[name]._mgrname = undefined;
        }

        this._Resource[name] = undefined;
    },

    getResource : function (name) {
        if(this._Resource[name])
            return this._Resource[name];

        return undefined;
    },

    //! 初始化动作（动画），返回值为GameCanvasAction，传入gmcname为使用这个动作的gmc控件的名称，可以是string或者string数组
    initAction : function (name, gmcname) {
        if(!gmcname)
            return undefined;

        //! 不能初始化同名动画
        if(this._Action[name])
            return this._Action[name];

        var anode = new GameCanvasAction(this, gmcname);

        this._Action[name] = anode;
        anode._mgrname = name;
        return anode;
    },

    initAction_data : function (data) {
        if(!data.name)
            return ;

        var ctrl = this.initAction(data.name, data.res);

        if(ctrl)
            ctrl.setData(data);

        return ctrl;
    },

    removeAction : function (name) {
        this._Action[name] = undefined;
    },

    getAction : function (name) {
        if(this._Action[name])
            return this._Action[name];

        return undefined;
    },

    //! 初始化一个虚拟节点控件，返回值为GameCanvasVirtualNode
    initVirtual : function (name, gmcname) {
        //! 不能初始化同名按钮
        if(this._Virtual[name])
            return this._Virtual[name];

        var node = new GameCanvasVirtual(this, gmcname);

        this._Virtual[name] = node;
        node._mgrname = name;
        return node;
    },

    initVirtual_data : function (data) {
        if(!data.name)
            return ;

        var ctrl = this.initVirtual(data.name, data.res);

        if(ctrl)
            ctrl.setData(data);

        return ctrl;
    },

    removeVirtual : function (name) {
        this._Virtual[name] = undefined;
    },

    getVirtual : function (name) {
        if(this._Virtual[name])
            return this._Virtual[name];

        return undefined;
    },

    //! 初始化一个单一节点（初始情况下，节点内最好为空），返回值为GameCanvasSingleNode，传入nodename可以是string或者string数组
    initSingle : function (name, nodename, lstres) {
        //! 不能初始化同名节点
        if(this._SingleNode[name])
            return this._SingleNode[name];

        var snode = new GameCanvasSingleNode(this, nodename, lstres);

        this._SingleNode[name] = snode;
        snode._mgrname = name;
        return snode;
    },

    initSingleNode_data : function (data, lstres) {
        if(!data.name)
            return ;

        var ctrl = undefined;

        if(data.res)
            ctrl = this.initSingle(data.name, data.res, lstres);
        else
            ctrl = this.initSingle(data.name, data.name, lstres);

        if(ctrl)
            ctrl.setData(data);

        return ctrl;
    },

    removeSingle : function (name) {
        this._SingleNode[name] = undefined;
    },

    getSingle : function (name) {
        if(this._SingleNode[name])
            return this._SingleNode[name];

        return undefined;
    },

    //! 同步单一节点
    _refreshSingle : function () {
        for(var item in this._SingleNode) {
            var snode = this._SingleNode[item];

            if(snode)
                snode.refresh();
        }
    },

    //! 取画布总数
    getCanvasNums : function () {
        return this._lstCanvas.length;
    },

    //! 获取一个画布
    getCanvas : function (index) {
        if(index < 0 || index >= this._lstCanvas.length)
            return undefined;

        return this._lstCanvas[index];
    },

    // 设置canvas改变后的回调方法
    setCanvasChangedCallback : function (callback) {
        this.canvasChangedCallBack = callback;
    },

    // 设置当前画布索引
    setCurCanvasIndex : function (bindex) {
        if(this._curCanvasIndex == bindex)
            return;
        this._curCanvasIndex = bindex;
        if(this.canvasChangedCallBack){
            this.canvasChangedCallBack(bindex);
        }
    },

    //! 获取当前显示画布的索引
    getCurCanvasIndex : function () {
        return this._curCanvasIndex;
    },

    //! 设置是否显示画布
    showCanvas : function (bshow) {
        this._bShowCanvas = bshow;

        if(this._curCanvasIndex >= 0)
            this._lstCanvas[this._curCanvasIndex].show(this._bShowCanvas);
    },

    //! 主动刷新
    refresh : function () {
        this._curFrameSize = cc.size(0, 0);
        this.update(0);
    },

    update : function (dt) {
        if(this._lstCanvas.length <= 0)
            return ;

        if(this._StateMgr)
            this._StateMgr.update(dt);

        //! 模块
        for(var item in this._Module) {
            var module = this._Module[item];

            if(module)
                module.update(dt);
        }

        //! 动作
        for(var item in this._Action) {
            var anode = this._Action[item];

            if(anode)
                anode.update(dt);
        }

        //! 导出动画
        for(var item in this._Armature) {
            var anode = this._Armature[item];

            if(anode)
                anode.update(dt);
        }

        //! 资源
        for(var item in this._Resource) {
            var anode = this._Resource[item];

            if(anode)
                anode.update(dt);
        }

        //! 资源
        for(var item in this._TextGroup) {
            var anode = this._TextGroup[item];

            if(anode)
                anode.update(dt);
        }

        var fsize = cc.view.getFrameSize();

        // //---
        // if(fsize.width > 0 && fsize.height > 0) {
        //     if (fsize.width > fsize.height) {
        //         fsize.width = Math.round(900 / fsize.height * fsize.width);
        //         fsize.height = 900;
        //     } else {
        //         fsize.height = Math.round(900 / fsize.width * fsize.height);
        //         fsize.width = 900;
        //     }
        // }
        // //---

        if(fsize.width == this._curFrameSize.width && fsize.height == this._curFrameSize.height)
            return ;

        //console.log('view.getFrameSize() -- width: ' + fsize.width + ', height: ' + fsize.height);
        this._curFrameSize = fsize;
        this.refreshCanvas(fsize);
    },

    //! 刷新画布（找到最合适当前使用的）
    refreshCanvas : function (fsize) {
        if(fsize.width <= 0)
            fsize.width = 1;

        if(fsize.height <= 0)
            fsize.height = 1;

        var bindex = -1;
        var barea = 0;

        for(var ii = 0; ii < this._lstCanvas.length; ++ii) {
            var canvas = this._lstCanvas[ii];

            if(!canvas.canUser(this._flags))
                continue ;

            canvas.onChgSize(fsize.width, fsize.height);

            var darea = canvas.getDesignArea();

            if(darea > barea) {
                bindex = ii;
                barea = darea;
            }
        }

        if(bindex >= 0) {
            if(this._curCanvasIndex != bindex) {

                if(this._curCanvasIndex >= 0)
                    this._lstCanvas[this._curCanvasIndex].show(false);

                this._lstCanvas[bindex].show(true);

                // this._curCanvasIndex = bindex;
                this.setCurCanvasIndex(bindex);
                this._refreshSingle();
            }

            var dsize = this._lstCanvas[this._curCanvasIndex].getDesignSize();
            //cc.view.setDesignResolutionSize(dsize.width, dsize.height, cc.ResolutionPolicy.SHOW_ALL);
            cc.view.setDesignResolutionSize(fsize.width, fsize.height, cc.ResolutionPolicy.SHOW_ALL);
        }

        this.showCanvas(this._bShowCanvas);
    },

    //! 取一个节点相对于父节点的坐标 childs可以是gmc类对象、string（string数组） parents可以是gmc类对象、string（string数组）
    //! offx、offy偏移坐标（可不填）如果有offy 则offx和offy是number（number数组），否则offx是position（position数组）
    getPositionToParent : function (childs, parents, offx, offy) {
        var lstpos = [];

        var singlenode = undefined;        //! 判断在父子关系中，是否穿过了单一节点
        var sindex = -1;

        var cnums = this.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var canvas = this.getCanvas(ii);

            if(!canvas) {
                lstpos.push(undefined);
                continue ;
            }

            var cnode = this._getNode(childs,ii);
            var pnode = this._getNode(parents,ii);

            if(!cnode || !pnode) {
                lstpos.push(undefined);
                continue ;
            }

            //! 检查父子关系是否正确
            var tp = cnode.getParent();
            var bfind = false;

            while(tp) {
                if(tp == pnode) {
                    bfind = true;
                    break;
                }

                tp = tp.getParent();
            }

            if(!bfind) {
                lstpos.push(undefined);
                continue ;
            }

            //! 实际查找坐标
            //var pos = cnode.getPosition();
            var pos = cc.p(0, 0);
            this._addPosition(pos, offx, offy, ii);

            var t = cnode.getNodeToParentTransform();
            tp = cnode.getParent();

            if(!singlenode) {
                singlenode = this._getSingle_node(tp);

                if(singlenode)
                    sindex = ii;
            }

            while(tp && tp != pnode) {
                t = cc.affineTransformConcat(t, tp.getNodeToParentTransform());
                tp = tp.getParent();

                if(!singlenode) {
                    singlenode = this._getSingle_node(tp);

                    if(singlenode)
                        sindex = ii;
                }
            }

            pos = cc.pointApplyAffineTransform(pos, t);
            lstpos.push(pos);
        }

        //! 如果在某个画布上，父子关系中穿越了单一节点，则需要调整父子关系计算其他节点的数据
        if(singlenode) {
            for(var ii = 0; ii < cnums; ++ii) {
                if(lstpos[ii] != undefined)
                    continue ;

                singlenode.setCurIndex(ii);

                var canvas = this.getCanvas(ii);

                if(!canvas)
                    continue ;

                var cnode = this._getNode(childs,ii);
                var pnode = this._getNode(parents,ii);

                if(!cnode || !pnode)
                    continue ;

                //! 检查父子关系是否正确
                var tp = cnode.getParent();
                var bfind = false;

                while(tp) {
                    if(tp == pnode) {
                        bfind = true;
                        break;
                    }

                    tp = tp.getParent();
                }

                if(!bfind)
                    continue ;

                //! 实际查找坐标
                //var pos = cnode.getPosition();
                var pos = cc.p(0, 0);
                this._addPosition(pos, offx, offy, ii);

                var t = cnode.getNodeToParentTransform();
                tp = cnode.getParent();

                while(tp && tp != pnode) {
                    t = cc.affineTransformConcat(t, tp.getNodeToParentTransform());
                    tp = tp.getParent();
                }

                pos = cc.pointApplyAffineTransform(pos, t);
                lstpos[ii] = pos;
            }

            singlenode.refresh();
        }

        return lstpos;
    },

    //! 取到对应的实际节点 objs可以是gmc类对象、string（string数组）
    _getNode : function (objs, index) {
        var canvas = this.getCanvas(index);

        if(!canvas)
            return undefined;

        var obj = gmc.getElement(objs, index);

        if(!obj)
            return undefined;

        if(cc.isString(obj))
            return findChildByName(canvas, obj);

        if(obj.getNode)
            return obj.getNode(index);

        return undefined;
    },

    //! 根据一个实际节点，获取它所属的单一节点
    _getSingle_node : function (node) {
        for(var item in this._SingleNode) {
            var snode = this._SingleNode[item];

            if(snode.hasNode(node))
                return snode;
        }

        return undefined;
    },

    //! 叠加坐标
    _addPosition : function (pos, offx, offy, index) {
        if(offx != undefined) {
            if(offy != undefined) {
                var ox = gmc.getElement(offx, index);
                var oy = gmc.getElement(offx, index);

                if(ox != undefined && oy != undefined) {
                    pos.x += ox;
                    pos.y += oy;
                }
            }
            else {
                var op = gmc.getElement(offx, index);

                if(op != undefined) {
                    pos.x += op.x;
                    pos.y += op.y;
                }
            }
        }
    }

});

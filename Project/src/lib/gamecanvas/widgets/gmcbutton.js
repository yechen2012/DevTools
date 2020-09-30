/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 画布上使用的按钮
//! 数据
gmc.ButtonData = cc.Class.extend({
    ctor : function () {
        //! 基本信息
        this.btnname = undefined;           //! 按钮控件的名称，可以是string或者string数组
        this.areaname = undefined;          //! 点击控件的名称，如果没有则直接点击按钮，可以是string或者string数组
        this.callfunc = undefined;          //! 点击的回调函数（仅点击回调），可以对象或者数组
        this.target = undefined;            //! 调用函数的目标，可以对象或者数组

        //! 动画相关
        this.aniname = undefined;           //! 动画控件的名称，可以是string或者string数组
        this.anitype = -1;                   //! 动画类型 0studio动画（节点控件） 1armature动画（Armature控件） 2spine动画（节点控件）
        this.anires = undefined;            //! 动画用到的资源，可以对象或者数组，根据类型：0节点文件 1{res:动画文件,name:动画名字} 2{json:json文件,atlas:atlas文件}
        this.anidata = undefined;           //! 在不同状态下播放的动画数据

        //! 不常用设置
        this.callfuncex = undefined;        //! 通用回调函数（所有状态均会回调）
        this.lstbtnname = [];        //! 随着主按钮改变状态的一组按钮的名字，类型为数组（数组内部可以再包含数组）
    },
});

var GameCanvasButton = GameCanvasObject.extend({
    //! 构造，data为gmc.ButtonData，也可以后续调用setData初始化
    ctor : function (mgr, data, lstres) {
        this._super(mgr, 'button');

        this.gmcbutton = true;

        if(data != undefined)
            this.setData(data, lstres);
    },

    setData : function (data, lstres) {
        this._data = data;

        this._lstNode = [];

        var cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var canvas = this._mgr.getCanvas(ii);

            var node = {};

            if(data.btnname) {
                var name = gmc.getElement(data.btnname, ii);

                if(name) {
                    node.btn = gmc.findChildByName(canvas, name, lstres, ii);
                }
            }
            else{
                var name = gmc.getElement(data, ii);

                if(name) {
                    node.btn = gmc.findChildByName(canvas, name, lstres, ii);
                }
            }

            if(data.areaname) {
                var name = gmc.getElement(data.areaname, ii);

                if(name) {
                    node.area = gmc.findChildByName(canvas, name, lstres, ii);
                }
            }

            if(node.area) {
                node.area.addTouchEventListener(this._onTouch, this);

                if(node.btn)
                    node.btn.setTouchEnabled(false);
            }
            else if(node.btn) {
                node.btn.addTouchEventListener(this._onTouch, this);
            }

            // if(data.callfunc) {
            //     node.callfunc = gmc.getElement(data.callfunc, ii);
            //     node.target = gmc.getElement(data.target, ii);
            // }
            //
            // if(data.callfuncex) {
            //     node.callfuncex = gmc.getElement(data.callfuncex, ii);
            // }

            //! 动画暂缺

            this._lstNode.push(node);
        }

        if(data.lstbtnname) {
            this._initButtonList(lstres);
        }

        this._super(data);
    },

    getNode : function (index) {
        if(index < 0 || index >= this._lstNode.length)
            return undefined;

        if(!this._lstNode[index])
            return undefined;

        if(this._lstNode[index].area)
            return this._lstNode[index].area;

        if(this._lstNode[index].btn)
            return this._lstNode[index].btn;

        return undefined;
    },

    //! 设置一组随主按钮改变状态的按钮
    setButtonList : function (lstbtnname) {
        this._data.lstbtnname = lstbtnname;
        this._initButtonList();
    },

    // //! 设置按钮的回调函数，传入可以对象或者数组
    // setCallFunction : function (callfunc, target) {
    //     for(var ii = 0; ii < this._lstNode.length; ++ii) {
    //         var node = this._lstNode[ii];
    //
    //         if(callfunc) {
    //             node.callfunc = gmc.getElement(callfunc, ii);
    //             node.target = gmc.getElement(target, ii);
    //         }
    //         else {
    //             node.callfunc = undefined;
    //             node.target = undefined;
    //         }
    //     }
    // },
    //
    // setCallFunctionEx : function (callfuncex, target) {
    //     for(var ii = 0; ii < this._lstNode.length; ++ii) {
    //         var node = this._lstNode[ii];
    //
    //         if(callfuncex) {
    //             node.callfuncex = gmc.getElement(callfuncex, ii);
    //             node.target = gmc.getElement(target, ii);
    //         }
    //         else {
    //             node.callfuncex = undefined;
    //             node.target = undefined;
    //         }
    //     }
    // },

    _initButtonList : function (lstres) {
        if(!this._data.lstbtnname || this._data.lstbtnname.length <= 0)
            return ;

        for(var jj = 0; jj < this._lstNode.length; ++jj) {
            var node = this._lstNode[jj];
            node.lstbtn = [];
        }

        for(var ii = 0; ii < this._data.lstbtnname.length; ++ii) {
            var btnname = this._data.lstbtnname[ii];

            for(var jj = 0; jj < this._lstNode.length; ++jj) {
                var canvas = this._mgr.getCanvas(jj);
                var node = this._lstNode[jj];

                var name = gmc.getElement(btnname, jj);

                if(name) {
                    var btn = gmc.findChildByName(canvas, name, lstres, jj);

                    if(btn) {
                        btn.setTouchEnabled(false);
                        node.lstbtn.push(btn);
                    }
                }
            }
        }
    },

    _refreshButtonList : function () {
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(!node)
                continue ;

            if(!node.lstbtn)
                continue ;

            for(var jj = 0; jj < node.lstbtn.length; ++jj) {
                var btn = node.lstbtn[jj];

                if(node.btn) {
                    btn.setVisible(node.btn.isVisible());
                    btn.setEnabled(node.btn.isEnabled());
                    btn.setBright(node.btn.isBright());
                    //btn.setHighlighted(node.btn.isHighlighted());
                }
                else if(node.area) {
                    btn.setVisible(node.area.isVisible());
                    btn.setEnabled(node.area.isEnabled());
                    btn.setBright(node.area.isBright());
                    //btn.setHighlighted(node.area.isHighlighted());
                }
            }
        }
    },

    _setVisible : function (visible) {
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(!node)
                continue ;

            if(node.btn) {
                node.btn.setVisible(visible);
            }

            if(node.area) {
                node.area.setVisible(visible);
            }
        }

        this._refreshButtonList();
    },

    setColor : function (color) {
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(!node)
                continue ;

            if(node.btn) {
                node.btn.setColor(color);
            }

            for(var jj = 0; jj < node.lstbtn.length; ++jj) {
                var btn = node.lstbtn[jj];
                btn.setColor(color);
            }
        }
    },

    setOpacity: function (opacity) {
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(!node)
                continue ;

            if(node.btn) {
                node.btn.setOpacity(opacity);
            }

            for(var jj = 0; jj < node.lstbtn.length; ++jj) {
                var btn = node.lstbtn[jj];
                btn.setOpacity(opacity);
            }
        }
    },

    //! 如果有y 则x和y是number（number数组），否则x是position（position数组）
    setPosition : function (x, y) {
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(!node)
                continue ;

            if(y != undefined) {
                var cx = gmc.getElement(x, ii);
                var cy = gmc.getElement(y, ii);

                if(cx != undefined && cy != undefined) {
                    if(node.area)
                        node.area.setPosition(cx, cy);

                    if(node.btn)
                        node.btn.setPosition(cx, cy);
                }
            }
            else {
                var cp = gmc.getElement(x, ii);

                if (cp != undefined) {
                    if(node.area)
                        node.area.setPosition(cp);

                    if(node.btn)
                        node.btn.setPosition(cp);
                }
            }
        }
    },

    getPosition: function () {
        var lstpos = [];
        for (var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if (!node){
                lstpos.push(undefined);
                continue;
            }

            if(node.btn && node.btn.getPosition){
                var pos = node.btn.getPosition();
                lstpos.push(pos);
            }
            else if(node.area && node.area.getPosition){
                var pos = node.area.getPosition();
                lstpos.push(pos);
            }
            else{
                lstpos.push(undefined);
            }
        }

        return lstpos;
    },

    _setEnabled : function (enabled) {
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(node.btn) {
                node.btn.setEnabled(enabled);
                node.btn.setBright(enabled);
            }

            if(node.area) {
                node.area.setEnabled(enabled);
                node.area.setBright(enabled);
            }
        }

        this._refreshButtonList();
    },

    isEnabled: function() {
        var ret = false;
        var index=this._mgr.getCurCanvasIndex();
        //var node = this.getNode(index);
        //if (node) {
        //    ret = node.isEnabled();
        //}

        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];
            if(!node.btn && !node.area)
                continue;

            if(node.btn) {
                ret = node.btn.isEnabled();
            }

            if(node.area) {
                ret = node.area.isEnabled();
            }

            break;
        }

        return ret;
    },

    setBright : function (enabled) {
        //this.setEnabled(enabled);
    },

    //！设置按钮文本
    setTitleText: function (text, size, color) {
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(!node)
                continue ;

            if(!node.btn)
                continue ;

            if(text)
                node.btn.setTitleText(text);

            if(size && size > 0)
                node.btn.setTitleFontSize(size);

            if(color)
                node.btn.setTitleColor(color);
        }
    },

    _onTouch : function (sender, type) {
        if(!this._visible)
            return ;



        var cums = 0;
        var cindex = 0;
        for(var ii = 0; ii < this._lstNode.length; ii++){
            var cnode = this.getNode(ii);
            if(cnode){
                cindex = ii;
                cums++;
            }
        }

        if(cums > 1){
            var cindex = this._mgr.getCurCanvasIndex();
        }

        var node = this._lstNode[cindex];

        if(node.area) {
            //! 如果使用点击区域，就要设置按钮状态
            var bhl = node.area.isHighlighted();

            for(var ii = 0; ii < this._lstNode.length; ++ii) {
                var cnode = this._lstNode[ii];

                if(cnode.btn) {
                    cnode.btn.setHighlighted(bhl);
                }

                if(cnode.lstbtn) {
                    for(var jj = 0; jj < cnode.lstbtn.length; ++jj) {
                        var btn = cnode.lstbtn[jj];

                        btn.setHighlighted(bhl);
                    }
                }
            }
        }

        //this._refreshButtonList();

        this._callFunctionEx(type);

        if (type == ccui.Widget.TOUCH_ENDED) {
            if (!this.isEnabled())
                return;

            this._callFunction();
        }

        // if(node.callfuncex) {
        //     // if(node.target)
        //     //     node.callfuncex.call(node.target, sender, type);
        //     // else
        //     //     node.callfuncex.call(sender, type);
        //
        //     if(node.target)
        //         node.callfuncex.call(node.target, this, type);
        //     else
        //         node.callfuncex.call(this, type);
        // }
        //
        // if (type == ccui.Widget.TOUCH_ENDED) {
        //     if(node.callfunc) {
        //         if(node.target)
        //             node.callfunc.call(node.target, this);
        //         else
        //             node.callfunc.call(this);
        //     }
        // }
    },

    //! 销毁
    destory : function () {
        if(this._mgr && this._mgrname)
            this._mgr.removeButton(this._mgrname);
    }
});
//部分bug todo
var gmc = gmc || {};

var GameCanvasRichTextEx = GameCanvasObject.extend({
    //! 构造，textname为画布上控件的名字，可以是string或者string数组，bmulline为是否可以多行显示（默认开启），scaletype为缩放方式 -1不缩放 0整体缩放 1横向缩放 2纵向缩放（默认整体缩放）
    ctor: function (mgr, textname, bmulline, scaletype, lstres) {
        this._super(mgr, 'texrichtex');

        this.gmcrichtextex = true;
        this.textname = textname;
        this._lstText = [];

        var cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var canvas = this._mgr.getCanvas(ii);
            var name = gmc.getElement(textname, ii);

            if(name) {
                var node = gmc.findChildByName(canvas, name, lstres, ii);

                if(node) {
                    var nodeparent=node.getParent();
                    var enode = new RichTextEx(node, nodeparent,bmulline, scaletype);
                    this._lstText.push(enode);
                    node.removeFromParent();
                }
                else
                    this._lstText.push(undefined);
            }
            else {
                this._lstText.push(undefined);
            }
        }
    },

    //不应该去取这个实际node节点，有需求todo
    getNode : function (index) {
        // if(index < 0 || index >= this._lstText.length)
        //     return undefined;
        //
        // if(!this._lstText[index])
        //     return undefined;
        // return this._lstText[index].getTextCtrl();
        return undefined;
    },

    getPosition: function () {
        var lstpos = [];
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if(!node){
                lstpos.push(undefined);
                continue;
            }

            if(node.getPosition){
                var pos = node.getPosition();
                lstpos.push(pos);
            }
            else{
                lstpos.push(undefined);
            }
        }

        return lstpos;
    },

    //! 设置显示字符串
    setString : function (text) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if(node)
                node.setString(text);
        }
    },

    _setVisible : function (visible) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if(node)
                node.setVisible(visible);
        }
    },

    getRichTextEx : function (index) {
        if(index < 0 || index >= this._lstText.length)
            return undefined;

        return this._lstText[index];
    },
    getTextEx : function (index) {
        if(index < 0 || index >= this._lstText.length)
            return undefined;

        return this._lstText[index];
    },
    //!下面接口尽量外部不要调用，可能有性能问题
    //富文本里面有很多文本子节点，更改+范围适配带来很多性能操作，目前是初始化时一次调用处理完，

    //! 设置是否多行显示
    setMultiLine : function (bmulline) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if(node)
                node.setMultiLine(bmulline);
        }
    },

    //! 设置缩放方式 -1不缩放 0整体缩放 1横向缩放 2纵向缩放
    setScaleType : function (scaletype) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if(node)
                node.setScaleType(scaletype);
        }
    },

    setOpacity: function (opacity) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if(node)
                node.setOpacity(opacity);
        }
    },

    //! 设置对齐方式
    setTextHorizontalAlignment: function (alignment) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if(node)
                node.setTextHorizontalAlignment(alignment);
        }
    },

    setTextVerticalAlignment: function (alignment) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if(node)
                node.setTextVerticalAlignment(alignment);
        }
    },
    setFontName: function (name) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if(node){
                node.setFontName(name);
            }
        }
    },

    //! 设置文字大小
    setFontSize: function (size) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if (node){
                node.setFontSize(size);
            }
        }
    },
    //! 设置字体颜色
    setTextColor: function (color) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if (node){
                node.setTextColor(color);
            }
        }
    },

    //! 如果有y 则x和y是number（number数组），否则x是position（position数组）
    setPosition : function (x, y) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if(!node)
                continue ;

            if(y != undefined) {
                var cx = gmc.getElement(x, ii);
                var cy = gmc.getElement(y, ii);

                if(cx != undefined && cy != undefined)
                    node.setPosition(cx, cy);
            }
            else {
                var cp = gmc.getElement(x, ii);

                if (cp != undefined)
                    node.setPosition(cp);
            }
        }
    },
    setContentSize:function(size){
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if(!node)
                continue ;

            node.setContentSize(size);
        }

    },
    //! 设置数据
    setData : function (data) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if (!node)
                continue ;

            if(data.bmulline != undefined) {
                var bmulline = gmc.getElement(data.bmulline, ii);

                if(bmulline != undefined)
                    node.setMultiLine(bmulline,true);
            }

            if(data.scaletype != undefined) {
                var scaletype = gmc.getElement(data.scaletype, ii);

                if(scaletype != undefined)
                    node.setScaleType(scaletype,true);
            }

            if(data.horalignment != undefined) {
                var horalignment = gmc.getElement(data.horalignment, ii);

                if(horalignment != undefined)
                    node.setTextHorizontalAlignment(horalignment,true);
            }

            if(data.veralignment != undefined) {
                var veralignment = gmc.getElement(data.veralignment, ii);

                if(veralignment != undefined)
                    node.setTextVerticalAlignment(veralignment,true);
            }

            if(data.fontname != undefined) {
                var fontname = gmc.getElement(data.fontname, ii);

                if(fontname != undefined)
                    node.setFontName(fontname,true);
            }
            if(data.fontsize != undefined) {
                var fontsize = gmc.getElement(data.fontsize, ii);

                if(fontsize != undefined)
                    node.setFontSize(fontsize,true);
            }

            if(data.textcolor != undefined) {
                var textcolor = gmc.getElement(data.textcolor, ii);

                if(textcolor != undefined)
                    node.setTextColor(textcolor,true);
            }

            if(data.str != undefined) {
                var str = gmc.getElement(data.str, ii);

                if(str != undefined){
                    LanguageData.instance.showTextStr(str,node,true);
                }
            }
            node.checkRefreshText();
        }
        this._super(data);
    },
    //描边临时接口，暂时没解析配置，todo
    // outlineColor=cc.color(14,74,103)
    enableOutline: function (outlineColor, outlineSize) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if(!node)
                continue ;

            node.enableOutline(outlineColor, outlineSize);
        }
    },
    //! 销毁
    destory : function () {
        if(this._mgr && this._mgrname)
            this._mgr.removeRichTextEx(this._mgrname);
    }
});
/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 用于游戏画布的文字（在每个画布上如果要使用文字，则应该放置相应的控件）
var GameCanvasTextBMFontEx = GameCanvasObject.extend({
    //! 构造，textname为画布上控件的名字，可以是string或者string数组，scaletype为缩放方式 -1不缩放 0整体缩放 1横向缩放 2纵向缩放（默认横向缩放）
    ctor: function (mgr, textname, scaletype, lstres) {
        this._super(mgr, 'textbmfontex');

        this.gmctextbmfontex = true;

        this._lstText = [];

        var cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var canvas = this._mgr.getCanvas(ii);
            var name = gmc.getElement(textname, ii);

            if(name) {
                var node = gmc.findChildByName(canvas, name, lstres, ii);

                if(node) {
                    var enode = new TextBMFontEx(node, scaletype);
                    this._lstText.push(enode);
                }
                else
                    this._lstText.push(undefined);
            }
            else {
                this._lstText.push(undefined);
            }
        }
    },

    getNode : function (index) {
        if(index < 0 || index >= this._lstText.length)
            return undefined;

        if(!this._lstText[index])
            return undefined;

        return this._lstText[index].getTextBMFontCtrl();
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

    getTextBMFontEx : function (index) {
        if(index < 0 || index >= this._lstText.length)
            return undefined;

        return this._lstText[index];
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

    // //! 设置字体文件
    // setFntFile: function (fileName) {
    //     for(var ii = 0; ii < this._lstText.length; ++ii) {
    //         var node = this._lstText[ii];
    //
    //         if(node)
    //             node.setFntFile(fileName);
    //     }
    // },

    //! 设置颜色
    setColor: function (color) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if (node)
                node.setColor(color);
        }
    },

    //! 设置缩放（会影响实际显示区域）
    setScale : function (scale) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if (node)
                node.setScale(scale);
        }
    },

    setScaleX : function (scale, brefresh) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if (node)
                node.setScaleX(scale);
        }
    },

    setScaleY : function (scale, brefresh) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if (node)
                node.setScaleY(scale);
        }
    },

    getScale : function () {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if (node)
                return node.getScale();
        }

        return 0;
    },

    getScaleX : function () {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if (node)
                return node.getScaleX();
        }

        return 0;
    },

    getScaleY : function () {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if (node)
                return node.getScaleY();
        }

        return 0;
    },

    //! 设置数据
    setData : function (data) {
        for(var ii = 0; ii < this._lstText.length; ++ii) {
            var node = this._lstText[ii];

            if (!node)
                continue ;

            if(data.scaletype != undefined) {
                var scaletype = gmc.getElement(data.scaletype, ii);

                if(scaletype != undefined)
                    node.setScaleType(scaletype);
            }

            if(data.scale != undefined) {
                var scale = gmc.getElement(data.scale, ii);

                if(scale != undefined)
                    node.setScale(scale);
            }

            if(data.scalex != undefined) {
                var scalex = gmc.getElement(data.scalex, ii);

                if(scalex != undefined)
                    node.setScaleX(scalex);
            }

            if(data.scaley != undefined) {
                var scaley = gmc.getElement(data.scaley, ii);

                if(scaley != undefined)
                    node.setScaleY(scaley);
            }

            if(data.color != undefined) {
                var color = gmc.getElement(data.color, ii);

                if(color != undefined)
                    node.setColor(color);
            }

            if(data.str != undefined) {
                var str = gmc.getElement(data.str, ii);

                if(str != undefined)
                    node.setString(str);
            }
        }

        this._super(data);
    },

    //! 销毁
    destory : function () {
        if(this._mgr && this._mgrname)
            this._mgr.removeTextBMFontEx(this._mgrname);
    }
});
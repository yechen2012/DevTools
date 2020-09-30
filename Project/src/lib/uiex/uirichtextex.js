//有些接口没有定义,部分接口有bug，底层坑有些多
//不接受scale设定，因为适配和scale相关，外层很难准确知道scale，值是错误的
//不接受锚点设定，因为锚点会被对齐方式更改，设定没有意义
//如果设置字体名，/fxxxx最后设置
//颜色/cffffff,字体大小/s40,透明度/o255,字体文件名/fxxxxxx
//自定义节点#/p@icefire_back_count.png#，图片名icefire_back_count.png，资源需预加载
var RichTextEx = cc.Class.extend({
    ctor: function (uitext, uiparent, bmulline, scaletype) {
        if (!uitext) {
            return;
        }

        this.iFontSize=256;//默认值，会被覆盖
        this.iRealSize=256;//默认值，会被覆盖

        this.bMultiLine = true;         //! 是否可以多行显示

        this.iScaleType = 0;            //! -1不缩放 0整体缩放 1横向缩放 2纵向缩放（1,2不支持，效果同整体缩放）
        if (bmulline != undefined)
            this.bMultiLine = bmulline;

        if (scaletype != undefined)
            this.iScaleType = scaletype;
        this.fontSize = uitext.getFontSize();//默认字体大小
        this.fontColor = uitext.getTextColor();//默认字体颜色
        this.fontName = uitext.getFontName();//默认字体
        this.fontOp = uitext.getOpacity();//默认透明度
        this.horalignment = uitext.getTextHorizontalAlignment();//默认对齐方式
        this.veralignment = uitext.getTextVerticalAlignment();//默认对齐方式
        this.anchorP = uitext.getAnchorPoint();//默认锚点
        this.textPosi = uitext.getPosition();
        this.isIgnoreContent = uitext.isIgnoreContentAdaptWithSize();
        this.tempparent = uiparent;
        this.initRichNode();
        if (!this.isIgnoreContent) {
            this.ContentSize = uitext.getContentSize();
            this.richText.setContentSize(this.ContentSize);
            this._refeshAnchorPoint();
            this._refresh();
        }
    },
    initRichNode: function () {
        this.richText = new UiRichTextNode();
        this.richText.ignoreContentAdaptWithSize(this.isIgnoreContent);
        this.richText.setLineBreakOnSpace(true);
        this.richText.setCascadeOpacityEnabled(true);
        this.tempparent.addChild(this.richText, 100);
    },
    getRealSize: function () {
        if(this.iRealSize >= 256)
            return this.iFontSize;

        return this.iRealSize;
    },

    setRealSize: function (size) {
        this.iFontSize=size;
        this.richText.setMinFontSize(size);
        this._refresh();
    },
    //富文本和单文本位置有些区别
    _refeshAnchorPoint: function () {
        var csize = this.ContentSize;
        if (csize == undefined) {
            return;
        }
        var tha = this.horalignment;
        var tva = this.veralignment;
        switch (tha) {
            case 0:
                //! 左对齐
                this.anchorP.x = 0;
                break;
            case 1:
                //! 中心对齐
                this.anchorP.x = 0.5;
                break;
            case 2:
                //! 右对齐
                this.anchorP.x = 1;
                break;
        }

        switch (tva) {
            case 0:
                //! 顶对齐
                this.anchorP.y = 1;
                break;
            case 1:
                //! 中心对齐
                this.anchorP.y = 0.5;
                break;
            case 2:
                //! 底对齐
                this.anchorP.y = 0;
                break;
        }
        var richp = cc.p((this.anchorP.x - 0.5) * csize.width + this.textPosi.x, (this.anchorP.y - 0.5) * csize.height + this.textPosi.y);
        this.richText.setTextHorizontalAlignment(this.horalignment);
        this.richText.setTextVerticalAlignment(this.veralignment);
        this.richText.setAnchorPoint(this.anchorP);
        this.richText.setPosition(richp);
    },
    //! 刷新
    _refresh: function () {
        if (!this._canScale()) {
            return;
        }
        var csize = this.ContentSize;
        if (!this.bMultiLine) {
            //单行处理为ignoreSize，直接缩放
            this.richText.ignoreContentAdaptWithSize(true);
            this.richText.formatText();
            var renderSize = this.richText.getVirtualRendererSize();
            var smallw = csize.width / renderSize.width;
            var smallh = csize.height / renderSize.height;
            var minsmall = Math.min(smallh, smallw);
            this.richText.setScale(minsmall);
        } else if (this.iScaleType == 0||this.iScaleType == 1||this.iScaleType == 2) {
            //! 整体缩放，改变字体大小
            var vrsize = this.richText.getContainerSize();
            if (vrsize.height > csize.height) {
                this.richText.smallAllElements();
            }
        }
        // else if (this.iScaleType == 1) {
        //     //! 把字横向挤扁，多行
        //     //! 防止字体太大，一行的高度超过区域高度的情况，暂不考虑这个问题
        //     var vrsize = this.richText.getContainerSize();
        //
        //     if (vrsize.width > csize.width) {
        //         this.richText.setScaleX(csize.width / vrsize.width);
        //     }
        // } else if (this.iScaleType == 2) {
        //     //! 把字纵向挤扁，多行
        //     var vrsize = this.richText.getContainerSize();
        //
        //     if (vrsize.height > csize.height) {
        //         this.richText.setScaleY(csize.height / vrsize.height);
        //     }
        // }
        this.richText._formatTextDirty = true;
        this.richText.formatText();

        this.iRealSize=this.richText.getMinFontSize();
    },
    _parseString: function (text) {
        //这种做法对于文字中有#会乱序 todo
        var strs = text.split('#');
        var richreg = /@(.*?)@([\s\S]+)/;
        var customreg = /\/p@(.+)/;
        for (var index in strs) {
            var value = strs[index];
            var isCustom = customreg.test(value);
            //由于分隔符，自定义节点不会参杂再文本中，及富文本中不能直接插入节点信息，需要手动配成两段
            if (isCustom) {
                this._handlerConstom(value);
                continue;
            }
            var nindex = value.indexOf('\n');
            var isRich = richreg.test(value);

            if (nindex == -1) {
                if (isRich) {
                    var result = richreg.exec(value);
                    var fontkey = result[1];
                    var fonttext = result[2];
                    this._createRichEles(fontkey, fonttext);
                } else {
                    this._createRichEles("", value);
                }
            } else {
                this._handlerLine(isRich, value);
            }
        }
    },
    _handlerConstom: function (value) {
        var customreg = /\/p@(.+)/;
        var result = customreg.exec(value);
        var imagekey = result[1];
        this._createCustomEles(imagekey);
    },
    _handlerLine: function (isRich, value) {
        if (isRich) {
            var richreg = /@(.*?)@([\s\S]+)/;
            var result = richreg.exec(value);
            var fontkey = result[1];
            var fonttext = result[2];
            var tempstrs = fonttext.split('\n');
            var templength = tempstrs.length;
            for (var ti in tempstrs) {
                var tempvalue = tempstrs[ti];
                this._createRichEles(fontkey, tempvalue);
                if (tempvalue != "" && ti != templength - 1) {
                    this._createRichEles("", '\n');
                }
            }
        } else {
            var tempstrs = value.split('\n');
            var templength = tempstrs.length;
            for (var ti in tempstrs) {
                var tempvalue = tempstrs[ti];
                this._createRichEles("", tempvalue);
                if (tempvalue != "" && ti != templength - 1) {
                    this._createRichEles("", '\n');
                }
            }
        }
    },
    _createRichEles: function (fontkey, fonttext) {
        if (fonttext === "") {
            return;
        }
        var fontcolor = this.fontColor;
        var fontname = this.fontName;
        var fontop = this.fontOp;
        var fontsize = this.fontSize;
        if (fontkey.indexOf('/c') != -1) {
            var colorreg = /\/c([0-9a-fA-f]{6})/;
            var color = colorreg.exec(fontkey);
            fontcolor = this._colorRgb(color[1]);
        }
        if (fontkey.indexOf('/s') != -1) {
            var sizereg = /\/s(\d+)/;
            var size = sizereg.exec(fontkey);
            fontsize = parseInt(size[1]);
        }
        if (fontkey.indexOf('/o') != -1) {
            var opreg = /\/o(\d+)/;
            var op = opreg.exec(fontkey);
            fontop = parseInt(op[1]);
        }
        if (fontkey.indexOf('/f') != -1) {
            var fontreg = /\/f(.+)/;
            var name = fontreg.exec(fontkey);
            fontname = name[1];
        }
        var ele = new ccui.RichElementText(0, fontcolor, fontop, fonttext, fontname, fontsize);
        this.richText.pushBackElement(ele);
    },
    _createCustomEles: function (imagekey) {
        var spkey = '#' + imagekey;
        var customnode = new cc.Sprite(spkey);
        var ele = new ccui.RichElementCustomNode(0, cc.color(255, 255, 255), 255, customnode);
        this.richText.pushBackElement(ele);
    },
    //! 是否可以缩放
    _canScale: function () {
        if (this.isIgnoreContent)
            return false;

        if (this.iScaleType < 0)
            return false;

        return true;
    },
    //! 设置是否多行显示
    setMultiLine: function (bmulline, waitrefresh) {
        if (this.bMultiLine != bmulline) {
            this.bMultiLine = bmulline;
            if (!waitrefresh) {
                this._refresh();
            }
        }
    },
    //! 设置缩放方式 -1不缩放 0整体缩放 1横向缩放 2纵向缩放
    setScaleType: function (scaletype, waitrefresh) {
        if (this.iScaleType != scaletype) {
            this.iScaleType = scaletype;
            if (!waitrefresh) {
                this._refresh();
            }
        }
    },
    checkRefreshText: function () {
        this._refresh();
    },
    //! 设置显示字符串
    setString: function (text, waitrefresh) {
        this.richText.clearAllEles();
        this._parseString(text);
        if (!waitrefresh) {
            this._refresh();
        }
    },
    setVisible: function (visible) {
        this.richText.setVisible(visible);
    },
    isVisible: function () {
        return this.richText.isVisible();
    },
    setPosition: function (newPosOrxValue, yValue, waitrefresh) {
        if (!this.richText)
            return;
        if (yValue == undefined) {
            this.textPosi = newPosOrxValue;
        } else {
            this.textPosi = cc.p(newPosOrxValue, yValue);
        }
        this._refeshAnchorPoint();
        if (!waitrefresh) {
            this._refresh();
        }
    },
    //! 设置对齐方式，文本整体样式对齐
    setTextHorizontalAlignment: function (alignment, waitrefresh) {
        if (this.horalignment == alignment)
            return;
        this.horalignment = alignment
        this._refeshAnchorPoint();
        if (!waitrefresh) {
            this._refresh();
        }
    },
    //! 设置对齐方式，文本整体样式对齐
    setTextVerticalAlignment: function (alignment, waitrefresh) {
        if (this.veralignment == alignment)
            return;

        this.veralignment = alignment
        this._refeshAnchorPoint();
        if (!waitrefresh) {
            this._refresh();
        }
    },
    //! 新提供单行对齐方式，处理不同文字段字体，自定义节点高度不一致，默认cc.VERTICAL_TEXT_ALIGNMENT_CENTER=1,top=0,bottom=2
    setLineTextVerticalAlignment: function (alignment) {
        this.richText.setLineAlignment(alignment);
        this._refresh();
    },
    setPositionX: function (x) {
        if (this.textPosi.x == x)
            return;
        this.textPosi.x = x;
        this._refeshAnchorPoint();
    },

    setPositionY: function (y) {
        if (this.textPosi.y == y)
            return;
        this.textPosi.y = y;
        this._refeshAnchorPoint();
        this._refresh();
    },
    setContentSize: function (size) {
        this.ContentSize = size;
        this._refeshAnchorPoint();
        this._refresh();
    },
    setFontName: function (fontname, waitrefresh) {
        this.fontName = fontname;
        if (!waitrefresh) {
            this._refresh();
        }
    },
    setFontSize: function (fontsize, waitrefresh) {
        this.fontSize = fontsize;
        if (!waitrefresh) {
            this._refresh();
        }
    },
    setTextColor: function (color, waitrefresh) {
        this.fontColor = color;
        if (!waitrefresh) {
            this._refresh();
        }
    },
    ignoreContentAdaptWithSize: function (value) {
        this.isIgnoreContent = value;
    },
    //显示和预想的位置会有偏差，注意
    getPositionX: function () {
        return this.richText.getPositionX();
    },
    //显示和预想的位置会有偏差，注意
    getPositionY: function () {
        return this.richText.getPositionY();
    },
    getContentSize: function () {
        return this.richText.getContentSize();
    },
    setRichNodeName: function (str) {
        this.richText.setName(str);
    },
    //描边临时接口，暂时没解析配置，todo
    enableOutline: function (outlineColor, outlineSize) {
        this.richText.enableOutline(outlineColor, outlineSize);
    },
    _colorRgb: function (colorstr) {
        var sColor = colorstr.toLowerCase();
        var sColorChange = [];
        for (var i = 0; i < 6; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        var color = cc.color(sColorChange[0], sColorChange[1], sColorChange[2]);
        return color;
    }
});
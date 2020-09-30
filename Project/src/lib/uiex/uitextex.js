/**
 * Created by ssscomic on 2017/11/16.
 */

//! 强化ccui.Text
var TextEx = cc.Class.extend({
    //! 构造，uitext为对应的ccui.Text（该控件应该开启了自定义尺寸，未开启则不缩放），bmulline为是否可以多行显示（默认开启），scaletype为缩放方式 -1不缩放 0整体缩放 1横向缩放 2纵向缩放（默认整体缩放）
    ctor: function (uitext, bmulline, scaletype) {
        if(!uitext)
            return ;

        this._Text = uitext;
        this.bMultiLine = true;         //! 是否可以多行显示
        this.iScaleType = 0;            //! -1不缩放 0整体缩放 1横向缩放 2纵向缩放

        if(bmulline != undefined)
            this.bMultiLine = bmulline;

        if(scaletype != undefined)
            this.iScaleType = scaletype;

        if(!this._Text.isIgnoreContentAdaptWithSize()) {
            this.ContentSize = this._Text.getContentSize();
            this.iFontSize = this._Text.getFontSize();
            this.iRealSize = this.iFontSize;

            this._refeshAnchorPoint();
            this._refresh();
        }
    },

    //! 获取ccui.Text控件（可以取其中属性，尽量不直接使用该接口改变控件属性，如果改变了控件属性，应该调用刷新refresh）
    getTextCtrl : function () {
        this._Text.setTextAreaSize(this.ContentSize);
        this._Text.setFontSize(this.iFontSize);
        this._Text.setScale(1);

        return this._Text;
    },

    refresh : function () {
        this.ContentSize = this._Text.getContentSize();
        if(this.iFontSize == undefined)
            this.iFontSize = this._Text.getFontSize();

        this.iRealSize = this.iFontSize;

        this._refeshAnchorPoint();
        this._refresh();
    },

    //! 设置是否多行显示
    setMultiLine : function (bmulline) {
        if(this.bMultiLine != bmulline) {
            this.bMultiLine = bmulline;
            this.iRealSize = this.iFontSize;
            this._refresh();
        }
    },

    //! 设置缩放方式 -1不缩放 0整体缩放 1横向缩放 2纵向缩放
    setScaleType : function (scaletype) {
        if(this.iScaleType != scaletype) {
            this.iScaleType = scaletype;
            this.iRealSize = this.iFontSize;
            this._refresh();
        }
    },

    //! 设置显示字符串
    setString : function (text) {
        this._Text.setString(text);
        this.iRealSize = this.iFontSize;
        this._refresh();
    },

    setVisible : function (visible) {
        this._Text.setVisible(visible);
    },

    isVisible : function () {
        return this._Text.isVisible();
    },

    setOpacity: function (opacity) {
        this._Text.setOpacity(opacity);
    },

    setPosition: function (newPosOrxValue, yValue) {
        if(!this._Text)
            return ;

        this._Text.setPosition(newPosOrxValue, yValue);
    },

    getPosition: function () {
        if(!this._Text)
            return ;

        return this._Text.getPosition();
    },

    //! 设置对齐方式
    setTextHorizontalAlignment: function (alignment) {
        if(this._Text.getTextHorizontalAlignment() == alignment)
            return ;

        this._Text.setTextHorizontalAlignment(alignment);
        this._refeshAnchorPoint();
        this.iRealSize = this.iFontSize;
        this._refresh();
    },

    setTextVerticalAlignment: function (alignment) {
        if(this._Text.getTextVerticalAlignment() == alignment)
            return ;

        this._Text.setTextVerticalAlignment(alignment);
        this._refeshAnchorPoint();
        this.iRealSize = this.iFontSize;
        this._refresh();
    },

    //! 设置字体
    setFontName: function (name) {
        this._Text.setFontName(name);
        this.iRealSize = this.iFontSize;
        this._refresh();
    },

    //! 设置文字大小
    setFontSize: function (size) {
        this._Text.setFontSize(size);
        this.iFontSize = size;
        this.iRealSize = this.iFontSize;
        this._refresh();
    },

    getRealSize: function () {
        if(this.iRealSize == undefined)
            this.iRealSize = this.iFontSize;

        return this.iRealSize;
    },

    setRealSize: function (size) {
        this._Text.setFontSize(size);
        this.iRealSize = size;
        this._refresh();
    },

    //! 设置阴影
    enableShadow: function (shadowColor, offset, blurRadius) {
        this._Text.enableShadow(shadowColor, offset, blurRadius);
        this.iRealSize = this.iFontSize;
        this._refresh();
    },

    //! 设置描边
    enableOutline: function (outlineColor, outlineSize) {
        this._Text.enableOutline(outlineColor, outlineSize);
        this.iRealSize = this.iFontSize;
        this._refresh();
    },

    //! 设置颜色
    setColor: function (color) {
        this._Text.setColor(color);
    },

    //! 设置字体颜色
    setTextColor: function (color) {
        this._Text.setTextColor(color);
    },

    //! 根据对齐方式调整锚点位置
    _refeshAnchorPoint : function () {
        var tha = this._Text.getTextHorizontalAlignment();
        var tva = this._Text.getTextVerticalAlignment();
        var apoint = this._Text.getAnchorPoint();
        var csize = this.ContentSize;

        var bx = this._Text.getPositionX() - csize.width * apoint.x;
        var by = this._Text.getPositionY() - csize.height * apoint.y;

        var npoint = cc.p(0, 0);

        switch(tha) {
            case 0:
                //! 左对齐
                npoint.x = 0;
                break;
            case 1:
                //! 中心对齐
                npoint.x = 0.5;
                break;
            case 2:
                //! 右对齐
                npoint.x = 1;
                break;
        }

        switch(tva) {
            case 0:
                //! 顶对齐
                npoint.y = 1;
                break;
            case 1:
                //! 中心对齐
                npoint.y = 0.5;
                break;
            case 2:
                //! 底对齐
                npoint.y = 0;
                break;
        }

        this._Text.setAnchorPoint(npoint);
        this._Text.setPosition(bx + csize.width * npoint.x, by + csize.height * npoint.y);
    },

    //! 是否可以缩放
    _canScale : function () {
        if(this._Text.isIgnoreContentAdaptWithSize())
            return false;

        if(this.iScaleType < 0)
            return false;

        return true;
    },

    //! 刷新
    _refresh : function () {
        this._Text.setTextAreaSize(this.ContentSize);
        this._Text.setFontSize(this.iRealSize);
        this._Text.setScale(1);

        if(!this._canScale())
            return ;

        var csize = this.ContentSize;
        var fsize = this.iFontSize;

        if(this.iScaleType == 0) {
            //! 整体缩放，改变字体大小
            this._Text.setTextAreaSize(cc.size(csize.width, 0));

            var vrsize = this._Text.getVirtualRendererSize();

            while(vrsize.height > csize.height && fsize > 1) {
                fsize -= 1;
                this._Text.setFontSize(fsize);

                vrsize = this._Text.getVirtualRendererSize();
                this.iRealSize = fsize;
            }

            if(!this.bMultiLine) {
                //! 单行可能要继续缩小
                var arsize = this._Text.getAutoRenderSize();

                while(vrsize.height > arsize.height && fsize > 1) {
                    fsize -= 1;
                    this._Text.setFontSize(fsize);

                    vrsize = this._Text.getVirtualRendererSize();
                    arsize = this._Text.getAutoRenderSize();
                    this.iRealSize = fsize;
                }
            }

            this._Text.setTextAreaSize(this.ContentSize);
        }
        else if(!this.bMultiLine) {
            //! 因为必须是单行，其实横竖可能都会被调整
            var arsize = this._Text.getAutoRenderSize();

            this._Text.setTextAreaSize(cc.size(arsize.width, arsize.height));

            if(csize.width < arsize.width)
                this._Text.setScaleX(csize.width / arsize.width);

            if(csize.height < arsize.height)
                this._Text.setScaleY(csize.height / arsize.height);
        }
        else if(this.iScaleType == 1) {
            //! 把字横向挤扁，多行

            //! 防止字体太大，一行的高度超过区域高度的情况
            var arsize = this._Text.getAutoRenderSize();
            var sy = 1;

            if(arsize.height > csize.height) {
                sy = csize.height / arsize.height;
            }

            var cw = csize.width;

            this._Text.setTextAreaSize(cc.size(cw, 0));
            var vrsize = this._Text.getVirtualRendererSize();

            while(vrsize.height > csize.height / sy) {
                cw += 10;

                this._Text.setTextAreaSize(cc.size(cw, 0));
                vrsize = this._Text.getVirtualRendererSize();
            }

            if(sy >= 1) {
                this._Text.setTextAreaSize(cc.size(cw, csize.height));
            }
            else {
                this._Text.setTextAreaSize(cc.size(cw, arsize.height));
                this._Text.setScaleY(sy);
            }

            this._Text.setScaleX(csize.width / cw);
        }
        else if(this.iScaleType == 2) {
            //! 把字纵向挤扁，多行
            this._Text.setTextAreaSize(cc.size(csize.width, 0));
            var vrsize = this._Text.getVirtualRendererSize();

            if(vrsize.height > csize.height) {
                this._Text.setTextAreaSize(cc.size(vrsize.width, vrsize.height));
                this._Text.setScaleY(csize.height / vrsize.height);
            }
            else {
                this._Text.setTextAreaSize(this.ContentSize);
            }
        }
    },

    //---
    setPositionX: function (x) {
        this._Text.setPositionX(x);
    },

    setPositionY: function (y) {
        this._Text.setPositionY(y);
    },

    getPositionX: function () {
        return this._Text.getPositionX();
    },

    getPositionY: function () {
        return this._Text.getPositionY();
    },

    setScale: function (scale, scaleY) {
        this._Text.setScale(scale, scaleY);
    }
    //---
});
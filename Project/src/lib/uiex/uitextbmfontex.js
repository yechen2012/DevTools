/**
 * Created by ssscomic on 2017/11/16.
 */

//! 强化ccui.TextBMFont
var TextBMFontEx = cc.Class.extend({
    //! 构造，uitextbmfont为对应的ccui.TextBMFont（用该控件初始化时候的大小作为可显示区域），scaletype为缩放方式 -1不缩放 0整体缩放 1横向缩放 2纵向缩放（默认横向缩放）
    ctor: function (uitextbmfont, scaletype) {
        if(!uitextbmfont)
            return ;

        this._TextBMFont = uitextbmfont;
        this.iScaleType = 1;            //! -1不缩放 0整体缩放 1横向缩放 2纵向缩放

        if(scaletype != undefined)
            this.iScaleType = scaletype;

        this.ContentSize = this._TextBMFont.getContentSize();
        this.iScaleX = this._TextBMFont.getScaleX();
        this.iScaleY = this._TextBMFont.getScaleY();
        this.bIngoreSize = this._TextBMFont.isIgnoreContentAdaptWithSize();

        this._refresh();
    },

    //! 获取ccui.TextBMFont控件（可以取其中属性，尽量不直接使用该接口改变控件属性，如果改变了控件属性，应该调用刷新refresh）
    getTextBMFontCtrl : function () {
        this._TextBMFont.setContentSize(this.ContentSize);
        this._TextBMFont.setScaleX(this.iScaleX);
        this._TextBMFont.setScaleY(this.iScaleY);
        this._TextBMFont.ignoreContentAdaptWithSize(this.bIngoreSize);

        return this._TextBMFont;
    },

    refresh : function () {
        this.ContentSize = this._Text.getContentSize();
        this.iScaleX = this._TextBMFont.getScaleX();
        this.iScaleY = this._TextBMFont.getScaleY();
        this.bIngoreSize = this._TextBMFont.isIgnoreContentAdaptWithSize();

        this._refresh();
    },

    //! 设置缩放方式 -1不缩放 0整体缩放 1横向缩放 2纵向缩放
    setScaleType : function (scaletype) {
        if(this.iScaleType != scaletype) {
            this.iScaleType = scaletype;
            this._refresh();
        }
    },

    //! 设置显示字符串
    setString : function (text) {
        this._TextBMFont.setString(text);
        this._refresh();
    },

    setVisible : function (visible) {
        this._TextBMFont.setVisible(visible);
    },

    isVisible : function () {
        return this._TextBMFont.isVisible();
    },

    setOpacity: function (opacity) {
        this._TextBMFont.setOpacity(opacity);

        // //! 解决某些情况下 设置透明度无效的问题
        // if(this._TextBMFont.getParent) {
        //     var parent = this._TextBMFont.getParent();
        //
        //     if(parent) {
        //         var parentOpacity = parent.getOpacity();
        //         this._TextBMFont.updateDisplayedOpacity(parentOpacity);
        //     }
        // }
    },

    setPosition: function (newPosOrxValue, yValue) {
        if(!this._TextBMFont)
            return ;

        this._TextBMFont.setPosition(newPosOrxValue, yValue);
    },

    // //! 设置字体文件
    // setFntFile: function (fileName) {
    //     this._TextBMFont.setFntFile(fileName);
    //     this._refresh();
    // },

    //! 设置颜色
    setColor: function (color) {
        this._TextBMFont.setColor(color);
    },

    //! 设置缩放（会影响实际显示区域）
    setScale : function (scale) {
        this.setScaleX(scale, false);
        this.setScaleY(scale, false);

        this._refresh();
    },

    setScaleX : function (scale, brefresh) {
        this.iScaleX = scale;

        if(brefresh)
            this._refresh();
    },

    setScaleY : function (scale, brefresh) {
        this.iScaleY = scale;

        if(brefresh)
            this._refresh();
    },

    getScale : function () {
        if (this.iScaleX !== this.iScaleY)
            cc.log(cc._LogInfos.Node_getScale);

        return this.iScaleX;
    },

    getScaleX : function () {
        return this.iScaleX;
    },

    getScaleY : function () {
        return this.iScaleY;
    },

    //! 是否可以缩放
    _canScale : function () {
        if(this.iScaleType < 0)
            return false;

        return true;
    },

    //! 刷新
    _refresh : function () {
        if(this.bIngoreSize)
            this._TextBMFont.ignoreContentAdaptWithSize(false);

        this._TextBMFont.setContentSize(this.ContentSize);
        //this._TextBMFont.setScale(1);
        this._TextBMFont.setScaleX(this.iScaleX);
        this._TextBMFont.setScaleY(this.iScaleY);

        if(!this._canScale()) {
            if(this.bIngoreSize)
                this._TextBMFont.ignoreContentAdaptWithSize(this.bIngoreSize);

            return ;
        }

        var csize = this.ContentSize;
        var vrsize = this._TextBMFont.getVirtualRendererSize();

        if(this.iScaleType == 0) {
            //! 整体缩放
            var mscale = 1;

            if(vrsize.width > this.ContentSize.width)
                mscale = this.ContentSize.width / vrsize.width;

            if(vrsize.height > this.ContentSize.height && this.ContentSize.height / vrsize.height < mscale) {
                mscale = this.ContentSize.height / vrsize.height;
            }

            //this._TextBMFont.setScale(mscale);
            this._TextBMFont.setScaleX(mscale * this.iScaleX);
            this._TextBMFont.setScaleY(mscale * this.iScaleY);
        }
        else if(this.iScaleType == 1 || this.iScaleType == 2) {
            //! 横向和纵向都不应该超过各自的范围
            var mscale = 1;

            if(vrsize.width > this.ContentSize.width)
                mscale = this.ContentSize.width / vrsize.width;

            this._TextBMFont.setScaleX(mscale * this.iScaleX);

            mscale = 1;

            if(vrsize.height > this.ContentSize.height)
                mscale = this.ContentSize.height / vrsize.height;

            this._TextBMFont.setScaleY(mscale * this.iScaleY)
       }

        // var nsize = this._TextBMFont.getContentSize();
        // var npos = this._TextBMFont.getPosition();

        if(this.bIngoreSize)
            this._TextBMFont.ignoreContentAdaptWithSize(this.bIngoreSize);
    },
});
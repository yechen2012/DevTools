/**
 * Created by ssscomic on 2017/11/16.
 */

//! 强化ccui.Slider
var SliderEx = cc.Class.extend({
    //! 构造，uislider为对应的ccui.Slider（该控件应该开启了自定义尺寸，未开启则不缩放），nums可以不使用，如果是数字表示把滑条分段数，如果是数组表示分段并且每段使用数组内的数值
    ctor: function (uislider, nums, bshowmin) {
        if(!uislider)
            return ;

        this._Slider = uislider;
        this.lstData = [];
        this._lstCtrlData = [];
        this.iIndex = -1;

        this.bshowmin = bshowmin;

        this._Slider.setPercent(0);

        if(nums != undefined) {
            if(cc.isArray(nums)) {
                this.setSegmentData(nums);
            }
            else {
                this.setSegment(nums);
            }
        }

        this._Slider.addEventListener(this._onChgPercent, this);
    },

    //! 获取ccui.Slider控件
    getSliderCtrl : function () {
        return this._Slider;
    },

    //! 增加事件侦听
    addEventListener: function (selector, target) {
        this._sliderEventSelector = selector;
        this._sliderEventListener = target;
    },

    setVisible : function (visible) {
        if(!this._Slider)
            return ;

        this._Slider.setVisible(visible);
    },

    isVisible : function () {
        if(!this._Slider)
            return ;

        return this._Slider.isVisible();
    },

    setEnabled: function (enabled) {
        if(!this._Slider)
            return ;

        this._Slider.setEnabled(enabled);
    },

    isEnabled : function () {
        if(!this._Slider)
            return false;

        return this._Slider.isEnabled();
    },

    setPosition: function (newPosOrxValue, yValue) {
        if(!this._Slider)
            return ;

        this._Slider.setPosition(newPosOrxValue, yValue);
    },

    //! 是否分段
    hasSegment : function () {
        return this.lstData.length > 0;
    },

    //! 设置分段数，如果nums为-1则不使用分段（举例，nums为2，则可以出现的值是0,1,2）
    setSegment : function (nums) {
        if(!this._Slider)
            return ;

        if(nums <= 0) {
            this.lstData = [];
            this.iIndex = -1;
        }
        else {
            var lst = [];

            for(var ii = 0; ii <= nums; ++ii) {
                lst.push(ii);
            }

            this.setSegmentData(lst);
        }
    },

    //! 设置分段数据，滑条只能出现lst中的数据
    setSegmentData : function (lst) {
        if(!this._Slider)
            return ;

        this._lstCtrlData = [];

        if (this.bshowmin && lst.length > 0) {
            this._lstCtrlData.push("0");
            for (var i = 0; i < lst.length; ++i) {
                this._lstCtrlData.push(lst[i]);
            }
        }
        else {
            this._lstCtrlData = lst;
        }


        if(lst.length < 1) {
            this.lstData = [];
            this.iIndex = -1;
        }
        else {
            this.lstData = lst;
            this._refresh();
        }
    },

    //! 获取当前最大分段数，如果没使用会返回0
    getSegmentMaxLength : function () {
        if(!this._Slider)
            return 0;

        return this.lstData.length;
    },

    //! 设置分段索引
    setSegmentIndex : function (index) {
        if(!this._Slider || !this.hasSegment())
            return false;

        if(index < 0 || index >= this.lstData.length)
            return false;

        this._setIndex(index);
        this._refresh();
        return true;
    },

    //! 设置分段值，如果没有对应的值会返回false
    setSegmentValue : function (value) {
        if(!this._Slider || !this.hasSegment())
            return false;

        for(var ii = 0; ii < this.lstData.length; ++ii) {
            if(this.lstData[ii] == value)
                return this.setSegmentIndex(ii);
        }

        return false;
    },

    //! 设置百分比
    setPercent: function (percent) {
        if(!this._Slider)
            return ;

        if(!this.hasSegment()) {
            //! 没有分段数据，不调整位置
            this._Slider.setPercent(percent);
        }
        else if(this.lstData.length == 1) {
            this._setIndex(0);
            this._refresh();
        }
        else {
            if (this.isEnabled()) {
                var snum = (this._lstCtrlData.length - 1) * 2;
                var sp = 100 / snum;
                var ci = Math.floor(percent / sp);

                if(ci <= 0)
                    this._setIndex(0);
                else if(ci >= snum - 1)
                    this.iIndex = this._lstCtrlData.length - 1;
                else
                    this.iIndex = Math.floor((ci + 1) / 2);
            }

            this._refresh();
        }
    },

    //! 获取百分比
    getPercent: function () {
        if(!this._Slider)
            return 0;

        return this._Slider.getPercent();
    },

    //! 获取当前分段的索引
    getSegmentIndex : function () {
        if(!this._Slider)
            return -1;

        return this._getIndex();
    },

    //! 获取当前分段的值
    getSegmentValue : function () {
        if(!this._Slider || this.iIndex < 0)
            return undefined;

        return this.lstData[this._getIndex()];
    },

    _getIndex: function() {
        var ret = this.iIndex;
        if (this.bshowmin)
            ret -= 1;

        return ret;
    },

    _setIndex: function(index) {
        this.iIndex = index;
        if (this.bshowmin)
            this.iIndex += 1;
    },

    _onChgPercent : function () {
        if(!this._Slider)
            return ;

        var oldindex = this.iIndex;

        var percent = this._Slider.getPercent();
        this.setPercent(percent);

        var curindex = this.iIndex;

        if(!this.hasSegment() || oldindex != curindex) {
            if (this._sliderEventSelector) {
                if (this._sliderEventListener)
                    this._sliderEventSelector.call(this._sliderEventListener, this, ccui.Slider.EVENT_PERCENT_CHANGED);
                else
                    this._sliderEventSelector(this, ccui.Slider.EVENT_PERCENT_CHANGED);  // _eventCallback
            }
        }
    },

    _refresh : function () {
        if(!this._Slider)
            return ;

        if(!this.hasSegment())
            return ;

        if(this.iIndex < 0)
            this._setIndex(0);

        if(this.iIndex >= this._lstCtrlData.length)
            this.iIndex = this._lstCtrlData.length - 1;

        if(this.lstData.length == 1)
            this._Slider.setPercent(100);
        else if(this.iIndex == 0)
            this._Slider.setPercent(0);
        else if(this.iIndex == this._lstCtrlData.length - 1)
            this._Slider.setPercent(100);
        else {
            var sp = 100 / (this._lstCtrlData.length - 1);
            this._Slider.setPercent(sp * this.iIndex);
        }
    },
});
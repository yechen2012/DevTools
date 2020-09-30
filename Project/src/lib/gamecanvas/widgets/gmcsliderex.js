/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 画布上使用的滑块
var GameCanvasSliderEx = GameCanvasObject.extend({
    //! 构造，slidername为画布上控件的名字，可以是string或者string数组，nums可以不使用，如果是数字表示把滑条分段数，如果是数组表示分段并且每段使用数组内的数值
    ctor : function (mgr, slidername, bshowmin, nums, lstres) {
        this._super(mgr, 'sliderex');

        this.gmcsliderex = true;

        this._lstSlider = [];

        var cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var canvas = this._mgr.getCanvas(ii);
            var name = gmc.getElement(slidername, ii);

            if(name) {
                var node = gmc.findChildByName(canvas, name, lstres, ii);

                if(node) {
                    var enode = new SliderEx(node, nums, bshowmin);
                    enode.addEventListener(this._onChgPercent, this);
                    this._lstSlider.push(enode);
                }
                else
                    this._lstSlider.push(undefined);
            }
            else {
                this._lstSlider.push(undefined);
            }
        }

        this.lstPercentText = [];
        this.lstSegmentValueText = [];
        this.lstSegmentIndexText = [];

        this.btnDec = undefined;
        this.btnAdd = undefined;
    },

    getNode : function (index) {
        if(index < 0 || index >= this._lstSlider.length)
            return undefined;

        if(!this._lstSlider[index])
            return undefined;

        return this._lstSlider[index].getSliderCtrl();
    },

    // //! 增加事件侦听
    // addEventListener: function (selector, target) {
    //     this._EventSelector = selector;
    //     this._EventListener = target;
    // },

    //! 增加显示百分比的文字类控件
    addPercentText : function (textctrl) {
        var tctrl = this._getMgrCtrl(textctrl);

        if(!tctrl)
            return ;

        for(var ii = 0; ii < this.lstPercentText.length; ++ii) {
            if(this.lstPercentText[ii] === tctrl)
                return ;
        }

        this.lstPercentText.push(tctrl);
        this._refreshText();
    },

    //! 移除显示百分比的文字类控件
    removePercentText : function (textctrl) {
        var tctrl = this._getMgrCtrl(textctrl);

        if(!tctrl)
            return ;

        for(var ii = 0; ii < this.lstPercentText.length; ++ii) {
            if(this.lstPercentText[ii] === tctrl) {
                this.lstPercentText.splice(ii, 1);
                return true;
            }
        }

        return false;
    },

    //! 增加显示分段值的文字类控件
    addSegmentValueText : function (textctrl) {
        var tctrl = this._getMgrCtrl(textctrl);

        if(!tctrl)
            return ;

        for(var ii = 0; ii < this.lstSegmentValueText.length; ++ii) {
            if(this.lstSegmentValueText[ii] === tctrl)
                return ;
        }

        this.lstSegmentValueText.push(tctrl);
        this._refreshText();
    },

    //! 移除显示分段值的文字类控件
    removeSegmentValueText : function (textctrl) {
        var tctrl = this._getMgrCtrl(textctrl);

        if(!tctrl)
            return ;

        for(var ii = 0; ii < this.lstSegmentValueText.length; ++ii) {
            if(this.lstSegmentValueText[ii] === tctrl) {
                this.lstSegmentValueText.splice(ii, 1);
                return true;
            }
        }

        return false;
    },

    //! 增加显示分段索引的文字类控件
    addSegmentIndexText : function (textctrl) {
        var tctrl = this._getMgrCtrl(textctrl);

        if(!tctrl)
            return ;

        for(var ii = 0; ii < this.lstSegmentIndexText.length; ++ii) {
            if(this.lstSegmentIndexText[ii] === tctrl)
                return ;
        }

        this.lstSegmentIndexText.push(tctrl);
        this._refreshText();
    },

    //! 移除显示分段索引的文字类控件
    removeSegmentIndexText : function (textctrl) {
        var tctrl = this._getMgrCtrl(textctrl);

        if(!tctrl)
            return ;

        for(var ii = 0; ii < this.lstSegmentIndexText.length; ++ii) {
            if(this.lstSegmentIndexText[ii] === tctrl) {
                this.lstSegmentIndexText.splice(ii, 1);
                return true;
            }
        }

        return false;
    },

    //! 设置滑条按钮，按钮类型为GameCanvasButton
    setButton : function (btndec, btnadd) {
        var decctrl = this._getMgrCtrl(btndec);
        var addctrl = this._getMgrCtrl(btnadd);

        if(this.btnDec)
            this.btnDec.setCallFunction(undefined);

        if(this.btnAdd)
            this.btnAdd.setCallFunction(undefined);

        this.btnDec = decctrl;
        this.btnAdd = addctrl;

        if(this.btnDec)
            this.btnDec.setCallFunction(this._onTouchDec, this);

        if(this.btnAdd)
            this.btnAdd.setCallFunction(this._onTouchAdd, this);

        this._refreshButton();
    },

    //! 如果有y 则x和y是number（number数组），否则x是position（position数组）
    setPosition : function (x, y) {
        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

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
        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

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

    _setEnabled: function (enabled) {
        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

            if(node) {
                node.setEnabled(enabled);
            }
        }

        this._refreshButton();
    },

    _setVisible : function (visible) {
        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

            if(node)
                node.setVisible(visible);
        }

        for(var ii = 0; ii < this.lstPercentText.length; ++ii) {
            var node = this.lstPercentText[ii];

            if(node)
                node.setVisible(visible);
        }

        for(var ii = 0; ii < this.lstSegmentValueText.length; ++ii) {
            var node = this.lstSegmentValueText[ii];

            if(node)
                node.setVisible(visible);
        }

        for(var ii = 0; ii < this.lstSegmentIndexText.length; ++ii) {
            var node = this.lstSegmentIndexText[ii];

            if(node)
                node.setVisible(visible);
        }

        if(this.btnDec)
            this.btnDec.setVisible(visible);

        if(this.btnAdd)
            this.btnAdd.setVisible(visible);
    },

    //! 是否分段
    hasSegment : function () {
        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

            if(node)
                return node.hasSegment();
        }

        return false;
    },

    //! 设置分段数，如果nums为-1则不使用分段（举例，nums为2，则可以出现的值是0,1,2）
    setSegment : function (nums) {
        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

            if(node)
                node.setSegment(nums);
        }

        this._refreshText();
        this._refreshButton();
    },

    //! 设置分段数据，滑条只能出现lst中的数据
    setSegmentData : function (lst) {
        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

            if(node)
                node.setSegmentData(lst);
        }

        this._refreshText();
        this._refreshButton();
    },

    //! 获取当前最大分段数，如果没使用会返回0
    getSegmentMaxLength : function () {
        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

            if(node)
                return node.getSegmentMaxLength();
        }

        return 0;
    },

    //! 设置分段索引
    setSegmentIndex : function (index) {
        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

            if(node)
                node.setSegmentIndex(index);
        }

        this._refreshText();
        this._refreshButton();
    },

    //! 设置分段值
    setSegmentValue : function (value) {
        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

            if(node)
                node.setSegmentValue(value);
        }

        this._refreshText();
        this._refreshButton();
    },

    //! 设置百分比
    setPercent: function (percent) {
        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

            if(node)
                node.setPercent(percent);
        }

        this._refreshText();
        this._refreshButton();
    },

    //! 获取百分比
    getPercent: function () {
        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

            if(node)
                return node.getPercent();
        }

        return 0;
    },

    //! 获取当前分段的索引
    getSegmentIndex : function () {
        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

            if(node)
                return node.getSegmentIndex();
        }

        return -1;
    },

    //! 获取当前分段的值
    getSegmentValue : function () {
        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

            if(node)
                return node.getSegmentValue();
        }

        return undefined;
    },

    _onChgPercent : function (sender, type) {
        var percent = -1;

        for(var ii = 0; ii < this._lstSlider.length; ++ii) {
            var node = this._lstSlider[ii];

            if(node == sender) {
                percent = node.getPercent();
                break;
            }
        }

        if(percent >= 0) {
            for(var ii = 0; ii < this._lstSlider.length; ++ii) {
                var node = this._lstSlider[ii];

                if(node)
                    node.setPercent(percent);
            }

            this._refreshText();
            this._refreshButton();

            // if (this._EventSelector) {
            //     if (this._EventListener)
            //         this._EventSelector.call(this._EventListener, this, ccui.Slider.EVENT_PERCENT_CHANGED);
            //     else
            //         this._EventSelector(this, ccui.Slider.EVENT_PERCENT_CHANGED);  // _eventCallback
            // }

            this._callFunctionEx(ccui.Slider.EVENT_PERCENT_CHANGED);
            this._callFunction();
        }
    },

    _refreshText : function () {
        var value = this.getPercent();
        var str = value.toString();

        for(var ii = 0; ii < this.lstPercentText.length; ++ii) {
            var textctrl = this.lstPercentText[ii];

            if(textctrl && textctrl.setString)
                textctrl.setString(str);
        }

        value = this.getSegmentValue();

        if(value != undefined)
            str = value.toString();

        for(var ii = 0; ii < this.lstSegmentValueText.length; ++ii) {
            var textctrl = this.lstSegmentValueText[ii];

            if(textctrl && textctrl.setString)
                textctrl.setString(value);
        }

        value = this.getSegmentIndex();

        if(value >= 0)
            str = value.toString();

        for(var ii = 0; ii < this.lstSegmentIndexText.length; ++ii) {
            var textctrl = this.lstSegmentIndexText[ii];

            if(textctrl && textctrl.setString)
                textctrl.setString(str);
        }
    },

    _refreshButton : function () {
        if(this._enabled) {
            if(this.hasSegment()) {
                var si = this.getSegmentIndex();
                var maxl = this.getSegmentMaxLength();

                if(this.btnDec)
                    this.btnDec.setEnabled(si > 0);

                if(this.btnAdd)
                    this.btnAdd.setEnabled(si < maxl - 1);
            }
            else {
                var percent = this.getPercent();

                if(this.btnDec)
                    this.btnDec.setEnabled(percent > 0);

                if(this.btnAdd)
                    this.btnAdd.setEnabled(percent < 100);
            }
        }
        else {
            if(this.btnDec)
                this.btnDec.setEnabled(false);

            if(this.btnAdd)
                this.btnAdd.setEnabled(false);
        }
    },

    _onTouchDec : function () {
        if(this.hasSegment()) {
            var si = this.getSegmentIndex();
            si -= 1;
            this.setSegmentIndex(si);
        }
        else {
            var percent = this.getPercent();
            percent -= 1;
            this.setPercent(percent);
        }

        this._refreshText();
        this._refreshButton();

        // if (this._EventSelector) {
        //     if (this._EventListener)
        //         this._EventSelector.call(this._EventListener, this, ccui.Slider.EVENT_PERCENT_CHANGED);
        //     else
        //         this._EventSelector(this, ccui.Slider.EVENT_PERCENT_CHANGED);  // _eventCallback
        // }

        this._callFunctionEx(ccui.Slider.EVENT_PERCENT_CHANGED);
        this._callFunction();
    },

    _onTouchAdd : function () {
        if(this.hasSegment()) {
            var si = this.getSegmentIndex();
            si += 1;
            this.setSegmentIndex(si);
        }
        else {
            var percent = this.getPercent();
            percent += 1;
            this.setPercent(percent);
        }

        this._refreshText();
        this._refreshButton();

        // if (this._EventSelector) {
        //     if (this._EventListener)
        //         this._EventSelector.call(this._EventListener, this, ccui.Slider.EVENT_PERCENT_CHANGED);
        //     else
        //         this._EventSelector(this, ccui.Slider.EVENT_PERCENT_CHANGED);  // _eventCallback
        // }

        this._callFunctionEx(ccui.Slider.EVENT_PERCENT_CHANGED);
        this._callFunction();
    },

    //! 设置数据
    setData : function (data) {
        if(data.btndec && data.btnadd) {
            this.setButton(data.btndec, data.btnadd);
        }

        if(data.lstpertext) {
            for(var ii = 0; ii < data.lstpertext.length; ++ii) {
                this.addPercentText(data.lstpertext[ii]);
            }
        }

        if(data.lstsvaluetext) {
            for(var ii = 0; ii < data.lstsvaluetext.length; ++ii) {
                this.addSegmentValueText(data.lstsvaluetext[ii]);
            }
        }

        if(data.lstsindextext) {
            for(var ii = 0; ii < data.lstsindextext.length; ++ii) {
                this.addSegmentIndexText(data.lstsindextext[ii]);
            }
        }

        this._super(data);
    },
    //! 销毁
    destory : function () {
        if(this._mgr && this._mgrname)
            this._mgr.removeSliderEx(this._mgrname);
    }
});

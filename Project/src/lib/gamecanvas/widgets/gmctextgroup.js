/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 用于游戏画布的文字，基于ccui.Text控件
var GameCanvasTextGroup = GameCanvasObject.extend({
    //! 构造，textname为控件的名字，lstgroup是文本名字数组,内容可以是字符串名字也可以是text对象，scaletype为缩放方式 -1不缩放 0整体缩放 1横向缩放 2纵向缩放（默认整体缩放）
    ctor: function (mgr, textname, lstgroup, scaletype, lstres) {
        this._super(mgr, 'textgroup');

        this.gmctextex = true;
        this.textname = textname;
        this._lstText = [];

        var cnums = 1;
        if(this._mgr)
            cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ii++){
            var lstText = [];
            var node = undefined;
            var textex = undefined;

            for(var jj = 0; jj < lstgroup.length; jj++){
                var name = lstgroup[jj];

                if(name){
                    if(typeof name === 'string' && this._mgr){
                        node = this._mgr.getCtrl(name);

                        if(node && node.getTextEx)
                            textex = node.getTextEx(ii);
                        else{
                            lstText.push(undefined);
                            continue;
                        }
                    }
                    else if(typeof name === 'object'){
                        node = name;

                        if(!node.gmctype)
                            textex = node;
                        else
                            textex = node.getTextEx(ii);
                    }

                    if(textex){
                        lstText.push(textex);
                        textex.dirty = textex.getRealSize();
                    }
                    else{
                        lstText.push(undefined);
                    }
                }
            }

            this._lstText.push(lstText);
        }

        this.refresh();
    },

    update: function () {
        var bchg = false;

        //!尺寸如果改变就刷新
        for(var ii = 0; ii < this._lstText.length; ii++){
            var lstText = this._lstText[ii];

            for(var jj = 0; jj < lstText.length; jj++){
                var textex = lstText[jj];
                if(textex){
                    var size = textex.getRealSize();

                    if(textex.dirty && textex.dirty != size){
                        bchg = true;
                        break;
                    }
                }
            }
        }

        if(bchg){
            cc.log('txtgroup update');
            this.refresh();
        }
    },

    //! 设置数据
    setData: function (data) {
        this._super(data);
        //this.refresh();
    },

    //!刷新
    refresh: function () {
        for(var ii = 0; ii < this._lstText.length; ii++){
            var lstText = this._lstText[ii];

            var lstsize = [];
            var lsttextex = [];
            for(var jj = 0; jj < lstText.length; jj++){
                var textex = lstText[jj];
                if(textex){
                    var size = textex.getRealSize();
                    lstsize.push(size);
                    lsttextex.push(textex);
                }
            }

            if(lstsize.length <= 0)
                continue;

            lstsize.sort(function(a,b){
                if(a > b)
                    return 1;
                else
                    return -1;
            });

            var minsize = lstsize[0];
            for(var kk = 0; kk < lsttextex.length; kk++){
                lsttextex[kk].setRealSize(minsize);

                if(lsttextex[kk].dirty){
                    lsttextex[kk].dirty = minsize;
                }
            }

        }
    },

    //! 销毁
    destory: function () {
        if (this._mgr && this._mgrname)
            this._mgr.removeTextGroup(this._mgrname);
    }
});
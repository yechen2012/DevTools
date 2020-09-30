/**
 * Created by ssscomic on 2017/11/16.
 */
var GameModuleScene1 = cc.Node.extend({
    ctor: function (root, noLoadFgbgNode) {
        if(root.node)
            this.nodeRoot = root;
        else {
            this.nodeRoot = {};
            this.nodeRoot.node = root;
        }

        this.iCurState = -1;        //! 当前场景的状态
        this.iEndState = -1;        //! 将要达到的场景状态

        this.lstExportAni = [];
        this.lstNodeAni = [];
        this.lstVisibleAni = [];
        this.lstSpineAni = [];
        this.iMaxState = 0;
        //this.lstState = [];

        if (noLoadFgbgNode == undefined || noLoadFgbgNode) {
            //zjq_start
            var baseName = ["stateBg","stateBg2Fg","stateFg","stateFg2Bg"];
            for (var i = 1; i <= 4; i++) {
                var id = 1;
                var _node;
                while (_node = findNodeByName(this.nodeRoot.node, baseName[i-1] + id)) {
                    var backdata = [];
                    for (var j = 1; j <= 4; j++) {
                        if (i == j) {
                            backdata.push({visible: true});
                        } else {
                            backdata.push({visible: false});
                        }
                    }

                    this.addVisibleAni(baseName[i-1]  + id, _node, backdata);
                    id++;
                }
            }
            //zjq_end
        }

    },

    update : function (dt) {
        if(!this.isSceneChging())
            return ;

        var bchgend = true;

        //! 导出动画
        for(var ii = 0; ii < this.lstExportAni.length; ++ii) {
            var node = this.lstExportAni[ii];
            var data = node.curdata;

            if(data == undefined)
                continue ;

            if(data.loop)
                continue ;

            if(node.ani.animation.getCurrentMovementID() != '') {
                bchgend = false;
                break;
            }
        }

        //! 节点动画
        for(var ii = 0; ii < this.lstNodeAni.length; ++ii) {
            var node = this.lstNodeAni[ii];
            var data = node.curdata;

            if(data == undefined)
                continue ;

            if(data.loop)
                continue ;

            if(node.node.action.getCurrentFrame() != data.eindex) {
                bchgend = false;
                break;
            }
        }

        //! Spine动画
        for(var ii = 0; ii < this.lstSpineAni.length; ++ii) {
            var node = this.lstSpineAni[ii];
            var data = node.curdata;

            if (data == undefined)
                continue;

            if (data.loop)
                continue;

            var curs = node.spine.getCurrent(0);

            if (curs.animationLast < curs.animationEnd) {
                bchgend = false;
                break;
            }
        }

        if(bchgend) {
            this.iCurState = this.iEndState;
            this._refreshState();
        }
    },

    //! 设置当前的场景状态
     setState : function (bstate, estate, brefresh) {
        if(brefresh == undefined || !brefresh) {
            if(this.iCurState == bstate)
                return ;
        }

        this.iCurState = bstate;

        if(estate == undefined)
            this.iEndState = bstate;
        else
            this.iEndState = estate;

        this._refreshState();
    },

    //! 取当前场景的状态
    getState : function () {
      return  this.iCurState;
    },

    //! 判断场景是否在变化中
    isSceneChging : function () {
        return this.iCurState != this.iEndState;
    },

    //! 添加一个导出动画的数据
    addExportAni : function (name, data) {
        var ani = findNodeByName(this.nodeRoot.node, name);

        if(ani == undefined || ani == null)
            return ;

        if(data.length > this.iMaxState)
            this.iMaxState = data.length;

        for(var ii = 0; ii < this.lstExportAni.length; ++ii) {
            if(this.lstExportAni[ii].name == name) {
                this.lstExportAni.splice(ii, 1);
                break;
            }
        }

        var node = {};

        node.name = name;
        node.ani = ani;
        node.data = data;

        this.lstExportAni.push(node);
    },

    //! 添加一个导出动画的数据
    addExportAni1 : function (ani, data, name) {
        var ani = ani;

        if(ani == undefined || ani == null)
            return ;

        if(data.length > this.iMaxState)
            this.iMaxState = data.length;

        for(var ii = 0; ii < this.lstExportAni.length; ++ii) {
            if(this.lstExportAni[ii].name == name) {
                this.lstExportAni.splice(ii, 1);
                break;
            }
        }

        var node = {};

        node.name = name;
        node.ani = ani;
        node.data = data;

        this.lstExportAni.push(node);
    },

    //! 添加节点动画
    addNodeAni : function (name, node, data) {
        if(data.length > this.iMaxState)
            this.iMaxState = data.length;

        for(var ii = 0; ii < this.lstNodeAni.length; ++ii) {
            if(this.lstNodeAni[ii].name == name) {
                this.lstNodeAni.splice(ii, 1);
                break;
            }
        }

        node.node.runAction(node.action);

        var nn = {};

        nn.name = name;
        nn.node = node;
        nn.data = data;

        this.lstNodeAni.push(nn);
    },

    //! 添加显示动画
    addVisibleAni : function (name, node, data) {
        if(data.length > this.iMaxState)
            this.iMaxState = data.length;

        for(var ii = 0; ii < this.lstVisibleAni.length; ++ii) {
            if(this.lstVisibleAni[ii].name == name) {
                this.lstVisibleAni.splice(ii, 1);
                break;
            }
        }

        var nn = {};

        nn.name = name;
        nn.node = node;
        nn.data = data;

        this.lstVisibleAni.push(nn);
    },

    //! 添加Spine动画
    addSpineAni : function (spine, data) {
        if(spine == undefined || spine == null)
            return ;

        if(data.length > this.iMaxState)
            this.iMaxState = data.length;

        for(var ii = 0; ii < this.lstSpineAni.length; ++ii) {
            if(this.lstSpineAni[ii].spine == spine) {
                this.lstSpineAni.splice(ii, 1);
                break;
            }
        }

        var node = {};

        node.spine = spine;
        node.data = data;

        this.lstSpineAni.push(node);
    },

    //! 内部接口
    //! 刷新状态
    _refreshState : function () {
        //! 导出动画
        for(var ii = 0; ii < this.lstExportAni.length; ++ii) {
            var node = this.lstExportAni[ii];
            this._refresh_ExportAni(node);
        }

        for(var ii = 0; ii < this.lstNodeAni.length; ++ii) {
            var node = this.lstNodeAni[ii];
            this._refresh_NodeAni(node);
        }

        for(var ii = 0; ii < this.lstVisibleAni.length; ++ii) {
            var node = this.lstVisibleAni[ii];
            this._refresh_VisibleAni(node);
        }

        for(var ii = 0; ii < this.lstSpineAni.length; ++ii) {
            var node = this.lstSpineAni[ii];
            this._refresh_SpineAni(node);
        }
    },

    //! 根据当前状态刷新某个导出动画
    _refresh_ExportAni : function (node) {
        if(this.iCurState < 0)
            return ;

        if(this.iCurState >= node.data.length) {
            node.ani.setVisible(false);
            node.curdata = undefined;
            return ;
        }

        var data = node.data[this.iCurState];

        if(data == undefined || data.aniname == undefined) {
            node.ani.setVisible(false);
            node.curdata = undefined;
            return ;
        }

        if(node.res == undefined || node.resname == undefined || node.res != data.res || node.resname != data.resname) {
            ccs.armatureDataManager.addArmatureFileInfo(data.res);
            node.ani.init(data.resname);
            node.res = data.res;
            node.resname = data.resname;
        }

        node.ani.setVisible(true);
        node.ani.animation.play(data.aniname, -1, data.loop ? 1 : 0);
        node.curdata = data;
    },

    //! 根据当前状态刷新某个节点动画
    _refresh_NodeAni : function (node) {
        if(this.iCurState < 0)
            return ;

        if(this.iCurState >= node.data.length) {
            node.node.node.setVisible(false);
            node.curdata = undefined;
            return ;
        }

        var data = node.data[this.iCurState];

        if(data == undefined) {
            node.node.node.setVisible(false);
            node.curdata = undefined;
            return ;
        }

        node.node.node.setVisible(true);
        node.node.action.gotoFrameAndPlay(data.bindex, data.eindex, data.loop);
        node.curdata = data;
    },

    //! 根据当前状态刷新某个节点动画
    _refresh_VisibleAni : function (node) {
        if(this.iCurState < 0)
            return ;

        if(this.iCurState >= node.data.length) {
            node.node.setVisible(false);
            node.curdata = undefined;
            return ;
        }

        var data = node.data[this.iCurState];

        if(data == undefined) {
            node.node.setVisible(false);
            node.curdata = undefined;
            return ;
        }

        node.node.setVisible(data.visible);
        node.curdata = data;
    },

    //! 根据当前状态刷新某个Spine动画
    _refresh_SpineAni : function (node) {
        if(this.iCurState < 0)
            return ;

        if(this.iCurState >= node.data.length) {
            node.spine.setVisible(false);
            node.curdata = undefined;
            return ;
        }

        var data = node.data[this.iCurState];

        if(data == undefined || data.aniname == undefined) {
            node.spine.setVisible(false);
            node.curdata = undefined;
            return ;
        }

        node.spine.setVisible(true);
        node.spine.setAnimation(0, data.aniname, data.loop);
        node.curdata = data;
    },

    // //! 添加状态
    // _addState : function (state) {
    //     if(this.lstState.length > state)
    //         return ;
    //
    //     while(this.lstState.length <= state) {
    //         var node = {};
    //
    //         node.lstExportAni = [];
    //
    //         this.lstState.push(node);
    //     }
    // },
});
/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 用于游戏画布的状态管理（在GameCanvasMgr或者GameCanvasModule中，都会有自己的状态管理）
var GameCanvasStateMgr = cc.Class.extend({
    //! 构造
    ctor: function (mgr, module) {
        this._mgr = mgr;
        this._module = module;

        this.gmctype = 'state';
        this.gmcstate = true;

        //! 状态（通过整体状态控制一组控件的状态变化）
        this._State = {};
        //! 活跃状态（在一段时间后会改变的状态）
        this._lstActiveState = [];
    },

    //! 添加状态
    add : function (name, data, curstate, callfunc, target) {
        if(!this._State[name])
            this._State[name] = {};

        this._State[name].name = name;
        this._State[name].data = data;
        this._State[name].callfunc = callfunc;
        this._State[name].target = target;

        if(curstate)
            this._State[name].curstate = curstate;
        else if(this._State[name].data){
            //! 随便设置一个状态
            for(var item in this._State[name].data) {
                this._State[name].curstate = item;
                break;
            }
        }

        this.refresh(name);
    },

    //! 移除一个状态（一般不使用）
    remove : function (name) {
        if(!this._State[name])
            return ;

        //! 删除激活
        for(var ii = 0; ii < this._lstActiveState.length; ++ii) {
            if(this._lstActiveState[ii].name == name) {
                this._lstActiveState.splice(ii, 1);
                break;
            }
        }

        delete this._State[name];
    },

    //! 设置回调函数
    setCallFunction : function (callfunc, target) {
        if(!this._State[name])
            return ;

        this._State[name].callfunc = callfunc;
        this._State[name].target = target;
    },

    //! 设置一个状态的当前状态值 delay是延迟多久后起效（可选） brefresh为true则强制刷新（可选，如果强制刷新则不考虑lock、time等状态）
    setState : function (name, curstate, delay, brefresh) {
        if(!this._State[name])
            return ;

        //! 延迟一段时间后再设置
        if(delay && delay > 0) {
            this._State[name].delay = delay;
            this._State[name].dstate = curstate;
            this._State[name].drefresh = brefresh;

            //! 查找是否已经激活
            for(var ii = 0; ii < this._lstActiveState.length; ++ii) {
                if(this._lstActiveState[ii].name == name) {
                    this._lstActiveState.splice(ii, 1);
                    break;
                }
            }

            this._lstActiveState.push(this._State[name]);
            return ;
        }

        //! 判断锁定，如果锁定则等待锁定结束后再改变状态
        if(!brefresh) {
            if(this.isLock(this._State[name], curstate)) {
                this._State[name].wstate = curstate;
                this._State[name].wrefresh = brefresh;

                //! 查找是否已经激活
                for(var ii = 0; ii < this._lstActiveState.length; ++ii) {
                    if(this._lstActiveState[ii].name == name) {
                        this._lstActiveState.splice(ii, 1);
                        break;
                    }
                }

                this._lstActiveState.push(this._State[name]);
                return ;
            }
        }

        if(this._State[name].curstate == curstate && !brefresh)
            return ;

        var ostate = this._State[name].curstate;

        this._State[name].curstate = curstate;
        this.refresh(name);

        if(ostate != curstate) {
            if(this._State[name].callfunc) {
                if (this._State[name].target)
                    this._State[name].callfunc.call(this._State[name].target, curstate, ostate, this._module);
                else
                    this._State[name].callfunc.call(curstate, ostate, this._module);
            }
        }
    },

    //! 刷新一个状态
    refresh : function (name) {
        if(!this._State[name])
            return ;

        var node = this._State[name];
        var data = node.data[node.curstate];

        if(!data)
            return ;

        //! 显示
        if(data.show) {
            for(var ii = 0; ii < data.show.length; ++ii) {
                this._mgr.setVisible(data.show[ii], true, name, this._module);
            }
        }

        //! 隐藏
        if(data.hide) {
            for(var ii = 0; ii < data.hide.length; ++ii) {
                this._mgr.setVisible(data.hide[ii], false, name, this._module);
            }
        }

        //! 可用
        if(data.enable) {
            for(var ii = 0; ii < data.enable.length; ++ii) {
                this._mgr.setEnabled(data.enable[ii], true, name, this._module);
            }
        }

        //! 禁用
        if(data.disable) {
            for(var ii = 0; ii < data.disable.length; ++ii) {
                this._mgr.setEnabled(data.disable[ii], false, name, this._module);
            }
        }

        //! 动画
        if(data.ani) {
            for(var ii = 0; ii < data.ani.length; ++ii) {
                var anode = data.ani[ii];

                if(anode.bloop != undefined)
                    this._mgr.play(anode.name, anode.ani, anode.bloop, this._module);
                else
                    this._mgr.play(anode.name, anode.ani, anode.data, this._module);
            }
        }

        //! 次要动画（不影响锁定）
        if(data.oani) {
            for(var ii = 0; ii < data.oani.length; ++ii) {
                var anode = data.oani[ii];

                if(anode.bloop != undefined)
                    this._mgr.play(anode.name, anode.ani, anode.bloop, this._module);
                else
                    this._mgr.play(anode.name, anode.ani, anode.data, this._module);
            }
        }

        //! 音效
        if(data.effect){
            for(var ii = 0; ii < data.effect.length; ++ii) {
                var mnode = data.effect[ii];

                if(mnode.bloop != undefined)
                    this._mgr.playEffect(mnode.url, mnode.bloop, this._module);
                else
                    this._mgr.playEffect(mnode.url, false, this._module);
            }
        }

        //! 透明度
        if(data.opacity) {
            for(var ii = 0; ii < data.opacity.length; ++ii) {
                var onode = data.opacity[ii];
                this._mgr.setOpacity(onode.name, onode.value, this._module);
            }
        }

        //! 颜色
        if(data.color) {
            for(var ii = 0; ii < data.color.length; ++ii) {
                var cnode = data.color[ii];
                this._mgr.setColor(cnode.name, cnode.value, this._module);
            }
        }

        //! 运行时间
        if(data.time != undefined)
            node.time = data.time;
        else
            node.time = 0;

        //! 有后续状态或者要锁定，则激活
        if(data.next != undefined || data.lock) {
            //! 查找是否已经激活
            for(var ii = 0; ii < this._lstActiveState.length; ++ii) {
                if(this._lstActiveState[ii].name == name) {
                    this._lstActiveState.splice(ii, 1);
                    break;
                }
            }

            this._lstActiveState.push(node);
        }
        else {
            //! 没有后续状态则取消激活
            for(var ii = 0; ii < this._lstActiveState.length; ++ii) {
                if(this._lstActiveState[ii].name == name) {
                    this._lstActiveState.splice(ii, 1);
                    break;
                }
            }
        }

        node.delay = 0;
        node.wstate = undefined;
        node.wrefresh = undefined;
    },

    //! 获取一个状态的当前状态值，如果不存在返回-1
    getCurState : function (name) {
        if(!this._State[name])
            return -1;

        return this._State[name].curstate;
    },

    //! 获取当前状态的数据
    getCurData : function (name) {
        if(!this._State[name])
            return undefined;

        if(this._State[name].curstate == undefined)
            return undefined;

        var state = this._State[name].curstate;
        return this.getData(name, state);
    },

    //! 获取一个状态的某个数据 如果不传state 则获取整个数据（获取之后如果对数据进行修改，将会影响到所有使用这个data的state，需要注意。如果不希望影响别的state，则建议cloneData然后再setData）
    getData : function (name, state) {
        if(!this._State[name])
            return undefined;

        //! 获取整个data
        if(!state)
            return this._State[name].data;

        //! 获取其中一个state对应的data
        return this._State[name].data[state];
    },

    //! 拷贝（深拷贝）当前状态的数据
    cloneCurData : function (name) {
        if(!this._State[name])
            return undefined;

        if(this._State[name].curstate == undefined)
            return undefined;

        var state = this._State[name].curstate;
        return this.cloneData(name, state);
    },

    //! 拷贝（深拷贝）一个状态的某个数据 如果不传state 则获取整个数据（对于需要特殊设置数据的data 建议cloneData之后再setData）
    cloneData :function (name, state) {
        var data = this.getData(name, state);

        if(!data)
            return undefined;

        return this._deepClone(data);
    },

    //! 设置一个状态的某个数据 如果不传state 则覆盖整个数据
    setData : function (name, data, state) {
        if(!this._State[name])
            return ;

        if(!state) {
            //! 整个覆盖
            this._State[name].data = data;
        }
        else {
            //! 覆盖其中某一个
            this._State[name].data[state] = data;
        }
    },

    //! 判断一个状态是否可以结束
    isEnd :function (node) {
        if(node.time > 0)
            return false;

        var data = node.data[node.curstate];

        if(!data || !data.ani)
            return true;

        for(var jj = 0; jj < data.ani.length; ++jj) {
            if(!this._mgr.isEnd(data.ani[jj].name, this._module)) {
                return false;
            }
        }

        return true;
    },

    isEnd_name : function (name) {
        for(var ii = 0; ii < this._lstActiveState.length; ++ii) {
            var node = this._lstActiveState[ii];

            if(node.name == name)
                return this.isEnd(node);
        }

        return true;
    },

    //! 状态当前是否被锁定（如果被锁定，则需要等待动画结束，才能切换到其他状态）
    isLock : function (node, nstate) {
        var data = node.data[node.curstate];

        if(!data || !data.lock)
            return false;

        if(nstate != undefined) {
            //! 暂定不影响相同动画则不锁定
            var ndata = node.data[nstate];

            if(!data.ani)
                return false;

            var hlock = false;

            for(var ii = 0; ii < data.ani.length; ++ii) {
                var cani = data.ani[ii];

                if(ndata.ani) {
                    for(var jj = 0; jj < ndata.ani.length; ++jj) {
                        var nani = ndata.ani[jj];

                        if(cani.name == nani.name) {
                            hlock = true;
                            break;
                        }
                    }
                }

                if(hlock)
                    break;

                if(ndata.oani) {
                    for(var jj = 0; jj < ndata.oani.length; ++jj) {
                        var nani = ndata.oani[jj];

                        if(cani.name == nani.name) {
                            hlock = true;
                            break;
                        }
                    }
                }

                if(hlock)
                    break;
            }

            if(!hlock)
                return false;
        }

        //! 如果在动画都循环的情况下锁定，则表示需要播放到循环结束，才能切换状态
        if(this.isLoop(node))
            return true;

        return !this.isEnd(node);
    },

    isLock_name : function (name, nstate) {
        for(var ii = 0; ii < this._lstActiveState.length; ++ii) {
            var node = this._lstActiveState[ii];

            if(node.name == name)
                return this.isLock(node, nstate);
        }

        return false;
    },

    //! 判断状态是否循环 状态内所有动画都循环，则返回true（如果对一个循环的状态进行lock，则表示希望在循环结束后，才能切换到其他状态）
    isLoop : function (node) {
        var data = node.data[node.curstate];

        if(!data || !data.ani)
            return false;

        for(var jj = 0; jj < data.ani.length; ++jj) {
            var anode = data.ani[jj];

            if(!this._mgr.isLoop(anode.name, this._module)) {
                return false;
            }
        }

        return true;
    },

    isLoop_name : function (name) {
        for(var ii = 0; ii < this._lstActiveState.length; ++ii) {
            var node = this._lstActiveState[ii];

            if(node.name == name)
                return this.isLoop(node);
        }

        return false;
    },

    //! 设置状态的循环（一般不外部使用）
    setLoop : function (node, bloop) {
        var data = node.data[node.curstate];

        if(!data || !data.ani)
            return ;

        for(var jj = 0; jj < data.ani.length; ++jj) {
            var anode = data.ani[jj];
            this._mgr.setLoop(anode.name, bloop, this._module);
        }
    },

    setLoop_name : function (name, bloop) {
        for(var ii = 0; ii < this._lstActiveState.length; ++ii) {
            var node = this._lstActiveState[ii];

            if(node.name == name)
                return this.setLoop(node, bloop);
        }
    },

    //! 刷新状态
    update : function (dt) {
        var tmplst = [];

        for(var ii = 0; ii < this._lstActiveState.length; ++ii) {
            var node = this._lstActiveState[ii];

            //! 先判断延迟
            if(node.delay > 0) {
                node.delay -= dt;

                if(node.delay > 0)
                    continue ;

                node.delay = 0;

                var rnode = {};

                rnode.name = node.name;
                rnode.state = node.dstate;
                rnode.brefresh = node.drefresh;

                tmplst.push(rnode);

                this._lstActiveState.splice(ii, 1);
                --ii;
                continue ;
            }

            //! 运行时间
            if(node.time > 0) {
                node.time -= dt;

                if(node.time > 0)
                    continue ;

                node.time = 0;
            }

            var data = node.data[node.curstate];

            if(!data)
                continue ;

            //! 锁定且循环的状态
            if(data.lock && this.isLoop(node)) {
                //! 必须有后续状态才改变
                if(node.wstate != undefined || data.next != undefined)
                    this.setLoop(node, false);

                continue ;
            }

            if(!this.isEnd(node))
                continue ;

            var rnode = {};

            //! 先判断是否有等待变换的状态
            if(node.wstate != undefined) {
                rnode.state = node.wstate;
                rnode.brefresh = node.wrefresh;

                node.wstate = undefined;
                node.wrefresh = undefined;
            }
            else if(data.next != undefined) {
                rnode.state = data.next;
                rnode.brefresh = false;
            }

            if(rnode.state != undefined) {
                rnode.name = node.name;
                tmplst.push(rnode);
            }

            this._lstActiveState.splice(ii, 1);
            --ii;
        }

        for(var ii = 0; ii < tmplst.length; ++ii) {
            var node = tmplst[ii];
            this.setState(node.name, node.state, node.brefresh);
        }
    },

    //! 深拷贝
    _deepClone : function (source) {
        if (!source || typeof source !== 'object') {
            return source;
        }

        var targetObj = source.constructor === Array ? [] : {};

        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (source[key] && typeof source[key] === 'object') {
                    targetObj[key] = this._deepClone(source[key]);
                } else {
                    targetObj[key] = source[key];
                }
            }
        }

        return targetObj;
    },
});
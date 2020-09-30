/**
 * Created by ssscomic on 2017/11/16.
 */
var GameModuleRandom1 = cc.Node.extend({
    ctor: function (root, lstexani, lstspani) {
        this.nodeRoot = root;

        this.lstExportAni = [];

        if(lstexani != undefined) {
            for(var ii = 0; ii < lstexani.length; ++ii) {
                var data = lstexani[ii];
                this.addExportAni(data);
            }
        }

        this.lstSpineAni = [];

        if(lstspani != undefined) {
            for(var ii = 0; ii < lstspani.length; ++ii) {
                var data = lstspani[ii];
                this.addSpineAni(data);
            }
        }

        this.bPlaySound = true;
    },

    setPlaySound : function (bplay) {
        this.bPlaySound = bplay;
    },

    update : function (dt) {
        this._update_ExportAni(dt);
        this._update_SpineAni(dt);
    },

    //! 添加一个导出动画的数据 其中包括：
    //! name（节点名字） ani（动画节点，如果没设置根据名字查找） aniname（播放动画的名字，可以是数组，如果没有则使用编辑器中设置的动画） waitaniname（如果这个值，播放状态之外则使用该动画，没有则隐藏）
    //! minintervales（最小间隔时间） maxintervales（最大间隔时间，如果只有一个值则不随机）
    //! loop（是否循环播放动画，如果循环播放playtime相关参数有效，如果不循环playnum相关参数有效，如果没有则认为不循环）
    //! minplaytime（最小播放时间） maxplaytime（最大播放时间，如果只有一个则不随机） minplaynum（最小运行次数） maxplaynum（最大运行次数，如果只有一个则不随机，如果一个都没则只播放一次）
    addExportAni : function (data) {
        if(data == undefined || data.name == undefined)
            return false;

        if(data.ani == undefined) {
            data.ani = findNodeByName(this.nodeRoot.node, data.name);

            if(data.ani == undefined || data.ani == null)
                return false;
        }

        if(data.aniname == undefined) {
            data.aniname = data.ani.animation.getCurrentMovementID();

            if(data.aniname == "")
                return false;
        }

        for(var ii = 0; ii < this.lstExportAni.length; ++ii) {
            if(this.lstExportAni[ii].name == data.name) {
                this.lstExportAni[ii].splice(ii, 1);
                break;
            }
        }

        if(data.loop == undefined)
            data.loop = false;

        data._state = 0;            //! 0等待播放 1播放中
        data._time = 0;
        data._num = 0;
        data._curani = '';
        data.bplayother = false;
        data.bpause = false;

        if(data.minintervales != undefined) {
            if(data.maxintervales != undefined) {
                data._time = this._randomTime(0, data.maxintervales - data.minintervales);
            }
            else {
                data._time = this._randomTime(0, data.minintervales);
            }
        }
        else if(data.maxintervales != undefined){
            data._time = this._randomTime(0, data.maxintervales);
        }

        this._playAni_ExportAni(data);

        this.lstExportAni.push(data);
        return true;
    },

    //! 临时播放一次其他的动画
    playOtherExportAni : function (name, aniname) {
        for(var ii = 0; ii < this.lstExportAni.length; ++ii) {
            var data = this.lstExportAni[ii];

            if(data.name == name) {
                data.ani.setVisible(true);
                data.ani.animation.play(aniname, -1, 0);
                data.bplayother = true;

                return ;
            }
        }
    },

    //! 添加一个Spine动画的数据 其中包括：
    //! name（节点名字） ani（动画节点） aniname（播放动画的名字，可以是数组） waitaniname（如果这个值，播放状态之外则使用该动画，没有则隐藏）
    //! minintervales（最小间隔时间） maxintervales（最大间隔时间，如果只有一个值则不随机）
    //! loop（是否循环播放动画，如果循环播放playtime相关参数有效，如果不循环playnum相关参数有效，如果没有则认为不循环）
    //! minplaytime（最小播放时间） maxplaytime（最大播放时间，如果只有一个则不随机） minplaynum（最小运行次数） maxplaynum（最大运行次数，如果只有一个则不随机，如果一个都没则只播放一次）
    addSpineAni : function (data) {
        if(data == undefined || data.name == undefined)
            return false;

        if(data.ani == undefined || data.ani == null)
            return false;

        if(data.aniname == undefined)
            return false;

        for(var ii = 0; ii < this.lstSpineAni.length; ++ii) {
            if(this.lstSpineAni[ii].name == data.name) {
                this.lstSpineAni[ii].splice(ii, 1);
                break;
            }
        }

        if(data.loop == undefined)
            data.loop = false;

        data._state = 0;            //! 0等待播放 1播放中
        data._time = 0;
        data._num = 0;
        data._curani = '';
        data.bplayother = false;
        data.bpause = false;

        if(data.minintervales != undefined) {
            if(data.maxintervales != undefined) {
                data._time = this._randomTime(0, data.maxintervales - data.minintervales);
            }
            else {
                data._time = this._randomTime(0, data.minintervales);
            }
        }
        else if(data.maxintervales != undefined){
            data._time = this._randomTime(0, data.maxintervales);
        }

        this._playAni_SpineAni(data);

        this.lstSpineAni.push(data);
        return true;
    },

    //! 临时播放一次其他的动画
    playOtherSpineAni : function (name, aniname) {
        for(var ii = 0; ii < this.lstSpineAni.length; ++ii) {
            var data = this.lstSpineAni[ii];

            if(data.name == name) {
                data.ani.setVisible(true);
                data.ani.setAnimation(0, aniname, false);
                data.bplayother = true;

                return ;
            }
        }
    },

    setSpineWaitAni : function (name, waitaniname) {
        for(var ii = 0; ii < this.lstSpineAni.length; ++ii) {
            var data = this.lstSpineAni[ii];

            if(data.name == name) {
                if(data.waitaniname == waitaniname)
                    return ;

                if(data._curani == data.waitaniname) {
                    data.waitaniname = waitaniname;
                    this._playAni_SpineAni(data);
                }
                else {
                    data.waitaniname = waitaniname;
                }

                return ;
            }
        }
    },

    pauseSpineAni : function (name) {
        for(var ii = 0; ii < this.lstSpineAni.length; ++ii) {
            var data = this.lstSpineAni[ii];

            if(data.name == name) {
                if(data.bpause)
                    return ;

                data.bpause = true;
                data._state == 0;
                data._time = this._randomTime(data.minintervales, data.maxintervales);
                this._playAni_SpineAni(data);

                return ;
            }
        }
    },

    resumeSpineAni : function (name) {
        for(var ii = 0; ii < this.lstSpineAni.length; ++ii) {
            var data = this.lstSpineAni[ii];

            if(data.name == name) {
                if(!data.bpause)
                    return ;

                data.bpause = false;
                this._playAni_SpineAni(data);

                return ;
            }
        }
    },

    isPauseSpineAni : function (name) {
        for(var ii = 0; ii < this.lstSpineAni.length; ++ii) {
            var data = this.lstSpineAni[ii];

            if(data.name == name) {
                return data.bpause;
            }
        }

        return false;
    },

    _update_ExportAni : function (dt) {
        for(var ii = 0; ii < this.lstExportAni.length; ++ii) {
            var data = this.lstExportAni[ii];

            if(data._time > 0) {
                data._time -= dt;
            }

            if(data.bplayother) {
                if(data.ani.animation.getCurrentMovementID() == '') {
                    data.bplayother = false;
                    data._state = 0;
                    data._time = this._randomTime(data.minintervales, data.maxintervales);
                    data._curani = '';
                    this._playAni_ExportAni(data);
                }
            }
            else if(data._state == 0) {
                if(data._time <= 0) {
                    data._state = 1;
                    this._playAni_ExportAni(data);
                }
            }
            else {
                if(data.loop) {
                    if(data._time <= 0) {
                        data._state = 0;
                        data._time = this._randomTime(data.minintervales, data.maxintervales);
                        this._playAni_ExportAni(data);
                    }
                }
                else {
                    if(data.ani.animation.getCurrentMovementID() == '') {
                        data._num -= 1;

                        if(data._num <= 0) {
                            data._state = 0;
                            data._time = this._randomTime(data.minintervales, data.maxintervales);
                            this._playAni_ExportAni(data);
                        }
                        else {
                            data.ani.animation.play(data._curani, -1, 0);
                        }
                    }
                }
            }
        }
    },

    _playAni_ExportAni : function (data) {
        data.ani.setVisible(true);

        if(data._state == 0) {
            if(data.waitaniname != undefined) {
                if(data.ani.animation.getCurrentMovementID() != data.waitaniname) {
                    data.ani.animation.play(data.waitaniname, -1, 1);
                    data._curani = data.waitaniname;
                }
            }
            else {
                data.ani.setVisible(false);
            }
        }
        else {
            var aniname = data.aniname;

            if(cc.isArray(data.aniname)) {
                var aindex = Math.floor(Math.random() * data.aniname.length);
                aniname = data.aniname[aindex];
            }

            if(aniname != undefined) {
                if(data.loop) {
                    data._time = this._randomTime(data.minplaytime, data.maxplaytime);
                    data.ani.animation.play(aniname, -1, 1);
                }
                else {
                    data._num = this._randomNum(data.minplaynum, data.maxplaynum);
                    data.ani.animation.play(aniname, -1, 0);
                }

                data._curani = aniname;

                if(data.sound && this.bPlaySound)
                    cc.audioEngine.playEffect(data.sound, false);
            }
        }
    },

    _update_SpineAni : function (dt) {
        for(var ii = 0; ii < this.lstSpineAni.length; ++ii) {
            var data = this.lstSpineAni[ii];

            if(data._time > 0) {
                data._time -= dt;
            }

            if(data.bplayother) {
                if(this._isComplete_SpineAni(data)) {
                    data.bplayother = false;
                    data._state = 0;
                    data._time = this._randomTime(data.minintervales, data.maxintervales);
                    data._curani = '';
                    this._playAni_SpineAni(data);
                }
            }
            else if(data._state == 0) {
                if(data._time <= 0 && !data.bpause) {
                    data._state = 1;
                    this._playAni_SpineAni(data);
                }
            }
            else {
                if(data.loop) {
                    if(data._time <= 0) {
                        data._state = 0;
                        data._time = this._randomTime(data.minintervales, data.maxintervales);
                        this._playAni_SpineAni(data);
                    }
                }
                else {
                    if(this._isComplete_SpineAni(data)) {
                        data._num -= 1;

                        if(data._num <= 0) {
                            data._state = 0;
                            data._time = this._randomTime(data.minintervales, data.maxintervales);
                            this._playAni_SpineAni(data);
                        }
                        else {
                            data.ani.setAnimation(0, data._curani, false);
                        }
                    }
                }
            }
        }
    },

    _playAni_SpineAni : function (data) {
        data.ani.setVisible(true);

        if(data._state == 0) {
            if(data.waitaniname != undefined) {
                if(data._curani != data.waitaniname) {
                    data.ani.setAnimation(0, data.waitaniname, true);
                    data._curani = data.waitaniname;
                }
            }
            else {
                data.ani.setVisible(false);
            }
        }
        else {
            var aniname = data.aniname;

            if(cc.isArray(data.aniname)) {
                var aindex = Math.floor(Math.random() * data.aniname.length);
                aniname = data.aniname[aindex];
            }

            if(aniname != undefined) {
                if(data.loop) {
                    data._time = this._randomTime(data.minplaytime, data.maxplaytime);
                    data.ani.setAnimation(0, aniname, true);
                }
                else {
                    data._num = this._randomNum(data.minplaynum, data.maxplaynum);
                    data.ani.setAnimation(0, aniname, false);
                }

                data._curani = aniname;

                if(data.sound && this.bPlaySound)
                    cc.audioEngine.playEffect(data.sound, false);
            }
        }
    },

    _isComplete_SpineAni : function (data) {
        if(data.loop)
            return false;

        var state = data.ani.getCurrent(0);

        if(state.loop)
            return false;

        return state.trackTime >= state.animationEnd - state.animationStart;
    },

    _randomTime : function (mintime, maxtime) {
        if(mintime == undefined && maxtime == undefined)
            return 0;

        if(mintime == undefined)
            return maxtime;

        if(maxtime == undefined)
            return mintime;

        if(mintime == maxtime)
            return mintime;

        return mintime + Math.random() * (maxtime - mintime);
    },

    _randomNum : function (minnum, maxnum) {
        if(minnum == undefined && maxnum == undefined)
            return 1;

        if(minnum == undefined)
            return maxnum;

        if(maxnum == undefined)
            return minnum;

        if(minnum == maxnum)
            return minnum;

        return minnum + Math.floor(Math.random() * (maxnum - minnum));
    },
});
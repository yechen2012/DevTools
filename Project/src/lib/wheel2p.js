/**
 * Created by ssscomic on 2016/5/23.
 */
var Wheel2p = cc.Node.extend({
    ctor: function (laynode, laytopnode, lsticon, lstexicon, iconnum, iconw, iconh, iconsp, lstdownani, lstappearani, disappearani, endani, exani, appearsp, bdelay, edelay, ddelay, sdelay, iconbackdata) {
        var lsize = laynode.getLayoutSize();

        //! 放到初始位置
        this.lsticonnode = [];
        this.lstnewicon = [];
        //this.lsttopnode = [];
        //this.lsttopani = [];

        this.iconbackdata = iconbackdata;

        var sbx = lsize.width / 2;
        var sby = Math.floor(lsize.height / 2 + (iconnum - 1) / 2 * iconsp);

        for (var ii = 0; ii < iconnum; ++ii) {
            var inode = {};

            if(iconbackdata != undefined) {
                inode.backindex = Math.floor(Math.random() * this.iconbackdata.nums);
                //inode.backex = false;
            }

            var rnode = new cc.Node();
            laynode.addChild(rnode, ii);
            rnode.setPosition(sbx, sby);
            rnode.setCascadeOpacityEnabled(true);
            //rnode.setCascadeColorEnabled(true);

            var spr = new cc.Sprite();

            if(iconbackdata != undefined) {
                //rnode.addChild(spr, 1);

                var sprback = new cc.Sprite();
                //sprback.setSpriteFrame(iconback);
                rnode.addChild(sprback);

                inode.sprback = sprback;
                this.refreshBackSpr(inode);
            }
            else {
                //rnode.addChild(spr);
            }
            // spr.setCascadeOpacityEnabled(true);
            // spr.setCascadeColorEnabled(true);

            inode.rnode = rnode;
            inode.spr = spr;
            inode.idata = -1;
            inode.newdelay = 0;
            inode.disappeardelay = 0;
            inode.enddelay = 0;
            inode.exdelay = 0;
            inode.bshowani = false;
            inode.showaninum = 0;
            inode.showiconanidelay = 0;

            inode.chgdelay = 0;
            inode.newdata = -1;
            inode.chgindex = -1;
            inode.bchg = false;
            inode.bdischg = false;

            inode.adddata = -1;
            inode.adddelay = 0;

            inode.bkeep = false;
            inode.bend = true;

            if(laytopnode != undefined) {
                var tnode = new cc.Node();
                laytopnode.addChild(tnode, ii);
                tnode.setPosition(sbx, sby);
                tnode.setCascadeOpacityEnabled(true);

                inode.tnode = tnode;
            }

            tnode.addChild(spr);

            // inode.chgiconanidelay = 0;
            // inode.chgdata = -1;
            // inode.chgdata = 0;

            this.lsticonnode.push(inode);

            // if (laytop != undefined) {
            //     var tspr = new cc.Sprite();
            //     laytop.addChild(tspr, 1);
            //     tspr.setPosition(sbx, sby);
            //     tspr.setVisible(false);
            //     //tspr.setBlendFunc(gl.ONE, gl.ONE);
            //
            //     this.lsttopnode.push(tspr);
            // }

            sby -= iconsp;

            this.lstnewicon.push(-1);
        }

        this.laynode = laynode;
        this.laytopnode = laytopnode;
        this.iconnum = iconnum;
        this.lsize = lsize;　
        this.iconw = iconw;
        this.iconh = iconh;
        this.iconsp = iconsp;
        this.appearsp = appearsp;
        this.bdelay = bdelay;
        this.edelay = edelay;
        this.ddelay = ddelay;
        this.sdelay = sdelay;
        this.lsticon = lsticon;
        this.lstexicon = lstexicon;
        this.lstdownani = lstdownani;
        this.lstappearani = lstappearani;
        this.disappearani = disappearani;
        this.endani = endani;
        this.exani = exani;

        this.lsticonlight = undefined;
        this.lstexiconlight = undefined;
        this.lsticonani = undefined;
        this.lstexiconani = undefined;

        this.lstalwaysshowani = [];

        this.iexstate = -1;      //! -1是不使用ex状态 >=0是使用哪种ex状态
        this.curstate = 0;       //! 轮子当前处于的状态 0等待补充 1全满 2等待下落 3补充动画中 4消除动画中 5下落动画中 6结束动画中 7显示ex 8展示图标中 9增加图标中　10变换图标中

        this.iShowIconAniTime = 0;
        this.bPauseDisappearIcon = false;
        this.bEnd = true;

        this.backex = false;

        // this.lstbicon = lstbicon;
        // this.lsticonani = lsticonani;

        // if (lstwheeldata != undefined)
        //     this.setWheelData(lstwheeldata, bindex, false);
        //
        // this.bRun = false;
        // this.RunTime = 0;
        // this.BeginAniTime = 0;
        // this.speed = 0;
        // this.StopIndex = -1;
        // this.bStoping = false;
        // this.layWheel = laynode;
        // this.layTopWheel = laytop;
        //
        // this.bShowTopIcon = true;
    },

    //! 新新增方法
    setShowIcon : function (index, bshow) {
        var inode = this.lsticonnode[index];

        inode.spr.setVisible(bshow);
    },

    showBackEX : function (bshow) {
        if(this.backex == bshow)
            return ;

        this.backex = bshow;

        for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];
            this.refreshBackSpr(inode);
        }
    },

    nextBackIndex : function(inode) {
        if(this.iconbackdata == undefined)
            return ;

        inode.backindex += 1;

        if(inode.backindex >= this.iconbackdata.nums)
            inode.backindex = 0;
    },

    newBackIndex : function (inode) {
        if(this.iconbackdata == undefined)
            return ;

        inode.backindex = Math.floor(Math.random() * this.iconbackdata.nums);
    },

    getBackFrame : function (inode) {
        if(this.iconbackdata == undefined)
            return undefined;

        var frame = undefined;

        if(this.backex && this.iconbackdata.lstbacknameex != undefined) {
            frame = cc.spriteFrameCache.getSpriteFrame(this.iconbackdata.lstbacknameex[inode.backindex]);
        }
        else {
            frame = cc.spriteFrameCache.getSpriteFrame(this.iconbackdata.lstbackname[inode.backindex]);
        }

        return frame;
    },

    addAppearBackAni : function (inode) {
        if(this.iconbackdata == undefined)
            return ;

        var tani = undefined;

        if(this.backex && this.iconbackdata.lstappearaniex != undefined) {
            tani = CcsResCache.singleton.load(this.iconbackdata.lstappearaniex[inode.backindex]);
        }
        else {
            tani = CcsResCache.singleton.load(this.iconbackdata.lstappearani[inode.backindex]);
        }

        if(tani) {
            inode.tani = tani;

            inode.rnode.addChild(inode.tani.node);
            inode.tani.node.runAction(inode.tani.action);
            inode.tani.action.gotoFrameAndPlay(0, inode.tani.action.getDuration(), false);
        }
    },

    addEndBackAni : function (inode) {
        if(this.iconbackdata == undefined)
            return ;

        var tani = undefined;

        if(this.backex && this.iconbackdata.lstendaniex != undefined) {
            tani = CcsResCache.singleton.load(this.iconbackdata.lstendaniex[inode.backindex]);
        }
        else {
            tani = CcsResCache.singleton.load(this.iconbackdata.lstendani[inode.backindex]);
        }

        if(tani) {
            inode.tani = tani;

            inode.rnode.addChild(inode.tani.node);
            inode.tani.node.runAction(inode.tani.action);
            inode.tani.action.gotoFrameAndPlay(0, inode.tani.action.getDuration(), false);
        }
    },

    refreshBackSpr : function (inode) {
        if(this.iconbackdata == undefined)
            return ;

        var frame = undefined;

        if(this.backex && this.iconbackdata.lstbacknameex != undefined) {
            frame = cc.spriteFrameCache.getSpriteFrame(this.iconbackdata.lstbacknameex[inode.backindex]);
        }
        else {
            frame = cc.spriteFrameCache.getSpriteFrame(this.iconbackdata.lstbackname[inode.backindex]);
        }

        if(frame)
            inode.sprback.setSpriteFrame(frame);
    },

    //! 新增方法
    //! 每种图标使用特殊的出现动画
    addAppearAniEX : function (icon, lstappearaniex, soundname) {
        if(this.lstappearaniex == undefined) {
            this.lstappearaniex = {};
        }

        if(this.lstappearsoundex == undefined) {
            this.lstappearsoundex = {};
        }

        this.lstappearaniex['icon' + icon] = lstappearaniex;
        this.lstappearsoundex['icon' + icon] = soundname;
    },

    setEndAniEx : function (lst) {
        this.lstendaniex = lst;
    },

    setTopAni : function (lstdowntopani, lstappeartopani) {
        this.lstdowntopani = lstdowntopani;
        this.lstappeartopani = lstappeartopani;
    },

    //! 设置图标展示动画
    setShowIconAni : function (lstshowiconani) {
        this.lstshowiconani = lstshowiconani;
    },

    setShowIconTopAni : function (lstshowicontopani) {
        this.lstshowicontopani = lstshowicontopani;
    },

    //! 显示某个图标的动画
    beginShowIconAni : function (index) {
        if(this.lstshowiconani == undefined) {
            this.disappearIcon(index);
            return ;
        }

        if(index < 0 || index >= this.lsticonnode.length)
            return ;

        var inode = this.lsticonnode[index];

        if(inode.idata < 0)
            return ;

        if(this.curstate != 8)
            this.curstate = 8;

        inode.showiconanidelay = this.sdelay + 0.01;
    },

    //! 判断是否展示动画结束
    isShowIconAniEnd : function () {
        return true;
        if(this.curstate != 8)
            return false;

        for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if(inode.bchg)
                continue ;

            if (inode.ani != undefined) {
                if (inode.ani.action.getCurrentFrame() != inode.ani.action.getDuration())
                    return false;
            }

            if(inode.showiconanidelay > 0)
                return false;
        }

        return true;
    },

    //! 设置展示时间
    setShowIconAniTime : function (dtime) {
        this.iShowIconAniTime = dtime;
    },

    //! 获取图标数据
    getIconData : function (index) {
        var inode = this.lsticonnode[index];

        return inode == undefined ? -1 : inode.idata;

        //return inode.idata;
    },

    //! 获取轮子上存在图标的数量
    getIconNum : function () {
        var num = 0;

        for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if(inode.idata < 0 || inode.disappeardelay > 0)
                continue ;

            ++num;
        }

        return num;
    },

    //! 设置会被保留的图标
    keepIcon : function (index) {
        var inode = this.lsticonnode[index];

        if(inode.idata < 0)
            return ;

        inode.bkeep = true;
    },

    //! 暂停下落
    pauseDisappearIcon : function (bpause) {
        this.bPauseDisappearIcon = bpause;
    },

    //! 是否还有图标动画在播放（雷神特殊使用）
    hasIconAni : function () {
        for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if(inode.showiconanidelay > 0)
                return true;

            if(inode.chgdelay > 0)
                return true;

            if(inode.ani != undefined && inode.ani.action.getCurrentFrame() != inode.ani.action.getDuration())
                return true;
        }

        return false;
    },

    // //! 设置图标变化的动画，其中的每个node包括bicon、eicon和ani
    // setChgIconAni : function (lstchgiconani) {
    //     this.lstchgiconani = lstchgiconani;
    // },
    //
    // chgIcon : function (index) {
    //     if(this.lstchgiconani == undefined)
    //         return ;
    //
    //     if(index < 0 || index >= this.lsticonnode.length)
    //         return ;
    //
    //     var inode = this.lsticonnode[index];
    //
    //     if(inode.idata < 0)
    //         return ;
    //
    //     for(var ii = 0; ii < this.lstchgiconani.length; ++ii) {
    //         var cnode = this.lstchgiconani[ii];
    //
    //         if(inode.idata == cnode.bicon) {
    //
    //         }
    //     }
    //
    //     inode.chgiconanidelay = this.sdelay + 0.01;
    // },

    //! 设置增加图标的动画
    setAddIconAni : function (addani, sound) {
        this.addani = addani;
        this.addaniSound = sound;
    },

    //! 设置增加的icon
    setAddIcon : function (index, icon) {
        if(this.addani == undefined)
            return ;

        if(index < 0 || index >= this.lsticonnode.length)
            return ;

        var inode = this.lsticonnode[index];

        inode.adddata = icon;
    },

    //! 刷新增加
    refreshAddIcon : function () {
        if(this.addani == undefined) {
            this.curstate = 2;
            return ;
        }

        var badd = false;

        for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if (inode.adddata >= 0) {
                inode.adddelay = 0.01;
                badd = true;
            }
        }

        if(badd)
            this.curstate = 9;
        else
            this.curstate = 2;
    },

    //! 设置消除图标回调函数
    setDisappearFunc : function (layer, func) {
        this.layDisappear = layer;
        this.funcDisappear = func;
    },

    //! 设置某个位置上的icon
    setIcon : function(index, icon) {
        if(index >= this.lsticonnode.length)
            return ;

        var inode = this.lsticonnode[index];

        if(icon < 0) {
            inode.spr.setVisible(false);
            inode.idata = -1;

            if(inode.sprback) {
                this.refreshBackSpr(inode);
                inode.sprback.setVisible(inode.spr.isVisible());
            }

            return ;
        }

        if(icon >= this.lsticon.length)
            return ;

        inode.spr.setVisible(true);
        inode.idata = icon;

        if(inode.sprback) {
            this.refreshBackSpr(inode);
            inode.sprback.setVisible(inode.spr.isVisible());
        }

        var iconres = this.getIconRes(icon);
        var frame = cc.spriteFrameCache.getSpriteFrame(iconres);

        if(frame != undefined && frame != null) {
            inode.spr.setSpriteFrame(frame);

            var lres = this.getIconLightRes(icon);

            if(lres != undefined) {
                var frame = cc.spriteFrameCache.getSpriteFrame(lres);

                if(frame != undefined && frame != null) {
                    if(inode.sprlight == undefined) {
                        inode.sprlight = new cc.Sprite();
                        inode.spr.addChild(inode.sprlight);
                        inode.sprlight.setPosition(this.iconw / 2, this.iconh / 2);
                        inode.sprlight.setCascadeOpacityEnabled(true);
                    }

                    inode.sprlight.setSpriteFrame(frame);
                    inode.sprlight.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
                }
            }
        }
        // else {
        //     //inode.spr.setSpriteFrame(frame);
        // }
    },

    //! 调整图标位置
    adjust : function() {
        this.clearIconAni();
        
        //! 下落
        var hasdown = false;

        for(var ii = this.iconnum - 1; ii > 0; --ii) {
            var inode = this.lsticonnode[ii];

            if(inode.idata < 0) {
                for(var jj = ii - 1; jj >= 0; --jj) {
                    var jnode = this.lsticonnode[jj];

                    if(jnode.idata >= 0) {
                        this.downIcon(jj, ii);
                        hasdown = true;
                        break;
                    }
                }
            }
        }

        if(hasdown) {
            this.curstate = 5;

            if(this.RunSoundName != undefined)
                cc.audioEngine.playEffect(this.RunSoundName, false);
        }
        else
            this.curstate = 0;
    },

    //! 图标下落
    downIcon : function(bindex, eindex) {
        if(bindex < 0 || eindex < 0)
            return ;

        if(bindex >=  this.lsticonnode.length || eindex >= this.lsticonnode.length)
            return ;

        if(bindex >= eindex)
            return ;

        var icon = this.lsticonnode[bindex].idata;

        this.lsticonnode[eindex].backindex = this.lsticonnode[bindex].backindex;

        this.setIcon(bindex, -1);
        this.setIcon(eindex, icon);

        var di = eindex - bindex;

        if(this.lstdownani != undefined && di < this.lstdownani.length) {
            var inode = this.lsticonnode[eindex];

            if(inode.bshowani) {
                inode.bshowani = false;
                inode.showaninum = 0;

                if(inode.ani != undefined) {
                    // inode.ani.node.stopAllActions();
                    // inode.rnode.removeChild(inode.ani.node);
                    this.removeIconLightSprite(inode.ani);
                    CcsResCache.singleton.release(inode.ani);
                    inode.ani = undefined;
                }
            }

            inode.spr.setVisible(false);

            if(inode.sprback) {
                this.refreshBackSpr(inode);
                inode.sprback.setVisible(inode.spr.isVisible());
            }

            inode.ani = CcsResCache.singleton.load(this.lstdownani[di]);

            var sprIcon = findNodeByName(inode.ani.node, "sprIcon");

            if(sprIcon) {
                sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                this.addIconLightSprite(inode, sprIcon);
            }

            var sprBack = findNodeByName(inode.ani.node, "sprBack");

            if(sprBack)
                sprBack.setSpriteFrame(inode.sprback.getSpriteFrame());

            inode.rnode.addChild(inode.ani.node);
            inode.ani.node.runAction(inode.ani.action);
            inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

            if(this.lstdowntopani != undefined) {
                inode.tani = CcsResCache.singleton.load(this.lstdowntopani[di]);

                var sprIcon = findNodeByName(inode.tani.node, "sprIcon");

                if(sprIcon) {
                    sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                    this.addIconLightSprite(inode, sprIcon);
                }

                var sprBack = findNodeByName(inode.ani.node, "sprBack");

                if(sprBack)
                    sprBack.setSpriteFrame(inode.sprback.getSpriteFrame());

                inode.tnode.addChild(inode.tani.node);
                inode.tani.node.runAction(inode.tani.action);
                inode.tani.action.gotoFrameAndPlay(0, inode.tani.action.getDuration(), false);
            }
        }
    },

    //! 设置新的局面
    setNewIcon : function(index, icon) {
        if(index < 0 || index >= this.lstnewicon.length)
            return ;

        this.lstnewicon[index] = icon;
    },

    //! 清空新的局面
    clearNewIcon : function () {
        for(var ii = 0; ii < this.lstnewicon.length; ++ii)
            this.lstnewicon[ii] = -1;
    },

    //!　判断当前局面是否可以变成新局面
    canChgNew : function () {
        for(var ii = 0 ; ii < this.lsticonnode.length; ++ii) {
            if(this.lsticonnode[ii].idata >= 0 && this.lsticonnode[ii].idata != this.lstnewicon[ii])
                return false;
        }

        return true;
    },

    //! 补充图标（之前应该检查局面是否可以变换）
    appearIcon : function () {
        this.clearIconAni();

        var delaytime = 0.01 + this.bdelay;
        var hasappear = false;
        
        for(var ii = this.lsticonnode.length - 1; ii >= 0; --ii) {
            var inode = this.lsticonnode[ii];
            
            if(inode.idata >= 0) {
                if(inode.idata != this.lstnewicon[ii]) {
                    this.setIcon(ii, this.lstnewicon[ii]);
                }
            }
            else {
                if(this.lstnewicon[ii] >= 0) {
                    this.setIcon(ii, this.lstnewicon[ii]);

                    inode.spr.setVisible(false);

                    if(inode.sprback) {
                        this.refreshBackSpr(inode);
                        inode.sprback.setVisible(inode.spr.isVisible());
                    }

                    if(inode.bend) {
                        if(inode.sprback) {
                            this.refreshBackSpr(inode);
                            inode.sprback.setVisible(true);
                        }
                    }

                    if(this.appearexdata == undefined)
                        inode.newdelay = delaytime;
                    else
                        inode.newdelay = this.getAppearDelayTime(ii);

                    delaytime += this.appearsp;
                    hasappear = true;
                }
            }
        }

        //this.clearNewIcon();

        if(hasappear)
            this.curstate = 3;
        else
            this.curstate = 1;

        this.bEnd = false;
    },

    //! 设置特殊补充参数
    setAppearEx : function (data, index) {
        this.appearexdata = data;
        this.appearexindex = index;
    },

    //! 取补充延时
    getAppearDelayTime : function (index) {
      if(this.appearexdata == undefined) {
          return 0.01 + this.bdelay + this.appearsp * (this.lsticonnode.length - 1 - index);
      }
      else {
          var xd = this.appearexdata.xb + this.appearexdata.xsp * this.appearexindex;
          var yd = this.appearexdata.yb + this.appearexdata.ysp * index;

          return Math.abs(xd) + Math.abs(yd) + 0.01;
      }
    },

    quickAppearIcon : function() {
        this.clearIconAni();

        for(var ii = this.lsticonnode.length - 1; ii >=0; --ii) {
            var inode = this.lsticonnode[ii];
            this.setIcon(ii, this.lstnewicon[ii]);
            inode.spr.setVisible(true);

            if(inode.sprback) {
                this.refreshBackSpr(inode);
                inode.sprback.setVisible(inode.spr.isVisible());
            }
        }

        this.curstate = 1;
    },

    //! 设置当前的ex状态， 不使用传-1
    setExState : function (exstate) {
        if(exstate >= 0 && (this.lstexicon == undefined || exstate >= this.lstexicon.length))
            return ;

        this.iexstate = exstate;
    },

    //! 取一个图标当前对应的资源
    getIconRes : function (icon) {
        if(this.iexstate < 0 || this.lstexicon == undefined || this.lstexicon.length <= this.iexstate)
            return this.lsticon[icon];

        var ires = this.lstexicon[this.iexstate][icon];

        if(ires == 0 || ires == undefined)
            return this.lsticon[icon];

        return ires;
    },

    //! 是否正在运行
    isRun : function() {
        return this.curstate == 3 || this.curstate == 4 || this.curstate == 5 || this.curstate == 6;
    },

    //! 取当前的状态
    getCurState : function () {
        return this.curstate;
    },

    //! 设置当前的状态
    setCurState : function (state) {
        this.curstate = state;

        if(!this.canAddIconAni())
            this.clearIconAni();

        if(this.curstate == 0)
            this.bEnd = true;
    },

    //! 消除相关
    disappearIcon : function(index) {
        if(index < 0 || index >= this.lsticonnode.length)
            return ;

        var inode = this.lsticonnode[index];

        if(inode.idata < 0)
            return ;

        if(inode.bkeep) {
            inode.bkeep = false;
            return ;
        }

        if(this.curstate != 4)
            this.curstate = 4;

        inode.disappeardelay = this.ddelay + 0.01;

        if(this.bQuickDisappear != undefined && this.bQuickDisappear)
            this.disappearIcon_quick(index);
    },

    setQuickDisappear : function (bquick) {
        this.bQuickDisappear = bquick;
    },

    disappearIcon_quick : function (index) {
        var inode = this.lsticonnode[index];

        inode.disappeardelay = 0;

        inode.bshowani = false;
        inode.showaninum = 0;

        if(inode.ani != undefined) {
            this.removeIconLightSprite(inode.ani);
            CcsResCache.singleton.release(inode.ani);
            inode.ani = undefined;
        }

        inode.ani = CcsResCache.singleton.load(this.disappearani);
        inode.baniloop = false;

        var sprIcon = findNodeByName(inode.ani.node, "sprIcon");

        if(sprIcon) {
            sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
            this.addIconLightSprite(inode, sprIcon);
        }

        inode.rnode.addChild(inode.ani.node);
        inode.ani.node.runAction(inode.ani.action);
        inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

        //this.playDissappearSound();

        if(this.funcDisappear != undefined) {
            this.funcDisappear(this.layDisappear, this, index);
        }

        this.setIcon(index, -1);
    },

    //! 清空所有的图标
    clearIcon : function () {
        this.clearIconAni();

        var hasend = false;

        for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if(inode.idata >= 0) {
                inode.enddelay = this.edelay + 0.01;
                hasend = true;
            }
        }

        if(hasend) {
            this.curstate = 6;
            this.bEnd = true;
        }
        else
            this.curstate = 0;
    },

    //! 设置图标显示ex效果
    exIcon : function(index) {
        if(index < 0 || index >= this.lsticonnode.length)
            return ;

        var inode = this.lsticonnode[index];

        if(inode.idata < 0)
            return ;

        if(this.curstate != 4)
            this.curstate = 4;

        inode.exdelay = this.bdelay + 0.01;
    },

    //! 设置图标变化动画
    setChgIconAni : function(lst) {
        this.lstchgiconani = lst;
    },

    //! 进行图标变化
    chgIcon : function (index, newicon, delay) {
        if(index < 0 || index >= this.lsticonnode.length)
            return ;

        // if(this.lstchgiconani == undefined)
        //     return ;

        var inode = this.lsticonnode[index];

        if(inode.idata >= 0) {
            //inode.enddelay = delay;
            inode.chgdelay = delay;
            inode.newdata = newicon;
        }

        this.curstate = 10;

        // if(anindex < 0 || anindex >= this.lstchgiconani.length)
        //     return ;
        //
        // var inode = this.lsticonnode[index];
        //
        // inode.chgdelay = delay + 0.01;
        // inode.newdata = newicon;
        // inode.chgindex = anindex;
        //
        // if(bdischg != undefined)
        //     inode.bdischg = bdischg;
        //
        // if(bshowicon != undefined && bshowicon) {
        //     if(this.curstate != 8)
        //         this.curstate = 8;
        // }
        // else {
        //     if(this.curstate != 3)
        //         this.curstate = 3;
        // }
    },

    //! 补充图标（之前应该检查局面是否可以变换）
    chgNewIcon : function () {
        // for(var ii = this.lsticonnode.length - 1; ii >= 0; --ii) {
        //     var inode = this.lsticonnode[ii];
        //
        //     if(inode.idata < 0) {
        //         this.setIcon(ii, inode.newdata);
        //         inode.spr.setVisible(false);
        //         inode.newdelay = 0.1
        //         inode.newdata = -1;
        //     }
        // }
        //
        // this.curstate = 3;

        for(var ii = this.lsticonnode.length - 1; ii >= 0; --ii) {
            var inode = this.lsticonnode[ii];

            if(inode.idata >= 0) {
                inode.spr.setVisible(true);
            }
        }

        this.curstate = 1;
    },

    update: function (dt) {
        this.refreshAlwaysShowAni();

        //! 停止掉落的情况下特殊处理图标变换的动画
        if(this.curstate == 8 && this.isShowIconAniEnd() && this.iShowIconAniTime <= 0 && this.bPauseDisappearIcon) {
            for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
                var inode = this.lsticonnode[ii];

                if(inode.chgdelay > 0) {
                    bcanchg = false;
                    inode.chgdelay -= dt;

                    if (inode.chgdelay <= 0) {
                        inode.chgdelay = 0;

                        if (inode.ani != undefined) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }

                        inode.ani = CcsResCache.singleton.load(this.lstchgiconani[inode.chgindex]);
                        inode.baniloop = false;

                        var sprIcon1 = findNodeByName(inode.ani.node, "sprIcon1");

                        if (sprIcon1)
                            sprIcon1.setSpriteFrame(inode.spr.getSpriteFrame());

                        var sprIcon2 = findNodeByName(inode.ani.node, "sprIcon2");

                        if (sprIcon2) {
                            var iconres2 = this.getIconRes(inode.newdata);
                            var frame2 = cc.spriteFrameCache.getSpriteFrame(iconres2);
                            sprIcon2.setSpriteFrame(frame2);
                        }

                        inode.rnode.addChild(inode.ani.node);
                        inode.ani.node.runAction(inode.ani.action);
                        inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

                        this.setIcon(ii, inode.newdata);
                        inode.spr.setVisible(false);

                        if(inode.sprback) {
                            this.refreshBackSpr(inode);
                            inode.sprback.setVisible(inode.spr.isVisible());
                        }

                        inode.newdata = -1;
                        inode.chgindex = -1;
                    }
                }

                // if(inode.ani != undefined) {
                //     if(!inode.baniloop && inode.ani.action.getCurrentFrame() == inode.ani.action.getDuration()) {
                //         this.removeIconLightSprite(inode.ani);
                //         CcsResCache.singleton.release(inode.ani);
                //         inode.ani = undefined;
                //
                //         inode.spr.setVisible(inode.idata >= 0);
                //     }
                // }

            }

            return ;
        }

        var bcanchg = true;    //! 状态是否可以改变

        for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if(inode.bshowani) {
                //! 是图标动画
                if(inode.ani.action.getCurrentFrame() == inode.ani.action.getDuration()) {
                    if(inode.showaninum > 0) {
                        inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
                        --inode.showaninum;
                    }
                    else {
                        // inode.ani.node.stopAllActions();
                        // inode.rnode.removeChild(inode.ani.node);
                        this.removeIconLightSprite(inode.ani);
                        CcsResCache.singleton.release(inode.ani);
                        inode.ani = undefined;

                        inode.bshowani = false;
                        inode.showaninum = 0;
                        inode.spr.setVisible(true);

                        if(inode.sprback) {
                            this.refreshBackSpr(inode);
                            inode.sprback.setVisible(inode.spr.isVisible());
                        }
                    }
                }
            }
            
            if(inode.ani != undefined && !inode.bshowani) {
                if(inode.bshowani) {
                    // //! 是图标动画
                    // if(inode.ani.action.getCurrentFrame() == inode.ani.action.getDuration()) {
                    //     if(inode.showaninum > 0) {
                    //         inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
                    //         --inode.showaninum;
                    //     }
                    //     else {
                    //         // inode.ani.node.stopAllActions();
                    //         // inode.rnode.removeChild(inode.ani.node);
                    //         this.removeIconLightSprite(inode.ani);
                    //         CcsResCache.singleton.release(inode.ani);
                    //         inode.ani = undefined;
                    //
                    //         inode.bshowani = false;
                    //         inode.showaninum = 0;
                    //         inode.spr.setVisible(true);
                    //
                    //         if(inode.sprback) {
                    //             this.refreshBackSpr(inode);
                    //             inode.sprback.setVisible(inode.spr.isVisible());
                    //         }
                    //     }
                    // }
                }
                else {
                    if(this.curstate != 8) {
                        bcanchg = false;

                        if(!inode.baniloop && inode.ani.action.getCurrentFrame() == inode.ani.action.getDuration()) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;

                            if(inode.tani != undefined) {
                                CcsResCache.singleton.release(inode.tani);
                                inode.tani = undefined;
                            }

                            if(this.curstate != 4) {
                                inode.spr.setVisible(inode.idata >= 0);

                                if(inode.sprback) {
                                    this.refreshBackSpr(inode);
                                    inode.sprback.setVisible(inode.spr.isVisible());
                                }
                            }

                            if(inode.bend) {
                                if(inode.sprback) {
                                    this.refreshBackSpr(inode);
                                    inode.sprback.setVisible(true);
                                }

                                //inode.bend = false;
                            }

                            // if(this.curstate == 3 || this.curstate == 5) {
                            //     if(this.StopSoundName != undefined) {
                            //         cc.audioEngine.playEffect(this.StopSoundName, false);
                            //     }
                            // }

                            if(this.curstate == 3 && inode.idata == this.C1Num) {
                                if(this.C1SoundName != undefined) {
                                    cc.audioEngine.playEffect(this.C1SoundName, false);
                                }
                            }

                            if(inode.bchg) {
                                this.disappearIcon(ii);
                                inode.bchg = false;
                            }
                        }
                    }
                }
            }
            else if(inode.newdelay > 0) {
                bcanchg = false;
                inode.newdelay -= dt;

                if(inode.newdelay <= 0) {
                    inode.newdelay = 0;

                    if(inode.bshowani) {
                        inode.bshowani = false;
                        inode.showaninum = 0;

                        if(inode.ani != undefined) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }
                    }

                    if(inode.bend) {
                        if(this.lstappearaniex != undefined && this.lstappearaniex['icon' + inode.idata] != undefined ) {
                            inode.ani = CcsResCache.singleton.load(this.lstappearaniex['icon' + inode.idata][ii]);

                            if(ii == 0) {
                                if(this.StopSoundName != undefined)
                                    cc.audioEngine.playEffect(this.StopSoundName, false);
                            }
                        }
                        else {
                            inode.ani = CcsResCache.singleton.load(this.lstappearani[ii]);
                        }

                        this.nextBackIndex(inode);
                    }
                    else {
                        inode.ani = CcsResCache.singleton.load(this.lstappearani[ii]);

                        this.newBackIndex(inode);
                    }

                    // if(this.lstappearaniex != undefined && this.lstappearaniex['icon' + inode.idata] != undefined ) {
                    //     inode.ani = CcsResCache.singleton.load(this.lstappearaniex['icon' + inode.idata][ii]);
                    // }
                    // else {
                    //     inode.ani = CcsResCache.singleton.load(this.lstappearani[ii]);
                    // }

                    //inode.bend = false;
                    inode.baniloop = false;

                    var sprIcon = findNodeByName(inode.ani.node, "sprIcon");

                    if(sprIcon) {
                        sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                        this.addIconLightSprite(inode, sprIcon);
                    }

                    if(inode.sprback) {
                        this.refreshBackSpr(inode);
                        inode.sprback.setVisible(false);
                    }

                    var sprBack = findNodeByName(inode.ani.node, "sprBack");

                    if(sprBack) {
                        sprBack.setSpriteFrame(inode.sprback.getSpriteFrame());
                    }

                    if(this.iconbackdata != undefined) {
                        //inode.tnode.addChild(inode.ani.node, 1);

                        if(inode.bend) {
                            inode.tnode.addChild(inode.ani.node, 1);
                            this.addAppearBackAni(inode);
                        }
                        else
                            inode.rnode.addChild(inode.ani.node);
                    }
                    else {
                        inode.rnode.addChild(inode.ani.node);
                    }

                    //inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

                    if(!inode.bend && this.lstappeartopani != undefined) {
                        inode.tani = CcsResCache.singleton.load(this.lstappeartopani[ii]);

                        var sprIcon = findNodeByName(inode.tani.node, "sprIcon");

                        if(sprIcon) {
                            sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                        }

                        var sprBack = findNodeByName(inode.tani.node, "sprBack");

                        if(sprBack) {
                            sprBack.setSpriteFrame(inode.sprback.getSpriteFrame());
                        }

                        inode.tnode.addChild(inode.tani.node, 2);

                        inode.tani.node.runAction(inode.tani.action);
                        inode.tani.action.gotoFrameAndPlay(0, inode.tani.action.getDuration(), false);
                    }

                    inode.bend = false;

                    // if(this.lstappearsoundex != undefined && this.lstappearsoundex['icon' + inode.idata] != undefined ) {
                    //     cc.audioEngine.playEffect(this.lstappearsoundex['icon' + inode.idata], false);
                    // }
                    // else if(this.StopSoundName != undefined) {
                    //     cc.audioEngine.playEffect(this.StopSoundName, false);
                    // }
                }
            }
            else if(inode.disappeardelay > 0) {
                bcanchg = false;
                inode.disappeardelay -= dt;

                if(inode.disappeardelay <= 0) {
                    inode.disappeardelay = 0;

                    if(inode.bshowani) {
                        inode.bshowani = false;
                        inode.showaninum = 0;

                        if(inode.ani != undefined) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }
                    }

                    inode.ani = CcsResCache.singleton.load(this.disappearani);
                    inode.baniloop = false;

                    var sprIcon = findNodeByName(inode.ani.node, "sprIcon");

                    if(sprIcon) {
                        sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                        this.addIconLightSprite(inode, sprIcon);
                    }

                    // if(this.iconbackdata != undefined) {
                    //     inode.tnode.addChild(inode.ani.node);
                    // }
                    // else {
                    //     inode.rnode.addChild(inode.ani.node);
                    // }

                    inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

                    //this.playDissappearSound();

                    if(this.funcDisappear != undefined) {
                        this.funcDisappear(this.layDisappear, this, ii);
                    }

                    this.setIcon(ii, -1);
                }
            }
            else if(inode.enddelay > 0) {
                bcanchg = false;
                inode.enddelay -= dt;

                if(inode.enddelay <= 0) {
                    inode.enddelay = 0;

                    if(inode.bshowani) {
                        inode.bshowani = false;
                        inode.showaninum = 0;

                        if(inode.ani != undefined) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }
                    }

                    if(this.lstendaniex != undefined && inode.idata >= 0 && inode.idata < this.lstendaniex.length) {
                        inode.ani = CcsResCache.singleton.load(this.lstendaniex[inode.idata]);
                    }
                    else {
                        inode.ani = CcsResCache.singleton.load(this.endani);
                    }

                    inode.baniloop = false;
                    inode.bend = true;

                    var sprIcon = findNodeByName(inode.ani.node, "sprIcon");

                    if(sprIcon != undefined && sprIcon != null) {
                        sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                        this.addIconLightSprite(inode, sprIcon);
                    }

                    if(this.iconbackdata != undefined) {
                        inode.rnode.addChild(inode.ani.node, 1);
                        this.nextBackIndex(inode);
                        this.addEndBackAni(inode);
                    }
                    else {
                        inode.rnode.addChild(inode.ani.node);
                    }

                    //inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

                    this.setIcon(ii, -1);
                }
            }
            else if(inode.exdelay > 0) {
                bcanchg = false;
                inode.exdelay -= dt;

                if(inode.exdelay <= 0) {
                    inode.exdelay = 0;

                    if(inode.bshowani) {
                        inode.bshowani = false;
                        inode.showaninum = 0;

                        if(inode.ani != undefined) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }
                    }

                    inode.ani = CcsResCache.singleton.load(this.exani);
                    inode.baniloop = false;

                    var sprIcon = findNodeByName(inode.ani.node, "sprIcon");

                    if(sprIcon) {
                        sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                        this.addIconLightSprite(inode, sprIcon);
                    }

                    inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

                    //this.setIcon(ii, -1);
                }
            }
            else if(inode.showiconanidelay > 0) {
                bcanchg = false;
                inode.showiconanidelay -= dt;

                if(inode.showiconanidelay <= 0) {
                    inode.showiconanidelay = 0;

                    if(inode.bshowani) {
                        inode.bshowani = false;
                        inode.showaninum = 0;

                        if(inode.ani != undefined) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }
                    }

                    inode.ani = CcsResCache.singleton.load(this.lstshowiconani[inode.idata]);
                    inode.baniloop = false;

                    // var sprIcon = findNodeByName(inode.ani.node, "sprIcon");
                    // sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                    // this.addIconLightSprite(inode, sprIcon);

                    inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

                    if(this.lstshowicontopani != undefined && this.laytopnode != undefined) {
                        inode.tani = CcsResCache.singleton.load(this.lstshowicontopani[inode.idata]);

                        inode.tnode.addChild(inode.tani.node);
                        inode.tani.node.runAction(inode.tani.action);
                        inode.tani.action.gotoFrameAndPlay(0, inode.tani.action.getDuration(), false);
                    }

                    inode.spr.setVisible(false);

                    if(inode.sprback) {
                        this.refreshBackSpr(inode);
                        inode.sprback.setVisible(inode.spr.isVisible());
                    }

                    if(this.funcShowIcon != undefined) {
                        this.funcShowIcon(this.layShowIcon, this, ii);
                    }

                    this.playDissappearSound();

                    // if(this.RunSoundName != undefined) {
                    //     cc.audioEngine.playEffect(this.RunSoundName, false);
                    // }

                    // this.setIcon(ii, -1);
                    //
                    // this.playDissappearSound();
                }
            }
            else if(inode.chgdelay > 0/* && (!this.bPauseDisappearIcon || (this.isShowIconAniEnd() && this.iShowIconAniTime <= 0))*/) {
                bcanchg = false;
                inode.chgdelay -= dt;

                if(inode.chgdelay <= 0) {
                    inode.chgdelay = 0;

                    inode.ani = CcsResCache.singleton.load(this.lstchgiconani[inode.newdata]);
                    inode.baniloop = false;

                    // var sprIcon1 = findNodeByName(inode.ani.node, "sprIcon1");
                    //
                    // if(sprIcon1)
                    //     sprIcon1.setSpriteFrame(inode.spr.getSpriteFrame());
                    //
                    // var sprIcon2 = findNodeByName(inode.ani.node, "sprIcon2");
                    //
                    // if(sprIcon2) {
                    //     var iconres2 = this.getIconRes(inode.newdata);
                    //     var frame2 = cc.spriteFrameCache.getSpriteFrame(iconres2);
                    //     sprIcon2.setSpriteFrame(frame2);
                    // }

                    var sprBack = findNodeByName(inode.ani.node, "sprBack");
                    sprBack.setSpriteFrame(inode.sprback.getSpriteFrame());

                    inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

                    this.setIcon(ii, inode.newdata);
                    inode.spr.setVisible(false);

                    if(inode.sprback) {
                        this.refreshBackSpr(inode);
                        inode.sprback.setVisible(inode.spr.isVisible());
                    }

                    inode.newdata = -1;
                    inode.chgindex = -1;

                    // if(inode.bdischg) {
                    //     inode.bchg = true;
                    //     inode.bdischg = false;
                    // }
                }
            }
            else if(inode.adddelay > 0) {
                bcanchg = false;
                inode.adddelay -= dt;

                if(inode.adddelay <= 0) {
                    inode.adddelay = 0;

                    if(inode.bshowani) {
                        inode.bshowani = false;
                        inode.showaninum = 0;

                        if(inode.ani != undefined) {
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }
                    }

                    this.setIcon(ii, inode.adddata);
                    inode.adddata = -1;

                    inode.ani = CcsResCache.singleton.load(this.addani);
                    inode.baniloop = false;

                    var sprIcon = findNodeByName(inode.ani.node, "sprIcon");
                    sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                    this.addIconLightSprite(inode, sprIcon);

                    inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
                    inode.spr.setVisible(false);

                    if(inode.sprback) {
                        this.refreshBackSpr(inode);
                        inode.sprback.setVisible(inode.spr.isVisible());
                    }

                    if(this.addaniSound != undefined) {
                        cc.audioEngine.playEffect(this.addaniSound, false);
                    }
                }
            }
        }

        //! 状态之间切换
        if(bcanchg) {
            if(this.curstate == 3)
                this.curstate = 1;
            else if(this.curstate == 4) {
                this.refreshAddIcon();
                //this.curstate = 2;
            }
            else if(this.curstate == 5)
                this.curstate = 0;
            else if(this.curstate == 6)
                this.curstate = 0;
            else if(this.curstate == 7)
                this.curstate = 0;
            else if(this.curstate == 9)
                this.curstate = 2;
            else if(this.curstate == 10) {
                this.chgNewIcon();
            }
        }

        if(this.curstate == 8 && this.isShowIconAniEnd()) {
            if(this.iShowIconAniTime > 0) {
                this.iShowIconAniTime -= dt;

                if(this.iShowIconAniTime <= 0)
                    this.iShowIconAniTime = 0;
            }
            else if(!this.bPauseDisappearIcon){
                for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
                    var inode = this.lsticonnode[ii];

                    if (inode.ani != undefined && !inode.bshowani && !inode.bchg) {
                        this.disappearIcon(ii);
                    }
                }

                if(this.curstate == 8) {
                    this.curstate = 4;
                }
            }
        }
    },

    //! 设置图标光效
    setIconLight : function (lsticonlight, lstexiconlight) {
        this.lsticonlight = lsticonlight;
        this.lstexiconlight = lstexiconlight;
    },

    //! 取一个图标当前对应的光效
    getIconLightRes : function (icon) {
        if(this.lsticonlight == undefined)
            return undefined;

        if(this.iexstate < 0 || this.lstexiconlight == undefined)
            return this.lsticonlight[icon];

        var ires = this.lstexiconlight[this.iexstate][icon];

        if(ires == 0)
            return this.lsticonlight[icon];

        return ires;
    },

    //! 添加图标对应的光效
    addIconLightSprite : function (inode, sprIcon) {
        var lres = this.getIconLightRes(inode.idata);

        if(lres == undefined)
            return ;

        if(inode.sprlight == undefined || sprIcon == undefined || sprIcon == null)
            return ;

        var sprlight = new cc.Sprite();
        sprIcon.addChild(sprlight);
        sprlight.setPosition(inode.sprlight.getPosition());
        sprlight.setSpriteFrame(inode.sprlight.getSpriteFrame());
        sprlight.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
    },

    removeIconLightSprite : function (ani) {
        if(this.lsticonani == undefined)
            return ;

        if(ani.node != undefined) {
            var sprIcon = findNodeByName(ani.node, "sprIcon");

            if(sprIcon)
                sprIcon.removeAllChildren();
        }
    },

    //! 设置图标动画
    setIconAni : function (lsticonani, lstexiconani) {
        this.lsticonani = lsticonani;
        this.lstexiconani = lstexiconani;
    },

    //! 取一个图标当前对应的动画
    getIconAniRes : function (icon) {
        if(this.lsticonani == undefined)
            return undefined;

        if(this.iexstate < 0 || this.lstexiconani == undefined)
            return this.lsticonani[icon];

        var ires = this.lstexiconani[this.iexstate][icon];

        if(ires == 0)
            return this.lsticonani[icon];

        return ires;
    },

    //! 清除所有的图标动画
    clearIconAni : function () {
        for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if(inode.idata < 0 || !inode.bshowani)
                continue ;

            inode.bshowani = false;
            inode.showaninum = 0;
            inode.spr.setVisible(true);

            if(inode.sprback) {
                this.refreshBackSpr(inode);
                inode.sprback.setVisible(inode.spr.isVisible());
            }

            if(inode.ani != undefined) {
                // inode.ani.node.stopAllActions();
                // inode.rnode.removeChild(inode.ani.node);
                this.removeIconLightSprite(inode.ani);
                CcsResCache.singleton.release(inode.ani);
                inode.ani = undefined;
            }
        }
    },

    //! 判断是否可以添加图标动画
    canAddIconAni : function () {
        if(this.lsticonani == undefined)
            return false;

        if(this.curstate != 0 && this.curstate != 1)
            return false;

        return true;
    },

    //! 随机显示一个图标动画，如果没有可以显示的则返回false
    randomIconAni : function (num) {
        if(this.lsticonani == undefined)
            return false;

        if(this.curstate != 0 && this.curstate != 1)
            return false;

        var lstr = [];

        for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if(inode.idata < 0 || inode.bshowani)
                continue  ;

            if(inode.ani != undefined)
                continue  ;

            // if(this.lsticonani[inode.idata] == undefined || this.lsticonani[inode.idata] == 0)
            //     continue ;

            var ares = this.getIconAniRes(inode.idata);

            if(ares == undefined || ares == 0)
                continue ;

            lstr.push(ii);
        }

        if(lstr.length <= 0)
            return false;

        var ri = Math.floor(Math.random() * lstr.length);
        var inode = this.lsticonnode[lstr[ri]];

        inode.bshowani = true;
        inode.showaninum = num - 1;
        inode.spr.setVisible(false);

        if(inode.sprback) {
            this.refreshBackSpr(inode);
            inode.sprback.setVisible(inode.spr.isVisible());
        }

        var ares = this.getIconAniRes(inode.idata);
        inode.ani = CcsResCache.singleton.load(ares);

        var sprBack = findNodeByName(inode.ani.node, "sprBack");
        sprBack.setSpriteFrame(inode.sprback.getSpriteFrame());

        var sprBack = findNodeByName(inode.ani.node, "sprBack");
        sprBack.setSpriteFrame(inode.sprback.getSpriteFrame());

        inode.rnode.addChild(inode.ani.node);
        inode.ani.node.runAction(inode.ani.action);
        inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

        return true;
    },

    //! 设置显示一个图标动画
    showIconAni : function (index, num) {
        if(this.lsticonani == undefined)
            return ;

        if(this.curstate != 0 && this.curstate != 1)
            return ;

        var inode = this.lsticonnode[index];

        if(inode.idata < 0 || inode.bshowani)
            return ;

        if(inode.ani != undefined)
            return  ;

        var ares = this.getIconAniRes(inode.idata);

        if(ares == undefined || ares == 0)
            return ;

        inode.bshowani = true;
        inode.showaninum = num - 1;
        inode.spr.setVisible(false);

        if(inode.sprback) {
            this.refreshBackSpr(inode);
            inode.sprback.setVisible(inode.spr.isVisible());
        }

        inode.ani = CcsResCache.singleton.load(ares);

        var sprBack = findNodeByName(inode.ani.node, "sprBack");
        sprBack.setSpriteFrame(inode.sprback.getSpriteFrame());

        inode.rnode.addChild(inode.ani.node);
        inode.ani.node.runAction(inode.ani.action);
        inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
    },

    //! 某种图标全部显示动画
    showIconAni_data: function (data, num) {
        if(this.lsticonani == undefined)
            return ;

        if(this.curstate != 0 && this.curstate != 1)
            return ;

        for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if(inode.idata < 0 || inode.bshowani)
                continue  ;

            if(inode.ani != undefined)
                continue  ;

            if(inode.idata != data)
                continue ;

            if(inode.newdelay > 0 || inode.disappeardelay > 0 || inode.enddelay > 0 || inode.exdelay > 0)
                continue ;

            var ares = this.getIconAniRes(inode.idata);

            if(ares == undefined || ares == 0)
                continue ;

            inode.bshowani = true;
            inode.showaninum = num - 1;
            inode.spr.setVisible(false);

            if(inode.sprback) {
                this.refreshBackSpr(inode);
                inode.sprback.setVisible(inode.spr.isVisible());
            }

            inode.ani = CcsResCache.singleton.load(ares);

            var sprBack = findNodeByName(inode.ani.node, "sprBack");
            sprBack.setSpriteFrame(inode.sprback.getSpriteFrame());

            inode.rnode.addChild(inode.ani.node);
            inode.ani.node.runAction(inode.ani.action);
            inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
        }
    },

    //! 添加一直显示动画的图标
    addAlwaysShowAniIcon : function (data) {
        for(var ii = 0; ii < this.lstalwaysshowani.length; ++ii) {
            if(this.lstalwaysshowani[ii] == data)
                return ;
        }

        this.lstalwaysshowani.push(data);
    },

    //! 刷新一直显示动画的图标
    refreshAlwaysShowAni : function () {
        if(this.lstalwaysshowani.length <= 0)
            return ;

        if(this.lsticonani == undefined)
            return ;

        for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if(inode.idata < 0 || inode.bshowani)
                continue  ;

            if(inode.ani != undefined)
                continue  ;

            if(!inode.spr.isVisible())
                continue ;

            if(inode.newdelay > 0 || inode.disappeardelay > 0 || inode.enddelay > 0 || inode.exdelay > 0 || inode.showiconanidelay > 0 || inode.chgdelay > 0 || inode.adddelay > 0)
                continue ;

            var bshow = false;

            for(var jj = 0; jj < this.lstalwaysshowani.length; ++jj) {
                if(inode.idata == this.lstalwaysshowani[jj]) {
                    bshow = true;
                    break;
                }
            }

            if(!bshow)
                continue ;

            var ares = this.getIconAniRes(inode.idata);

            if(ares == undefined || ares == 0)
                continue ;

            inode.bshowani = true;
            inode.showaninum = 9999;
            inode.spr.setVisible(false);

            if(inode.sprback) {
                this.refreshBackSpr(inode);
                inode.sprback.setVisible(inode.spr.isVisible());
            }

            inode.ani = CcsResCache.singleton.load(ares);

            var sprBack = findNodeByName(inode.ani.node, "sprBack");

            if(sprBack)
                sprBack.setSpriteFrame(inode.sprback.getSpriteFrame());

            inode.tnode.addChild(inode.ani.node);
            inode.ani.node.runAction(inode.ani.action);
            inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
        }
    },

    //! 取一个图标对应的真实
    getRealPosition : function (index) {
        var pos = { x:0, y:0 };

        var inode = this.lsticonnode[index];

        pos.x = this.laynode.getPositionX() + inode.rnode.getPositionX();
        pos.y = this.laynode.getPositionY() + inode.rnode.getPositionY();

        return pos;
    },

    // // getNewData : function() {
    // //     if(this.lstwheeldata == undefined)
    // //         return 0;
    // //
    // //     var anum = Math.floor(this.lsticonnode.length / 2) + 1;
    // //     var nindex = this.curdataindex + anum;
    // //
    // //     while(nindex >= this.lstwheeldata.length)
    // //         nindex -= this.lstwheeldata.length;
    // //
    // //     ++this.curdataindex;
    // //
    // //     while(this.curdataindex >= this.lstwheeldata.length)
    // //         this.curdataindex -= this.lstwheeldata.length;
    // //
    // //     //! 如果可以停止，则尝试快速停止
    // //     if(this.RunTime <= 0 && this.StopIndex >= 0) {
    // //         var bfind = false;
    // //
    // //         for(var ii = 0; ii <= anum; ++ii) {
    // //             var sindex = this.curdataindex + ii;
    // //
    // //             while(sindex < 0 )
    // //                 sindex += this.lstwheeldata.length;
    // //
    // //             while(sindex >= this.lstwheeldata.length)
    // //                 sindex -= this.lstwheeldata.length;
    // //
    // //             if(sindex == this.StopIndex) {
    // //                 bfind = true;
    // //                 break;
    // //             }
    // //         }
    // //
    // //         if(!bfind) {
    // //             if((this.lstwheeldata[nindex] == 0 && this.lstwheeldata[this.StopIndex] == 0) || (this.lstwheeldata[nindex] != 0 && this.lstwheeldata[this.StopIndex] != 0)) {
    // //                 nindex = this.StopIndex;
    // //                 this.curdataindex = nindex - anum + 1;
    // //
    // //                 while(this.curdataindex < 0 )
    // //                     this.curdataindex += this.lstwheeldata.length;
    // //
    // //                 while(this.curdataindex >= this.lstwheeldata.length)
    // //                     this.curdataindex -= this.lstwheeldata.length;
    // //             }
    // //             else {
    // //                 nindex = this.StopIndex - 1;
    // //
    // //                 while(nindex < 0 )
    // //                     nindex += this.lstwheeldata.length;
    // //
    // //                 while(nindex >= this.lstwheeldata.length)
    // //                     nindex -= this.lstwheeldata.length;
    // //
    // //                 this.curdataindex = nindex - anum + 1;
    // //
    // //                 while(this.curdataindex < 0 )
    // //                     this.curdataindex += this.lstwheeldata.length;
    // //
    // //                 while(this.curdataindex >= this.lstwheeldata.length)
    // //                     this.curdataindex -= this.lstwheeldata.length;
    // //             }
    // //         }
    // //     }
    // //
    // //     return this.lstwheeldata[nindex];
    // // },
    //
    // getNewData: function () {
    //     if (this.lstwheeldata == undefined)
    //         return 0;
    //
    //     var anum = Math.floor(this.lsticonnode.length / 2) + 1;
    //     var nindex = this.curdataindex + anum;
    //
    //     while (nindex >= this.lstwheeldata.length)
    //         nindex -= this.lstwheeldata.length;
    //
    //     ++this.curdataindex;
    //
    //     while (this.curdataindex >= this.lstwheeldata.length)
    //         this.curdataindex -= this.lstwheeldata.length;
    //
    //     //! 如果可以停止，则尝试快速停止
    //     if (this.RunTime <= 0 && this.StopIndex >= 0) {
    //         var bfind = false;
    //
    //         for (var ii = 0; ii <= anum + 1; ++ii) {
    //             var sindex = this.curdataindex + ii;
    //
    //             while (sindex < 0)
    //                 sindex += this.lstwheeldata.length;
    //
    //             while (sindex >= this.lstwheeldata.length)
    //                 sindex -= this.lstwheeldata.length;
    //
    //             if (sindex == this.StopIndex) {
    //                 bfind = true;
    //                 break;
    //             }
    //         }
    //
    //         if (!bfind) {
    //             if ((this.lstwheeldata[nindex] == 0 && this.lstwheeldata[this.StopIndex] == 0) || (this.lstwheeldata[nindex] != 0 && this.lstwheeldata[this.StopIndex] != 0)) {
    //                 nindex = this.StopIndex - 2;
    //
    //                 while (nindex < 0)
    //                     nindex += this.lstwheeldata.length;
    //
    //                 while (nindex >= this.lstwheeldata.length)
    //                     nindex -= this.lstwheeldata.length;
    //
    //                 this.curdataindex = nindex - anum + 1;
    //
    //                 while (this.curdataindex < 0)
    //                     this.curdataindex += this.lstwheeldata.length;
    //
    //                 while (this.curdataindex >= this.lstwheeldata.length)
    //                     this.curdataindex -= this.lstwheeldata.length;
    //             }
    //             else {
    //                 nindex = this.StopIndex - 1;
    //
    //                 while (nindex < 0)
    //                     nindex += this.lstwheeldata.length;
    //
    //                 while (nindex >= this.lstwheeldata.length)
    //                     nindex -= this.lstwheeldata.length;
    //
    //                 this.curdataindex = nindex - anum + 1;
    //
    //                 while (this.curdataindex < 0)
    //                     this.curdataindex += this.lstwheeldata.length;
    //
    //                 while (this.curdataindex >= this.lstwheeldata.length)
    //                     this.curdataindex -= this.lstwheeldata.length;
    //             }
    //         }
    //     }
    //
    //     return this.lstwheeldata[nindex];
    // },
    //
    // //! 设置轮子数据
    // setWheelData: function (lstwheeldata, bindex, brefresh) {
    //     this.lstwheeldata = lstwheeldata;
    //
    //     this.setWheelIndex(bindex, brefresh);
    // },
    //
    // //! 设置当前轮子的位置
    // setWheelIndex: function (bindex, brefresh) {
    //     this.curdataindex = bindex;
    //
    //     while (this.curdataindex < 0)
    //         this.curdataindex += this.lstwheeldata.length;
    //
    //     while (this.curdataindex >= this.lstwheeldata.length)
    //         this.curdataindex -= this.lstwheeldata.length;
    //
    //     if (brefresh)
    //         this.refreshWheelDisplay();
    // },
    //
    // //! 刷新轮子显示
    // refreshWheelDisplay: function () {
    //     var inum = this.lsticonnode.length;
    //
    //     var cindex = this.curdataindex - Math.floor(inum / 2);
    //
    //     while (cindex < 0)
    //         cindex += this.lstwheeldata.length;
    //
    //     while (cindex >= this.lstwheeldata.length)
    //         cindex -= this.lstwheeldata.length;
    //
    //     for (var ii = 0; ii < inum; ++ii) {
    //         var idata = this.lstwheeldata[cindex];
    //         var icon = this.lsticon[idata];
    //
    //         this.lsticonnode[ii].idata = idata;
    //
    //         if (icon == undefined || icon == 0) {
    //             this.lsticonnode[ii].spr.setVisible(false);
    //         }
    //         else {
    //             var frame = cc.spriteFrameCache.getSpriteFrame(icon);
    //             this.lsticonnode[ii].spr.setSpriteFrame(frame);
    //             this.lsticonnode[ii].spr.setVisible(true);
    //             // this.lsticonnode[ii].spr.setBlendFunc(gl.ONE, gl.ONE);
    //             // this.lsticonnode[ii].spr.setOpacity(128);
    //         }
    //
    //         ++cindex;
    //
    //         if (cindex >= this.lstwheeldata.length)
    //             cindex = 0;
    //     }
    // },
    //
    // stopWheel: function (bplayeff) {
    //     this.showLightAni(false);
    //
    //     if (this.StopSoundName != undefined && bplayeff)
    //         cc.audioEngine.playEffect(this.StopSoundName, false);
    //
    //     for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
    //         var spr = this.lsticonnode[ii].spr;
    //         spr.stopAllActions();
    //     }
    //
    //     var snum = Math.floor(this.lsticonnode.length / 2);
    //     var bindex = this.StopIndex - snum;
    //
    //     for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
    //         var sindex = bindex + ii;
    //
    //         while (sindex < 0)
    //             sindex += this.lstwheeldata.length;
    //
    //         while (sindex >= this.lstwheeldata.length)
    //             sindex -= this.lstwheeldata.length;
    //
    //         this.lsticonnode[ii].idata = this.lstwheeldata[sindex];
    //     }
    //
    //     this.bRun = false;
    //     this.RunTime = 0;
    //     this.BeginAniTime = 0;
    //     this.speed = 0;
    //     this.StopIndex = -1;
    //
    //     this.curpos = this.sby;
    //
    //     var bc1 = false;
    //     var bi = -1;
    //     var ei = -1;
    //
    //     if(this.iLogicNum != undefined && this.C1Num != undefined && this.C1SoundName != undefined) {
    //         bc1 = true;
    //         bi = Math.floor(this.lsttopnode.length / 2) - Math.floor(this.iLogicNum / 2);
    //         ei = bi + this.iLogicNum - 1;
    //     }
    //
    //     var ny = Math.floor(this.curpos);
    //
    //     for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
    //         var spr = this.lsticonnode[ii].spr;
    //         var idata = this.lsticonnode[ii].idata;
    //         var icon = this.lsticon[idata];
    //
    //         if(bc1 && ii >= bi && ii <= ei && idata == this.C1Num) {
    //             cc.audioEngine.playEffect(this.C1SoundName, false);
    //         }
    //
    //         if (icon != undefined && icon != 0) {
    //             var frame = cc.spriteFrameCache.getSpriteFrame(icon);
    //             spr.setSpriteFrame(frame);
    //             spr.setVisible(true);
    //             // spr.setBlendFunc(gl.ONE, gl.ONE);
    //             // spr.setOpacity(128);
    //         }
    //         else {
    //             spr.setVisible(false);
    //         }
    //
    //         spr.setPositionY(ny);
    //
    //         ny += this.iconsp;
    //     }
    // },
    //
    //! 设置音效
    setSound: function (runsound, stopsound, disappearsound, c1num, c1sound) {
        this.RunSoundName = runsound;
        this.StopSoundName = stopsound;
        this.DisappearSoundName = disappearsound;

        this.C1Num = c1num;
        this.C1SoundName = c1sound;
    },

    //! 设置特出的消除音效
    setDisappearSoundEx : function (lst) {
        this.lstDisappearSoundEx = lst;
        this.iDisappearSoundIndex = 0;
    },

    //! 设置当前消除音效的索引
    setDisappearSoundIndex : function (index) {
        this.iDisappearSoundIndex = index;

        if(this.lstDisappearSoundEx != undefined) {
            if(this.iDisappearSoundIndex < 0)
                this.iDisappearSoundIndex = 0;

            if(this.iDisappearSoundIndex >= this.lstDisappearSoundEx.length)
                this.iDisappearSoundIndex = this.lstDisappearSoundEx.length - 1;
        }
    },

    //! 播放消除音效
    playDissappearSound : function () {
        if(this.lstDisappearSoundEx != undefined) {
            cc.audioEngine.playEffect(this.lstDisappearSoundEx[this.iDisappearSoundIndex], false);
        }
        else if(this.DisappearSoundName != undefined) {
            cc.audioEngine.playEffect(this.DisappearSoundName, false);
        }
    }

    //
    // //! 设置结果状态的颜色
    // setResultColor : function(r, g, b, a) {
    //     this.ResultR = r;
    //     this.ResultG = g;
    //     this.ResultB = b;
    //     this.ResultA = a;
    // },
    //
    // //! 设置逻辑数量
    // setLogicNum : function(num) {
    //   this.iLogicNum = num;
    // },
    //
    // //! 设置显示动画的同时是否显示下面的图标
    // setShowTopIcon : function(bshow) {
    //     this.bShowTopIcon = bshow;
    // },
    //
    // //! 开始转
    // run: function (speed, beginanitime, runtime, delaybegintime) {
    //     if (this.bRun)
    //         return;
    //
    //     this.bRun = true;
    //     this.RunTime = runtime;
    //     this.BeginAniTime = beginanitime + delaybegintime;
    //     this.speed = speed;
    //     this.bStoping = false;
    //
    //     if (cc.game.bhide == undefined || !cc.game.bhide) {
    //         var inum = this.lsticonnode.length;
    //
    //         for (var ii = 0; ii < inum; ++ii) {
    //             var spr = this.lsticonnode[ii].spr;
    //             var pos = cc.p(spr.getPositionX(), spr.getPositionY() + 30);
    //             var dt = cc.delayTime(delaybegintime);
    //             var mt = cc.moveTo(beginanitime, pos);
    //             var st = cc.sequence(dt, mt);
    //             spr.runAction(st);
    //         }
    //     }
    //
    //     this.curpos += 30;
    // },
    //
    // //! 停止
    // stop_index: function (eindex) {
    //     this.StopIndex = eindex;
    //     this.bStoping = true;
    // },
    //
    // //! 设置状态 0普通 1结果
    // setState : function (state) {
    //     if(state == 0) {
    //         // if(this.layWheel != undefined) {
    //         //     this.layWheel.setColor(cc.color(255, 255, 255));
    //         // }
    //
    //         var ccolor = cc.color(255, 255, 255);
    //
    //         for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
    //             this.lsticonnode[ii].spr.setColor(ccolor);
    //             this.lsticonnode[ii].spr.setOpacity(255);
    //         }
    //
    //         this.clearTop();
    //     }
    //     else if(state == 1){
    //         // if(this.layWheel != undefined) {
    //         //     this.layWheel.setColor(cc.color(128, 128, 128));
    //         // }
    //
    //         var r = 64;
    //         var g = 64;
    //         var b = 64;
    //         var a = 255;
    //
    //         if(this.ResultR != undefined)
    //             r = this.ResultR;
    //
    //         if(this.ResultG != undefined)
    //             g = this.ResultG;
    //
    //         if(this.ResultB != undefined)
    //             b = this.ResultB;
    //
    //         if(this.ResultA != undefined)
    //             a = this.ResultA;
    //
    //         var ccolor = cc.color(r, g, b);
    //
    //         for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
    //             this.lsticonnode[ii].spr.setColor(ccolor);
    //         }
    //
    //         for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
    //             this.lsticonnode[ii].spr.setOpacity(a);
    //         }
    //     }
    // },
    //
    // // //! 清除所有显示结果的块
    // // clearTop : function () {
    // //     return ;
    // //
    // //     for(var ii = 0; ii < this.lsttopani.length; ++ii) {
    // //         var ani = this.lsttopani[ii];
    // //         ani.node.stopAllActions();
    // //         ani.node.getParent().removeChild(ani.node);
    // //     }
    // //
    // //     this.lsttopani = [];
    // //
    // //     for(var ii = 0; ii < this.lsttopnode.length; ++ii) {
    // //         this.lsttopnode[ii].setVisible(false);
    // //         this.lsticonnode[ii].spr.setVisible(true);
    // //     }
    // // },
    //
    // //! 显示某个结果的块 正中是0 上面是正数 下面是负数
    // showTop : function (index) {
    //     if(this.layTopWheel == undefined)
    //         return ;
    //
    //     var ii = Math.floor(this.lsttopnode.length / 2) + index;
    //
    //     this.lsticonnode[ii].spr.setVisible(false);
    //
    //     var tspr = this.lsttopnode[ii];
    //
    //     var idata = this.lsticonnode[ii].idata;
    //     var icon = this.lsticon[idata];
    //
    //     if (icon != undefined && icon != 0) {
    //         var frame = cc.spriteFrameCache.getSpriteFrame(icon);
    //
    //         if(!this.bShowTopIcon) {
    //             frame = cc.spriteFrameCache.getSpriteFrame("empty.png");
    //         }
    //
    //         tspr.setSpriteFrame(frame);
    //         // tspr.setBlendFunc(gl.ONE, gl.ONE);
    //         // tspr.setOpacity(128);
    //
    //         if(this.lsticonani != undefined) {
    //             var aniname = this.lsticonani[idata];
    //
    //             if(aniname != undefined && aniname != 0) {
    //                 var iconani = ccs.load(aniname);
    //
    //                 tspr.addChild(iconani.node, 1);
    //                 var fsize = frame.getOriginalSizeInPixels();
    //                 iconani.node.setPosition(fsize.width / 2, fsize.height / 2);
    //                 iconani.node.runAction(iconani.action);
    //                 iconani.action.gotoFrameAndPlay(0, iconani.action.getDuration(), true);
    //
    //                 this.lsttopani.push(iconani);
    //             }
    //         }
    //     }
    //
    //     tspr.setVisible(true);
    // },
    //
    // //! 显示上层的icon
    // showTopIcon : function (index) {
    //     if(this.layTopWheel == undefined)
    //         return ;
    //
    //     var ii = Math.floor(this.lsttopnode.length / 2) + index;
    //
    //     this.lsticonnode[ii].spr.setVisible(false);
    //
    //     var tspr = this.lsttopnode[ii];
    //
    //     if(tspr.isVisible())
    //         return ;
    //
    //     var idata = this.lsticonnode[ii].idata;
    //     var icon = this.lsticon[idata];
    //
    //     if (icon != undefined && icon != 0) {
    //         var frame = cc.spriteFrameCache.getSpriteFrame(icon);
    //         tspr.setSpriteFrame(frame);
    //     }
    //
    //     tspr.setVisible(true);
    // },
    //
    // //! 取一个上面显示的节点
    // getTopSprite : function(index) {
    //     if(this.layTopWheel == undefined)
    //         return undefined;
    //
    //     var ii = Math.floor(this.lsttopnode.length / 2) + index;
    //     return this.lsttopnode[ii];
    // },
    //
    // //! 改变某个图标的资源
    // chgIcon : function (index, icon, bicon, iconani) {
    //     if(index < 0)
    //         return ;
    //
    //     if(this.lsticon != undefined && index < this.lsticon.length) {
    //         this.lsticon[index] = icon;
    //     }
    //
    //     if(this.lstbicon != undefined && index < this.lstbicon.length) {
    //         this.lstbicon[index] = bicon;
    //     }
    //
    //     if(this.lsticonani != undefined && index < this.lsticonani.length) {
    //         this.lsticonani[index] = iconani;
    //     }
    // },
    //
    // //! 亮光相关
    // //! 设置亮光动画
    // setLightAni : function (aniname, topname, soundname) {
    //     this.lightaniname = aniname;
    //     this.lighttopname = topname;
    //     this.lightsoundname = soundname;
    // },
    //
    // //! 设置是否显示亮光
    // showLightAni : function (bshow) {
    //     if(this.lightaniname == undefined && this.lighttopname == undefined)
    //         return ;
    //
    //     //! 停止的时候不闪光
    //     if(!this.bRun && bshow)
    //         return ;
    //
    //     if(bshow) {
    //         if(this.LightAni == undefined && this.lightaniname != undefined) {
    //             this.LightAni = ccs.load(this.lightaniname);
    //
    //             this.layWheel.addChild(this.LightAni.node, 0);
    //
    //             this.LightAni.node.runAction(this.LightAni.action);
    //             this.LightAni.action.gotoFrameAndPlay(0, this.LightAni.action.getDuration(), true);
    //         }
    //
    //         if(this.LightTop == undefined && this.lighttopname != undefined) {
    //             this.LightTop = ccs.load(this.lighttopname);
    //
    //             this.layTopWheel.addChild(this.LightTop.node, 2);
    //
    //             this.LightTop.node.runAction(this.LightTop.action);
    //             this.LightTop.action.gotoFrameAndPlay(0, this.LightTop.action.getDuration(), true);
    //         }
    //
    //         if(this.lightsoundname != undefined)
    //             cc.audioEngine.playEffect(this.lightsoundname, false);
    //     }
    //     else {
    //         if(this.LightAni != undefined) {
    //             this.LightAni.node.stopAllActions();
    //             this.layWheel.removeChild(this.LightAni.node);
    //
    //             this.LightAni = undefined;
    //         }
    //
    //         if(this.LightTop != undefined) {
    //             this.LightTop.node.stopAllActions();
    //             this.layTopWheel.removeChild(this.LightTop.node);
    //
    //             this.LightTop = undefined;
    //         }
    //     }
    // },
    //
    // //! 判断是否有某个符号
    // hasIcon : function (icon, bindex, eindex) {
    //     if(bindex > eindex) {
    //         var tmp = bindex;
    //         bindex = eindex;
    //         eindex = bindex;
    //     }
    //
    //     var bi = Math.floor(this.lsttopnode.length / 2) + bindex;
    //     var ei = Math.floor(this.lsttopnode.length / 2) + eindex;
    //
    //     for(var ii = bi; ii <= ei; ++ii) {
    //         if(this.lsticonnode[ii].idata == icon)
    //             return true;
    //     }
    //
    //     return false;
    // }
});
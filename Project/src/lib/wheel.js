/**
 * Created by ssscomic on 2016/5/23.
 */
var Wheel = cc.Node.extend({
    ctor: function (laynode, lsticon, lstbicon, iconw, iconh, iconsp, lstwheeldata, bindex, laytop, lsticonani, spy, glayer) {
        var lsize = laynode.getLayoutSize();

        this.spy = 0;

        if (spy != undefined)
            this.spy = spy;

        //! 计算需要几个icon
        var inum = Math.floor(lsize.height / iconsp) + 4;

        if (inum % 2 == 0)
            ++inum;

        //! 放到初始位置
        this.lsticonnode = [];
        this.lsttopnode = [];
        this.lsttopani = [];

        var sbx = lsize.width / 2;
        var sby = Math.floor((lsize.height / 2) - Math.floor(inum / 2) * iconsp);
        this.sby = sby;
        this.curpos = sby;
        this.cby = lsize.height / 2;

        for (var ii = 0; ii < inum; ++ii) {
            var inode = {};

            var spr = new cc.Sprite();
            laynode.addChild(spr, 1);
            spr.setPosition(sbx, sby + this.spy);
            //spr.setBlendFunc(gl.ONE, gl.ONE);

            inode.spr = spr;
            inode.idata = 0;
            inode.bbig = false;
            inode.spr.setCascadeColorEnabled(true);
            inode.spr.setCascadeOpacityEnabled(true);

            inode.append = undefined;

            this.lsticonnode.push(inode);

            if (laytop != undefined) {
                var tspr = new cc.Sprite();
                laytop.addChild(tspr, 1);
                tspr.setPosition(sbx, sby + this.spy);
                tspr.setVisible(false);
                //tspr.setBlendFunc(gl.ONE, gl.ONE);

                this.lsttopnode.push(tspr);
            }

            sby += iconsp;
        }

        this.lsize = lsize;
        this.iconw = iconw;
        this.iconh = iconh;
        this.iconsp = iconsp;
        this.lsticon = lsticon;
        this.lstbicon = lstbicon;
        this.lsticonani = lsticonani;
        this.GameLayer = glayer;
        this.lstricon = undefined;
        // this.lstwheeldata = lstwheeldata;
        //
        // //! 设置初始图
        // this.curdataindex = bindex;
        //
        // while(this.curdataindex < 0)
        //     this.curdataindex += this.lstwheeldata.length;
        //
        // while(this.curdataindex >= this.lstwheeldata.length)
        //     this.curdataindex -= this.lstwheeldata.length;
        //
        // var cindex = this.curdataindex - Math.floor(inum / 2);
        //
        // while(cindex < 0)
        //     cindex += this.lstwheeldata.length;
        //
        // while(cindex >= this.lstwheeldata.length)
        //     cindex -= this.lstwheeldata.length;
        //
        // for(var ii = 0; ii < inum; ++ii) {
        //     var idata = this.lstwheeldata[cindex];
        //     var icon = this.lsticon[idata];
        //
        //     this.lsticonnode[ii].idata = idata;
        //
        //     if(icon == undefined || icon == 0) {
        //         this.lsticonnode[ii].spr.setVisible(false);
        //     }
        //     else {
        //         var frame = cc.spriteFrameCache.getSpriteFrame(icon);
        //         this.lsticonnode[ii].spr.setSpriteFrame(frame);
        //         this.lsticonnode[ii].spr.setVisible(true);
        //     }
        //
        //     ++cindex;
        //
        //     if(cindex >= this.lstwheeldata.length)
        //         cindex = 0;
        // }

        if (lstwheeldata != undefined)
            this.setWheelData(lstwheeldata, bindex, false);

        this.bRun = false;
        this.RunTime = 0;
        this.BeginAniTime = 0;
        this.speed = 0;
        this.StopIndex = -1;
        this.StopData = undefined;
        this.StopDataIndex = -1;
        this.bStoping = false;
        this.layWheel = laynode;
        this.layTopWheel = laytop;

        this.bShowTopIcon = true;
        this.bNextRun = true;
        this.bOldWinWheel = false;

        this.SpringBackDis = 0;
        this.SpringBackScale = 0;

        if(this.layTopWheel != undefined && this.GameLayer != undefined) {
            this.layTopWheel.addTouchEventListener(this.onTouchIcon, this);
        }

        //this.layWheel.setColor(cc.color(128,128,128));

        //this.speed = 1000 + Math.random() * 600;

        //this.scheduleUpdate();
    },

    update: function (dt) {
        if (!this.bRun)
            return;

        if (this.BeginAniTime > 0) {
            this.BeginAniTime -= dt;

            if (this.BeginAniTime > 0)
                return;

            this.BeginAniTime = 0;

            if (this.RunSoundName != undefined)
                cc.audioEngine.playEffect(this.RunSoundName, false);

            //! 所有都刷成模糊图片
            if (this.lstbicon != undefined) {
                for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
                    if (this.lsticonnode[ii].bbig) {
                        if (this.lsticonnode[ii].bigspr != undefined) {
                            var inode = this.lsticonnode[ii];

                            var bdata = this.lstBigIconData['icon' + inode.bigicon];
                            var frame = cc.spriteFrameCache.getSpriteFrame(bdata.bicon);
                            inode.bigspr.setSpriteFrame(frame);
                        }
                    }
                    else {
                        var spr = this.lsticonnode[ii].spr;
                        var idata = this.lsticonnode[ii].idata;
                        var icon = this.lstbicon[idata];

                        if (icon != undefined && icon != 0) {
                            var frame = cc.spriteFrameCache.getSpriteFrame(icon);

                            if (frame)
                                spr.setSpriteFrame(frame);

                            this.refreshIconColor(idata, spr);
                            // spr.setBlendFunc(gl.ONE, gl.ONE);
                            // spr.setOpacity(128);
                        }
                    }
                }
            }

            //this.showLightAni(true);
        }

        if (this.RunTime > 0) {
            this.RunTime -= dt;
        }

        this.curpos -= this.speed * dt;
        var ny = Math.floor(this.curpos);

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            this.lsticonnode[ii].spr.setPositionY(ny + this.spy);
            this.fixAlpha(this.lsticonnode[ii].spr);

            ny += this.iconsp;
        }

        //! 最下方的节点是否消失了
        while (this.lsticonnode[0].spr.getPositionY() <= this.sby - this.iconsp) {
            // var spr = this.lsticonspr[0];
            // var espr = this.lsticonspr[this.lsticonspr.length - 1];

            var bnode = this.lsticonnode[0];
            var enode = this.lsticonnode[this.lsticonnode.length - 1];
            var spr = bnode.spr;
            var espr = enode.spr;

            // var idata = this.getNewData();
            // bnode.idata = idata;

            var ndata = this.getNewData();
            var idata = ndata.idata;
            bnode.idata = ndata.idata;

            for (var ii = 0; ii < this.lsticonnode.length - 1; ++ii) {
                this.lsticonnode[ii] = this.lsticonnode[ii + 1];
            }

            this.lsticonnode[this.lsticonnode.length - 1] = bnode;

            var icon;

            if (this.lstbicon == undefined)
                icon = this.lsticon[idata];
            else
                icon = this.lstbicon[idata];

            spr.setPositionY(espr.getPositionY() + this.iconsp);

            if (icon == undefined || icon == 0) {
                spr.setVisible(false);
            }
            else {
                var frame = cc.spriteFrameCache.getSpriteFrame(icon);

                if (frame)
                    spr.setSpriteFrame(frame);

                spr.setVisible(true);
                this.refreshIconColor(idata, spr);

                // spr.setBlendFunc(gl.ONE, gl.ONE);
                // spr.setOpacity(128);

                if (bnode.append != undefined) {
                    spr.removeChild(bnode.append);
                    bnode.append = undefined;
                }

                if (ndata.index >= 0) {
                    if (this.lsticonappend != undefined && ndata.index < this.lsticonappend.length && this.lsticonappend[ndata.index] != undefined) {
                        if (this.lsticonappend[ndata.index].getParent() == null) {
                            bnode.append = this.lsticonappend[ndata.index];
                            spr.addChild(bnode.append);

                            var fsize = frame.getOriginalSizeInPixels();
                            bnode.append.setPosition(fsize.width / 2, fsize.height / 2);
                        } else {
                            cc.log("is error");
                        }
                    }
                }
                else {
                    var si = -ndata.index - 1;

                    if (this.lststopappend != undefined && si < this.lststopappend.length && this.lststopappend[si] != undefined) {
                        bnode.append = this.lststopappend[si];
                        spr.addChild(bnode.append);

                        var fsize = frame.getOriginalSizeInPixels();
                        bnode.append.setPosition(fsize.width / 2, fsize.height / 2);
                    }
                }
            }

            bnode.bbig = false;
            if (bnode.bigspr != undefined) {
                bnode.bigspr.getParent().removeChild(bnode.bigspr);
                bnode.bigspr = undefined;
                bnode.bigicon = 0;
            }

            this.curpos += this.iconsp;

            if (this.RunTime <= 0 && this.StopIndex >= 0) {
                if (this.curdataindex == this.StopIndex) {
                    this.stopWheel(true);
                    break;
                }

                // if (this.StopDataIndex >= this.StopData.length) {
                //     this.stopWheel(true);
                //     break;
                // }
            }

            if (this.StepSoundName != undefined) {
                cc.audioEngine.playEffect(this.StepSoundName, false);
            }
        }
    },

    // getNewData : function() {
    //     if(this.lstwheeldata == undefined)
    //         return 0;
    //
    //     var anum = Math.floor(this.lsticonnode.length / 2) + 1;
    //     var nindex = this.curdataindex + anum;
    //
    //     while(nindex >= this.lstwheeldata.length)
    //         nindex -= this.lstwheeldata.length;
    //
    //     ++this.curdataindex;
    //
    //     while(this.curdataindex >= this.lstwheeldata.length)
    //         this.curdataindex -= this.lstwheeldata.length;
    //
    //     //! 如果可以停止，则尝试快速停止
    //     if(this.RunTime <= 0 && this.StopIndex >= 0) {
    //         var bfind = false;
    //
    //         for(var ii = 0; ii <= anum; ++ii) {
    //             var sindex = this.curdataindex + ii;
    //
    //             while(sindex < 0 )
    //                 sindex += this.lstwheeldata.length;
    //
    //             while(sindex >= this.lstwheeldata.length)
    //                 sindex -= this.lstwheeldata.length;
    //
    //             if(sindex == this.StopIndex) {
    //                 bfind = true;
    //                 break;
    //             }
    //         }
    //
    //         if(!bfind) {
    //             if((this.lstwheeldata[nindex] == 0 && this.lstwheeldata[this.StopIndex] == 0) || (this.lstwheeldata[nindex] != 0 && this.lstwheeldata[this.StopIndex] != 0)) {
    //                 nindex = this.StopIndex;
    //                 this.curdataindex = nindex - anum + 1;
    //
    //                 while(this.curdataindex < 0 )
    //                     this.curdataindex += this.lstwheeldata.length;
    //
    //                 while(this.curdataindex >= this.lstwheeldata.length)
    //                     this.curdataindex -= this.lstwheeldata.length;
    //             }
    //             else {
    //                 nindex = this.StopIndex - 1;
    //
    //                 while(nindex < 0 )
    //                     nindex += this.lstwheeldata.length;
    //
    //                 while(nindex >= this.lstwheeldata.length)
    //                     nindex -= this.lstwheeldata.length;
    //
    //                 this.curdataindex = nindex - anum + 1;
    //
    //                 while(this.curdataindex < 0 )
    //                     this.curdataindex += this.lstwheeldata.length;
    //
    //                 while(this.curdataindex >= this.lstwheeldata.length)
    //                     this.curdataindex -= this.lstwheeldata.length;
    //             }
    //         }
    //     }
    //
    //     return this.lstwheeldata[nindex];
    // },

    getNewData: function () {
        if (this.lstwheeldata == undefined)
            return 0;

        var anum = Math.floor(this.lsticonnode.length / 2) + 1;
        var nindex = this.curdataindex + anum;

        while (nindex >= this.lstwheeldata.length)
            nindex -= this.lstwheeldata.length;

        ++this.curdataindex;

        while (this.curdataindex >= this.lstwheeldata.length)
            this.curdataindex -= this.lstwheeldata.length;

        //! 如果可以停止，则尝试快速停止
        if (this.RunTime <= 0) {
            if (this.StopDataIndex >= 0) {
                if (this.StopDataIndex < this.StopData.length) {
                    ++this.StopDataIndex;

                    if (this.StopDataIndex >= this.StopData.length) {
                        this.StopIndex = this.curdataindex + anum - (Math.floor(this.StopData.length / 2) + 1);

                        while (this.StopIndex >= this.lstwheeldata.length)
                            this.StopIndex -= this.lstwheeldata.length;
                    }

                    var ndata = {idata: this.StopData[this.StopDataIndex - 1], index: -this.StopDataIndex};
                    return ndata;

                    //return this.StopData[this.StopDataIndex - 1];
                }
            }
            else if (this.StopIndex >= 0) {
                var bfind = false;

                for (var ii = 0; ii <= anum + 1; ++ii) {
                    var sindex = this.curdataindex + ii;

                    while (sindex < 0)
                        sindex += this.lstwheeldata.length;

                    while (sindex >= this.lstwheeldata.length)
                        sindex -= this.lstwheeldata.length;

                    if (sindex == this.StopIndex) {
                        bfind = true;
                        break;
                    }
                }

                if (!bfind) {
                    if ((this.lstwheeldata[nindex] == 0 && this.lstwheeldata[this.StopIndex] == 0) || (this.lstwheeldata[nindex] != 0 && this.lstwheeldata[this.StopIndex] != 0)) {
                        nindex = this.StopIndex - 2;

                        while (nindex < 0)
                            nindex += this.lstwheeldata.length;

                        while (nindex >= this.lstwheeldata.length)
                            nindex -= this.lstwheeldata.length;

                        this.curdataindex = nindex - anum + 1;

                        while (this.curdataindex < 0)
                            this.curdataindex += this.lstwheeldata.length;

                        while (this.curdataindex >= this.lstwheeldata.length)
                            this.curdataindex -= this.lstwheeldata.length;
                    }
                    else {
                        nindex = this.StopIndex - 1;

                        while (nindex < 0)
                            nindex += this.lstwheeldata.length;

                        while (nindex >= this.lstwheeldata.length)
                            nindex -= this.lstwheeldata.length;

                        this.curdataindex = nindex - anum + 1;

                        while (this.curdataindex < 0)
                            this.curdataindex += this.lstwheeldata.length;

                        while (this.curdataindex >= this.lstwheeldata.length)
                            this.curdataindex -= this.lstwheeldata.length;
                    }
                }
            }
        }

        var ndata = {idata: this.lstwheeldata[nindex], index: nindex};
        return ndata;
        //return this.lstwheeldata[nindex];
    },

    //! 设置轮子数据
    setWheelData: function (lstwheeldata, bindex, brefresh) {
        this.lstwheeldata = lstwheeldata;

        this.setWheelIndex(bindex, brefresh);
    },

    //! 设置当前轮子的位置
    setWheelIndex: function (bindex, brefresh, data) {
        this.curdataindex = bindex;

        while (this.curdataindex < 0)
            this.curdataindex += this.lstwheeldata.length;

        while (this.curdataindex >= this.lstwheeldata.length)
            this.curdataindex -= this.lstwheeldata.length;

        if (brefresh) {
            this.refreshWheelDisplay(data);
            this.clearBigIcon();
        }
    },

    //! 刷新轮子显示
    refreshWheelDisplay: function (data) {
        var inum = this.lsticonnode.length;

        var cindex = this.curdataindex - Math.floor(inum / 2);

        while (cindex < 0)
            cindex += this.lstwheeldata.length;

        while (cindex >= this.lstwheeldata.length)
            cindex -= this.lstwheeldata.length;

        for (var ii = 0; ii < inum; ++ii) {
            var idata = this.lstwheeldata[cindex];

            if (data != undefined) {
                var dindex = ii - Math.floor((inum - data.length) / 2);

                if (dindex >= 0 && dindex < data.length)
                    idata = data[dindex];
            }

            var icon = this.lsticon[idata];

            this.lsticonnode[ii].idata = idata;

            if (icon == undefined || icon == 0) {
                this.lsticonnode[ii].spr.setVisible(false);
            }
            else {
                var frame = cc.spriteFrameCache.getSpriteFrame(icon);

                if (frame)
                    this.lsticonnode[ii].spr.setSpriteFrame(frame);

                this.lsticonnode[ii].spr.setVisible(true);
                this.refreshIconColor(idata, this.lsticonnode[ii].spr);
                // this.lsticonnode[ii].spr.setBlendFunc(gl.ONE, gl.ONE);
                // this.lsticonnode[ii].spr.setOpacity(128);
            }

            this.fixScale(this.lsticonnode[ii].spr);

            ++cindex;

            if (cindex >= this.lstwheeldata.length)
                cindex = 0;
        }
    },

    stopWheel: function (bplayeff) {
        var ospeed = this.speed;

        this.showLightAni(false);

        if (this.StopSoundName != undefined && bplayeff)
            cc.audioEngine.playEffect(this.StopSoundName, false);

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var spr = this.lsticonnode[ii].spr;
            spr.stopAllActions();
        }

        if (this.StopDataIndex < 0) {
            var snum = Math.floor(this.lsticonnode.length / 2);
            var bindex = this.StopIndex - snum;

            for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
                var sindex = bindex + ii;

                while (sindex < 0)
                    sindex += this.lstwheeldata.length;

                while (sindex >= this.lstwheeldata.length)
                    sindex -= this.lstwheeldata.length;

                this.lsticonnode[ii].idata = this.lstwheeldata[sindex];
            }
        }
        else {
            var inum = this.lsticonnode.length;

            for (var ii = 0; ii < inum; ++ii) {
                var dindex = ii - Math.floor((inum - this.StopData.length) / 2);

                if (dindex >= 0 && dindex < this.StopData.length)
                    this.lsticonnode[ii].idata = this.StopData[dindex];
            }
        }

        this.bRun = false;
        this.RunTime = 0;
        this.BeginAniTime = 0;
        this.speed = 0;
        this.StopIndex = -1;
        this.StopData = undefined;
        this.StopDataIndex = -1;

        this.curpos = this.sby;

        var bc1 = false;
        var bi = -1;
        var ei = -1;

        if (this.iLogicNum != undefined) {
            if (this.C1Num != undefined && this.C1SoundName != undefined)
                bc1 = true;

            bi = Math.floor(this.lsticonnode.length / 2) - Math.floor(this.iLogicNum / 2);
            ei = bi + this.iLogicNum - 1;
        }

        var ny = Math.floor(this.curpos);

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var spr = this.lsticonnode[ii].spr;
            var idata = this.lsticonnode[ii].idata;
            var icon = this.lsticon[idata];

            if (ii >= bi && ii <= ei && !this.hasIgnoreIconPos(ii)) {
                if (bc1 && idata == this.C1Num) {
                    cc.audioEngine.playEffect(this.C1SoundName, false);
                }

                if (this.lstIconSound != undefined) {
                    if (this.lstIconSound['icon' + idata] != undefined) {
                        var node = this.lstIconSound['icon' + idata];

                        if (node.bplay) {
                            if (node.sound)
                                cc.audioEngine.playEffect(node.sound, false);

                            if (node.izoom != undefined) {
                                if (node.looptime != undefined && node.looptime > 0) {
                                    var st1 = cc.scaleTo(node.looptime / 2, node.izoom);
                                    var st2 = cc.scaleTo(node.looptime / 2, 1.0);
                                    var st = cc.sequence(st1, st2);
                                    var ft = cc.repeatForever(st);
                                    spr.runAction(ft);
                                }
                                else {
                                    var st1 = cc.scaleTo(0.2, node.izoom);
                                    var st2 = cc.scaleTo(0.2, 1.0);
                                    var st = cc.sequence(st1, st2);
                                    spr.runAction(st);
                                }
                            }
                        }
                    }
                }
            }

            if (icon != undefined && icon != 0) {
                var frame = cc.spriteFrameCache.getSpriteFrame(icon);

                if (frame)
                    spr.setSpriteFrame(frame);

                spr.setVisible(true);
                this.refreshIconColor(idata, spr);
                // spr.setBlendFunc(gl.ONE, gl.ONE);
                // spr.setOpacity(128);
            }
            else {
                spr.setVisible(false);
            }

            spr.setPositionY(ny + this.spy);
            this.fixAlpha(spr);

            ny += this.iconsp;
        }

        if (this.SpringBackDis > 0) {
            var inum = this.lsticonnode.length;
            var otime = this.SpringBackDis / ospeed;

            for (var ii = 0; ii < inum; ++ii) {
                var spr = this.lsticonnode[ii].spr;
                var pos1 = cc.p(spr.getPositionX(), spr.getPositionY() - this.SpringBackDis);
                var pos2 = cc.p(spr.getPositionX(), spr.getPositionY());
                var dt1 = cc.moveTo(otime, pos1);
                var dt = new cc.EaseBackOut(dt1);
                var mt1 = cc.moveTo(otime * this.SpringBackScale, pos2);
                var mt = new cc.EaseBackOut(mt1);
                var st = cc.sequence(dt, mt);
                spr.runAction(st);
            }
        }

        if (this.stopFunc != undefined) {
            this.stopFunc(this.stopFuncSelf, this.stopFuncIndex);
        }
    },

    setStopFunc: function (func, self, index) {
        this.stopFunc = func;
        this.stopFuncSelf = self;
        this.stopFuncIndex = index;
    },

    //! 设置音效
    setSound: function (runsound, stopsound, c1num, c1sound) {
        this.RunSoundName = runsound;
        this.StopSoundName = stopsound;

        this.C1Num = c1num;
        this.C1SoundName = c1sound;
    },

    setIconSound: function (iconindex, sound, izoom, looptime) {
        if (this.lstIconSound == undefined)
            this.lstIconSound = {};

        if (this.lstIconSound['icon' + iconindex] == undefined)
            this.lstIconSound['icon' + iconindex] = {};

        this.lstIconSound['icon' + iconindex].sound = sound;
        this.lstIconSound['icon' + iconindex].izoom = izoom;
        this.lstIconSound['icon' + iconindex].bplay = true;
        this.lstIconSound['icon' + iconindex].looptime = looptime;
    },

    setPlayIconSound: function (iconindex, bplay) {
        if (this.lstIconSound == undefined)
            return;

        if (this.lstIconSound['icon' + iconindex] == undefined)
            return;

        this.lstIconSound['icon' + iconindex].bplay = bplay;
    },

    setIgnoreIconPos: function (index, bignore) {
        var ci = Math.floor(this.lsttopnode.length / 2) + index;

        if (this.lstIgnorePos == undefined) {
            this.lstIgnorePos = [];
        }

        for (var ii = 0; ii < this.lstIgnorePos.length; ++ii) {
            if (this.lstIgnorePos[ii] == ci) {
                if (!bignore) {
                    this.lstIgnorePos.splice(ii, 1);
                }
                return;
            }
        }

        if (bignore)
            this.lstIgnorePos.push(ci);
    },

    clearIgnoreIconPos: function () {
        this.lstIgnorePos = [];
    },

    hasIgnoreIconPos: function (index) {
        if (this.lstIgnorePos == undefined)
            return false;

        //var ci = Math.floor(this.lsttopnode.length / 2) + index;
        var ci = index;

        for (var ii = 0; ii < this.lstIgnorePos.length; ++ii) {
            if (this.lstIgnorePos[ii] == ci)
                return true;
        }

        return false;
    },

    setStepSound: function (stepsound) {
        this.StepSoundName = stepsound;
    },

    clearIconSoundAni: function (iconindex) {
        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var spr = this.lsticonnode[ii].spr;
            var idata = this.lsticonnode[ii].idata;

            if (idata == iconindex) {
                spr.stopAllActions();
                spr.setScale(1.0);
            }
        }
    },

    //! 设置结果状态的颜色
    setResultColor: function (r, g, b, a) {
        this.ResultR = r;
        this.ResultG = g;
        this.ResultB = b;
        this.ResultA = a;
    },

    //! 设置结果状态的图标
    setResultIcon: function (lstricon) {
        this.lstricon = lstricon;
    },

    //! 清除结果状态的图标
    clearResultIcon: function (lstricon) {
        this.lstricon = undefined;
    },

    //! 设置逻辑数量
    setLogicNum: function (num) {
        this.iLogicNum = num;
    },

    //! 设置显示动画的同时是否显示下面的图标
    setShowTopIcon: function (bshow) {
        if (this.lsticonani == undefined)
            return;

        this.bShowTopIcon = bshow;
    },

    //! 开始转
    run: function (speed, beginanitime, runtime, delaybegintime) {
        if (this.bRun)
            return;

        this.bRun = true;
        this.RunTime = runtime;
        this.BeginAniTime = beginanitime + delaybegintime;
        this.speed = speed;
        this.bStoping = false;

        if (cc.game.bhide == undefined || !cc.game.bhide) {
            var inum = this.lsticonnode.length;

            for (var ii = 0; ii < inum; ++ii) {
                var spr = this.lsticonnode[ii].spr;
                var pos = cc.p(spr.getPositionX(), spr.getPositionY() + 30);
                var dt = cc.delayTime(delaybegintime);
                var mt = cc.moveTo(beginanitime, pos);
                var st = cc.sequence(dt, mt);
                spr.runAction(st);
            }
        }

        this.curpos += 30;
    },

    chgSpeed: function (speed) {
        this.speed = speed;
    },

    //! 停止
    stop_index: function (eindex, data) {
        if (!this.bRun)
            return;

        if (data == undefined) {
            this.StopIndex = eindex;
            this.StopData = undefined;
            this.StopDataIndex = -1;
            this.bStoping = true;
        }
        else {
            this.StopIndex = -1;
            this.StopData = data;
            this.StopDataIndex = 0;
            this.bStoping = true;
        }
    },

    //! 设置状态 0普通 1结果
    setState: function (state) {
        if (state == 0) {
            // if(this.layWheel != undefined) {
            //     this.layWheel.setColor(cc.color(255, 255, 255));
            // }

            if (this.lstricon != undefined) {
                for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
                    var idata = this.lsticonnode[ii].idata;
                    var icon = this.lsticon[idata];

                    if (icon != undefined && icon != 0) {
                        var frame = cc.spriteFrameCache.getSpriteFrame(icon);

                        if (frame)
                            this.lsticonnode[ii].spr.setSpriteFrame(frame);

                        this.refreshIconColor(idata, this.lsticonnode[ii].spr);
                    }
                }
            }
            else {
                var ccolor = cc.color(255, 255, 255);

                for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
                    this.lsticonnode[ii].spr.setColor(ccolor);
                    this.lsticonnode[ii].spr.setOpacity(255);
                    this.fixAlpha(this.lsticonnode[ii].spr);

                    this.refreshIconColor(this.lsticonnode[ii].idata, this.lsticonnode[ii].spr, ccolor);
                }
            }

            this.clearTop();
        }
        else if (state == 1) {
            // if(this.layWheel != undefined) {
            //     this.layWheel.setColor(cc.color(128, 128, 128));
            // }

            if (this.lstricon != undefined) {
                for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
                    var idata = this.lsticonnode[ii].idata;
                    var icon = this.lstricon[idata];

                    if (icon != undefined && icon != 0) {
                        var frame = cc.spriteFrameCache.getSpriteFrame(icon);

                        if (frame)
                            this.lsticonnode[ii].spr.setSpriteFrame(frame);

                        this.refreshIconColor(idata, this.lsticonnode[ii].spr);
                    }
                }
            }
            else {
                var r = 64;
                var g = 64;
                var b = 64;
                var a = 255;

                if (this.ResultR != undefined)
                    r = this.ResultR;

                if (this.ResultG != undefined)
                    g = this.ResultG;

                if (this.ResultB != undefined)
                    b = this.ResultB;

                if (this.ResultA != undefined)
                    a = this.ResultA;

                var ccolor = cc.color(r, g, b);

                for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
                    this.lsticonnode[ii].spr.setColor(ccolor);
                    this.refreshIconColor(this.lsticonnode[ii].idata, this.lsticonnode[ii].spr, ccolor);
                }
            }

            for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
                var alpha = this.getAlpha(this.lsticonnode[ii].spr);

                if (alpha <= 0)
                    this.lsticonnode[ii].spr.setOpacity(0);
                else
                    this.lsticonnode[ii].spr.setOpacity(alpha);
            }
        }
    },

    //! 清除所有显示结果的块
    clearTop: function () {
        for (var ii = 0; ii < this.lsttopani.length; ++ii) {
            var ani = this.lsttopani[ii];
            // ani.node.stopAllActions();
            // ani.node.getParent().removeChild(ani.node);
            CcsResCache.singleton.release(ani);
        }

        this.lsttopani = [];

        for (var ii = 0; ii < this.lsttopnode.length; ++ii) {
            this.lsttopnode[ii].setVisible(false);
            this.lsticonnode[ii].spr.setVisible(true);

            if (this.lsticonnode[ii].bigspr != undefined)
                this.lsticonnode[ii].bigspr.setVisible(true);

            this.lsttopnode[ii].setPosition(this.lsticonnode[ii].spr.getPosition());
        }
    },

    //! 显示某个结果的块 正中是0 上面是正数 下面是负数
    showTop: function (index, bpause) {
        if (this.layTopWheel == undefined)
            return;

        var ii = Math.floor(this.lsttopnode.length / 2) + index;

        this.lsticonnode[ii].spr.setVisible(false);

        var tspr = this.lsttopnode[ii];

        var idata = this.lsticonnode[ii].idata;
        var icon = this.lsticon[idata];

        if (icon != undefined && icon != 0) {
            var inode = this.lsticonnode[ii];

            if (inode.bigspr != undefined) {
                this.showTop_bigicon(index, bpause);
            }
            else if (inode.bbig) {
                ++ii;

                while (ii >= 0 && ii < this.lsticonnode.length) {
                    if (this.lsticonnode[ii].bigspr != undefined) {
                        var ni = ii - Math.floor(this.lsttopnode.length / 2);
                        this.showTop_bigicon(ni, bpause);
                        break;
                    }

                    ++ii;
                }
            }
            else {
                var frame = cc.spriteFrameCache.getSpriteFrame(icon);
                //var fsize = frame.getOriginalSizeInPixels();

                if (!this.bShowTopIcon) {
                    frame = cc.spriteFrameCache.getSpriteFrame("empty.png");
                }

                tspr.setSpriteFrame(frame);
                this.refreshIconColor(idata, tspr);

                // tspr.setBlendFunc(gl.ONE, gl.ONE);
                // tspr.setOpacity(128);

                if (this.lsticonexani != undefined) {
                    var node = this.lsticonexani['icon' + idata];

                    if (node != undefined) {
                        if (node.bplay) {
                            var aniname = node.iconani;
                            var iconani = CcsResCache.singleton.load(aniname);

                            tspr.addChild(iconani.node, 2);
                            var fsize = frame.getOriginalSizeInPixels();
                            iconani.node.setPosition(fsize.width / 2, fsize.height / 2);
                            iconani.node.runAction(iconani.action);
                            iconani.action.gotoFrameAndPlay(0, iconani.action.getDuration(), false);

                            if (res.JungleFG2_mp3)
                                cc.audioEngine.playEffect(res.JungleFG2_mp3, false);
                        }
                    }
                }

                if (this.lsticonani != undefined) {
                    var aniname = this.lsticonani[idata];

                    if (aniname != undefined && aniname != 0) {
                        var iconani = CcsResCache.singleton.load(aniname);

                        tspr.addChild(iconani.node, 1);
                        var fsize = frame.getOriginalSizeInPixels();
                        iconani.node.setPosition(fsize.width / 2, fsize.height / 2);
                        iconani.node.runAction(iconani.action);
                        iconani.action.gotoFrameAndPlay(0, iconani.action.getDuration(), true);

                        if (bpause)
                            iconani.action.pause();

                        this.lsttopani.push(iconani);
                    }
                    else {
                        this.showTopIcon(index);
                    }
                }
                else {
                    this.showTopIcon(index);
                }
            }
        }

        tspr.setVisible(true);
    },

    showTop_bigicon: function (index, bpause) {
        if (this.layTopWheel == undefined)
            return;

        var ii = Math.floor(this.lsttopnode.length / 2) + index;

        var inode = this.lsticonnode[ii];
        inode.bigspr.setVisible(false);

        var tspr = this.lsttopnode[ii];

        if (tspr.isVisible())
            return;

        var bdata = this.lstBigIconData['icon' + inode.bigicon];
        var frame = cc.spriteFrameCache.getSpriteFrame(bdata.icon);

        if (!this.bShowTopIcon) {
            frame = cc.spriteFrameCache.getSpriteFrame("empty.png");
        }

        tspr.setSpriteFrame(frame);

        var tx = inode.spr.getPositionX() + inode.bigspr.getPositionX();
        var ty = inode.spr.getPositionY() + inode.bigspr.getPositionY();
        tspr.setPosition(tx, ty);

        if (bdata.iconani != undefined) {
            var aniname = bdata.iconani;

            if (aniname != undefined && aniname != 0) {
                var iconani = CcsResCache.singleton.load(aniname);

                tspr.addChild(iconani.node, 1);
                //iconani.node.setPosition(inode.bigspr.getPosition());
                iconani.node.setPosition(0, 0);
                iconani.node.runAction(iconani.action);
                iconani.action.gotoFrameAndPlay(0, iconani.action.getDuration(), true);

                if (bpause)
                    iconani.action.pause();

                this.lsttopani.push(iconani);
            }
            else {
                this.showTopIcon(index);
            }
        }
        else {
            this.showTopIcon(index);
        }

        tspr.setVisible(true);
    },

    //! 显示上层的icon
    showTopIcon: function (index) {
        if (this.layTopWheel == undefined)
            return;

        var ii = Math.floor(this.lsttopnode.length / 2) + index;

        this.lsticonnode[ii].spr.setVisible(false);

        var tspr = this.lsttopnode[ii];

        if (tspr.isVisible())
            return;

        var idata = this.lsticonnode[ii].idata;
        var icon = this.lsticon[idata];

        if (icon != undefined && icon != 0) {
            var frame = cc.spriteFrameCache.getSpriteFrame(icon);

            if (frame)
                tspr.setSpriteFrame(frame);

            this.refreshIconColor(idata, tspr);
        }

        tspr.setVisible(true);
    },

    hideIcon: function (index) {
        var ii = Math.floor(this.lsttopnode.length / 2) + index;

        this.lsticonnode[ii].spr.setVisible(false);
    },

    showIcon: function (index) {
        var ii = Math.floor(this.lsttopnode.length / 2) + index;

        this.lsticonnode[ii].spr.setVisible(true);
    },

    //! 取一个上面显示的节点
    getTopSprite: function (index) {
        if (this.layTopWheel == undefined)
            return undefined;

        var ii = Math.floor(this.lsttopnode.length / 2) + index;
        return this.lsttopnode[ii];
    },

    //! 取一个下层轮子的图片
    getIconSprite: function (index) {
        if (this.lsticonnode == undefined)
            return undefined;

        var ii = Math.floor(this.lsticonnode.length / 2) + index;
        return this.lsticonnode[ii].spr;
    },

    //! 改变某个图标的资源
    chgIcon: function (index, icon, bicon, iconani) {
        if (index < 0)
            return;

        if (this.lsticon != undefined && index < this.lsticon.length) {
            this.lsticon[index] = icon;
        }

        if (this.lstbicon != undefined && index < this.lstbicon.length) {
            this.lstbicon[index] = bicon;
        }

        if (this.lsticonani != undefined && index < this.lsticonani.length) {
            this.lsticonani[index] = iconani;
        }
    },

    //! 点击轮子
    onTouchIcon : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.bRun || this.lstwheeldata == undefined)
            return ;

        var lsize = this.layTopWheel.getLayoutSize();

        var pos = sender.getTouchEndPosition();
        var touchPoint = sender.convertToNodeSpace(pos);

        for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            var spr = inode.spr;
            var sx = spr.getPositionX();
            var sy = spr.getPositionY();

            if(touchPoint.x >= sx - lsize.width / 2 && touchPoint.x <= sx + lsize.width / 2 && touchPoint.y >= sy - this.iconh / 2 && touchPoint.y <= sy + this.iconh / 2) {
                var idata = inode.idata;

                var tx = this.layTopWheel.x;
                var ty = this.layTopWheel.y + sy;

                if(this.GameLayer.showIconTips)
                    this.GameLayer.showIconTips(idata, tx, ty, sender, spr);

                return ;
            }
        }
    },

    //! 亮光相关
    //! 设置亮光动画
    setLightAni: function (aniname, topname, soundname) {
        this.lightaniname = aniname;
        this.lighttopname = topname;
        this.lightsoundname = soundname;
    },

    setLightAniEx: function (aniExName, beginName, loopName, endName, soundname) {
        this.lightAniExName = aniExName;
        this.lightAniBeginName = beginName;
        this.lightAniLoopName = loopName;
        this.lightAniEndName = endName;
        this.lightsoundname = soundname;
    },

    //! 设置是否显示亮光
    showLightAni: function (bshow) {
        // if (this.lightaniname == undefined && this.lighttopname == undefined)
        //     return;

        //! 停止的时候不闪光
        if (!this.bRun && bshow)
            return;

        if (bshow) {
            if (this.lightaniname || this.lighttopname) {
                if (this.LightAni == undefined && this.lightaniname != undefined) {
                    this.LightAni = CcsResCache.singleton.load(this.lightaniname);

                    this.layWheel.addChild(this.LightAni.node, 0);

                    this.LightAni.node.runAction(this.LightAni.action);
                    this.LightAni.action.gotoFrameAndPlay(0, this.LightAni.action.getDuration(), true);
                }

                if (this.LightTop == undefined && this.lighttopname != undefined) {
                    this.LightTop = CcsResCache.singleton.load(this.lighttopname);

                    this.layTopWheel.addChild(this.LightTop.node, 2);

                    this.LightTop.node.runAction(this.LightTop.action);
                    this.LightTop.action.gotoFrameAndPlay(0, this.LightTop.action.getDuration(), true);
                }

            }
            else if (this.lightAniExName && this.lightAniBeginName && this.lightAniLoopName && this.lightAniEndName) {
                if (this.LightAni)
                    return;

                this.LightAniEx = CcsResCache.singleton.load(this.lightAniExName);

                this.layWheel.addChild(this.LightAniEx.node, 0);

                this.ctrlAni = findNodeByName(this.LightAniEx.node, "ctrlani");

                if (!this.ctrlAni)
                    return;

                this.ctrlAni.animation.setMovementEventCallFunc(this.animationcallback, this);

                this.ctrlAni.animation.play(this.lightAniBeginName, -1, 0);
            }

            if (this.lightsoundname != undefined)
                cc.audioEngine.playEffect(this.lightsoundname, false);
        }
        else {
            if (this.LightAni != undefined) {
                // this.LightAni.node.stopAllActions();
                // this.layWheel.removeChild(this.LightAni.node);
                CcsResCache.singleton.release(this.LightAni);

                this.LightAni = undefined;
            }

            if (this.LightTop != undefined) {
                // this.LightTop.node.stopAllActions();
                // this.layTopWheel.removeChild(this.LightTop.node);
                CcsResCache.singleton.release(this.LightTop);

                this.LightTop = undefined;
            }

            if (this.LightAniEx) {
                this.ctrlAni.animation.play(this.lightAniEndName, -1, 0);
            }
        }
    },

    animationcallback: function (armature, type, movenentID) {
        if (type === ccs.MovementEventType.complete && movenentID === this.lightAniBeginName) {
            armature.animation.play(this.lightAniLoopName, -1, 1);
            return;
        }

        if (type === ccs.MovementEventType.complete && movenentID === this.lightAniEndName) {
            CcsResCache.singleton.release(this.LightAniEx);
            this.LightAniEx = undefined;
            this.ctrlAni = undefined;
        }
    },

    //! 判断是否有某个符号
    hasIcon: function (icon, bindex, eindex) {
        if (bindex > eindex) {
            var tmp = bindex;
            bindex = eindex;
            eindex = bindex;
        }

        var bi = Math.floor(this.lsttopnode.length / 2) + bindex;
        var ei = Math.floor(this.lsttopnode.length / 2) + eindex;

        for (var ii = bi; ii <= ei; ++ii) {
            if (this.lsticonnode[ii].idata == icon)
                return true;
        }

        return false;
    },

    //! 设置回弹
    setSpringBack: function (dis, backscale) {
        this.SpringBackDis = dis;
        this.SpringBackScale = backscale;
    },

    //! 设置透明区域
    setAlphaArea: function (bdis, edis) {
        if (edis <= bdis)
            return;

        this.iBeginDis = bdis;
        this.iEndDis = edis;

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var spr = this.lsticonnode[ii].spr;
            this.fixAlpha(spr);
        }
    },

    //! 设置图标特殊动画
    setIconExAni: function (iconindex, iconani) {
        if (this.lsticonexani == undefined) {
            this.lsticonexani = {};
        }
        if (this.lsticonexani['icon' + iconindex] == undefined)
            this.lsticonexani['icon' + iconindex] = {};

        this.lsticonexani['icon' + iconindex].iconani = iconani;
        this.lsticonexani['icon' + iconindex].bplay = true;
    },

    //! 设置图标是否播放特殊动画
    setPlayIconExAni: function (iconindex, bplay) {
        if (this.lsticonexani == undefined)
            return;

        if (this.lsticonexani['icon' + iconindex] == undefined)
            return;

        this.lsticonexani['icon' + iconindex].bplay = bplay;
    },

    //! 设置图标的颜色信息
    setIconColorInfo: function (lsticoncolor) {
        this.lsticoncolor = lsticoncolor;
    },

    //! 清除图标的颜色信息
    clearIconColorInfo: function () {
        this.lsticoncolor = undefined;
    },

    //! 刷新图标的颜色
    refreshIconColor: function (idata, spr, ccolor) {
        if (this.lsticoncolor == undefined)
            return;

        if (spr == undefined)
            return;

        // if (idata < 0 || idata >= this.lsticoncolor.length)
        //     return;

        if (idata < 0)
            return;

        if (ccolor == undefined) {

            if (idata >= this.lsticoncolor.length) {
                spr.setColor(this.lsticoncolor[0]);
            }
            else {
                spr.setColor(this.lsticoncolor[idata]);
            }
        }
        else {
            var lcolor = this.lsticoncolor[idata];
            var ncolor = cc.color();

            ncolor.r = lcolor.r + ccolor.r - 255;
            ncolor.g = lcolor.g + ccolor.g - 255;
            ncolor.b = lcolor.b + ccolor.b - 255;

            ncolor.r = (ncolor.r < 0 ? 0 : ncolor.r);
            ncolor.g = (ncolor.g < 0 ? 0 : ncolor.g);
            ncolor.b = (ncolor.b < 0 ? 0 : ncolor.b);

            spr.setColor(ncolor);
        }
    },

    //! 设置图标附加
    setIconAppendList: function (lsticonappend) {
        this.lsticonappend = lsticonappend;

        for (var ii = 0; ii < this.lsticonappend.length; ++ii) {
            if (this.lsticonappend[ii] != undefined)
                this.lsticonappend[ii].retain();
        }
    },

    clearIconAppendList: function () {
        if (this.lsticonappend == undefined)
            return;

        for (var ii = 0; ii < this.lsticonappend.length; ++ii) {
            if (this.lsticonappend[ii] != undefined)
                this.lsticonappend[ii].release();
        }

        this.lsticonappend = undefined;
    },

    setStopAppendList: function (lststopappend) {
        this.lststopappend = lststopappend;

        for (var ii = 0; ii < this.lststopappend.length; ++ii) {
            if (this.lststopappend[ii] != undefined)
                this.lststopappend[ii].retain();
        }
    },

    clearStopAppendList: function () {
        if (this.lststopappend == undefined)
            return;

        for (var ii = 0; ii < this.lststopappend.length; ++ii) {
            if (this.lststopappend[ii] != undefined)
                this.lststopappend[ii].release();
        }

        this.lststopappend = undefined;
    },

    setIconAppend: function (index, node) {
        var ii = Math.floor(this.lsttopnode.length / 2) + index;

        var bnode = this.lsticonnode[ii];
        var spr = bnode.spr;

        if (bnode.append != undefined) {
            spr.removeChild(bnode.append);
            bnode.append = undefined;
        }

        bnode.append = node;
        spr.addChild(bnode.append);

        var idata = bnode.idata;
        var icon = this.lstbicon[idata];

        if (icon != undefined && icon != 0) {
            var frame = cc.spriteFrameCache.getSpriteFrame(icon);
            var fsize = frame.getOriginalSizeInPixels();
            bnode.append.setPosition(fsize.width / 2, fsize.height / 2);
        }
    },

    removeIconAppend: function (index) {
        var ii = Math.floor(this.lsttopnode.length / 2) + index;

        var bnode = this.lsticonnode[ii];
        var spr = bnode.spr;

        if (bnode.append != undefined) {
            spr.removeChild(bnode.append);
            bnode.append = undefined;
        }
    },

    getIconAppend: function (index) {
        var ii = Math.floor(this.lsttopnode.length / 2) + index;

        var bnode = this.lsticonnode[ii];

        if (bnode.append != undefined) {
            return bnode.append;
        }

        return undefined;
    },

    //! 取一个节点的透明度
    getAlpha: function (spr) {
        if (this.iBeginDis == undefined || this.iEndDis == undefined)
            return 255;

        var sy = spr.getPositionY();
        var dis = this.cby - sy;

        if (sy > this.cby)
            dis = sy - this.cby;

        if (dis <= this.iBeginDis)
            return 255;
        else if (dis >= this.iEndDis)
            return 0;

        return Math.floor((this.iEndDis - dis) / (this.iEndDis - this.iBeginDis) * 255);
    },

    //! 修正节点的透明度
    fixAlpha: function (spr) {
        // if(this.iBeginDis == undefined || this.iEndDis == undefined)
        //     return ;

        if (this.iBeginDis != undefined && this.iEndDis != undefined) {
            var alpha = this.getAlpha(spr);
            spr.setOpacity(alpha);
            var ocolor = spr.getColor();
            spr.setColor(ocolor);
        }

        this.fixScale(spr);
    },

    //! 设置改变缩放的值
    setChgScale: function (bx, by, chgx, chgy) {
        this.iBeginScaleX = bx;
        this.iBeginScaleY = by;
        this.iChgScaleX = chgx;
        this.iChgScaleY = chgy;
    },

    fixScale: function (spr) {
        if (this.iBeginScaleX == undefined)
            return;

        var sy = spr.getPositionY();
        var dis = this.cby - sy;

        if (sy > this.cby)
            dis = sy - this.cby;

        spr.setScaleX(this.iBeginScaleX + dis * this.iChgScaleX);
        spr.setScaleY(this.iBeginScaleY + dis * this.iChgScaleY);
    },

    //! 取一个图标对应的真实
    getRealPosition: function (index) {
        var pos = {x: 0, y: 0};

        // if(this.layTopWheel == undefined)
        //     return ;
        //
        // var ii = Math.floor(this.lsttopnode.length / 2) + index;
        // var tspr = this.lsttopnode[ii];
        //
        // var idata = this.lsticonnode[ii].idata;
        // var icon = this.lsticon[idata];
        //
        // if (icon != undefined && icon != 0) {
        //     var frame = cc.spriteFrameCache.getSpriteFrame(icon);
        //     var fsize = frame.getOriginalSizeInPixels();
        //
        //     pos.x = this.layWheel.getPositionX() + tspr.getPositionX() + fsize.width / 2;
        //     pos.y = this.layWheel.getPositionY() + tspr.getPositionY() + fsize.height / 2;
        // }

        var ii = Math.floor(this.lsticonnode.length / 2) + index;

        var inode = this.lsticonnode[ii];

        pos.x = this.layWheel.getPositionX() + inode.spr.getPositionX();
        pos.y = this.layWheel.getPositionY() + inode.spr.getPositionY();

        return pos;
    },

    //! 取某个位置的图标数据
    getIconData: function (index) {
        var ii = Math.floor(this.lsttopnode.length / 2) + index;

        return this.lsticonnode[ii].idata;
    },

    //! 设置某个位置的图标数据（改变显示）
    setIconData: function (index, idata) {
        var ii = Math.floor(this.lsttopnode.length / 2) + index;

        var bnode = this.lsticonnode[ii];
        var spr = bnode.spr;

        bnode.idata = idata;

        var icon = this.lsticon[idata];
        var frame = cc.spriteFrameCache.getSpriteFrame(icon);
        spr.setSpriteFrame(frame);
        this.refreshIconColor(idata, spr);
    },

    //! 通过数据取得index值
    getIndex: function (data) {
        var lst = [];

        for (var ii = 0; ii < this.lstwheeldata.length; ++ii) {
            if (this.lstwheeldata[ii] == data) {
                lst.push(ii);
            }
        }

        if (lst.length <= 0)
            return 0;

        var ri = Math.floor(Math.random() * lst.length);
        return lst[ri];
    },

    getIndexEx: function (lstdata) {
        var lst = [];

        for (var ii = 0; ii < this.lstwheeldata.length; ++ii) {
            if (this.lstwheeldata[ii] == lstdata[0]) {
                var bfind = true;

                for (var jj = 0; jj < lstdata.length; ++jj) {
                    if (this.lstwheeldata[this._fixIndex(ii + jj)] != lstdata[jj]) {
                        bfind = false;
                        break;
                    }
                }

                if (bfind)
                    lst.push(ii);
            }
        }

        if (lst.length <= 0) {
            return this._getIndexEx(lstdata, 1);
        }

        var ri = Math.floor(Math.random() * lst.length);
        return lst[ri];
    },

    _getIndexEx: function (lstdata, num) {
        if (num >= lstdata.length)
            return -1;

        for (var ii = 0; ii < this.lstwheeldata.length; ++ii) {
            if (this.lstwheeldata[ii] == lstdata[0]) {
                var bfind = true;

                for (var jj = 0; jj < lstdata.length - num; ++jj) {
                    if (this.lstwheeldata[this._fixIndex(ii + jj)] != lstdata[jj]) {
                        bfind = false;
                        break;
                    }
                }

                if (bfind) {
                    for (var jj = lstdata.length - num; jj < lstdata.length; ++jj) {
                        this.lstwheeldata[this._fixIndex(ii + jj)] = lstdata[jj];
                    }

                    return ii;
                }
            }
        }

        return this._getIndexEx(lstdata, num + 1);
    },

    _fixIndex: function (index) {
        while (index < 0)
            index += this.lstwheeldata.length;

        while (index >= this.lstwheeldata.length)
            index -= this.lstwheeldata.length;

        return index;
    },

    //! 设置大图标显示数据
    setBigIconData: function (iconindex, icon, bicon, iconani, iconnum) {
        if (this.lstBigIconData == undefined) {
            this.lstBigIconData = {};
        }

        if (this.lstBigIconData['icon' + iconindex] == undefined)
            this.lstBigIconData['icon' + iconindex] = {};

        var bdata = this.lstBigIconData['icon' + iconindex];

        bdata.icon = icon;
        bdata.bicon = bicon;
        bdata.iconani = iconani;
        bdata.iconnum = iconnum;
    },

    chgBigIcon: function (index, iconindex) {
        if (this.lstBigIconData == undefined || this.lstBigIconData['icon' + iconindex] == undefined)
            return;

        var bdata = this.lstBigIconData['icon' + iconindex];
        var ci = Math.floor(this.lsticonnode.length / 2) + index;
        var inode = this.lsticonnode[ci];

        if (inode.bigspr == undefined) {
            inode.bigspr = new cc.Sprite();
            inode.spr.addChild(inode.bigspr);
        }

        inode.bigicon = iconindex;

        var frame = cc.spriteFrameCache.getSpriteFrame('empty.png');

        for (var ii = 0; ii < bdata.iconnum; ++ii) {
            var wi = Math.floor(this.lsticonnode.length / 2) + index - ii;

            if (wi < 0 || wi >= this.lsticonnode.length)
                continue;

            var wnode = this.lsticonnode[wi];
            wnode.spr.setSpriteFrame(frame);
            wnode.bbig = true;
        }

        var bframe = cc.spriteFrameCache.getSpriteFrame(bdata.icon);
        inode.bigspr.setSpriteFrame(bframe);

        var fsize = frame.getOriginalSizeInPixels();
        var bsize = bframe.getOriginalSizeInPixels();
        inode.bigspr.setPosition(fsize.width / 2, fsize.height / 2 - (bsize.height - this.iconh) / 2);
        //inode.bigspr.setPosition(fsize.width / 2,  fsize.height / 2 + -this.iconh);
    },

    clearBigIcon: function () {

        var inode = undefined;

        for (var nIndex = 0; nIndex < this.lsticonnode.length; ++nIndex) {
            inode = this.lsticonnode[nIndex];

            if (inode.bigspr) {
                inode.bigspr.removeFromParent();
                inode.bigspr = undefined;
            }

            inode.bigicon = 0;
            inode.bbig = false;
        }
    }
});
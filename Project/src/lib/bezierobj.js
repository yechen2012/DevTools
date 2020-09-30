/**
 * Created by ssscomic on 2016/10/31.
 */

var BezierObj = cc.Node.extend({
    ctor: function (spr, x, y, speed) {
        this.spr = spr;
        this.cx = x;
        this.cy = y;
        this.speed = speed;

        this.spr.setPosition(x, y);
        this.bx = x;
        this.by = y;
        this.enode = undefined;
        this.movetime = 0;

        this.lstPoint = [];
    },

    addPoint : function (ex, ey, cx1, cy1, cx2, cy2) {
        var node = {};

        node.ex = ex;
        node.ey = ey;
        node.cx1 = cx1;
        node.cy1 = cy1;
        node.cx2 = cx2;
        node.cy2 = cy2;

        //! 评估移动时间
        var bx = this.cx;
        var by = this.cy;

        if(this.lstPoint.length > 0) {
            bx = this.lstPoint[this.lstPoint.length - 1].ex;
            by = this.lstPoint[this.lstPoint.length - 1].ey;
        }

        var dis = Math.sqrt((bx - ex) * (bx - ex) + (by - ey) * (by - ey));
        var bdis1 = Math.sqrt((bx - cx1) * (bx - cx1) + (by - cy1) * (by - cy1));
        var bdis2 = Math.sqrt((cx2 - cx1) * (cx2 - cx1) + (cy2 - cy1) * (cy2 - cy1));
        var bdis3 = Math.sqrt((ex - cx2) * (ex - cx2) + (ey - cy2) * (ey - cy2));

        node.smul = (bdis1 + bdis2 + bdis3) / dis;
        node.alltime = dis / this.speed * node.smul;

        this.lstPoint.push(node);

        if(this.lstPoint.length <= 1) {
            var ca = this.angleat(bx, by, ex, ey);

            if(ca < 0)
                ca += 360;

            if(ca >= 360)
                ca -= 360;

            this.spr.setRotation(ca);

            if(ca > 90 && ca < 270)
                this.spr.setScaleY(-1);
            else
                this.spr.setScaleY(1);
        }
    },

    //! 计算贝塞尔的位置
    bezierat : function (a, b, c, d, t) {
        return Math.pow(1 - t, 3) * a + 3 * t * Math.pow(1 - t, 2) * b + 3 * Math.pow(t, 2) * (1 - t) * c + Math.pow(t, 3) * d;
    },

    //! 计算角度
    angleat : function (px, py, x, y) {
        var sx = x - px;
        var sy = y - py;

        if(sx == 0 && sy == 0)
            return 0;

        var degree = 0;

        if(sy == 0 && sx > 0)
            degree = 90;
        else if(sy == 0 && sx < 0)
            degree = 270;
        else if(sx == 0 && sy > 0)
            degree = 0;
        else if(sx == 0 && sy < 0)
            degree = 180;
        else {
            degree = Math.atan(sx / sy) * 57.29577951;

            if(sx < 0 && sy < 0)
                degree += 180;
            else if(sx > 0 && sy < 0)
                degree += 180;
        }

        degree -= 90;

        if(degree < 0)
            degree += 360;

        if(degree >= 360)
            degree -= 360;

        return degree;
    },

    update : function(dt) {
        var lt = dt;

        while(lt > 0) {
            if(this.enode == undefined) {
                if(this.lstPoint.length <= 0)
                    return ;

                this.enode = this.lstPoint[0];
                this.lstPoint.splice(0, 1);
            }

            this.movetime += lt;

            //! 到达一个点，去下一个点
            if(this.movetime > this.enode.alltime) {
                lt = this.enode.alltime - this.movetime;
                this.cx = this.enode.ex;
                this.cy = this.enode.ey;
                this.spr.setPosition(this.cx, this.cy);

                this.movetime = 0;
                this.bx = this.enode.ex;
                this.by = this.enode.ey;
                this.enode = undefined;
                continue ;
            }

            lt = 0;

            var tx = this.spr.getPositionX();
            var ty = this.spr.getPositionY();

            var ct = this.movetime / this.enode.alltime;

            this.cx = this.bezierat(0, this.enode.cx1 - this.bx, this.enode.cx2 - this.bx, this.enode.ex - this.bx, ct) + this.bx;
            this.cy = this.bezierat(0, this.enode.cy1 - this.by, this.enode.cy2 - this.by, this.enode.ey - this.by, ct) + this.by;
            this.spr.setPosition(this.cx, this.cy);

            var ca = this.angleat(tx, ty, this.cx, this.cy);
            var ta = this.spr.getRotation();

            //! 需要调整角度
            if(Math.abs(ca - ta) > 1) {
                //! 找旋转方向
                // var tta = ta + 180;
                //
                // if(tta > 360)
                //     tta -= 360;
                //
                // if(ca > tta)
                //     ca = ta - 10;
                // else
                //     ca = ta + 10;
                //
                // if(ca < 0)
                //     ca += 360;
                //
                // if(ca >= 360)
                //     ca -= 360;

                var tta = Math.abs(ca - ta);

                if(tta > 180) {
                    if(ta < ca)
                        ca = ta - 1;
                    else
                        ca = ta + 1;
                }
                else {
                    if(ta < ca)
                        ca = ta + 1;
                    else
                        ca = ta - 1;
                }

                if(ca < 0)
                    ca += 360;

                if(ca >= 360)
                    ca -= 360;
            }

            this.spr.setRotation(ca);

            if(ca > 90 && ca < 270)
            {
                this.spr.setScaleY(-1);
            }
            else
            {
                this.spr.setScaleY(1);
            }
        }
    },

    isEnd : function () {
        return this.enode == undefined && this.lstPoint.length <= 0;
    },
});

var ObbObj = cc.Node.extend({
    ctor: function (root, x, y, width, height) {
        this.root = root;
        this.cx = x;
        this.cy = y;
        this.cwidth = width;
        this.cheight = height;

        this.bChg = true;

        this.vinfo = [];
        this.vertex = [];

        this.axis = [ cc.p(0,0), cc.p(0,0) ];
        this.origin = [ 0, 0 ];

        var lstchg = [[-1,-1],[1,-1],[1,1],[-1,1]];

        for(var ii = 0; ii < 4; ++ii) {
            var vinf = cc.p(0, 0);
            vinf.x = this.cx + lstchg[ii][0] * this.cwidth / 2;
            vinf.y = this.cy + lstchg[ii][1] * this.cheight / 2;
            this.vinfo.push(vinf);

            var vert = cc.p(0, 0);
            this.vertex.push(vert);
        }
    },

    update : function () {
        this.bChg = true;
    },

    //! 更新数据
    _refresh : function () {
        if(!this.bChg)
            return ;

        if(this.root == undefined)
            return ;

        for(var ii = 0; ii < 4; ++ii) {
            this.vertex[ii] = this.root.convertToWorldSpaceAR(this.vinfo[ii]);
        }

        this.axis[0] = cc.pSub(this.vertex[1], this.vertex[0]);
        this.axis[0] = cc.pMult(this.axis[0], 1 / cc.pLengthSQ(this.axis[0]));

        this.axis[1] = cc.pSub(this.vertex[3], this.vertex[0]);
        this.axis[1] = cc.pMult(this.axis[1], 1 / cc.pLengthSQ(this.axis[1]));

        this.origin[0] = cc.pDot(this.vertex[0], this.axis[0]);
        this.origin[1] = cc.pDot(this.vertex[0], this.axis[1]);

        this.bChg = false;
    },

    //! 判断是否重叠
    isOverlap : function (other) {
        this._refresh();
        other._refresh();

        for(var ii = 0; ii < 2; ++ii) {
            var boverlap = false;
            var bless = false;
            var bmore = false;

            for(var jj = 0; jj < 4; ++jj) {
                var tt = cc.pDot(other.vertex[jj], this.axis[ii]);

                if(tt >= this.origin[ii] && tt <= this.origin[ii] + 1) {
                    boverlap = true;
                    break;
                }
                else if(tt > this.origin[ii] + 1)
                    bmore = true;
                else if(tt < this.origin[ii])
                    bless = true;

                if(bmore && bless) {
                    boverlap = true;
                    break;
                }
            }

            if(!boverlap)
                return false;
        }

        return true;
    },

    //! 判断是否碰撞
    isCollision :  function (other) {
        return this.isOverlap(other) && other.isOverlap(this);
    },

    //! 判断是否是同样的
    isSame : function (x, y, width, height) {
        return this.cx == x && this.cy == y && this.cwidth == width && this.height == height;
    },

    //! 获取距离远点最远的半径
    getRadius : function () {
        var maxr = 0;

        for(var ii = 0; ii < 4; ++ii) {
            var radius = cc.pLength(this.vinfo[ii]);

            if(radius > maxr)
                maxr = radius;
        }

        return maxr;
    },

    //! 绘制碰撞区域
    drawArea : function (drawroot) {
        drawroot.drawSegment(this.vertex[0], this.vertex[1]);
        drawroot.drawSegment(this.vertex[1], this.vertex[2]);
        drawroot.drawSegment(this.vertex[2], this.vertex[3]);
        drawroot.drawSegment(this.vertex[3], this.vertex[0]);
    },
});

//! 碰撞集合
var Obbs = cc.Node.extend({
    ctor: function (root) {
        this.root = root;
        this.lstobb = [];
        this.radius = 0;
        this.radiussq = 0;
    },

    update : function () {
        for(var ii = 0; ii < this.lstobb.length; ++ii) {
            this.lstobb[ii].update();
        }
    },

    //! 添加一个碰撞体
    addObb : function (x, y, width, height) {
        //! 排除重复
        for(var ii = 0; ii < this.lstobb.length; ++ii) {
            if(this.lstobb[ii].isSame(x, y, width, height))
                return ;
        }

        var obb = new ObbObj(this.root, x, y, width, height);

        var obbr = obb.getRadius();

        if(obbr > this.radius) {
            this.radius = obbr;
            this.radiussq = this.radius * this.radius;
        }

        this.lstobb.push(obb);
    },

    //! 减少一个碰撞体
    removeObb : function (x, y, width, height) {
        for(var ii = 0; ii < this.lstobb.length; ++ii) {
            if(this.lstobb[ii].isSame(x, y, width, height)) {
                this.lstobb.splice(ii, 1);
                break;;
            }
        }

        this.radius = 0;

        for(var ii = 0; ii < this.lstobb.length; ++ii) {
            var obbr = this.lstobb[ii].getRadius();

            if(obbr > this.radius)
                this.radius = obbr;
        }

        this.radiussq = this.radius * this.radius;
    },

    //! 判断是否碰撞
    isCollision :  function (other) {
        if(this.radius <= 0 || other.radius <= 0)
            return false;

        var point1 = this.root.getPosition();
        var point2 = other.root.getPosition();

        if(cc.pDistanceSQ(point1, point2) >= this.radiussq + other.radiussq + 2 * this.radius * other.radius)
            return false;

        for(var ii = 0; ii < this.lstobb.length; ++ii) {
            var obb = this.lstobb[ii];

            for(var jj = 0; jj < other.lstobb.length; ++jj) {
                var oobb = other.lstobb[jj];

                if(obb.isCollision(oobb))
                    return true;
            }
        }

        return false;
    },

    //! 绘制碰撞区域
    drawArea : function (drawroot) {
        for(var ii = 0; ii < this.lstobb.length; ++ii) {
            var obb = this.lstobb[ii];
            obb._refresh();
            obb.drawArea(drawroot);
        }
    },
});
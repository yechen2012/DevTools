var ElementalPoint = cc.Class.extend({
    ctor: function(col, row) {

        this._name = "ElementalPoint";

        this.x = col;
        this.y = row;
    },

    clone: function() {
        return new ElementalPoint(this.x, this.y);
    },

    isEqual: function(point) {
        return this.x === point.x && this.y === point.y;
    },

    /*
    * 判断该点是否比某个点大（右下为大）
    * */
    isMax: function(point) {
        return this.x > point.x && this.y > point.y;
    },

    isXMax: function(point) {
        return this.x > point.x;
    },

    isXEqual: function(point) {
        return this.x === point.x;
    },

    isYMax: function(point) {
        return this.y > point.y;
    },

    isYEqual: function(point) {
        return this.y === point.y;
    },

    add: function(point) {
        return new ElementalPoint(this.x + point.x, this.y + point.y);
    },

    sub: function(point) {
        return newElementalPoint(this.x - point.x, this.y - point.y);
    },

    /*
    * 依赖X值进行排序，由小到大
    * */
    sortByX: function(v1, v2) {
        var ret = 0;
        if (v1.x < v2.x) {
            ret =  -1;
        }
        else if (v1.x > v2.x) {
            ret = 1;
        }

        return ret;
    },

    /*
    * 依赖Y值进行排序，由小到大
    * */
    sortByY: function(v1, v2) {
        var ret = 0;
        if (v1.y < v2.y) {
            ret =  -1;
        }
        else if (v1.y > v2.y) {
            ret = 1;
        }

        return ret;
    }
});
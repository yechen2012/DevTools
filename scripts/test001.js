var strResult = "";

function parseJson(obj, inKey) {
    var retStr = "";
    if (obj) {
        var value = undefined;
        for (var key in obj) {
            value = obj[key];
            if (value instanceof Object) {
                retStr += key + "_" + parseJson(value, key);
            }
            else {
                retStr += key + "=" + value;
            }
        }
    }
}
/**
 * 批量修改某文件夹下的所有文件的名字，用于有序的帧动画名字修改
 */

var fs = require("fs");
var path = require("path");
var child_process = require('child_process');

var index = "01";

var SOURCE_PATH = "D:\\Workspace\\Resource\\pachislot_c3\\res\\忍者\\icon-280x280";
var PUBLISH_PATH = SOURCE_PATH;

var FILENAME = "pachislot_icon_";
// var FILENAME = "pachislot_icon" + index + "_";

var count = 0;

var rename = function(srcDir) {
    var files = fs.readdirSync(srcDir);
    files.forEach(function(item, index){

        var newName = createName();
        console.log(newName);

        fs.rename(srcDir + "\\" + item, srcDir  + "\\" + newName, function(err) {
            if (err) {
                console.log("Failed");
            }
            else {
                console.log("Success!");
            }
        });

        ++count;

    });
}

var createName = function() {
    return FILENAME + num2Str(count, 2) + ".png";
}

var num2Str = function(num, len) {
    var str = num.toString();
    while(str.length < len) {
        str = "0" + str;
    }

    return str;
}

var start = function() {
    rename(SOURCE_PATH);

    // for (var i = 3; i < 4; ++i) {
    //     index = i;
    //
    //     count = 0;
    //     var path = SOURCE_PATH + "\\" + "steampunk_runani" + num2Str(index, 2);
    //     FILENAME = "steampunk_runani" + num2Str(index, 2) + "_";
    //
    //     rename(path);
    // }
}

start();
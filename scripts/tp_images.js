/**
 * 使用TexturePacker打包文件夹下的图片，若有子文件夹则分文件夹打包
 */

var fs = require("fs");
var path = require("path");
var child_process = require('child_process');

var SOURCE_PATH = "H:\\files\\steampunk_蒸汽朋克\\res\\20200930\\icon缩图";
var TARGET_PATH = TARGET_PATH;

function tpFile(rootPath, folderName) {
    var folderPath = rootPath + "\\" + folderName;
    var plistName = folderPath + ".plist";
    var pngName = folderPath + ".png";
    var cli = "TexturePacker " + folderPath + " --data " + plistName + " --sheet " + pngName + " --allow-free-size --trim --max-size 2048 --enable-rotation";//"–max-width 4096 –max-height 4096";
    // console.log(cli);
    child_process.exec(cli, function (err, stdout, stderr) {
        if (err) {
            // console.log(err);
            console.log("TP打包报错", plistName, pngName);
            return;
        } else {
            console.log(pngName + "   TP打包成功");
        }
    })
}

function start(rootPath) {
    var files = fs.readdirSync(rootPath);
    if (files) {
        files.forEach(function(item, index) {
            tpFile(rootPath, item);
        })
    }
}

start(SOURCE_PATH);

// copyFolder(SOURCE_PATH, TARGET_PATH);

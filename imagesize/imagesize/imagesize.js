var fs = require('fs');
var imagesizeof = require('image-size');

//获取各个目录
var list = [];
var listimagesize = [];

//如果数字含有小数部分，那么可以将小数部分单独取出
//将小数部分的数字转换为字符串的方法：

var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
var chnUnitSection = ["","万","亿","万亿","亿亿"];
var chnUnitChar = ["","十","百","千"];
// //输出    "一百二十三亿三千九百四十九万二千八百三十五点九九三零二"
var numToChn = function(num){
    var index =  num.toString().indexOf(".");
    if(index != -1){
        var str = num.toString().slice(index);
        var a = "点";
        for(var i=1;i<str.length;i++){
            a += chnNumChar[parseInt(str[i])];
        }
        return a ;
    }else{
        return ;
    }
}
//定义在每个小节的内部进行转化的方法，其他部分则与小节内部转化方法相同
function sectionToChinese(section){
    var str = '', chnstr = '',zero= false,count=0;   //zero为是否进行补零， 第一次进行取余由于为个位数，默认不补零
    while(section>0){
        var v = section % 10;  //对数字取余10，得到的数即为个位数
        if(v ==0){                    //如果数字为零，则对字符串进行补零
            if(zero){
                zero = false;        //如果遇到连续多次取余都是0，那么只需补一个零即可
                chnstr = chnNumChar[v] + chnstr;
            }
        }else{
            zero = true;           //第一次取余之后，如果再次取余为零，则需要补零
            str = chnNumChar[v];
            str += chnUnitChar[count];
            chnstr = str + chnstr;
        }
        count++;
        section = Math.floor(section/10);
    }
    return chnstr;
}
//定义整个数字全部转换的方法，需要依次对数字进行10000为单位的取余，然后分成小节，按小节计算，当每个小节的数不足1000时，则需要进行补零
function TransformToChinese(num){
    var a = numToChn(num);
    num = Math.floor(num);
    var unitPos = 0;
    var strIns = '', chnStr = '';
    var needZero = false;

    if(num === 0){
        return chnNumChar[0];
    }
    while(num > 0){
        var section = num % 10000;
        if(needZero){
            chnStr = chnNumChar[0] + chnStr;
        }
        strIns = sectionToChinese(section);
        strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
        chnStr = strIns + chnStr;
        needZero = (section < 1000) && (section > 0);
        num = Math.floor(num / 10000);
        unitPos++;
    }

    // return chnStr+a;
    return chnStr;
}
// TransformToChinese(12339492835.99302);

function getfoldername(path) {

    // var path = rootpath + gamename;
    // var path = rootpath + gamename;
    var isExists = fs.existsSync(path);
    if(!isExists) {
        console.log("异常情况,被终止------文件不存在：获取所有图片到数组",path);
        process.exit();
    }
    var files = fs.readdirSync(path);
    files.forEach(function (item, index) {
        var fPath = path + "/" + item;
        var stat = fs.statSync(fPath);
        if(stat.isDirectory() === true) {
            if(item.indexOf(".Dir") == -1){
                list.push(item);
            }
        }
    });
    for(var i = 0; i < list.length; i++){
        getfolderiamgesize(path,list[i])
    }
    totalallsize();
}

function getfolderiamgesize(_path,code) {

    var path = _path + "/" + code;
    var imagepngsizelist = [];
    var imagejpgsizelist = [];

    var files = fs.readdirSync(path);

    files.forEach(function (item, index) {
        var fPath = path + "/" + item;
        var stat = fs.statSync(fPath);

        var sub_str = fPath.substr(fPath.length - 4,fPath.length);
        var size;
        if (stat.isFile() === true) {
            //将所有的png，jpg，fnt
            if(sub_str == ".png"){
                size = imagesizeof(fPath);
                imagepngsizelist.push(size);
            }
            if(sub_str == ".jpg"){
                size = imagesizeof(fPath);
                imagejpgsizelist.push(size);
            }
        }
    });

    var allpngsize = 0;
    var alljpgsize = 0;
    for(var i = 0; i < imagepngsizelist.length; i++){
        allpngsize = allpngsize + imagepngsizelist[i].width * imagepngsizelist[i].height;
    }
    for(var i = 0; i < imagejpgsizelist.length; i++){
        alljpgsize = alljpgsize + imagejpgsizelist[i].width * imagejpgsizelist[i].height;
    }
    var pngsizezh = TransformToChinese(allpngsize);
    var jpgsizezh = TransformToChinese(alljpgsize);
    
    var allsize = allpngsize+alljpgsize;
    var allsizezh = TransformToChinese(allsize);
    var imagesize = {
        code:code,
        pngsize:allpngsize,
        pngsizezh:pngsizezh,
        jpgsize:alljpgsize,
        jpgsizezh:jpgsizezh,
        totalsize:allsize,
        totalsizezh:allsizezh
    }
    listimagesize.push(imagesize);
}

function totalallsize() {

    function compare(val1,val2) {
        return val1.totalsize - val2.totalsize;
    }
    listimagesize.sort(compare);
    for(var i = 0; i < listimagesize.length; i++){
        console.log("文件夹名",listimagesize[i].code);
        console.log("jpg大小",listimagesize[i].jpgsize);
        console.log("png大小",listimagesize[i].pngsize);
        console.log("合计大小",listimagesize[i].totalsize);
        console.log("jpg大小中文",listimagesize[i].jpgsizezh);
        console.log("png大小中文",listimagesize[i].pngsizezh);
        console.log("合计大小中文",listimagesize[i].totalsizezh);
        console.log("-----------序号" + i + "------------");
    }
    console.log("——————————————————排序后全部统计完成——————————————————");
}


getfoldername("./images");

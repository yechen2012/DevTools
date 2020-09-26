var xlsx=require('node-xlsx');
function parseFileTo(filename,toname,keyindex,keyvalue){
    var fs=require('fs');
    var sheets=xlsx.parse(filename);
    var sheet=sheets[0];
    var enjson={};
    // 读取每行内容
    for(var rowId in sheet['data']){
        var row=sheet['data'][rowId];
        var name=row[keyindex];
        var envalue=row[keyvalue]||'';
        if(name!=undefined){
            enjson[name]=envalue;
            console.log(rowId,name+':',envalue);
        }
    }
    var enjsonstr=JSON.stringify(enjson);
    var writepath='./publish/'+toname;
    fs.writeFile(writepath,enjsonstr,function (err) {
        if(err){
            console.log(err);
            return;
        }
    })
}

function parseGameSheet(gamecode, keyindex,keyvalue,language){
    var filename= gamecode +'_lang_vol.' + version + '.xlsx';
    var desname=gamecode + '_lang'+language+'.json';
    var fs=require('fs');
    var sheets=xlsx.parse(filename);
    var sheet=sheets[0];
    var enjson={};
    // 读取每行内容
    for(var rowId in sheet['data']){
        var row=sheet['data'][rowId];
        var name=row[keyindex];
        var envalue=row[keyvalue]||'';
        if(name!=undefined){
            enjson[name]=envalue;
            console.log(rowId,name+':',envalue);
        }
    }
    var enjsonstr=JSON.stringify(enjson);
    var writepath='./publish/'+desname;
    fs.writeFile(writepath,enjsonstr,function (err) {
        if(err){
            console.log(err);
            return;
        }
    })
}
function parseTestSheet(keyindex,keyvalue,language){
    var filename='lang'+language+'_vol.1.01.xlsx';
    var desname='common_lang'+language+'.json';
    var fs=require('fs');
    var sheets=xlsx.parse(filename);
    var sheet=sheets[0];
    var enjson={};
    // 读取每行内容
    for(var rowId in sheet['data']){
        var row=sheet['data'][rowId];
        var name=row[keyindex];
        var envalue=row[keyvalue]||'';
        if(name!=undefined){
            enjson[name]=envalue;
            console.log(rowId,name+':',envalue);
        }
    }
    var enjsonstr=JSON.stringify(enjson);
    var writepath='./publish/'+desname;
    fs.writeFile(writepath,enjsonstr,function (err) {
        if(err){
            console.log(err);
            return;
        }
    })
}

var version = "1.01";

//common
// parseTestSheet(0,1,'de');
// parseTestSheet(0,1,'en');
// parseTestSheet(0,1,'fi');
// parseTestSheet(0,1,'no');
// parseTestSheet(0,1,'sv');
// parseTestSheet(0,1,'zh');
//game
// parseGameSheet(0,15,'de');
// parseGameSheet(0,1,'zh');
// parseGameSheet("taoist", 0,1,'zh');
parseGameSheet("elemental", 0,2,'en');
// parseGameSheet("taoist", 0,3,'sv');
// parseGameSheet("taoist", 0,4,'no');
// parseGameSheet("taoist", 0,5,'de');
// parseGameSheet("taoist", 0,6,'fi');
// parseGameSheet("taoist", 0,7,'ru');
// parseGameSheet("taoist", 0,8,'it');
// parseGameSheet("taoist", 0,9,'jp');
// parseGameSheet("taoist", 0,10,'th');
// parseGameSheet(0,3,'sv');
// parseGameSheet(0,4,'no');
// parseGameSheet(0,5,'de');
// parseGameSheet(0,6,'fi');
// parseGameSheet(0,7,'ru');
// parseGameSheet(0,8,'it');
// parseGameSheet(0,1,'en');
// parseGameSheet(0,15,'fi');
// parseGameSheet(0,17,'sv');
// parseGameSheet(0,1,'zh');

// parseFileTo('Atlantis_langen_vol.1.02.xlsx',"atlantis_langen.json",0,1);
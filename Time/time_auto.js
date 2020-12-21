const xlsx = require("node-xlsx");
const fs = require("fs");

const WEEK_DEF = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const NORM_DAY_LENGTH = 9;
const EVERY_DAY_SECONDS = 24 * 3600 * 1000;

function formatUtil(date, fmtStyle) {
    var fmt = fmtStyle;
    var o = {
        "M+": date.getMonth() + 1, //月份
        "D+": date.getDate(), //日
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "S+": date.getSeconds(), //秒
        "Q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "s": date.getMilliseconds() //毫秒
    };
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return fmt;
};

function getExcelFilePath(date) {
    var path = "G:/DevTools/Time/Time_" + formatUtil(date, "YYYYMM") + ".xlsx";
    return path;
};

function createNewExcelValue() {
    var value = [
        {
            "name": "Sheet1",
            "data": [
                [
                    "日期",
                    "星期X",
                    "起始时间",
                    "结束时间",
                    "起始时间（格式化）",
                    "结束时间（格式化）",
                    "每日时长",
                    "单日余额",
                    "月度小计"
                ]
            ]
        }
    ];

    return value;
};

function getTodayLength(diffStamp) {
    var seconds = Math.round(diffStamp / 1000);
    var hour = Math.floor(seconds / 3600);
    var min = Math.floor((seconds - hour * 3600) / 60);
    var seconds = seconds - hour * 3600 - min * 60;

    var length = hour + min / 60 + seconds / 3600;
    return length;
};

function getWeekDay(date) {
    var day = date.getDay();
    return WEEK_DEF[day];
};

function createNewRowData(todayFmt, date) {
    var lst = [];

    var todayFmt = todayFmt == undefined ? formatUtil(date, "YYYYMMDD") : todayFmt;
    var stamp = date.getTime();
    var fmt = formatUtil(date, "HH:mm:SS");
    var weekDay = getWeekDay(date);
    var balance = weekDay == WEEK_DEF[0] ? 0 : -NORM_DAY_LENGTH;

    lst.push(todayFmt);
    lst.push(weekDay);
    lst.push(stamp);
    lst.push(stamp);
    lst.push(fmt);
    lst.push(fmt);
    lst.push(0);
    lst.push(balance);
    lst.push(0);

    return lst;
};

function writeRowData(lst, date) {
    var stamp = date.getTime();
    var fmt = formatUtil(date, "HH:mm:SS");

    lst[3] = stamp;
    lst[5] = fmt;

    var startStamp = lst[2];
    var diff = stamp - startStamp;
    var length = getTodayLength(diff);
    lst[6] = length;

    lst[7] = length - NORM_DAY_LENGTH;
};

function insertDayData(lstMonthData, date, row) {
    var lastDayData = lstMonthData[row - 1];
    var startDate = new Date(lastDayData[3]);

    if (lastDayData[0] == "日期") {
        startDate = new Date(date.getTime() - (date.getDate()) * EVERY_DAY_SECONDS);
    }

    var tempDate = new Date(startDate.getTime() + EVERY_DAY_SECONDS);

    while(tempDate.getDate() < date.getDate()) {
        lstMonthData.push(createNewRowData(undefined, tempDate));
        tempDate = new Date(tempDate.getTime() + EVERY_DAY_SECONDS);
    }

    lstMonthData.push(createNewRowData(undefined, date));
};

function writeMonethlyTotalTime(lstMonthData) {
    if (!lstMonthData)
        return;

    var dayData = undefined;
    var temp = undefined;
    var index = 0;
    // 第一条必为Title
    for (var i = 1; i < lstMonthData.length; ++i) {
        dayData = lstMonthData[i];
        index = i;

        var totalTime = 0;

        while(index > 0) {
            temp = lstMonthData[index];
            totalTime += temp[7];

            --index;
        }

        dayData[8] = totalTime;
    }
};

function main() {
    var date = new Date();
    var filePath = getExcelFilePath(date);

    var excelDesc = undefined;
    if (fs.existsSync(filePath)) {
        excelDesc = xlsx.parse(filePath);
    } else {
        excelDesc = createNewExcelValue();
    }

    var monthData = excelDesc[0].data;
    var todayFmt = formatUtil(date, "YYYYMMDD");
    var row = 0;
    while (monthData) {
        var lstDay = monthData[row];
        if (lstDay[0] == todayFmt) {
            writeRowData(lstDay, date);
            break;
        }

        ++row;

        if (row >= monthData.length) {
            insertDayData(monthData, date, row);
            monthData.sort(function(a, b) {
                var ret = 1;
                if (a[0] == "日期")
                    ret = -1;
                else if (b[0] == "日期")
                    ret = 1;
                else if (parseInt(a[0]) < parseInt(b[0]))
                    ret = -1;

                console.log("a = ", a[0], "b = ", b[0], "ret = ", ret);

                return ret;
            });
            break;
        }
    }

    // 月度小计
    writeMonethlyTotalTime(monthData);

    if (excelDesc) {
        fs.writeFile(filePath, xlsx.build(excelDesc), (err) => {
            if (err) throw err;
            console.log("时间保存成功！！！");
        });
    }
};


// start
main();
# -- coding: utf-8 --
import os
import shutil
import sys
import json

# http://mirrors.aliyun.com/pypi/simple
# pip install -i http://mirrors.aliyun.com/pypi/simple --trusted-host pypi.douban.com numpy

from win32com.client import Dispatch, GetActiveObject, GetObject
# 配置原资源地址 path1
# 配置修改后的资源地址 path2
# 配置需要修改的文件夹名字，必须原资源地址里找得到 gamename
# 配置图片需要修改的大小 amount

# 将path1/gamename里的jpg，png，fnt结束的文件复制到path2/gamename，不存在则创建，存在则清空gamename。不复制子文件夹
# 遍历path2/gamename，读取fnt里的内容，找到关联的图片，删除改fnt文件和关联的图片
# 遍历path2/gamename，调用photoshop的resizeimage方法，修改图片尺寸大小

# 结束后打印结束

path1 = "./images"
path2 = "./compressimages"

datatojson = {
    "list" : [],
    "size" : 0.8
}

def dirisexist(gamename):
    gamenamepath = path2 + "/" + gamename
    if not os.path.exists(gamenamepath):
        os.makedirs(gamenamepath)
        print("Directory created successfully!")
    else:
        shutil.rmtree(gamenamepath, ignore_errors=True)
        os.makedirs(gamenamepath)
        print("Directory cleanup and creation successful")

def copyfiles(gamename):
    print("start copy files")
    gamenamepath = path1 + "/" + gamename
    files = os.listdir(gamenamepath)
    for s in files:
        filepath = gamenamepath + "/" + s
        if os.path.isfile(filepath):
            if(filepath.find(".png") != -1 or filepath.find(".jpg") != -1):
                source = os.path.join(gamenamepath, s)
                target = os.path.join(path2 + "/" + gamename, s)
                try:
                    shutil.copy(source, target)
                    print("Copy %s sucessful!" % source)
                except:
                    print("Copy %s failed!" % source)


def compress(gamename,amount):
    print("start compressimage...")
    gamenamepath = path2 + "/" + gamename
    for root, dirs, files in os.walk(gamenamepath):
        for name in files:
            app = GetActiveObject("Photoshop.Application")
            # 获取绝对路径
            temppath = os.path.dirname(os.path.abspath(gamenamepath))
            _temppath = temppath.replace('\\', '/')
            filename = _temppath + "/" + gamename + "/" + name
            datatojson["list"].append(name)
            app.Open(filename)
            docRef = app.ActiveDocument
            docRef.ResizeImage(docRef.Width * float(amount), docRef.Height * float(amount))
            # docRef.ResizeImage(docRef.Width * float(amount), docRef.Height * float(amount), 72, 8, 50)
            docRef.Save()
            docRef.Close()
            print("compress %s sucessful!" % filename)

def exportjson(gamename,amount):
    print("start export json")
    datatojson["size"] = amount
    json_str = json.dumps(datatojson)
    new_dict = json.loads(json_str)
    print("Copy %s sucessful!" % json_str)
    filename = path2 + "/" + gamename + "/" + "compress_image.json"
    with open(filename, "w", encoding='UTF-8') as f:
        json.dump(new_dict, f)
    print("oven down!!!")


gamenames = [["test1","0.8"],["test2","0.8"]]
for i in gamenames:
    print(i[0])
    print(i[1])
    # 判断目录是否存在，存在则清空，再创建，不存在则创建
    dirisexist(i[0])
    # 复制jpg，png
    copyfiles(i[0])
    # 开始压缩图片
    compress(i[0],i[1])
    # 导出json文件
    exportjson(i[0],i[1])

print("dddd")
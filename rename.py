# -*- coding: cp936 -*-
import os
from nt import chdir
path="./"
fromstr="helloween"
tostr="halloween"

for root,dirs,files in os.walk(path):
    for name in files:
        print name
        print root
        if fromstr in name:
             newname=name.replace(fromstr,tostr)
             print newname
             os.rename(root+"/"+name, root+"/"+newname)
var ServPathArr = {};

function initservpath(){
    for(var i in ServPathArr){
        Newglobalvariables(i);
    }
}

function Newglobalvariables(volue){
    window[volue] = ServPathArr[volue];
}
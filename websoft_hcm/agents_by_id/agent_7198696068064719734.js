// 7198696068064719734
try {
    templateDoc = tools.open_doc(6961726882916801206);

    templateDoc.TopElem.cache_dynamic = "{" +
        "'sOWTId':'0x609D05B7178B1AB6'," +
        "'sWTId':'0x5B0FF12E1F900D50',"+
        "'aItems':[],"+
        "'aResult':[],"+
        "'oParams':{"+
        "'sHeader':'',"+
        "'sText':'{{LOCAL.curItemDesc}}',"+
        "'bUseImg':false,"+
        "'sObjectType':'image',"+
        "'sImgFile':'',"+
        "'sExternalCode':'',"+
        "'sImgLink':'',"+
        "'sBlockImgLink':''"+
        "},"+
        "'bLPE':false}";

    templateDoc.Save();



} catch (err){
    alert (err);
};
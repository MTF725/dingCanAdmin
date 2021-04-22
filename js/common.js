// var port = 'http://192.168.1.100:2003';//本地
 var port = 'http://192.168.1.252:2003'; //服务
// var port1 = 'http://192.168.1.252:9001'; //（展示商家后台图片时需要此地址）
// var port2 = 'http://192.168.1.252:9101'; //微信端服务 （展示骑手图片时需要此地址）

/////////////线上
//var port = 'http://ordermeal.ngrok2.xiaomiqiu.cn'; //线上
var port1 = 'http://shopmanage.ngrok2.xiaomiqiu.cn'; //（展示商家后台图片时需要此地址）
var port2 = 'http://ordermealw.ngrok2.xiaomiqiu.cn'; //微信端服务 （展示骑手图片时需要此地址）

// 正则验证
var phongReg = /^1[3456789]\d{9}$/; //手机号码
var integerReg = /^[0-9]+$/; //大于等于0的正整数
var zzsReg = /^\+?[1-9]\d*$/; //大于0的整数
var zsReg = /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/; //大于0的数（包括小数）
var idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证
var posReg = /^\d+(\.\d+)?$/; //非负浮点数

//动态设置左侧树形菜单、数据表格高度
function setTreeTableHeight(height) {
    $('.layui-tree').css('height', $(window).height() - 30 + 'px');
    $('.fixed-table-container').css({ 'height': $(window).height() - height + 'px' });
}

$('.left-side-tree').css({'height':$(document).height()-30});//左侧树形菜单高度

//日期转时间戳
function timeStamp(date) {
    var date = new Date(date);
    var reault = date.getTime();
    return reault;
}

// 获取系统日期：年月日
function getSystemDate(para) {
    var myDate = new Date();
    var year = myDate.getFullYear(); //年
    var month = myDate.getMonth() + 1; //月
    var day = myDate.getDate(); //日
    var hours = myDate.getHours(); //时
    var min = myDate.getMinutes(); //分
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (min < 10) {
        min = '0' + min;
    }

    if (para == 'date') {
        return year + '-' + month + '-' + day;
    }
    if (para == 'datetime') {
        return year + '-' + month + '-' + day + ' ' + hours + ':' + min;
    }

}

// 查询单位名称列表并赋值下拉框 ele为元素（如果存在第二个参数则option赋值id，否则赋值名称）
function unitList(ele, id) {
    $.ajax({
        url: port + '/v1/company/query',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        async: false,
        data: {
            pageNum: 1,
            pageSize: 10000
        },
        success: function(e) {
            var arr = e.data.list;
            // console.log('单位下拉', arr);
            for (var i = 0; i < arr.length; i++) {
                $(ele).append('<option value=' + (id ? arr[i].company.cId : arr[i].company.cName) + '>' + arr[i].company.cName + '</option>');

                layui.form.render('select');
            }
        }
    });
}

// 查询单位区域列表并赋值下拉框 ele为元素（如果存在第二个参数则option赋值id，否则赋值名称）
function unitAreaList(ele, id, unitid) {
    var unitid1='';
    if (localStorage.getItem('superAdmin')) {
        if (unitid) {
            unitid1=unitid;
        }
    }else{
        unitid1=localStorage.getItem('unitId');
    }
    $.ajax({
        url: port + '/v1/companyarea/query',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        async: false,
        data: {
            pageNum: 1,
            pageSize: 10000,
            cId: unitid1, //级联查询时传入的单位id
        },
        success: function(e) {
            var arr = e.data.list;
            // console.log('单位区域下拉', arr);
            for (var i = 0; i < arr.length; i++) {
                $(ele).append('<option value=' + (id ? arr[i].cAreaId : arr[i].cAreaName) + '>' + arr[i].cAreaName + '</option>');

                layui.form.render('select');
            }
        }
    });
}

// 查询配送区域列表并赋值下拉框 ele为元素（如果存在第二个参数则option赋值id，否则赋值名称），第3个参数为单位区域id
function sendAreaList(ele,id,areaId) {
    $.ajax({
        url: port + '/v1/deliveryarea/query',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        async: false,
        data: {
            pageNum: 1,
            pageSize: 10000,
            cAreaId:areaId
        },
        success: function(e) {
            var arr = e.data.list;
            // console.log('配送区域下拉', arr);
            for (var i = 0; i < arr.length; i++) {
                $(ele).append('<option value=' + (id ? arr[i].dAreaId : arr[i].dAreaName) + '>' + arr[i].dAreaName + '</option>');

                layui.form.render('select');
            }
        }
    });
}

// 查询店铺名称列表并赋值下拉框 ele为元素（如果存在第二个参数则option赋值id，否则赋值名称）
function shopNameList(ele, id, areaid, shoptypeid) {
    $.ajax({
        url: port + '/v1/shop/query',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        async: false,
        data: {
            pageNum: 1,
            pageSize: 10000,
            cAreaId: areaid, //单位区域id
            typeId: shoptypeid, //店铺类型id
        },
        success: function(e) {
            var arr = e.data.list;
            for (var i = 0; i < arr.length; i++) {
                $(ele).append('<option data-shopaddress="'+arr[i].shopAddress+'" data-floor=' + arr[i].shopFloorCount + ' value=' + (id ? arr[i].shopId : arr[i].shopName) + '>' + arr[i].shopName + '</option>');

                layui.form.render('select');
            }
        }
    });
}

// 查询店铺层数列表并赋值下拉框 ele为元素（如果存在第二个参数则option赋值id，否则赋值名称）
function shopFloorList(ele, id) {
    $.ajax({
        url: port + '/v1/shop/query',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        async: false,
        data: {
            pageNum: 1,
            pageSize: 10000
        },
        success: function(e) {
            var arr = e.data.list;
            // console.log('店铺层数下拉', arr);
            for (var i = 0; i < arr.length; i++) {
                $(ele).append('<option value=' + (id ? arr[i].shopFloorCount : arr[i].shopFloorCount) + '>' + arr[i].shopFloorCount + '</option>');

                layui.form.render('select');
            }
        }
    });
}

// 查询窗口号列表并赋值下拉框 ele为元素（如果存在第二个参数则option赋值id，否则赋值名称）
function winNumList(ele, id, shopid, floor) {
    $.ajax({
        url: port + '/v1/window/query',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        async: false,
        data: {
            pageNum: 1,
            pageSize: 10000,
            shopId: shopid, //店铺id
            floorNum: floor, //所在层
        },
        success: function(e) {
            var arr = e.data.list;
            console.log('窗口名称下拉', arr);
            for (var i = 0; i < arr.length; i++) {
                $(ele).append('<option data-winname='+arr[i].winName+' value=' + (id ? arr[i].winId : arr[i].winNo) + '>' + arr[i].winNo + '</option>');

                layui.form.render('select');
            }
        }
    });
}

// 查询店铺类型列表并赋值下拉框
function shopTypeList(ele,unitId) {
    $.ajax({
        url: port + '/v1/dataDictionary/query',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        async: false,
        data: {
            pageNum: 1,
            pageSize: 10000,
            cId: unitId?unitId:setUnitId(ele) //所属单位id
        },
        success: function(e) {
            console.log('店铺类型下拉', e);
            var arr = e.data.list;
            for (var i = 0; i < arr.length; i++) {
                $(ele).append('<option value=' + arr[i].dId + '>' + arr[i].dName + '</option>');
                layui.form.render('select');
            }
        }
    });
}

// 查询评价项目列表并赋值下拉框
function assessItemList(ele, id,unitId) {
    $.ajax({
        url: port + '/v1/commentType/query',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        async: false,
        data: {
            pageNum: 1,
            pageSize: 10000,
            cId:setUnitId()
        },
        success: function(e) {
            var arr = e.data.list;
            // console.log('评价项目列表下拉', arr);
            for (var i = 0; i < arr.length; i++) {
                $(ele).append('<option value=' + (id ? arr[i].commentTypeId : arr[i].commentTypeName) + '>' + arr[i].commentTypeName + '</option>');
                layui.form.render('select');
            }
        }
    });
}

// 查询配送员列表
function sendPersonList(areaid) {
    var data = '';
    $.ajax({
        url: port + '/v1/deliveryPerson/query',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        async: false,
        data: {
            pageNum: 1,
            pageSize: 10000,
            cId: localStorage.getItem('unitId'), //单位id
            cAreaId: areaid, //单位区域id
        },
        success: function(e) {
            var arr = e.data.list;
            // console.log('配送员列表下拉', arr);
            data = arr;
        }
    });

    return data;
}

// 查询角色名称下拉
function roleNameList(ele, id) {
    $.ajax({
        url: port + '/v1/role/query',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        async: false,
        data: {
            pageNum: 1,
            pageSize: 10000,
            cId: localStorage.getItem('superAdmin')?'':localStorage.getItem('unitId'),
        },
        success: function(e) {
            console.log('角色名称下拉',e)
            var arr = e.data.list;
            var unitName='';
            // console.log('角色名称列表下拉', arr);
            if (arr.length>0) {
                for (var i = 0; i < arr.length; i++) {
                    if(localStorage.getItem('superAdmin')){
                        if (arr[i].cName) {
                            unitName='('+arr[i].cName+')';
                        }else{
                            unitName='';
                        }
                    }
                    $(ele).append('<option value=' + (id ? arr[i].roleId : arr[i].roleName) + '>' + arr[i].roleName + ''+unitName+'</option>');
                    layui.form.render('select');
                }
            }else{
                $(ele).append('<option></option>');
                layui.form.render('select');
            }
        }
    });
}

// 查询用户信息
function getUserInfo(href) {
    $.ajax({
        url: port + '/v1/user/get',
        type: 'get',
        async: false,
        xhrFields: {
            withCredentials: true
        },
        data: {
            uId: localStorage.getItem('dcUserId')
        },
        success: function(data) {
            console.log('用户信息', data);
            if (data.status == 200) {
                localStorage.setItem('dcUserId', data.data.uId); //登录人id
                localStorage.setItem('dcUserName', data.data.uName); //登录人用户名
                localStorage.setItem('roleId', data.data.roleId); //登录人角色id
                localStorage.setItem('unitId', data.data.company.cId); //登录人单位id
                localStorage.setItem('unitName', data.data.company.cName); // 登录人单位名称
                localStorage.setItem('departId', data.data.deptId); // 登录人部门id
            } else {
                location.href = href;
            }
        }
    });
}

// 退出
function quitLogin() {
    var result;
    $.ajax({
        url: port + '/v1/user/logout',
        type: 'post',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            result = data;
        }
    });

    return result;
}


// 清除用户信息本地缓存
function clearUserStorage() {
    localStorage.removeItem('dcUserId'); //登录人id
    localStorage.removeItem('dcUserName'); //登录人用户名
    localStorage.removeItem('roleId'); //登录人角色id
    localStorage.removeItem('unitId'); //登录人单位id
    localStorage.removeItem('unitName'); // 登录人单位名称
    localStorage.removeItem('departId'); // 登录人部门id

    sessionStorage.removeItem('orderAdminLogin');

    if (localStorage.getItem('superAdmin')) {
        localStorage.removeItem('superAdmin');
    }
}

// 隐藏数据表格某一列，参数为要隐藏字段名
function hideTableColumn(field){
    $('#table').bootstrapTable('hideColumn', field);
}

// 设置如果当前是超级管理员设置id为''，否则设置为当前登录的单位id
function setUnitId(ele){
    var id='';
    if(localStorage.getItem('superAdmin')){
        if (ele) {
            id=$(ele).val();
        }
    }else{
        id=localStorage.getItem('unitId');
    }
    return id;
}

// 判断超级管理员和管理员，显示对应的内容
if (localStorage.getItem('superAdmin')) {
    $('.isSuperAdmin').css('display','inline-block');
}else{
    $('.isAdmin').css('display','inline-block');
}

//根据角色id，判断按钮显隐
function judgeBtnShow(btnGroup){  
   if(localStorage.getItem("roleId")!=null||localStorage.getItem("roleId")!=undefined){
    $.ajax({
        url: port + '/v1/resource/getFunction',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        data:{
            roleId:localStorage.getItem("roleId")
        },
        success: function(data) {    
            console.log("根据角色id，判断按钮显隐",data)        
           if(data.data.length>0 && btnGroup.length>0){
               var DataList = data.data;             
               for(var i =0;i<DataList.length;i++){
                  for(var x =0;x<btnGroup.length;x++){
                      if(DataList[i].rName==btnGroup[x].btnName){                                                    
                        $(btnGroup[x].btnDom).css("display","inline-block");
                      }
                  }
              }
           }else if(btnGroup.length==0){
              $("#toolbar").css("display","none");
           }
        }
    });
   }   
}

//如果不是超级管理员，则每次刷新页面，更新角色
if (!localStorage.getItem('superAdmin')) {
    $.ajax({
        url: port + '/v1/user/get',
        type: 'get',
        async:false,
        xhrFields: {
            withCredentials: true
        },
        data: {
            uId : localStorage.getItem("dcUserId"),                      
        },
        success: function (e) {       
            if (e.status == 200) {
                localStorage.setItem('roleId',e.data.roleId);//更新登录人角色id
                getMenu('#nav');
            } 
        }
    });
}


 //动态获取左侧菜单
function getMenu(ele) {
    $(ele).html('');
    var html = '';
    $.ajax({
        url: port + '/v1/resource/getMenuTree',
        type: 'get',
        xhrFields: {
            withCredentials: true
        },
        async: false,
        data: {
            roleId:localStorage.getItem('superAdmin')?'0':localStorage.getItem('roleId')
        },
        success: function(data) { 

            
            if (data.status == 200) {
                for (var i = 0; i < data.data.length; i++) {
                    html += "<li>" +
                        "<a href='javascript:;'>" +
                        "<img class='tree-icon' src=" + data.data[i].icon + ">" +
                        "<cite>" + data.data[i].title + "</cite>" +
                        "<i class='iconfont nav_right'>&#xe697;</i>" +
                        "</a>" +
                        "<ul class='sub-menu'>";
                        if (data.data[i].children) {
                            for (var j = 0; j < data.data[i].children.length; j++) {
                                html += "<li>" +
                                    "<a onclick=xadmin.add_tab('" + data.data[i].children[j].title + "','" +
                                    data.data[i].children[j].link + "')>" +
                                    "<cite>" + data.data[i].children[j].title + "</cite>" +
                                    "</a>" +
                                    "</li>";
                            }
                        }
                    

                    html += "</ul></li>";
                }

                $(ele).append(html);
                
            }else{

            }

        },
        error:function(data){
            if (localStorage.getItem('superAdmin')) {
                location.href = './superLogin.html';
            }else{
                location.href = './login.html';
            }
              clearUserStorage();//清除用户信息本地缓存  
        }
    });
}

 //非空判断
 function isNull(e){
    if(e===""||e===null||e===undefined){
        return ""
    }else{
        return e
    }
}


// 查询公告类型列表并赋值下拉框
function newsTypeList(ele) {
    $.ajax({
        url: port + '/v1/newsKind/query',
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        async: false,
        data: {
            pageNum: 1,
            pageSize: 10000,
            cId: setUnitId(ele) //所属单位id
        },
        success: function(e) {
            // console.log('公告类型下拉', e);
            var arr = e.data.list;
            for (var i = 0; i < arr.length; i++) {
                $(ele).append('<option value=' + arr[i].newsKindId + '>' + arr[i].newsKindName + '</option>');
                layui.form.render('select');
            }
        }
    });
}


// 全局配置ajax，登录过期自动跳转到登录页
$.ajaxSetup({
     error : function(jqXHR, textStatus, errorThrown){
        console.log(jqXHR, textStatus, errorThrown);
        if (jqXHR.responseJSON.status==602) {
            layer.msg('登录过期，请重新登录');
            setTimeout(function(){
                if (localStorage.getItem('superAdmin')) {
                    parent.parent.location.href='./superLogin.html';
                }else{
                    parent.parent.location.href='./login.html';
                }
            },2000);
        }
     }
});




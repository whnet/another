
function gotoPersonalDataEdit(index){
	//0表示修改昵称，1表示修改个性签名
	var string = "";
	if (index==0) {
		string = $('#nickname').text();
	}else if (index==1) {
		string = $('#motto').text();
	};
	// window.open();
	location.href=encodeURI("personal_data_name_edit.html?index="+index+"&value="+string);
}
//初始化用户基本信息
function configMyData(){
	$('#headPic img').attr("src",'');

	// sex 性别 1-男性，2-女性，0-未知

}
//修改用户性别
function getSexType(){

}
function saveFunction(){
	var initSexBool = sexBool;
	if ($("#radioMan").prop("checked")==true) {
        sexBool = 1;
    }else if ($("#radioWoman").prop("checked")==true) {
        sexBool = 2;
    }
    if (initSexBool!=sexBool) {
    	var arrValue = new Array();
	    arrValue.push("sex="+sexBool);
	    // updateUserInfoFunction(arrValue);
    }else{
    	location.href = "index.html";
    }

}






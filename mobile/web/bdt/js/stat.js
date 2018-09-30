$(document).ready(function() {
	createStatlog();
});


function createStatlog() {
    var url = window.location.href;
    var path = window.location.pathname;
    var hashstr = window.location.hash;
    var querystr = window.location.search;

　　  //向后台发送处理数据
      $.ajax({
        type: "post",
        url: createStatlogUrl,
        dataType: "json",
        async: true,
        data:{"url":url,"path":path,"hashstr":hashstr,"querystr":querystr},
        success: function(result) {
            if(result.result == "success"){        
            }
        }
    });
}



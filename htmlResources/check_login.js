if(localStorage.getItem("token")!=""){
    var xmlhttp;
    if (window.XMLHttpRequest)
        xmlhttp=new XMLHttpRequest();
    else
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            //console.log(xmlhttp.responseText);
            response_json=JSON.parse(xmlhttp.responseText);
            if(response_json.status){//token验证失败==1
                console.log(response_json.message);
                alert("该功能需要登录，请进行登录或者注册。即将跳转到登录页面");
                window.location.href="../user/login.html"
            }
            else{
                console.log('token验证成功!');
            }
        }
    }
    xmlhttp.open("GET","/my/userinfo",false);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
    xmlhttp.send();
}
else{
    alert("该功能需要登录，请进行登录或者注册。即将跳转到首页,您可以点击右上角的按钮进行登录/注册");
    window.location.href="../main/index.html"
}
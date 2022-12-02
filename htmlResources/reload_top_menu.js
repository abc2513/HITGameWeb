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
            }
            else{
                console.log('token验证成功!');
                var login_div=document.getElementById("login_div");
                var login_a=document.getElementById("login_a");
                var reg_div=document.getElementById("reg_div");
                var reg_a=document.getElementById("reg_a");
                login_div.removeChild(login_a);
                reg_div.removeChild(reg_a);
                var hello_div=document.getElementById("hello_div")
                var dateobj=new Date();
                var h=dateobj.getHours();
                var hello_span=document.createElement("span");
                if(h>=4&&h<12)
                    hello_span.innerText="早上好,"+response_json.data.name;
                else if(h>=12&&h<18)
                    hello_span.innerText="下午好,"+response_json.data.name;
                else 
                    hello_span.innerText="晚上好,"+response_json.data.name;
                hello_div.appendChild(hello_span);
                var mycneter=document.createElement("a");
                mycneter.href="../my/mycenter.html"
                mycneter.innerText="个人中心"
                var mycenter_div=document.getElementById("mycenter_div");
                mycenter_div.appendChild(mycneter);
                var myaccount=document.createElement("a");
                myaccount.href="../my/myaccount.html"
                myaccount.innerText="账号管理"
                var myaccount_div=document.getElementById("myaccount_div");
                myaccount_div.appendChild(myaccount);
            }
        }
    }
    xmlhttp.open("GET","/my/userinfo",false);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
    xmlhttp.send();
}
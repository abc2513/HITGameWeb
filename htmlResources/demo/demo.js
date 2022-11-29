var app2=new Vue({
    el:'.article',
    data:{
        Data:[],

    },
    mounted() {
        var url = window.location.href ;             //获取当前url
        var dz_url = url.split('#')[0];                //获取#/之前的字符串
        var cs = dz_url.split('?')[1];                //获取?之后的参数字符串
        var cs_arr = cs.split('&');                    //参数字符串分割为数组
        var cs={};
        for(var i=0;i<cs_arr.length;i++){         //遍历数组，拿到json对象
        cs[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1]
        }
        var xmlhttp;
        if (window.XMLHttpRequest)
            xmlhttp=new XMLHttpRequest();
        else
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                console.log(xmlhttp.responseText);
                response_json=JSON.parse(xmlhttp.responseText);
                if(response_json.status){
                    alert(response_json.message);
                }
                else{//成功
                    app2.Data=JSON.parse(response_json.data);
                    app2.Data.data=JSON.parse(app2.Data.data);
                }
            }
        }
        xmlhttp.open("GET","/api/article?articleID="+cs.articleID,true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
        xmlhttp.send();
    }
})
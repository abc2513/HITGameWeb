var app2=new Vue({
    el:'.article',
    data:{
        Data:[],
        comment:[],
        userID:{},
        new_comment:'',
    },
    mounted() {
        this.get_user_info();
        this.get_article();
        this.get_comment();
    },
    methods: {
        get_article(){
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
        },
        get_comment(){
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
                        console.log(response_json.message);
                    }
                    else{//成功
                        app2.comment=JSON.parse(response_json.data);
                    }
                }
            }
            xmlhttp.open("GET","/api/comment_list?articleID="+cs.articleID+"&kind=1",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        get_user_info(){
            
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
                            alert("该功能需要登录，您的登录已过期。请进行登录或者注册。即将跳转到登录页面");
                            window.location.href="../user/login.html"
                        }
                        else{
                            console.log('token验证成功!');
                            app2.userID=response_json.data.userID;
                            //app2.Data.regtime=datetime.fromtimestamp(app2.Data.regtime,8);
                        }
                    }
                }
                xmlhttp.open("GET","/my/userinfo",true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
                xmlhttp.send();
        }
        },
        create_comment(){
            if(this.new_comment==''){
                alert('不能发表空评论！');
                return;
            }
            if(this.new_comment.length<=2){
                alert("请评论有意义的内容！")
                return;
            }
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
                        alert(response_json.message);
                        app2.new_comment="";
                        app2.get_comment();
                    }
                }
            }
            xmlhttp.open("POST","/my/create_comment",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send("articleID="+cs.articleID+"&text="+app2.new_comment+"&kind=1");
        },
        delete_comment(id){
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
                        alert(response_json.message);
                        app2.get_comment();
                    }
                }
            }
            xmlhttp.open("POST","/my/delect_comment",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send("commentID="+id);
        }
}
})
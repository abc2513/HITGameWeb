var app2=new Vue({
    el:'.article',
    data:{
        Data:[],
        comment:[],
        userID:{},
        user_level:0,
        new_comment:'',
        article_thumbs_up_num:0,
        my_thumbs_up:false,
        new_article_level:3,
        articleID:'',
    },
    mounted() {
        this.get_user_info();
        this.get_article();
        this.get_comment();
        this.get_thumbs_up_num_article();
        this.thumbs_up_check();
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
                        app2.new_article_level=app2.Data.level
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
                            //alert("该功能需要登录，您的登录已过期。请进行登录或者注册。即将跳转到登录页面");
                            //window.location.href="../user/login.html"
                        }
                        else{
                            console.log('token验证成功!');
                            app2.userID=response_json.data.userID;
                            app2.user_level=response_json.data.level
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
        },
        thumbs_up_change_article(){
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
                        console.log(response_json.message);
                        app2.get_thumbs_up_num_article();
                        app2.thumbs_up_check();
                    }
                }
            }
            xmlhttp.open("POST","/my/thumbs_up_change",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send("articleID="+cs.articleID+"&kind=1");
        },
        get_thumbs_up_num_article(){
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
                    //console.log(xmlhttp.responseText);
                    response_json=JSON.parse(xmlhttp.responseText);
                    if(response_json.status){
                        alert(response_json.message);
                    }
                    else{//成功
                        app2.article_thumbs_up_num=JSON.parse(response_json.data);
                    }
                }
            }
            xmlhttp.open("GET","/api/thumbs_up_num?articleID="+cs.articleID+"&kind=1",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        thumbs_up_check(){
            if(this.userID!=''){
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
                    //console.log(xmlhttp.responseText);
                    response_json=JSON.parse(xmlhttp.responseText);
                    if(response_json.status){
                        //alert(response_json.message);
                    }
                    else{//成功
                        app2.my_thumbs_up=JSON.parse(response_json.data).value;
                    }
                }
            }
            xmlhttp.open("GET","/my/thumbs_up_check?articleID="+cs.articleID+"&kind=1",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
            }
        },
        set_article_level(){
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
                        app2.get_article();
                    }
                }
            }
            xmlhttp.open("POST","/op/set_article_level",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send("articleID="+cs.articleID+"&level="+app2.new_article_level);
        },
        op_delete_comment(id){
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
            xmlhttp.open("POST","/op/delete_comment",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send("commentID="+id+"&status=1");
        },
        op_change_article_status(status){
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
                        //app2.get_article();
                    }
                }
            }
            xmlhttp.open("POST","/op/change_article_status",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send("articleID="+cs.articleID+"&status="+status);
        },
        jump_to_panel(){
            window.location.href="../main/article_panel.html?articleID="+app2.Data.articleID
        }
    }
}
)
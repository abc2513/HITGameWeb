var app2=new Vue({
    el:'.article',
    data:{
        Data:{},
        old_password:'',
        new_password:'',
        repassword:'',
    },
    mounted() {
        this.get_my_info()
    },
    computed:{
        user_level_name(){
            switch(this.Data.level){
                case 1:
                    return '普通用户';
                case 2:
                    return '正式社员';
                case 3:
                    return '管理员';
                case 4:
                    return '组织者';
                default:
                    return '未知等级';
            }
        },
        user_status_name(){
            switch(this.Data.user_status){
                case 0:
                    return '正常';
                case 1:
                    return '禁言';
                case 2:
                    return '冻结';
                case 3:
                    return '封禁';
                default:
                    return '未知状态'
            }
        }
    },
    methods: { 
        get_my_info(){
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
                            app2.Data=response_json.data;
                            //app2.Data.regtime=datetime.fromtimestamp(app2.Data.regtime,8);
                        }
                    }
                }
                xmlhttp.open("GET","/my/userinfo",true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
                xmlhttp.send();
            }
            else{
                alert("该功能需要登录，请进行登录或者注册。即将跳转到首页,您可以点击右上角的按钮进行登录/注册");
                window.location.href="../main/index.html"
            }
        },
        de_login(){
            localStorage.setItem("token", '666');
            alert("成功退出登录，即将转跳到首页");
            window.location.href="../main/index.html"
        },
        update_user_info(){
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
                        location.reload();
                    }
                }
            }
            xmlhttp.open("POST","/my/userinfo",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send('name='+app2.Data.name+'&email='+app2.Data.email);
        },
        update_password(){
            if(this.old_password=='') return alert("请输入原密码！")
            if(this.new_password=='') return alert("请输入新密码！")
            if(this.repassword=='') return alert("请重复新密码")
            if(this.new_password==this.old_password) return alert("新旧密码相同！")
            if(this.repassword!=this.new_password) return alert("重复密码和旧密码不一致！")
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
                        alert(response_json.message+',请使用新密码重新登录！');
                        window.location.href="../user/login.html"
                    }
                }
            }
            xmlhttp.open("POST","/my/update_password",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send('old_password='+app2.old_password+'&new_password='+app2.new_password);
        },
    },
})
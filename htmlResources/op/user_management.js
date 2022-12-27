var app2=new Vue({
    el:'.article',
    data:{
        user_list:[],
        select_user:{},
        user_info:{},
        loginer:{},
        //搜索条件
        userID:'',user_name:'',email:'',realname:'',studentID:'',level:'',user_status:'',
        upgrade_2_realname:'',upgrade_2_studentID:'',upgrade_2_restudentID:'',upgrade_2_email:'',
    },
    mounted() {
        this.get_loginer_info()
    },
    methods: {
        get_loginer_info(){
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
                            app2.loginer=response_json.data;
                        }
                    }
                }
                xmlhttp.open("GET","/my/userinfo",true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
                xmlhttp.send();
            }
        },
        get_all_user_list(){
            this.select_user={}
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
                        app2.user_list=JSON.parse(response_json.data);
                    }
                }
            }
            xmlhttp.open("GET","/op/all_user_list",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();

        },
        select(object){
            this.select_user=object;
        },
        reset_search(){
            app2.select_user={};
            app2.user_list=[];
            app2.userID='';
            app2.user_name='';
            app2.email='';
            app2.realname='';
            app2.studentID='';
            app2.kind='';
            app2.user_status='';
        },
        get_user_list(){
            this.select_user={}
            var str='';
            var num=0;
            str='userID='+this.userID+'&name='+this.user_name+'&email='+this.email+'&realname='+this.realname+'&studentID'+this.studentID+'&level='+this.level+'&user_status='+this.user_status
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
                        app2.user_list=JSON.parse(response_json.data);
                    }
                }
            }
            xmlhttp.open("GET","/op/user_list?"+str,false);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();

        },
        reset_password(){
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
                    }
                }
            }
            xmlhttp.open("POST","/op/reset_password",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send('userID='+app2.select_user.userID);
        },
        upgrade_2(){
            if(this.upgrade_2_realname=='')return alert('姓名不能为空！')
            if(this.upgrade_2_studentID=='')return alert('学号不能为空')
            if(this.upgrade_2_restudentID!=this.upgrade_2_studentID)return alert('两次输入学号不一致！')
            if(this.upgrade_2_email!=this.select_user.email)return alert('输入邮箱与用户信息不符合，请核对用户信息！')
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
                        //更新内容
                        var select_user=app2.select_user
                        app2.get_user_list();
                        var i=0;
                        while(i<app2.user_list.length){
                            if(select_user.userID==app2.user_list[i].userID){
                                app2.select_user=app2.user_list[i];
                                break;
                            }
                            i++;
                        }
                    }
                }
            }
            xmlhttp.open("POST","/op/upgrade_2",false);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send('userID='+app2.select_user.userID+'&realname='+app2.upgrade_2_realname+'&studentID='+app2.upgrade_2_studentID);
        },
        update_realinfo(){
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
                        //更新内容
                        var select_user=app2.select_user
                        app2.get_user_list();
                        var i=0;
                        while(i<app2.user_list.length){
                            if(select_user.userID==app2.user_list[i].userID){
                                app2.select_user=app2.user_list[i];
                                break;
                            }
                            i++;
                        }
                    }
                }
            }
            xmlhttp.open("POST","/op/update_realinfo",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send('userID='+app2.select_user.userID+'&realname='+app2.select_user.realname+'&studentID='+app2.select_user.studentID);
        },
        change_user_status(){
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
                        //更新内容
                        var select_user=app2.select_user
                        app2.get_user_list();
                        var i=0;
                        while(i<app2.user_list.length){
                            if(select_user.userID==app2.user_list[i].userID){
                                app2.select_user=app2.user_list[i];
                                break;
                            }
                            i++;
                        }
                    }
                }
            }
            xmlhttp.open("POST","/op/change_user_status",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send('userID='+app2.select_user.userID+'&user_status='+app2.select_user.user_status);
        },
        downgrade_2(){
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
                        //更新内容
                        var select_user=app2.select_user
                        app2.get_user_list();
                        var i=0;
                        while(i<app2.user_list.length){
                            if(select_user.userID==app2.user_list[i].userID){
                                app2.select_user=app2.user_list[i];
                                break;
                            }
                            i++;
                        }
                    }
                }
            }
            xmlhttp.open("POST","/op4/downgrade_2",false);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send('userID='+app2.select_user.userID);
        },
        upgrade_3(){
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
                        //更新内容
                        var select_user=app2.select_user
                        app2.get_user_list();
                        var i=0;
                        while(i<app2.user_list.length){
                            if(select_user.userID==app2.user_list[i].userID){
                                app2.select_user=app2.user_list[i];
                                break;
                            }
                            i++;
                        }
                    }
                }
            }
            xmlhttp.open("POST","/op4/upgrade_3",false);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send('userID='+app2.select_user.userID);

        }
    },
}) 
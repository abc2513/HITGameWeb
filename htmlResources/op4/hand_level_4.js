var app2=new Vue({
    el:'.article',
    data:{
        userID:'',user_name:'',email:'',realname:'',studentID:'',
        giver_studentID:'',giver_password:'',is_check:false,
    },
    methods: {
        hand_level(){
            if(this.userID=='')return alert('用户ID不能为空！')
            if(this.user_name=='')return alert('用户名不能为空！')
            if(this.email=='')return alert('邮箱不能为空！')
            if(this.realname=='')return alert('真实姓名不能为空！')
            if(this.studentID=='')return alert('学号不能为空！')
            if(this.giver_studentID=='')return alert('请输入您的学号！')
            if(this.giver_password=='')return alert('请输入您的密码！')
            if(!this.is_check)return alert('请勾选“我已知晓……”相关内容')
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
            xmlhttp.open("POST","/op4/hand_level_4",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send("giver_password="+app2.giver_password+"&giver_studentID="+app2.giver_studentID+"&userID="+app2.userID+"&name="+app2.user_name+"&email="+app2.email+"&realname="+app2.realname+"&studentID="+app2.studentID);
        }
    },
})
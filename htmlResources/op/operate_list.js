var app2=new Vue({
    el:'.article',
    data:{
        operatorID:'',
        start_date:'2022-12-01',
        start_time:'00:00',
        end_date:'3000-01-01',
        end_time:'23:59',
        router:'',
        operate_body:'',
        log_list:[],
        select_log:{},
    },
    methods: {
        reset_search(){        
            this.operatorID=''
            this.start_date='2022-12-01'
            this.start_time='00:00'
            this.end_date='3000-01-01'
            this.end_time='23:59'
            this.router=''
            this.operate_body=''
        },
        search_log(){
            this.select_log={}
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
                        app2.log_list=[];
                        alert(response_json.message);
                    }
                    else{//成功
                        app2.log_list=JSON.parse(response_json.data);
                    }
                }
            }
            xmlhttp.open("GET","/op/operate_list?start_time="+app2.start_date+' '+app2.start_time+'&end_time='+app2.end_date+' '+app2.end_time+'&operatorID='+app2.operatorID+'&operate_body='+app2.operate_body+'&router='+app2.router,true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        select(i){
            this.select_log=this.log_list[i]
        },
        router_kind(s){
            if(s=='reset_password')return '重置用户密码'
            if(s=='change_user_status')return '变更用户状态'
            if(s=='upgrade_2')return '添加正式成员'
            if(s=='update_realinfo')return '维护实名信息'
            if(s=='upgrade_3')return '任命管理员'
            if(s=='downgrade_2')return '任免管理员'
            if(s=='hand_level_4')return '交接level4'
            if(s=='change_article_status')return '变更文章状态'
            if(s=='set_article_level')return '修改文章评分'
            if(s=='delete_comment')return '隐藏评论'
            if(s=='set_index_show')return '设置首页展示内容'
            return '未知操作类型'
        }
        ,example(){       
            this.operatorID='1000001'
            this.start_date='2022-12-01'
            this.start_time='00:00'
            this.end_date='3000-01-01'
            this.end_time='23:59'
            this.router='reset_password'
            this.operate_body='"userID":"1000014"'
        }
    },
    computed:{

    }
})
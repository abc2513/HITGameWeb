var app2=new Vue({
    el:'.article',
    data:{
        announcement:[], 
        newest_demo:[],
        best_demo:[],
        newest_project:[],
        announcement:[],
        today_visit_time:0,
        total_visit_time:0,
        today_visit_ip:0,
        show:[],
        show_select:0,
    },
    mounted() {
        this.get_index_show();
        this.get_n_best_demo();
        this.get_n_newest_demo();
        this.get_n_newest_project();
        this.get_n_announcement();
        this.get_today_visit_time();
        this.get_today_visit_ip();
        this.change_select();
    },
    methods:{
        get_index_show(){
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
                        //alert(response_json.message);
                        console.log(response_json.message)
                    }
                    else{
                        app2.show=JSON.parse(response_json.data);
                        for(var i=0;i<5;i++){
                            if(app2.show[i].pic==null||app2.show[i].pic=='')
                            app2.show[i].pic='https://s2.loli.net/2022/12/30/bKRuWwvqfGCc19E.png'
                        }
                    }
                }
            }
            xmlhttp.open("GET","/api/index_show",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        select(i){
            this.show_select=i;
        },
        change_select(){
            setTimeout(function () {
                app2.show_select=(app2.show_select+1)%5;
                app2.change_select();
            }, 10000);
        },
        get_n_best_demo(){
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
                        //alert(response_json.message);
                        console.log(response_json.message)
                    }
                    else{
                        app2.best_demo=JSON.parse(response_json.data);
                    }
                }
            }
            xmlhttp.open("GET","/api/n_best_article?kind=1&n=5",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        get_n_newest_demo(){
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
                        //alert(response_json.message);
                        console.log(response_json.message)
                    }
                    else{
                        app2.newest_demo=JSON.parse(response_json.data);
                    }
                }
            }
            xmlhttp.open("GET","/api/n_newest_article?kind=1&n=5",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        get_n_newest_project(){
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
                        //alert(response_json.message);
                        console.log(response_json.message)
                    }
                    else{
                        app2.newest_project=JSON.parse(response_json.data);
                    }
                }
            }
            xmlhttp.open("GET","/api/n_newest_article?kind=2&n=5",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        get_n_announcement(){
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
                        //alert(response_json.message);
                        console.log(response_json.message)
                    }
                    else{
                        app2.announcement=JSON.parse(response_json.data);
                    }
                }
            }
            xmlhttp.open("GET","/api/n_best_article?kind=0&n=5",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        get_today_visit_ip(){
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
                        //alert(response_json.message);
                        console.log(response_json.message)
                    }
                    else{
                        app2.today_visit_ip=JSON.parse(response_json.data);
                    }
                }
            }
            xmlhttp.open("GET","/api/visit_ip_today?router=/main/index.html",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        get_today_visit_time(){
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
                        //alert(response_json.message);
                        console.log(response_json.message)
                    }
                    else{
                        app2.today_visit_time=JSON.parse(response_json.data);
                    }
                }
            }
            xmlhttp.open("GET","/api/visit_time_today?router=/main/index.html",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        
    }
})
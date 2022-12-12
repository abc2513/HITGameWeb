var app2=new Vue({
    el:'.article',
    data:{
        Data:[],
        announcement:[],
        newest_demo:[],
        best_demo:[],
        newest_project:[],
        announcement:[],
        today_visit_time:0,
        total_visit_time:0,
        today_visit_ip:0
    },
    mounted() {
        this.get_all_article();
        this.get_n_best_demo();
        this.get_n_newest_demo();
        this.get_n_newest_project();
        this.get_n_announcement();
        this.get_today_visit_time();
        this.get_today_visit_ip();
    },
    methods:{
        get_all_article(){
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
                        app2.Data=JSON.parse(response_json.data);
                    }
                }
            }
            xmlhttp.open("GET","/api/article_list?kind=0",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
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
        }
    }
})
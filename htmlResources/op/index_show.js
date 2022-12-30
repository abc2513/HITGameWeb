var app2=new Vue({
    el:'.article',
    data:{
        show:[],//articleID
        main_info:[],//pic等内容
        if_ready:false
    },
    mounted() {
        this.get_index_show();
    },
    methods: {
        get_index_show(){
            this.show=[];
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
                        app2.show=JSON.parse(response_json.data);
                    }
                }
            }
            xmlhttp.open("GET","/api/index_show",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        save(i){
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
            xmlhttp.open("POST","/op/set_index_show",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            var tempID=i+1;
            xmlhttp.send("articleID="+app2.show[i].articleID+"&ID="+tempID);
        },
        get_artcle_main_info(i){
            if(app2.show[i]==undefined)return
            this.main_info[i]={}
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
                        var temp=JSON.parse(response_json.data);
                        app2.main_info[i]=temp[0];
                        if(i==4)
                            app2.if_ready=true
                        else
                            app2.get_artcle_main_info(i+1)
                    }
                }
            }
            xmlhttp.open("GET","/api/article_main_info?articleID="+app2.show[i].articleID,true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
    },
    watch:{
        show:{
            //immediate:false,
            deep:true,
            handler(){
                this.if_ready=false
                this.get_artcle_main_info(0);
            },
        }
    }
})
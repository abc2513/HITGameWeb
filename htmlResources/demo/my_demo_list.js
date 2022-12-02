var app2=new Vue({
    el:'.article',
    data:{
        Data:[],

    },
    mounted() {
        this.get_all_article();
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
                        alert(response_json.message);
                    }
                    else{
                        app2.Data=JSON.parse(response_json.data);
                    }
                }
            }
            xmlhttp.open("GET","/my/article_list?kind=1",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        }
    }
})
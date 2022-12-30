var app2=new Vue({
    el:'.article',
    data:{
        title:'新建文章',
        participator:'',
        status:1,
        Data:[{kind:'h3',text:'简介'},{kind:'p',text:''}],
        change_a:0,change_b:0,
        tool_log:'尚未执行任何操作',
        style_str:'color:rgb(86, 89, 255);background-color: rgb(230, 230, 230);',
        style_success:'color:rgb(35, 114, 35);background-color: rgb(208, 245, 220);',
        style_fail:'color:rgb(114, 35, 35);background-color: rgb(245, 208, 208);',
        delect_index:0,
        kind:0,
    },
    methods:{
        post_new_article(){ 
            if(this.participator=='')return alert('参与者不能为空')
            if(this.Data[1].text=='')return alert('简介不能为空')
            if(this.Data.length==0){
                alert('不能提交空文章')
            }
            else{
                console.log("send...");
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
                            alert(response_json.message+'即将跳转到编辑页面');
                            window.location.href="../demo/edit_demo.html?articleID="+response_json.articleID
                        }
                    }
                }
                xmlhttp.open("POST","/my/create_article",true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
                xmlhttp.send("kind="+app2.kind+"&title="+app2.title+"&article_status="+app2.status+"&data="+JSON.stringify(app2.Data)+"&participator="+app2.participator);
            }
        },
    },
    computed:{
        log_text(){
            var d=new Date();
            var h=d.getHours();
            var m=d.getMinutes();
            var s=d.getSeconds();
            if(h<10)h='0'+h;
            if(m<10)m='0'+m;
            if(s<10)s='0'+s;
            return '['+h+":"+m+":"+s+']: '+this.tool_log
        },
        last_index(){
            return this.Data.length-1;
        }
    }
})
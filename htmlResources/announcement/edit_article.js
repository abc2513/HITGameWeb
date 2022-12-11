var app2=new Vue({
    el:'.article',
    data:{
        title:'新建文章(请修改文章标题)',
        status:0, 
        participator:'',
        get_Data:[],
        Data:[],
        change_a:0,change_b:0,
        tool_log:'尚未执行任何操作',
        style_str:'color:rgb(86, 89, 255);background-color: rgb(230, 230, 230);',
        style_success:'color:rgb(35, 114, 35);background-color: rgb(208, 245, 220);',
        style_fail:'color:rgb(114, 35, 35);background-color: rgb(245, 208, 208);',
        delect_index:0,
        kind:0,
    },
    mounted() {
        this.get_my_article()
    },
    methods:{
        add_p(){
            this.Data.push({kind:'p',text:''});
            this.tool_log='添加元素#'+this.last_index+'成功';
            this.style_str=this.style_success
        },
        add_h3(){
            this.Data.push({kind:'h3',text:''});
            this.tool_log='添加元素#'+this.last_index+'成功';
            this.style_str=this.style_success
        },
        add_br(){
            this.Data.push({kind:'br',text:''});
            this.tool_log='添加元素#'+this.last_index+'成功';
            this.style_str=this.style_success
        },
        change_p(){
            var temp;
            if(this.change_a>=0&&this.change_a<this.Data.length&&this.change_b>=0&&this.change_b<this.Data.length){
                if(this.change_a!=this.change_b){
                    this.tool_log='元素#'+this.change_a+'与元素#'+this.change_b+'交换成功！'
                    this.style_str=this.style_success
                    temp=this.Data[this.change_a];
                    this.Data[this.change_a]=this.Data[this.change_b];
                    this.Data[this.change_b]=temp;
                    this.change_a--;this.change_a++;//触发重新渲染
                }
                else{
                    this.tool_log='两个索引值相同，没有改变发生'
                    this.style_str=this.style_fail
                }
            }else{
                this.tool_log='存在索引值越界'
                this.style_str=this.style_fail
            }
        },
        delect_p(){
            if(this.delect_index<0||this.delect_index>=this.Data.length){
                this.tool_log='存在索引值越界';
                this.style_str=this.style_fail
            }else{
                this.Data.splice(this.delect_index,1)
                this.tool_log='删除元素#'+this.delect_index+'成功';
                this.style_str=this.style_success
            }
        },
        delect_this(index){
            if(index<0||index>=this.Data.length){
                alert(存在索引值越界);
                this.tool_log='存在索引值越界';
                this.style_str=this.style_fail
            }else{
                this.Data.splice(index,1)
                this.tool_log='删除元素#'+this.delect_index+'成功';
                this.style_str=this.style_success
            }
        },
        move_up_this(index){
            if(index<0||index>=this.Data.length){
                alert('存在索引值越界');
                this.tool_log='存在索引值越界';
                this.style_str=this.style_fail
            }
            else if(index==0){
                alert('该元素已位于顶部');
                this.tool_log='该元素已位于顶部';
                this.style_str=this.style_fail
            }
            else{
                [this.Data[index-1],this.Data[index]]=[this.Data[index],this.Data[index-1]]
                this.tool_log='上移元素#'+index+'成功';
                this.style_str=this.style_success;
                this.change_a++;this.change_a--;
            }
        },
        move_down_this(index){
            if(index<0||index>=this.Data.length){
                alert('存在索引值越界');
                this.tool_log='存在索引值越界';
                this.style_str=this.style_fail
            }
            else if(index+1==this.Data.length){
                alert('该元素已位于底部');
                this.tool_log='该元素已位于顶部';
                this.style_str=this.style_fail
            }
            else{
                [this.Data[index+1],this.Data[index]]=[this.Data[index],this.Data[index+1]]
                this.tool_log='下移元素#'+index+'成功';
                this.style_str=this.style_success;
                this.change_a++;this.change_a--;
            }
        },
        new_this(index){
            if(index<0||index>=this.Data.length){
                alert('存在索引值越界');
                this.tool_log='存在索引值越界';
                this.style_str=this.style_fail
            }
            else{
                this.add_p();
                for(var i=this.Data.length-1;i>index+1;i--){
                    [this.Data[i],this.Data[i-1]]=[this.Data[i-1],this.Data[i]]
                }
                this.tool_log='在元素#'+index+'后添加元素成功';
                this.style_str=this.style_success;
                this.change_a++;this.change_a--;
            }
        },
        new_this_h3(index){
            if(index<0||index>=this.Data.length){
                alert('存在索引值越界');
                this.tool_log='存在索引值越界';
                this.style_str=this.style_fail
            }
            else{
                this.add_h3();
                for(var i=this.Data.length-1;i>index+1;i--){
                    [this.Data[i],this.Data[i-1]]=[this.Data[i-1],this.Data[i]]
                }
                this.tool_log='在元素#'+index+'后添加元素成功';
                this.style_str=this.style_success;
                this.change_a++;this.change_a--;
            }
        },
        new_this_br(index){
            if(index<0||index>=this.Data.length){
                alert('存在索引值越界');
                this.tool_log='存在索引值越界';
                this.style_str=this.style_fail
            }
            else{
                this.add_br();
                for(var i=this.Data.length-1;i>index+1;i--){
                    [this.Data[i],this.Data[i-1]]=[this.Data[i-1],this.Data[i]]
                }
                this.tool_log='在元素#'+index+'后添加元素成功';
                this.style_str=this.style_success;
                this.change_a++;this.change_a--;
            }
        },
        post_edit_article(){
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
                            alert(response_json.message);
                        }
                    }
                }
                xmlhttp.open("POST","/my/update_article?articleID="+app2.get_Data.articleID,true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
                xmlhttp.send("kind="+app2.kind+"&title="+app2.title+"&article_status="+app2.status+"&data="+JSON.stringify(app2.Data));
            }
        },
        get_my_article(){
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
                    else{
                        app2.get_Data=JSON.parse(response_json.data);
                        app2.Data=JSON.parse(app2.get_Data.data);
                        app2.title=app2.get_Data.title;
                        app2.status=app2.get_Data.article_status;
                        app2.participator=app2.get_Data.participator;
                    }
                }
            }
            xmlhttp.open("GET","/my/article?articleID="+cs.articleID,true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        
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
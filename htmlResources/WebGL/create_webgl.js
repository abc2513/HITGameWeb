var app2=new Vue({
    el:'.article',
    data:{
        have_click:false,
        load_progress:0
    },
    methods:{
        post_WebGL(){ 
            if(this.have_click){
                alert('你已经在上传了！请等待上传或者刷新页面')
                return
            }
            var fileObj=document.getElementById("file").files[0]
            if(fileObj==undefined){
                alert('您未选择任何文件！')
                return
            }
            if(!fileObj.name.match(/.zip$/)){
                alert('您只能上传zip文件！')
                return
            }
            this.have_click=true
            var form = new FormData();
            form.append("file",fileObj)
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
                        alert(response_json.message+',即将跳转');
                        window.location.href="../webgl/"+response_json.data
                    }
                }
            }
            xmlhttp.open("POST","/my/upload_webgl",true);
            xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.setRequestHeader("enctype","multipart/form-data");
            xmlhttp.upload.addEventListener("progress",function progressFunction(evt) {
                var progressBar = document.getElementById("progressBar");
                var percentageDiv = document.getElementById("percentage");
                if (evt.lengthComputable) {
                    progressBar.max = evt.total;
                    progressBar.value = evt.loaded;
                    percentageDiv.innerHTML = Math.round(evt.loaded / evt.total * 100) + "%";
                    app2.load_progress=Math.round(evt.loaded / evt.total * 100)
                }
            } , false);
            xmlhttp.timeout=0
            xmlhttp.send(form);
        },
    },
    computed:{
    }
})
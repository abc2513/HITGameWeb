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
        }
    }
}
xmlhttp.open("POST","/api/login",true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
xmlhttp.send();

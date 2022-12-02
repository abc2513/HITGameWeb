Vue.config.productionTip = false;//阻止生成非生产环境提示
var danger_char=RegExp(
    /[(\')(\")(\<)]+/
);
var app2=new Vue({
    el:'#reg',
    data(){
        return {
            name:'',
            password:'',
            repassword:'',
            email:'',
            agree:false,
            result_name:'',
            result_password:'',
            result_repassword:'',
            result_email:'',
            result_kind_name:'',
            result_kind_password:'',
            result_kind_repassword:'',
            result_kind_email:'',
        }
    },
    computed:{
        
    },
    methods: {
        send_reg_info(){
            if(app2.result_kind_name=='pass'&&app2.result_kind_password=='pass'&&app2.result_kind_repassword=='pass'&&app2.result_kind_email=='pass'){
                if(this.agree!=true){
                    alert("您尚未阅读并勾选《用户服务协议和隐私政策》！");
                    return;
                }
                var xmlhttp;
                if (window.XMLHttpRequest)
                  xmlhttp=new XMLHttpRequest();
                else
                  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
                xmlhttp.onreadystatechange=function()
                {
                    if (xmlhttp.readyState==4 && xmlhttp.status==200)
                    {
                        console.log(xmlhttp.responseText);
                        response_json=JSON.parse(xmlhttp.responseText);
                        if(response_json.status){//注册失败==1
                            alert(response_json.message);
                            //window.location.href="./login.html"
                        }
                        else{//注册成功！
                            alert(response_json.message+"。即将转跳到登录页面");
                            window.location.href="./login.html"
                        }
                    }
                }
                xmlhttp.open("POST","/api/reguser",true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xmlhttp.send("name="+app2.name+"&password="+app2.password+"&email="+app2.email);
            }
            else{
                alert("请检查输入信息！");
            }
        }
    },
    watch:{
        name:{
            handler(newValue, oldValue){
                if(newValue.length<2){
                    this.result_name='长度小于两个字符'
                    this.result_kind_name='not_pass'
                }
                else if(newValue.length>20){
                    this.result_name='长度超过20个字符'
                    this.result_kind_name='not_pass'
                }
                else{
                    this.result_name='PASS'
                    this.result_kind_name='pass'
                }
            }
        },
        password:{
            handler(newValue, oldValue){
                if(newValue.length<6){
                    this.result_password='长度小于6个字符'
                    this.result_kind_password='not_pass'
                }
                else if(newValue.length>20){
                    this.result_password='长度超过20个字符'
                    this.result_kind_password='not_pass'
                }
                else{
                    this.result_password='PASS'
                    this.result_kind_password='pass'
                }
            }
        },
        repassword:{
            handler(newValue,oldValue){
                if(newValue!=this.password){
                    this.result_repassword="两次输入密码不一致！"
                    this.result_kind_repassword='not_pass'
                }
                else{
                    this.result_repassword="PASS"
                    this.result_kind_repassword='pass'
                }
            }
        },
        email:{
            handler(newValue,oldValue){
                if(!newValue.match(/^\w+@\w+\.\w+$/i)){
                    this.result_email="邮箱格式错误!"
                    this.result_kind_email='not_pass'
                }
                else{
                    this.result_email="PASS"
                    this.result_kind_email='pass'
                }
            }
        },
    }
})

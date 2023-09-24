var app2=new Vue({
    el:'.article',
    data:{
        Data:[],
        login_out_status:false
    },
    mounted() {
        this.get_all_article();
    },
    methods:{
        login_out(){
            localStorage.setItem("token", '666');
            this.login_out_status=true
        },
    }
})
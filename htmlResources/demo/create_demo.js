var app2=new Vue({
    el:'.article',
    data:{
        title:'新建文章(请修改文章标题)',
        status:0,
        Data:[{kind:'h3',text:'小标题'},{kind:'p',text:'正文段落'}],
    },
    methods:{
        add_p(){
            this.Data.push({kind:'p',text:''})
        },
        post_article(){
            
        }
    }
})
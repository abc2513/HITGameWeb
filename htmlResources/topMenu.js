Vue.config.productionTip = false
const top_menu = Vue.extend({
    template:`
    <div class="top_menu">
        <ul>
            <li v-for="(p,index) of li_text" :key="index" class="left">
                <a :href=li_href[index]>{{li_text[index]}}</a>
            </li>
            <li class="right" id="login_div"><a href="../user/login.html" id="login_a">登录</a></li>
            <li class="right" id="reg_div"><a href="../user/reg.html" id="reg_a">注册</a></li>
            <li class="right" id="myaccount_div"></li>
            <li class="right" id="mycenter_div"></li>
            <li class="right" id="hello_div"></li>
        </ul>
    </div>
    `,
    data(){
        return {
            li_text:['首页','DEMO展示','团队招人','SMMS图床'],
            li_href:['../main/index.html','../demo/guide.html','../project/guide.html','../main/smms.html'],
            is_login:false
        }
    },
    computed: {
        check_login(){
            get:{
            }
        }
    },
})
const top_menu_shadow= Vue.extend({
    template:`
    <div class="top_menu_shadow">-</div>
    `,
    data(){
        return {
            
        }
    }
});
const running= Vue.extend({
    template:`
    <span class="running">该程序/系统可提供访问 ：）</span>
    `,
    data(){
        return {
            
        }
    }
});
const not_running= Vue.extend({
    template:`
    <span class="not_running">该程序/系统已脱离部署 :（</span>
    `,
    data(){
        return {
            
        }
    }
})

Vue.component('top_menu',top_menu)
Vue.component('running',running)
Vue.component('not_running',not_running)
Vue.component('top_menu_shadow',top_menu_shadow)
var app=new Vue({
    el:'#top_menu',
})
Vue.config.productionTip = false
const top_menu = Vue.extend({
    template:`
    <div class="top_menu">
        <ul>
            <div class="dropdown">
                <button class="dropbtn">主页</button>
                <div class="dropdown-content" id="top_menu_c1">
                    <a href="../main/index.html">主页</a>
                    <a href="../announcement/guide.html">公告列表</a>
                </div>
            </div>
            <div class="dropdown">
                <button class="dropbtn">DEMO文章</button>
                <div class="dropdown-content">
                    <a href="../demo/guide.html">DEMO列表</a>
                    <a href="../demo/create_demo.html">新建DEMO</a>
                    <a href="../demo/my_demo_list.html">我的DEMO</a>
                </div>
            </div>
            <div class="dropdown">
                <button class="dropbtn">项目招人</button>
                <div class="dropdown-content">
                    <a href="../project/guide.html">项目列表</a>
                    <a href="../project/create_article.html">新建项目</a>
                    <a href="../project/my_article_list.html">我的项目</a>
                </div>
            </div>
            <div class="dropdown">
                <button class="dropbtn">在线WebGL</button>
                <div class="dropdown-content">
                    <a href="../WebGL/guide.html">WebGL列表</a>
                    <a href="../WebGL/create_webgl.html">上传WebGL</a>
                    <a href="../WebGL/my_webgl_list.html">我的WebGL</a>
                </div>
            </div>
            <div class="dropdown">
                <button class="dropbtn">其他</button>
                <div class="dropdown-content">
                    <a href="../main/用户手册.html">用户手册</a>
                    <a href="../main/smms.html">SMMS图床</a>
                    <a href="../main/web_panel.html">网页访问统计</a>
                    <a href="../main/article_panel.html?articleID=1000005">文章阅读统计</a>
                </div>
            </div>
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
            li_text:['DEMO展示','团队招人',],
            li_href:['../demo/guide.html','../project/guide.html',''],
            is_login:false
        }
    },
    computed: {
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
Vue.component('top_menu',top_menu)
Vue.component('top_menu_shadow',top_menu_shadow)
var app=new Vue({
    el:'#top_menu',
})
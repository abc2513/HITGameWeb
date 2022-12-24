var chart_data={
    // 要创建的图表类型
    type: 'line',
    // 数据集
    data: {
        //labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "网站访问总数",
                backgroundColor: 'rgba(255, 255, 255,0)',
                borderColor: 'rgba(36, 138, 222, 0.6)',
                data: [{x:"2022/12/20",y:0},{x:"2022/12/22",y:12},{x:"2022/12/23",y:9},],
                yAxisID:'y1'
            },
            {
                label: "指定网页访问次数",
                backgroundColor: 'rgba(255, 255, 255,0)',
                borderColor: '#0f87ff',
                data: [{x:"2022/12/20",y:0},{x:"2022/12/22",y:13},{x:"2022/12/23",y:15},],
                yAxisID:'y1'
            },
            {
                label: "网站访问IP总数",
                backgroundColor: 'rgba(255, 255, 255,0)',
                borderColor: 'rgba(22, 206, 42,0.6)',
                data: [{x:"2022/12/20",y:0},{x:"2022/12/22",y:12},{x:"2022/12/23",y:9},],
                yAxisID:'y2'
            },
            {
                label: "指定网页访问IP数",
                backgroundColor: 'rgba(255, 255, 255,0)',
                borderColor: 'rgba(22, 206, 42,1)',
                data: [{x:"2022/12/20",y:0},{x:"2022/12/22",y:12},{x:"2022/12/23",y:9},],
                yAxisID:'y2'
            },
            
        ],
    },
    // 配置选项
    options: {
        maintainAspectRatio:false,
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    //unit: 'day'
                }
            }],
            yAxes: [{
                type: 'linear', 
                display: true,
                position: 'left',
                id: 'y1',
                min:0
            }, {
                type: 'linear', 
                display: true,
                position: 'left',
                id: 'y2',
                min:0
            }],
    }
}
}
var ctx;
var chart;
var today_date=new Date();
var today_month=today_date.getMonth()+1
var start_Date=new Date();
var app2=new Vue({
    el:'.article',
    data:{
        visit_time_list:[[],[],[],[]],//次数、IP
        start_date:'2022-12-10',
        end_date:today_date.getFullYear()+'-'+today_month+'-'+today_date.getDate(),
        router:'/main/index.html',
    },
    mounted() {
        this.draw_chart();
        this.get_visit_time_list_all();
    },
    methods: {
        draw_chart(){
            ctx = document.getElementById('myChart').getContext('2d');
            chart = new Chart(ctx,chart_data);
        },
        update_chart(){
            //读取数据、补充0并转化为坐标点、更新图
            for(var i=0;i<4;i++){
                chart_data.data.datasets[i].data=[]
                var j=0//srcdata
                var k=0//dataset
                var cal_time=new Date(this.start_date)
                var data_time
                var end_date=new Date(this.end_date)
                if(cal_time.getTime()>=end_date.getTime()){
                    alert('开始时间必须早于结束时间')
                    return;
                }
                while(end_date.getTime()!=cal_time.getTime()){
                    cal_time=new Date(app2.start_date);
                    cal_time.setDate(cal_time.getDate()+k)
                    if(this.visit_time_list[i].length>j)
                        data_time=new Date(this.visit_time_list[i][j].visit_date)
                    else
                        data_time=new Date("2000-10-10 01:00:00")//不可能的时间
                    if(data_time.getTime()==cal_time.getTime()){
                        chart_data.data.datasets[i].data[k]={
                            x:data_time,
                            y:this.visit_time_list[i][j].visit_num
                        }
                        j++;
                        k++;
                    }
                    else{
                        chart_data.data.datasets[i].data[k]={
                            x:cal_time,
                            y:0
                        }
                        k++;
                    }
                }
            }
            //console.log(chart_data.data.datasets[0].data)
            window.chart.update()
        },
        get_visit_time_list_all(){
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
                        //alert(response_json.message);
                        console.log(response_json.message)
                    }
                    else{
                        app2.visit_time_list[0]=response_json.data;
                        //console.log(response_json.data)
                        
                        app2.get_visit_time_list();
                    }
                }
            }
            xmlhttp.open("GET","/api/visit_time_list_all?start_time="+this.start_date+" 00:00:00"+"&end_time="+this.end_date+" 23:59:59",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        get_visit_time_list(){
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
                        //alert(response_json.message);
                        console.log(response_json.message)
                    }
                    else{
                        app2.visit_time_list[1]=response_json.data;
                        //console.log(response_json.data)
                        
                        app2.get_visit_ip_list_all();
                    }
                }
            }
            xmlhttp.open("GET","/api/visit_time_list?router="+this.router+"&start_time="+this.start_date+" 00:00:00"+"&end_time="+this.end_date+" 23:59:59",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        get_visit_ip_list_all(){
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
                        //alert(response_json.message);
                        console.log(response_json.message)
                    }
                    else{
                        app2.visit_time_list[2]=response_json.data;
                        //console.log(response_json.data)
                        app2.get_visit_ip_list();
                    }
                }
            }
            xmlhttp.open("GET","/api/visit_ip_list_all?start_time="+this.start_date+" 00:00:00"+"&end_time="+this.end_date+" 23:59:59",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        get_visit_ip_list(){
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
                        //alert(response_json.message);
                        console.log(response_json.message)
                    }
                    else{
                        app2.visit_time_list[3]=response_json.data;
                        //console.log(response_json.data)
                        app2.update_chart();
                    }
                }
            }
            xmlhttp.open("GET","/api/visit_ip_list?router="+this.router+"&start_time="+this.start_date+" 00:00:00"+"&end_time="+this.end_date+" 23:59:59",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xmlhttp.setRequestHeader("Authorization",localStorage.getItem("token"));
            xmlhttp.send();
        },
        search(){
            this.get_visit_time_list_all();
        }
    },
})

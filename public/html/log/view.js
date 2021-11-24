webix.ready(function(){
	if (!webix.env.touch && webix.env.scrollSize)
        webix.CustomScroll.init();
	webix.ui({
		rows:[
            navBar,
            logTable,
		]
	});
});

var navBar = {
    view:"toolbar",
    css:"pasteldarkgreen",
    cols:[
        createHeader("Log",{css:"whitetext"}),
        {
            view:"datepicker",
            width:150,
            value:new Date(),
            format:"%d/%m/%Y",
            on:{
                onChange:function(){
                    let date = new Date(this.getValue());
                    let d = date.getDate();
                    let m = date.getMonth()+1;
                    let y = date.getFullYear();
                    let link = "/log/get/"+String(y).padStart(4,'0')+String(m).padStart(2,'0')+String(d).padStart(2,'0');
                    $$("logTable").clearAll();
                    $$("logTable").load(link);
                }
            }
        }
    ]
}

var logTable = {
    view:"datatable",
    id:"logTable",
    url:"/log/get",
    css:"rows",
    columns:[
        {id:"timestamp",header:["Timestamp",{content:"textFilter"}],width:200},
        {id:"ip",header:["IP",{content:"textFilter"}],width:100},
        {id:"status",header:["Status",{content:"textFilter"}],width:100},
        {id:"method",header:["Method",{content:"textFilter"}],width:100},
        {id:"path",header:["Path",{content:"textFilter"}],minWidth:200,fillspace:true},
        {id:"queryParams",header:["Params",{content:"textFilter"}],width:300},
        {id:"latency",header:["Latency",{content:"textFilter"}],width:100},
    ],
}



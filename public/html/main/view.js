webix.ready(function(){
	if (!webix.env.touch && webix.env.scrollSize)
        webix.CustomScroll.init();
	webix.ui({
		rows:[
            // center,
            postform,
		]
	});
});
console.log(onl_const.api);
var loginForm = {
    view:"form",
    type:"clean",
    borderless:true,
    elements:[{
        rows:[
            {view:"text",labelWidht:80,labelPosition:"top",labelAlign:"left",width:300,label:"Username",name:"onl_username"},
            {view:"text",labelWidht:80,labelPosition:"top",labelAlign:"left",width:300,label:"Password",name:"onl_password",type:"password"},
            {height:20},
            // {view:"button",type:"icon",icon:"fas fa-sign-in-alt",width:150,align:"center",label:"เข้าสู่ระบบ",css:"webix_primary",click:login},
            {view:"button",type:"icon",icon:"fas fa-sign-in-alt",width:150,align:"center",label:"lastdoc",css:"webix_primary",click:lastdoc},
            {view:"button",type:"icon",icon:"fas fa-sign-in-alt",width:150,align:"center",label:"save",css:"webix_primary",click:save},
        ]
    }]
}

var postform = {
    cols:[
        {},
        {
            view:"form",
            id:"lastdoc_form",
            rows:[
                {view:"text",width:180,labelWidth:80,labelAlign:"right",label:"CTRLNO",name:"CTRLNO",value:"sql2excel"},
                {view:"text",width:180,labelWidth:80,labelAlign:"right",label:"PREFIX",name:"PREFIX",value:"REP6499"},
                {},
                {view:"button",label:"Find last doc",width:150,align:"center",css:"webix_primary",click:lastdoc},
            ]
        },
        {
            view:"form",
            id:"sql2excel_form",
            rows:[
                {width:600,cols:[
                    {view:"text",labelWidth:110,labelAlign:"right",label:"DOC_NO",name:"DOC_NO",value:"NEW"},
                    {view:"text",labelWidth:110,labelAlign:"right",label:"REP_NAME",name:"REP_NAME"},
                ]},
                {width:600,cols:[
                    {view:"text",labelWidth:110,labelAlign:"right",label:"CREATE_BY",name:"CREATE_BY"},
                    // {view:"datepicker",labelWidth:110,labelAlign:"right",label:"CREATE_DATE",name:"CREATE_DATE",value:new Date()},
                ]},
                {view:"textarea",labelWidth:110,labelAlign:"right",label:"SQL_TEXT",name:"SQL_TEXT"},
                {cols:[
                    {},
                    {view:"button",label:"Save2excel",width:150,align:"center",css:"webix_primary",click:save},
                    {view:"button",label:"Full Process",width:150,align:"center",css:"webix_danger",click:fullSave},
                    {},
                ]},
            ]
        },
        {},
    ]
}

var center = {
    rows:[
        {},
        {cols:[
            {},
            loginForm,
            {},
        ]},
        {},
    ]
}

function lastdoc(){
    let lasdoc_data = $$("lastdoc_form").getValues();
    console.log(lasdoc_data);
    if ((lasdoc_data.CTRLNO == "")||(lasdoc_data.PREFIX == "")){
        webix.message("please enter lastdoc data");
    }else{
        webix.ajax().post("/api/112/cud/lastdoc",lasdoc_data,function(text){
            let res = JSON.parse(text);
            console.log(text);
            if (res.status=="complete"){
                $$("sql2excel_form").setValues({DOC_NO:res.lastdoc},true)
            }
        });
    }
}

function save(){
    let data = $$("sql2excel_form").getValues();
    data.pk = "DOC_NO";
    let post = {
        OPER:"upd",
        TABLE:"sql2excel",
    }
    post.DATA = JSON.stringify(data);
    webix.ajax().post("/api/112/cud/up",post,function(text){
        console.log(text);
    });
}

function fullSave(){
    let data = $$("sql2excel_form").getValues();
    data.pk = "DOC_NO";
    let post = {
        OPER:"upd",
        TABLE:"sql2excel",
        CTRLNO:"sql2excel",
        PREFIX:"REP6499",
    }
    post.DATA = JSON.stringify(data);
    webix.ajax().post("/api/112/cud/up2",post,function(text){
        console.log(text);
    });
}

// webix.ajax("someA.php").then(function(dataA){
//     return webix.ajax("someB.php",{ id:dataA.id });
// }).then(function(dataB){
//     return webix.ajax("someC.php",{ userdata:dataB.user })
// }).then(function(dataC){
//     $$("grid").parse(dataC.json());
// });

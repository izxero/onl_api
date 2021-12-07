webix.ready(function(){
	if (!webix.env.touch && webix.env.scrollSize)
        webix.CustomScroll.init();
	webix.ui({
		rows:[
            center,
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

function save(){
    let data = {
        ro_CLIENT_NAME:"Somchai",
        pk:"DOC_NO",
        DOC_NO:"NEW",
        CREATE_DATE:new Date(),
        CREATE_BY:"Alex"
    }
    let post = {
        OPER:"upd",
        TABLE:"sql2excel",
    }
    post.DATA = JSON.stringify(data);
    // webix.ajax().post("/api/112/cud/lastdoc",LASTDOC_DATA).then(function(lastdoc){
    //     data.DOC_NO = lastdoc;
    //     post.DATA = JSON.stringify(data);
    // });
    // console.log(post);
    // ajax login
    // get lastdoc
    //
    webix.ajax().post("/api/112/cud/up",post,function(text){
        console.log(text);
    });
}

function lastdoc(){
    let post = {
        CTRLNO:"LOAD_COUNTER",
        PREFIX:"BAY20080206",
    }
    webix.ajax().post("/api/112/cud/lastdoc",post,function(text){
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

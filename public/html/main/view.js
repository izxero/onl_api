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
            {view:"button",type:"icon",icon:"fas fa-sign-in-alt",width:150,align:"center",label:"เข้าสู่ระบบ",css:"webix_primary",click:login},
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

function login(){
    webix.ajax("/api/11/query",function(text){
        console.log(text);
    });
}
class webixset {
	constructor(name){
		this.name = name;
		this.tableid = name+"_table";
		this.formid = name+"_form";
		this.windowid = name+"_window";
		this.navbar = name+"_navbar";
	}
	createNavbar(property){
		let temp = {
			view:"toolbar",
			id:this.navbar,
			css:"pastelgreen",
			cols:[
				createHeader(this.name,{css:"transparentbackground boldtext"}),
			]
		}
		if(property){
			for(const [key,value] of Object.entries(property)){
				temp[key] = value;
			}
		}
		return temp;
	}
	createTable(property){
		let temp = {
			view:"datatable",
			id:this.tableid,
			autoConfig:true,
			select:true,
			css:"greyrows",
		}
		if(property){
			for(const [key,value] of Object.entries(property)){
				temp[key] = value;
				if(key=="columns"){
					delete temp.autoConfig;
				}
			}
		}
		return temp;
	}
	createForm(form_object,property){
		let temp = {
			view:"form",
			id:this.formid,
			elements:[form_object]
		}
		if(property){
			for(const [key,value] of Object.entries(property)){
				temp[key] = value;				
			}
		}
		return temp;
	}
	createFormWindow(form,property){
		let window_id = this.windowid;
		let form_id = this.formid;
		let temp = {
			view:"window",
			id:this.windowid,
			position: function(state) {
				state.width = state.maxWidth * 0.8;
				state.height = state.maxHeight * 0.8;
				state.left = (state.maxWidth - state.width) / 2;
				state.top = (state.maxHeight - state.height) / 2;
			},
			head:{
				css:"pastelpurple",
				cols:[
				createHeader(this.formid,{css:"whitetext"}),
				{view:"button",width:100,label:"Cancel",css:"mybutton",click:function(){
					$$(form_id).clear();
					$$(window_id).hide();
				}}
			]},
			body:form
		}
		if(property){
			for(const [key,value] of Object.entries(property)){
				temp[key] = value;
			}
		}
		let w_temp = webix.ui(temp).hide();
		return w_temp;
	}
}
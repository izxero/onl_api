//Change Selected datepicker to show in Bhuddist Era Format 
function datepickerBEformat(obj){
	let date = obj.getDate();
	let month = obj.getMonth()+1;
	let month_2d = pad(month,2);
	let year_ce = obj.getFullYear();
	let year_be = year_ce+543;
	return date+"/"+month_2d+"/"+year_be;
}

//Loading Screen template
var loadtemp1 = `<div class="allcenter"><p class="text-center">กรุณารอสักครู่</p><br/><div class="loadingpreloader text-center"><div class="spinner-grow text-success" role="status">
			<span class="sr-only">Loading...</span>
			</div>
			<div class="spinner-grow text-danger" role="status">
			<span class="sr-only">Loading...</span>
			</div>
			<div class="spinner-grow text-warning" role="status">
			<span class="sr-only">Loading...</span>
			</div></div></div>`;

webix.ui({
	view:"popup",
	id:"loading_screen1",
	position:"center",
	fullscreen:true,
	body:{
		template:loadtemp1
	}
}).hide();
function loadingscreen1(factor){
	if(factor=="show"){
		$$("loading_screen1").show();
	}else if(factor=="hide"){
		$$("loading_screen1").hide();
	}
}
//Loading Screen template2
var loadtemp2 = `<div class="allcenter"><p class="text-center">กรุณาสักครู่</p><br><div class="loader"><div class="inner_loader"></div><div class="inner_loader"></div><div class="inner_loader"></div><div class="inner_loader"></div><div class="inner_loader"></div></div></div>`;
webix.ui({
	view:"popup",
	id:"loading_screen2",
	position:"center",
	fullscreen:true,
	body:{
		template:loadtemp2
	}
}).hide();
function loadingscreen2(factor){
	if(factor=="show"){
		$$("loading_screen2").show();
	}else if(factor=="hide"){
		$$("loading_screen2").hide();
	}
}

//Show and Hide Elements
function showAndHide(show_id,hide_id){
	if(show_id){
		var show_items = show_id.split(",");
		for(var i=0;i<show_items.length;i++){
			$$(show_items[i]).show();
		}
	}
	if(hide_id){
		var hide_items = hide_id.split(",");
		for(var i=0;i<hide_items.length;i++){
			$$(hide_items[i]).hide();
		}
	}
}

//Insert 0 infront for size digit eg. from pad(2013,7) -> 0002013 
function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

//add item to scrollview
function addScrollView(item){
	var temp = {
		view:"scrollview",
		borderless:true,
		scroll:"y",
		body:item
	}
	return temp;
}

//set and get popup of the "set_id" to call for popup
function getPopup(set_id,item,properties){
	var tempInside = {
		view:"popup",
		id:set_id,
		body:{
			cols:[
				{width:10},
				{
					rows:[
						{height:10},
						item,
						{height:10},
					]
				},
				{width:10},
			]
		}
	}
	if(properties){
		for(const [key,value] of Object.entries(properties)){
			tempInside[key] = value;
		}
	}
	var temp = webix.ui(tempInside).hide();
	return temp;
}

function getWindow(set_id,item,properties){
	var tempInside = {
		view:"window",
		id:set_id,
		head:{
			cols:[
				{},
				{view:"icon",icon:"fas fa-times",click:function(){
					$$(set_id).hide();
				}},
			]
		},
		body:{
			cols:[
				{width:10},
				{
					rows:[
						{height:10},
						item,
						{height:10},
					]
				},
				{width:10},
			]
		}
	}
	if(properties){
		for(const [key,value] of Object.entries(properties)){
			tempInside[key] = value;
		}
	}
	var temp = webix.ui(tempInside).hide();
	return temp;
}

function tableToArray(table_id,tablename,tablepk,tableLastDoc,tablefk){
	$$(table_id).filter();
	var i=0;
	var arrayData = [];
	$$(table_id).eachRow(function(id){
		var values = $$(table_id).getItem(id);
		arrayData[i] = values;
		arrayData[i].table_name = tablename;
		arrayData[i].table_pk = tablepk;
		arrayData[i].table_fk = tablefk;
		arrayData[i].table_lastDoc = tableLastDoc;

		i++;
	});
	return arrayData;
}

function getRandomNumber(digit){
	let current_multiplyer = "1";
	for(var i=0;i<digit;i++){
		current_multiplyer = current_multiplyer+"0";
	}
	let result = Math.random()*parseInt(current_multiplyer);
	result = parseInt(result);
	return result;
}

function getNewRandom(digit){
	let datenow = Date.now();
	let randomnumber = getRandomNumber(digit);
	let text = "new_"+datenow+"_"+randomnumber;
	return text;
}

function addToObject(object_variable,table_name,table_pk,table_LastDoc,table_fk){
	object_variable.table_name = table_name;
	object_variable.table_pk = table_pk;
	object_variable.table_lastDoc =  table_LastDoc;
	object_variable.table_fk = table_fk;
	return object_variable;
}

function loadNewTable(values){
	return webix.ajax().post(values.phpLink,values);
}

function loadTable(phpsource,table_id){
	$$(table_id).clearAll();
	$$(table_id).load(phpsource);
}

function loadTableQuery(php,values,to_table_id){
	webix.ajax().post(php,values,function(text){
		$$(to_table_id).clearAll();
		$$(to_table_id).parse(text);
	});
}

function clearTable(table_id){
	if(table_id){
		var clear_items = table_id.split(",");
		for(var i=0;i<clear_items.length;i++){
			$$(clear_items[i]).clearAll();
		}
	}
}

function easyTable(id_of_this,data_of_this,table_properties){
	var tempData = tableTemplate(id_of_this,data_of_this,table_properties);
	var temp = {
		id:id_of_this,
		rows:[
			tempData.navbar,
			tempData.table
		]
	}
	return temp;
}

function tableTemplate(id_of_this,data_of_this,table_properties){
	var temp = {
		navbar:{
			id:id_of_this+"_navbar",
			cols:[
				{view:"template",type:"header",template:id_of_this,borderless:true},
			]
		},
		table:createTable(id_of_this,data_of_this,table_properties),
	}
	return temp;
}

function createTable(table_id,data_of_this,properties){
	var temp = {
		id:table_id+"_table",
		view:"datatable",
	}
	if(data_of_this!=""){
		temp.data = loadNewTable(data_of_this);
	}
	for(const [key,value] of Object.entries(properties)){
		temp[key] = value;
	}
	return temp;
}


//onMouseOver function
webix.event(document, "mouseover", function(e){
	if(e.target instanceof HTMLButtonElement){//or check for class
	  const button = $$(e);
	  if(button.callEvent){
		button.callEvent("onMouseOver",[]);
	  }
	}
  });

var relationx1 = {
	"master":{
		"d1":"",
		"d2":{
			"d2-1":"",
			"d2-2":{
				"d2-1-1":"",
				"d2-2-2":"",
			}
		}
	}
};

var relationx2 = {
	"master":{
		"detail1":{
			"detail1_sub1":"",
		},
		"detail2":{
			"detail2_sub1":"",
			"detail2_sub2":"",
		},
	}
}

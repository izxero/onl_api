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

function loadNewTable(values){
	return webix.ajax().post(values.php,values);
}

function reloadTable(table_id,values){
	$$(table_id).clearAll();
	webix.ajax().post(values.php,values,function(text){
		$$(table_id).parse(text);
	})
}

function loadQueryTable(values,to_table_id){
	webix.ajax().post(values.php,values,function(text){
		$$(to_table_id).clearAll();
		$$(to_table_id).parse(text);
	});
}

function addToObject(object_variable,table_name,table_pk,table_LastDoc,table_fk){
	object_variable.table_name = table_name;
	object_variable.table_pk = table_pk;
	object_variable.table_lastDoc =  table_LastDoc;
	object_variable.table_fk = table_fk;
	return object_variable;
}

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

function getWindow(window_id,item,property){
	var temp = {
		view:"window",
		id:window_id,
		head:{
			cols:[
				{view:"template",type:"header",template:window_id,borderless:true},
				{view:"icon",icon:"fas fa-times",click:function(){
					$$(window_id).hide();
				}}
			]
		},
		body:item,
	}
	if(property){
		for(const [key,value] of Object.entries(property)){
			temp[key] = value;
		}
	}
	var tempWindow = webix.ui(temp).hide();
	return tempWindow;
}

function valuesToForm(items,to_form_id){
	$$(to_form_id).setValues(items);
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

function addToList(form_id,datatable_id,pk){
	var values = $$(form_id).getValues();
	$$(datatable_id).add(values,0);
	var newValues = {
		worker_id:getNewRandom(5),
		element_id:values.element_id,
		user_id:values.user_id,
	}
	$$(form_id).setValues(newValues);
}

function clearForms(ids){
	if(ids){
		var items = ids.split(",");
		for(var i=0;i<items.length;i++){
			$$(items[i]).clear();
		}
	}
}

function clearTables(ids){
	if(ids){
		var items = ids.split(",");
		for(var i=0;i<items.length;i++){
			$$(items[i]).clearAll();
		}
	}
}

function addToObject(object_variable,table_name,table_pk,table_LastDoc,table_fk){
	object_variable.table_name = table_name;
	object_variable.table_pk = table_pk;
	object_variable.table_lastDoc =  table_LastDoc;
	object_variable.table_fk = table_fk;
	return object_variable;
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

function getColumns(values){
	values.operation = "getColumns";
	let x = [];
	webix.ajax().post(values.php,values,function(text){
		let columns = JSON.parse(text);
		x = columns;
		console.log(x);
	});
	//console.log(x);
}

function getScrollView(item){
	var temp = {
		view:"scrollview",
		scroll:"xy",
		body:item,
	}
	return temp;
}

function getFlexView(object){
	var temp = {
		minWidth:300, height:400
	}
	for(const [key,value] of Object.entries(object)){
		temp[key] = value;
	}
	return temp;
}

function getThDate(obj){
	let result = "";
	if(obj=="")
		return result;
	else if(!obj)
		return result;
	else if(obj=="0000-00-00")
		return result;
	else{
		let day = obj.split("-");
		let date = day[2];
		let month = day[1];
		let year = day[0];
		if(year<2500){
			year = parseInt(year)+543;
		}
		result = date+"/"+month+"/"+year;
	}
	return result;
}

function spaceOfText(obj){
	let arr = obj.split( /(?=(?:...)*$)/ );
	let result = arr.join("-");
	return result;
}

function toNumber(obj){
	if(!obj){
		obj = "0.00";
	}else{
		if(obj==0){
			obj = "0.00";
		}else if(obj==""){
			obj = "0.00";
		}
	}
	let decimal = obj.split(".");
	let commas = decimal[0].split( /(?=(?:...)*$)/ );
	let commaNumber = commas.join(",");
	if(!decimal[1]){
		decimal[1] = "00";
	}
	result = commaNumber+"."+decimal[1];
	return result;
}

function toDBdate(obj){
	if(obj!=""){
		let datetime = obj.split("/");
		let date = datetime[0];
		let month = datetime[1];
		let year = "";
		if(datetime[2]>2500){
			year = datetime[2]-543;
		}else{
			year = datetime[2];
		}
		return year+"-"+month+"-"+date;
	}else{
		return obj;
	}
}

function blankData(qty){
	let data = [];
	for(i=1;i<qty+1;i++){
		data.push({id:i});
	}
	return data;
}
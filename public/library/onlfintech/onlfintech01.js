function loadTable(values){
	return webix.ajax().post(values.php,values);
}

function loadTableTo(table_id,values){
	webix.ajax().post(values.php,values,function(text){
		$$(table_id).clearAll();
		//console.log(text);
		$$(table_id).parse(text);
	}); 
}

function loadTableH(values){
	console.log(values);
	return webix.ajax().headers({
		"Authorization": "Bearer "+values.token
	}).get(values.path);
}

function setToday(){
	let today = new Date();
	return today;
}

function createTable(id,data,property){
	let temp = {
		view:"datatable",
		id:id,
		autoConfig:true,
	}
	if(data){
		temp.data = loadTable(data);
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

function createForm(id,formObj,property){
	let temp = {
		view:"form",
		id:id,
		elements:[{rows:[formObj]}],
	}
	if(property){
		for(const [key,value] of Object.entries(property)){
			temp[key] = value;
		}
	}
	return temp;
}

function setGravity(gravity,object,property){
	let temp = {
		gravity:gravity,
		rows:[
			object
		]
	}
	if(property){
		for(const [key,value] of Object.entries(property)){
			temp[key] = value;
		}
	}
	return temp;
}

function createHeader(name,property){
	let temp = {
		view:"template",
		type:"header",
		template:name,
		css:"transparentbackground",
		borderless:true,
	}
	if(property){
		for(const [key,value] of Object.entries(property)){
			temp[key] = value;
			if(key=="css"){
				let csstemp = "transparentbackground "+value;
				temp[key] = csstemp;
			}
		}
	}
	return temp;
}

function createToolbar(property){
	let temp = {
		view:"toolbar",
		css:"pastelgreen",
		cols:[
			createHeader("toolbar"),
		]
	}
	if(property){
		for(const [key,value] of Object.entries(property)){
			temp[key] = value;
		}
	}
	return temp;
}

function createWindow(id,object,property){
	let temp = {
		view:"window",
		id:id,
		position: function(state) {
			state.width = state.maxWidth * 0.8;
			state.height = state.maxHeight * 0.8;
			state.left = (state.maxWidth - state.width) / 2;
			state.top = (state.maxHeight - state.height) / 2;
		},
		head:{
			cols:[
				createHeader(id),
				{view:"icon",icon:"fas fa-times",click:function(){
					$$(id).hide();
				}}
			]
		},
		body:object,
	}
	if(property){
		for(const [key,value] of Object.entries(property)){
			temp[key] = value;
		}
	}
	return webix.ui(temp).hide();
}

function valuesToForm(values,form_id,replaceExist){
	if(!replaceExist){
		$$(form_id).setValues(values);
	}else if(replaceExist==1){
		$$(form_id).setValues(values,true);
	}else{
		$$(form_id).setValues(values);
	}
}

function showAndHide(showItems,hideItems){
	if(showItems){
		showItems = showItems.split(",");
		for(i=0;i<showItems.length;i++){
			let currentItem = showItems[i];
			$$(currentItem).show();
		}
	}
	if(hideItems){
		hideItems = hideItems.split(",");
		for(i=0;i<hideItems.length;i++){
			let currentItem = hideItems[i];
			$$(currentItem).hide();
		}
	}
}

function BEdate(obj){
	if(!obj){
		return obj;
	}else if(obj==""){
		return obj;
	}else if(obj=="0"){
		return obj;
	}else if(obj=="0000-00-00"){
		return "";
	}else{
		let datetime = new Date(obj);
		let date = pad(datetime.getDate(),2);
		let month = pad(datetime.getMonth()+1,2);
		let year = datetime.getFullYear()+543;
		let result = date+"/"+month+"/"+year;
		return result;
	}
}

function BEdateTime(obj){
	if(!obj){
		return obj;
	}else if(obj==""){
		return obj;
	}else{
		let datetime = new Date(obj);
		let date = pad(datetime.getDate(),2);
		let month = pad(datetime.getMonth()+1,2);
		let year = datetime.getFullYear()+543;
		let hour = pad(datetime.getHours(),2);
		let minute = pad(datetime.getMinutes(),2);
		let result = date+"/"+month+"/"+year+" "+hour+":"+minute;
		return result;
	}
}

function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function randomNumber(digit){
	let randomNum = Math.random();
	for(i=0;i<digit;i++){
		randomNum = randomNum*10;
	}
	return Math.floor(randomNum);
}

function NewRandom(digit){
	digit = digit || 3;
	let randomNum = randomNumber(digit);
	let nDate = new Date();
	let ctime = nDate.getTime();
	return "NEW_"+ctime+"_"+randomNum;
}

function createQR(){
	let temp = {
		view:"popup",
		id:"qrCodePopup",
		width:170,
		height:170,
		head:{
			cols:[
				{},
				{view:"icon",icon:"fas fa-times",click:function(){
					$$("qrCodeWindow").hide();
				}}
			]
		},
		body:{
			view:"template",
			template:"<div id='qrCode' class='allcenter'></div>",
			on:{
				onAfterRender:function(){
					let url = window.location.href;
					new QRCode(document.getElementById("qrCode"), {
						text:url,
						width: 150,
						height: 150,
					});
				}
			}
		}
	}
	return webix.ui(temp).hide();
}

function QRButton(property){
	let temp = {
		view:"button",
		width:40,
		css:"mybutton",
		tooltip:"Scan to Enter site",
		label:"<div class='myhover iconcenter'><i class='fas fa-qrcode'></i></button></div>",
		popup:"qrCodePopup"
	}
	if(property){
		for(const [key,value] of Object.entries(property)){
			temp[key] = value;
		}
	}
	return temp;
}

function redirectWithPostData(strLocation, objData, strTarget){
    var objForm = document.createElement('FORM');
    objForm.method = 'post';
    objForm.action = strLocation;

    if (strTarget)
        objForm.target = strTarget;

    var strKey;
    for (strKey in objData)
    {
        var objInput = document.createElement('INPUT');
        objInput.type = 'hidden';
        objInput.name = strKey;
        objInput.value = objData[strKey];
        objForm.appendChild(objInput);
    }

    document.body.appendChild(objForm);
    objForm.submit();

    if (strTarget)
        document.body.removeChild(objForm);
}

function loading(table_id,factor){
    webix.extend($$(table_id), webix.ProgressBar);
    return $$(table_id).showProgress({hide:factor}); 
}

function autoAdjustWindow(padding){
	var pad = 0.8;
	if(!isNaN(padding)){
		pad = padding
	}
	return function(state) {
		state.width = state.maxWidth * pad;
		state.height = state.maxHeight * pad;
		state.left = (state.maxWidth - state.width) / 2;
		state.top = (state.maxHeight - state.height) / 2;
	}
}

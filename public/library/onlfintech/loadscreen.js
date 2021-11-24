//Loading Screen template
var temp_3dot = `<div class="allcenter"><p class="text-center">กรุณารอสักครู่</p><br/><div class="loadingpreloader text-center"><div class="spinner-grow text-success" role="status">
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
	id:"loadScreen_3dot",
	position:"center",
	fullscreen:true,
	body:{
		template:temp_3dot
	}
}).hide();

function loadScreen_3dot(factor){
	if(factor=="show"){
		$$("loadScreen_3dot").show();
	}else if(factor=="hide"){
		$$("loadScreen_3dot").hide();
	}
}

<?php

	function connectDB($servername, $username, $password, $dbname){
		$conn = mysqli_connect($servername, $username, $password, $dbname);
		if (!$conn) {
			die("Connection failed: " . mysqli_connect_error());
		}else{
			mysqli_set_charset($conn,"utf8");
			return $conn;
		}
	}

	function readTable($tableName,$conn){
		$sql = "SELECT * FROM ".$tableName;
		$result = mysqli_query($conn,$sql);
		$data = array();
		while($row = mysqli_fetch_assoc($result)){
			$data[] = $row;
		}
		mysqli_close($conn);
		return $data;
	}

	function getKeyData($array){
		$result = array();
		foreach($array as $temp_key=>$temp_value){
			if((strpos($temp_key,"_ro")===false)&&($temp_key!="table")&&($temp_key!="pk")){
				$result[] = $temp_key;
			}
		}
		return $result;
	}
	
	function getChildData(){
		$childs = array();
		foreach($childObject as $x){
			$childs[] = (array)$childObject;
		}
		return $childs;
	}
?>
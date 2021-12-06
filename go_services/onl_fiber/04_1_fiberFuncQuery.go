package onl_fiber

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/savirusing/onl_api/go_services/onl_db"
)

func interfaceMap(data interface{}) ([]map[string]interface{}, error) {
	// Start CDS1
	map_data := reflect.ValueOf(data)
	j_sql_no := fmt.Sprintf("%v", map_data.MapIndex(reflect.ValueOf("sql_no"))) //string ex: rep6400-0001
	j_data := map_data.MapIndex(reflect.ValueOf("data"))                        //interface{}
	j_data_interface := j_data.Interface()                                      // Convert data in CDS1 to interface{}
	sql, err := onl_db.SqlFromSQL2Excel(j_sql_no)                               // get sql from sql_no from sql2excel
	if err != nil {
		return nil, err
	}
	result, err := onl_db.QuerySql(sql, false) // Query sql
	if err != nil {
		return nil, err
	}

	// StartQueryCD2
	for _, cds1_row := range result {
		map_data = reflect.ValueOf(j_data_interface)
		for _, dataname := range map_data.MapKeys() {
			dataname_data := map_data.MapIndex(dataname)
			data_name := fmt.Sprintf("%v", dataname)
			dataname_data_interface := dataname_data.Interface()
			map_subdata := reflect.ValueOf(dataname_data_interface)
			subdata_sql_no := fmt.Sprintf("%v", map_subdata.MapIndex(reflect.ValueOf("sql_no")))
			subdata_relArr := strings.Split(strings.ToUpper(fmt.Sprintf("%v", map_subdata.MapIndex(reflect.ValueOf("rel")))), "=")
			rel_parent := subdata_relArr[0]
			rel_child := subdata_relArr[1]
			sql, err := onl_db.SqlFromSQL2Excel(subdata_sql_no) // get sql from sql_no from sql2excel
			if err != nil {
				return nil, err
			}
			sql = fmt.Sprintf("select * from (%v) where %v='%v'", sql, rel_child, cds1_row[rel_parent])
			result2, err := onl_db.QuerySql(sql, false) // Query sql
			if err != nil {
				return nil, err
			}
			cds1_row[data_name] = result2
		}
	}
	return result, nil
}

func interfaceToMap(currentData interface{}, AllResult []map[string]interface{}, field_name string) ([]map[string]interface{}, error) {
	//convert interface{} to reflect.Value
	map_data := reflect.ValueOf(currentData)
	//assign data from "key"
	reflect_sql_no := map_data.MapIndex(reflect.ValueOf("sql_no"))
	reflect_data := map_data.MapIndex(reflect.ValueOf("data"))
	_ = reflect_data
	reflect_rel := map_data.MapIndex(reflect.ValueOf("rel"))
	if reflect_sql_no.IsValid() { // if sql_no found
		sql_no := fmt.Sprintf("%v", reflect_sql_no)
		sql, err := onl_db.SqlFromSQL2Excel(sql_no) // get sql from sql_no from sql2excel
		if err != nil {
			return nil, err
		}
		if reflect_rel.IsValid() {
			relArr := strings.Split(strings.ToUpper(fmt.Sprintf("%v", map_data.MapIndex(reflect.ValueOf("rel")))), "=")
			if len(relArr) == 1 { //this is master (no relation found)
				result, err := onl_db.QuerySql(sql, false) // Query sql
				if err != nil {
					return nil, err
				}
				AllResult = result
			} else { // has relation parent = child
				for _, result_row := range AllResult {
					sql = fmt.Sprintf("select * from ( %v ) where %v = '%v'", sql, relArr[1], result_row[relArr[2]])
					result, err := onl_db.QuerySql(sql, false) // Query sql
					if err != nil {
						return nil, err
					}
					result_row[field_name] = result
				}
			}
		}
	} else {
		_ = "do something"
	}
	return AllResult, nil
}

// sql, err := onl_db.SqlFromSQL2Excel(sql_no) // get sql from sql_no from sql2excel
// 		if err != nil {
// 			return nil, err
// 		}
// 		if len(relArr) == 1 { // case no relation found = this is master
// 			result, err := onl_db.QuerySql(sql, false) // Query sql
// 			if err != nil {
// 				return nil, err
// 			}
// 			return result, nil
// 		} else { // case found relation (relArr contain 2 values [0=rel_parent,1=rel_child])
// 			for _, result_row := range AllResult {
// 				sql = fmt.Sprintf("select * from ( %v ) where %v = '%v'", sql, relArr[1], result_row[relArr[2]])
// 				result, err := onl_db.QuerySql(sql, false) // Query sql
// 				if err != nil {
// 					return nil, err
// 				}
// 				result_row["nested_data"] = result
// 			}
// 		}

// func getKeys(data interface{}) []string {
// 	map_data := reflect.ValueOf(data)
// 	keysArr := []string{}
// 	for _, key_reflect := range map_data.MapKeys() {
// 		key := fmt.Sprintf("%v", key_reflect)
// 		keysArr = append(keysArr, key)
// 	}
// 	return keysArr
// }

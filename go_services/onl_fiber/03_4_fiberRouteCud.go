package onl_fiber

import (
	"encoding/json"
	"errors"
	"fmt"
	"reflect"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/savirusing/onl_api/go_services/onl_db"
	"github.com/savirusing/onl_api/go_services/onl_func"
)

type Property struct {
	Table  string `json:"TABLE"`
	Data   string `json:"DATA"`
	CTRLNO string `json:"CTRLNO"`
	PREFIX string `json:"PREFIX"`
	PK     string `json:"PK"`
}

func updateDB(c *fiber.Ctx) error {
	DB := onl_db.ConnectDB()
	defer DB.Close()
	type POST struct {
		Table  string `json:"TABLE"`
		Data   string `json:"DATA"`
		CTRLNO string `json:"CTRLNO"`
		PREFIX string `json:"PREFIX"`
	}
	post_values := new(POST)
	if err := c.BodyParser(post_values); err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	//check if ope key is in operations array? if not then exit
	data_json := make(map[string]interface{})
	if err := json.Unmarshal([]byte(post_values.Data), &data_json); err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	db_data := reflect.ValueOf(data_json)
	// check if primary key is found
	reflect_pk_key := db_data.MapIndex(reflect.ValueOf("pk"))
	if !reflect_pk_key.IsValid() {
		reflect_pk_key = db_data.MapIndex(reflect.ValueOf("PK"))
		if !reflect_pk_key.IsValid() {
			err := errors.New("pk not found")
			return c.JSON(onl_func.ErrorReturn(err, c))
		}
	}
	pk_key := fmt.Sprintf("%v", reflect_pk_key)
	// check if value of primary key is found
	reflect_pk_value := db_data.MapIndex(reflect.ValueOf(pk_key))
	if !reflect_pk_value.IsValid() {
		err := errors.New("pk_value not found")
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	pk_value := fmt.Sprintf("%v", reflect_pk_value)
	if strings.Contains(strings.ToLower(pk_value), "new") {
		res, err := onl_db.QueryLastDoc(post_values.CTRLNO, post_values.PREFIX)
		if err != nil {
			return c.JSON(onl_func.ErrorReturn(err, c))
		}
		pk_value = fmt.Sprintf("%v", res)
		data_json[pk_key] = res
		query := fmt.Sprintf("INSERT INTO %v (%v) VALUES (:%v)", post_values.Table, pk_key, pk_key)
		// println(query)
		_, err = DB.NamedExec(query, data_json)
		if err != nil {
			return c.JSON(onl_func.ErrorReturn(err, c))
		}
	}
	//start adding other than pk to cols_vals
	cols_vals := []string{}
	for _, key_reflect := range db_data.MapKeys() {
		key := fmt.Sprintf("%v", key_reflect)
		lower_key := strings.ToLower(key)
		if strings.Contains(lower_key, "ro_") { // case of found prefix of ro (read only)
			// fmt.Println("Found read-only field", key)
			_ = "do nothing (this is read-only field)"
		} else if strings.Contains(key, pk_key) { // case of found pk key field and value
			// fmt.Println("Found primary key value :", db_data.MapIndex(key_reflect))
			_ = "do nothing (this is pk field and value)"
		} else if key == "pk" || key == "PK" { // case of found pk field name
			// fmt.Println("Found primary key field : ", db_data.MapIndex(key_reflect))
			_ = "do nothing (this is pk field)"
		} else { // case of is normal column
			// value := db_data.MapIndex(key_reflect)
			data_json[key] = checkIsDateConvert(data_json[key])
			col_val := fmt.Sprintf("%v = :%v", key, key)
			cols_vals = append(cols_vals, col_val)
		}
	}
	cols_vals_text := strings.Join(cols_vals, ", ")
	stmt := fmt.Sprintf("UPDATE %v set %v where %v = :%v", post_values.Table, cols_vals_text, pk_key, pk_key)
	// println(stmt)
	_, err := DB.NamedExec(stmt, data_json)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	return c.JSON(fiber.Map{
		"status": "complete",
		pk_key:   pk_value,
		// "sql":    stmt,
	})
}

func deleteDB(c *fiber.Ctx) error {
	DB := onl_db.ConnectDB()
	defer DB.Close()
	type POST struct {
		KEYT  string `json:"KEYT"`
		TABLE string `json:"TABLE"`
		DATA  string `json:"DATA"`
	}
	post_values := new(POST)
	if err := c.BodyParser(post_values); err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	table_name, err := Decrypt(post_values.KEYT)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	if !strings.EqualFold(strings.ToLower(table_name), strings.ToLower(post_values.TABLE)) {
		err := errors.New("key does not match to table")
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	data_json := make(map[string]interface{})
	if err := json.Unmarshal([]byte(post_values.DATA), &data_json); err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	db_data := reflect.ValueOf(data_json)
	where_text_arr := []string{}
	for _, key_reflect := range db_data.MapKeys() {
		key := fmt.Sprintf("%v", key_reflect)
		text := fmt.Sprintf("%v = :%v", key, key)
		where_text_arr = append(where_text_arr, text)
	}
	where_text := strings.Join(where_text_arr, " and ")
	stmt := fmt.Sprintf("DELETE FROM %v WHERE %v\n", table_name, where_text)
	_, err = DB.NamedExec(stmt, data_json)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	return c.JSON(fiber.Map{
		"status": "complete",
		"delete": post_values.DATA,
	})

}

func updateDB2(c *fiber.Ctx) error {
	//read from post_data
	property := new(Property)
	if err := c.BodyParser(property); err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	data_json := make(map[string]interface{})
	//json as multiple data
	if err := json.Unmarshal([]byte(property.Data), &data_json); err != nil {
		var data_jsons []map[string]interface{}
		if err := json.Unmarshal([]byte(property.Data), &data_jsons); err != nil {
			return c.JSON(onl_func.ErrorReturn(err, c))
		} else {
			err = updateRows(property, data_jsons)
			if err != nil {
				return c.JSON(onl_func.ErrorReturn(err, c))
			} else {
				return c.JSON(fiber.Map{
					"status": "complete",
				})
			}
		}
		//json as single data
	} else {
		pk_val, err := updateRow(property, data_json)
		if err != nil {
			return c.JSON(onl_func.ErrorReturn(err, c))
		}
		return c.JSON(fiber.Map{
			"status":    "complete",
			property.PK: pk_val,
		})
	}
}

func updateRow(property *Property, row_data map[string]interface{}) (string, error) {
	//get coluumns in table
	columnsType, err := ColumnTypes(property.Table)
	if err != nil {
		return "", err
	}
	//connect to database
	DB := onl_db.ConnectDB()
	defer DB.Close()

	//check if pk key and pk value found
	_, err = getPKVal(property, row_data)
	if err != nil {
		return "", err
	}

	//get sql command template for exec in NamedExec
	stmt, err := getSqlCommand(property, row_data, columnsType)
	if err != nil {
		return "", err
	}

	//check if pk value is new, if true then insert with new last_doc
	row_data, err = AddIfNew(property, row_data)
	if err != nil {
		return "", err
	}

	//convert data in row to match type
	row_data = convertDataType(property, row_data, columnsType)
	_, err = DB.NamedExec(stmt, row_data)
	if err != nil {
		return "", err
	}
	pk_val := fmt.Sprintf("%v", row_data[property.PK])

	return pk_val, nil
}

func updateRows(property *Property, rows_data []map[string]interface{}) error {
	//get coluumns in table
	columnsType, err := ColumnTypes(property.Table)
	if err != nil {
		return err
	}
	//connect to database
	DB := onl_db.ConnectDB()
	defer DB.Close()

	//check if pk key and pk value found
	_, err = getPKVal(property, rows_data[0])
	if err != nil {
		return err
	}

	//loop for each array (data of each row)
	for _, v := range rows_data {
		//get sql command template for exec in NamedExec
		stmt, err := getSqlCommand(property, v, columnsType)
		if err != nil {
			return err
		}

		//check if pk key exist and find if pk value is new, if true then insert with new last_doc
		row_data, err := AddIfNew(property, v)
		if err != nil {
			return err
		}

		//update the row with pk value
		row_data = convertDataType(property, row_data, columnsType)
		// fmt.Println(row_data)
		_, err = DB.NamedExec(stmt, row_data)
		if err != nil {
			return err
		}
	}
	return nil
}

func getPKVal(property *Property, row_data map[string]interface{}) (string, error) {
	db_data := reflect.ValueOf(row_data)
	pk_key := property.PK
	if pk_key == "" {
		return "", errors.New("PK not found")
	}
	reflect_pk_value := db_data.MapIndex(reflect.ValueOf(pk_key))
	if !reflect_pk_value.IsValid() {
		return "", errors.New("PK Value not found")
	}
	pk_value := fmt.Sprintf("%v", reflect_pk_value)
	return pk_value, nil
}

func AddIfNew(property *Property, row_data map[string]interface{}) (map[string]interface{}, error) {
	DB := onl_db.ConnectDB()
	defer DB.Close()
	pk_value, err := getPKVal(property, row_data)
	if err != nil {
		return nil, err
	}
	if strings.ToLower(pk_value) == "new" {
		res, err := onl_db.GetNewDoc(property.CTRLNO, property.PREFIX)
		if err != nil {
			return nil, err
		}
		row_data[property.PK] = res
		query := fmt.Sprintf("INSERT INTO %v (%v) VALUES (:%v)", property.Table, property.PK, property.PK)
		// println(query)
		_, err = DB.NamedExec(query, row_data)
		if err != nil {
			return nil, err
		}
	}
	return row_data, nil
}

func convertDataType(property *Property, row_data map[string]interface{}, columnsType []interface{}) map[string]interface{} {
	db_data := reflect.ValueOf(row_data)
	for _, key_reflect := range db_data.MapKeys() {
		key := fmt.Sprintf("%v", key_reflect)
		if strings.Contains(strings.ToLower(key), strings.ToLower(property.PK)) { // case of found pk key field and value
			// fmt.Println("Found primary key value :", db_data.MapIndex(key_reflect))
			_ = "do nothing (this is pk field and value)"
		} else { // case of is normal column
			// value := db_data.MapIndex(key_reflect)
			for _, v := range columnsType {
				s := reflect.ValueOf(v)
				db_col := fmt.Sprintf("%v", s.MapIndex(reflect.ValueOf("name")))
				db_col_type := fmt.Sprintf("%v", s.MapIndex(reflect.ValueOf("type")))
				if strings.EqualFold(key, db_col) {
					switch db_col_type {
					case "DATE":
						row_data[key] = convertToDate(row_data[key])
					}
				}
			}
		}
	}
	return row_data
}

func checkIsDateConvert(value interface{}) interface{} {
	if value != nil {
		t, err := time.Parse(time.RFC3339, fmt.Sprintf("%v", value))
		if err != nil {
			t, err = time.Parse("2006-01-02 03:04:05", fmt.Sprintf("%v", value))
			if err != nil {
				if fmt.Sprintf("%v", value) == "" {
					return nil
				}
				return value
			}
			return t
		} else {
			return t
		}
	}
	return nil
}

func getSqlCommand(property *Property, row_data map[string]interface{}, columnsType []interface{}) (string, error) {
	db_data := reflect.ValueOf(row_data)
	cols_vals := []string{}
	for _, key_reflect := range db_data.MapKeys() {
		key := fmt.Sprintf("%v", key_reflect)
		if strings.Contains(strings.ToLower(key), strings.ToLower(property.PK)) { // case of found pk key field and value
			// fmt.Println("Found primary key value :", db_data.MapIndex(key_reflect))
			_ = "do nothing (this is pk field and value)"
		} else { // case of is normal column
			// value := db_data.MapIndex(key_reflect)
			for _, v := range columnsType {
				s := reflect.ValueOf(v)
				db_col := fmt.Sprintf("%v", s.MapIndex(reflect.ValueOf("name")))
				if strings.EqualFold(key, db_col) {
					col_val := fmt.Sprintf("%v = :%v", key, key)
					cols_vals = append(cols_vals, col_val)
				}
			}
		}
	}
	cols_vals_text := strings.Join(cols_vals, ", ")
	stmt := fmt.Sprintf("UPDATE %v set %v where %v = :%v", property.Table, cols_vals_text, property.PK, property.PK)
	return stmt, nil
}

func convertToDate(value interface{}) interface{} {
	t, err := time.Parse(time.RFC3339, fmt.Sprintf("%v", value))
	if err != nil {
		t, err = time.Parse("2006-01-02 03:04:05", fmt.Sprintf("%v", value))
		if err != nil {
			return nil
		}
	}
	return t
}

func ColumnTypes(table_name string) ([]interface{}, error) {
	DB := onl_db.ConnectDB()
	defer DB.Close()
	query := fmt.Sprintf("select * from %v where rownum < 2", table_name)
	rows, err := DB.Query(query)
	if err != nil {
		return nil, err
	}
	columnsType, err := rows.ColumnTypes()
	if err != nil {
		return nil, err
	}
	var columnsData []interface{}
	for _, v := range columnsType {
		currentCols := make(map[string]interface{})
		currentCols["name"] = v.Name()
		currentCols["length"], _ = v.Length()
		currentCols["type"] = v.DatabaseTypeName()
		columnsData = append(columnsData, currentCols)
	}
	return columnsData, nil
}

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

func checkIsDateConvert(value interface{}) interface{} {
	if value != nil {
		t, err := time.Parse(time.RFC3339, value.(string))
		if err != nil {
			return value
		} else {
			return t
		}
	}
	return nil
}

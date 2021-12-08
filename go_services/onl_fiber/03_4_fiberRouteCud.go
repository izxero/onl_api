package onl_fiber

import (
	"encoding/json"
	"errors"
	"fmt"
	"reflect"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/savirusing/onl_api/go_services/onl_db"
	"github.com/savirusing/onl_api/go_services/onl_func"
)

func getLastDoc(c *fiber.Ctx) error {
	type POST struct {
		CTRLNO string `json:"CTRLNO"`
		PREFIX string `json:"PREFIX"`
	}
	post_values := new(POST)
	if err := c.BodyParser(post_values); err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	res, err := onl_db.QueryLastDoc(post_values.CTRLNO, post_values.PREFIX)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	return c.JSON(fiber.Map{
		"status":  "complete",
		"lastdoc": res,
	})
}

func updateDB(c *fiber.Ctx) error {
	type POST struct {
		Table string `json:"TABLE"`
		Data  string `json:"DATA"`
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
		err := errors.New("pk not found")
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	pk_key := fmt.Sprintf("%v", reflect_pk_key)
	// check if value of primary key is found
	reflect_pk_value := db_data.MapIndex(reflect.ValueOf(pk_key))
	if !reflect_pk_value.IsValid() {
		err := errors.New("pk_value not found")
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	pk_value := fmt.Sprintf("'%v'", reflect_pk_value)

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
			value := db_data.MapIndex(key_reflect)
			col_val := fmt.Sprintf("%v = '%v'", key, value)
			cols_vals = append(cols_vals, col_val)
		}
	}
	cols_vals_text := strings.Join(cols_vals, ", ")
	sql := fmt.Sprintf("UPDATE %v set %v where %v = %v", post_values.Table, cols_vals_text, pk_key, pk_value)
	println(sql)
	return c.JSON(sql)
}

func updateDB2(c *fiber.Ctx) error {
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
		err := errors.New("pk not found")
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	pk_key := fmt.Sprintf("%v", reflect_pk_key)
	// check if value of primary key is found
	reflect_pk_value := db_data.MapIndex(reflect.ValueOf(pk_key))
	if !reflect_pk_value.IsValid() {
		err := errors.New("pk_value not found")
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	pk_value := fmt.Sprintf("'%v'", reflect_pk_value)
	if strings.Contains(pk_value, "NEW") {
		res, err := onl_db.QueryLastDoc(post_values.CTRLNO, post_values.PREFIX)
		if err != nil {
			return c.JSON(onl_func.ErrorReturn(err, c))
		}
		pk_value = res
		query := fmt.Sprintf("INSERT INTO %v (%v) VALUES ('%v')", post_values.Table, pk_key, pk_value)
		DB := onl_db.ConnectDB()
		defer DB.Close()
		_, err = DB.Exec(query)
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
			value := db_data.MapIndex(key_reflect)
			col_val := fmt.Sprintf("%v = '%v'", key, value)
			cols_vals = append(cols_vals, col_val)
		}
	}
	cols_vals_text := strings.Join(cols_vals, ", ")
	stmt := fmt.Sprintf("UPDATE %v set %v where %v = '%v'", post_values.Table, cols_vals_text, pk_key, pk_value)
	DB := onl_db.ConnectDB()
	defer DB.Close()
	_, err := DB.Exec(stmt)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	println(stmt)
	return c.JSON(fiber.Map{
		"status": "complete",
		"sql":    stmt,
	})
}

func Test_UPD(c *fiber.Ctx) error {
	operations := []string{
		"upd",
		"dlt",
	}
	type POST struct {
		Oper  string `json:"OPER"`
		Table string `json:"TABLE"`
		Data  string `json:"DATA"`
	}
	post_values := new(POST)
	if err := c.BodyParser(post_values); err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	//check if ope key is in operations array? if not then exit
	for _, v := range operations {
		if strings.Contains(post_values.Oper, v) {
			data_json := make(map[string]interface{})
			if err := json.Unmarshal([]byte(post_values.Data), &data_json); err != nil {
				panic(err)
			}

			db_data := reflect.ValueOf(data_json)
			columns := []string{}
			values := []string{}
			cols_vals := []string{}
			pk_key := ""
			pk_value := ""
			for _, key_reflect := range db_data.MapKeys() {
				key := fmt.Sprintf("%v", key_reflect)
				if strings.Contains(key, "ro_") {
					original_key := strings.Replace(key, "ro_", "", -1)
					_ = original_key
					// fmt.Println("found read-only key : ", original_key)
				} else if strings.Contains(key, "pk_") {
					value := db_data.MapIndex(key_reflect)
					pk_key = strings.Replace(key, "pk_", "", -1)
					pk_value = fmt.Sprintf("'%v'", value)
					// fmt.Println("found primary key : ", original_key)
				} else {
					columns = append(columns, key)
					value := db_data.MapIndex(key_reflect)
					value_text := fmt.Sprintf("'%v'", value)
					values = append(values, value_text)
					cols_vals = append(cols_vals, fmt.Sprintf("%v = %v", key, value_text))
					// fmt.Println(key, " = ", value)
				}
			}
			fmt.Printf("INSERT INTO %v (%v) VALUES (%v)\n", post_values.Table, pk_key, pk_value)
			fmt.Printf("INSERT INTO %v (%v) VALUES (%v)\n", post_values.Table, strings.Join(columns, ", "), strings.Join(values, ","))
			fmt.Printf("UPDATE %v set %v where %v = %v\n", post_values.Table, strings.Join(cols_vals, ", "), pk_key, pk_value)
			// fmt.Println(columns)
			// fmt.Println(values)
			return nil
		}
	}
	err := errors.New("invalid ope key")
	return c.JSON(onl_func.ErrorReturn(err, c))
}

package onl_fiber

import (
	"encoding/json"
	"errors"
	"fmt"
	"reflect"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/savirusing/onl_api/go_services/onl_func"
)

func updateDB(c *fiber.Ctx) error {
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

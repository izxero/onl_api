package onl_db

import (
	"errors"
	"fmt"
	"net/url"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func GetSqlOrSqlNo(c *fiber.Ctx) (string, error) {
	sql_no := c.Params("sql_no")
	sql := c.Query("sql")
	if sql == "" && sql_no == "" {
		return "", errors.New("no sql found")
	}
	if sql != "" {
		sql = ReplaceWithParams(sql, c)
		return sql, nil
	}
	sql, err := SqlFromSQL2Excel(sql_no)
	if err != nil {
		return "", err
	}
	return sql, nil
}

func SqlFromSQL2Excel(sql_no string) (string, error) {
	var sql_text string
	rows := DB.QueryRow("select sql_text from sql2excel where doc_no = :1", sql_no)
	err := rows.Scan(&sql_text)
	if err != nil {
		return "", err
	}
	return sql_text, nil
}

func ReplaceWithParams(sql string, c *fiber.Ctx) string {
	params, _ := url.ParseQuery(fmt.Sprintf("%v", c.Request().URI().QueryArgs()))
	for k, v := range params {
		for _, e := range v {
			key := "{" + k + "}"
			sql = strings.Replace(sql, key, e, -1)
		}
	}
	return sql
}

func SqlInjection(sql string) error {
	injection := []string{
		"insert",
		"update",
		"delete",
		"truncate",
		"alter",
		"drop",
		"exec",
		"create",
		"grant",
		"revolk",
	}
	for _, v := range injection {
		if strings.Contains(sql, v) {
			response := "error : prohibited command (" + v + ")"
			return errors.New(response)
		}
	}
	return nil
}

func QuerySql(sql string) ([]map[string]interface{}, error) {
	if err := SqlInjection(sql); err != nil {
		return nil, err
	}
	rows, err := DB.Query(sql)
	if err != nil {
		return nil, err
	}
	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}
	var allMaps []map[string]interface{}
	values := make([]interface{}, len(columns))
	pointers := make([]interface{}, len(columns))
	for i := range values {
		pointers[i] = &values[i]
	}
	for rows.Next() {
		err := rows.Scan(pointers...)
		if err != nil {
			return nil, err
		}

		resultMap := make(map[string]interface{})
		for i, val := range values {
			resultMap[columns[i]] = val

		}
		allMaps = append(allMaps, resultMap)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return allMaps, nil
}

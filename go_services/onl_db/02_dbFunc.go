package onl_db

import (
	"errors"
	"strings"
)

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

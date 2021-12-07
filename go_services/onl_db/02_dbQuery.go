package onl_db

import (
	"fmt"
	"strconv"
)

func SqlFromSQL2Excel(sql_no string) (string, error) {
	var sql_text string
	DB := ConnectDB()
	defer DB.Close()
	rows := DB.QueryRow("select sql_text from sql2excel where doc_no = :1", sql_no)
	err := rows.Scan(&sql_text)
	if err != nil {
		return "", err
	}
	return sql_text, nil
}

func QuerySql(sql string, injection bool) ([]map[string]interface{}, error) {
	DB := ConnectDB()
	defer DB.Close()
	if injection {
		if err := SqlInjection(sql); err != nil {
			return nil, err
		}
	}
	rows, err := DB.Query(sql)
	if err != nil {
		return nil, err
	}
	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}
	columnsTypes, err := rows.ColumnTypes()
	if err != nil {
		return nil, err
	}
	typeArr := []string{}
	for _, v := range columnsTypes {
		typeArr = append(typeArr, v.DatabaseTypeName())
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
			switch typeArr[i] {
			case "NUMBER":
				var number_val float64
				if val == nil {
					number_val = 0
				} else {
					number_val, _ = strconv.ParseFloat(val.(string), 64)
				}
				resultMap[columns[i]] = number_val
			default:
				resultMap[columns[i]] = val
			}
		}
		allMaps = append(allMaps, resultMap)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return allMaps, nil
}

func QuerySqlColumns(sql string, injection bool) ([]string, error) {
	DB := ConnectDB()
	defer DB.Close()
	if injection {
		if err := SqlInjection(sql); err != nil {
			return nil, err
		}
	}
	rows, err := DB.Query(sql)
	if err != nil {
		return nil, err
	}
	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}
	return columns, nil
}

func QuerySqlColumnTypes(sql string, injection bool) ([]interface{}, error) {
	DB := ConnectDB()
	defer DB.Close()
	if injection {
		if err := SqlInjection(sql); err != nil {
			return nil, err
		}
	}
	rows, err := DB.Query(sql)
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
		fmt.Println(currentCols)
		columnsData = append(columnsData, currentCols)
	}
	return columnsData, nil
}

func QueryLastDoc(CTRLNO string, PREFIX string) (string, error) {
	DB := ConnectDB()
	defer DB.Close()
	lastdoc := ""
	sql := "select runno from last_doc where CTRLNO = :1 and DOCNO = :2"
	rows := DB.QueryRow(sql, CTRLNO, PREFIX)
	err := rows.Scan(&lastdoc)
	println(lastdoc)
	if err != nil {
		return "", err
	}
	return lastdoc, nil
}

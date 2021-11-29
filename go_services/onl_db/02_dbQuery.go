package onl_db

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

package onl_db

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strconv"
	"time"
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
			case "DATE":
				if val != nil && val != "" {
					date_val := val.(time.Time)
					date := fmt.Sprintf("%v", date_val.Format("2006-01-02 15:04:05"))
					// 	// resultMap[columns[i]] = date_val.String()
					resultMap[columns[i]] = date
				} else {
					resultMap[columns[i]] = val
				}
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

func QuerySqlH(sql string, col_heads map[string]string, injection bool) ([]map[string]interface{}, error) {
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
				heading := col_heads[columns[i]]
				if heading == "" {
					heading = columns[i]
				}
				resultMap[heading] = number_val
			case "DATE":
				if val != nil && val != "" {
					date_val := val.(time.Time)
					date := fmt.Sprintf("%v", date_val.Format("2006-01-02 15:04:05"))
					// 	// resultMap[columns[i]] = date_val.String()
					heading := col_heads[columns[i]]
					if heading == "" {
						heading = columns[i]
					}
					resultMap[heading] = date
				} else {
					heading := col_heads[columns[i]]
					if heading == "" {
						heading = columns[i]
					}
					resultMap[heading] = val
				}
			default:
				heading := col_heads[columns[i]]
				if heading == "" {
					heading = columns[i]
				}
				resultMap[heading] = val
			}
		}
		allMaps = append(allMaps, resultMap)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return allMaps, nil
}

func NamedQuerySql(sql string, data map[string]interface{}, injection bool) ([]map[string]interface{}, error) {
	DB := ConnectDB()
	defer DB.Close()
	if injection {
		if err := SqlInjection(sql); err != nil {
			return nil, err
		}
	}
	rows, err := DB.NamedQuery(sql, data)
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
			case "DATE":
				if val != nil && val != "" {
					date_val := val.(time.Time)
					date := fmt.Sprintf("%v", date_val.Format("2006-01-02 15:04:05"))
					// 	// resultMap[columns[i]] = date_val.String()
					resultMap[columns[i]] = date
				} else {
					resultMap[columns[i]] = val
				}
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

func QuerySqlColumns(sql string, data map[string]interface{}, injection bool) ([]string, error) {
	DB := ConnectDB()
	defer DB.Close()
	if injection {
		if err := SqlInjection(sql); err != nil {
			return nil, err
		}
	}
	rows, err := DB.NamedQuery(sql, data)
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
		// fmt.Println(currentCols)
		columnsData = append(columnsData, currentCols)
	}
	return columnsData, nil
}

func GetNewDoc(CTRLNO string, PREFIX string) (string, error) {
	DB := ConnectDB()
	defer DB.Close()
	loginStmt, err := DB.Prepare("begin C_Run(:1,:2,:3); end;")
	if err != nil {
		return "", err
	}
	defer loginStmt.Close()
	// mCtrl := "test"
	// mDocNo := "testN"
	var retVal int

	loginStmt.Exec(CTRLNO, PREFIX, sql.Out{Dest: &retVal})
	if err != nil {
		return "", err
	}

	runno := fmt.Sprintf("%.4d", retVal)
	new_doc_no := fmt.Sprintf("%v_%v", PREFIX, runno)
	return new_doc_no, nil
}

func QueryLastDoc(CTRLNO string, PREFIX string) (string, error) {
	DB := ConnectDB()
	defer DB.Close()
	lastdoc := ""
	query := "select runno from last_doc_t where CTRLNO = :1 and DOCNO = :2"
	rows := DB.QueryRow(query, CTRLNO, PREFIX)
	err := rows.Scan(&lastdoc)
	if err != nil {
		// case err
		if err != sql.ErrNoRows {
			return "", err
		}
		// case err b/c no row found
		query = "INSERT INTO last_doc_t (CTRLNO, DOCNO, RUNNO) VALUES (:1,:2,:3)"
		_, err := DB.Exec(query, CTRLNO, PREFIX, 1)
		if err != nil {
			return "", err
		}
		new_doc_no := fmt.Sprintf("%v-%04d", PREFIX, 1)
		return new_doc_no, nil
	}
	// case not err
	new_doc, _ := strconv.Atoi(lastdoc)
	new_doc++
	query = "UPDATE last_doc_t SET RUNNO = :1 WHERE CTRLNO = :2 AND DOCNO = :3"
	_, err = DB.Exec(query, new_doc, CTRLNO, PREFIX)
	if err != nil {
		return "", err
	}
	new_doc_no := fmt.Sprintf("%v_%04d", PREFIX, new_doc)
	return new_doc_no, nil
}

func QueryColumnHeading(doc_no string) (map[string]string, error) {
	DB := ConnectDB()
	defer DB.Close()
	col_head := ""
	query := "select COLUMN_HEADING1 from sql2excel where DOC_NO = :1"
	rows := DB.QueryRow(query, doc_no)
	err := rows.Scan(&col_head)
	if err != nil {
		// case err
		if err != sql.ErrNoRows {
			return nil, nil
		} else {
			return nil, err
		}
	}
	col_heads := map[string]string{}
	if err := json.Unmarshal([]byte(col_head), &col_heads); err != nil {
		return nil, err
	}
	return col_heads, nil
}

package onl_fiber

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/savirusing/onl_api/go_services/onl_db"
	"github.com/savirusing/onl_api/go_services/onl_func"
)

// Query from sql_no (or sql)
func sqlq(c *fiber.Ctx) error {
	sql_no := c.Params("sql_no")
	sql := c.Query("sql")
	sql, err := onl_db.GetSqlOrSqlNo(sql_no, sql, c)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	result, err := onl_db.QuerySql(sql, true)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	return c.JSON(result)
}

// Query with header mapping from sql_no (or sql)
func sqlqh(c *fiber.Ctx) error {
	sql_no := c.Params("sql_no")
	sql, err := onl_db.GetSqlOrSqlNo(sql_no, "", c)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	col_heads, err := onl_db.QueryColumnHeading(sql_no)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	result, err := onl_db.QuerySqlH(sql, col_heads, true)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	return c.JSON(result)
}

// Query Columns from sql_no (or sql)
func sqlh(c *fiber.Ctx) error {
	sql_no := c.Params("sql_no")
	sql := c.Query("sql")
	sql, err := onl_db.GetSqlOrSqlNo(sql_no, sql, c)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	columns, err := onl_db.QuerySqlColumns(sql, nil, true)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	return c.JSON(columns)
}

// Query Columns from sql_no (or sql)
func sqlht(c *fiber.Ctx) error {
	sql_no := c.Params("sql_no")
	sql := c.Query("sql")
	sql, err := onl_db.GetSqlOrSqlNo(sql_no, sql, c)
	if err != nil {
		println(err.Error())
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	columnTypes, err := onl_db.QuerySqlColumnTypes(sql, true)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	return c.JSON(columnTypes)
}

// Query Nested from sql_no1 & sql_no2 with relation or (sql1 & sql2)
func sqln(c *fiber.Ctx) error {
	sql_no1 := c.Query("sql_no1")
	sql1 := c.Query("sql1")
	sql1, err := onl_db.GetSqlOrSqlNo(sql_no1, sql1, c)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	sql_no2 := c.Query("sql_no2")
	sql2 := c.Query("sql2")
	sql2, err = onl_db.GetSqlOrSqlNo(sql_no2, sql2, c)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	relation := c.Query("relation")
	relArr := strings.Split(relation, "=")
	rel_cds1 := strings.ToUpper(relArr[0])
	rel_cds2 := strings.ToUpper(relArr[1])
	res_cds1, err := onl_db.QuerySql(sql1, true)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	// println("CDS1 =", sql1)
	for _, data_cds1 := range res_cds1 {
		if err = onl_db.SqlInjection(sql2); err != nil {
			return c.JSON(onl_func.ErrorReturn(err, c))
		}
		sql := fmt.Sprintf("select * from (%v) where %v = '%v'", sql2, rel_cds2, data_cds1[rel_cds1])
		// println("\tCDS2 =", sql)
		res_cds2, err := onl_db.QuerySql(sql, false)
		if err != nil {
			return c.JSON(onl_func.ErrorReturn(err, c))
		}
		data_cds1["DATA_CDS2"] = res_cds2
	}
	return c.JSON(res_cds1)
}

func sqlnJson(c *fiber.Ctx) error {
	sqlJson := c.Query("sqlJson")
	var data map[string]interface{}
	if err := json.Unmarshal([]byte(sqlJson), &data); err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	res, err := interfaceMap(data)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	return c.JSON(res)
}

func urlJson(c *fiber.Ctx) error {
	url := c.Query("url")
	println(url)
	res, err := onl_func.UrlJson(url)
	// res, err := onl_func.UrlJson("https://dataapi.moc.go.th/ditp-activity-types")
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	return c.JSON(res)
}

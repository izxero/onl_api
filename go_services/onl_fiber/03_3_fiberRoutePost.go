package onl_fiber

import (
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/savirusing/onl_query/go_services/onl_db"
	"github.com/savirusing/onl_query/go_services/onl_func"
)

// Query from sql with post SQL (no sql_no and replace func)
func postSqlq(c *fiber.Ctx) error {
	type POST struct {
		SQL string `json:"SQL"`
	}
	post_values := new(POST)
	if err := c.BodyParser(post_values); err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	res, err := onl_db.QuerySql(post_values.SQL, true)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	return c.JSON(res)
}

// Query Nested from POST SQL11 & SQL2 with relation (no sql_no and replace func)
func postSqln(c *fiber.Ctx) error {
	type POST struct {
		SQL1     string `json:"SQL1"`
		SQL2     string `json:"SQL2"`
		RELATION string `json:"RELATION"`
	}
	post_values := new(POST)
	if err := c.BodyParser(post_values); err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	relArr := strings.Split(post_values.RELATION, "=")
	rel_cds1 := strings.ToUpper(relArr[0])
	rel_cds2 := strings.ToUpper(relArr[1])
	res_cds1, err := onl_db.QuerySql(post_values.SQL1, true)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	// println("CDS1 =", sql1)
	for _, data_cds1 := range res_cds1 {
		if err = onl_db.SqlInjection(post_values.SQL2); err != nil {
			return c.JSON(onl_func.ErrorReturn(err, c))
		}
		sql := fmt.Sprintf("select * from (%v) where %v = '%v'", post_values.SQL2, rel_cds2, data_cds1[rel_cds1])
		// println("\tCDS2 =", sql)
		res_cds2, err := onl_db.QuerySql(sql, false)
		if err != nil {
			return c.JSON(onl_func.ErrorReturn(err, c))
		}
		data_cds1["DATA_CDS2"] = res_cds2
	}
	return c.JSON(res_cds1)
}

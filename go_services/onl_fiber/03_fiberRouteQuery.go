package onl_fiber

import (
	"github.com/gofiber/fiber/v2"
	"github.com/savirusing/onl_query/go_services/onl_db"
	"github.com/savirusing/onl_query/go_services/onl_func"
)

func sqlq(c *fiber.Ctx) error {
	sql, err := onl_db.GetSqlOrSqlNo(c)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	result, err := onl_db.QuerySql(sql)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	return c.JSON(result)
}

func nestedQuery(c *fiber.Ctx) error {
	result, err := onl_func.ReadFileJson("./public/html_template/html_variable.json")
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	result2, err := onl_func.ReadFileJson("./public/html_template/html_variable.json")
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	result["data"] = result2
	return c.JSON(result)
}

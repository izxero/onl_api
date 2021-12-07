package onl_db

import (
	"errors"
	"fmt"
	"net/url"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func GetSqlOrSqlNo(sql_no, sql string, c *fiber.Ctx) (string, error) {
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
	sql = ReplaceWithParams(sql, c)
	return sql, nil
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

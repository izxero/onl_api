package onl

import (
	"errors"
	"strings"

	_ "github.com/godror/godror"
	"github.com/jmoiron/sqlx"
)

var DB *sqlx.DB

func InitDB() {
	db, err := sqlx.Open("godror", `user="kingkong" password="k" connectString="192.168.106.5/APP"`)
	if err != nil {
		panic(err)
	}
	DB = db
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
			response := "error : prohibited command"
			println(response)
			return errors.New("error : sql contains prohibit command")
		}
	}
	return nil
}

func SqlQuery(sql string) (string, error) {
	err := SqlInjection(sql)
	if err != nil {
		return "", err
	}
	DB.Ping()
	return "pss", nil
}

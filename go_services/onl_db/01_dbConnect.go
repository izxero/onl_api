package onl_db

import (
	_ "github.com/godror/godror"
	"github.com/jmoiron/sqlx"
)

var DB *sqlx.DB

func ConnectDB() {
	// db, err := sqlx.Open("godror", `user="kingkong" password="k" connectString="192.168.106.5/APP"`)
	// db, err := sqlx.Open("godror", `user="kingkong" password="k" connectString="192.168.101.240/APP"`)
	db, err := sqlx.Open("godror", "kingkong/k@192.168.101.240/APP")
	if err != nil {
		panic(err)
	}
	DB = db
}

package onl_db

import (
	"fmt"

	_ "github.com/godror/godror"
	"github.com/jmoiron/sqlx"
	"github.com/savirusing/onl_query/go_services/onl_func"
)

// var DB *sqlx.DB

func ConnectDB() *sqlx.DB {
	// db, err := sqlx.Open("godror", `user="kingkong" password="k" connectString="192.168.106.5/APP"`)
	// db, err := sqlx.Open("godror", `user="kingkong" password="k" connectString="192.168.101.240/APP"`)
	// db, err := sqlx.Open("godror", "kingkong/k@192.168.101.240/APP")
	db_driver := onl_func.ViperString("db.driver")
	db_name := onl_func.ViperString("db.user")
	db_pass := onl_func.ViperString("db.pass")
	db_conn := onl_func.ViperString("db.connectString")
	connection := fmt.Sprintf("%v/%v@%v", db_name, db_pass, db_conn)
	db, err := sqlx.Open(db_driver, connection)
	if err != nil {
		panic(err)
	}
	return db
}

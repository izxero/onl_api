package main

import (
	"github.com/savirusing/onl_query/go_services/onl_db"
	"github.com/savirusing/onl_query/go_services/onl_fiber"
)

func main() {
	onl_db.ConnectDB()
	onl_fiber.InitFiber(80, "ONLFINTECH GO SERVICES API")
}

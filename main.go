package main

import (
	"github.com/savirusing/onl_api/go_services/onl_fiber"
	"github.com/savirusing/onl_api/go_services/onl_func"
)

func main() {
	onl_fiber.InitFiber(onl_func.ViperInt("app.port"), onl_func.ViperString("app.name"))
}

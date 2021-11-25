package onl_fiber

import (
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	onl "github.com/savirusing/onl_query/go_services/onl_func"
)

func fiberRoute(app *fiber.App) {
	// Create Group as ==> host:port/test/...
	apiTest := app.Group("/test")
	apiTest.Get("/query1", queryNested1) //host:/port/test/query1
	apiTest.Get("/query2", queryNested2) //host:/port/test/query1

	// Create Group as ==> host:port/log/...
	apiLog := app.Group("/log")
	apiLog.Get("/get/:date?", readLog)
	appRender(apiLog, "/", "html/log/index", "html_template/webix_header") //render htnl/log/index

	// Create Group as ==> host:port/api/key/...
	api := app.Group("/api/:key", checkKey) // Check key for all api requerst via this group
	api.Get("/query", nestedQuery)          // Query from SQL ==> host:port/api/key/query

	// Main Path no Group create ==> host:port/...
	appRender(app, "/", "html/main/index", "html_template/webix_header") //render htnl/main/index
}

func appRender(app fiber.Router, route string, index_path string, template_path string) {
	index_without_ext := strings.Replace(index_path, ".html", "", -1)
	index_with_ext := index_without_ext + ".html"
	template_path_without_ext := strings.Replace(template_path, ".html", "", -1)
	app.Get(route, func(c *fiber.Ctx) error {
		result, err := onl.ReadFileJson("./public/html_template/html_variable.json")
		if err != nil {
			return c.JSON(onl.ErrorReturn(err, c))
		}
		jsonData := onl.JsonForTemplate(result)
		err = c.Render(index_without_ext, jsonData, template_path_without_ext)
		if err != nil {
			return c.JSON(onl.ErrorReturn(err, c))
		}
		return nil
	})
	app.Static(route, "./public", fiber.Static{
		Index: "/" + index_with_ext,
	})
}

func checkKey(c *fiber.Ctx) error {
	key := c.Params("key")
	current := time.Now()
	api_key := strconv.Itoa(100 + int(current.Month()))
	if api_key == key {
		return c.Next()
	}
	err := errors.New("invalid key for api")
	return c.JSON(onl.ErrorReturn(err, c))
}

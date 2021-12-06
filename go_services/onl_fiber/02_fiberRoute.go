package onl_fiber

import (
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/savirusing/onl_api/go_services/onl_func"
)

func fiberRoute(app *fiber.App) {
	// Create Group as ==> host:port/log/...
	apiLog := app.Group("/log")
	apiLog.Get("/get/:date?", readLog)                                     // api to get log file as json from today (or specific date) ==> host:port/log/get/?date? == format "yyyymmdd"
	appRender(apiLog, "/", "html/log/index", "html_template/webix_header") //render html/log/index ==> host:port/log/

	// Create Group as ==> host:port/api/key/...
	api := app.Group("/api/:key", checkKey) // Check key for all api requerst via this group
	// Create Group as ==> host:port/api/key/get/...
	apiGet := api.Group("/get")
	apiGet.Get("/sqlh/:sql_no", sqlh)   // Query Columns from sql_no (or sql) ==> host:/port/api/key/get/sqlh/:sql_no?sql=...
	apiGet.Get("/sqlht/:sql_no", sqlht) // Query Columns from sql_no (or sql) ==> host:/port/api/key/get/sqlh/:sql_no?sql=...
	apiGet.Get("/sqlq/:sql_no", sqlq)   // Query from sql_no (or sql) ==> host:/port/api/key/get/sqlq/:sql_no/:sql_no?sql=...
	apiGet.Get("/sqln", sqln)           // Query nested parent: sql1 with child: sql2 connect with parameter ==> host:/port/api/key/get/sqln?(sql_no1||sql1)=...&(sql_no2||sql2)=...&relation=parent_key=child_key
	apiGet.Get("/sqlnjson", sqlnJson)   // Query nested from POST DATA SQL1 & SQL2 & RELATION ==> host:port/api/key/post/sqlnjson

	// Create Group as ==> host:port/api/key/post/...
	apiPost := api.Group("/post")
	apiPost.Post("/sqlh", postSqlh)         // Query Columns from POST DATA SQL ==> host:port/api/key/post/sqlh
	apiPost.Post("/sqlq", postSqlq)         // Query from POST DATA SQL ==> host:port/api/key/post/sqlq
	apiPost.Post("/sqln", postSqln)         // Query nested from POST DATA SQL1 & SQL2 & RELATION ==> host:port/api/key/post/sqln
	apiPost.Post("/sqlnjson", postSqlnJson) // Query nested from POST DATA SQL1 & SQL2 & RELATION ==> host:port/api/key/post/sqlnjson

	// no group as ==> host:port/api/key/cud/...
	api.Post("/cud", updateDB) // Update Anytable with this apiPost

	// Create Group as ==> host:port/test/...
	apiTest := app.Group("/test")
	apiTest.Get("/query1", queryNested1) //host:/port/test/query1
	apiTest.Get("/query2", queryNested2) //host:/port/test/query2
	apiTest.Post("/readPost", readPost)  //try reading post without struct
	apiTest.Get("/sqlJson", sqlJson)     // try query sql as master-detail-... from Json relation

	// Main Path no Group create ==> host:port/...
	appRender(app, "/", "html/main/index", "html_template/webix_header") //render htnl/main/index
}

func appRender(app fiber.Router, route string, index_path string, template_path string) {
	index_without_ext := strings.Replace(index_path, ".html", "", -1)
	index_with_ext := index_without_ext + ".html"
	template_path_without_ext := strings.Replace(template_path, ".html", "", -1)
	app.Get(route, func(c *fiber.Ctx) error {
		result, err := onl_func.ReadFileJson("./public/html_template/html_variable.json")
		if err != nil {
			return c.JSON(onl_func.ErrorReturn(err, c))
		}
		jsonData := onl_func.JsonForTemplate(result)
		err = c.Render(index_without_ext, jsonData, template_path_without_ext)
		if err != nil {
			return c.JSON(onl_func.ErrorReturn(err, c))
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
	return c.JSON(onl_func.ErrorReturn(err, c))
}

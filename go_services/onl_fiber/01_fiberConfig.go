package onl_fiber

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cache"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/template/html"
)

func InitFiber(port int, app_name string) {
	app := fiber.New(fiber.Config{
		AppName:      app_name,
		Prefork:      true,
		Views:        fiberGetHtmlsPath(false),
		ServerHeader: "Fiber",
	})
	fiberRecovery(app)
	fiberLogger(app)
	fiberCors(app)
	fiberCache(app)
	fiberRoute(app)
	app.Listen(":" + strconv.Itoa(port))
}

func fiberGetHtmlsPath(debug bool) *html.Engine {
	//get all .html file in ./public and show in path to the html file
	htmls := html.New("./public", ".html")
	//set to always reload template file
	htmls.Reload(true)
	//show debugging for (show path of htmls)
	htmls.Debug(debug)
	//set the environment of layout replacing
	htmls.Layout("embed")
	htmls.Delims("{{", "}}")
	return htmls
}

func fiberRecovery(app *fiber.App) {
	app.Use(recover.New())
}

func fiberLogger(app *fiber.App) {
	os.MkdirAll("./log", os.ModePerm)
	yy, mm, dd := time.Now().Date()
	log_file_name := fmt.Sprintf("./log/%v%v%v.txt", yy, int(mm), dd)
	if _, err := os.Stat(log_file_name); err != nil {
		if f, err := os.Create(log_file_name); err != nil {
			panic(err)
		} else {
			f.Close()
		}
	}
	f, err := os.OpenFile(log_file_name, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	// wrt := io.MultiWriter(os.Stdout, f) //write while also print log to console
	app.Use(logger.New(logger.Config{
		Format:     "{\n\t\"timestamp\":\"${time}\",\n\t\"ip\":\"${ip}\",\n\t\"status\":\"${status}\",\n\t\"method\":\"${method}\",\n\t\"path\":\"${path}\",\n\t\"queryParams\":\"${queryParams}\",\n\t\"latency\":\"${latency}\"\n},\n",
		TimeFormat: "02-Jan-2006 T15:04:05",
		Output:     f, //wrt,
	}))
}

func fiberCors(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowHeaders: "Origin, Content-Type, Accept, Cache-Control, Pragma, Expires",
	}))
}

func fiberCache(app *fiber.App) {
	app.Use(cache.New(cache.Config{
		Next: func(c *fiber.Ctx) bool {
			return c.Query("refresh") == "true"
		},
		Expiration:   1 * time.Second,
		CacheControl: true,
	}))
}

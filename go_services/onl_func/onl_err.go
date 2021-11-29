package onl_func

import (
	"github.com/gofiber/fiber/v2"
)

func ErrorReturn(err error, c *fiber.Ctx) map[string]interface{} {
	url := c.BaseURL() + c.OriginalURL()
	result := make(map[string]interface{})
	result["status"] = "error"
	result["error"] = err.Error()
	result["url"] = url
	return result
}

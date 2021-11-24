package onl_fiber

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	onl "github.com/savirusing/onl_query/go_services/onl_func"
)

func readLog(c *fiber.Ctx) error {
	yy, mm, dd := time.Now().Date()
	log_file_name := fmt.Sprintf("./log/%v%v%v.txt", yy, int(mm), dd)
	if c.Params("date") != "" {
		log_file_name = "./log/" + c.Params("date") + ".txt"
	}
	if data, err := os.ReadFile(log_file_name); err != nil {
		return c.JSON(onl.ErrorReturn(err, c))
	} else {
		if len(data) < 3 {
			err := errors.New("no data found")
			return c.JSON(onl.ErrorReturn(err, c))
		}
		no_comma := data[:len(data)-2]
		log_data := fmt.Sprintf("[%v]", string(no_comma))
		log_data = strings.Replace(log_data, "\n", "", -1)
		log_data = strings.Replace(log_data, "\t", "", -1)
		type LogData struct {
			Timestamp   string `db:"timestamp" json:"timestamp"`
			Ip          string `db:"ip" json:"ip"`
			Status      string `db:"status" json:"status"`
			Method      string `db:"method" json:"method"`
			Path        string `db:"path" json:"path"`
			QueryParams string `db:"queryParams" json:"queryParams"`
			Latency     string `db:"latency" json:"latency"`
		}
		jsonData := []LogData{}
		if err := json.Unmarshal([]byte(log_data), &jsonData); err != nil {
			return c.JSON(onl.ErrorReturn(err, c))
		}
		return c.JSON(jsonData)
	}
}

package onl_fiber

import (
	"encoding/json"
	"fmt"
	"os"
	"sort"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/savirusing/onl_api/go_services/onl_func"
)

func readDirectory(c *fiber.Ctx) error {
	type POST struct {
		PATH string `json:"PATH"`
		DATA string `json:"DATA"`
	}
	post_values := new(POST)
	if err := c.BodyParser(post_values); err != nil {
		return c.JSON(nil)
	}
	data_json := make(map[string]interface{})
	if post_values.DATA == "" {
		data_json = nil
	} else {
		if err := json.Unmarshal([]byte(post_values.DATA), &data_json); err != nil {
			return c.JSON(nil)
		}
	}
	pathArr := strings.Split(post_values.PATH, "/")
	pathMapArr := []string{}
	for _, v := range pathArr {
		value := fmt.Sprintf("%v", v)
		pathMapArr = append(pathMapArr, fmt.Sprintf("%v", data_json[value]))
	}
	pathMap := strings.Join(pathMapArr, "/")
	files, err := getFiles(pathMap)
	if err != nil {
		return c.JSON(nil)
	}
	return c.JSON(files)
}

func fileUploadTemp(c *fiber.Ctx) error {
	pathMap := "uploads/temp"
	if len(os.Args) > 1 {
		pathMap = os.Args[1]
	}
	_, err := os.Stat(pathMap)
	if err != nil {
		_ = os.MkdirAll(pathMap, os.ModePerm)

	}

	file, err := c.FormFile("uploader")
	if err != nil {
		println(err.Error())
		return c.JSON(fiber.Map{
			"status":   "error",
			"error":    err.Error(),
			"filename": file.Filename,
		})
	}
	fullpath := fmt.Sprintf("%v/%v", pathMap, file.Filename)
	err = c.SaveFile(file, fullpath)
	if err != nil {
		println(err.Error())
		return c.JSON(fiber.Map{
			"status":   "error",
			"error":    err.Error(),
			"filename": file.Filename,
		})
	}
	return c.JSON(fiber.Map{
		"status":     "server",
		"TEMPFOLDER": fullpath,
		"FILENAME":   file.Filename,
	})
}

func fileUpload(c *fiber.Ctx) error {
	type POST struct {
		PATH string `json:"PATH"`
		DATA string `json:"DATA"`
	}
	post_values := new(POST)
	if err := c.BodyParser(post_values); err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	data_json := make(map[string]interface{})
	if post_values.DATA == "" {
		data_json = nil
	} else {
		if err := json.Unmarshal([]byte(post_values.DATA), &data_json); err != nil {
			return c.JSON(onl_func.ErrorReturn(err, c))
		}
	}
	pathArr := strings.Split(post_values.PATH, "/")
	pathMapArr := []string{}
	for _, v := range pathArr {
		value := fmt.Sprintf("%v", v)
		pathMapArr = append(pathMapArr, fmt.Sprintf("%v", data_json[value]))
	}
	pathMap := strings.Join(pathMapArr, "/")
	println(pathMap)
	return nil
}

func getFiles(path string) ([]map[string]interface{}, error) {
	files, err := ReadDir(path)
	if err != nil {
		return nil, err
	}
	var datas []map[string]interface{}
	for i, v := range files {
		datas = append(datas, map[string]interface{}{
			"id":       i + 1,
			"FILENAME": v.Name(),
			"FILESIZE": v.Size(),
		})
		// datas[i] = map[string]interface{}{
		// 	"id":i+1,
		// 	"FILENAME":v.Name(),
		// 	"FILETYPE":v.Sys(),
		// 	"FILESIZE":v.Size(),
		// }
	}
	return datas, nil
}

func ReadDir(dirname string) ([]os.FileInfo, error) {
	f, err := os.Open(dirname)
	if err != nil {
		return nil, err
	}
	list, err := f.Readdir(-1)
	f.Close()
	if err != nil {
		return nil, err
	}
	sort.Slice(list, func(i, j int) bool { return list[i].Name() < list[j].Name() })
	return list, nil
}

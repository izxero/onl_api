package onl_func

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"strconv"
	"time"
)

func ReadFileJson(file_path string) (map[string]interface{}, error) {
	jsonFile, err := os.Open(file_path)
	if err != nil {
		return nil, err
	}
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)
	var result map[string]interface{}
	json.Unmarshal([]byte(byteValue), &result)
	return result, nil
}

func JsonForTemplate(data map[string]interface{}) map[string]interface{} {
	data["api_key"] = strconv.Itoa(int(time.Now().Month()) + 100)
	return data
}

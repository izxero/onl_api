package onl_func

import (
	"encoding/json"
	"io"
	"net/http"
)

func UrlJson(url string) ([]map[string]interface{}, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	res_string := string(body)
	var resArray []map[string]interface{}
	if err := json.Unmarshal([]byte(res_string), &resArray); err != nil {
		var resOne map[string]interface{}
		if err := json.Unmarshal([]byte(res_string), &resOne); err != nil {
			return nil, err
		}
		resArray = append(resArray, resOne)
	}
	return resArray, nil
}

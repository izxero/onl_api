package onl_fiber

import (
	"encoding/json"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/savirusing/onl_api/go_services/onl_db"
	"github.com/savirusing/onl_api/go_services/onl_func"
)

func getResp(c *fiber.Ctx)error{
	resp, err := http.Get("http://example.com/")
	if err != nil {
		// handle error
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	return nil
}

func queryNested1(c *fiber.Ctx) error {
	sql := "select id ,vchr_no,db,cr from gl_vchr v where id like '11%' order by id"
	res, err := onl_db.QuerySql(sql, true)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	id := ""
	gl_name := ""
	for _, mst_value := range res {
		current_id := fmt.Sprintf("%v", mst_value["ID"])
		if current_id != id {
			// fmt.Printf("new id found : current id %v : previous id : %v\n", current_id, id)
			sql = fmt.Sprintf("select name_thai from gl_mst where id = '%v'", current_id)
			// println(sql)
			gl_name_res, err := onl_db.QuerySql(sql, true)
			if err != nil {
				return c.JSON(onl_func.ErrorReturn(err, c))
			}
			gl_name = fmt.Sprintf("%v", gl_name_res[0]["NAME_THAI"])
			mst_value["GL_NAME"] = gl_name
		} else {
			// fmt.Printf("current id %v : previous id : %v\n", current_id, id)
			mst_value["GL_NAME"] = gl_name
		}
		// fmt.Printf("\tID = %v & GL_NAME = %v\n", current_id, mst_value["GL_NAME"])
		id = fmt.Sprintf("%v", mst_value["ID"])
	}
	return c.JSON(res)
}

func queryNested2(c *fiber.Ctx) error {
	sql := "select id, Name_thai from gl_mst where rownum < 10"
	res, err := onl_db.QuerySql(sql, true)
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	for _, mst_value := range res {
		current_id := fmt.Sprintf("%v", mst_value["ID"])
		sql = fmt.Sprintf("select id,vchr_no, db, cr from gl_vchr where id = '%v'", current_id)
		gl_name_res, err := onl_db.QuerySql(sql, true)
		if err != nil {
			return c.JSON(onl_func.ErrorReturn(err, c))
		}
		mst_value["data"] = gl_name_res
	}
	return c.JSON(res)
}

func readPost(c *fiber.Ctx) error {
	// var data map[string]interface{}
	// err := json.NewDecoder(c.Request().Body()).Decode(&data)
	chttp := c.Context().PostBody()
	fmt.Printf("%v\n", string(chttp))
	return c.JSON(nil)
}

func sqlJson(c *fiber.Ctx) error {
	sqlJson := c.Query("sqlJson")
	var data map[string]interface{}
	if err := json.Unmarshal([]byte(sqlJson), &data); err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	res, err := interfaceToMap(data, nil,"")
	if err != nil {
		return c.JSON(onl_func.ErrorReturn(err, c))
	}
	return c.JSON(res)
}

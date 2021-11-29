package onl_func

import (
	"github.com/spf13/viper"
)

func setViperEnv() error {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		return err
	}
	return nil
}

func ViperString(name string) string {
	err := setViperEnv()
	if err != nil {
		return "err"
	}
	return viper.GetString(name)
}

func ViperInt(name string) int {
	err := setViperEnv()
	if err != nil {
		return 0
	}
	return viper.GetInt(name)
}

func ViperBool(name string) bool {
	err := setViperEnv()
	if err != nil {
		return false
	}
	return viper.GetBool(name)
}

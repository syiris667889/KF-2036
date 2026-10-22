package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "users.db")
	if err != nil {
		log.Fatal("Ошибка открытия базы данных!", err)
	}
	defer db.Close()
	createTable := `
	CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL UNIQUE,
			password TEXT NOT NULL,
			balance REAL DEFAULT 0.0
	);`
	_, err = db.Exec(createTable)
	if err != nil {
		log.Fatal("Ошибка создания таблицы!", err)
	}
	fmt.Println("Выберите действие: 1-Регистрация | 2-Вход")
	var choice int
	_, err = fmt.Scan(&choice)
	if err != nil {
		fmt.Println("Ошибка!Некорректное значение")
		return
	}
	switch choice {
	case 1:
		var new_user, new_password string
		fmt.Println("Введите имя нового пользователя: ")
		fmt.Scan(&new_user)
		var exists bool
		checkQuery := "SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)"
		err := db.QueryRow(checkQuery, new_user).Scan(&exists)
		if err != nil {
			fmt.Println("Ошибка при проверке имени!", err)
			return
		}
		if exists {
			fmt.Println("Это имя уже занято!")
			return
		}
		fmt.Printf("Введите пароль для %s: \n", new_user)
		fmt.Scan(&new_password)
		insertQuery := "INSERT INTO users (username, password) VALUES (?, ?)"
		_, err = db.Exec(insertQuery, new_user, new_password)
		if err != nil {
			fmt.Println("Ошибка при регистрации!", err)
			return
		}
		fmt.Printf("%s,Добро пожаловать в систему!", new_user)
		balance(new_user)
	case 2:
		var username string
		fmt.Println("Введите имя пользователя: ")
		fmt.Scan(&username)
		var dbPassword string
		var dbBalance float64
		nameQuery := "SELECT password, balance FROM users WHERE username = ?"
		err := db.QueryRow(nameQuery, username).Scan(&dbPassword, &dbBalance)
		if err == sql.ErrNoRows {
			fmt.Println("Ошибка пользователь с таким именем не найден!")
			return
		} else if err != nil {
			fmt.Println("Ошибка базы данных!", err)
			return
		}
		var password string
		fmt.Printf("Введите пароль для %s: \n", username)
		fmt.Scan(&password)
		if password != dbPassword {
			fmt.Println("Ошибка!Неверный пароль")
			return
		}
		fmt.Printf("%s,Добро пожаловать в систему!", username)
		balance(username)
	}
}

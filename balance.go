package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

func balance(username string) {
	db, err := sql.Open("sqlite", "users.db")
	if err != nil {
		log.Fatal("Ошибка открытия базы данных!", err)
	}
	matrix := [5][5]float64{
		{1.00, 2.51, 4.76, 0.05, 0.06},
		{0.40, 1.00, 1.90, 0.02, 0.02},
		{0.21, 0.53, 1.00, 0.01, 0.01},
		{20.07, 50.35, 95.42, 1.00, 1.12},
		{17.90, 44.92, 85.13, 0.89, 1.00},
	}
	currencies := [5]string{"MDL", "UAH", "RUB", "EUR", "USD"}
	var choice int
	fmt.Println("Выберите действие: 1-Мой баланс | 2-Внести депозит | 3-Перевести деньги ")
	_, err = fmt.Scan(&choice)
	if err != nil {
		fmt.Println("Ошибка!Некорректное значение")
		return
	}
	switch choice {
	case 1:
		var balanceInUSD float64
		err = db.QueryRow("SELECT balance FROM users WHERE username = ?", username).Scan(&balanceInUSD)
		if err != nil {
			fmt.Println("Ошибка при получении баланса!", err)
			return
		}
		fmt.Println("В какой валюте показать баланс? 1-MDL | 2-UAH | 3-RUB | 4-EUR | 5-USD")
		var currChoice int
		_, err = fmt.Scan(&currChoice)
		if err != nil || currChoice < 1 || currChoice > 5 {
			fmt.Println("Ошибка! Некорректный выбор валюты")
			return
		}
		convertedBalance := balanceInUSD * matrix[4][currChoice-1]
		if convertedBalance == 0 {
			fmt.Println("Ваш баланс пуст!")
		} else {
			fmt.Printf("Ваш баланс: %.2f %s\n", convertedBalance, currencies[currChoice-1])
		}
	case 2:
		fmt.Println("В какой валюте вносится депозит? 1-MDL | 2-UAH | 3-RUB | 4-EUR | 5-USD")
		var currChoice int
		_, err = fmt.Scan(&currChoice)
		if err != nil || currChoice < 1 || currChoice > 5 {
			fmt.Println("Ошибка! Некорректный выбор валюты")
			return
		}
		var depositAmount float64
		fmt.Println("Введите сумму для депозита:")
		_, err = fmt.Scan(&depositAmount)
		if err != nil || depositAmount <= 0 {
			fmt.Println("Ошибка! Некорректная сумма")
			return
		}
		depositInUSD := depositAmount * matrix[currChoice-1][4]
		_, err = db.Exec("UPDATE users SET balance = balance + ? WHERE username = ?", depositInUSD, username)
		if err != nil {
			fmt.Println("Ошибка при пополнении баланса!", err)
			return
		}
		var updatedUSD float64
		err = db.QueryRow("SELECT balance FROM users WHERE username = ?", username).Scan(&updatedUSD)
		if err != nil {
			fmt.Println("Депозит внесен, но не удалось получить текущий баланс", err)
			return
		}
		fmt.Printf("Депозит успешно внесен! Текущий баланс в USD: %.2f $\n", updatedUSD)
	case 3:
		var recipient string
		var amount float64
		fmt.Println("Введите имя получателя:")
		fmt.Scan(&recipient)
		if recipient == username {
			fmt.Println("Ошибка! Нельзя переводить деньги самому себе")
			return
		}
		fmt.Println("Введите сумму перевода (в USD):")
		_, err = fmt.Scan(&amount)
		if err != nil || amount <= 0 {
			fmt.Println("Некорректная сумма")
			return
		}
		var senderBalance float64
		err = db.QueryRow("SELECT balance FROM users WHERE username = ?", username).Scan(&senderBalance)
		if err != nil {
			fmt.Println("Ошибка базы данных!", err)
			return
		}
		if senderBalance < amount {
			fmt.Println("Недостаточно средств!")
			return
		}
		var recipientExists bool
		err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)", recipient).Scan(&recipientExists)
		if err != nil || !recipientExists {
			fmt.Println("Ошибка! Получатель не найден")
			return
		}
		_, err = db.Exec("UPDATE users SET balance = balance - ? WHERE username = ?", amount, username)
		if err != nil {
			fmt.Println("Ошибка при переводе!", err)
			return
		}
		_, err = db.Exec("UPDATE users SET balance = balance + ? WHERE username = ?", amount, recipient)
		if err != nil {
			fmt.Println("Ошибка при зачислении средств получателю!", err)
			return
		}
		var updatedBalance float64
		err = db.QueryRow("SELECT balance FROM users WHERE username = ?", username).Scan(&updatedBalance)
		if err != nil {
			fmt.Println("Перевод выполнен, но не удалось получить текущий баланс")
			return
		}
		fmt.Printf("Перевод выполнен! Ваш текущий баланс: %.2f USD\n", updatedBalance)

	}
}

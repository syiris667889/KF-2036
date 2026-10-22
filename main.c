#include"login.h"
#include"convert.h"
#include"balance.h"
#include<stdio.h>

int main(void) {
    char current_user[15];
    int choice;
    printf("\n             Добро пожаловать в наш банк!\n");
    printf("      Для дальнейшей работы нужно авторизироваться\n");
    do {
    if(login(current_user) == 0) {
    printf("      Выберите дальнейшее действие: 0-Выход | 1-Баланс | 2-Обмен валют\n ");
    if(scanf("%d", &choice) != 1) {
        printf("Ошибка!Некорректное значение\n");
        while(getchar() != '\n');
        return 1;
    }
    switch (choice)
    {
    case 0:
        printf("Программа успешно завершена!\n");
        return 1;
        break;
    case 1:
        balance(current_user);
        break;
    case 2:
        convert();
        break;
    default:
        printf("Ошибка!Некорректное значение\n");
        return 1;
        break;
    }
    } else {
        return 1;
    }
}while(choice != 0);
    return 0;
}
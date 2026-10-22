#include "balance.h"
#include<stdio.h>
#include<stdlib.h>
#include<time.h>
#include<string.h>

int code(void) {
    srand(time(NULL));
    int code = rand() % 900000 + 100000;
    int user_code;
    printf("Для подтверждения действия введите код из 6 цифр: \n");
    printf("Ваш код %d\n", code);
    if(scanf("%d", &user_code) != 1) {
        printf("Ошибка неккоретное значение\n");
        return 1;
    }
    if(code == user_code) {
        printf("Подтверждение прошло успешно!\n");
        return 0;
    } else {
        printf("Неверный код!\n");
        return 1;
    }
}
int transfer(const  char *sender_username) {
    FILE *file =  NULL;
    FILE *temp =  NULL;
    char file_name[15], file_pass[20];
    char recipient[15];
    
    float file_balance = 0.0f;
    float amount = 0.0f;
    float sender_balance = 0.0f;

    int sender_found = 0;
    int recipient_found = 0;
    printf("Для перевода введите имя получателя: \n");
    scanf("%14s", recipient);
    
    if(strcmp(sender_username, recipient) == 0) {
        printf("Ошибка!Нельзя переводить деньги самому себе\n");
        return 1;
    }
    printf("Введите сумму перевода: \n");
    if(scanf("%f", &amount) != 1 || amount <= 0) {
        printf("Некорректная сумма \n");
        while(getchar() != '\n');
        return 1;
    }
    file = fopen("users.txt", "r");
    if(file == NULL) {
        printf("Ошибка открытия баззы данных!\n");
        return 1;
    }
    while(fscanf(file, "%14s %19s %f", file_name, file_pass, &file_balance) == 3) {
        if(strcmp(file_name, sender_username) == 0) {
            sender_balance = file_balance;
            sender_found = 1;
        }
        if(strcmp(file_name, recipient) == 0) {
            recipient_found = 1;
        }
    }
    fclose(file);
    if(!recipient_found) {
        printf("Ошибка! Получатель не найден\n");
        return 1;
    }  
    if(sender_balance < amount) {
        printf("Недостаточно средств\n");
        return 1;
    } 
    if(code() == 0) {
    file = fopen("users.txt", "r");
    temp = fopen("temp.txt", "w");

    if(file == NULL || temp == NULL) {
        printf("Ошибка открытия временной баззы данных\n");
        return 1;
    }
    while(fscanf(file, "%14s %19s %f", file_name, file_pass, &file_balance) == 3) {
        if(strcmp(file_name, sender_username) == 0) {
            fprintf(temp, "%s %s %.2f\n", file_name, file_pass, file_balance - amount);
        } else if(strcmp(file_name, recipient) == 0) {
            fprintf(temp, "%s %s %.2f\n", file_name, file_pass, file_balance + amount);
        } else {
            fprintf(temp, "%s %s %.2f\n", file_name, file_pass, file_balance);
        }
    }
    fclose(file);
    fclose(temp);
    remove("users.txt");
    rename("temp.txt", "users.txt");
}
    return 0; 
}
int balance(const char *username) {
    FILE *file = NULL;
    FILE *temp = NULL;
    
    char file_name[15], file_pass[20];
    float file_balance = 0.0f;
    float current_user_balance = 0.0f;
    int user_found = 0;
    int choice;

    do {
    file = fopen("users.txt", "r");
    if(file == NULL) {
        printf("Ошибка открытия базы данных!\n");
        return 1;
    }

    while (fscanf(file, "%14s %19s %f", file_name, file_pass, &file_balance) == 3) {
        if (strcmp(file_name, username) == 0) {
            current_user_balance = file_balance;
            user_found = 1;
        }
    }
    fclose(file);

    if (!user_found) {
        printf("Ошибка: пользователь не найден в базе!\n");
        return 1;
    }

    printf("      Выберите действие: 1-Мой баланс | 2-Внести депозит | 3-Перевести деньги | 0-Выход\n");
    if(scanf("%d", &choice) != 1) {
        printf("Ошибка! Некорректное значение\n");
        return 1;
    }

    switch (choice) {
        case 1: {
            if(current_user_balance == 0) {
                printf("Ваш баланс пуст!\n");
            } else {
                printf("Ваш баланс: %.2f\n", current_user_balance);
            }
            break;
        }
        case 2: {
            float deposit = 0.0f;
            printf("Введите сумму для депозита: \n");
            if(scanf("%f", &deposit) != 1 || deposit <= 0) {
                printf("Ошибка! Некорректная сумма\n");
                return 1;
            }
            
            if (code() == 0) {
                float new_balance = current_user_balance + deposit;

                file = fopen("users.txt", "r");
                temp = fopen("temp.txt", "w");

                while (fscanf(file, "%14s %19s %f", file_name, file_pass, &file_balance) == 3) {
                    if (strcmp(file_name, username) == 0) {
                        fprintf(temp, "%s %s %.2f\n", file_name, file_pass, new_balance);
                    } else {
                        fprintf(temp, "%s %s %.2f\n", file_name, file_pass, file_balance);
                    }
                }

                fclose(file);
                fclose(temp);

                remove("users.txt");
                rename("temp.txt", "users.txt");

                printf("Депозит успешно внесен!\nНовый баланс: %.2f\n", new_balance);
            }
            break;
        }
        case 3:
            transfer(username);
            break;
        case 0:
            printf("Программа завершена!\n");
            break;
        default:
            printf("Неверный выбор!\n");
            break;
    }
}while(choice != 0);

    return 0;
}
 

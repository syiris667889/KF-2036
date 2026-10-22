#include"login.h"
#include<stdio.h>
#include<string.h>

int login(char *logged_user) {
    FILE *file = NULL;
    char file_name[15], file_pass[20];
    float file_balance;
    int choice;
    do {
    printf("   Выберите действие: 1-Регистрация | 2-Вход | 0-Выход\n");
    if(scanf("%d", &choice) != 1) {
        printf("Ошибка!Некорректное значение\n");
        while(getchar() != '\n');
    }
    switch (choice) {
    case 1: {
        char new_name[15], new_pass[20];
        printf("Введите имя нового пользователя: \n");
        scanf("%14s", new_name);
        file = fopen("users.txt", "r");
        if(file == NULL) {
            file = fopen("users.txt", "w");
            if(file == NULL) {
                printf("Ошибка открытия базы данных!\n");
                return 1;
            }
            fclose(file);
        }
        file = fopen("users.txt", "r");
        while(fscanf(file, "%14s %19s %f",file_name, file_pass, &file_balance) == 3) {
            if(strcmp(new_name, file_name) == 0) {
                printf("Это имя уже занято!\n");
                fclose(file);
                while(getchar() != '\n');
                break;
                return 1;
            }
        }fclose(file);
        printf("Введите пароль для нового пользователя: \n");
        scanf("%19s", new_pass);
        file = fopen("users.txt", "a");
        if(file == NULL) {
            printf("Ошибка открытия базы данных!");
            return 1;
        }
        fprintf(file, "%s %s %.2f\n", new_name, new_pass, 0.00);
        printf("             %s,Вы успешно зарегестрированны!\n", new_name);
        strcpy(logged_user, new_name);
        fclose(file);
        return 0;
    }
    case 2: {
        char name[15], pass[20];
        printf("Введите имя пользователя: \n"); 
        scanf("%14s", name);
        printf("Введите пароль: \n");
        scanf("%19s", pass);

        file = fopen("users.txt", "r");
        if(file == NULL) {
            printf("Ошибка открытия базы данных!");
            return 1;
        }
        int found = 0;

        while(fscanf(file, "%14s %19s %f",file_name, file_pass, &file_balance) == 3) {
            if(strcmp(name, file_name) == 0 && strcmp(pass, file_pass) == 0) {
            printf("             %s,Добро пожаловать в систему!\n", name);
            strcpy(logged_user, name);
            found = 1;
            choice = 0;
            break;
            }
        }
        fclose(file);
        if(!found) {
            printf("Неверный логин или пароль!\n");
        } else {
            return 0;
        }
        break; 
    }
    case 0:
        printf("Программа завершена!\n");
        choice = 0;
        return 1;
    default:
        printf("Ошибка!Некорректное значение\n");
        break;
    }
    } while(choice != 0);
    return 0;
}
#include"convert.h"
#include<stdio.h>
#include<string.h>

#define ROWS 5
#define COLS 5 

int convert(void) {
     float rate[ROWS][COLS] = {
    {1, 2.52, 4.69, 0.05, 0.06},
    {0.40, 1, 1.86, 0.02, 0.02},
    {0.21, 0.54, 1, 0.01, 0.01},
    {20.11, 50.71, 94.27, 1, 1.13},
    {17.80, 44.89, 83.45, 0.89,1}
};
    char *currencies[5] = {
    "MDL", "UAH", "RUB", "EUR", "USD"
};
    int row, col;
    float result, amount;
    do {
    printf("Введите начальную валюту: 1-MDL/Леи | 2-UAH/Гривны | 3-RUB/Рубли | 4-EUR/Евро | 5-USD/Долары | 0-Выход\n");
    if(scanf("%d", &row) != 1 || row < 0 || row >5) {
        printf("Ошибка!Некорректное значение\n");
        while(getchar() != '\n');
        break;
    }
    printf("Введите валюту в которую конвертируем: 1-MDL/Леи | 2-UAH/Гривны | 3-RUB/Рубли | 4-EUR/Евро | 5-USD/Долары | 0-Выход\n");
    if(scanf("%d", &col) != 1 || col < 0 || col > 5) {
        printf("Ошибка!Некорректное значение\n");
        while(getchar() != '\n');
        break;
    }
    if(row == col){
        printf("Ошибка!Валюты совпадают\n");
        while(getchar() != '\n');
        break;
    }
    printf("Введите сумму для конвертации: \n");
    if(scanf("%f", &amount) != 1) {
        printf("Ошибка!Сумма должна быть числом\n");
        while(getchar() != '\n');
        break;
    }
    result = amount * rate[row - 1][col - 1]; 

    printf("Итоговая сумма равна %.f %s\n", result, currencies[col -1]);
    }while(row != 0 || col != 0);
    return 0;
}
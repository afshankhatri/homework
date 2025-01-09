#include <stdio.h>

int array ();
int bubble_sort();
int pattern1();
int pattern2();
int pattern3();
int pattern4();
int pattern5();


int main(int argc, char const *argv[])
{
    // array(); he he 
    pattern1();
    pattern2();
    pattern3();
    pattern4();
    pattern5();
    // bubble_sort();
    return 0;
}


int array (){
    // single dimension array;
    int arr[5] = {1,2,3,4,5};
    // printf("%d",arr[2]);
    for (int i = 0; i < 5; i++)
    {
        printf("%d\n",arr[i]);
    }
    

    // multi dimesion array
    int arre[2][2] = {{1,2},{3,4}};
    // printf("\n%d",arre[1][1]);
    for (int i = 0; i < 2; i++)
    {
        for (int j = 0; j < 2; j++)
        {
            printf("%d",arre[i][j]);
        }
        printf("\n");
    }

    // 3d array
    int arra[3][3][3] = {{{1,2,3},{2,4,5},{3,4,5}},{{4,5,6},{5,6,7},{6,7,8}},{{7,8,9},{8,9,10},{9,10,11}}};
    printf("%d\n",arra[2][1][0]);

    for (int i = 0; i < 3; i++)
    {
        // printf("\n%d\n me hu ",i);
        for (int j = 0; j < 3; j++)
        {
            // printf("%d",j);
            for (int k = 0; k <3; k++)
            {
                // printf("%d",k);
                printf("%d\n",arra[i][j][k]);
            }
            
        }
        
    }
    
}


int bubble_sort(){
    int temp=0;
    int array[10] = {1,2,3,9,8,7,4,5,6,0};
    for (int i = 0; i < 10; i++)
    {
        for (int j = i; j < 10; j++)
        {
            if (array[i]>array[j])
            {
                temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }   
        }
    }
    //To print 
    for (int i = 0; i < 10; i++)
    {
        printf("%d",array[i]);
    }
}

int pattern1 (){
    for (int i = 0; i < 5; i++)
    {
        for (int j = 0; j < 5; j++)
        {
            printf("*");
        }
        printf("\n");
    }   
}

int pattern2(){
    for (int i = 0; i < 5; i++)
    {
        for (int j = 0; j < 5; j++)
        {
            if (j<=i)
            {
                printf("*");
            }
            
        }
        printf("\n");
    }   
}


int pattern3(){
    for (int i = 0; i < 5; i++)
    {
        for (int j = 0; j < 5; j++)
        {
            if (i<=j)
            {
                printf("*");
            }
            else{  // make sure to print this space as well other wise the patter will not be according to the requirement .... if we dont put spaces the patter shape is left-hand-side down-ward-pointing
                printf(" ");
            }
            
        }
        printf("\n");
    }   
}

int pattern4(){
    for (int i = 0; i < 5; i++)
    {
        for (int j = 5; j > 0; j--)
        {
            if (i<=j)
            {
                printf("*");
            }
            else{
                printf(" ");
            }
        }
        printf("\n");
    }   
}

int pattern5(){
int row=5;  //important step
for (int i = 0; i < row; i++)
{
    for (int j = 0; j < row-i-1; j++)
    {
        printf(" ");
    }
    for (int k = 0; k < i ; k++)
    {
        printf("*");
    }   
    printf("\n");
}

}

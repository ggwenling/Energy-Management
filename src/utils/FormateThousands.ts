


export const FormateThousands = (num: number): string => {

    if (isNaN(num) || typeof (num) !== "number") {
        throw Error(`FormateThousands must be a number`);
    } else {
        const [integer, decimal] = num.toString().split('.')



        let formattedNum = ""

        for (let i = integer!.length - 1; i >= 0; i--) {

            // @ts-ignore
            formattedNum = integer[i] + formattedNum
            if((integer!.length-i)%3===0&&i!==0){
                formattedNum = ','+formattedNum
            }


        }

         return decimal?`${formattedNum}.${decimal}`:formattedNum

    }

}

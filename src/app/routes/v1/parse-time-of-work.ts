const axios = require('axios');
const cheerio = require('cheerio')



async function parse() {
    const getHTML = async (url: string) => {
        const {data} = await axios.get(url);
        return cheerio.load(data);
    };
    const objArr: any = [];
    const selector: any = await getHTML(`https://www.afisha.ru/msk/showroom/vdnh-751/`)
    let timeStr: string[] = selector('[aria-label=\'Часы работы\']').text().slice(11).split(' ')
    console.log(timeStr)

    if (timeStr[0] = 'круглосуточно'){
        const always: Record<string, string> = {
            '1': '00.00-24.00',
            '2': '00.00-24.00',
            '3': '00.00-24.00',
            '4': '00.00-24.00',
            '5': '00.00-24.00',
            '6': '00.00-24.00',
            '7': '00.00-24.00',

        }
        return always
    }
    if (timeStr[0] = ''){
        const  idk: Record<string, string> = {
            '1': '',
            '2': '',
            '3': '',
            '4': '',
            '5': '',
            '6': '',
            '7': '',

        }
        return idk
    }
    let arr: string[] = [] 

    for (let it of timeStr){ 
        if (it.includes(',')){
            it = it.substring(0, it.length - 1)
        }
        if (it.includes('-')){
            let dashCut = it.split('-')
            if (dashCut[0] == 'пн'){
                arr.push('1s')
            } else if (dashCut[0] == 'вт'){
                arr.push('2s')
            } else if (dashCut[0] == 'ср'){
                arr.push('3s')
            } else if (dashCut[0] == 'чт'){
                arr.push('4s')
            } else if (dashCut[0] == 'пт'){
                arr.push('5s')
            } else if (dashCut[0] == 'сб'){
                arr.push('6s')
            } else if (dashCut[0] == 'вс'){
                arr.push('7s')
            }
            if (dashCut[1] == 'пн'){
                arr.push('e1')
            } else if (dashCut[1] == 'вт'){
                arr.push('e2')
            } else if (dashCut[1] == 'ср'){
                arr.push('e3')
            } else if (dashCut[1] == 'чт'){
                arr.push('e4')
            } else if (dashCut[1] == 'пт'){
                arr.push('e5')
            } else if (dashCut[1] == 'сб'){
                arr.push('e6')
            } else if (dashCut[1] == 'вс'){
                arr.push('e7')
            }
            continue;
        } else if (it.includes('.')){
            arr.push(it)
            continue;
        } else if (it == 'пн'){
            arr.push('1')
            continue;
        } else if (it == 'вт'){
            arr.push('2')
            continue;
        } else if (it == 'ср'){
            arr.push('3')
            continue;
        } else if (it == 'чт'){
            arr.push('4')
            continue;
        } else if (it == 'пт'){
            arr.push('5')
            continue;
        } else if (it == 'сб'){
            arr.push('6')
            continue;
        } else if (it == 'вс'){
            arr.push('7')
            continue;
        }
    }
    console.log(arr)
    let ans: Record<string, string> = {}
    let helpHand: number[] = []
    let pos: number = 2
    for (let it of arr){
        if (!isNaN(+it)){
            if (ans[it] !== undefined){
                continue;
            }
            ans[it] = ''
            continue;
        }
        if (it.includes('s')) {
            it = it.slice(0, it.length - 1)
            pos = 0
        } else if(it.includes('e')){
            it = it.slice(1, 2)
            pos = 1
        }
        if (!isNaN(+it)){
            if (pos == 0){
                if (ans[it] !== undefined){
                    continue;
                }
                pos = 2;
                ans[it] = ''
                helpHand[0]= (+it)
            }else if (pos == 1){
                let n = +it - helpHand[0]
                if (n < 0){
                    n = n + 7
                }
                for (let a = 1; a <= n; a++){
                    if(helpHand[0] + a > 7){
                        ans[(helpHand[0] + a - 7)] = ''
                        continue;
                    }
                    ans[(helpHand[0] + a)] = ''
                }
                pos = 2; 
            }
        }
        if (it.includes('.')){
            pos = 2
            for (let l = 1; l <= 7; l++){
                if (ans[`${l}`] == '') {
                    ans[`${l}`] = it
                }
            }
        }
        
        continue;
    }
    console.log(ans)

            
    
    return timeStr
}

parse()
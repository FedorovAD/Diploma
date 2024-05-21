import { time } from "console"


function timeCheck(time: any){
    const currentDate = new Date();
    const day = currentDate.getDay() + 1;
    const nowHour = 14; 
    //const nowHour = currentDate.getHours()
    const nowMinutes = currentDate.getMinutes()
    let table = time[day]
    if (table == ''){
        //table = '00.00–23.59'
        return null
    }else if (table == 'unknown'){
        table = '00.00–23.59'
        //return null
    }
    const parseTable = table.split('–')
    console.log(+parseTable[0].slice(0,2), +parseTable[1].slice(0,2))
    console.log(nowHour)
    if (+parseTable[1].slice(0,2) <=  nowHour || nowHour <  (+parseTable[0].slice(0,2))){
        return null
    } else{
        const minutesLeft: number = ((((+parseTable[1].slice(0,2)) - nowHour) * 60) + (+parseTable[1].slice(3, 5)) - nowMinutes)
        const minutesTotal: number = ((((+parseTable[1].slice(0,2)) - (+parseTable[0].slice(0,2))) * 60 ) + (+parseTable[1].slice(3, 5)) - (+parseTable[0].slice(3, 5)))
        return String(100 - ((minutesLeft * 100)/minutesTotal))
    } 


}


function priceCheck(avgPrice: string, price: number){
    if (avgPrice == 'Вход свободный'){
        return 0
    }
    if (isNaN(+avgPrice)){
        return price
    }
    if (+avgPrice > price){
        return null
    }
    return (((+avgPrice*100)/price))
}

function scoreCheck(score: string){
    if (isNaN(+score)){
        return 100
    }else {
        return (100 - (+score * 10))
    }

}

function distanceCheck(dist: number, rad: number){
    return (((dist * 100)/rad))
}


export function lsm (information: any, radius: number, price: number){
    const deltaDist: number = distanceCheck(information.distance, radius)
    const deltaScore: number = scoreCheck(information.avgScore)
    const deltaPrice = priceCheck(information.avgPrice, price)
    const deltaTime = timeCheck(information.work_time)
    if (deltaTime == null){
        return null
    }
    if (deltaPrice == null){
        return null
    }

    return ((deltaDist * deltaDist) + (deltaScore * deltaScore) + (deltaPrice + deltaPrice) + ((+deltaTime) * (+deltaTime)))
}
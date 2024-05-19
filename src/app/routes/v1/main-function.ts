import { myLocation } from "./my-coords";
import { getDistanceFromLatLonInKm } from "./distance-check";
import { dbClient } from '../../lib/db-client';
import { lsm } from "./least-squares-method";
import { Request, Response } from 'express';


interface Info{
    id: number,
    avgPrice: string,
    avgScore: string,
    work_time: any
    distance: number 
}


export const bestPlaces = async (req: Request, res: Response): Promise<Response> =>{
    //console.log('тип', req.body.type, 'dist', req.body.distance, 'price', req.body.price, 'adsress', req.body.address)
    const suitablePlaces: any = await getDistanceFromLatLonInKm(`москва ${req.body.address}}`, req.body.distance)
    console.log(suitablePlaces)

    let dataInfo: any = []
    const placeTypeFromFront: number = parseInt(req.body.type, 10)
    let placeTypeLetter: string = ''
    if (placeTypeFromFront == 2){
        placeTypeLetter = 'Музей'
    } else if (placeTypeFromFront == 3){
        placeTypeLetter = 'Театр'
    } else if (placeTypeFromFront == 4){
        placeTypeLetter = 'Кинотеатр'
    }

    if (placeTypeFromFront == 2 || placeTypeFromFront == 3 || placeTypeFromFront == 4 ){
        for (const key in suitablePlaces){
            const {rows:place} = await dbClient.query<{id: number, price: string, score: string, work_time: any}>(`
                SELECT id, price, score, work_time
                FROM places
                WHERE id = ${key} AND place_type = '${placeTypeLetter}'
                `
            );
            if (place.length == 0){
                continue;
            }
            console.log(place.length)
            const zachem: Info = {
                id: place[0].id,
                avgPrice: place[0].price,
                avgScore: place[0].score,
                work_time: place[0].work_time, 
                distance: suitablePlaces[key]
            };
            dataInfo.push(zachem)
        }
    }else {
        for (const key in suitablePlaces){
            const {rows:place} = await dbClient.query<{id: number, price: string, score: string, work_time: any}>(`
                SELECT id, price, score, work_time
                FROM places
                WHERE id = ${key}
                `
            );
            if (place.length == 0){
                continue;
            }
            console.log(place.length)
            const zachem: Info = {
                id: place[0].id,
                avgPrice: place[0].price,
                avgScore: place[0].score,
                work_time: place[0].work_time, 
                distance: suitablePlaces[key]
            };
            dataInfo.push(zachem)
        }
    }
    //console.log(dataInfo)
    let ans: Record<number, number> = {}

    for (const it of dataInfo){
        const testPlace = lsm(it, req.body.distance, req.body.price)
        if (testPlace == null){
            continue;
        }
        ans[(+testPlace)] = it.id
    }
    const ansRes: any[] =  Object.entries(ans)
    ansRes.sort((a:any , b: any) => a[0] - b[0])
    console.log(ansRes)
    let returnData: object[]= [] 
    for (const it of ansRes){
        const {rows:place} = await dbClient.query<{name: string, place_type: string, link: string, price: string}>(`
            SELECT name, place_type, link, price
            FROM places
            WHERE id = ${it[1]} 
            `
        );
        const readyToPushFront = {
            name: place[0].name,
            place_type: place[0].place_type,
            link: place[0].link,
            price: place[0].price
        }
        returnData.push(readyToPushFront)
    }

    return res.status(200).json(returnData);
}
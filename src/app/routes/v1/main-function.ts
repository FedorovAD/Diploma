import { myLocation } from "./my-coords";
import { getDistanceFromLatLonInKm } from "./distance-check";
import { dbClient } from '../../lib/db-client';
import { lsm } from "./least-squares-method";


interface Info{
    id: number,
    avgPrice: string,
    avgScore: string,
    work_time: any
    distance: number 
}


async function bestPlaces(){
    const p = 600
    const r = 4
    const suitablePlaces: any = await getDistanceFromLatLonInKm(`москва константина царева 12`, r)
    //console.log(suitablePlaces)

    let dataInfo: any = []

    for (const key in suitablePlaces){
        const {rows:place} = await dbClient.query<{id: number, price: string, score: string, work_time: any}>(`
            SELECT id, price, score, work_time
            FROM places
            WHERE id = ${key} 
            `
        );
        const zachem: Info = {
            id: place[0].id,
            avgPrice: place[0].price,
            avgScore: place[0].score,
            work_time: place[0].work_time, 
            distance: suitablePlaces[key]
        };
        dataInfo.push(zachem)
    }

    console.log(dataInfo)
    let ans: Record<number, number> = {}

    for (const it of dataInfo){
        const testPlace = lsm(it, r, p)
        if (testPlace == null){
            continue;
        }
        ans[(+testPlace)] = it.id
    }

    console.log(ans)
}
bestPlaces()
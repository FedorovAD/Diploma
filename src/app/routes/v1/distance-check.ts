import { myLocation } from "./my-coords";
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { dbClient } from '../../lib/db-client';
import { disconnect } from "process";



export const getDistanceFromLatLonInKm = async (req: Request, res:Response): Promise<Response> => {

    const {rows:places} = await dbClient.query<{id: number, latitude: number, longitude: number}>(`
        SELECT id, latitude, longitude
        FROM places
        WHERE latitude IS NOT NULL
            AND address != ''  
        `
    );
    const needDis: number = 4
    let ans: Record<number, number> = {}

    const myLoc: any = await myLocation('москва константина царева 12')
    if (myLoc == false){
        return res.status(404).json({
            message: 'Location not found'
        })
    }
    const lat1: number = myLoc[0].lat
    const lon1: number = myLoc[0].lon

    for (const it of places){

        const lat2: number = it.latitude
        const lon2: number = it.longitude

        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2-lat1);  // deg2rad below
        const dLon = deg2rad(lon2-lon1); 
        const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c; // Distance in km
        if (distance <= needDis){
            ans[it.id] = distance
        }
  }
  return res.status(200).json(ans);
}
function deg2rad(deg: number) {
    return deg * (Math.PI/180)
}
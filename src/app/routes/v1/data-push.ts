import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { dbClient } from '../../lib/db-client';
import { MosRuGet } from './data-get';



export const dataPush = async (req: Request, res: Response): Promise<Response> => {
    const data = await MosRuGet();
    for (const item of data){
        await dbClient.query(`
            INSERT INTO places (name, place_type, address, latitude, longitude, link)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (name) DO UPDATE SET
                place_type = excluded.place_type,
                address = excluded.address,
                latitude = excluded.latitude,
                longitude = excluded.longitude,
                link = excluded.link
        `, [
            item.Cells.CommonName,
            item.Cells.Category,
            item.Cells.ObjectAddress[0].Address,
            item.Cells.geoData.coordinates[0][0],
            item.Cells.geoData.coordinates[0][1],
            item.Cells.WebSite
        ])
    };
    return res.status(200).json({
        message: 'Pushed successfully',
    });
};
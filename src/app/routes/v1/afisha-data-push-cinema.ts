import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { dbClient } from '../../lib/db-client';
import { parse } from './parser-afisha-cinema';



export const afishaDataPushCinema = async (req: Request, res: Response): Promise<Response> => {
    const data = await parse();
    for (const item of data){
        await dbClient.query(`
            INSERT INTO places (name, place_type, address, link, score)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (name) DO UPDATE SET
                place_type = excluded.place_type,
                address = excluded.address,
                link = excluded.link,
                score = excluded.score
        `, [
            item.title,
            item.typeOfPlace,
            item.titleAddress,
            item.titleLink,
            item.titleScore
        ])
    };
    return res.status(200).json({
        message: 'Pushed successfully',
    });
};
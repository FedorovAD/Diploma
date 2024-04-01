import { getTimeWork } from "./parse-time-of-work";
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { dbClient } from '../../lib/db-client';


export const workTimePush = async (req: Request, res: Response): Promise<Response> => {
    const {rows:places} = await dbClient.query<{id: number, link: string}>(`
    SELECT id, link
    FROM places
    WHERE link IS NOT NULL
    `
);
    for (const it of places){
        console.log(it.link)
        const data = await getTimeWork(it.link);
        const ans = JSON.stringify(data)
        if (data['1'] == 'wrong_link'){
            continue;
        }
        await dbClient.query(`
            UPDATE places 
            SET work_time = $1
            where id = $2
        `, [
            ans,
            it.id
        ])
    }
            

    return res.status(200).json({
        message: 'Pushed successfully',
    });
};

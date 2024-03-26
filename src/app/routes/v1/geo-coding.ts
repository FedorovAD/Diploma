import got from 'got';
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { dbClient } from '../../lib/db-client';

function goodAddr(addr: string){
    let gdAdr: string = 'москва ' + addr.replace(',', '')
        .replace('Б.', '')
        .replace('стр.', 'с')
        .replace('М.','')
        .replace('пер.','переулок')
        .replace('ш.', 'шоссе')
        .replace('пл.', 'площадь')
        .replace('просп.', 'проспект')
        .replace('пл.', 'площадь')
        .replace('ул.', 'улица')
        .replace('корп.', 'корпус')
        .replace('Ст.', '')
        .replace('р-н', 'район')
        .replace('дер.', 'деревня')
        .replace('пос.', 'поселок')
        .toLowerCase()
    return gdAdr
        
}


export const coords = async (req: Request, res: Response): Promise<Response> => {
    const {rows:places} = await dbClient.query<{id: number, address: string}>(`
        SELECT id, address
        FROM places
        WHERE address IS NOT NULL
            AND address != ''  
            AND latitude IS NULL`
    );

    for (const it of places){
        await new Promise(f => setTimeout(f, 1000));
        const addr: string = it.address
        const id: number = it.id
        const address: string = goodAddr(addr)
        console.log(address)

        async function data(query: string) {
            const res: any = await got.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`).json();
            
            await dbClient.query(`
            UPDATE places 
            SET latitude = $1, longitude = $2
            where id = $3
        `, [
            res[0].lat,
            res[0].lon,
            id
        ])
        }

        data(address);


    }
    return res.status(200).json({
        message: 'Pushed successfully',
    });
}
import got from 'got';
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { dbClient } from '../../lib/db-client';

function goodAddr(addr: string){
    let gdAdr: any[] = []
    let goodAdr: any[] = addr.split(' ')
    for (const it in goodAdr){
        if (goodAdr[it].includes(',')){
            goodAdr[it] = goodAdr[it].substring(0, goodAdr[it].length - 1)
        }
        if (goodAdr[it] == 'стр.' || goodAdr[it] == 'корп.' || goodAdr[it] == 'школа' || goodAdr[it] == 'кв.' || goodAdr[it] == 'подъезд' || goodAdr[it] == 'этаж'){
            break;
        }
        if (goodAdr[it] == 'б-р'){
            goodAdr[it] = 'бульвар';
        }
        if (goodAdr[it] == 'просп.'){
            goodAdr[it] = 'проспект';
        }
        if (goodAdr[it] == 'наб.'){
            goodAdr[it] = 'набережная';
        }
        if (goodAdr[it] == 'туп.'){
            goodAdr[it] = 'тупик';
        }
        if (goodAdr[it] == 'ш.'){
            goodAdr[it] = 'шоссе';
        }
        if (!isNaN(+goodAdr[it])){
            gdAdr.push(goodAdr[it]);
            break;
        }
        if (goodAdr[it] == 'пл.'){
            goodAdr[it] = 'площадь';
        }
        if (goodAdr[it] == 'пер.'){
            goodAdr[it] = 'переулок';
        }
        if (goodAdr[it] == 'р-н'){
            goodAdr[it] = 'район';
        }
        if (goodAdr[it] == 'пос.'){
            goodAdr[it] = 'поселок';
        }
        if (goodAdr[it] == 'пр.'){
            continue
        }
        if (goodAdr[it] == 'с.'){
            continue;
        }
        if (goodAdr[it].includes('.')){
            const dotcut: any = goodAdr[it].split('.')
            if (dotcut[1] == ''){
                continue;
            }else{
            goodAdr[it] = dotcut[1]
            }
        }
        gdAdr.push(goodAdr[it]);

    }

    const ans: string = 'москва ' + gdAdr.join(' ').toLowerCase()
    console.log('street: ' + ans)
    return ans
    // let gdAdr: string = 'москва ' + addr.replace(',', '')
    //     .replace('Б.', '')
    //     .replace('стр.', 'с')
    //     .replace('М.','')
    //     .replace('пер.','переулок')
    //     .replace('ш.', 'шоссе')
    //     .replace('пл.', 'площадь')
    //     .replace('просп.', 'проспект')
    //     .replace('пл.', 'площадь')
    //     .replace('ул.', 'улица')
    //     .replace('корп.', 'корпус')
    //     .replace('Ст.', '')
    //     .replace('р-н', 'район')
    //     .replace('дер.', 'деревня')
    //     .replace('пос.', 'поселок')
    //     .toLowerCase()
        
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

        async function data(query: string) {
            const res: any = await got.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`).json();
            if (res[0] != '' && res[0] != undefined){
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
        }
        data(address);


    }
    return res.status(200).json({
        message: 'Pushed successfully',
    });
}
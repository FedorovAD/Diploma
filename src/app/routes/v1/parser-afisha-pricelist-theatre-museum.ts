const axios = require('axios');
const cheerio = require('cheerio')
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { dbClient } from '../../lib/db-client';

export const parsePrice = async (req: Request, res: Response): Promise<Response> => {


    const {rows:places} = await dbClient.query<{id: number, link: string}>(`
             SELECT id, link
             FROM places`
    );



    for (const it of places){
        console.log(it)
        if (it === undefined){
            break
        }
        const answ: any = []
        const link = it.link
        const id = it.id
        if (!link.startsWith("https://")){
            answ[0] = ''
            await dbClient.query(`
            UPDATE places 
            SET price = $1
            where id = $2
        `, [
            answ[0],
            id
        ])
        continue     
        } else if (!link.startsWith("http://")){
            answ[0] = ''
            await dbClient.query(`
            UPDATE places 
            SET price = $1
            where id = $2
        `, [
            answ[0],
            id
        ])
        }
        console.log(link)
        const getHTML = async (url: string) => {
            const {data} = await axios.get(url);
            return cheerio.load(data);
        };
        const arr: number[] = []
        let selector: any = ""
        try {
            selector = await getHTML(`${link}`)
        } catch (err) {
            console.log(err)
            answ[0] = ''
            await dbClient.query(`
                UPDATE places 
                SET price = $1
                where id = $2
            `, [
            answ[0],
            id
            ])
            continue
        }
        // const lolkek: any = selector('div.PqAdz:contains("от")').text()
        // console.log(lolkek)
        if (selector('div.PqAdz:contains("от")').text() != ""){
            selector('div.PqAdz').each((i: number, element: any) => {
                const priceText: string = selector(element).find('.ImmXK').text()
                const priceArr: any[] = priceText.split(" ")
                for (const key in priceArr) {
                    if (!isNaN(parseInt(priceArr[key]))){
                        arr.push(parseInt(priceArr[key]))
                    }
                }
                // const priceLenght: number = priceText.length;
                // const price: number = +priceText.slice(3, priceLenght - 2)
                // arr.push(price)
            })
            const avaragePrice = ((arr.reduce((currentSum: number, currentNum: number) => currentSum + currentNum, 0))/arr.length).toFixed()
            answ[0] = avaragePrice
            //console.log(avaragePrice)
        } else if (selector('div.MckHJ:contains("От")').text() != ""){
            selector('div.oP17O').each((i: number, element: any) => {
                const priceText: string = selector(element).find('div.MckHJ').text()
                const priceArr: any[] = priceText.split(" ")
                for (const key in priceArr) {
                    if (!isNaN(parseInt(priceArr[key]))){
                        arr.push(parseInt(priceArr[key]))
                    }
                }
            //     const priceText: string = selector(element).find('div.MckHJ').text()
            //     const priceLenght: number = priceText.length;
            //     const price: number = +priceText.slice(3, priceLenght - 2)
            //     arr.push(price)
                })
            const avaragePrice = ((arr.reduce((currentSum: number, currentNum: number) => currentSum + currentNum, 0))/arr.length).toFixed()
            answ[0] = avaragePrice
            //console.log(avaragePrice)
        } else{
            const priceText = selector("[aria-label=\"Цены\"]").text().slice(4)
            if (priceText == "Вход свободный"){
                answ[0] = priceText
                //console.log(priceText)
            } else if(priceText.includes("Вход")){
                const arr1: string[] = priceText.split(" ")
                const arr2: string[] = arr1[1].split("–")
                if (arr2[1] === undefined){
                    const pricelist: number = +arr1[1]
                    const avaragePrice: string = pricelist.toFixed()
                    answ[0] = avaragePrice
                } else {   
                    const pricelist: number = (((+arr2[0]) + (+arr2[1]))/2) 
                    const avaragePrice: string = pricelist.toFixed()
                    answ[0] = avaragePrice
                }    
                //console.log(pricelist.toFixed())q
            } else {
                const avaragePrice: string = ""
                answ[0] = avaragePrice
                //console.log("")
            }
        }
        console.log(answ[0], id)
        await dbClient.query(`
            UPDATE places 
            SET price = $1
            where id = $2
        `, [
            answ[0],
            id
        ])
    }
    return res.status(200).json({
        message: 'Pushed successfully',
    });
}
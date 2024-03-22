const axios = require('axios');
const cheerio = require('cheerio')
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { dbClient } from '../../lib/db-client';

export async function parsePrice (){


    const places: any = await dbClient.query(`
             SELECT id, link
             FROM places`
    );



    for (const it in places){
        const link = places[it]['link']
        const id = places[it]['id']
        const getHTML = async (url: string) => {
            const {data} = await axios.get(url);
            return cheerio.load(data);
        };
        const arr: number[] = []
        const answ: any = []
        const selector = await getHTML(`${link}`)
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
                const priceLenght: number = priceText.length;
                const price: number = +priceText.slice(3, priceLenght - 2)
                arr.push(price)
            })
            const avaragePrice = ((arr.reduce((currentSum: number, currentNum: number) => currentSum + currentNum, 0))/arr.length).toFixed()
            answ[0] = avaragePrice
            //console.log(avaragePrice)
        } else{
            const priceText = selector("[aria-label=\"Цены\"]").text().slice(4)
            if (priceText == "Вход свободный"){
                //console.log(priceText)
            }else if(priceText.includes("Вход")){
                const arr1: string[] = priceText.split(" ")
                const arr2: string[] = arr1[1].split("–")
                const pricelist: number = (((+arr2[0]) + (+arr2[1]))/2) 
                const avaragePrice: string = pricelist.toFixed()
                answ[0] = avaragePrice
                //console.log(pricelist.toFixed())
            } else {
                const avaragePrice: string = ""
                answ[0] = avaragePrice
                //console.log("")
            }
        }
        await dbClient.query(`
            INSERT INTO places (id, price)
            VALUES ($1, $2)
            ON CONFLICT (id) DO UPDATE SET
                id = excluded.id
                price = excluded.price
        `, [
            id,
            answ[0]
        ])
    }
}
const axios = require('axios');
const cheerio = require('cheerio')

export async function parse() {
    const getHTML = async (url: string) => {
        const {data} = await axios.get(url);
        return cheerio.load(data);
    };
    const website = await getHTML('https://www.afisha.ru/msk/cinema/cinema_list/');
    const pageNumber = website('.yNWhI').eq(-1).text();
    const objArr: any = [];
    for (let i = 0; i < pageNumber; i++){
        const selector = await getHTML(`https://www.afisha.ru/msk/cinema/cinema_list/page${i + 1}/`)
        selector('div._yjkz').each((i: number, element: any) => {
            const title: string = selector(element).find('a.CjnHd.y8A5E.MnbCM').text()
            const titleLink: string = `https://www.afisha.ru${selector(element).find('a.CjnHd.y8A5E.MnbCM').attr('href')}`
            const titleAddress: string = selector(element).find('.hmVRD.DiLyV').text()
            const titleScore: number = selector(element).find('.M6BcH').text()
            const typeOfPlace: string = 'Кинотеатр'
            objArr.push({
                title,
                typeOfPlace,
                titleLink,
                titleAddress,
                titleScore
            })
            //const title = selector(element).find('div.PqAdz').find('div._yjkz').find('a.CjnHd.y8A5E.MnbCM').text();
            //const titleLink = selector(element).find('div.PqAdz').find('div._yjkz').find('a.CjnHd.y8A5E.MnbCM').find('#href').text();
            //console.log('Название: ', title, ` Адрес: `, titleAddress ,` Ссылка: `, `https://www.afisha.ru/msk/museum/${titleLink}`, ' Оценки пользователей: ', titleScore)
        })
    }
    return objArr
}

//.IrSqF.zPI3b._49ey.k96pX - container id for score
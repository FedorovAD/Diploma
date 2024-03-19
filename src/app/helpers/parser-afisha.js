const axios = require('axios');
const cheerio = require('cheerio')

const parse = async () => {
    const getHTML = async (url) => {
        const {data} = await axios.get(url);
        return cheerio.load(data);
    };
    const website = await getHTML('https://www.afisha.ru/msk/museum/');
    const pageNumber = website('.yNWhI').eq(-1).text();
    for (let i = 0; i < pageNumber; i++){
        const selector = await getHTML(`https://www.afisha.ru/msk/museum/page${i + 1}/`)
        selector('div._yjkz').each((i, element) => {
            const title = selector(element).find('a.CjnHd.y8A5E.MnbCM').text()
            const titleLink = selector(element).find('a.CjnHd.y8A5E.MnbCM').attr('href')
            const titleAddress = selector(element).find('.hmVRD.DiLyV').text()
            const titleScore = selector(element).find('.IrSqF.zPI3b._49ey.k96pX').text()


            //const title = selector(element).find('div.PqAdz').find('div._yjkz').find('a.CjnHd.y8A5E.MnbCM').text();
            //const titleLink = selector(element).find('div.PqAdz').find('div._yjkz').find('a.CjnHd.y8A5E.MnbCM').find('#href').text();
            console.log('Название: ', title, ` Адрес: `, titleAddress ,` Ссылка: `, `https://www.afisha.ru/msk/museum/${titleLink}`, ' Оценки пользователей: ', titleScore)
        })
    }

}

parse()
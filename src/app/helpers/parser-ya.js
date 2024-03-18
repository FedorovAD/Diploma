const axios = require('axios');
const cheerio = require('cheerio')

const parse = async () => {
    const getHTML = async (url) => {
        const {data} = await axios.get(url);
        return cheerio.load(data);
    };
    const website = await getHTML('https://afisha.yandex.ru/moscow/art/places?source=rubric');
    console.log(website.text())
    // const pageNumber = website('.yNWhI').eq(-1).text();
    // for (let i = 0; i < pageNumber; i++){
    //const selector = await getHTML(`https://afisha.yandex.ru/moscow/art/places?source=rubric`)
    // selector('div.place-card__title-wrap').each((i, element) => {
    //     const title = selector(element).find('.link.link_theme_black.i-metrika-block__click.i-bem.link_js_inited').text()
    //     // const titleLink = selector(element).find('.place-card__title').attr('href')
    //     // const titleAddress = selector(element).find('div.place-card__address').text()


    //         //const title = selector(element).find('div.PqAdz').find('div._yjkz').find('a.CjnHd.y8A5E.MnbCM').text();
    //         //const titleLink = selector(element).find('div.PqAdz').find('div._yjkz').find('a.CjnHd.y8A5E.MnbCM').find('#href').text();
    //     console.log(title, ` `, titleAddress ,` `, `https://afisha.yandex.ru/${titleLink}`)
    // })
}

parse()
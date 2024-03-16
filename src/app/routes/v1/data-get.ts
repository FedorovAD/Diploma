import got from 'got';
interface Fields{
    CommonName: string,
    Category: string,
    ObjectAddress: {Address: string}[],
    geoData: {coordinates: number[][]},
    WebSite: string,
    WorkingHours: {
        DayWeek: string,
        WorkHours: string
    }[]
}

interface OverFields{
    Cells: Fields
}

export async function MosRuGet() {
    const data: OverFields[] = await got.get('https://apidata.mos.ru/v1/datasets/529/rows', {
    searchParams:{
        api_key: 'a131d934-ffcc-4e3a-a3db-b28277d80188'
    }
    }).json();
    const result: Fields[] = data.map((field) => ({
        CommonName: field.Cells.CommonName,
        Category: field.Cells.Category,
        ObjectAddress: field.Cells.ObjectAddress.map((item) => ({Address: item.Address})),
        geoData: field.Cells.geoData,
        WebSite: field.Cells.WebSite,
        WorkingHours: field.Cells.WorkingHours
    }))
    return data;
}
import got from 'got';




export async function myLocation(address: string) {
    const res: any = await got.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`).json();
    if (res && res[0] != '' && res[0] != undefined){
        return res
    } else{
        return false
    }

}
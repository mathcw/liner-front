export interface Iitin {
    des:string,
    arr_time:string,
    level_time:string,
    dep_city:string,
    destination:string,
}


export interface IitinInfoProps {
    info: Array<Iitin>
    update: React.Dispatch<React.SetStateAction<Iitin[]>>
}

export interface IitinBlockProps {
    itin: Iitin
    blockKey: number,
    deleteRoom:(index:number)=>void,
    updateInfo: (v: any, index: number, field: string) => void,
}
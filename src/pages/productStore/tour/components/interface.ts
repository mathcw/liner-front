export interface Ipic {
    uid: string,
    name: string,
    status: string,
    url: string
}
export interface Iitin {
    des:string,
    arr_time:string,
    level_time:string,
    dep_city:string,
    destination:string,
    breakfast:string,
    lunch:string,
    dinner:string,
    accommodation:string,
    pic_arr: Array<Ipic>
}


export interface IitinInfoProps {
    info: Array<Iitin>
    update: React.Dispatch<React.SetStateAction<Iitin[]>>
}

export interface IitinBlockProps {
    itin: Iitin
    blockKey: number,
    deleteItin:(index:number)=>void,
    updateInfo: (v: any, index: number, field: string) => void,
    handleChange: (fileInfo: any, index: number) => void,
    onRemove: (file: { uid: string }, roomIndex: number) => void,
    handleUpload: (prop: { file: File }, index: number) => void
}
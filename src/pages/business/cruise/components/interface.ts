export interface Ipic {
    uid: string,
    name: string,
    status: string,
    url: string
}
export interface IFood {
    restaurant:string,
    des: string,
    pic_arr: Array<Ipic>
}
export interface IGame {
    name:string,
    des: string,
    pic_arr: Array<Ipic>
}

export interface Iroom {
    room_area: string
    room_type: string,
    room_kind: string,
    num_of_people: string,
    floor: string,
    des: string,
    pic_arr: Array<Ipic>
}

export interface ILayout{
    floor:number
    pic: Ipic
}

export interface IGameInfoProps {
    info: Array<IGame>
    update: React.Dispatch<React.SetStateAction<IGame[]>>
}

export interface IGameBlockProps {
    game: IGame
    blockKey: number,
    deleteGame:(index:number)=>void,
    updateInfo: (v: any, index: number, field: string) => void,
    handleChange: (fileInfo: any, index: number) => void,
    onRemove: (file: { uid: string }, roomIndex: number) => void,
    handleUpload: (prop: { file: File }, index: number) => void
}



export interface ILayoutInfoProps {
    info: Array<ILayout>
    update: React.Dispatch<React.SetStateAction<ILayout[]>>
}

export interface ILayoutBlockProps {
    layout: ILayout
    blockKey: number,
    deleteLayout:(index:number)=>void,
    updateInfo: (v: any, index: number, field: string) => void,
    handleChange: (fileInfo: any, index: number) => void,
    handleUpload: (prop: { file: File }, index: number) => void
}


export interface IFoodInfoProps {
    info: Array<IFood>
    update: React.Dispatch<React.SetStateAction<IFood[]>>
}

export interface IFoodBlockProps {
    food: IFood
    blockKey: number,
    deleteFood:(index:number)=>void,
    updateInfo: (v: any, index: number, field: string) => void,
    handleChange: (fileInfo: any, index: number) => void,
    onRemove: (file: { uid: string }, roomIndex: number) => void,
    handleUpload: (prop: { file: File }, index: number) => void
}

export interface IroomInfoProps {
    info: Array<Iroom>
    update: React.Dispatch<React.SetStateAction<Iroom[]>>
}

export interface IroomBlockProps {
    room: Iroom
    blockKey: number,
    deleteRoom:(index:number)=>void,
    updateInfo: (v: any, index: number, field: string) => void,
    handleRoomChange: (fileInfo: any, index: number) => void,
    onRoomRemove: (file: { uid: string }, roomIndex: number) => void,
    handleRoomUpload: (prop: { file: File }, index: number) => void
}

export interface IVideoInfoProps{
    video:string;
    update: React.Dispatch<React.SetStateAction<string>>
}
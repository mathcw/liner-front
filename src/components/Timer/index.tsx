import React , {useState,useEffect} from 'react';
import moment from 'moment';

export interface ITimer{
    StartTime:string | Date
}

const Timer:React.FC<ITimer> = ({StartTime})=>{
    const difference = (start:string|Date,end:string|Date) => {
        const diff = moment(end).diff(moment(start),'seconds');
        const day = Math.floor(diff/(24*60*60));
        const hour = Math.floor(diff/(60*60)) - (day * 24);
        const min = Math.floor(diff/60) - day*24*60 - hour*60 ;
        // const seconds = Math.floor(diff%60);
        return `${day}天${hour}小时${min}分`;
    }
    const [time,setTime] = useState(difference(StartTime,new Date()));
    useEffect(()=>{
        const timeInterval = setInterval(()=>{setTime(difference(StartTime,new Date()))},1000);
        return () =>{
            clearInterval(timeInterval);
        }
    })
    return <div>{time}</div>
}

export default Timer;
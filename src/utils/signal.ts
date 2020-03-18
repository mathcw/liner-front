import io from 'socket.io-client';
import { get } from './req';
import msgPush from './msg';

let signal: SocketIOClient.Socket | null;

export function signalClear() {
    if(signal){
        signal.disconnect();
        signal = null;
    }
}


export async function signalInit(){

    signalClear();

    const r = await get('/sys/Signal/init');

    const {url,user,token} = r.data;
    signal = io(url, {
      transports:['websocket'],
      timeout:5000,
      query: {_m:'3',_u:user,_t:token}
    });

    signal.on('error', (e: any) => {
        if(e === 'EXPIRE'){
            signalInit().catch();
        }else{
            if(signal)
                signal.connect();
        }
    });

    signal.on('reconnecting', (attemptNumber: any) => {
        console.log(`[signal] reconnecting ${attemptNumber}`);
    });

    signal.on('disconnect', (e: any) => {
        console.log(`[signal] reconnecting ${e}`);
    });

    signal.on('connect', () => {
        if(signal)
            console.log(`[signal] connect ${signal.id}`);
    });


    // //-----------------------msg---------------------------
    signal.on('msg', (msg:any) => {
        msgPush(msg);
    });

}
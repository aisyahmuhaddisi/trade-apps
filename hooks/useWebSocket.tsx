import { useEffect, useRef, useState } from "react";
import { AppState } from 'react-native'
import throttle from "lodash.throttle";

const useWebSocket = (url: string) => {
    const [priceData, setPriceData] = useState(null);
    const [waitTime, setWaitTime] = useState(0);

    const dataChanges = (data) => {
        const jsonData = JSON.parse(data);
        setPriceData({ ...jsonData, dc: Math.floor(jsonData.dc * 100) / 100, p: Math.floor(jsonData.p * 100) / 100 })
    };

    const dataChangesThrottled = useRef(throttle(dataChanges, waitTime));

    const initiateWebSocket = (socket) => {
        socket.addEventListener('open', function (event) {
            setWaitTime(8000)
            socket.send(JSON.stringify({ "action": "subscribe", "symbols": "BTC-USD" }))
        });

        socket.addEventListener('message', function (event) {
            dataChangesThrottled.current(event.data)
        });
    };

    useEffect(() => {
        let socket = new WebSocket(url);

        const subscription = AppState.addEventListener('change', nextAppState => {
            console.log(AppState.currentState, 'currentstate')
            if (
                AppState.currentState.match(/inactive|background/)
            ) {
                socket.close()
            }
            if (
                AppState.currentState === 'active'
            ) {
                socket = new WebSocket(url);

                initiateWebSocket(socket)
            }
        });
        initiateWebSocket(socket);

        return () => {
            socket.close()
            subscription.remove();
        }
    }, []);

    return priceData;
}

export default useWebSocket
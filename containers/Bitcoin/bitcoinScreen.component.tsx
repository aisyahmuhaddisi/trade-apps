import useWebSocket from '@/hooks/useWebSocket';
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native'

import HighchartsComponent, { StockData } from '@/components/candlestickChart';
import { AxiosError } from 'axios';
import Button from '@/components/button';
import { router } from 'expo-router';

type Props = {
    fetchEODData: (val: string, val1: string) => Promise<StockData[]>
}

type EodDataType = {
    p: number,
    dc: number
}

type StylesType = {
    container: ViewStyle,
    smallText: (color?: string) => TextStyle,
    xtraLargeText: TextStyle,
    rowContainer: TextStyle,
    ohlcContainer: ViewStyle,
    half: ViewStyle,
    bottomTab: ViewStyle,
    largeText: TextStyle,
    splitContainer: ViewStyle,
    filterPills: ViewStyle
};

type HoverDataType = {
    hoverData: StockData,
}

const HoverData = (props: HoverDataType) => {
    const ohlcStyle = [styles.ohlcContainer, styles.half]

    return (
        <>
            <Text>{props.hoverData.date}</Text>
            <View style={styles.ohlcContainer}>
                <View style={ohlcStyle}>
                    <Text>Open: </Text>
                    <Text>{props.hoverData.open}</Text>
                </View>
                <View style={ohlcStyle}>
                    <Text>High: </Text>
                    <Text>{props.hoverData.high}</Text>
                </View>
            </View>
            <View style={styles.ohlcContainer}>
                <View style={ohlcStyle}>
                    <Text>Close: </Text>
                    <Text>{props.hoverData.low}</Text>
                </View>
                <View style={ohlcStyle}>
                    <Text>Low: </Text>
                    <Text>{props.hoverData.high}</Text>
                </View>
            </View>
        </>
    )
}

const BitcoinComponent = (props: Props) => {
    const priceData: EodDataType | null = useWebSocket('wss://ws.eodhistoricaldata.com/ws/crypto?api_token=demo');

    const [eodData, setEodData] = useState<StockData[]>([]);
    const [hoverData, setHoverData] = useState<StockData | null>(null);
    const [lastEvent, setLastEvent] = useState('mouseOut');
    const [period, setPeriod] = useState('w')

    const now = new Date()

    useEffect(() => {
        const years = now.getFullYear() - 3;
        const from = `${now.getDate()}-${now.getMonth()}-${period === 'd' ? years : years + 2}`

        props.fetchEODData(from, period).then(
            (data: StockData[]) => {
                setEodData(data)
            }
        ).catch((error: AxiosError) => console.log(error, 'error'));
    }, [period]);

    useEffect(() => {
        if (hoverData) {
            setTimeout(() => {
                if (lastEvent === 'mouseOut') {
                    setHoverData(null)
                }
            }, 800);
        }
    }, [lastEvent])

    const onPointHover = (data: StockData) => {
        const date = new Date(data.x).toString().slice(0, -8);
        setLastEvent('mouseOver')
        setHoverData({ ...data, date })
    };

    const onHoverOut = () => {
        setLastEvent('mouseOut')
    }

    return (
        <View>
            <ScrollView style={styles.container} >
                {hoverData ? <HoverData hoverData={hoverData} />
                    :
                    <>
                        <Text style={styles.smallText()}>Harga Bitcoin</Text>
                        {priceData ?
                            <View style={styles.rowContainer}>
                                <Text style={styles.xtraLargeText}>USD {priceData.p}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    {priceData.dc < 0 ?
                                        <Ionicons
                                            name="caret-down-sharp"
                                            size={18}
                                            color="red"
                                        /> :
                                        <Ionicons
                                            name="caret-up-sharp"
                                            size={18}
                                            color="green"
                                        />}
                                    <Text style={styles.smallText(priceData.dc < 0 ? 'red' : 'green')}>{priceData.dc}%</Text>
                                </View>
                            </View>
                            :
                            <Text>Loading...</Text>
                        }
                    </>}
                <HighchartsComponent data={eodData} onPointHover={onPointHover} onHoverOut={onHoverOut} />
                <View style={{ marginTop: 20, flexDirection: 'row', gap: 20 }}>
                    <Button
                        title="Daily"
                        onPress={() => {
                            setPeriod('d')
                        }}
                        color={period === 'd' ? "lightblue" : "white"}
                        textColor="black"
                        style={styles.filterPills}
                    />
                    <Button title="Weekly" onPress={() => { setPeriod('w') }} color={period === 'w' ? "lightblue" : "white"} textColor="black" style={styles.filterPills} />
                    <Button title="Monthly" onPress={() => { setPeriod('m') }} color={period === 'm' ? "lightblue" : "white"} textColor="black" style={styles.filterPills} />
                    <Button title="Yearly" onPress={() => { setPeriod('y') }} color={period === 'y' ? "lightblue" : "white"} textColor="black" style={styles.filterPills} />
                </View>
            </ScrollView>
            <View style={styles.bottomTab}>
                <View style={styles.splitContainer}>
                    <Text style={styles.largeText}>USD 64000</Text>
                    <Button title="Buy" color="red" textColor="white" onPress={() => router.push('/transaction')}></Button>
                </View>
                <View style={styles.splitContainer}>
                    <Text style={styles.largeText}>USD 63000</Text>
                    <Button title="Sell" color="blue" textColor="white" onPress={() => { }} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create<StylesType>({
    container: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginVertical: 20,
        height: '80%'
    },
    smallText: (color) => ({
        fontSize: 14,
        color: color || 'grey',
    }),
    xtraLargeText: {
        fontSize: 20,
        color: 'black',
        marginTop: 8,
        fontWeight: 'bold'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    ohlcContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    half: {
        width: '48%'
    },
    bottomTab: {
        bottom: 0,
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: 'white',
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowColor: '#000000',
        elevation: 4,
        shadowOpacity: 0.3,
    },
    largeText: {
        fontSize: 16,
        color: 'black',
        marginTop: 8,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    splitContainer: {
        width: '40%'
    },
    filterPills: {
        width: '20%',
        borderStyle: 'solid',
        borderColor: 'lightgray',
        borderWidth: 1,
        alignItems: 'center',
        color: 'black'
    }
})

export default BitcoinComponent
import useWebSocket from '@/hooks/useWebSocket';
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { WebView } from 'react-native-webview';

const HighchartsComponent = (props) => {
    const colorTemplate =
        '{#ge point.open point.close}#ff6e6e{else}#51af7b{/ge}';
    const chartOptions = {
        lang: {
            accessibility: {
                defaultChartTitle: 'AAPL Stock Price'
            }
        },
        legend: {
            enabled: true
        },
        xAxis: {
            crosshair: {
                enabled: true
            },
            ordinal: false,
            type: 'datetime',
        },
        yAxis: {
            title: {
                text: 'price (USD)'
            },
            crosshair: {
                snap: false,
                label: {
                    enabled: false,
                    format: '{value:.2f}',
                },
                enabled: true
            },
            labels: {
                align: 'left'
            },
        },
        plotOptions: {
            candlestick: {
                color: 'pink',
                lineColor: 'red',
                upColor: 'lightgreen',
                upLineColor: 'green',
            },
            series: {
                stickyTracking: true
            }
        },
        chart: {
            height: '100%',
        },
        rangeSelector: {
            enabled: false,
        },
        navigator: {
            enabled: false, // Set to false to hide the navigator
        },
        credits: {
            enabled: false,
        },
        tooltip: {
            enabled: false,
            positioner: () => ({ x: 60, y: 0 })
        },
        series: [{
            type: 'candlestick',
            id: 'btc',
            name: 'BTC',
            lastPrice: {
                enabled: true,
                label: {
                    enabled: true,
                    align: 'left',
                    x: 8
                }
            },
            data: props.data && props.data.map((d) => {
                return [
                    new Date(d.date).getTime(),
                    d.open,
                    d.high,
                    d.low,
                    d.adjusted_close
                ]
            }),
        }],
    };

    const chartOptionsStr = JSON.stringify(chartOptions);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
        <script src="https://code.highcharts.com/stock/highstock.js"></script>
        <script src="https://code.highcharts.com/stock/indicators/indicators-all.js"></script>
        <script src="https://code.highcharts.com/stock/modules/accessibility.js"></script>
          <script>
            document.addEventListener('DOMContentLoaded', function () {
              const chart = Highcharts.stockChart('container', ${chartOptionsStr});
              chart.series[0].update({
                point: {
                  events: {
                    mouseOver: function () {
                      const pointData = {
                        x: this.x,
                        open: this.open,
                        high: this.high,
                        low: this.low,
                        close: this.close,
                      };
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        event: 'pointHover',
                        data: pointData
                      }));
                    },
                    mouseOut: function () {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            event: 'hoverOut'
                        }));
                    }
                  }
                }
              });            
            });
          </script>
        </head>
        <body>
          <div id="container" class="chart" style="width:100%; height:100%;"></div>
        </body>
      </html>
    `;

    const [webViewHeight, setWebViewHeight] = useState(0);

    return (
        // <View style={[styles.webContainer, { maxHeight: '50%', backgroundColor: 'red' }]}>
        <WebView
            scrollEnabled={false}
            // nestedScrollEnabled
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={[styles.webContainer]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            containerStyle={{ height: webViewHeight }}
            injectedJavaScript="window.ReactNativeWebView.postMessage(JSON.stringify({event: 'changeHeight', height: Math.max(document.body.offsetHeight, document.body.scrollHeight)}));"
            onMessage={event => {
                const message = JSON.parse(event.nativeEvent.data);
                if (message.event === 'pointHover') {
                    props.onPointHover(message.data);
                }
                if (message.event === 'hoverOut') {
                    props.onHoverOut();
                }
                if (message.event === 'changeHeight') {
                    setWebViewHeight(Number(message.height));
                }
            }}
        />
        // </View>
    );
};

const BitcoinComponent = (props) => {
    const payload = { "action": "subscribe", "symbols": "BTC-USD" }
    const priceData = useWebSocket('wss://ws.eodhistoricaldata.com/ws/crypto?api_token=demo', payload);

    const [eodData, setEodData] = useState([]);
    const [hoverData, setHoverData] = useState(null);
    const [lastEvent, setLastEvent] = useState('mouseOut');
    const now = new Date()
    const from = `${now.getDate()}-${now.getMonth()}-${now.getFullYear() - 2}`

    useEffect(() => {
        props.fetchEODData(from).then(
            (data) => {
                setEodData(data)
            }
        ).catch((error) => console.log(error, 'error'));
    }, []);

    useEffect(() => {
        if (hoverData) {
            setTimeout(() => {
                if (lastEvent === 'mouseOut') {
                    setHoverData(null)
                }
            }, 800);
        }
    }, [lastEvent])

    const onPointHover = (data) => {
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
                {hoverData ?
                    <>
                        <Text>{hoverData.date}</Text>
                        <View style={styles.ohlcContainer}>
                            <View style={[styles.ohlcContainer, styles.half]}>
                                <Text>Open: </Text>
                                <Text>{hoverData.open}</Text>
                            </View>
                            <View style={[styles.ohlcContainer, styles.half]}>
                                <Text>High: </Text>
                                <Text>{hoverData.high}</Text>
                            </View>
                        </View>
                        <View style={styles.ohlcContainer}>
                            <View style={[styles.ohlcContainer, styles.half]}>
                                <Text>Close: </Text>
                                <Text>{hoverData.low}</Text>
                            </View>
                            <View style={[styles.ohlcContainer, styles.half]}>
                                <Text>Low: </Text>
                                <Text>{hoverData.high}</Text>
                            </View>
                        </View>
                    </> :
                    <>
                        <Text style={styles.smallText}>Harga Bitcoin</Text>
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
                            : <Text>Loading...</Text>}
                    </>}
                <HighchartsComponent data={eodData} onPointHover={onPointHover} onHoverOut={onHoverOut} />
            </ScrollView>
            <View style={styles.bottomTab}>
                <View style={{ width: '40%' }}>
                    <Text style={styles.largeText}>USD 64000</Text>
                    <TouchableOpacity style={styles.button('red')} onPress={() => router.push('/transaction')}><Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>Buy</Text></TouchableOpacity>
                </View>
                <View style={{ width: '40%' }}>
                    <Text style={styles.largeText}>USD 63000</Text>
                    <TouchableOpacity style={styles.button('blue')}><Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>Sell</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
    webContainer: {
        flex: 1,
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
    button: (color) => ({
        width: '100%',
        backgroundColor: color,
        borderRadius: 4,
        paddingVertical: 10,
        marginTop: 10
    })
})

export default BitcoinComponent
import { useState } from "react";
import WebView from "react-native-webview";
import { StyleSheet } from "react-native";

export type StockData = {
    open: number,
    close: number,
    low: number,
    high: number
    adjusted_close: number,
    date: string,
    x: Date
};

type Props = {
    onPointHover: (val: StockData) => void,
    onHoverOut: () => void,
    data: StockData[]
}

const chartOptions = (props: Props) => ({
    lang: {
        accessibility: {
            defaultChartTitle: 'BTC Price'
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
});

const HighchartsComponent = (props: Props) => {
    const [webViewHeight, setWebViewHeight] = useState(0);
    const chartOptionsStr = JSON.stringify(chartOptions(props));

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


    return (
        <WebView
            scrollEnabled={false}
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={[styles.webContainer]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            containerStyle={{ height: webViewHeight/3 }}
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
    );
};

const styles = StyleSheet.create({
    webContainer: {
        flex: 1,
    },
})

export default HighchartsComponent
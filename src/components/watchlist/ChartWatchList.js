import React, {Component} from 'react';
import ChartWatchListUI from './ChartWatchListUI.js';
import watchlist_portfolio from '../../apiclient/watchlist/watchlist_portfolio';


class ChartWatchList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: null,
            OneData: null,
            fiveYrLoaded: false
        };

        this.getTickerChartCallback = this.getTickerChartCallback.bind(this);
    }

    render() {
        return (
            <ChartWatchListUI
                isLoading={this.state.isLoading}
                options={options}
            />
        );
    }

    componentWillReceiveProps(props) {
        props.ProfileList !== 0 && this.getTickerChartCallback(props.ProfileList)
    }


    componentWillMount() {
        setInterval(() => {
            watchlist_portfolio.get(this.getTickerChartCallback, "", this.props.tagId);
        }, 120000);
        console.log('perf', 'calling 1yr', new Date());
        watchlist_portfolio.get(this.getTickerChartCallback, "", this.props.tagId);
    }


    getOptionsSeries = (newArray) => {
        return [
            {
                data: newArray,
                events: {
                    afterAnimate: (e) => {
                        let chart = e.target.chart;
                        if (!chart.lbl) {
                            chart.lbl = chart.renderer.label('')
                                .attr({
                                    translateY: 23
                                })
                                .css({
                                    color: '#FFFFFF',

                                })
                                .add();
                        }
                        chart.lbl
                            .show()
                            .css({
                                color: '#007fef',
                            })
                            .attr({
                                x: 10,
                                y: 55,
                                text: '<p style="font-size:30px; margin-bottom: 20px">' + '$' + e.target.data[e.target.data.length - 1].y.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>" + "<br/>" + '<p style="opacity: 0"> 123 </p>' + "<br/>" + (e.target.data[e.target.data.length - 1].portfoliogain > 0 ? '<p style="font-size:12px; color:#6c9;">' : '<p style="font-size:12px; color:#e44;">') + "$" + e.target.data[e.target.data.length - 1].portfoliogain.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "(" + e.target.data[e.target.data.length - 1].portfoliogainpct.toFixed(1) + "%" + ")" + "</p>"
                            });
                    },
                    mouseOut: (e) => {
                        let chart = e.target.chart;
                        if (!chart.lbl) {
                            chart.lbl = chart.renderer.label('')
                                .attr({
                                    translateY: 23
                                })
                                .css({
                                    color: '#FFFFFF',

                                })
                                .add();
                        }
                        chart.lbl
                            .show()
                            .attr({
                                x: 10,
                                y: 55,
                                text: '<p style="font-size:30px">' + '$' + e.target.data[e.target.data.length - 1].y.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>" + "<br/>" + '<p style="opacity: 0"> 123 </p>' + "<br/>" + (e.target.data[e.target.data.length - 1].portfoliogain > 0 ? '<p style="font-size:12px; color:#6c9;">' : '<p style="font-size:12px; color:#e44;">') + "$" + e.target.data[e.target.data.length - 1].portfoliogain.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "(" + e.target.data[e.target.data.length - 1].portfoliogainpct.toFixed(1) + "%" + ")" + "</p>"
                            });
                    }
                },
                point: {
                    events: {
                        mouseOver: (e) => {
                            let chart = e.target.series.chart;
                            if (!chart.lbl) {
                                chart.lbl = chart.renderer.label('')
                                    .attr({
                                        translateY: 23
                                    })
                                    .css({
                                        color: '#FFFFFF',
                                    })
                                    .add();
                            }
                            chart.lbl
                                .show()
                                .attr({
                                    x: 10,
                                    y: 55,
                                    text: '<p style="font-size:30px">' + '$' + e.target.y.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>" + "<br/>" + '<p style="opacity: 0"> 123 </p>' + "<br/>" + (e.target.portfoliogain > 0 ? '<p style="font-size:12px; color:#6c9;">' : '<p style="font-size:12px; color:#e44;">') + "$" + e.target.portfoliogain.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "(" + e.target.portfoliogainpct.toFixed(1) + "%" + ")" + "</p>"
                                });
                        },

                    }
                },
                tooltip: {
                    valueDecimals: 2,
                    pointFormat: '<div>portfolio gain: {point.portfoliogain}<br/> portfolio gain pct: {point.portfoliogainpct}</div>'
                },
            }
        ];
    }

    getOptionsRangeSelector = () => {
        return {
            buttons: [
                {
                    type: "day",
                    count: 1,
                    text: '1d',
                },
                {
                    type: 'day',
                    count: 7,
                    text: '7d'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3m'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m'
                }, {
                    type: 'all',
                    count: 1,
                    text: '1y'
                }
            ],
            selected: 4,
            allButtonsEnabled: true,
            inputEnabled: false
        };
    };

    getYAxis = () => {
        return [
            {
                title: {text: ''},
            },
        ]
    };


    afterSetExtremes = (e) => {
        if (!e.rangeSelectorButton) return;
        let priceListAsc = this.state.data.slice();
        this.setState({isLoading: true})
        if (e.rangeSelectorButton.text === "1d") {
            options.series[0].data = this.state.OneData
        } else if (e.rangeSelectorButton.text === "7d") {
            options.series[0].data = priceListAsc.slice(-7)
        } else if (e.rangeSelectorButton.text === "3m") {
            options.series[0].data = priceListAsc.slice(-90)
        } else if (e.rangeSelectorButton.text === "6m") {
            options.series[0].data = priceListAsc.slice(-180)
        } else if (e.rangeSelectorButton.text === "1y") {
            options.series[0].data = priceListAsc
        }
        this.setState({isLoading: false})
    }

    getTickerChartOneDayCallback = (priceList) => {
        let priceListAsc = priceList.slice();
        let newArray = priceListAsc.map(price => ({
            x: price.trade_date_unix * 1000,
            y: price.portfolio_value,
            portfoliogain: price.portfolio_gain,
            portfoliogainpct: price.portfolio_pct_gain,
        }));
        this.setState({OneData: newArray})
    };

    // https://www.highcharts.com/docs/chart-and-series-types/technical-indicator-series
    getTickerChartCallback(priceList) {
        if (priceList.length === 0) return;
        let priceListAsc = priceList.slice()
        let newArray = priceListAsc.map((price, index) => ({
            x: price.trade_date_unix * 1000,
            y: price.portfolio_value,
            portfoliogain: price.portfolio_gain,
            portfoliogainpct: price.portfolio_pct_gain,
        }));

        options.yAxis = this.getYAxis()
        options.xAxis = {events: {afterSetExtremes: (e) => this.afterSetExtremes(e)}}
        options.series = this.getOptionsSeries([]);
        options.series[0].data = newArray;
        options.rangeSelector = this.getOptionsRangeSelector();
        options.colors = ['#0081f2'];
        this.setState({data: newArray})

        watchlist_portfolio.get(this.getTickerChartOneDayCallback, 1, this.props.tagId);


        this.setState({
            isLoading: false,
            fiveYrLoaded: true
        });
    }

}

const options = {
    navigator: {
        adaptToUpdatedData: false,
        enabled: false
    },
    scrollbar: {
        enabled: false
    },
    series: [],
    chart: {
        height: '300px'
    },
    exporting: {
        enabled: false
    },
}

export default ChartWatchList;

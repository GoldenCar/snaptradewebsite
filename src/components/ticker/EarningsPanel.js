import React, {Component} from 'react';
import EarningsPanelUI from './EarningsPanelUI.js';
import ticker_actual from '../../apiclient/tickers/ticker_actual.js';
import tickers_fundamentals from '../../apiclient/tickers/tickers_fundamentals.js';
import ticker_point from '../../apiclient/tickers/ticker_point.js';

class EarningsPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            ticker: this.props.ticker,
            ebtList: [],
            noData: false,
            ticker_actual:null
        };
        this.getFundamentalsCallback = this.getFundamentalsCallback.bind(this);
        this.getPointCallback = this.getPointCallback.bind(this);
    }

    render() {
        return (
            <div>
                <EarningsPanelUI
                    ebtList={this.state.ebtList}
                    options={options}
                    optionsPoint={optionsPoint}
                    noData={this.state.noData}
                />
            </div>
        );
    }

    componentWillMount() {
        ticker_actual.get((ticker_actual)=>this.setState({ticker_actual}), this.props.ticker);
        tickers_fundamentals.get(this.getFundamentalsCallback, this.props.ticker);
        ticker_point.get(this.getPointCallback, this.props.ticker);
    }


    getFundamentalsCallback(response, ticker) {
        // let ebtList = response.map(item => (Number(item.ebt_formatted.slice(0, -1))))
        let ebtList = response.map(item => (item.ebt))
        let epsList = response.map(item => (item.eps))
        let revList = response.map(item => (item.revenue))
        let xAxix = response.map(item => (item.qtr))

        if (!ebtList.length && !epsList.length && !revList.length) {
            this.setState({noData: true})
            return;
        }

        options.series[0].data = revList;
        options.series[1].data = ebtList;
        options.series[2].data = epsList;
        options.xAxis.categories = xAxix;
        console.log(options);
        this.setState({ticker: ticker, ebtList: response})
    }

    legend = () =>{
        const {ticker_actual} = this.state;
        console.warn(ticker_actual)
        return {
            labelFormatter: function () {
                if (this.name === "Estimated"){
                    return this.name + '<br/>' + "$" +ticker_actual[0].eps_estimate
                }else {
                    return this.name + '<br/> Expected ' + ticker_actual[0].earning_date_formatted + " " +ticker_actual[0].earning_time
                }
            }
        }
    }

    getPointCallback(response, ticker) {
        if (response.length === 0) return;
        let responseListAsc = response.slice();
        let newX = [];
        responseListAsc.map((value) => newX.push(value.earning_qtr));
        let eps_estimate = responseListAsc.map((value, index) => ([index, value.eps_estimate]));
        let eps_actual = responseListAsc.map((value, index) => ([index, value.eps_actual]));

        optionsPoint.series[0].data = eps_actual;
        optionsPoint.series[1].data = eps_estimate;
        optionsPoint.legend = this.legend();
        optionsPoint.xAxis.categories = newX;
        console.log(options);
    }
}

const options = {
    chart: {
        height: 320
    },
    title: {
        text: null
    },
    series: [
        {
            name: 'Revenue',
            color: '#669900',
            data: []
        },
        {
            name: 'EBT',
            color: '#00bbFF',
            data: []
        },
        {
            name: 'EPS',
            color: '#bb0099',
            yAxis: 1,
            data: []
        }
    ],
    xAxis: {
        categories: []
    },
    yAxis: [
        {
            title: {
                text: ''
            },
            labels: {
                formatter: function () {
                    if (this.value > 1000000000) {
                        return (this.value / 1000000000).toFixed(1) + "B";
                    } else if (this.value > 1000000) {
                        return (this.value / 1000000).toFixed(1) + "M";
                    } else {
                        return (this.value);
                    }
                }
            },
        },
        { // Secondary yAxis
            title: {
                text: '',
            },
            opposite: true
        }
    ],
    legend: {
        itemStyle: {
            color: '#ccc'
        },
        itemHoverStyle: {
            color: '#eee'
        },
        itemHiddenStyle: {
            color: '#666'
        }
    },
    exporting: {
        enabled: false
    }
};


const optionsPoint = {
    chart: {
        type: 'scatter',
        height: 320,
    },
    title: {
        text: null
    },
    series: [
        {
            name: 'Estimated',
            color: '#05d19a',
            data: [],
            tooltip: {
                valueDecimals: 2,
                pointFormat: '<div>{point.y}</div>'
            },
        },
        {
            name: 'Actual',
            color: '#274845',
            data: [],
            tooltip: {
                valueDecimals: 2,
                pointFormat: '<div>{point.y}</div>'
            },
        }
    ],
    xAxis: {
        categories: []
    },
    yAxis: [
        {
            title: {
                text: ''
            },
            labels: {
                formatter: function () {
                    return "$" + this.value;
                }
            },
        },
        { // Secondary yAxis
            title: {
                text: '',
            },
            opposite: true
        }
    ],
    legend: {
        itemStyle: {
            color: '#ccc'
        },
        itemHoverStyle: {
            color: '#eee'
        },


    },
    exporting: {
        enabled: false
    }
}

export default EarningsPanel;

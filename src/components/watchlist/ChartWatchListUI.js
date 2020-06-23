import React, {Component} from 'react';
import {DotLoader} from 'react-spinners';
/* https://www.npmjs.com/package/highcharts-react-official */
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official';

class ChartWatchListUI extends Component {
    render() {
        const {tooltip, isLoading, options} = this.props
        return (
            <div>
                {
                    !isLoading &&
                    <HighchartsReact
                        ref={ref => this.ref = ref}
                        highcharts={Highcharts}
                        constructorType={'stockChart'}
                        options={Object.assign({}, options)}
                    />
                }
                {
                    isLoading &&
                    <div style={loaderCont}>
                        <DotLoader
                            color='#64b5f6'
                            loading={isLoading}
                        />
                    </div>
                }
            </div>
        )
    }
}


const loaderCont = {
    height: '200px',
    width: '100%',
    padding: '120px 0 120px 300px',
    margin: 'auto'
}

export default ChartWatchListUI;

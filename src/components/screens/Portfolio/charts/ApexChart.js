import React from 'react'
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export class ApexChart extends React.Component {
    constructor(props) {
        console.log('PROPS',props)
        super(props);
        this.state = {
            series: props.series,
            options: props.options,
            type: props.type,
            className: props.className,
            style: props.style
        }
    }



    render() {
        return (
            <div id="chart">
                <Chart options={this.state.options} series={this.state.series} type={this.state.type} style={this.state.style} className={this.state.className} />
            </div>
        );
    }
}
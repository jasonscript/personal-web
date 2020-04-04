import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend, Guide } from 'bizcharts';
import { Button } from 'antd';
import numeral from 'numeral';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import moment from 'moment';
import Debounce from 'lodash.debounce';

import autoHeight from '../autoHeight';
import { GainsDataType } from '../../../data.d';

export interface GainsChartProps {
  data: GainsDataType[];
  title?: string;
  padding?: [number, number, number, number];
  height?: number;
}

interface GainsChartState {
  data: GainsDataType[];
  dateRange: [number, number];
  showAlipayAvgLine: boolean;
  showCMBAvgLine: boolean;
}

class GainsChart extends Component<GainsChartProps, GainsChartState> {
  color = {
    alipay: '#1977fd',
    cmb: '#d81e06',
    gains: '#f5222d',
    loss: '#52c41a',
  };

  timeScale = {
    type: 'time',
    // tickInterval: 60 * 60 * 1000,
    mask: 'MM-DD',
    range: [0, 1],
  };

  cols = {
    date: this.timeScale,
  };

  ds = new DataSet({
    state: {
      start: 0,
      end: 0,
    },
  });

  dv = this.ds.createView();

  constructor(props: GainsChartProps) {
    super(props);
    const { data: sourceData } = props;
    const data =
      Array.isArray(sourceData) && sourceData.length > 0
        ? sourceData
        : [{ date: 0, alipay: 0, cmb: 0, total: 0 }];

    data.sort((a, b) => a.date - b.date);

    const start = data[0].date;
    const end = data[data.length - 1].date;

    this.ds.setState('start', start);
    this.ds.setState('end', end);

    this.dv
      .source(data)
      .transform({
        type: 'fold',
        fields: ['alipay', 'cmb', 'total'],
        key: 'type', // key字段
        value: 'value', // value字段
      })
      .transform({
        type: 'filter',
        callback: (obj: { date: string }) => {
          const { date } = obj;
          return date <= this.ds.state.end && date >= this.ds.state.start;
        },
      });

    this.state = {
      data,
      dateRange: [start, end],
      showAlipayAvgLine: false,
      showCMBAvgLine: false,
    };
  }

  handleToggle = (channel: string) => {
    if (channel === 'Alipay') {
      const show = this.state.showAlipayAvgLine;
      this.setState({
        showAlipayAvgLine: !show,
      });
    } else {
      const show = this.state.showCMBAvgLine;
      this.setState({
        showCMBAvgLine: !show,
      });
    }
  };

  handleSliderChange = Debounce(
    ({ startValue, endValue }: { startValue: number; endValue: number }) => {
      this.ds.setState('start', startValue);
      this.ds.setState('end', endValue);
      this.setState({
        dateRange: [
          moment(moment(startValue).format('YYYY-MM-DD')).valueOf(),
          moment(moment(endValue).format('YYYY-MM-DD')).valueOf(),
        ],
      });
    },
    500,
  );

  renderMoney = (money: number) => (
    <span style={{ color: money > 0 ? this.color.gains : this.color.loss }}>
      {numeral(money).format('0.00')}
    </span>
  );

  renderChannelAnalysis = (channel: string, days: number) => {
    const [start, end] = this.state.dateRange;
    const { data } = this.state;
    const show = channel === 'Alipay' ? this.state.showAlipayAvgLine : this.state.showCMBAvgLine;
    const total = data
      .filter((item: GainsDataType) => item.date >= start && item.date <= end)
      .reduce((p: number, c: GainsDataType) => p + c[channel.toLowerCase()], 0);
    const avg = total / days;

    return (
      <span>
        {channel}收益 {this.renderMoney(total)}，日均 {this.renderMoney(avg)}
        <Button
          size="small"
          type="primary"
          style={{ margin: '0px 5px' }}
          onClick={() => this.handleToggle(channel)}
        >
          {show ? '隐藏描线' : '显示描线'}
        </Button>
      </span>
    );
  };

  renderAnalysis = () => {
    const [start, end] = this.state.dateRange;
    const { data } = this.state;
    const startDate = moment(start).format('MM-DD');
    const endDate = moment(end).format('MM-DD');
    const days = (end - start) / (24 * 60 * 60 * 1000) + 1;
    const total = data
      .filter((item: GainsDataType) => item.date >= start && item.date <= end)
      .reduce((p: number, c: GainsDataType) => p + c.total, 0);
    const avg = total / days;

    return (
      <p>
        <span>
          {startDate} ~ {endDate} ({days}天){' '}
        </span>
        <span>
          总收益 {this.renderMoney(total)}，日均 {this.renderMoney(avg)}，
        </span>
        {this.renderChannelAnalysis('Alipay', days)}
        {this.renderChannelAnalysis('CMB', days)}
      </p>
    );
  };

  renderAvgLine = (avg: number, channel: string) => (
    <Guide.Line
      top
      start={['min', avg]}
      end={['max', avg]}
      lineStyle={{
        stroke: this.color[channel],
        lineWidth: 2,
        lineDash: [3, 5],
      }}
      text={{
        position: 'end',
        offsetX: 6,
        offsetY: 6,
        style: {
          fill: this.color[channel],
          fontSize: 12,
          fontWeight: 'normal',
        },
        content: `${channel === 'alipay' ? 'Alipay' : 'CMB'}日均`,
      }}
    />
  );

  renderSlider = () => {
    const { padding = [60, 80, 80, 40] as [number, number, number, number] } = this.props;
    const { data } = this.state;
    return (
      <Slider
        padding={[0, padding[1] + 20, 0, padding[3]]}
        width="auto"
        height={26}
        xAxis="date"
        yAxis="money"
        scales={{ date: this.timeScale }}
        data={data}
        start={this.ds.state.start}
        end={this.ds.state.end}
        backgroundChart={{ type: 'line' }}
        onChange={this.handleSliderChange}
      />
    );
  };

  render() {
    const {
      title,
      height = 400,
      padding = [60, 80, 80, 40] as [number, number, number, number],
    } = this.props;
    const { data, showAlipayAvgLine, showCMBAvgLine } = this.state;

    const [start, end] = this.state.dateRange;
    const days = (end - start) / (24 * 60 * 60 * 1000) + 1;
    const totalAli = data
      .filter((item: GainsDataType) => item.date >= start && item.date <= end)
      .reduce((p: number, c: GainsDataType) => p + c.alipay, 0);
    const avgAli = totalAli / days;
    const totalCMB = data
      .filter((item: GainsDataType) => item.date >= start && item.date <= end)
      .reduce((p: number, c: GainsDataType) => p + c.cmb, 0);
    const avgCMB = totalCMB / days;

    return (
      <div style={{ height: height + 100 }}>
        <div>
          {title && <h4>{title}</h4>}
          {this.renderAnalysis()}
          <Chart height={height} padding={padding} data={this.dv} scale={this.cols} forceFit>
            <Legend visible={false} />
            <Axis name="date" />
            <Tooltip />
            <Geom
              type="area"
              position="date*value"
              shape="smooth"
              color={[
                'type',
                type => {
                  if (type !== 'total') {
                    return this.color[type];
                  }
                  return this.color.gains;
                },
              ]}
            />
            <Guide>
              <Guide.RegionFilter
                top
                start={['min', 0]}
                end={['max', 'min']}
                color={this.color.loss}
              />
              <Guide.RegionFilter
                top
                start={['min', 'max']}
                end={['max', 0]}
                color={this.color.gains}
              />
              <Guide.Line
                start={['min', 0]}
                end={['max', 0]}
                lineStyle={{
                  stroke: '#f00',
                  lineWidth: 1,
                  lineDash: [3, 3],
                }}
                text={{
                  position: 'start',
                  style: {
                    fill: '#f00',
                    fontSize: 12,
                    fontWeight: 'normal',
                  },
                  content: '',
                }}
              />
              {showAlipayAvgLine && this.renderAvgLine(avgAli, 'alipay')}
              {showCMBAvgLine && this.renderAvgLine(avgCMB, 'cmb')}
            </Guide>
          </Chart>
          <div style={{ marginRight: -20 }}>{this.renderSlider()}</div>
        </div>
      </div>
    );
  }
}

export default autoHeight()(GainsChart);

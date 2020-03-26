import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Label, Legend, Guide } from 'bizcharts';
import numeral from 'numeral';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import moment from 'moment';

import autoHeight from '../autoHeight';

export interface GainsChartProps {
  data: {
    date: number;
    channel: string;
    money: number;
    total: number;
  }[];
  title?: string;
  padding?: [number, number, number, number];
  height?: number;
}

interface GainsChartState {
  data: {
    date: number;
    channel: string;
    money: number;
    total: number;
  }[];
  showAlipayAvgLine: boolean;
}

class GainsChart extends Component<GainsChartProps, GainsChartState> {
  constructor(props: GainsChartProps) {
    super(props);
    const { data: sourceData } = props;
    const data =
      Array.isArray(sourceData) && sourceData.length > 0
        ? sourceData
        : [{ date: 0, channel: '', money: 0, total: 0 }];

    data.sort((a, b) => a.date - b.date);

    this.state = {
      data,
      showAlipayAvgLine: true,
    };
  }

  color = {
    alipay: '#1977fd',
    cmb: '#d81e06',
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

  renderAvgLine = (avg: number, channel: string) => (
    <Guide.Line
      start={['min', avg]}
      end={['max', avg]}
      lineStyle={{
        stroke: this.color[channel],
        lineWidth: 1,
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

  render() {
    const {
      title,
      height = 400,
      padding = [60, 80, 80, 40] as [number, number, number, number],
    } = this.props;
    const { data } = this.state;

    const ds = new DataSet({
      state: {
        start: data[0].date,
        end: data[data.length - 1].date,
      },
    });

    const dv = ds.createView();
    dv.source(data).transform({
      type: 'filter',
      callback: (obj: { date: string }) => {
        const { date } = obj;
        return date <= ds.state.end && date >= ds.state.start;
      },
    });

    const SliderGen = () => (
      <Slider
        padding={[0, padding[1] + 20, 0, padding[3]]}
        width="auto"
        height={26}
        xAxis="date"
        yAxis="total"
        scales={{ date: this.timeScale }}
        data={data}
        start={ds.state.start}
        end={ds.state.end}
        backgroundChart={{ type: 'line' }}
        onChange={({ startValue, endValue }: { startValue: string; endValue: string }) => {
          ds.setState('start', startValue);
          ds.setState('end', endValue);
        }}
      />
    );

    const { start, end } = ds.state;
    const startDate = moment(start).format('MM-DD');
    const endDate = moment(end).format('MM-DD');
    const days = (end - start) / (24 * 60 * 60 * 1000) + 1;
    const total = data
      .filter((item: any) => item.date >= start && item.date <= end && item.channel === 'Alipay')
      .reduce((p, c) => p + c.total, 0);
    const avg = total / days;
    const totalAli = data
      .filter((item: any) => item.date >= start && item.date <= end && item.channel === 'Alipay')
      .reduce((p, c) => p + c.money, 0);
    const avgAli = totalAli / days;
    const totalCMB = data
      .filter((item: any) => item.date >= start && item.date <= end && item.channel === 'CMB')
      .reduce((p, c) => p + c.money, 0);
    const avgCMB = totalCMB / days;

    const Money = (money: number) => (
      <span style={{ color: money > 0 ? '#f5222d' : '#52c41a' }}>
        {numeral(money).format('0.00')}
      </span>
    );

    const Analysis = () => (
      <p>
        <span>
          {startDate} ~ {endDate} ({days}天){' '}
        </span>
        <span>
          总收益 {Money(total)}，日均 {Money(avg)}，
        </span>
        <span>
          Alipay收益 {Money(totalAli)}，日均 {Money(avgAli)}，
        </span>
        <span>
          CMB收益 {Money(totalCMB)}，日均 {Money(avgCMB)}
        </span>
      </p>
    );

    return (
      <div style={{ height: height + 100 }}>
        <div>
          {title && <h4>{title}</h4>}
          <Analysis />
          <Chart height={height} padding={padding} data={dv} scale={this.cols} forceFit>
            <Legend />
            <Axis name="date" />
            <Axis name="money" />
            <Tooltip />
            <Geom
              type="line"
              position="date*money"
              color={[
                'channel',
                channel => {
                  if (channel === 'Alipay') {
                    return '#1977fd';
                  }
                  return '#d81e06';
                },
              ]}
              style={{
                stroke: '#fff',
                lineWidth: 1,
              }}
            >
              <Label
                content={['total', value => numeral(value).format('0.00')]}
                // eslint-disable-next-line
                formatter={(text, item) => (item._origin.channel === 'CMB' ? null : text)}
                textStyle={text => ({
                  fill: text > 0 ? '#f5222d' : '#52c41a',
                })}
              />
            </Geom>
            <Guide>
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
              {this.state.showAlipayAvgLine && this.renderAvgLine(avgAli, 'alipay')}
              {this.renderAvgLine(avgCMB, 'cmb')}
            </Guide>
          </Chart>
          <div style={{ marginRight: -20 }}>
            <SliderGen />
          </div>
        </div>
      </div>
    );
  }
}

export default autoHeight()(GainsChart);

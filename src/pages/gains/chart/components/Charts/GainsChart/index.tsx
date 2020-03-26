import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Label, Legend, Guide } from 'bizcharts';
import { Button } from 'antd';
import numeral from 'numeral';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import moment from 'moment';

import autoHeight from '../autoHeight';

interface DataItem {
  date: number;
  channel: string;
  money: number;
  total: number;
}

export interface GainsChartProps {
  data: DataItem[];
  title?: string;
  padding?: [number, number, number, number];
  height?: number;
}

interface GainsChartState {
  data: DataItem[];
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
      dateRange: [data[0].date, data[data.length - 1].date],
      showAlipayAvgLine: true,
      showCMBAvgLine: true,
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
      .filter(
        (item: DataItem) => item.date >= start && item.date <= end && item.channel === channel,
      )
      .reduce((p: number, c: DataItem) => p + c.money, 0);
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
      .filter(
        (item: DataItem) => item.date >= start && item.date <= end && item.channel === 'Alipay',
      )
      .reduce((p: number, c: DataItem) => p + c.total, 0);
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
    const { data, showAlipayAvgLine, showCMBAvgLine } = this.state;

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
          this.setState({
            dateRange: [moment(startValue).valueOf(), moment(endValue).valueOf()],
          });
        }}
      />
    );

    const [start, end] = this.state.dateRange;
    const days = (end - start) / (24 * 60 * 60 * 1000) + 1;
    const totalAli = data
      .filter(
        (item: DataItem) => item.date >= start && item.date <= end && item.channel === 'Alipay',
      )
      .reduce((p: number, c: DataItem) => p + c.money, 0);
    const avgAli = totalAli / days;
    const totalCMB = data
      .filter((item: DataItem) => item.date >= start && item.date <= end && item.channel === 'CMB')
      .reduce((p: number, c: DataItem) => p + c.money, 0);
    const avgCMB = totalCMB / days;

    return (
      <div style={{ height: height + 100 }}>
        <div>
          {title && <h4>{title}</h4>}
          {this.renderAnalysis()}
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
              {showAlipayAvgLine && this.renderAvgLine(avgAli, 'alipay')}
              {showCMBAvgLine && this.renderAvgLine(avgCMB, 'cmb')}
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

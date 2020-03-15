import { Card } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { TemperatureDataType } from '../data.d';

import { TimelineChart } from './Charts';

const TemperatureData = ({
  loading,
  chartData,
}: {
  loading: boolean;
  chartData: TemperatureDataType[];
}) => (
  <Card loading={loading} bordered={false} style={{ paddingBottom: 20 }}>
    <TimelineChart
      height={400}
      data={chartData}
      title="温度总览"
      titleMap={{
        y1: formatMessage({ id: 'temperaturechart.y1' }),
        y2: formatMessage({ id: 'temperaturechart.y2' }),
      }}
    />
  </Card>
);

export default TemperatureData;

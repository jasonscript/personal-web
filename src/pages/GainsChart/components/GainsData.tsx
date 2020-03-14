import { Card } from 'antd';
// import { formatMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { GainsDataType } from '../data.d';

import { GainsChart } from './Charts';

const GainsData = ({
  loading,
  title,
  chartData,
}: {
  loading: boolean;
  title?: string;
  chartData: GainsDataType[];
}) => (
  <Card loading={loading} bordered={false} style={{ marginTop: 20 }}>
    <GainsChart height={400} data={chartData} title={title || '收益总览'} />
  </Card>
);

export default GainsData;

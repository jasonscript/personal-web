import React, { Component, Suspense } from 'react';
import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';

import PageLoading from './components/PageLoading';
import { TemperatureChartData } from './data.d';

const TemperatureData = React.lazy(() => import('./components/TemperatureData'));

interface TemperatureChartProps {
  temperatureChart: TemperatureChartData;
  dispatch: Dispatch<any>;
  loading: boolean;
}

class TemperatureChart extends Component<TemperatureChartProps> {
  reqRef: number = 0;

  timeoutId: number = 0;

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'temperatureChart/fetch',
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'temperatureChart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  render() {
    const { temperatureChart, loading } = this.props;
    const { temperatureData } = temperatureChart;

    return (
      <GridContent>
        <React.Fragment>
          <Suspense fallback={<PageLoading />}>
            <TemperatureData loading={loading} chartData={temperatureData} />
          </Suspense>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default connect(
  ({
    temperatureChart,
    loading,
  }: {
    temperatureChart: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    temperatureChart,
    loading: loading.effects['temperatureChart/fetch'],
  }),
)(TemperatureChart);

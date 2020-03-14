import React, { Component, Suspense } from 'react';
import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';

import PageLoading from './components/PageLoading';
import { GainsChartData } from './data.d';

const GainsData = React.lazy(() => import('./components/GainsData'));

interface GainsChartProps {
  gainsChart: GainsChartData;
  dispatch: Dispatch<any>;
  loading: boolean;
}

class GainsChart extends Component<GainsChartProps> {
  reqRef: number = 0;

  timeoutId: number = 0;

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'gainsChart/fetch',
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'gainsChart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  render() {
    const { gainsChart, loading } = this.props;
    const { jasonGains, qierGains } = gainsChart;

    return (
      <GridContent>
        <React.Fragment>
          <Suspense fallback={<PageLoading />}>
            <GainsData loading={loading} title="Jason 收益" chartData={jasonGains} />
          </Suspense>
          <Suspense fallback={null}>
            <GainsData loading={loading} title="Qier 收益" chartData={qierGains} />
          </Suspense>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default connect(
  ({
    gainsChart,
    loading,
  }: {
    gainsChart: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    gainsChart,
    loading: loading.effects['gainsChart/fetch'],
  }),
)(GainsChart);

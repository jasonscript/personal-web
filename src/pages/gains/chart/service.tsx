import request from '@/utils/request';

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function fetchGainsData() {
  return request('/api-local/gains').then(data => {
    data.forEach((item: any) => {
      item.date = new Date(item.date).getTime();
    });
    const jasonData = data.filter((item: any) => item.name === 'Jason');
    jasonData.forEach((item: any) => {
      if (item.channel === 'Alipay') {
        let cmb = 0;
        cmb = jasonData.find((gain: any) => gain.date === item.date && gain.channel === 'CMB')
          .money;
        item.total = item.money + cmb;
      } else {
        item.total = item.money;
      }
    });
    const qierData = data.filter((item: any) => item.name === 'Qier');
    qierData.forEach((item: any) => {
      if (item.channel === 'Alipay') {
        let cmb = 0;
        cmb = qierData.find((gain: any) => gain.date === item.date && gain.channel === 'CMB').money;
        item.total = item.money + cmb;
      } else {
        item.total = item.money;
      }
    });
    return { jasonGains: jasonData, qierGains: qierData };
  });
}

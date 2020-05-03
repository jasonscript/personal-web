import request from '@/utils/request';

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function fetchGainsData() {
  return request('/api-personal/gains').then(data => {
    data.forEach((item: any) => {
      item.date = new Date(item.date).getTime();
    });
    const jasonGains = data.filter(
      (item: any) => item.name === 'Jason' && item.channel === 'Alipay',
    );
    jasonGains.forEach((item: any) => {
      item.alipay = item.money;
      item.cmb = data.find(
        ({ date, name, channel }: { date: number; name: string; channel: string }) =>
          date === item.date && name === 'Jason' && channel === 'CMB',
      ).money;
      item.total = Math.floor((item.alipay + item.cmb) * 100) / 100;
    });
    const qierGains = data.filter((item: any) => item.name === 'Qier' && item.channel === 'Alipay');
    qierGains.forEach((item: any) => {
      item.alipay = item.money;
      item.cmb = data.find(
        ({ date, name, channel }: { date: number; name: string; channel: string }) =>
          date === item.date && name === 'Qier' && channel === 'CMB',
      ).money;
      item.total = Math.floor((item.alipay + item.cmb) * 100) / 100;
    });
    return { jasonGains, qierGains };
  });
}

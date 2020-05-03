import request from '@/utils/request';

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function fetchTemperatureData() {
  return request('/api-personal/temperature').then(res => {
    const temperatureData: any[] = [];
    res.forEach((item: any) => {
      const time = new Date(item.time).getTime();
      const index = temperatureData.findIndex(temp => temp.x === time);
      if (index < 0) {
        const temp = { x: time, y1: null, y2: null };
        if (item.name === 'Jason') {
          temp.y1 = item.value;
        } else {
          temp.y2 = item.value;
        }
        temperatureData.push(temp);
      } else if (item.name === 'Jason') {
        temperatureData[index].y1 = item.value;
      } else {
        temperatureData[index].y2 = item.value;
      }
    });
    return { temperatureData };
  });
}

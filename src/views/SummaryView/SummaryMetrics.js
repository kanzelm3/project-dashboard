import { Set } from 'immutable';

const getSummaryMetrics = (data) => {
  let ids = new Set();
  let airThreats = new Set();
  let ramThreats = new Set();
  let types = new Set();
  let radars = new Set();

  data.forEach((row) => {
    if (row.has('id')) {
      ids = ids.add(row.get('id'));
    }
    if (row.has('type')) {
      types = types.add(row.get('type'));
    }
    if (row.has('radarId')) {
      radars = radars.add(row.get('radarId'));
    }
    if (row.has('objType')) {
      if (row.get('objType') === 'AIRBREATHER') {
        airThreats = airThreats.add(row.get('id'));
      } else if (row.get('objType') === 'BALLISTIC') {
        ramThreats = ramThreats.add(row.get('id'));
      }
    }
  });

  return ({
    trackIds: ids.sort(),
    airThreats: airThreats,
    ramThreats: ramThreats,
    radars: radars,
    time: 0,
    avgTqVel: 0,
    avgTzPos: 0
  });
};

export default getSummaryMetrics;

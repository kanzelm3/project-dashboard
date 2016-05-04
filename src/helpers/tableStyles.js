
const hide1450 = (width) => {
  if (width < 1450) {
    return ({
      display: 'none'
    });
  }
};

const hide1200 = (width) => {
  if (width < 1200) {
    return ({
      display: 'none'
    });
  }
};

const hide1000 = (width) => {
  if (width < 1000) {
    return ({
      display: 'none'
    });
  }
};

export const tableStyles = {
  taskHeader: {
    cursor: 'pointer',
    padding: '0'
  },
  columnLabel: {
    padding: '22px'
  },
  label: {
    lineHeight: '27px',
    verticalAlign: 'middle'
  },
  active: {
    fontWeight: 'bold',
    color: '#000'
  },
  icon: {
    marginLeft: '12px',
    height: '18px',
    width: '18px',
    verticalAlign: 'middle'
  },
  xl: {
    width: '275px'
  },
  l: {
    width: '175px'
  },
  m: {
    width: '130px'
  },
  s: {
    width: '110px'
  },
  slider: {
    width: '175px',
    float: 'left'
  },
  sliderVal: {
    float: 'right',
    marginTop: '24px'
  },
  textLabel: {
    fontSize: '16px',
    lineHeight: '16px'
  },
  completenessDiv: {
    padding: '0 22px'
  }
};

export const durationHeader = (width) => {
  return Object.assign({}, tableStyles.taskHeader, tableStyles.s, hide1450(width));
};
export const statusHeader = Object.assign({}, tableStyles.taskHeader, tableStyles.m);
export const beginHeader = (width) => {
  return Object.assign({}, tableStyles.taskHeader, tableStyles.l, hide1450(width));
};
export const endHeader = (width) => {
  return Object.assign({}, tableStyles.taskHeader, tableStyles.l, hide1000(width));
};
export const assigneeHeader = (width) => {
  return Object.assign({}, tableStyles.taskHeader, tableStyles.l, hide1200(width));
};
export const completenessHeader = Object.assign({}, tableStyles.taskHeader, tableStyles.xl);

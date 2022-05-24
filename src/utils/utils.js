/* eslint-disable no-restricted-properties */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { parse } from 'querystring';
import Big from 'big.js';
import moment from 'moment';

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const arrayToTree = (list, parId = 0) => {
  const len = list.length
  function loop(pid) {
    const res = [];
    for (let i = 0; i < len; i += 1) {
      const item = list[i]
      if (item.pid === pid) {
        item.children = loop(item.id)
        res.push(item)
      }
    }
    return res.length ? res : null
  }
  return loop(parId)
}

export const uploadImageFormatConversion = (imgArr, urlKey) => {
  return imgArr.map(item => {
    return item[urlKey]
  })
}

export const amountTransform = (amount, type = '*') => {
  if (!amount) {
    return 0;
  }

  if (type === '*') {
    return +new Big(amount).times(100)
  }

  return +new Big(amount).div(100)
}

export const numFormat = (num) => {
  const c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return c;
}

export const digitUppercase = (n) => {
  const fraction = ['角', '分'];
  const digit = [
    '零', '壹', '贰', '叁', '肆',
    '伍', '陆', '柒', '捌', '玖'
  ];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  const head = n < 0 ? '欠' : '';
  n = Math.abs(n);
  let s = '';
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = '';
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

export const typeTransform = (array) => {
  if (!Array.isArray(array)) {
    return {}
  }
  const obj = {};
  array.forEach(item => {
    obj[item.code] = {
      text: item.name,
    }
  })
  return obj;
}

export const paramsEmptyFilter = (params) => {
  const obj = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const key in params) {
    if (params[key] !== '') {
      obj[key] = params[key]
    }
  }

  return obj;
}

export const getImageSize = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (theFile) => {
      const image = new Image()
      image.src = theFile.target.result
      image.onload = function () {
        const { width, height } = this;
        resolve({ width, height })
      }
    }
  });
}

export const dateFormat = (date) => {
  if (!date) {
    return ''
  }
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export const toLowerCaseInitials = (obj) => {
  if(typeof(obj)==='object'){
    for (const key in obj){
      if (/[A-Z]/.test(key.substring(0,1))) {
        obj[key.substring(0,1).toLowerCase()+key.substring(1)] = obj[key]
        delete obj[key]
      }
    }  
    return obj;
  }
}

export const getAreaData = (v) => {
  const arr = [];
  v?.forEach?.(item => {
    let deep = 0;
    let node = window.yeahgo_area.find(it => it.id === item);
    const nodeIds = [node.id];
    const nodeNames = [node.name]
    while (node.pid) {
      deep += 1;
      node = window.yeahgo_area.find(it => it.id === node.pid);
      nodeIds.push(node.id);
      nodeNames.push(node.name);
    }
    arr.push({
      provinceId: nodeIds[deep],
      provinceName: nodeNames[deep],
      cityId: deep > 0 ? nodeIds[deep - 1] : 0,
      cityName: deep > 0 ? nodeNames[deep - 1] : '',
      regionId: deep > 1 ? nodeIds[deep - 2] : 0,
      regionName: deep > 1 ? nodeNames[deep - 2] : '',
    })
  })

  return arr;
}

export const getTimeDistance = (type) => {
  const oneDay = 1000 * 60 * 60 * 24;
  const now = new Date();

  // 昨天
  if (type === 'yesterday') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now).subtract(1, 'day'), moment(now.getTime() + (oneDay - 1000)).subtract(1, 'day')];
  }
}
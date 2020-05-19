const GLOBAL = {
  toTime: (timestamp, $type) => {
    if (timestamp) {
      const date = new Date(timestamp);
      const Y = `${date.getFullYear()}`;
      const M = date.getMonth() + 1 < 10 ? `-0${date.getMonth() + 1}` : `-${date.getMonth() + 1}`;
      const D = date.getDate() < 10 ? `-0${date.getDate()}` : `-${date.getDate()}`;
      const h = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
      const m = date.getMinutes() < 10 ? `:0${date.getMinutes()}` : `:${date.getMinutes()}`;
      const s = date.getSeconds() < 10 ? `:0${date.getSeconds()}` : `:${date.getSeconds()}`;
      let time = '';
      // 根据$type的值返回不同的时间格式
      switch ($type) {
        case 1:
          time = `${Y}${M}${D}  ${h}${m}${s}`;
          break;
        case 2:
          time = `${Y}${M}${D}`;
          break;
        case 3:
          time = `${h}${m}${s}`;
          break;
        case 4:
          time = `${h}${m}`;
          break;
        default:
          time = `${Y}${M}${D}  ${h}${m}${s}`;
      }
      return time;
    }
    return timestamp;
  },
  getParentPath: (list, id, key) => {
    let res = [];

    function getPath(arr, ids = []) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of arr) {
        if (item[key] === id) {
          res = ids;
          return;
        }
        if (item.children) {
          getPath(item.children, ids.concat([item[key]]));
        }
      }
    }
    getPath(list);

    return res;
  },
  createHash: (hashLength) => {
    if (!hashLength || typeof (Number(hashLength)) != 'number') {
      return;
    }
    var ar = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    var hs = [];
    var hl = Number(hashLength);
    var al = ar.length;
    for (var i = 0; i < hl; i++) {
      hs.push(ar[Math.floor(Math.random() * al)]);
    }

    return hs.join('');
  },
  apiUrl: 'http://file.nobook.cc'
}
export default GLOBAL
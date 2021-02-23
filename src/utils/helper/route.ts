/**
 * 对象转url参数
 * @param {*} data,对象
 * @param {*} isPrefix,是否自动加上"?"
 */
function queryParams(data = {}, isPrefix = true, arrayFormat = "brackets") {
  let prefix = isPrefix ? "?" : "";
  let _result = [];
  if (["indices", "brackets", "repeat", "comma"].indexOf(arrayFormat) == -1)
    arrayFormat = "brackets";
  for (let key in data) {
    // @ts-ignore
    let value = data[key];
    // 去掉为空的参数
    if (["", undefined, null].indexOf(value) >= 0) {
      continue;
    }
    // 如果值为数组，另行处理
    if (value.constructor === Array) {
      // e.g. {ids: [1, 2, 3]}
      switch (arrayFormat) {
        case "indices":
          // 结果: ids[0]=1&ids[1]=2&ids[2]=3
          for (let i = 0; i < value.length; i++) {
            _result.push(key + "[" + i + "]=" + value[i]);
          }
          break;
        case "brackets":
          // 结果: ids[]=1&ids[]=2&ids[]=3
          value.forEach((_value) => {
            _result.push(key + "[]=" + _value);
          });
          break;
        case "repeat":
          // 结果: ids=1&ids=2&ids=3
          value.forEach((_value) => {
            _result.push(key + "=" + _value);
          });
          break;
        case "comma":
          // 结果: ids=1,2,3
          let commaStr = "";
          value.forEach((_value) => {
            commaStr += (commaStr ? "," : "") + _value;
          });
          _result.push(key + "=" + commaStr);
          break;
        default:
          value.forEach((_value) => {
            _result.push(key + "[]=" + _value);
          });
      }
    } else {
      _result.push(key + "=" + value);
    }
  }
  return _result.length ? prefix + _result.join("&") : "";
}

// 整合路由参数
const mixinParam = (url: string, params: object) => {
  // 使用正则匹配，主要依据是判断是否有"/","?","="等，如“/page/index/index?name=mary"
  // 如果有url中有get参数，转换后无需带上"?"
  let query = "";
  if (/.*\/.*\?.*=.*/.test(url)) {
    // object对象转为get类型的参数
    query = queryParams(params, false);
    // 因为已有get参数,所以后面拼接的参数需要带上"&"隔开
    return (url += "&" + query);
  } else {
    // 直接拼接参数，因为此处url中没有后面的query参数，也就没有"?/&"之类的符号
    query = queryParams(params);
    return (url += query);
  }
};

export default mixinParam;

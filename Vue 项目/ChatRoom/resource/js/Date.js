export default {
  // 时间处理
  dateTime(date) {
    let old = new Date(date); // 传的时间
    let now = new Date(); // 当前时间

    let h = old.getHours(); // 传的小时
    let m = old.getMinutes(); // 传的分钟
    let Y = old.getFullYear(); // 传的年份
    let M = old.getMonth() + 1; // 传的月份
    let D = old.getDate(); // 传的日期

    let nY = now.getFullYear(); // 现在年份
    let nM = now.getMonth() + 1; // 现在月份
    let nD = now.getDate(); // 现在日期
    h < 10 ? (h = "0" + h) : h; // 小时补零
    m < 10 ? (m = "0" + m) : m; // 分钟补零
    // 处理今天时间
    if (D === nD && M === nM && Y === nY) {
      return h >= 8 && h < 12
        ? `上午${h}:${m}`
        : h >= 13 && h < 18
        ? `下午${h}:${m}`
        : `${h}:${m}`;
    }
    // 处理昨天时间
    // D是你昨天的时间,加一天看和今天相等不,相等就代表是昨天的时间
    if (D + 1 === nD && M === nM && Y === nY) {
      return `昨天 ${h}:${m}`;
    } else {
      return `${M}-${D} ${h}:${m}`;
    }
  },
  // // 详细时间
  // detailTime(eTime) {
  //   // 获取具体时间
  //   let old = new Date(eTime); // 根据传进来的时间进行处理
  //   // let d = old.getTime(); // 时间戳
  //   let h = old.getHours(); // 获取传进来的 - 小时
  //   let m = old.getMinutes(); // 获取传进来的 - 分钟
  //   let Y = old.getFullYear(); // 获取传进来的 - 年份
  //   let M = old.getMonth() + 1; // 获取传进来的 - 月份
  //   let D = old.getDate(); // 获取传进来的 - 日期
  //   // 处理时间
  //   M < 10 ? (M = "0" + M) : M; // 月份
  //   D < 10 ? (D = "0" + D) : D; // 日期
  //   h < 10 ? (h = "0" + h) : h; // 小时
  //   m < 10 ? (m = "0" + m) : m; // 分钟
  //   return Y + "-" + M + "-" + D + " " + h + ":" + m; // 返回年月日,时间
  // },
  // // 聊天时间
  // Chat_of_time(date) {
  //   let old = new Date(date);
  //   let now = new Date();
  //   // 获取 old 具体时间
  //   let h = old.getHours(); // 当前小时
  //   let m = old.getMinutes(); // 当前分钟
  //   let Y = old.getFullYear(); // 当前年份
  //   let M = old.getMonth() + 1; // 当前月份
  //   let D = old.getDate(); // 当前日期
  //   // 获取 now 具体时间
  //   let nh = now.getHours(); // 当前小时
  //   let nm = now.getMinutes(); // 当前分钟
  //   let nY = now.getFullYear(); // 当前年份
  //   let nM = now.getMonth() + 1; // 当前月份
  //   let nD = now.getDate() - 1; // 当前日期
  //   // 处理当前时间
  //   h < 10 ? (h = "0" + h) : h;
  //   m < 10 ? (m = "0" + m) : m;
  //   // D ->日期  M ->月份 Y ->年
  //   if (D === nD && M === nM && Y === nY) {
  //     return h + ":" + m;
  //   }
  //   if (D + 1 === nD + 1 && M === nM && Y === nY) {
  //     return "昨天" + h + ":" + m;
  //     // 今年
  //   } else if (Y === nY) {
  //     return `${M}月${D}日${" "}${h}:${m}`;
  //   } else {
  //     // 大于今年
  //     return `${Y}年${M}月${D}日${h}:${m}`;
  //   }
  // },
  // 间隔时间差
  Interval_time(old, now) {
    old = new Date(old);
    now = new Date(now);
    let told = old.getTime(); // 之前输入的时间
    let tnow = now.getTime(); // 当前时间
    // 当前时间 >= 之前输入的时间
    // 8.00 >= 8.00 + 5 过了一趟  8.05 >= 8.05 返回当前时间 在这5分钟之内不再返回时间
    return tnow >= told + 1000 * 60 * 5 ? now : "";
  },
  // 生日
  Time(date) {
    let old = new Date(date); // 旧的时间
    let Y = old.getFullYear(); // 当前年份
    let M = old.getMonth() + 1; // 当前月份
    let D = old.getDate() - 1; // 当前日期

    // 处理时间
    M < 10 ? (M = "0" + M) : M; // 月份
    D < 10 ? (D = "0" + D) : D; // 日期
    return `${Y}-${M}-${D} `; //
  },
  // 注册时间
  RegistrationDate(date) {
    let old = new Date(date); // 传的时间
    let N = old.getFullYear();
    let Y = old.getMonth();
    let R = old.getDate();
    let X = old.getHours();
    let F = old.getMinutes();
    return `${N}-${Y}-${R} ${X}:${F}`;
  },
};

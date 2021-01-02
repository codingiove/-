const ins = {
  count: 0,
};
export function redux(state = ins, action) {
  switch (action.type) {
    case "add":
      // 返回给仓库最新的值,这个函数在仓库存着
      // 上面是对象,下面也要返回这种形式
      // 数据怎么定义的就怎么赋值
      return {
        count: state.count + 1,
      };
    default:
      return state;
  }
}

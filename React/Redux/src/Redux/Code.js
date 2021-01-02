// store.js
// 仓库
import { createStore } from "redux";
// 导入数据
import Data from "./Redux";
// 创建仓库,把数据放到仓库(必须是函数类型)
const Store = createStore(Data);
// 让外面使用仓库
export default Store;



// Redux.js
// 添加数据
const Default = {
  num: "默认值",
  list: ["0", "1", "2"],
};
// 把数据导出
export default function (state = Default, action) {
  // console.log(action.type);
  switch (action.type) {
    case "0":
      // 把修改了的值返回给 store 仓库,这个函数在仓库存着
      return state = action.state
    default:
      return state;
  }
}




// app.js
let action = {
  state: "action99",
  type: "0",
};
// dispatch默认情况下触发的是 action
warehouse.dispatch(action);
// 获取仓库中的数据
console.log(warehouse.getState());

// store 专门存放东西 
// action 命令 Redux 执行条件
// Redux 执行方法
// 流程: 把 Redux 方法导入到 store 仓库中, action 命令 Redux 执行
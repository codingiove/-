// 仓库
import { createStore } from "redux";
// 导入数据
import Data from "./Redux"
// 创建仓库,把数据放到仓库(必须是函数类型)
const Store = createStore(Data);
// 让外面使用仓库
export default Store

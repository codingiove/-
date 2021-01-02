// 仓库
import { createStore } from "redux";
// 导入数据
import { redux } from "./redux";
// 创建仓库,把数据放到仓库(必须是函数类型)
export default createStore(redux);
// 让外面使用仓库

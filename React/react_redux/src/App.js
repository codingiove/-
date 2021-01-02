import React from "react";
// 导入仓库
import Store from "./react-redux/store";
// 引入按钮组件
import Btn from "./components/btn";
// 引入数字组件
import Num from "./components/num";
// 导入 Provider 组件,被 Provider 组件包裹的组件都可以访问 store
import { Provider } from "react-redux";
function App() {
  return (
    // 这样 Provider 里的组件都能访问到 Store 属性了
    <Provider store={Store}>
      <div className="App">
        <Btn />
        <Num />
      </div>
    </Provider>
  );
}

export default App;

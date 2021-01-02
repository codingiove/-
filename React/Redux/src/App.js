import React from "react";

// 导入 仓库
import warehouse from "./Redux/store";
class Routers extends React.Component {
  constructor() {
    super();
    // 获取仓库中的数据
    this.state = {
      data: warehouse.getState(),
    };
    let action = {
      state: "action99",
      type: "0",
    };
    // dispatch默认情况下触发的是 action
    warehouse.dispatch(action);
  }
  componentDidMount() {
    warehouse.subscribe(() => {
      this.setState({});
    });
  }
  render() {
    return <div id="app">{this.state.data}</div>;
  }
}

export default Routers;

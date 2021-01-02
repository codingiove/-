import React, { Component } from "react";
import { connect } from "react-redux";
class btn extends Component {
  btnclick = () => {
    // 发送 action
   this.props.sendActions()
  };
  render() {
    return (
      <div>
        <button onClick={this.btnclick}>+</button>
      </div>
    );
  }
}
// 返回值必须是一个对象
const mapDispatchToProps = (dispatch) => {
  // 返回值,会存在当前组件里
  return {
    // 发送 action 函数
    sendActions: () => {
      dispatch({
        type: "add"
      });
    },
  };
};
// connect(要接受数据的函数,要发送 action 的函数)(放入要加强的组件)
export default connect(null, mapDispatchToProps)(btn);

import React from "react";
import ReactDOM from "react-dom";
import css from "./css/index.css";

function Style() {
  // CSS开启模块化使用方式,开启模块化样式只在引入的文件中生效
  // return <div className={css.title}>样式表样式</div>;
  return <div className="title">样式表样式</div>;
}

ReactDOM.render(<Style></Style>, document.getElementById("app"));

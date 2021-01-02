import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// 第一次访问后,断网了,第二次还可以访问当前页面,不会出现空白页,和错误信息等等
import * as serviceWorker from './serviceWorker'; // 资源缓存

// React.StrictMode 严格模式
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();

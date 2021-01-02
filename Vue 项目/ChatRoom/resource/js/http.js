export function http(data) {
  return new Promise((resolve, reject) => {
    uni.request({
      method: "POST",
      ...data,
      url: `http://192.168.0.103:3000/${data.url}`,
      success: (res) => {
        if (res.data.code === 8) {
          uni.navigateTo({ url: "/pages/Signin/Signin" });
        }
        resolve(res);
      },
      fail: reject,
    });
  });
}

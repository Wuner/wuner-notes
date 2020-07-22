const common = {
  BasicUse() {
    // Promise基本使用
    let promise = new Promise((resolve, reject) => {
      // resolve('成功');
      reject('失败');
    });

    promise.then(
      (res) => {
        console.log(res);
      },
      (e) => {
        console.log(e);
      },
    );
  },

  Ajax(url) {
    // promise方式Ajax使用
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('get', url);
      xhr.responseType = 'json';
      xhr.onload = function () {
        if (this.status === 200) {
          resolve(this.response);
        } else {
          reject(new Error(this.statusText));
        }
      };
      xhr.send();
    });
  },
};
module.exports = common;

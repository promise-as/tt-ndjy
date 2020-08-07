// 检测是否有输入  
function checkIsNotNull(content) {
  // 有输入返回true，没输入返回false
  return content && content != null;
}

// 姓名  
function checkName(name) {
  if (!checkIsNotNull(name)) {
    return false;
  }
  if (name.length < 2 || name.length > 8) {
    return false;
  }
  return true;
};
// 身份证
function checkIdNum(idNum) {
  if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idNum)) {
    return false;
  }
  if (!checkIsNotNull(idNum)) {
    return false;
  }
  return true;
};
// 手机号
function checkPhoneNum(phoneNum) {
  if (!checkIsNotNull(phoneNum)) {
    return false;
  }
  if (!/^1[345678]\d{9}$/.test(phoneNum)) {
    return false;
  }
  return true;
};
// 邮箱
function checkEmail(email) {
  if (!checkIsNotNull(email)) {
    return false;
  }
  if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)) {
    return false;
  }
  return true;
};
// qq
function checkQq(qq) {
  if (!checkIsNotNull(qq)) {
    return false;
  }
  if (!/^\d{5,10}$/.test(qq)) {
    return false;
  }
  return true;
};
// 
function checkWechat(wechat) {
  if (!checkIsNotNull(wechat)) {
    return false;
  }
  if (!/^[a-zA-Z0-9]{5,}$/.test(wechat)) {
    return false;
  }
  return true;
};

function idNum(idNum) {
  if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idNum)) {
    return false;
  }
  return true;
}

function phoneNum(phoneNum) {
  if (!/^1[34578]\d{9}$/.test(phoneNum)) {
    return false;
  }
  return true;
}

module.exports = {
  checkIsNotNull: checkIsNotNull,
  checkName: checkName,
  checkIdNum: checkIdNum,
  checkPhoneNum: checkPhoneNum,
  idNum: idNum,
  phoneNum: phoneNum,
  checkEmail: checkEmail,
  checkQq: checkQq,
  checkWechat: checkWechat
};
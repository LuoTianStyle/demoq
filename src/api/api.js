import axios from 'axios';
import {
  message
} from 'antd'
const path = 'api'
axios.interceptors.request.use(function (data) {
  if (localStorage.getItem('userData') !== '' && localStorage.getItem('userData')) {
    data.headers.common['token'] = JSON.parse(localStorage.getItem('userData')).token;
    // data.headers.common['token'] = 123456
  }
  return data
});
axios.interceptors.response.use(function (response) {
  if (response.data.code === 403) {
    localStorage.setItem('userData', '');
    localStorage.setItem('ddUserInfo', '');
    location.reload();
  } else if (response.data.code === 500) {
    message.error(response.data.msg)
    return Promise.reject(response.data.msg)
  }
  return response;
});
//文件夹列表
export const folderGetList = params => {
  return axios.post(`${path}/folder/getList`, params).then(res => res.data);
};
//添加文件夹
export const folderInsert = params => {
  return axios.post(`${path}/folder/insert`, params).then(res => res.data);
};
//编辑文件夹
export const folderEdit = params => {
  return axios.post(`${path}/folder/edit`, params).then(res => res.data);
};
//删除文件夹
export const folderDel = params => {
  return axios.post(`${path}/folder/del`, params).then(res => res.data);
};
//标签列表
export const tagGetList = params => {
  return axios.post(`${path}/tag/getList`, params).then(res => res.data);
};
//标签添加
export const tagInsert = params => {
  return axios.post(`${path}/tag/insert`, params).then(res => res.data);
};
//编辑标签
export const tagEdit = params => {
  return axios.post(`${path}/tag/edit`, params).then(res => res.data);
};
//删除标签
export const tagDel = params => {
  return axios.post(`${path}/tag/del`, params).then(res => res.data);
};
//上传预处理
export const uploadPreprocess = params => {
  return axios.post(`${path}/upload/preprocess`, params).then(res => res.data);
};
//上传
export const uploadSaveChunk = params => {
  return axios.post(`${path}/upload/saveChunk`, params).then(res => res.data);
};
//文件列表
export const fileGetList = params => {
  return axios.post(`${path}/file/getList`, params).then(res => res.data);
};
//根据标签获取文件列表
export const fileGetListByTag = params => {
  return axios.post(`${path}/file/getListByTag`, params).then(res => res.data);
};
//编辑标签
export const fileEidtTag = params => {
  return axios.post(`${path}/file/eidtTag`, params).then(res => res.data);
};
//添加文件
export const fileInsert = params => {
  return axios.post(`${path}/file/insert`, params).then(res => res.data);
};
//删除文件
export const fileDel = params => {
  return axios.post(`${path}/file/del`, params).then(res => res.data);
};
//删除文件
export const fileMove = params => {
  return axios.post(`${path}/file/move`, params).then(res => res.data);
};
//登录
export const userLogin = params => {
  return axios.post(`${path}/login/username`, params).then(res => res.data);
};
//修改密码
export const userEditPassword = params => {
  return axios.post(`${path}/user/editPassword`, params).then(res => res.data);
};
//修改密码
export const userLogout = params => {
  return axios.post(`${path}/user/logout`, params).then(res => res.data);
};
//获取分享信息
export const fileGetShareInfo = params => {
  return axios.get(`${path}/file/getShareInfo`, {
    params
  }).then(res => res.data);
};
//分享
export const fileShare = params => {
  return axios.post(`${path}/file/share`, params).then(res => res.data);
};
//修改密码
export const fileShareDownload = params => {
  return axios.get(`${path}/file/shareDownload`, {
    params
  }).then(res => res.data);
};
//订定获取签名参数
export const dingtalkGetConfigInfo = params => {
  return axios.get(`${path}/dingtalk/getConfigInfo`, {
    params
  }).then(res => res.data);
};
//订定获取签名参数
export const dingtalkGetUserInfo = params => {
  return axios.get(`${path}/dingtalk/getUserInfo`, {
    params
  }).then(res => res.data);
};
//下载文件
export const fileDownloadDD = params => {
  return axios.get(`${path}/file/download`, {
    params
  }).then(res => res.data);
};
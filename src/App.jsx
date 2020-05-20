/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import { HashRouter as Router, Route, Redirect, withRouter } from 'react-router-dom';
import routes from './router/router'
import UserLayout from './components/layout'
import './App.css'
import Login from './pages/login/login'
import { Spin } from 'antd'
import * as dd from "dingtalk-jsapi";
import { dingtalkGetConfigInfo, dingtalkGetUserInfo } from './api/api'

function App (props) {
  const { location, history, match } = props
  const [isLogin, setIsLogin] = useState(false)
  const [isDownload, setIsDownload] = useState(false)
  useEffect(() => {
    if (location.pathname.includes('download')) {
      return
    }
    if (location.pathname !== '/login') {
      if (!getToken()) {
        history.push('/login')
      }
    } else {
      setIsLogin(true)
    }
    if (dd.env.platform !== "notInDingTalk") {
      dingtalkGetConfigInfo({ currentUrl: window.location.href }).then(
        res => {
          const ddInfo = res.data
          dd.config({
            agentId: ddInfo.agentId, // 必填，微应用ID
            corpId: ddInfo.corpId,//必填，企业ID
            timeStamp: ddInfo.timeStamp, // 必填，生成签名的时间戳
            nonceStr: ddInfo.nonceStr, // 必填，生成签名的随机串
            signature: ddInfo.signature, // 必填，签名
            type: 0,   //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
            jsApiList: [
              'runtime.info',
              'biz.contact.choose',
              'device.notification.confirm',
              'device.notification.alert',
              'device.notification.prompt',
              'biz.ding.post',
              'biz.util.openLink',
              'biz.cspace.saveFile',
              'biz.cspace.preview',
              'biz.cspace.chooseSpaceDir',
              'biz.util.uploadAttachment'
            ]
          });
          dd.runtime.permission.requestAuthCode({
            corpId: ddInfo.corpId,
            onSuccess: function (result) {
              dingtalkGetUserInfo(result).then(res => {
                const ddUserInfo = { ...res, ...ddInfo }
                localStorage.setItem('ddUserInfo', JSON.stringify(ddUserInfo))
              })
            },
            onFail: function (err) { }

          })
        }
      )
    }
  }, [location])
  const getToken = () => {
    let userData = ''
    if (window.localStorage.getItem('userData') && JSON.parse(window.localStorage.getItem('userData')).token) {
      userData = JSON.parse(window.localStorage.getItem('userData'))
      return userData
    } else {
      return false
    }
  }
  return (
    <Router>
      <div>
        {!isLogin ? <UserLayout show={!location.pathname.includes('download')}>
          {routes.map(item => {
            return <Route Redirect='/' key={item.path} path={item.path} exact component={item.component}></Route>
          })}
        </UserLayout> :
          <Login />
        }
      </div>
    </Router>
  );
}


export default withRouter(App);
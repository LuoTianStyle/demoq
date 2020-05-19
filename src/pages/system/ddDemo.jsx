import * as dd from "dingtalk-jsapi";
import React, { useState, useEffect } from "react";
import { dingtalkGetConfigInfo, dingtalkGetUserInfo } from './../../api/api'
import { Button } from "antd";
function DDemo () {
  const [ddInfo, setddInfo] = useState({})
  const [ddCode, setddCode] = useState({})
  useEffect(() => {
    dingtalkGetConfigInfo({ currentUrl: window.location.href }).then(
      res => {
        setddInfo(res.data)
      }
    )


  }, [])
  useEffect(() => {
    if (JSON.stringify(ddInfo) !== '{}') {
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
        ] // 必填，需要使用的jsapi列表，注意：不要带dd。
      });
      dd.runtime.permission.requestAuthCode({
        corpId: ddInfo.corpId,
        onSuccess: function (result) {
          setddCode(result)
          /*{
              code: 'hYLK98jkf0m' //string authCode
          }*/
        },
        onFail: function (err) { }

      })

    }
  }, [ddInfo])
  return <div>
    <Button onClick={() => {
      dd.biz.cspace.preview({
        corpId: ddInfo.corpId,
        spaceId: "378786128",
        fileId: "17331649731",
        fileName: "088D26D0-C87C-4833-808C-749E80898F88.png",
        fileSize: 112622,
        fileType: "png",
        onSuccess: function () {

          //无，直接在native显示文件详细信息
        },
        onFail: function (err) {

          // 无，直接在native页面显示具体的错误
        }
      });

    }}>触发</Button>
  </div>;
}
export default DDemo;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Input, Button } from 'antd';
import { fileShareDownload } from './../../api/api'
import GLOBAL from '../../utils/utils';
function Download ({ match }) {
  const [password, setPassword] = useState('')
  const [loading, setloading] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [fileInfo, setfileInfo] = useState({})
  const submit = () => {
    setloading(false)
    const params = {
      shortId: match.params.shortId,
      password,
      fileInfo: true
    }
    fileShareDownload(params).then(res => {
      if (res.code === 0) {
        setfileInfo(res.data)
        setloading(false)
        setIsLogin(true)
      }
    })
  }
  const downloadFile = () => {
    window.open(`${GLOBAL.apiUrl}/file/shareDownload?shortId=${match.params.shortId}&password=${password}&fileInfo=false`)
  }
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#eeeeee' }}>
      {isLogin ? <div style={{
        width: 400, height: 400, boxShadow: '0 -25px 37.7px 11.3px rgba(8,143,220,0.07)'
      }}>
        <div style={{ margin: 40 }}>
          {fileInfo.name}
        </div>
        <div style={{ margin: 40 }}>
          文件大小:{Math.floor(fileInfo.size / 1024 / 1024 * 100) / 100}MB
        </div>
        <div style={{ margin: 40 }}>
          到期时间:{GLOBAL.toTime(fileInfo.expireTime * 1000)}
        </div>
        <div style={{ margin: 40 }}>
          <Button type='primary' style={{ float: 'right' }} onClick={() => { downloadFile() }}>下载</Button>
        </div>

      </div> : <div style={{
        padding: 30,
        width: 400, height: 400, boxShadow: '0 -25px 37.7px 11.3px rgba(8,143,220,0.07)'
      }}>
          <div style={{ width: '100%', padding: 60, height: '100%' }}>
            <h2 style={{ textAlign: 'center' }}>请输入访问密码</h2>
            <Input style={{ margin: '60px 0' }} value={password} onChange={(e) => {
              if (e.target.value.length > 5) {
                return
              } else {
                setPassword(e.target.value)
              }
            }} />
            <div style={{ display: 'flex', justifyContent: 'center' }}><Button loading={loading} onClick={() => {
              submit()
            }} type='primary'>进入</Button></div>
          </div>
        </div>}
    </div>
  );
}
export default withRouter(Download)
import React, { useState, } from 'react'
import { Layout, Spin } from 'antd';
import EditPassword from './editPassword'
import { Link } from 'react-router-dom'
import GlobalLoading from './globalContext'
const { Header, Content } = Layout;
function UserLayout (props) {
  const { children, show } = props
  const [editPasswordShow, setEditPasswordShow] = useState(false)
  const [globalLoading, setGlobalLoading] = useState(false)
  return (
    <GlobalLoading.Provider value={{ setGlobalLoading }}>
      <Spin spinning={globalLoading} >

        {show ? <Layout>
          <Header style={{ height: 64, background: '#fff', boxShadow: ' 0 1px 4px rgba(0,21,41,.08)' }}>
            <div style={{
              float: 'right',
              display: 'flex',
              justifyContent: 'space-around',
              width: 150
            }}>
              <Link to='/system'>设置</Link>
              <a onClick={() => { setEditPasswordShow(true) }}>修改密码</a>

              <a onClick={() => {
                window.localStorage.clear()
                window.location.reload();

              }}>退出</a>
            </div>
          </Header>
          <Content style={{ minHeight: 'calc(100vh - 64px)' }}>
            {children}
          </Content>
          <EditPassword
            show={editPasswordShow}
            setShow={setEditPasswordShow}
          />
        </Layout> : children}
      </Spin>
    </GlobalLoading.Provider >
  );
}
export default UserLayout
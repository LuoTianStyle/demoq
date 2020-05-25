import React from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { userLogin } from './../../api/api'
import styled from 'styled-components'
const LoginLayout = styled.div`
background: #ffffff;
    padding: 40px 40px;
    border-radius: 4px;
    box-shadow: 0 -25px 37.7px 11.3px rgba(8,143,220,0.07);

`
const MainLayout = styled.div`
background:#eeeeee;
height:100vh;
display: flex;
justify-content: center;
align-items: center;`
function Login (props) {
  const { history } = props
  const login = (res) => {

    const params = { username: res.username, password: res.password }
    userLogin(params).then(res => {
      if (res.code === 0) {
        const storage = window.localStorage;
        const token = res.data
        storage.setItem('userData', JSON.stringify(token))
        history.push('/')
        window.location.reload();
      }
    })

  }
  const [form] = Form.useForm()
  const submit = () => {
    form.validateFields().then(res => {
      login(res)
    }).catch()
  }
  return (
    <MainLayout>
      <LoginLayout>
        <h1 style={{ textAlign: 'center' }}>NOBOOK云合同</h1><span style={{ display: 'none' }}>123123123</span>
        <Form
          style={{ width: 400 }}
          name="normal_login"
          className="login-form"
          form={form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item >
            <Button
              onClick={() => { submit() }}
              style={{ margin: '0 auto', display: 'block' }}
              type="primary"
              htmlType="submit"
              className="login-form-button">
              登录
        </Button>

          </Form.Item>
        </Form>
      </LoginLayout>

    </MainLayout>
  );
}
export default withRouter(Login)
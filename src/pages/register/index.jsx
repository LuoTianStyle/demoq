import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { userRegister } from '../../api/api';
import styled from 'styled-components';
import './index.css';
const RegisterLayout = styled.div`
	background: #ffffff;
	padding: 40px 40px;
	border-radius: 20px;
	box-shadow: 0 25px 37.7px 11.3px rgba(8, 143, 220, 0.07);
`;
const MainLayout = styled.div`
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;
function Register(props) {
	const { history } = props;
	const login = res => {
		const params = { email: res.email, password: res.password };
		userRegister(params).then(res => {
			if (res.code === 0) {
				message.success('注册成功，请登录');
				history.push('/login');
			}
		});
	};
	const [form] = Form.useForm();
	const submit = () => {
		form.validateFields()
			.then(res => {
				login(res);
			})
			.catch();
	};
	return (
		<MainLayout className='loginBg'>
			<RegisterLayout>
				<h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
					云合同
				</h1>
				<span style={{ display: 'none' }}>123123123</span>
				<Form
					style={{ width: 400 }}
					name='normal_login'
					className='login-form'
					form={form}
				>
					<Form.Item
						name='email'
						rules={[{ required: true, message: '请输入邮箱' }]}
					>
						<Input
							prefix={
								<UserOutlined className='site-form-item-icon' />
							}
							placeholder='邮箱'
						/>
					</Form.Item>
					<Form.Item
						name='password'
						rules={[{ required: true, message: '请输入密码' }]}
					>
						<Input
							prefix={
								<LockOutlined className='site-form-item-icon' />
							}
							type='password'
							placeholder='密码'
						/>
					</Form.Item>
					<Form.Item>
						<Button
							onClick={() => {
								submit();
							}}
							style={{
								margin: '0 auto',
								display: 'block',
								width: '100%',
							}}
							type='primary'
							htmlType='submit'
							className='login-form-button'
						>
							注册
						</Button>
					</Form.Item>
				</Form>
        <div>已有账号？<Link to='/register'>登录</Link></div>
			</RegisterLayout>
		</MainLayout>
	);
}
export default withRouter(Register);

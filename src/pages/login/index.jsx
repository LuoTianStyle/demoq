import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { userLogin, isRegister } from '../../api/api';
import styled from 'styled-components';
import './index.css';
const MainLayout = styled.div`
	position: relative;
	background: rgba(246, 249, 253, 1);
	height: 100vh;
	width: 100vw;
	.ant-form-item-label > label.ant-form-item-required::before {
		display: none !important;
	}
	.bg-item {
		z-index: 1;
		position: absolute;
		background-repeat: no-repeat;
		&:nth-child(1) {
			top: 0;
			right: 0;
			width: 519px;
			height: 409px;
			background-size: 731px 629px;
			background-position: bottom left;
		}
		&:nth-child(2) {
			bottom: 0;
			right: 0;
			width: 468px;
			height: 289px;
			background-size: 390px 386px;
			background-position: top left;
		}
		&:nth-child(3) {
			bottom: 0;
			left: 0;
			width: 560px;
			height: 325px;
			background-size: 731px 546px;
			background-position: top right;
		}
		&:nth-child(4) {
			top: 0;
			left: 0;
			width: 560px;
			height: 325px;
			background-size: 265px 263px;
			background-position: bottom right;
		}
	}
`;
const LoginLayout = styled.div`
	z-index: 2;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	box-shadow: 0px 15px 50px 0px rgba(16, 12, 61, 0.1);
	border-radius: 12px;
	height: 500px;
	.login-form {
		width: 400px;
		height: 500px;
		background: rgb(255, 255, 255);
		border-radius: 12px 0px 0px 12px;
		padding: 74px 0 0 48px;
		box-sizing: border-box;
		.title {
			font-size: 24px;
			font-weight: 500;
			color: rgb(51, 51, 51);
			line-height: 33px;
			margin-bottom: 24px;
		}
		.account-login {
			font-size: 16px;
			font-weight: 400;
			color: rgb(51, 51, 51);
			line-height: 22px;
			margin-bottom: 11px;
		}
		.login-line {
			position: relative;
			width: calc(100% - 48px);
			height: 2px;
			background: rgb(230, 230, 230);
			border-radius: 2px;
			margin-bottom: 25px;
			.login-line-active {
				position: absolute;
				top: -1px;
				left: 1px;
				width: 48px;
				height: 4px;
				background: #409eff;
				border-radius: 2px;
			}
		}
		.ant-input-affix-wrapper {
			width: calc(100% - 48px);
			height: 44px;
			line-height: 34px;
		}
	}
	input {
		background: #fff !important;
	}
	.login-bg {
		width: 480px;
		height: 500px;
		background-size: 480px 500px;
		background-repeat: no-repeat;
	}
	.point-item {
		position: absolute;
		background: linear-gradient(150deg, #66b1ff 0%, #409eff 100%);
		border-radius: 100%;
		&:nth-child(1) {
			top: 22px;
			left: -31px;
			width: 38px;
			height: 38px;
		}
		&:nth-child(2) {
			bottom: -26px;
			left: 318px;
			width: 33px;
			height: 33px;
		}
		&:nth-child(3) {
			top: -104px;
			right: 0;
			width: 63px;
			height: 63px;
			background: #66b1ff;
		}
	}
`;
function Login(props) {
	const { history } = props;
	const [allow, setAllow] = useState(true);
	const login = res => {
		const params = { username: res.username, password: res.password };
		userLogin(params).then(res => {
			if (res.code === 0) {
				const storage = window.localStorage;
				const data = res.data;
				storage.setItem('userData', JSON.stringify(data));
				setTimeout(() => {
					history.push('/');
					window.location.reload();
				}, 300);
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
	useEffect(() => {
		isRegister().then(res => {
			if (res.code === 0) {
				const allow = res.data.register === 1 ? true : false;
				setAllow(allow);
			}
		});
	}, []);

	return (
		<MainLayout>
			<div className='bg-item' />
			<div className='bg-item' />
			<div className='bg-item' />
			<div className='bg-item' />
			<LoginLayout className="login-box">
				<div className='point-item' />
				<div className='point-item' />
				<div className='point-item' />
				<Form
					layout='vertical'
					style={{ width: 400 }}
					name='normal_login'
					className='login-form'
					form={form}
				>
					<div className='title'>云盘</div>
					<div className='account-login'>登录</div>
					<div className='login-line'>
						<div className='login-line-active'></div>
					</div>
					<Form.Item
						label='用户名'
						name='username'
						rules={[{ required: true, message: '请输入用户名' }]}
					>
						<Input
							prefix={
								<UserOutlined className='site-form-item-icon' />
							}
							placeholder='请输入用户名'
						/>
					</Form.Item>
					<Form.Item
						label='密码'
						name='password'
						rules={[{ required: true, message: '请输入密码' }]}
					>
						<Input
							prefix={
								<LockOutlined className='site-form-item-icon' />
							}
							type='password'
							placeholder='请输入密码'
						/>
					</Form.Item>
					<Form.Item>
						<Button
							onClick={() => {
								submit();
							}}
							style={{
								display: 'block',
								width: '128px',
								height: '44px',
								borderRadius: '8px',
								fontSize: '20px',
							}}
							type='primary'
							htmlType='submit'
							className='login-form-button'
						>
							登录
						</Button>
					</Form.Item>
					{allow ? (
						<div>
							没有账号？<Link to='/register'>注册账号</Link>
						</div>
					) : null}
				</Form>
				<div className='login-bg' />
			</LoginLayout>
		</MainLayout>
	);
}
export default withRouter(Login);

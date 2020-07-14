/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import {
	HashRouter as Router,
	Route,
	Redirect,
	withRouter,
} from 'react-router-dom';
import routes from './router/router';
import UserLayout from './components/layout';
import './App.css';
import Login from './pages/login/login';
import Register from './pages/register';
import { Spin } from 'antd';

function App(props) {
	const { location, history, match } = props;
	const [isLogin, setIsLogin] = useState(false);
	const [isDownload, setIsDownload] = useState(false);
	useEffect(() => {
		if (location.pathname.includes('download')) {
			return;
		}
		if (
			location.pathname !== '/login' &&
			location.pathname !== '/register'
		) {
			if (!getToken()) {
				history.push('/login');
			}
		} else {
			setIsLogin(true);
		}
	}, [location]);
	const getToken = () => {
		let userData = '';
		if (
			window.localStorage.getItem('userData') &&
			JSON.parse(window.localStorage.getItem('userData')).token
		) {
			userData = JSON.parse(window.localStorage.getItem('userData'));
			return userData;
		} else {
			return false;
		}
	};
	return (
		<Router>
			<div>
				{!isLogin ? (
					<UserLayout show={!location.pathname.includes('download')}>
						{routes.map(item => {
							return (
								<Route
									Redirect='/'
									key={item.path}
									path={item.path}
									exact
									component={item.component}
								></Route>
							);
						})}
					</UserLayout>
				) : location.pathname === '/register' ?(<Register />):(
					<Login />
				)}
			</div>
		</Router>
	);
}

export default withRouter(App);

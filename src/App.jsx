/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, withRouter } from 'react-router-dom';
import routes from './router/router';
import UserLayout from './components/layout';
import './App.css';
import Login from './pages/login';
import Register from './pages/register/index';

function App(props) {
	const { location, history } = props;
	const [isLogin, setIsLogin] = useState(false);
	const getToken = () => {
		const userData = window.localStorage.getItem('userData');
		if (userData && JSON.parse(userData).token) {
			return JSON.parse(userData);
		} else {
			return false;
		}
	};
	useEffect(() => {
		const path = location.pathname;
		if (path.includes('download')) {
			return;
		}
		if (path !== '/login' && path !== '/register') {
			const userData = getToken();
			if (!userData) {
				history.push('/login');
			}
		} else {
			setIsLogin(true);
		}
	}, [location]);
	const component = () => {
		if (location.pathname === '/register') {
			return <Register />;
		} else if (location.pathname === '/login') {
			return <Login />;
		} else if (!isLogin) {
			return (
				<UserLayout show={!location.pathname.includes('download')}>
					{routes.map(item => {
						return (
							<Route
								Redirect='/'
								key={item.path}
								path={item.path}
								exact
								component={item.component}
							/>
						);
					})}
				</UserLayout>
			);
		} else {
			return <Login />;
		}
	};
	return <Router>{component()}</Router>;
}

export default withRouter(App);

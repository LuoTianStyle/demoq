import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import EditPassword from './editPassword';
import { Link } from 'react-router-dom';
import GlobalPC from './globalContext';
const { Header, Content } = Layout;
function UserLayout(props) {
	const { children, show } = props;
	const [editPasswordShow, setEditPasswordShow] = useState(false);
	const [pc, setPc] = useState(false);
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 1080) {
				setPc(true);
			} else {
				setPc(false);
			}
		};
		handleResize();
		document.addEventListener('resize', handleResize);
		return () => {
			document.removeEventListener('resize', handleResize);
		};
	}, []);
	return (
		<GlobalPC.Provider value={{ pc }}>
			{show ? (
				<Layout>
					<Header
						style={{
							height: pc ? 64 : 40,
							lineHeight: pc ? '64px' : '40px',
							margin: pc ? 0 : '10px 10px 0 10px',
							background: '#fff',
							boxShadow: ' 0 1px 4px rgba(0,21,41,.08)',
							padding: pc ? '0 50px' : '0 10px',
						}}
					>
						<div
							style={{
								float: 'right',
								display: 'flex',
								justifyContent: 'space-around',
								width: pc ? 150 : 50,
							}}
						>
							{pc ? (
								<>
									<Link to='/system'>设置</Link>
									<a
										onClick={() => {
											setEditPasswordShow(true);
										}}
									>
										修改密码
									</a>
								</>
							) : null}
							<a
								onClick={() => {
									window.localStorage.clear();
									window.location.reload();
								}}
							>
								退出
							</a>
						</div>
					</Header>
					<Content
						style={{
							minHeight: pc
								? 'calc(100vh - 64px)'
								: 'calc(100vh - 40px)',
						}}
					>
						{children}
					</Content>
					<EditPassword
						show={editPasswordShow}
						setShow={setEditPasswordShow}
					/>
				</Layout>
			) : (
				children
			)}
		</GlobalPC.Provider>
	);
}
export default UserLayout;

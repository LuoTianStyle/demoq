/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Modal, Switch, Select, Radio, InputNumber, message, Spin } from 'antd';
import styled from 'styled-components';
import { fileGetShareInfo, fileShare, fileDelShare } from '../../api/api';
import { CopyOutlined } from '@ant-design/icons';
import GLOBAL from '../../utils/utils';
import copy from 'copy-to-clipboard';
const Box = styled.div`
	width: 100%;
`;
const Item = styled.div`
	width: 100%;
	display: flex;
`;
const Left = styled.div`
	width: 60%;
  padding: 6px 10px;
  text-align: left;
`;
const Right = styled.div`
	width: 40%;
  padding: 6px 10px;
  text-align: right;
`;
function ShareModal(props) {
	const { fetchSearchData, type, show, setShow, record } = props;
	const [fileInfo, setFileInfo] = useState({
		isShare: false,
		uuid: '',
		password: '',
		termStatus: 1,
		length: 1,
	});
	const [loading, setLoading] = useState(false);
	const [spinning, setspinning] = useState(false);
	useEffect(() => {
		if (show) {
			setspinning(true);
			fileGetShareInfo({ uuid: record.uuid })
				.then(res => {
					if (res.code === 0) {
						if (res.data === null) {
							setFileInfo({
								...fileInfo,
								isShare: false,
								uuid: record.uuid,
								password: GLOBAL.createHash(5),
								termStatus: 1,
								length: 7,
								isCustom: false,
								shortId: record.shortId,
							});
						} else {
							setFileInfo({
								...fileInfo,
								isShare: true,
								uuid: res.data.uuid,
								password: res.data.password,
								termStatus: res.data.termStatus,
								length: res.data.length,
								isCustom: true,
								shortId: record.shortId,
							});
						}
						setspinning(false);
					}
				})
				.catch(() => {
					setShow(false);
					setspinning(false);
				});
		}
	}, [show]);
	const submit = () => {
		if (fileInfo.isShare) {
			setLoading(true);
			const params = {
				uuid: fileInfo.uuid,
				password: fileInfo.password,
				termStatus: fileInfo.termStatus,
				length: fileInfo.length,
				shortId: fileInfo.shortId,
			};
			fileShare(params)
				.then(res => {
					if (res.code === 0) {
						message.success('分享成功');
						setLoading(false);
						setShow(false);
					}
				})
				.catch(() => {
					setLoading(false);
				});
		} else {
			setLoading(true);
			fileDelShare({ uuid: fileInfo.uuid })
				.then(res => {
					if (res.code === 0) {
						message.success('取消成功');
						setLoading(false);
						setShow(false);
					}
				})
				.catch(() => {
					setLoading(false);
				});
		}
	};

	const copyUrl = () => {
		if (copy(`${GLOBAL.url}#/download/${fileInfo.shortId}`)) {
			message.success('复制成功');
		}
	};
	return (
		<Modal
			confirmLoading={loading}
			destroyOnClose
			onOk={submit}
			visible={show}
			onCancel={() => {
				setShow(false);
			}}
			title={
				<div>
					<span
						style={{
							display: 'inline-block',
							lineHeight: '22px',
							position: 'relative',
							top: '2px',
							marginRight: '10px',
						}}
					>
						分享
					</span>
					<Switch
						onChange={e => {
							setFileInfo({ ...fileInfo, isShare: e });
						}}
						checked={fileInfo.isShare}
					/>
				</div>
			}
		>
			<Spin spinning={spinning}>
				<Box>
					<Item style={{ background: '#ccc' }}>
						<Left>链接</Left>
						<Right>密码</Right>
					</Item>
					<Item>
						<Left style={{width: "75%"}}>
							{GLOBAL.url}#/download/{fileInfo.shortId}
							<CopyOutlined
								onClick={copyUrl}
								style={{ cursor: 'pointer', margin: '0 5px' }}
							/>
						</Left>
						<Right style={{width: "25%"}}>
							{fileInfo.password}
						</Right>
					</Item>
					<Item style={{ background: '#ccc' }}>
						<Left style={{width: "35%"}}>有效期</Left>
						<Right style={{width: "65%"}}>
							<Radio.Group
								onChange={e => {
									setFileInfo({
										...fileInfo,
										termStatus: e.target.value,
									});
								}}
								value={fileInfo.termStatus}
							>
								<Radio value={2}>永久</Radio>
								<Radio value={1}>限时</Radio>
							</Radio.Group>
						</Right>
					</Item>

					{fileInfo.termStatus === 1 ? (
						<Select
							value={
								fileInfo.isCustom ? 'custom' : fileInfo.length
							}
							style={{ width: '100%', marginTop: 10 }}
							onChange={e => {
								if (e === 'custom') {
									setFileInfo({
										...fileInfo,
										isCustom: true,
										length: 1,
									});
								} else {
									setFileInfo({
										...fileInfo,
										isCustom: false,
										length: e,
									});
								}
							}}
						>
							<Select.Option value={7}>7天</Select.Option>
							<Select.Option value={15}>15天</Select.Option>
							<Select.Option value={30}>30天</Select.Option>
							<Select.Option value={'custom'}>
								自定义
							</Select.Option>
						</Select>
					) : null}
					{fileInfo.isCustom && fileInfo.termStatus === 1 ? (
						<InputNumber
							max={10000}
							min={1}
							value={fileInfo.length}
							style={{ width: '100%', marginTop: 10 }}
							onChange={e => {
								setFileInfo({ ...fileInfo, length: e });
							}}
						/>
					) : null}
				</Box>
			</Spin>
		</Modal>
	);
}
export default ShareModal;

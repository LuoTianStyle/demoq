/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Control from './control';
import BreadPath from './../../components/BreadPath';
import TableDropDown from './tableDropDown';
import { Table, Tag } from 'antd';
import { fileGetList } from './../../api/api';
import {
	FolderTwoTone,
	FileExcelTwoTone,
	UnorderedListOutlined,
} from '@ant-design/icons';
import GLOBAL from '../../utils/utils';
import DocContext from './context';
import NewDir from './../../components/newDir';
import GlobalPC from './../../components/globalContext';
import { useContext } from 'react';
const NameStyle = styled.span`
	cursor: pointer;
`;
const Tables = styled(Table)`
	thead {
		display: ${props =>
			props.pc ? 'table-header-group' : 'none'} !important;
	}
	.ant-table-cell {
		padding: ${props => (props.pc ? '16px' : '8px 15px')} !important;
	}
`;
function Index() {
	const [dataSource, setdataSource] = useState([]);
	const [currentPath, setCurrentPath] = useState({
		folderId: 0,
		name: '云盘',
	});
	const [breadPath, setBreadPath] = useState([]);
	const [pageData, setPageData] = useState({
		total: 0,
		page: 1,
		perPage: 10,
		currentPage: 1,
	});
	const [loading, setLoding] = useState(false);
	const [dirShow, setDirShow] = useState(false);
	const [selectedRows, setSelectedRows] = useState([]);
	const pc = useContext(GlobalPC).pc;
	useEffect(() => {
		enterDir(currentPath);
	}, []);

	//进入文件夹
	const enterDir = (path, page = 1, perPage = 10) => {
		const searchParam = [
			{
				searchColumn: 'parentId',
				searchOperator: '=',
				searchValue: path.folderId,
			},
		];
		if (page) {
			setPageData({ ...pageData, page });
		}
		if (perPage) {
			setPageData({ ...pageData, perPage });
		}
		const params = {
			searchParam,
			page: page ? page : pageData.page,
			perPage: perPage ? perPage : pageData.perPage,
		};
		const oldPath = Array.from(breadPath);
		const currentPathIdx = oldPath.findIndex(
			item => item.folderId === path.folderId
		);
		if (currentPathIdx >= 0) {
			oldPath.splice(
				currentPathIdx + 1,
				oldPath.length - currentPathIdx + 1
			);
		} else {
			oldPath.push({ folderId: path.folderId, name: path.name });
		}
		setCurrentPath({ folderId: path.folderId, name: path.name });
		setBreadPath(oldPath);
		console.log(dataSource);
		console.log(pageData);

		fetchData(params);
	};
	//翻页
	const pageDown = (page, perPage) => {
		const searchParam = [
			{
				searchColumn: 'parentId',
				searchOperator: '=',
				searchValue: currentPath.folderId,
			},
		];
		const params = {
			searchParam,
			page: page,
			perPage: perPage,
		};
		fetchData(params);
	};
	const fetchData = params => {
		setLoding(true);
		fileGetList(params)
			.then(res => {
				if (res.code === 0) {
					setPageData({
						...pageData,
						total: res.data.total,
						currentPage: res.data.current_page,
						page: params.page,
						perPage: params.perPage,
					});
					setdataSource(res.data.data);
					setSelectedRows([]);
					setLoding(false);
				}
			})
			.catch(() => {
				setLoding(false);
			});
	};
	const downloadFile = record => {
		window.open(
			`${GLOBAL.apiUrl}/file/download?uuid=${record.uuid}&token=${
				JSON.parse(localStorage.getItem('userData')).token
			}`
		);
	};
	const columns = [
		{
			title: '名称',
			dataIndex: 'name',
			render: (e, record) => {
				if (record.folder === 2) {
					return (
						<NameStyle
							onClick={() => {
								enterDir(
									{ folderId: record.id, name: e },
									1,
									10
								);
							}}
						>
							<FolderTwoTone
								style={{ marginRight: 5, fontSize: 18 }}
							/>
							{e}
						</NameStyle>
					);
				} else {
					return (
						<NameStyle
							onClick={() => {
								downloadFile(record);
							}}
						>
							<FileExcelTwoTone
								style={{ marginRight: 5, fontSize: 18 }}
								twoToneColor='#E9967A'
							/>
							{e}
						</NameStyle>
					);
				}
			},
		},
		{
			title: '添加时间',
			dataIndex: 'createAt',
			render: e => <span>{GLOBAL.toTime(e * 1000, 1)}</span>,
		},
		{
			title: '标签',
			dataIndex: 'tags',
			show: pc,
			render: e => (
				<div style={{ maxWidth: 300, lineHeight: '30px' }}>
					{e.map(item => (
						<Tag key={item.id} color='blue'>
							{item.name}
						</Tag>
					))}
				</div>
			),
		},
		{
			title: '操作',
			dataIndex: 'action',
			render: (_, record) => {
				return (
					<NameStyle>
						<TableDropDown
							record={record}
							downloadFile={downloadFile}
						>
							<UnorderedListOutlined />
						</TableDropDown>
					</NameStyle>
				);
			},
		},
	];
	const columnsPhone = [
		{
			title: '',
			dataIndex: 'name',
			render: (e, record) => {
				if (record.folder === 2) {
					return (
						<NameStyle
							onClick={() => {
								enterDir(
									{ folderId: record.id, name: e },
									1,
									10
								);
							}}
						>
							<FolderTwoTone
								style={{
									fontSize: 18,
									position: 'relative',
									top: '2px',
								}}
							/>
						</NameStyle>
					);
				} else {
					return (
						<NameStyle>
							<FileExcelTwoTone
								style={{
									fontSize: 18,
									position: 'relative',
									top: '2px',
								}}
								twoToneColor='#E9967A'
							/>
						</NameStyle>
					);
				}
			},
		},
		{
			title: '',
			dataIndex: 'createAt',
			render: (_, record) => (
				<div>
					<div>{record.name}</div>
					<div>{GLOBAL.toTime(record.createAt * 1000, 1)}</div>
				</div>
			),
		},
		{
			title: '操作',
			dataIndex: 'action',
			render: (_, record) => {
				return (
					<NameStyle>
						<TableDropDown
							pc={pc}
							record={record}
							downloadFile={downloadFile}
						>
							<UnorderedListOutlined />
						</TableDropDown>
					</NameStyle>
				);
			},
		},
	];
	return (
		<DocContext.Provider
			value={{ breadPath, enterDir, currentPath, pageData }}
		>
			<div style={{ position: 'relative' }}>
				{pc ? (
					<Control
						fetchData={() => {
							enterDir(
								currentPath,
								pageData.page,
								pageData.perPage
							);
						}}
						currentPath={currentPath}
						setDirShow={setDirShow}
						selectedRows={selectedRows}
						setSelectedRows={setSelectedRows}
					/>
				) : null}
				<div
					style={{
						margin: pc ? '0px 10px' : '10px',
						padding: pc ? '20px' : '10px 20px',
						background: '#fff',
						zIndex: 3,
					}}
				>
					<BreadPath breadPath={breadPath} enterDir={enterDir} />
				</div>
				<div
					style={{
						display: pc ? 'none' : 'block',
						height: '1px',
						width: 'calc(100vw - 20px)',
						background: '#f0f0f0',
						position: 'absolute',
						zIndex: 2,
						left: '10px',
						top: '42px',
					}}
				/>
				<Tables
					pc={pc}
					loading={loading}
					style={
						pc
							? { margin: '0 10px' }
							: { margin: '10px 10px 0 10px' }
					}
					rowKey='id'
					columns={pc ? columns : columnsPhone}
					dataSource={dataSource}
					rowSelection={
						pc
							? {
									type: 'checkbox',
									onChange: selectedIds => {
										setSelectedRows(selectedIds);
									},
									selectedRowKeys: selectedRows,
							  }
							: null
					}
					pagination={{
						showSizeChanger: true,
						total: pageData.total,
						onChange: (page, perPage) => {
							setPageData({ ...pageData, page, perPage });
							pageDown(page, perPage);
						},
						showTotal: (total, range) =>
							`统计:${total}个,这是第${range[0]}-${range[1]}个`,
						onShowSizeChange: (current, size) => {
							setPageData({
								...pageData,
								currentPage: current,
								perPage: size,
							});
							pageDown(current, size);
						},
						current: pageData.currentPage,
					}}
				/>
				<NewDir
					show={dirShow}
					setShow={setDirShow}
					parentId={currentPath.folderId}
					fetchData={() => {
						enterDir(currentPath);
					}}
				/>
			</div>
		</DocContext.Provider>
	);
}
export default Index;

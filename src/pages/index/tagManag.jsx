import React, { useState, useEffect, useContext } from 'react';
import { Modal, Select, message, Spin } from 'antd';
import { tagGetList, fileEidtTag } from './../../api/api';
import DocContext from './context';
function TagManage(props) {
	const { show, setShow, record, type, fetchSearchData } = props;
	const [loading, setLoading] = useState(false);
	const [selectLoading, setSelectLoading] = useState(false);
	const [tagList, settagList] = useState([]);
	const [initValue, setInitValue] = useState([]);
	const docContext = useContext(DocContext);
	useEffect(() => {
		if (show) {
			setSelectLoading(true);
			tagGetList()
				.then(res => {
					if (res.code === 0) {
						setSelectLoading(false);
						settagList(res.data);
						const tagIds = record.tags.map(item => item.id);
						setInitValue(tagIds);
					}
				})
				.catch(() => {
					setSelectLoading(false);
				});
		}
	}, [show, record, setSelectLoading, setInitValue, settagList]);
	const submit = () => {
		setLoading(true);
		const params = { tagIds: initValue, id: record.id };
		fileEidtTag(params)
			.then(res => {
				message.success('修改成功');
				setLoading(false);
				if (type === 'search') {
					fetchSearchData();
				} else {
					const {
						breadPath,
						enterDir,
						currentPath,
						pageData,
					} = docContext;
					enterDir(currentPath, pageData.page, pageData.perPage);
				}
				setShow(false);
			})
			.catch(() => {
				setLoading(false);
			});
	};
	const handleChange = e => {
		setInitValue(e);
	};
	return (
		<div>
			<Modal
				maskClosable={false}
				confirmLoading={loading}
				destroyOnClose={true}
				visible={show}
				title='标签管理'
				onOk={submit}
				onCancel={() => {
					setShow(false);
				}}
			>
				<Spin spinning={selectLoading}>
					<Select
						mode='multiple'
						style={{ width: '100%' }}
						placeholder='请选择标签'
						onChange={handleChange}
						value={initValue}
					>
						{tagList.map(item => (
							<Select.Option value={item.id} key={item.id}>
								{item.name}
							</Select.Option>
						))}
					</Select>
				</Spin>
			</Modal>
		</div>
	);
}
export default TagManage;

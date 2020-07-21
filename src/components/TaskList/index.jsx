/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components';
import { Collapse } from 'antd';
import List from './List';
import Header from './Header';

const { Panel } = Collapse;

const TASK_PANE_ID = 'TASK_PANE';
const Box = styled.div`
	@media only screen and (max-width: 1024px) {
		.test-wrapper {
			width: ${props => (props.taskPaneCollapsed ? '90vw' : '160px')} !important;
		}
	}
`;
const TaskWrapper = styled.div`
	transition: 0.2s;
	position: fixed;
	z-index: 10;
	right: ${props => (props.taskPaneCollapsed ? '-5px' : '-120px')};
	bottom: 20px;
	width: ${props => (props.taskPaneCollapsed ? '500px' : '160px')};
	background: #fff;
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
	.ant-collapse {
		border-radius: 0;
	}
	.ant-collapse > .ant-collapse-item:last-child,
	.ant-collapse > .ant-collapse-item:last-child > .ant-collapse-header {
		border-radius: 0;
	}
	.ant-collapse-content > .ant-collapse-content-box {
		padding: 0;
	}
`;

const TaskPane = props => {
	const {
		taskData,
		taskPaneCollapsed,
		setTaskPaneCollapsed,
		pauseItem,
		retryItem,
		deleteItem,
	} = props;
	const activeKey = taskPaneCollapsed ? [TASK_PANE_ID] : [];
	return (
		<Box taskPaneCollapsed={taskPaneCollapsed}>
			<TaskWrapper
				className='test-wrapper'
				taskPaneCollapsed={taskPaneCollapsed}
			>
				<Collapse
					expandIconPosition={'left'}
					onChange={e => {
						if (e.length > 0) {
							setTaskPaneCollapsed(true);
						} else {
							setTaskPaneCollapsed(false);
						}
					}}
					activeKey={activeKey}
				>
					<Panel
						header={<Header show={taskPaneCollapsed} />}
						key={TASK_PANE_ID}
					>
						<List
							deleteItem={deleteItem}
							pauseItem={pauseItem}
							retryItem={retryItem}
							data={taskData.filter(
								item => item.status !== 'delete'
							)}
						/>
					</Panel>
				</Collapse>
			</TaskWrapper>
		</Box>
	);
};

export default TaskPane;

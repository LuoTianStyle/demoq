/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Collapse } from 'antd';
import List from './List';
import Header from './Header';
import { useState } from 'react';

const { Panel } = Collapse;

const TASK_PANE_ID = 'TASK_PANE';
const TaskWrapper = styled.div`
transition:.2s;
  position: fixed;
  z-index: 10;
  right: -120px;
  bottom: 20px;
  width: 500px;
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
  const { taskData, taskPaneCollapsed, setTaskPaneCollapsed, pauseItem, retryItem, deleteItem } = props;
  const activeKey = taskPaneCollapsed ? [TASK_PANE_ID] : [];
  const [show, setShow] = useState(false)
  useEffect(() => {
    const dv = document.getElementById('dv')
    dv.addEventListener('mouseover', (e) => {
      setShow(true)
      dv.style.right = 20 + 'px'
    })
    dv.addEventListener('mouseleave', (e) => {
      setShow(false)
      if (!show) {
        dv.style.right = -120 + 'px'
      }
    })
  }, [])
  useEffect(() => {
    if (taskPaneCollapsed) {

      const dv = document.getElementById('dv')
      dv.style.right = '20px'
      dv.addEventListener('mouseleave', (e) => {
        dv.style.right = '20px'
      })
    } else {
      const dv = document.getElementById('dv')
      dv.addEventListener('mouseleave', (e) => {
        dv.style.right = '-120px'
      })
    }
  }, [taskPaneCollapsed])
  return (
    <TaskWrapper id='dv' style={taskPaneCollapsed ? { width: 500 } : { width: 160 }}>
      <Collapse
        expandIconPosition={'left'}
        onChange={(e) => {
          if (e.length > 0) {
            setTaskPaneCollapsed(true)
          } else {
            setTaskPaneCollapsed(false)
          }
        }} activeKey={activeKey}>
        <Panel header={<Header
          show={taskPaneCollapsed || show}
        />} key={TASK_PANE_ID}>
          <List
            deleteItem={deleteItem}
            pauseItem={pauseItem}
            retryItem={retryItem}
            data={taskData.filter(item => item.status !== 'delete')}

          />
        </Panel>
      </Collapse>
    </TaskWrapper>
  );
};

export default TaskPane

import React, { useState, useEffect } from 'react'
import { Button, Progress, Tabs, Empty } from 'antd'
import styled from 'styled-components'
const ListItem = styled.div`
height:100px;
width:100%;
padding:10px;
box-shadow: rgba(0, 21, 41, 0.08) 0px 1px 4px;
`
function NbList (props) {
  const { data, pauseItem, retryItem, deleteItem } = props

  return (
    <Tabs defaultActiveKey='1' style={{ padding: '0 20px 20px 20px' }}>
      <Tabs.TabPane key='1' tab='上传中' style={data.filter(i => i.status !== 'success').length > 0 ? {
        maxHeight: 300,
        overflowY: 'scroll'
      } : {}}>
        {data.filter(i => i.status !== 'success').length > 0 ?
          data.filter(i => i.status !== 'success').map(item => (<ListItem key={item.hash} >
            <div style={{ height: '50%', }}>
              <div style={{
                float: 'left',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', width: '70%',
                overflow: 'hidden'
              }}>
                {(() => {
                  switch (item.status) {
                    case 'success':
                      return '上传'
                    case 'failed':
                      return '失败'
                    case 'pause':
                      return '暂停'
                    case 'ready':
                      return '上传'
                    default:
                      return '上传'
                  }
                })()}:
            {item.file.name}
              </div>
              <div style={{ float: 'right' }}>
                {Math.floor(item.file.size / 1024 / 1024 * 0.01 * item.percent * 100) / 100}MB/{Math.floor(item.file.size / 1024 / 1024 * 100) / 100}MB
          </div>
            </div>
            <div style={{ height: '50%' }}>
              <div><Progress style={{ width: '65%', marginRight: 18 }} percent={Math.floor(item.percent * 100) / 100} status={(() => {
                if (item.status === 'success' && item.percent === 100) {
                  return 'success'
                }
                switch (item.status) {
                  case 'ready':
                    return 'active'
                  case 'pause':
                    return 'normal'
                  case 'failed':
                    return 'exception'
                  default:
                    return 'normal'
                }
              })()} />
                {(() => {
                  switch (item.status) {
                    case 'ready':
                      return <span>
                        <Button size='small' style={{ marginRight: 5 }} onClick={() => { pauseItem(item.hash) }}>暂停</Button>
                        <Button danger size='small' onClick={() => { deleteItem(item.hash) }}>取消</Button>
                      </span>
                    case 'pause':
                      return <span>
                        <Button size='small' style={{ marginRight: 5 }} loading={item.loading} onClick={() => { retryItem(item.hash) }}>开始</Button>
                        <Button danger size='small' onClick={() => { deleteItem(item.hash) }}>取消</Button>
                      </span>
                    case 'failed':
                      return <Button danger size='small' style={{ width: '25%' }} onClick={() => { retryItem(item.hash) }}>重试</Button>
                    case 'success':
                      return <Button danger size='small' style={{ width: '25%' }} onClick={() => { deleteItem(item.hash) }}>删除</Button>
                    default:
                      return
                  }
                })()}
              </div>
            </div>
          </ListItem>))

          : <div style={{ padding: 20 }}><Empty /></div>}

      </Tabs.TabPane>
      <Tabs.TabPane key='2' tab='已完成' style={data.filter(i => i.status === 'success').length > 0 ? {
        maxHeight: 300,
        overflowY: 'scroll'
      } : {}}>
        {data.filter(i => i.status === 'success').length > 0 ?
          data.filter(i => i.status === 'success').map(item => (<ListItem key={item.hash} >
            <div style={{ height: '50%', }}>
              <div style={{
                float: 'left',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', width: '70%',
                overflow: 'hidden'
              }}>
                {(() => {
                  switch (item.status) {
                    case 'success':
                      return '上传'
                    case 'failed':
                      return '失败'
                    case 'pause':
                      return '暂停'
                    case 'ready':
                      return '上传'
                    default:
                      return '上传'
                  }
                })()}:
            {item.file.name}
              </div>
              <div style={{ float: 'right' }}>
                {Math.floor(item.file.size / 1024 / 1024 * 0.01 * item.percent * 100) / 100}MB/{Math.floor(item.file.size / 1024 / 1024 * 100) / 100}MB
          </div>
            </div>
            <div style={{ height: '50%' }}>
              <div><Progress style={{ width: '65%', marginRight: 18 }} percent={Math.floor(item.percent * 100) / 100} status={(() => {
                if (item.status === 'success' && item.percent === 100) {
                  return 'success'
                }
                switch (item.status) {
                  case 'ready':
                    return 'active'
                  case 'pause':
                    return 'normal'
                  case 'failed':
                    return 'exception'
                  default:
                    return 'normal'
                }
              })()} />
                {(() => {
                  switch (item.status) {
                    case 'ready':
                      return <span>
                        <Button size='small' style={{ marginRight: 5 }} onClick={() => { pauseItem(item.hash) }}>暂停</Button>
                        <Button danger size='small' onClick={() => { deleteItem(item.hash) }}>取消</Button>
                      </span>
                    case 'pause':
                      return <span>
                        <Button size='small' style={{ marginRight: 5 }} onClick={() => { retryItem(item.hash) }}>开始</Button>
                        <Button danger size='small' onClick={() => { deleteItem(item.hash) }}>取消</Button>
                      </span>
                    case 'failed':
                      return <Button danger size='small' style={{ width: '25%' }} onClick={() => { retryItem(item.hash) }}>重试</Button>
                    case 'success':
                      return <Button danger size='small' style={{ width: '25%' }} onClick={() => { deleteItem(item.hash) }}>删除</Button>
                    default:
                      return
                  }
                })()}
              </div>
            </div>
          </ListItem>))

          : <div style={{ padding: 20 }}><Empty /></div>}

      </Tabs.TabPane>





    </Tabs >
  );
}
export default NbList
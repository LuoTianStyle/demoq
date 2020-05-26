import React, { useState, useEffect } from 'react'
import { Breadcrumb } from 'antd'
import styled from 'styled-components'
const BreadItem = styled.span`
cursor:pointer;
&:hover{
  text-decoration: underline;
}
`
function BreadPath (props) {
  const { breadPath, enterDir } = props
  return (
    <div>
      <Breadcrumb>
        {breadPath.map(item => (
          <Breadcrumb.Item key={item.folderId} onClick={() => {
            enterDir({ folderId: item.folderId, name: item.name }, 1, 10)
          }}>
            <BreadItem style={{ color: '#1890ff' }}> {item.name}</BreadItem>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
}
export default BreadPath
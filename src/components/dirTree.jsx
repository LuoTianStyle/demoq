/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { Tree, Spin, message } from 'antd';

const { TreeNode } = Tree;
function DirTree (props) {
  const { setActiveId, treeData, loading, activeId, expandedKeys, setExpandedKeys } = props
  const onSelect = (selectedKeys, info) => {
    setActiveId(selectedKeys[0])
  };
  // const onExpand = expandedKeys => {
  //   setExpandedKeys(expandedKeys);
  // };
  return (
    <div>
      <Spin
        spinning={loading}
      >
        {loading ? null : <Tree
          onExpand={(e) => { console.log(e); setExpandedKeys(e) }}
          showIcon
          expandedKeys={expandedKeys}
          selectedKeys={[activeId]}
          onSelect={onSelect}
          treeData={treeData}
        />
        }
      </Spin>
    </div>
  );
}
export default DirTree;

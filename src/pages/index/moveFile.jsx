/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Modal, Button, message } from 'antd'
import NewDir from './../../components/newDir'
import DirTree from './../../components/dirTree'
import { folderGetList, fileMove } from './../../api/api'
import { FolderTwoTone } from '@ant-design/icons';
import GLOBAL from './../../utils/utils'
import DocContext from './context';

function MoveFile (props) {
  const { record, show, setShow, type, fetchSearchData, selectedRows } = props
  const [newDirShow, setNewDirShow] = useState(false)
  const [activeId, setActiveId] = useState('0')
  const [treeData, settreeData] = useState([{ title: '云盘', icon: <FolderTwoTone />, key: '0', children: [] }])
  const [treeLoading, setTreeLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState([])
  const docContext = useContext(DocContext)
  const handleData = useCallback((ary) => {
    const newAry = ary.map(item => {
      const obj = {
        icon: <FolderTwoTone />,
        title: item.name,
        key: item.id + '',
        children: item.children.length > 0 ? handleData(item.children) : []
      }
      return obj
    })
    return newAry
  })
  const fetchData = (id) => {
    setTreeLoading(true)
    folderGetList().then(res => {
      const currentData = Array.from(treeData)
      currentData[0].children = handleData(res.data)
      settreeData(currentData)
      if (id && !expandedKeys.includes(id)) {
        setActiveId(id)
        setExpandedKeys(GLOBAL.getParentPath(currentData, id, 'key'))
      }
      setTreeLoading(false)
    }).catch(() => {
      setTreeLoading(false)
    })
  }
  useEffect(() => {
    if (show) {
      fetchData()
    }
  }, [show])
  useEffect(() => {
    console.log(treeData);
  }, [treeData])
  const submit = () => {
    const params = { ids: record ? [record.id] : selectedRows, parentId: activeId }
    const parentPath = GLOBAL.getParentPath(treeData, params.parentId, 'key').map(item => parseInt(item))
    if (GLOBAL.checkAryHasSameItem(parentPath, params.ids)) {
      message.error('不能将文件或文件夹移动到本身的子目录下')
      return
    }
    setLoading(true)
    fileMove(params).then(() => {
      if (type === 'search') {
        fetchSearchData()
      } else {
        const { enterDir, currentPath } = docContext
        enterDir(currentPath)
      }
      message.success('移动成功')
      setLoading(false)
      setShow(false)

    }).catch(() => {
      setLoading(false)
    })
  }
  return (
    <div>
      <Modal
        destroyOnClose
        confirmLoading={loading}
        title='移动'
        visible={show}
        onCancel={() => { setShow(false) }}
        onOk={submit}
      >
        <DirTree
          treeData={treeData}
          loading={treeLoading}
          setActiveId={setActiveId}
          activeId={activeId}
          expandedKeys={expandedKeys}
          setExpandedKeys={setExpandedKeys}
        />
        <div style={{ position: 'absolute', left: '16px', bottom: '11px' }}>
          <Button
            onClick={() => {
              setNewDirShow(true);
            }}
          >
            新建文件夹
          </Button>
        </div>
        <NewDir
          fetchData={fetchData}
          parentId={activeId}
          show={newDirShow}
          setShow={setNewDirShow}
        />
      </Modal>
    </div>
  );
}
export default MoveFile
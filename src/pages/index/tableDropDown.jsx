import React, { useState, useEffect, useContext } from 'react'
import { Menu, Dropdown, Modal, message, Tag } from 'antd'
import ReName from './reName'
import MoveFile from './moveFile'
import TagManag from './tagManag'
import { folderDel, fileDel, fileDownloadDD } from './../../api/api'
import DocContext from './context';
import * as dd from "dingtalk-jsapi";
import ShareModal from './shareModal'
import GLOBAL from './../../utils/utils'
function TableDropDown (props) {
  const { children, record, type } = props
  const [reNameShow, setReNameShow] = useState(false)
  const [tagShow, setTagShow] = useState(false)
  const [moveShow, setMoveShow] = useState(false)
  const [shareShow, setShareShow] = useState(false)
  const docContext = useContext(DocContext)
  const delItem = (id) => {
    Modal.confirm({
      title: '删除',
      content: '您确定要删除该文件？',
      onOk: () => {
        if (record.folder === 1) {
          fileDel({ id }).then(res => {
            if (res.code === 0) {
              message.success('删除成功')
              if (type === 'search') {
                props.fetchData()
              } else {
                const { breadPath, enterDir, currentPath } = docContext
                enterDir(currentPath)
              }
            }

          }).catch()
        } else if (record.folder === 2) {
          folderDel({ id }).then(res => {
            if (res.code === 0) {
              message.success('删除成功')
              if (type === 'search') {
                props.fetchData()
              } else {
                const { breadPath, enterDir, currentPath } = docContext
                enterDir(currentPath)
              }
            }
          }).catch()
        } else {
          return
        }
      }
    })
  }
  const downloadFile = () => {
    if (record.processInstanceId) {
      if (dd.env.platform === "notInDingTalk") {
        message.warn('请在钉钉中打开')
      } else {
        if (!localStorage.getItem('ddUserInfo')) {
          localStorage.setItem('userData', '');
          localStorage.setItem('ddUserInfo', '');
          location.reload();
        }
        fileDownloadDD({
          uuid: record.uuid,
          dingtalkUserId: JSON.parse(localStorage.getItem('ddUserInfo')).userid
        }).then(res => {
          const { spaceId,
            fileId,
            fileName,
            fileSize,
            fileType, } = res.data
          dd.biz.cspace.preview({
            corpId: JSON.parse(localStorage.getItem('ddUserInfo')).corpId,
            spaceId,
            fileId,
            fileName,
            fileSize,
            fileType,
            onSuccess: function () {

              //无，直接在native显示文件详细信息
            },
            onFail: function (err) {
              message.error('网络错误请求失败')
              // 无，直接在native页面显示具体的错误
            }
          });
        })
        /*
        钉钉下载
        */
      }
    } else {
      window.open(`${GLOBAL.apiUrl}/file/download?uuid=${record.uuid}&token=${JSON.parse(localStorage.getItem('userData')).token}`)
    }

  }
  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => { setReNameShow(true) }}>
        重命名
      </Menu.Item>
      {record.folder === 1 ?
        <Menu.Item onClick={() => { downloadFile() }} key="1">
          下载
    </Menu.Item>
        : null}
      <Menu.Item onClick={() => { setTagShow(true) }} key="2">
        标签
      </Menu.Item>
      {record.folder === 1 && !record.processInstanceId ?
        <Menu.Item key="5" onClick={() => { setShareShow(true) }}>
          分享
            </Menu.Item>
        : null}

      <Menu.Item onClick={() => { setMoveShow(true) }} key="3">
        移动
      </Menu.Item>
      <Menu.Item key="4" onClick={() => { delItem(record.id) }}>
        删除
      </Menu.Item>
    </Menu>
  );
  return (
    <div>
      <Dropdown overlay={menu} trigger={['click']}>
        {children}
      </Dropdown>
      <ReName
        fetchSearchData={props.fetchData}
        type={type}
        record={record}
        show={reNameShow}
        setShow={setReNameShow}
      />
      <TagManag
        fetchSearchData={props.fetchData}
        type={type}
        record={record}
        show={tagShow}
        setShow={setTagShow}
      />
      <MoveFile
        fetchSearchData={props.fetchData}
        type={type}
        show={moveShow}
        setShow={setMoveShow}
        record={record}
      />
      <ShareModal
        fetchSearchData={props.fetchData}
        type={type}
        show={shareShow}
        setShow={setShareShow}
        record={record}
      />
    </div>
  );
}
export default TableDropDown
import { Upload, Button, message } from 'antd'
import { uploadPreprocess, uploadSaveChunk, fileInsert } from './../api/api'
import CryptoJs from 'crypto-js';
import React from 'react'
import TaskList from './TaskList/index'
import GLOBAL from '../utils/utils';
class NbUpload extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props)
  }
  state = {
    chunkIndex: 0,
    taskPaneCollapsed: false,
    uploadQueue: []
  }
  uploadProps = {
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      debugger
      const hash = GLOBAL.createHash(32)
      const params = {
        resource_name: file.name,
        resource_size: file.size,
        resource_hash: hash
      }
      uploadPreprocess(params).then(res => {
        if (res.code === 0) {
          const preprocessTask = {
            ...res.data,//chunkSize: 每块大小 groupSubDir: 块文件夹  resourceExt:类型  resourceTempBaseName:资源名 savedPath: 保存地址
            status: 'ready', // ready:准备上传 pause:暂停 failed:失败 success:成功
            chunk_index: 0,//当前传输块
            file,//文件
            chunk_total: Math.ceil(file.size / res.data.chunkSize),
            hash,
            chunkCount: Math.ceil(file.size / res.data.chunkSize),
            percent: 0,
            currentPath: this.props.currentPath
          }
          this.setState({ uploadQueue: [...this.state.uploadQueue, preprocessTask] }, () => {
            this.setState({ taskPaneCollapsed: true })
            this.uploadChunk(hash)
          })
        }
        return false
      }).catch(() => {
        return false
      })
      return false
    },
  };
  uploadChunk = (hash) => {
    const currentMask = this.state.uploadQueue.find(item => item.hash === hash)
    const start = currentMask.chunk_index * currentMask.chunkSize
    const end = Math.min(currentMask.file.size, start + currentMask.chunkSize)
    const formData = new FormData();
    formData.append('resource_chunk', currentMask.file.slice(start, end));
    formData.append('resource_ext', currentMask.resourceExt);
    formData.append('chunk_total', currentMask.chunkCount);
    formData.append('chunk_index', currentMask.chunk_index + 1);
    formData.append('resource_temp_basename', currentMask.resourceTempBaseName);
    formData.append('group_subdir', currentMask.groupSubDir);
    formData.append('resource_hash', currentMask.hash);
    uploadSaveChunk(formData).then(res => {
      if (res.code === 0) {
        if (res.data.savedPath === '') {
          const newMask = currentMask
          newMask.percent = ((newMask.chunk_index + 1) / newMask.chunk_total) * 99
          newMask.chunk_index += 1
          const newUploadQueue = [...this.state.uploadQueue]
          const currentIndex = newUploadQueue.findIndex(item => item.hash === hash)
          newUploadQueue[currentIndex] = newMask
          this.setState({ uploadQueue: newUploadQueue }, () => {
            switch (newMask.status) {
              case 'pause':
                return
              case 'cancel':
                return
              case 'success':
                return
              case 'ready':
                this.uploadChunk(newMask.hash)
                break
              default:
                break
            }

          })
        } else {
          const newMask = currentMask
          newMask.percent = ((newMask.chunk_index + 1) / newMask.chunk_total) * 99
          const newUploadQueue = [...this.state.uploadQueue]
          const currentIndex = newUploadQueue.findIndex(item => item.hash === hash)
          newUploadQueue[currentIndex] = newMask
          this.setState({ uploadQueue: newUploadQueue }, () => {
            const params = { name: newMask.file.name, url: res.data.savedPath, folder: 1, parentId: newMask.currentPath.folderId, size: newMask.file.size }
            fileInsert(params).then(res => {
              if (res.code === 0) {
                newMask.percent = 100
                newMask.status = 'success'
                message.success('上传成功')
                const newUploadQueue1 = [...this.state.uploadQueue]
                const currentIndex1 = newUploadQueue1.findIndex(item => item.hash === hash)
                newUploadQueue1[currentIndex1] = newMask
                this.setState({ uploadQueue: newUploadQueue1 }, () => {
                  this.props.fetchData()
                })
              }
            }).catch(() => {
            })
          })
        }
      }
    }).catch((e) => {
      const newMask = this.state.uploadQueue.find(item => item.hash === hash)
      newMask.status = 'failed'
      const newUploadQueue = [...this.state.uploadQueue]
      const currentIndex = newUploadQueue.findIndex(item => item.hash === hash)
      newUploadQueue[currentIndex] = newMask
      this.setState({ uploadQueue: newUploadQueue })
    })
  };
  pauseItem = (hash) => {
    const newMask = this.state.uploadQueue.find(item => item.hash === hash)
    newMask.status = 'pause'
    const newUploadQueue = [...this.state.uploadQueue]
    const currentIndex = newUploadQueue.findIndex(item => item.hash === hash)
    newUploadQueue[currentIndex] = newMask
    this.setState({ uploadQueue: newUploadQueue })
  }
  retryItem = (hash) => {
    const newMask = this.state.uploadQueue.find(item => item.hash === hash)
    if (newMask.chunk_index === (newMask.chunk_total - 1)) {
      message.success('文件上传成功 无法暂停')
      return
    }
    newMask.status = 'ready'
    const newUploadQueue = [...this.state.uploadQueue]
    const currentIndex = newUploadQueue.findIndex(item => item.hash === hash)
    newUploadQueue[currentIndex] = newMask
    this.setState({ uploadQueue: newUploadQueue }, () => {
      this.uploadChunk(hash)
    })
  }
  deleteItem = (hash) => {
    const newMask = this.state.uploadQueue.find(item => item.hash === hash)
    newMask.status = 'delete'
    const newUploadQueue = [...this.state.uploadQueue]
    const currentIndex = newUploadQueue.findIndex(item => item.hash === hash)
    newUploadQueue[currentIndex] = newMask
    this.setState({ uploadQueue: newUploadQueue })
  }
  render () {
    return (
      <span>
        <Upload
          {...this.uploadProps}
          accept='.doc,.docx,.dotx,.xlsx,.xltx,.potx,.ppsx,.pptx,.ppt,.sldx,.xlsm,.xlxb,.txt,.pdf,.jpg,.jpeg,.jpe,.png,.bmp,.psd,.mp3,.wmv,.mp4,.avi,.wmv,.zip,.rar'

        >
          <Button style={this.props.style}>
            {this.props.children}
          </Button>
        </Upload>
        <TaskList
          deleteItem={this.deleteItem}
          pauseItem={this.pauseItem}
          retryItem={this.retryItem}
          taskData={this.state.uploadQueue}
          taskPaneCollapsed={this.state.taskPaneCollapsed}
          setTaskPaneCollapsed={(e) => {
            this.setState({ taskPaneCollapsed: e })
          }}
        />
      </span >

    )
  }
}

export default NbUpload
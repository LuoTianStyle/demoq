import React, { useEffect, useState } from "react";
import { Button, Table, Modal, message } from "antd";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { tagGetList, tagDel } from "./../../api/api";
import AddTag from "./addTag";
import EditTag from "./editTag";
const ControlLayout = styled.div`
  padding: 20px;
  margin: 10px;
  background: #fff;
`;
function System (props) {
  const { history } = props;
  const [addShow, setAddShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [dataSource, setdataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  useEffect(() => {
    fetch();
  }, []);
  const fetch = () => {
    setLoading(true);
    tagGetList()
      .then((res) => {
        if (res.code === 0) {
          setdataSource(res.data);
          setLoading(false);
        }
      })
      .catch((res) => {
        setLoading(false);
      });
  };

  const deleteTag = (id) => {
    Modal.confirm({
      title: "删除",
      content: "删除后无法找回您确定要删除吗",
      okText: "删除",
      cancelText: "取消",
      okType: "danger",
      onOk: () => {
        tagDel({ id })
          .then((res) => {
            if (res.code === 0) {
              message.success("删除成功");
              fetch();
            }
          })
          .catch();
      },
    });
  };
  const columns = [
    { title: "名称", dataIndex: "name", width: "80%" },
    {
      title: "操作",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <span>
            <Button
              style={{ marginRight: 5 }}
              type="primary"
              danger
              onClick={() => {
                setInfo(record);
                setEditShow(true);
              }}
            >
              修改
            </Button>
            <Button
              type="primary"
              onClick={() => {
                deleteTag(record.id);
              }}
              danger
            >
              删除
            </Button>
          </span>
        );
      },
    },
  ];
  return (
    <div>
      <ControlLayout>
        <Button
          onClick={() => {
            history.push("/");
          }}
          style={{ margin: 5 }}
        >
          返回云盘
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setAddShow(true);
          }}
        >
          添加标签
        </Button>
      </ControlLayout>
      <Table
        loading={loading}
        style={{ margin: '0 10px' }}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showTotal: (total, range) =>
            `统计:${total}个,这是第${range[0]}-${range[1]}个`,
        }}
      />
      <AddTag fetch={fetch} show={addShow} setShow={setAddShow} />
      <EditTag
        record={info}
        fetch={fetch}
        show={editShow}
        setShow={setEditShow}
      />
    </div>
  );
}
export default withRouter(System);

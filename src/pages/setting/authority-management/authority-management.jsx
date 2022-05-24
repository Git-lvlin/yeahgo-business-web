import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Spin } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
// import { PlusOutlined } from '@ant-design/icons';
import * as api from '@/services/setting/authority-management';
import NewRule from './new-rule';
import Edit from './edit';
import { arrayToTree } from '@/utils/utils'

const TableList = () => {
  const [newRuleVisible, setNewRuleVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectRule, setSelectRule] = useState({});
  const [treeData, setTreeData] = useState([])
  const [menuTree, setMenuTree] = useState([])
  const [pageTree, setPageTree] = useState([])
  const [loading, setLoading] = useState(false);

  const getPageTree = (data) => {
    const arr = [];
    data.forEach(item => {
      if (item.ruleType !== 3) {
        arr.push({
          ...item,
          selectable: item.ruleType === 2,
          value: item.id
        })
      }
    })
    return arrayToTree(arr)
  }

  const getMenuTree = (data) => {
    const arr = [];
    data.forEach(item => {
      if (item.ruleType === 1) {
        arr.push({
          ...item,
          value: item.id
        })
      }
    })
    return arrayToTree(arr)
  }

  const getRuleList = () => {
    setLoading(true);
    api.ruleList()
      .then(res => {
        if (res.code === 0) {
          setTreeData(arrayToTree(res.data.records))
          setMenuTree(getMenuTree(res.data.records))
          setPageTree(getPageTree(res.data.records))
        }
      })
      .finally(() => {
        setLoading(false);
      })

  }

  const removeRule = (id) => {
    api.ruleDel({ id }, { showSuccess: true })
      .then(res => {
        if (res.code === 0) {
          getRuleList();
        }
      })
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'title',
    },
    {
      title: '路径',
      dataIndex: 'url',
    },
    {
      title: '权限编码',
      dataIndex: 'id',
    },
    {
      title: '类型',
      dataIndex: 'ruleType',
      render(item) {
        switch (item) {
          case 1:
            return '菜单';
          case 2:
            return '页面';
          case 3:
            return '按钮';
          default:
            return '菜单';
        }
      },
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <>
            <a
              onClick={() => {
                setSelectRule(record)
                setEditVisible(true);
              }}
            >
              编辑
            </a>
            &nbsp;&nbsp;
            <a onClick={() => { removeRule(record.id) }}>删除</a>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getRuleList();
  }, [])

  return (
    <PageContainer>
      <Card>
        <Button
          type="primary"
          onClick={() => { setNewRuleVisible(true) }}
          style={{ marginBottom: 20 }}
        >
          新建权限
        </Button>
        <Spin spinning={loading}>
          <Table
            dataSource={treeData}
            rowKey="id"
            columns={columns}
            bordered={false}
            scroll={{ x: 'max-content' }}
            pagination={false}
          />
        </Spin>
      </Card>
      {newRuleVisible && <NewRule
        visible={newRuleVisible}
        setVisible={setNewRuleVisible}
        callback={() => { getRuleList() }}
        menuTree={menuTree}
        pageTree={pageTree}
      />}
      {editVisible && <Edit
        visible={editVisible}
        setVisible={setEditVisible}
        callback={() => { getRuleList() }}
        menuTree={menuTree}
        pageTree={pageTree}
        data={selectRule}
      />}
    </PageContainer>

  );
};

export default TableList;

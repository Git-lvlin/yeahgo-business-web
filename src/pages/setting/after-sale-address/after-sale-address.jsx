import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { addressList, addressDetail, addressSetDefault, addressSwitch } from '@/services/setting/after-sale-address'
import { useParams } from 'umi';
import Edit from './edit';

const TableList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const actionRef = useRef();

  const getDetail = (id) => {
    addressDetail({
      id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res?.data?.records);
        setFormVisible(true);
      }
    })
  }

  const addressSetDefaultRequest = (id) => {
    addressSetDefault({
      id
    }).then(res => {
      if (res.code === 0) {
        actionRef.current.reload();
      }
    })
  }

  const addressSwitchRequest = (id) => {
    addressSwitch({
      id
    }).then(res => {
      if (res.code === 0) {
        actionRef.current.reload();
      }
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '售后联系人',
      dataIndex: 'contactName',
      valueType: 'text',
    },
    {
      title: '售后联系方式',
      dataIndex: 'contactPhone',
      valueType: 'text',
    },
    {
      title: '售后地址',
      dataIndex: 'address',
      valueType: 'text',
    },
    {
      title: '默认售后地址',
      dataIndex: 'isDefault',
      valueType: 'text',
      valueEnum: {
        1: '是',
        0: '否'
      }
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      valueType: 'text',
      valueEnum: {
        1: '启用',
        0: '禁用'
      }
    },
    {
      title: '操作',
      dataIndex: 'brandName',
      valueType: 'options',
      render: (_, data) => {
        return (
          <Space>
            {data.status === 1 && <a onClick={() => { addressSwitchRequest(data.id) }}>禁用</a>}
            {data.status === 2 && <a onClick={() => { addressSwitchRequest(data.id) }}>开启</a>}
            {data.isDefault === 0 && <a onClick={() => { addressSetDefaultRequest(data.id) }}>设为默认</a>}
            <a onClick={() => { getDetail(data.id) }}>编辑</a>
          </Space>
        )
      }
    },
  ];

  return (
    <PageContainer>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button key="out" type="primary" icon={<PlusOutlined />} onClick={() => { setFormVisible(true) }}>新建</Button>
        </div>
      </Card>
      <ProTable
        options={false}
        params={{
          supplierId: useParams()?.id
        }}
        request={addressList}
        search={false}
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
      />
      <Edit
        visible={formVisible}
        setVisible={setFormVisible}
        supplierId={useParams()?.id}
        detailData={detailData}
        callback={() => { actionRef.current.reload(); setDetailData(null) }}
        onClose={() => { setDetailData(null) }}
      />
    </PageContainer>
  );
};

export default TableList;

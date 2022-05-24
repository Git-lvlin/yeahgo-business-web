import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { postageList, postageDetail } from '@/services/product-management/freight-template';
import SelectSupplierModal from '@/components/select-supplier-modal'
import Form from './form';
import OldForm from './old-form';

const TableList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [oldFormVisible, setOldFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [selectSupplierVisible, setSelectSupplierVisible] = useState(false);
  const [selectSupplier, setSelectSupplier] = useState(null);
  const supplierType = window.localStorage.getItem('supplierType');

  const actionRef = useRef();
  const getDetail = (id, options = {}) => {
    postageDetail({
      id,
    }).then(res => {
      if (res.code === 0) {
        setDetailData({
          ...res.data.records,
          view: options.view
        });
        if (options.newFlag === 0) {
          setOldFormVisible(true);
        } else {
          setFormVisible(true);
        }
      }
    })
  }
  const columns = [
    {
      title: '模板名称',
      dataIndex: 'expressName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入模板名称'
      }
    },
    // {
    //   title: '是否指定区域',
    //   dataIndex: 'isHasArea',
    //   onFilter: true,
    //   valueType: 'select',
    //   // hideInTable: true,
    //   valueEnum: {
    //     0: {
    //       text: '否'
    //     },
    //     1: {
    //       text: '是',
    //     },
    //   },
    // },
    {
      title: '是否有指定地区不配送',
      dataIndex: 'isHasNotArea',
      onFilter: true,
      valueType: 'select',
      // hideInTable: true,
      valueEnum: {
        0: {
          text: '否'
        },
        1: {
          text: '是',
        },
      },
    },
    {
      title: '是否有指定条件包邮',
      dataIndex: 'isHasFree',
      valueType: 'select',
      // hideInTable: true,
      // hideInSearch: true,
      onFilter: true,
      valueEnum: {
        0: {
          text: '否'
        },
        1: {
          text: '是',
        },
      },
    },
    {
      title: '应用商品',
      dataIndex: 'goodsNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          {record.newFlag === 1 && <a onClick={() => { getDetail(record.id) }}>编辑</a>}
          <a onClick={() => { getDetail(record.id, { newFlag: record.newFlag, view: true }) }}>详情</a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            key="out"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              if (supplierType === '1') {
                setFormVisible(true)
              } else {
                setSelectSupplierVisible(true);
              }
            }}
          >
            新建
          </Button>
        </div>
      </Card>
      <ProTable
        rowKey="id"
        options={false}
        request={postageList}
        search={{
          defaultCollapsed: false,
          labelWidth: 150,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        columns={columns}
        actionRef={actionRef}
        pagination={{
          pageSize: 10,
        }}
      />
      {formVisible && <Form
        visible={formVisible}
        setVisible={setFormVisible}
        onClose={() => { setFormVisible(false); setDetailData(null) }}
        detailData={detailData}
        callback={() => { setFormVisible(false); setDetailData(null); actionRef.current.reload() }}
        supplierId={selectSupplier?.supplierId}
      />}
      {oldFormVisible && <OldForm
        visible={oldFormVisible}
        setVisible={setOldFormVisible}
        onClose={() => { setOldFormVisible(false); setDetailData(null) }}
        detailData={detailData}
        callback={() => { setOldFormVisible(false); setDetailData(null); actionRef.current.reload() }}
        supplierId={selectSupplier?.supplierId}
      />}
      {
        selectSupplierVisible
        &&
        <SelectSupplierModal
          visible={selectSupplierVisible}
          setVisible={setSelectSupplierVisible}
          callback={(v) => {
            if (v) {
              setSelectSupplier(v);
              setFormVisible(true);
            }
          }}
        />
      }
    </PageContainer>
  );
};

export default TableList;

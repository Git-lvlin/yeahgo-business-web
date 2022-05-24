import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Tooltip, Space, Spin } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { draftList, getDetail, draftSku, draftDel } from '@/services/product-management/drafts-list';
import Edit from '@/components/product-edit';
import { history } from 'umi';
import { amountTransform } from '@/utils/utils'
import { QuestionCircleOutlined } from '@ant-design/icons'

const SubTable = (props) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const columns = [
    { title: '图片', dataIndex: 'imageUrl', render: (text) => <img src={text} width={50} height={50} /> },
    { title: '规格', dataIndex: 'skuSpecDisplay' },
    { title: '零售供货价', dataIndex: 'retailSupplyPrice', render: (_) => _ > 0 ? amountTransform(_, '/') : '-' },
    { title: '批发供货价', dataIndex: 'wholesaleSupplyPrice', render: (_) => _ > 0 ? amountTransform(_, '/') : '-' },
    { title: '可用库存', dataIndex: 'stockNum' },
  ];

  useEffect(() => {
    setLoading(true);
    draftSku({
      draftId: props.data.id
    }).then(res => {
      setData(res?.data)
    }).finally(() => {
      setLoading(false);
    })
  }, [])

  return (
    <Spin spinning={loading}>
      <Table rowKey="id" columns={columns} dataSource={data} pagination={false} />
    </Spin>
  )
};

const TableList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const actionRef = useRef();
  const formRef = useRef();

  const requestDetail = (id) => {
    getDetail({
      draftId: id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data.records);
        setFormVisible(true);
      }
    })
  }

  const requestDraftDel = (id) => {
    draftDel({
      draftId: id
    }, { showSuccess: true }).then(res => {
      if (res.code === 0) {
        actionRef.current.reload();
      }
    })
  }

  const columns = [
    {
      title: '图片',
      dataIndex: 'goodsImageUrl',
      render: (text) => <img src={text === '-' ? 'https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/admin/img-default.png' : text} width={50} height={50} />,
      hideInSearch: true,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品名称'
      }
    },
    {
      title: '供货类型',
      dataIndex: 'goodsSaleType',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => {
        return {
          0: '批发+零售',
          1: '仅批发',
          2: '仅零售'
        }[_]
      }
    },
    {
      title: '批发样品',
      dataIndex: 'isSample',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => _ === 1 ? '支持' : '不支持'
    },
    {
      title: '零售供货价(元)',
      dataIndex: 'retailSupplyPriceRange',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        const { minRetailSupplyPrice, maxRetailSupplyPrice, goodsSaleType } = data;

        if (goodsSaleType === 1) {
          return '-'
        }

        if (minRetailSupplyPrice === maxRetailSupplyPrice) {
          return amountTransform(minRetailSupplyPrice, '/');
        }

        return `${amountTransform(minRetailSupplyPrice, '/')}~${amountTransform(maxRetailSupplyPrice, '/')}`
      }
    },
    {
      title: '批发供货价(元)',
      dataIndex: 'wholesaleSupplyPriceRange',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        const { minWholesaleSupplyPrice, maxWholesaleSupplyPrice, goodsSaleType } = data;

        if (goodsSaleType === 2) {
          return '-'
        }

        if (minWholesaleSupplyPrice === maxWholesaleSupplyPrice) {
          return amountTransform(minWholesaleSupplyPrice, '/');
        }

        return `${amountTransform(minWholesaleSupplyPrice, '/')}~${amountTransform(maxWholesaleSupplyPrice, '/')}`
      }
    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return (
          <Space>
            <a onClick={() => { requestDetail(record.id) }}>编辑</a>
            <a onClick={() => { requestDraftDel(record.id) }}>删除</a>
          </Space>
        )
      },
    },
  ];

  // useEffect(() => {
  //   api.getConfig()
  //     .then(res => {
  //       console.log('商品固定配置', res)
  //       setConfig(res?.data || [])
  //     })
  // }, [])

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        options={false}
        actionRef={actionRef}
        formRef={formRef}
        request={draftList}
        expandable={{ expandedRowRender: (_) => <SubTable data={_} /> }}
        search={{
          defaultCollapsed: false,
          optionRender: ({ searchText, resetText }, { form }) => [
            <Button
              key="search"
              type="primary"
              onClick={() => {
                form?.submit();
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="rest"
              onClick={() => {
                form?.resetFields();
              }}
            >
              {resetText}
            </Button>,
          ],
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />
      {formVisible && <Edit
        visible={formVisible}
        setVisible={setFormVisible}
        detailData={detailData}
        callback={() => { actionRef.current.reload(); setDetailData(null) }}
        onClose={() => { setDetailData(null) }}
      />}
    </PageContainer>
  );
};

export default TableList;

import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Tooltip, Space, Spin } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { rejectProductList } from '@/services/product-management/reject-product';
import { productList, getDetail } from '@/services/product-management/product-list';
import Edit from '@/components/product-edit';
import { history } from 'umi';
import { amountTransform } from '@/utils/utils'
import { QuestionCircleOutlined } from '@ant-design/icons'
import ProductDetailDrawer from '@/components/product-detail-drawer'


const SubTable = (props) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const columns = [
    { title: 'skuID', dataIndex: 'skuId' },
    { title: '规格', dataIndex: 'skuNameDisplay' },
    { title: '零售供货价', dataIndex: 'retailSupplyPrice', render: (_) => _ > 0 ? amountTransform(_, '/') : '-' },
    { title: '批发供货价', dataIndex: 'wholesaleSupplyPrice', render: (_) => _ > 0 ? amountTransform(_, '/') : '-' },
    { title: '批发起购量', dataIndex: 'wholesaleMinNum' },
    { title: '可用库存', dataIndex: 'stockNum' },
    // { title: '活动库存', dataIndex: 'activityStockNum' },
  ];

  useEffect(() => {
    setLoading(true);
    productList({
      selectType: 2,
      spuId: props.data.spuId
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
  const [productDetailDrawerVisible, setProductDetailDrawerVisible] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
  const actionRef = useRef();
  const formRef = useRef();

  const requestDetail = (id) => {
    getDetail({
      spuId: id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data.records);
        setFormVisible(true);
      }
    })
  }

  const columns = [
    {
      title: 'spuID',
      dataIndex: 'spuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品SPU',
        maxLength: 12,
      }
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品SKU',
        maxLength: 12,
      },
      hideInTable: true,
    },
    {
      title: '图片',
      dataIndex: 'goodsImageUrl',
      render: (text) => <img src={text} width={50} height={50} />,
      hideInSearch: true,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品名称'
      },
      hideInTable: true,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return <a onClick={() => { setSelectItem(record); setProductDetailDrawerVisible(true); }}>{_}</a>
      }
    },
    {
      title: '生鲜类型',
      dataIndex: 'fresh',
      valueType: 'text',
      hideInTable: true,
      valueEnum: {
        0: '非生鲜',
        1: '精装生鲜',
        2: '散装生鲜',
      }
    },
    {
      title: '生鲜类型',
      dataIndex: 'fresh',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => ({
        0: '非生鲜',
        1: '精装生鲜',
        2: '散装生鲜',
      }[_]),
    },
    {
      title: '供货类型',
      dataIndex: 'goodsSaleTypeDisplay',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '批发样品',
      dataIndex: 'isSample',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => _ === 1 ? '支持' : '不支持'
    },
    {
      title: '批发供货价(元)',
      dataIndex: 'wholesaleSupplyPriceRange',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => data.goodsSaleType === 2 ? '-' : _
    },
    {
      title: '零售供货价(元)',
      dataIndex: 'retailSupplyPriceRange',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => data.goodsSaleType === 1 ? '-' : _
    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
      valueType: 'text',
      hideInSearch: true,
    },
    // {
    //   title: '活动库存',
    //   dataIndex: 'activityStockNum',
    //   valueType: 'text',
    //   hideInSearch: true,
    // },
    {
      title: '审核状态',
      dataIndex: 'goodsVerifyStateDisplay',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        const { goodsVerifyRemark, goodsVerifyState } = record;
        return (
          <>
            {_}&nbsp;
            {(goodsVerifyRemark && goodsVerifyState === 2) && <Tooltip title={goodsVerifyRemark}><QuestionCircleOutlined /></Tooltip>}
          </>
        )
      },
    },
    {
      title: '上架状态',
      dataIndex: 'goodsStateDisplay',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        const { goodsStateRemark, goodsState } = record;
        return (
          <>
            {_}&nbsp;
            {(goodsStateRemark && goodsState === 0) && <Tooltip title={goodsStateRemark}><QuestionCircleOutlined /></Tooltip>}
          </>
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return (
          <Space>
            <a onClick={() => { requestDetail(record.spuId) }}>编辑</a>
            {/* <a onClick={() => { history.push(`/product-management/product-detail/${record.spuId}`) }}>详情</a> */}
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
        params={{
          selectType: 1,
        }}
        actionRef={actionRef}
        formRef={formRef}
        request={rejectProductList}
        expandable={{ expandedRowRender: (_) => <SubTable data={_} /> }}
        search={{
          labelWidth: 120,
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
      {
        productDetailDrawerVisible &&
        <ProductDetailDrawer
          visible={productDetailDrawerVisible}
          setVisible={setProductDetailDrawerVisible}
          spuId={selectItem?.spuId}
        />
      }
    </PageContainer>
  );
};

export default TableList;

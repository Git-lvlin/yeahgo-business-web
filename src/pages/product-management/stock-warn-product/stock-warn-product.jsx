import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Tooltip, Space } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { stockWarnProductList } from '@/services/product-management/stock-warn-product';
import { getDetail, getConfig } from '@/services/product-management/product-list';
import Edit from '@/components/product-edit';
import { amountTransform, typeTransform } from '@/utils/utils'
import { QuestionCircleOutlined } from '@ant-design/icons'
import ProductDetailDrawer from '@/components/product-detail-drawer'


const TableList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [config, setConfig] = useState({});
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
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
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
      title: '规格',
      dataIndex: 'specArr',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => JSON.stringify(_).replace(/\[|\]|{|}|"/g, '').replace(/,/, '; ')
    },
    {
      title: '供货类型',
      dataIndex: 'goodsSaleType',
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
      title: '供货价',
      dataIndex: 'retailSupplyPrice',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '预警库存',
      dataIndex: 'stockAlarmNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '审核状态',
      dataIndex: 'goodsVerifyState',
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
      dataIndex: 'goodsState',
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
      title: '审核状态',
      dataIndex: 'goodsVerifyState',
      onFilter: true,
      valueType: 'select',
      valueEnum: typeTransform(config.goodsVerifyState),
      hideInTable: true,
    },
    {
      title: '上架状态',
      dataIndex: 'goodsState',
      onFilter: true,
      valueType: 'select',
      valueEnum: typeTransform(config.goodsState),
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

  useEffect(() => {
    getConfig()
      .then(res => {
        setConfig(res?.data?.records || [])
      })
  }, [])

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
        request={stockWarnProductList}
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

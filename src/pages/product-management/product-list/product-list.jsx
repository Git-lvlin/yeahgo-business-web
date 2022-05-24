import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Table, Tooltip, Spin, Space } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import * as api from '@/services/product-management/product-list';
import GcCascader from '@/components/gc-cascader'
import BrandSelect from '@/components/brand-select'
import SelectSupplierModal from '@/components/select-supplier-modal'
import { detailExt } from '@/services/common';
import Edit from '@/components/product-edit';
import OffShelf from './off-shelf';
import { amountTransform, typeTransform } from '@/utils/utils'
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'
import moment from 'moment';
import ProductDetailDrawer from '@/components/product-detail-drawer'
import Stock from './stock';


const SubTable = (props) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const { reload } = props;

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
    api.productList({
      selectType: 2,
      spuId: props.data.spuId
    }).then(res => {
      setData(res?.data)
    }).finally(() => {
      setLoading(false);
    })
  }, [reload])

  return (
    <Spin spinning={loading}>
      <Table rowKey="id" columns={columns} dataSource={data} pagination={false} />
    </Spin>
  )
};

const TableList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [reload, setReload] = useState(null);
  const [config, setConfig] = useState({});
  const [supplierId, setSupplierId] = useState('');
  const [offShelfVisible, setOffShelfVisible] = useState(false);
  const [stockVisible, setStockVisible] = useState(false);
  const [selectSupplierVisible, setSelectSupplierVisible] = useState(false);
  const [selectSupplier, setSelectSupplier] = useState(null);
  const [selectItemId, setSelectItemId] = useState(null);
  const [productDetailDrawerVisible, setProductDetailDrawerVisible] = useState(false);
  const [visit, setVisit] = useState(false)
  const actionRef = useRef();
  const formRef = useRef();
  const supplierType = window.localStorage.getItem('supplierType');
  const getDetail = (id, options = {}) => {
    api.getDetail({
      spuId: id
    }).then(res => {
      if (res.code === 0) {
        if (options.isCopy) {
          setDetailData({
            ...res.data.records,
            isCopy: true,
          });
        } else {
          setDetailData(res.data.records);
        }
        setFormVisible(true);
      }
    })
  }

  const onShelf = (spuId) => {
    api.onShelf({
      spuId
    }, { showSuccess: true }).then(res => {
      if (res.code === 0) {
        actionRef.current.reload();
      }
    })
  }

  const offShelf = (spuId, goodsStateRemark) => {
    api.offShelf({
      spuId,
      goodsStateRemark,
    }, { showSuccess: true }).then(res => {
      if (res.code === 0) {
        actionRef.current.reload();
        setSelectItemId(null);
      }
    })
  }

  const setStock = (record) => {
    api.productList({
      selectType: 2,
      spuId: record.spuId
    }).then(res => {
      setStockData({
        ...record,
        skus: res?.data
      })
      setStockVisible(true);
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
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入商品名称'
      }
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return <a onClick={() => { setSelectItemId(record.spuId); setProductDetailDrawerVisible(true); }}>{_}</a>
      },
      width: 200,
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
      title: '供应商家ID',
      dataIndex: 'supplierId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入供应商家ID'
      },
      hideInSearch: supplierType === '1',
      hideInTable: supplierType === '1',
    },
    {
      title: '供货类型',
      dataIndex: 'goodsSaleType',
      onFilter: true,
      valueType: 'select',
      valueEnum: typeTransform(config.goodsSaleType),
      hideInTable: true,
      hideInSearch: true,
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
      render: (_) => _ === 0 ? '不支持' : '支持'
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
    // {
    //   title: '最高销售价',
    //   dataIndex: 'goodsSaleMinPriceDisplay',
    //   valueType: 'text',
    //   hideInSearch: true,
    // },
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
    // {
    //   title: '销量',
    //   dataIndex: 'goodsSaleNum',
    //   valueType: 'text',
    //   hideInSearch: true,
    // },
    {
      title: '审核状态',
      dataIndex: 'goodsVerifyState',
      onFilter: true,
      valueType: 'select',
      valueEnum: typeTransform(config.goodsVerifyState),
      hideInTable: true,
    },
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
      dataIndex: 'goodsState',
      onFilter: true,
      valueType: 'select',
      valueEnum: typeTransform(config.goodsState),
      hideInTable: true,
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
      title: '商品关键字',
      dataIndex: 'goodsKeywords',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '商品分类',
      dataIndex: 'gcId',
      renderFormItem: () => (<GcCascader />),
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '商品品牌',
      dataIndex: 'brandId',
      renderFormItem: () => (<BrandSelect />),
      hideInTable: true,
      hideInSearch: true,
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
      title: '供货类型',
      dataIndex: 'goodsSaleType',
      onFilter: true,
      valueType: 'select',
      valueEnum: typeTransform(config.goodsSaleType),
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        const { goodsVerifyState, goodsState } = record;
        return (
          <Space>
            {(goodsVerifyState === 1 && goodsState === 1) && <a onClick={() => { setSelectItemId(record.spuId); setOffShelfVisible(true) }}>下架</a>}
            {/* &nbsp;{(goodsVerifyState === 1 && goodsState === 0) && <a onClick={() => { onShelf(record.spuId) }}>上架</a>} */}
            <a onClick={() => { getDetail(record.spuId) }}>编辑</a>
            <a onClick={() => { setStock(record) }}>增加库存</a>
            <a onClick={() => { getDetail(record.spuId, { isCopy: true }) }}>复制商品</a>
          </Space>
        )
      },
    },
  ];

  const getFieldValue = () => {
    if (formRef?.current?.getFieldsValue) {
      const { current, pageSize, gcId = [], createTime, auditTime, ...rest } = formRef?.current?.getFieldsValue?.();
      const obj = {};

      if (createTime) {
        obj.createTimeStart = moment(createTime[0]).unix();
        obj.createTimeEnd = moment(createTime[1]).unix();
      }

      if (auditTime) {
        obj.auditTimeStart = moment(auditTime[0]).unix();
        obj.auditTimeEnd = moment(auditTime[1]).unix();
      }

      return {
        supplierId,
        selectType: 1,
        gcId1: gcId[0],
        gcId2: gcId[1],
        ...obj,
        ...rest
      }
    }
    return {}
  }

  useEffect(() => {
    api.getConfig()
      .then(res => {
        setConfig(res?.data?.records || [])
      })
    detailExt()
      .then(res => {
        if (res.code === 0) {
          setSupplierId(res.data.records.supplierId)
        }
      })
  }, [])

  return (
    <PageContainer>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
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
        params={{
          selectType: 1,
        }}
        actionRef={actionRef}
        formRef={formRef}
        request={api.productList}
        expandable={{ expandedRowRender: (_) => <SubTable data={_} reload={reload} /> }}
        scroll={{ x: 'max-content' }}
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
            <Export
              key="3"
              change={(e) => { setVisit(e) }}
              type="goods-supplier-export"
              conditions={getFieldValue}
            />,
            <ExportHistory key="4" show={visit} setShow={setVisit} type="goods-supplier-export" />,
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
        callback={() => { actionRef.current.reload(); setFormVisible(false); setDetailData(null) }}
        onClose={() => { setDetailData(null) }}
        supplierId={selectSupplier?.supplierId}
      />}
      {offShelfVisible && <OffShelf
        visible={offShelfVisible}
        setVisible={setOffShelfVisible}
        callback={(text) => { offShelf(selectItemId, text) }}
      />}
      {stockVisible && <Stock
        data={stockData}
        visible={stockVisible}
        setVisible={setStockVisible}
        callback={() => { actionRef.current.reload(); setReload(!reload) }}
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
      {
        productDetailDrawerVisible &&
        <ProductDetailDrawer
          visible={productDetailDrawerVisible}
          setVisible={setProductDetailDrawerVisible}
          spuId={selectItemId}
        />
      }
    </PageContainer>
  );
};

export default TableList;

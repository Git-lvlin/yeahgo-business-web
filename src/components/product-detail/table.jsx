import React, { useState, useEffect } from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import Big from 'big.js';

Big.RM = 2;

export default function EditTable(props) {
  const { tableHead, tableData, goodsSaleType, settleType, isSample, unit, wsUnit, ladderSwitch } = props;
  const [columns, setColumns] = useState([])

  useEffect(() => {
    const arr = [];
    tableHead.forEach((item, index) => {
      if (item) {
        arr.push({
          title: item,
          dataIndex: `spec${index + 1}`,
        })
      }
    });

    setColumns([
      {
        title: '规格图片',
        dataIndex: 'imageUrl',
        editable: false,
        render: (_) => <img src={_} width="50" height="50" />,
        width: 100,
        // renderFormItem: () => <Upload disable maxCount={1} className={styles.upload} accept="image/*" />,
        // formItemProps: {
        //   rules: [{
        //     required: true,
        //     whitespace: true,
        //     message: '请上传规格图片',
        //   }],
        // }
      },
      ...arr,
      {
        title: `一件代发供货价`,
        dataIndex: 'retailSupplyPrice',
        editable: false,
        hideInTable: goodsSaleType === 1,
        render: _ => `${_}元/${unit}`
      },
      {
        title: `集采供货价`,
        dataIndex: 'wholesaleSupplyPrice',
        editable: false,
        hideInTable: goodsSaleType === 2,
        render: _ => `${_}元/${unit}`
      },
      {
        title: '集采箱规单位量',
        dataIndex: 'batchNumber',
        editable: false,
        hideInTable: goodsSaleType === 2,
      },
      {
        title: '最低批发量',
        dataIndex: 'wholesaleMinNum',
        editable: false,
        hideInTable: goodsSaleType === 2,
        render: _ => `${_}${unit}`
      },
      {
        title: `样品供货价`,
        dataIndex: 'sampleSupplyPrice',
        hideInTable: isSample !== 1,
        render: _ => `${_}元/${unit}`
      },
      {
        title: '样品起售量',
        dataIndex: 'sampleMinNum',
        hideInTable: isSample !== 1,
        render: _ => `${_}${unit}`
      },
      {
        title: '样品限售量',
        dataIndex: 'sampleMaxNum',
        hideInTable: isSample !== 1,
        render: _ => `${_}${unit}`
      },
      {
        title: '样品是否包邮',
        dataIndex: 'sampleFreight',
        valueType: 'select',
        hideInTable: isSample !== 1,
        fieldProps: {
          allowClear: false,
          options: [
            {
              label: '包邮',
              value: 1,
            },
            {
              label: '不包邮',
              value: 0,
            },
          ],
        }
      },
      {
        title: '样品运费模板',
        dataIndex: 'sampleFreightName',
        hideInTable: isSample !== 1,
      },
      // {
      //   title: '秒约价',
      //   dataIndex: 'salePrice',
      //   editable: settleType === 2,
      //   width: 130,
      //   hideInTable: goodsSaleType === 1,
      // },
      // {
      //   title: '秒约价上浮比例',
      //   dataIndex: 'salePriceFloat',
      //   hideInTable: goodsSaleType === 1,
      //   width: 130,
      // },
      // {
      //   title: '秒约价实际盈亏',
      //   dataIndex: 'salePriceProfitLoss',
      //   editable: false,
      //   hideInTable: goodsSaleType === 1,
      //   width: 130,
      // },
      // {
      //   title: '市场价',
      //   dataIndex: 'marketPrice',
      //   width: 130,
      // },
      {
        title: '库存预警值',
        dataIndex: 'stockAlarmNum',
        editable: false,
        render: _ => `${_}${unit}`
      },
      {
        title: '可用库存',
        dataIndex: 'stockNum',
        editable: false,
        render: _ => `${_}${unit}`
        // formItemProps: {
        //   rules: [{
        //     required: true,
        //     whitespace: true,
        //     message: '请输入可用库存',
        //   }],
        // }
      },
      {
        title: `平均运费`,
        dataIndex: 'wholesaleFreight',
        hideInTable: goodsSaleType === 2,
        editable: false,
        render: _ => `${_}元/${unit}`
      },
      {
        title: '是否包邮',
        dataIndex: 'isFreeFreight',
        render: (_) => _ === 1 ? '包邮' : '不包邮',
        hideInTable: goodsSaleType === 1,
        editable: false,
      },
      {
        title: '运费模板',
        dataIndex: 'freightTemplateId',
        render: (_) => _.label ? _.label : '_',
        hideInTable: goodsSaleType === 1,
        editable: false,
      },
      {
        title: '阶梯优惠',
        dataIndex: 'stage1',
        render: (_, record) => {
          return _ !== '-' ? <>
            <div div style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }
            }>
              {_.wsStart}
              —
              {_.wsEnd}
              {unit}时，
              {_.wsSupplyPrice}元 / {unit}
            </div >

            {record.batchNumber > 1 && <div>{parseInt(_.wsStart / record.batchNumber, 10)}—{parseInt(_.wsEnd / record.batchNumber, 10)}{wsUnit}时，{+new Big(_.wsSupplyPrice).times(record.batchNumber).toFixed(2)}元/{wsUnit}</div>}
          </> : '-'
        },
        hideInTable: goodsSaleType === 2,
      },
      {
        title: '最高阶梯优惠',
        dataIndex: 'stage2',
        render: (_, record) => {
          return _ !== '-' ? <>
            <div style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }}>
              {record.stage1.wsEnd + 1}
              {unit}及以上时，
              {_.wsSupplyPrice}元/{unit}
            </div>

            {record.batchNumber > 1 && <div>{parseInt((record.stage1.wsEnd + 1) / record.batchNumber, 10)}{wsUnit}及以上时，{+new Big(_.wsSupplyPrice).times(record.batchNumber).toFixed(2)}元/{wsUnit}</div>}
          </> : '-'
        },
        hideInTable: goodsSaleType === 2,
      },
      // {
      //   title: '操作',
      //   valueType: 'option',
      //   render: () => {
      //     return null;
      //   },
      //   width: 50
      // },
    ])

  }, [tableHead, goodsSaleType, settleType])

  return (
    <EditableProTable
      columns={columns}
      rowKey="key"
      value={tableData}
      bordered
      style={{ marginBottom: 20 }}
      pagination={false}
      scroll={{ x: 'max-content' }}
      recordCreatorProps={false}
    />
  )
}

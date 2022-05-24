import React, { useState, useEffect } from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import { Input } from 'antd';
import Upload from '@/components/upload';
import FreightTemplateSelect from '@/components/freight-template-select'
import styles from './edit-table.less';
import Big from 'big.js';

Big.RM = 2;

const CusInput = ({ onChange, value, unit, wsUnit, batchNumber }) => {
  return (
    <>
      <div style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }}>
        <Input
          style={{ width: 100 }}
          value={value?.wsStart}
          onChange={(e) => {
            onChange({
              ...value,
              wsStart: e.target.value
            })
          }}
        />
        —
        <Input
          style={{ width: 100 }}
          value={value?.wsEnd}
          onChange={(e) => {
            onChange({
              ...value,
              wsEnd: e.target.value
            })
          }}
        />
        {unit}时
      </div>
      <Input
        style={{ width: 150 }}
        value={value?.wsSupplyPrice}
        addonAfter={`元/${unit}`}
        onChange={(e) => {
          onChange({
            ...value,
            wsSupplyPrice: e.target.value
          })
        }}
      />
      {!!value?.wsEnd && !!value?.wsStart && !!value?.wsSupplyPrice && batchNumber > 1 &&
        <div>
          {parseInt(value?.wsStart / batchNumber, 10)}
          —{parseInt(value.wsEnd / batchNumber, 10)}{wsUnit}时，
          {+new Big(value.wsSupplyPrice).times(batchNumber).toFixed(2)}元/{wsUnit}</div>
      }
    </>
  )
}

const CusInput2 = ({ onChange, value = {}, wsEnd, unit, wsUnit, batchNumber }) => {
  return (
    <>
      {!!wsEnd && <div style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }}>
        {+wsEnd + 1} {unit}以上时
        <Input
          style={{ width: 150 }}
          value={value?.wsSupplyPrice}
          addonAfter={`元/${unit}`}
          onChange={(e) => {
            onChange({
              ...value,
              wsSupplyPrice: e.target.value
            })
          }}
        />
      </div>}
      {!!value?.wsSupplyPrice && batchNumber > 1 &&
        <div>{parseInt((+wsEnd + 1) / batchNumber, 10)}{wsUnit}以上时，
          {+new Big(value.wsSupplyPrice).times(batchNumber).toFixed(2)}元/{wsUnit}</div>
      }
    </>
  )
}

export default function EditTable(props) {
  const { tableHead, tableData, setTableData, goodsSaleType, isSample, wsUnit, unit, ladderConfig } = props;
  const [columns, setColumns] = useState([])
  const [editableKeys, setEditableKeys] = useState([])
  const [dataSource, setDataSource] = useState([]);
  // const [form] = Form.useForm();

  useEffect(() => {
    const arr = [];
    tableHead.forEach((item, index) => {
      if (item) {
        arr.push({
          title: item,
          dataIndex: `spec${index + 1}`,
          editable: false,
          width: 100,
          fixed: 'left'
        })
      }
    });


    setColumns([
      {
        title: '规格图片',
        dataIndex: 'imageUrl',
        // editable: false,
        renderFormItem: () => <Upload maxCount={1} className={styles.upload} accept="image/*" />,
        width: 100,
        fixed: 'left'
      },
      ...arr,
      {
        title: '货号',
        dataIndex: 'supplierSkuId',
      },
      {
        title: `一件代发供货价`,
        dataIndex: 'retailSupplyPrice',
        hideInTable: goodsSaleType === 1,
        fieldProps: {
          addonAfter: `元/${unit}`
        }
      },
      {
        title: `集采供货价`,
        dataIndex: 'wholesaleSupplyPrice',
        hideInTable: goodsSaleType === 2,
        fieldProps: {
          addonAfter: `元/${unit}`
        }
      },
      {
        title: '集采箱规单位量',
        dataIndex: 'batchNumber',
        hideInTable: goodsSaleType === 2,
        fieldProps: {
          addonAfter: `${unit}/${wsUnit}`
        }
      },
      {
        title: '最低批发量',
        dataIndex: 'wholesaleMinNum',
        hideInTable: goodsSaleType === 2,
        fieldProps: {
          addonAfter: `${unit}`
        }
      },
      {
        title: `样品供货价`,
        dataIndex: 'sampleSupplyPrice',
        hideInTable: isSample !== 1,
        fieldProps: {
          addonAfter: `元/${unit}`
        }
      },
      {
        title: '样品起售量',
        dataIndex: 'sampleMinNum',
        hideInTable: isSample !== 1,
        fieldProps: {
          addonAfter: `${unit}`
        }
      },
      {
        title: '样品限售量',
        dataIndex: 'sampleMaxNum',
        hideInTable: isSample !== 1,
        fieldProps: {
          addonAfter: `${unit}`
        }
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
        dataIndex: 'sampleFreightId',
        renderFormItem: (item, { record }) => {
          return record.sampleFreight === 1 ? '-' : <FreightTemplateSelect labelInValue allowClear={false} />
        },
        hideInTable: isSample !== 1,
      },
      {
        title: '库存预警值',
        dataIndex: 'stockAlarmNum',
        fieldProps: {
          addonAfter: `${unit}`
        }
      },
      {
        title: '可用库存',
        dataIndex: 'stockNum',
        fieldProps: {
          addonAfter: `${unit}`
        }
      },
      {
        title: '平均运费',
        dataIndex: 'wholesaleFreight',
        hideInTable: goodsSaleType === 2,
        fieldProps: {
          addonAfter: `元/${unit}`
        }
      },
      {
        title: '是否包邮',
        dataIndex: 'isFreeFreight',
        valueType: 'select',
        hideInTable: goodsSaleType === 1,
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
        title: '运费模板',
        dataIndex: 'freightTemplateId',
        renderFormItem: (item, { record }) => {
          return record.isFreeFreight === 1 ? '-' : <FreightTemplateSelect labelInValue allowClear={false} />
        },
        hideInTable: goodsSaleType === 1,
      },
      {
        title: '阶梯优惠',
        dataIndex: 'stage1',
        renderFormItem: (_, { record }) => {
          return (
            <CusInput batchNumber={record.batchNumber} wsUnit={wsUnit} unit={unit} />
          )
        },
        hideInTable: goodsSaleType === 2 || !ladderConfig,
      },
      {
        title: '最高阶梯优惠',
        dataIndex: 'stage2',
        renderFormItem: (_, { record }) => {
          return (
            <CusInput2 batchNumber={record.batchNumber} wsEnd={record.stage1?.wsEnd} wsUnit={wsUnit} unit={unit} />
          )
        },
        hideInTable: goodsSaleType === 2 || !ladderConfig,
      },
      {
        title: '操作',
        valueType: 'option',
        width: 100,
        fixed: 'right',
      },
    ])

  }, [tableHead, goodsSaleType, isSample, unit, wsUnit, ladderConfig, dataSource])

  useEffect(() => {
    setEditableKeys(tableData.map(item => item.key));
    setDataSource(tableData);
  }, [tableData, ladderConfig])


  return (
    <EditableProTable
      columns={columns}
      rowKey="key"
      value={dataSource}
      scroll={{ x: 'max-content' }}
      editable={{
        // form,
        editableKeys,
        actionRender: (row, config, defaultDoms) => {
          return [defaultDoms.delete];
        },
        onValuesChange: (record, recordList) => {
          setDataSource(recordList);
          setTableData(recordList)
        }
      }}
      bordered
      recordCreatorProps={false}
      style={{ marginBottom: 20 }}
    />
  )
}

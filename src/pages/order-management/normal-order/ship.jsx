import React, { useState } from 'react';
import {
  DrawerForm,
} from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-table';
import ExpressSelect from '@/components/express-select'
import { batchShip } from '@/services/order-management/normal-order';

const columns = [
  // {
  //   title: '规格图片',
  //   dataIndex: 'imageUrl',
  //   width: 50,
  //   renderFormItem: () => <Upload maxCount={1} className={styles.upload} accept="image/*" />,
  // },
  {
    title: '订单号',
    dataIndex: 'orderSn',
    editable: false,
  },
  {
    title: '收货人',
    dataIndex: 'consignee',
    editable: false,
  },
  {
    title: '收货手机号',
    dataIndex: 'phone',
    editable: false,
  },
  {
    title: '收货地址',
    dataIndex: 'address',
    editable: false,
    width: 300,
  },
  {
    title: '快递公司',
    dataIndex: 'expressId',
    renderFormItem: () => <ExpressSelect style={{ width: 150 }} />,
  },
  {
    title: '快递单号',
    dataIndex: 'expressNo'
  },
]


const Ship = ({ visible, setVisible, data, callback }) => {
  const [dataSource, setDataSource] = useState(data);
  const [editableKeys] = useState(data.map(item => item.id))

  const submit = () => {
    return new Promise((resolve, reject) => {
      const obj = dataSource.map(item => ({ id: item.id, expressType: item?.expressId?.expressType, expressName: item?.expressId?.expressName, shippingCode: item?.expressNo }))
      batchShip({ list: obj }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve();
          callback();
        } else {
          reject();
        }
      })
    });
  }

  return (
    <DrawerForm
      title={`批量发货`}
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        width: 1200,
        // onClose: () => {
        //   onClose();
        // }
      }}
      // form={form}
      onFinish={async (values) => {
        try {
          await submit(values);
          return true;
        } catch (error) {
          console.log('error', error);
        }

      }}
      visible={visible}
    >
      <EditableProTable
        columns={columns}
        rowKey="id"
        value={dataSource}
        editable={{
          // form,
          editableKeys,
          // actionRender: (row, config, defaultDoms) => {
          //   return [defaultDoms.delete];
          // },
          onValuesChange: (record, recordList) => {
            setDataSource(recordList);
          }
        }}
        bordered
        recordCreatorProps={false}
        style={{ marginBottom: 20 }}
      />
    </DrawerForm>
  )
}

export default Ship;


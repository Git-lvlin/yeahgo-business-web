import React, { useState } from 'react';
import { Form, message } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormDependency,
} from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-table';
import { modifySkuStock } from '@/services/product-management/product-list';



export default (props) => {
  const { visible, setVisible, callback, data } = props;
  const [editableKeys] = useState(data?.skus?.map(item => item.id))
  const [dataSource, setDataSource] = useState(data?.skus?.map(item => ({
    ...item,
    total: item.stockNum
  })));
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };

  const columns = [
    {
      title: '规格',
      dataIndex: 'skuNameDisplay',
      editable: false,
    },
    {
      title: '当前可用库存',
      dataIndex: 'stockNum',
      editable: false,
    },
    {
      title: '增加库存数量',
      dataIndex: 'num',
      fieldProps: {
        placeholder: "请输入增加的库存数量"
      }
    },
    {
      title: '增加后可用库存',
      dataIndex: 'total',
      editable: false,
    },
  ]

  const submit = (values) => {
    return new Promise((resolve, reject) => {
      let params;
      if (data.isMultiSpec === 0) {
        params = {
          skus: [{
            skuId: data.skus[0].id,
            num: +values.num,
          }]
        }
      } else {
        const arr = dataSource.filter(item => /^\d+$/g.test(item.num) && `${item.num}`.indexOf('.') === -1 && item.num > 0)
        const error = dataSource.some(item => {
          if (item.num) {
            return !/^\d+$/g.test(item.num) || item.num <= 0
          }
          return false;
        })
        if (arr.length === 0 || error) {
          message.error('请输入1-999999之间的整数');
          reject()
          return;
        }
        params = {
          skus: arr.map(item => ({ skuId: item.id, num: +item.num }))
        }
      }
      modifySkuStock(params, { showSuccess: true })
        .then(res => {
          if (res.code === 0) {
            callback();
            resolve()
          } else {
            reject()
          }
        })
    });
  }

  return (
    <ModalForm
      title={<>增加商品可用库存<span style={{ marginLeft: 10, fontSize: 12, color: '#0000006d' }}>{data.goodsName}（spuId:{data.spuId}）</span></>}
      onVisibleChange={setVisible}
      visible={visible}
      width={700}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        return true;
      }}
      {...formItemLayout}
    >
      {
        data.isMultiSpec === 0
          ?
          <>
            <Form.Item
              label="当前可用库存"
            >
              {data.stockNum}
            </Form.Item>
            <ProFormText
              label="增加库存数量"
              placeholder="请输入增加的库存数量，1-999999之间的整数"
              name="num"
              validateFirst
              rules={[
                { required: true, message: '请输入增加库存数量' },
                () => ({
                  validator(_, value) {
                    if (!/^\d+$/g.test(value) || `${value}`.indexOf('.') !== -1 || value <= 0) {
                      return Promise.reject(new Error('请输入大于零的正整数'));
                    }
                    return Promise.resolve();
                  },
                })
              ]}
            />
            <ProFormDependency name={['num']}>
              {
                ({ num }) => <Form.Item
                  label="增加后可用库存"
                >
                  {parseInt(data.stockNum + (num > 0 ? +num : 0), 10)}
                </Form.Item>
              }
            </ProFormDependency>
          </>
          :
          <EditableProTable
            columns={columns}
            rowKey="skuId"
            value={dataSource}
            editable={{
              editableKeys,
              onValuesChange: (record, recordList) => {
                setDataSource(recordList.map(item => ({
                  ...item,
                  total: parseInt(item.stockNum + (item.num > 0 ? +item.num : 0), 10)
                })));
              }
            }}
            controlled
            bordered
            recordCreatorProps={false}
          />
      }
    </ModalForm >
  );
};
import React from 'react'
import { Input, Form } from 'antd';
import {
  ProFormDependency,
} from '@ant-design/pro-form';
import Big from 'big.js';

Big.RM = 2;

const CusInput = () => {
  return (
    <ProFormDependency name={['wsStart', 'wsEnd', 'wsSupplyPrice', 'wsSupplyPrice2', 'unit', 'wsUnit', 'batchNumber']}>
      {
        ({ wsStart, wsEnd, wsSupplyPrice, wsSupplyPrice2, unit, wsUnit, batchNumber }) => {
          return (
            <>
              <div style={{ display: ' flex', alignItems: 'center' }}>
                <div style={{ flexShrink: 0, marginRight: 5 }}>采购</div>
                <Form.Item
                  name="wsStart"
                  style={{ marginBottom: 0 }}
                  validateFirst
                  dependencies={['wsEnd','wsSupplyPrice']}
                  rules={[
                    { required: wsStart || wsEnd || wsSupplyPrice, message: '请输入' },
                    () => ({
                      required: false,
                      validator(_, v) {
                        if (+v >= +wsEnd && v !== '' && v !== undefined) {
                          return Promise.reject(new Error('取值范围不合理，请重填'));
                        }
                        if ((!/^\d+$/g.test(v) || v <= 0) && v !== '' && v !== undefined) {
                          return Promise.reject(new Error('请输入大于零的整数'));
                        }

                        if ((v % batchNumber !== 0 || v / batchNumber < 2) && v !== '' && v !== undefined) {
                          return Promise.reject(new Error('必须是集采箱规单位量的整数倍，且不能小于2倍'));
                        }
                        return Promise.resolve();
                      },
                    })
                  ]}
                >
                  <Input style={{ width: 150 }} />
                </Form.Item>
                —
                <Form.Item
                  name="wsEnd"
                  style={{ marginBottom: 0 }}
                  dependencies={['wsStart','wsSupplyPrice']}
                  validateFirst
                  rules={[
                    { required: wsStart || wsEnd || wsSupplyPrice, message: '请输入' },
                    () => ({
                      required: false,
                      validator(_, v) {
                        if (+v <= +wsStart && v !== '' && v !== undefined) {
                          return Promise.reject(new Error('取值范围不合理，请重填'));
                        }
                        if ((!/^\d+$/g.test(v) || v <= 0) && v !== '' && v !== undefined) {
                          return Promise.reject(new Error('请输入大于零的整数'));
                        }
                        if ((v % batchNumber !== 0 || v / batchNumber < 2) && v !== '' && v !== undefined) {
                          return Promise.reject(new Error('必须是集采箱规单位量的整数倍，且不能小于2倍'));
                        }
                        return Promise.resolve();
                      },
                    })
                  ]}
                >
                  <Input style={{ width: 150 }} />
                </Form.Item>
                <div style={{ flexShrink: 0, padding: '0 5px' }}>{unit}时</div>
                <Form.Item
                  name="wsSupplyPrice"
                  style={{ marginBottom: 0 }}
                  dependencies={['wsStart', 'wsEnd']}
                  validateFirst
                  rules={[
                    { required: wsStart || wsEnd || wsSupplyPrice, message: '请输入' },
                    () => ({
                      required: false,
                      validator(_, v) {
                        if ((!/^\d+\.?\d*$/g.test(v) || v <= 0) && v !== '' && v !== undefined) {
                          return Promise.reject(new Error('请输入大于零的数字'));
                        }
                        if (`${v}`?.split?.('.')?.[1]?.length > 2 && v !== '' && v !== undefined) {
                          return Promise.reject(new Error('阶梯优惠价只能保留两位小数'));
                        }
                        return Promise.resolve();
                      },
                    })
                  ]}
                >
                  <Input
                    style={{ width: 250 }}
                    addonAfter={`元/${unit}`}
                  />
                </Form.Item>
              </div>
              {
                !!wsStart && !!wsEnd && !!wsSupplyPrice &&
                <>
                  {batchNumber > 1 && <div style={{ paddingLeft: 30 }}>
                    {parseInt(wsStart / batchNumber, 10)}—{parseInt(wsEnd / batchNumber, 10)}{wsUnit}时，{+new Big(wsSupplyPrice).times(batchNumber).toFixed(2)}元 / {wsUnit}
                  </div>}
                  <div style={{ width: '100%', height: 1, backgroundColor: '#eee', margin: '10px 0' }} />
                  <div style={{ paddingLeft: 30, display: ' flex', alignItems: 'center' }}>
                    <div style={{ marginRight: 5 }}>{+wsEnd + 1}{unit}及以上时</div>
                    <Form.Item
                      name="wsSupplyPrice2"
                      style={{ marginBottom: 0 }}
                      validateFirst
                      rules={[
                        { required: wsStart || wsEnd || wsSupplyPrice || wsSupplyPrice2, message: '请输入' },
                        () => ({
                          required: false,
                          validator(_, v) {
                            if ((!/^\d+\.?\d*$/g.test(v) || v <= 0) && v !== '' && v !== undefined) {
                              return Promise.reject(new Error('请输入大于零的数字'));
                            }
                            if (`${v}`?.split?.('.')?.[1]?.length > 2 && v !== '' && v !== undefined) {
                              return Promise.reject(new Error('阶梯优惠价只能保留两位小数'));
                            }
                            return Promise.resolve();
                          },
                        })
                      ]}
                    >
                      <Input style={{ width: 250 }} addonAfter={`元/${unit}`} />
                    </Form.Item>
                  </div>
                  {batchNumber > 1 && wsSupplyPrice2 > 0 && <div style={{ paddingLeft: 30 }}>
                    {parseInt((+wsEnd + 1) / batchNumber, 10)}{wsUnit}及以上时，{+new Big(wsSupplyPrice2).times(batchNumber).toFixed(2)}元 / {wsUnit}
                  </div>}
                </>
              }
            </>
          )
        }
      }

    </ProFormDependency>
  )
}


export default CusInput

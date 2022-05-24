import React from 'react';
import { Row, Col, Form } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDependency,
} from '@ant-design/pro-form';
import FreightTemplateSelect from '@/components/freight-template-select'

export default (props) => {
  const { visible, setVisible, getData, goodsSaleType, isSample, form } = props;
  const { specValues1, specValues2 } = form.getFieldsValue(['specValues1', 'specValues2']);
  return (
    <ModalForm
      title="生成规格配置表"
      modalProps={{
        width: 740,
      }}
      onFinish={(values) => {
        try {
          getData(values)
        } catch (error) {
          console.log('error', error);
        }
        return true;
      }}
      onVisibleChange={setVisible}
      visible={visible}
      initialValues={{
        batchNumber: 1,
        isFreeFreight: 1,
        sampleFreight: 1,
        sampleMinNum: 1,
        sampleMaxNum: 1
      }}
    >
      <p>请输入要批量填写的规格参数。</p>
      <p style={{ color: 'red' }}>若已输入规格参数，重新批量填写会将已有的规格参数全部重置，请确认后操作！</p>
      <Row>
        {goodsSaleType !== 1 && <Col span={12}>
          <ProFormText
            width="md"
            name="retailSupplyPrice"
            label="一件代发供货价(元)"
            placeholder="请输入一件代发供货价"
            rules={[{ required: true, message: '请输入一件代发供货价' }]}
          />
        </Col>}
        {goodsSaleType !== 2 && <Col span={12}>
          <ProFormText
            width="md"
            name="wholesaleSupplyPrice"
            label="集采供货价(元)"
            placeholder="请输入集采供货价"
            rules={[{ required: true, message: '请输入集采供货价' }]}
          />
        </Col>}
        {goodsSaleType !== 2 && <Col span={12}>
          <ProFormText
            width="md"
            name="wholesaleMinNum"
            label="最低批发量"
            placeholder="请输入最低批发量"
            rules={[{ required: true, message: '请输入最低批发量' }]}
          />
        </Col>}
        <Col span={12}>
          <ProFormText
            width="md"
            name="stockAlarmNum"
            label="库存预警值"
            placeholder="请输入库存预警值"
          />
        </Col>
        <Col span={12}>
          <ProFormDependency name={['stockNum']}>
            {
              ({ stockNum }) => (
                <ProFormText
                  width="md"
                  name="stockNum"
                  label="单个sku规格可用库存"
                  placeholder="请输入可用库存"
                  rules={[{ required: true, message: '请输入可用库存' }]}
                  extra={`共有${specValues1.length * specValues2.length}个规格，SPU商品总可用库存为${stockNum > 0 ? stockNum * specValues1.length * specValues2.length : 0}`}
                />
              )
            }
          </ProFormDependency>
        </Col>
        <Col span={12}>
          <ProFormText
            width="md"
            name="batchNumber"
            label="集采箱规单位量"
            placeholder="请输入集采箱规单位量"
            rules={[{ required: true, message: '请输入集采箱规单位量' }]}
          />
        </Col>
        {goodsSaleType !== 2 && <Col span={12}>
          <ProFormText
            width="md"
            name="wholesaleFreight"
            label="平均运费(元)"
            placeholder="请输入平均运费"
            rules={[{ required: true, message: '请输入平均运费' }]}
          />
        </Col>}
        {
          isSample === 1
          &&
          <>
            <Col span={12}>
              <ProFormText
                width="md"
                name="sampleSupplyPrice"
                label="样品供货价(元)"
                placeholder="请输入集采样品供货价,0.01-99999.99"
                validateFirst
                rules={[
                  { required: true, message: '请输入集采样品供货价,0.01-99999.99' },
                  () => ({
                    validator(_, value) {
                      if (!/^\d+\.?\d*$/g.test(value) || value <= 0 || value > 99999.99) {
                        return Promise.reject(new Error('请输入0.01-99999.99之间的数字'));
                      }
                      return Promise.resolve();
                    },
                  })
                ]}
              />
            </Col>

            <Col span={12}>
              <ProFormText
                width="md"
                name="sampleMinNum"
                label="样品起售量"
                placeholder="请输入集采样品起售量,1-999,默认为1"
                validateFirst
                rules={[
                  { required: true, message: '请输入集采样品起售量,1-999' },
                  () => ({
                    validator(_, value) {
                      if (!/^\d+$/g.test(value) || `${value}`.indexOf('.') !== -1 || value <= 0 || value > 999) {
                        return Promise.reject(new Error('请输入1-999之间的整数'));
                      }
                      return Promise.resolve();
                    },
                  })
                ]}
              />
            </Col>
            <ProFormDependency name={['sampleMinNum']}>
              {({ sampleMinNum }) => (
                <Col span={12}>
                  <ProFormText
                    width="md"
                    name="sampleMaxNum"
                    label="样品限售量"
                    placeholder="请输入集采样品限售量,1-999,大于等于起售量,默认为1"
                    validateFirst
                    rules={[
                      { required: true, message: '请输入集采样品起售量,1-999' },
                      () => ({
                        validator(_, value) {

                          if (value < sampleMinNum) {
                            return Promise.reject(new Error('限售量不能小于起售量'));
                          }

                          if (!/^\d+$/g.test(value) || `${value}`.indexOf('.') !== -1 || value <= 0 || value > 999) {
                            return Promise.reject(new Error('请输入1-999之间的整数'));
                          }
                          return Promise.resolve();
                        },
                      })
                    ]}
                    extra="每次最多可购买数量"
                  />
                </Col>
              )}
            </ProFormDependency>



            <Col span={12}>
              <ProFormRadio.Group
                name="sampleFreight"
                label="样品是否包邮"
                rules={[{ required: true }]}
                options={[
                  {
                    label: '包邮',
                    value: 1,
                  },
                  {
                    label: '不包邮',
                    value: 0,
                  },
                ]}
              />
            </Col>

            <ProFormDependency name={['sampleFreight']}>
              {({ sampleFreight }) => {
                return <>
                  {sampleFreight === 0 && <Col span={12}>
                    <Form.Item
                      name="sampleFreightId"
                      label="样品运费模板"
                      rules={[{ required: true, message: '请选择样品运费模板' }]}
                    >
                      <FreightTemplateSelect labelInValue />
                    </Form.Item>
                  </Col>}
                </>
              }}
            </ProFormDependency>
          </>
        }

        {goodsSaleType !== 1 && <Col span={12}>
          <ProFormRadio.Group
            name="isFreeFreight"
            label="是否包邮"
            rules={[{ required: true }]}
            options={[
              {
                label: '包邮',
                value: 1,
              },
              {
                label: '不包邮',
                value: 0,
              },
            ]}
          />
        </Col>}
        <ProFormDependency name={['isFreeFreight']}>
          {({ isFreeFreight }) => {
            return <>
              {!isFreeFreight &&
                <Col span={12}>
                  <Form.Item
                    name="freightTemplateId"
                    label="选择运费模板"
                    rules={[{ required: true, message: '请选择运费模板' }]}
                  >
                    <FreightTemplateSelect labelInValue />
                  </Form.Item>
                </Col>
              }
            </>
          }}
        </ProFormDependency>
      </Row>
    </ModalForm >
  );
};
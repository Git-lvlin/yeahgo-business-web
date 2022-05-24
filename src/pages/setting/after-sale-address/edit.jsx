import React, { useEffect } from 'react';
import { Form } from 'antd';
import {
  ModalForm,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-form';
import Address from './address';
import { addressAdd, addressEdit } from '@/services/setting/after-sale-address'


export default (props) => {
  const { visible, setVisible, supplierId, detailData, callback, onClose, } = props;
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

  const submit = (values) => {
    const { address, isDefault, status, ...rest } = values;
    const { province, city, area, info } = address;
    const apiMethod = detailData ? addressEdit : addressAdd
    return new Promise((resolve, reject) => {
      apiMethod({
        provinceId: province.id,
        cityId: city.id,
        areaId: area.id,
        detailAddress: info,
        address: `${province.name}${city.name}${area.name}${info}`,
        supplierId,
        isDefault: isDefault ? 1 : 0,
        status: status ? 1 : 0,
        id: detailData?.id,
        ...rest,
      }, { showSuccess: true })
        .then(res => {
          if (res.code === 0) {
            resolve()
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    });
  }

  useEffect(() => {

    if (detailData) {
      form.setFieldsValue({
        ...detailData,
        address: {
          provinceId: detailData.provinceId,
          cityId: detailData.cityId,
          areaId: detailData.areaId,
          info: detailData.detailAddress,
        }
      })
    }

  }, [form, detailData])

  return (
    <ModalForm
      title={`${detailData ? '编辑' : '新建'}售后地址`}
      modalProps={{
        onCancel: () => { form.resetFields(); onClose();},
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={600}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        callback();
        return true;
      }}
      {...formItemLayout}
      initialValues={{
        isDefault: true,
        status: true,
      }}
    >
      <ProFormText
        label="售后联系人"
        width="md"
        rules={[{ required: true, message: '请输入售后联系人！' }]}
        name="contactName"
        placeholder="请输入售后联系人！"
        fieldProps={{
          maxLength: 20
        }}
      />
      <ProFormText
        label="售后联系方式"
        width="md"
        rules={[{ required: true, message: '请输入售后联系方式！' }]}
        name="contactPhone"
        placeholder="请输入售后联系方式！"
        fieldProps={{
          maxLength: 30
        }}
      />
      <ProFormSwitch checkedChildren="是" unCheckedChildren="否" name="isDefault" label="默认售后地址" />
      <ProFormSwitch checkedChildren="开" unCheckedChildren="关" name="status" label="是否开启" />
      <Form.Item
        name="address"
        label="售后收货地址"
        rules={[{ required: true },
        () => ({
          validator(_, value = {}) {
            const { province, city, area, info } = value;
            if (!province || !city || !area || !info) {
              return Promise.reject(new Error('请填写售后收货地址'));
            }
            return Promise.resolve();
          },
        })]}
      >
        <Address />
      </Form.Item>
    </ModalForm >
  );
};
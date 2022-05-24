import React from 'react';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input } from 'antd';
import ProForm, {
  ProFormSwitch,
  ProFormText,
  ProFormRadio,
  ProFormCheckbox,
  ProFormRate,
  ProFormSelect,
  ProFormDigit,
  ProFormSlider,
  ProFormGroup,
} from '@ant-design/pro-form';
import Upload from '@/components/upload'
import { postageList } from '@/services/product-management/freight-template';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';
const columns = [
  {
    title: '消息编号',
    dataIndex: 'msgId',
    valueType: 'text',
  },
  {
    title: '消息名称',
    dataIndex: 'name',
    valueType: 'text',
  },
  {
    title: '消息模板-标题',
    dataIndex: 'title',
    valueType: 'text',
  },
  {
    title: '消息模板内容',
    dataIndex: 'content',
    valueType: 'option',
  },
  {
    title: '接收时间',
    dataIndex: 'sendTime',
    valueType: 'dateTime',
  }
]

const BusinessInformation = () => {
  return (
    <PageContainer>
      <div className={styles.box}>
        <div className={styles.head}>
          <div className={styles.title}>安徽黑小养食品科技有限公司（登录账号：heixiaoyangshiping）</div>
          <div className={styles.status}>当前状态：<b>待提交认证资料</b></div>
        </div>
        <div className={styles.upimg}>
        <ProForm
        layout='horizontal'
        >
        <Form.Item
        label="营业执照"
        name="primaryImages"
        required
        rules={[() => ({
          validator(_, value) {
            if (value && value.length >= 3) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('至少上传3张商品主图'));
          },
        })]}
        tooltip={
          <dl>
            <dt>图片要求</dt>
            <dd>1.图片大小1MB以内</dd>
            <dd>2.图片格式png/jpg/gif</dd>
          </dl>
        }
      >
        <Upload multiple maxCount={10} accept="image/*" dimension="1:1" size={500} />
      </Form.Item>
      <Form.Item
        label="相关资质"
        name="detailImages"
        rules={[{ required: true, message: '请上传商品详情图片' }]}
        tooltip={
          <dl>
            <dt>图片要求</dt>
            <dd>1.图片大小1MB以内</dd>
            <dd>2.图片格式png/jpg/gif</dd>
            <dd>2.图片数量20张以内</dd>
          </dl>
        }
      >
        <Upload multiple maxCount={10} accept="image/*" size={500 * 4} />
      </Form.Item>
      <ProFormText
        name="goodsName"
        label="负责人"
        disabled
      />
      <ProFormText
        name="goodsName"
        label="负责人手机号"
        disabled
      />
      </ProForm>
        </div>

      </div>
    </PageContainer>
  )
}
export default BusinessInformation;
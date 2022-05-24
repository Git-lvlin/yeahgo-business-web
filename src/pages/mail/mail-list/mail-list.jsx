import React from 'react';
import ProTable , { TableDropdown } from '@ant-design/pro-table';
import { messageList } from '@/services/mail/mail-list';
import { PageContainer } from '@ant-design/pro-layout';

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
    dataIndex: 'copywritingContent',
    valueType: 'text',
  },
  {
    title: '接收时间',
    dataIndex: 'sendTime',
    valueType: 'dateTime',
  }
]

const MList = () => {
  return (
    <PageContainer>
      <ProTable
        columns={columns}
        request={messageList}
        rowKey="msgId"
        toolBarRender={false}
        search={false}
        pagination={{
          pageSize: 10,
        }}
      />
    </PageContainer>
  )
}
export default MList;
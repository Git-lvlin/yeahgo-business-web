import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Tabs } from 'antd'
import tabList from './tab-list'

const { TabPane } = Tabs

const TableList = () => {
  return (
    <PageContainer
      title={ false }
    >
      <Tabs
        defaultActiveKey="1"
        style={{
          background: '#fff',
          padding: 25
        }}
      >
        <TabPane key="1" tab="待审核">
          {tabList({status:1})}
        </TabPane>
        <TabPane key="2" tab="处理中">
          {tabList({status:2})}
        </TabPane>
        <TabPane key="3" tab="已拒绝">
          {tabList({status:3})}
        </TabPane>
        <TabPane key="5" tab="已完成">
          {tabList({status:4})}
        </TabPane>
        <TabPane key="6" tab="已关闭">
          {tabList({status:5})}
        </TabPane>
      </Tabs>
    </PageContainer>
  )
}

export default TableList
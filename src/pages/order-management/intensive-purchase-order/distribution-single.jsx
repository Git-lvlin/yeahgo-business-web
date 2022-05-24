import React, { useEffect, useRef, useState } from 'react'
import {
  Space, 
  Button, 
  Typography,
  Drawer
} from 'antd'
import ReactToPrint from 'react-to-print'
import ProTable from '@ant-design/pro-table'
import { PrinterOutlined } from '@ant-design/icons'
import ProDescriptions from '@ant-design/pro-descriptions'

import { pendReceiptOrder } from '@/services/order-management/intensive-purchase-order';
import styles from './styles.less'
import './styles.less'

const Header = ({
  modalRef,
  change, 
  page,
  firstPage,
  setFirstPage
}) => {

  const [firstBtn, setFirstBtn] = useState(true)
  const [lastBtn, setLastBtn] = useState(false)

  useEffect(()=>{
    setLastBtn(firstPage === page ? true : false)
    return undefined
  },[page])

  const changePage = (type) => {
    if(type === 'next') {
      if((firstPage + 1) === page || firstPage === page) {
        setLastBtn(true)
      }
      if(firstPage !== page) {
        setFirstPage(firstPage + 1)
        setFirstBtn(false)
      } else {
        setLastBtn(true)
      }
    } else {
      if((firstPage - 1) === 1) {
        setFirstBtn(true)
      }
      if(firstPage === 1) {
        setFirstBtn(true)
      } else {
        setFirstPage(firstPage - 1)
        setLastBtn(false)
      }
    }
  }

  return (
    <div className={styles.title}>
      <Space size={20}>
        <ReactToPrint 
          trigger={() => <Button type='primary' icon={<PrinterOutlined />}>打印清单</Button>}
          content={() => modalRef.current}
        />
        <Button onClick={()=>{change(false)}}>取消</Button>
      </Space>
      <div className={styles.pagination}>
        <div className={styles.page}>{firstPage}/{page}</div>
        <Space size={10}>
          <a disabled={firstBtn} onClick={()=>changePage('last')}>上一个</a>
          <a disabled={lastBtn} onClick={()=>changePage('next')}>下一个</a>
        </Space>
      </div>
    </div>
  )
}

const DistributionSingle = ({
  isModalVisible,
  setVisible,
  orderId
}) => {
  const [page, setPage] = useState(0)
  const [data, setData] = useState([])
  const [firstPage, setFirstPage] = useState(1)

  const modalRef = useRef()

  useEffect(()=>{
    pendReceiptOrder({
      poNos: orderId
    }).then(res => {
      setPage(res?.data?.totalPage)
      setData(res?.data?.records)
    })
  }, [])

  const {Title, Paragraph, Text} = Typography

  const columns = [
    {
      title: '采购单号',
      dataIndex: 'poNo',
      align: 'center',
    },
    {
      title: '集约批次',
      dataIndex: 'wholesaleNo',
      align: 'center'
    },
    {
      title: '商品编码',
      dataIndex: 'skuId',
      align: 'center'
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
      render: (_)=> <div className={styles.goodsName}>{_}</div>
    },
    {
      title: '商品规格',
      dataIndex: 'skuName',
      align: 'center'
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center'
    },
    {
      title: '数量',
      dataIndex: 'totalNum',
      align: 'center'
    },
    {
      title: '每筐数量',
      dataIndex: '',
      align: 'center'
    },
    {
      title: '合计筐数',
      dataIndex: '',
      align: 'center'
    },
    {
      title: '备注',
      dataIndex: '',
      align: 'center'
    }
  ]

  const footerColums = [
    {
      title: '制单人签名',
      render: ()=> ' '
    },
    {
      title: '送货人签名',
      render: ()=> ' '
    },
    {
      title: '收货人签名',
      render: ()=> ' '
    },
    {
      title: '日期',
      render: ()=> data?.[firstPage - 1]?.exportTime
    },
    {
      title: '日期',
      render: ()=> ' '
    },
    {
      title: '日期',
      render: ()=> ' '
    },
  ]

  return (
    <Drawer
      width={1200}
      title={
        <Header 
          modalRef={modalRef} 
          change={setVisible}
          page={page}
          firstPage={firstPage}
          setFirstPage={setFirstPage}
        />
      }
      visible={isModalVisible}
      footer={false}
      onCancel={()=>setVisible(false)}
      closable={false}
    >
      <div ref={modalRef} className={styles.print}>
        <Title level={4} align='center'>发货清单</Title>
        <Text style={{textAlign: 'center', display:'block'}}>单号：{data?.[firstPage - 1]?.exportNo}</Text>
        <div className={styles.tableHead}>
          <Typography>
            <Paragraph>收货方：{data?.[firstPage - 1]?.companyName}</Paragraph>
            <Paragraph>联系人：{data?.[firstPage - 1]?.companyUserName}</Paragraph>
            <Paragraph>联系电话：{data?.[firstPage - 1]?.companyUserPhone}</Paragraph>
            <Paragraph>收货地址：{data?.[firstPage - 1]?.companyAddress}</Paragraph>
          </Typography>
          <Typography>
            <Paragraph>发货方：{data?.[firstPage - 1]?.supplierName}</Paragraph>
            <Paragraph>联系人：</Paragraph>
            <Paragraph>联系电话：</Paragraph>
            <Paragraph>收货地址：</Paragraph>
          </Typography>
        </div>
        <ProTable
          rowKey='poNo'
          columns={columns}
          search={false}
          pagination={false}
          toolBarRender={false}
          columnEmptyText={false}
          dataSource={data?.[firstPage - 1]?.list}
          bordered
        />
        <ProDescriptions
          className={styles.pagebreak}
          column={3}
          columns={footerColums}
          bordered
        />
      </div>
    </Drawer>
  )
}

export default DistributionSingle

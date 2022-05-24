import React,{ useEffect, useRef, useState } from 'react'
import { 
  Button, 
  Tooltip, 
  Form, 
  Space, 
  Pagination, 
  Spin, 
  Empty,
  Progress,
  Drawer
} from 'antd'
import ProForm, { ProFormDateTimeRangePicker } from '@ant-design/pro-form'
import ProCard from '@ant-design/pro-card'

import { findPage } from '@/services/import-file/import-file'
import moment from 'moment'
import styles from './styles.less'

const ImportHistroy = ({ show, setShow, type }) => {
  const [form] = Form.useForm()
  const [load, setLoad] = useState(false)
  const [pageTotal, setPageTotal] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [query, setQuery] = useState(0)
  const timer = useRef()
  const timeOut = useRef()
  const awaitTime = 3 * 60 * 1000   //TimeOut await times
  const pageChange = (a, b) => {
    clearInterval(timer.current)
    setPage(a)
    setPageSize(b)
  }
  const getData = ()=> {
    const { time, ...rest } = form.getFieldsValue()
    const user = localStorage.getItem("user")
    const rule = user&&JSON.parse(user).id === 1
    setLoad(true)
    findPage({
      page,
      code: type&& type,
      size: pageSize,
      searchByUser: rule ? 2 : 1 ,
      createStartTime: time&&moment(time[0]).format('YYYY-MM-DD HH:mm:ss'),
      createEndTime: time&&moment(time[1]).format('YYYY-MM-DD HH:mm:ss'),
      ...rest
    }).then(res => {
      if (res.success) {
        setData(res.data)
        setPageTotal(res.total)
      }
    }).finally(()=>{
      setLoad(false)
    })
  }

  useEffect(() => {
    if(show) {
      getData()
    }
    return ()=> {
      setData([])
    }
  }, [show, page, pageSize, form, query])

  useEffect(()=> {
    clearInterval(timer.current)
    if(show) {
      timer.current = setInterval(()=>{
        getData()
      }, 3000)
      return ()=> {
        clearInterval(timer.current)
        setData([])
      }
    }
  }, [page, show])
  useEffect(()=> {
    timeOut.current = setTimeout(()=> {
      clearInterval(timer.current)
    }, awaitTime)
    return ()=> {
      clearTimeout(timeOut.current)
    }
  }, [show])

  const ImportState = ({state, desc})=> {
    if(state === 1) {
      return (
        <div>处理中...</div>
      )
    } else if(state === 2) {
      return (
        <div>导入成功</div>
      )
    } else if(state === 3) {
      return (
        <Tooltip key="history" title={desc}>
          <div className={styles.fail}>
            导入失败
          </div>
        </Tooltip>
      )
    } else if(state === 4) {
      return (
        <div>取消导入</div>
      )
    } else {
      return ''
    }
  }
  const ImportResult = ({state, failNum, href, process})=> {
    if(state === 1) {
      return (
        <div className={styles.process}>
          <Progress percent={process} size="small" />
        </div>
      )
    }else if(state !== 1 && failNum > 0) {
      return (
        href ? <a href={href} className={styles.failRes}>失败结果下载</a> : ''
      )
    } else {
      return ''
    }
  }

  return (
    <>
      <Tooltip key="history" title="导入结果详情">
        <Button
          type='primary'
          onClick={() => {
            setShow(true)
          }}
        >
          ···
        </Button>
      </Tooltip>
      <Drawer
        title="结果列表"
        layout="inline"
        onClose={() => {
          setShow(false)
        }}
        form={form}
        width={1000}
        visible={show}
        forceRender={true}
        destroyOnClose={true}
      >
        <ProForm
          layout="inline"
          form={form}
          onFinish={() => {
            setPage(1)
            setQuery(query + 1)
          }}
          submitter={{
            render: ({ form }) => {
              return (
                <div>
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => {
                        form?.submit()
                      }}
                    >
                      查询
                    </Button>
                    <Button
                      onClick={() => {
                        form?.resetFields()
                      }}
                    >
                      重置
                    </Button>
                    <Button
                      onClick={() => {
                        setQuery(query + 1)
                      }}
                    >
                      刷新
                    </Button>
                  </Space>
                </div>
              )
            }
          }}
        >
          <ProFormDateTimeRangePicker
            name="time"
            label="导入时间"
          />
        </ProForm>
        <Spin delay={500} spinning={load}>
          {
            data.length === 0 &&
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
          {
            data.map(item => (
              <ProCard
                key={item.id}
                bordered
                className={styles.card}
              >
                <div className={styles.content}>
                  <div className={styles.tag}>执行数：<span className={styles.no}>{item.count}</span></div>
                  <div className={styles.tag}>成功数：<span className={styles.no}>{item.processCount}</span></div>
                  <div className={styles.tag}>失败数：<span className={styles.no}>{item.errorCount}</span></div>
                  <ImportState state={item.state} desc={item.exceptionDes}/>
                </div>
                <div className={styles.footer}>
                  <div className={styles.exportTime}>导入时间：{item.createTime}</div>
                  <ImportResult 
                    state={item.state}
                    failNum={item.errorCount}
                    href={item.errorFileUrl}
                    process={item.process}
                  />
                </div>
              </ProCard>
            ))
          }
        </Spin>
        <div className={styles.pagination}>
          <Pagination
            total={pageTotal}
            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`}
            pageSize={pageSize}
            current={page}
            onChange={pageChange}
          />
        </div>
      </Drawer>
    </>
  )
}

export default ImportHistroy
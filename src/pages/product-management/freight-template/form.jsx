import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Select, Form, Input, message } from 'antd';
import styles from './style.less';
import {
  ProFormText,
  DrawerForm,
  ProFormRadio,
  ProFormDependency,
  ProFormList,
} from '@ant-design/pro-form';
import { postageSave } from '@/services/product-management/freight-template'
import { amountTransform } from '@/utils/utils'
import AddressMultiCascader from '@/components/address-multi-cascader'
import Checkbox from './checkbox';

// import form from '../product-list/form';

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

const defaultArea = [
  {
    name: '华北',
    data: [1, 19, 37, 220],
    value: []
  },
  {
    name: '东北',
    data: [466, 585, 655],
    value: []
  },
  {
    name: '华东',
    data: [801, 820, 933, 1046, 1263, 1375],
    value: []
  },
  {
    name: '华南',
    data: [1168, 1964, 2162],
    value: []
  },
  {
    name: '华中',
    data: [1532, 1709, 1827],
    value: [],
  },
  {
    name: '西南',
    data: [2323, 2367, 2572, 2670],
    value: [],
  },
  {
    name: '西北',
    data: [2898],
    value: [],
  },
  {
    name: '偏远地区',
    data: [351, 2291, 2816, 3022, 3126, 3178, 3206],
    value: []
  },
  {
    name: '港澳台',
    data: [3716, 3738, 3325],
    value: []
  }
]

const test2 = [1, 19, 37, 220, 466, 585, 655, 801, 820, 933, 1046, 1263, 1375, 1168, 1964, 2162, 1532, 1709, 1827, 2323, 2367, 2572, 2670, 2898, 351, 2291, 2816, 3022, 3126, 3178, 3206, 3716, 3738, 3325];
const test = JSON.parse(JSON.stringify(defaultArea))
test2.forEach(item => {
  test.forEach(it => {
    if (it.data.includes(item)) {
      it.value.push(`${item}`);
    }
  })
})

const getAreaData = (v) => {
  const arr = [];
  v?.forEach?.(item => {
    let deep = 0;
    let node = window.yeahgo_area.find(it => it.id === +item);
    const nodeIds = [node.id];
    const nodeNames = [node.name]
    while (node.pid) {
      deep += 1;
      node = window.yeahgo_area.find(it => it.id === node.pid);
      nodeIds.push(node.id);
      nodeNames.push(node.name);
    }
    arr.push({
      provinceId: nodeIds[deep],
      cityId: deep > 0 ? nodeIds[deep - 1] : 0,
      districtId: deep > 1 ? nodeIds[deep - 2] : 0,
      areaName: nodeNames.reverse().join('')
    })
  })

  return arr;
}

export default (props) => {
  const { onClose, visible, setVisible, detailData, callback, supplierId } = props;
  const [form] = Form.useForm();
  const [byData, setByData] = useState(test);
  const [bySelect, setBySelect] = useState(test2.map(item => `${item}`))
  const [byUnSelect, setByUnSelect] = useState([])
  const [ffSelect, setFfSelect] = useState([])
  const [ffUnSelect, setFfUnSelect] = useState({})
  const [ffData, setFfData] = useState([])
  const [bbyData, setBbyData] = useState([])

  const submit = (values) => {
    const { expressName, ffData } = values;
    const area = []
    bbyData.forEach(item => {
      area.push(...getAreaData(item.data));
    })
    let notConfigure = {}

    if (area.length) {
      notConfigure = {
        aid: 0,
        area,
      }
    }

    const configure = ffData.map(item => {
      return {
        aid: 0,
        area: getAreaData(item.data),
        set: {
          price: amountTransform(item.price),
          nw: item.nw,
          add: item.add,
          addPrice: amountTransform(item.addPrice),
          oMoney: amountTransform(item.oMoney),
          oNw: item.oNw,
        }
      }
    })
    const params = {
      supplierId,
      id: detailData ? detailData.id : 0,
      expressName,
      freeArea: bySelect.map(item => +item),
      configure: configure || [],
      notConfigure: notConfigure || []
    };

    return new Promise((resolve, reject) => {
      postageSave(params, { showSuccess: true })
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

  const createFFdata = (data) => {
    const arr2 = [];
    data.forEach(item => {
      const findItem = window.yeahgo_area.find(it => it.id === +item);
      const findData = window.yeahgo_area.filter(it => it.pid === +item);
      const findFfData = form.getFieldValue('ffData').find(it => +it.id === +item) || {}
      if (!bbyData.find(it => +it.id === +item) || ffData.find(it => +it.id === +item)) {
        arr2.push({
          id: `${findItem.id}`,
          name: findItem.name,
          data: findData.map(it => `${it.id}`),
          value: findData.map(it => `${it.id}`),
          nw: 1,
          price: 8,
          add: 1,
          addPrice: 8,
          oNw: 99999,
          oMoney: 99999,
          ...findFfData,
        })
      }
    })
    form.setFieldsValue({
      ffData: arr2
    })
    setFfData(arr2)
  }

  const createBbyData = (data) => {
    const arr = [];
    for (const key in data) {
      arr.push(data[key])
    }
    setBbyData(arr)
  }

  const filterBbyData = (data) => {
    setBbyData(bbyData.filter(item => !data.includes(item.id)))
  }

  useEffect(() => {
    const json = {};
    for (const key in ffUnSelect) {
      if (byUnSelect.find(item => +item === +ffUnSelect[key].id)) {
        json[key] = ffUnSelect[key];
      }
    }
    setFfUnSelect(json)
  }, [byUnSelect])

  useEffect(() => {
    if (detailData) {
      setBySelect(detailData.freeArea.map(item => `${item}`));

      let notExpressCity = []

      const expressArea = detailData.expressArea.map(item => {
        const findItem = window.yeahgo_area.find(it => it.id === +item.citys?.[0]?.provinceId);
        notExpressCity.push(item.citys?.[0]?.provinceId)
        const configure = JSON.parse(item.configure)
        if (configure.price) {
          configure.price = amountTransform(configure.price, '/')
        }
        if (configure.addPrice) {
          configure.addPrice = amountTransform(configure.addPrice, '/')
        }
        if (configure.oMoney) {
          configure.oMoney = amountTransform(configure.oMoney, '/')
        }
        return {
          id: `${findItem?.id}`,
          name: findItem?.name,
          data: item.citys.map(it => `${it.cityId}`),
          value: item.citys.map(it => `${it.cityId}`),
          ...configure,
        }
      })


      form.setFieldsValue({
        expressName: detailData.expressName,
        ffData: expressArea,
      })

      setFfData(expressArea)

      const byInfo = JSON.parse(JSON.stringify(defaultArea))
      detailData.freeArea.forEach(item => {
        byInfo.forEach(it => {
          if (it.data.includes(item)) {
            it.value.push(`${item}`);
          }
        })
      })
      setByData(byInfo);

      const notExpressArea = {};

      detailData.notExpressArea.forEach(item => {
        const findItem = window.yeahgo_area.find(it => it.id === +item.provinceId);
        notExpressArea[findItem?.name] = {
          id: `${findItem?.id}`,
          name: findItem?.name,
          data: item.citys.map(it => `${it.cityId}`),
          value: item.citys.map(it => `${it.cityId}`),
        }
        notExpressCity.push(item.provinceId)
      })

      if (notExpressCity.length) {
        notExpressCity = [...new Set(notExpressCity)].map(v => `${v}`)
      }

      setByUnSelect(notExpressCity);
      setFfUnSelect(notExpressArea)
      createBbyData(notExpressArea)
      
    }
  }, [form, detailData])

  return (
    <DrawerForm
      title="模板编辑"
      // onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        width: window.innerWidth - 250,
        onClose: () => {
          onClose();
        },
      }}
      submitter={{
        render: (props, defaultDoms) => {
          if (detailData?.view) {
            return null;
          }
          return [
            ...defaultDoms
          ];
        },
      }}
      form={form}
      onFinish={async (values) => {
        try {
          await submit(values);
          callback();
          return true;
        } catch (error) {
          console.log('error', error)
        }

      }}
      visible={visible}
      initialValues={{
        ffData: []
      }}
      // onValuesChange={onValuesChange}
      {...formItemLayout}
    >
      <div style={{ minWidth: 1600 }}>
        <Form.Item
          name="expressName"
          label="模板名称"
          placeholder="请输入模板名称"
          rules={[{ required: true, message: '请输入模板名称' }]}
        >
          <Input maxLength={20} style={{ width: 300 }} disabled={detailData?.view} />
        </Form.Item>
        <ProCard split="horizontal" bordered headerBordered style={{ marginBottom: 20 }}>
          <ProCard split="vertical" className={styles.header}>
            <ProCard colSpan="100px" className={styles.card}></ProCard>
            <ProCard className={styles.card}>发货地区选择</ProCard>
            <ProCard colSpan="650px" className={styles.card}>运费配置</ProCard>
            <ProCard colSpan="400px" className={styles.card}>包邮条件</ProCard>
          </ProCard>
          <ProCard split="vertical" className={styles.normal}>
            <ProCard colSpan="100px" className={styles.card}>包邮发货地区</ProCard>
            <ProCard className={styles.normal}>
              {
                byData.map(item => {
                  return (
                    <Checkbox
                      onChange={(select, unselect) => {
                        let byUnSelectArr = JSON.parse(JSON.stringify(byUnSelect))
                        let bySelectArr = JSON.parse(JSON.stringify(bySelect))
                        bySelectArr.push(...select);
                        bySelectArr = [...new Set(bySelectArr)]
                        bySelectArr = bySelectArr.filter(it => !unselect.includes(it))
                        setBySelect(bySelectArr)
                        filterBbyData(bySelectArr);
                        byUnSelectArr.push(...unselect)
                        byUnSelectArr = [...new Set(byUnSelectArr)]
                        byUnSelectArr = byUnSelectArr.filter(it => !select.includes(it))
                        setByUnSelect(byUnSelectArr)
                        createFFdata(byUnSelectArr)
                      }}
                      key={item.name}
                      data={item}
                      wrapStyle={{ marginBottom: 10 }}
                      disabled={detailData?.view}
                    />
                  )
                })
              }
              <div style={{ color: '#0BC66F', position: 'absolute', bottom: 5, left: 25 }}>买家收货地址在包邮发货地区内，买家无需承担运费</div>
            </ProCard>
            <ProCard colSpan="650px" className={styles.card}>
            </ProCard>
            <ProCard colSpan="400px" className={styles.card}>
            </ProCard>
          </ProCard>
          <ProCard split="vertical" className={styles.normal}>
            <ProCard colSpan="100px" className={styles.card}>付费发货地区</ProCard>
            <ProCard split="horizontal" className={styles.normal}>
              <Form.List name={['ffData']}>
                {(fields) => (
                  <>
                    {fields.map(({ name }) => {
                      return (
                        <ProCard split="vertical" className={styles.normal} key={name}>
                          <ProCard className={styles.normal}>
                            <Checkbox
                              disabled={detailData?.view}
                              onChange={(select, unselect) => {
                                let arr = JSON.parse(JSON.stringify(form.getFieldValue('ffData')))
                                if (select.length === 0) {
                                  arr = arr.filter(it => it.name !== ffData[name].name)
                                } else {
                                  arr[name] = {
                                    ...arr[name],
                                    id: ffData[name].id,
                                    name: ffData[name].name,
                                    data: select,
                                    value: select,
                                  }
                                }
                                setFfData(arr);
                                form.setFieldsValue({
                                  ffData: arr
                                })
                                const obj = JSON.parse(JSON.stringify(ffUnSelect))
                                const arr2 = obj?.[ffData[name].name]?.data || []
                                obj[ffData[name].name] = {
                                  id: ffData[name].id,
                                  name: ffData[name].name,
                                  data: arr2.concat(unselect),
                                  value: arr2.concat(unselect)
                                }
                                setFfUnSelect(obj)
                                createBbyData(obj)
                              }}
                              data={ffData[name]}
                            />

                          </ProCard>
                          <ProCard colSpan="650px" className={styles.normal}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              第&nbsp;
                              <Form.Item
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: '请填写' }]}
                                name={[name, 'nw']}
                              >
                                <Input style={{ width: 80 }} disabled={detailData?.view} />
                              </Form.Item>
                              &nbsp;件内运费&nbsp;
                              <Form.Item
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: '请填写' }]}
                                name={[name, 'price']}
                              >
                                <Input style={{ width: 80 }} disabled={detailData?.view} />
                              </Form.Item>
                              &nbsp;元，每增加&nbsp;
                              <Form.Item name={[name, 'add']} style={{ marginBottom: 0 }} rules={[{ required: true, message: '请填写' }]}>
                                <Input style={{ width: 80 }} disabled={detailData?.view} />
                              </Form.Item>
                              &nbsp;件，增加运费&nbsp;
                              <Form.Item name={[name, 'addPrice']} style={{ marginBottom: 0 }} rules={[{ required: true, message: '请填写' }]}>
                                <Input style={{ width: 80 }} disabled={detailData?.view} />
                              </Form.Item>
                              &nbsp;元
                            </div>

                          </ProCard>
                          <ProCard colSpan="400px" className={styles.normal}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              满&nbsp;
                              <Form.Item
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: '请填写' }]}
                                name={[name, 'oNw']}
                              >
                                <Input style={{ width: 80 }} disabled={detailData?.view} />
                              </Form.Item>
                              &nbsp;件包邮或  满&nbsp;
                              <Form.Item
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: '请填写' }]}
                                name={[name, 'oMoney']}
                              >
                                <Input style={{ width: 80 }} disabled={detailData?.view} />
                              </Form.Item>
                              &nbsp; 元包邮
                            </div>
                          </ProCard>
                        </ProCard>
                      )
                    })}
                  </>
                )}
              </Form.List>
              <div style={{ color: '#C6A00B', position: 'absolute', bottom: 5, left: 25 }}>买家收货地址在付费发货地区内，由买家承担运费</div>
            </ProCard>

          </ProCard>
          <ProCard split="vertical" className={styles.normal}>
            <ProCard colSpan="100px" className={styles.card}>不发货地区</ProCard>
            <ProCard className={styles.normal}>
              {
                bbyData.map(item => {
                  return (
                    <Checkbox
                      disabled={detailData?.view}
                      data={item}
                      wrapStyle={{ marginBottom: 10 }}
                      key={item.name}
                      onChange={(select, unselect) => {
                        const obj = JSON.parse(JSON.stringify(form.getFieldValue('ffData')))
                        const findIndex = obj.findIndex(it => it.name === item.name)

                        if (findIndex !== -1) {
                          obj[findIndex] = {
                            ...obj[findIndex],
                            id: item.id,
                            name: item.name,
                            data: obj[findIndex].data.concat(unselect),
                            value: obj[findIndex].data.concat(unselect),
                          }
                        } else {
                          obj.push({
                            id: item.id,
                            name: item.name,
                            data: unselect,
                            value: unselect,
                            nw: 1,
                            price: 8,
                            add: 1,
                            addPrice: 8,
                            oNw: 99999,
                            oMoney: 99999,
                          })
                        }
                        setFfData(obj);
                        form.setFieldsValue({
                          ffData: obj
                        })

                        const obj2 = JSON.parse(JSON.stringify(ffUnSelect))

                        if (select.length === 0) {
                          delete obj2[item.name]
                        } else {
                          obj2[item.name] = {
                            name: item.name,
                            id: item.id,
                            data: obj2[item.name].data.filter(it => !unselect.includes(it)),
                            value: obj2[item.name].data.filter(it => !unselect.includes(it))
                          }
                        }
                        setFfUnSelect(obj2)
                        createBbyData(obj2)
                      }}
                    />
                  )
                })
              }
              <div style={{ color: '#863123', position: 'absolute', bottom: 5, left: 25 }}>不发货地区用户将无法购买产品</div>
            </ProCard>
          </ProCard>
        </ProCard>
      </div>
    </DrawerForm>
  );
};
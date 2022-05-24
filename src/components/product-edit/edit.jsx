import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Space, message, Modal, Popconfirm } from 'antd';
import {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
  ProFormDependency,
  ProFormSelect
} from '@ant-design/pro-form';
import { DeleteOutlined, EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Upload from '@/components/upload'
import { uploadImageFormatConversion, amountTransform } from '@/utils/utils'
import * as api from '@/services/product-management/product-list';
import NavigationPrompt from "react-router-navigation-prompt";
import styles from './edit.less'
import FormModal from './form';
import EditTable from './edit-table';
import GcCascader from '@/components/gc-cascader'
import BrandSelect from '@/components/brand-select'
import FreightTemplateSelect from '@/components/freight-template-select'
import ImageSort from './image-sort';
import Delivery from './delivery'
import { detailExt } from '@/services/common';
import Look from '@/components/look';
import { parse } from 'querystring';
import { history } from 'umi';
import CusInput from './cus-input'

const FromWrap = ({ value, onChange, content, right }) => (
  <div style={{ display: 'flex' }}>
    <div>{content(value, onChange)}</div>
    <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{right(value)}</div>
  </div>
)

export default (props) => {
  const { visible, setVisible, detailData, callback, onClose, supplierId } = props;
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [fresh, setFresh] = useState(false);
  const [ladderConfig, setLadderConfig] = useState(0);
  const [lookVisible, setLookVisible] = useState(false);
  const [lookData, setLookData] = useState(false);
  // const [areaData, setAreaData] = useState([]);
  // const [selectAreaKey, setSelectAreaKey] = useState([]);
  const [form] = Form.useForm()
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 16,
      },
    }
  };

  const urlsTransform = (urls) => {
    return urls.map((item, index) => {
      return {
        imageUrl: item,
        imageSort: index,
      }
    })
  }

  const cropImg = (urls) => {
    const arr = [];
    urls.forEach(item => {
      if (item.indexOf('?') === -1) {
        arr.push(item);
      } else {
        const url = item.split('?');
        const { imgHeight = 0, imgWidth = 0 } = parse(url[1]);
        if (imgHeight && imgWidth && imgHeight / imgWidth > 2) {
          const count = Math.ceil(imgHeight / imgWidth);
          for (let index = 0; index < count; index += 1) {
            if (index === count - 1) {
              arr.push(`${url[0]}?imgWidth=${imgWidth}&imgHeight=${imgHeight - index * imgWidth}&x-oss-process=image/crop,x_0,y_${index * imgWidth},w_${imgWidth},h_${imgHeight - index * imgWidth}&?x-oss-process=image/resize`)
            } else {
              arr.push(`${url[0]}?imgWidth=${imgWidth}&imgHeight=${imgWidth}&x-oss-process=image/crop,x_0,y_${index * imgWidth},w_${imgWidth},h_${imgWidth}&?x-oss-process=image/resize`)
            }
          }
        } else {
          arr.push(item);
        }
      }
    })
    return arr;
  }

  const getSubmitData = () => {
    const {
      videoUrl,
      gcId,
      primaryImages,
      detailImages,
      // advImages,
      isMultiSpec,
      // wholesalePrice,
      retailSupplyPrice,
      wholesaleSupplyPrice,
      sampleSupplyPrice,
      sampleSalePrice,
      // suggestedRetailPrice,
      salePrice,
      isFreeFreight,
      freightTemplateId,
      wholesaleFreight,
      wholesaleTaxRate,
      goodsSaleType,
      wholesaleMinNum,
      shipAddrs,
      sampleFreightId,
      wsStart,
      wsEnd,
      wsSupplyPrice,
      wsSupplyPrice2,
      batchNumber,
      // marketPrice,
      ...rest } = form.getFieldsValue();
    const { specValues1, specValues2 } = form.getFieldsValue(['specValues1', 'specValues2']);
    const specName = {};
    const specValues = {};
    const specData = {};
    let errorMsg = '';
    tableHead.forEach((item, index) => {
      if (item) {
        specName[index + 1] = item;
        if (!specValues[index + 1]) {
          specValues[index + 1] = {};
        }
        [specValues1, specValues2][index].forEach((item2, index2) => {
          specValues[index + 1][`${index + 1}0${index2 + 1}`] = item2?.name
        })
      }
    })

    tableData.forEach(item => {
      const {
        code,
        key,
        spec1,
        spec2,
        specValue,
        retailSupplyPrice: retailSupplyPrices,
        wholesaleSupplyPrice: wholesaleSupplyPrices,
        sampleSupplyPrice: sampleSupplyPrices,
        wholesaleFreight: wholesaleFreights,
        isFreeFreight: isFreeFreights,
        freightTemplateId: freightTemplateIds,
        sampleFreightId: sampleFreightIds,
        sampleSalePrice: sampleSalePrices,
        batchNumber,
        stage1,
        stage2,
        ...rests
      } = item;
      const obj = {};

      if (goodsSaleType !== 1) {
        obj.retailSupplyPrice = amountTransform(retailSupplyPrices)
      }

      if (goodsSaleType !== 2) {
        obj.wholesaleSupplyPrice = amountTransform(wholesaleSupplyPrices)
      }

      // if (wholesaleFreights) {
      // }
      obj.wholesaleFreight = amountTransform(wholesaleFreights)

      if (isFreeFreights || isFreeFreights === 0) {
        obj.isFreeFreight = isFreeFreights
      }

      if (freightTemplateIds) {
        obj.freightTemplateId = freightTemplateIds.value;
        obj.freightTemplateName = freightTemplateIds.label;
      }

      if (sampleFreightIds) {
        obj.sampleFreightId = sampleFreightIds.value;
        obj.sampleFreightName = sampleFreightIds.label;
      }

      if (sampleSupplyPrices) {
        obj.sampleSupplyPrice = amountTransform(sampleSupplyPrices)
      }

      if (sampleSalePrices) {
        obj.sampleSalePrice = sampleSalePrices
      }

      if (stage1?.wsStart && stage1?.wsEnd && stage1?.wsSupplyPrice && stage2?.wsSupplyPrice) {
        if (stage1?.wsStart % batchNumber !== 0 ||
          stage1?.wsStart / batchNumber < 2 ||
          stage1?.wsEnd % batchNumber !== 0 ||
          stage1?.wsEnd / batchNumber < 2
        ) {
          errorMsg = '优惠阶梯最低量和最高量录入的数值必须为集采箱规单位量的整数倍，且不能小于2倍'
        }

        if (`${stage1.wsSupplyPrice}`?.split?.('.')?.[1]?.length > 2 || `${stage2.wsSupplyPrice}`?.split?.('.')?.[1]?.length > 2) {
          errorMsg = '阶梯优惠价只能保留两位小数';
        }
        obj.ladderData = {
          1: {
            wsStart: stage1.wsStart,
            wsEnd: stage1.wsEnd,
            wsSupplyPrice: amountTransform(stage1.wsSupplyPrice),
            wsBatchSupplyPrice: amountTransform(stage1.wsSupplyPrice * batchNumber),
          },
          2: {
            wsStart: +stage1.wsEnd + 1,
            wsEnd: 999999,
            wsSupplyPrice: amountTransform(stage2.wsSupplyPrice),
            wsBatchSupplyPrice: amountTransform(stage2.wsSupplyPrice * batchNumber),
          }
        }
      }

      specData[code] = {
        ...rests,
        specValue,
        imageUrl: item?.imageUrl,
        batchNumber,
        ...obj,
      }
    })


    const obj = {
      draftId: detailData?.draftId,
      isMultiSpec,
      goods: {
        ...rest,
        gcId1: gcId?.[0],
        gcId2: gcId?.[1],
        wholesaleTaxRate: amountTransform(wholesaleTaxRate, '/'),
        goodsSaleType,
        batchNumber,
        isDrainage: detailData?.goods?.isDrainage || 0,
        goodsVirtualSaleNum: detailData?.goods?.goodsVirtualSaleNum,
        buyMaxNum: detailData?.goods?.buyMaxNum,
        buyMinNum: detailData?.goods?.buyMinNum,
      },
      primaryImages: primaryImages && urlsTransform(primaryImages),
      detailImages: detailImages && urlsTransform(cropImg(detailImages)),
      // advImages: advImages?.length ? urlsTransform(advImages) : null,
      videoUrl,
      shipAddrs: shipAddrs?.map?.(item => ({ shipId: item })),
      supplierId: supplierId || '',
      errorMsg,
    };

    if (goodsSaleType !== 2) {
      obj.goods.wholesaleFreight = amountTransform(wholesaleFreight)
      obj.goods.wholesaleMinNum = wholesaleMinNum
    }

    if (goodsSaleType !== 1) {
      obj.goods.isFreeFreight = isFreeFreight;
    }


    if (isMultiSpec) {
      obj.specName = specName;
      obj.specValues = specValues;

      obj.specData = specData;

    } else {
      if (goodsSaleType !== 1) {
        obj.goods.retailSupplyPrice = amountTransform(retailSupplyPrice);

        if (freightTemplateId) {
          obj.goods.freightTemplateId = freightTemplateId.value;
          obj.goods.freightTemplateName = freightTemplateId.label;
        }
      }
      if (sampleFreightId) {
        obj.goods.sampleFreightId = sampleFreightId.value;
        obj.goods.sampleFreightName = sampleFreightId.label;
      }
      if (sampleSupplyPrice) {
        obj.goods.sampleSupplyPrice = amountTransform(sampleSupplyPrice);
      }
      if (detailData?.goods?.sampleSalePrice) {
        obj.goods.sampleSalePrice = detailData?.goods?.sampleSalePrice;
      }
      obj.goods.wholesaleSupplyPrice = amountTransform(wholesaleSupplyPrice);
    }

    if (wsStart) {
      obj.goods.ladderData = {
        1: {
          wsStart,
          wsEnd,
          wsBatchSupplyPrice: amountTransform(wsSupplyPrice * batchNumber),
          wsSupplyPrice: amountTransform(wsSupplyPrice),
        },
        2: {
          wsStart: +wsEnd + 1,
          wsEnd: 999999,
          wsBatchSupplyPrice: amountTransform(wsSupplyPrice2 * batchNumber),
          wsSupplyPrice: amountTransform(wsSupplyPrice2),
        }
      }
    }

    if (detailData) {
      obj.supplierId = detailData.supplierId
      obj.storeNo = detailData.storeNo
      obj.goodsFromType = detailData.goodsFromType
      obj.spuId = detailData.spuId
      obj.goods.skuId = detailData.goods.skuId
    }

    return obj;
  }



  const draftSave = (cb) => {
    api.draftSave({
      ...getSubmitData(),
      draftId: detailData?.draftId || 0,
    }, { showSuccess: true })
      .then(res => {
        if (res.code === 0) {
          callback();
          setVisible(false);
          if (cb) {
            cb();
          }
        }
      })
  }

  const leaveTips = (onConfirm) => {
    if (detailData?.spuId) {
      onConfirm();
      return;
    }
    Modal.destroyAll();
    Modal.confirm({
      title: '确认离开当前页面',
      icon: <ExclamationCircleOutlined />,
      content: '保存到草稿箱下次可从草稿箱继续编辑，直接离开不保存下次需全部重新录入！',
      okText: '离开并保存到草稿箱',
      cancelText: '直接离开',
      onCancel: onConfirm,
      centered: true,
      onOk: () => {
        draftSave(() => { onConfirm() })
      }
    });
  }

  const submit = ({ isMultiSpec }) => {

    return new Promise((resolve, reject) => {

      if (tableData.length === 0 && isMultiSpec === 1) {
        message.error('请点击生成规格配置表生成数据')
        reject();
        return;
      }

      const apiMethod = detailData?.spuId && !detailData.isCopy ? api.editGoods : api.addGoods
      const obj = getSubmitData();
      if (obj.errorMsg) {
        message.error(obj.errorMsg)
        reject();
        return;
      }
      apiMethod(obj, { showSuccess: true, showError: true }).then(res => {
        if (res.code === 0) {
          resolve();
          callback();
        } else {
          reject();
        }
      })
    });
  }

  const createEditTableData = (data) => {
    const { specName1, specName2, specValues1, specValues2 } = form.getFieldsValue(['specName1', 'specName2', 'specValues1', 'specValues2']);
    const specArr = [];
    specValues1.forEach((item, index) => {
      if (specValues2[0]?.name) {
        specValues2.forEach((item2, index2) => {
          specArr.push({
            ...data,
            skuId: 0,
            spec1: item.name,
            spec2: item2.name,
            key: `${+new Date() + index2}10${index + 1}|20${index2 + 1}`,
            specValue: {
              1: `10${index + 1}`,
              2: `20${index2 + 1}`,
            },
            code: `i10${index + 1}|20${index2 + 1}`
          })
        })
      } else if (item) {
        specArr.push({
          ...data,
          skuId: 0,
          spec1: item.name,
          key: `${+new Date()}10${index + 1}`,
          specValue: {
            1: `10${index + 1}`,
          },
          code: `i10${index + 1}`
        })
      }

    })
    setTableHead([specName1, specName2])
    setTableData([])
    setTimeout(() => {
      setTableData(specArr)
    })
  }

  useEffect(() => {
    if (detailData) {
      const { goods, specName, specValues, specData, freightTemplateId, freightTemplateName, videoUrl, shipAddrs } = detailData;
      form.setFieldsValue({
        goodsName: goods.goodsName,
        wholesaleFreight: amountTransform(goods.wholesaleFreight, '/'),
        wholesaleTaxRate: amountTransform(goods.wholesaleTaxRate),
        // goodsDesc: goods.goodsDesc,
        supplierSpuId: goods.supplierSpuId,
        // goodsKeywords: goods.goodsKeywords,
        goodsSaleType: goods.goodsSaleType,
        isFreeFreight: goods.isFreeFreight,
        isMultiSpec: detailData.isMultiSpec,
        stockNum: goods.stockNum,
        stockAlarmNum: goods.stockAlarmNum,
        supplierSkuId: goods.supplierSkuId,
        // wholesaleMinNum: goods.wholesaleMinNum,
        // supportNoReasonReturn: goods.supportNoReasonReturn,
        // buyMinNum: goods.buyMinNum,
        // buyMaxNum: goods.buyMaxNum,
        goodsRemark: goods.goodsRemark,
        primaryImages: detailData.primaryImages && uploadImageFormatConversion(detailData.primaryImages, 'imageUrl'),
        detailImages: detailData.detailImages && uploadImageFormatConversion(detailData.detailImages, 'imageUrl'),
        // advImages: uploadImageFormatConversion(detailData.advImages, 'imageUrl'),
        videoUrl,
        brandId: goods.brandId === 0 ? null : goods.brandId,
        gcId: goods.gcId1 && [goods.gcId1, goods.gcId2],
        batchNumber: goods.batchNumber,
        unit: goods.unit,
        wsUnit: goods.wsUnit || '箱',
        totalStock: goods.totalStock,
        isSample: goods.isSample,
        sampleFreight: goods.sampleFreight,
        skuName: goods.skuName,
      })

      if (shipAddrs?.length) {
        form.setFieldsValue({
          shipAddrs: shipAddrs.map(item => item.shipId),
        })
      }

      if (freightTemplateId && freightTemplateName) {
        form.setFieldsValue({
          freightTemplateId: { label: freightTemplateName, value: freightTemplateId }
        })
      }

      if (goods.sampleFreightId && goods.sampleFreightName) {
        form.setFieldsValue({
          sampleFreightId: { label: goods.sampleFreightName, value: goods.sampleFreightId }
        })
      }

      if (detailData.isMultiSpec) {
        if (specName['1']) {
          form.setFieldsValue({
            specName1: specName['1'],
            specValues1: Object.values(specValues['1']).map(item => ({ name: item })),
          })
        }


        if (specName['2']) {
          form.setFieldsValue({
            specName2: specName['2'],
            specValues2: specValues['2'].length === 0 ? [{}] : Object.values(specValues['2']).map(item => ({ name: item })),
          })
        }
        const specValuesMap = {};
        Object.values(specValues).forEach(element => {
          const obj = Object.entries(element);
          obj.forEach(item => {
            // eslint-disable-next-line prefer-destructuring
            specValuesMap[item[0]] = item[1];
          })

        });
        setTableHead(Object.values(specName))
        setTableData([])
        setTimeout(() => {
          setTableData(Object.entries(specData).map(item => {
            const specDataKeys = item[0].substring(1).split('|');
            const specValue = {};
            specDataKeys.forEach(it => {
              const index = it.slice(0, 1)
              specValue[index] = it
            })
            const obj = {
              stage1: null,
              stage2: null,
            };
            const ladderData = item[1]?.ladderData;
            if (ladderData?.['1'] && ladderConfig) {
              obj.stage1 = {
                wsStart: ladderData['1'].wsStart,
                wsEnd: ladderData['1'].wsEnd,
                wsSupplyPrice: ladderData['1'].wsSupplyPrice / 100,
              }

              obj.stage2 = {
                wsStart: ladderData['2'].wsStart,
                wsEnd: ladderData['2'].wsEnd,
                wsSupplyPrice: ladderData['2'].wsSupplyPrice / 100,
              }
            }
            return {
              ...item[1],
              code: item[0],
              retailSupplyPrice: amountTransform(item[1].retailSupplyPrice, '/'),
              wholesaleSupplyPrice: amountTransform(item[1].wholesaleSupplyPrice, '/'),
              wholesaleFreight: amountTransform(item[1].wholesaleFreight, '/'),
              sampleSupplyPrice: amountTransform(item[1].sampleSupplyPrice, '/'),
              sampleSalePrice: item[1].sampleSalePrice,
              // wholesaleMinNum: item[1].wholesaleMinNum,
              // batchNumber: item[1].batchNumber,
              // isFreeFreight: item[1].isFreeFreight,
              freightTemplateId: item[1]?.freightTemplateId !== 0 ? { label: item[1]?.freightTemplateName, value: item[1]?.freightTemplateId } : undefined,
              sampleFreightId: item[1]?.sampleFreightId !== 0 ? { label: item[1]?.sampleFreightName, value: item[1]?.sampleFreightId } : undefined,
              // suggestedRetailPrice: amountTransform(item[1].suggestedRetailPrice, '/'),
              // wholesalePrice: amountTransform(item[1].wholesalePrice, '/'),
              // salePrice: amountTransform(item[1].salePrice, '/'),
              // marketPrice: amountTransform(item[1].marketPrice, '/'),
              key: item[1].skuId,
              imageUrl: item[1].imageUrl,
              spec1: specValuesMap[specDataKeys[0]],
              spec2: specValuesMap[specDataKeys[1]],
              specValue,
              ...obj,
            }
          }))
        });
      } else {
        form.setFieldsValue({
          // wholesalePrice: amountTransform(goods.wholesalePrice, '/'),
          // retailSupplyPrice: amountTransform(goods.retailSupplyPrice, '/'),
          // suggestedRetailPrice: amountTransform(goods.suggestedRetailPrice, '/'),
          retailSupplyPrice: amountTransform(goods.retailSupplyPrice, '/'),
          wholesaleSupplyPrice: amountTransform(goods.wholesaleSupplyPrice, '/'),
          sampleSupplyPrice: amountTransform(goods.sampleSupplyPrice, '/'),
          sampleSalePrice: goods.sampleSalePrice,
          wholesaleMinNum: goods.wholesaleMinNum,
          sampleMinNum: goods.sampleMinNum,
          sampleMaxNum: goods.sampleMaxNum,
          // marketPrice: amountTransform(goods.marketPrice, '/'),
        })

        if (goods.ladderData && ladderConfig) {
          const { ladderData } = goods;
          form.setFieldsValue({
            wsStart: ladderData['1'].wsStart,
            wsEnd: ladderData['1'].wsEnd,
            wsSupplyPrice: amountTransform(ladderData['1'].wsSupplyPrice, '/'),
            wsSupplyPrice2: amountTransform(ladderData['2'].wsSupplyPrice, '/'),
          })
        }
      }

      detailExt({
        supplierId: detailData.supplierId
      }).then(res => {
        if (res.code === 0) {
          form.setFieldsValue({
            wholesaleTaxRate: amountTransform(detailData?.goods?.wholesaleTaxRate || res?.data?.records?.defaultWholesaleTaxRate)
          })
        }
      })
    } else {
      detailExt({
        supplierId
      }).then(res => {
        if (res.code === 0) {
          form.setFieldsValue({
            wholesaleTaxRate: amountTransform(detailData?.goods?.wholesaleTaxRate || res?.data?.records?.defaultWholesaleTaxRate)
          })
        }
      })
    }

  }, [form, detailData, ladderConfig]);

  useEffect(() => {
    let totalStock = 0;
    tableData.forEach(item => {
      totalStock += +item.stockNum
    })
    if (totalStock) {
      form.setFieldsValue({
        totalStock,
      })
    }
  }, [tableData])


  useEffect(() => {
    api.searchUnit({
      page: 1,
      size: 9999,
    }).then(res => {
      if (res.code === 0) {
        setUnitData(res.data.records.map(item => ({ label: item.name, value: item.name, type: item.type })))
      }
    })

    api.getLadderConfig()
      .then(res => {
        if (res.code === 0) {
          setLadderConfig(res.data.records.ladderSwitch)
        }
      })
  }, [])

  return (
    <DrawerForm
      title={`${detailData?.spuId && !detailData.isCopy ? '编辑' : '新建'}商品`}
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        width: 1200,
        className: styles.drawer_form,
        onClose: () => {
          onClose();
        },
        keyboard: false,
        closable: false,
        maskClosable: false,
      }}
      form={form}
      onFinish={async (values) => {
        try {
          await submit(values);
          return true;
        } catch (error) {
          console.log('error', error);
        }
      }}
      submitter={{
        render: (props) => {
          return (
            <Space>
              <Button type="primary" onClick={() => { props.submit(); }}>
                提交审核
              </Button>
              {!detailData?.spuId && <Button onClick={() => { draftSave() }}>
                保存草稿箱
              </Button>}
              <Button
                key="look"
                onClick={(_) => {
                  const d = form.getFieldsValue();
                  if (d.primaryImages && d.detailImages) {
                    setLookData(d)
                    setLookVisible(true)
                  } else if (detailData.primaryImages && detailData.detailImages) {
                    setLookVisible(true)
                  } else {
                    message.error('请上传图片后预览')
                  }
                }}
              >
                预览
              </Button>
              <Button onClick={() => leaveTips(() => { setVisible(false); onClose(); })}>
                返回
              </Button>
            </Space>
          );
        },
      }}
      visible={visible}
      initialValues={{
        isMultiSpec: 0,
        goodsSaleType: 0,
        isFreeFreight: 1,
        // buyMinNum: 1,
        wholesaleTaxRate: 0,
        // buyMaxNum: 99,
        // supportNoReasonReturn: 1,
        specValues1: [{}],
        specValues2: [{}],
        area: [],
        batchNumber: 1,
        totalStock: 0,
        isSample: 0,
        unit: '件',
        wsUnit: '箱',
        sampleFreight: 1,
        sampleMinNum: 1,
        sampleMaxNum: 1,
      }}
      {...formItemLayout}
    >
      <ProFormDependency name={['goodsSaleType', 'isSample']}>
        {({ goodsSaleType, isSample }) => {
          return formModalVisible &&
            <FormModal
              visible={formModalVisible}
              setVisible={setFormModalVisible}
              getData={createEditTableData}
              goodsSaleType={goodsSaleType}
              isSample={isSample}
              form={form}
            />
        }}
      </ProFormDependency>
      <ProFormDependency name={['goodsName']}>
        {({ goodsName }) => {
          return (
            <ProFormText
              name="goodsName"
              label="商品名称"
              placeholder="请输入商品名称"
              validateFirst
              extra={
                <>
                  <div><span>标题规范：【标签】/品牌+品名+规格+卖点</span><span style={{ marginLeft: 10 }}>举例：立白 全自动浓缩洗衣粉 900g*1桶 去渍亮白持久留香</span></div>
                  {goodsName?.length < 20 && <div style={{ color: 'orange' }}>商品标题过于简单，不利于搜索露出/不利于用户购买决策，请在标题中补充更多商品信息，包括但不限于商品规格、品牌、卖点等</div>}
                </>
              }
              rules={[
                { required: true, message: '请输入商品名称' },
                () => ({
                  validator(_, value) {
                    if (!value.replace(/\s/g, '')) {
                      return Promise.reject(new Error('请输入商品名称'));
                    }
                    return Promise.resolve();
                  },
                })
              ]}
              fieldProps={{
                maxLength: 50,
              }}
            />
          )
        }}
      </ProFormDependency>

      <Form.Item
        label="商品品类"
        name="gcId"
        validateFirst
        rules={[
          { required: true, message: '请选择商品品类' },
        ]}
      >
        <GcCascader
          supplierId={supplierId || detailData?.supplierId}
          displayRender={label => {
            if (label?.[0]?.props) {
              form.setFieldsValue({ goodsSaleType: 1 })
              setFresh(label[0].props.children[1].type);
              return <span>{label[0].props.children[0]}/{label[1].props.children[0]}<span style={{ color: 'green' }}>({label[0].props.children[1].props.type === 1 ? '精装生鲜' : '散装生鲜'})</span></span>
            }
            setFresh(0);
            return label.join('/')
          }}
        />
      </Form.Item>


      <ProFormSelect
        name="wholesaleTaxRate"
        label="商品开票税率(%)"
        fieldProps={{
          allowClear: false,
        }}
        required
        options={[
          {
            label: '0%',
            value: 0
          },
          {
            label: '1%',
            value: 1
          },
          {
            label: '3%',
            value: 3
          },
          {
            label: '6%',
            value: 6
          },
          {
            label: '9%',
            value: 9
          },
          {
            label: '13%',
            value: 13
          }
        ]}
      />
      {/* <ProFormText
        name="goodsDesc"
        label="商品副标题"
        placeholder="请输入商品副标题"
        rules={[{ required: true, message: '请输入商品副标题' }]}
        fieldProps={{
          maxLength: 20,
        }}
      /> */}
      <ProFormText
        name="supplierSpuId"
        label="商品编号"
        placeholder="请输入商品编号"
        fieldProps={{
          maxLength: 32,
        }}
      />
      {/* <ProFormText
        name="goodsKeywords"
        label="搜索关键字"
        placeholder="请输入搜索关键字"
      /> */}

      <Form.Item
        name="brandId"
        label="品牌"
      >
        <BrandSelect />
      </Form.Item>

      <ProFormRadio.Group
        name="goodsSaleType"
        label="供货类型"
        rules={[{ required: true }]}
        options={[
          {
            label: '批发+零售',
            value: 0,
            disabled: fresh,
          },
          {
            label: '仅批发',
            value: 1,
          },
          {
            label: '仅零售',
            value: 2,
            disabled: fresh,
          },
        ]}
        fieldProps={{
          onChange: () => {
            if (fresh) {
              form.setFieldsValue({ goodsSaleType: 1 })
            }
          }
        }}
      />

      <ProFormDependency name={['goodsSaleType']}>
        {({ goodsSaleType }) => {
          return goodsSaleType !== 2 && <ProFormRadio.Group
            name="isSample"
            label="批发样品"
            rules={[{ required: true }]}
            options={[
              {
                label: '不支持样品售卖',
                value: 0,
              },
              {
                label: '支持样品售卖',
                value: 1,
              },
            ]}
          />
        }}
      </ProFormDependency>

      <ProFormRadio.Group
        name="isMultiSpec"
        label="规格属性"
        rules={[{ required: true }]}
        options={[
          {
            label: '单规格',
            value: 0,
          },
          {
            label: '多规格',
            value: 1,
          },
        ]}
      />

      <ProFormDependency name={['isMultiSpec']}>
        {({ isMultiSpec }) => {
          return isMultiSpec === 0 && <ProFormText
            name="skuName"
            label="规格名称"
            placeholder="请输入规格名称"
          />
        }}
      </ProFormDependency>

      <ProFormDependency name={['goodsSaleType', 'isMultiSpec']}>
        {({ goodsSaleType, isMultiSpec }) => {
          return (goodsSaleType !== 2 && isMultiSpec === 0) && <ProFormText
            name="wholesaleFreight"
            label="平均运费(元)"
            placeholder="请输入平均运费"
            validateFirst
            rules={[
              { required: true, message: '请输入平均运费' },
              // () => ({
              //   validator(_, value) {
              //     if (!/^\d+\.?\d*$/g.test(value) || value <= 0) {
              //       return Promise.reject(new Error('请输入大于零的数字'));
              //     }
              //     return Promise.resolve();
              //   },
              // })
            ]}
          />
        }}
      </ProFormDependency>


      <ProFormDependency name={['isMultiSpec', 'unit', 'wsUnit']}>
        {({ isMultiSpec, unit, wsUnit }) => {
          return isMultiSpec === 1 ?
            <>
              <ProFormSelect
                name="unit"
                label="商品单位"
                options={unitData.filter(item => item.type === 1)}
                fieldProps={{
                  showSearch: true,
                  allowClear: false,
                }}
                dependencies={['wsUnit']}
                validateFirst
                rules={[
                  { required: true, message: '请选择商品单位' },
                  // () => ({
                  //   validator(_, value) {
                  //     if (value === wsUnit) {
                  //       return Promise.reject(new Error('商品单位不能与集采商品单位相同'));
                  //     }
                  //     return Promise.resolve();
                  //   },
                  // })
                ]}
              />
              <ProFormSelect
                name="wsUnit"
                label="集采商品单位"
                options={unitData.filter(item => item.type === 2)}
                fieldProps={{
                  showSearch: true,
                  allowClear: false,

                }}
                dependencies={['unit']}
                validateFirst
                rules={[
                  { required: true, message: '请选择集采商品单位' },
                  // () => ({
                  //   validator(_, value) {
                  //     if (value === unit) {
                  //       return Promise.reject(new Error('集采商品单位不能与商品单位相同'));
                  //     }
                  //     return Promise.resolve();
                  //   },
                  // })
                ]}
              />
              <ProFormText
                name="specName1"
                label="规格一"
                placeholder="请输入规格名称"
                rules={[{ required: true, message: '请输入规格名称' }]}
                fieldProps={{
                  maxLength: 18,
                }}
                extra='示例：包装、重量、尺寸等'
              />
              <Form.List name="specValues1">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => {
                      return (
                        <Form.Item
                          key={key}
                          label=" "
                          name={[name, 'name']}
                          colon={false}
                          extra='示例：盒装/袋装、200g/300g、22码/24码等'
                        >
                          <Input placeholder="请输入规格属性" maxLength={18} addonAfter={
                            key === 0 ?
                              <Button type="primary" onClick={() => { add() }}>添加</Button>
                              :
                              <Popconfirm
                                title="删除规格属性后需要点击生成规格配置表生成数据"
                                placement="topRight"
                                onConfirm={() => {
                                  remove(name)
                                  setTableHead([])
                                  setTableData([])
                                }}
                              >
                                <Button type="primary" danger>删除</Button>
                              </Popconfirm>
                          } />
                        </Form.Item>
                      )
                    })}
                  </>
                )}
              </Form.List>
              <ProFormText
                name="specName2"
                label="规格二"
                placeholder="请输入规格名称"
                extra='示例：包装、重量、尺寸等'
              />
              <Form.List name="specValues2">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => {
                      return (
                        <Form.Item
                          key={key}
                          label=" "
                          name={[name, 'name']}
                          colon={false}
                          extra='示例：盒装/袋装、200g/300g、22码/24码等'
                        >
                          <Input maxLength={18} placeholder="请输入规格属性" addonAfter={
                            key === 0 ?
                              <Button type="primary" onClick={() => { add() }}>添加</Button>
                              :
                              <Popconfirm
                                title="删除规格属性后需要点击生成规格配置表生成数据"
                                placement="topRight"
                                onConfirm={() => {
                                  remove(name)
                                  setTableHead([])
                                  setTableData([])
                                }}
                              >
                                <Button type="primary" danger>删除</Button>
                              </Popconfirm>
                          } />
                        </Form.Item>
                      )
                    })}
                  </>
                )}
              </Form.List>
              <ProFormDependency name={['specName1', 'specValues1']}>
                {({ specName1, specValues1 }) => (
                  <Form.Item
                    label=" "
                    colon={false}
                  >
                    <Button
                      type="primary"
                      onClick={() => {
                        if (!specName1 || !specValues1[0].name) {
                          message.error('请填写规格属性');
                          return;
                        }
                        setFormModalVisible(true)
                      }}>生成规格配置表</Button>
                  </Form.Item>
                )}
              </ProFormDependency>
              <Form.Item
                label="规格配置表"
              >
                重新编辑规格名和规格值后请重新点击生成规格配置表，重新批量填写规格参数也请重新点击生成规格配置表
                <Button
                  type="primary"
                  onClick={() => {
                    if (!tableData.length) {
                      message.error('请先点击生成规格配置表！');
                      return;
                    }
                    setFormModalVisible(true)
                  }}>批量填写</Button>
              </Form.Item>
              <ProFormDependency name={['goodsSaleType', 'isSample']}>
                {
                  ({ goodsSaleType, isSample }) => (
                    <div
                      onClick={() => {
                        if (!tableHead.length) {
                          message.error('请先点击生成规格配置表！');
                        }
                      }}
                    >
                      <EditTable
                        goodsSaleType={goodsSaleType}
                        tableHead={tableHead}
                        tableData={tableData}
                        setTableData={setTableData}
                        isSample={isSample}
                        wsUnit={wsUnit}
                        unit={unit}
                        ladderConfig={ladderConfig}
                      />
                    </div>
                  )
                }
              </ProFormDependency>
              <ProFormText
                name="totalStock"
                label="总可用库存"
                disabled
                fieldProps={{
                  addonAfter: `${unit}`
                }}
              />

              <Form.Item
                label="发货地"
                name="shipAddrs"
              >
                <FromWrap
                  content={(value, onChange) => (<Delivery style={{ width: 680 }} value={value} onChange={onChange} supplierId={supplierId || detailData?.supplierId} />)}
                  right={() => (<a onClick={() => { history.push('/product-management/ship-address-management') }}>发货地管理</a>)}
                />
              </Form.Item>
            </>
            :
            <>
              <ProFormText
                name="supplierSkuId"
                label="货号"
                placeholder="请输入货号"
              // rules={[{ required: true, message: '请输入货号' }]}
              />
              <ProFormText
                name="stockNum"
                label="可用库存"
                placeholder="请输入可用库存"
                validateFirst
                rules={[
                  { required: true, message: '请输入可用库存数量' },
                  // () => ({
                  //   validator(_, value) {
                  //     if (!/^\d+$/g.test(value) || `${value}`.indexOf('.') !== -1 || value <= 0) {
                  //       return Promise.reject(new Error('请输入大于零的正整数'));
                  //     }
                  //     return Promise.resolve();
                  //   },
                  // })
                ]}
                fieldProps={{
                  addonAfter: `${unit}`
                }}
              />
              <ProFormSelect
                name="unit"
                label="商品单位"
                options={unitData.filter(item => item.type === 1)}
                fieldProps={{
                  showSearch: true,
                  allowClear: false,
                }}
                dependencies={['wsUnit']}
                validateFirst
                rules={[
                  { required: true, message: '请选择商品单位' },
                  // () => ({
                  //   validator(_, value) {
                  //     if (value === wsUnit) {
                  //       return Promise.reject(new Error('商品单位不能与集采商品单位相同'));
                  //     }
                  //     return Promise.resolve();
                  //   },
                  // })
                ]}
              />
              <Form.Item
                label="发货地"
                name="shipAddrs"
              >
                <FromWrap
                  content={(value, onChange) => (<Delivery style={{ width: 680 }} value={value} onChange={onChange} supplierId={supplierId || detailData?.supplierId} />)}
                  right={() => (<a onClick={() => { history.push('/product-management/ship-address-management') }}>发货地管理</a>)}
                />
              </Form.Item>
              <ProFormText
                name="stockAlarmNum"
                label="库存预警值"
                placeholder="请输入数字 可用库存小于等于此值时提醒"
                validateFirst
                rules={[
                  { required: true, message: '请输入库存预警值' },
                  () => ({
                    validator(_, value) {
                      if ((!/^\d+$/g.test(value) || `${value}`.indexOf('.') !== -1 || value <= 0) && value !== '' && value !== undefined) {
                        return Promise.reject(new Error('请输入大于零的正整数'));
                      }
                      return Promise.resolve();
                    },
                  })
                ]}
              />
              <ProFormDependency name={['goodsSaleType']}>
                {({ goodsSaleType }) => {
                  return (goodsSaleType !== 1) && <ProFormText
                    name="retailSupplyPrice"
                    label="一件代发供货价"
                    placeholder="请输入一件代发供货价"
                    validateFirst
                    fieldProps={{
                      addonAfter: `元/${unit}`
                    }}
                    rules={[
                      { required: true, message: '请输入一件代发供货价' },
                      () => ({
                        validator(_, value) {
                          if (!/^\d+\.?\d*$/g.test(value) || value <= 0) {
                            return Promise.reject(new Error('请输入大于零的数字'));
                          }
                          return Promise.resolve();
                        },
                      })
                    ]}
                  />
                }}
              </ProFormDependency>
              <ProFormDependency name={['goodsSaleType', 'sampleMinNum', 'isSample', 'sampleFreight']}>
                {({ goodsSaleType, sampleMinNum, isSample, sampleFreight }) => {
                  return goodsSaleType !== 2 &&
                    <>
                      <ProFormText
                        name="wholesaleSupplyPrice"
                        label="集采供货价"
                        placeholder="请输入集采供货价"
                        validateFirst
                        fieldProps={{
                          addonAfter: `元/${unit}`
                        }}
                        rules={[
                          { required: true, message: '请输入集采供货价' },
                          () => ({
                            validator(_, value) {
                              if (!/^\d+\.?\d*$/g.test(value) || value <= 0) {
                                return Promise.reject(new Error('请输入大于零的数字'));
                              }
                              return Promise.resolve();
                            },
                          })
                        ]}
                      />
                      {!!ladderConfig && <Form.Item
                        label="集采阶梯优惠"
                      >
                        <CusInput />
                      </Form.Item>}
                      <ProFormText
                        name="batchNumber"
                        label="集采箱规单位量"
                        placeholder="请输入店主集约采购下单的加购倍数单位量，范围1-9999"
                        validateFirst
                        fieldProps={{
                          addonAfter: `${unit}/${wsUnit}`
                        }}
                        rules={[
                          { required: true, message: '请输入集采箱规单位量' },
                          () => ({
                            validator(_, value) {
                              if (!/^\d+$/g.test(value) || `${value}`.indexOf('.') !== -1 || value <= 0 || value > 9999) {
                                return Promise.reject(new Error('请输入1-9999之间的整数'));
                              }
                              return Promise.resolve();
                            },
                          })
                        ]}
                      />
                      <ProFormSelect
                        name="wsUnit"
                        label="集采商品单位"
                        options={unitData.filter(item => item.type === 2)}
                        fieldProps={{
                          showSearch: true,
                          allowClear: false,

                        }}
                        dependencies={['unit']}
                        validateFirst
                        rules={[
                          { required: true, message: '请选择集采商品单位' },
                          // () => ({
                          //   validator(_, value) {
                          //     if (value === unit) {
                          //       return Promise.reject(new Error('集采商品单位不能与商品单位相同'));
                          //     }
                          //     return Promise.resolve();
                          //   },
                          // })
                        ]}
                      />
                      <ProFormText
                        name="wholesaleMinNum"
                        label="最低批发量"
                        placeholder="请输入最低批发量"
                        validateFirst
                        rules={[
                          { required: true, message: '请输入最低批发量' },
                          () => ({
                            validator(_, value) {
                              if (!/^\d+$/g.test(value) || `${value}`.indexOf('.') !== -1 || value <= 0) {
                                return Promise.reject(new Error('请输入大于零的整数'));
                              }
                              return Promise.resolve();
                            },
                          })
                        ]}
                        fieldProps={{
                          addonAfter: `${unit}`
                        }}
                      />
                      {
                        isSample === 1
                        &&
                        <>
                          <ProFormText
                            name="sampleSupplyPrice"
                            label="样品供货价"
                            placeholder="请输入集采样品供货价,0.01-99999.99"
                            validateFirst
                            fieldProps={{
                              addonAfter: `元/${unit}`
                            }}
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
                          <ProFormText
                            name="sampleMinNum"
                            label="样品起售量"
                            fieldProps={{
                              addonAfter: `${unit}`
                            }}
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
                          <ProFormText
                            name="sampleMaxNum"
                            label="样品限售量"
                            placeholder="请输入集采样品限售量,1-999,大于等于起售量,默认为1"
                            validateFirst
                            fieldProps={{
                              addonAfter: `${unit}`
                            }}
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
                          {sampleFreight === 0 && <Form.Item
                            label="样品运费模板"
                            name="sampleFreightId"
                            rules={[{ required: true, message: '请选择样品运费模板' }]}
                          >
                            <FromWrap
                              content={(value, onChange) => (<FreightTemplateSelect style={{ width: 680 }} value={value} onChange={onChange} labelInValue />)}
                              right={() => (<a onClick={() => { history.push('/product-management/freight-template') }}>运费模板管理</a>)}
                            />
                          </Form.Item>}

                        </>
                      }
                    </>
                }}
              </ProFormDependency>
            </>
        }}
      </ProFormDependency>
      {/* <ProFormText
        name="buyMinNum"
        label="单SKU起售数量"
        placeholder="请输入单SKU起售数量"
        rules={[
          { required: true, message: '请输入单SKU起售数量' },
          () => ({
            validator(_, value) {
              if (!/^\d+$/g.test(value) || `${value}`.indexOf('.') !== -1 || value <= 0) {
                return Promise.reject(new Error('请输入大于零的正整数'));
              }
              return Promise.resolve();
            },
          })
        ]}
      /> */}
      {/* <ProFormText
        name="buyMaxNum"
        label="单次最多零售购买数量"
        placeholder="请输入单次最多零售购买数量"
      /> */}
      <ProFormDependency name={['goodsSaleType', 'isFreeFreight', 'isMultiSpec']}>
        {({ goodsSaleType, isFreeFreight, isMultiSpec }) => {
          return <>
            {
              goodsSaleType !== 1 && isMultiSpec === 0 && <ProFormRadio.Group
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
            }
            {goodsSaleType !== 1 && !isFreeFreight && isMultiSpec === 0 && <Form.Item
              label="运费模板"
              name="freightTemplateId"
              rules={[{ required: true, message: '请选择运费模板' }]}
            >
              <FromWrap
                content={(value, onChange) => (<FreightTemplateSelect style={{ width: 680 }} value={value} onChange={onChange} labelInValue />)}
                right={() => (<a onClick={() => { history.push('/product-management/freight-template') }}>运费模板管理</a>)}
              />
            </Form.Item>}



            {/* <ProFormRadio.Group
              name="supportNoReasonReturn"
              label="七天无理由退货"
              rules={[{ required: true }]}
              disabled={goodsSaleType === 1}
              options={[
                {
                  label: '支持',
                  value: 1,
                },
                {
                  label: '不支持',
                  value: 0,
                },
              ]}
            /> */}
          </>
        }}
      </ProFormDependency>

      <ProFormTextArea
        name="goodsRemark"
        label="特殊说明"
      />
      {/* <Form.Item
        label="不发货地区"
      >
        <MultiCascader
          value={selectAreaKey}
          data={areaData}
          style={{ width: '100%' }}
          placeholder="请选择不发货地区"
          renderValue={(a, b) => renderMultiCascaderTag(b)} locale={{ searchPlaceholder: '输入省市区名称' }}
          onChange={setSelectAreaKey}
        />
      </Form.Item> */}
      <Form.Item
        label="商品主图"
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
      >
        <FromWrap
          content={(value, onChange) => <Upload sort={!detailData} value={value} onChange={onChange} multiple maxCount={50} accept="image/*" dimension="1:1" size={1024} />}
          right={(value) => {
            return (
              <dl>
                <dt>图片要求</dt>
                <dd>1.图片大小1MB以内</dd>
                <dd>2.图片比例1:1</dd>
                <dd>3.图片格式png/jpg/gif</dd>
                <dd>4.至少上传3张</dd>
                {value?.length > 1 && <dd><ImageSort data={value} callback={(v) => { form.setFieldsValue({ primaryImages: v }) }} /></dd>}
              </dl>
            )
          }}
        />
      </Form.Item>
      <Form.Item
        label="商品详情"
        name="detailImages"
        rules={[{ required: true, message: '请上传商品详情图片' }]}
      >
        <FromWrap
          content={(value, onChange) => <Upload sort={!detailData} value={value} onChange={onChange} multiple maxCount={50} accept="image/*" size={1024 * 10} />}
          right={(value) => (
            <dl>
              <dt>图片要求</dt>
              <dd>1.图片大小10MB以内</dd>
              <dd>2.图片格式png/jpg/gif</dd>
              {value?.length > 1 && <dd><ImageSort data={value} callback={(v) => { form.setFieldsValue({ detailImages: v }) }} /></dd>}
            </dl>
          )}
        />

      </Form.Item>
      {/* <Form.Item
        label="商品横幅"
        name="advImages"
        tooltip={
          <dl>
            <dt>图片要求</dt>
            <dd>1.图片大小500kb以内</dd>
            <dd>2.图片尺寸702*320px</dd>
            <dd>3.图片格式png/jpg/gif</dd>
            <dd>注：商品横幅用于VIP商品推广，非必填</dd>
          </dl>
        }
      >
        <Upload multiple maxCount={10} accept="image/*" dimension={{ width: 702, height: 320 }} size={500} />
      </Form.Item> */}
      <Form.Item
        label="商品视频"
        name="videoUrl"
      >
        <FromWrap
          content={(value, onChange) => {
            return (
              <Upload
                value={value}
                onChange={onChange}
                maxCount={1}
                accept="video/mp4"
                size={1024 * 20}
                itemRender={(originNode, file, fileList, actions) => {
                  return (
                    <div className={styles.video_preview}>
                      <video width="100%" height="100%" src={file?.url} />
                      <div>
                        <EyeOutlined onClick={() => { window.open(file?.url, '_blank') }} style={{ color: '#fff', marginRight: 10, cursor: 'pointer' }} />
                        <DeleteOutlined
                          onClick={() => {
                            actions.remove();
                          }}
                          style={{ color: '#fff', cursor: 'pointer' }} />
                      </div>
                    </div>
                  )
                }} />
            )
          }}
          right={() => (
            <dl>
              <dt>视频要求</dt>
              <dd>1.视频大小20MB以内</dd>
              <dd>2.视频格式mp4</dd>
            </dl>
          )}
        />
      </Form.Item>
      <>
        {
          detailData && !detailData?.isCopy
          &&
          <>
            {
              detailData?.goods?.createTimeDisplay &&
              <Form.Item
                label="创建时间"
              >
                {detailData.goods.createTimeDisplay}
              </Form.Item>
            }

            {detailData?.goods?.goodsVerifyStateDisplay && <Form.Item
              label="审核状态"
            >
              {detailData?.goods?.goodsVerifyStateDisplay}
            </Form.Item>}

            {detailData?.goods?.goodsStateDisplay && <Form.Item
              label="上架状态"
            >
              {detailData?.goods?.goodsStateDisplay}
            </Form.Item>}

            {detailData?.goods?.goodsState === 0 && <Form.Item
              label="下架原因"
            >
              <span style={{ color: 'red' }}>{detailData.goods.goodsVerifyRemark}</span>
            </Form.Item>}
          </>
        }
      </>

      {lookVisible && <Look
        visible={lookVisible}
        setVisible={setLookVisible}
        dataList={lookData || detailData}
        callback={(text) => { console.log('callback', text) }}
      />}
      <NavigationPrompt when={!detailData?.spuId}>
        {({ onConfirm }) => {
          leaveTips(() => { onConfirm(); onClose(); })
        }}
      </NavigationPrompt>
    </DrawerForm>
  );
};

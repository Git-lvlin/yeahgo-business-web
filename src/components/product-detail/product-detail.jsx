import React, { useState, useEffect } from 'react';
import { Form, Image, Tag } from 'antd';
import { amountTransform } from '@/utils/utils'
import EditTable from './table';
import styles from './edit.less'
import { EyeOutlined } from '@ant-design/icons'

export default (props) => {
  const { detailData } = props;
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);

  const { goods } = detailData;
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

  useEffect(() => {
    if (detailData) {
      const { specName, specValues, specData } = detailData;

      if (detailData.isMultiSpec) {
        const specValuesMap = {};
        Object.values(specValues).forEach(element => {
          const obj = Object.entries(element);
          obj.forEach(item => {
            // eslint-disable-next-line prefer-destructuring
            specValuesMap[item[0]] = item[1];
          })

        });
        setTableHead(Object.values(specName))
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
          if (ladderData?.['1']) {
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
            wholesaleMinNum: item[1].wholesaleMinNum,
            sampleSupplyPrice: item[1].sampleSupplyPrice / 100,
            salePriceFloat: amountTransform(item[1].salePriceFloat),
            salePriceProfitLoss: amountTransform(item[1].salePriceProfitLoss, '/'),
            // suggestedRetailPrice: amountTransform(item[1].suggestedRetailPrice, '/'),
            // wholesalePrice: amountTransform(item[1].wholesalePrice, '/'),
            salePrice: amountTransform((detailData.settleType === 1 || detailData.settleType === 0) ? item[1].retailSupplyPrice : item[1].salePrice, '/'),
            marketPrice: amountTransform(item[1].marketPrice || item[1].retailSupplyPrice, '/'),
            wholesaleFreight: amountTransform(item[1].wholesaleFreight, '/'),
            batchNumber: item[1].batchNumber,
            isFreeFreight: item[1].isFreeFreight,
            freightTemplateId: item[1].freightTemplateName ? { label: item[1].freightTemplateName, value: item[1].freightTemplateId } : undefined,
            key: item[1].skuId,
            imageUrl: item[1].imageUrl,
            spec1: specValuesMap[specDataKeys[0]],
            spec2: specValuesMap[specDataKeys[1]],
            specValue,
            ...obj,
          }
        }))
      }
    }

  }, [detailData]);

  return (
    <Form
      {...formItemLayout}
      style={{ backgroundColor: '#fff', padding: 20, paddingTop: 50, paddingBottom: 100 }}
    >
      <Form.Item
        label="商品名称"
      >
        {goods.goodsName}
      </Form.Item>
      <Form.Item
        label="发票税率(%)"
      >
        {amountTransform(goods.wholesaleTaxRate)}
      </Form.Item>
      {/* <Form.Item
        label="商品副标题"
      >
        {goods.goodsDesc}
      </Form.Item>
      <Form.Item
        label="搜索关键字"
      >
        {goods.goodsKeywords}
      </Form.Item> */}
      <Form.Item
        label="商品品类"
      >
        {`${goods.gcId1Display}/${goods.gcId2Display}`}{detailData.fresh !== 0 && <span style={{ color: 'green' }}>({{ 1: '精装生鲜', 2: '散装生鲜' }[detailData.fresh]})</span>}
      </Form.Item>
      <Form.Item
        label="商品编号"
      >
        {goods.supplierSpuId}
      </Form.Item>
      <Form.Item
        label="商品品牌"
      >
        {goods.brandIdDisplay}
      </Form.Item>
      <Form.Item
        label="供货类型"
      >
        {{ 0: '批发+零售', 1: '仅批发', 2: '仅零售' }[goods.goodsSaleType]}
      </Form.Item>
      {goods.goodsSaleType !== 2 && <Form.Item
        label="批发样品"
      >
        {{ 0: '不支持样品售卖', 1: '支持样品售卖' }[goods.isSample]}
      </Form.Item>}
      <Form.Item
        label="结算模式"
      >
        {{ 1: '佣金模式', 2: '底价模式' }[detailData.settleType]}
      </Form.Item>
      <Form.Item
        label="规格属性"
      >
        {{ 0: '单规格', 1: '多规格' }[detailData.isMultiSpec]}
      </Form.Item>
      {
        detailData.isMultiSpec === 0 &&
        <Form.Item
          label="规格名称"
        >
          {goods.skuName}
        </Form.Item>
      }
      {
        goods.goodsSaleType !== 2 && detailData.isMultiSpec === 0 &&
        <Form.Item
          label="平均运费"
        >
          {amountTransform(goods.wholesaleFreight, '/')}元/{goods.unit}
        </Form.Item>
      }
      {
        detailData.isMultiSpec === 1
          ?
          <>
            {!!tableData.length &&
              <EditTable
                isSample={goods.isSample}
                tableHead={tableHead}
                tableData={tableData}
                goodsSaleType={goods.goodsSaleType}
                settleType={detailData.settleType}
                unit={goods.unit}
                wsUnit={goods.wsUnit}
                ladderSwitch={detailData.ladderSwitch}
              />
            }
            <Form.Item
              label="总可用库存"
            >
              {goods.totalStock}{goods.unit}
            </Form.Item>
            <Form.Item
              label="商品单位"
            >
              {goods.unit}
            </Form.Item>
            <Form.Item
              label="集采商品单位"
            >
              {goods.wsUnit}
            </Form.Item>
            <Form.Item
              label="发货地"
            >
              {detailData.shipAddrs.map(item => item.shipName).join('、')}
            </Form.Item>
            <Form.Item
              label="单SKU起售数量"
            >
              {goods.buyMinNum}{goods.unit}
            </Form.Item>
          </>
          :
          <>
            <Form.Item
              label="货号"
            >
              {goods.supplierSkuId}
            </Form.Item>

            {
              goods.goodsSaleType !== 2 &&
              <>
                <Form.Item
                  label="集采供货价"
                >
                  {amountTransform(goods.wholesaleSupplyPrice, '/')}元/{goods.unit}
                </Form.Item>
                <Form.Item
                  label="集采阶梯优惠"
                >
                  {goods.ladderData && <>
                    <div>采购{goods.ladderData['1'].wsStart}-{goods.ladderData['1'].wsEnd}{goods.unit}时，{goods.ladderData['1'].wsSupplyPrice / 100}元/{goods.unit}</div>
                    {goods.batchNumber > 1 && <div>{parseInt(goods.ladderData['1'].wsStart / goods.batchNumber, 10)}-{parseInt(goods.ladderData['1'].wsEnd / goods.batchNumber, 10)}{goods.wsUnit || '箱'}时，{goods.ladderData['1'].wsSupplyPrice * goods.batchNumber / 100}元/{goods.wsUnit || '箱'}</div>}
                    <div>{+goods.ladderData['1'].wsEnd + 1}{goods.unit}及以上时，{goods.ladderData['2'].wsSupplyPrice / 100}元/{goods.unit}</div>
                    {goods.batchNumber > 1 && <div>{parseInt((+goods.ladderData['1'].wsEnd + 1) / goods.batchNumber, 10)}{goods.wsUnit || '箱'}及以上时，{goods.ladderData['2'].wsSupplyPrice * goods.batchNumber / 100}元/{goods.wsUnit || '箱'}</div>}
                  </>}
                </Form.Item>
                <Form.Item
                  label="集采箱规单位量"
                >
                  {goods.batchNumber}
                </Form.Item>
                <Form.Item
                  label="最低批发量"
                >
                  {goods.wholesaleMinNum}{goods.unit}
                </Form.Item>
                {
                  goods.isSample === 1
                  &&
                  <>
                    <Form.Item
                      label="样品供货价"
                    >
                      {goods.sampleSupplyPrice / 100}元/{goods.unit}
                    </Form.Item>
                    <Form.Item
                      label="样品起售量"
                    >
                      {goods.sampleMinNum}{goods.unit}
                    </Form.Item>
                    <Form.Item
                      label="样品限售量"
                    >
                      {goods.sampleMaxNum}{goods.unit}
                    </Form.Item>
                    <Form.Item
                      label="样品是否包邮"
                    >
                      {{ 0: '不包邮', 1: '包邮', }[goods.sampleFreight]}
                    </Form.Item>
                    {goods.sampleFreight === 0 && <Form.Item
                      label="样品运费模板"
                    >
                      {goods.sampleFreightName}
                    </Form.Item>}
                  </>
                }
              </>
            }
            {
              goods.goodsSaleType !== 1 &&
              <>
                <Form.Item
                  label="一件代发供货价(元)"
                >
                  {amountTransform(goods.retailSupplyPrice, '/')}元/{goods.unit}
                </Form.Item>
              </>
            }
            {/* <Form.Item
              label="秒约价"
            >
              {amountTransform(goods.salePrice, '/')}
            </Form.Item>
            <Form.Item
              label="市场价"
            >
              {amountTransform(goods.marketPrice, '/')}
            </Form.Item> */}
            <Form.Item
              label="可用库存"
            >
              {goods.totalStock}{goods.unit}
            </Form.Item>
            <Form.Item
              label="商品单位"
            >
              {goods.unit}
            </Form.Item>
            <Form.Item
              label="集采商品单位"
            >
              {goods.wsUnit}
            </Form.Item>
            <Form.Item
              label="发货地"
            >
              {detailData.shipAddrs.map(item => item.shipName).join('、')}
            </Form.Item>
            <Form.Item
              label="库存预警值"
            >
              {goods.stockAlarmNum}{goods.unit}
            </Form.Item>
            <Form.Item
              label="单SKU起售数量"
            >
              {goods.buyMinNum}{goods.unit}
            </Form.Item>
            <Form.Item
              label="单SKU单次最多零售购买数量"
            >
              {goods.buyMaxNum}{goods.unit}
            </Form.Item>
          </>
      }
      {goods.goodsSaleType !== 1 && detailData.isMultiSpec === 0 && <Form.Item
        label="是否包邮"
      >
        {{ 0: '不包邮', 1: '包邮', }[goods.isFreeFreight]}
      </Form.Item>}
      {goods.goodsSaleType !== 1 && !goods.isFreeFreight && detailData.isMultiSpec === 0 &&
        <Form.Item
          label="运费模板"
        >
          {detailData.freightTemplateName}
        </Form.Item>}
      {/* <Form.Item
        label="七天无理由退货"
      >
        {{ 0: '不支持', 1: '支持', }[goods.supportNoReasonReturn]}
      </Form.Item> */}
      <Form.Item
        label="特殊说明"
      >
        {goods.goodsRemark}
      </Form.Item>
      <Form.Item
        label="商品主图"
        name="primaryImages"
      >
        {
          detailData.primaryImages.map(item => (
            <div
              style={{ marginRight: 10, display: 'inline-block' }}
              key={item.imageSort}
            >
              <Image width={100} height={100} src={item.imageUrl} />
            </div>
          ))
        }
      </Form.Item>
      <Form.Item
        label="商品详情"
      >
        {
          detailData.detailImages.map(item => (
            <div
              style={{ marginRight: 10, display: 'inline-block' }}
              key={item.imageSort}
            >
              <Image width={100} height={100} src={item.imageUrl} />
            </div>
          ))
        }
      </Form.Item>
      {detailData.videoUrl &&
        <Form.Item
          label="商品视频"
          name="videoUrl"
        >
          <div className={styles.video_preview}>
            <video width="100%" height="100%" src={detailData.videoUrl} />
            <div>
              <EyeOutlined onClick={() => { window.open(detailData.videoUrl, '_blank') }} style={{ color: '#fff', cursor: 'pointer' }} />
            </div>
          </div>
        </Form.Item>}

      <Form.Item
        label="创建时间"
      >
        {goods.createTimeDisplay}
      </Form.Item>

      <Form.Item
        label="审核状态"
      >
        {goods.goodsVerifyStateDisplay}
      </Form.Item>

      <Form.Item
        label="上架状态"
      >
        {goods.goodsStateDisplay}
      </Form.Item>

      {goods.goodsState === 0 && <Form.Item
        label="下架原因"
      >
        <span style={{ color: 'red' }}>{detailData.goods.goodsVerifyRemark}</span>
      </Form.Item>}

      {/* 
          <ProFormSelect
            name="supplierHelperId"
            label="供应商家顾问"
            options={detailData.supplierHelpList.map(item => ({ label: item.companyName, value: item.id }))}
          />
           */}

    </Form>
  );
};
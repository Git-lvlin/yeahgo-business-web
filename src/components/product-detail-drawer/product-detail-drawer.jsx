import React, { useState, useEffect } from 'react';
import { Drawer, Button } from 'antd';
import ProductDetail from '@/components/product-detail'
import * as api from '@/services/product-management/product-list';
import Look from '@/components/look';

export default (props) => {
  const { visible, setVisible, spuId } = props;
  const [data, setData] = useState(null)
  const [lookVisible, setLookVisible] = useState(false);

  const getDetail = (id) => {
    api.getDetail({
      spuId: id
    }).then(res => {
      if (res.code === 0) {
        setData({
          ...res.data.records,
          settleType: 2,
        });
      }
    })
  }

  useEffect(() => {
    getDetail(spuId)
  }, [])

  return (
    <>
      {
        data && <Drawer
          width={1200}
          visible={visible}
          title="商品详情"
          onClose={() => { setVisible(false) }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={() => { setVisible(false) }} style={{ marginRight: 8 }}>
                返回
              </Button>
              <Button onClick={() => { setLookVisible(true) }} style={{ marginRight: 8 }}>
                预览
              </Button>
            </div>
          }
        >
          <ProductDetail detailData={data} />
          {lookVisible && <Look
            visible={lookVisible}
            setVisible={setLookVisible}
            dataList={data}
          />}
        </Drawer>
      }
    </>

  );
};
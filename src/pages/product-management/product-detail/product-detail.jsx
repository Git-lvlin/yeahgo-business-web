import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProductDetail from '@/components/product-detail';
import { useParams } from 'umi';
import { getDetail } from '@/services/product-management/product-list';


export default () => {
  const [detailData, setDetailData] = useState(null);
  const params = useParams();

  useEffect(() => {
    getDetail({
      spuId: params.id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data.records);
      }
    })
  }, [])

  return (
    <PageContainer
      style={{ backgroundColor: '#fff', paddingBottom: 50 }}
    >
      {detailData && <ProductDetail detailData={detailData} />}
    </PageContainer>
  );
};
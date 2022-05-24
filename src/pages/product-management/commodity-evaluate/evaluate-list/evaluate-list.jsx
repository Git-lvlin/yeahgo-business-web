import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { history } from 'umi';
import { Button,Image } from 'antd';
import { getSupComment } from '@/services/product-management/commodity-evaluate';

export default props => {
    const ref=useRef()
    const columns = [
        {
            title: 'spuid',
            dataIndex: 'spuId',
            hideInSearch: true,
        },
        {
            title: 'skuid',
            dataIndex: 'skuId',
        },
        {
            title: '图片',
            dataIndex: 'goodsImg',
            valueType: 'image',
            hideInSearch:true,
        },
        {
            title: '商品名称',
            dataIndex: 'goodsName',
            valueType: 'text',
        },
        {
            title: '规格',
            dataIndex: 'spec',
            valueType: 'text',
            hideInSearch: true,
        },
        {
            title: '好评',
            dataIndex: 'greatNum',
            valueType: 'text',
            hideInSearch: true,
            render:(text, record, _, action)=>[
                <div key='greatNum'>
                    {
                        parseInt(record.greatNum)?
                        <a onClick={()=>history.push('/product-management/commodity-evaluate/evaluate-list/good-reputation?skuId='+record.skuId+'&type=1&spuId='+record.spuId)}>{record.greatNum}</a>
                        :'无'
                    }
                </div>
            ],
        },
        {
            title: '中评',
            dataIndex: 'middleNum',
            valueType: 'text',
            hideInSearch: true,
            render:(text, record, _, action)=>[
                <div key='middleNum'>
                    {
                        parseInt(record.middleNum)?
                        <a onClick={()=>history.push('/product-management/commodity-evaluate/evaluate-list/good-reputation?skuId='+record.skuId+'&type=2&spuId='+record.spuId)}>{record.middleNum}</a>
                        :'无'
                    }
                </div>
            ],
        },
        {
            title: '差评',
            dataIndex: 'badNum',
            valueType: 'text',
            hideInSearch: true,
            render:(text, record, _, action)=>[
                <div key='badNum'>
                {
                    parseInt(record.badNum)?
                    <a onClick={()=>history.push('/product-management/commodity-evaluate/evaluate-list/good-reputation?skuId='+record.skuId+'&type=3&spuId='+record.spuId)}>{record.badNum}</a>
                    :'无'
                }
            </div>
                
            ],
        }
    ];
  return (
    <PageContainer>
        <ProTable
            rowKey="id"
            options={false}
            actionRef={ref}
            request={getSupComment}
            search={{
                defaultCollapsed: false,
                labelWidth: 100,
                optionRender: (searchConfig, formProps, dom) => [
                    ...dom.reverse()
                ],
            }}
            columns={columns}
            pagination={{
                pageSize: 10,
                showQuickJumper: true,
            }}

        />
  </PageContainer>
  );
};

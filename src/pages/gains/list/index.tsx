import {
  PlusOutlined,
  AlipayOutlined,
  createFromIconfontCN,
  CaretUpOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import { Button, Form, Radio, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import moment from 'moment';

import CreateForm from './components/CreateForm';
import { TableListItem } from './data.d';
import { queryGains, addGains } from './service';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1688330_dmpevidkpun.js',
});

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    const res = await addGains({ ...fields });
    hide();
    if (res.success) {
      message.success('添加成功');
      return true;
    }
    message.error(res.errorMessage);
    return false;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '日期',
      dataIndex: 'date',
      initialValue: moment(),
      rules: [
        {
          required: true,
          message: '日期为必填项',
        },
      ],
      valueType: 'date',
    },
    {
      title: '名字',
      dataIndex: 'name',
      initialValue: 'Jason',
      rules: [
        {
          required: true,
          message: '名字为必填项',
        },
      ],
      renderFormItem: () => (
        <Form.Item name="name">
          <Radio.Group>
            <Radio value="Jason">Jason</Radio>
            <Radio value="Qier">Qier</Radio>
          </Radio.Group>
        </Form.Item>
      ),
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      initialValue: 'Alipay',
      rules: [
        {
          required: true,
          message: '渠道为必填项',
        },
      ],
      render: (text, record) => (
        <span>
          {record.channel === 'Alipay' ? (
            <AlipayOutlined style={{ color: '#1977fd', fontSize: 24 }} />
          ) : (
            <IconFont type="iconcmb" style={{ color: '#d81e06', fontSize: 24 }} />
          )}
        </span>
      ),
      renderFormItem: () => (
        <Form.Item name="channel">
          <Radio.Group>
            <Radio
              value="Alipay"
              style={{ display: 'inline-flex', alignItems: 'center', marginRight: 20 }}
            >
              <AlipayOutlined style={{ color: '#1977fd', fontSize: 24 }} />
            </Radio>
            <Radio value="CMB" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <IconFont type="iconcmb" style={{ color: '#d81e06', fontSize: 24 }} />
            </Radio>
          </Radio.Group>
        </Form.Item>
      ),
    },
    {
      title: '收益',
      dataIndex: 'money',
      hideInSearch: true,
      rules: [
        {
          required: true,
          message: '收益为必填项',
        },
      ],
      valueType: 'digit',
      render: (text, record) => (
        <span>
          <span style={{ width: 40, display: 'inline-block', textAlign: 'right' }}>
            {record.money.toFixed(2)}
          </span>
          {record.money > 0 ? (
            <CaretUpOutlined style={{ color: '#f5222d' }} />
          ) : (
            <CaretDownOutlined style={{ color: '#52c41a' }} />
          )}
        </span>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="收益表格"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button icon={<PlusOutlined />} type="primary" onClick={() => handleModalVisible(true)}>
            新建
          </Button>,
        ]}
        request={params => queryGains(params)}
        columns={columns}
        search={false}
      />
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<TableListItem, TableListItem>
          onSubmit={async value => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
          rowSelection={{}}
        />
      </CreateForm>
    </PageHeaderWrapper>
  );
};

export default TableList;

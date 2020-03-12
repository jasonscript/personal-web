import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Select, InputNumber, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import moment from 'moment';

import CreateForm from './components/CreateForm';
import { TableListItem } from './data.d';
import { queryTemperature, addTemperature } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addTemperature({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInForm: true,
    },
    {
      title: '时间',
      dataIndex: 'time',
      initialValue: moment(),
      rules: [
        {
          required: true,
          message: '时间为必填项',
        },
      ],
      valueType: 'dateTime',
      renderText: (val: string) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
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
          <Select>
            <Select.Option value="Jason">Jason</Select.Option>
            <Select.Option value="Qier">Qier</Select.Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: '温度',
      dataIndex: 'value',
      initialValue: 36.5,
      rules: [
        {
          required: true,
          message: '温度为必填项',
        },
      ],
      renderText: (val: number) => `${val}℃`,
      renderFormItem: () => (
        <Form.Item name="value">
          <InputNumber step="0.1" />
        </Form.Item>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="温度表格"
        actionRef={actionRef}
        rowKey="id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<TableListItem>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={params => queryTemperature(params)}
        columns={columns}
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

import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { StepsDataType } from './data.d';
import { querySteps, updateRule, addSteps } from './service';

/**
 * 新增步数
 * @param fields 表单字段
 */
const handleAdd = async (fields: StepsDataType) => {
  const hide = message.loading('正在添加');
  try {
    const result = await addSteps(fields);
    hide();
    if (result.success) {
      message.success('添加成功');
      return true;
    }
    message.error(result.errorMessage);
    return false;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<StepsDataType>[] = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '日期',
      dataIndex: 'date',
      valueType: 'date',
    },
    {
      title: '名字',
      dataIndex: 'name',
    },
    {
      title: '步数',
      dataIndex: 'steps',
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<StepsDataType>
        headerTitle="步数表格"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button icon={<PlusOutlined />} type="primary" onClick={() => handleModalVisible(true)}>
            新增
          </Button>,
        ]}
        request={() => querySteps()}
        columns={columns}
        rowSelection={false}
        search={false}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);
            if (success) {
              handleModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;

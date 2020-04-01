import React, { FC, useRef, useState, useEffect } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Dropdown, Input, List, Menu, Modal, Radio, Row } from 'antd';

import { findDOMNode } from 'react-dom';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import OperationModal from './components/OperationModal';
import { StateType } from './model';
import { TodoItemDataType } from './data.d';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

interface ListProps {
  todolist: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const statusMap = {
  default: '等待中',
  processing: '进行中',
  success: '已完成',
};

const ListContent = ({ data: { date, status } }: { data: TodoItemDataType }) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <p>{moment(date).format('YYYY-MM-DD')}</p>
    </div>
    <div className={styles.listContentItem}>
      <Badge status={status} text={statusMap[status]} />
    </div>
  </div>
);

export const TodoList: FC<ListProps> = props => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    todolist: { list },
  } = props;
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<TodoItemDataType> | undefined>(undefined);

  useEffect(() => {
    dispatch({
      type: 'todolist/fetch',
    });
  }, [1]);

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 5,
  };

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item: TodoItemDataType) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (id: number) => {
    dispatch({
      type: 'todolist/submit',
      payload: { id },
    });
  };

  const editAndDelete = (key: string, currentItem: TodoItemDataType) => {
    if (key === 'edit') showEditModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除任务',
        content: '确定删除该任务吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => deleteItem(currentItem.id),
      });
    }
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="all">
        <RadioButton value="all">全部</RadioButton>
        <RadioButton value="progress">进行中</RadioButton>
        <RadioButton value="waiting">等待中</RadioButton>
        <RadioButton value="done">已完成</RadioButton>
      </RadioGroup>
      <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
    </div>
  );

  const MoreBtn: React.FC<{
    item: TodoItemDataType;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          <Menu.Item key="edit">编辑</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();

    setDone(false);
    setVisible(false);

    dispatch({
      type: 'todolist/fetch',
    });
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const handleSubmit = (values: TodoItemDataType) => {
    const id = current ? current.id : null;

    setAddBtnblur();

    setDone(true);
    dispatch({
      type: 'todolist/submit',
      payload: Object.assign({ id }, values, { date: moment(values.date).format('YYYY-MM-DD') }),
    });
  };

  return (
    <div>
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={24} xs={24}>
                <Info
                  title="我的待办"
                  value={list.filter((item: TodoItemDataType) => item.status !== 'success').length}
                  bordered
                />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="待办列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              onClick={showModal}
              ref={addBtn}
            >
              <PlusOutlined />
              添加
            </Button>

            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={e => {
                        e.preventDefault();
                        showEditModal(item);
                      }}
                    >
                      编辑
                    </a>,
                    <MoreBtn key="more" item={item} />,
                  ]}
                >
                  <List.Item.Meta title={item.title} description={item.description} />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>

      <OperationModal
        done={done}
        current={current}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default connect(
  ({
    todolist,
    loading,
  }: {
    todolist: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    todolist,
    loading: loading.models.todolist,
  }),
)(TodoList);

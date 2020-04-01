import React, { FC, useEffect } from 'react';
import moment from 'moment';
import { Modal, Result, Button, Form, DatePicker, Input } from 'antd';
import { TodoItemDataType } from '../data.d';
import styles from '../style.less';

interface OperationModalProps {
  done: boolean;
  visible: boolean;
  current: Partial<TodoItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: TodoItemDataType) => void;
  onCancel: () => void;
}

const { TextArea } = Input;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const OperationModal: FC<OperationModalProps> = props => {
  const [form] = Form.useForm();
  const { done, visible, current, onDone, onCancel, onSubmit } = props;

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        ...current,
        date: current.date ? moment(current.date) : null,
      });
    }
  }, [props.current]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as TodoItemDataType);
    }
  };

  const modalFooter = done
    ? { footer: null, onCancel: onDone }
    : { okText: '保存', onOk: handleSubmit, onCancel };

  const getModalContent = () => {
    if (done) {
      return (
        <Result
          status="success"
          title="操作成功"
          extra={
            <Button type="primary" onClick={onDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      );
    }
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish} initialValues={{ date: moment() }}>
        <Form.Item
          name="title"
          label="任务名称"
          rules={[{ required: true, message: '请输入任务名称' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item name="date" label="日期" rules={[{ required: true, message: '请选择日期' }]}>
          <DatePicker placeholder="请选择" format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="description"
          label="任务描述"
          rules={[{ message: '请输入至少五个字符的任务描述！', min: 5 }]}
        >
          <TextArea rows={4} placeholder="请输入至少五个字符" />
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title={done ? null : `任务${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={640}
      bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default OperationModal;

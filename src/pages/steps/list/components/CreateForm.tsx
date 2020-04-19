import React from 'react';
import { Form, DatePicker, Radio, InputNumber, Modal } from 'antd';
import moment from 'moment';

import { checkSteps } from '../service';

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: any) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const [form] = Form.useForm();

  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    fieldsValue.date = fieldsValue.date.format('YYYY-MM-DD');
    handleAdd(fieldsValue);
  };
  return (
    <Modal
      destroyOnClose
      title="新增步数"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form} initialValues={{ date: moment(), name: 'Jason' }}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="日期"
          name="date"
          rules={[{ required: true, message: '请选择日期！' }]}
        >
          <DatePicker />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="名字"
          name="name"
          rules={[
            { required: true, message: '请选择名字！' },
            ({ getFieldValue }) => ({
              async validator(rule, value) {
                const date = getFieldValue('date').format('YYYY-MM-DD');
                const result = await checkSteps({ name: value, date });
                if (result) {
                  return Promise.reject(new Error('重复记录'));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Radio.Group>
            <Radio value="Jason">Jason</Radio>
            <Radio value="Qier">Qier</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="步数"
          name="steps"
          rules={[{ required: true, message: '请输入步数！' }]}
        >
          <InputNumber />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;

import * as z from 'zod';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { zodResolver } from '@hookform/resolvers/zod';

// UI lib
import { Modal, Form, Input, Select, Space, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// Form layout
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    style: { textAlign: 'left' },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

// Form input options
const formMemberOptions = [
  { value: 'vo-tuan-huy', label: 'Vo Tuan Huy' },
  { value: 'tony-nguyen', label: 'Tony Nguyen' },
];

const formStatusOptions = [
  { value: 'newly-created', label: 'New' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

// Form object schema
const schema = z.object({
  title: z.string().min(1, { message: 'Required' }),
  description: z.string().min(1, { message: 'Required' }),
  member: z
    .array(z.string())
    .nonempty({ message: 'Please select at least one member' }),
  status: z.string(),
});

export default function ListModalAddCard({ isModalVisible, showModal }) {
  const {
    reset,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      member: [formMemberOptions[0].value],
      status: formStatusOptions[0].value,
    },
    resolver: zodResolver(schema),
  });

  const onModalFinish = (data) => console.log(data);

  const modalOkHandler = () => {
    handleSubmit(onModalFinish)();
    if (isValid) {
      reset();
      showModal(false);
    }
  };

  return (
    <>
      <Modal
        title="Basic Modal"
        open={isModalVisible}
        onOk={modalOkHandler}
        onCancel={() => showModal(false)}
      >
        <Form {...formItemLayout}>
          <FormItem control={control} name="title" label="Title" required>
            <Input />
          </FormItem>
          <FormItem
            control={control}
            name="description"
            label="Description"
            required
          >
            <Input.TextArea rows={4} />
          </FormItem>
          <FormItem name="member" label="Member" control={control} required>
            <Select
              mode="multiple"
              options={formMemberOptions}
              optionRender={(item) => {
                return (
                  <Space direction="horizontal" size={16}>
                    <Avatar size={24} icon={<UserOutlined />} />
                    <span>{item.label}</span>
                  </Space>
                );
              }}
            />
          </FormItem>
          <FormItem name="status" label="Status" control={control}>
            <Select options={formStatusOptions} />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
}

ListModalAddCard.propTypes = {
  showModal: PropTypes.func.isRequired,
  isModalVisible: PropTypes.bool.isRequired,
};

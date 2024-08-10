import * as z from 'zod';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { zodResolver } from '@hookform/resolvers/zod';
import { useImperativeHandle, forwardRef, useState } from 'react';
import { useAppContext } from '../../../contexts/use-app-context';

// UI lib
import { UserOutlined } from '@ant-design/icons';
import { Modal, Form, Input, Select, Space, Avatar } from 'antd';

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

// Form input options config
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
  contributors: z
    .array(z.string())
    .nonempty({ message: 'Please select at least one member' }),
  status: z.string(),
});

/* 
  1.) The ListModalAddCard component is a modal form that allows users to add a new card to a list.
  2.) Using the forwardRef hook, the component exposes a function to the parent component to show or hide the modal.
  => 
    Optimize render performance.
    Prevent re-rendering of the TrelloList with it childs when the ListModalAddCard component re-renders.
*/
const ListModalAddCard = forwardRef(function ListModalAddCard(
  { columnId },
  ref,
) {
  // State hook
  const [isModalVisible, setModalVisible] = useState(false);

  // Context hook
  const { onAddCard } = useAppContext();

  // Expose function to parent component (TrelloList)
  useImperativeHandle(ref, () => ({
    showModal: () => setModalVisible((prevModalVisible) => !prevModalVisible),
  }));

  // React hook form
  const {
    reset,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      contributors: [formMemberOptions[0].value],
      status: formStatusOptions[0].value,
    },
    resolver: zodResolver(schema),
  });

  // Function handler
  const onModalFinish = (data) => {
    onAddCard(columnId, data);
  };

  const modalOkHandler = () => {
    handleSubmit(onModalFinish)();
    if (isValid) {
      reset();
      setModalVisible(false);
    }
  };

  return (
    <>
      <Modal
        title="Add new card"
        open={isModalVisible}
        onOk={modalOkHandler}
        onCancel={() => setModalVisible(false)}
      >
        <Form {...formItemLayout}>
          <FormItem name="title" label="Title" control={control} required>
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
          <FormItem
            name="contributors"
            label="Contributors"
            control={control}
            required
          >
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
});

export default ListModalAddCard;

ListModalAddCard.propTypes = {
  columnId: PropTypes.string.isRequired,
};

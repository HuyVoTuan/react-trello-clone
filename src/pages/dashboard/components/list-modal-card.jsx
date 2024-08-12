import * as z from 'zod';
import { useEffect } from 'react';
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

// Form object schema
const schema = z.object({
  title: z.string().min(1, { message: 'Required' }),
  description: z.string().min(1, { message: 'Required' }),
  contributors: z
    .array(z.string())
    .nonempty({ message: 'Please select at least one member' }),
});

/* 
  1.) The ListModalCard component is a modal form that allows users to add a new card to a list.
  2.) Using the forwardRef hook, the component exposes a function to the parent component to show or hide the modal.
  => 
    Optimize render performance.
    Prevent re-rendering of the TrelloList with it childs when the ListModalCard component re-renders.
*/
const ListModalCard = forwardRef(function ListModalCard(
  { columnId, type, cardData },
  ref,
) {
  // State hook
  const [isModalVisible, setModalVisible] = useState(false);

  // Context hook
  const { onAddCard, onEditCard } = useAppContext();

  // Expose function to parent component (TrelloList, TrelloCard)
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
      title: cardData?.title || '',
      description: cardData?.description || '',
      contributors: cardData?.contributors || [formMemberOptions[0].value],
    },
    resolver: zodResolver(schema),
  });

  // Effect hook
  useEffect(() => {
    reset({
      title: cardData?.title || '',
      description: cardData?.description || '',
      contributors: cardData?.contributors || [formMemberOptions[0].value],
    });
  }, [cardData, reset]);

  // Function handler
  const onModalAddFinish = (data) => {
    onAddCard(columnId, data);
  };

  const onModalEditFinish = (data) => {
    onEditCard(columnId, { ...data, id: cardData?.id, image: cardData?.image });
  };

  const modalOkHandler = () => {
    if (type === 'edit-card') {
      handleSubmit(onModalEditFinish)();
    }

    if (type === 'add-card') {
      handleSubmit(onModalAddFinish)();
    }

    if (isValid) {
      reset();
      setModalVisible(false);
    }
  };

  return (
    <>
      <Modal
        title={type}
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
        </Form>
      </Modal>
    </>
  );
});

export default ListModalCard;

ListModalCard.propTypes = {
  cardData: PropTypes.object,
  columnId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['add-card', 'edit-card']).isRequired,
};

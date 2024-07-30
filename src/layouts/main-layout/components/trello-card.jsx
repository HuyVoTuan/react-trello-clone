import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

// UI lib
import { Tooltip, Popconfirm, Card, Avatar, Spin } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
  LoadingOutlined,
  UserOutlined,
} from '@ant-design/icons';

const cardActions = [
  <Tooltip title="Open setting" key="setting">
    <SettingOutlined />
  </Tooltip>,
  <Tooltip title="Edit" key="edit">
    <EditOutlined />
  </Tooltip>,
];

export default function TrelloCard({ isLoading, cardData, index }) {
  const { contributors, image, title } = cardData;

  return (
    <Draggable draggableId={cardData.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <Card
            className="w-[30rem]"
            loading={isLoading}
            actions={[
              ...cardActions,
              <Popconfirm
                key="delete"
                okText="Yes"
                cancelText="No"
                onConfirm={() => console.log('Delete list')}
                onCancel={() => console.log('Cancel delete')}
                title={`Are you sure you want to delete this card?`}
              >
                <Tooltip title="Delete">
                  <DeleteOutlined key="delete" />
                </Tooltip>
              </Popconfirm>,
            ]}
            cover={
              isLoading ? (
                <div className="py-[5rem] text-center">
                  <Spin indicator={<LoadingOutlined spin />} />
                </div>
              ) : (
                <img alt="example" src={image} />
              )
            }
          >
            <Card.Meta
              title={title}
              description={
                <Avatar.Group
                  size={'large'}
                  max={{
                    count: 2,
                    popover: {
                      trigger: 'hover',
                      title: 'Other Contributors',
                    },
                  }}
                  className="flex cursor-pointer items-center justify-end"
                >
                  {contributors.map((contributor) => (
                    <Tooltip key={contributor} title={contributor}>
                      <Avatar
                        src={`https://i.pravatar.cc/150?u=${contributor}`}
                        icon={<UserOutlined />}
                      />
                    </Tooltip>
                  ))}
                </Avatar.Group>
              }
            />
          </Card>
          
          {/* Drag Drop Placeholder */}
          {provided.placeholder}
        </div>
      )}
    </Draggable>
  );
}

TrelloCard.propTypes = {
  index: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  cardData: PropTypes.object.isRequired,
};

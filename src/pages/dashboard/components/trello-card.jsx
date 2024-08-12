import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../../contexts/use-app-context';

// UI lib
import { Tooltip, Popconfirm, Card, Avatar, Spin } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
  LoadingOutlined,
  UserOutlined,
} from '@ant-design/icons';

// Components
import ListModalCard from './list-modal-card';

export default function TrelloCard({
  index,
  columnId,
  cardData,
  isListLoading,
}) {
  const { contributors, image, title } = cardData;

  // Context hook
  const { onDeleteCard } = useAppContext();

  // Ref hook
  const modalAddCardEl = useRef(null);

  //  State hook
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isCardLoading, setCardLoading] = useState(true);

  // Effect hook
  // Trello card fetching effect base on (Add Card, Edit Card) stimulation
  useEffect(() => {
    const handleContextUpdate = () => {
      const timer = setTimeout(() => {
        setCardLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    };

    handleContextUpdate();
  }, [cardData]);
  return (
    <>
      <Draggable draggableId={cardData.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
          >
            <Card
              className="w-[30rem]"
              loading={isListLoading || isCardLoading}
              actions={[
                <Tooltip title="Open setting" key="setting">
                  <SettingOutlined />
                </Tooltip>,
                <Tooltip
                  title="Edit"
                  key="edit"
                  onClick={() => modalAddCardEl.current.showModal()}
                >
                  <EditOutlined />
                </Tooltip>,
                <Popconfirm
                  key="delete"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => onDeleteCard(columnId, cardData)}
                  onCancel={() => console.log('Cancel delete')}
                  title={`Are you sure you want to delete this card?`}
                >
                  <Tooltip title="Delete">
                    <DeleteOutlined key="delete" />
                  </Tooltip>
                </Popconfirm>,
              ]}
              cover={
                isCardLoading ? (
                  <div className="py-[5rem] text-center">
                    <Spin indicator={<LoadingOutlined spin />} />
                  </div>
                ) : (
                  <div className="h-[200px] w-[200px]">
                    <img
                      alt="example"
                      src={image}
                      onLoad={() => setImgLoaded(true)}
                      className={`h-full w-full rounded-t-lg object-cover duration-300 ease-in-out ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </div>
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

      <ListModalCard
        type="edit-card"
        ref={modalAddCardEl}
        columnId={columnId}
        cardData={cardData}
      />
    </>
  );
}

TrelloCard.propTypes = {
  index: PropTypes.number.isRequired,
  columnId: PropTypes.string.isRequired,
  cardData: PropTypes.object.isRequired,
  isListLoading: PropTypes.bool.isRequired,
};

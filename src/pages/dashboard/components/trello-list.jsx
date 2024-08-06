import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

// UI lib
import { Button, Tooltip, List, Popconfirm, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// Components
import TrelloCard from './trello-card';
import ListModalAddCard from './list-modal-add-card';
import BackToTopButton from '../../../components/back-to-top-button';

// Component functions
const popConfirmHandler = () => {
  message.success('Click on Yes');
};
const popCancelHandler = () => {
  message.error('Click on No');
};

export default function TrelloList({ listData, sourceData, index }) {
  const { cards } = sourceData;
  const { title: listTitle, cards: listCards } = listData;

  // Ref hooks
  const trelloListEl = useRef(null);

  // State hooks
  const [isLoading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Draggable draggableId={listData.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Droppable droppableId={listData.id} type="LIST">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <List
                  className="relative max-h-[100%] min-w-[35rem] rounded-lg bg-gray-100 p-4"
                  bordered
                  header={
                    <div className="flex items-center justify-center">
                      <h3 className="flex-1 text-2xl font-semibold">
                        {listTitle}
                      </h3>
                      <div className="flex gap-4">
                        <Tooltip title="Add new card" placement="top">
                          <Button
                            shape="circle"
                            icon={<PlusOutlined />}
                            onClick={() => setModalVisible(true)}
                          />
                        </Tooltip>

                        <Tooltip title="Delete this list" placement="top">
                          <Popconfirm
                            title="Delete this list"
                            description="Are you sure to delete this list?"
                            onConfirm={popConfirmHandler}
                            onCancel={popCancelHandler}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button shape="circle" icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </Tooltip>

                        <ListModalAddCard
                          showModal={setModalVisible}
                          isModalVisible={isModalVisible}
                        />
                      </div>
                    </div>
                  }
                >
                  <div
                    ref={trelloListEl}
                    id="custom-scrollbar"
                    className="max-h-[calc(100vh_-_5.6rem_-_12rem)] overflow-y-auto"
                  >
                    {listCards?.map((item, index) => {
                      const cardData = cards?.[item];

                      return (
                        <List.Item key={cardData.id} className="w-full">
                          <TrelloCard
                            index={index}
                            cardData={cardData}
                            isLoading={isLoading}
                          />
                        </List.Item>
                      );
                    })}

                    {/* Drag Drop Placeholder */}
                    {provided.placeholder}
                  </div>

                  {/* Scroll back to top button */}
                  <BackToTopButton scrollRef={trelloListEl} />
                </List>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

TrelloList.propTypes = {
  index: PropTypes.number.isRequired,
  listData: PropTypes.object.isRequired,
  sourceData: PropTypes.object.isRequired,
};

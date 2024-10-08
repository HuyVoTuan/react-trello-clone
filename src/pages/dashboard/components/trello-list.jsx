import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useAppContext } from '../../../contexts/use-app-context';

// UI lib
import { Button, Tooltip, List, Popconfirm, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// Components
import TrelloCard from './trello-card';
import ListModalCard from './list-modal-card';
import BackToTopButton from '../../../components/back-to-top-button';

export default function TrelloList({ listData, sourceData, index }) {
  const { cards } = sourceData;

  // Context hook
  const { onDeleteList } = useAppContext();

  // Ref hook
  const trelloListEl = useRef(null);
  const modalAddCardEl = useRef(null);

  // State hook
  const [isListLoading, setListLoading] = useState(true);

  // Effect hook
  // Initial trello list fetching effect stimulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setListLoading(false);
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
                        {listData.title}
                      </h3>
                      <div className="flex gap-4">
                        <Tooltip title="Add new card" placement="top">
                          <Button
                            shape="circle"
                            icon={<PlusOutlined />}
                            onClick={() => modalAddCardEl.current.showModal()}
                          />
                        </Tooltip>

                        <Tooltip title="Delete this list" placement="top">
                          <Popconfirm
                            title="Delete this list"
                            description="Are you sure to delete this list?"
                            onConfirm={() => onDeleteList(listData.id)}
                            onCancel={() => {
                              message.error('Click on No');
                            }}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button shape="circle" icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </Tooltip>

                        <ListModalCard
                          type="add-card"
                          ref={modalAddCardEl}
                          columnId={listData.id}
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
                    {listData.cards.map((item, index) => {
                      const cardData = cards[item];

                      return (
                        <List.Item key={cardData.id} className="w-full">
                          <TrelloCard
                            index={index}
                            cardData={cardData}
                            columnId={listData.id}
                            isListLoading={isListLoading}
                          />
                        </List.Item>
                      );
                    })}

                    {/* Drag Drop Placeholder */}
                    {provided.placeholder}
                  </div>

                  {/* Scroll back to top button */}
                  <BackToTopButton ref={trelloListEl} />
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

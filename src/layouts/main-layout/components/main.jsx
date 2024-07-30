import { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// UI lib
import { Button } from 'antd';

// Components
import TrelloList from './trello-list';

// Mock data
import sourceData from '../../../mocks/source-data';

export default function Main() {
  const [data, setData] = useState(sourceData);
  const { columns: listColumns, lists } = data;

  const onDragEndHandler = (event) => {
    console.log('Drag n drop event', event);
    const { source, destination, type } = event;

    // TODO: Handle drop without destination
    if (!destination) {
      return;
    }

    // TODO: Drag and drop list column
    if (type === 'COLUMN') {
      const newColumnOrder = [...listColumns];
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, event.draggableId);

      setData((prevData) => {
        return {
          ...prevData,
          columns: newColumnOrder,
        };
      });
    }

    // TODO: Drag and drop cards in same list
    if (type === 'LIST' && source.droppableId === destination.droppableId) {
      const listData = lists[source.droppableId];
      const newListCardsOrder = [...listData.cards];

      newListCardsOrder.splice(source.index, 1);
      newListCardsOrder.splice(destination.index, 0, event.draggableId);

      setData((prevData) => {
        return {
          ...prevData,
          lists: {
            ...prevData.lists,
            [destination.droppableId]: {
              ...prevData.lists[destination.droppableId],
              cards: newListCardsOrder,
            },
          },
        };
      });
    }

    // TODO: Drag and drop cards to different list
    if (type === 'LIST' && source.droppableId !== destination.droppableId) {
      const sourceList = lists[source.droppableId];
      const destinationList = lists[destination.droppableId];

      // Remove card from source list
      const newSourceListCardsOrder = [...sourceList.cards];
      newSourceListCardsOrder.splice(source.index, 1);

      // Insert card into destination list
      const newDestinationListCardsOrder = [...destinationList.cards];
      newDestinationListCardsOrder.splice(
        destination.index,
        0,
        event.draggableId,
      );

      setData((prevData) => {
        return {
          ...prevData,
          lists: {
            ...prevData.lists,
            [source.droppableId]: {
              ...prevData.lists[source.droppableId],
              cards: newSourceListCardsOrder,
            },
            [destination.droppableId]: {
              ...prevData.lists[destination.droppableId],
              cards: newDestinationListCardsOrder,
            },
          },
        };
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <main>
        <div className="container mx-auto h-[calc(100vh_-_5rem)]">
          <div className="flex h-[calc(100vh_-_5rem)] w-full flex-row items-start gap-10 overflow-x-auto overflow-y-hidden text-nowrap p-10">
            {/* Render List Columns */}
            <Droppable
              type="COLUMN"
              droppableId="COLUMN"
              direction="horizontal"
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex gap-10"
                >
                  {listColumns?.map((item, index) => {
                    const listData = lists[item];

                    return (
                      <TrelloList
                        index={index}
                        key={listData.id}
                        listData={listData}
                        sourceData={sourceData}
                      />
                    );
                  })}

                  {/* Drag Drop Placeholder */}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Render Add Button */}
            <Button type="text">
              <span role="img" aria-label="plus">
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="plus"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <defs>
                    <style></style>
                  </defs>
                  <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path>
                  <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"></path>
                </svg>
              </span>
              <span>Add new list</span>
            </Button>
          </div>
        </div>
      </main>
    </DragDropContext>
  );
}

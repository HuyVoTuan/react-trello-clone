import { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// UI lib
import { Button } from 'antd';

// Components
import TrelloList from './components/trello-list';

// Mock data
import sourceData from '../../mocks/source-data'
import { useAppContext } from '../../contexts/app-context';

export default function Dashboard() {
  const { trelloBoard, onDragEndHandler } = useAppContext();

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <main>
        <div className="w-full h-[calc(100vh_-_5rem)]">
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
                  {trelloBoard.columns.map((item, index) => {
                    const listData = trelloBoard.lists[item];

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

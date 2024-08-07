import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useAppContext } from '../../contexts/use-app-context';

// Components
import TrelloList from './components/trello-list';
import AddNewListButton from './components/add-new-list-button';

// Mock data
import sourceData from '../../mocks/source-data';

export default function Dashboard() {
  // Context hook
  const { trelloBoard, onDragEndHandler } = useAppContext();

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <main>
        <div className="h-[calc(100vh_-_5rem)] w-full">
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

            {/*  Add New List Button */}
            <AddNewListButton />
          </div>
        </div>
      </main>
    </DragDropContext>
  );
}

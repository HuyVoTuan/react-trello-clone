import React from 'react';

// mocks
import sourceData from '../mocks/source-data';

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const [trelloBoard, setTrelloBoard] = React.useState(sourceData);

  const onDragColumn = ({ source, destination, event }) => {
    const newColumnOrder = [...trelloBoard.columns];
    newColumnOrder.splice(source.index, 1);
    newColumnOrder.splice(destination.index, 0, event.draggableId);

    setTrelloBoard((prevData) => {
      return {
        ...prevData,
        columns: newColumnOrder,
      };
    });
  }  

  const onDragCardSameList = ({ source, destination, event }) => {
    const listData = trelloBoard.lists[source.droppableId];
    const newListCardsOrder = [...listData.cards];

    newListCardsOrder.splice(source.index, 1);
    newListCardsOrder.splice(destination.index, 0, event.draggableId);

    setTrelloBoard((prevData) => {
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

  const onDragCardDiffList = ({ source, destination, event }) => {
    const sourceList = trelloBoard.lists[source.droppableId];
    const destinationList = trelloBoard.lists[destination.droppableId];

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

    setTrelloBoard((prevData) => {
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

  const onDragEndHandler = (event) => {
    const { source, destination, type } = event;

    // TODO: Handle drop without destination
    if (!destination) {
      return;
    }

    // TODO: Drag and drop list column
    if (type === 'COLUMN') {
      onDragColumn({ 
        source, 
        destination, 
        event 
      });
    }

    if (type === 'LIST') {
      // TODO: Drag and drop cards in same list
      if (source.droppableId === destination.droppableId) {
        onDragCardSameList({
          source, 
          destination,
          event
        });
      }

      // TODO: Drag and drop cards to different list
      if (source.droppableId !== destination.droppableId) {
        onDragCardDiffList({
          source, 
          destination,
          event
        });
      }
    }
  };

  return (
    <AppContext.Provider
      value={{ 
        trelloBoard,
        onDragEndHandler
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => React.useContext(AppContext);
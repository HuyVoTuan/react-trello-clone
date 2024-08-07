import { v4 as uuidv4 } from 'uuid';
import { PropTypes } from 'prop-types';
import { createContext, useState } from 'react';

// Mock data
import sourceData from '../mocks/source-data';

// Context hook
export const AppContext = createContext();

// Constants
const MAX_SEED = 600;

export const AppProvider = ({ children }) => {
  const [trelloBoard, setTrelloBoard] = useState(sourceData);

  const onAddCard = (columnId, trelloCard) => {
    const randomId = uuidv4();
    const randomSeed = Math.floor(Math.random() * MAX_SEED);

    const newTrelloCard = {
      id: randomId,
      image: `https://unsplash.it/600/400?image=${randomSeed}`,
      ...trelloCard,
    };

    const copiedTrelloBoard = { ...trelloBoard };
    copiedTrelloBoard.cards[newTrelloCard.id] = newTrelloCard;
    copiedTrelloBoard.lists[columnId].cards.push(newTrelloCard.id);

    setTrelloBoard(copiedTrelloBoard);
  };

  const onDeleteCard = (columnId, trelloCard) => {
    const copiedTrelloBoard = { ...trelloBoard };
    const trelloCardIndex = copiedTrelloBoard.lists[columnId].cards.indexOf(
      trelloCard.id,
    );

    copiedTrelloBoard.lists[columnId].cards.splice(trelloCardIndex, 1);
    delete copiedTrelloBoard.cards[trelloCard.id];

    setTrelloBoard(copiedTrelloBoard);
  };

  const onDeleteList = (columnId) => {
    const copiedTrelloBoard = { ...trelloBoard };
    const trelloColumnIndex = copiedTrelloBoard.columns.indexOf(columnId);

    copiedTrelloBoard.columns.splice(trelloColumnIndex, 1);
    delete copiedTrelloBoard.lists[columnId];

    setTrelloBoard(copiedTrelloBoard);
  };

  const onAddList = (trelloList) => {
    const randomId = uuidv4();

    const newTrelloList = {
      id: randomId,
      title: trelloList,
      cards: [],
    };

    const copiedTrelloBoard = { ...trelloBoard };
    copiedTrelloBoard.columns.push(newTrelloList.id);
    copiedTrelloBoard.lists[newTrelloList.id] = newTrelloList;

    setTrelloBoard(copiedTrelloBoard);
  };

  const onDragColumn = ({ source, destination, event }) => {
    const newTrelloColumnOrder = [...trelloBoard.columns];
    newTrelloColumnOrder.splice(source.index, 1);
    newTrelloColumnOrder.splice(destination.index, 0, event.draggableId);

    setTrelloBoard((prevData) => {
      return {
        ...prevData,
        columns: newTrelloColumnOrder,
      };
    });
  };

  const onDragCardSameList = ({ source, destination, event }) => {
    const trelloList = trelloBoard.lists[source.droppableId];
    const newTrelloListCardsOrder = [...trelloList.cards];

    newTrelloListCardsOrder.splice(source.index, 1);
    newTrelloListCardsOrder.splice(destination.index, 0, event.draggableId);

    setTrelloBoard((prevData) => {
      return {
        ...prevData,
        lists: {
          ...prevData.lists,
          [destination.droppableId]: {
            ...prevData.lists[destination.droppableId],
            cards: newTrelloListCardsOrder,
          },
        },
      };
    });
  };

  const onDragCardDifferentList = ({ source, destination, event }) => {
    const trelloSourceList = trelloBoard.lists[source.droppableId];
    const trelloDestinationList = trelloBoard.lists[destination.droppableId];

    // Remove card from source list
    const newTrelloSourceListCardsOrder = [...trelloSourceList.cards];
    newTrelloSourceListCardsOrder.splice(source.index, 1);

    // Insert card into destination list
    const newTrelloDestinationListCardsOrder = [...trelloDestinationList.cards];
    newTrelloDestinationListCardsOrder.splice(
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
            cards: newTrelloSourceListCardsOrder,
          },
          [destination.droppableId]: {
            ...prevData.lists[destination.droppableId],
            cards: newTrelloDestinationListCardsOrder,
          },
        },
      };
    });
  };

  const onDragEndHandler = (event) => {
    const { source, destination, type } = event;

    //  Handle drop without destination
    if (!destination) {
      return;
    }

    //  Drag and drop list column
    if (type === 'COLUMN') {
      onDragColumn({
        source,
        destination,
        event,
      });
    }

    if (type === 'LIST') {
      //  Drag and drop cards in same list
      if (source.droppableId === destination.droppableId) {
        onDragCardSameList({
          source,
          destination,
          event,
        });
      }

      //  Drag and drop cards to different list
      if (source.droppableId !== destination.droppableId) {
        onDragCardDifferentList({
          source,
          destination,
          event,
        });
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        trelloBoard,
        onAddCard,
        onDeleteCard,
        onDeleteList,
        onAddList,
        onDragEndHandler,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

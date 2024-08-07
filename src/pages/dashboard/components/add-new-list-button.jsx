import { useState } from 'react';
import { useAppContext } from '../../../contexts/use-app-context';

// UI lib
import { Input, Button, Card } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

function AddNewListButton() {
  // State hook
  const [trelloList, setTrelloList] = useState('');
  const [isNewListModalVisible, setNewListModalVisible] = useState(false);

  // Context hook
  const { onAddList } = useAppContext();

  // Function handler
  const onChangeHandler = (event) => {
    setTrelloList(event.target.value);
  };

  const onAddListHandler = () => {
    // TODO: Implement validation for empty list title
    if (!trelloList) {
      return;
    }

    onAddList(trelloList);

    // Reset the input field and hide the modal
    setTrelloList('');
    setNewListModalVisible(false);
  };

  return (
    <>
      {isNewListModalVisible ? (
        <Card
          bordered={false}
          className="min-w-[35rem]"
          actions={[
            <Button key="confirm" type="primary" onClick={onAddListHandler}>
              Add list
            </Button>,
            <CloseOutlined
              key="cancel"
              onClick={() => {
                setNewListModalVisible(false);
              }}
            />,
          ]}
        >
          <Input
            placeholder="Enter list title"
            value={trelloList}
            onChange={onChangeHandler}
          />
        </Card>
      ) : (
        <Button
          type="text"
          key="add"
          className="min-w-[35rem]"
          onClick={() => setNewListModalVisible(true)}
        >
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
      )}
    </>
  );
}

export default AddNewListButton;

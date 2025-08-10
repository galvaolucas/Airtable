const TextEditComponent = ({ show, text, itemsCopy, setItemsCopy, itemId }) => {
  const onChange = (e) => {
    const index = itemsCopy.findIndex(item => `laneItem_${item.id}` === itemId)
    let newItems = itemsCopy;
    let newItem = itemsCopy[index];
    newItem = {
      ...newItem,
      name: e.target.value,
    }
    newItems[index] = newItem;
    setItemsCopy(newItems);
  }

  if (!show) {
    return <div className="w-full">{text}</div>;
  }

  return (
    <div className="w-full">
      <input id={`${itemId}_textInput`} className="p-2 w-full" defaultValue={text} onChange={onChange} />
    </div>
  );
};

export default TextEditComponent;

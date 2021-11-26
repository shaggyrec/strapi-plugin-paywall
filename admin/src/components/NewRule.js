import React, {useState} from 'react';
import Rule from "./Rule";

function NewRule({ collectionTypes, onAdd }) {
  const [showForm, setShowForm] = useState(false);

  function toggleForm() {
    setShowForm(!showForm);
  }

  if (!showForm) {
    return <button className="btn btn-primary py-2 px-4" onClick={toggleForm}>Add rule</button>;
  }

  return <Rule collectionTypes={collectionTypes} onChange={onAdd}/>;
}

export default NewRule;
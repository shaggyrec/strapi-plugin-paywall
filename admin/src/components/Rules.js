import React, {useEffect, useState} from 'react';
import Rule from './Rule';
import NewRule from "./NewRule";

function Rules({ rules, contentTypes, onChange }) {
  const [allowedCollectionsTypes, setAllowedCollectionsTypes] = useState({});

  useEffect(() => {
    const newAllowedCollectionsTypes = {};
    for (const c in contentTypes) {
      if (!rules.find(r => r.model === c)) {
        newAllowedCollectionsTypes[c] = contentTypes[c];
      }
    }
    setAllowedCollectionsTypes(newAllowedCollectionsTypes);
  }, [contentTypes, rules])

  function handleAdd(settings) {
    onChange([ ...(rules || []), settings ]);
  }

  function handleUpdate(settings, index) {
    onChange(rules.map((r, i) => i === index ? settings : r));
  }

  function handleRemove(i) {
    if (confirm('Are you sure')) {
      onChange(rules.filter((_, index) => i !== index));
    }
  }

  if (Object.keys(contentTypes).length === 0) {
    return <h3>No collections for paywall</h3>;
  }

  return (
    <div>
      {
        (rules || []).map((r, i) => (
          <div key={`rule-${r.model}`} className="p-4 border mb-4">
            <Rule
              rule={r}
              collectionTypes={{...allowedCollectionsTypes, [r.model]: contentTypes[r.model]}}
              onChange={s => handleUpdate(s, i)}
              onDelete={() => handleRemove(i)}
            />
          </div>
        ))
      }
      {Object.keys(allowedCollectionsTypes).length > 0 && (
        <div className="p-4 border mb-4">
          <NewRule collectionTypes={allowedCollectionsTypes} onAdd={handleAdd}/>
        </div>
      )}
    </div>
  );
}

export default Rules;
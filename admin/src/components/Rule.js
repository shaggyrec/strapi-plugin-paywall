import React, {useState} from 'react';

const contentTypes = ['article', 'wistia']

const defaultOptions = {
  [contentTypes[0]]: {
    timeThreshold: 3,
    fullReading: 1,
    wordsToShow: 20
  },
  [contentTypes[1]]: {
    timeThreshold: 5
  }
};

const labelText = {
  timeThreshold: 'Time threshold',
  fullReading: 'Full reading to threshold',
  wordsToShow: 'World to show'
};

function Rule({ collectionTypes, onChange, rule, onDelete }) {
  const collectionTypesNames = Object.keys(collectionTypes);
  if (collectionTypesNames.length === 0) {
    return null;
  }
  const [state, setState] = useState({
    model: collectionTypesNames[0],
    type: contentTypes[0],
    path: '/' + collectionTypesNames[0],
    field: Object.keys(collectionTypes[collectionTypesNames[0]])
      .filter(f => ['string', 'text'].indexOf(collectionTypes[collectionTypesNames[0]][f].type) !== -1)[0],
    ...defaultOptions[contentTypes[0]],
    ...(rule || {})
  });

  function handleChange ({ target: { value } }, fieldName) {
    if (fieldName === 'type') {
      setState({
        model: state.model,
        type: value,
        ...defaultOptions[value]
      })
    } else {
      setState({ ...state, [fieldName]: value });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onChange(state);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="d-flex">
          <div className="w-25">
            Collection
          </div>
          <div className="w-75">
            <select className="border px-2 py-1 w-100" value={state.model} onChange={(e) => handleChange(e, 'model')}>
              {collectionTypesNames.map(t => (<option key={`${state.model}-rule-content-option-${t}`}>{t}</option>))}
            </select>
          </div>
        </label>
      </div>
      <div>
        <label className="d-flex">
          <div className="w-25">
            Type of content
          </div>
          <div className="w-75">
            <select className="border px-2 py-1 w-100" value={state.type} onChange={(e) => handleChange(e, 'type')}>
              {contentTypes.map(t => (<option key={`${state.model}-rule-contentTypes-option-${t}`}>{t}</option>))}
            </select>
          </div>
        </label>
      </div>
      {collectionTypes[state.model] && (
        <div>
          <label className="d-flex">
            <div className="w-25">
              Field for paywall
            </div>
            <div className="w-75">
              <select className="border px-2 py-1 w-100" value={state.field} onChange={(e) => handleChange(e, 'field')}>
                {
                  Object.keys(collectionTypes[state.model])
                    .filter(f => ['string', 'text'].indexOf(collectionTypes[state.model][f].type) !== -1)
                    .map(t => (<option key={`${state.model}-rule-contentTypes-field-${t}`}>{t}</option>))
                }
              </select>
            </div>
          </label>
        </div>
      )}
      <div>
        <label className="d-flex">
          <div className="w-25">
            Path to track on frontend
          </div>
          <div className="w-75">
            <input
              className="border px-2 py-1 w-100"
              value={state.path}
              onChange={e => handleChange(e, 'path')}
            />
          </div>
        </label>
      </div>
      {defaultOptions[state.type] && Object.keys(defaultOptions[state.type]).map(o => (
        <div key={`${state.model}-rule-options-option-${o}`}>
          <label className="d-flex">
            <div className="w-25">
              {labelText[o]}
            </div>
            <div className="w-75">
              <input
                className="border px-2 py-1 w-100"
                value={state[o]}
                onChange={e => handleChange(e, o)}
              />
            </div>
          </label>
        </div>
      ))}
      <div className="d-flex" style={{ gap: '5px' }}>
        <button className="btn btn-primary py-2 px-4">Save</button>
        {rule && <button type="button" className="btn btn-danger py-2 px-4" onClick={onDelete}>Delete</button>}
      </div>
    </form>
  );
}

export default Rule;
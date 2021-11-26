import React, {useEffect, useState} from 'react';
import {usePrevious} from "../hooks/usePrevious";

function Settings({ settings, onSubmit }) {
  const [state, setState] = useState({
    token: settings.token || '',
    hardCapLimitation: settings.hardCapLimitation || 2
  });
  const prevSettings = usePrevious(settings);

  useEffect(() => {
    if (prevSettings && Object.keys(prevSettings).length === 0) {
      let newState = { ...state };
      for (const setting in state) {
        if (settings[setting]) {
          newState[setting] = settings[setting];
        }
      }
      setState(newState);
    }
  }, [settings]);

  const handleChange = fieldName => ({ target: { value } }) => {
    setState({ ...state, [fieldName]: value})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(state);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="d-flex">
          <div className="w-25">FingerPrint token:</div>
          <div className="w-75">
            <input
              required
              className="w-100 border p-2"
              type="text"
              value={state.token}
              onChange={handleChange('token')}
              placeholder="Enter a FingerPrint token token"
            />
          </div>
        </label>
      </div>
      <div>
        <label className="d-flex">
          <div className="w-25">Hard Cap Limitation:</div>
          <div className="w-75">
            <input
              required
              className="w-100 border p-2"
              type="text"
              value={state.hardCapLimitation}
              onChange={handleChange('hardCapLimitation')}
              placeholder="2"
            />
          </div>
        </label>
      </div>
      <div>
        <button type="submit" className="btn btn-primary py-2 px-4">Save settings</button>
      </div>
    </form>
  );
}

export default Settings;
import React, { useState } from 'react';

let timer;

function TrackingList({ list, visitorId, onChangeVisitorId }) {
  const [visitor, setVisitor] = useState(visitorId);

  function handleChangeVisitor({ target: { value } }) {
    setVisitor(value);
    clearTimeout(timer);
    timer = setTimeout(() => onChangeVisitorId(value), 1000);
  }

  return (
    <table className="table">
      <tbody>
      <tr>
        <td>
          <small>Search by visitor id:</small>
          <div>
            <input
              autoFocus={!!visitor}
              className="border px-2"
              type="text"
              value={visitor}
              onChange={handleChangeVisitor}/>
          </div>
        </td>
        <td></td>
        <td></td>
      </tr>
      {list.length === 0 && (
        <tr>
          <td><h4>No data</h4></td>
          <td></td>
          <td></td>
        </tr>
      )}
      {list.map(i => (
        <tr key={i.id}>
          <td>{i.visitor}</td>
          <td>
            <table>
              <tbody>
              {i.visits.map((v, index) => (
                <tr key={`visit-${i.id}-${index}`}>
                  <td>{v.path}</td>
                  <td>{(new Date(v.date)).toLocaleString()}</td>
                  <td>{v.threshold ? 'threshold' : ''}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </td>
          <td>{i.enabled ? 'blocked' : ''}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}

export default TrackingList;
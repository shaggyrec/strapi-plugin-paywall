import React from 'react';

function TrackingList({ list }) {
  if (list.length === 0) {
    return (<h4>No data</h4>);
  }
  return (
    <table className="table">
      <tbody>
        {list.map(i => (
          <tr key={i.id}>
            <td>{i.visitor}</td>
            <td>
              <table>
                <tbody>
                {i.visits.map(v => (
                  <tr>
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
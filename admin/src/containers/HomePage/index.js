/*
 *
 * HomePage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import * as axios from 'axios';
import TrackingList from '../../components/TrackingList';
import TrackingListPaginator from "../../components/TrackingListPaginator";
import pluginId from "../../pluginId";

function requestHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('jwtToken'))}`,
    }
  };
}

const PER_PAGE = 30;

function HomePage () {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [listCap, setListCap] = useState(0);
  const [listOffset, setListOffset] = useState(0);
  const [filterByVisitor, setFilterByVisitor] = useState('');

  async function fetchData() {
    setLoading(true);
    const filters = filterByVisitor ? ('visitor_eq=' + filterByVisitor) : '';
    let r = await axios.get(
      strapi.backendURL + '/paywall/list?_limit=' + PER_PAGE + '&_start=' + listOffset + '&' + filters,
      requestHeaders()
    );
    setList(r.data);
    setLoading(false);
    r = await axios.get(strapi.backendURL + '/paywall/list/count?' + filters, requestHeaders());
    setListCap(r.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [listOffset, filterByVisitor]);

  function handleChangeOffset(o) {
    setListOffset(o);
  }

  async function handleClickReset() {
    if (confirm('Are you really want to reset all paywall counters?')) {
      setLoading(true);
      await axios.patch(strapi.backendURL + '/paywall/reset', {}, requestHeaders());
      setLoading(false);
      fetchData();
    }
  }

  return (
    <div className="p-5 position-relative">
      <Loader show={loading}/>
      <h1>{pluginId.toUpperCase()}</h1>
      <div className="py-5">
        <Link to="/plugins/paywall/settings" className="btn btn-primary px-4 py-2"><h4>Settings</h4></Link>
      </div>
      <TrackingList
        list={list}
        visitorId={filterByVisitor}
        onChangeVisitorId={setFilterByVisitor}
      />
      <TrackingListPaginator
        cap={listCap}
        perPage={PER_PAGE}
        currentOffset={listOffset}
        onChange={handleChangeOffset}
      />
      <button onClick={handleClickReset} className="btn btn-danger px-4 py-2">Reset all counters</button>
    </div>
  );
}

export default memo(HomePage);

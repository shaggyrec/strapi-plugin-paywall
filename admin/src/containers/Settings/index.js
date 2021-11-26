/*
 *
 * HomePage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import pluginId from '../../pluginId';
import * as axios from 'axios';
import Loader from "../../components/Loader";
import Settings from "../../components/Settings";
import Rules from "../../components/Rules";

function requestHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('jwtToken'))}`,
    }
  };
}

function SettingsPage () {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [contentTypes, setContentTypes] = useState({});
  useEffect(() => {
    (async function fetchData() {
      let r = await axios.get(strapi.backendURL + '/paywall/settings', requestHeaders());
      setSettings(r.data);
      setLoading(false);
      r = await axios.get(strapi.backendURL + '/paywall/content-types', requestHeaders());
      setContentTypes(r.data);
    })();
  }, [])

  const handleChangeSettings = async (newSettings) => {
    setLoading(true);
    await axios.post(strapi.backendURL + '/paywall/settings', newSettings, requestHeaders());
    setLoading(false);
    setSettings({ ...settings, ...newSettings });
  }

  return (
    <div className="p-5 position-relative">
      <Loader show={loading}/>
      <h1>{pluginId.toUpperCase()} Settings</h1>
      <div className="py-5">
        <Link to="/plugins/paywall" className="btn btn-primary px-4 py-2"><h4>Back to dashboard</h4></Link>
      </div>
      <div className="p-4" style={{ background: '#ddd' }}>
        <p>
          Copy this to the head of your sites frontend:
        </p>
        <p>
          <code>
            {`<script src="${strapi.backendURL}/paywall.js"></script>`}
          </code>
        </p>
        <p>Wrap container of content field with</p>
        <p>
          <code>
            {`<div data-paywall="true">...</div>`}
          </code>
        </p>
        <p>Add this code for getting paywalled content</p>
        <code>
          <pre>
{`window.paywallId.then(async (id) => {
    if (id) {
      this.article.<field-treamed-by-paywall> = await this.$strapi.$http.$get(\`/paywall/content/<modelName>/$\{this.$route.params.id}/$\{id}\`)
    }
});`}
          </pre>
        </code>
        <p>
          Set permissions for public role. Open the public role. Then click "paywall". Turn on "getcontent", "visit" and "setvisitorid" checkboxes.
          <br/>
          <a href="/admin/settings/users-permissions/roles/" target="_blank">Set permissions for public role</a>
        </p>
      </div>
      <h3 className="pt-4">General settings</h3>
      <div className="py-4">
        <Settings settings={settings} onSubmit={handleChangeSettings}/>
      </div>
      <hr />
      <h3 className="pt-4">Collections settings</h3>
      <div className="py-4">
        <Rules
          contentTypes={contentTypes}
          onChange={rules => handleChangeSettings({ rules })}
          rules={settings.rules}
        />
      </div>
    </div>
  );
}

export default memo(SettingsPage);

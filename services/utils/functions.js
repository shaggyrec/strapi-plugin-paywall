function deepMap (oldArray, callback, newArray = []) {
  if (oldArray.length <= 0){
    return newArray;
  } else {
    const [item, ...theRest] = oldArray
    const interimArray = [...newArray, callback(item)]
    return deepMap(theRest, callback, interimArray);
  }
}

module.exports = {
  extractMeta: plugins => {
    const { paywall: plugin } = plugins;
    const { paywall: service } = plugin.services;
    return {
      models: plugin.models,
      service,
      plugin,
      pluginName: plugin.package.strapi.name.toLowerCase()
    };
  },
  deepMap
}
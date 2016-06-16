import fetch from 'isomorphic-fetch';

var showLayer = function (url, layerId) {
  return {
    type: 'SHOW_LAYER',
    url: url
  };
};

var actions = {

  showLayer: showLayer,

  centerMap: function (extent) {
    return {
      type: 'CENTER_MAP',
      extent: extent
    };
  },
  showBounds: function(bounds) {
    return {
      type: 'SHOW_BOUNDS',
      bounds: bounds
    };
  },
  showExtent: function(extent) {
    return actions.showBounds([ [extent[0][1], extent[0][0]], [extent[1][1], extent[1][0]] ]);
  },
  loadCatalogRequest: function(url) {
    return {
      type: 'LOAD_CATALOG_REQEST',
      url: url
    };
  },

  loadCatalogSuccess: function(url, catalog) {
    return {
      type: 'LOAD_CATALOG_SUCCESS',
      url: url,
      catalog: catalog
    };
  },

  loadCatalogFailure: function(url, error) {
    return {
      type: 'LOAD_CATALOG_ERROR',
      url: url,
      error: error
    };
  },

  fetchCatalog: function (url) {
    return dispatch => {
      dispatch(actions.loadCatalogRequest(url));
      console.log("FETCH CATALOG", url + "/catalog");
      return fetch(url + "/catalog")
        .then(
          response => {
            response.json().then( json => {
              dispatch(actions.loadCatalogSuccess(url, json));
            });
          },
          error => dispatch(actions.loadCatalogFailure(url, error))
        );
    };
  },

    return dispatch => {
      console.log("Fetching polygonal summary", polygonLayer.toGeoJSON().geometry);
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(polygonLayer.toGeoJSON().geometry)
      }).then( response => {
        response.json().then( summary => {
          summary.type = indexType;
          polygonLayer.bindPopup(singlePolySummaryTemplate(summary));
        });
      },
      error => {
      });
    };
  },
  fetchTimeSeries: function(pointLayer, url) {
    return dispatch => {
      console.log("Fetching timeseries data", pointLayer.toGeoJSON().geometry);
      var chartID = shortid.generate();
      return fetch(url).then( response => {
        response.json().then( summary => {
          var data = _.map(summary.answer, function(d) { return { "date": new Date(d[0]), "value": d[1] }; });
          pointLayer.on("click", function() {
            pointLayer.bindPopup('<div id="' + chartID + '" style="width: 400px; height: 200px;"><svg/></div>',
                                 { 'maxWidth': 450 });
            pointLayer.openPopup();
            timeSeries(chartID, data);

            // Evidently unbinding is necessary for the graph to be rerendered properly
            pointLayer.unbindPopup();
          });
        });
      },
      error => {
      });
    }
  },
  showLayerWithBreaks: function(layerUrl, breaksUrl, layerId) {
    return dispatch => {
      console.log("Fetching breaks", breaksUrl);
      return fetch(breaksUrl)
        .then(
          response => {
            response.json().then( breaks => {
              dispatch(actions.showLayer(layerUrl + "&breaks=" + breaks.join(","), layerId));
            });
          },
          error => {}
        );
      };
  },
  showMaxState: function(url) {
    return dispatch => {
      console.log("Fetching max state", url);
      return fetch(url)
        .then(
          response => {
            response.json().then( geojson => {
              dispatch({
                type: 'SHOW_MAX_STATE',
                geojson: geojson
              });
            });
          },
          error => {}
        );
      };
  },
  hideMaxState: function() {
    return {
      type: 'HIDE_MAX_STATE'
    };
  },
  showMaxAverageState: function(url) {
    return dispatch => {
      console.log("Fetching max average state", url);
      return fetch(url)
        .then(
          response => {
            response.json().then( geojson => {
              dispatch({
                type: 'SHOW_MAX_AVERAGE_STATE',
                geojson: geojson
              });
            });
          },
          error => {}
        );
      };
  },
  hideMaxAverageState: function() {
    return {
      type: 'HIDE_MAX_AVERAGE_STATE'
    };
  },
  showStateAverage: function(url) {
    return dispatch => {
      console.log("Fetching state average", url);
      return fetch(url)
        .then(
          response => {
            response.json().then( geojson => {
              dispatch({
                type: 'SHOW_STATE_AVERAGE',
                geojson: geojson
              });
            });
          },
          error => {}
        );
      };
  },
  showStateDiffAverage: function(url) {
    return dispatch => {
      console.log("Fetching state average", url);
      return fetch(url)
        .then(
          response => {
            response.json().then( geojson => {
              dispatch({
                type: 'SHOW_STATE_DIFF_AVERAGE',
                geojson: geojson
              });
            });
          },
          error => {}
        );
      };
  }
};

module.exports = actions;

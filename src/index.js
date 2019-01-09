import getJS from "get-js";
import defaults from "./defaults";
import merge from "merge";
``;

const buildScriptURLs = (version = defaults.VERSION) => [
  `http://js.api.here.com/${version}/mapsjs-service.js`, // Service
  `https://js.api.here.com/${version}/mapsjs-ui.js`, // UI
  `http://js.api.here.com/${version}/mapsjs-mapevents.js` // Events
];

const merger = options => merge(defaults, options);

const scriptLoader = options => {
  const _options = merger(options || {});
  const { VERSION, version, interactive, includeUI } = _options;

  const _v = version || VERSION;
  const urls = buildScriptURLs(_v);

  // First let us remove the events if it is not needed. PERFORMANCE!!!
  !interactive ? urls.splice(2, 1) : null;
  // Removes the UI if not needed
  !includeUI ? urls.splice(1, 1) : null;
  const coreURL = `http://js.api.here.com/${_v}/mapsjs-core.js`;

  return getJS(coreURL)
    .then(function() {
      return getJS(urls);
    })
    .catch(error => {
      console.log(error);
    });
};

export default scriptLoader;

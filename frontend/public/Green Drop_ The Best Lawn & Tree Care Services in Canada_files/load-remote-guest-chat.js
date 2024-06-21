var guestChatAppName = 'vcc-guest-chat';
/**
 * Get local debugger version for GuestChat
 *
 * @returns {null | Object} - GuestChat registry entry with properties appName, appVersion, build and publicUrl
 */
function getGuestChatDebugVersion() {
  // @todo Remove in VCC-76431
  if (['qa', 'dev', 'acceptance', 'staging'].includes(ChatConfig.MFERegistryService.params.deliveryRealm)) {
    const localStorageKey = `vcc-debug-versions-${ChatConfig.MFERegistryService.params.agent}`;
    const data = localStorage.getItem(localStorageKey);
    const getFromLocalStorage = JSON.parse(data || '{"content": []}');
    return getFromLocalStorage.content.find(version => version.appName === guestChatAppName);
  }
  return null;
}

/**
 * Fetch micro frontend information from cloud8
 * @param {Object} cloud8RegistryConfig
 * @param {String} apps
 * @returns a promise
 */
function getGuestChatFromCloud8Registry(cloud8RegistryConfig, apps) {
  var registryUrl = cloud8RegistryConfig.cloud8BaseUrl + cloud8RegistryConfig.cloud8RegistryPath;
  var params = Object.assign({
    apps: apps.join(',')
  },
    cloud8RegistryConfig.params
  );

  return new Promise(function (resolve, reject) {
    jQuery.get(registryUrl, params)
      .done(resolve)
      .fail(reject)
  });
}

/**
 * Fetch public url for micro frontend
 * @param {Object} registryServiceConfig
 * @param {String} appName
 * @param {String} appVersion
 * @returns a promise
 */
function getGuestChatRegistryInfo(registryServiceConfig, appName, appVersion) {
  try {
    var localRegistryServiceConfig = localStorage.getItem('vcc-local-registry-service');
    if (localRegistryServiceConfig) {
      registryServiceConfig = Object.assign(
        JSON.parse(JSON.stringify(registryServiceConfig)),
        JSON.parse(localRegistryServiceConfig)
      );
    }
  } catch (err) {
    // Access is denied for localStorage
    console.error(err)
  }
  return getGuestChatFromCloud8Registry(registryServiceConfig, [appName + '@' + appVersion])
    .then(function (registryResponse) {
      return registryResponse.content.find(function (item) {
        return item.appName === appName
      });
    })
    .catch(function (err) {
      console.log('Registry error [' + appName + '@' + appVersion + ']', err)
    })
}

/**
 * Insert micro frontend script in document
 * @param {String} url
 * @returns a promise
 */
function loadGuestChatRemoteScript(url) {
  var docElement = document;
  var scriptElement = docElement.createElement('script');
  scriptElement.src = url;
  scriptElement.type = 'text/javascript';
  scriptElement.async = true;
  if (docElement.readyState === 'complete') {
    docElement.body.appendChild(scriptElement);
  } else {
    docElement.addEventListener('readystatechange', function () {
      if (docElement.readyState === 'complete') {
        docElement.body.appendChild(scriptElement);
      }
    });
  }

  return new Promise(function (resolve, reject) {
    scriptElement.onload = resolve;
    scriptElement.onerror = reject;
  });
}

function initGuestChatAppScript(appInfo) {
  var appUrl = appInfo && appInfo.publicUrl + `${guestChatAppName}.js`;
  return appInfo && loadGuestChatRemoteScript(appUrl)
}

/**
 * Load GuestChat App base on config
 * @param {Object} config                       General Guest Chat App config
 * @param {Object} config.MFERegistryService    MFE Registry configuration
 * @param {String} config.guestChatBuildVersion Overrides MFERegistryService build information for dev/qe
 * @param {String} config.packageVersion        The app version to use
 * @param {String} config.templateVersion       Sets the chat theme - 'Nugen'|'Classic'
 * @param {Boolean} config.isPreviewMode        Determines whether to load GuestChat or GuestChatPreview
 * @returns the guest chat app
 */
function loadGuestChatApp(config) {
  var appLoaderGuestChat;
  var appInfoGuestChat;
  if (config.guestChatBuildVersion) {
    var publicUrlGuestChat = 'https://vcc-assets.8x8.com/vcc-guest-chat/' + config.guestChatBuildVersion + '/'
    appInfoGuestChat = {
      publicUrl: publicUrlGuestChat,
      appName: guestChatAppName,
      appVersion: config.packageVersion,
      build: config.guestChatBuildVersion,
      templateVersion: config.templateVersion,
      deploymentDate: Date.now()
    }
    appLoaderGuestChat = initGuestChatAppScript({ publicUrl: publicUrlGuestChat })
  } else {
    appLoaderGuestChat = getGuestChatRegistryInfo(config.MFERegistryService, guestChatAppName, '*')
      .then(function (info) {
        appInfoGuestChat = info;
        return initGuestChatAppScript(info)
      })
  }

  return appLoaderGuestChat
    .then(function () {
      var container = window['VCCGuestChat'];
      return config.isPreviewMode
          ? container.get('GuestChatPreview')
          : container.get('GuestChat');
    })
    .then(function (Module) { return Module().default })
    .then(function (guestChatApp) {
      return {
        appInfo: appInfoGuestChat,
        guestChatApp: guestChatApp()
      };
    })
}

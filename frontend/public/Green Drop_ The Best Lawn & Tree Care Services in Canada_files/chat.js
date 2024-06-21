(function(JSON) {
    /**
     * Array.prototype.indexOf() Polyfill
     */
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt) {
            var len = this.length >>> 0,
                from = Number(arguments[1]) || 0;

            from = (from < 0) ? Math.ceil(from) : Math.floor(from);

            if (from < 0) {
                from += len;
            }

            for (; from < len; from++) {
                if (from in this && this[from] === elt) {
                    return from;
                }
            }

            return -1;
        };
    }

    /**
     * Holds the Embedded Chat object object.
     *
     * The __8x8Chat should be present in the page, so we can load the Chat configuration.
     */
    var EmbeddedChat = {};

    /**
     * Define the shared alias.
     */
    EmbeddedChat.SHARED_ALIAS = "/shared";

    /**
     * Define the CHAT path.
     */
    EmbeddedChat.CHAT_PATH = "/CHAT";

    /**
     * Define the common path.
     */
    EmbeddedChat.COMMON_PATH = "/common";

    /**
     * Flag to be used to log errors in the browser console.
     */
    EmbeddedChat.ERROR_FLAG = "8x8Chat";

    /**
     * Name for the popup window.
     */
    EmbeddedChat.POPUP_WINDOW_NAME_PREFIX = "8x8EmbeddedChatPopup";

    /**
     * Define the maximum number of tries to check for the co-browsing instance.
     */
    EmbeddedChat.MAX_CO_BROWSING_INSTANCE_CHECK_TRIES = 10;

    /**
     * Is the theme NuGen
     */
    EmbeddedChat.IS_NUGEN = false;

    /**
     * Define the current log level (debug, info, warn, error)
     */
    EmbeddedChat.logLevel = "debug";

    /**
     * Define the log list severity.
     */
    EmbeddedChat.logList = ["debug", "info", "warn", "error"];

    /**
     * Store the current log level index.
     */
    EmbeddedChat.logLevelIndex = Infinity;

    /**
     * Define the container properties to set its size.
     */
    EmbeddedChat.containerProperties = {
        class: "__8x8Chat-Container",
        width: "334px",
        height: {
            closed: "0",
            minimized: "50px",
            invitationOpen: "260px",
            open: "330px"
        },
        left: "20px",
        right: "20px",
        nuGen: {
            boxShadow: "0px 2px 20px rgba(41, 41, 41, 0.25)",
            borderRadius: "6px",
            height: {
                closed: "0",
                minimized: "50px",
                invitationOpen: "593px",
                open: "593px",
            }
        }
    };

    /**
     * Define the pop up window properties to set its size.
     */
    EmbeddedChat.windowProperties = EmbeddedChat.containerProperties;

    /**
     * Define a delay when changing the Embedded Chat height in milliseconds
     */
    EmbeddedChat.chatHeightChangeDelay = 100;

    EmbeddedChat.defaultLanguage = "en";

    /**
     * Create the pub/sub message bus for communication with the parent page.
     * Note: This code is also available in the chat.js file.
     */
    EmbeddedChat.bus = (function() {
        var topics = {};

        return {
            subscribe: function(topic, listener) {
                if (!topics[topic]) {
                    topics[topic] = {listeners: []};
                }

                var index = topics[topic].listeners.push(listener) - 1;
                return {
                    remove: function() {
                        delete topics[topic].listeners[index];
                    }
                };
            },
            publish: function(topic, info) {
                if (!topics[topic] || !topics[topic].listeners.length) {
                    return;
                }

                var listeners = topics[topic].listeners;
                for (var i = 0, len = listeners.length; i < len; i++) {
                    if (typeof listeners[i] === "function") {
                        try {
                            listeners[i](info);
                        } catch (e) {
                            EmbeddedChat.log("error", e.message);
                        }
                    }
                }
            }
        };
    })();

    EmbeddedChat.getDiscoveryDomain = function(discoveryUrl) {
        return new Promise((resolve) => {
            const defaultDomain = this.config.domain;

            if (!discoveryUrl) {
                console.warn(`Failed to get discovery URL, will continue using ${defaultDomain}`);
                resolve(defaultDomain);
            }

            const params = { domain: defaultDomain, tenant: this.config.tenant, channelUuid: this.config.channelUuid };
            const url = new URL(discoveryUrl);
            url.search = new URLSearchParams(params).toString();

            fetch(url)
                .then(response => response.json())
                .then(data => resolve(!data.domain ? defaultDomain : data.domain))
                .catch(err => {
                    console.warn(`Failed to retrieve override domain, will continue using ${defaultDomain}`, err);
                    resolve(defaultDomain);
                })
        })
    }

    /**
     * Start the embedded chat.
     */
    EmbeddedChat.start = function() {
        this.config = window.__8x8Chat;

        // Check if the configuration has everything we need before proceed.
        if (this.checkValid()) {
            this.checkPlatformAndConfigure();
        } else {
            EmbeddedChat.log("error", "Can't load - Invalid parameters");
        }
    };

    /**
     * Check the platform and configure the Embedded Chat.
     */
    EmbeddedChat.checkPlatformAndConfigure = function() {
        EmbeddedChat.checkPlatform(function() {
            EmbeddedChat.configure();
        });
    };

    /**
     * Configure the Embedded Chat.
     */
    EmbeddedChat.configure = function() {
        // Configure the Post Message to communicate to the iframe
        this.configureMessage();

        // Create both the div container and the iframe that will be inserted inside the
        // div container.
        this.container = this.createContainer();
        this.iframe = this.createIFrame();
        this.appendToBody(this.container, this.iframe);
    };

    /**
     * Called when we established the communication with the iframe or window.
     * Note that this function can be called twice if the chat is configured as a popup.
     * In this case, this function will be called once to indicate the communication between
     * the iframe was established and once the popup is open, the same function is called
     * when the communication is established.
     */
    EmbeddedChat.onCommunicationEstablished = function(config) {
        EmbeddedChat.log("info", "Communication established to", (config && config.isPopup? "Popup" : "IFrame"));
    };

    /**
     * Called when the bus can be initialized.
     */
    EmbeddedChat.onBusInitialize = function(data) {
        EmbeddedChat.log("info", "Bus initialize started");

        this.unsubscribeBusEvents();
        this.subscribeBusEvents();

        this.resetStartedByChatAPI();

        if (!data.popup) {
            // Only call the init function when the loaded messages comes from the embedded chat
            // (not the popped out one).
            // Pass the pub/sub message bus to the embedded page
            var onInit = this.config.onInit;
            if (typeof onInit === "function") {
                onInit(this.bus);
            }

            this.listenOnBrowserInfo();

            // Send popup Position
            this.sendChatPopupPosition();

            this.sendBusInitializeCompleted();
        }
    };

    /**
     * Listen on browser resizing
     */
    EmbeddedChat.listenOnBrowserInfo = function () {
        this.sendBrowserInfo();

        var resizeTimer;
        // listen on resize window
        window.addEventListener('resize', function () {
            window.clearInterval(resizeTimer);
            resizeTimer = window.setTimeout(function () {
                EmbeddedChat.sendBrowserInfo();
            }, 1000/ 60); // fps
        });
    }

    /**
     * Check whether the __8x8Chat object exist and if it has all the required parameters.
     */
    EmbeddedChat.checkValid = function() {
        var valid = window.__8x8Chat &&
                    this.config &&
                    this.config.uuid &&
                    this.config.tenant &&
                    this.config.domain &&
                    this.config.channel &&
                    this.config.align;

        if (valid) {
            if (this.config.stylesheetURL && typeof this.config.stylesheetURL != "string") {
                valid = false;

            } else if (this.config.stylesheetURL && this.config.stylesheetURL.toLowerCase().indexOf("https:") !== 0) {
                valid = false;
            }
        }

        return valid;
    };

    /**
     * Listener method to detect when the proxy iframe get the config from 8x8-chat domain
     * @param event - window message event
     */
    EmbeddedChat.configBrokerListener = function(event) {
        try {
            var message = JSON.parse(event.data);
        } catch (e) {
            EmbeddedChat.log("error", "Failed to parse event data: " + e.message);
        }

        var type = message && message.type;

        switch (type) {
            case "_8x8ChatReady":
                var query = [];
                query.push("action=checkPlatform");
                query.push(["tenant", encodeURIComponent(this.config.tenant)].join("="));
                query.push(["channel", encodeURIComponent(this.config.channel)].join("="));
                query.push(["script", encodeURIComponent(this.config.uuid)].join("="));
                var src = this.getURL("chat") + "/chat.php?" + query.join("&");
                event.source.postMessage(JSON.stringify({"url": src}), '*');
                event.source.postMessage(EmbeddedChat.getChatConfig(), "*");

                break
            case "_8x8ChatConfig":
                try {
                    const data = JSON.parse(message.config);
                    const discoveryUrl = data.response.data?.discoveryUrl;
                    EmbeddedChat.getDiscoveryDomain(discoveryUrl)
                        .then((domain) => {
                            this.config.domain = domain;
                            EmbeddedChat.checkPlatformScriptLoaded(data);
                        })
                } catch (e) {
                    EmbeddedChat.log("error", "Failed to parse chat config: " + e.message);
                }
                break;
            default:
                EmbeddedChat.log("debug", "Unsuported type: " + type);
        }
    }.bind(EmbeddedChat);

    /**
     * Get the chat configuration to set in the localStorage to be accessed by the
     * embedded chat.
     * This is to avoid passing sensitive information in iframe url.
     *
     * @return json string
     */
    EmbeddedChat.getChatConfig = function() {
        var key = "__8x8Chat-" + this.config.uuid;
        return JSON.stringify({
            setConfig: true,
            key: key,
            value: {
                customSystemMessages: window.__8x8Chat.customSystemMessages
            }
        });
    };

    /**
     * Check the Platform status before loading the Chat content.
     *
     * @param callback the callback to call
     */
    EmbeddedChat.checkPlatform = function(callback) {
        EmbeddedChat.checkPlatformCallback = callback;
        EmbeddedChat.__8x8ChatConfigBrokerFrame = EmbeddedChat.createConfigBrokerIFrame();

        window.addEventListener('message', EmbeddedChat.configBrokerListener, true);
    };

    /**
     * Remove configBroker's iframe and event listener
     */
    EmbeddedChat.removeConfigBroker = function() {
        if (EmbeddedChat.__8x8ChatConfigBrokerFrame) {
            window.removeEventListener('message', EmbeddedChat.configBrokerListener, true);
            EmbeddedChat.__8x8ChatConfigBrokerFrame.parentNode.removeChild(EmbeddedChat.__8x8ChatConfigBrokerFrame);
            EmbeddedChat.__8x8ChatConfigBrokerFrame = null;
        }
    };

    /**
     * Called when the script is loaded.
     * NOTE: This function is similar to the one in embedded-chat.js
     *
     * @param data data loaded from server
     */
    EmbeddedChat.checkPlatformScriptLoaded = function(data) {
        if (data) {
            var platformStatus = this.checkPlatformStatus(data.response);

            this.removeConfigBroker();
            if (platformStatus == "redirect" && !this.platformRedirection) {
                this.redirectPlatform(data.response.data.platformURLRedirect);
            } else if (platformStatus == "redirect") {
                EmbeddedChat.checkPlatformCallback && EmbeddedChat.checkPlatformCallback();
            } else if (platformStatus == "ready") {
                EmbeddedChat.callerIpAddress = data.response.data.callerIPAddress;
                EmbeddedChat.setPopoutConfiguration(data.response.data.configuredAsPopup);
                EmbeddedChat.checkPlatformCallback && EmbeddedChat.checkPlatformCallback();
            }
        }
    };

    /**
     * Check the platform status to see if we can proceed.
     * NOTE: This function is the same as the one in embedded-chat.js
     *
     * @param response data response from server
     *
     * @return the platform status
     */
    EmbeddedChat.checkPlatformStatus = function(response) {
        var platformStatus;

        if (response && response.status !== undefined) {

            // Assume it is ready
            platformStatus = "ready";

            if (response.status == 1) {
                // Internal server error
                EmbeddedChat.log("error", "Can't load - Internal Server error");
                platformStatus = "error";

            } else if (response.status == 0) {

                if (!response.data.tenantEnabled) {
                    // Internal server error
                    EmbeddedChat.log("error", "Can't load - Internal Server error");
                    platformStatus = "error";

                } else if (response.data.tenantEnabled === "no") {
                    // Tenant is disabled
                    EmbeddedChat.log("error", "Can't load - Tenant disabled");
                    platformStatus = "error";

                } else if (response.data.tenantEnabled === "yes") {

                    if (response.data.platformInMaintenance) {
                        if (response.data.platformURLRedirect) {
                            // Redirect needed
                            EmbeddedChat.log("info", "Platform in maintenance - Redirecting...");
                            platformStatus = "redirect";

                        } else {
                            // Platform in maintenance
                            EmbeddedChat.log("error", "Can't load - Platform in maintenance");
                            platformStatus = "error";
                        }
                    }

                    if (!response.data.channelEnabled) {
                        EmbeddedChat.log("error", "Can't load - Channel " + response.data.channelStatus || "disabled");
                        platformStatus = "error";
                    }
                }
            }
        }

        return platformStatus;
    };

    /**
     * Redirect the chat to the specified platform url.
     *
     * @param redirectUrl url to redirect the chat
     */
    EmbeddedChat.redirectPlatform = function(redirectUrl) {

        var parsedURL = this.parseURL(redirectUrl);

        if (parsedURL.protocol) {
            this.config.domain = parsedURL.protocol + "://" + parsedURL.domain;
            this.config.path = parsedURL.path;
            this.platformRedirection = true;

            EmbeddedChat.log("debug", "Redirecting to", this.config.domain + this.config.path);

            // Reconfigure the chat
            this.checkPlatformAndConfigure();

        } else {
            EmbeddedChat.log("error", "Can't load - Redirect URL is invalid");
        }
    };

    /**
     * Parse the url to get domain and path.
     *
     * @param url the url to parse
     *
     * @return an object containing the protocol, domain and path
     */
    EmbeddedChat.parseURL = function(url) {

        var parsedURL = {};

        if (typeof url == "string") {
            // Get the protocol
            var urlSplit = url.split("://");
            if (urlSplit.length == 2) {
                parsedURL.protocol = urlSplit[0];

                var remainingUrl = urlSplit[1];

                // Get the domain and path
                var remainingUrlSplit = remainingUrl.split("/");
                parsedURL.domain = remainingUrlSplit[0];
                parsedURL.path = "/" + remainingUrlSplit.slice(1).join("/");
            }
        }

        return parsedURL;
    };

    EmbeddedChat.changeStyleBasedOnViewport = function (container) {
            var viewportHeight = window.innerHeight;
            var viewportWidth = window.innerWidth;

            if (viewportHeight < 260) {
                container.style.bottom = "auto";
                container.style.top = "0";
            } else {
                container.style.bottom = "0";
                container.style.top = "auto";
            }

            if (viewportWidth <= 355) {
                container.style.right = "auto";
                container.style.left = "0";
            } else {
                if (this.config.align === "left") {
                    container.style.left = EmbeddedChat.containerProperties.left;

                } else {
                    container.style.right = EmbeddedChat.containerProperties.right;
                    container.style.left = "auto";
                }
            }
    }

    /**
     * Create the container to be added to page in order to embed the iframe that will contain the chat.
     */
    EmbeddedChat.createContainer = function() {
        var container = document.createElement("div");
        container.classList.add(EmbeddedChat.containerProperties.class);
        container.style.position = "fixed";
        container.style.bottom = "0";
        container.style.width = EmbeddedChat.containerProperties.width;
        container.style.height = EmbeddedChat.containerProperties.height.closed;
        container.style.maxHeight = "100%";
        container.style.maxWidth = "100%";
        container.style.overflow = "hidden";
        container.style.zIndex = "2147483600";
        container.style.backgroundColor = "transparent";
        container.style.border = "0";

        if (this.config.align == "left") {
            container.style.left = EmbeddedChat.containerProperties.left;
        } else {
            container.style.right = EmbeddedChat.containerProperties.right;
        }

        EmbeddedChat.changeStyleBasedOnViewport(container);
        window.addEventListener("resize", EmbeddedChat.changeStyleBasedOnViewport.bind(this, container));

        return container;
    };

    /**
     * Create the iframe that will load the embedded chat;
     */
    EmbeddedChat.createIFrame = function() {
        var src = this.getEmbeddedChatURL(false);

        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", src);
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = 0;
        iframe.marginHeight = "0";
        iframe.marginWidth = "0";
        iframe.frameBorder = "no";
        iframe.title = 'Chat window';

        return iframe;
    };

    /**
     * Update container styles when NuGen
     */
    EmbeddedChat.updateContainerStylesForNugen = function() {
        const container = document.querySelector(`.${EmbeddedChat.containerProperties.class}`);

        if (container) {
            container.style.boxShadow = EmbeddedChat.containerProperties.nuGen.boxShadow;
            container.style.borderRadius = EmbeddedChat.containerProperties.nuGen.borderRadius;
        }
    };

    /**
     * Create the iframe that will load the embedded chats config
     * will be removed once that is done;
     */
    EmbeddedChat.createConfigBrokerIFrame = function() {
        var src = this.getURL("static-common") + "/html/config-broker.html"

        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", src);
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = 0;
        iframe.style.position = "absolute";
        iframe.style.top = "-10px";
        iframe.style.left = "-10px";
        iframe.marginHeight = "0";
        iframe.marginWidth = "0";
        iframe.frameBorder = "no";

        var os = document.getElementsByTagName("script")[0];
        os.parentNode.insertBefore(iframe, os);

        return iframe;
    };

    /**
     * Get the Embedded Chat URL and add all the required parameters.
     *
     * @param isPopup whether the URL is for a popup
     *
     * @param popupOrigin
     * @return the URL for the Embedded Chat
     */
    EmbeddedChat.getEmbeddedChatURL = function(isPopup, popupOrigin) {
        var chatFrameOrigin = popupOrigin ? popupOrigin : 'button';
        var domain = window.location.protocol + "//" + window.location.host;
        var channelUuid = this.config.channelUuid;
        var src = this.getURL("static-common") + "/html/embedded-chat.html" +
                      "?uuid=" + encodeURIComponent(this.config.uuid) +
                      "&tenant=" + encodeURIComponent(this.config.tenant) +
                      "&domain=" + encodeURIComponent(domain) +
                      "&channel=" + encodeURIComponent(this.config.channel) +
                      (channelUuid ? "&channelUuid=" + encodeURIComponent(this.config.channelUuid) : '') +
                      "&referrer=" + encodeURIComponent(location.toString()) +
                      "&popup=" + encodeURIComponent(isPopup && isPopup.toString() || "false") +
                      "&chatAlign=" + encodeURIComponent(this.config.align || "right") +
                      "&popuporigin=" + encodeURIComponent(chatFrameOrigin) +
                      "&startedbychatapi=" + encodeURIComponent(EmbeddedChat.isStartedByChatAPI()) +
                      "&waitbusinitialize=true" +
                      "&syncrequired=" + encodeURIComponent(isPopup && EmbeddedChat.isWaitSyncRequired().toString() || "false");

        if (this.config.stylesheetURL) {
            src += "&stylesheetURL=" + encodeURIComponent(this.config.stylesheetURL);
        }
        if (this.config.guestChatBuildVersion) {
            src += "&guestChatBuildVersion=" + encodeURIComponent(this.config.guestChatBuildVersion);
        }

        return src;
    };

    EmbeddedChat.updateReferrer = function() {
        EmbeddedChat.sendMessage('chat:update-referrer', location.toString());
    }

    /**
     * Set whether the chat was started by Chat API.
     *
     * @param isStartedByChatAPI whether the chat was started by Chat API
     */
    EmbeddedChat.setStartedByChatAPI = function(isStartedByChatAPI) {
        this._startedByChatAPI = isStartedByChatAPI;
    };

    /**
     * Whether the chat was started by Chat API.
     *
     * @return true if the chat was started by Chat API, false otherwise
     */
    EmbeddedChat.isStartedByChatAPI = function() {
        return !!this._startedByChatAPI;
    };

    /**
     * Reset the started by Chat API value
     */
    EmbeddedChat.resetStartedByChatAPI = function() {
        this._startedByChatAPI = false;
    };

    /**
     * Append the iframe and the chat to the page.
     *
     * @param container the container to add the iframe into
     * @param iframe the iframe to be added to the container
     */
    EmbeddedChat.appendToBody = function(container, iframe) {
        container.appendChild(iframe);
        document.body.appendChild(container);
    };

    /**
     * Loads the button content inside the available button container if it exists.
     *
     * @param uuid The button UUID
     */
    EmbeddedChat.loadButton = function(uuid) {
        if (this.config.buttonContainerId) {
            // Define the object to hold the button data
            this.button = {};
            // Try to get the button element in this page
            this.button.el = document.getElementById(this.config.buttonContainerId);

            if (this.button.el) {
                // The button container is available, so load the button content
                this.config.renderButton = function(data) {
                    EmbeddedChat.renderButton(data);
                };

                var src = this.getURL("static-tenant") + "/" + uuid + "/button.js";
                this.addScriptTagToBody(src);
            }
        }
    };

    /**
     * Add a script tag to the body, so we can load the data from our servers.
     *
     * @param src the script source
     */
    EmbeddedChat.addScriptTagToBody = function(src) {
        var se = document.createElement("script");
        se.type = "text/javascript";
        se.async = true;
        se.src = src;
        var os = document.getElementsByTagName("script")[0];
        os.parentNode.insertBefore(se, os);
    };

    /**
     * Called by the button script to render the button content inside the button container.
     *
     * @param buttonHTML the button html data to be inserted in the container
     */
    EmbeddedChat.renderButton = function(buttonHTML) {
        if (this.button && this.button.el) {
            // Create the path to be replaced
            var path = this.getURL("domain");

            var html = buttonHTML.replace(/##path##/g, path);
            this.button.el.innerHTML = html;

            EmbeddedChat.bindButtonClick();

            EmbeddedChat.log("debug", "button ready");
        }
    };

    /**
     * Bind the button click event.
     */
    EmbeddedChat.bindButtonClick = function() {
        this.button.linkList = this.button.el.getElementsByTagName("a");

        for (var i = 0, length = this.button.linkList.length; i < length; i++) {
            var link = this.button.linkList[i];
            link.onclick = EmbeddedChat.onButtonClick;
        }
    };

    /**
     * Show a button, given its UUID.
     *
     * @param uuid The button UUID
     */
    EmbeddedChat.showButton = function(uuid) {
        EmbeddedChat.log("debug", "show button");
        EmbeddedChat.loadButton(uuid);
    };

    /**
     * Hide the button.
     */
    EmbeddedChat.hideButton = function() {
        EmbeddedChat.log("debug", "hide button");
        EmbeddedChat.renderButton("");
    };

    /**
     * Get the URL to be used.
     *
     * @param type the url type to get
     *
     * @return the URL
     */
    EmbeddedChat.getURL = function(type) {
        var url = this.config.domain + this.config.path;

        switch (type) {
            case "chat":
                url += EmbeddedChat.CHAT_PATH;
                break;

            case "static-common":
                url += EmbeddedChat.CHAT_PATH + EmbeddedChat.COMMON_PATH;
                break;

            case "static-tenant":
                url = this.config.domain;
                url += EmbeddedChat.SHARED_ALIAS + EmbeddedChat.CHAT_PATH + "/" + this.config.tenant;
                break;

            case "domain":
                url = this.config.domain;
                break;
        }

        return url;
    };

    /**
     * Send a button click event message to the iframe.
     *
     * @return false to prevent default browser action
     */
    EmbeddedChat.onButtonClick = function() {
        if (EmbeddedChat.isChatConfiguredToPopout()) {
            EmbeddedChat.openChatPopup();
            EmbeddedChat.sendMessage("button:click", {asPopout: true});

        } else {
            EmbeddedChat.sendMessage("button:click", {asPopout: false});
        }

        return false;
    };

    /**
     * Set the chat pop out configuration.
     *
     * @param toPopout true to indicate that the chat should popout
     */
    EmbeddedChat.setPopoutConfiguration = function(toPopout) {
        EmbeddedChat.configuredToPopout = toPopout;
    };

    /**
     * Whether the chat is configured to pop out.
     *
     * @return true if the chat is configured to pop out
     */
    EmbeddedChat.isChatConfiguredToPopout = function() {
        return EmbeddedChat.configuredToPopout;
    };

    /**
     * Gets the popup window name
     * @return {string} the popup window name
     */
    EmbeddedChat.getPopupWindowName = function() {
        if (!this._popupWindowName) {
            // IE9- does not allow non-alphanumeric-non-underscore-non-dash caracters on window name
            this._popupWindowName = (this.POPUP_WINDOW_NAME_PREFIX + '_' + this.config.uuid).replace(/[^\w-_]/, '_');
        }
        return this._popupWindowName;
    };

    /**
     * Send the browser info to the iframe.
     */
    EmbeddedChat.sendBrowserInfo = function() {
        this.sendMessage("chat:browser-info", {
            innerWidth:  window.innerWidth,
            outerWidth:  window.outerWidth,
            innerHeight: window.innerHeight,
            outerHeight: window.outerHeight
        });
    };

    /**
     * Send the popup position to the iframe.
     */
    EmbeddedChat.sendChatPopupPosition = function() {
        var popupWidth = parseInt(EmbeddedChat.windowProperties.width, 10);
        var popupHeight = parseInt(EmbeddedChat.windowProperties.height.open, 10);

        var position = this.getChatPopupPosition(popupWidth, popupHeight);

        this.sendMessage("chat:popup:position", position);
    };

    /**
     * Set the bus initialize completed
     */
    EmbeddedChat.sendBusInitializeCompleted = function() {
        this.sendMessage("chat:bus:initialize-completed");
        EmbeddedChat.log("info", "Bus initialize completed");
    };

    /**
     * Get the Chat Popup Position
     *
     * @param popupWidth the popup width
     * @param popupHeight the popup height
     *
     * @return {left: xxx, top: yyy }
     */
    EmbeddedChat.getChatPopupPosition = function(popupWidth, popupHeight) {
        var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (popupWidth / 2)) + dualScreenLeft;
        var top = (height / 16) + dualScreenTop;

        return {left: left, top: top};
    };

    /**
     * Open the Embedded Chat as a pop up.
     */
    EmbeddedChat.openChatPopup = function(popupOrigin) {
        var popupWidth = parseInt(EmbeddedChat.windowProperties.width, 10);
        var popupHeight = parseInt(EmbeddedChat.windowProperties.height.open, 10);

        var position = this.getChatPopupPosition(popupWidth, popupHeight);

        var windowSpecs = "width=" + popupWidth + "px" +
                         ",height=" + popupHeight + "px" +
                         ",left=" + position.left + "px" +
                         ",top=" + position.top + "px" +
                         ",menubar=no" +
                         ",resizable=yes" +
                         ",scrollbars=yes" +
                         ",toolbar=no" +
                         ",status=no";

        var popupWindow;

        try {
            popupWindow = window.open("", EmbeddedChat.getPopupWindowName(), windowSpecs, true);

            if (popupWindow && popupWindow.location.pathname.indexOf("embedded-chat.html") == -1) {
                var src = this.getEmbeddedChatURL(true, popupOrigin);
                popupWindow.location = src;
                popupWindow.focus();

                // Indicate the iframe that there is a popup available
                this.sendChatPopupOpen();
            } else {
                EmbeddedChat.log("debug", "Chat Popup already exists - not opening additional one");
                // Indicate the iframe that there is a popup available
                setTimeout(function() {
                    EmbeddedChat.sendMessage("chat:popup:open", {tryFocus: true});
                }, 1);
            }

        } catch (e) {
            // On IE, if we try to access a popup that was open in another page (or the same page, but after a reload)
            // the browser will trigger a "Permission Denied" error and there isn't anything we can do.
            EmbeddedChat.log("debug", "Exception while trying to create the popup - probably it already exists");

            if (e && e.message && (e.message.indexOf("Permission denied") || e.message.indexOf("SecurityError"))) {
                // We couldn't access the popup, but as it is the Embedded Chat popup, we can
                // send the message for the iframe to indicate that there is a popup available
                setTimeout(function() {
                    EmbeddedChat.sendMessage("chat:popup:open", {tryFocus: true});
                }, 1);
            }
        }

        try {
            popupWindow.focus();

        } catch (e) {
            // Failed to focus, nothing we can do.
        }

    };

    /**
     * Used in the popup to know if it is required to wait for data sync before
     * starting any chat session when in a popup.
     * This is required to avoid race condition issues where the chat is started
     * before the data is in sync.
     */
    EmbeddedChat.setWaitSyncRequired = function() {
        EmbeddedChat.log("debug", "setWaitSyncRequired");
        this.waitSyncRequired = true;
    };

    /**
     * Whether is required to wait for sync.  This is only applicable for chat
     * as popup.
     *
     * @return true when it is required
     */
    EmbeddedChat.isWaitSyncRequired = function() {
        return !!this.waitSyncRequired;
    };

    EmbeddedChat.sendChatPopupOpen = function() {
        this.sendChatPopupOpenInterval = setInterval(function () {
            EmbeddedChat.sendMessage("chat:popup:open");
        }, 1000);

        // Stop retrying after 5seconds.
        // This is necessary in case of embedded-chat.js don't send back "chat:popup:opened" message
        setTimeout(function() {
            EmbeddedChat.clearChatPopupOpenInterval();
        }, 5000);
    };

    EmbeddedChat.clearChatPopupOpenInterval = function() {
        clearInterval(this.sendChatPopupOpenInterval);
    };

    /**
     * Set up the post message mechanism used to communicate to the iframe.
     */
    EmbeddedChat.configureMessage = function() {
        this.receiverDomain = this.config.domain;

        if (!window.addEventListener) {
            window.attachEvent("onmessage", this.receiveMessage);

        } else {
            window.addEventListener("message", this.receiveMessage);
        }
    };

    /**
     * Send the message to the iframe.
     *
     * @param topic the message topic
     * @param data the message data
     */
    EmbeddedChat.sendMessage = function(topic, data) {
        var message = JSON.stringify({
            topic: topic,
            data: data
        });

        var receiver = this.getReceiver();

        if (receiver) {
            receiver.postMessage(message, this.receiverDomain);
        }
    };

    /**
     * Receive a message from the iframe.
     */
    EmbeddedChat.receiveMessage = function(e) {
        // Check to make sure that this message came from the correct domain.
        if (e.origin === EmbeddedChat.receiverDomain) {
            var message = JSON.parse(e.data);
            EmbeddedChat.processMessage(message);
        }
    };

    EmbeddedChat.sendClearSessionDataMessage = function (data = {}) {
        const { channelUuid } = this.config ?? {};
        const { fromPopup } = data;

        if (channelUuid && fromPopup) {
            this.sendMessage('session:clear-data');
        }
    }

    /**
     * Process the message received from the iframe.
     *
     * @param message the message received
     */
    EmbeddedChat.processMessage = function(message) {
        EmbeddedChat.log("debug", "message received", message);

        switch (message.topic) {
            case "chat:communication:established":
                this.onCommunicationEstablished(message.data);
                break;

            case "chat:bus:initialize":
                this.onBusInitialize(message.data);
                break;

            case "chat:loaded":
                this.chatLoaded(message.data);
                break;

            case "chat:open":
            case "chat:preChat:open":
            case "chat:postChat:open":
            case "chat:offline:open":
            case "chat:skipQueue:open":
                this.handleChangeHeight("open", message.data);
                EmbeddedChat.updateReferrer();
                break;

            case "chat:invitation:open":
                this.handleChangeHeight("invitationOpen", message.data);
                EmbeddedChat.updateReferrer();
                break;

            case "chat:close":
                this.sendClearSessionDataMessage(message.data);
                this.handleChangeHeight("closed", message.data);
                break;

            case "chat:minimize":
                this.handleChangeHeight("minimized", message.data);
                break;

            case "show:button":
                var uuid = message.data;
                this.showButton(uuid);
                break;

            case "hide:button":
                this.hideButton();
                break;

            case "customer:info-sent":
                this.bus.publish(message.topic, message.data);
                break;

            case "chat:popup":
                this.onChatPopup(message.data);
                break;

            case "chat:popup:opened":
                this.clearChatPopupOpenInterval();
                break;

            case "chat:resize":
                this.setHeight(message.data.height);
                break;

            case "chat:resize:window":
                if (!message.data.fromPopup) {
                    this.windowResize.changeSize(message.data.width, message.data.height);
                }
                break;
            case "chat:resize:start-listen-mouse-events":
                this.windowResize.startListenResizeEvents();
                break;
            case "chat:resize:stop-listen-mouse-events":
                this.windowResize.stopListenResizeEvents();
                break;

            case "co-browsing:start":
                this.startCoBrowsing();
                break;

            case "co-browsing:end":
                this.endCoBrowsing();
                break;
            case "chat:translations":
                var chatTitle = message.data.chatTitle;
                if (chatTitle && this.iframe) {
                    this.iframe.title = chatTitle;
                }
                break;
            case "chat:theme":
                EmbeddedChat.IS_NUGEN = message?.data?.isNuGen;
                this.updateContainerStylesForNugen();
                break;
            case "chat:set-language":
                this.updateCoBrowsingLocale(message.data);
                break;
        }
    };

    /**
     * Handle the chat:popup message.
     *
     * @param data the data from the message
     */
    EmbeddedChat.onChatPopup = function(data) {
        if (data && data.popup) {
            this.setPopoutConfiguration(data.popup);
        }
    };

    /**
     * Handle when it is required to change the iframe container height.
     *
     * @param state the state to consider to change the height
     * @param data the data from the message
     */
    EmbeddedChat.handleChangeHeight = function(state, data) {

        if (!data || !data.fromPopup || (data.fromPopup && state === 'closed')) {

            // Only call the change height function if the message if not coming from the popup
            // except on close message, when it needs to be called from popup to keep iframe minimized
            // and the chat is closed.
            this.changeHeight(state);
        }
    };

    /**
     * Change the container height and send a message notifying the iframe.
     *
     * @param state the state to retrieve the height
     */
    EmbeddedChat.changeHeight = function(state) {
        EmbeddedChat.log("debug", "change height");
        var height = EmbeddedChat.IS_NUGEN ? EmbeddedChat.containerProperties.nuGen.height[state] : EmbeddedChat.containerProperties.height[state];
        this.setHeight(height, true);
    };

    EmbeddedChat.windowResize = {
        mouseMove: function (event) {
            EmbeddedChat.sendMessage('chat:resize:pointer-move-event', {
                screenX: Math.floor(event.screenX),
                screenY: Math.floor(event.screenY),
            });
        },
        mouseUp: function (event) {
            EmbeddedChat.sendMessage('chat:resize:pointer-up-event', event);
            EmbeddedChat.windowResize.stopListenResizeEvents();
        },
         /**
         * Resize window
         *
         * @param height the new container height
         * @param width the new container height
         */
        changeSize: function(width, height) {
            EmbeddedChat.container.style.height = height;
            EmbeddedChat.container.style.width = width;
        },
        startListenResizeEvents: function() {
            window.addEventListener('pointermove',  this.mouseMove);
            window.addEventListener('pointerup',  this.mouseUp);
        },
        stopListenResizeEvents: function() {
            window.removeEventListener('pointermove',  this.mouseMove);
            window.removeEventListener('pointerup',  this.mouseUp);
        }
    }

    /**
     * Set the container height.
     *
     * @param height the new container height
     * @param shouldAutoFit whether the chat window should auto-fit
     */
    EmbeddedChat.setHeight = function(height, shouldAutoFit) {
        this.container.style.height = height;

        setTimeout(this.sendMessage.bind(this,"chat:change:height", shouldAutoFit), EmbeddedChat.chatHeightChangeDelay);
    };

    EmbeddedChat.requestTranslations = function() {
        var lang = document.getElementsByTagName('html')[0].getAttribute('lang');
        if (lang && lang !== EmbeddedChat.defaultLanguage) {
            EmbeddedChat.sendMessage("chat:request:translations", { langTo: lang });
        }
    }

    /**
     * Called when the Embedded Chat has Loaded.
     */
    EmbeddedChat.chatLoaded = function(data) {
        this.unsubscribeFromCoBrowsingEvents();
        this.subscribeToCoBrowsingEvents(null, data?.tenantLanguageCode);
        this.requestTranslations();
    };

    /**
     * Start a co-browsing session if an instance exists.
     */
    EmbeddedChat.startCoBrowsing = function() {
        var coBrowsingInstance = this.getCoBrowsingInstance();

        if (coBrowsingInstance) {
            coBrowsingInstance.requireCoBrowsing();
        }
    };

    /**
     * End a co-browsing session if an instance exists.
     */
    EmbeddedChat.endCoBrowsing = function() {
        var coBrowsingInstance = this.getCoBrowsingInstance();

        if (coBrowsingInstance) {
            coBrowsingInstance.end();
        }
    };

    /**
     * Define the object to hold the subscribed bus objects.
     */
    EmbeddedChat.subscribed = {};

    /**
     * Subscribe to the bus events.
     */
    EmbeddedChat.subscribeBusEvents = function() {
        this.subscribed.customerSetInfo = this.bus.subscribe("customer:set-info", EmbeddedChat.onSetCustomerInfo);
        this.subscribed.customerResetInfo = this.bus.subscribe("customer:reset-info", EmbeddedChat.onResetCustomerInfo);

        this.subscribed.chatEnd = this.bus.subscribe("chat:end", EmbeddedChat.onChatEnd);
        this.subscribed.chatTriggerInvitation = this.bus.subscribe("chat:trigger-invitation", EmbeddedChat.onChatTriggerInvitation);
        this.subscribed.chatSetLanguage = this.bus.subscribe("chat:set-language", EmbeddedChat.onChatSetLanguage);
        this.subscribed.chatTriggerPreChat = this.bus.subscribe("chat:trigger-pre-chat", EmbeddedChat.onChatTriggerPreChat);
        this.subscribed.chatTriggerChatWindow = this.bus.subscribe("chat:trigger-chat-window", EmbeddedChat.onChatTriggerChatWindow);
        this.subscribed.chatSetVariables = this.bus.subscribe("chat:set-variables", EmbeddedChat.onChatSetVariables);
    };

    /**
     * Unsubscribe from the bus events.
     */
    EmbeddedChat.unsubscribeBusEvents = function() {
        this.subscribed.customerSetInfo && this.subscribed.customerSetInfo.remove();
        this.subscribed.customerResetInfo && this.subscribed.customerResetInfo.remove();

        this.subscribed.chatEnd && this.subscribed.chatEnd.remove();
        this.subscribed.chatTriggerInvitation && this.subscribed.chatTriggerInvitation.remove();
        this.subscribed.chatSetLanguage && this.subscribed.chatSetLanguage.remove();
        this.subscribed.chatTriggerPreChat && this.subscribed.chatTriggerPreChat.remove();
        this.subscribed.chatTriggerChatWindow && this.subscribed.chatTriggerChatWindow.remove();
        this.subscribed.chatSetVariables && this.subscribed.chatSetVariables.remove();
    };

    /**
     * Co-browsing events subscription timeout ID.
     */
    EmbeddedChat.coBrowsingSubscriptionTimeoutId = null;

    /**
     * Get a co-browsing instance reference from the global scope.
     *
     * @return co-browsing instance, if any
     */
    EmbeddedChat.getCoBrowsingInstance = function() {
        return window.coBrowsingInstance;
    };

    /**
     * Handle the co-browsing instance found event.
     *
     * @param instance The co-browsing instance
     */
    EmbeddedChat.onCoBrowsingInstanceFound = function(instance) {
        instance.on("co-browsing:connected", this.onCoBrowsingSessionConnected, this);
        instance.on("co-browsing:disconnected", this.onCoBrowsingSessionDisconnected, this);

        // Check if there is an active co-browsing session already
        var sessionId = instance.getSessionId();
        if (sessionId != null) {
            this.onCoBrowsingSessionConnected({ sessionId: sessionId });
        }

        this.log("info", "Co-browsing instance found");
        this.sendMessage("co-browsing:found");
    };

    /**
     * Handle the co-browsing session connected event.
     */
    EmbeddedChat.onCoBrowsingSessionConnected = function(data) {
        this.log("info", "Co-browsing session connected");

        var instance = this.getCoBrowsingInstance();
        this.sendMessage("co-browsing:connected", {
            sessionId: data.sessionId,
            stickyHash: instance.getStickyHash()
        });
    };

    /**
     * Handle the co-browsing session disconnected event.
     */
    EmbeddedChat.onCoBrowsingSessionDisconnected = function() {
        this.log("info", "Co-browsing session disconnected");
        this.sendMessage("co-browsing:disconnected");
    };

    /**
     * Update coBrowsingInstance locale
     *
     * @param [locale] en-US | pt-BR | it-IT etc..
     */
    EmbeddedChat.updateCoBrowsingLocale = function(locale) {
        const coBrowsingInstance = this.getCoBrowsingInstance();

        if (!coBrowsingInstance || typeof locale === "undefined") {
            return;
        }

        const topic = "co-browsing:set-locale";
        const message = { softwareLanguage: locale };

        coBrowsingInstance.messageHandler(topic, message);
    }

    /**
     * Subscribe to co-browsing events if an instance exists, otherwise schedule another try.
     *
     * @param [tries] The number of tries so far
     * @param [languageCode] This is the languageCode (of tenant)
     */
    EmbeddedChat.subscribeToCoBrowsingEvents = function(tries, languageCode) {
        tries = tries || 0;

        var coBrowsingInstance = this.getCoBrowsingInstance();
        this.log("info", "Checking for co-browsing instance...");

        if (coBrowsingInstance) {
            this.onCoBrowsingInstanceFound(coBrowsingInstance);
            this.coBrowsingSubscriptionTimeoutId = clearTimeout(this.coBrowsingSubscriptionTimeoutId);
            this.updateCoBrowsingLocale(languageCode);
        } else {
            var maxTries = EmbeddedChat.MAX_CO_BROWSING_INSTANCE_CHECK_TRIES;
            tries++;

            if (tries >= maxTries) {
                this.log("warn", "Co-browsing instance not found after " + tries + " tries, giving up");

            } else {
                var delay = Math.pow(2, tries) * 100;
                this.coBrowsingSubscriptionTimeoutId = setTimeout(this.subscribeToCoBrowsingEvents.bind(this), delay, tries, languageCode);
            }
        }
    };

    /**
     * Unsubscribe from co-browsing events if an instance exists.
     */
    EmbeddedChat.unsubscribeFromCoBrowsingEvents = function() {
        var coBrowsingInstance = this.getCoBrowsingInstance();

        if (coBrowsingInstance) {
            coBrowsingInstance.off(null, null, this);
        }
    };

    /**
     * Get the receiver for the PostMessages.
     * Will get the popupWindow if it exists
     *
     * @return the receiver
     */
    EmbeddedChat.getReceiver = function() {
        return this.iframe.contentWindow;
    };

    /**
     * Handle the set customer info event.
     *
     * @param info The customer info
     */
    EmbeddedChat.onSetCustomerInfo = function(info) {
        EmbeddedChat.setWaitSyncRequired();
        EmbeddedChat.sendMessage("customer:set-info", info);
    };

    /**
     * Handle the reset customer info event.
     */
    EmbeddedChat.onResetCustomerInfo = function() {
        EmbeddedChat.sendMessage("customer:reset-info");
    };

    /**
     * Handle the chat trigger invitation event.
     */
    EmbeddedChat.onChatEnd = function() {
        EmbeddedChat.sendMessage("chat:end");
    };

    /**
     * Handle the chat trigger invitation event.
     */
    EmbeddedChat.onChatTriggerInvitation = function() {
        EmbeddedChat.sendMessage("chat:trigger-invitation");
    };

    /**
     * Handle the chat set language event.
     */
    EmbeddedChat.onChatSetLanguage = function(language) {
        EmbeddedChat.setWaitSyncRequired();
        EmbeddedChat.sendMessage("chat:set-language", language);
    };

    /**
     * Handle the chat set variables event.
     */
    EmbeddedChat.onChatSetVariables = function(variables) {
        EmbeddedChat.setWaitSyncRequired();
        EmbeddedChat.sendMessage("chat:set-variables", variables);
    };

    /**
     * Handle the chat trigger pre-chat event.
     */
    EmbeddedChat.onChatTriggerPreChat = function() {
        if (EmbeddedChat.isChatConfiguredToPopout()) {
            EmbeddedChat.setStartedByChatAPI(true);
            EmbeddedChat.openChatPopup("preChat");
        } else {
            EmbeddedChat.sendMessage("chat:trigger-pre-chat");
        }

        return false;
    };

    /**
     * Handle the chat trigger chat window event.
     */
    EmbeddedChat.onChatTriggerChatWindow = function () {
        if (EmbeddedChat.isChatConfiguredToPopout()) {
            EmbeddedChat.setStartedByChatAPI(true);
            EmbeddedChat.openChatPopup("chatWindow");
        } else {
            EmbeddedChat.sendMessage("chat:trigger-chat-window");
        }

        return false;
    };

    /**
     * Log the message to the browser console if it is available.
     *
     * @param level the log level
     * @param .. arguments for the log
     */
    EmbeddedChat.log = function(level) {
        if (window.console && EmbeddedChat.logList.indexOf(level) >= EmbeddedChat.logLevelIndex) {
            try {
                window.console[level].apply(console, [EmbeddedChat.ERROR_FLAG].concat(Array.apply(null, arguments).slice(1)));
            } catch (e) {}
        }
    };

    EmbeddedChat.setLogLevel = function(level) {
        EmbeddedChat.logLevel = level;
        var levelIndex = EmbeddedChat.logList.indexOf(EmbeddedChat.logLevel);
        EmbeddedChat.logLevelIndex = levelIndex >=0 ? levelIndex : Infinity;
    }

    try {
        EmbeddedChat.setLogLevel(window.localStorage.getItem(EmbeddedChat.ERROR_FLAG + '_LogLevel'));
    } catch (e) {
    }
    /**
     * Start the Embedded Chat
     */
    EmbeddedChat.start();
})(window.JSON);

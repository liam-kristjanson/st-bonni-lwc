(function(root, $) {
    /**
     * @function
     * @name Deferred.always
     * @param {function(element:jQuery)} callback
     */

    /**
     * @function
     * @name Deferred.done
     * @param {function(element:jQuery)} callback
     */

    /**
     * Holds the Embedded Chat object object.
     */
    var EmbeddedChat = root.EmbeddedChat = root.EmbeddedChat || {};

    /**
     * Flag to be used to log errors in the browser console.
     */
    EmbeddedChat.ERROR_FLAG = "8x8EmbeddedChat";

    /**
     * Name for the popup window.
     */
    EmbeddedChat.POPUP_WINDOW_NAME_PREFIX = "8x8EmbeddedChatPopup";

    /**
     * Define the shared alias.
     */
    EmbeddedChat.SHARED_ALIAS = "/shared";

    /**
     * Define the CHAT path.
     */
    EmbeddedChat.CHAT_PATH = "/CHAT";

    /**
     * Define the current log level (debug, info, warn, error)
     */
    EmbeddedChat.logLevel = "debug";

    /**
     * Define the log list severity.
     */
    EmbeddedChat.logList = ["debug", "info", "warn", "error"];

    /**
     * Define the default popout configuration.
     */
    EmbeddedChat.DEFAULT_POPOUT_CONFIGURATION = false;

    /**
     * Store the current log level index.
     */
    EmbeddedChat.logLevelIndex = Infinity;

    /**
     * The minimum retrying interval when a function call fails.
     */
    EmbeddedChat.MIN_RETRY_INTERVAL = 250;

    /**
     * The maximum retrying interval when a function call fails.
     */
    EmbeddedChat.MAX_RETRY_INTERVAL = 2000;

    /**
     * The Chat Popup indication update interval.
     */
    EmbeddedChat.CHAT_POPUP_INDICATION_UPDATE_INTERVAL = 2000;

    /**
     * The timeout to wait for data to sync.
     */
    EmbeddedChat.CHAT_WAIT_SYNC_TIMEOUT = 5000;

    /**
     * The timeout to wait for bus initialize.
     */
    EmbeddedChat.CHAT_WAIT_BUS_READY_TIMEOUT_SECONDS = 2000;

    /**
     * Map of languages to indicate which are aligned as RTL
     */
    EmbeddedChat.RTL_CHAT_LANGUAGES = {
        'ar': true
    };

    /**
     * Indicate the required pattern for system OR custom variables
     */
    EmbeddedChat.CHAT_VARIABLES_KEY_PATTERN = new RegExp(/^[_\$][\w\d-]{1,254}$/);

    /**
     * Indicate the max length of chars for the system and custom variables
     */
    EmbeddedChat.CHAT_VARIABLES_MAX_LENGTH = 255;

    /**
     * Used to tag the variables in the chat info Set.
     */
    EmbeddedChat.CHAT_VARIABLE_TAG = "##variable##";

    /**
     * Indicate the pattern specifically for system variables
     */
    EmbeddedChat.CHAT_SYSTEM_VARIABLES_PATTERN = new RegExp(/^\$[\w\d-]{1,254}$/);

    /**
     * The chat system variable language
     */
    EmbeddedChat.CHAT_SYSTEM_VARIABLE_LANGUAGE = "$language";

    /**
     * Map to have a reference of all system variables
     */
    EmbeddedChat.CHAT_SYSTEM_VARIABLES_MAP = [
        EmbeddedChat.CHAT_SYSTEM_VARIABLE_LANGUAGE,
        "$caseNumber",
        "$accountNumber",
        "$emailAddress",
        "$emailSubject",
        "$emailBody"
    ];

    /**
     * Define the pop up window properties to set its size.
     */
    EmbeddedChat.windowProperties = {
        width: "334px",
        height: {
            open: "330px"
        },
        left: "20px",
        right: "20px",
        nuGen: {
            height: {
                open: "593px"
            }
        }
    };

    /**
     * Separator for legacy data
     */
    EmbeddedChat.separator = "!)@(#*$&%^";

    /**
    * Static class to define the Sanitizer interface;
    *
    * OBS: This code is replicated. Its original version is found at AGUI/js/sc_common.js
    */
    EmbeddedChat.Sanitize = function() {};

    /**
     * Map of diacritics to convert.
     *
     * OBS: This code is replicated. Its original version is found at AGUI/js/sc_common.js
     */
    EmbeddedChat.Sanitize.defaultDiacriticsRemovalMap = [
        {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
        {'base':'AA','letters':/[\uA732]/g},
        {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
        {'base':'AO','letters':/[\uA734]/g},
        {'base':'AU','letters':/[\uA736]/g},
        {'base':'AV','letters':/[\uA738\uA73A]/g},
        {'base':'AY','letters':/[\uA73C]/g},
        {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
        {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
        {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
        {'base':'DZ','letters':/[\u01F1\u01C4]/g},
        {'base':'Dz','letters':/[\u01F2\u01C5]/g},
        {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
        {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
        {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
        {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
        {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
        {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
        {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
        {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
        {'base':'LJ','letters':/[\u01C7]/g},
        {'base':'Lj','letters':/[\u01C8]/g},
        {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
        {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
        {'base':'NJ','letters':/[\u01CA]/g},
        {'base':'Nj','letters':/[\u01CB]/g},
        {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
        {'base':'OI','letters':/[\u01A2]/g},
        {'base':'OO','letters':/[\uA74E]/g},
        {'base':'OU','letters':/[\u0222]/g},
        {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
        {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
        {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
        {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
        {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
        {'base':'TZ','letters':/[\uA728]/g},
        {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
        {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
        {'base':'VY','letters':/[\uA760]/g},
        {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
        {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
        {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
        {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
        {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
        {'base':'aa','letters':/[\uA733]/g},
        {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
        {'base':'ao','letters':/[\uA735]/g},
        {'base':'au','letters':/[\uA737]/g},
        {'base':'av','letters':/[\uA739\uA73B]/g},
        {'base':'ay','letters':/[\uA73D]/g},
        {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
        {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
        {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
        {'base':'dz','letters':/[\u01F3\u01C6]/g},
        {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
        {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
        {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
        {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
        {'base':'hv','letters':/[\u0195]/g},
        {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
        {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
        {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
        {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
        {'base':'lj','letters':/[\u01C9]/g},
        {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
        {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
        {'base':'nj','letters':/[\u01CC]/g},
        {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
        {'base':'oi','letters':/[\u01A3]/g},
        {'base':'ou','letters':/[\u0223]/g},
        {'base':'oo','letters':/[\uA74F]/g},
        {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
        {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
        {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
        {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
        {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
        {'base':'tz','letters':/[\uA729]/g},
        {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
        {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
        {'base':'vy','letters':/[\uA761]/g},
        {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
        {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
        {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
        {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
    ];

    /**
     * Remove diacritics and replace it by the base letters.
     *
     * @param str the string to remove the diacritics
     *
     * @return the new string
     *
     * OBS: This code is replicated. Its original version is found at AGUI/js/sc_common.js
     */
    EmbeddedChat.Sanitize.removeDiacritics = function(str) {
        for (var i = 0, length = EmbeddedChat.Sanitize.defaultDiacriticsRemovalMap.length; i < length; i++) {
            str = str.replace(EmbeddedChat.Sanitize.defaultDiacriticsRemovalMap[i].letters, EmbeddedChat.Sanitize.defaultDiacriticsRemovalMap[i].base);
        }

        return str;
    };

    /**
     * Define the Chat states.
     *
     * <state name>: {
     *     config: <state configuration>,
     *     $el:    <jQuery object container>
     * }
     */
    EmbeddedChat.state = {
        open:       {config: {name: "open"      }, order: 1},
        minimize:   {config: {name: "minimize"  }, order: 2},
        button:     {config: {name: "button"    }, order: 3},
        invitation: {config: {name: "invitation"}, order: 4},
        preChat:    {config: {name: "preChat"   }, order: 5},
        chatWindow: {config: {name: "chatWindow"}, order: 6},
        postChat:   {config: {name: "postChat"  }, order: 7},
        offChat:    {config: {name: "offChat"   }, order: 8},
        skipQueue:  {config: {name: "skipQueue" }, order: 9},
        close:      {config: {name: "close"     }, order: 0}
    };

    /**
     * Hold the current chat state;
     */
    EmbeddedChat.currentState = EmbeddedChat.state.close;

    /**
     * Counts the number of termination calls
     */
    EmbeddedChat.terminationCounter = {
        _count: 0,
        _maxCount: 1,
        count: function() { return this._count++ < this._maxCount; },
        reset: function() { this._count = 0; }
    };

    /**
     * Config bugsnag instance
     * @param {{
     *  apiKey: string;
     *  deliveryRealm: string;
     *  appVersion?: string;
     *  metadata?: Object;
     * }} params
     */
    EmbeddedChat.startBugsnag = function (params) {
        if (!root.Bugsnag && params.apiKey) return;

        root.Bugsnag.start({
            apiKey: params.apiKey,
            appType: 'embedded-chat',
            appVersion: params.appVersion,
            metadata: params.metadata,
            endpoints: {
                notify: 'https://bugsnag.8x8.com/notify',
                sessions: 'https://bugsnag.8x8.com/session'
            },
            // @todo Remove in VCC-76431
            enabledReleaseStages: ['production', 'staging', 'acceptance', 'qa', 'dev'],
            releaseStage: params.deliveryRealm,
        });

    }

    /**
     * Check if its IOS device
     * @returns {boolean} true if its a ios devices
     */
    EmbeddedChat.isIOS = function () {
        return (/iPad|iPhone|iPod/.test(navigator.userAgent))
            || (
                navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
            )
    }

    /**
     * Insert IOS specific stylesheet
     */
    EmbeddedChat.addStylesheetForIOSDevices = function () {
        if (EmbeddedChat.isIOS()) {
            $('<link rel="stylesheet" href="../../common/css/embedded-chat-ios.css">').appendTo("head");
        }
    }

    /**
     * Start the Embedded Chat.
     */
    EmbeddedChat.start = function() {
        EmbeddedChat.log("debug", "start");
        // Setup the i18n
        this.i18n.setup();

        // Configure the unload event
        $(window).on("unload", $.proxy(this.onUnloadHandler, this));

        this.checkPlatform().done($.proxy(function(data) {
             // Setup Bugsnag
            var platformData = Object.assign({}, data);
            delete platformData.bugsnagApiKey;
            this.startBugsnag({
                apiKey: data.bugsnagApiKey,
                deliveryRealm: data.deliveryRealm,
                appVersion: data.packageVersion,
                metadata: {
                    platformData: platformData,
                }
            });

            // Configure the Post Message to communicate to the embedded page
            this.configureMessage();

            // Send a message indication that the communication was established
            this.communicationEstablished();

            this.sendConfiguredAsPopup();

            if (this.isPopup()) {
                this.configureChatPopup();
            }

            // Load the UI elements
            this.loadUIElements();

            // Add ios style
            this.addStylesheetForIOSDevices();

            // Setup the customer
            this.customer.setup();

            // Setup co-browsing integration
            this.coBrowsing.setup();

            // Initialize the bus
            this.busInitialize();

            // Load external CSS file if any
            this.loadExternalStylesheet();

            // Load the custom system messages
            this.loadCustomSystemMessages();

            // Define the functions to be available in the global scope
            root.receiveMessageProxy = $.proxy(EmbeddedChat.receiveMessageProxy, EmbeddedChat);
            root.sendMessageProxy = $.proxy(EmbeddedChat.sendMessageProxy, EmbeddedChat);

            // Load and configure the default system dictionary
            this.stringsLoaded = this.i18n.requestSystemDictionary(true);

            this.buttonLoaded = $.Deferred();
            this.invitationLoaded = $.Deferred();

            // Wait for data to be sync if required
            this.waitDataSync()
            .always(function() {
                // Wait for the bus to be initialized
                this.waitBusInitialize()
                .always(function() {
                    EmbeddedChat.log("debug", "Initialize button and invitation");

                    // Load and configure the button (always resolve to avoid premature chat load)
                    this.loadButton().then(this.configureButton.bind(this)).always(this.buttonLoaded.resolve);

                    // Load and configure the invitation (always resolve to avoid premature chat load)
                    this.loadInvitation().then(this.configureInvitation.bind(this)).always(this.invitationLoaded.resolve);

                    // Load the chat
                    // Note that, as the "loaded" method must always be called (even if a button, an invitation
                    // or both do not exist), all promises used to control its execution must also be resolved,
                    // or else $.when may prematurely call all alwaysCallbacks (and not call any doneCallbacks)
                    this.waitInitialRequests().always(this.loaded.bind(this));
                }.bind(this));
            }.bind(this))

            // Define default legacy data
            this.createLegacyData();
        }, this));
    };

    /**
     * Wait for required initial request to load.
     *
     * @return jQuery Promise
     */
    EmbeddedChat.waitInitialRequests = function() {
        return $.when(this.stringsLoaded, this.buttonLoaded, this.invitationLoaded);
    };

    /**
     * Create the legacy data locally if we don't need to validate any CRM field.
     *
     * @param {string} language - [optional] the language of the customer
     */
    EmbeddedChat.createLegacyData = function(language) {
        var legacyDataArray = [
            "med=C",
            "cas=0",
            "nam=",
            "org=",
            "sub=",
            "cnt=0",
            "cha=" + this.getChannel(),
            "customerLanguage=" + (language || "")
        ];

        this.legacyData = legacyDataArray.join(EmbeddedChat.separator);
    };

    /**
     * Check whether there is a Chat Popup already open to try to establish a connection.
     */
    EmbeddedChat.checkChatPopup = function() {
        if (this.isPopup()) {
            // This is the popup, so we should update the localStorage indication so the iframe
            // can check for it and get the popup reference
            this.updateChatPopupIndication();

        } else if (this.isConfiguredAsPopup()) {
            // This is the iframe and the chat is configured as a popup, check if there is the
            // localStorage indication and if it is still valid
            this.checkChatPopupIndication();
        }
    };

    /**
     * Check whether the Chat Popup indication is available and valid in the localStorage.
     */
    EmbeddedChat.checkChatPopupIndication = function() {
        if (!this.hasAccessToLocalStorage()) {
            return;
        }

        var timestamp = +(new Date());

        var storedTimestamp = window.localStorage.getItem(this.getPopupWindowName());

        if (timestamp - storedTimestamp <= EmbeddedChat.CHAT_POPUP_INDICATION_UPDATE_INTERVAL) {
            // The stored timestamp is valid, so try to establish the connection to the popup
            this.updatePopupWindowReference();

        } else {
            // The store timestamp is not valid, so it should be removed
            this.removeChatPopupIndication();
        }
    };

    /**
     * Update the Chat Popup indication and start a interval function to keep it updated.
     */
    EmbeddedChat.updateChatPopupIndication = function() {
        if (!this.hasAccessToLocalStorage()) {
            return;
        }

        window.localStorage.setItem(this.getPopupWindowName(), +(new Date()));

        setInterval($.proxy(function() {
            window.localStorage.setItem(this.getPopupWindowName(), +(new Date()));
        }, this), EmbeddedChat.CHAT_POPUP_INDICATION_UPDATE_INTERVAL);
    };

    /**
     * Remove the Chat Popup indication from the localStorage.
     */
    EmbeddedChat.removeChatPopupIndication = function() {
        if (!this.hasAccessToLocalStorage()) {
            return;
        }

        window.localStorage.removeItem(this.getPopupWindowName());
    };

    /**
     * Handle the onunload event.
     */
    EmbeddedChat.onUnloadHandler = function() {
        if (this.isPopup()) {
            this.removeChatPopupIndication();
        }
    };

    /**
     * Send a message indicating that the communication was established.
     */
    EmbeddedChat.communicationEstablished = function() {
        this.sendMessage("chat:communication:established", {isPopup: this.isPopup()});
    };

    /**
     * Send a message to configure chat.js indicating the popup configuration.
     */
    EmbeddedChat.sendConfiguredAsPopup = function() {
        this.sendMessage("chat:popup", {popup: this.configuredAsPopup});
    };

    /**
     * Check the platform status to see if we can proceed.
     * NOTE: This function is the same as the one in chat.js
     *
     * param response data response from server
     *
     * @return the platform status
     */
    EmbeddedChat.checkPlatform = function() {
        var chatPhpLocation = "../../../CHAT/chat.php";
        var query = [];
        query.push("action=checkPlatform");
        query.push(["tenant", encodeURIComponent(this.getTenantBase64())].join("="));
        query.push(["channel", encodeURIComponent(this.getChannel())].join("="));
        query.push(["script", encodeURIComponent(this.getScript())].join("="));
        var src = chatPhpLocation + "?" + query.join("&");

        var deferredObject = $.Deferred();

        $.get(src)
            .done($.proxy(function(data) {
                if (data) {
                    var platformStatus = this.checkPlatformStatus(data.response);

                    if (platformStatus == "ready") {
                        EmbeddedChat.callerIPAddress = data.response.data.callerIPAddress;
                        EmbeddedChat.tenant = data.response.data.tenant;

                        // Set the default language as the tenant language
                        EmbeddedChat.tenantLanguageCode = data.response.data.tenantLanguageCode;
                        EmbeddedChat.i18n.setDefaultLanguage(EmbeddedChat.tenantLanguageCode.split("_")[0]);

                        // Set the tenant OEM path
                        EmbeddedChat.tenantOEMPath = data.response.data.tenantOEMPath;

                        // Whether we expect HTML from agent side or not
                        EmbeddedChat.acceptHTMLMessage = data.response.data.acceptHTMLMessage == "false" ? false : true;

                        root.chaletAdapter && root.chaletAdapter.setCloud8Resource(data.response.data.chaletCloud8Resource);
                        root.chaletAdapter && root.chaletAdapter.setCloud8BaseUrl(data.response.data.cloud8BaseUrl);
                        var chaletDiscovery = data.response.data.chaletDiscovery;
                        if (data.response.data.pbxId) {
                            chaletDiscovery += "?pbx_id=" + data.response.data.pbxId;
                        }
                        root.chaletAdapter && chaletAdapter.setDiscoveryUrl(chaletDiscovery);

                        // MFE setup
                        root.ChatConfig.MFERegistryService.cloud8BaseUrl = data.response.data.cloud8BaseUrl;
                        root.ChatConfig.MFERegistryService.params.tenant = data.response.data.tenant;

                        var clusterName = data.response.data.clusterName;
                        root.ChatConfig.MFERegistryService.params.platform = clusterName + "-P" + data.response.data.platformId;
                        root.ChatConfig.MFERegistryService.params.cluster = clusterName;
                        root.ChatConfig.MFERegistryService.params.site = data.response.data.site;
                        root.ChatConfig.MFERegistryService.params.deliveryRealm = data.response.data.deliveryRealm;
                        root.ChatConfig.chaletConfig.cloud8BaseUrl = data.response.data.cloud8BaseUrl;
                        root.ChatConfig.packageVersion = data.response.data.packageVersion;

                        EmbeddedChat.configurePopup(data.response.data);

                        EmbeddedChat.keepSessionAlivePingInterval = data.response.data.keepSessionAlivePingInterval;

                        if (data.response.data.channelUuid && !EmbeddedChat.channelUuid) {
                          EmbeddedChat.channelUuid = data.response.data.channelUuid;
                        }

                        deferredObject.resolve(data.response.data);
                    }
                }
            }, this))
            .fail(function() {
                deferredObject.reject();
            });

        return deferredObject.promise();
    };

    /**
     * Check the platform status to see if we can proceed.
     * NOTE: This function is the same as the one in chat.js
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
                EmbeddedChat.log("error", EmbeddedChat.ERROR_FLAG, "Can't load - Internal Server error");
                platformStatus = "error";

            } else if (response.status == 0) {

                if (!response.data.tenantEnabled || !response.data.scriptEnabled) {
                    // Internal server error
                    EmbeddedChat.log("error",EmbeddedChat.ERROR_FLAG, "Can't load - Internal Server error");
                    platformStatus = "error";

                } else if (response.data.tenantEnabled === "no") {
                    // Tenant is disabled
                    EmbeddedChat.log("error",EmbeddedChat.ERROR_FLAG, "Can't load - Tenant disabled");
                    platformStatus = "error";

                } else if (response.data.scriptEnabled === "no") {
                    // Script is disabled
                    EmbeddedChat.log("error",EmbeddedChat.ERROR_FLAG, "Can't load - Script disabled");
                    platformStatus = "error";

                } else if (response.data.tenantEnabled === "yes" && response.data.scriptEnabled === "yes") {
                    var regex = RegExp('doNotRedirect=');

                    if (response.data.platformInMaintenance) {
                        if (regex.test(window.location.search)) {
                            // Redirect not needed
                            EmbeddedChat.log("info", "Platform should have redirected but redirect was overwritten.");
                            platformStatus = "ready";
                        } else if (response.data.platformURLRedirect) {
                            // Redirect needed
                            EmbeddedChat.log("info",EmbeddedChat.ERROR_FLAG, "Platform in maintenance - Redirecting...");
                            platformStatus = "redirect";

                        } else {
                            // Platform in maintenance
                            EmbeddedChat.log("error",EmbeddedChat.ERROR_FLAG, "Can't load - Platform in maintenance");
                            platformStatus = "error";
                        }
                    }
                }
            }
        }

        return platformStatus;
    };

    /**
     * Configure for Chat popup.
     */
    EmbeddedChat.configureChatPopup = function() {
        // Configure the body class name
        $(document.body).addClass("is-popup");

        // Add the on resize handler
        $(window).resize($.proxy(function() {
            EmbeddedChat.chatWindow.resizeLoading();
        }, this));
    };

    /**
     * Load the jQuery elements for the chat containers.
     */
    EmbeddedChat.loadUIElements = function() {
        this.state.invitation.$el = $(".js-invitation-container");
        this.state.preChat.$el    = $(".js-pre-chat-container");
        this.state.chatWindow.$el = $(".js-chat-container");
        this.state.postChat.$el   = $(".js-post-chat-container");
        this.state.offChat.$el    = $(".js-offline-container");
        this.state.skipQueue.$el  = $(".js-skip-queue-container");
    };

    /**
     * Process the next UI state.
     *
     * @param [config] The UI state configuration to be manipulated
     *
     * @return jQuery Promise
     */
    EmbeddedChat.processUINext = function(config) {
        config = config || this.currentState.config;

        var currentPhase = this[config.name];
        currentPhase && currentPhase.showLoading();

        this.processingNextStep = true;

        var deferredObject = this.getNextStep().

        done($.proxy(this.processUIState, this)).

        fail($.proxy(function(errorMessage) {
            this.processingNextStep = false;
            EmbeddedChat.log("error", errorMessage);
            currentPhase && currentPhase.onError(errorMessage);
        }, this)).

        always($.proxy(function() {
            this.processingNextStep = false;
            currentPhase && currentPhase.hideLoading();
        }, this));

        return deferredObject.promise();
    };

    /**
     * Process the UI state.
     *
     * @param config the UI state configuration to be processed
     */
    EmbeddedChat.processUIState = function(config) {
        var name = config.name;

        $(".js-container").hide();

        this.currentState = this.state[name];
        this.uiState[name].call(this);

        // Needed if the user resizes the browser window when state changes have not been completed
        this.recalculateHeight();
    };

    /**
     * Hold the UI States.
     */
    EmbeddedChat.uiState = {};

    /**
     * Invitation State.
     */
    EmbeddedChat.uiState.invitation = function() {
        var timeout = this.state.invitation.config.timeout;
        var customTrigger = this.state.invitation.config.customTrigger;

        var proxiedFunction = $.proxy(function() {
            if (this.canOpenChat("invitation") && customTrigger == this.state.invitation.config.customTrigger) {
                this.state.invitation.$el.show();
                this.sendMessage("chat:invitation:open");
                this.currentState = this.state.invitation;
            }
        }, EmbeddedChat);

        if (timeout && timeout !== "never" && timeout !== "custom" && !customTrigger) {
            _.delay(proxiedFunction, timeout * 1000);
            EmbeddedChat.log("debug", "invitation scheduled", timeout);

        } else if (customTrigger && timeout !== "never") {
            _.delay(proxiedFunction, 0);
            EmbeddedChat.log("debug", "custom invitation");
        }
    };

    /**
     * Pre-Chat state.
     */
    EmbeddedChat.uiState.preChat = function() {
        this.state.preChat.$el.show();
        EmbeddedChat.phase.setTitle(this.state.preChat.$el);
        this.sendMessage("chat:preChat:open");
        this.state.preChat.$el.find(".js-form-list").scrollTop(0);
    };

    /**
     * Chat Window state.
     */
    EmbeddedChat.uiState.chatWindow = function() {
        var skipQueueConfig = this.state.chatWindow.config.skipQueue;
        this.state.skipQueue.config = this.state.offChat.config = skipQueueConfig;

        // set isNugen template
        var uuid = (this.state && this.state.chatWindow && this.state.chatWindow.config) && this.state.chatWindow.config.uuid;
        var isNugenTemplate = EmbeddedChat.isNugenTemplate(uuid);
        EmbeddedChat.log("debug", "chat window - isNugenTemplate", isNugenTemplate);
        EmbeddedChat.chatWindow.isNugenTemplate = isNugenTemplate;

        this.state.chatWindow.$el.show();
        EmbeddedChat.phase.setTitle(this.state.chatWindow.$el);
        this.sendMessage("chat:open");
        this.chatWindow.start();
    };

    /**
     * Post-Chat state.
     */
    EmbeddedChat.uiState.postChat = function() {
        this.state.postChat.$el.show();
        EmbeddedChat.phase.setTitle(this.state.postChat.$el);
        this.sendMessage("chat:postChat:open");
        this.state.postChat.$el.find(".js-form-list").scrollTop(0);
    };

    /**
     * Offline state.
     */
    EmbeddedChat.uiState.offChat = function() {
        this.state.offChat.$el.show();
        EmbeddedChat.phase.setTitle(this.state.offChat.$el);
        this.sendMessage("chat:offline:open");
        this.state.offChat.$el.find(".js-form-list").scrollTop(0);
    };

    /**
     * Skip Queue state.
     */
    EmbeddedChat.uiState.skipQueue = function() {
        this.state.skipQueue.$el.show();
        EmbeddedChat.phase.setTitle(this.state.skipQueue.$el);
        this.sendMessage("chat:skipQueue:open");
        this.state.skipQueue.$el.find(".js-form-list").scrollTop(0);
    };

    /**
     * Close state.
     */
    EmbeddedChat.uiState.close = function() {
        this.sendMessage("chat:close");

        $(".js-container").hide();
        if (this.isPopup()) {
            window.close();
        }
    };

    /**
     * Minimize state.
     */
    EmbeddedChat.uiState.minimized = function() {
        this.sendMessage("chat:minimize");
    };

    /**
     * Set up the post message mechanism used to communicate to the iframe.
     */
    EmbeddedChat.configureMessage = function() {
        if (!window.addEventListener) {
            window.attachEvent("onmessage", this.receiveMessage);

        } else {
            window.addEventListener("message", this.receiveMessage);
        }
    };

    EmbeddedChat.sendSessionDataMessage = function () {
        var channelUuid = this.getChannelUuid();

        if (channelUuid && this.session.exists) {
            var sessionExists = this.session.exists;

            if (sessionExists) {
                this.sendMessage(this.KEEP_SESSION_ALIVE_CONSTANTS.TOPIC_SET_SESSION, EmbeddedChat.session);
            }
        }
    }

    /**
     * Get the PostMessage receiver.
     *
     * @return the PostMessage receiver
     */
    EmbeddedChat.getReceiver = function() {
        var receiver;

        if (!this.isPopup()) {
            receiver = window.parent;
        }

        return receiver;
    };

    /**
     * Receive a message from the page.
     */
    EmbeddedChat.receiveMessage = function(e) {
        // Check to make sure that this message came from the correct domain.
        if (e.origin === EmbeddedChat.getReceiverDomain()) {
            var message;

            try {
                message = JSON.parse(e.data);
            } catch (err) {
                return;
            }

            if (EmbeddedChat.isPopupOpen()) {
                // The chat popup is open, so the iframe is just a proxy
                EmbeddedChat.callAndRetryOnError(function() {
                    EmbeddedChat.sendMessageProxy(e.data);
                }, 'sendMessageProxy');

                // Just few messages are processed by the iframe
                EmbeddedChat.processMessageRestricted(message);

            } else {
                EmbeddedChat.processMessage(message);
            }
        }
    };

    /**
     * Process the message received from the iframe.
     *
     * @param message the message received
     * @param {boolean} fromPopup - flag describing if event is from popup
     */
    EmbeddedChat.processMessage = function(message, fromPopup) {
        EmbeddedChat.log("debug", "message received", message);

        var topic = message.topic,
            data  = message.data;

        switch (topic) {
            case "button:click":
                this.onButtonClick();
                break;
            case "chat:change:height":
                this.recalculateHeight(data);
                break;

            case "chat:request:translations":
                this.sendTranslations(data);
                break;

            case "customer:set-info":
                this.onCustomerSetInfo(data);
                break;

            case "customer:reset-info":
                this.customer.resetInfo();
                break;

            case "chat:popup:open":
                this.onChatPopupOpen(data);
                break;

            case "chat:communication:ping":
                this.onChatCommunicationPing(data);
                break;

            case "chat:communication:data-sync":
                this.onChatCommunicationDataSync(data);
                break;

            case "chat:bus:initialize-completed":
                this.onBusInitializeCompleted();
                break;

            case "chat:popup:position":
                this.onChatPopupPosition(data);
                break;

            case "chat:browser-info":
                this.onChatBrowserInfo(data);
                break;

            case "chat:end":
                this.onChatEnd();
                break;

            case "chat:trigger-invitation":
                this.onChatTriggerInvitation();
                break;

            case "chat:trigger-pre-chat":
                this.onChatTriggerPreChat();
                break;

            case "chat:trigger-chat-window":
                this.onChatTriggerChatWindow();
                break;

            case "chat:set-language":
                this.onChatSetLanguage(data);
                break;

            case "chat:set-variables":
                this.onChatSetVariables(data);
                break;

            case "co-browsing:found":
                this.coBrowsing.onInstanceFound();
                break;

            case "co-browsing:connected":
                this.coBrowsing.onSessionConnected(data);
                break;

            case "co-browsing:disconnected":
                this.coBrowsing.onSessionDisconnected(data);
                break;

            case 'chat:update-referrer':
                this.referrer = data;
                break;

            case this.KEEP_SESSION_ALIVE_CONSTANTS.TOPIC_SET_SESSION:
                var roomId = data.roomId;
                var token = data.token;
                var exists = data.exists;
                var sessionKey = data.sessionKey;
                EmbeddedChat.setSessionDataFromIframe(roomId, token, exists);
                EmbeddedChat.saveSessionKeyToLocalStorage(sessionKey);
                break;

            case this.KEEP_SESSION_ALIVE_CONSTANTS.TOPIC_CLEAR_SESSION:
                EmbeddedChat.clearSessionData();
                EmbeddedChat.clearSessionKeyFromLocalStorage();
                break;
        }
    };

    /**
     * Process the message received from the iframe when there is a popup window.
     * Most of the messages are passed to the popped out window, but we still need to process a few of them.
     *
     * @param message the message received
     */
    EmbeddedChat.processMessageRestricted = function(message) {
        EmbeddedChat.log("debug", "message received - restricted", message);

        var topic = message.topic,
            data  = message.data;

        switch (topic) {
            case "chat:popup:open":
                this.onChatPopupOpen(data);
                break;

            case "customer:info-sent":
                this.onCustomerInfoSent();
                break;

            case "customer:reset-info":
                this.customer.resetInfo();
                break;

            case "chat:open":
            case "chat:invitation:open":
            case "chat:preChat:open":
            case "chat:postChat:open":
            case "chat:offline:open":
            case "chat:skipQueue:open":
            case "chat:communication:restablished":
                this.onChatOpenOnChatPopup();
                break;

            case "chat:popup:position":
                this.onChatPopupPosition(data);
                break;

            case "chat:trigger-invitation":
                this.onChatTriggerInvitation();
                break;

            case "chat:trigger-pre-chat":
                this.onChatTriggerPreChat();
                break;

            case "chat:trigger-chat-window":
                this.onChatTriggerChatWindow();
                break;

            case this.KEEP_SESSION_ALIVE_CONSTANTS.TOPIC_SET_SESSION_KEY:
                if (data.fromPopup) {
                    var sessionKey = data.sessionKey;
                    EmbeddedChat.saveSessionKeyToLocalStorage(sessionKey);
                }
                break;

            case this.KEEP_SESSION_ALIVE_CONSTANTS.TOPIC_CLEAR_SESSION:
                if (data.fromPopup) {
                    EmbeddedChat.clearSessionData();
                }
                break;
        }
    };


    /**
     * Handle the chat:end message.
     */
    EmbeddedChat.onChatEnd = function() {
        return this.getCurrentPhase().closeChat(true);
    };

    /**
     * Handle the chat:trigger-invitation message.
     */
    EmbeddedChat.onChatTriggerInvitation = function() {
        this.waitInitialRequests()
        .always(function() {
            EmbeddedChat.setStartedByChatAPI(true);
            this.loadInvitation(true).
            then($.proxy(this.configureInvitation, this)).
            then($.proxy(this.processInvitation, this));
        }.bind(this));
    };

    /**
     * Handle the chat:trigger-pre-chat message.
     */
    EmbeddedChat.onChatTriggerPreChat = function() {
        this.waitInitialRequests()
        .always(function() {
            if (this.canOpenChat("preChat")) {
                this.openPreChat();
            }
        }.bind(this));
    };

    /**
     * Handle the chat:trigger-chat-window message.
     */
    EmbeddedChat.onChatTriggerChatWindow = function () {
        this.waitInitialRequests()
        .always(function() {
            if (this.canOpenChat("chatWindow")) {
                this.openChatWindow();
            }
        }.bind(this));
    };

    /**
     * Open the Pre-chat.
     */
    EmbeddedChat.openPreChat = function() {
        this.loadPreChat(true).
        then($.proxy(this.configurePreChat, this)).
        then($.proxy(this.processPreChat, this)).
        fail($.proxy(function() {
            this.chatWindow.close();
        }, this));
    };

    /**
     * Open the Chat window.
     */
    EmbeddedChat.openChatWindow = function() {
        this.loadChatWindow(true).
        then($.proxy(this.configureChatWindow, this)).
        then($.proxy(this.processChatWindow, this)).
        fail($.proxy(function() {
            this.chatWindow.close();
        }, this));
    };

    /**
     * Handle the customer:set-info event.
     *
     * @param data the message data
     */
    EmbeddedChat.onCustomerSetInfo = function(data) {
      this.customer.setInfo(data);
      this.setWaitSyncRequired();
    };

    EmbeddedChat.propagateTranslations = function(translations){
        this.sendMessage("chat:translations", translations);
    }

    EmbeddedChat.sendTranslations = function(dataReceived) {
        var deferredObject = $.Deferred();
        var data = {
            script: EmbeddedChat.getScript(),
            tenant: EmbeddedChat.getTenantBase64(),
            tenantOEMPath: EmbeddedChat.tenantOEMPath,
            dictionary: [ 'chatTitle'],
            langto: dataReceived.langTo,
        };

        $.get("../../../CHAT/chat.php?action=translateSystemMessages", data)

          .done($.proxy(function(response) {
              if (!EmbeddedChat.responseHasError(response)) {
                  EmbeddedChat.propagateTranslations(response.response.data.dictionary);

                  deferredObject.resolve();

              } else {
                  deferredObject.reject();
              }
          }, this))

          .fail(function() {
              deferredObject.reject();
          });
    };

    /**
     * Handle the chat:set-language message.
     *
     * @param language the language to configure
     */
    EmbeddedChat.onChatSetLanguage = function(language) {
        this.setLanguageByChatApi(language);
    };

    /**
     * Set the language from the Chat Api, can be set by the
     * chat:set-language or chat:set-variables
     *
     * @param language the language to configure
     */
    EmbeddedChat.setLanguageByChatApi = function(language) {
        if (this.i18n.isLanguageValid(language)) {
            this.i18n.setCustomerLanguage(language);
            this.i18n.changedFromAPI = true;
            this.setWaitSyncRequired();

        } else {
            // Warn that the language is not valid
            EmbeddedChat.log("warn", "Chat language \"" + language + "\" is not valid and will be discarded");
        }
    };

    /**
     * Whether the language was changed from API
     *
     * @return true if the language was changed on onChatSetLanguage
     */
    EmbeddedChat.hasLanguageChangedFromAPI = function() {
        return this.i18n.changedFromAPI;
    }

    /**
     * Handle the chat:set-variables message.
     *
     * @param {Object} variables list of variables
     */
    EmbeddedChat.onChatSetVariables = function(variables) {
        if (!_.isObject(variables)) {
            EmbeddedChat.log("warn", "Customer variable: provided chat-variables is not a key-value object. It will be discarded");
            return;
        }

        var validChatVariables = this.filterChatVariables(variables);
        if (Object.keys(validChatVariables).length) {
            // Let 'i18n' handle the $language variable
            if (validChatVariables[EmbeddedChat.CHAT_SYSTEM_VARIABLE_LANGUAGE]) {
                this.setLanguageByChatApi(validChatVariables[EmbeddedChat.CHAT_SYSTEM_VARIABLE_LANGUAGE]);
                delete validChatVariables[EmbeddedChat.CHAT_SYSTEM_VARIABLE_LANGUAGE];
            }

            this.customer.setVariables(validChatVariables);
        }
    };

    /**
     * Handle validation removing unexpected params from the chat-variables
     */
    EmbeddedChat.filterChatVariables = function(variables) {
        var chatVariables = Object.assign({}, variables);
        var variablesKeys = Object.keys(chatVariables);

        variablesKeys.forEach(function(key) {
            var validation = this.isVariableIdentifierValid(key, chatVariables);
            if (!validation.status) {
                EmbeddedChat.log("warn", validation.message);
                delete chatVariables[key];
            }
        }.bind(this));

        return chatVariables;
    }

    EmbeddedChat.isVariableIdentifierValid = function(variableKey, variablesList) {
        if (!this.CHAT_VARIABLES_KEY_PATTERN.test(variableKey)) {
            return {
                "status": false,
                "message": "Customer variable: provided variable \"" + variableKey + "\" does not match the expected pattern or its chars exceeded the max length of 255. It will be discarded"
            };
        }

        if (this.CHAT_SYSTEM_VARIABLES_PATTERN.test(variableKey) && !_.contains(this.CHAT_SYSTEM_VARIABLES_MAP, variableKey)) {
            return {
                "status": false,
                "message": "Customer variable: provided system variable \"" + variableKey + "\" it's not supported. It will be discarded"
            };
        }

        if (typeof variablesList[variableKey] !== "string" || variablesList[variableKey].length > this.CHAT_VARIABLES_MAX_LENGTH) {
            return {
                "status": false,
                "message": "Customer variable: provided variable \"" + variableKey + "\" is not a string or its chars exceeded the max length of 255. It will be discarded"
            };
        }

        return { "status": true };
    }

    /**
     * Handle the chat:popup:position message.
     *
     * @param data the message data
     */
    EmbeddedChat.onChatPopupPosition = function(data) {
        this.chatPopupPosition = data;
    };

    /**
     * Handle the chat:browser-info message.
     *
     * @param data the message data
     */
    EmbeddedChat.onChatBrowserInfo = function(data) {
        this.chatBrowserInfo = data;
    };

    /**
     * Handle the customer:info-sent message.
     */
    EmbeddedChat.onCustomerInfoSent = function() {
        // Reset the customer info, as it was already sent
        this.customer.resetInfo();
    };

    /**
     * Handle the chat:*:open in the popup.
     */
    EmbeddedChat.onChatOpenOnChatPopup = function() {
        // Process the close state
        EmbeddedChat.processUIState(EmbeddedChat.state.close.config);
    };

    /**
     * Handle the chat:popup:open message
     *
     * @param data the message data
     */
    EmbeddedChat.onChatPopupOpen = function(data) {
        if (!this.isPopup()) {
            // Only need to update the popup window reference in the iframe
            this.updatePopupWindowReference(data && data.tryFocus);

            // Synchronize the chat popout
            this.synchronizeToPopout();

            // Change the iframe state to close
            this.onChatOpenOnChatPopup();

            // Notify chat.js that message was received and processed
            this.sendMessage("chat:popup:opened");

            this.sendSessionDataMessage();
        }
    };

    /**
     * Synchronize the chat pop out.
     */
    EmbeddedChat.synchronizeToPopout = function() {
        var data = [{
            topic: "customer:set-info",
            data: EmbeddedChat.customer.getInfo()
        },{
            topic: "chat:set-variables",
            data: EmbeddedChat.customer.getVariables()
        }];

        var language = i18n.getCustomerLanguage();
        if (language) {
            data.push({
                topic: "chat:set-language",
                data: language
            });
        }

        var sessionExists = EmbeddedChat.session.exists;
        if (sessionExists) {
            data.push({
                topic: EmbeddedChat.KEEP_SESSION_ALIVE_CONSTANTS.TOPIC_SET_SESSION,
                data: EmbeddedChat.session
            });
        }

        EmbeddedChat.sendMessageThroughProxy("chat:communication:data-sync", data);
    };

    /**
     * Handle the chat:communication:data-sync event
     *
     * @data array of events to sync
     */
    EmbeddedChat.onChatCommunicationDataSync = function(data) {
        if (data && Array.isArray(data)) {
            data.forEach(EmbeddedChat.processMessage.bind(EmbeddedChat));
        }
        this.setDataSyncCompleted();
    };

    /**
     * Handle the chat:bus:initialize-completed event
     */
    EmbeddedChat.onBusInitializeCompleted = function() {
        this.setBusInitializeCompleted();
    };

    /**
     * Handle the chat:communication:ping message
     *
     * @param data the message data
     */
    EmbeddedChat.onChatCommunicationPing = function(data) {
        this.communicationEstablished();

        if (data.restablishing) {
            this.sendMessage("chat:communication:restablished");
        }
    };

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
        if (!this._startedByChatAPI) {
            this._startedByChatAPI = $.url().param("startedbychatapi") === "true";
        }

        return !!this._startedByChatAPI;
    };

    /**
     * Reset the started by Chat API value
     */
    EmbeddedChat.resetStartedByChatAPI = function() {
        this._startedByChatAPI = false;
    };

    /**
     * Whether it is required to wait the data to sync.
     *
     * This includes the customer info and language.
     *
     * @return true if sync is required
     */
    EmbeddedChat.isSyncRequired = function() {
        if (!this._isSyncRequired) {
            this._isSyncRequired = $.url().param("syncrequired") === "true";
        }

        return !!this._isSyncRequired;
    };

    /**
     * Send the message to the iframe.
     *
     * @param {string} topic The message topic
     * @param {object} data The message data
     * @param {boolean?} fromPopup
     */
    EmbeddedChat.sendMessage = function(topic, data, fromPopup) {
        if (this.isPopup()) {
            // Add the fromPopup indication to all messages when sending
            // from a popup.
            data = data || {};
            data.fromPopup = true;
        }

        var message = JSON.stringify({
            topic: topic,
            data: data
        });

        var receiver = this.getReceiver();

        if (receiver) {
            var receiverDomain = this.getReceiverDomain();

            if (isValidOrigin(receiverDomain)) {
                receiver.postMessage(message, receiverDomain);
            } else {
                EmbeddedChat.log("error", "Invalid receiver domain: ", receiverDomain);
            }
        }

        if (this.isConfiguredAsPopup() && !fromPopup || this.isPopup()) {
            this.sendMessageThroughProxy(topic, data);
        }
    };

    /**
     *
     * @param origin target origin
     * @returns true if the origin is valid, false otherwise
     */
    function isValidOrigin(origin) {
        // https?: Matches 'http://' or 'https://'. The question mark ? makes the 's' in 'https' optional, so it matches both 'http://' and 'https://'.
        // :\/\/: Matches the '://' part of the URL.
        // [^-.]+: Matches one or more characters that are not hyphens or dots. This part matches the domain name, ensuring that it doesn't contain consecutive hyphens or dots.
        // [a-zA-Z0-9.-]*: Matches zero or more characters that are letters (both uppercase and lowercase), digits, dots, or hyphens. This part matches the rest of the domain name after the initial characters matched by [^-.]+.
        // [^-.]: Matches a character that is not a hyphen or a dot. This is used to ensure that the domain name doesn't end with a hyphen or a dot.
        // (:\d+)?: Optionally matches a colon followed by one or more digits, representing a port number.

        var validOriginUrl = /^https?:\/\/[^-.]+[a-z.A-Z-0-9]*[^-.](:\d+)?$/;
        return validOriginUrl.test(origin);
    }

    /**
     * Send the message to the popup window.
     *
     * @param topic The message topic
     * @param data The message data
     */
    EmbeddedChat.sendMessageThroughProxy = function(topic, data) {
        if (this.isConfiguredAsPopup() || this.isPopup()) {
            var message = JSON.stringify({
                topic: topic,
                data: data
            });

            this.callAndRetryOnError(function() {
                EmbeddedChat.sendMessageProxy(message);
            }, 'sendMessageProxy');
        }
    };

    /**
     * Proxy to receive a message sent between the iframe and the popup.
     *
     * In order to keep the communication between the embedded page and the popped out window.
     * Any message received from the embedded page is passed to the popped out window using the
     * send/receive message proxy pair function.
     *
     * @param data the data received
     */
    EmbeddedChat.receiveMessageProxy = function(data) {
        var message = JSON.parse(data);

        if (EmbeddedChat.isPopup()) {
            EmbeddedChat.log("debug", "Processing message from opener", message);
            EmbeddedChat.processMessage(message);

        } else {
            EmbeddedChat.log("debug", "Sending message to embedding page", message);
            EmbeddedChat.sendMessage(message.topic, message.data, true);

            // Just a few messages are processed by the iframe when it is working as a proxy for the popup
            EmbeddedChat.processMessageRestricted(message);
        }
    };

    /**
     * Proxy to send a message to the iframe or popup.
     *
     * In order to keep the communication between the embedded page and the popped out window.
     * Any message received from the embedded page is passed to the popped out window using the
     * send/receive message proxy pair function.
     *
     * @param data the data to send
     */
    EmbeddedChat.sendMessageProxy = function(data) {
        if (EmbeddedChat.isPopup() && window.opener) {
            EmbeddedChat.log("debug", "Sending message to opener", data);
            window.opener.receiveMessageProxy(data);

        } else if (EmbeddedChat.isPopupOpen()) {
            EmbeddedChat.log("debug", "Sending message to popup", data);
            EmbeddedChat.popupWindow.receiveMessageProxy(data);
        }
    };

    /**
     * Gets the interval for the next attempt to execute a function.
     *
     * @param  {number} backoffFn - the backoff amortization function
     *
     * @return {number}
     */
    EmbeddedChat.getRetryInterval = function(backoffFn) {
        if (EmbeddedChat._currentRetryInterval) {
            var newInterval = backoffFn(EmbeddedChat._currentRetryInterval);

            if (newInterval < EmbeddedChat.MAX_RETRY_INTERVAL) {
                EmbeddedChat._currentRetryInterval = newInterval;

            } else {
                EmbeddedChat._currentRetryInterval = EmbeddedChat.MAX_RETRY_INTERVAL;
            }

        } else {
            EmbeddedChat._currentRetryInterval = EmbeddedChat.MIN_RETRY_INTERVAL;
        }

        return EmbeddedChat._currentRetryInterval;
    };

    /**
     * Clear the retry interval.
     */
    EmbeddedChat.clearRetryInterval = function() {
        if (EmbeddedChat._currentRetryInterval) {
            EmbeddedChat.log("debug", "Cleared retry interval");
            EmbeddedChat._currentRetryInterval = 0;
        }
    };

    /**
     * Retry the function again after some time.
     *
     * @param functionToRetry the function to retry
     * @param name retrying action name
     */
    EmbeddedChat.callAndRetryOnError = function(functionToRetry, name) {
        try {
            functionToRetry();
            EmbeddedChat.clearRetryInterval();

        } catch(e) {
            setTimeout(function(){
                EmbeddedChat.callAndRetryOnError(functionToRetry, name);
            }, EmbeddedChat.getRetryInterval(function(x){ return x * 2; }));

            EmbeddedChat.log("info", "Retrying", name, "after", EmbeddedChat._currentRetryInterval, "ms");
        }
    };

    /**
     * Checks if the current language needes to be aligned left to right or right to left
     * and applies the change to the page.
     *
     * @param language The language code requested
     */
    EmbeddedChat.checkLanguageAlignment = function (language) {
        if (EmbeddedChat.RTL_CHAT_LANGUAGES[language]) {
            document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
        } else {
            document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
        }
    }

    EmbeddedChat.updateHTMLLanguageAttribute = function (language) {
        try {
            document.getElementsByTagName('html')[0].setAttribute('lang', language);
        } catch (e) {
            EmbeddedChat.log("error", "failed to change lang attribute");
        }
    }

    /**
     * Request the next chat step data.
     *
     * @param data the data to be sent to the server
     *
     * @return jQuery Promise
     */
    EmbeddedChat.requestNextStep = function(data) {
        var deferredObject = $.Deferred();

        data = data || {};

        _.defaults(data, {
            script:   this.getScript(),
            tenant:   this.getTenantBase64(),
            step:     this.currentState.config.name,
            langfrom: this.i18n.getDefaultLanguage(),
            langto:   this.i18n.getCurrentLanguage()
        });
        EmbeddedChat.checkLanguageAlignment(data.langto);
        EmbeddedChat.updateHTMLLanguageAttribute(data.langto);
        EmbeddedChat.sendMessage("chat:set-language", data.langto);

        var parameters = $.param(data);
        var postData = this.getNextStepPostData();

        $.post("../../../CHAT/chat.php?action=getNextStep&" + parameters, postData).

        done(function(data) {
            if (EmbeddedChat.responseHasError(data)) {
                deferredObject.reject(data.response.data);

            } else if (data.response.status == 0) {
                deferredObject.resolve(data.response.data);
            }
        }).

        fail(function(jqXHR, textStatus, errorThrown) {
            deferredObject.reject(errorThrown);
        });

        return deferredObject.promise();
    };

    /**
     * Get the next step post data.
     *
     * @return an object
     */
    EmbeddedChat.getNextStepPostData = function() {
        var variables = EmbeddedChat.customer.getVariables();

        if (EmbeddedChat.preChat.hasData()) {
            var preChatFormData = EmbeddedChat.preChat.getFormData();

            preChatFormData.forEach(function(element, index, list) {
                if (element.identifier && element.answer !== "") {
                    variables[element.identifier] = element.answer;
                }
            });
        }

        if (EmbeddedChat.offChat.hasData()) {
            var offChatFormData = EmbeddedChat.offChat.getFormData();

            offChatFormData.forEach(function(element, index, list) {
                if (element.identifier && element.answer !== "") {
                    variables[element.identifier] = element.answer;
                }
            });
        }

        variables[EmbeddedChat.CHAT_SYSTEM_VARIABLE_LANGUAGE] = i18n.getCurrentLanguage();

        return {
            variables: variables
        };
    }

    /**
     * Get the next chat step.
     *
     * @return jQuery Promise
     */
    EmbeddedChat.getNextStep = function() {
        var deferredObject = $.Deferred();

        this.requestNextStep().

        done($.proxy(function(config) {
            this.state[config.name].config = config;
            this.loadFragment(config).done(deferredObject.resolve).fail(deferredObject.reject);
        }, this)).

        fail($.proxy(function(config) {
            deferredObject.reject(config.error);
        }, this));

        return deferredObject.promise();
    };

    /**
     * Handle the button click event.
     */
    EmbeddedChat.onButtonClick = function() {
        if (this.canOpenChat() && !this.processingNextStep) {
            // Reset the default termination counter
            this.terminationCounter.reset();

            // Store the current state object
            var currentState = this.currentState;

            // Set the button as the current chat state so the server can know
            // the online/offline status when searching for the next step
            if (this.isOriginFromButton()) {
                this.currentState = this.state.button;
            } else if (this.isOriginFromInvitation()) {
                this.currentState = this.state.invitation;
            }

         // Pass the invitation as the current state, so the loading indication
            // can be displayed in the right place
            this.processUINext(this.state.invitation.config);

            // Restore the current state object
            this.currentState = currentState;
        }
    };

    /**
     * Check whether the chat can be open.
     *
     * The function is called, for instance, when the page that is embedding the chat sends
     * a "open:chat" message. If the Chat is already in a open state, there is no need to open it,
     * so this method will return false.
     *
     * @param nextState the next state to be checked
     *
     * @return true if the chat can be open
     */
    EmbeddedChat.canOpenChat = function(nextState) {
        // Assume the chat can be open
        var canOpenChat = true;

        var canOpenChatForState = this.canOpenChatforState(nextState);

        if (!_.contains(["close", "minimize", "invitation", "preChat", "chatWindow"], this.currentState.config.name)) {
            // The chat is not the corrected state
            canOpenChat = false;

        } else if ((canOpenChatForState && this.isPopup()) ||
                   (canOpenChatForState && this.isPopupOpen())) {
            // Invitation can't be open in a popup or when the popup is already open
            canOpenChat = false;

        } else if (!canOpenChatForState && this.isConfiguredAsPopup() && !this.isPopup()) {
            // It is configured as a popup and this is not the popup
            canOpenChat = false;

        } else if (((nextState && nextState != "invitation") && !this.isNextChatState(nextState)) ||
                   ((nextState == "invitation") && (!_.contains(["close", "minimize", "invitation"], this.currentState.config.name)))) {
            // It is trying to open either the same state or a previous one. The only exception is Invitation which is allowed to be reopened.
            canOpenChat = false;
        } else if (this.canOpenChatTriggeredByOnlineButton(nextState)){
            canOpenChat = false;
        }

        return canOpenChat;
    };

    /**
     * Check whether the chat can be open for the given state.
     */
    EmbeddedChat.canOpenChatforState = function(nextState) {
        return _.contains(["invitation", "preChat", "chatWindow"], nextState);
    };

    /**
     * Check whether the chat was triggered by online button and Pre-chat or Chat window is already opened.
     */
    EmbeddedChat.canOpenChatTriggeredByOnlineButton = function(nextState){
        return !nextState && _.contains(["preChat", "chatWindow"], this.currentState.config.name);
    };

    /**
     * Check whether a given state is part of the next chat states based on the current one.
     *
     * @param state the state to be checked
     *
     * @return true if the state is part of the next chat states, false otherwise
     */
    EmbeddedChat.isNextChatState = function(state) {
        return _.contains(EmbeddedChat.getNextChatStates(), state);
    };

    /**
     * Get the next chat states based on the current one.
     *
     * @return the next chat states
     */
    EmbeddedChat.getNextChatStates = function() {
        var states = [];
        var currentStateOrder = this.state[this.currentState.config.name].order;
        _.map(this.state, function(value, key) {
            if (value.order > currentStateOrder) {
                states.push(key);
            }
        });
        return states;
    };

    /**
     * Whether the chat is closed.
     *
     * @return true if the chat current state is set to closed.
     */
    EmbeddedChat.isClosed = function() {
        return "close" == this.currentState.config.name;
    };

    /**
     * Check whether a given state configuration is a button
     *
     * @param config The state configuration
     *
     * @return true if a button, false otherwise
     */
    EmbeddedChat.isButton = function(config) {
        return _.contains(["onlineButton", "offlineButton"], config.name);
    };

    /**
     * Whether this Embedded chat is open as a pop up.
     *
     * @return true if it is open as a pop up
     */
    EmbeddedChat.isPopup = function() {
        if (this.openAsPopup === undefined) {
            this.openAsPopup = $.url().param("popup") == "true";
        }
        return this.openAsPopup;
    };

    /**
     * Whether this Embedded chat is open as a pop up.
     *
     * @return true if it is open as a pop up
     */
    EmbeddedChat.isConfiguredAsPopup = function() {
        return this.configuredAsPopup || false;
    };

    /**
     * Return the suported language code or undefined if the language isn't supported
     * @param language - Language to be checked
     * @param languageField - (DOM Element) Select Field from Language List
     */
    EmbeddedChat.getSupportedLanguageCode = function(language, languageField) {
        // Map to extract just the option values
        var supportedLanguageMap = jQuery.map(languageField.children(), function(option){
            return option.value;
        });

        // Get language initials to be compatible with our entire list
        var languageInitials = language.substr(0,2);

        return supportedLanguageMap.filter(function(value) {
            return ((value == language) || (value == languageInitials));
        }).pop();
    };

    /**
     *  Get browser language
     */
    EmbeddedChat.getBrowserLanguage = function() {
        return navigator.language || navigator.userLanguage;
    };

    /**
     * Select the proper language to be default accordingly with the configuration
     * @param fragment object
     */
    EmbeddedChat.setCustomerDefaultLanguage = function(fragment) {
        // Default Language provided by CM Pre-Chat Configuration
        var selectLanguagesElement = fragment.$el.find("[data-language]");
        var isLanguageQuestion = selectLanguagesElement.data("language");
        var defaultLanguageSelected = selectLanguagesElement.val();

        // Check if is a Language/Translation Question
        if (isLanguageQuestion) {
            // Get the browser language and the flag to verify if can be overrided
            var browserLanguage = EmbeddedChat.getBrowserLanguage( browserLanguage );
            var defaultLanguageFromBrowser = (selectLanguagesElement.attr("data-userbrowserlanguageasdefault") == "true");

            // Get the supported language code for browser language or undefined if browser language isn't supported
            var supportedBrowserLanguageCode = EmbeddedChat.getSupportedLanguageCode( browserLanguage, selectLanguagesElement );

            // Choose the default language accordingly with the logic
            var defaultLanguage = (defaultLanguageFromBrowser && supportedBrowserLanguageCode) ? supportedBrowserLanguageCode : defaultLanguageSelected;

            if (EmbeddedChat.hasLanguageChangedFromAPI()) {
                var customerLanguage = this.i18n.getCustomerLanguage();
                var supportedCustomerLanguageCode = EmbeddedChat.getSupportedLanguageCode(customerLanguage, selectLanguagesElement);
                if (supportedCustomerLanguageCode) {
                    defaultLanguage = supportedCustomerLanguageCode;
                } else {
                    // Warn that the language is not valid
                    EmbeddedChat.log("warn", "Language \"" + customerLanguage + "\" set via Chat-API is not available and will be ignored");
                }
            }

            // Select language option and set Customer Language on i18n
            selectLanguagesElement.val(defaultLanguage);
            this.i18n.setCustomerLanguage(defaultLanguage);
        }
    };

    /**
     * Load an HTML fragment to be added to the Chat container.
     *
     * @param config The fragment configuration
     *
     * @return jQuery Promise
     */
    EmbeddedChat.loadFragment = function(config) {
        var fragment       = config.name,
            fragmentState  = this.state[fragment],
            deferredObject = $.Deferred();

        if (config.uuid) {
            var src = EmbeddedChat.SHARED_ALIAS +
                      EmbeddedChat.CHAT_PATH +
                      "/" + this.getTenantBase64() +
                      "/" + config.uuid +
                      "/index.html?_=" + (new Date()).getTime();

            fragmentState.$el.load(src, $.proxy(function (responseText, textStatus) {
                if (textStatus === "success") {
                    var handleLoadFragmentSuccess = (function () {
                        this[fragment].init(fragmentState.$el, this);

                        EmbeddedChat.setCustomerDefaultLanguage(fragmentState);

                        // Translate the fragment
                        this.i18n.translateFragment(fragmentState.$el)
                            .always($.proxy(function () {
                                deferredObject.resolve(config);
                            }, this));
                    }).bind(this);

                    this.sendMessage("chat:theme", { isNuGen: EmbeddedChat.isNugenTemplate(config.uuid) });

                    if (fragment === 'chatWindow') {
                        EmbeddedChat.chatWindow.setupReactApp(fragmentState.$el).then(handleLoadFragmentSuccess)
                    } else {
                        handleLoadFragmentSuccess();
                    }
                } else {
                    deferredObject.reject(textStatus);
                }
            }, this));

        } else {
            deferredObject.reject();
        }

        return deferredObject.promise();
    };

    EmbeddedChat.isPopupAllowed = false;

    EmbeddedChat.setIsPopupAllowed = function (isPopupAllowed) {
        this.isPopupAllowed = isPopupAllowed;
    }

    EmbeddedChat.KEEP_SESSION_ALIVE_CONSTANTS = {
        HEADER: 'X-8x8-Guest-Session',
        KEY_PREFIX: '8x8_guest_session',
        TOPIC_SET_SESSION: 'session:set-data',
        TOPIC_SET_SESSION_KEY: 'session:set-session-key',
        TOPIC_CLEAR_SESSION: 'session:clear-data',
    };

    EmbeddedChat.constructKeyForStorage = function (tenant, channelUuid) {
        return [EmbeddedChat.KEEP_SESSION_ALIVE_CONSTANTS.KEY_PREFIX, tenant, channelUuid].join("_");
    };

    EmbeddedChat.saveSessionKeyToLocalStorage = function (value) {
        try {
            if (!EmbeddedChat.hasAccessToLocalStorage()) {
                return;
            }
            var tenant = EmbeddedChat.getTenant();
            var channelUuid = EmbeddedChat.getChannelUuid();
            var key = EmbeddedChat.constructKeyForStorage(tenant, channelUuid);
            localStorage.setItem(key, value);
        } catch (e) {
            EmbeddedChat.log("error", "KSA - Error saving session key to local storage: " + e);
        }
    };

    EmbeddedChat.getSessionKeyFromLocalStorage = function () {
        try {
            if (!EmbeddedChat.hasAccessToLocalStorage()) {
                return '';
            }
            var tenant = EmbeddedChat.getTenant();
            var channelUuid = EmbeddedChat.getChannelUuid();
            var key = EmbeddedChat.constructKeyForStorage(tenant, channelUuid);
            return localStorage.getItem(key);
        } catch (e) {
            EmbeddedChat.log("error", "KSA - Error getting session key from local storage: " + e);
            return '';
        }
    };

    EmbeddedChat.clearSessionKeyFromLocalStorage = function () {
        try {
            if (!EmbeddedChat.hasAccessToLocalStorage()) {
                return;
            }
            var tenant = EmbeddedChat.getTenant();
            var channelUuid = EmbeddedChat.getChannelUuid();
            var key = EmbeddedChat.constructKeyForStorage(tenant, channelUuid);
            localStorage.removeItem(key);
        } catch (e) {
            EmbeddedChat.log("error", "KSA - Error clearing session key from local storage: " + e);
        }
    }

    EmbeddedChat.processSessionResponse = function (jqXhrObject) {
        var sessionKey = jqXhrObject.getResponseHeader(EmbeddedChat.KEEP_SESSION_ALIVE_CONSTANTS.HEADER);
        if (sessionKey) {
            EmbeddedChat.processSessionKey(sessionKey);
        }
    }

    EmbeddedChat.processSessionKey = function (sessionKey) {
        EmbeddedChat.log("debug", "KSA - Processing session key: " + sessionKey);
        EmbeddedChat.saveSessionKeyToLocalStorage(sessionKey);

        // Synchronize popup to opener (main window) in order to update local storage with session key.
        // Useful to make the GET session call and automatically open popup if session is found.
        if (this.isPopup()) {
            EmbeddedChat.setSessionKey(sessionKey);
            EmbeddedChat.sendMessage(EmbeddedChat.KEEP_SESSION_ALIVE_CONSTANTS.TOPIC_SET_SESSION_KEY, { sessionKey: sessionKey }, true);
        }

        EmbeddedChat.log("debug", "KSA - Session key processed successfully: " + sessionKey);
    }

    // Session data for keep session alive feature
    EmbeddedChat.session = {
        roomId: '',
        token: '',
        exists: false,
        sessionKey: '', // relevant only for popup
        receivedFromIframe: false, // relevant only for popup
    };

    EmbeddedChat.setSessionData = function (roomId, token, sessionExists) {
        EmbeddedChat.session.roomId = roomId;
        EmbeddedChat.session.token = token;
        EmbeddedChat.session.exists = sessionExists;
    }

    EmbeddedChat.setSessionDataFromIframe = function (roomId, token, sessionExists) {
        EmbeddedChat.session.roomId = roomId;
        EmbeddedChat.session.token = token;
        EmbeddedChat.session.exists = sessionExists;
        EmbeddedChat.session.receivedFromIframe = true;
    }

    EmbeddedChat.setSessionKey = function (sessionKey) {
        EmbeddedChat.session.sessionKey = sessionKey;
    }

    EmbeddedChat.clearSessionData = function () {
        EmbeddedChat.session.roomId = '';
        EmbeddedChat.session.token = '';
        EmbeddedChat.session.exists = false;
        EmbeddedChat.session.sessionKey = '';
        EmbeddedChat.session.receivedFromIframe = false;
    }

    /**
     * https://swaggerhub.es.8x8.com/apis/8x8/vcc-chat-processor-API/1.0.0#/Session%20controller
     *
     * Checks if session exists and get session data
     * @param {string} tenant
     * @param {string} channelUuid
     * @returns {Deferred} - { newSession, roomId, token }
     */
    EmbeddedChat.getSession = function (tenant, channelUuid) {
        var deferredObject = $.Deferred();

        var headers = { "Access-Control-Allow-Credentials": true };

        var sessionKey = EmbeddedChat.getSessionKeyFromLocalStorage();
        if (sessionKey) {
            headers[EmbeddedChat.KEEP_SESSION_ALIVE_CONSTANTS.HEADER] = sessionKey;
        }

        $.ajax({
            url: `${root.chaletAdapter.cloud8BaseUrl}/vcc-chat-processor/public/v1/tenant/${tenant}/channel/${channelUuid}/session`,
            headers: headers,
            type: 'GET',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            cache: false,
        })
        .done(function (response, _, jqXhrObject) {
            // there is a session already created
            EmbeddedChat.setSessionData(response.roomId, response.token, true);
            EmbeddedChat.processSessionResponse(jqXhrObject);
            deferredObject.resolve(true);
        })
        .fail(function (errorData) {
            // there is no session already created
            EmbeddedChat.log('error', 'Failed to get session', errorData);
            if (sessionKey) {
                EmbeddedChat.clearSessionKeyFromLocalStorage();
            }
            deferredObject.reject(false);
        });

        return deferredObject.promise();
    }

    /**
     * https://swaggerhub.es.8x8.com/apis/8x8/vcc-chat-processor-API/1.0.0#/Session%20controller/putSessionMessage
     *
     * Create a new session and get session data
     * @param {string} tenant
     * @param {string} channelUuid
     * @param {*} data
     * @returns {Deferred} <{ newSession, roomId, token }>
     */
    EmbeddedChat.createSession = function (tenant, channelUuid, data) {
        return $.ajax({
            url: `${root.chaletAdapter.cloud8BaseUrl}/vcc-chat-processor/public/v1/tenant/${tenant}/channel/${channelUuid}/session`,
            headers: {
                "Content-Type": CONTENT_TYPE_JSON,
                "Access-Control-Allow-Credentials": true
            },
            type: 'POST',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            cache: false,
            // dataType: "json",
            data: JSON.stringify(data)
        })
        .done(function (response, _, jqXhrObject) {
            EmbeddedChat.setSessionData(response.roomId, response.token, true);
            EmbeddedChat.processSessionResponse(jqXhrObject);
        })
        .fail(function (errorData) {
            EmbeddedChat.log('error', 'Failed to create session', errorData);
        });
    }

    EmbeddedChat.startKeepSessionAliveFlowWithPopup = function (tenant, channelUuid) {
        // Check if the session data was already received through postMessage
        if (EmbeddedChat.isSessionDataFromIframe()) {
            var roomId = this.getRoomIdFromSession();
            var token = this.getTokenFromSession();
            var sessionExists = !!(roomId && token);

            EmbeddedChat.setSessionData(roomId, token, sessionExists);

            if (sessionExists) {
                root.chaletAdapter.setInteractionCreated(true);
                EmbeddedChat.openChatWindow();
            }

            return;
        }

        // If not, then get session data
        EmbeddedChat.getSession(tenant, channelUuid)
            .always(function (sessionAlreadyExists) {
                if (sessionAlreadyExists) {
                    root.chaletAdapter.setInteractionCreated(true);
                    this.openChatWindow();
                } else {
                    this.startStandardFlow();
                }
            }.bind(this));
    }

    EmbeddedChat.startKeepSessionAliveFlow = function (tenant, channelUuid) {
        // check if we have a session already created
        EmbeddedChat.getSession(tenant, channelUuid)
        .always(function (sessionExists) {
            if (sessionExists) {
                // if session exists, mark the interaction as already created and open the chat window
                root.chaletAdapter.setInteractionCreated(true);

                var shouldOpenPopup = !this.isPopup() && this.isConfiguredAsPopup();

                if (shouldOpenPopup) {
                    this.openChatPopup();
                    this.onChatOpenOnChatPopup();

                    if (!this.isPopupAllowed) {
                        this.processInvitation();
                    }
                } else {
                    this.openChatWindow();
                }
            } else {
                // go through the regular flow
                this.startStandardFlow();
            }
        }.bind(this));
    }

    EmbeddedChat.startStandardFlow = function () {
        if (this.isPopup()) {
            if (this.isOriginFromButton() || this.isOriginFromInvitation()) {
                this.onButtonClick();
            } else if (this.isOriginFromPreChat()) {
                this.openPreChat();
            } else if (this.isOriginFromChatWindow()) {
                this.openChatWindow();
            }
        } else {
            this.processInvitation();
        }
    }

    /**
     * Method called when we finish loading the initial components.
     *
     * This function will also send a message to the embedding page and initialize the
     * Chat in the appropriate state.
     */
    EmbeddedChat.loaded = function() {
        EmbeddedChat.log("debug", "loaded");

        const tenantLanguageCode = EmbeddedChat.tenantLanguageCode;

        // Check whether there is already a Chat Popup open so we can establish the connection
        // to it to start sending the customer info.
        this.checkChatPopup();

        this.sendMessage("chat:loaded", {popup: this.isPopup(), tenantLanguageCode});
        this.sendMessage("chat:theme", { isNuGen: EmbeddedChat.isNugenTemplate() });

        var tenant = this.getTenant();
        var channelUuid = this.getChannelUuid();
        var sessionKey = this.getSessionKeyFromLocalStorage();

        // proceed with the new flow with keeping session alive
        if (channelUuid && sessionKey) {
            // start keep session alive flow for popup, so we don't make the same call for getting the session data
            if (this.isPopup()) {
                this.startKeepSessionAliveFlowWithPopup(tenant, channelUuid);
                return;
            }

            this.startKeepSessionAliveFlow(tenant, channelUuid);
            return;
        }

        // we need to go through the standard flow
        this.startStandardFlow();
    };

    /**
     * Try to process the Invitation UI state.
     */
    EmbeddedChat.processInvitation = function() {
        if (this.canOpenChat("invitation")) {
            var invitationConfig = this.state.invitation.config;

            if (invitationConfig.uuid) {
                this.processUIState(invitationConfig);
            }
        }
    };

    /**
     * Load the button.
     * This Promise is used to wait for the parent page to load the button.
     *
     * @return jQuery Promise
     */
    EmbeddedChat.loadButton = function() {
        return this.requestNextStep({step: "initButton"});
    };

    /**
     * Load an external CSS file.
     */
    EmbeddedChat.loadExternalStylesheet = function() {
        var stylesheetURL = this.getStylesheetURL();

        if (!this.externalStylesheetLoaded && typeof stylesheetURL === "string") {
            $("<link/>", {rel: "stylesheet", href: stylesheetURL}).appendTo("head");
            this.externalStylesheetLoaded = true;

            EmbeddedChat.log("debug", "External stylesheet loaded from", stylesheetURL);
        }
    };

    /**
     * Load the custom system messages.
     */
    EmbeddedChat.loadCustomSystemMessages = function() {
        var customSystemMessages = this.getCustomSystemMessages();
        EmbeddedChat.onSetSystemMessages(customSystemMessages);
    };

    /**
     * Configure the button.
     *
     * @param config      The button configuration
     * @param config.uuid The button UUID
     *
     * @return jQuery Promise
     */
    EmbeddedChat.configureButton = function(config) {
        var buttonConfig = this.state.button.config,
            buttonId     = buttonConfig != null ? buttonConfig.uuid : null,
            newId        = config.uuid;

        if (newId) {
            if (newId !== buttonId) {
                EmbeddedChat.sendMessage("show:button", newId);
            }

        } else {
            EmbeddedChat.sendMessage("hide:button");
        }

        this.state.button.config = config;

        // Check button configuration again in 5 minutes
        _.delay($.proxy(function() {
            this.loadButton().done($.proxy(this.configureButton, this));
        }, this), 300000);

        return $.Deferred().resolve().promise();
    };

    /**
     * Load the invitation.
     *
     * @param isCustomTrigger whether the load invitation is being triggered manually
     *
     * @return jQuery Promise
     */
    EmbeddedChat.loadInvitation = function(isCustomTrigger) {
        var deferredObject = $.Deferred();

        this.requestNextStep({step: "initInvitation", customTrigger: isCustomTrigger}).

        done($.proxy(function(config) {
            this.loadFragment(config).done(deferredObject.resolve).fail(deferredObject.reject);
        }, this)).

        fail(function(data){
            EmbeddedChat.log("info", data.error);
            deferredObject.reject(data);
        });

        return deferredObject.promise();
    };

    /**
     * Configure the invitation.
     *
     * @param config      The invitation configuration
     * @param config.uuid The invitation UUID
     *
     * @return jQuery Promise
     */
    EmbeddedChat.configureInvitation = function(config) {
        this.state.invitation.config = config;

        return $.Deferred().resolve().promise();
    };

    /**
     * Configure the chat popup.
     *
     * @param config the button or invitation configuration
     */
    EmbeddedChat.configurePopup = function(config) {
        EmbeddedChat.log("debug", "configurePopup", config);

        if (config && config.configuredAsPopup) {
            this.configuredAsPopup = !!config.configuredAsPopup;

        } else {
            this.configuredAsPopup = EmbeddedChat.DEFAULT_POPOUT_CONFIGURATION;
        }

        return config;
    };

    /**
     * Load the Pre-chat.
     *
     * @return jQuery Promise
     */
    EmbeddedChat.loadPreChat = function(isCustomTrigger) {
        var deferredObject = $.Deferred();

        this.requestNextStep({step: "initPreChat", customTrigger: isCustomTrigger}).

        done($.proxy(function(config) {
            this.loadFragment(config).done(deferredObject.resolve).fail(deferredObject.reject);
        }, this)).

        fail(function(data){
            EmbeddedChat.log("info", data.error);
            deferredObject.reject();
        });

        return deferredObject.promise();
    }

    /**
     * Configure the Pre-chat.
     *
     * @param config The Pre-chat configuration
     *
     * @return jQuery Promise
     */
    EmbeddedChat.configurePreChat = function(config) {
        this.state.preChat.config = config;

        // Configure whether the Pre-chat should open as a popup
        this.configurePopup(config);

        return $.Deferred().resolve().promise();
    };

    /**
     * Try to process the Pre-chat UI state.
     */
    EmbeddedChat.processPreChat = function() {
        var preChatConfig = this.state.preChat.config;
        if (preChatConfig.uuid) {
            EmbeddedChat.setStartedByChatAPI(true);
            this.processUIState(preChatConfig);
        }
    };

    /**
     * Load the chat window
     *
     * @return jQuery Promise
     */
    EmbeddedChat.loadChatWindow = function (isCustomTrigger) {
        var deferredObject = $.Deferred();

        this.requestNextStep({ step: "initChatWindow", customTrigger: isCustomTrigger }).

            done($.proxy(function (config) {
                this.loadFragment(config).done(deferredObject.resolve).fail(deferredObject.reject);
            }, this)).

            fail(function(data){
                EmbeddedChat.log("info", data.error);
                deferredObject.reject();
            });

        return deferredObject.promise();
    };

    /**
     * Configure the Chat Window.
     *
     * @param config      The chat window configuration
     * @param config.uuid The chat window UUID
     *
     * @return jQuery Promise
     */
    EmbeddedChat.configureChatWindow = function (config) {
        this.state.chatWindow.config = config;

        // Configure whether the chat should open as a popup
        this.configurePopup(config);

        return $.Deferred().resolve().promise();
    };

    /**
     * Try to process the Chat Window UI state.
     */
    EmbeddedChat.processChatWindow = function () {
        var chatWindowConfig = this.state.chatWindow.config;

        if (chatWindowConfig.uuid) {
            EmbeddedChat.setStartedByChatAPI(true);
            this.processUIState(chatWindowConfig);
        }
    };

    /**
     * Start the process to initialize the bus.
     */
    EmbeddedChat.busInitialize = function() {
        if (this.isPopup()) {
            EmbeddedChat.log("debug", "Bus not required to be initialized by popup");
            return;
        }

        EmbeddedChat.log("debug", "bus initialize");
        this.sendMessage("chat:bus:initialize", {popup: this.isPopup()});
    };

    /**
     * Check the url parameters to see if it is required to wait for the bus to
     * initialize.
     * It is not required to wait for the bus in the popup window.
     *
     * @return true if it is required to wait.
     */
    EmbeddedChat.isWaitBusInitializeRequired = function() {
        if (this._isWaitBusRequired == null) {
            this._isWaitBusRequired = $.url().param("waitbusinitialize") === "true";
        }

        return this._isWaitBusRequired && !this.isPopup();
    };

    /**
     * Wait for the bus to initialize.
     *
     * @return jQuery Promise
     */
    EmbeddedChat.waitBusInitialize = function() {
        this.waitBusInitializeDeferredObject = $.Deferred();

        if (this.isWaitBusInitializeRequired()) {
            EmbeddedChat.log("info", "waitBusInitialize", "Wait for bus initialize required");
            this.startWaitBusInitializeTimeout();

        } else {
            EmbeddedChat.log("debug", "waitBusInitialize", "Wait for bus initialize not required");
            this.waitBusInitializeDeferredObject.resolve();
        }

        return this.waitBusInitializeDeferredObject.promise();
    };

    /**
     * Start the timeout to wait for bus initialize.
     */
    EmbeddedChat.startWaitBusInitializeTimeout = function() {
        this.waitBusInitializeTimeout = setTimeout(this.setBusInitializeFailed.bind(this), EmbeddedChat.CHAT_WAIT_BUS_READY_TIMEOUT_SECONDS);
    };

    /**
     * Clear the timeout waiting for bus initialize.
     */
    EmbeddedChat.clearWaitBusInitializeTimeout = function() {
        clearTimeout(this.waitBusInitializeTimeout);
        this.waitBusInitializeTimeout = null;
    };

    /**
     * Set the bus initialize promise as completed.
     */
    EmbeddedChat.setBusInitializeCompleted = function() {
        if (!this.waitBusInitializeDeferredObject) {
            return EmbeddedChat.log("error", "setBusInitializeCompleted", "Promise is undefined");
        }

        var promiseState = this.waitBusInitializeDeferredObject.state();
        if (promiseState !== "pending") {
            return EmbeddedChat.log("warn", "setBusInitializeCompleted", "Promise not pending -", promiseState);
        }

        EmbeddedChat.log("info", "setBusInitializeCompleted", "Promise resolved");
        this.waitBusInitializeDeferredObject.resolve();
        this.clearWaitBusInitializeTimeout();
    };

    /**
     * Set the bus ready promise as failed.
     */
    EmbeddedChat.setBusInitializeFailed = function() {
        if (!this.waitBusInitializeDeferredObject) {
            return EmbeddedChat.log("error", "setBusInitializeFailed", "Promise is undefined");
        }

        var promiseState = this.waitBusInitializeDeferredObject.state();
        if (promiseState !== "pending") {
            return EmbeddedChat.log("warn", "setBusInitializeFailed", "Promise not pending -", promiseState);
        }

        EmbeddedChat.log("error", "setBusInitializeFailed", "Promise rejected");
        this.waitBusInitializeDeferredObject.reject();
        this.clearWaitBusInitializeTimeout();
    };

    /**
     * Wait data to be synchronized if required.
     *
     * @return jQuery Promise
     */
    EmbeddedChat.waitDataSync = function() {
        this.waitDataSyncDeferredObject = $.Deferred();

        if (this.isPopup() && this.isSyncRequired()) {
            EmbeddedChat.log("info", "waitDataSync", "Data synchronization required");
            this.startWaitDataSyncTimeout();

        } else {
            EmbeddedChat.log("debug", "waitDataSync", "Data synchronization not required");
            this.waitDataSyncDeferredObject.resolve();
        }

        return this.waitDataSyncDeferredObject.promise();
    };

    /**
     * Start the timeout to wait for data to sync.
     */
    EmbeddedChat.startWaitDataSyncTimeout = function() {
        this.waitDataSyncTimeout = setTimeout(this.setDataSyncFailed.bind(this), EmbeddedChat.CHAT_WAIT_SYNC_TIMEOUT);
    };

    /**
     * Clear the timeout waiting for data to sync.
     */
    EmbeddedChat.clearWaitDataSyncTimeout = function() {
        clearTimeout(this.waitDataSyncTimeout);
        this.waitDataSyncTimeout = null;
    };

    /**
     * Set the data sync promise as completed.
     */
    EmbeddedChat.setDataSyncCompleted = function() {
        if (!this.waitDataSyncDeferredObject) {
            return EmbeddedChat.log("error", "setDataSyncCompleted", "Promise is undefined");
        }

        var promiseState = this.waitDataSyncDeferredObject.state();
        if (promiseState !== "pending") {
            return EmbeddedChat.log("warn", "setDataSyncCompleted", "Promise not pending -", promiseState);
        }

        EmbeddedChat.log("info", "setDataSyncCompleted", "Promise resolved");
        this.waitDataSyncDeferredObject.resolve();
        this.clearWaitDataSyncTimeout();
    };

    /**
     * Set the data sync promise as failed.
     */
    EmbeddedChat.setDataSyncFailed = function() {
        if (!this.waitDataSyncDeferredObject) {
            return EmbeddedChat.log("error", "setDataSyncFailed", "Promise is undefined");
        }

        var promiseState = this.waitDataSyncDeferredObject.state();
        if (promiseState !== "pending") {
            return EmbeddedChat.log("warn", "setDataSyncFailed", "Promise not pending -", promiseState);
        }

        EmbeddedChat.log("error", "setDataSyncFailed", "Promise rejected");
        this.waitDataSyncDeferredObject.reject();
        this.clearWaitDataSyncTimeout();
    };

    /**
     * Get the current chat phase.
     *
     * @return The current chat phase
     */
    EmbeddedChat.getCurrentPhase = function() {
        return this[this.currentState.config.name];
    };

    /**
     * Get the script uuid
     *
     * @return {string}
     */
    EmbeddedChat.getScript = function() {
        if (!this.scriptId) {
            this.scriptId = $.url().param("uuid");
        }
        return this.scriptId;
    };

    /**
     * Get the stylesheet URL if it exists
     *
     * @return the handler URL
     */
    EmbeddedChat.getStylesheetURL = function() {
        if (!this.stylesheetURL) {
            this.stylesheetURL = $.url().param("stylesheetURL") || null;
        }

        return this.stylesheetURL;
    };

    /**
     * Get the custom system message if it exists
     *
     * @return the custom system message object
     */
    EmbeddedChat.getCustomSystemMessages = function() {
        if (!this.customSystemMessages) {
            this.customSystemMessages = this.getLocalStorageConfig("customSystemMessages") || null;
        }

        return this.customSystemMessages;
    };

    /**
     * Get the configuration from the local storage.
     *
     * @param name the configuration name
     * @return null of the configuration
     */
    EmbeddedChat.getLocalStorageConfig = function(name) {
        var key = "__8x8Chat-" + this.getScript();

        if (!this.localStorageConfig) {
            try {
                this.localStorageConfig = JSON.parse(localStorage.getItem(key)) || {};
            } catch (error) {
                this.localStorageConfig = {};
            }
        }

        return this.localStorageConfig[name];
    };

    /**
     * Get the tenant.
     *
     * @return {string}
     */
    EmbeddedChat.getTenant = function() {
        return this.tenant;
    };

    /**
     * Get the tenant base64.
     *
     * @return {string}
     */
    EmbeddedChat.getTenantBase64 = function() {
        if (!this.tenantBase64) {
            this.tenantBase64 = $.url().param("tenant");
        }
        return this.tenantBase64;
    };

    /**
     * Get the guest chat version MFE.
     *
     * @return the version
     */
    EmbeddedChat.getGuestChatBuildVersion = function() {
        if (!this.guestChatBuildVersion) {
            this.guestChatBuildVersion = $.url().param("guestChatBuildVersion");
        }
        return this.guestChatBuildVersion;
    };

    /**
     * Get chat align.
     *
     * @return left or right
     */
     EmbeddedChat.getChatAlign = function() {
        if (!this.chatAlign) {
            this.chatAlign = $.url().param("chatAlign");
        }
        return this.chatAlign;
    };


    /**
     * Get the channel.
     *
     * @return {string}
     */
    EmbeddedChat.getChannel = function() {
        if (!this.channel) {
            this.channel = $.url().param("channel");
        }
        return this.channel;
    };

    /**
     * Get the channelUuid.
     *
     * @return {string} - the channelUuid
     */
    EmbeddedChat.getChannelUuid = function() {
        if (!this.channelUuid) {
            this.channelUuid = $.url().param("channelUuid");
        }
        return this.channelUuid;
    };

    /**
     * Get the roomId from session data.
     *
     * @return {string} roomId
     */
    EmbeddedChat.getRoomIdFromSession = function() {
        if (!this.session.roomId) {
            this.session.roomId = $.url().param("roomId");
        }
        return this.session.roomId;
    };

    /**
     * Get the token from session data.
     *
     * @return {string} token
     */
    EmbeddedChat.getTokenFromSession = function() {
        if (!this.session.token) {
            this.session.token = $.url().param("token");
        }
        return this.session.token;
    };

    /**
     * Determine if the received session data is from the iframe. Relevant only for popup.
     *
     * @return {boolean} receivedFromIframe
     */
    EmbeddedChat.isSessionDataFromIframe = function() {
        return this.session.receivedFromIframe;
    }

    EmbeddedChat.isKeepSessionAliveBeingUsed = function() {
        var hasChannelUuid = !!this.getChannelUuid();
        var isFeatureEnabled = this.keepSessionAliveFeatureEnabled();
        var canPersistSessionData = this.canPersistSessionData();

        return hasChannelUuid && isFeatureEnabled && canPersistSessionData;
    }

    /**
     * Gets the popup window name
     * @return {string} the popup window name
     */
    EmbeddedChat.getPopupWindowName = function() {
        if (!this._popupWindowName) {
            // IE9- does not allow non-alphanumeric-non-underscore-non-dash characters on window name
            this._popupWindowName = (this.POPUP_WINDOW_NAME_PREFIX + '_' + this.getScript()).replace(/[^\w-_]/, '_');
        }
        return this._popupWindowName;
    };

    /**
     * Get the Chat popup position that was sent from the embedded page.
     * Or { left: 10, top: 10 } if not defined.
     *
     * @return {{left: number, top: number }} - {left: xxx, top: yyy}
     */
    EmbeddedChat.getChatPopupPosition = function() {
        if (!this.chatPopupPosition) {
            this.chatPopupPosition = { left: 10, top: 10 };
        }

        return this.chatPopupPosition;
    };

    /**
     * Open the Embedded Chat as a popup.
     */
    EmbeddedChat.openChatPopup = function() {
        var popupWidth = parseInt(EmbeddedChat.windowProperties.width, 10);
        var popupHeight = parseInt(EmbeddedChat.windowProperties.height.open, 10);

        var position = this.getChatPopupPosition();

        var windowSpecs = "width=" + popupWidth + "px" +
                         ",height=" + popupHeight + "px" +
                         ",left=" + position.left + "px" +
                         ",top=" + position.top + "px" +
                         ",menubar=no" +
                         ",resizable=yes" +
                         ",scrollbars=yes" +
                         ",toolbar=no" +
                         ",status=no";

        if (!this.popupWindow || this.popupWindow.closed) {

            this.popupWindow = window.open("", EmbeddedChat.getPopupWindowName(), windowSpecs, true);

            try {
                if (this.popupWindow && this.popupWindow.location.pathname.indexOf("embedded-chat.html") == -1) {
                    var src = this.getEmbeddedChatURL(true);
                    this.popupWindow.location = src;

                } else {
                    EmbeddedChat.log("debug", "Chat Popup already exists - not opening an additional one");
                    // Ping the popup to try to establish the communication
                    this.sendMessageThroughProxy("chat:communication:ping", {restablishing: true});
                }

                // Set the opener as this window
                this.popupWindow.opener = window;

                // Focus the window to bring it to front
                this.popupWindow.focus();

                // Synchronize the chat popout
                this.synchronizeToPopout();
                this.setIsPopupAllowed(true);
            } catch (e) {
                // On IE, if we try to access a popup that was open in another page (or the same page, but after a reload)
                // the browser will trigger a "Permission Denied" error and there isn't anything we can do.
                EmbeddedChat.log("error", "Exception while trying to create the popup");
                this.setIsPopupAllowed(false);
            }

        } else {
            this.popupWindow = window.open("", EmbeddedChat.getPopupWindowName(), windowSpecs, true);

            // Set the opener as this window
            this.popupWindow.opener = window;

            // Ping the popup to try to establish the communication
            this.sendMessageThroughProxy("chat:communication:ping", {restablishing: true});

            // Focus the window to bring it to front
            this.popupWindow.focus();
            this.setIsPopupAllowed(true);
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

    /**
     * Update the popup window reference.
     */
    EmbeddedChat.updatePopupWindowReference = function(tryFocus) {

        this.popupWindow = window.open("", EmbeddedChat.getPopupWindowName());

        // Set the opener as this window
        this.popupWindow.opener = window;

        if (this.popupWindow.location.href == "about:blank") {
            // The chat window location is blank, so there isn't any chat window open,
            // in this case the window should be closed.
            this.popupWindow.close();
            this.popupWindow = null;

        } else {
            if (tryFocus) {
                this.popupWindow.focus();
            }

            // Ping the popup to try to establish the communication
            this.sendMessageThroughProxy("chat:communication:ping", { restablishing: true });
        }
    };

    /**
     * Whether the popup is open.
     *
     * @return true if the popup is open
     */
    EmbeddedChat.isPopupOpen = function() {
        return this.popupWindow && !this.popupWindow.closed;
    };

    /**
     * Get the Embedded Chat URL and add all the required parameters.
     *
     * @param isPopup whether the URL is for a popup
     *
     * @return the URL for the Embedded Chat
     */
    EmbeddedChat.getEmbeddedChatURL = function(isPopup) {
        var domain = window.location.protocol + "//" + window.location.host;
        var channelUuid = EmbeddedChat.getChannelUuid();
        var roomId = EmbeddedChat.session.roomId;
        var token = EmbeddedChat.session.token;
        var src = domain + window.location.pathname +
                      "?uuid=" + encodeURIComponent($.url().param("uuid")) +
                      "&tenant=" + encodeURIComponent($.url().param("tenant")) +
                      "&domain=" + encodeURIComponent(domain) +
                      "&channel=" + encodeURIComponent($.url().param("channel")) +
                      (channelUuid ? "&channelUuid=" + encodeURIComponent(channelUuid) : '') +
                      (roomId ? "&roomId=" + encodeURIComponent(roomId) : '') +
                      (token ? "&token=" + encodeURIComponent(token) : '') +
                      "&referrer=" + encodeURIComponent($.url().param("referrer")) +
                      "&popup=" + encodeURIComponent(isPopup && isPopup.toString() || "false") +
                      "&popuporigin=invitation" +
                      "&startedbychatapi=" + encodeURIComponent(EmbeddedChat.isStartedByChatAPI()) +
                      "&syncrequired=" + encodeURIComponent(isPopup && EmbeddedChat.isWaitSyncRequired().toString() || "false");

        if (this.getStylesheetURL()) {
            src += "&stylesheetURL=" + encodeURIComponent(this.getStylesheetURL());
        }

        return src;
    };

    /**
     * Get the step set in the URL.
     *
     * @return the step set in the URL
     */
    EmbeddedChat.getPopupOrigin = function() {
        if (!this.popupOrigin) {
            this.popupOrigin = $.url().param("popuporigin");
        }
        return this.popupOrigin;
    };

    /**
     * Whether the pop up origin is from a Chat Button.
     * A customer clicked in a Chat Button to open the chat.
     *
     * @return true if the chat came from a Chat Button click
     */
    EmbeddedChat.isOriginFromButton = function() {
        return this.getPopupOrigin() == "button";
    };

    /**
     * Whether the pop up origin is from a Chat Invitation.
     * A customer clicked in a Chat Invitation to open the chat.
     *
     * @return true if the chat came from a Chat Invitation button click
     */
    EmbeddedChat.isOriginFromInvitation = function() {
        return this.getPopupOrigin() == "invitation";
    };

    /**
     * Whether the pop up origin is from a Pre Chat request by Chat API.
     * A customer requested to open Pre Chat by Chat API.
     *
     * @return true if the chat came from a request to open Pre Chat by Chat API
     */
    EmbeddedChat.isOriginFromPreChat = function() {
        return this.getPopupOrigin() == "preChat";
    };

    /**
     * Whether the pop up origin is from a Chat window request by Chat API.
     * A customer requested to open Chat window by Chat API.
     *
     * @return true if the chat came from a request to open Chat window by Chat API
     */
    EmbeddedChat.isOriginFromChatWindow = function() {
        return this.getPopupOrigin() == "chatWindow";
    };

    /**
     * Get the caller IP address.
     *
     * @return the IP address
     */
    EmbeddedChat.getCallerIPAddress = function() {
        return this.callerIPAddress;
    };

    /**
     * Get the receiver domain.
     *
     * @return the receiver domain
     */
    EmbeddedChat.getReceiverDomain = function() {
        if (!this.receiverDomain) {
            this.receiverDomain = $.url().param("domain");
        }

        return this.receiverDomain;
    };

    /**
     * Get the referrer URL.
     *
     * @return the referrer
     */
    EmbeddedChat.getReferrer = function() {
        if (!this.referrer) {
            this.referrer = $.url().param("referrer");
        }

        return this.referrer;
    };

    /**
     * Get the Chat greeting.
     *
     * @return the chat greeting
     */
    EmbeddedChat.getChatGreeting = function() {
        var greeting = this.state.chatWindow.config.greeting;
        return greeting != null ? greeting : i18n.t("chatQueued");
    };

    /**
     * Get the Chat Queue Id.
     *
     * @return the chat queue id
     */
    EmbeddedChat.getChatQueueId = function() {
        return this.state.chatWindow.config.queue;
    };

    /**
     * Get the Chat Social Script Id.
     *
     * @return the chat social script id
     */
    EmbeddedChat.getChatScriptId = function() {
        return this.state.chatWindow.config.script;
    };

    /**
     * Get legacy data to be included to the RTAPI lib when connecting.
     *
     * @return string containing the data
     */
    EmbeddedChat.getLegacyData = function() {
        return this.legacyData;
    };

    /**
    * Get the path for chalet discovery
    *
    * @return string containing the path
    */
    EmbeddedChat.getChaletDiscoveryPath = function() {
        return this.chaletDiscovery;
    };

    /**
     * Handles the action for the skip queue link
     */
    EmbeddedChat.handleSkipQueueAction = function() {
        var skipQueueConfig = this.state.skipQueue.config;

        EmbeddedChat.chatWindow.endChat().done(function() {
            EmbeddedChat.loadFragment(skipQueueConfig).done($.proxy(EmbeddedChat.processUIState, EmbeddedChat));
        }, EmbeddedChat);
    };

    /**
     * Abstract object that the Invitation, Pre-chat, Post-chat, Offline and Chat window extends.
     */
    EmbeddedChat.phase = {};

    /**
     * Initialize the view.
     *
     * @param {HTMLElement} $el jQuery element where the Form content
     * @param {HTMLElement} parent
     */
    EmbeddedChat.phase.init = function($el, parent) {
        this.$el = $el;
        this.parent = parent;

        // Update the templates
        this.$el.find("[data-template]").each(function() {
            var $this = $(this);
            var name = $this.data("template");

            EmbeddedChat.templates[name] = $.proxy(function() {
                var $fragment = this.i18n.translateFragmentResources($($this.html()));
                return $fragment.html();
            }, EmbeddedChat);
        });

        // Modernize view
        this.parent.modernize(this.$el);

        // Configure the close button
        this.$closeButton = this.$el.find(".js-close");
        this.$closeButton.click($.proxy(this.closeClicked, this));

        // Keep references to "confirm" and "cancel" close chat buttons
        this.$confirmCloseButton = this.$el.find("#confirm-close-btn");
        this.$cancelCloseButton = this.$el.find("#cancel-close-btn");

        this.postInit($el);
    };

    /**
     * Set the pop up window title as the same as the phase title.
     *
     * @param $el phase jQuery element
     */
    EmbeddedChat.phase.setTitle = function($el) {
        if (EmbeddedChat.isPopup()) {
            // Set the window title as the phase title
            var phaseTitle = $el.find(".js-window_title").text();
            if (phaseTitle) {
                document.title = phaseTitle;
            }
        }
    };

    /**
     * This function should be overwritten.
     */
    EmbeddedChat.phase.postInit = function() {};

    /**
     * This function should be overwritten.
     */
    EmbeddedChat.phase.resetVisibility = function() {};

    /**
     * Get the default loading spinner configuration.
     *
     * @return the loading spinner configuration object
     */
    EmbeddedChat.phase.getLoadingConfig = function() {
        return {color: "#FFF", shadow: true};
    };

    /**
     * Show the loading indicator.
     */
    EmbeddedChat.phase.showLoading = function() {
        var isNugen = EmbeddedChat.isNugenTemplate();
        if (!this.loading && this.$loading) {
            var config = this.getLoadingConfig(),
                el     = this.$loading.get(0);

            if (el) {
                if (isNugen) {
                    el.classList.add("nugen__loading");
                } else {
                    this.$loading.show();
                    this.loadingSpinner = new Spinner(config).spin(el);
                }
                this.disable();
                this.loading = true;
            }
        }
    };

    /**
     * Hide the loading indicator.
     */
    EmbeddedChat.phase.hideLoading = function() {
        var isNugen = EmbeddedChat.isNugenTemplate();
        var loadingElement = this.$loading;

        if (loadingElement) {
            var el = this.$loading.get(0);

            if (this.loading) {
                if (isNugen) {
                    el.classList.remove("nugen__loading");
                } else {
                    this.$loading && this.$loading.hide();
                    if (this.loadingSpinner) {
                        this.loadingSpinner.stop();
                    }
                }

                this.enable();
                this.loading = false;
            }
        }
    };

    /**
     * Whether the phase is loading.
     *
     * @return true if the phase is loading
     */
    EmbeddedChat.phase.isLoading = function() {
        return this.loading;
    };

    /**
     * Toggle the phase (this function should be overwritten)
     *
     * @param enabled whether the phase should be enabled
     */
    EmbeddedChat.phase.toggle = function(enabled) {};

    /**
     * Set the phase as disabled.
     */
    EmbeddedChat.phase.disable = function() {
        this.toggle(false);
    };

    /**
     * Set the phase as enabled.
     */
    EmbeddedChat.phase.enable = function() {
        this.toggle(true);
    };

    /**
     * Whether the phase is disabled.
     *
     * @return true if the phase is disabled
     */
    EmbeddedChat.phase.isDisabled = function() {
        return this.disabled;
    };

    /**
     * Handle the error event when trying to move to the next step.
     *
     * @param errorMessage The error message
     */
    EmbeddedChat.phase.onError = function(errorMessage) {
        this.close();
    };

    /**
     * Handle any pending tasks before closing the phase (this function can be overwritten)
     *
     * @return jQuery Promise
     */
    EmbeddedChat.phase.onBeforeClose = function() {
        return $.Deferred().resolve().promise();
    };

    /**
     * Check if there is a default termination step, and executes it
     *
     * @return jQuery Promise
     */
    EmbeddedChat.phase.tryDefaultTermination = function(customTrigger) {
        var deferredObject = $.Deferred(),
            hideLoading    = $.proxy(this.hideLoading, this);

        // Request default termination step if the counter has not reached its limit
        if (EmbeddedChat.terminationCounter.count()) {
            this.showLoading();

            EmbeddedChat.requestNextStep({step: "defaultTermination", customTrigger: customTrigger})
              .done($.proxy(function(config) {
                if (this.isButton(config)) {
                    this.configureButton(config);
                    hideLoading();
                    deferredObject.resolve();

                } else {
                    this.state[config.name].config = config;
                    this.loadFragment(config).
                         done($.proxy(this.processUIState, this)).
                         always(hideLoading, deferredObject.reject);
                }
            }, EmbeddedChat))
              .fail(hideLoading, deferredObject.resolve);
        } else {
            deferredObject.resolve();
        }

        return deferredObject.promise();
    };

    /**
     * Close the phase.
     */
    EmbeddedChat.phase.close = function() {
        EmbeddedChat.processUIState(EmbeddedChat.state.close.config);
        EmbeddedChat.resetStartedByChatAPI();
    };

    /**
     * Handle the close button click.
     *
     * @param event click event
     *
     * @return jQuery Promise
     */
    EmbeddedChat.phase.closeClicked = function(event) {
        EmbeddedChat.preventDefault(event);

        return this.closeChat(false);
    };


    /**
     * Function to close chat
     *
     * @return jQuery Promise
     */
    EmbeddedChat.phase.closeChat = function(customTrigger) {
        var promise;

        if (this.parent.isConfiguredAsPopup()) {
            // The Default Termination action is disabled when the chat is configured as a
            // popup.
            promise = this.onBeforeClose().
                        then($.proxy(this.close, this));

        } else {
            promise = this.onBeforeClose().
                        then($.proxy(this.tryDefaultTermination, this, customTrigger)).
                        then($.proxy(this.close, this));
        }

        return promise;
    };

    /**
     * Show an error message.
     *
     * @param message The error message
     */
    EmbeddedChat.phase.showErrorMessage = function(message) {
        this.$errorMessage.text(message).show();
        EmbeddedChat.resetScroll();
    };

    /**
     * Hide the error message.
     */
    EmbeddedChat.phase.hideErrorMessage = function() {
        this.$errorMessage.empty().hide();
    };

    /**
     * Hold the invitation related functions.
     */
    EmbeddedChat.invitation = $.extend({}, EmbeddedChat.phase);

    /**
     * Initialize the Invitation.
     *
     * @param $el jQuery element where the Invitation content
     */
    EmbeddedChat.invitation.postInit = function($el) {
        // Configure the loading indicator
        this.$loading = this.$el.find(".js-invitation-loading");

        // Configure the submit button
        this.$submitButton = this.$el.find(".js-button_label");
        this.$submitButton.click($.proxy(this.submitClicked, this));
    };


    /**
     * Toggle the invitation.
     *
     * @param enabled whether the invitation should be enabled
     */
    EmbeddedChat.invitation.toggle = function(enabled) {
        var $invitation = this.$submitButton,
            disabled    = !enabled;

        $invitation.prop("disabled", disabled);
        this.disabled = disabled;
    };

    /**
     * Submit the invitation.
     *
     * @param event click event
     */
    EmbeddedChat.invitation.submitClicked = function(event) {
        EmbeddedChat.preventDefault(event);

        if (this.parent.isConfiguredAsPopup()) {
            this.parent.openChatPopup();
            this.parent.onChatOpenOnChatPopup();

        } else {
            this.parent.processUINext();
        }
    };

    /**
     * Hold the common functions for the Pre-chat, Post-chat and Offline form.
     */
    EmbeddedChat.form = $.extend({}, EmbeddedChat.phase);

    /**
     * Initialize the Form.
     *
     * @param $el jQuery element where the Form content
     */
    EmbeddedChat.form.postInit = function($el) {
        // Configure the loading indicator
        this.$loading = this.$el.find(".js-form-loading");

        // Configure the form fields
        this.$formFields = this.$el.find("input, textarea, select");

        // Configure the submit button
        this.$submitButton = this.$el.find(".js-submit_button");
        this.$submitButton.click($.proxy(this.submitClicked, this));

        // Configure the error message
        this.$errorMessage = this.$el.find(".js-error-message");

        $(window).resize($.proxy(function() {
            EmbeddedChat.chatWindow.resizeLoading();
        }, this));
    };

    /**
     * Reset the form visibility.
     */
    EmbeddedChat.form.resetVisibility = function() {
        this.$el.find(".main").show();
        this.$el.find(".js-introduction").show();
        this.$el.find(".footer").show();
        this.$el.find(".js-acknowledge-text").hide();
        this.$el.find(".js-error-server-unavailable").hide();
    };

    /**
     * Reset the form values.
     */
    EmbeddedChat.form.resetForm = function() {
        // Find all the elements to iterate on each one
        var $dataElements = this.$el.find("[name]");

        $dataElements.each(function(index, el) {
            var $el = $(el);

            if ($el.attr("type") == "radio") {
                $el.attr("checked", false);

            } else {
                $el.val("");
            }
        });
    };

    /**
     * Toggle the form.
     *
     * @param enabled whether the form should be enabled
     */
    EmbeddedChat.form.toggle = function(enabled) {
        var $form    = this.$formFields.add(this.$submitButton),
            disabled = !enabled;

        $form.prop("disabled", disabled);
        this.disabled = disabled;
    };

    /**
     * Close the form.
     */
    EmbeddedChat.form.close = function() {
        this.resetVisibility();
        this.resetForm();
        EmbeddedChat.processUIState(EmbeddedChat.state.close.config);
    };

    /**
     * Submit the form data.
     *
     * @param event click event
     */
    EmbeddedChat.form.submitClicked = function(event) {
        EmbeddedChat.preventDefault(event);

        var formData    = this.retrieveData(),
            hideLoading = $.proxy(this.hideLoading, this);

        if (formData && formData.length) {
            this.showLoading();

            this.validateFormData(formData).

            done($.proxy(function() {
                this.submit(formData).always(hideLoading);
            }, this)).

            fail(hideLoading);

        } else {
            this.submit([]).always(hideLoading);
        }
    };

    /**
     * This function should be overwrite.
     */
    EmbeddedChat.form.submit = function() {};

    /**
     * Retrieve the data from the form.
     *
     * data: {
     *     $el: <jQuery element>,
     *     required: <whether it is required>,
     *     crmField: <the crm field>,
     *     question: <question text>,
     *     answers: <answer text>
     * }
     *
     * @return an array of data
     */
    EmbeddedChat.form.retrieveData = function() {
        // Hold the data retrieved from the form
        var formData = [];

        // Hold the name of the fields already retrieved. This is used to prevent
        // retrieving the radio button data more than once.
        var alreadyRetrieved = {};

        if (this.$el) {
            // Find all the elements to iterate on each one
            var $dataElements = this.$el.find("[name]");

            $dataElements.each($.proxy(function(index, el) {
                var $el = $(el);
                var data = {};
                var name = $el.attr("name");

                if (!alreadyRetrieved[name]) {
                    data.$el = $el;
                    data.required = !!$el.data("required");
                    data.crmField = $el.data("essential");
                    data.identifier = $el.data("identifier");
                    data.languageField = $el.data("language");

                    if ($el.attr("type") == "radio") {
                        // Get the radio button that is checked
                        var $checked = this.$el.find("[name='" + name + "']:checked");

                        data.question = this.$el.find("[for='" + $el.attr("name") + "']").text();
                        data.answer = this.$el.find("[for='" + $checked.attr("id") + "']").text();

                    } else {
                        data.question = this.$el.find("[for='" + $el.attr("id") + "']").text();
                        data.answer = $.trim($el.val());

                        if (!data.identifier && !data.languageField) {
                            var sanitizedIdentifier = EmbeddedChat.Sanitize.removeDiacritics(data.question)
                                .trim()
                                .toLowerCase()
                                .replace(/['!¡@#$%¨&*()?¿:\[\]<>\/\\{}|~´`^]/g, '')
                                .replace(/\s+/g, '-')
                                .replace(/-+/g, '-');

                            data.identifier = sanitizedIdentifier;
                        }
                    }

                    alreadyRetrieved[name] = true;

                    formData.push(data);
                }

            }, this));
        }

        return formData;
    };

    /**
     * Validate the form data checking for required fields and also showing the error message.
     *
     * @param formData array of data to validated
     *
     * @return jQuery Promise
     */
    EmbeddedChat.form.validateFormData = function(formData) {
        this.clearErrors();

        var deferredObject = $.Deferred();

        if (this.checkRequiredError(formData, i18n.t("errorRequiredMessage"))) {
            EmbeddedChat.resetScroll();

            deferredObject.reject();

        } else {
            this.checkCRMFieldError(formData, deferredObject);
        }

        return deferredObject.promise();
    };

    /**
     * Check for errors in the required fields.
     *
     * This function will also set the field as erroneous.
     *
     * @param formData array of data to validated
     */
    EmbeddedChat.form.checkRequiredError = function(formData, message) {
        var hasError = false;

        _.each(formData, function(element, index, list) {
            if (element.required && element.answer === "") {
                this.setError(element.$el, message);
                hasError = true;
            }
        }, this);

        return hasError;
    };

    /**
     * Validate case and customer number.
     *
     * @param value value to validated
     *
     * @return true if the value is a number
     */
    EmbeddedChat.form.isNumberValid = function(value) {
        return ! /^[0-9]*$/.test(value);
    };

    /**
     * Validate email.
     *
     * @param value the email to be validated
     *
     * @return true if the value is an email
     */
    EmbeddedChat.form.isEmailValid = function(value) {
        // The following pattern is used to check if the entered e-mail address fits the user@domain
        // format. It also is used to separate the username from the domain.
        var emailPat = /^(.+)@(.+)$/;

        /* The following string represents the pattern for matching all special characters. We don't
        want to allow special characters in the address. These characters include ()<>@,;:\".[] */
        var specialChars = "\\(\\)><@,;:\\\\\\\"\\.\\[\\]";

        /* The following string represents the range of characters allowed in a username or
        domainname. It really states which chars aren't allowed.*/
        var validChars = "\[^\\s" + specialChars + "\]";

        /* The following pattern applies if the "user" is a quoted string (in which case, there are
        no rules about which characters are allowed and which aren't; anything goes).
        E.g. "ruslan ulanov"@wpj.com is a legal e-mail address. */
        var quotedUser = "(\"[^\"]*\")";

        /* The following pattern applies for domains that are IP addresses, rather than symbolic
        names. E.g. joe@[123.124.233.4] is a legal e-mail address.
        NOTE: The square brackets are required. */
        var ipDomainPat = /^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;

        /* The following string represents an atom (basically a series of non-special characters.) */
        var atom = validChars + "+";

        /* The following string represents one word in the typical username. For example,
        in john.doe@somewhere.com, john and doe are words. Basically, a word is either an atom or
        quoted string. */
        var word = "(" + atom + "|" + quotedUser + ")";

        // The following pattern describes the structure of the user
        var userPat = new RegExp("^" + word + "(\\." + word + ")*$");

        /* The following pattern describes the structure of a normal symbolic domain, as opposed to
        ipDomainPat, shown above. */
        var domainPat = new RegExp("^" + atom + "(\\." + atom +")*$");

        /* Finally, let's start trying to figure out if the supplied address is valid. */

        /* Begin with the coarse pattern to simply break up user@domain into different pieces that
        are easy to analyze. */
        var matchArray = value.match(emailPat);

        if (matchArray == null) {
            /* Too many/few @'s or something; basically, this address doesn't even fit the general
            pattern of a valid e-mail address. */
            return true;
        }
        var user = matchArray[1];
        var domain = matchArray[2];

        // Start by checking that only basic ASCII characters are in the strings (0-127).
        for (i = 0; i < user.length; i++) {
            if (user.charCodeAt(i) > 127) {
                return true;
            }
        }
        for (i = 0; i < domain.length; i++) {
            if (domain.charCodeAt(i) > 127) {
                return true;
            }
        }

        // See if "user" is valid
        if (user.match(userPat) == null) {
            // user is not valid
            return true;
        }

        /* if the e-mail address is at an IP address (as opposed to a symbolic host name) make sure
        the IP address is valid. */
        var IPArray = domain.match(ipDomainPat);
        if (IPArray != null) {
            // this is an IP address
            for (i = 1; i <= 4; i++) {
                if (IPArray[i] > 255) {
                    return true;
                }
            }
        } else {
            // Domain is symbolic name.  Check if it's valid.
            var atomPat = new RegExp("^" + atom + "$");
            var domArr = domain.split(".");
            var len = domArr.length;
            for (i = 0; i < len; i++) {
                if (domArr[i].search(atomPat) == -1) {
                    return true;
                }
            }

            // Validate the top-level domain verifying if it has at least two characters
            var tld = domArr[len-1];
            if (tld.length < 2) {
                return true;
            }

            // Make sure there's a host name preceding the domain.
            if (len < 2) {
                return true;
            }
        }

        return false;
    };

    /**
     * Set the field as erroneous.
     *
     * @param {HTMLElement} $el the element to set as erroneous
     * @param {string} message
     */
    EmbeddedChat.form.setError = function($el, message) {

        var $element = $($el);
        var elementId = $element.attr("name");
        var errorMessage =  $(".js-field-error-message-" + elementId);

        // Set Accessibility error indicators
        if (errorMessage[0]) {
            $element.attr("aria-describedby", errorMessage[0].id);
            errorMessage.append("<span>" + message + "</span>").show();
        } else {
            // keep old mechanism for old chat designs
            $element.attr("aria-describedby", this.$errorMessage[0].id);
            this.showErrorMessage(message);
        }
        $element.attr("aria-invalid", true);

        // Show field label with error image
        $(".js-error-image-" + elementId).css("display", "inline-block");
    };

    /**
     * Show a message when the server is unavailable.
     */
    EmbeddedChat.form.showMessageServerUnavailable = function() {
        this.$el.find(".main").hide();
        this.$el.find(".footer").hide();
        this.$el.find(".js-error-server-unavailable").show();
        this.$el.find(".js-error-server-unavailable").attr('role', 'alert');
    };

    /**
     * Show the acknowledge text when it exists, or proceed to the next UI.
     *
     * @return jQuery Promise
     */
    EmbeddedChat.form.showAcknowledgeText = function() {
        var acknowledgeText = $.trim($(".js-acknowledge-text").text()),
            deferredObject  = $.Deferred();

        if (acknowledgeText.length != 0) {
            this.$el.find(".main:visible").hide();
            this.$el.find(".js-introduction:visible").hide();
            this.$el.find(".footer").hide();
            this.$el.find(".js-acknowledge-text").show();
            this.$el.find(".js-acknowledge-text").attr('role', 'alert');
            deferredObject.resolve();

        } else {
            deferredObject.reject();
        }

        return deferredObject.promise();
    };

    /**
     * Clear any error and hide the error message.
     */
    EmbeddedChat.form.clearErrors = function() {
        this.hideErrorMessage();

        // Clear text and text area fields border
        var $dataElements = this.$el.find("[name]");
        $.each($dataElements, function(index, el){
            var $element = $(el);

            // Remove Accessibility error indicators
            $element.removeAttr("aria-describedby");
            $element.removeAttr("aria-invalid");

            var elementId = $element.attr("name");
            $(".js-field-error-message-" + elementId).empty().hide();

            $(".js-error-image-" + elementId).css("display", "none");
        });
    };

    /**
     * Whether there is form data available for the next UI phase.
     *
     * @return true if there is data available
     */
    EmbeddedChat.form.hasData = function() {
        return !!this.formData;
    };

    /**
     * Get the form data.
     *
     * @return form data
     */
    EmbeddedChat.form.getFormData = function() {
        return this.formData;
    };

    /**
     * Hold the preChat related functions.
     */
    EmbeddedChat.preChat = $.extend({}, EmbeddedChat.form);

    /**
     * Submit the form data.
     *
     * @param formData array of data to submit
     *
     * @return jQuery promise object
     */
    EmbeddedChat.preChat.submit = function(formData) {
        // Make the data available for the Chat Window
        this.formData = formData;

        var languageField = this.getLanguageField(formData);

        // Set the current language
        if (languageField) {
            i18n.setCustomerLanguage(languageField.answer);
        }

        // Go to the next UI state
        return EmbeddedChat.processUINext();
    };

    /**
     * Get the CRM field.
     *
     * @param formData the array of data to get the CRM field
     *
     * @return the CRM field
     */
    EmbeddedChat.preChat.getCRMField = function(formData) {
        return _.find(formData, function(element) {
            return !!element.crmField;
        });
    };

    /**
     * Get the Language field.
     *
     * @param formData the array of data to get the Language field
     *
     * @return the language field
     */
    EmbeddedChat.preChat.getLanguageField = function(formData) {
        return _.find(formData, function(element) {
            return !!element.languageField;
        });
    };

    /**
     * Get the list of extra fields.
     *
     * @param formData the array of data to get the fields
     *
     * @return the extra field
     */
    EmbeddedChat.preChat.getExtraFields = function(formData) {
        return _.filter(formData, function(element) {
            return !element.crmField && !element.languageField;
        });
    };

    /**
     * Handle the error event when trying to move to the next step.
     */
    EmbeddedChat.preChat.onError = function(errorMessage) {
        this.showErrorMessage(i18n.t("errorGenericMessage"));
    };


    /**
     * Handles what language to use in a pre-chat
     */
    EmbeddedChat.preChat.resolveCustomerLanguage = function(languageField) {
        var isLanguageFieldFilled = (languageField && languageField.answer != null);
	return isLanguageFieldFilled ? languageField.answer : EmbeddedChat.i18n.getCustomerLanguage();
    };

     /**
     * Request the CRM field validation
     *
     * @param config object containing the CRM field and the language Field
     * @param deferredObject jQuery Deferred object
     */
    EmbeddedChat.preChat.sendPromptCRMField = function(config, deferredObject) {
        var url = "../../../CHAT/chat_get_legacy_info.php";

        var data = {
            channel : EmbeddedChat.getChannel(),
            tenant : EmbeddedChat.getTenantBase64(),
            field : config.crmField.crmField,
            value : config.crmField.answer
        };

        var language = this.resolveCustomerLanguage(config.languageField);
        if (language) {
            data["customerlanguage"] = language;
        }

        $.get(url, data).

        done($.proxy(function(data, textStatus, jqXHR) {
            if (this.parent.responseHasError(data)) {
                // Internal server error
                this.showMessageServerUnavailable();

            } else if (data.response.status == 0) {
                if (!data.response.data.prompt) {
                    this.setError(config.crmField.$el, i18n.t("errorCrmFieldInvalidMessage"));
                    EmbeddedChat.resetScroll();

                    deferredObject.reject();
                } else {
                    EmbeddedChat.legacyData = data.response.data.prompt;
                    deferredObject.resolve();
                }
            } else if (data.response.status == 2) {
                this.setError(config.crmField.$el, i18n.t("errorCrmFieldInvalidMessage"));
                EmbeddedChat.resetScroll();

                deferredObject.reject();
            }
        }, this)).

        fail($.proxy(function(jqXHR, textStatus, errorThrown) {
            // Show error view
            this.showMessageServerUnavailable();
            deferredObject.reject();
        }, this));
    };

    /**
     * Check for errors in the CRM field.
     *
     * @param formData array of data to validated
     * @param deferredObject jQuery Deferred object
     */
    EmbeddedChat.preChat.checkCRMFieldError = function(formData, deferredObject) {
        var field = this.getCRMField(formData);
        var language = this.getLanguageField(formData);

        if (field && field.crmField && (field.required || field.answer)) {
            if (field.crmField == "ticket_id" || field.crmField == "customer_id") {
                if (this.isNumberValid(field.answer)) {
                    this.setError(field.$el, i18n.t("errorInvalidNumber"));
                    EmbeddedChat.resetScroll();

                    deferredObject.reject();
                } else {
                    this.sendPromptCRMField({ crmField: field, languageField: language }, deferredObject);
                }
            } else if (field.crmField == "email_id") {
                if (this.isEmailValid(field.answer)) {
                    this.setError(field.$el, i18n.t("errorInvalidEmail"));
                    EmbeddedChat.resetScroll();

                    deferredObject.reject();
                } else {
                    this.sendPromptCRMField({ crmField: field, languageField: language }, deferredObject);
                }
            } else {
                this.sendPromptCRMField({ crmField: field, languageField: language }, deferredObject);
            }

        } else {
            var customerLanguage = this.resolveCustomerLanguage(language);

            this.parent.createLegacyData(customerLanguage);
            deferredObject.resolve();
        }
    };

    /**
     * Hold the postChat related functions.
     */
    EmbeddedChat.postChat = $.extend({}, EmbeddedChat.form);

    /**
     * Submit the form data.
     *
     * @param formData array of data to submit
     *
     * @return jQuery promise object
     */
    EmbeddedChat.postChat.submit = function(formData) {
        return $.Deferred().resolve().promise();
    };

    /**
     * Check for errors in the CRM field.
     *
     * @param formData array of data to validated
     * @param deferredObject jQuery Deferred object
     */
    EmbeddedChat.postChat.checkCRMFieldError = function(formData, deferredObject) {
        deferredObject.resolve();
    };

    /**
     * Hold the offline related functions.
     */
    EmbeddedChat.offChat = $.extend({}, EmbeddedChat.form);

    /**
     * Submit the form data.
     *
     * @param formData array of data to submit
     *
     * @return jQuery promise object
     */
    EmbeddedChat.offChat.submit = function(formData) {
        // Make the data available for variables
        this.formData = formData;

        var crmFields = this.getCRMFields(formData);
        var otherFields = this.getOtherFields(formData);
        var preChatFields = [];
        if (EmbeddedChat.preChat.hasData()) {
            // This means that a PreChat form was filled but the data was never send to the server
            // by a ChatWindow, so we should send it here.
            preChatFields = this.getPreChatFields(EmbeddedChat.preChat.getFormData());
        }

        var message = this.getEmailMessage(crmFields, otherFields, preChatFields, EmbeddedChat.customer.getInfoForEmail());

        var data = {
            stepID: EmbeddedChat.offChat.getStepID(),
            scriptID: EmbeddedChat.getScript(),
            from: crmFields.emailAddress && crmFields.emailAddress.answer || "",
            subject: this.getSubject(crmFields) || EmbeddedChat.i18n.t("emptySubject") || "[ Customer message ] No subject",
            message: message,
            tenant: EmbeddedChat.getTenant()
        };

        var url = "../../../CHAT/send_email.php";

        var deferredObject = $.Deferred();

        $.post(url, data)

            .done($.proxy(function(data) {
                if (this.parent.responseHasError(data)) {
                    this.showMessageServerUnavailable();
                    deferredObject.resolve();

                } else if (data.response.status == 0) {
                    this.showAcknowledgeText().
                        fail($.proxy(this.close, this)).
                        always(deferredObject.resolve);
                }
            }, this))

            .fail($.proxy(function() {
                // Show error view
                this.showMessageServerUnavailable();
                deferredObject.reject();
            }, this));

        EmbeddedChat.customer.notifyInfoSent();

        return deferredObject.promise();
    };

    /**
     * Get the subject to be added to the email.
     *
     * @param crmFields crmField to get the field
     *
     * @return a string containing the subject
     */
    EmbeddedChat.offChat.getSubject = function(crmFields) {
        return crmFields.emailSubject && crmFields.emailSubject.answer || "";
    };

    EmbeddedChat.offChat.getStepID = function() {
        return EmbeddedChat.state.offChat.config.stepID;
    };

    /**
     * Check for errors in the CRM field.
     *
     * @param formData array of data to validated
     * @param deferredObject jQuery Deferred object
     */
    EmbeddedChat.offChat.checkCRMFieldError = function(formData, deferredObject) {
        var crmFields = this.getCRMFields(formData);
        var field = crmFields.emailAddress;

        if (field && field.crmField) {
            if (this.isEmailValid(field.answer)) {
                this.setError(field.$el, i18n.t("errorInvalidEmail"));
                EmbeddedChat.resetScroll();

                deferredObject.reject();
            } else {
                deferredObject.resolve();
            }
        } else {
            deferredObject.resolve();
        }

    };

    /**
     * Get the CRM Fields from the form Data.
     *
     * @param formData array of data to filter
     * @return an object containing the emailAddress, emailSubject and emailBody
     */
    EmbeddedChat.offChat.getCRMFields = function(formData) {

        var crmFields = {};

        crmFields.emailAddress = _.find(formData, function(element) {
            return element.crmField == "email_address";
        });

        crmFields.emailSubject = _.find(formData, function(element) {
            return element.crmField == "email_subject";
        });

        crmFields.emailBody = _.find(formData, function(element) {
            return element.crmField == "email_body";
        });

        return crmFields;
    };

    /**
     * Get the fields that are not CRM fields.
     *
     * @param formData array of data to filter
     *
     * @return a filtered list containing the non-CRM fields
     */
    EmbeddedChat.offChat.getOtherFields = function(formData) {
        return _.filter(formData, function(element) {
            return !element.crmField;
        });
    };

    /**
     * Get the fields from the Pre Chat that should be send in this
     * form.
     *
     * @param formData the formData to retrieve the fields
     *
     * @return an array of fields
     */
    EmbeddedChat.offChat.getPreChatFields = function(formData) {
        return formData;
    };

    /**
     * Get the email message.
     *
     * @param crmFields the CRM Fields to get the email message
     * @param otherFields the additional fields to add to the email message
     * @param preChatFields the pre-chat fields to be added
     * @param customerInfo the customer info to be added
     *
     * @return the message to be added to the email
     */
    EmbeddedChat.offChat.getEmailMessage = function(crmFields, otherFields, preChatFields, customerInfo) {

        var message = "\n\n";

        if  (crmFields.emailBody) {
            message +=  crmFields.emailBody.answer;
        }

        message += this.formatEmailMessage(otherFields, preChatFields, customerInfo);

        return message;
    };

    /**
     * Format the email message to be sent.
     *
     * @param otherFields the fields to include in the message
     * @param preChatFields the pre-chat fields to include in the message
     * @param customerInfo the customer info to include in the message
     *
     * @return a string
     */
    EmbeddedChat.offChat.formatEmailMessage = function(otherFields, preChatFields, customerInfo) {
        var message = "",
            hasPreChatFields = preChatFields && preChatFields.length,
            hasOtherFields   = otherFields && otherFields.length,
            hasCustomerInfo  = customerInfo && customerInfo.length;

        if (hasPreChatFields) {
            message += "\n\n" +
                       "======== " + i18n.t("preChatFormData") + " ========\n" +
                       this.formFieldsForEmailMessage(preChatFields) + "\n";
        }

        if (hasOtherFields || hasCustomerInfo) {
            message += "\n\n" +
                       "======== " + i18n.t("offChatFormData") + " ========\n";

            if (hasOtherFields) {
                message += this.formFieldsForEmailMessage(otherFields) + "\n";
            }

            if (hasOtherFields && hasCustomerInfo) {
                message += "\n";
            }

            if (hasCustomerInfo) {
                message += this.formFieldsForEmailMessage(customerInfo) + "\n";
            }
        }

        return message;
    };

    /**
     * Format the fields in order to be included in the email message.
     *
     * @param fields list of fields to add to the message
     *
     * @return the message
     */
    EmbeddedChat.offChat.formFieldsForEmailMessage = function(fields) {
        var message = "";

        _.each(fields, function(element, index, list) {
            if (element.languageField) {
                element.answer = element.answer.toUpperCase();
            }

            message += element.question + "\n" +
                       "    " + element.answer + "\n\n";
        });

        return message;
    };

    /**
     * Hold the skip queue related functions.
     */
    EmbeddedChat.skipQueue = $.extend({}, EmbeddedChat.offChat);

    /**
     * Format the email message to be sent.
     *
     * @param otherFields the fields to include in the message
     * @param preChatFields the pre-chat fields to include in the message
     * @param customerInfo the customer info to include in the message
     *
     * @return a string
     */
    EmbeddedChat.skipQueue.formatEmailMessage = function(otherFields, preChatFields, customerInfo) {
        var message = "",
            hasPreChatFields = preChatFields && preChatFields.length,
            hasOtherFields   = otherFields && otherFields.length,
            hasCustomerInfo  = customerInfo && customerInfo.length;

        if (hasPreChatFields) {
            message += "\n\n" +
                       "======== " + i18n.t("preChatFormData") + " ========\n" +
                       this.formFieldsForEmailMessage(preChatFields) + "\n";
        }

        if (hasOtherFields || hasCustomerInfo) {
            message += "\n\n" +
                       "======== " + i18n.t("skipQueueFormData") + " ========\n";

            if (hasOtherFields) {
                message += this.formFieldsForEmailMessage(otherFields) + "\n";
            }

            if (hasOtherFields && hasCustomerInfo) {
                message += "\n";
            }

            if (hasCustomerInfo) {
                message += this.formFieldsForEmailMessage(customerInfo) + "\n";
            }
        }

        return message;
    };

    /**
     * Whether the skip queue stats exists.
     *
     * @return true if the skip queue state is available
     */
    EmbeddedChat.skipQueue.hasState = function() {
        var skipQueueConfig = EmbeddedChat.state.skipQueue.config;
        return skipQueueConfig && skipQueueConfig.uuid;
    };

    /**
     * Get the subject to be added to the email.
     *
     * @param crmFields object to get the subject
     *
     * @return a string containing the subjet
     */
    EmbeddedChat.skipQueue.getSubject = function(crmFields) {
        var subject = EmbeddedChat.state.skipQueue.config.forcedEmail || "";

        if (crmFields.emailSubject) {
            subject += " " + crmFields.emailSubject.answer;
        }

        return subject;
    };

    /**
     * Hold the Chat related functions.
     */
    EmbeddedChat.chatWindow = $.extend({}, EmbeddedChat.phase);

    /**
     * Start the Chat.
     */
    EmbeddedChat.chatWindow.start = function() {
      root.chaletAdapter
        .setOnReceiveIncomingMessage(this.onAgentMessageReceived.bind(this))
        .setOnChaletChatTypingCallback(this.chatTypingHandler.bind(this))
        .setOnInteractionScripting(this.onInteractionScripting.bind(this))
        .setOnInteractionQueued(this.onInteractionQueued.bind(this))
        .setOnInteractionAccepted(this.onInteractionAccepted.bind(this))
        .setOnInteractionDeleted(this.onInteractionDeleted.bind(this, false))
        .setOnReceiveCoBrowsingMessage(this.onCoBrowsingMessageReceived.bind(this))
        .setKeepSessionAlive(EmbeddedChat.keepSessionAliveFeatureEnabled())
        .setChannelUuid(EmbeddedChat.getChannelUuid())
        .setCleanupSessionDataAfterHardDelete(() => EmbeddedChat.clearSessionKeyFromLocalStorage().bind(this))
        .setHelperLogFunction(EmbeddedChat.log);

      var channelUuid = EmbeddedChat.getChannelUuid();
      var sessionExists = EmbeddedChat.session.exists;
      var sessionAliveTtl = EmbeddedChat.sessionAliveTTLValue();

      // Configure the loading indicator
      this.$loading = this.$el.find(".js-message-loading");
      this.resizeLoading();

      if (!sessionExists) {
        var tenant = EmbeddedChat.getTenant();
        // check if ksa feature is enabled AND can persist session data
        var canUseKeepSessionAlive = EmbeddedChat.canUseKeepSessionAlive();
        var payload = {
          idleCustomerEnabled: canUseKeepSessionAlive,
          idleConversationTtl: sessionAliveTtl
        };

        EmbeddedChat.createSession(tenant, channelUuid, payload)
          .done(function() {
            this.startChaletChatWithLoading();
          }.bind(this));
      } else {
        // we proceed with the chat window since we already got the session data before invitation
        this.startChaletChat();
        this.enable();
      }

      EmbeddedChat.setupChatWindow();

      $('.js-translation-header').hide();
      $('.js-language-label').text("");
    };


    EmbeddedChat.chatWindow.fetchRetry = function(input, init, retries, delay) {
        return fetch(input, init)
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("HTTP status " + response.status);
            })
            .catch(function() {
                var pause = function(duration) {
                    return new Promise(function(res) {
                        setTimeout(res, duration)
                    });
                }
                return retries > 1
                    ? pause(delay).then(
                        function() {
                            return EmbeddedChat.chatWindow.fetchRetry(input, init, retries - 1, delay * 2)
                        }
                    )
                    : Promise.reject(error);
            });
    };

    EmbeddedChat.chatWindow.startChaletChatWithLoading = function () {
      this.startChaletChat();

      // Configure the loading indicator
      this.$loading = this.$el.find(".js-message-loading");
      this.resizeLoading();

      // Set the chat as loading while it is added to the queue
      this.showLoading();
    }

    EmbeddedChat.chatWindow.startChaletChat = function() {
        this.loadInteractionData();
        var queueId = EmbeddedChat.getChatQueueId();
        var scriptId = EmbeddedChat.getChatScriptId();
        var legacyData = EmbeddedChat.getLegacyData();

        var canStartChat = !!(queueId || scriptId);
        if (!canStartChat) {
            EmbeddedChat.log("error", "Can't start chat - missing one of chat queue id or social script id");
            return;
        }
        if (!legacyData) {
            EmbeddedChat.log("error", "Can't start chat - missing legacy data");
            return;
        }

        legacyData = legacyData.split(EmbeddedChat.separator).map(function (el) {
            return el.split("=");
        }).reduce(function (acumulator, element) {
            acumulator[element[0]] = element[1];
            return acumulator
        }, {});

        if (this.extraChatInfo) {
            legacyData.extTransactionData = this.extraChatInfo;
            legacyData.extTransactionDataID = this.extraChatInfoID;
        }

        legacyData.ipaddress = EmbeddedChat.getCallerIPAddress();
        legacyData.timezoneOffset = (new Date()).getTimezoneOffset();

        root.chaletAdapter.setInteractionDetails({
            tenantId: EmbeddedChat.getTenant(),
            queueId: queueId,
            scriptId: scriptId,
            legacyData: legacyData,
            preChatFormData: this.preChatFormDataArray,
            customChatInfo: this.customChatInfo
        });

        this.initialMessageDisplayed = false;

        var sessionExists = EmbeddedChat.session.exists;

        // we use the token and roomId from session endpoint instead of calling getGuestToken.php
        if (sessionExists) {
            var roomId = EmbeddedChat.session.roomId;
            var token = EmbeddedChat.session.token;

            EmbeddedChat.chatWindow.setChaletToken({ roomId, token });
        }
    };

    EmbeddedChat.chatWindow.setChaletToken = function (data) {
        if (data && data["token"] && data["roomId"]) {
            return root.chaletAdapter.setChaletToken(data["token"], data["roomId"]);
        }

        return Promise.reject("Missing token on response");
    };

    /**
     * Resize the loading indication.
     */
    EmbeddedChat.chatWindow.resizeLoading = function () {
        if (this.$loading) {
            this.$loading.width(this.$loading.parent().width());
        }
    };


    EmbeddedChat.getChaletConfig = function () {
        var chaletConfig = ChatConfig.chaletConfig || {};
        chaletConfig.tenantId =  EmbeddedChat.getTenant();
        chaletConfig.channelName = EmbeddedChat.getChannel();
        chaletConfig.queueId = EmbeddedChat.getChatQueueId();

        return chaletConfig;
    }

    /**
     * Replace old chat with react
     * @param {*} $el jquery chat window template
     * @returns a promise
     */
    EmbeddedChat.chatWindow.setupReactApp = function ($el) {
        var deferredObject = $.Deferred();
        var oldMessageBox = $el.find('.message-box');

        var successLoadGuestChatMFE = function (response) {
            var container = document.createElement('div');
            container.classList.add('message-box')

            var chatDesignData = ChatConfig.chatDesignData || {};
            var chaletConfig =  EmbeddedChat.getChaletConfig();
            var isNugen = EmbeddedChat.isNugenTemplate();
            var mfeRegistryConfig = ChatConfig.MFERegistryService;

            response.guestChatApp.start({
                rootContainer: container,
                chatDesignData: chatDesignData,
                chaletConfig: chaletConfig,
                mfeRegistryConfig: mfeRegistryConfig,
                maxLengthInputForm: CONFIG.MAX_CHAT_MSG_LENGTH,
                chaletAdapter: window.chaletAdapter,
                embeddedChat: EmbeddedChat,
                appInfo: response.appInfo,
                bugsnag: root.Bugsnag,
                templateVersion: isNugen ? 'Nugen' : 'Classic',
                chatAlign: EmbeddedChat.getChatAlign(),
                features: {
                    isAttachmentEnabled: EmbeddedChat.isAttachmentFeatureEnabled(),
                    isKeepSessionAliveEnabled: EmbeddedChat.canUseKeepSessionAlive(),
                    sessionAliveTTLValue: EmbeddedChat.sessionAliveTTLValue(),
                    isResizeButtonEnabled: true,
                },

            }).then(function(){
                oldMessageBox.hide();
                oldMessageBox.after(container)
                oldMessageBox.remove();
                deferredObject.resolve();
            })
        }
        var config = Object.assign({}, ChatConfig);
        var guestChatBuildVersion = EmbeddedChat.getGuestChatBuildVersion();
        if (guestChatBuildVersion){
            config.guestChatBuildVersion = guestChatBuildVersion;
        }

        loadGuestChatApp(config)
          .then(successLoadGuestChatMFE)
          .catch(deferredObject.reject);

        return deferredObject.promise()

    }

    /**
     * Initialize the Chat.
     */
    EmbeddedChat.chatWindow.postInit = function ($el) {
        // Get the chat log container
        this.$chatLog = $(".js-message-content");
        this.$chatLog.empty();

        // Configure the beforeunload event
        $(window).on("beforeunload", $.proxy(this.onBeforeUnloadHandler, this));

        // Configure the unload event
        $(window).on("unload", $.proxy(this.onUnloadHandler, this));

        // Configure the enter key on input field
        this.$messageField = $("#message-field");

        // Keep a reference to the message actions toggle button
        this.$flagButton = this.$el.find(".js-flag");

        // Configure the save button
        this.$saveButton = this.$el.find(".js-save-action");
        this.$saveButton.click($.proxy(this.saveClicked, this));

        // Configure the clear button
        this.$clearButton = this.$el.find(".js-clear-action");
        this.$clearButton.click($.proxy(this.clearClicked, this));

        // Configure the co-browsing button
        this.$coBrowsingButton = this.$el.find(".js-co-browsing-action");
        this.$coBrowsingButton.click($.proxy(this.coBrowsingClicked, this));
        this.updateCoBrowsingButton();

        // Configure the send button
        $('#send-message-button').on("click", $.proxy(this.submitClicked, this))
    };

    /**
     * Handle the close button click.
     *
     * @param event click event
     *
     * @return jQuery Promise
     */
    EmbeddedChat.chatWindow.onBeforeClose = function() {
        return this.endChat();
    };

    /**
     * Called when the submit button is clicked.
     *
     * @param event the click event
     */
    EmbeddedChat.chatWindow.submitClicked = function(event) {
        EmbeddedChat.preventDefault(event);

        var message = this.$messageField.val().replace(/(^\s*)|(\s*$)/g, '');
        // This appends the message directly to dom, so let's sanitize it
        message = root.chaletAdapter.formatMessage(message);

        if (message.length > 0) {
            this.onCustomerMessageReceived({ message: message });
        }

        this.$messageField.val("");
        this.$messageField.focus();
    };

    /**
     * Called when the save button is clicked.
     *
     * @param event the click event
     */
    EmbeddedChat.chatWindow.saveClicked = function(event) {
        EmbeddedChat.preventDefault(event);

        window.open("../html/chat-log.html");
        this.$flagButton.click();
    };

    /**
     * Get the chat log.
     *
     * @return jQuery object containing every chat message
     */
    EmbeddedChat.chatWindow.getLog = function() {
        return $(".js-message-content");
    };

    /**
     * Get the chat log in HTML format.
     *
     * @return HTML string containing every chat message
     */
    EmbeddedChat.chatWindow.getHtmlLog = function() {
        return this.getLog().html();
    };

    /**
     * Called when the clear button is clicked.
     *
     * @param event the click event
     */
    EmbeddedChat.chatWindow.clearClicked = function(event) {
        EmbeddedChat.preventDefault(event);

        this.clearChatLog();
        this.$flagButton.click();
    };

    /**
     * Called when the co-browsing button is clicked.
     *
     * @param event the click event
     */
    EmbeddedChat.chatWindow.coBrowsingClicked = function(event) {
        EmbeddedChat.preventDefault(event);

        var topic = EmbeddedChat.coBrowsing.hasSession() ? "co-browsing:end" : "co-browsing:start";
        EmbeddedChat.sendMessage(topic);

        this.$flagButton.click();
    };

    /**
     * Update the co-browsing button depending on the current session.
     */
    EmbeddedChat.chatWindow.updateCoBrowsingButton = function() {
        if (this.$coBrowsingButton) {
            var uuid = (this.state && this.state.chatWindow && this.state.chatWindow.config) && this.state.chatWindow.config.uuid;
            var isNugenTemplate = EmbeddedChat.isNugenTemplate(uuid);
            var key;
            var hasSession = EmbeddedChat.coBrowsing.hasSession();
            this.$coBrowsingButton.toggleClass("active", hasSession);

            if (isNugenTemplate) {
                key = hasSession ? "coBrowsingEndButton" : "coBrowsingStartButtonNugen";
            } else {
                key = hasSession ? "coBrowsingEndButton" : "coBrowsingStartButton";
            }

            this.$coBrowsingButton.data("title", key);
            this.$coBrowsingButton.attr("title", EmbeddedChat.i18n.t(key));
        }
    };

    /**
     * Creates the greeting message when using a skip queue link
     */
    EmbeddedChat.chatWindow.createGreetingMessage = function() {
        var greetingMessage = EmbeddedChat.getChatGreeting();

        if (EmbeddedChat.skipQueue.hasState()) {
            if (greetingMessage.indexOf("@skipQueue@") !== -1) {
                var skipQueueConfig = EmbeddedChat.state.skipQueue.config,
                    skipQueueLink = $("<a>").
                        attr("href", "javascript:void(0)").
                        attr("onclick", "EmbeddedChat.handleSkipQueueAction();").
                        text(skipQueueConfig.emailPrompt).
                        wrap("<div>").
                        parent().
                        html();

                greetingMessage = greetingMessage.replace("@skipQueue@", skipQueueLink);
                this.appendToChatLog($("<div>").addClass("chat-info-msg").html(greetingMessage));

            } else {
                this.appendLogMessage(greetingMessage);
                this.addSkipQueueLink();
            }
        } else {
            this.appendLogMessage(greetingMessage);
        }
    };

    /**
     * Handle the new customer message received event.
     *
     * @param data The message data
     */
    EmbeddedChat.chatWindow.onCustomerMessageReceived = function(data) {
        this.sendMessage(data.message);
        this.sendCustomerMessage(data.message);
    };

    /**
     * Handle the new agent message received event.
     *
     * @param data The message data
     */
    EmbeddedChat.chatWindow.onAgentMessageReceived = function(data) {
        this.sendAgentMessage(data);
    };

    /**
     * Set the dictionary object.
     */
    EmbeddedChat.onSetSystemMessages = function(dictionary) {
        this.i18n.load(dictionary, "custom");
    };

    /**
     * Handle the new agent message received event.
     *
     * @param data The message data
     */
    EmbeddedChat.chatWindow.onCoBrowsingMessageReceived = function(data) {
        if(!data || !data.cmd) {
            return;
        }
        if (data.cmd === 'cobrowsing-invite-sent') {
            EmbeddedChat.chatWindow.coBrowsingInviteHandler();
            return;
        }

        if (data.cmd === 'cobrowsing-session-ended') {
            EmbeddedChat.sendMessage("co-browsing:end");
            return;
        }
    };



    /**
     * Send a customer message.
     *
     * @param message The customer message
     */
    EmbeddedChat.chatWindow.sendCustomerMessage = function(message) {
        this.appendMessage(message, MESSAGE_LEVEL_OUTGOING, true);
        this.clearAgentTyping();
    };

    /**
     * Send an agent message.
     *
     * @param data The agent message
     */
    EmbeddedChat.chatWindow.sendAgentMessage = function(data) {
        var message = data.message;
        if (!EmbeddedChat.acceptHTMLMessage) {
            message = $("<div>").html(message).text();
        }

        var agentNickname = this.getAgentNickname() || i18n.t("agent");
        var ariaLabelMessageSender = i18n.t("agentName").replace(/'/g,"&#39;") + ": " + agentNickname;
        var messageSender = "<span class='chat-msg-sender'  aria-label='" + ariaLabelMessageSender + "'>" + agentNickname + "</span>";

        var ariaLabelMessageText = i18n.t("agentMessage", {agent: agentNickname}).replace(/'/g,"&#39;") + ": "
            // get only the text
            + $("<div>").html(message).text();
        var wrappedMessage = "<div aria-label='" + ariaLabelMessageText + "'>" + message + "</div>";
        var formattedMessage = messageSender + wrappedMessage;
        this.appendMessage(formattedMessage, MESSAGE_LEVEL_INCOMING, true, true);
        this.clearAgentTyping();
    };

    EmbeddedChat.chatWindow.resetInput = function() {
        this.disable();
        this.hideLoading();
    };

    EmbeddedChat.chatWindow.determineEnableInputEarly = function() {
        var canWriteBefore = root.chaletAdapter.canWriteBeforeAgentAccepts();
        // Based on canWriteBefore, text input is disabled or enabled when interaction is queued
        if (canWriteBefore) {
            this.enable();
        }
    };

    EmbeddedChat.chatWindow.propagateChatInfoToRoomMeta = function() {
        this.chatInfo.forEach(function(value, key) {
            root.chaletAdapter.proto.setRoomMeta(root.chaletAdapter.roomId, key, value);
        });
    };

    EmbeddedChat.chatWindow.onInteractionScripting = function() {
        this.resetInput();
        this.determineEnableInputEarly();
        this.propagateChatInfoToRoomMeta();
    };

    EmbeddedChat.chatWindow.onInteractionQueued = function(isBeingTransferredFromBot, isBeingTransferredFromAgent) {
      if (!isBeingTransferredFromBot) {
        this.resetInput();
        this.determineEnableInputEarly();
        this.propagateChatInfoToRoomMeta();
      }

      var isKeepSessionAliveBeingUsed = EmbeddedChat.isKeepSessionAliveBeingUsed();

      if (!isKeepSessionAliveBeingUsed) {
        if (!this.initialMessageDisplayed) {
          this.clearChatLog();
          this.createGreetingMessage();
        } else {
          this.appendLogMessage(i18n.t("chatForwarded"));
        }
      } else {
        if (isBeingTransferredFromAgent) {
          this.appendLogMessage(i18n.t("chatForwarded"));
        } else {
          if (!isBeingTransferredFromBot) {
              this.createGreetingMessage();
          }
        }
      }
    };

    EmbeddedChat.chatWindow.onInteractionAccepted = function(agent) {
        this.setAgent(agent);
        var agentNickname = this.getAgentNickname();

        var chatEstablishedMessageKey = agentNickname ? "chatEstablishedName" : "chatEstablishedAgentNew";

        this.sessionEstablished = true;
        this.enable();

        if (!this.initialMessageDisplayed) {
            var shouldClearChatLogOnAccepted = !EmbeddedChat.isKeepSessionAliveBeingUsed() || !EmbeddedChat.session.exists;
            if (shouldClearChatLogOnAccepted) {
                this.clearChatLog();
            }
            this.initialMessageDisplayed = true;
            chatEstablishedMessageKey = agentNickname ? "chatEstablishedName" : "chatEstablishedAgent";
        }

        this.appendLogMessage(i18n.t(chatEstablishedMessageKey, {agent: agentNickname}));
    };

    EmbeddedChat.chatWindow.onInteractionDeleted = function(selfInitiated) {
        if (!selfInitiated) {
            if (this.translationServiceError) {
                this.appendErrorMessage(i18n.t("sessionDisconnected"));
            } else {
                this.appendErrorMessage(i18n.t("agentDisconnected"));
            }
        }

        this.disable();

        if (EmbeddedChat.isPopup()) {
            EmbeddedChat.sendMessage(EmbeddedChat.KEEP_SESSION_ALIVE_CONSTANTS.TOPIC_CLEAR_SESSION);
        }
    };

    /**
     * Handle the typing event.
     * Not empty user_ids means someone is typing
     * Empty user_ids means no one is typing
     */
    EmbeddedChat.chatWindow.chatTypingHandler = function(data) {
        EmbeddedChat.log("debug", "chatTypingHandler");

        var user_ids = data && data.user_ids;
        if (user_ids && user_ids.length) {
            var isNugen = EmbeddedChat.chatWindow.isNugenTemplate;
            this.displayAgentTyping({ isNugen });
        } else {
            this.clearAgentTyping();
        }
    };

    /**
     * Handle co-browsing invite event.
     */
    EmbeddedChat.chatWindow.coBrowsingInviteHandler = function() {
        if (EmbeddedChat.coBrowsing.hasInstance()) {
            var inviteTemplate = EmbeddedChat.templates["co-browsing-invite"];

            if (inviteTemplate) {
                this.appendMessage(inviteTemplate(), MESSAGE_LEVEL_HIGHLIGHT, false, true);
            }

        } else {
            EmbeddedChat.log("warn", "Co-browsing invite dropped due to instance not found");
        }
    };

    /**
     * Handle the before unload event
     *
     * @param event the event
     */
    EmbeddedChat.chatWindow.onBeforeUnloadHandler = function(event) {
        event = event || window.event;

        var message;

        var isChatQueuedOrEstablished = this.isChatQueuedOrEstablished();
        var isKeepSessionAliveBeingUsed = EmbeddedChat.isKeepSessionAliveBeingUsed();

        if (isChatQueuedOrEstablished && !isKeepSessionAliveBeingUsed) {
            message = i18n.t("endChatConfirmation");

            if (event) {
                event.returnValue = message;
            }
        }

        return message;
    };

    /**
     * Handle the unload event.
     *
     * @param event the event
     */
    EmbeddedChat.chatWindow.onUnloadHandler = function(event) {
        EmbeddedChat.log("debug", "onUnloadHandler");
        var canUseKeepSessionAlive = EmbeddedChat.canUseKeepSessionAlive();
        var shouldNotDeleteInteraction = root.chaletAdapter.canWriteBeforeAgentAccepts() && canUseKeepSessionAlive;

        EmbeddedChat.log("debug", "KSA - shouldNotDeleteInteraction" + " " + shouldNotDeleteInteraction);
        // If customer can write before agent accepts (i.e. keep session alive is enabled)
        // and it is not on Safari we do not delete the interaction
        if (shouldNotDeleteInteraction) return;

        this.closeChatSession();
    };

    /**
     * Handle the key down event.
     * Submit if only ENTER key is pressed with no other key combination
     *
     * @param event
     */
    EmbeddedChat.chatWindow.keyDownHandler = function(event) {
        if (event.keyCode === 13 && !(event.shiftKey || event.ctrlKey || event.metaKey ||  event.altKey)) {
            EmbeddedChat.preventDefault(event);
            this.submitClicked(event);
        } else {
            window.chaletAdapter.setTyping();
        }
    };

    /**
     * End the chat session.
     *
     * @return the ended chat session, if any
     */
    EmbeddedChat.chatWindow.endChatSession = function() {
        const tenant = EmbeddedChat.getTenant();
        return root.chaletAdapter.endChat({ tenant });
    };

    /**
     * Set the agent.
     *
     * @param agent the agent
     */
    EmbeddedChat.chatWindow.setAgent = function(agent) {
        this.agent = agent || {};
    };

    /**
     * Get the agent nickname from the current chat session.
     * @param {string?} agentId
     * @return {string|null}
     */
    EmbeddedChat.chatWindow.getAgentNickname = function(agentId) {
      var agent = window.chaletAdapter.getAgent(agentId);

      if (agent) {
        return agent.displayName;
      }

      return null;
    };

    /**
     * Displays the customer language at the window header
     *
     * @param language the language code
     */
    EmbeddedChat.chatWindow.showCustomerLanguage = function(language) {
        var label = i18n.getLanguageLabel(language);

        $('.js-translation-header').show();
        $('.js-language-label').text(label);
    };

    /**
     * Load the Pre-Chat data to be send in the chat once it is connected.
     */
    EmbeddedChat.chatWindow.loadInteractionData = function() {
        this.chatInfo = new Map();
        this.extraChatInfo = "";
        this.extraChatInfoID = "";
        this.preChatFormDataArray = [];
        this.customChatInfo = {};

        // Get the customer language
        var language = i18n.getCustomerLanguage();
        if (language) {
            this.showCustomerLanguage(language);
        }

        var preChatFormData;

        if (EmbeddedChat.preChat.hasData()) {
            preChatFormData = EmbeddedChat.preChat.getFormData();
            this.preChatFormDataArray = preChatFormData.map(function ({ question, answer, identifier }) {
                return {question, answer, id: identifier}
            });
        } else {
            // There isn't any pre-chat data, so we need to create the legacy data with the language,
            // if any configured.
            this.parent.createLegacyData(language);
        }

        this.chatInfo.set("__ip-address__", EmbeddedChat.getCallerIPAddress());
        this.chatInfo.set("__referrer__", EmbeddedChat.getReferrer());

        if (EmbeddedChat.isStartedByChatAPI()) {
            this.chatInfo.set("__started-by__", "Chat API");
        }

        var preChatVariables = {};

        if (preChatFormData) {
            var crmData = EmbeddedChat.preChat.getCRMField(preChatFormData);

            if (crmData) {
                this.chatInfo.set(crmData.question, crmData.answer);
                this.extraChatInfo += "[" + crmData.question + "|" + crmData.answer + "]";
                this.extraChatInfoID += "[" + crmData.identifier + "|" + crmData.answer + "]";
                preChatVariables[crmData.identifier] = true;
            }

            var extraData = EmbeddedChat.preChat.getExtraFields(preChatFormData);

            _.each(extraData, function(element, index, list) {
                this.chatInfo.set(element.question, element.answer);
                this.extraChatInfo += "[" + element.question + "|" + element.answer + "]";
                this.extraChatInfoID += "[" + element.identifier + "|" + element.answer + "]";
                preChatVariables[element.identifier] = true;
            }, this);
        }

        if (EmbeddedChat.customer.hasInfo()) {
            var customerInfo = EmbeddedChat.customer.getInfo();
            _.each(customerInfo, function(info, name) {
                this.chatInfo.set(name, "" + info);
                this.extraChatInfo += "[" + name + "|" + info + "]";
                this.customChatInfo[name] = "" + info;
            }, this);
        }

        if (EmbeddedChat.customer.hasVariables()) {
            var variables = EmbeddedChat.customer.getVariables();
            _.each(variables, function(value, name) {
                if (this.canSendAsVariable(name, value, preChatVariables)) {
                    this.chatInfo.set(EmbeddedChat.CHAT_VARIABLE_TAG + name, "" + value);
                    this.extraChatInfo += "[" + name + "|" + value + "]";
                    this.customChatInfo[name] = "" + info;
                }
            }, this);
        }
    };

    /**
     * Check whether the variable name/value can be send as a variable.
     *
     * @param name the variable name
     * @param value the variable value
     * @param preChatVariables variables already sent as pre-chat question
     *
     * @return true if the variable can be send
     */
    EmbeddedChat.chatWindow.canSendAsVariable = function(name, value, preChatVariables) {
        return value !== "" && !preChatVariables[name] && name !== EmbeddedChat.CHAT_SYSTEM_VARIABLE_LANGUAGE;
    };


    /**
     * Get the chat loading spinner configuration
     *
     * @return the loading spinner configuration object
     */
    EmbeddedChat.chatWindow.getLoadingConfig = function() {
        // Use the default spin.js configuration for the chat window
        return null;
    };

    /**
     * Hide the loading indicator.
     */
    EmbeddedChat.chatWindow.hideLoading = function() {
        var isNugen = EmbeddedChat.isNugenTemplate();
        var el = this.$loading.get(0);

        if (isNugen) {
            el.classList.remove("nugen__loading");
        } else {
            this.$loading.hide();
            if (this.loadingSpinner) {
                this.loadingSpinner.stop();
            }
        }

        this.loading = false;
    };

    /**
     * Toggle the chat.
     *
     * @param enabled whether the chat should be enabled
     */
    EmbeddedChat.chatWindow.toggle = function(enabled) {
        var disabled = !enabled;

        this.$messageField.prop("disabled", disabled);
        this.disabled = disabled;
    };

    /**
     * If the token is set, the chat must be queued or established
     *
     * @return {Boolean} [description]
     */
    EmbeddedChat.chatWindow.isChatQueuedOrEstablished = function() {
        return !!window.chaletAdapter.getToken();
    };

    /**
     * Send the typed message to the agent.
     *
     * @param message The customer message
     */
    EmbeddedChat.chatWindow.sendMessage = function(message) {
        if (message.length > CONFIG.MAX_CHAT_MSG_LENGTH) {
          message = message.substring(0, CONFIG.MAX_CHAT_MSG_LENGTH);
          this.appendErrorMessage(i18n.t("chatMsgTooLong"));
        }

        return window.chaletAdapter.sendMessage(message);
    };

    /**
     * End the chat by closing the Chat session and process the next UI state.
     *
     * @param {boolean} noConfirmation true to not confirm before ending the chat
     *
     * @return {Deferred} object, resolved if the action is confirmed, rejected otherwise
     */
    EmbeddedChat.chatWindow.endChat = function(noConfirmation) {
        var deferredObject = $.Deferred().done($.proxy(function() {
            this.closeChatSession();
        }, this));

        if (!this.isDisabled() && !noConfirmation) {
            this.confirmEndChat(deferredObject);
        } else {
            deferredObject.resolve();
        }

        return deferredObject.promise();
    };

    /**
     * Show a confirmation dialog before closing the chat session.
     *
     * @param deferredObject deferred object to be either resolved or rejected depending on the user's choice
     */
    EmbeddedChat.chatWindow.confirmEndChat = function(deferredObject) {
        // Helper function to control the confirmation dialog
        var toggleDialog = $.proxy(function(show) {
            this.$el.toggleClass("js-closing", show);
        }, this);

        // Show the dialog, and hide it if the user cancels
        toggleDialog(true);
        deferredObject.always(function() {
            toggleDialog(false);
        });

        this.$confirmCloseButton.off("click").on("click", deferredObject.resolve);
        this.$cancelCloseButton.off("click").on("click", deferredObject.reject);
    };

    /**
     * Close the chat Session.
     */
    EmbeddedChat.chatWindow.closeChatSession = function() {
        if (EmbeddedChat.coBrowsing.hasSession()) {
            EmbeddedChat.sendMessage("co-browsing:end");
        }

        if (this.endChatSession()) {
            this.appendLogMessage(i18n.t("chatEnded"));
            this.disable();
        }

        EmbeddedChat.clearSessionData();
        EmbeddedChat.clearSessionKeyFromLocalStorage();
    };

    /**
     * Clear the chat log.
     */
    EmbeddedChat.chatWindow.clearChatLog = function() {
        this.replaceChatLog("");
    };

    /**
     * Add the Skip queue link to the chat.
     */
    EmbeddedChat.chatWindow.addSkipQueueLink = function() {
        var skipQueueConfig = EmbeddedChat.state.skipQueue.config,
            $message        = this.appendLinkMessage(skipQueueConfig.emailPrompt, "link");

        $message.click($.proxy(function() {
            this.endChat().done($.proxy(function() {
                this.showLoading();
                EmbeddedChat.loadFragment(skipQueueConfig).
                             done($.proxy(EmbeddedChat.processUIState, EmbeddedChat)).
                             always($.proxy(this.hideLoading, this));
            }, this));
        }, this));
    };

    /**
     * Display the message indication that the agent is typing.
     *
     * @param {Object} options function parameters
     * @param {boolean} options.isNugen whether to use the new template design
     */
    EmbeddedChat.chatWindow.displayAgentTyping = function({ isNugen = false }) {
        if (!this.$agentTyping) {
            const agentNickname = this.getAgentNickname() || i18n.t("agent");
            const agentTypingKey = agentNickname ? "agentTypingName" : "agentTyping";
            const message = i18n.t(agentTypingKey, {agent: agentNickname})

            if (isNugen) {
                const ariaLabelMessageSender = i18n.t("agentName").replace(/'/g,"&#39;") + ": " + agentNickname;
                const messageSender = `
                  <span
                    class='chat-msg-sender'
                    data-chat-theme='nugen'
                    role='presentation'
                    aria-label='${ariaLabelMessageSender}'
                  >
                    ${agentNickname}
                  </span>
                `;
                const threeDotsMessage = `
                  <div
                    class='chat-typing-msg-content'
                    data-chat-theme='nugen'
                    role='presentation'

                    aria-label='${message}'
                  >
                    ${Array(4).join("<span data-chat-theme='nugen'></span>")}
                  </div>
                `;
                const fullMessage = messageSender + threeDotsMessage;
                this.$agentTyping = this.appendLogMessage(fullMessage, true, true);
                // add speech bubble styles
                this.$agentTyping.addClass("chat-incoming-msg");
            } else {
                this.$agentTyping = this.appendLogMessage(message, true);
            }

            this.$agentTyping.addClass("chat-typing-msg");
        }
    };

    /**
     * Clear the message indication that the agent is typing.
     */
    EmbeddedChat.chatWindow.clearAgentTyping = function() {
        if (this.$agentTyping) {
            this.$agentTyping.remove();
            this.$agentTyping = null;
        }
    };

    /**
     * Display the translation service error message.
     */
    EmbeddedChat.chatWindow.displayTranslationServiceError = function() {
        this.appendErrorMessage(i18n.t("chatTranslationServiceError"));
    };

    /**
     * Wraps the message in a span tag having an aria-label attribute.
     *
     * @param message is the actual message
     * @param messageType contains extra information about the message
     *
     * @return message wrapped in a span tag
     */
    EmbeddedChat.getWrappedMessage = function(message, messageType) {
        return "<span aria-label='" + messageType + ": " + message + "'>" + message + "</span>";
    };

    /**
     * Create a message.
     *
     * @param message the chat message
     * @param level   the message level
     * @param asHTML  whether the message should be interpreted as HTML
     *
     * @return the message jQuery object
     */
    EmbeddedChat.chatWindow.createMessage = function(message, level, asHTML) {
        var $message = $("<div>").addClass("chat-" + level + "-msg");

        // for html messages like incoming or highlight messages
        if (asHTML) {
            $message.html(message);
            return $message;
        }

        // for texts messages like outgoing, error, log or info messages
        var messageType = level === MESSAGE_LEVEL_OUTGOING ? i18n.t("yourMessage") : i18n.t("informativeMessage");
        var wrappedMessage = EmbeddedChat.getWrappedMessage(message, messageType);
        $message = $message.append("<p>" + wrappedMessage + "</p>");

        return $message;
    };

    /**
     * Append a message to the chat log.
     *
     * @param message          the message to append
     * @param level            the message level
     * @param ignoreSessionLog whether to add this message to the chat session log
     * @param asHTML           whether the message should be interpreted as HTML
     *
     * @return the message jQuery object
     */
    EmbeddedChat.chatWindow.appendMessage = function(message, level, ignoreSessionLog, asHTML) {
        var $message = this.createMessage(message, level, asHTML);

        return this.appendToChatLog($message, ignoreSessionLog);
    };

    /**
     * Append a link message to the chat log.
     *
     * @param message          the message to append
     * @param level            the message level
     * @param ignoreSessionLog whether to add this message to the chat session log
     *
     * @return the message jQuery object
     */
    EmbeddedChat.chatWindow.appendLinkMessage = function(message, level, ignoreSessionLog) {
        var $message = $("<div>").addClass("chat-" + level + "-msg").append($("<a href='javascript:void(0)'>").text(message));

        return this.appendToChatLog($message, ignoreSessionLog);
    };

    /**
     * Append an info message to the chat log.
     *
     * @param message          the message to append
     * @param ignoreSessionLog whether to add this message to the chat session log
     *
     * @return the message jQuery object
     */
    EmbeddedChat.chatWindow.appendInfoMessage = function(message, ignoreSessionLog) {
        return this.appendMessage(message, MESSAGE_LEVEL_INFO, ignoreSessionLog);
    };

    /**
     * Append a log message to the chat log.
     *
     * @param {string} message          the message to append
     * @param {boolean?} ignoreSessionLog whether to add this message to the chat session log
     * @param {boolean?} asHTML           whether the message should be interpreted as HTML
     *
     * @return the message jQuery object
     */
    EmbeddedChat.chatWindow.appendLogMessage = function(message, ignoreSessionLog, asHTML) {
        return this.appendMessage(message, MESSAGE_LEVEL_LOG, ignoreSessionLog, asHTML);
    };

    /**
     * Append a highlight message to the chat log.
     *
     * @param message          the message to append
     * @param ignoreSessionLog whether to add this message to the chat session log
     *
     * @return the message jQuery object
     */
    EmbeddedChat.chatWindow.appendHighlightMessage = function(message, ignoreSessionLog) {
        return this.appendMessage(message, MESSAGE_LEVEL_HIGHLIGHT, ignoreSessionLog, true);
    };

    /**
     * Append an error message to the chat log.
     *
     * @param message          the message to append
     * @param ignoreSessionLog whether to add this message to the chat session log
     *
     * @return the message jQuery object
     */
    EmbeddedChat.chatWindow.appendErrorMessage = function(message, ignoreSessionLog) {
        return this.appendMessage(message, MESSAGE_LEVEL_ERROR, ignoreSessionLog);
    };

    /**
     * Append the pending message to the chat log and the array of pending messages.
     *
     * @param message the message to append
     *
     * @return the message jQuery object
     */
    EmbeddedChat.chatWindow.appendPendingMessage = function(message) {
        this.pendingMessages.push(message);

        return this.appendMessage(message, MESSAGE_LEVEL_OUTGOING, true);
    };

    /**
     * Append to the chat log.
     *
     * @param $el the jQuery object to append to the chat log element
     * @param ignoreSessionLog whether to add this message to the chat session log
     *
     * @return the jQuery object appended to the chat log
     */
    EmbeddedChat.chatWindow.appendToChatLog = function($el, ignoreSessionLog) {
        if (this.$chatLog) {
            $el.appendTo(this.$chatLog);

            this.$chatLog.parent().animate({ scrollTop: this.$chatLog.height() }, "fast");
        }

        return $el;
    };

    /**
     * Replace the entire chat log content.
     *
     * @param content the content to replace
     */
    EmbeddedChat.chatWindow.replaceChatLog = function(content) {
        this.$chatLog.html(content).parent().animate({ scrollTop: this.$chatLog.height() }, "fast");
    };

  /**
     * Hold the customer data.
     */
    EmbeddedChat.customer = {};

    /**
     * Setup the customer data.
     */
    EmbeddedChat.customer.setup = function() {
        this.resetInfo();
        this.resetVariables();
    };

    /**
     * Whether the customer has any info set.
     *
     * @return true if the customer has any info set, false otherwise
     */
    EmbeddedChat.customer.hasInfo = function() {
        return !_.isEmpty(this._info);
    };

    /**
     * Whether the customer has any chat-variables set.
     *
     * @return true if the customer has any chat-variables set, false otherwise
     */
    EmbeddedChat.customer.hasVariables = function() {
        return !_.isEmpty(this._variables);
    };

    /**
     * Get the customer info.
     *
     * @return the customer info
     */
    EmbeddedChat.customer.getInfo = function() {
        return this._info;
    };

    /**
     * Get the customer chat-variables.
     *
     * @return the customer chat-variables
     */
    EmbeddedChat.customer.getVariables = function() {
        return this._variables;
    };

    /**
     * Get the customer info in the format expected by the email
     *
     * @return the customer info in email format
     */
    EmbeddedChat.customer.getInfoForEmail = function() {
        return _.map(this._info, function(info, name) {
            return {
                question: name,
                answer: info
            };
        });
    };

    /**
     * Set the customer info.
     *
     * @param info The customer info
     */
    EmbeddedChat.customer.setInfo = function(info) {
        _.each(info, function(info, name) {
            if (info == null) {
                // Delete info from customer if it's set as null or undefined
                delete this._info[name];

            } else if (_.isObject(info)) {
                // Warn if the customer info is not of a primitive type
                EmbeddedChat.log("warn", "Customer info \"" + name + "\" is not of a primitive type and will be discarded");

            } else if (String(name).length > 100) {
                // Warn if the name is bigger than 100
                EmbeddedChat.log("warn", "Customer info \"" + name + "\" key is too big and will be discarded");

            } else if (String(info).length > 500) {
                // Warn if the info is bigger than 500
                EmbeddedChat.log("warn", "Customer info \"" + name + "\" value is too big and will be discarded");

            } else {
                // Add/replace the customer info otherwise
                this._info[name] = info;
            }
        }, this);
    };

    /**
     * Reset the customer info.
     */
    EmbeddedChat.customer.resetInfo = function() {
        this._info = {};
    };

    /**
     * Reset the customer chat-variables reference.
     */
    EmbeddedChat.customer.resetVariables = function() {
        this._variables = {};
    };

    /**
     * Set the customer chat-variables.
     *
     * @param variables The chat API variables
     */
    EmbeddedChat.customer.setVariables = function(variables) {
        this._variables = variables;
    };

    /**
     * Notify that the customer info has just been sent
     */
    EmbeddedChat.customer.notifyInfoSent = function() {
        EmbeddedChat.sendMessage("customer:info-sent", {
            info: EmbeddedChat.customer.getInfo(),
            phase: EmbeddedChat.currentState.config.name
        });
    };

    /**
     * Handle the internationalization and localization mechanism.
     */
    root.i18n = EmbeddedChat.i18n = {};

    /**
     * Hold the list of valid language codes.
     * NOTE: If you update this list, you also need to update the list in cm_embedded_chat_common.inc ($LANGUAGE_LIST)
     * Language              Code      Localized
     * ------------------------------------------
     * English               en        English
     * Russian               ru        Русский
     * German                de        Deutsch
     * Japanese              ja        日本語
     * Spanish               es        Español
     * French                fr        Français
     * Portuguese            pt        Português
     * Italian               it        Italiano
     * Polish                pl        Polski
     * Croatian              hr        Hrvatski
     * Hindi                 hi        हिन्दी
     * Dutch                 nl        Dutch
     * Arabic                ar        العربية
     * Danish                da        Dansk
     * Korean                ko        한국
     * Norwegian             no        Norsk
     * Swedish               sv        Svenska
     * Vietnamese            vi        Tiếng Việt
     * Welsh                 cy        Cymraeg
     * Thai                  th        ไทย
     * Simplified Chinese    zh-CN     简体中文
     * Traditional Chinese   zh-TW     中國傳統
     * Dutch        nl      Nederlands
     */
    EmbeddedChat.i18n.languageList = {
        "en": "English",
        "ru": "Русский",
        "de": "Deutsch",
        "ja": "日本語",
        "es": "Español",
        "fr": "Français",
        "pt": "Português",
        "it": "Italiano",
        "pl": "Polski",
        "hr": "Hrvatski",
        "hi": "हिन्दी",
        "nl": "Dutch",
        "ar": "العربية",
        "da": "Dansk",
        "ko": "한국",
        "no": "Norsk",
        "sv": "Svenska",
        "vi": "Tiếng Việt",
        "cy": "Cymraeg",
        "th": "ไทย",
        "zh-CN": "简体中文",
        "zh-TW": "中國傳統",
    };

    /**
     * Hold the list of strings.
     */
    EmbeddedChat.i18n.stringList = {
        keys: [
            "endChatButton",
            "closeChatButton",
            "errorServerUnavailable",
            "chatEstablished",
            "chatEstablishedName",
            "chatEstablishedAgent",
            "chatEstablishedAgentNew",
            "chatQueued",
            "chatTitle",
            "chatForwarded",
            "chatMsgTooLong",
            "chatDisconnected",
            "chatEnded",
            "agent",
            "agentName",
            "agentMessage",
            "informativeMessage",
            "agentTyping",
            "agentTypingName",
            "agentDisconnected",
            "errorInvalidLogin",
            "endChatNotification",
            "endChatConfirmation",
            "chatLogTitle",
            "chatLogDescription",
            "yesButton",
            "noButton",
            "coBrowsingStartButton",
            "coBrowsingEndButton",
            "saveButton",
            "clearButton",
            "pullDownInfo",
            "pullUpInfo",
            "errorGenericMessage",
            "errorRequiredMessage",
            "errorCrmFieldInvalidMessage",
            "errorInvalidNumber",
            "errorInvalidEmail",
            "preChatFormData",
            "offChatFormData",
            "skipQueueFormData",
            "chatTranslationOn",
            "chatTranslationOff",
            "chatTranslationServiceError",
            "coBrowsingInvitePrompt",
            "coBrowsingInviteAccept",
            "coBrowsingInviteReject",
            "coBrowsingInviteAccepted",
            "coBrowsingInviteRejected",
            "coBrowsingSessionStarted",
            "coBrowsingSessionEnded",
            "coBrowsingSessionRestored",
            "sessionDisconnected",
            "emptySubject",
            "messageBoxPlaceholder",
            "yourMessage",
            "sendMessage",
            "invitationAppeared",
            "formAppeared",
            "windowAppeared",
            "coBrowsingStartButtonNugen",
            "coBrowsingEndButtonNugen",
            "saveButtonNugen",
            "chatInvitationName",
            "chatFormName",
            "chatWindowName",
        ],
        excludeTranslation: {
            "preChatFormData": true,
            "offChatFormData": true,
            "skipQueueFormData": true
        }
    };

    /**
     * Define the placeholder regex for string interpolation
     */
    EmbeddedChat.i18n.placeholderRegex = /\{\{(.+?)\}\}/g;

    /**
     * Define that language was changed from API as false
     */
    EmbeddedChat.i18n.changedFromAPI = false;

    /**
     * Setup the dictionary for internationalization and localization.
     */
    EmbeddedChat.i18n.setup = function() {
        this.reset();
    };

    /**
     * Reset the translation entries.
     */
    EmbeddedChat.i18n.reset = function() {
        this.dictionary = {};
    };

    /**
     * Load the translation entries.
     *
     * @param dictionary the dictionary object
     */
    EmbeddedChat.i18n.load = function(dictionary, lang) {
        var langDictionary = this.getLangDictionary(lang);

        _.each(dictionary, function(entry, key) {
            if (entry == null) {
                // Delete dictionary entry if it's set as null or undefined
                delete langDictionary[key];

            } else if (_.isObject(entry)) {
                // Warn if the dictionary entry is not of a primitive type
                EmbeddedChat.log("warn", "Dictionary entry \"" + key + "\" is not of a primitive type and will be discarded");
            } else if (entry.includes('>') || entry.includes('<')) {
                // Warn if the dictionary entry is suspected as an XSS attack
                EmbeddedChat.log("warn", "Dictionary entry \"" + key + "\" is suspected as an XSS attack and will be discarded");
            } else {
                // Add/replace the dictionary entry otherwise
                langDictionary[key] = dictionary[key];
            }
        }, this);

        this.setLangDictionary(langDictionary, lang);
    };

    /**
     * Get the dictionary for that specified language;
     *
     * @param lang the language to get the dictionary
     *
     * @return the dictionary
     */
    EmbeddedChat.i18n.getLangDictionary = function(lang) {
        return this.dictionary[lang] || {};
    };

    /**
     * Set the language dictionary.
     *
     * @param dictionary the dictionary
     * @param lang the language
     */
    EmbeddedChat.i18n.setLangDictionary = function(dictionary, lang) {
        this.dictionary[lang] = dictionary;
    };

    /**
     * Whether is it needed to translated the system messages.
     *
     * @return true if a translation will be needed
     */
    EmbeddedChat.i18n.isTranslationNeeded = function() {
        var defaultLanguage = this.getDefaultLanguage();
        var defaultDictionary = this.getLangDictionary(defaultLanguage);

        var currentLanguage = this.getCurrentLanguage();
        var currentDictionary = this.getLangDictionary(currentLanguage);

        return _.keys(defaultDictionary).length != _.keys(currentDictionary).length;
    };

    /**
     * Set the default language.
     *
     * @param language the language
     */
    EmbeddedChat.i18n.setDefaultLanguage = function(language) {
        this.defaultLanguage = language;
    };

    /**
     * Get the default language.
     *
     * @return the default language
     */
    EmbeddedChat.i18n.getDefaultLanguage = function() {
        return this.defaultLanguage;
    };

    /**
     * Set the customer language.
     *
     * @param language the customer language
     */
    EmbeddedChat.i18n.setCustomerLanguage = function(language) {
        this.customerLanguage = language || null;
    };

    /**
     * Get the customer language.
     *
     * @return the customer language
     */
    EmbeddedChat.i18n.getCustomerLanguage = function() {
        return this.customerLanguage;
    };

    /**
     * Get the current language.
     *
     * @return the customer language and also considering the default language
     */
    EmbeddedChat.i18n.getCurrentLanguage = function() {
        return this.getCustomerLanguage() || this.getDefaultLanguage();
    };

    /**
     * Whether the language is valid.
     *
     * @param language the language
     *
     * @return true if the language is valid
     */
    EmbeddedChat.i18n.isLanguageValid = function(language) {
        return !!this.languageList[language];
    };

    /**
     * Get the language label to be displayed for the user.
     *
     * @param language the language code
     *
     * @return the language label
     */
    EmbeddedChat.i18n.getLanguageLabel = function(language) {
        return this.languageList[language] || "";
    };

    /**
     * Translate a given fragment.
     *
     * @param $fragment the jQuery object
     *
     * @return jQuery Promise
     */
    EmbeddedChat.i18n.translateFragment = function($fragment) {
        var callback = $.proxy(this.translateFragmentResources, this, $fragment);
        return this.requestSystemDictionary().always(callback);
    };

    /**
     * Translate all resources in a given fragment.
     *
     * @param $fragment the jQuery object
     *
     * @return the translated fragment
     */
    EmbeddedChat.i18n.translateFragmentResources = function($fragment) {
        this.translateFragmentStrings($fragment);
        this.translateFragmentTitles($fragment);
        this.translateFragmentPlaceholders($fragment);

        return $fragment;
    };

    /**
     * Translate strings in a given fragment.
     *
     * @param $fragment the jQuery object
     *
     * @return the translated fragment
     */
    EmbeddedChat.i18n.translateFragmentStrings = function($fragment) {
        return $fragment.find("[data-string]").each($.proxy(function(i, el) {
            var $el = $(el);
            var key = $el.data("string");

            $el.text(this.t(key));
        }, this));
    };

    /**
     * Translate titles in a given fragment.
     *
     * @param $fragment the jQuery object
     *
     * @return the translated fragment
     */
    EmbeddedChat.i18n.translateFragmentTitles = function($fragment) {
        return $fragment.find("[data-title]").each($.proxy(function(i, el) {
            var $el = $(el);
            var key = $el.data("title");

            $el.attr("title", this.t(key));
        }, this));
    };

    EmbeddedChat.i18n.translateFragmentPlaceholders = function($fragment) {
        return $fragment.find("[data-placeholder]").each($.proxy(function(i, el) {
            var $el = $(el);
            var key = $el.data("placeholder");
            if (key !== undefined) {
                $el.attr("placeholder", this.t(key));
            }
        }, this));
    };

    /**
     * Load the system message dictionary, translated in the customer language.
     *
     * @param forceRequest force the request, regardless of whether translation is needed or not
     *
     * @return jQuery Promise
     */
    EmbeddedChat.i18n.requestSystemDictionary = function(forceRequest) {
        var deferredObject = $.Deferred();

        if (forceRequest || this.isTranslationNeeded()) {

            var data = {
                script: EmbeddedChat.getScript(),
                tenant: EmbeddedChat.getTenantBase64(),
                tenantOEMPath: EmbeddedChat.tenantOEMPath,
                dictionary: this.getSystemDictionaryKeys(forceRequest),
                langto: this.getCurrentLanguage()
            };
            EmbeddedChat.checkLanguageAlignment(data.langto);
            EmbeddedChat.updateHTMLLanguageAttribute(data.langto);

            $.get("../../../CHAT/chat.php?action=translateSystemMessages", data)

            .done($.proxy(function(data) {
                if (!EmbeddedChat.responseHasError(data)) {
                    this.load(data.response.data.dictionary, data.response.data.lang);

                    deferredObject.resolve();

                } else {
                    deferredObject.reject();
                }
            }, this))

            .fail(function() {
                deferredObject.reject();
            });

        } else {
            setTimeout(deferredObject.resolve, 100);
        }

        return deferredObject.promise();
    };

    /**
     * Get the System Dictionary keys.
     *
     * @param includeAll whether to include all keys, even ones that should be excluded from translations
     *
     * @return an array of keys to translate
     */
    EmbeddedChat.i18n.getSystemDictionaryKeys = function(includeAll) {
        var stringList = EmbeddedChat.i18n.stringList;

        if (includeAll) {
            return stringList.keys;
        }

        return _.filter(stringList.keys, function(key) {
            return !stringList.excludeTranslation[key];
        });
    };

    /**
     * Get the translation for the key string.
     *
     * It will first try to get the entry from the custom dictionary, them from the current dictionary and finally
     * it will get the entry from the default dictionary that was loaded during initialization.
     *
     * @param key the key to return the string
     * @param [options] object with values to be interpolated
     *
     * @return the translated strings
     */
    EmbeddedChat.i18n.t = function(key, options) {
        options = options || {};

        var customDictionary = this.getLangDictionary("custom");
        var currentDictionary = this.getLangDictionary(this.getCurrentLanguage());
        var defaultDictionary = this.getLangDictionary(this.getDefaultLanguage());

        var string = customDictionary[key] || currentDictionary[key] || defaultDictionary[key] || "";
        return string.replace(this.placeholderRegex, function(expression, argument) {
            return options[argument] || expression;
        });
    };

    /**
     * Handle the compiled templates.
     */
    root.templates = EmbeddedChat.templates = {};

    /**
     * Handle the co-browsing chat integration.
     */
    root.coBrowsing = EmbeddedChat.coBrowsing = {};

    /**
     * Setup the co-browsing integration.
     */
    EmbeddedChat.coBrowsing.setup = function() {
        this.reset();

        function getInviteActions$el(e) {
            return $(e.target).closest(".js-co-browsing-invite-actions");
        }

        function onAcceptInviteClick(e) {
            this.coBrowsing.acceptInvite();
            var acceptedMessage = this.i18n.t("coBrowsingInviteAccepted");
            getInviteActions$el(e).html(EmbeddedChat.getWrappedMessage(acceptedMessage, i18n.t("informativeMessage")));
        }

        function onRejectInviteClick(e) {
            this.coBrowsing.rejectInvite();
            var rejectedMessage = this.i18n.t("coBrowsingInviteRejected");
            getInviteActions$el(e).html(EmbeddedChat.getWrappedMessage(rejectedMessage, i18n.t("informativeMessage")));
        }

        $(document)
            .on("click", ".js-co-browsing-invite-accept", $.proxy(onAcceptInviteClick, EmbeddedChat))
            .on("click", ".js-co-browsing-invite-reject", $.proxy(onRejectInviteClick, EmbeddedChat));
    };

    /**
     * Reset the co-browsing integration state.
     */
    EmbeddedChat.coBrowsing.reset = function() {
        this._instanceFound = false;
        this._sessionId = null;
        this._lastSessionId = null;
        this._stickyHash = null;
    };

    /**
     * Get the co-browsing session ID, if any.
     *
     * @return the session ID
     */
    EmbeddedChat.coBrowsing.getSessionId = function() {
        return this._sessionId;
    };

    /**
     * Get the last active co-browsing session ID, if any.
     *
     * @return the last session ID
     */
    EmbeddedChat.coBrowsing.getLastSessionId = function() {
        return this._lastSessionId;
    };

    /**
     * Get the co-browsing session sticky hash, if any.
     *
     * @return the sticky hash
     */
    EmbeddedChat.coBrowsing.getStickyHash = function() {
        return this._stickyHash;
    }

    /**
     * Get the co-browsing session information.
     *
     * @return the session information
     */
    EmbeddedChat.coBrowsing.getSessionInfo = function() {
        return {
            sessionId: this._sessionId,
            stickyHash: this._stickyHash
        }
    }

    /**
     * Set the co-browsing session ID.
     *
     * @param sessionId The session ID
     */
    EmbeddedChat.coBrowsing.setSessionId = function(sessionId) {
        this._sessionId = this._lastSessionId = sessionId;
    };

    /**
     * Set the co-browsing session sticky hash.
     *
     * @param stickyHash The sticky hash
     */
    EmbeddedChat.coBrowsing.setStickyHash = function(stickyHash) {
        this._stickyHash = stickyHash;
    };

    /**
     * Reset the co-browsing session information.
     */
    EmbeddedChat.coBrowsing.resetSession = function() {
        this._sessionId = null;
        this._stickyHash = null;
    };

    /**
     * Whether there is an active co-browsing session.
     *
     * @return true if there is an active co-browsing session, false otherwise
     */
    EmbeddedChat.coBrowsing.hasSession = function() {
        return this._sessionId != null;
    };

    /**
     * Whether a given session ID refers to a new session.
     *
     * @param sessionId The session ID
     *
     * @return true if it is a new session, false otherwise
     */
    EmbeddedChat.coBrowsing.isNewSession = function(sessionId) {
        return this._lastSessionId !== sessionId;
    };

    /**
     * Accept a co-browsing invite.
     */
    EmbeddedChat.coBrowsing.acceptInvite = function() {
        EmbeddedChat.sendMessage("co-browsing:start");
        window.chaletAdapter.sendCoBrowsingMessage({cmd: 'cobrowsing-invite-accepted'})
    };

    /**
     * Reject a co-browsing invite.
     */
    EmbeddedChat.coBrowsing.rejectInvite = function() {
        window.chaletAdapter.sendCoBrowsingMessage({cmd: 'cobrowsing-invite-rejected'});
    };

    /**
     * Handle the co-browsing instance found event.
     */
    EmbeddedChat.coBrowsing.onInstanceFound = function() {
        this._instanceFound = true;
    };

    /**
     * Whether there is a co-browsing instance available.
     *
     * @return true if there is a co-browsing instance, false otherwise
     */
    EmbeddedChat.coBrowsing.hasInstance = function() {
        return this._instanceFound;
    };

    /**
     * Handle the co-browsing session connected event.
     *
     * @param sessionInfo The co-browsing session information
     */
    EmbeddedChat.coBrowsing.onSessionConnected = function(sessionInfo) {
        var isNewSession = this.isNewSession(sessionInfo.sessionId);
        var message = EmbeddedChat.i18n.t(isNewSession ? "coBrowsingSessionStarted" : "coBrowsingSessionRestored");

        this.setSessionId(sessionInfo.sessionId);
        this.setStickyHash(sessionInfo.stickyHash);

        window.chaletAdapter.sendCoBrowsingMessage({
            cmd: 'cobrowsing-session-started',
            params: {
                sessionId: sessionInfo.sessionId,
                stickyHash: sessionInfo.stickyHash,
            }
        });

        EmbeddedChat.chatWindow.appendHighlightMessage("<p>" + EmbeddedChat.getWrappedMessage(message, i18n.t("informativeMessage")) + "</p>", false);
        EmbeddedChat.chatWindow.updateCoBrowsingButton();
    };

    /**
     * Handle the co-browsing session disconnected event.
     */
    EmbeddedChat.coBrowsing.onSessionDisconnected = function() {
        window.chaletAdapter.sendCoBrowsingMessage({
            cmd: 'cobrowsing-session-ended',
            params: {
                sessionId: this.getSessionId(),
            }
        });

        this.resetSession();
        var message = EmbeddedChat.i18n.t("coBrowsingSessionEnded");
        EmbeddedChat.chatWindow.appendHighlightMessage("<p>" + EmbeddedChat.getWrappedMessage(message, i18n.t("informativeMessage")) + "</p>", false);
        EmbeddedChat.chatWindow.updateCoBrowsingButton();
    };

    /**
     * Whether the response has any error.
     *
     * @param data the data to check
     *
     * @return true if there is any error
     */
    EmbeddedChat.responseHasError = function(data) {
        return !data || !data.response || data.response.status == 1;
    };

    /**
     * Prevent the default action of a given event.
     *
     * @param event The event which the default action should be prevented
     */
    EmbeddedChat.preventDefault = function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };
    if (EmbeddedChat.hasAccessToLocalStorage()) {
        EmbeddedChat.setLogLevel(window.localStorage.getItem(EmbeddedChat.ERROR_FLAG + '_LogLevel'));
    }
})(this, jQuery);

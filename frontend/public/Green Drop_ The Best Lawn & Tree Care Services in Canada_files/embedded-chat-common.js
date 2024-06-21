(function(root, $) {

    /**
     * Holds the Embedded Chat object.
     */
    var EmbeddedChat = root.EmbeddedChat = root.EmbeddedChat || {};

    // Used by RTAPI library
    root.CONFIG = {
        MAX_CHAT_MSG_LENGTH: 5000
    };

    // Used to in determining template type
    root.EmbeddedChat.CONSTANTS = {
        MESSAGE_ACTIONS_ACTIVE_CLASS: 'message-actions--active',
        VERSION_PREFIX: '_nugen_',
    }

    /**
     * Use Handlebars-style template expressions.
     */
    _.templateSettings = {
        interpolate:   /\{\{(.+?)\}\}/g,
        escape:      /\{\{\{(.+?)\}\}\}/g
    };

    /**
     * Validate a field length, according to its "maxlength" attribute.
     */
    EmbeddedChat.validateFieldLength = function() {
        var $this     = $(this),
            val       = $this.val(),
            maxLength = $this.attr("maxlength");

        if (val.length > maxLength) {
            $this.val(val.substr(0, maxLength));
        }
    };

    /**
     * Whether this Embedded chat is open as a pop up.
     * (this method should be overwritten)
     */
    EmbeddedChat.isPopup = function() {
        return false;
    };

    /**
     * Check if its enable attachmant feature
     *
     * @return true if we should load MFE with attachments
     */
    EmbeddedChat.isAttachmentFeatureEnabled = function() {
        var features = ChatConfig.features || {};
        return features.chatAttachments
    };

    /**
     * Check if keep session alive feature is enabled
     * @returns {boolean} true if keep session alive feature is enabled
     */
    EmbeddedChat.keepSessionAliveFeatureEnabled = function() {
        var features = ChatConfig.features || {};
        return features.keepSessionAliveFeatureEnabled;
    };

    /**
     * Check browser is Safari
     * @returns {boolean}
     */
    EmbeddedChat.detectIsSafari = function() {
        try {
            var isSafariByVendor = !!navigator.vendor && navigator.vendor.indexOf('Apple') > -1; // NOSONAR
            var isSafariByUserAgent =
                navigator.userAgent
                && navigator.userAgent.indexOf('CriOS') === -1
                && navigator.userAgent.indexOf('FxiOS') === -1
                && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            var isSafariByFeatureDetection = !!document.requestStorageAccess && !!document.hasStorageAccess;

            return isSafariByVendor && isSafariByUserAgent && isSafariByFeatureDetection;
        } catch (e) {
            this.log("debug", `KSA - error checking if browser is Safari ${e}`);
            return false;
        }
    };

    /**
     * Check browser has access to local storage
     * @returns {boolean}
     */
    EmbeddedChat.hasAccessToLocalStorage = function() {
        try {
            var hasAccessToLocalStorage = !!window.localStorage;
            this.log("debug", `KSA - hasAccessToLocalStorage ${hasAccessToLocalStorage}`);
            return hasAccessToLocalStorage;
        } catch (e) {
            this.log("debug", `KSA - error checking access to local storage ${e}`);
            return false;
        }
    }

    /**
     * Check browser has access to cookies
     * In the case of Safari, it should check the specific API (WebKit Storage Access) for this as well
     * @returns {boolean}
     */
    EmbeddedChat.hasAccessToCookies = function() {
        try {
            var isSafari = this.detectIsSafari();
            var cookieEnabled = !!window.navigator.cookieEnabled;

            if (isSafari) {
                this.log("debug", `KSA - running Safari`);
            }

            this.log("debug", `KSA - hasAccessToCookies ${cookieEnabled}`);
            return !isSafari && cookieEnabled;
        } catch (e) {
            this.log("debug", `KSA - error checking acesss to cookies ${e}`);
            return false;
        }
    }

    EmbeddedChat.canPersistSessionData = function() {
        try {
            var hasAccessToLocalStorage = this.hasAccessToLocalStorage();
            var hasAccessToCookies = this.hasAccessToCookies();
            var canPersistSessionData = hasAccessToLocalStorage || hasAccessToCookies;
            this.log("debug", `KSA - canPersistSessionData ${canPersistSessionData}`);
            return canPersistSessionData;
        } catch (e) {
            return false;
        }
    }

    /**
     * Check can use keep session alive feature by taking into account the browser
     * It should be disabled for Safari (check VCC-70856)
     * @returns {boolean}
     */
    EmbeddedChat.canUseKeepSessionAlive = function() {
        try {
            var canPersistSessionData = !!this.canPersistSessionData();
            var isFeatureEnabled = !!this.keepSessionAliveFeatureEnabled()
            var canUseKeepSessionAlive = isFeatureEnabled && canPersistSessionData;

            this.log("debug", `KSA - canUseKeepSessionAlive ${canUseKeepSessionAlive}`);

            return canUseKeepSessionAlive;
        } catch (e) {
            return false;
        }
    };

    /**
     * Get the Time To Live value for the session alive feature
     * @returns {number} session alive TTL value
     */
    EmbeddedChat.sessionAliveTTLValue = function() {
        var features = ChatConfig.features || {};
        return features.sessionAliveTTLValue || '0';
    };

    /**
     * Get the default chat window size.
     *
     * @return the default chat window width and height
     */
    EmbeddedChat.getDefaultWindowSize = function() {
        const isNugen = EmbeddedChat.isNugenTemplate();
        return {
            width:  parseInt(this.windowProperties.width, 10),
            height: parseInt(isNugen ?
                this.windowProperties.nuGen.height.open :
                this.windowProperties.height.open,
                10
            )
        };
    };

    /**
     * Get the browser window chrome size (i.e. window decoration dimensions).
     *
     * @return the browser window chrome width and height
     */
    EmbeddedChat.getWindowChromeSize = function() {
        return {
            width:  window.outerWidth  - window.innerWidth,
            height: window.outerHeight - window.innerHeight
        };
    };

    /**
     * Get the browser window inner size.
     *
     * @return the browser window inner width and height
     */
    EmbeddedChat.getWindowInnerSize = function() {
        return {
            width:  window.innerWidth,
            height: window.innerHeight
        };
    };

    /**
     * Resize the chat window if it should auto-fit.
     *
     * @param $element      The stretchable chat element
     * @param shouldAutoFit Whether the chat window should auto-fit
     */
    EmbeddedChat.resizeWindow = function($element, shouldAutoFit) {
        // The windowProperties object is checked here to make sure that
        // we are not running inside a chat design preview window
        if (shouldAutoFit && this.windowProperties) {
            var defaultWindowSize = this.getDefaultWindowSize();
            var overflownSpace = $element.prop("scrollHeight") - $element.height();

            // some paddings/margins were changed and the height is miscalculated now
            // added this value to balance until finding a proper solution
            var extraHeight = 10;
            this.customWidth  = defaultWindowSize.width;
            this.customHeight = defaultWindowSize.height + overflownSpace + extraHeight;

            if (this.isPopup()) {
                var windowChromeSize = this.getWindowChromeSize();
                var newWindowWidth   = this.customWidth  + windowChromeSize.width;
                var newWindowHeight  = this.customHeight + windowChromeSize.height;

                window.resizeTo(newWindowWidth, newWindowHeight);

                // Set a timeout to get the actual new window size
                window.setTimeout(_.bind(function() {
                    var windowInnerSize = this.getWindowInnerSize();
                    var delta = this.customHeight - windowInnerSize.height;

                    if (delta > 0) {
                        // Window did not show up entirely, so try moving it to the top
                        window.moveBy(0, -delta);
                        window.resizeTo(newWindowWidth, newWindowHeight);
                    }

                    window.setTimeout(_.bind(function() {
                        this.customWidth  = windowInnerSize.width;
                        this.customHeight = windowInnerSize.height;
                    }, this), 0);
                }, this), 0);

            } else {
                var browserHeight = this.chatBrowserInfo.innerHeight;
                this.customHeight = this.customHeight > browserHeight ? browserHeight : this.customHeight;

                this.sendMessage("chat:resize", {
                    width:  this.customWidth + "px",
                    height: this.customHeight + "px"
                });
            }
        }
    };

    /**
     * Restore the popup window size.
     */
    EmbeddedChat.restorePopupSize = function() {
        var defaultWindowSize = this.getDefaultWindowSize();
        var windowChromeSize  = this.getWindowChromeSize();

        this.customWidth  = defaultWindowSize.width;
        this.customHeight = defaultWindowSize.height;

        window.resizeTo(this.customWidth + windowChromeSize.width, this.customHeight + windowChromeSize.height);
    };

    /**
     * Whether the chat can be resized.
     *
     * @param shouldAutoFit whether the chat window should auto-fit
     *
     * @return true if the chat can be resized, false otherwise
     */
    EmbeddedChat.canResize = function(shouldAutoFit) {
        var isSameWidth  = this.customWidth  === undefined || this.customWidth  == window.innerWidth;
        var isSameHeight = this.customHeight === undefined || this.customHeight == window.innerHeight;

        return shouldAutoFit && (this.isPopup() ? isSameWidth && isSameHeight : true);
    };

    /**
     * Recalculate the form height.
     *
     * @param shouldAutoFit whether the chat window should auto-fit
     */
    EmbeddedChat.recalculateHeight = function(shouldAutoFit) {
        var isNuGen = EmbeddedChat.isNugenTemplate();
        var $formList          = $(".js-form-list:visible"),
            $messageHistory    = $(".js-message-history:visible");

        if ($formList.length && !isNuGen) {
            this.resizeWindow($formList, this.canResize(shouldAutoFit));
        }

        if ($messageHistory.length) {
            if (this.isPopup() && this.canResize(shouldAutoFit)) {
                this.restorePopupSize();
            }
        }

    };

    /**
     * Reset the form list scroll.
     */
    EmbeddedChat.resetScroll = function() {
        $(".js-form-list").animate({ scrollTop: 0 }, "fast");
    };

    EmbeddedChat.toggleChatMenuClassesNugen = function({ $messageActions, $actions, isVisible }) {
        if (isVisible) {
            $messageActions.addClass(EmbeddedChat.CONSTANTS.MESSAGE_ACTIONS_ACTIVE_CLASS);
            $actions.css("visibility", "initial");
            window.requestAnimationFrame(function() {
                setTimeout(function() {
                    $actions.find(".action").first().focus();
                }, 400);
            });
        } else {
            $messageActions.removeClass(EmbeddedChat.CONSTANTS.MESSAGE_ACTIONS_ACTIVE_CLASS);
            $actions.css("visibility", "hidden");
        }
    }

    EmbeddedChat.toggleChatMenuClasses = function({ $messageActions, $actions, isVisible }) {
        const actionsPositionTop = -($actions.height() + 1) + "px";
        $messageActions.animate({top: isVisible ? actionsPositionTop : 0}, 300, 'swing', function() {
            // hide element after animation ends
            var positionTop = $messageActions.position() && Math.floor($messageActions.position().top);
            isVisible = positionTop === 0 ||  positionTop === -1;
            if (!isVisible) {
                $actions.css("visibility", "hidden");
            } else {
                $actions.find(".action").first().focus();
            }
        });
        $actions.css("visibility", "initial");
    }

    EmbeddedChat.showHideChatMenu = function($messageActions, $actions, event) {
        event.preventDefault && event.preventDefault();

        var isNuGen = EmbeddedChat.isNugenTemplate();
        let isVisible = false;

        if (isNuGen) {
            const hasActiveClass = $messageActions.hasClass(EmbeddedChat.CONSTANTS.MESSAGE_ACTIONS_ACTIVE_CLASS);
            isVisible = hasActiveClass ? false : true;
            this.toggleChatMenuClassesNugen({ $messageActions, $actions, isVisible });
        } else {
            isVisible =  Math.floor($messageActions.position().top) === 0;
            this.toggleChatMenuClasses({ $messageActions, $actions });
        }

        if (EmbeddedChat.i18n) {
            event.target.setAttribute("title", isVisible ? EmbeddedChat.i18n.t("pullDownInfo") : EmbeddedChat.i18n.t("pullUpInfo"));
            event.target.setAttribute("aria-label", isVisible ? EmbeddedChat.i18n.t("pullDownInfo") : EmbeddedChat.i18n.t("pullUpInfo"));
        }
    };

    /**
     * Setup the chat window.
     * @param {Boolean} [isPreviewMode=false] Whether to load the Guest Chat preview
     */
    EmbeddedChat.setupChatWindow = function(isPreviewMode = false) {
        var isNuGen = EmbeddedChat.isNugenTemplate();
        var $messageActions = $(".js-message-actions");
        var $previewWindow = $(".main" );
        var $actions = $messageActions.find(".js-actions");
        var $flagButton = $messageActions.find(".js-flag");

        if (isPreviewMode) {
            // load GuestChat if we are in preview mode
            this.setupReactAppForPreview($previewWindow);
        }

        if (isNuGen) {
            // Close actions drawer
            $actions.css("visibility", "hidden");
            // Setup actions
            $flagButton.click(this.showHideChatMenu.bind(this, $messageActions, $actions));
        } else {
            // Close actions drawer
            $messageActions.css("top", -($actions.height() + 1) + "px");
            $actions.css("visibility", "hidden");

            // Setup actions
            $flagButton.click(this.showHideChatMenu.bind(this, $messageActions, $actions));
        }
    };

    /**
     * Add support for required features unsupported by the client browser.
     *
     * @param [container] DOM element or jQuery object containing the elements to be supported
     */
    EmbeddedChat.modernize = function(container) {
        var $container = container ? $(container) : $("body");

        // Textarea maxlength
        if (!("maxLength" in document.createElement("textarea"))) {
            $container.find("textarea[maxlength]").on("keydown keyup focus blur", this.validateFieldLength);
        }
    };

    /**
     * Check if the UUID is using the NuGen template
     *
     * @param {string} uuid UUID of the template
     */
    EmbeddedChat.isNugenTemplate = function(uuid) {
        if (uuid) {
            return uuid.includes(EmbeddedChat.CONSTANTS.VERSION_PREFIX);
        }

        const isNuGen = document.querySelector('[data-chat-theme="nugen"]');
        return Boolean(isNuGen);
    };

    /**
     * Log the message to the browser console if it is available.
     *
     * @param {string} level the log level
     * @param {object?} arguments for the log
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

})(this, jQuery);

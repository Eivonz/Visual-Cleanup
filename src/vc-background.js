let manifest = browser.runtime.getManifest();
let allowedURLs = [];

const TITLE_APPLY = `Enable ${manifest.name} for `;
const TITLE_REMOVE = `Disable ${manifest.name} for `;
const APPLICABLE_PROTOCOLS = ["http:", "https:"];

// Names as specified in the manifest section content-scripts
const CSSFILES = {
    "Twitch" : ["vc-twitch.css"],
    "Youtube" : ["vc-youtube.css"]
};

function getCSSFiles(siteId) {
    if (Object.hasOwn(CSSFILES, siteId)) {
        return CSSFILES[siteId];
    }
    return false;
}

/*
    Get Title including site identifier as specified by the custom property "name" in the manifest section "content-scripts"
*/
async function getSiteTitle(tab) {
    
    var siteIdentifier = "";
    for await (const element of manifest.content_scripts) {
        if (Object.hasOwn(element, 'name')) {

            let tabs = await browser.tabs.query({ url: element.matches });
            if (tabs.findIndex(item => item.id == tab.id) > -1) {
                siteIdentifier = element.name;
                break;
            }
        }
    }

    return siteIdentifier;
}

async function toggleCleanup(tab) {

    let siteId = await getSiteTitle(tab);

    function gotTitle(title, siteId) {
        var CSSfiles = getCSSFiles(siteId);
        if (!CSSfiles) return false;

        if (title === TITLE_APPLY + siteId) {
            browser.pageAction.setIcon({tabId: tab.id, path: "icons/enabled.svg"});
            browser.pageAction.setTitle({tabId: tab.id, title: TITLE_REMOVE + siteId});
           
            // Manifest V3
            browser.scripting.insertCSS({
                target: {
                    tabId: tab.id
                },
                //css: CSS,
                files: CSSfiles
            });
    
        } else {
            browser.pageAction.setIcon({tabId: tab.id, path: "icons/disabled.svg"});
            browser.pageAction.setTitle({tabId: tab.id, title: TITLE_APPLY + siteId});

            // Manifest V3
            browser.scripting.removeCSS({
                target: {
                    tabId: tab.id
                },
                //css: CSS,
                files: CSSfiles
            });
        }
    }
    
    let gettingTitle = browser.pageAction.getTitle({tabId: tab.id});
    gettingTitle.then((title) => {
        gotTitle(title, siteId);
    });
}


/*
    Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
    Argument url must be a valid URL string.
*/
function protocolIsApplicable(url) {
    const protocol = (new URL(url)).protocol;
    return APPLICABLE_PROTOCOLS.includes(protocol);
}

/*
    Initialize the page action: set icon and title, then show.
    Only operates on tabs whose URL's protocol is applicable.
*/
async function initializePageAction(tab) {
    if (protocolIsApplicable(tab.url)) {

        let siteId = await getSiteTitle(tab);

        browser.pageAction.setIcon({tabId: tab.id, path: "icons/disabled.svg"});
        browser.pageAction.setTitle({tabId: tab.id, title: TITLE_APPLY + siteId});
        browser.pageAction.show(tab.id);
    }
}



/*
    Toggle CSS when the page action is clicked.
*/
browser.pageAction.onClicked.addListener(toggleCleanup);


/*
function handleUpdated(tabId, changeInfo, tabInfo) {
    if (tabInfo.status == "complete") {
//        console.log("tab status complete");
        toggleCSS(tabInfo);
    }

    console.log(`Updated tab: ${tabId}`);
    console.log("Changed attributes: ", changeInfo);
    console.log("New tab Info: ", tabInfo);

}
browser.tabs.onUpdated.addListener(handleUpdated);
*/

/*
Each time a tab is updated, reset the page action for that tab.
*/
/*
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});
*/



/*
    Single message handler to receive communication from content scripts
*/
function handleMessage(message, sender, sendResponse) {

    let tab = sender.tab;

    let respMessage = "";

    switch (message) {
        case "initialize-twitch": {

            initializePageAction(tab);
            toggleCleanup(tab);

            respMessage = `Twitch: Initializing ${manifest.name} for tab: ${tab.title}`;

        } break;
        case "initialize-youtube": {

            initializePageAction(tab);
            toggleCleanup(tab);

            respMessage = `Youtube: Initializing ${manifest.name} for tab: ${tab.title}`;

        } break;
        default:
            break;
    }

    sendResponse({ response: respMessage });
}
browser.runtime.onMessage.addListener(handleMessage);

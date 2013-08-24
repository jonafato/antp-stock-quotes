var info = {
    "poke": 3,
    "width": 2,
    "height": 1,
    "path": "widget.html",
    "v2": {
      "resize": false,
    },
    "v3": {
      "multi_placement": false,
    },
};

chrome.extension.onMessageExternal.addListener(function (request, sender, sendResponse) {
    if (request === "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-poke") {
        chrome.extension.sendMessage(
            sender.id,
            {
                head: "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-pokeback",
                body: info,
            }
        );
    }
});

function showAnswer(answer) {
  alert(answer ? 'Answer: ' + answer : 'Unable to find the answer!');
}

var cache = {};

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'quizlet-search-command',
    title: 'Quizlet Search: %s',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == 'quizlet-search-command') {
    var selectedText = info.selectionText;
    var savedAnswer = cache[selectedText];
    if (typeof savedAnswer === 'undefined') {
      // it ain't cached, let's fetch it
      chrome.tabs.sendMessage(
        tab.id,
        {
          text: 'report_back',
          query: info.selectionText
        },
        results => {
          if (typeof results.success !== 'undefined') {
            // cache it for future use
            var answer = results.success;
            cache[selectedText] = answer;
            showAnswer(answer)
          } else if (typeof results.verifyRequired !== 'undefined') {
            // don't do anything
          } else if (typeof results.error !== 'undefined') {
            // an error occurred while processing the given query
            alert(`An error occurred while processing the given query: ${results.error}`);
          } else {
            alert(`Unexpected callback response encountered: ${JSON.stringify(results, null, 2)}`)
          }
        }
      );
    } else {
      // it's cached, just show it
      showAnswer(savedAnswer);
    }
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  fetch(request.input, request.init).then(function(response) {
    return response.text().then(function(text) {
      sendResponse([{
        body: text,
        status: response.status,
        statusText: response.statusText,
      }, null]);
    });
  }, function(error) {
    sendResponse([null, error]);
  });
  return true;
});

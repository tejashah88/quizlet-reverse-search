chrome.contextMenus.create({
  id: 'quizlet-search-command',
  title: 'Quizlet Search: %s',
  contexts: ['selection']
})

function showAnswer(answer) {
  alert(answer ? "Answer: " + answer : "Unable to find the answer!")
}

var cache = {}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == 'quizlet-search-command') {
    var selectedText = info.selectionText
    var savedAnswer = cache[selectedText]
    if (typeof savedAnswer === "undefined") {
      // it ain't cached, let's fetch it
      chrome.tabs.sendMessage(
        tab.id,
        {
          text: 'report_back',
          query: info.selectionText
        },
        answer => {
          // cache it for future use
          cache[selectedText] = answer;
          showAnswer(answer)
        }
      )
    } else {
      // it's cached, just show it
      showAnswer(savedAnswer)
    }
  }
});

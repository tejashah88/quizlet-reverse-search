var maxResultsPerPage = 10

var searchUrl = query => `https://www.google.com/search?q=site:quizlet.com "${query}"&num=${maxResultsPerPage}`

function parseGoogleSearch(data) {
  var titleSel = 'div.r > a > h3'
  var linkSel = 'div.r > a'
  var descSel = 'span.st'
  var itemSel = 'div.g'

  var results = []
  var parsed = $(data)

  $(itemSel, parsed).each(function(i, elem) {
    results.push({
      title: $(titleSel, elem).text(),
      link: $(linkSel, elem).attr('href'),
      description: $(descSel, elem).text()
    })
  })

  return results
}

function verifySelfToGoogle(res) {
  alert("Google needs to check if you are a robot or not! I will open a new link to let you do the verification.")
  window.open(res.url);
  return []
}

function parseQuizletPage(data) {
  var questions = []
  var answers = []

  var parsed = $(data)
  $('.SetPageTerm-wordText', parsed).each(function(index, element) {
    questions.push($(this).text())
  })

  $('.SetPageTerm-definitionText', parsed).each(function(index, element) {
    answers.push($(this).text())
  })

  var package = questions.map((e, i) => ({ question: e, answer: answers[i] }))

  return package
}

var thresh = 0.2
var maxLength = 256

function fuseSearch(query, list) {
  var options = {
    shouldSort: true,
    tokenize: true,
    matchAllTokens: true,
    includeScore: true,
    threshold: thresh,
    location: 0,
    distance: 100,
    maxPatternLength: maxLength,
    minMatchCharLength: 1,
    keys: [ "question" ]
  }

  var fuse = new Fuse(list, options)
  var result = fuse.search(query)
  return result
}

function mostLikelyAnswer(answers) {
  var uniqueAnswers = Array.from(new Set(answers))
  var modeMap = {}

  for (var uniqAns of uniqueAnswers)
    modeMap[uniqAns] = answers.filter(ans => ans == uniqAns).length

  // most frequent item is on top, hence we do "b - a"
  var sortedAnswers = Object.keys(modeMap).sort((a,b) => modeMap[b] - modeMap[a])
  return sortedAnswers[0]
}

function searchDefinitions(query, callback) {
  var searchLink = searchUrl(query)
  fetch(searchLink)
    .then(res => res.ok ? res.text().then(parseGoogleSearch) : verifySelfToGoogle(res))
    .then(googleResults => googleResults.map(res => res.link))
    .then(quizletLinks => quizletLinks.map(link => fetch(link)))
    .then(promises => Promise.all(promises))
    .then(resArr => resArr.filter(res => res.ok))
    .then(filteredResArr => filteredResArr.map(res => res.text()))
    .then(unsetledTexts => Promise.all(unsetledTexts))
    .then(datas => datas.map(parseQuizletPage))
    .then(quizletResults => [].concat(...quizletResults))
    .then(searchableResults => fuseSearch(query, searchableResults))
    .then(finalResults => finalResults.map(res => res.item.answer))
    .then(rawAnswers => rawAnswers.map(ans => ans.toLowerCase()))
    .then(possibleAnswers => mostLikelyAnswer(possibleAnswers))
    .then(finalAnswer => callback(finalAnswer))
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text === 'report_back' && msg.query)
    searchDefinitions(msg.query, sendResponse)
  return true;
})

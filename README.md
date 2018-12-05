# quizlet-reverse-search
A chrome extension for searching questions or definitions of words on Quizlet to find the answer.

# Disclaimer
NOTICE: Do **not** rely on this extension to pass whatever test/quiz you have. I do not claim responsibility if you abuse this extension and get caught in the act. This extension is meant as an educational tool.

Aside from that, please keep in mind the following before you download this extension.
1. Sometimes Google will think that you are acting as a bot and will prompt you to verify yourself using a captcha. This is normal and probably in place to prevent actual bots from scraping the web autonomously.
2. Don't fully rely on the answers given by this extension. While it does its best to get what you want, you should take it with a grain of salt, for it could easily break if Quizlet decides to change its UI or there's not enough flashcards available to answer the query.
3. The extension shines when you give a query that's not too vauge nor too specific, as it relies on the exact wording in order to find the relevant flash cards. For example, a query that contains two sentences joined by 'and' or 'or', would work better if the individual parts were searched separately. Also, searching for 'What is my favorite color?' is obviously unlikely to give an objective answer.
4. It's best to avoid adding unnecessary words if you can help it. For example, it's better to query for 'the state bit that can be tested to see if the end of an input stream is encountered?' rather than 'Which of the following is the state bit that can be tested to see if the end of an input stream is encountered?'. The difference here is that 'Which of the following is' is only used for the sake of grammatical correctness and doesn't serve any value for the contents of the query itself.

# How to use
1. Load the extension as an unpacked extension
2. Select any text and right click it. You'll see a new context menu item called "Quizlet Search: ..."
3. After a few seconds, an alert dialog will popup with the most likely answer in the center of the screen.
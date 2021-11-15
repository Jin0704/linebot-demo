const line = require('@line/bot-sdk')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
//create LINE SDK config from env
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

//create line sdk client
const client = new line.Client(config)


// register a webhook handler with middleware
app.post('/callback', line.middleware(config), (req, res) => {
  console.log(req.body)
  Promise
    .all(req.body.events.map(handleEvent))  //map 用function handleEvent來處理
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err)
      res.status(500).end()
    })
})

//event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text }

  //use reply api
  return client.replyMessage(event.replyToken, echo)
}

app.listen(port, () => {
  console.log(`listening on ${port}`)
})
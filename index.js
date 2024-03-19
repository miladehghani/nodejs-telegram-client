const { TelegramClient } = require("telegram");
const { NewMessage } = require("telegram/events");
const fs = require("fs");

const { StringSession } = require("telegram/sessions");
const input = require("input");
require("dotenv").config();
const sessionString = process.env.token;

const apiId = 17349;
const apiHash = "344583e45741c457fe1862106095a5eb";
const stringSession = new StringSession(sessionString); // fill this later with the value from session.save()

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  if (sessionString) await client.connect();
  else {
    await client.start({
      phoneNumber: async () => await input.text("Please enter your number: "),
      password: async () => await input.text("Please enter your password: "),
      phoneCode: async () =>
        await input.text("Please enter the code you received: "),
      onError: (err) => console.log(err),
    });
    fs.writeFileSync(".env", `token=${client.session.save()}`); // Save this string to avoid logging in again
  }
  console.log("You should now be connected.");
  client.addEventHandler(console.log, new NewMessage({}));
})();

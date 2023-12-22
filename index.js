// import fetch from 'node-fetch';
import * as cheerio from "cheerio";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const getAmazonProduct = async () => {
  try {
    const url = process.env.PRODUCT_URL;
    const headers = {
      "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      "Accept-Language": "en-US, en;q=0.5",
    };
    const response = await axios.get(url, { headers });
    var $ = cheerio.load(response.data);
    const priceElement = $("span.a-price-whole").first();
    const priceText = priceElement.text().replace(",", "");
    const sellerElement = $("span.a-size-small.tabular-buybox-text-message").eq(1);
    const sellerText = sellerElement.text();
    let SendMessage = "";
    SendMessage =
      priceText === "" || sellerText === ""
        ? "Product does not found or seller does not found"
        : `Product Price :${priceText} Product Seller : ${sellerText}`;
    if (parseInt(priceText.replace('.','')) < parseInt(process.env.CONTROL_PRICE) && sellerText !=""){
      setOptions(SendMessage);
    }
  } catch (error) {
    setOptions(error);
    console.log(error);
  }
};
const setOptions = (sendMessage) => {
  const options = {
    method: "POST",
    url: `https://api.telegram.org/${process.env.BOT_TOKEN}/sendMessage`,
    headers: {
      accept: "application/json",
      "User-Agent":
        "Telegram Bot SDK - (https://github.com/irazasyed/telegram-bot-sdk)",
      "content-type": "application/json",
    },
    data: {
      text: sendMessage,
      disable_web_page_preview: false,
      disable_notification: false,
      reply_to_message_id: null,
      chat_id: process.env.chat_id,
    },
  };
  axios(options)
    .then((response) => {
      // console.log('Telegram API Response:', response.data);
    })
    .catch((error) => {
      console.error("Telegram API Error:", error.message);
    });
};

setInterval(() => {
  getAmazonProduct();
}, 1800000);

getAmazonProduct();

import axios from "axios";
import { ChainEnum } from "./enum_all";

export async function sendemail(
  chain_id: number,
  contract: string,
  order_id: number
) {
  if (
    process.env.NODE_ENV == "production" ||
    process.env.NODE_ENV == "development"
  ) {
    try {
      const url = process.env.SEND_EMAIL_URL;
      const data = {
        chain_id: chain_id,
        contract: contract,
        order_id: order_id,
      };

      const response = await axios.post(url!, data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
}

export async function notice_bot(chain_id: number, name: string, user: string) {
  const a = ChainEnum[chain_id];
  if (process.env.NODE_ENV == "development") {
    let url =
      " https://api.telegram.org/bot6753397970:AAGd0t3JyjNyvthf7pO14nL6R8zC_vIW1I0/sendMessage?chat_id=-1002144169559&text=";
    url =
      url +
      "市场订单: 用户 " +
      user +
      "在" +
      a.toString() +
      "链上发布了一个新商品： " +
      name;
    const response = await axios.get(url);
    console.log(response.data);
  }
  if (process.env.NODE_ENV == "production") {
    let url =
      " https://api.telegram.org/bot6753397970:AAGd0t3JyjNyvthf7pO14nL6R8zC_vIW1I0/sendMessage?chat_id=-1001814533790&text=";
    url =
      url +
      "市场订单: 用户 " +
      user +
      "在" +
      a.toString() +
      "链上发布了一个新商品： " +
      name;
    const response = await axios.get(url);
    console.log(response.data);
  }
}

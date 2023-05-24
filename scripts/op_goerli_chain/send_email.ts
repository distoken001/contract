import axios from "axios";

export async function sendemail(
  chain_id: number,
  contract: string,
  order_id: number
) {
  if (process.env.NODE_ENV == "production"||process.env.NODE_ENV == "development") {
    try {
      const url =process.env.SEND_EMAIL_URL;
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

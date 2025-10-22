import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// 💡 Твой настоящий backend
const BACKEND_URL = "http://188.94.158.71:8001/api/v1";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { path = [] } = req.query;
    const targetUrl = `${BACKEND_URL}/${
      Array.isArray(path) ? path.join("/") : path
    }`;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization
          ? { Authorization: req.headers.authorization }
          : {}),
      },
      params: req.method === "GET" ? req.query : undefined,
      data: req.method !== "GET" ? req.body : undefined,
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error("❌ Proxy error:", error.message);
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: error.message });
  }
}

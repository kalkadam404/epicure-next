import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { path = [], ...queryParams } = req.query;
    let targetUrl = `${BACKEND_URL}/${
      Array.isArray(path) ? path.join("/") : path
    }`;

    // Django expects trailing slashes when APPEND_SLASH is enabled
    if (req.method && req.method !== "GET" && !targetUrl.endsWith("/")) {
      targetUrl = `${targetUrl}/`;
    }

    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization
          ? { Authorization: req.headers.authorization }
          : {}),
      },
      params: req.method === "GET" ? queryParams : undefined,
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

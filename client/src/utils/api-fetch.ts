import localSpace from "@/services/local-space";

type ApiFetchOptions<TBody> = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  headers?: HeadersInit;
};

/**
 * API fetch wrapper
 * -----------------
 * just give the url and the method and it will return the response
 */
export async function apiFetch<TResponse, TBody = undefined>({
  url,
  method = "GET",
  body,
  headers = {},
}: ApiFetchOptions<TBody>): Promise<TResponse> {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message ?? "Something went wrong");
    }

    return data as TResponse;
  } catch (error) {
    // 🚨 Network / CORS / Server down
    if (error instanceof TypeError) {
      throw new Error("Unable to connect to server. Server is Down.");
    }

    throw error;
  }
}

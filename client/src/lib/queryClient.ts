import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const baseUrl = queryKey[0] as string;
    const params = queryKey.slice(1).filter(p => p !== undefined && p !== null);
    
    let url = baseUrl;
    if (params.length > 0) {
      if (baseUrl.includes("/api/anime/search")) {
        url = `${baseUrl}?q=${encodeURIComponent(params[0] as string)}${params[1] ? `&page=${params[1]}` : ""}`;
      } else if (baseUrl.includes("/api/anime/top")) {
        url = `${baseUrl}?filter=${params[0] || "bypopularity"}${params[1] ? `&page=${params[1]}` : ""}`;
      } else if (baseUrl.includes("/api/anime/browse")) {
        url = `${baseUrl}?${params[0] || ""}`;
      } else if (baseUrl === "/api/anime") {
        url = `${baseUrl}/${params[0]}${params[1] ? `/${params[1]}` : ""}`;
      } else {
        url = params.length > 0 ? `${baseUrl}/${params.join("/")}` : baseUrl;
      }
    }

    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});

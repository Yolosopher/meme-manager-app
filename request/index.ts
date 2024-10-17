type RequestParams = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  token?: string;
};

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  error?: string;
  tokenExpiredOrBroken?: boolean;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL! as string;

async function request<T>({
  url,
  method,
  body,
  token,
}: RequestParams): Promise<SuccessResponse<T> | ErrorResponse> {
  const params: any = {
    method: method || 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  } as RequestInit;

  // handle body and headers
  if (body) {
    if (body instanceof FormData) {
      // params.headers['Content-Type'] = 'multipart/form-data';
      delete params.headers['Content-Type'];
      params.body = body;
    } else {
      params.body = JSON.stringify(body);
      params.headers['Content-Type'] = 'application/json';
    }
  }

  // handle auth
  if (token) {
    params.headers['Authorization'] = `Bearer ${token}`;
  }
  try {
    const response = await fetch(`${API_URL}${url}`, params);

    if (!url.includes('login') && response.status === 401) {
      throw new Error('Unauthorized');
    }

    const json = await response.json();

    if (!response.ok) {
      return {
        success: false,
        ...json,
      } as ErrorResponse;
    }

    return {
      success: true,
      data: json as T,
    };
  } catch (error: any) {
    console.log(error);
    if (error.message === 'Unauthorized') {
      return {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
        tokenExpiredOrBroken: true,
      } as ErrorResponse;
    }
    return {
      message: 'An error occurred',
      error: error.message,
      statusCode: 500,
    } as ErrorResponse;
  }
}

export default request;

import tools from '@/util/tools';

export default {
  fetchJson: async (url: string, method?:string, body?: Record<string, any> | FormData | null, useDefaultHeaders = true, isBodyFormData = false) => {
    let apiPath = url;
    method = method || (body ? 'POST' : 'GET');
    // 設定Header
    const exHeaders: Record<string, string> = {};
    const faToken = tools.getCookie('FEEC-FA-TOKEN');
    if (faToken) exHeaders['Authorization'] = 'Bearer ' + faToken;

    const options: RequestInit = {
      method,
      headers: useDefaultHeaders ? Object.assign(
        {
          'content-Type': 'application/json',
        },
        exHeaders
      ) : exHeaders,
    };

    if(body){
      if(isBodyFormData && body instanceof FormData){
        options.body = body
      }else{
        options.body = JSON.stringify(body)
      }
    }

    return await fetch(apiPath, options).then((res) => res.json()).catch(() => null);
  },
}
import { environment } from '../../environments/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchChatAll = (): Promise<any> =>
  new Promise((resolve) => {
    fetch(`${environment.apiUrl}/api/chat`)
      .then((response) => response.json())
      .then((data) => resolve(data));
  });

export default fetchChatAll;

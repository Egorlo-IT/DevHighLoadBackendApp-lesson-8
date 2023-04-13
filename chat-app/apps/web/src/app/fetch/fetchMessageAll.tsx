import { environment } from '../../environments/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchMessageAll = (): Promise<any> =>
  new Promise((resolve) => {
    fetch(`${environment.apiUrl}/api/chat-message/all`)
      .then((response) => response.json())
      .then((data) => resolve(data));
  });

export default fetchMessageAll;

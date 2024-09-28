import React from 'react';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  language_code: string;
}

interface InitDataUnsafe {
  query_id: string;
  user: User;
  auth_date: number;
  hash: string;
}

const UserInfo: React.FC = () => {
  // Destructure only initDataUnsafe, ignoring initData to avoid the warning
  const [initDataUnsafe] = useInitData() as readonly [InitDataUnsafe | undefined, unknown];

  if (!initDataUnsafe) {
    return <div>No initialization data available. Please ensure you are using the Telegram app.</div>;
  }

  const user = initDataUnsafe.user;

  if (!user) {
    return <div>No user data available. Initialization data: {JSON.stringify(initDataUnsafe)}</div>;
  }

  return (
    <div>
      <p>User ID: {user.id}</p>
    </div>
  );
};

export default UserInfo;

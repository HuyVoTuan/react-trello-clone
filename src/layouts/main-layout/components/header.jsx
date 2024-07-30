// UI lib
import { Avatar, Badge } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function Header() {
  return (
    <div className="flex h-[5rem] w-full items-center justify-between bg-sky-600 p-4">
      <div
        id="header__logo"
        className="absolute left-1/2 h-[3rem] w-[8rem] -translate-x-1/2 transform"
      ></div>
      <div className="ml-auto">
        <Badge dot>
          <Avatar icon={<UserOutlined />} />
        </Badge>
      </div>
    </div>
  );
}

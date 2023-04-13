import { MouseEvent, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as IconDashboard } from '../../../assets/image/icons/dashboard.svg';
import { ReactComponent as IconChat } from '../../../assets/image/icons/chat.svg';
import { ReactComponent as IconPerson } from '../../../assets/image/icons/person.svg';
import { ReactComponent as IconApps } from '../../../assets/image/icons/apps.svg';
import { ReactComponent as Logout } from '../../../assets/image/icons/logout.svg';
import { ReactComponent as Login } from '../../../assets/image/icons/login.svg';
import { ReactComponent as AddUser } from '../../../assets/image/icons/person-add.svg';
import './Header.scss';
import { AppContext } from '../../context/Context';
import { environment } from 'apps/web/src/environments/environment';

const Header = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const handleLinkClick = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
  ) => {
    const el = e.target as Element;
    if (el.classList.contains('link')) {
      document.querySelectorAll('.link').forEach((el) => {
        el.className = 'link';
      });
      el.className = 'link active';
    }
  };

  const logOut = () => {
    const requestOptions = {
      method: 'POST',
    };
    fetch(`${environment.apiUrl}/api/auth/logout`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        if (result) {
          context.setAuthenticated(false);
          navigate('/login');
        }
      })
      .catch((error) => console.log('error', error));
  };

  return (
    <div className="header sm-col-12 col-lg-3">
      {context.authenticated && (
        <>
          {context.user.avatar ? (
            <img
              style={{ objectFit: 'cover' }}
              src={environment.apiUrl + context.user.avatar}
              className="bi d-block mx-auto mb-2 mt-3 rounded-circle"
              width="96"
              height="96"
              alt="avatar"
            />
          ) : (
            <svg
              className="bi d-block mx-auto mb-1"
              width="96"
              height="96"
              fill="grey"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>
          )}

          <div className="user-fullname text-center mb-5">
            {context.user.firstName} {context.user.lastName}
          </div>
        </>
      )}
      <div className="header-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link
              to="/"
              onClick={(e) => {
                handleLinkClick(e);
              }}
              className="link active"
            >
              <div className="vline" />
              <IconDashboard className="icon me-3  " />
              Главная
            </Link>
          </li>

          <li className="nav-item mt-5">
            <Link
              to="/chat"
              onClick={(e) => {
                handleLinkClick(e);
              }}
              className="link"
            >
              <div className="vline" />
              <IconChat className="icon me-3" />
              Чат
            </Link>
          </li>
          <li className="nav-item mt-5">
            <Link
              to="/about"
              onClick={(e) => {
                handleLinkClick(e);
              }}
              className="link"
            >
              <div className="vline" />
              <IconApps className="icon me-3" /> О приложении
            </Link>
          </li>

          {!context.authenticated ? (
            <>
              <li className="nav-item mt-5">
                <Link
                  to="/login"
                  onClick={(e) => {
                    handleLinkClick(e);
                  }}
                  className="link"
                >
                  <div className="vline" />
                  <Login className="icon me-3  " />
                  Авторизоваться
                </Link>
              </li>
              <li className="nav-item mt-5">
                <Link
                  to="/register"
                  onClick={(e) => {
                    handleLinkClick(e);
                  }}
                  className="link"
                >
                  <div className="vline" />
                  <AddUser className="icon me-3  " />
                  Регистрация
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item mt-5">
                <Link
                  to="/profile"
                  onClick={(e) => {
                    handleLinkClick(e);
                  }}
                  className="link"
                >
                  <div className="vline" />
                  <IconPerson className="icon me-3" />
                  Профиль
                </Link>
              </li>
              <li className="nav-item logout mt-5" onClick={logOut}>
                <Logout className="icon me-3 " />
                Выйти
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;

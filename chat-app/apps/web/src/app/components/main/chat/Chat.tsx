import { FormEvent, useContext, useEffect, useState, MouseEvent } from 'react';
import Modal from 'react-modal';
import { Container, Row } from 'react-bootstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Moment from 'react-moment';

import { Action, Colors, CustomStyles } from '../../../utils/Utils';
import { ReactComponent as Plus } from '../../../../assets/image/icons/plus.svg';
import { CreateChatForm } from '../../interfaces/Intefaces';
import { AppContext } from '../../../context/Context';
import { environment } from 'apps/web/src/environments/environment';
import fetchChatAll from '../../../fetch/fetchChatAll';

import ChatMessage from './chat-message/ChatMessage';

import './Chat.scss';

const Chat = () => {
  const context = useContext(AppContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [customStyles] = useState(CustomStyles);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [itemsChat, setItemsChat] = useState([] as any[]);
  const [chatCurrId, setChatCurrId] = useState('');
  const [chatCurrCreatedAt, setChatCurrCreatedAt] = useState('');
  const [chatCurrTitle, setChatCurrTitle] = useState('');

  const openModal = (
    Action: { mess: string; color: string },
    error?: string
  ) => {
    customStyles.content.backgroundColor = Action.color;
    setMessage(Action.mess + (error !== '' ? error : ''));
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const showSkeleton = () => {
    return (
      <>
        {Array(4)
          .fill(0)
          .map((_, index) => {
            return (
              <div key={index} className="chat-item mb-3">
                <SkeletonTheme baseColor="#ccc" highlightColor="#fff">
                  <div className="card-body">
                    <div className="wrap chat-wrap p-4">
                      <Skeleton
                        width={54}
                        height={54}
                        style={{ borderRadius: '50%' }}
                      />
                      <Skeleton className="ms-2" width={200} height={24} />
                    </div>
                  </div>
                </SkeletonTheme>
              </div>
            );
          })}
      </>
    );
  };

  const openChat = async (event: MouseEvent) => {
    document.querySelectorAll('.chat-item').forEach((el) => {
      el.className = 'chat-item mb-3';
    });
    const target = event.currentTarget;
    const elCurrentChatItem = target.closest('.chat-item');

    elCurrentChatItem?.classList.add('blue-linear');
    const elCurrentChatTitle = elCurrentChatItem?.querySelector('.chat-title');

    const chatId = elCurrentChatItem?.getAttribute('data-id-chat');
    const chatCreateDate = elCurrentChatItem?.getAttribute('data-date-create');
    const chatTitle = elCurrentChatTitle?.textContent;

    setChatCurrId(chatId ? chatId : '');
    setChatCurrCreatedAt(chatCreateDate ? chatCreateDate : '');
    setChatCurrTitle(chatTitle ? chatTitle : '');
  };

  const showCards = () => {
    return (
      <>
        {itemsChat.map((item, index) => {
          return (
            <div
              onClick={openChat}
              key={index}
              className="chat-item mb-3"
              data-id-chat={item.id}
              data-date-create={item.createdAt}
            >
              <div className="card-body">
                <div className="wrap chat-wrap p-4">
                  <img
                    style={{ objectFit: 'cover' }}
                    src={environment.apiUrl + item.user?.avatar}
                    className="bi d-block me-2 rounded-circle"
                    width="48"
                    height="48"
                    alt="avatar"
                  />
                  <div className="mt-2">
                    <h6 className="user-fullname card-subtitle">
                      {item.user?.firstName} {item.user?.lastName}
                    </h6>
                    <span className="date-create-chat card-subtitle text-muted">
                      <Moment format="DD.MM.YYYY HH:mm">
                        {item.createdAt}
                      </Moment>
                    </span>
                  </div>
                </div>
                <h4 className="chat-title text-muted text-truncate">
                  {item.title}
                </h4>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const showCurrAuthorMessage = () => {
    const chatCurr = itemsChat.filter((item) => item.id === chatCurrId);

    return (
      <section className="section-messages">
        <div className="owner-chat-block mb-1">
          {chatCurr &&
            chatCurr.map((chat) => (
              <div key={chat.id}>
                <div className="wrap chat-wrap p-4">
                  <img
                    style={{ objectFit: 'cover' }}
                    src={environment.apiUrl + chat.user?.avatar}
                    className="bi d-block me-2 rounded-circle"
                    width="48"
                    height="48"
                    alt="avatar"
                  />
                  <div className="mt-2">
                    <h6 className="user-fullname card-subtitle">
                      {chat.user?.firstName} {chat.user?.lastName}
                    </h6>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <ChatMessage
          chatCurrId={chatCurrId}
          chatCurrTitle={chatCurrTitle}
          chatCurrCreatedAt={chatCurrCreatedAt}
        />
      </section>
    );
  };

  const noChat = () => {
    return <h2 className="text-center text-muted">Чатов нет</h2>;
  };

  const createChat = () => {
    const elFormCreateChat = document.querySelector('.form-create-chat');
    elFormCreateChat?.classList.toggle('hidden');
  };

  const handleSubmit = (event: FormEvent<CreateChatForm>) => {
    event.preventDefault();
    const resetForm: HTMLFormElement | null =
      document.querySelector('.chat-form');

    const target = event.currentTarget.elements;
    const title = target.title.value;

    if (title !== '') {
      const raw = JSON.stringify({
        title: title,
        authorId: context.user.id,
      });

      const myHeaders = new Headers();
      myHeaders.append('Authorization', 'Bearer ' + context.accessToken);
      myHeaders.append('Content-Type', 'application/json');

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };
      const url = `${environment.apiUrl}/api/chat/create`;

      fetch(url, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const data = JSON.parse(result);
          if (data?.statusCode === 401) {
            openModal(Action.ERROR, 'Вы не авторизованы!');
            return;
          }

          fetch(`${environment.apiUrl}/api/chat`)
            .then((response) => response.json())
            .then((data) => setItemsChat(data.chat));

          openModal(Action.SUCCESS, 'Чат успешно создан');
          resetForm?.reset();
        })
        .catch((error) => {
          openModal(Action.ERROR, error);
        });
    } else {
      openModal(Action.ERROR, 'Введите название чата');
    }
  };

  useEffect(() => {
    fetchChatAll().then((data) => {
      setItemsChat(data.chat);
    });
  }, []);

  return (
    <div className="chat">
      <Container>
        <Modal
          style={customStyles}
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Chat Modal"
        >
          <h5
            className="m-0 p-4"
            style={{
              cursor: 'none',
              color: Colors.BLACK,
              fontWeight: '300',
            }}
          >
            {message}
          </h5>
          <i
            className="fa-solid fa-xmark me-2 text-end mt-2 fixed-top"
            onClick={closeModal}
            role="button"
          ></i>
        </Modal>
        <Row className="d-flex justify-content-center">
          <section className="chat-section col-md-12 col-md-6 col-xl-5">
            <div className="wrap chat-group">
              <div className="title">Чат</div>
              {context.authenticated ? (
                <div className="wrap group-v">
                  <button onClick={createChat} className="btn-create-chat">
                    <Plus className="icon-chat" /> Создать чат
                  </button>
                  <div className="form-create-chat hidden">
                    <form className="chat-form" onSubmit={handleSubmit}>
                      <input
                        className="chat-title-create form-control form-control-lg mb-1"
                        id="title"
                        type="text"
                        name="title"
                        placeholder="Введите название"
                      />
                      <button
                        id="btnCreateChat"
                        type="submit"
                        className="btn btn-lg btn-blue mt-2"
                      >
                        Создать
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="chat-mess-no-auth text-muted ms-5">
                  Создавать чат и отправлять сообщения могут только
                  авторизованные пользователи
                </div>
              )}
            </div>
            <div className="wrap chat-list mt-5">
              {itemsChat.length > 0
                ? showCards()
                : itemsChat.length === 0
                ? noChat()
                : showSkeleton()}
            </div>
          </section>
          <section className="message-section col-md-12 col-md-6 col-xl-7">
            <hr className="d-block d-lg-block d-xl-none" />
            {chatCurrId && showCurrAuthorMessage()}
          </section>
        </Row>
      </Container>
    </div>
  );
};

export default Chat;

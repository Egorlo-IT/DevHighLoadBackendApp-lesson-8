import { FormEvent, useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Socket, io } from 'socket.io-client';

import { environment } from 'apps/web/src/environments/environment';
import { ReactComponent as Navigation } from '../../../../../assets/image/icons/navigation-2.svg';
import { CreateMessageForm } from '../../../interfaces/Intefaces';
import { AppContext } from 'apps/web/src/app/context/Context';
import { Action, Colors, CustomStyles } from 'apps/web/src/app/utils/Utils';

import './ChatMessage.scss';
import { DefaultEventsMap } from '@socket.io/component-emitter';

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChatMessage = (props: any) => {
  const context = useContext(AppContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [customStyles] = useState(CustomStyles);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messageList, setMessageList] = useState([] as any);
  const [message, setMessage] = useState('');

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

  const handleSubmit = (event: FormEvent<CreateMessageForm>) => {
    event.preventDefault();

    const resetForm: HTMLFormElement | null =
      document.querySelector('.message-form');
    const target = event.currentTarget.elements;
    if (target.message.value !== '') {
      socket.emit('addMessage', {
        idChat: props.chatCurrId,
        message: target.message.value,
      });

      resetForm?.reset();
    } else {
      openModal(Action.ERROR, 'Введите текст сообщения');
    }
  };

  useEffect(() => {
    const socketOptions = {
      query: {
        chatId: props.chatCurrId,
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: 'Bearer ' + context.accessToken,
          },
        },
      },
    };
    socket = io(`${environment.apiUrl}/`, socketOptions);

    socket.emit('getMessage', {
      idChat: props.chatCurrId,
      chatCurrTitle: props.chatCurrTitle,
      chatCurrCreatedAt: props.chatCurrCreatedAt,
    });

    socket.on('refreshMessage', (messages) => {
      setMessageList(messages);
    });

    socket.on('newMessage', () => {
      socket.emit('getMessage', {
        idChat: props.chatCurrId,
        chatCurrTitle: props.chatCurrTitle,
        chatCurrCreatedAt: props.chatCurrCreatedAt,
      });
    });

    return () => {
      socket.off('refreshMessage');
      socket.off('newMessage');
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.chatCurrId]);

  useEffect(() => {
    setMessageList(messageList);
  }, [messageList]);

  return (
    <div className="chat-messages">
      <Modal
        style={customStyles}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Login Modal"
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
      <div className="messages-chat-block">
        {Array.isArray(messageList) && messageList?.length !== 0 ? (
          <div>
            {messageList.map((item) => (
              <div key={item.id}>
                <div className="wrap message-wrap messsage-item p-4 mt-3 ">
                  <img
                    style={{ objectFit: 'cover' }}
                    src={environment.apiUrl + item.user?.avatar}
                    className="bi d-block me-2 rounded-circle"
                    width="48"
                    height="48"
                    alt="avatar"
                  />
                  <div className="mt-2">
                    <h6 className="card-subtitle">{item.message}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="m-auto">Сообщений нет</div>
        )}

        {context.authenticated && (
          <>
            <hr className="mt-4" />
            <form className="message-form wrap" onSubmit={handleSubmit}>
              <input
                className="chat-title-create form-control form-control-lg me-4"
                id="message"
                type="text"
                name="message"
                placeholder="Введите текст сообщения"
              />
              <button id="btnMessage" type="submit" className="btn btn-lg">
                <Navigation className="icon-navigation" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

interface LoginUserElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface RegisterUserElements extends HTMLFormControlsCollection {
  firstName: HTMLInputElement;
  lastName: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
  passwordRepeat: HTMLInputElement;
  avatar: HTMLInputElement;
}

interface CreateChatElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  description: HTMLInputElement;
  authorId: HTMLInputElement;
}

interface CreateMessageElements extends HTMLFormControlsCollection {
  message: HTMLInputElement;
}

export interface LoginUserForm extends HTMLFormElement {
  readonly elements: LoginUserElements;
}

export interface RegisterUserForm extends HTMLFormElement {
  readonly elements: RegisterUserElements;
}

export interface CreateMessageForm extends HTMLFormElement {
  readonly elements: CreateMessageElements;
}

export interface CreateChatForm extends HTMLFormElement {
  readonly elements: CreateChatElements;
}

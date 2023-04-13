import { Container, Row } from 'react-bootstrap';
import Header from './components/header/Header';
import Main from './components/main/Main';
import AppContextProvider from './context/Context';

const App = () => {
  return (
    <AppContextProvider>
      <Container className="container-fluid mw-100">
        <Row>
          <Header />
          <Main />
        </Row>
      </Container>
    </AppContextProvider>
  );
};

export default App;

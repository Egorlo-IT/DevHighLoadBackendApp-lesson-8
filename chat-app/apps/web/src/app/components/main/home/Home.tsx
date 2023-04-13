import './Home.scss';
const Home = () => {
  return (
    <div className="home">
      <h3 className="title">GeekBrains</h3>
      <h5>
        Факультет: <span className="text-muted">Fullstack JavaScript</span>
      </h5>
      <h1 className="mt-5">Разработка высоконагруженных бэкэнд-приложений</h1>
      <h3 className="mb-5">Курсовая работа</h3>

      <h5>
        Автор: <span className="text-muted">Коробейников Егор Анатольевич</span>
      </h5>
    </div>
  );
};

export default Home;

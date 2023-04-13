import './About.scss';

const About = () => {
  return (
    <div className="about">
      <h3 className="title">О приложении</h3>
      <h3 className="stack-tech mt-5 mb-3">Стек технологий:</h3>
      <ul>
        <h5 className="stack-tech-name">Фронтэнд</h5>
        <li className="mt-1">React</li>
        <li>Socket.io-client</li>
      </ul>
      <ul>
        <h5 className="stack-tech-name">Бэкэнд</h5>
        <li className="mt-1">Nest.js</li>
        <li>Socket.io</li>
        <li>MongoDb</li>
        <li>Redis</li>
      </ul>
    </div>
  );
};

export default About;

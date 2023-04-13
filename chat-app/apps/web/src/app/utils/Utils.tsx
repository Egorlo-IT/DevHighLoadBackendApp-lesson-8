export const Colors = {
  RED: '#ff3366',
  GREEN: 'rgb(131 181 166 / 74%)',
  BLUE: '#2a8bf2',
  BLACK: '#212529',
  GRAY: '#707c97',
  WHITE: '#fff',
};

export const Action = {
  SUCCESS: {
    mess: '',
    color: Colors.GREEN,
  },
  ERROR: {
    mess: '',
    color: Colors.RED,
  },
};

export const CustomStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: Colors.BLUE,
    color: Colors.BLACK,
    fontFamily: 'Roboto',
    fontSize: '20px',
  },
};

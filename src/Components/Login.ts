import Component from '../lib/Component';
import Elements from '../lib/Elements';

class LoginComponent extends Component {
  constructor() {
    super({
      name: 'Login',
      model: {},
    });
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    const LoginContainer = document.createElement('div');
    LoginContainer.appendChild(
      Elements.createHeader({
        textContent: 'Welcome to this page',
      }),
    );
    return LoginContainer;
  }
}

export default LoginComponent;

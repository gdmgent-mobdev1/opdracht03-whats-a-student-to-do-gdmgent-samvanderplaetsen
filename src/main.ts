import './css/style.css';
import { LoginComponent } from './Components';

const login = new LoginComponent();

const appContainer = document.querySelector<HTMLDivElement>('#app')!;

appContainer.appendChild(login.render());

// submit button nog html and css maken

const initApp = () => {
  const $submitButton = document.querySelector('#login');

  $submitButton?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('test');
    // firebase login code
    // login geslaagd loggen fzo en firebase fixen
  });
};

window.addEventListener('load', initApp);

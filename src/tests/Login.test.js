import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import Login from '../pages/Login';
import { act } from 'react-dom/test-utils';

const inputGravatarEmail = 'input-gravatar-email';
const inputPlayerName = 'input-player-name';
const btnPlay = 'btn-play';

describe('Testa a página de Login', () => {
  test('Se os inputs e o botão são renderizados', () => {
    renderWithRouterAndRedux(<Login/>);
    const emailInput = screen.getByTestId(inputGravatarEmail);
    const player = screen.getByTestId(inputPlayerName);
    const buttonPlay = screen.getByTestId(btnPlay);

    expect(emailInput).toBeInTheDocument();
    expect(player).toBeInTheDocument();
    expect(buttonPlay).toBeInTheDocument();
    expect(buttonPlay.disabled).toBe(true);
  });
  
  test('Se ao escrever nos inputs, o botão é habilitado', () => {
    const{history}=renderWithRouterAndRedux(<Login />);
    const emailInput = screen.getByTestId(inputGravatarEmail);
    const player = screen.getByTestId(inputPlayerName);
    const buttonPlay = screen.getByTestId(btnPlay);
    expect(buttonPlay.disabled).toBe(true);
    userEvent.type(emailInput, 'trybe@teste.com');
    expect(buttonPlay.disabled).toBe(true);
    userEvent.type(player, 'player');
    expect(buttonPlay.disabled).toBe(false);

  });

  test(
    'Se após o clique do botão existe uma chave token no localStorage ',
    async () => {
      renderWithRouterAndRedux(<Login/>);

      const emailInput = screen.getByTestId(inputGravatarEmail);
      const player = screen.getByTestId(inputPlayerName);
      const buttonPlay = screen.getByTestId(btnPlay);

      userEvent.type(emailInput, 'trybe@teste.com');
      userEvent.type(player, 'player');
      userEvent.click(buttonPlay);

      const tokenLocalStorage = localStorage.getItem('token');
      expect(tokenLocalStorage).not.toBe('null');
    },
  );
  test(
    'Se após o clique do botão se redireciona para game ',
    async () => {
      const{history}=renderWithRouterAndRedux(<Login/>);

      const emailInput = screen.getByTestId(inputGravatarEmail);
      const player = screen.getByTestId(inputPlayerName);
      const buttonPlay = screen.getByTestId(btnPlay);

      userEvent.type(emailInput, 'trybe@teste.com');
      userEvent.type(player, 'player');
      act(() =>  {
        userEvent.click(buttonPlay);
      })
      await waitFor(() => expect(history.location.pathname).toBe('/game'))
    },
  );
});

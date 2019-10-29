import styled, { keyframes, css } from 'styled-components';

export const Container = styled.div`
  max-width: 700px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 80px auto;

  h1 {
    font-size: 20px;
    display: flex;
    align-items: center;

    svg {
      margin-right: 10px;
    }
  }
`;

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
`;

export const Input = styled.input.attrs(propriedades => ({
  encontrado: propriedades.encontrado,
}))`
  flex: 1;
  border: 1px solid #eee;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 16px;

  ${propriedades =>
    !propriedades.encontrado &&
    css`
      border: 1px solid red;
      ::placeholder {
        color: red;
      }
    `}
`;

const rotacionar = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

// export const SubmitButton = styled.button` (FORMATO PADRÃO)
// Quando se deseja passar atributos:
// export const SubmitButton = styled.button.attrs({ type: 'submit' })`

export const SubmitButton = styled.button.attrs(propriedades => ({
  type: 'submit',
  disabled: propriedades.carregando,
}))`
  background: #7159c1;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;

  /* o símbolo & indica este elemento button */
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Forma básica:
  svg {
    animation: ${rotacionar} 2s linear infinite;
  } */
  /* Forma acessando pelas propriedades: */
  /* O operadore && é usado quando só existe uma condição para executar.
     Neste caso, somente quando "carregando" for "true" */
  ${propriedades =>
    propriedades.carregando &&
    css`
      svg {
        animation: ${rotacionar} 2s linear infinite;
      }
    `}
`;

export const List = styled.ul`
  list-style: none;
  margin-top: 30px;

  li {
    padding: 15px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    /* A sintaxe abaixo significa que o códig verificar se existe uma "li" antes da "li" atual e aplica o estilo: */
    /* O símbolo & em CSS equivale ao "this" do javascript */
    /* O símbolo + é um seletor adjacente, aqui ele está procurando a primeira li após a li atual (&/this) */
    & + li {
      border-top: 1px solid #eee;
    }

    a {
      color: #7159c1;
      text-decoration: none;
    }
  }
`;

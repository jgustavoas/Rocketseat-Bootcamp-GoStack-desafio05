/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, Input, SubmitButton, List } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositorios: [],
    carregando: false,
    encontrado: true,
    placeholder: 'Procurar "usuário/repositório"',
  };

  // Carregar os dados de localStorage
  componentDidMount() {
    const repositorios = localStorage.getItem('repositorios');

    if (repositorios) {
      const ordernarRepositorios = JSON.parse(repositorios).sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        return 0;
      });

      if (repositorios) {
        this.setState({ repositorios: ordernarRepositorios });
      }
    }
  }

  // Salvar os dados do localStorage
  componentDidUpdate(_, stateAnterior) {
    const { repositorios } = this.state;

    const ordernarRepositorios = repositorios.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });

    if (stateAnterior.repositorios !== repositorios) {
      localStorage.setItem(
        'repositorios',
        JSON.stringify(ordernarRepositorios)
      );
    }
  }

  manipularInput = e => {
    this.setState({ newRepo: e.target.value });
  };

  manipularFocus = () => {
    this.setState({
      encontrado: true,
      placeholder: 'Procurar "usuário/repositório"',
    });
  };

  manipularEstado = (encontrado, carregando, newRepo, placeholder) => {
    this.setState({
      encontrado,
      carregando,
      newRepo,
      placeholder,
    });
  };

  manipularSubmit = async e => {
    e.preventDefault();

    this.setState({ carregando: true });

    const { newRepo, repositorios } = this.state;

    try {
      if (!newRepo || newRepo === ' ')
        throw new Error(
          this.manipularEstado(false, false, '', `Digite um repositório!`)
        );

      if (newRepo.search('/') === -1)
        throw new Error(
          this.manipularEstado(
            false,
            false,
            '',
            `Digite no formato "usuário/repositório"`
          )
        );

      const nomesExistentes = repositorios.map(r => r.name);
      if (nomesExistentes.includes(newRepo))
        throw new Error(
          this.manipularEstado(
            false,
            false,
            '',
            `O repositório ${newRepo} já está na lista!`
          )
        );

      try {
        const response = await api.get(`/repos/${newRepo}`);

        const data = {
          name: response.data.full_name,
        };

        const ordernarRepositorios = [...repositorios, data].sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          return 0;
        });

        this.setState({
          repositorios: ordernarRepositorios,
          newRepo: '',
          carregando: false,
          encontrado: true,
        });
      } catch (erro) {
        this.manipularEstado(
          false,
          false,
          '',
          `O repositório ${newRepo} não existe!`
        );
      }
    } catch (error) {
      // console.log(error);
    }
  };

  render() {
    const {
      newRepo,
      carregando,
      repositorios,
      encontrado,
      placeholder,
    } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt /> Repositórios
        </h1>

        <Form onSubmit={this.manipularSubmit}>
          <Input
            type='text'
            placeholder={placeholder}
            value={newRepo}
            onChange={this.manipularInput}
            encontrado={encontrado}
            onFocus={this.manipularFocus}
          />
          <SubmitButton carregando={carregando}>
            {carregando ? (
              <FaSpinner color='#fff' size={14} />
            ) : (
              <FaPlus color='#FFF' size={14} />
            )}
          </SubmitButton>
        </Form>
        <List>
          {repositorios.map(r => (
            <li key={r.name}>
              <span>{r.name}</span>
              <Link to={`/repository/${encodeURIComponent(r.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}

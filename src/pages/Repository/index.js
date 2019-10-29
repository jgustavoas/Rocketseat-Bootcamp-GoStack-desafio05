/* eslint-disable react/state-in-constructor */
/* eslint-disable react/static-property-placement */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssuesList, Pagination } from './styles';

export default class Repositorio extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repositorio: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repositorio: {},
    issues: [],
    loading: true,
    state: 'all',
    paginaAtual: 1,
  };

  async componentDidMount(state = 'all', page = 1) {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repositorio);
    // ...Como se pretende executar as duas ao mesmo tempo, faz-se o seguinte:
    // Detalhe: consegue-se desestruturar dentro de uma array os resultados das chamadas
    const [repositorio, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state,
          page,
          per_page: 10,
        },
      }),
    ]);

    this.setState({
      repositorio: repositorio.data,
      issues: issues.data,
      loading: false,
      state,
      paginaAtual: Number(page),
    });
  }

  manipularFiltro = e => {
    this.componentDidMount(e.target.value, 1);
  };

  manipularPagina = e => {
    const { state } = this.state;
    this.componentDidMount(state, e.target.value);
  };

  render() {
    const { repositorio, issues, loading, paginaAtual } = this.state;
    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to='/'>Voltar à lista de respositórios</Link>
          <img
            src={repositorio.owner.avatar_url}
            alt={repositorio.owner.login}
          />
          <h1>{repositorio.name}</h1>
          <p>{repositorio.description}</p>
        </Owner>
        <IssuesList>
          <strong>Status da issue:</strong>
          <select onChange={this.manipularFiltro}>
            <option value='all'>All</option>
            <option value='open'>Open</option>
            <option value='closed'>Closed</option>
          </select>
          {issues.map(issue => (
            // Recomenda-se usar string nas "keys" por isso a id foi colocada numa função que a converte em String
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssuesList>
        <Pagination>
          <button
            type='button'
            disabled={paginaAtual === 1}
            value={paginaAtual - 1}
            onClick={this.manipularPagina}
          >
            Página anterior
          </button>
          &nbsp;
          <button
            type='button'
            value={paginaAtual + 1}
            onClick={this.manipularPagina}
          >
            Próxima página
          </button>
        </Pagination>
      </Container>
    );
  }
}

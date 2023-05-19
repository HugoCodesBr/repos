import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import {
  Container,
  Owner,
  Loading,
  BackButton,
  IssuesList,
  PageActions,
} from './styles';

import api from '../../services/api';

const Repositorio = () => {
  const { repositorio } = useParams();
  const [meuRepositorio, setMeuRepositorio] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      const nomeRepo = repositorio;

      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: 'open',
            per_page: 5,
          },
        }),
      ]);

      setMeuRepositorio(repositorioData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }

    load();
  }, [repositorio]);

  useEffect(() => {
    async function loadIssue() {
      const nomeRepo = repositorio;

      const reponse = await api.get(`/repos/${nomeRepo}/issues`, {
        params: {
          state: 'open',
          page,
          per_page: 5,
        },
      });

      setIssues(reponse.data);
    }

    loadIssue();
  }, [page, repositorio]);

  function handlePage(action) {
    setPage(action === 'back' ? page - 1 : page + 1);
  }

  if (loading) {
    return (
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    );
  }

  return (
    <Container>
      <BackButton to="/">
        <FaArrowLeft color="#000" size={35} />
      </BackButton>

      <Owner>
        <img
          src={meuRepositorio.owner.avatar_url}
          alt={meuRepositorio.owner.login}
        />
        <h1>{meuRepositorio.name}</h1>
        <p>{meuRepositorio.description}</p>
      </Owner>

      <IssuesList>
        {issues.map((issue) => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />

            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>

                {issue.labels.map((label) => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>

              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>

      <PageActions>
        <button
          type="button"
          onClick={() => handlePage('back')}
          disabled={page < 2}
        >
          Voltar
        </button>
        <button type="button" onClick={() => handlePage('next')}>
          Proxima
        </button>
      </PageActions>
    </Container>
  );
};

export default Repositorio;

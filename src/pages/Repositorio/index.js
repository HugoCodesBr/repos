import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Container, Owner, Loading, BackButton } from './styles';

import api from '../../services/api';

const Repositorio = () => {
  const { repositorio } = useParams();
  const [meuRepositorio, setMeuRepositorio] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

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
    </Container>
  );
};

export default Repositorio;

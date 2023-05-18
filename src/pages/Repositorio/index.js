import React from 'react';
import { useParams } from 'react-router-dom';

const Repositorio = () => {
  const { repositorio } = useParams();

  return <h1 style={{ color: '#fff' }}>{repositorio}</h1>;
};

export default Repositorio;

import React from 'react'
import "../pages/Style/styles.css";
import { Button } from '@mantine/core';
import { IconArrowBearRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const PaginaPrincipal = () => {
  return (
    <div className="container3">
  <div className="div1 text-black">
    <div className="image-container">
      <img src="../../assets/img/consepro11.png" alt="Exemplo de imagem" />
    </div>
    <div className="content2 w-50">
      <h2>ESTACIONE COM CRÉDITO</h2>
      <p>Crie sua conta e estacione com crédito, clique no botão abaixo!</p>
      <a href="https://estacionamentorotativo.conseprotaquara.com.br">
      <Button
        variant="gradient"
        size="md"
        gradient={{ from: 'indigo', to: 'cyan' }}
        rightIcon={<IconArrowBearRight />}
      >
        Acessar o app ‎ ‎
      </Button>
        </a>
    </div>
  </div>
  <div className="div2 text-black">
    <div className="content">
      <h2>ESTACIONE RÁPIDO</h2>
      <p>Realize um estacionamento de forma simples e rápida.</p>
      <a href="https://avulso.conseprotaquara.com.br">
      <Button
        variant="gradient"
        size="md"
        gradient={{ from: 'indigo', to: 'violet', deg: 60 }}
        rightIcon={<IconArrowBearRight />}
      >
        Ir para o site
      </Button>
        </a>
    </div>
    <div className="image-container2">
      <img src="../../assets/img/carroconsepro.png" alt="Exemplo de imagem" />
    </div>
  </div>
  <div className="div1 div3 text-black">
    <div className="image-container3">
      <img src="../../assets/img/whatsconsepro5.png" alt="Exemplo de imagem" />
    </div>
    <div className="content2 w-50">
      <h2>ESTACIONE POR WHATS</h2>
      <p>Estacione utilizando o whatsapp, clique no botão abaixo e confira.</p>
      <Button
        variant="gradient"
        size="md"
        gradient={{ from: 'cyan', to: 'indigo' }}
        rightIcon={<IconArrowBearRight />}
      >
        Acessar o chat
      </Button>
    </div>
  </div>
</div>
  );
};

export default PaginaPrincipal

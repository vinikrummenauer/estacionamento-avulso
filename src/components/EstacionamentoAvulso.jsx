import axios from 'axios';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useRef, useState } from 'react'
import VoltarComponente from '../util/VoltarComponente';
import ModalPix from './ModalPix';
import SidebarAvulso from './SidebarAvulso';
import { Button, Divider, Grid, Group, Text } from '@mantine/core';
import { IconCheck, IconChecks, IconCheckupList } from '@tabler/icons-react';

const EstacionamentoAvulso = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [placa, setPlaca] = useState("placa");
  const [textoPlaca, setTextoPlaca] = useState("");
  const [limite, setLimite] = useState(8);
  const [inputVazio, setInputVazio] = useState("inputvazio3");
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tempo, setTempo] = useState("01:00:00");
  const [valorCobranca, setValorCobranca] = useState(0);
  const [valorcobranca2, setValorCobranca2] = useState(2.00);
  const [user2, setUser2] = useState("");
  const [notification, setNotification] = useState(true);
  const [pixExpirado, setPixExpirado] = useState("");
  const [txid, setTxId] = useState("");
  const [onOpen, setOnOpen] = useState(false);
  const [cont, setCont] = useState(0);
  const [teste, setTeste] = useState("");
  const [selectedButton, setSelectedButton] = useState("01:00:00");
  const [loader, setLoader] = useState(false);

  const handleButtonClick = (buttonIndex) => {
    setSelectedButton(buttonIndex);
    const tempo1 = buttonIndex;
    if (tempo1 === "02:00:00") {
      setValorCobranca2(valorCobranca * 2);
    } else if (tempo1 === "01:00:00") {
      setValorCobranca2(valorCobranca);
    } else if (tempo1 === "01:30:00") {
      setValorCobranca2(valorCobranca * 1.5);
    } else if (tempo1 === "00:30:00") {
      setValorCobranca2(valorCobranca / 2);
    }
  };

  function validarPlaca(placa) {
    const regexPlacaAntiga = /^[a-zA-Z]{3}\d{4}$/;
    const regexPlacaNova =
      /^([A-Z]{3}[0-9][A-Z0-9][0-9]{2})|([A-Z]{4}[0-9]{2})$/;

    if (regexPlacaAntiga.test(placa) || regexPlacaNova.test(placa)) {
      return true;
    } else {
      return false;
    }
  }

  const param = async () => {
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
    });
    await requisicao
      .get("/parametros")
      .then((response) => {
        setValorCobranca(response.data.data.param.estacionamento.valorHora);
      })
      .catch(function (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("perfil");
      });
  };

  const handlePlaca = () => {
    const clicado = document.getElementById("flexSwitchCheckDefault").checked;
    if (clicado === true) {
      setPlaca("placa2");
      setLimite(100);
      setInputVazio("inputvazio2");
    } else {
      setPlaca("placa");
      setLimite(8);
      setInputVazio("inputvazio3");
    }
  };

  const jae = () => {
    const sim = document.getElementById("flexSwitchCheckDefault").checked;
    if (sim === true) {
      setLimite(10);
    } else {
      setLimite(8);
    }
  };

  useEffect(() => {
    param();
  }, []);

  useEffect(() => {
    const clicado = document.getElementById("flexSwitchCheckDefault").checked;
    if (clicado === false) {
      if (
        textoPlaca.at(4) === "1" ||
        textoPlaca.at(4) === "2" ||
        textoPlaca.at(4) === "3" ||
        textoPlaca.at(4) === "4" ||
        textoPlaca.at(4) === "5" ||
        textoPlaca.at(4) === "6" ||
        textoPlaca.at(4) === "7" ||
        textoPlaca.at(4) === "8" ||
        textoPlaca.at(4) === "9" ||
        textoPlaca.at(4) === "0"
      ) {
        setPlaca("placa3");
        if (cont === 0) {
          const fim = textoPlaca.substring(3, textoPlaca.length);
          const texto = textoPlaca.substring(0, 3);
          const traco = "-";
          setTextoPlaca(texto + traco + fim);
          setCont(cont + 1);
        } else {
          const fim = textoPlaca.substring(4, textoPlaca.length);
          const texto = textoPlaca.substring(0, 3);
          const traco = "-";
          setTextoPlaca(texto + traco + fim);
          setCont(cont + 1);
        }
      } else {
        setPlaca("placa");
        setCont(0);
      }
      setTeste(textoPlaca.replace("-", ""));
    }
  }, [textoPlaca]);

  const fazerPix = async () => {
    const placaString = textoPlaca.toString();
    const placaMaiuscula = placaString.toUpperCase();
    const placaFinal = placaMaiuscula.split("-").join("");
    if (textoPlaca === "") {
      setEstado(true);
      setMensagem("Preencha o campo placa");
      setTimeout(() => {
        setEstado(false);
        setMensagem("");
      }, 4000);
      return;
    }
    const sim = document.getElementById("flexSwitchCheckDefault").checked;
    if (!sim) {
      if (!validarPlaca(placaFinal)) {
        setEstado(true);
        setMensagem("Placa inválida");
        setTimeout(() => {
          setEstado(false);
          setMensagem("");
        }, 4000);
        return;
      }
    }
    setLoader(true);
    const valor = valorcobranca2.toString();
    const valor2 = parseFloat(valor.replace(",", ".")).toFixed(2);
    const campo = {
      placa: placaFinal,
      tempo: tempo,
    };
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST
    })
    requisicao.post('/gerarcobranca/estacionamento', {
      valor: valor2,
      campo: JSON.stringify(campo),
    }).then((resposta) => {
      setLoader(false);
      if (resposta.data.msg.resultado) {
        setData(resposta.data.data);
        setTxId(resposta.data.data.txid);
        registrarEstacionamento(resposta.data.data.txid);
        setOnOpen(true);
        open();
      } else {

      }
  }).catch((error) => {
    console.log(error)})
}

  const registrarEstacionamento = async (Txid) => {
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
    });
    requisicao.post('/estacionamento/avulso', {
      txid: Txid,
    }).then((resposta) => {
      if(resposta.data.msg.resultado){
        setNotification(false);
        setEstado(false);
        setTimeout(() => {
          setOnOpen(false);
          close();
          setTimeout(() => {
            setNotification(true);
          }, 2000);
        }, 3000);
        setTextoPlaca("");
        setSuccess(true);
        setMensagem("Estacionamento registrado com sucesso");

      } else {
        setSuccess(false);
        setEstado(true);
        setMensagem(resposta.data.msg.msg);
      }
    }).catch((error) => {
      console.log(error)}
    )
  }

  return (
    <>
    <SidebarAvulso />
    <div className="container mb-4">
      <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
        <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
            <div className="h6 mt-1 mb-4 align-items-left text-start">
              Estacionamento avulso
            </div>

            <Divider my="sm" size="md" variant="dashed" />

            <div className="row">
              <div className="col-9 px-3 mt-1 pt-2">
                <h6>Placa estrangeira/Outra</h6>
              </div>
              <div className="col-3 px-3">
                <div className="form-check3 mt-2 form-switch gap-2 d-md-block">
                  <input
                    className="form-check-input align-self-end"
                    type="checkbox"
                    role="switch"
                    onClick={handlePlaca}
                    id="flexSwitchCheckDefault"
                    onChange={() => {
                      jae();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="pt-1 mt-md-0 w-100 p-3" id={placa}>
              <input
                type="text"
                id={inputVazio}
                className="mt-5 fs-1 justify-content-center align-items-center text-align-center"
                value={textoPlaca}
                onChange={(e) => setTextoPlaca(e.target.value)}
                maxLength={limite}
              />
            </div>

            <Divider my="sm" size="md" variant="dashed" />

              <div className="h6 mt-3 mx-2">
                  <Group position="apart">
                  <h6 className="mb-3"><small>Determine o tempo (minutos): </small></h6>
                  </Group>
                  <Grid>
                    <Grid.Col span={3}>
                      <button 
                        type="button" className={`btn icon-shape icon-shape rounded align-center text-white ${
                        selectedButton === "00:30:00" ? 'corTempoSelecionado' : 'corTempo'}`}
                        onClick={() => handleButtonClick("00:30:00")}>
                        <Text fz="lg" weight={700}>30</Text>
                      </button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <button
                        type="button" className={`btn icon-shape icon-shape rounded align-center text-white ${
                        selectedButton === "01:00:00" ? 'corTempoSelecionado' : 'corTempo'}`} 
                        onClick={() => handleButtonClick("01:00:00")}>
                        <Text fz="lg" weight={700}>60</Text>
                      </button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <button
                        type="button" className={`btn icon-shape icon-shape rounded align-center text-white ${
                        selectedButton === "01:30:00" ? 'corTempoSelecionado' : 'corTempo'}`}
                        onClick={() => handleButtonClick("01:30:00")}>
                        <Text fz="lg" weight={700}>90</Text>
                      </button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <button
                        type="button" className={`btn icon-shape icon-shape rounded align-center text-white ${
                        selectedButton === "02:00:00" ? 'corTempoSelecionado' : 'corTempo'}`}
                        onClick={() => handleButtonClick("02:00:00")}>
                        <Text fz="lg" weight={700}>120</Text>
                      </button>
                    </Grid.Col>
                  </Grid>
                <div className="mt-3">
              <p id="tempoCusto" className="text-end">
                {" "}
                Valor a ser cobrado: R$ {valorcobranca2}{" "}
              </p>
              </div>
            </div>

            <div className="mb-2 mt-4 gap-2 d-md-block">
              <Button
                onClick={() => {
                  fazerPix();
                }}
                variant="gradient" gradient={{ from: 'teal', to: 'indigo', deg: 300 }}
                size="md"
                radius="md"
                rightIcon={ <IconCheck size={20} /> }
                loaderPosition="right"
                loading={loader}
              >
                Registrar
              </Button>
            </div>
            <div
              className="alert alert-danger mt-4"
              role="alert"
              style={{ display: estado ? "block" : "none" }}
            >
              {mensagem}
            </div>
            <div
              className="alert alert-success mt-4"
              role="alert"
              style={{ display: success ? "block" : "none" }}
            >
              {mensagem}
            </div>
          </div>
        </div>
      </div>
      <ModalPix qrCode={data.brcode} status={notification} mensagemPix={pixExpirado} onOpen={onOpen} />
    </div>
    </>
  )
}

export default EstacionamentoAvulso
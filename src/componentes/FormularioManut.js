import React, { Component } from 'react';
import { Form, Grid, Row, Col, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';
import PubSub from 'pubsub-js';
import MaskedInput from 'react-text-mask';
import moment from 'moment-timezone';
import Mensagem from './Mensagem';
import SelectCustomizado from './SelectCustomizado';

//Alteração somente se a medião estiver aberta = 0

class FormularioManut extends Component {
    constructor(props) {
        super(props);

        this.conformidades = [
            { id: '1', desc: 'Conforme' },
            { id: '2', desc: 'Não Conforme' },
        ];

        this.state = {
            id: '0',
            contrato: '0',
            medicao: '0',
            medicaoSit: '1',
            tipoFisc: '0',
            numSS: '',
            dataHora: '', //moment().tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm'),
            conformidade: '0',
            descricao: '',
            mensagemEstilo: 'danger',

            vsContrato: null,
            vsMedicao: null,
            vsTipoFisc: null,
            vsNumSS: null,
            vsDataHora: null,
            vsConformidade: null,
            vsDescricao: null,

            contratos: [],
            medicoes: [],
            tiposFisc: [],
            mensagens: []
        }

        this.onInputChange = this.onInputChange.bind(this);
        this.getContratos = this.getContratos.bind(this);
        this.getMedicoes = this.getMedicoes.bind(this);
        this.getTiposFisc = this.getTiposFisc.bind(this);
        this.desabilitarInput = this.desabilitarInput.bind(this);
        this.desabilitarMedicao = this.desabilitarMedicao.bind(this);
        this.desabilitarConformidade = this.desabilitarConformidade.bind(this);
        this.desabilitarExcluir = this.desabilitarExcluir.bind(this);
        this.validarForm = this.validarForm.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.pesquisar = this.pesquisar.bind(this);
    }

    limparInput() {
        this.setState({
            id: '0',
            contrato: '0',
            medicao: '0',
            medicaoSit: '1',
            tipoFisc: '0',
            numSS: '',
            dataHora: '',
            conformidade: '0',
            descricao: '',
            mensagemEstilo: 'danger',

            vsContrato: null,
            vsMedicao: null,
            vsTipoFisc: null,
            vsNumSS: null,
            vsDataHora: null,
            vsConformidade: null,
            vsDescricao: null,

            //contratos: [],
            medicoes: [],
            //tiposFisc: [],
            mensagens: []
        });
    }

    getContratos() {
        fetch(process.env.REACT_APP_API_CONTRATO)
            .then(resposta => resposta.json())
            .then(dados => this.setState({ contratos: dados }))
            .catch(erro => console.log(erro));
    }

    getMedicoes(resposta) {
        if (resposta) {
            fetch(process.env.REACT_APP_API_MEDICAO.replace('XXX', resposta))
                .then(resposta => resposta.json())
                .then(dados => this.setState({ medicoes: dados }))
                .catch(erro => console.log(erro));
        }
    }

    getTiposFisc() {
        fetch(process.env.REACT_APP_API_TIPOFISC)
            .then(resposta => resposta.json())
            .then(dados => this.setState({ tiposFisc: dados }))
            .catch(erro => console.log(erro));
    }

    desabilitarConformidade() {
        return this.state.medicaoSit === '1' || this.state.tipoFisc === '3';
    }

    desabilitarInput() {
        return this.state.medicaoSit === '1';
    }

    desabilitarMedicao() {
        return this.state.contrato === '0' || this.state.medicoes.length === 0;
    }

    desabilitarExcluir() {
        return this.state.medicaoSit === '1' || this.state.id === '0';
    }

    validarForm() {
        let mensagens = [];

        let mensagemEstilo = 'success';

        let {
            vsContrato,
            vsMedicao,
            vsTipoFisc,
            vsNumSS,
            vsDataHora,
            vsConformidade,
            vsDescricao
        } = this.state;

        vsContrato = null;
        vsMedicao = null;
        vsTipoFisc = null;
        vsNumSS = null
        vsDataHora = null;
        vsConformidade = null;
        vsDescricao = null;

        if (this.state.contrato === '0') {
            mensagens.push('Informe o contrato!');

            mensagemEstilo = 'danger';

            vsContrato = 'error';
        }

        if (this.state.medicao === '0') {
            mensagens.push('Informe a medição!');

            mensagemEstilo = 'danger';

            vsMedicao = 'error';
        }

        if (this.state.tipoFisc === '0') {
            mensagens.push('Informe o Tipo de Fiscalização!');

            mensagemEstilo = 'danger';

            vsTipoFisc = 'error';
        }

        const regex = new RegExp(/\d{2}\/\d{2}\-\d{6}\-\d{2}/gm);

        if (this.state.numSS === '' || !regex.test(this.state.numSS)) {
            mensagens.push('Informe a SS!');

            mensagemEstilo = 'danger';

            vsNumSS = 'error';
        }

        const data = moment(this.state.dataHora, 'DD/MM/YYYY HH:mm', true);

        if (!data.isValid()) {
            mensagens.push('Informe uma data/hora válida!');

            mensagemEstilo = 'danger';

            vsDataHora = 'error';
        }

        if (this.state.conformidade === '0') {
            mensagens.push('Informe a Conformidade!');

            mensagemEstilo = 'danger';

            vsConformidade = 'error';
        }

        if (this.state.descricao === '') {
            mensagens.push('Informe a Descrição!');

            mensagemEstilo = 'danger';

            vsDescricao = 'error';
        }

        this.setState({
            mensagens,
            mensagemEstilo,
            vsContrato,
            vsMedicao,
            vsTipoFisc,
            vsNumSS,
            vsDataHora,
            vsConformidade,
            vsDescricao
        });

        if (mensagens.length === 0) return true;

        return false;
    }

    onInputChange = (e) => {
        const targetId = e.target.id;

        const targetValue = e.target.value;

        this.setState({ [targetId]: targetValue }, () => {
            if (this.state.tipoFisc === '3') this.setState({ conformidade: '1' });

            if (this.state.contrato === '0') this.limparInput();
        });

        if (targetId === 'contrato') {
            PubSub.publish('contrato-change', targetValue);
        } else if (targetId === 'medicao') {
            let option = undefined;

            for (let opt of e.target.childNodes) {
                if (opt.value === targetValue) {
                    option = opt;

                    break;
                }
            }

            if (option) {
                this.setState({ medicaoSit: option.getAttribute('situacao') });
            }
        }
    }

    async onFormSubmit() {
        try {
            if (!this.validarForm()) return;

            let mensagens = [];

            let mensagemEstilo = 'success';

            const objFisc = {
                'idMedicao': this.state.medicao,
                'idTpFiscalizacao': this.state.tipoFisc,
                'sS': this.state.numSS,
                'dtExecucao': this.state.dataHora,
                'descricao': this.state.descricao,
                'conformidade': this.state.conformidade
            }

            const rawResponse = await fetch(process.env.REACT_APP_API_FISC_SALVAR, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objFisc)
            });

            const { sucesso, erro, alerta } = await rawResponse.json();

            if (sucesso) {
                mensagens.push(sucesso);

                mensagemEstilo = 'success';
            } else if (erro) {
                mensagens.push(erro);

                mensagemEstilo = 'danger';
            } else if (alerta) {
                mensagens.push(alerta);

                mensagemEstilo = 'warning';
            }

            this.setState({
                mensagens,
                mensagemEstilo
            }, () => {
                setTimeout(() => {
                    this.setState({
                        mensagens: [],
                        mensagemEstilo: 'danger',
                        id: '0'
                    });
                }, 5000);
            });
        } catch (erro) {
            throw erro;
        }
    }

    async pesquisar() {
        try {
            const objFisc = {
                'idMedicao': this.state.medicao,
                'idTpFiscalizacao': this.state.tipoFisc,
                'sS': this.state.numSS
            }

            const rawResponse = await fetch(process.env.REACT_APP_API_FISC_PESQUISAR, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objFisc)
            });

            const { id, erro, dtExecucao, conformidade, descricao, ativoExcluido } = await rawResponse.json();

            if (erro || ativoExcluido === 'E') {
                let mensagens = [];

                let mensagemEstilo = 'danger';

                mensagens.push(ativoExcluido === 'E' ? 'Registro excluido!' : erro);

                this.setState({
                    mensagens,
                    mensagemEstilo
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            mensagens: [],
                            mensagemEstilo: 'danger',
                            id: '0'
                        });
                    }, 5000);
                });
            }

            if (id) {
                this.setState({
                    id,
                    dataHora: dtExecucao,
                    conformidade,
                    descricao
                });
            }
        } catch (erro) {
            throw erro;
        }
    }

    componentDidMount() {
        this.getContratos();

        this.getTiposFisc();

        PubSub.subscribe('contrato-change', (topico, resposta) => {
            //Limpar o select quando escolher um contrato sem medições
            this.setState({ medicao: '0', medicaoSit: '1' });

            this.getMedicoes(resposta);
        });
    }

    render() {
        const msg = this.state.mensagens.length > 0
            ? <Mensagem bsStyle={this.state.mensagemEstilo} mensagens={this.state.mensagens} />
            : null;

        return (
            <Grid >
                <h1>Fiscalização de SS</h1>
                <Form>
                    <Row className="show-grid">
                        <Col xs={12} sm={12} md={12} lg={12}>
                            {msg}
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={12} sm={12} md={12} lg={12}>
                            <FormControl
                                componentClass="input"
                                type="hidden"
                                id="id"
                                value={this.state.id}
                            />
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <SelectCustomizado
                                id="contrato"
                                label="Contrato"
                                placeholder="Contrado..."
                                value={this.state.contrato}
                                items={this.state.contratos}
                                disabled={false}
                                onChange={this.onInputChange}
                                validationState={this.state.vsContrato} />
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <SelectCustomizado
                                id="medicao"
                                label="Medição"
                                placeholder="Medição..."
                                value={this.state.medicao}
                                items={this.state.medicoes}
                                disabled={this.desabilitarMedicao()}
                                onChange={this.onInputChange}
                                validationState={this.state.vsMedicao} />
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <SelectCustomizado
                                id="tipoFisc"
                                label="Tipo Fiscalização"
                                placeholder="Tipo Fiscalização..."
                                value={this.state.tipoFisc}
                                items={this.state.tiposFisc}
                                disabled={this.desabilitarInput()}
                                onChange={this.onInputChange}
                                validationState={this.state.vsTipoFisc} />
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <FormGroup controlId="numSS" validationState={this.state.vsNumSS}>
                                <ControlLabel htmlFor="numSS">Número SS</ControlLabel>
                                <MaskedInput
                                    mask={[/\d/, /\d/, '/', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                                    className="form-control"
                                    placeholder="Informe o número da SS"
                                    guide={true}
                                    disabled={this.desabilitarInput()}
                                    id="numSS"
                                    value={this.state.numSS}
                                    onChange={this.onInputChange} />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <FormGroup controlId="dataHora" validationState={this.state.vsDataHora}>
                                <ControlLabel htmlFor="dataHora">Data/Hora</ControlLabel>
                                <MaskedInput
                                    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/]}
                                    className="form-control"
                                    placeholder="Informe a data e hora"
                                    guide={true}
                                    disabled={this.desabilitarInput()}
                                    id="dataHora"
                                    value={this.state.dataHora.toString()}
                                    onChange={this.onInputChange} />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <SelectCustomizado
                                id="conformidade"
                                label="Conformidade"
                                placeholder="Conformidade..."
                                value={this.state.conformidade}
                                items={this.conformidades}
                                disabled={this.desabilitarConformidade()}
                                onChange={this.onInputChange}
                                validationState={this.state.vsConformidade} />
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12}>
                            <FormGroup controlId="descricao" validationState={this.state.vsDescricao}>
                                <ControlLabel>Descrição</ControlLabel>
                                <FormControl componentClass="textarea"
                                    value={this.state.descricao}
                                    placeholder="Informe a descrição..."
                                    rows={6}
                                    maxLength={50}
                                    disabled={this.desabilitarInput()}
                                    onChange={this.onInputChange}>
                                </FormControl>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={5} sm={5} md={5} lg={5}>
                            <ButtonToolbar>
                                <Button bsStyle="primary"
                                    style={{ width: 100 }}
                                    disabled={this.desabilitarInput()}
                                    onClick={this.onFormSubmit}>
                                    <Glyphicon glyph="ok" /> Salvar
                                </Button>
                                <Button bsStyle="danger"
                                    style={{ width: 100 }}
                                    disabled={this.desabilitarExcluir()}
                                    onClick={() => { }}>
                                    <Glyphicon glyph="remove" /> Excluir
                                </Button>
                                <Button bsStyle="success"
                                    style={{ width: 100 }}
                                    disabled={this.desabilitarInput()}
                                    onClick={this.pesquisar}>
                                    <Glyphicon glyph="search" /> Pesquisar
                                </Button>
                                <Button bsStyle="warning"
                                    style={{ width: 100, display: 'none' }}
                                    disabled={this.desabilitarInput()}
                                    onClick={() => { }}>
                                    <Glyphicon glyph="map-marker" /> Mapa
                                </Button>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </Form>
            </Grid >
        );
    }
}

export default FormularioManut;
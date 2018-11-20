import React, { Component, Fragment } from 'react';
import {
    Form,
    Grid,
    Row,
    Col,
    FormGroup,
    FormControl,
    ControlLabel,
    Button,
    ButtonToolbar,
    Glyphicon,
    PageHeader
} from 'react-bootstrap';
import PubSub from 'pubsub-js';
import MaskedInput from 'react-text-mask';
import moment from 'moment-timezone';
import Mensagem from './Mensagem';
import SelectCustomizado from './SelectCustomizado';
import ApiService from '../services/ApiService';
import HttpStatus from 'http-status-codes';

//Alteração somente se a medião estiver aberta = 0

class FormularioManut extends Component {
    constructor(props) {
        super(props);

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
            ativoExcluido: 'A',
            desabilitarContrato: false,
            mensagemStatus: '',

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

        this.tempo_msg = 5000;

        this.onInputChange = this.onInputChange.bind(this);
        this.desabilitarInput = this.desabilitarInput.bind(this);
        this.desabilitarMedicao = this.desabilitarMedicao.bind(this);
        this.desabilitarConformidade = this.desabilitarConformidade.bind(this);
        this.desabilitarExcluir = this.desabilitarExcluir.bind(this);
        this.validarForm = this.validarForm.bind(this);
        this.salvar = this.salvar.bind(this);
        this.pesquisar = this.pesquisar.bind(this);
        this.excluir = this.excluir.bind(this);
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
            ativoExcluido: 'A',
            desabilitarContrato: false,
            mensagemStatus: '',

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

    setMensagem(mensagens, mensagemEstilo, callbackFunction) {
        this.setState({
            mensagens,
            mensagemEstilo
        }, () => {
            setTimeout(() => {
                this.setState({
                    mensagens: [],
                    mensagemEstilo: 'danger',
                    id: '0'
                }, () => {
                    if (callbackFunction && typeof callbackFunction === 'function') callbackFunction();
                });
            }, this.tempo_msg);
        });
    }

    desabilitarConformidade() {
        return this.state.medicaoSit === '1' || this.state.tipoFisc === '3' || this.state.desabilitarContrato;
    }

    desabilitarInput() {
        return this.state.medicaoSit === '1' || this.state.desabilitarContrato;
    }

    desabilitarMedicao() {
        return this.state.contrato === '0' || this.state.medicoes.length === 0 || this.state.desabilitarContrato;
    }

    desabilitarExcluir() {
        return this.state.medicaoSit === '1' || this.state.id === '0' || this.state.desabilitarContrato;
    }

    redirecionarPagina(pagina) {
        this.props.history.push(pagina);
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

    async salvar() {
        try {
            if (!this.validarForm()) return;

            const objFisc = {
                'idMedicao': this.state.medicao,
                'idTpFiscalizacao': this.state.tipoFisc,
                'sS': this.state.numSS,
                'dtExecucao': this.state.dataHora,
                'descricao': this.state.descricao,
                'conformidade': this.state.conformidade
            }

            const {
                sucesso,
                erro,
                httpCod
            } = await ApiService.salvarFiscalizacao(objFisc);

            if (httpCod === HttpStatus.OK) {
                const callbackFunction = this.props.match.params.id ? this.redirecionarPagina('/') : null;

                this.setMensagem([sucesso], 'success', callbackFunction);
            } else this.setMensagem([erro], 'danger');
        } catch (erro) {
            throw erro;
        }
    }

    async pesquisarPorId(id) {
        try {
            const {
                sucesso,
                erro,
                httpCod
            } = await ApiService.getFiscalizacaoPorId(id);

            if (httpCod === HttpStatus.OK) {
                const {
                    envioContratos: { id: contrato },
                    envioMedicaoContrato: { id: medicao, situacao: medicaoSit },
                    envioTiposFiscalizacao: { id: tipoFisc },
                    id,
                    sS: numSS,
                    dtExecucao: dataHora,
                    conformidade,
                    ativoExcluido,
                    descricao
                } = sucesso;

                const desabilitarContrato = medicaoSit.toString() === '1' || ativoExcluido === 'E';
                
                const mensagemStatus = medicaoSit.toString() === '1' ? 'Medição Fechada!' : (ativoExcluido === 'E' ? 'Fiscalização Excluída!' : '');

                /*Buscar medições do contrato*/
                ApiService.getMedicoes(contrato).then(dados => this.setState({
                    medicoes: dados,
                    id: id.toString(),
                    contrato: contrato.toString(),
                    medicao: medicao.toString(),
                    medicaoSit: medicaoSit.toString(),
                    tipoFisc: tipoFisc.toString(),
                    numSS,
                    dataHora,
                    conformidade: conformidade.toString(),
                    descricao,
                    ativoExcluido,
                    desabilitarContrato,
                    mensagemStatus
                }));
            } else {
                const mensagem = httpCod === HttpStatus.NO_CONTENT ? ['Parâmetro inválido'] : [erro];
                const estilo = httpCod === HttpStatus.NO_CONTENT ? 'warning' : 'danger';

                this.setMensagem(mensagem, estilo);
            }
        } catch (erro) {
            throw erro;
        }
    }

    async pesquisar() {
        try {
            const objFisc = {
                'idMedicao': this.state.medicao ? this.state.medicao : null,
                'idTpFiscalizacao': this.state.tipoFisc ? this.state.tipoFisc : null,
                'sS': this.state.numSS ? this.state.numSS : null
            }

            console.log(objFisc);

            const isEmpty = Object.values(objFisc).every(x => (x === null || x === ''));

            if (isEmpty) return;

            const {
                sucesso,
                erro,
                httpCod
            } = await ApiService.getFiscalizacao(objFisc);

            if (httpCod === HttpStatus.NO_CONTENT) {
                this.setMensagem(['Não foi encontrado nenhum registros com os parâmetros informados!'], 'warning');

                return;
            }

            if (httpCod === HttpStatus.OK) {
                const {
                    id,
                    dtExecucao,
                    conformidade,
                    descricao,
                    ativoExcluido
                } = sucesso;

                if (ativoExcluido === 'E') {
                    this.setMensagem(['Registro excluido!'], 'danger');

                    return;
                }

                if (id) {
                    this.setState({
                        id,
                        dataHora: dtExecucao,
                        conformidade,
                        descricao
                    });
                }
            } else this.setMensagem([erro], 'danger');
        } catch (erro) {
            throw erro;
        }
    }

    async excluir() {
        try {
            const objFisc = {
                'idFiscalizacoesSs': this.state.id
            }

            const {
                erro,
                httpCod
            } = await ApiService.excluirFiscalizacao(objFisc);

            if (httpCod === HttpStatus.NO_CONTENT) {
                const callbackFunction = this.props.match.params.id ? this.limparInput() : null;
                
                this.setMensagem(['Fiscalização excluída com sucesso!'], 'success', callbackFunction);

                this.redirecionarPagina('/');
            }
            else this.setMensagem([erro], 'danger');
        } catch (erro) {
            throw erro;
        }
    }

    componentDidMount() {
        ApiService.getContratos().then(dados => this.setState({ contratos: dados }));

        ApiService.getTiposFisc().then(dados => this.setState({ tiposFisc: dados }));

        PubSub.subscribe('contrato-change', (topico, resposta) => {
            //Limpar o select quando escolher um contrato sem medições
            this.setState({ medicao: '0', medicaoSit: '1' });

            ApiService.getMedicoes(resposta).then(dados => this.setState({ medicoes: dados }));
        });

        /*Verificar parâmetro na url*/
        if (this.props.match.params.id) {
            const id = parseInt(this.props.match.params.id) || '0';

            if (id === '0') {
                this.redirecionarPagina('/');

                return;
            }

            this.pesquisarPorId(id);
        }
    }

    render() {
        const msg = this.state.mensagens.length > 0
            ? <Mensagem bsStyle={this.state.mensagemEstilo} mensagens={this.state.mensagens} />
            : null;

        return (
            <Fragment>
                <PageHeader style={{ display: 'flex', justifyContent: 'center' }}>
                    Fiscalização de SS <small>{this.state.mensagemStatus}</small>
                </PageHeader>
                <Grid>
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
                                    disabled={this.state.desabilitarContrato}
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
                                    items={ApiService.getConformidades()}
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
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <ButtonToolbar style={{marginBottom: 10}}>
                                    <Button bsStyle="primary"
                                        style={{ width: 100 }}
                                        disabled={this.desabilitarInput()}
                                        onClick={this.salvar}>
                                        <Glyphicon glyph="ok" /> Salvar
                                    </Button>
                                    <Button bsStyle="danger"
                                        style={{ width: 100 }}
                                        disabled={this.desabilitarExcluir()}
                                        onClick={() => { if (window.confirm('Deseja excluir a fiscalização?')) this.excluir() }}>
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
            </Fragment>
        );
    }
}

export default FormularioManut;
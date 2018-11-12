import React, { Component } from 'react';
import { Form, Grid, Row, Col, FormGroup, ControlLabel, Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';
import PubSub from 'pubsub-js';
import MaskedInput from 'react-text-mask';
import moment from 'moment-timezone';
import Mensagem from './Mensagem';
import SelectCustomizado from './SelectCustomizado';
import ApiService from './ApiService';
import ReactTable from "react-table";
import 'react-table/react-table.css'

class FormularioPesquisa extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            contrato: '',
            medicao: '',
            medicaoSit: '1',
            tipoFisc: '',
            numSS: '',
            dataInicio: moment().tz('America/Sao_Paulo').format('DD/MM/YYYY'),
            dataFim: moment().tz('America/Sao_Paulo').format('DD/MM/YYYY'),
            conformidade: '',
            mensagemEstilo: 'danger',
            loading: false,

            vsNumSS: null,
            vsDataInicio: null,
            vsDataFim: null,

            contratos: [],
            medicoes: [],
            tiposFisc: [],
            mensagens: [],
            dados: []
        }

        //Usado para pegar os dados filtrados para gerar a exportação
        this.myReactTable = React.createRef();

        this.previousText = 'Anterior';
        this.nextText = 'Próximo';
        this.loadingText = 'Aguarde...';
        this.noDataText = 'Nenhuma informação';
        this.pageText = 'Página';
        this.ofText = 'de';
        this.rowsText = 'linhas';
        this.pageJumpText = 'Vá para página';
        this.rowsSelectorText = 'linhas por página';

        this.onInputChange = this.onInputChange.bind(this);
        this.validarForm = this.validarForm.bind(this);
        this.pesquisar = this.pesquisar.bind(this);
    }

    getTableColumns() {
        return ([
            {
                Header: 'Id',
                accessor: 'id',
                id: 'id',
                sortable: true,
                filterable: true
            },
            {
                Header: 'Contrato',
                accessor: 'conrtato',
                id: 'contrato',
                sortable: true,
                filterable: true
            },
            {
                Header: 'Medição',
                accessor: 'medicao',
                id: 'medicao',
                sortable: true,
                filterable: true
            },
            {
                Header: 'Tipo Fisc.',
                accessor: 'tipoFisc',
                id: 'tipoFisc',
                sortable: true,
                filterable: true
            },
            {
                Header: 'SS',
                accessor: 'ss',
                id: 'ss',
                sortable: true,
                filterable: true
            },
            {
                Header: 'Data Exec',
                accessor: 'dataExec',
                id: 'dataExec',
                sortable: true,
                filterable: true
            },
            {
                Header: 'Conformidade',
                accessor: 'conformidade',
                id: 'conformidade',
                sortable: true,
                filterable: true
            },
            {
                Header: 'Acão',
                accessor: 'acao',
                id: 'acao',
                sortable: false,
                filterable: false,
                Cell: row => (
                    <div>Ola</div>
                )
            }
        ]);
    }

    validarForm() {
        let mensagens = [];

        let mensagemEstilo = 'success';

        let {
            vsNumSS,
            vsDataInicio,
            vsDataFim
        } = this.state;

        vsNumSS = null
        vsDataInicio = null;
        vsDataFim = null;

        const regex = new RegExp(/\d{2}\/\d{2}\-\d{6}\-\d{2}/gm);

        if (this.state.numSS === '' || !regex.test(this.state.numSS)) {
            mensagens.push('Informe a SS!');

            mensagemEstilo = 'danger';

            vsNumSS = 'error';
        }

        const dataInicio = moment(this.state.dataInicio, 'DD/MM/YYYY HH:mm', true);

        if (!dataInicio.isValid()) {
            mensagens.push('Data inicial inválida!');

            mensagemEstilo = 'danger';

            vsDataInicio = 'error';
        }

        const dataFim = moment(this.state.dataFim, 'DD/MM/YYYY HH:mm', true);

        if (!dataFim.isValid()) {
            mensagens.push('Data final inválida!');

            mensagemEstilo = 'danger';

            vsDataFim = 'error';
        }

        if (dataInicio.isAfter(dataFim)) {
            mensagens.push('Período inválido!');

            mensagemEstilo = 'danger';

            vsDataInicio = 'error';

            vsDataFim = 'error';
        }

        this.setState({
            mensagens,
            mensagemEstilo,
            vsNumSS,
            vsDataInicio,
            vsDataFim
        });

        if (mensagens.length === 0) return true;

        return false;
    }

    async pesquisar() {
        try {
            const objFisc = {
                "cdContrato": this.state.contrato ? this.state.contrato : null,
                "idMedicao": this.state.medicao ? this.state.medicao : null,
                "idTpFiscalizacao": this.state.tipoFisc ? this.state.tipoFisc : null,
                "sS": this.state.id ? this.state.id : null,
                "dataInicioExecucao": this.state.dataInicio ? this.state.dataInicio : null,
                "dataFimExecucao": this.state.dataFim ? this.state.dataFim : null,
                "conformidade": this.state.conformidade ? this.state.conformidade : null
            }

            console.log(objFisc);

            console.log(this.myReactTable.current);

            this.setState({ loading: true });

            ApiService.getFiscalizacoes(objFisc).then(resposta => this.setState({ loading: false, dados: resposta }));
        } catch (erro) {
            this.setState({ loading: false });

            throw erro;
        }
    }

    limparInput() {
        this.setState({
            id: '',
            contrato: '',
            medicao: '',
            medicaoSit: '1',
            tipoFisc: '',
            numSS: '',
            dataInicio: moment().tz('America/Sao_Paulo').format('DD/MM/YYYY'),
            dataFim: moment().tz('America/Sao_Paulo').format('DD/MM/YYYY'),
            conformidade: '',
            descricao: '',
            mensagemEstilo: 'danger',
            loading: false,

            vsContrato: null,
            vsMedicao: null,
            vsTipoFisc: null,
            vsNumSS: null,
            vsDataInicio: null,
            vsDataFim: null,
            vsConformidade: null,
            vsDescricao: null,

            //contratos: [],
            medicoes: [],
            //tiposFisc: [],
            mensagens: [],
            dados: []
        });
    }

    onInputChange = (e) => {
        const targetId = e.target.id;

        const targetValue = e.target.value;

        this.setState({ [targetId]: targetValue }, () => {
            if (this.state.contrato === '0') this.limparInput();
        });

        if (targetId === 'contrato') PubSub.publish('contrato-change', targetValue);
    }

    componentDidMount() {
        ApiService.getContratos().then(dados => this.setState({ contratos: dados }));

        ApiService.getTiposFisc().then(dados => this.setState({ tiposFisc: dados }));

        PubSub.subscribe('contrato-change', (topico, resposta) => {
            //Limpar o select quando escolher um contrato sem medições
            this.setState({ medicao: '0', medicaoSit: '1' });

            ApiService.getMedicoes(resposta).then(dados => this.setState({ medicoes: dados }));
        });
    }

    render() {
        const msg = this.state.mensagens.length > 0
            ? <Mensagem bsStyle={this.state.mensagemEstilo} mensagens={this.state.mensagens} />
            : null;

        return (
            <Grid>
                <h1>Pesquisa de Fiscalização de SS</h1>
                <Form>
                    <Row className="show-grid">
                        <Col xs={12} sm={12} md={12} lg={12}>
                            {msg}
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
                                onChange={this.onInputChange} />
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <SelectCustomizado
                                id="medicao"
                                label="Medição"
                                placeholder="Medição..."
                                value={this.state.medicao}
                                items={this.state.medicoes}
                                onChange={this.onInputChange} />
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <SelectCustomizado
                                id="tipoFisc"
                                label="Tipo Fiscalização"
                                placeholder="Tipo Fiscalização..."
                                value={this.state.tipoFisc}
                                items={this.state.tiposFisc}
                                onChange={this.onInputChange} />
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <FormGroup controlId="numSS" validationState={this.state.vsNumSS}>
                                <ControlLabel htmlFor="numSS">Número SS</ControlLabel>
                                <MaskedInput
                                    mask={[/\d/, /\d/, '/', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                                    className="form-control"
                                    placeholder="Informe o número da SS"
                                    guide={true}
                                    id="numSS"
                                    value={this.state.numSS}
                                    onChange={this.onInputChange} />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2}>
                            <FormGroup controlId="dataInicio" validationState={this.state.vsDataInicio}>
                                <ControlLabel htmlFor="dataInicio">Data Início</ControlLabel>
                                <MaskedInput
                                    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                    className="form-control"
                                    placeholder="Informe a data inicial"
                                    guide={true}
                                    id="dataInicio"
                                    value={this.state.dataInicio.toString()}
                                    onChange={this.onInputChange} />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2}>
                            <FormGroup controlId="dataFim" validationState={this.state.vsDataFim}>
                                <ControlLabel htmlFor="dataFim">Data Fim</ControlLabel>
                                <MaskedInput
                                    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                    className="form-control"
                                    placeholder="Informe a data final"
                                    guide={true}
                                    id="dataFim"
                                    value={this.state.dataFim.toString()}
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
                                onChange={this.onInputChange} />
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={5} sm={5} md={5} lg={5}>
                            <ButtonToolbar>
                                <Button bsStyle="success"
                                    style={{ width: 100 }}
                                    onClick={this.pesquisar}>
                                    <Glyphicon glyph="search" /> Pesquisar
                                </Button>
                                <Button bsStyle="primary"
                                    style={{ width: 100 }}
                                    onClick={() => { console.log(this.state.dados); }}
                                    disabled={this.state.dados.length === 0}>
                                    <Glyphicon glyph="export" /> CSV
                                </Button>
                                <Button bsStyle="danger"
                                    style={{ width: 100 }}
                                    onClick={() => { }}
                                    disabled={this.state.dados.length === 0}>
                                    <Glyphicon glyph="export" /> PDF
                                </Button>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                    <br />
                    <Row className="show-grid">
                        <Col xs={12} sm={12} md={12} lg={12}>
                            <ReactTable
                                ref={this.myReactTable}
                                data={this.state.dados}
                                columns={this.getTableColumns()}
                                defaultPageSize={10}
                                loading={this.state.loading}
                                filterable={true}
                                previousTex={this.previousText}
                                nextText={this.nextText}
                                loadingText={this.loadingText}
                                noDataText={this.noDataText}
                                pageText={this.pageText}
                                ofText={this.ofText}
                                rowsText={this.rowsText}
                                pageJumpText={this.pageJumpText}
                                rowsSelectorText={this.rowsSelectorText}
                            />
                        </Col>
                    </Row>
                </Form>
            </Grid >
        );
    }
}

export default FormularioPesquisa;
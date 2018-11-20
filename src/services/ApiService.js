import HttpStatus from 'http-status-codes';

export default class ApiService {
    static getConformidades() {
        const conformidades = [
            { id: '1', desc: 'Conforme' },
            { id: '2', desc: 'Não Conforme' },
        ];

        return conformidades;
    }

    static async getContratos() {
        try {
            const rawResponse = await fetch(process.env.REACT_APP_API_CONTRATO);

            return await rawResponse.json();
        } catch (erro) {
            throw Error('Get Contrato: ' + erro);
        }
    }

    static async getMedicoes(resposta) {
        try {
            const rawResponse = await fetch(process.env.REACT_APP_API_MEDICAO.replace('XXX', resposta));

            return await rawResponse.json();
        } catch (erro) {
            throw Error('Get Medição: ' + erro);
        }
    }

    static async getTiposFisc() {
        try {
            const rawResponse = await fetch(process.env.REACT_APP_API_TIPOFISC);

            return await rawResponse.json();
        } catch (erro) {
            throw Error('Get Tipo Fisc: ' + erro);
        }
    }

    static async getFiscalizacaoPorId(id) {
        try {
            const rawResponse = await fetch(process.env.REACT_APP_API_FISC_PESQUISAR + id);

            const httpCod = rawResponse.status;

            if (rawResponse.status === HttpStatus.NO_CONTENT) return ({ sucesso: undefined, erro: undefined, httpCod });

            if (rawResponse.status === HttpStatus.OK) return await rawResponse.json().then(sucesso => ({ sucesso, httpCod }));

            return await rawResponse.json().then(erro => ({ erro, httpCod }));
        } catch (erro) {
            throw Error('Get Fiscalização Por Id: ' + erro);
        }
    }

    static async getFiscalizacao(objFisc) {
        try {
            const rawResponse = await fetch(process.env.REACT_APP_API_FISC_PESQUISAR, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objFisc)
            });

            const httpCod = rawResponse.status;

            if (rawResponse.status === HttpStatus.NO_CONTENT) return ({ sucesso: undefined, erro: undefined, httpCod });

            if (rawResponse.status === HttpStatus.OK) return await rawResponse.json().then(sucesso => ({ sucesso, httpCod }));

            return await rawResponse.json().then(erro => ({ erro, httpCod }));
        } catch (erro) {
            throw Error('Get Fiscalização: ' + erro);
        }
    }

    static async getFiscalizacoes(objFisc) {
        try {
            const rawResponse = await fetch(process.env.REACT_APP_API_FISC_PESQUISAR_TODAS, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objFisc)
            });

            const httpCod = rawResponse.status;

            if (rawResponse.status === HttpStatus.NO_CONTENT) return ({ sucesso: undefined, erro: undefined, httpCod });

            if (rawResponse.status === HttpStatus.OK) return await rawResponse.json().then(sucesso => ({ sucesso, httpCod }));

            return await rawResponse.json().then(erro => ({ erro, httpCod }));
        } catch (erro) {
            throw Error('Get Fiscalizações: ' + erro);
        }
    }

    static async salvarFiscalizacao(objFisc) {
        try {
            const rawResponse = await fetch(process.env.REACT_APP_API_FISC_SALVAR, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objFisc)
            });

            const httpCod = rawResponse.status;

            if (rawResponse.status === HttpStatus.NO_CONTENT) return ({ sucesso: undefined, erro: undefined, httpCod });

            if (rawResponse.status === HttpStatus.OK) return await rawResponse.json().then(sucesso => ({ sucesso, httpCod }));

            return await rawResponse.json().then(erro => ({ erro, httpCod }));
        } catch (erro) {
            throw Error('Salvar Fiscalização: ' + erro);
        }
    }

    static async excluirFiscalizacao(objFisc) {
        try {
            const rawResponse = await fetch(process.env.REACT_APP_API_FISC_EXCLUIR, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objFisc)
            });

            const httpCod = rawResponse.status;

            if (rawResponse.status === HttpStatus.NO_CONTENT) return ({ sucesso: undefined, erro: undefined, httpCod });

            return await rawResponse.json().then(erro => ({ erro, httpCod }));
        } catch (erro) {
            throw Error('Excluir Fiscalização: ' + erro);
        }
    }
}
export default class ApiService {
    static getConformidades() {
        const conformidades = [
            { id: '1', desc: 'Conforme' },
            { id: '2', desc: 'Não Conforme' },
        ];

        return conformidades;
    }

    static async getFiscalizacao(idFisc, idMedicao, idTpFiscalizacao, ss) {
        try {
            const objFisc = {
                'idMedicao': idMedicao,
                'idTpFiscalizacao': idTpFiscalizacao,
                'sS': ss,
                'idFiscalizacoesSs': idFisc
            }

            const rawResponse = await fetch(process.env.REACT_APP_API_FISC_PESQUISAR, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objFisc)
            });

            return await rawResponse.json();
        } catch(erro) {
            throw erro;
        }
    }

    static async getContratos() {
        try {
            const rawResponse = await fetch(process.env.REACT_APP_API_CONTRATO);

            return await rawResponse.json();
        } catch (erro) {
            throw erro;
        }
    }

    static async getMedicoes(resposta) {
        try {
            const rawResponse = await fetch(process.env.REACT_APP_API_MEDICAO.replace('XXX', resposta));

            return await rawResponse.json();
        } catch (erro) {
            throw erro;
        }
    }

    static async getTiposFisc() {
        try {
            const rawResponse = await fetch(process.env.REACT_APP_API_TIPOFISC);

            return await rawResponse.json();
        } catch (erro) {
            throw erro;
        }
    }

}
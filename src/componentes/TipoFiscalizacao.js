import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class TipoFiscalizacao extends Component {
    render() {
        return (
            <FormGroup controlId={this.props.id} validationState={this.props.validationState}>
            <ControlLabel>{this.props.label}</ControlLabel>
            <FormControl
                componentClass="select"
                value={this.props.tipoFisc}
                placeholder="Tipo de Fiscalização..."
                disabled={this.props.disabled}
                onChange={this.props.onChange}>
                <option key={0} value={0}>Selecione um Tipo...</option>
                {
                    this.props.items.map((item) => {
                        return <option key={item.idTpFiscalizacao} value={item.idTpFiscalizacao}>{item.dcTpFiscalizacao}</option>
                    })
                }
            </FormControl>
        </FormGroup>
        );
    }
}

export default TipoFiscalizacao;
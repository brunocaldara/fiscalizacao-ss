import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class Medicao extends Component {
    render() {
        return (
            <FormGroup controlId={this.props.id} validationState={this.props.validationState}>
                <ControlLabel>{this.props.label}</ControlLabel>
                <FormControl
                    componentClass="select"
                    value={this.props.value}
                    placeholder="Medição..."
                    disabled={this.props.disabled}
                    onChange={this.props.onChange}>
                    <option key={0} value={0} situacao={1}>Selecione uma Medição...</option>
                    {
                        this.props.items.map((med) => {
                            return <option key={med.idMedicao} value={med.idMedicao} situacao={med.csSituacao}>{med.refMedicao}</option>
                        })
                    }
                </FormControl>
            </FormGroup>
        );
    }
}

export default Medicao;
import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class Contrato extends Component {
    render() {
        return (
            <FormGroup controlId={this.props.id} validationState={this.props.validationState}>
                <ControlLabel>{this.props.label}</ControlLabel>
                <FormControl componentClass="select"
                    value={this.props.value}
                    placeholder="Contrato..."
                    disabled={this.props.disabled}
                    onChange={this.props.onChange}>
                    <option key={0} value={0}>Selecione um Contrato...</option>
                    {
                        this.props.items.map((item) => {
                            return <option key={item.codContrato} value={item.codContrato}>{item.descContrato}</option>
                        })
                    }
                </FormControl>
            </FormGroup>
        );
    }
}

export default Contrato;
import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

class Conformidade extends Component {
    render() {
        return (
            <FormGroup controlId={this.props.id} validationState={this.props.validationState}>
                <ControlLabel>{this.props.label}</ControlLabel>
                <FormControl
                    componentClass="select"
                    value={this.props.value}
                    placeholder='Conformidade...'
                    disabled={this.props.disabled}
                    onChange={this.props.onChange}>
                    <option key={0} value={0}>Selecione uma Conformidade...</option>
                    <option key={1} value={1}>Conforme</option>
                    <option key={2} value={2}>Não Conforme</option>
                </FormControl>
            </FormGroup>
        );
    }
}

export default Conformidade;
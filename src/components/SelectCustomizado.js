import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

const OptionCustomizado = props => {
    if (props.situacao !== undefined) return <option value={props.id} situacao={props.situacao}>{props.desc}</option>

    return <option value={props.id}>{props.desc}</option>
}

class SelectCustomizado extends Component {
    render() {
        return (
            <FormGroup controlId={this.props.id} validationState={this.props.validationState}>
                <ControlLabel>{this.props.label}</ControlLabel>
                <FormControl componentClass="select"
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    disabled={this.props.disabled}
                    onChange={this.props.onChange}>
                    <OptionCustomizado key={'0'} id={'0'} desc="Selecione um valor..." />
                    {
                        this.props.items.map((item) => {
                            return <OptionCustomizado key={item.id} id={item.id} desc={item.desc} situacao={item.situacao} />
                        })
                    }
                </FormControl>
            </FormGroup>
        );
    }
}

export default SelectCustomizado;
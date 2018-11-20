import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class Mensagem extends Component {
    render() {
        return (
            <Alert bsStyle={this.props.bsStyle}>
                {
                    this.props.mensagens.map((msg, index) => {
                        return <p key={index}><strong>{msg}</strong></p>
                    })
                }
            </Alert>
        );
    }
}

export default Mensagem;
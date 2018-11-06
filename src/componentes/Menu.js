import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FormularioManut from "./FormularioManut";
import FormularioPesquisa from "./FormularioPesquisa";

const Menu = () => {
    return (
        <Router>
            <Switch>
                <Route path="/pesquisar" component={FormularioPesquisa} />
                <Route exact path="/:id?" component={FormularioManut} />
                <Route path="*" render={() => <div>Pagina 404</div>} />
            </Switch>
        </Router>
    );
}

export default Menu;
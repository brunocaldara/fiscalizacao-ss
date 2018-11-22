import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FormularioManut from "./FormularioManut";
import FormularioPesquisa from "./FormularioPesquisa";
import RouteService from '../services/RouteService';

const Menu = () => {
    return (
        <Router basename={RouteService.PUBLIC_PATH}>
            <Switch>
                <Route path={RouteService.SEARCH} component={FormularioPesquisa} />
                <Route exact path={RouteService.HOME} component={FormularioManut} />
                <Route path="*" render={() => <div>Pagina 404</div>} />
            </Switch>
        </Router>
    );
}

export default Menu;
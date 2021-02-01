import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Admin from './Admin';
import Install from './Install/Install';
import Main from './Main';
import NotFound from './NotFound';

function App() {
    return (
        <Switch>
            <Route path='/' component={Main} exact />
            <Route path='/install' component={Install} />
            <Route path='/admin' component={Admin} />
            <Route component={NotFound} />
        </Switch>
    );
}

export default App;

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Admin from './Admin';
import Install from './Install';
import Main from './Main';
import NotFound from './NotFound';

function App() {
    return (
        <div>
            <Switch>
                <Route path='/' component={Main} exact={true} />
                <Route path='/install' component={Install} />
                <Route path='/admin' component={Admin} />
                <Route component={NotFound} />
            </Switch>
        </div>

    );
}

export default App;

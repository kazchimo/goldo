import { ConfirmProvider } from "material-ui-confirm";
import { SnackbarProvider } from "notistack";
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import App from "./App";
import { Notifier } from "./components/organisms/Notifier";
import { AppTemplate } from "./components/templates/AppTemplate";
import { reducer } from "./modules/reducers";
import { allSagas } from "./modules/sagas";
import reportWebVitals from "./reportWebVitals";
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducer, applyMiddleware(sagaMiddleware, logger));

sagaMiddleware.run(allSagas);

ReactDOM.render(
  <React.StrictMode>
    <DragDropContext onDragEnd={console.log}>
      <SnackbarProvider maxSnack={3}>
        <ConfirmProvider>
          <Provider store={store}>
            <AppTemplate>
              <Notifier />
              <App />
            </AppTemplate>
          </Provider>
        </ConfirmProvider>
      </SnackbarProvider>
    </DragDropContext>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

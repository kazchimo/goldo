import { MuiThemeProvider } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import "date-fns";
import { ConfirmProvider } from "material-ui-confirm";
import { SnackbarProvider } from "notistack";
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import App from "./App";
import { Notifier } from "./components/organisms/Notifier";
import { AppTemplate } from "./components/templates/AppTemplate";
import "./index.css";
import { theme } from "./consts/theme";
import { reducer } from "./modules/reducers";
import { allSagas } from "./modules/sagas";
import reportWebVitals from "./reportWebVitals";
import DateFnsUtils from "@date-io/date-fns";

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

if (process.env.NODE_ENV !== "production") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

const store = createStore(reducer, applyMiddleware(...middlewares));

sagaMiddleware.run(allSagas);

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DragDropContext onDragEnd={console.log}>
          <SnackbarProvider maxSnack={3}>
            <BrowserRouter>
              <ConfirmProvider>
                <Provider store={store}>
                  <AppTemplate>
                    <Notifier />
                    <App />
                  </AppTemplate>
                </Provider>
              </ConfirmProvider>
            </BrowserRouter>
          </SnackbarProvider>
        </DragDropContext>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import App from "./App";
import { loadJSON } from "./helpers/loadJSON";
import { i18n } from "./translate/i18n";
import axios from "axios";

const config = loadJSON("/config.json");

if (!config) {
  window.renderError(i18n.t("frontendErrors.ERR_CONFIG_ERROR"));
} else {
  const protocol = config.BACKEND_PROTOCOL || "https";
  const hostname = config.BACKEND_HOST || window.location.hostname;
  const port = config.BACKEND_PORT ? `:${config.BACKEND_PORT}` : 443;
  const path = config.BACKEND_PATH || hostname === "localhost" ? "" : "/backend";

  const backendUrl = `${protocol}://${hostname}${port}${path}`;

  axios.get(backendUrl)
    .then((response) => {
      console.log(response);
      const serverDate = new Date(response.headers["date"]);
      const clientDate = new Date();
      const diff = Math.abs(serverDate - clientDate);
      const diffMinutes = Math.floor((diff / 1000) / 60);
      if (diffMinutes > 5) {
        window.renderError(i18n.t("frontendErrors.ERR_CLOCK_OUT_OF_SYNC"));
        return;
      }

      ReactDOM.render(
        // <React.StrictMode>
        <CssBaseline>
          <App />
        </CssBaseline>
        // </React.StrictMode>
        ,
        document.getElementById("root"),
        () => {
          window.finishProgress();
        }
      );
    })
    .catch(() => {
      window.renderError(i18n.t("frontendErrors.ERR_BACKEND_UNREACHABLE"));
    });
}

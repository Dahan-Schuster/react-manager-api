/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import Event from "@ioc:Adonis/Core/Event";
import Logger from "@ioc:Adonis/Core/Logger";
import ApiError from "App/Exceptions/ApiError";

import "./events/users";

Event.onError((event, error, eventData) => {
  if (error instanceof ApiError) {
    Logger.error(
      {
        event,
        err:
          error.code >= 500
            ? error
            : {
                code: error.code,
                message: error.message,
              },
        eventData,
      },
      "Erro no evento"
    );
  } else {
    Logger.error(
      {
        event,
        err: error,
        eventData,
      },
      "Erro desconhecido no evento"
    );
  }
});

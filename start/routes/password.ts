import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post(
    "/enviar-email-recuperacao",
    "Password/SendRecoveryEmailController"
  );
  Route.post("/recuperar", "Password/RecoverPasswordController");
}).prefix("senha");

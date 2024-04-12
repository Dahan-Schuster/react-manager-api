import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.group(() => {
    // rota para alterar os tipos de permissão disponíveis para o módulo
    Route.put("/", "Modulos/UpdateTiposPermissoesModuloController");
  }).prefix(":id/tiposPermissoes");

  Route.get("/", "Modulos/GetModulosController");
}).prefix("modulo");

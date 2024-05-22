import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "Perfis/GetPerfisController").middleware("auth:perfis-listar");
  Route.get("/permissoes", "Perfis/GetPerfisPermissoesController").middleware(
    "auth:perfis-listar"
  );
  Route.get("/:id", "Perfis/ShowPerfilController").middleware(
    "auth:perfis-listar"
  );

  Route.post("/", "Perfis/StorePerfisController").middleware(
    "auth:perfis-criar"
  );

  Route.put("/:id", "Perfis/UpdatePerfisController").middleware(
    "auth:perfis-editar"
  );

  Route.delete("/:id", "Perfis/DeletePerfisController").middleware(
    "auth:perfis-deletar"
  );
}).prefix("perfis");

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "Users/GetUsersController").middleware("auth:usuarios-listar");
  Route.get("/:id", "Users/ShowUserController").middleware(
    "auth:usuarios-listar"
  );
  Route.post("/", "Users/StoreUsersController").middleware(
    "auth:usuarios-criar"
  );
  Route.put("/:id", "Users/UpdateUsersController").middleware(
    "auth:usuarios-editar"
  );
  Route.delete("/:id", "Users/DeleteUsersController").middleware(
    "auth:usuarios-deletar"
  );

  Route.group(() => {
    Route.post("", "Users/LinkPermissaoUsuarioController");
    Route.delete("", "Users/UnlinkPermissaoUsuarioController");
  }).prefix("/:id/permissoes/:idPermissao");
}).prefix("usuario");

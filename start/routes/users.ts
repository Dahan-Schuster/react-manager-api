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
  Route.put(
    "/:id/trocar-status",
    "Users/ChangeStatusUsuarioController"
  ).middleware("auth:usuarios-alterar-status");

  Route.put(
    "/:id/alterar-perfil",
    "Users/AlterarPerfilUsuarioController"
  ).middleware("auth:usuarios-alterar-permissao");

  Route.group(() => {
    Route.post("/:idPermissao", "Users/LinkPermissaoUsuarioController");
    Route.delete("/:idPermissao", "Users/UnlinkPermissaoUsuarioController");
    Route.put("", "Users/UpdatePermissoesUsuarioController");
  })
    .prefix(":id/permissoes")
    .middleware("auth:usuarios-alterar-permissao");
}).prefix("usuario");

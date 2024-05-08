import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.group(() => {
    Route.get("", "ImagensSistema/GetImagensController").middleware(
      "auth:temas-listar"
    );
    Route.post("", "ImagensSistema/StoreImagensController").middleware(
      "auth:temas-criar"
    );
    Route.put("/:id", "ImagensSistema/UpdateImagensController").middleware(
      "auth:temas-editar"
    );
    Route.delete("/:id", "ImagensSistema/DeleteImagensController").middleware(
      "auth:temas-deletar"
    );
  }).prefix("imagens");

  Route.group(() => {
    Route.get("ativo-light", "Temas/Mui/GetTemaAtivoController.light");
    Route.get("ativo-dark", "Temas/Mui/GetTemaAtivoController.dark");

    Route.get("", "Temas/Mui/GetTemasController").middleware(
      "auth:temas-listar"
    );
    Route.get(":id", "Temas/Mui/ShowTemaController").middleware(
      "auth:temas-listar"
    );
    Route.post("", "Temas/Mui/StoreTemasController").middleware(
      "auth:temas-criar"
    );
    Route.put("", "Temas/Mui/UpdateTemasController").middleware(
      "auth:temas-editar"
    );
    Route.delete("/:id", "Temas/Mui/DeleteTemasController").middleware(
      "auth:temas-deletar"
    );
    Route.put(":id/ativar", "Temas/Mui/AtivarTemaController").middleware(
      "auth:temas-alterar-status"
    );
  }).prefix("temas-mui");

  Route.group(() => {
    Route.get("", "ItensMenu/GetItensMenuController").middleware(
      "auth:itens-menu-listar"
    );
    Route.get(":id", "ItensMenu/ShowItensMenuController").middleware(
      "auth:itens-menu-listar"
    );
    Route.post("", "ItensMenu/StoreItensMenuController").middleware(
      "auth:itens-menu-criar"
    );
    Route.put(":id", "ItensMenu/UpdateItensMenuController").middleware(
      "auth:itens-menu-editar"
    );
    Route.delete(":id", "ItensMenu/DeleteItensMenuController").middleware(
      "auth:itens-menu-deletar"
    );
  }).prefix("itens-menu");
}).prefix("sistema");

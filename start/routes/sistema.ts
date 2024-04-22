import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.group(() => {
    Route.get("", "Paletas/GetPaletasController").middleware(
      "auth:temas-listar"
    );
    Route.get("/:id", "Paletas/ShowPaletaController").middleware(
      "auth:temas-listar"
    );
    Route.post("", "Paletas/StorePaletasController").middleware(
      "auth:temas-criar"
    );
    Route.put("/:id", "Paletas/UpdatePaletasController").middleware(
      "auth:temas-editar"
    );
    Route.delete("/:id", "Paletas/DeletePaletasController").middleware(
      "auth:temas-deletar"
    );
  }).prefix("paletas");

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
    Route.post("", "Temas/Mui/StoreTemasController").middleware(
      "auth:temas-criar"
    );
    Route.put("", "Temas/Mui/UpdateTemasController").middleware(
      "auth:temas-editar"
    );
    Route.delete("/:id", "Temas/Mui/DeleteTemasController").middleware(
      "auth:temas-deletar"
    );
    Route.put(
      ":id/alterar-status",
      "Temas/Mui/ChangeStatusTemaController"
    ).middleware("auth:temas-alterar-status");
  }).prefix("temas-mui");
}).prefix("sistema");

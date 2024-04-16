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
}).prefix("sistema");

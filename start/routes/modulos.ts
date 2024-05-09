import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "Modulos/GetModulosController").middleware(
    "auth:perfis-listar,perfis-editar,usuarios-editar,usuarios-criar"
  );
}).prefix("modulo");

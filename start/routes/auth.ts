import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("/login", "Auth/LoginController");
  Route.post("/logout", "Auth/LogoutsController");
});

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "Users/GetUsersController");
  Route.get("/:id", "Users/ShowUserController");
  Route.post("/", "Users/StoreUsersController");
  Route.put("/:id", "Users/UpdateUsersController");
  Route.delete("/:id", "Users/DeleteUsersController");
})
  .prefix("usuario")
  .middleware("auth");

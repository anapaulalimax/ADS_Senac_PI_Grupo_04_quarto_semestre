require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRoutes = require("./routes/usersRoutes");
var careProfessionalsRoutes = require("./routes/careProfessionalsRoutes");
var patientsRoutes = require("./routes/patientsRoutes");
var appointmentsRoutes = require("./routes/appointmentsRoutes");

var app = express();

// Configuração Swagger
// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'HomeCare API',
//       version: '1.0.0',
//       description: '[Swagger UI](http://localhost:3000/swagger/)',
//     },
//   },
//   apis: ['./routes/*.js'],
// };

// const swaggerSpec = swaggerJsdoc(options);

// // Middleware para servir a documentação Swagger
// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const syncDatabase = require("./syncDatabase");
syncDatabase();

console.log("Carregando rotas...");

app.use("/", indexRouter);
console.log("/ rota carregada");

app.use("/api/users", usersRoutes);
console.log("/api/users rota carregada");

app.use("/api/careProfessionals", careProfessionalsRoutes);
console.log("/api/careProfessionals rota carregada");

app.use("/api/patients", patientsRoutes);
console.log("/api/patients rota carregada");

app.use("/api/appointments", appointmentsRoutes);
console.log("/api/appointments rota carregada");

app.use(function (req, res, next) {
  console.log("404 - Rota não encontrada");
  next(createError(404));
});

app.use(function (err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

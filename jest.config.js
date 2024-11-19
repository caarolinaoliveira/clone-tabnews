//serve para definir alguns comportamentos do jest
//comportamentos que ele não tem por padrão.
// iremos importar o módulo
// a função desse arquivo é exportar um objeto de configuração
//qeu vão configurar o jest para ele se comportar de tal forma
// quemn vai gerar isso é o sub-módulo next/jest
const dotenv = require("dotenv");
dotenv.config({
  path: ".env.development",
});
const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "." });
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
});
// o que a função nextJest devolve? devolve várias outras funções
// ela é uma fábrica de funções (factory)

module.exports = jestConfig;

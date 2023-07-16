# teste-backend-uhuu

Este é um backend desenvolvido para o teste técnico da Uhuu. O projeto foi desenvolvido com o framework **Nest.js**, sendo usado o **MongoDB** como banco de dados. O projeto possui a API documentada no Swagger, testes e2e e testes unitários, com 100% de cobertura.

## Como rodar localmente

Existe duas formas de rodar essa aplicação, [com Docker](#with-docker) ou [sem o Docker](#without-docker)

### Rodando com Docker<a name="with-docker"></a>


#### Aplicação
Para rodar a aplicação com docker, é preciso ter o plugin Docker Compose instalado também. Com isso mente, agora é preciso adicionar um arquivo `.env` (você pode usar o `.env.example` como base)

```
JWT_SECRET=abacadabra
```

> Não é necessário especificar o MONGO_URI pois ele já é especificado no docker-compose

Após isso, basta executar o comando abaixo:

```
docker compose -f docker-compose.prod.yml up --build
```

Os endpoints estão listados [aqui](#docs)

#### Testes
Para rodar os testes basta executar o comando abaixo:

```
docker compose -f docker-compose.test.yml up --build
```

### Rodar sem Docker<a name="without-docker"></a>

#### Aplicação

Para rodar a aplicação sem o Docker, você precisará de uma instância do MongoDB rodando, pode ser usado um serviço local ou usar o container do Docker do Mongo.

Primeiramente é preciso instalar as dependência do projeto:

```
yarn
```

> Seria possível usar npm mas seria criado um package-lock.json

Agora, é preciso adicionar o arquivo `.env` (pode usar o `.env.example` como base)

```
MONGO_URI=mongodb://localhost:27017/teste-backend-uhuu
JWT_SECRET=abacadabra
```

> Você pode rodar o app localmente e rodar um container do docker e apontar para esse container no env, para isso basta rodar o seguinte comando para subir apenas o MongoDB:
> 
> ```
> docker compose -f docker-compose.prod.yml up mongo
> ```

Agora será necessário "compilar" a aplicação:

```
yarn build // ou npm run build
```

E finalmente rodar a aplicação:

```
yarn start // ou npm start
```

Os endpoints estão listados [aqui](#docs)

#### Testes
Os testes usam uma instância real do MongoDB, logo, será necessário ter uma instância do MongoDB apenas para os testes, pode ser usado a mesma estratégia do anterior e usar o container do Mongo de teste.

Primeiramente é necessário configurar as variáveis do ambiente de teste, adicione uma arquivo `.env.test` (pode usar o `.env.example` como base)

```
MONGO_URI=mongodb://localhost:27017/test
JWT_SECRET=abacadabra
```

> Para rodar os testes localmente com um container do Mongo de Teste, basta rodar o comando:
> ```
> docker compose -f docker-compose.test.yml up mongo-test
> ```
>
> É necessário também mudar o env:
> ```
> MONGO_URI=mongodb://localhost:3001/test
> ```

Agora é só executar os testes (isso irá rodar os testes e2e e unitários):

```
yarn test
```

# Coverage
O serviço possui 100% de cobertura de testes

# Documentação <a name="docs"></a>

A API conta com uma documentação pelo Swagger que pode ser acessada pela rota `/docs` quando estiver rodando a aplicação

# Fluxo Git

Para o git, pode ser usado a estratégia do Gitflow. Onde há uma branch de produção (master/main), uma de homologação, uma de desenvolvimento e uma para cada nova feature. As branches de features seriam mescladas à desenvolvimento e posteriormente à homologação, por fim, a branch de homologação, quando devidamente testada, seria mesclada à produção. Em conjunto com o Gitflow pode usado o Semantic Versioning (exemplo: 1.1.2) e o Conventional Commits
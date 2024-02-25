## Acessar os docs

Dps de iniciar o servidor visite o endereço:

```
http://127.0.0.1:8000/docs#/
```
---
## Rodar os testes

~~~
poetry run pytest -v -x
~~~
---
# Informações e documentação
## Passo a passo para primeira utilização de desenvolvimento
------

1. instalar dependências com o poetry
~~~
poetry install
~~~
2. estando no diretório do projeto, subir o container com banco de dados
~~~
docker-compose up -d
~~~
extra: caso queira acompanhar os logs do banco de dados
~~~
docker ps
docker logs -f desafiospotsat-postgres
~~~

3. rodar codigo pelo terminal utilizando o poetry e o uvicorn da API
~~~
poetry run uvicorn app.main:app --reload
~~~
4. Abrir navegador em: http://127.0.0.1:8000/docs#/
---

## Mais informações em https://fastapi.tiangolo.com/


# desafio_backend_2024

Seja bem-vindo! Este desafio foi projetado para avaliar a 
sua capacidade técnica de implementação de um projeto backend e utilização de algoritimos de otimização e uma tecnologia de georeferênciamento. Na Spotsat precisamos diariamente trabalhar com referências geograficas e para isso utilizamos uma extenção no postgres, o [postgis](https://postgis.net/). O desafio consiste na construção de uma api que possa utiliza-lo.

## Proposta

Crie um CRUD de grafos com cordenadas geograficas(pontos ou poligonos) que deve receber como entrada em uma rota um grafo direcionado, salvar o mesmo no banco de dados, uma outra rota apenas para buscar por um grafo em específico por o id do mesmo, um terceira rota para dado um grafo salvo anteriormente, sobre ele buscarmos todas as possíveis rotas entre dois pontos do grafo baseado em um limite de paradas ou não, e uma quarta e última rota que semelhante a terceira, se baseia em um grafo cadastrado anteriormente no banco de dados, e baseado nesse grafo, se busca a menor rota possível entre dois pontos desse dado grafo.

## Instruções

- Utilize qualquer linguagem de sua escolha.
- Utilize arquitetura MVC.
- Utilize o PostgreSQL+PostGIS para determinar as distancias entre os pontos.
- Implemente configurações de segurança basica e utilize um sistema de logs para identiicar acesso autorizado, não autorizado, edição e exclusão de objetos no banco. Além de quais quer outros logs que julgar necessário.
- Você deve aplicar testes automatizados ao menos nas funcionalides basicas.
- Sua aplicação deve ter imagem docker otimizada para produção.
- Configure um workflow no seu repositório git para conferir lint e testes.

## Diferênciais

- Utilizar Node preferêncialmente com NestJs ou Python com Fastify.
- Demonstrar calculo de custo computacional do algoritimo de busca e conclusões de otimização.
- Implementar implementação RBAC básica para organização dos usuários e níveis de acesso.
- Deploy básico em plataforma gratuita de sua escolha.
- Documentação de uso(Contrato da API).

## Como entregar

Você deve crie uma branch separada da main neste repositório e abra um pull request marcando o avaliador como reviewer, seu pr deve seguir os padrões adequados e deve ser aberto até o dia 02/02/2024, sexta feira. Não esqueça de fazer self review!

Bom desafio!

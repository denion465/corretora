# Corretora do Daniel

### Descrição
Um projeto feito com Node.js, para consultar cotações de ações.

Dados das ações sendo consultadas na [Alpha Vantage](https://www.alphavantage.co), estou ultilizando o PostgreSQL para salvar dados atualizados.

## 🛠 Tecnologias usadas:
<div align="start">
  <a href="https://nodejs.org" target="_blank" style="text-decoration: none;">
    <img
      src="https://img.shields.io/static/v1?label=|&message=Node.js&color=informational&style=plastic&logo=NODE.JS"
    />
  </a>
  <a href="https://www.npmjs.com/package/express" target="_blank" style="text-decoration: none;">
    <img
      src="https://img.shields.io/static/v1?label=|&message=Express&color=informational&style=plastic&logo=EXPRESS"
    />
  </a>
  <a href="https://www.typescriptlang.org" target="_blank" style="text-decoration: none;">
    <img
      src="https://img.shields.io/static/v1?label=|&message=Typescript&color=informational&style=plastic&logo=TYPESCRIPT"
    />
  </a>
  <a href="https://www.postgresql.org" target="_blank" style="text-decoration: none;">
    <img
      src="https://img.shields.io/static/v1?label=|&message=PostgreSQL&color=informational&style=plastic&logo=POSTGRESQL"
    />
  </a>
</div>

## 📘 Libs:

Typeorm, Date-fns, Axios, eslint.

## Requisitos:

[Node.js](https://nodejs.org) com versão acima da 14.x.

Um banco [PostgreSQL](https://www.postgresql.org) rodando na porta padrão.

## Como rodar a API:
* Clone este repositório.
* Vá para pasta principal.
* para funcionamento desta aplicação, favor clicar [neste link](https://www.alphavantage.co/support/#api-key) para solicitar uma key para fazer as consultas.
* Adicionar a KEY que você gerou no arquivo .env(Foi criado um arquivo de exemplo).


* Usando Yarn:
  * Download das depêndencias usando o Yarn: ```$ yarn```
  * Iniciando a API com Yarn: ```$ yarn dev ```

* Usando NPM:
  * Download das depêndencias usando o NPM: ```$ npm install```
  * Iniciando a API com NPM: ```$ npm run dev```

* Porta da API: 3333

## Exemplos de uso (ENDPOINTS):
> Favor adicionar .SA no final de alguns símbolos de ações como VALE5.SA, PETR4.SA, GOLL4.SA, CASH3.SA, etc...

#### Retorna a cotação mais recente:

##### Request URL:
```URI
  http://localhost:3333/stocks/ETHBTC/quote
```

##### Response BODY:
```json
  {
    "name": "ETHBTC",
    "lastPrice": 0.0674,
    "pricedAt": "2022-05-22"
  }
```

#### Retorna um histórico de cotações entre duas datas:

##### Request URL:
```
http://localhost:3333/stocks/IBM/history
```

##### Query string:
```
from: 2022-04-13
to: 2022-04-16
```

##### Response BODY:
```json
{
	"name": "IBM",
	"prices": [
		{
			"opening": 128.93,
			"high": 130.58,
			"low": 126.38,
			"closing": 126.56,
			"pricedAt": "2022-04-14"
		},
		{
			"opening": 125.64,
			"high": 126.67,
			"low": 124.91,
			"closing": 126.14,
			"pricedAt": "2022-04-13"
		}
	]
}
```

#### Retorna os últimos valores de acordo com os símbolos informados:

##### Request URL:
```
http://localhost:3333/stocks/ETHBTC/compare
```

##### PAYLOAD JSON:
```json
{
  "stocks": ["PETR4.SA", "VALE5.SA"]
}
```

##### Response BODY:
```json
{
  "lastPrices": [
    {
      "name": "ETHBTC",
      "lastPrice": 0.0674,
      "pricedAt": "2022-05-22"
    },
    {
      "name": "PETR4.SA",
      "lastPrice": 34.83,
      "pricedAt": "2022-05-20"
    },
    {
      "name": "VALE5.SA",
      "lastPrice": 33.36,
      "pricedAt": "2019-02-15"
    }
  ]
}
```

#### Retorna uma projeção de ganhos de acordo com a data da compra da ação:

> Não foi considerado calculos de juros e dividendos, somente o ganho de porcentagem da ação.

##### Request URL:
```
http://localhost:3333/stocks/BBAS3.SA/gains
```

##### Query string:
```
purchasedAmount: 1000
purchasedAt: 2018-01-24
```

##### Response BODY:
```json
{
	"name": "BBAS3.SA",
	"purchasedAmount": 1000,
	"purchasedAt": "2018-01-24",
	"priceAtDate": 37.99,
	"lastPrice": 37,
	"capitalGains": -26.06
}
```

 ## Author
 ### Daniel Vidal

 * GitHub: https://github.com/denion465
 * Linkedin: https://www.linkedin.com/in/daniel-vidal465

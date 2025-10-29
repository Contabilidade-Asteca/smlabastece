# Controle de Abastecimentos – Aplicação de Frota

Este projeto é uma aplicação web construída com React e Vite para controlar os abastecimentos de uma empresa concreteira. Permite cadastrar veículos e motoristas, registrar abastecimentos e visualizar indicadores de consumo e gastos por meio de gráficos e tabelas interativos.

## Funcionalidades

* Cadastro de **veículos** com nome e placa.
* Cadastro de **motoristas** com nome e número de CNH.
* Registro de **abastecimentos**, selecionando veículo, motorista, data, quantidade de litros e valor pago.
* **Dashboard** com indicadores (total de veículos, motoristas, abastecimentos e valor gasto) e gráfico de consumo por veículo.
* Listagem dos **últimos abastecimentos** com detalhes de data, veículo, motorista, litros e custo.
* Cálculo automático do **último abastecimento**, **média de litros** e **gasto total** para cada veículo e motorista.

## Tecnologias Utilizadas

* **React** – biblioteca para construção da interface.
* **Vite** – bundler rápido para desenvolvimento e build.
* **Tailwind CSS** – utilitário para estilização responsiva.
* **Recharts** – biblioteca de gráficos para as visualizações de BI.
* **React Router** – roteamento de páginas.
* **Lucide React** – ícones SVG leves e modernos.

## Requisitos

* **Node.js** v16 ou superior
* **npm** ou **yarn**

## Instalação e Execução

**1. Clone o repositório:**

```bash
git clone [https://github.com/seu-usuario/fleet-app.git](https://github.com/seu-usuario/fleet-app.git)
cd fleet-app
````

**2. Instale as dependências:**

```bash
npm install
# ou
yarn
```

**3. Rode o servidor de desenvolvimento:**

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em http://localhost:5173 (porta padrão do Vite).

**4. Construa para produção** (opcional):

```bash
npm run build
# ou
yarn build
```

O comando acima gera a pasta `dist/` com os arquivos otimizados para deploy.

## Como Usar

Após iniciar a aplicação:

1.  Acesse o **Dashboard**, onde você verá os indicadores gerais e o gráfico de consumo por veículo.
2.  Use o menu de navegação para ir até **Veículos** ou **Motoristas** e cadastre novos registros.
3.  Na página de **Abastecimentos**, registre novos abastecimentos selecionando o veículo e o motorista correspondentes.

> **Nota:** Os dados cadastrados são mantidos apenas em memória (mock). Para persistência real, integre com uma API ou banco de dados.

## Estrutura de Pastas

```
fleet-app/
├── index.html             # Arquivo de entrada para a aplicação
├── package.json           # Definição de dependências e scripts
├── postcss.config.js      # Configuração do PostCSS
├── tailwind.config.js     # Configuração do Tailwind
├── vite.config.js         # Configuração do Vite com plugin React
├── src/
│   ├── App.jsx            # Componente raiz com definição de rotas
│   ├── main.jsx           # Ponto de entrada da aplicação React
│   ├── index.css          # Importa os diretivos do Tailwind
│   ├── data/
│   │   └── mockData.js    # Dados mockados de veículos, motoristas e abastecimentos
│   └── components/        # Componentes reutilizáveis
│       ├── Dashboard.jsx
│       ├── VehicleList.jsx
│       ├── DriverList.jsx
│       ├── FuelingList.jsx
│       └── Navigation.jsx
└── README.md              # Este arquivo
```

## Deploy com Vercel

Para fazer o deploy da aplicação no Vercel, siga os passos:

1.  Crie um repositório no GitHub e faça o push do código.
2.  Acesse sua conta no Vercel e clique em **“New Project”**.
3.  Selecione o repositório `fleet-app` e importe-o.
4.  O Vercel detectará automaticamente o framework (Vite + React). Caso necessário, configure:
      * **Build Command**: `npm run build`
      * **Output Directory**: `dist`
5.  Clique em **Deploy**. Após a finalização, sua aplicação estará disponível em uma URL pública.

## Observações Finais

  * Esta aplicação utiliza dados mockados apenas para demonstração; para uso real, integre com um serviço de back-end.
  * Sinta-se à vontade para customizar estilos ou adicionar novas funcionalidades, como autenticação de usuários e relatórios avançados.

Desenvolvido para demonstrar um painel de controle de abastecimentos para frotas de concreto. Contribuições e melhorias são bem-vindas\!

# Deploy no Railway

Este documento contém instruções para deploy desta aplicação Angular no Railway.

## Pré-requisitos

- Conta no [Railway](https://railway.app/)
- Projeto configurado no Railway

## Configuração de variáveis de ambiente

Configure as seguintes variáveis de ambiente no Railway:

- `NODE_ENV`: `production`
- `API_URL`: URL completa da sua API backend (ex: https://seu-backend-api.railway.app/api/v1)
- `PORT`: Porta para a aplicação (Railway configura automaticamente)

## Deploy

1. Conecte o repositório GitHub ao Railway
2. Railway detectará automaticamente o Procfile e iniciará o build
3. O build executará `npm install` seguido de `ng build` (via postinstall)
4. Após o build, o comando `npm start` será executado para iniciar o servidor

## Troubleshooting

- Se ocorrerem erros de build, verifique os logs no dashboard do Railway
- Certifique-se de que a versão do Node.js está configurada corretamente (18.x) 

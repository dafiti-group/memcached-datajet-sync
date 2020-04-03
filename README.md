# Memcached Datajet sync

Um Script para sincronizar dados da Datajet com o memcached.

## Install 
```sh 
yarn
```

## Run

```sh
node ./src/run.js <query>
```

### Exemplo:
```sh
node ./src/run.js blusa
```

Os resultados retornados do Datajet relacionado a <query> serão gerados no memcached.
const projeto = {
  id: 1,
  descricao: 'Vue 3.0'
}

const proxy = new Proxy(projeto, {
  get(objetoOriginal, chave) {
    console.log(`Someone asked for the key ${chave} to the project!`)
    return objetoOriginal[chave]
  },
  set(objetoOriginal, chave, valor){
    console.log(`Someone changed the project key ${valor}!`)
    objetoOriginal[chave] = valor
  }
})

proxy.descricao = 'React é melhor!!!'

console.log(proxy.descricao)
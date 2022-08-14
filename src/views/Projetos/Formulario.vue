<template>
  <section>
    <form @submit.prevent="salvar">
      <div class="field">
        <label for="nomeDoProjeto" class="label"> Nome do Projeto </label>
        <input
          type="text"
          class="input"
          v-model="nomeDoProjeto"
          id="nomeDoProjet"
        />
      </div>
      <div class="field">
        <button class="button" type="submit">Salvar</button>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { defineComponent, ref } from "vue";
import { TipoNotificacao } from "@/interfaces/INotificacao";
import useNotificador from '@/hooks/notificador'
import { CADASTRAR_PROJETOS, ALTERAR_PROJETOS } from "@/store/Actions";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Formulario",
  props: {
    id: {
      type: String
    }
  },
  setup (props) {
    const router = useRouter()
    const store = useStore()
    const { notificar } = useNotificador()

    const nomeDoProjeto = ref("")

    if(props.id) {
      const projeto = store.state.projeto.projetos.find(proj => proj.id == props.id)
      nomeDoProjeto.value = projeto?.nome || ''
    }

    const sucesso = () => {
      nomeDoProjeto.value = "";
      notificar(TipoNotificacao.SUCESSO, 'Excelente!', 'O projeto foi cadastrado com sucesso!')
      router.push('/projetos')
    }
    
    const warnMessage = () => {
      nomeDoProjeto.value = "";
      notificar(TipoNotificacao.ATENCAO, 'Muito Bem!', 'O nome do projeto foi enfim, alterado! ')
      router.push('/projetos')
    }

  const salvar = () => {
      if (props.id) {
        store.dispatch(ALTERAR_PROJETOS, {
          id: props.id,
          nome: nomeDoProjeto.value
        }).then(() => warnMessage())
      } else {
        store.dispatch(CADASTRAR_PROJETOS, nomeDoProjeto.value)
        .then(() => sucesso())
      }
    }
    return {
      nomeDoProjeto,
      salvar
    }
  }
});
</script>

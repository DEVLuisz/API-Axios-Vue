import { createStore, Store, useStore as vuexUseStore } from "vuex";
import { InjectionKey } from "vue";
import { INotificacao } from "@/interfaces/INotificacao";
import ITarefa from "@/interfaces/ITarefa";
import { StateProjeto, projeto } from "@/Modules/State";
import http from "@/Cli/Http";
import {
  ADICIONAR_TAREFAS,
  ALTERA_TAREFA,
  DEFINIR_TAREFAS,
  NOTIFICAR,
} from "./tipo-mutacoes";
import { ALTERAR_TAREFA, CADASTRAR_TAREFAS, OBTER_TAREFAS } from "./Actions";

export interface Estado {
  tarefas: ITarefa[];
  notificacoes: INotificacao[];
  projeto: StateProjeto;
}

export const key: InjectionKey<Store<Estado>> = Symbol();

export const store = createStore<Estado>({
  state: {
    tarefas: [],
    notificacoes: [],
    projeto: {
      projetos: [],
    },
  },
  mutations: {
    [DEFINIR_TAREFAS](state, tarefas: ITarefa[]) {
      state.tarefas = tarefas;
    },
    [ADICIONAR_TAREFAS](state, tarefa: ITarefa) {
      state.tarefas.push(tarefa);
    },
    [ALTERA_TAREFA](state, tarefa: ITarefa) {
      const index = state.tarefas.findIndex((t) => t.id == tarefa.id);
      state.tarefas[index] = tarefa;
    },
    [NOTIFICAR](state, novaNotificacao: INotificacao) {
      novaNotificacao.id = new Date().getTime();
      state.notificacoes.push(novaNotificacao);
      setTimeout(() => {
        state.notificacoes = state.notificacoes.filter(
          (notificacao) => notificacao.id != novaNotificacao.id,
        );
      }, 1500);
    },
  },
  actions: {
    [OBTER_TAREFAS]({ commit }, filtro: string) {
        let url = 'tarefas'

        if(filtro){
            url += '?descricao=' + filtro
        }

      http
        .get(url)
        .then((resposta) => commit(DEFINIR_TAREFAS, resposta.data));
    },
    async [CADASTRAR_TAREFAS]({ commit }, tarefa: ITarefa) {
      const resposta = await http.post("/tarefas", tarefa);
      return commit(ADICIONAR_TAREFAS, resposta.data);
    },
    async [ALTERAR_TAREFA]({ commit }, tarefa: ITarefa): Promise<void> {
      await http.put(`/tarefas/${tarefa.id}`, tarefa);
      return commit(ALTERA_TAREFA, tarefa);
    },
  },
  modules: {
    projeto,
  },
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key);
}

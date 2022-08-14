import IProjeto from "@/interfaces/IProjeto";
import { Estado } from "@/store";
import { ALTERAR_PROJETOS, CADASTRAR_PROJETOS, DELETAR_PROJETO, OBTER_PROJETOS } from "@/store/Actions";
import {
  ADICIONA_PROJETO,
  ALTERA_PROJETO,
  DEFINIR_PROJETOS,
  EXCLUIR_PROJETO,
} from "@/store/tipo-mutacoes";
import { Module } from "vuex";
import http from '@/Cli/Http';

export interface StateProjeto {
  projetos: IProjeto[];
}

export const projeto: Module<StateProjeto, Estado> = {
  mutations: {
    [ADICIONA_PROJETO](state, nomeDoProjeto: string) {
      const projeto = {
        id: new Date().toISOString(),
        nome: nomeDoProjeto,
      } as IProjeto;
      state.projetos.push(projeto);
    },
    [ALTERA_PROJETO](state, projeto: IProjeto) {
      const index = state.projetos.findIndex((proj) => proj.id == projeto.id);
      state.projetos[index] = projeto;
    },
    [EXCLUIR_PROJETO](state, id: string) {
      state.projetos = state.projetos.filter((proj) => proj.id != id);
    },
    [DEFINIR_PROJETOS](state, projetos: IProjeto[]) {
      state.projetos = projetos;
    },
  },
  actions: {
    [OBTER_PROJETOS]({ commit }) {
      http
        .get("projetos")
        .then((resposta) => commit(DEFINIR_PROJETOS, resposta.data));
    },
    [CADASTRAR_PROJETOS](context, nomeDoProjeto: string) {
      return http.post("/projetos", {
        nome: nomeDoProjeto,
      });
    },
    [ALTERAR_PROJETOS](context, projeto: IProjeto) {
      return http.put(`/projetos/${projeto.id}`, projeto);
    },
    async [DELETAR_PROJETO]({ commit }, id: string): Promise<void> {
      await http.delete(`/projetos/${id}`);
      return commit(EXCLUIR_PROJETO, id);
    },
  },
};

<template>
  <Formulario @aoSalvarTarefa="salvarTarefa" />
  <div class="lista">
    <Box v-if="semTarefas">
      Você não está muito produtivo hoje
      <span class="has-text-weight-bold">:(</span>
    </Box>
    <div class="field">
      <p class="control has-icons-left has-icons-right">
        <input
          class="input"
          type="text"
          placeholder="Digite para filtrar"
          v-model="filtro"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-search"></i>
        </span>
        <span class="icon is-small is-right">
          <i class="fas fa-check"></i>
        </span>
      </p>
    </div>
    <Tarefa
      v-for="(tarefa, index) in tarefas"
      :tarefa="tarefa"
      :key="index"
      @aoTarefaSelecionada="selecionarTarefa"
    />
    <Modal :mostrar="taskSelect != null">
      <template v-slot:cabecalho>
        <p class="modal-card-title">Editar Tarefas</p>
        <button @click="fecharModal" class="delete" aria-label="close"></button>
      </template>
      <template v-slot:corpo>
        <div class="field">
          <label for="descricaoTarefa" class="label">
            Altere sua Tarefa!
          </label>
          <input
            type="text"
            class="input"
            v-model="taskSelect.descricao"
            id="descricaoTarefa"
          />
        </div>
        <div class="field"></div>
      </template>
      <template v-slot:rodape>
        <button @click="alterarTask" class="button is-success">
          Salvar Alterações
        </button>
        <button @click="fecharModal" class="button">Cancelar !</button>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import Formulario from "../components/Formulario.vue";
import Tarefa from "../components/Tarefa.vue";
import Box from "../components/Box.vue";
import ITarefa from "../interfaces/ITarefa";
import { useStore } from "@/store";
import {
  OBTER_TAREFAS,
  CADASTRAR_TAREFAS,
  OBTER_PROJETOS,
  ALTERAR_TAREFA,
} from "@/store/Actions";
import Modal from "@/Vue/Modal.vue";

export default defineComponent({
  name: "App",
  components: {
    Formulario,
    Tarefa,
    Box,
    Modal,
  },
  data() {
    return {
      taskSelect: null as ITarefa | null,
    };
  },
  methods: {
    salvarTarefa(tarefa: ITarefa): void {
      this.store.dispatch(CADASTRAR_TAREFAS, tarefa);
    },
    selecionarTarefa(tarefa: ITarefa) {
      this.taskSelect = tarefa;
    },
    fecharModal() {
      this.taskSelect = null;
    },
    alterarTask() {
      this.store
        .dispatch(ALTERAR_TAREFA, this.taskSelect)
        .then(() => this.fecharModal());
    },
  },
  computed: {
    semTarefas(): boolean {
      return this.tarefas.length == 0;
    },
  },
  setup() {
    const store = useStore();
    store.dispatch(OBTER_TAREFAS);
    store.dispatch(OBTER_PROJETOS);

    const filtro = ref("");

    watchEffect(() => {
      store.dispatch(OBTER_TAREFAS, filtro.value);
    });

    return {
      tarefas: computed(() => store.state.tarefas),
      store,
      filtro,
    };
  },
});
</script>

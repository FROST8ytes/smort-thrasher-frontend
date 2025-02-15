import { defineStore } from "pinia";

export const useLocationStore = defineStore("location", () => {
  const activeLocationId = ref<string | null>(null);

  function setActiveLocationId(id: string) {
    activeLocationId.value = id;
  }

  return { activeLocationId, setActiveLocationId };
});

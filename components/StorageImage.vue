<script setup lang="ts">
import { ref as storageRef } from "firebase/storage";

const storage = useFirebaseStorage();
const props = defineProps<{
  class?: HTMLAttributes["class"];
  src: string;
  alt: string;
}>();

const imageRef = storageRef(storage, props.src);

const { url } = useStorageFileUrl(imageRef);
</script>

<template>
  <img :class="class" :src="url" :alt="alt" v-bind="$attrs" />
</template>

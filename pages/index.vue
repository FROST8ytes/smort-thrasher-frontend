<script setup lang="ts">
import {useId} from "vue";

definePageMeta({
  middleware: ["auth"],
});

const id = useId();

const mapRef = useMapboxRef(id);
const colorMode = useColorMode();
const color = computed(() => colorMode.value);

const mapStyle = computed(() => {
  if (color.value === "light") {
    return "navigation-day-v1";
  } else {
    return "navigation-night-v1";
  }
});
const center: Ref<[number, number]> = ref([100.969551, 4.382069]);

const data = [
  {
    name: 'Jan',
    total: Math.floor(Math.random() * 2000) + 500,
    predicted: Math.floor(Math.random() * 2000) + 500
  },
  {
    name: 'Feb',
    total: Math.floor(Math.random() * 2000) + 500,
    predicted: Math.floor(Math.random() * 2000) + 500
  },
  {
    name: 'Mar',
    total: Math.floor(Math.random() * 2000) + 500,
    predicted: Math.floor(Math.random() * 2000) + 500
  },
  {
    name: 'Apr',
    total: Math.floor(Math.random() * 2000) + 500,
    predicted: Math.floor(Math.random() * 2000) + 500
  },
  {
    name: 'May',
    total: Math.floor(Math.random() * 2000) + 500,
    predicted: Math.floor(Math.random() * 2000) + 500
  },
  {
    name: 'Jun',
    total: Math.floor(Math.random() * 2000) + 500,
    predicted: Math.floor(Math.random() * 2000) + 500
  },
];

watch(color, () => {
  const currCenter = mapRef.value?.getCenter();
  if (currCenter) {
    center.value[0] = currCenter.lng;
    center.value[1] = currCenter.lat;
  }
});
</script>

<template>
  <div class="grid auto-rows-min gap-4 md:grid-cols-3">
    <Card class="aspect-video rounded-xl bg-muted/50">
      <CardHeader>
        <CardTitle>Deez Nuts</CardTitle>
      </CardHeader>
      <CardContent>
        <DonutChart
          index="name"
          :category="'total'"
          :data="data"
        />
      </CardContent>
    </Card>
    <Card class="aspect-video rounded-xl bg-muted/50 col-span-2">
      <CardHeader>
        <CardTitle>Deez Nuts</CardTitle>
      </CardHeader>
      <CardContent>
        <AreaChart
          index="name"
          :data="data"
          :categories="['total', 'predicted']"
        />
      </CardContent>
    </Card>
  </div>
  <!--  <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>-->
  <MapboxMap
    :map-id="id"
    class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"
    :options="{
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: center,
      zoom: 16,
    }"
  >
    <MapboxGeolocateControl position="top-left"/>
    <MapboxFullscreenControl/>
  </MapboxMap>
</template>

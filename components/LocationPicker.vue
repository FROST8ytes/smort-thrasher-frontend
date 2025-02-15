<script setup lang="ts">
import { useCollection, useFirestore } from "vuefire";
import { collection } from "firebase/firestore";
import { ChevronsUpDown, Plus } from "lucide-vue-next";
import { useLocationStore } from "@/stores/location";

const activeLocationIndex = ref<number | null>(null);
const db = useFirestore();
const locations = useCollection(collection(db, "trash_bins"));

const locationStore = useLocationStore();

watch(locations, (newLocations) => {
  if (newLocations.length > 0 && activeLocationIndex.value === null) {
    activeLocationIndex.value = 0;
  }
});

watch(activeLocationIndex, (index) => {
  if (index !== null) {
    locationStore.setActiveLocationId(locations.value[activeLocationIndex.value].id);
  }
});

// function setActiveLocation(location: (typeof locations.value)[number]) {
//   activeLocation.value = location;
// }
function setActiveLocation(index: number) {
  activeLocationIndex.value = index;
}
</script>

<template>
  <Skeleton v-if="activeLocationIndex === null" class="rounded-lg w-full h-[3rem]" />
  <SidebarMenu v-else>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <StorageImage
                :src="locations[activeLocationIndex].emblem"
                class="size-6"
                alt="district-emblem"
                :key="activeLocation"
              />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ locations[activeLocationIndex].area }}</span>
              <span class="truncate text-xs">{{ locations[activeLocationIndex].district }}</span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          side="bottom"
          :side-offset="4"
        >
          <DropdownMenuLabel class="text-xs text-muted-foreground">Location</DropdownMenuLabel>
          <DropdownMenuItem
            v-for="(location, index) in locations"
            :key="location.id"
            class="gap-2 p-2"
            @click="setActiveLocation(index)"
          >
            <div class="flex size-6 items-center justify-center rounded-sm border">
              <StorageImage
                :src="location.emblem"
                alt="district emblem"
                class="size-4 shrink-0"
                :key="location.id"
              />
            </div>
            {{ location.area }}
            <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2 p-2" disabled>
            <div class="flex size-6 items-center justify-center rounded-md border bg-background">
              <Plus class="size-4" />
            </div>
            <div class="font-medium text-muted-foreground">Add location</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

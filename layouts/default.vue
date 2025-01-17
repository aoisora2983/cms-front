<template>
  <div class="flex flex-col h-screen bg-white">
    <OrganismNavigationHeader />
    <div class="flex-grow">
      <div class="page max-w-5xl mx-auto p-4">
        <slot />
      </div>
    </div>
    <OrganismNavigationFooter />
  </div>
</template>
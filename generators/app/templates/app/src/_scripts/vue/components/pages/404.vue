<template lang="pug">
  .wrapper: div
    h1 404 You appear to be lost.
    router-link(:to="{ name: 'home' }"): Btn(text="Help Me Get Back", color="black", size="slim", type="div")
</template>

<script>
  import Button from '../Button'

  export default {
    components: {
      Btn: Button
    }
  }
</script>

<style lang="stylus" scoped>
  // Go ahead and update the above lang and the below code with your CSS
  // preprocessor of choice

  .wrapper
    min-height: 100vh
    display: flex
    justify-content: center
    align-items: center
    flex-wrap: wrap
    text-align: center
</style>

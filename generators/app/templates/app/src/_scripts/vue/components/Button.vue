<template lang="pug">
  button.button(v-if="type !== 'div'", :type="type"): .text {{ text }}
  .button(v-else): .text {{ text }}
</template>

<script>
  export default {
    props: {
      text: {
        required: true,
        type: String
      },
      type: {
        required: false,
        type: String,
        // Use 'div' type if you're wrapping it in an anchor
        validator: type => type === 'button' || type === 'submit' || type === 'div',
        default: 'button'
      }
    }
  }
</script>

<style lang="stylus" scoped>
  // Go ahead and update the above lang and the below code with your CSS
  // preprocessor of choice

  @require '../global-styles/base/vars'

  .button
    display: inline-block
    position: relative
    padding: 8px 16px
    border: none
    border-radius: 4px
    outline: none
    text-transform: uppercase
    overflow: hidden
    background: #282828
    color: white
    user-select: none
    cursor: pointer
    transition: transform .3s

    &::after
      content: ''
      width: 100%
      height: 100%
      position: absolute
      top: 0
      left: -100%
      background: black
      transition: left .3s

    &:hover::after
      left: 0

  .text
    position: relative
    z-index: 1
</style>

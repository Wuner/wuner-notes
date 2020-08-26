<template>
  <div>
    <div v-html="htmlStr" />&#10;&#10;<p>Copyright © Wuner</p>&#10;<a :href="location">{{ decodeURIComponent(location) }}</a>
  </div>
</template>

<script>
export default {
  props: {
    html: String,
  },
  data() {
    return {
      htmlStr: '',
      location: '',
    };
  },

  created() {
    this.htmlStr = this.html.replace(/> </g, '>&#10;<');
    console.log(this.htmlStr);
    this.location = String(location).replace(/#.+$/, '');
  },
};
</script>

<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import listPage from './listPage/index'
export default {
  name: 'Dashboard',
  components: { listPage },
  data() {
    return {
      currentRole: 'listPage'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
  },
  methods: {
  }
}
</script>

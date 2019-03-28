<template>
  <div>
    <font-awesome-icon icon="exclamation-triangle" />
    Ooops something seems to be broken. Please refresh later or contact the administrator.
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
library.add(faExclamationTriangle);

export default {
  name: 'aap-broken',
  props: [],
  serverCacheKey: props => props.show
}
</script>

<style>
</style>

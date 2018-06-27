<template>
  <section id="dashboard" class="section">
    <h1 class="title">Dashboard</h1>
    <br />

    <div class="tile is-ancestor">
      <div class="tile is-parent ">
        <article class="tile is-child notification is-light">
          <lastCustomers></lastCustomers>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child notification is-light">
          <lastOrders></lastOrders>
        </article>
      </div>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-parent ">
        <article class="tile is-child notification is-light">
          <lastQuotes></lastQuotes>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child notification is-light">

        </article>
      </div>
    </div>
  </section>
</template>

<script>
import lastCustomers from '~/components/widgets/lastCustomers'
import lastOrders from '~/components/widgets/lastOrders'
import lastQuotes from '~/components/widgets/lastQuotes'

export default {
  layout: 'admin',
  components: { lastCustomers, lastOrders, lastQuotes }
}
</script>

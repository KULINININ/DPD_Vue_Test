<template>
  <div>
    <input type="text" v-model="searchTerm" placeholder="Search" />
    <table>
      <thead>
        <tr>
          <th :class="{ active: sortColumn === 'avatar' }" @click="sortByColumn('avatar')">
            Avatar
          </th>
          <th :class="{ active: sortColumn === 'full_name' }" @click="sortByColumn('full_name')">
            Full Name
          </th>
          <th :class="{ active: sortColumn === 'gender' }" @click="sortByColumn('gender')">
            Gender
          </th>
          <th :class="{ active: sortColumn === 'country' }" @click="sortByColumn('country')">
            Country
          </th>
          <th :class="{ active: sortColumn === 'birthdate' }" @click="sortByColumn('birthdate')">
            Birthdate
          </th>
          <th :class="{ active: sortColumn === 'email' }" @click="sortByColumn('email')">Email</th>
          <th :class="{ active: sortColumn === 'phone' }" @click="sortByColumn('phone')">Phone</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in displayedItems" :key="item.id">
          <td><img :src="item.avatar" alt="Avatar" /></td>
          <td>{{ item.full_name }}</td>
          <td>{{ item.gender }}</td>
          <td>{{ item.country }}</td>
          <td>{{ item.birthdate }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.phone }}</td>
        </tr>
      </tbody>
    </table>
    <div>
      <button :disabled="currentPage === 1" @click="prevPage">Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <input type="number" v-model.number="inputPage" @input="goToSpecificPage" />
      <button :disabled="currentPage === totalPages" @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script>
import { api_data } from '../api/api'

export default {
  name: 'Table',
  data() {
    return {
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 20,
      api_data,
      inputPage: 1,
      sortColumn: '',
      sortDirection: 'asc'
    }
  },
  watch: {
    searchTerm(newTerm) {
      if (newTerm) {
        this.currentPage = this.inputPage = 1
        this.$router.push({ query: { search: newTerm, page: this.currentPage } })
      } else {
        this.$router.push({ query: { page: this.currentPage } })
      }
    },
    currentPage(newPage) {
      this.inputPage = newPage
      this.$router.push({ query: { search: this.searchTerm, page: newPage } })
    },
    sortColumn(newColumn) {
      if (newColumn) {
        this.$router.push({
          query: { search: this.searchTerm, page: this.currentPage, sort: newColumn }
        })
      }
    },
    sortDirection(newDirection) {
      if (newDirection) {
        this.$router.push({
          query: {
            search: this.searchTerm,
            page: this.currentPage,
            sort: this.sortColumn,
            direction: newDirection
          }
        })
      }
    }
  },
  mounted() {
    if (this.$route.query.search) {
      this.searchTerm = this.$route.query.search
    }
    if (this.$route.query.page) {
      this.currentPage = parseInt(this.$route.query.page)
    }
    if (this.$route.query.sort) {
      this.sortColumn = this.$route.query.sort
    }
    if (this.$route.query.direction) {
      this.sortDirection = this.$route.query.direction
    }
  },
  computed: {
    APIData() {
      return this.api_data.results.map((obj) => {
        return {
          avatar: obj.picture.medium,
          full_name: obj.name.title + ' ' + obj.name.first + ' ' + obj.name.last,
          gender: obj.gender,
          country: obj.location.country,
          birthdate: obj.dob.date.split('T')[0],
          email: obj.email,
          phone: obj.phone
        }
      })
    },
    filteredItems() {
      return this.APIData.filter((item) => {
        return Object.values(item).some((value) => {
          return String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        })
      })
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage)
    },
    displayedItems() {
      let displayedItems = this.filteredItems

      if (this.sortColumn) {
        displayedItems = displayedItems.slice().sort((a, b) => {
          const multiplier = this.sortDirection === 'asc' ? 1 : -1
          return multiplier * (a[this.sortColumn] < b[this.sortColumn] ? -1 : 1)
        })
      }

      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return displayedItems.slice(startIndex, endIndex)
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    goToSpecificPage() {
      const totalPages = Math.ceil(api_data.length / this.itemsPerPage)
      if (this.inputPage < 1) {
        this.inputPage = 1
      } else if (this.inputPage > totalPages) {
        this.inputPage = totalPages
      }
      this.currentPage = this.inputPage
      this.$router.push({ query: { search: this.searchTerm, page: this.currentPage } })
    },
    sortByColumn(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortColumn = column
        this.sortDirection = 'asc'
      }
    }
  }
}
</script>

<style scoped>
th {
  cursor: pointer;
}
.active {
  background-color: yellow;
  font-weight: bold;
}
</style>

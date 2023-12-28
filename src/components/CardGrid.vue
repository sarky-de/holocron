<template>
    <v-container>
      <v-select
        :items="categories"
        label="Select Category"
        v-model="selectedCategory"
      ></v-select>

      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="entry in filteredEntries" :key="entry.cardId">
          <v-card>
            <v-img :src="entry.image" height="60%"></v-img>
            <v-card-title>{{ entry.name }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>  
  import axios from 'axios';

  export default {
    data() {
      return {
        entries: [],
        selectedCategory: 'ships',
      }
    },
    computed: {
      filteredEntries() {
        if (!this.selectedCategory) {
          return this.entries;
        }
        return this.entries.filter(entry => entry.category == this.selectedCategory);
      },
      categories() {
        return [...new Set(this.entries.map(entry => entry.category))];
      },
    },
    mounted() {
      this.loadJsonData();
    },
    methods: {
      async loadJsonData() {
        try {
          const response = await axios.get('http://localhost:3000/data/all');
          this.entries = response.data;
        } catch (error) {
          console.error('Error fetching data:', error);
        }        
      }
    }
  }
  </script>
  
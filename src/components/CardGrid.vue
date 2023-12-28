<template>
    <v-container>
        <v-select :items="categories" label="Select Category" v-model="selectedCategory"></v-select>

        <v-autocomplete
            v-model="searchTerm"
            :items="cardNames"
            label="Search"
            clearable
        ></v-autocomplete>

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
            searchTerm: '',
        };
    },
    watch: {
        searchTerm(newVal) {
            if (!newVal) {
                this.searchTerm = '';
            }
        },
    },
    computed: {
        filteredEntries() {
            if (!this.selectedCategory) {
                return this.entries;
            }
            return this.entries.filter((entry) => {
                return (
                    (!this.selectedCategory || entry.category === this.selectedCategory) &&
                    entry.name.toLowerCase().includes(this.searchTerm.toLowerCase())
                );
            });
        },
        cardNames() {
            return this.entries.map((entry) => {
                if (entry.category === this.selectedCategory) {
                    return entry.name;
                }
            });
        },
        categories() {
            return [...new Set(this.entries.map((entry) => entry.category))];
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
        },
    },
};
</script>

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
                    <v-card-actions>
                        <v-btn color="green" @click="add(entry.cardId)">Add</v-btn>
                        <v-btn color="red" @click="remove(entry.cardId)" v-if="has(entry.cardId)"
                            >Remove</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import { useInventoryStore } from '@/stores/inventory';

export default {
    setup() {
        const inventory = useInventoryStore();
        const add = (cardId) => inventory.add(cardId);
        const remove = (cardId) => inventory.remove(cardId);
        const has = (cardId) => inventory.has(cardId);

        return { add, remove, has };
    },
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

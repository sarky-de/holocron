<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="6" md="4" v-for="entry in entries" :key="entry.name">
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
        };
    },
    mounted() {
        this.loadJsonData();
    },
    methods: {
        async loadJsonData() {
            try {
                const response = await axios.get('http://localhost:3000/data/pilots');
                this.entries = response.data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    },
};
</script>

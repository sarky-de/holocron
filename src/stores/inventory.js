import axios from 'axios';
import { defineStore } from 'pinia';

export const useInventoryStore = defineStore('inventory', {
    state: () => ({
        items: [],
    }),
    actions: {
        async add(cardId) {
            this.items.push(cardId);
            try {
                await axios.put(`http://localhost:3000/inventory/${cardId}`);
            } catch (error) {
                console.error('Error adding to inventory:', error);
            }
        },
        async remove(cardId) {
            const index = this.items.indexOf(cardId);
            if (index > -1) {
                this.items.splice(index, 1);
                try {
                    await axios.delete(`http://localhost:3000/inventory/${cardId}`);
                } catch (error) {
                    console.error('Error adding to inventory:', error);
                }
            }
        },
        has: (state) => {
            return (cardId) => false;
        },
    },
});

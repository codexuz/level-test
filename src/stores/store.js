import { defineStore } from 'pinia';
import { Preferences } from '@capacitor/preferences';


export const useStore = defineStore('main', {
    state: () => ({
        result: {
          score: 0,
          level: ''

        }
    }),
    actions: {
        async loadResult() {
            const { value } = await Preferences.get({ key: 'result' });
            if (value) {
              this.result = JSON.parse(value);
            }
          },
          async saveResult() {
            await Preferences.set({ key: 'result', value: JSON.stringify(this.result) });
          },
          async updateResult(score, level) {
            this.result.score = score;
            this.result.level = level;
            await this.saveResult();
          }
    }
})
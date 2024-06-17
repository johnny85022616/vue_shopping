import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type {siteData } from '@/types/apiWeb';
import api from "../apis/api";

export const useBsiteStore = defineStore('siteData', () => {
  const siteData= ref<siteData|null>(null)
  
  async function getSiteData(){
    const res = await api.web.processSupplier()
    if(res && res){
      siteData.value = res
      console.log(siteData.value.urlSuffix);
    }
  }

  return { siteData ,getSiteData}
})

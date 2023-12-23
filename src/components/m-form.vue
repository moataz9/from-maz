<script lang="ts" setup>
import { ref, inject, onMounted, watch } from 'vue'
import type { category, categories_data, categoryChildProperty } from '@/ts_utils'

import type { AxiosStatic, AxiosResponse } from 'axios'

const axios = inject<AxiosStatic>('axios')!

const categories = ref<category[]>([])
const selectedCategory = ref<category>()

const categoryChildren = ref<category[] | null>([])
const selectedCategoryChild = ref<category>()

const categoryChildProperties = ref<categoryChildProperty[]>([])

const selectedValues = ref<{ key: string; value: string }[]>([])
const showValues = ref(false)

const setupCategories = async () => {
  try {
    const response: AxiosResponse = await axios.get('/get_all_cats')
    categories.value = (response.data.data as categories_data).categories
    selectedCategory.value = categories.value[0]
    categoryChildren.value = categories.value[0].children
    // selectedCategoryChild.value = categories.value[0].children?.[0]
  } catch (error) {
    console.error('Error fetching main categories:', error)
  }
}

const updateCategoryChildren = (categoryId: number) => {
  categoryChildren.value = categories.value.find(item => item.id === categoryId)
    ?.children as unknown as category[]
  // selectedCategoryChild.value = categoryChildren.value[0]
}

const fetchCategoryChildProperties = async (propertyId: number) => {
  try {
    const response: AxiosResponse = await axios.get(`/properties?cat=${propertyId}`)
    categoryChildProperties.value = (response.data.data as categoryChildProperty[]).map(property => ({
      ...property,
      options: [
        ...property.options,
        {
          id: Math.floor(Math.random() * 10000),
          name: 'Other',
          slug: 'other',
          parent: property.id,
          child: property.options[0]?.child || false,
        },
      ],
      choosedPropertyOption: null,
    }))
  } catch (error) {
    console.error('Error fetching properties:', error)
  }
}

const handleSubmit = () => {
  // Implement logic to handle form submission and display selected values
  selectedValues.value.push(
    { key: 'Main Catgory', value: selectedCategory.value?.name || '' },
    { key: 'Sub Category', value: selectedCategoryChild.value?.name || '' },
    ...categoryChildProperties.value.map(property => ({
      key: property.name,
      value:
        property.choosedPropertyOption?.slug === 'other'
          ? property.other_value
          : property.choosedPropertyOption?.name || '-',
    }))
  )
  showValues.value = true
}

watch(selectedCategory, val => val && updateCategoryChildren(val.id))
watch(selectedCategoryChild, async val => val && (await fetchCategoryChildProperties(val.id)))

onMounted(async () => {
  await setupCategories()
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="mx-auto container">
    <!-- Main Category Dropdown -->
    <label for="categories">Main Category <sup class="text-red">*</sup></label>
    <br />
    <select id="categories" class="w-100 my-1" v-model="selectedCategory">
      <option v-for="category in categories" :key="category.id" :value="category">
        {{ category.name }}
      </option>
    </select>

    <br />

    <!-- Subcategory Dropdown -->
    <!-- fetchProperties -->
    <label for="sub-categories">Sub Category <sup class="text-red">*</sup></label> <br />
    <select id="sub-categories" class="w-100 my-1" v-model="selectedCategoryChild">
      <option v-for="subcategory in categoryChildren" :key="subcategory?.id" :value="subcategory">
        {{ subcategory?.name }}
      </option>
    </select>

    <!-- Property Dropdowns -->
    <div v-for="(property, index) in categoryChildProperties" :key="index">
      <label :for="property.slug">{{ property.name }} <sup class="text-red">*</sup></label> <br />
      <select v-model="property.choosedPropertyOption" :id="property.slug" class="w-100 my-1">
        <option v-for="option in property.options" :key="option.id" :value="option">
          {{ option.name }}
        </option>
      </select>

      <!-- Display input for "Other" option -->
      <input
        v-if="property.choosedPropertyOption?.slug === 'other'"
        v-model="property.other_value"
        placeholder="Enter other value"
      />
    </div>

    <br />

    <!-- Submit Button -->
    <div class="text-center my-1">
      <button type="submit">Submit</button>
    </div>

    <!-- Display Selected Values in Table -->
    <table v-if="showValues" class="w-100">
      <thead>
        <tr>
          <th class="px-1">Key</th>
          <th class="px-1">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="selectedVal in selectedValues" :key="selectedVal.key">
          <td class="px-1">{{ selectedVal.key }}</td>
          <td class="px-1">{{ selectedVal.value }}</td>
        </tr>
      </tbody>
      <div v-if="selectedValues.length === 0" class="text-center">no data</div>
    </table>
  </form>
</template>

<style scoped>
.container {
  max-width: 600px;
  padding-inline: 2rem;
}
.text-center {
  text-align: center;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.my-1 {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.px-1 {
  padding-inline: 0.5rem;
}
.w-100 {
  width: 100%;
}
.text-red {
  color: red;
}
table,
td,
th {
  border: 1px solid #333;
}
</style>

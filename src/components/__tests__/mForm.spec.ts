import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import mFormVue from '../m-form.vue'
import axios from 'axios'

import mainCategoriesData from './testData/mainCategories.json'

vi.spyOn(axios, 'get').mockResolvedValue(mainCategoriesData)

const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
}

const mForm = mount(mFormVue, {
  global: {
    provide: {
      axios: mockAxios,
    },
  },
})

describe('maz Form', () => {
  it('renders the component with form elements', () => {
    // Assert that the component is rendered
    expect(mForm).toBeTruthy()

    // Assert that form elements are present
    expect(mForm.html()).toContain('Main Category')
    expect(mForm.html()).toContain('Sub Category')
    expect(mForm.html()).toContain('Submit')
  })

  it('document has #categoies and #sub-categories selectors', () => {
    const selectCategoriesEl = 'select#categories'
    const selectSubCategoriesEl = 'select#sub-categories'
    expect(mForm.find(selectCategoriesEl).find('option')).toBeDefined()
    expect(mForm.find(selectSubCategoriesEl).find('option')).toBeDefined()
  })

  it('should call setupCategories after mounted', async () => {
    // Simulate component behavior that triggers a GET request
    await (mForm.vm as any).setupCategories()

    // Assert that 'axios.get' was called
    expect(mockAxios.get).toHaveBeenCalled()
  })
})

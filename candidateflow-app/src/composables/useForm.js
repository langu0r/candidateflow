// composables/useForm.js
import { ref, reactive } from 'vue'
import { useToast } from './useToast'

export function useForm(initialData = {}, validationRules = {}) {
  const formData = reactive({ ...initialData })
  const errors = ref({})
  const touched = ref({})
  const isSubmitting = ref(false)
  const toast = useToast()

  // Валидация поля
  const validateField = (field) => {
    const rules = validationRules[field]
    if (!rules) return true

    const value = formData[field]
    let fieldErrors = []

    if (rules.required && !value?.toString().trim()) {
      fieldErrors.push(rules.requiredMessage || `${field} is required`)
    }

    if (rules.minLength && value?.length < rules.minLength) {
      fieldErrors.push(rules.minLengthMessage || `Minimum ${rules.minLength} characters`)
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      fieldErrors.push(rules.patternMessage || `Invalid ${field} format`)
    }

    if (rules.custom) {
      const customError = rules.custom(value, formData)
      if (customError) fieldErrors.push(customError)
    }

    errors.value = {
      ...errors.value,
      [field]: fieldErrors
    }

    return fieldErrors.length === 0
  }

  // Валидация всей формы
  const validateForm = () => {
    const fields = Object.keys(validationRules)
    let isValid = true

    fields.forEach(field => {
      touched.value[field] = true
      if (!validateField(field)) {
        isValid = false
      }
    })

    return isValid
  }

  // Обновление поля
  const updateField = (field, value) => {
    formData[field] = value
    touched.value[field] = true
    validateField(field)
  }

  // Сброс формы
  const resetForm = () => {
    Object.keys(initialData).forEach(key => {
      formData[key] = initialData[key]
    })
    errors.value = {}
    touched.value = {}
  }

  // Отправка формы
  const submit = async (submitFn, options = {}) => {
    if (!validateForm()) {
      toast.error(options.validationMessage || 'Please fix form errors')
      return false
    }

    isSubmitting.value = true

    try {
      await submitFn(formData)
      
      if (options.resetOnSuccess) {
        resetForm()
      }

      if (options.successMessage) {
        toast.success(options.successMessage)
      }

      return true
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(error.message || options.errorMessage || 'Submission failed')
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    updateField,
    validateField,
    validateForm,
    resetForm,
    submit
  }
}
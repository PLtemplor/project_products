<template>
    <div class="container" style="max-width: 720px; margin: 24px auto;">
      <h1 style="font-size:22px;font-weight:700;margin-bottom:16px;">Productos</h1>
  
      <form @submit.prevent="createProducto" style="display:flex;gap:8px;margin-bottom:16px;">
        <input v-model="form.nombre" placeholder="Nombre" required style="flex:1;padding:8px;" />
        <input v-model="form.precio" placeholder="Precio" style="flex:2;padding:8px;" />
        <button type="submit" style="padding:8px 12px;">Agregar</button>
      </form>
  
      <div v-if="loading">Cargando...</div>
      <div v-else>
        <div v-if="productos.length===0">Sin productos</div>
        <ul style="list-style:none;padding:0;display:grid;gap:8px;">
        <li v-for="producto in productos" :key="producto.id" style="border:1px solid #ddd;padding:8px;border-radius:8px;display:flex;align-items:center;gap:8px;">
            <input type="checkbox" v-model="producto.completed" @change="toggleCompleted(producto)" />
            <div style="flex:1;">
              <div style="font-weight:600;">{{ producto.nombre }}</div>
              <div style="color:#555;font-size:14px;">{{ producto.precio }}</div>
            </div>
            <button @click="editProducto(producto)" style="padding:4px 8px;">Editar</button>
            <button @click="removeProducto(producto)" style="padding:4px 8px;color:white;background:#e53935;border:none;">Eliminar</button>
          </li>
        </ul>
      </div>
  
      <div v-if="editing" style="margin-top:16px;border-top:1px solid #eee;padding-top:16px;">
        <h2 style="font-size:18px;font-weight:700;margin-bottom:8px;">Editar</h2>
        <form @submit.prevent="updateProducto" style="display:flex;gap:8px;">
          <input v-model="form.nombre" placeholder="Nombre" required style="flex:1;padding:8px;" />
          <input v-model="form.precio" placeholder="Precio" style="flex:2;padding:8px;" />
          <label style="display:flex;align-items:center;gap:6px;">
            <input type="checkbox" v-model="form.precio" /> Completada
          </label>
          <button type="submit" style="padding:8px 12px;">Guardar</button>
          <button type="button" @click="cancelEdit" style="padding:8px 12px;">Cancelar</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios'
  import { reactive, ref, onMounted } from 'vue'
  
  const productos = ref([])
  const loading = ref(false)
  const editing = ref(false)
  const editingId = ref(null)
  
  const form = reactive({ nombre: '', precio: '', completed: false })
  
  const fetchProductos = async () => {
    loading.value = true
    try {
      const { data } = await axios.get('/productos')
      productos.value = data
    } finally {
      loading.value = false
    }
  }
  
  const resetForm = () => {
    form.nombre = ''
    form.precio = ''
    form.completed = false
    editing.value = false
    editingId.value = null
  }
  
  const createProducto = async () => {
    const { data } = await axios.post('/productos', form)
    productos.value.unshift(data)
    resetForm()
  }
  
  const editProducto = (producto) => {
    editing.value = true
    editingId.value = producto.id
    form.nombre = producto.nombre
    form.precio = producto.precio ?? ''
  }
  
  const updateProducto = async () => {
    const { data } = await axios.put(`/productos/${editingId.value}`, form)
    const idx = productos.value.findIndex(t => t.id === editingId.value)
    if (idx !== -1) productos.value[idx] = data
    resetForm()
  }
  
  const removeProducto = async (producto) => {
    await axios.delete(`/productos/${producto.id}`)
    productos.value = productos.value.filter(t => t.id !== producto.id)
  } 
  
  const toggleCompleted = async (producto) => {
    const { data } = await axios.put(`/productos/${producto.id}`, { completed: producto.completed })
    const idx = productos.value.findIndex(t => t.id === producto.id)
    if (idx !== -1) productos.value[idx] = data
  }
  
onMounted(fetchProductos)
  </script>
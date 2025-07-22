// Глобальное состояние мотоклуба с Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppData, AppActions } from './types';
import { initialData } from './data';

type AppStore = AppData & AppActions;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Данные
      ...initialData,

      // Events Actions
      updateEvent: (id, eventUpdate) =>
        set(state => ({
          events: state.events.map(event => 
            event.id === id ? { ...event, ...eventUpdate } : event
          )
        })),

      addEvent: (newEvent) =>
        set(state => ({
          events: [...state.events, { ...newEvent, id: Date.now().toString() }]
        })),

      deleteEvent: (id) =>
        set(state => ({
          events: state.events.filter(event => event.id !== id)
        })),

      // Emergency Contacts Actions
      updateContact: (id, contactUpdate) =>
        set(state => ({
          emergencyContacts: state.emergencyContacts.map(contact => 
            contact.id === id ? { ...contact, ...contactUpdate } : contact
          )
        })),

      addContact: (newContact) =>
        set(state => ({
          emergencyContacts: [...state.emergencyContacts, { ...newContact, id: Date.now().toString() }]
        })),

      deleteContact: (id) =>
        set(state => ({
          emergencyContacts: state.emergencyContacts.filter(contact => contact.id !== id)
        })),

      // Board Posts Actions
      updateBoardPost: (id, postUpdate) =>
        set(state => ({
          boardPosts: state.boardPosts.map(post => 
            post.id === id ? { ...post, ...postUpdate } : post
          )
        })),

      addBoardPost: (newPost) =>
        set(state => ({
          boardPosts: [{ ...newPost, id: Date.now().toString() }, ...state.boardPosts]
        })),

      deleteBoardPost: (id) =>
        set(state => ({
          boardPosts: state.boardPosts.filter(post => post.id !== id)
        })),

      // Stores Actions
      updateStore: (id, storeUpdate) =>
        set(state => ({
          stores: state.stores.map(store => 
            store.id === id ? { ...store, ...storeUpdate } : store
          )
        })),

      addStore: (newStore) =>
        set(state => ({
          stores: [...state.stores, { ...newStore, id: Date.now().toString() }]
        })),

      deleteStore: (id) =>
        set(state => ({
          stores: state.stores.filter(store => store.id !== id)
        })),

      // Products Actions
      updateProduct: (id, productUpdate) =>
        set(state => ({
          products: state.products.map(product => 
            product.id === id ? { ...product, ...productUpdate } : product
          )
        })),

      addProduct: (newProduct) =>
        set(state => ({
          products: [...state.products, { ...newProduct, id: Date.now().toString() }]
        })),

      deleteProduct: (id) =>
        set(state => ({
          products: state.products.filter(product => product.id !== id)
        })),

      // Stats Actions
      updateStats: (statsUpdate) =>
        set(state => ({
          stats: { ...state.stats, ...statsUpdate }
        })),

      // General Actions
      resetData: () => set(initialData),

      loadData: (data) =>
        set(state => ({
          ...state,
          ...data
        }))
    }),
    {
      name: 'moto-club-storage',
      storage: createJSONStorage(() => localStorage),
      // Не сохраняем статистику участников, она загружается из API
      partialize: (state) => ({
        events: state.events,
        emergencyContacts: state.emergencyContacts,
        boardPosts: state.boardPosts,
        stores: state.stores,
        products: state.products,
        // stats не сохраняем - обновляется динамически
      })
    }
  )
);
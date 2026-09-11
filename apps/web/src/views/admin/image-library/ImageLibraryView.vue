<template><ImageLibraryManager v-if="auth.user" :client="supabase" :user-id="auth.user.id" /></template>
<script setup lang="ts">
import { ImageLibraryManager } from '@visual/image-library'
import { supabase } from '../../../lib/supabase'
import { useAuthStore } from '../../../stores/auth'
const auth = useAuthStore()
</script>

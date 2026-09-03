<script setup lang="ts">
const route = useRoute()
const { data } = await useFetch('/api/runtime/route', { query: { app: route.params.appSlug } })
if (!data.value) throw createError({ statusCode: 404, statusMessage: '应用不存在或尚未发布' })
await navigateTo(`/apps/${route.params.appSlug}/${data.value.app.homeRouteKey}`, { replace: true })
</script>

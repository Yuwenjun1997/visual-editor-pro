<template>
  <div class="admin-page">
    <div class="wa-flex wa-items-center wa-justify-between wa-mb-4">
      <div>
        <div class="wa-text-base wa-font-medium">数据源管理</div>
        <div class="wa-mt-1 wa-text-xs wa-text-gray-500">商品、文章只维护一次，页面按数据契约复用最新内容</div>
      </div>
      <el-button type="primary" @click="openCreate">新增数据源</el-button>
    </div>

    <el-table v-loading="loading" :data="sources">
      <el-table-column label="名称" prop="name" min-width="160" />
      <el-table-column label="类型" width="120">
        <template #default="{ row }">
          <el-tag>{{ kindLabel(row as VisualDataSource) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="数据契约" min-width="150" prop="dataContract" />
      <el-table-column width="90" label="引用次数">
        <template #default="{ row }">{{ referenceCounts[(row as VisualDataSource).id] || 0 }}</template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="(row as VisualDataSource).status === 'disabled' ? 'info' : 'success'">
            {{ (row as VisualDataSource).status === 'disabled' ? '已停用' : '启用中' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="190">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row as VisualDataSource)">编辑</el-button>
          <el-button plain size="small" type="danger" @click="remove(row as VisualDataSource)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" width="760px" destroy-on-close :title="editing ? '编辑数据源' : '新增数据源'">
      <el-form label-width="100px">
        <el-form-item label="数据源类型">
          <el-radio-group v-model="form.sourceKind" :disabled="!!editing">
            <el-radio-button value="entity_collection">业务集合</el-radio-button>
            <el-radio-button value="manual">静态数据</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称"><el-input v-model="form.name" placeholder="如：首页推荐商品" /></el-form-item>
        <template v-if="form.sourceKind === 'entity_collection'">
          <el-form-item label="业务类型">
            <el-radio-group v-model="form.entityType" :disabled="!!editing" @change="loadEntities">
              <el-radio-button value="product">商品</el-radio-button>
              <el-radio-button value="article">文章</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="筛选分类">
            <el-select v-model="form.categoryId" clearable placeholder="全部分类" style="width: 100%">
              <el-option v-for="item in categories" :key="item.id" :value="item.id" :label="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="指定内容">
            <el-select
              v-model="form.entityIds"
              multiple
              clearable
              filterable
              style="width: 100%"
              placeholder="不指定则按规则取数"
            >
              <el-option v-for="item in entities" :key="item.id" :value="item.id" :label="item.title" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序">
            <el-select v-model="form.sort" style="width: 100%">
              <el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="数量上限"><el-input-number v-model="form.limit" :min="1" :max="100" /></el-form-item>
        </template>
        <template v-else>
          <el-form-item label="组件 schema">
            <el-select
              v-model="form.schemaKey"
              filterable
              style="width: 100%"
              placeholder="请选择组件 schema"
              @change="selectSchema"
            >
              <el-option
                v-for="schema in schemas"
                :key="schema.visualKey"
                :label="schema.name"
                :value="schema.visualKey"
              />
            </el-select>
          </el-form-item>
          <template v-if="selectedSchema">
            <el-form-item label="数据形态">
              <el-tag>{{ selectedSchema.dataType === 'list' ? '对象数组' : '单对象' }}</el-tag>
            </el-form-item>
            <el-table v-if="selectedSchema.dataType === 'list'" border size="small" max-height="320" :data="manualRows">
              <el-table-column
                v-for="field in selectedSchema.schemas"
                :key="field.propName"
                :label="field.label"
                :prop="field.propName"
              >
                <template #default="{ row }"><el-input v-model="row[field.propName]" size="small" /></template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="{ $index }">
                  <el-button link type="danger" @click="manualRows.splice($index, 1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button
              v-if="selectedSchema.dataType === 'list'"
              size="small"
              class="wa-w-full wa-mt-2"
              @click="addManualRow"
            >
              + 添加一项
            </el-button>
            <el-table v-else border size="small" :data="manualObjectRows">
              <el-table-column label="属性名" width="140" prop="label" />
              <!-- <el-table-column label="Key" width="160" prop="propName" /> -->
              <el-table-column label="值">
                <template #default="{ row }"><el-input v-model="row.value" size="small" /></template>
              </el-table-column>
            </el-table>
          </template>
          <template v-else-if="legacyManual">
            <el-alert
              type="warning"
              class="wa-mb-3"
              :closable="false"
              title="旧数据契约未匹配到组件 schema，将保留原 JSON。请选择 schema 后再保存为新契约。"
            />
            <el-form-item label="旧数据契约"><el-input v-model="form.dataContract" disabled /></el-form-item>
            <el-form-item label="静态 JSON">
              <el-input v-model="form.manualJson" :rows="10" type="textarea" placeholder="对象或对象数组" />
            </el-form-item>
          </template>
          <el-empty v-else description="请选择组件 schema" />
          <div class="wa-ml-25 wa-mb-3 wa-text-xs wa-text-gray-500">
            仅当前数据源保存静态配置，不会随商品或文章后台自动同步。
          </div>
        </template>
      </el-form>
      <el-alert v-if="preview.length" title="当前命中预览" type="success" class="wa-mb-3" :closable="false">
        <template #default>
          共 {{ preview.length }} 条：{{ preview.map((item) => item.title || item.text || item.id).join('、') }}
        </template>
      </el-alert>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button v-if="form.sourceKind === 'entity_collection'" :loading="previewing" @click="previewSource">
          预览
        </el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  type VisualDataSource,
} from '@visual/editor'
import { useDataSourcesPage } from './composables/useDataSourcesPage'
const {
  sources,
  referenceCounts,
  categories,
  entities,
  preview,
  visible,
  loading,
  saving,
  previewing,
  editing,
  schemas,
  manualRows,
  manualObjectRows,
  form,
  selectedSchema,
  legacyManual,
  sortOptions,
  kindLabel,
  loadEntities,
  selectSchema,
  addManualRow,
  openCreate,
  openEdit,
  previewSource,
  save,
  remove,
} = useDataSourcesPage()
</script>

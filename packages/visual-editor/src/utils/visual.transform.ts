import type { VisualSchemaItem } from '../types/visual-editor'

export interface CustomTableData extends VisualSchemaItem {
  value: any
}

export const transformCustomJsonDataToTalbeData = (
  schemaList: VisualSchemaItem[],
  jsonData: Record<string, any>,
): CustomTableData[] => {
  return schemaList.map((schema) => ({
    ...schema,
    value: jsonData[schema.propName],
  }))
}

export const transformTableDataToCustomJsonData = (
  tableData: CustomTableData[],
): Record<string, any> => {
  return tableData.reduce(
    (prev, item) => ({ ...prev, [item.propName]: item.value }),
    {} as Record<string, any>,
  )
}

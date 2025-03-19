export interface IGetListParams {
  search: string
  page: number
  sort: 'desc' | 'asc'
  size: number | undefined
  sortBy?: string
}

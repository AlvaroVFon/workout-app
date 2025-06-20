import { paginateResponse } from '../../../src/utils/pagination.utils'

describe('paginateResponse', () => {
  it('should return paginated response when paginate is true', () => {
    const documents = [{ id: 1 }, { id: 2 }]
    const page = 1
    const limit = 2
    const total = 5
    const paginate = true

    const result = paginateResponse(documents, page, limit, total, paginate)

    expect(result).toEqual({
      documents,
      page,
      limit,
      total,
      totalPages: 3,
    })
  })

  it('should return documents array when paginate is false', () => {
    const documents = [{ id: 1 }, { id: 2 }]
    const page = 1
    const limit = 2
    const total = 5
    const paginate = false

    const result = paginateResponse(documents, page, limit, total, paginate)

    expect(result).toEqual(documents)
  })
})

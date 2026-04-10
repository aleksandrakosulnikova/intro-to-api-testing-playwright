import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

test.describe('Тестирование GET запроса', () => {
  test('Код ответа 200 OK. Успешное получение информации о заказе при корректном orderId', async ({
    request,
  }) => {
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1')
    const statusCode = response.status()
    expect(statusCode).toBe(200)
  })

  test('Код ответа 400 Bad Request. Неуспешное получение информации о несуществующем заказе', async ({
    request,
  }) => {
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders/11')
    const statusCode = response.status()
    expect(statusCode).toBe(400)
  })

  test('Код ответа 404 Order not found. Неуспешное получение информации с пустым номером заказа', async ({
    request,
  }) => {
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders/ававава')
    const statusCode = response.status()
    expect(statusCode).toBe(400)
  })
})

test.describe('Тестирование PUT запроса', () => {
  test('Код ответа 200 OK. Успешное обновление информации о заказе', async ({ request }) => {
    const requestBody = {
      status: 'OPEN',
      courierId: 1,
      customerName: 'Sasha',
      customerPhone: '123456789',
      comment: 'test',
      id: 1,
    }
    const requestHeaders = {
      api_key: '1234567890123456',
    }
    const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
      data: requestBody,
      headers: requestHeaders,
    })
    const statusCode = response.status()
    expect(statusCode).toBe(200)
  })

  test('Код ответа 401 Unauthorized. Неуспешное изменение заказа с некорректным API-key', async ({
    request,
  }) => {
    const requestBody = {
      status: 'OPEN',
      courierId: 1,
      customerName: 'Sasha',
      customerPhone: '123456789',
      comment: 'test',
      id: 1,
    }
    const requestHeaders = {
      api_key: '123',
    }
    const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
      data: requestBody,
      headers: requestHeaders,
    })
    const statusCode = response.status()
    expect(statusCode).toBe(401)
  })

  test('Код ответа 400 Bad Request. Пустое тело заказа', async ({ request }) => {
    //я смогла сделать ошибку 400, только когда удалила data: requestBody из const response, хотя думала хватит просто не передавать никакое тело в const requestBody
    const requestHeaders = {
      api_key: '1234567890123456',
    }
    const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
      headers: requestHeaders,
    })
    const statusCode = response.status()
    expect(statusCode).toBe(400)
  })
})

test.describe('Тестирование DELETE запроса', (): void => {
  test('Код ответа 204 Order deleted successfully. Успешное удаление заказа', async ({
    request,
  }) => {
    const requestHeaders = {
      api_key: '1234567890123456',
    }
    const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/1', {
      headers: requestHeaders,
    })
    const statusCode = response.status()
    expect(statusCode).toBe(204)
  })

  test('Код ответа 401 Unauthorized. Неуспешное удаление заказа с некорректным API-ключом', async ({
    request,
  }) => {
    const requestHeaders = {
      api_key: '123',
    }
    const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/1', {
      headers: requestHeaders,
    })
    const statusCode = response.status()
    expect(statusCode).toBe(401)
  })

  test('Код ответа 400 Bad Request. Удаление несуществующего заказа', async ({ request }) => {
    const requestHeaders = {
      api_key: '1234567890123456',
    }
    const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/11', {
      headers: requestHeaders,
    })
    const statusCode = response.status()
    expect(statusCode).toBe(400)
  })
})

//Примеры с урока
test('get order with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1')

  // parse raw response body to json
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status, body and headers
  console.log('response body:', responseBody)
  // Check if the response status is 200
  expect(statusCode).toBe(200)
})

test('post order with correct data should receive code 201', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 0,
  }
  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })
  // parse raw response body to json
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status and body
  console.log('response status:', statusCode)
  console.log('response body:', responseBody)
  expect(statusCode).toBe(StatusCodes.OK)
  // check that body.comment is string type
  expect(typeof responseBody.comment).toBe('string')
  // check that body.courierId is number type
  expect(typeof responseBody.courierId).toBe('number')
})

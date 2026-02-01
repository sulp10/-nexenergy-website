> ## Documentation Index
> Fetch the complete documentation index at: https://docs.kie.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Getting Started with KIE API (Important)

> Welcome to **KIE**. This guide walks you through the essential information you need to start integrating KIE APIs into your product, including models, pricing, authentication, request flow, limits, and support.

We aim to be transparent, practical, and developer-friendly. Please read this carefully before going to production.

## 1. Available Models & Playground

You can find the **latest supported models** on our Market page:

👉 [https://kie.ai/market](https://kie.ai/market)

* We continuously update and onboard new models as soon as they are stable.
* Each model page links to its **Playground**, where you can test and experiment directly in our UI before calling the API.
* The Playground is the best place to understand model behavior, parameters, and output formats.

***

## 2. Pricing

The complete and up-to-date pricing list is available here:

👉 [https://kie.ai/pricing](https://kie.ai/pricing)

* Our prices are typically **30%–50% lower than official APIs**.
* For some models, discounts can reach **up to 80%**.
* Pricing may change as upstream providers adjust their costs, so always refer to the pricing page for the latest numbers.

***

## 3. Creating and Securing Your API Key

Create and manage your API keys here:

👉 [https://kie.ai/api-key](https://kie.ai/api-key)

**Important security notes:**

* **Never expose your API key in frontend code** (browser, mobile apps, public repositories).
* Treat your API key as a secret.

To help protect your usage, we provide:

* **Rate limits per key** (hourly, daily, and total usage caps)
* **IP whitelist** support, allowing only approved server IPs to access the API

These features help prevent accidental overuse and unauthorized requests.

***

## 4. Required Request Headers

Every API request **must** include the correct headers:

```http  theme={null}
Authorization: Bearer <YOUR_API_KEY>
Content-Type: application/json
```

If these headers are missing or incorrect, you may receive:

```json  theme={null}
{"code":401,"msg":"You do not have access permissions"}
```

Always double-check your headers when debugging authentication issues.

***

## 5. Logs & Task Details

You can inspect all your historical tasks here:

👉 [https://kie.ai/logs](https://kie.ai/logs)

For each task, you can view:

* Creation time
* Model used
* Input parameters
* Task status
* Credit consumption
* Final results or error details

If you ever suspect incorrect credit usage, this page is the source of truth for verification.

***

## 6. Data Retention Policy

Please note our retention rules:

* **Generated media files**: stored for 14 days, then automatically deleted
* **Log records** (text / metadata): stored for 2 months, then automatically deleted

If you need long-term access, make sure to download and store results on your side in time.

***

## 7. Asynchronous Task Model

All generation tasks on KIE are asynchronous.

A successful request returns:

* **HTTP 200**
* A `task_id`

<Warning>
  A 200 response only means the task was created, not completed.
</Warning>

To get the final result, you must either:

* Provide a callback (webhook) URL in the request, or
* Actively poll the "query record info" API using the `task_id`

***

## 8. Rate Limits & Concurrency

By default, we apply the following limits:

* Up to 20 new generation requests per 10 seconds
* This typically allows 100+ concurrent running tasks
* Limits are applied per account

If you exceed the limit:

* Requests will be rejected with HTTP 429
* Rejected requests will not enter the queue

For most users, this is more than sufficient.
If you consistently hit 429 errors, you may contact support to request a higher limit — approvals are handled cautiously.

***

## 9. Developer Support

The recommended support channels are available directly from the dashboard (bottom-left menu):

* Get help on Discord
* Get help on Telegram

What you get:

* Private, 1-on-1 channels
* Your data and conversations remain confidential
* Faster and more technical responses

**Support hours:**
UTC 21:00 – UTC 17:00 (next day)

You may also email us at [support@kie.ai](mailto:support@kie.ai), but this is not the preferred or fastest option.

***

## 10. Stability Expectations

We provide access to top-tier, highly competitive APIs at very aggressive pricing.

That said:

* We are not perfect
* Our overall stability may be slightly lower than official providers
* This is a conscious trade-off

In practice, KIE is stable enough to support production workloads and long-term business growth, but we believe in setting realistic expectations upfront.

***

## 11. About the Team

KIE is built by a small startup team.

* We move fast
* We care deeply about developer experience
* We are constantly improving

At the same time, we acknowledge that:

* Not everything is perfect
* We can't satisfy every use case immediately

Your feedback helps us improve — and we genuinely appreciate it.

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.kie.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Flux-2 - Pro Text to Image

> High-quality photorealistic image generation powered by Flux-2's advanced AI model

## Query Task Status

After submitting a task, use the unified query endpoint to check progress and retrieve results:

<Card title="Get Task Details" icon="magnifying-glass" href="/market/common/get-task-detail">
  Learn how to query task status and retrieve generation results
</Card>

<Tip>
  For production use, we recommend using the `callBackUrl` parameter to receive automatic notifications when generation completes, rather than polling the status endpoint.
</Tip>

## Related Resources

<CardGroup cols={2}>
  <Card title="Market Overview" icon="store" href="/market/quickstart">
    Explore all available models
  </Card>

  <Card title="Common API" icon="gear" href="/common-api/get-account-credits">
    Check credits and account usage
  </Card>
</CardGroup>


## OpenAPI

````yaml market/flux2/pro-text-to-image.json post /api/v1/jobs/createTask
openapi: 3.0.0
info:
  title: Flux-2 API
  description: kie.ai Flux-2 API Documentation - Text to Image
  version: 1.0.0
  contact:
    name: Technical Support
    email: support@kie.ai
servers:
  - url: https://api.kie.ai
    description: API Server
security:
  - BearerAuth: []
paths:
  /api/v1/jobs/createTask:
    post:
      summary: Generate images using flux-2/pro-text-to-image
      operationId: flux-2-pro-text-to-image
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - model
              properties:
                model:
                  type: string
                  enum:
                    - flux-2/pro-text-to-image
                  default: flux-2/pro-text-to-image
                  description: |-
                    The model name to use for generation. Required field.

                    - Must be `flux-2/pro-text-to-image` for this endpoint
                  example: flux-2/pro-text-to-image
                callBackUrl:
                  type: string
                  format: uri
                  description: >-
                    The URL to receive generation task completion updates.
                    Optional but recommended for production use.


                    - System will POST task status and results to this URL when
                    generation completes

                    - Callback includes generated content URLs and task
                    information

                    - Your callback endpoint should accept POST requests with
                    JSON payload containing results

                    - Alternatively, use the Get Task Details endpoint to poll
                    task status

                    - To ensure callback security, see [Webhook Verification
                    Guide](/common-api/webhook-verification) for signature
                    verification implementation
                  example: https://your-domain.com/api/callback
                input:
                  type: object
                  description: Input parameters for the generation task
                  properties:
                    prompt:
                      description: ' Must be between 3 and 5000 characters. (Max length: 5000 characters)'
                      type: string
                      maxLength: 5000
                      example: >-
                        Hyperrealistic supermarket blister pack on clean olive
                        green surface. No shadows. Inside: bright pink 3D
                        letters spelling "FLUX.2" pressing against stretched
                        plastic film, creating realistic deformation and
                        reflective highlights. Bottom left corner: barcode
                        sticker with text "GENERATE NOW" and "PLAYGROUND".
                        Plastic shows tension wrinkles and realistic shine where
                        stretched by the volumetric letters.
                    aspect_ratio:
                      description: >-
                        Aspect ratio for the generated image. Select 'auto' to
                        match the first input image ratio (requires input
                        image).
                      type: string
                      enum:
                        - '1:1'
                        - '4:3'
                        - '3:4'
                        - '16:9'
                        - '9:16'
                        - '3:2'
                        - '2:3'
                        - auto
                      default: '1:1'
                      example: '1:1'
                    resolution:
                      description: Output image resolution.
                      type: string
                      enum:
                        - 1K
                        - 2K
                      default: 1K
                      example: 1K
                  required:
                    - prompt
                    - aspect_ratio
                    - resolution
            example:
              model: flux-2/pro-text-to-image
              callBackUrl: https://your-domain.com/api/callback
              input:
                prompt: >-
                  Hyperrealistic supermarket blister pack on clean olive green
                  surface. No shadows. Inside: bright pink 3D letters spelling
                  "FLUX.2" pressing against stretched plastic film, creating
                  realistic deformation and reflective highlights. Bottom left
                  corner: barcode sticker with text "GENERATE NOW" and
                  "PLAYGROUND". Plastic shows tension wrinkles and realistic
                  shine where stretched by the volumetric letters.
                aspect_ratio: '1:1'
                resolution: 1K
      responses:
        '200':
          description: Request successful
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ApiResponse'
                  - type: object
                    properties:
                      data:
                        type: object
                        properties:
                          taskId:
                            type: string
                            description: >-
                              Task ID, can be used with Get Task Details
                              endpoint to query task status
                            example: task_flux-2_1765175072483
              example:
                code: 200
                msg: success
                data:
                  taskId: task_flux-2_1765175072483
        '500':
          $ref: '#/components/responses/Error'
components:
  schemas:
    ApiResponse:
      type: object
      properties:
        code:
          type: integer
          enum:
            - 200
            - 401
            - 402
            - 404
            - 422
            - 429
            - 455
            - 500
            - 501
            - 505
          description: >-
            Response status code


            - **200**: Success - Request has been processed successfully

            - **401**: Unauthorized - Authentication credentials are missing or
            invalid

            - **402**: Insufficient Credits - Account does not have enough
            credits to perform the operation

            - **404**: Not Found - The requested resource or endpoint does not
            exist

            - **422**: Validation Error - The request parameters failed
            validation checks

            - **429**: Rate Limited - Request limit has been exceeded for this
            resource

            - **455**: Service Unavailable - System is currently undergoing
            maintenance

            - **500**: Server Error - An unexpected error occurred while
            processing the request

            - **501**: Generation Failed - Content generation task failed

            - **505**: Feature Disabled - The requested feature is currently
            disabled
        msg:
          type: string
          description: Response message, error description when failed
          example: success
  responses:
    Error:
      description: Server Error
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: API Key
      description: >-
        All APIs require authentication via Bearer Token.


        Get API Key:

        1. Visit [API Key Management Page](https://kie.ai/api-key) to get your
        API Key


        Usage:

        Add to request header:

        Authorization: Bearer YOUR_API_KEY


        Note:

        - Keep your API Key secure and do not share it with others

        - If you suspect your API Key has been compromised, reset it immediately
        in the management page

````
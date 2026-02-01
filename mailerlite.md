Getting started
#MailerLite API
MailerLite API is RESTful, fully-featured, and easy to integrate with.

You can use your favorite HTTP/REST library that is available for your programming language to make HTTP calls.

You must send JSON payloads in your requests and expect to get JSON responses. Don't forget to add these headers to each and every request.

Content-Type: application/json
Accept: application/json
Use the following base URL for all API endpoints:

https://connect.mailerlite.com/api
#SDK
MailerLite supports this list of official libraries for your favorite programming languages. This is the easiest way to integrate MailerLite with your application.

MailerLite PHP
MailerLite Go
MailerLite Node.js
MailerLite Python
MailerLite Ruby
#Authentication
#API keys
API keys are a quick way to implement machine-to-machine authentication without any direct inputs from a human beyond initial setup.

For example, you might want to run a scheduled job to sync your CRM data to your MailerLite account.

You can generate an API key by opening MailerLite, navigating to Integrations and choosing MailerLite API. Then click "Generate new token". Give it a name to help you identify where it's used in the future, e.g. "CRM sync job - production".

Once the key is generated, please copy and store it immediately. We will not be able to show this API key again in the future, as we don't store API keys in plain text for security reasons. If you lose it, you will have to replace it with a new API key.

Once you have your API key, provide it in an Authorization header together with your request payload, where XXX is your token:

Authorization: Bearer XXX
If you fail to provide a valid token, you'll get this response on all requests.

Response Code: 401 Unauthorized
{
  "message": "Unauthenticated."
}
#Versioning
All requests use the latest version, unless you override the API version. To lock down the API version, provide the current date at the time of implementation through X-Version header.

X-Version: 2038-01-19
#Validation errors
You might encounter validation errors when sending requests to API endpoints. They will come in the following format

Response Code: 422 Unprocessable Entity
Content-Type: application/json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email must be a valid email address."]
  }
}
#Rate limits
MailerLite API has a global rate limit of 120 requests per minute. If you exceed that rate limit you will receive a 429 error response with a “Too Many Attempts” message. If you think you will be hitting these limits, please use batch endpoint and/or implement backoff strategy that would even out the requests over time.

Response Code: 429 Too Many Attempts
Content-Type: application/json
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 0
Retry-After: 119
{
  "message": "Too Many Attempts."
}
#HTTP status codes
MailerLite returns standard HTTP response codes.

Code	Name	Explanation
200	OK	The request was accepted.
201	Created	Resource was created.
202	Accepted	The request was accepted and further actions are taken in the background.
204	No Content	The request was accepted and there is nothing to return.
400	Bad Request	There was an error when processing your request. Please adjust your request based on the endpoint requirements and try again.
401	Unauthorized	The provided API token is invalid.
403	Forbidden	The action is denied for that account or a particular API token.
404	Not Found	The requested resource does not exist on the system.
405	Method Not Allowed	HTTP method is not supported by the requested endpoint.
408	Request Timeout	There is an error on our system. Please contact support
422	Unprocessable Entity	There was a validation error found when processing the request. Please adjust it based on the endpoint requirements and try again.
429	Too Many Requests	There were too many requests made to the API.
500	Internal Server Error	There was an error on our system. Please contact support
502	Bad Gateway	There was an error on our system. Please contact support
503	Service Unavailable	There was an error on our system. Please contact support
504	Gateway Timeout	There was an error on our system. Please contact support
More info on HTTP response codes can be found on Mozilla Developer Network.

#Terms of service
Before implementing any integration, please make sure you're familiar with MailerLite's terms of service.

As stated in the ToC, if you collect subscribers on your own (as opposed to using MailerLite forms), you must accept responsibility for abuse prevention:

<..>you must ensure that the subscribers are collected in accordance with the industry best practice and requirements set out in these Terms and Anti-Spam Policy. You are responsible for preventing any type of abuse when collecting new subscribers through your own generated API key.


Subscribers
You can add or update subscribers in your mailing list.

#List all subscribers
If you want to list all of your subscribers, send this GET request

GET https://connect.mailerlite.com/api/subscribers
#Request parameters
Parameter	Type	Required	Limitations
filter[status]	string	no	Must be one of the possible statuses: active, unsubscribed, unconfirmed, bounced or junk.
limit	integer	no	Defaults to 25
cursor	string	no	Defaults to first page. Cursor value available in response body
include	string	no	Additional resources to include in the response. Currently, only groups is supported.
#Response
{
  "data": [
    {
      "id": "31986843064993537",
      "email": "dummy@example.com",
      "status": "active",
      "source": "api",
      "sent": 0,
      "opens_count": 0,
      "clicks_count": 0,
      "open_rate": 0,
      "click_rate": 0,
      "ip_address": null,
      "subscribed_at": "2021-09-01 14:03:50",
      "unsubscribed_at": null,
      "created_at": "2021-09-01 14:03:50",
      "updated_at": "2021-09-01 14:03:50",
      "fields": {
        "city": null,
        "company": null,
        "country": null,
        "last_name": "Testerson",
        "name": "Dummy",
        "phone": null,
        "state": null,
        "z_i_p": null
      },
      "opted_in_at": null,
      "optin_ip": null
    }
  ],
  "links": {
     "first": null,
     "last": null,
     "prev": "https://connect.mailerlite.com/api/subscribers?cursor=eyJpZCI6NzI1ODIxNjQ2NDU5Mzg1NTksIl9wb2ludHNUb05leHRJdGVtcyI6ZmFsc2V9",
     "next": "https://connect.mailerlite.com/api/subscribers?cursor=eyJpZCI6NzI1ODIxNjQ2NDY5ODcxMzYsIl9wb2ludHNUb05leHRJdGVtcyI6dHJ1ZX0"
  },
  "meta": {
      "path": "https://connect.mailerlite.com/api/subscribers",
      "per_page": 25,
      "next_cursor": "eyJpZCI6NzI1ODIxNjQ2NDY5ODcxMzYsIl9wb2ludHNUb05leHRJdGVtcyI6dHJ1ZX0",
      "prev_cursor": "eyJpZCI6NzI1ODIxNjQ2NDU5Mzg1NTksIl9wb2ludHNUb05leHRJdGVtcyI6ZmFsc2V9"
  }
}
#Create/upsert subscriber
If you want to create or update a subscriber, send this POST request

POST https://connect.mailerlite.com/api/subscribers
If a subscriber already exists, it will be updated with new values. This is non-destructive operation, so omitting fields or groups will not remove them from subscriber.

#Request
Parameter	Type	Required	Limitations
email	string	yes	Valid email address as per RFC 2821
fields	object	no	Object keys must correspond to default or custom field name. Values can only be added this way and will not be removed by omission.
groups	array	no	array must contain existing group ids. Subscriber can only be added to groups this way and will not be removed by omission
status	string	no	Can be one of the following: active, unsubscribed, unconfirmed, bounced, junk
subscribed_at	string	no	Must be a valid date in the format yyyy-MM-dd HH:mm:ss
ip_address	string	no	Must be a valid ip address
opted_in_at	string	no	Must be a valid date in the format yyyy-MM-dd HH:mm:ss
optin_ip	string	no	Must be a valid ip address
unsubscribed_at	string	no	Must be a valid date in the format yyyy-MM-dd HH:mm:ss
resubscribe	bool	no	Set to true to resubscribe previously unsubscribed subscribers
{
    "email": "dummy@example.com",
    "fields": {
      "name": "Dummy",
      "last_name": "Testerson"
    },
    "groups": [
        "4243829086487936",
        "14133878422767533",
        "31985378335392975"
    ]
}
#Response
If the subscriber was created:

Response Code: 201 Created
If the subscriber with specified email was already in the mailing list:

Response Code: 200 OK
{
  "data": {
    "id": "31897397363737859",
    "email": "dummy@example.com",
    "status": "active",
    "source": "api",
    "sent": 0,
    "opens_count": 0,
    "clicks_count": 0,
    "open_rate": 0,
    "click_rate": 0,
    "ip_address": null,
    "subscribed_at": "2021-08-31 14:22:08",
    "unsubscribed_at": null,
    "created_at": "2021-08-31 14:22:08",
    "updated_at": "2021-08-31 14:22:08",
    "fields": {
      "city": null,
      "company": null,
      "country": null,
      "last_name": "Testerson",
      "name": "Dummy",
      "phone": null,
      "state": null,
      "z_i_p": null
    },
    "groups": [],
    "opted_in_at": null,
    "optin_ip": null
  }
}
#Error
Response Code: 422 Unprocessable Entity
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email must be a valid email address."]
  }
}
#Update a subscriber
If you want to update a single subscriber, send this PUT request:

PUT https://connect.mailerlite.com/api/subscribers/(:id)
If a subscriber already exists, their information will be updated. However, please note that if the subscriber’s status is unsubscribed, bounced, or marked as junk, you will not be able to reactivate them due to abuse prevention measures. In such cases, the subscriber can only be reactivated through the app, a form, or a landing page.

#Request
Parameter	Type	Required	Limitations
fields	object	no	Object keys must correspond to default or custom field name. Values can only be added this way and will not be removed by omission.
groups	array	no	array containing existing group ids. Subscriber will be removed from unlisted groups
status	string	no	Can be one of the following: active, unsubscribed, unconfirmed, bounced, junk
subscribed_at	string	no	Must be a valid date in the format yyyy-MM-dd HH:mm:ss
ip_address	string	no	Must be a valid ip address
opted_in_at	string	no	Must be a valid date in the format yyyy-MM-dd HH:mm:ss
optin_ip	string	no	Must be a valid ip address
unsubscribed_at	string	no	Must be a valid date in the format yyyy-MM-dd HH:mm:ss
{
    "fields": {
      "name": "Dummy",
      "last_name": null
    },
    "groups": [
        "4243829086487936",
        "14133878422767533",
        "31985378335392975"
    ]
}
#Response
Response Code: 200 OK
{
  "data": {
    "id": "31897397363737859",
    "email": "dummy@example.com",
    "status": "active",
    "source": "api",
    "sent": 0,
    "opens_count": 0,
    "clicks_count": 0,
    "open_rate": 0,
    "click_rate": 0,
    "ip_address": null,
    "subscribed_at": "2021-08-31 14:22:08",
    "unsubscribed_at": null,
    "created_at": "2021-08-31 14:22:08",
    "updated_at": "2021-08-31 14:22:08",
    "fields": {
      "city": null,
      "company": null,
      "country": null,
      "last_name": null,
      "name": "Dummy",
      "phone": null,
      "state": null,
      "z_i_p": null
    },
    "groups": [],
    "opted_in_at": null,
    "optin_ip": null
  }
}
#Error
Response Code: 422 Unprocessable Entity
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email must be a valid email address."]
  }
}
#Fetch a subscriber
If you want to fetch a subscriber, send this GET request

GET https://connect.mailerlite.com/api/subscribers/(:id or :email)
#Request
Parameter	Type	Required	Limitations
email	string	no	Must provide either valid subscriber id or email
id	string	no	Must provide either valid subscriber id or email
GET https://connect.mailerlite.com/api/subscribers/31986843064993537
GET https://connect.mailerlite.com/api/subscribers/dummy@example.com
#Response
If subscriber exists:

Response Code: 200 OK
{
  "data": {
    "id": "31986843064993537",
    "email": "dummy@example.com",
    "status": "active",
    "source": "api",
    "sent": 0,
    "opens_count": 0,
    "clicks_count": 0,
    "open_rate": 0,
    "click_rate": 0,
    "ip_address": null,
    "subscribed_at": "2021-09-01 14:03:50",
    "unsubscribed_at": null,
    "created_at": "2021-09-01 14:03:50",
    "updated_at": "2021-09-01 14:03:50",
    "fields": {
      "city": null,
      "company": null,
      "country": null,
      "last_name": "Testerson",
      "name": "Dummy",
      "phone": null,
      "state": null,
      "z_i_p": null
    },
    "groups": [],
    "opted_in_at": null,
    "optin_ip": null
  }
}
#Error
If the subscriber cannot be found:

Response Code: 404 Not Found
#Fetch total subscribers count
GET https://connect.mailerlite.com/api/subscribers?limit=0
#Request
Parameter	Type	Required	Limitations
limit	integer	yes	Value must be 0
#Response
Response Code: 200 OK
{
  "total": 100
}
#Fetch subscriber activity
GET https://connect.mailerlite.com/api/subscribers/:id/activity-log
#Request
Parameter	Type	Required	Limitations
id	string	yes	Must provide either valid subscriber id
filter[log_name]	string	no	Must be one of the possible log_name: campaign_send, automation_email_sent, email_open, link_click, email_bounce, spam_complaint, unsubscribed, email_forward, marketing_preferences_change or preference_center.
limit	integer	no	Defaults to 100
page	integer	no	Count starts from 1
#Response
Response Code: 200 OK
{
  "data": [
    {
      "id": "1235",
      "log_name": "added_to_group",
      "subject_id": "1000000000000000",
      "subject_type": "subscribers",
      "properties": {
        "group_name": "test group",
        "group_id": "1"
      },
      "created_at": "2024-05-01 12:43:29",
      "updated_at": "2024-05-01 12:43:29"
    },
    {
      "id": "1234",
      "log_name": "activated",
      "subject_id": "1000000000000000",
      "subject_type": "subscribers",
      "properties": [],
      "created_at": "2024-05-01 12:43:29",
      "updated_at": "2024-05-01 12:43:29"
    },
    {
      "id": "123456",
      "log_name": "email_open",
      "subject_id": "123456",
      "subject_type": "opens",
      "properties": {
        "type": "campaigns",
        "campaign_id": "123456",
        "campaign_name": "Example name",
        "preview_url": "https://example_preview.url"
      },
      "created_at": "2024-09-01 00:00:00",
      "updated_at": "2024-09-01 00:00:00"
    }
  ]
}
#Delete a subscriber
It will removes the subscriber from your account, but all their information is still kept in case they re-subscribe to your list. If you want to delete a subscriber, send this DELETE request

DELETE https://connect.mailerlite.com/api/subscribers/:id
#Request
Parameter	Type	Required	Limitations
id	string	yes	Valid subscriber id for the account
#Response
Response Code: 204 No Content
#Error
Response Code: 404 Not Found
#Forget a subscriber
It will removes the subscriber from your account and all information will be completely deleted in 30 days. This feature is GDPR compliant.If you want to forget a subscriber, send this POST request

POST https://connect.mailerlite.com/api/subscribers/:id/forget
#Request
Parameter	Type	Required	Limitations
id	string	yes	Valid subscriber id for the account
#Response
Response Code: 200 OK
{
  "message": "Subscriber data will be completely deleted and forgotten within 30 days.",
  "data": {
    "id": "85348545455981948",
    "email": "bashirian.wilhelmine@yahoo.com",
    "status": "active",
    "source": "subscribe app",
    "sent": 89,
    "opens_count": 0,
    "clicks_count": 0,
    "open_rate": 0,
    "click_rate": 0,
    "ip_address": "140.229.243.225",
    "subscribed_at": "2023-04-13 14:05:15",
    "unsubscribed_at": null,
    "created_at": "2023-04-13 14:05:15",
    "updated_at": "2023-04-19 05:40:50",
    "deleted_at": "2023-04-19 05:40:50",
    "forget_at": "2023-05-19 05:40:50",
    "fields": {
      "name": "Carmella",
      "last_name": "Hegmann",
      "company": "DuBuque Inc",
      "country": "Puerto Rico",
      "city": "Moshemouth",
      "phone": "1-628-782-7066",
      "state": null,
      "zip": null
    },
    "groups": [
      {
        "id": "85348546500363273",
        "name": "sint incidunt",
        "active_count": 20,
        "sent_count": 1284,
        "opens_count": 0,
        "open_rate": {
          "float": 0,
          "string": "0%"
        },
        "clicks_count": 0,
        "click_rate": {
          "float": 0,
          "string": "0%"
        },
        "unsubscribed_count": 0,
        "unconfirmed_count": 0,
        "bounced_count": 0,
        "junk_count": 0,
        "created_at": "2023-04-13 14:05:16",
        "processing": true,
        "used_in_forms": false,
        "used_in_sites": false
      }
    ],
    "location": {
      "id": "1",
      "title": "New York City",
      "country_name": "United States of America",
      "continent_name": "North America",
      "state_name": "New York",
      "time_zone": "America/New_York"
    },
    "opted_in_at": null,
    "optin_ip": null,
    "email_changed_at": null
  }
}
#Error
Response code: 404 Not Found
#Get single import
If you want to get a single import report, send this GET request

GET https://connect.mailerlite.com/api/subscribers/import/{import_id}
#Response
Response Code: 200 OK
{
  "data": {
    "id": "47366063630845932",
    "total": 3,
    "processed": 3,
    "imported": 0,
    "updated": 0,
    "errored": 3,
    "percent": 100,
    "done": true,
    "file_path": "",
    "invalid": [],
    "invalid_count": 0,
    "mistyped": [],
    "mistyped_count": 0,
    "changed": [],
    "changed_count": 0,
    "unchanged": [
      {
        "id": "47366064023013357",
        "email": "dummy_one@import.com"
      },
      {
        "id": "47366064023013358",
        "email": "dummy_two+two@import.com"
      },
      {
        "id": "47366064023013359",
        "email": "dummy_three@new.com"
      }
    ],
    "unchanged_count": 3,
    "unsubscribed": [],
    "unsubscribed_count": 0,
    "role_based": [],
    "role_based_count": 0,
    "banned_import_emails_count": 0,
    "match_route": "",
    "source_label": "",
    "updated_at": "2022-02-18T08:09:58.000000Z",
    "undone_at": null,
    "stopped_at": null,
    "undo_started_at": null,
    "finished_at": "2022-02-18T08:09:58.000000Z"
  }
}

#Fields
Fields can be assigned to subscribers

#List all fields
If you want to list all of your fields, use this GET endpoint

GET https://connect.mailerlite.com/api/fields
#Request parameters
Parameter	Type	Required	Limitations
limit	integer	no	An account can have at most a 100 groups
page	integer	no	Count starts from 1
filter[keyword]	string	no	Returns partial matches
filter[type]	string	no	Can be one of the following: text, number or date
sort	string	no	Can be one of: name, type, Defaults to ascending order; prepend -, e.g. -name for descending order.
#Response
Response Code: 200 OK
{
  "data": [
    {
      "id": "1",
      "name": "new field",
      "key": "new_field",
      "type": "text"
    }
  ],
  "links": {
    "first": "https://connect.mailerlite.com/api/fields?page=1",
    "last": "https://connect.mailerlite.com/api/fields?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "https://connect.mailerlite.com/api/fields?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "path": "https://connect.mailerlite.com/api/fields",
    "per_page": 100,
    "to": 1,
    "total": 1
  }
}
#Create a field
If you want to create a field that can be assigned to subscribers, use this POST request

POST https://connect.mailerlite.com/api/fields
#Request body
Parameter	Type	Required	Limitations
name	string	yes	Maximum length of 255 characters
type	string	yes	Can be text, number or date
#Response
Response Code: 200 OK
{
  "data": {
    "id": "1",
    "name": "new field",
    "key": "new_field",
    "type": "text"
  }
}
#Error
If invalid data has been passed

Response Code: 422 Unprocessable Entity
{
  "message": "The given data was invalid.",
  "errors": {
    "type": ["The selected type is invalid."]
  }
}
#Update a field
If you want to update a field, use this PUT request

PUT https://connect.mailerlite.com/api/fields/{field_id}
#Request body
Parameter	Type	Required	Limitations
name	string	yes	Maximum length of 255 characters
#Response
Response Code: 200 OK
{
  "data": {
    "id": "1",
    "name": "new field",
    "key": "new_field",
    "type": "text"
  }
}
#Error
If invalid data has been passed

Response Code: 422 Unprocessable Entity
{
  "message": "The given data was invalid.",
  "errors": {
    "type": ["The name may not be greater than 255 characters."]
  }
}
#Delete a field
If you want to delete a field, use this DELETE request

DELETE https://connect.mailerlite.com/api/fields/{field_id}
#Response
Response code: 204 No Content
#Error
Response Code: 404 Not found

Automations
You can view your automations and their stats

#List all automations
If you want to get all of your automations use this GET request

GET https://connect.mailerlite.com/api/automations
#Request parameters
Parameter	Type	Required	Limitations
filter[enabled]	boolean	no	Must be one of the following: true (for active) and false (for inactive). Defaults to return all automations
filter[name]	string	no	Must be a string
filter[group]	string	no	Must be a valid group id. Returns all automations that use the group in their trigger configuration
page	integer	no	Defaults to 1
limit	integer	no	Defaults to 10
#Response
Response code: 200 OK
{
  "data": [
    {
      "id": "57444257882965766",
      "name": "Automation 1",
      "enabled": false,
      "trigger_data": {
        "track_ecommerce": false,
        "repeatable": false,
        "valid": true,
      },
      "steps": [
        {
          "id": "57444257892403137",
          "type": "delay",
          "parent_id": null,
          "unit": "minutes",
          "complete": true,
          "created_at": "2022-06-09 13:58:33",
          "updated_at": "2022-06-09 13:58:33",
          "value": "5",
          "description": "Wait for 5 minutes"
        },
        {
          "id": "57444261587584962",
          "type": "email",
          "parent_id": "57444257892403137",
          "name": "mail",
          "subject": "mail {$name}",
          "from": "dummy@mailerlite.io",
          "from_name": "Dummy Testerson",
          "email_id": "57444261557176071",
          "email": {
            "id": "57444261557176071",
            "account_id": "1",
            "emailable_id": "57444257882965766",
            "emailable_type": "automations",
            "type": "builder",
            "from": "dummy@mailerlite.io",
            "from_name": "Dummy Testerson",
            "name": "mail",
            "subject": "mail {$name}",
            "plain_text": null,
            "screenshot_url": null,
            "preview_url": null,
            "created_at": "2022-06-09 13:58:36",
            "updated_at": "2022-06-09 13:58:42",
            "is_designed": true,
            "language_id": 4,
            "is_winner": false,
            "stats": {
              "sent": 0,
              "opens_count": 0,
              "unique_opens_count": 0,
              "open_rate": {
                "float": 0,
                "string": "0%"
              },
              "clicks_count": 0,
              "unique_clicks_count": 0,
              "click_rate": {
                "float": 0,
                "string": "0%"
              },
              "unsubscribes_count": 0,
              "unsubscribe_rate": {
                "float": 0,
                "string": "0%"
              },
              "spam_count": 0,
              "spam_rate": {
                "float": 0,
                "string": "0%"
              },
              "hard_bounces_count": 0,
              "hard_bounce_rate": {
                "float": 0,
                "string": "0%"
              },
              "soft_bounces_count": 0,
              "soft_bounce_rate": {
                "float": 0,
                "string": "0%"
              },
              "forwards_count": 0
            },
            "send_after": null,
            "track_opens": true
          },
          "language_id": 4,
          "complete": true,
          "created_at": "2022-06-09 13:58:36",
          "updated_at": "2022-06-09 13:58:36",
          "track_opens": true,
          "google_analytics": null,
          "tracking_was_disabled": false,
          "description": "Send \"mail {$name}\" email"
        }
      ],
      "triggers": [
        {
          "id": "80916950725690939",
          "type": "subscriber_joins_group",
          "group_ids": [
            "80916981736277582"
          ],
          "groups": [
            {
              "id": "80916981736277582",
              "name": "My Group",
              "url": null
            }
          ],
          "exclude_group_ids": [],
          "excluded_groups": [],
          "broken": false
        }
      ],
      "complete": true,
      "broken": false,
      "warnings": [],
      "emails_count": 1,
      "first_email_screenshot_url": null,
      "stats": {
        "completed_subscribers_count": 0,
        "subscribers_in_queue_count": 0,
        "bounce_rate": {
          "float": 0,
          "string": "0%"
        },
        "click_to_open_rate": {
          "float": 0,
          "string": "0%"
        },
        "sent": 0,
        "opens_count": 0,
        "unique_opens_count": null,
        "open_rate": {
          "float": 0,
          "string": "0%"
        },
        "clicks_count": 0,
        "unique_clicks_count": null,
        "click_rate": {
          "float": 0,
          "string": "0%"
        },
        "unsubscribes_count": 0,
        "unsubscribe_rate": {
          "float": 0,
          "string": "0%"
        },
        "spam_count": 0,
        "spam_rate": {
          "float": 0,
          "string": "0%"
        },
        "hard_bounces_count": 0,
        "hard_bounce_rate": {
          "float": 0,
          "string": "0%"
        },
        "soft_bounces_count": 0,
        "soft_bounce_rate": {
          "float": 0,
          "string": "0%"
        }
      },
      "created_at": "2022-06-09 13:58:33",
      "has_banned_content": false,
      "qualified_subscribers_count": 63
    }
  ],
  "links": {
    "first": "https://connect.mailerlite.com/api/automations?page=1",
    "last": "https://connect.mailerlite.com/api/automations?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "https://connect.mailerlite.com/api/automations?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "path": "https://connect.mailerlite.com/api/automations",
    "per_page": 10,
    "to": 1,
    "total": 1
  },
  "aggregations": {
    "sum": 24
  }
}
#Get an automation
If you want to fetch a specific automation you can use this GET endpoint

GET https://connect.mailerlite.com/api/automations/{automation_id}
#Response
Response code: 200 OK
{
  "data": {
    "id": "57444257882965766",
    "name": "Automation 1",
    "enabled": false,
    "trigger_data": {
      "track_ecommerce": false,
      "repeatable": false,
      "valid": true
    },
    "steps": [
      {
        "id": "57444257892403137",
        "type": "delay",
        "parent_id": null,
        "unit": "minutes",
        "complete": true,
        "created_at": "2022-06-09 13:58:33",
        "updated_at": "2022-06-09 13:58:33",
        "value": "5",
        "description": "Wait for 5 minutes"
      },
      {
        "id": "57444261587584962",
        "type": "email",
        "parent_id": "57444257892403137",
        "name": "mail",
        "subject": "mail {$name}",
        "from": "dummy@mailerlite.io",
        "from_name": "Dummy Testerson",
        "email_id": "57444261557176071",
        "email": {
          "id": "57444261557176071",
          "account_id": "1",
          "emailable_id": "57444257882965766",
          "emailable_type": "automations",
          "type": "builder",
          "from": "dummy@mailerlite.io",
          "from_name": "Dummy Testerson",
          "name": "mail",
          "subject": "mail {$name}",
          "plain_text": null,
          "screenshot_url": null,
          "preview_url": null,
          "created_at": "2022-06-09 13:58:36",
          "updated_at": "2022-06-09 13:58:42",
          "is_designed": true,
          "language_id": 4,
          "is_winner": false,
          "stats": {
            "sent": 0,
            "opens_count": 0,
            "unique_opens_count": 0,
            "open_rate": {
              "float": 0,
              "string": "0%"
            },
            "clicks_count": 0,
            "unique_clicks_count": 0,
            "click_rate": {
              "float": 0,
              "string": "0%"
            },
            "unsubscribes_count": 0,
            "unsubscribe_rate": {
              "float": 0,
              "string": "0%"
            },
            "spam_count": 0,
            "spam_rate": {
              "float": 0,
              "string": "0%"
            },
            "hard_bounces_count": 0,
            "hard_bounce_rate": {
              "float": 0,
              "string": "0%"
            },
            "soft_bounces_count": 0,
            "soft_bounce_rate": {
              "float": 0,
              "string": "0%"
            },
            "forwards_count": 0
          },
          "send_after": null,
          "track_opens": true
        },
        "language_id": 4,
        "complete": true,
        "created_at": "2022-06-09 13:58:36",
        "updated_at": "2022-06-09 13:58:36",
        "track_opens": true,
        "google_analytics": null,
        "tracking_was_disabled": false,
        "description": "Send \"mail {$name}\" email"
      }
    ],
    "triggers": [
      {
        "id": "80916950725690939",
        "type": "subscriber_joins_group",
        "group_ids": [
          "80916981736277582"
        ],
        "groups": [
          {
            "id": "80916981736277582",
            "name": "My Group",
            "url": null
          }
        ],
        "exclude_group_ids": [],
        "excluded_groups": [],
        "broken": false
      }
    ],
    "complete": true,
    "broken": false,
    "warnings": [],
    "emails_count": 1,
    "first_email_screenshot_url": null,
    "stats": {
      "completed_subscribers_count": 0,
      "subscribers_in_queue_count": 0,
      "bounce_rate": {
        "float": 0,
        "string": "0%"
      },
      "click_to_open_rate": {
        "float": 0,
        "string": "0%"
      },
      "sent": 0,
      "opens_count": 0,
      "unique_opens_count": null,
      "open_rate": {
        "float": 0,
        "string": "0%"
      },
      "clicks_count": 0,
      "unique_clicks_count": null,
      "click_rate": {
        "float": 0,
        "string": "0%"
      },
      "unsubscribes_count": 0,
      "unsubscribe_rate": {
        "float": 0,
        "string": "0%"
      },
      "spam_count": 0,
      "spam_rate": {
        "float": 0,
        "string": "0%"
      },
      "hard_bounces_count": 0,
      "hard_bounce_rate": {
        "float": 0,
        "string": "0%"
      },
      "soft_bounces_count": 0,
      "soft_bounce_rate": {
        "float": 0,
        "string": "0%"
      }
    },
    "created_at": "2022-06-09 13:58:33",
    "has_banned_content": false,
    "qualified_subscribers_count": 63
  }
}
#Error
When providing an invalid automation id

Response code: 404 Not Found
#Get the subscriber activity for an automation
If you want to fetch the subscriber activity for an automation use this GET request

GET https://connect.mailerlite.com/api/automations/{automation_id}/activity
#Request parameters
Parameter	Type	Required	Limitations
filter[status]	string	yes	Must be one of the following: completed, active, canceled, failed
filter[date_from]	date	no	Must be in the format Y-m-d. Relevant for statuses: completed, canceled, failed
filter[date_to]	date	no	Must be in the format Y-m-d. Relevant for statuses: completed, canceled, failed
filter[scheduled_from]	date	no	Must be in the format Y-m-d. Relevant for active status
filter[scheduled_to]	date	no	Must be in the format Y-m-d. Relevant for active status
filter[search]	string	no	Must be a subscriber email
page	integer	no	Defaults to 1
limit	integer	no	Defaults to 10
#Response
Response code: 200 OK
{
  "data": [
    {
      "id": "63060835041281261",
      "status": "Completed",
      "date": "2022-08-10 14:13:08",
      "reason": null,
      "reason_description": "",
      "stepRuns": [
        {
          "id": "63060835092661486",
          "step_id": "63060773780325602",
          "description": "Wait for 10 minutes",
          "scheduled_for": "2022-08-10 14:12:11"
        },
        {
          "id": "63062186887480569",
          "step_id": "61226379035805534",
          "description": "Send \"Hello\" email",
          "scheduled_for": null
        }
      ],
      "nextStep": {
        "id": "76468141616531049",
        "type": "condition",
        "parent_id": "61226379035805534",
        "complete": true,
        "broken": false,
        "yes_step_id": "76468160915572330",
        "no_step_id": null,
        "matching_type": "any",
        "conditions": [
          {
            "type": "custom_fields",
            "field_id": "5",
            "action": "contains",
            "action_value": "unknown",
            "field": {
              "id": "5",
              "name": "City",
              "type": "text"
            }
          }
        ],
        "created_at": "2022-07-21 07:54:02",
        "updated_at": "2022-07-21 07:54:02",
        "description": "Check some condition"
      },
      "currentStep": {
        "id": "61226379035805534",
        "type": "email",
        "parent_id": "63060773780325602",
        "name": "gfg",
        "subject": "gfg",
        "from": "dummy@mailerlite.io",
        "from_name": "Dummy Testerson",
        "email_id": "61226396694873374",
        "email": {
          "id": "61226396694873374",
          "account_id": "1",
          "emailable_id": "61041127433700472",
          "emailable_type": "automations",
          "type": "builder",
          "from": "dummy@mailerlite.io",
          "from_name": "Dummy Testerson",
          "name": "Hello",
          "subject": "Hello",
          "plain_text": null,
          "screenshot_url": null,
          "preview_url": null,
          "created_at": "2022-07-21 07:54:02",
          "updated_at": "2022-08-10 14:13:08",
          "is_designed": true,
          "language_id": 4,
          "is_winner": false,
          "stats": {
            "sent": 3,
            "opens_count": 0,
            "unique_opens_count": 0,
            "open_rate": {
              "float": 0,
              "string": "0%"
            },
            "clicks_count": 0,
            "unique_clicks_count": 0,
            "click_rate": {
              "float": 0,
              "string": "0%"
            },
            "unsubscribes_count": 0,
            "unsubscribe_rate": {
              "float": 0,
              "string": "0%"
            },
            "spam_count": 0,
            "spam_rate": {
              "float": 0,
              "string": "0%"
            },
            "hard_bounces_count": 0,
            "hard_bounce_rate": {
              "float": 0,
              "string": "0%"
            },
            "soft_bounces_count": 0,
            "soft_bounce_rate": {
              "float": 0,
              "string": "0%"
            },
            "forwards_count": 0
          },
          "send_after": null,
          "track_opens": true
        },
        "language_id": 4,
        "complete": true,
        "created_at": "2022-07-21 07:53:45",
        "updated_at": "2022-08-10 13:50:40",
        "track_opens": true,
        "google_analytics": null,
        "tracking_was_disabled": false,
        "description": "Send \"gfg\" email"
      }
    }
  ],
  "links": {
    "first": "https://connect.mailerlite.com/api/automations/{automation_id}/activity?page=1",
    "last": "https://connect.mailerlite.com/api/automations/{automation_id}/activity?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "https://connect.mailerlite.com/api/automations/{automation_id}/activity?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "path": "https://connect.mailerlite.com/api/automations/{automation_id}/activity",
    "per_page": 10,
    "to": 3,
    "total": 3
  }
}
#Error
When providing an invalid automation id

Response code: 404 Not Found
#Create draft automation
If you want to create draft automations use this POST request

POST https://connect.mailerlite.com/api/automations
#Request parameters
Parameter	Type	Required	Limitations
name	string	yes	Must be a string
#Response
Response code: 201 Created
{
  "data": {
    "id": "100000000000000000",
    "name": "Created_automation",
    "enabled": false,
    "trigger_data": {
      "track_ecommerce": false
    },
    "warnings": [],
    "stats": {
      "completed_subscribers_count": 0,
      "subscribers_in_queue_count": 0,
      "bounce_rate": {
        "float": 0,
        "string": "0%"
      },
      "click_to_open_rate": {
        "float": 0,
        "string": "0%"
      },
      "sent": null,
      "opens_count": null,
      "unique_opens_count": null,
      "open_rate": {
        "float": 0,
        "string": "0%"
      },
      "clicks_count": null,
      "unique_clicks_count": null,
      "click_rate": {
        "float": 0,
        "string": "0%"
      },
      "unsubscribes_count": null,
      "unsubscribe_rate": {
        "float": 0,
        "string": "0%"
      },
      "spam_count": null,
      "spam_rate": {
        "float": 0,
        "string": "0%"
      },
      "hard_bounces_count": null,
      "hard_bounce_rate": {
        "float": 0,
        "string": "0%"
      },
      "soft_bounces_count": null,
      "soft_bounce_rate": {
        "float": 0,
        "string": "0%"
      },
      "forward_rate": {
        "float": 0,
        "string": "0%"
      },
      "social_interactions_count": null,
      "social_interaction_rate": {
        "float": 0,
        "string": "0%"
      }
    },
    "created_at": "2024-08-01 00:00:00",
    "has_banned_content": false,
    "steps": []
  }
}
#Delete automation
If you want to delete automation use this DELETE request

DELETE https://connect.mailerlite.com/api/automations/{automation_id}
#Response
Response code: 204 No Content

#Campaigns
You can create, update or send campaigns

#Campaign list
If you want to get a list of all of your campaigns based on status or type use this GET request

GET https://connect.mailerlite.com/api/campaigns
#Request parameters
Parameter	Type	Required	Limitations
filter[status]	string	no	Must be one of the following: sent, draft, ready. Defaults to ready
filter[type]	string	no	Must be one of the following: regular, ab, resend, rss. Defaults to return all
limit	integer	no	Defaults to 25
page	integer	no	Defaults to 1
#Response
Response Code: 200 OK
{
  "data": [
      {
        "id": "1",
        "account_id": "1",
        "name": "dummy campaign",
        "type": "regular",
        "status": "sent",
        "missing_data": [],
        "settings": {
          "track_opens": true,
          "use_google_analytics": false,
          "ecommerce_tracking": false
        },
        "filter": [
          [
            {
              "operator": "in_any",
              "args": [
                 "groups",
                    [
                      "42"
                    ]
              ]
            }
          ]
        ],
        "filter_for_humans": [
          [
            "In any group: dummy group"
          ]
        ],
        "delivery_schedule": "instant",
        "language_id": "4",
        "created_at": "2022-07-26 15:07:52",
        "updated_at": "2022-07-26 15:12:17",
        "scheduled_for": "2022-07-26 15:11:51",
        "queued_at": "2022-07-26 15:12:04",
        "started_at": "2022-07-26 15:12:04",
        "finished_at": "2022-07-26 15:12:17",
        "stopped_at": null,
        "default_email_id": "61706700654118223",
        "emails": [
            {
                "id": "1",
                "account_id": "1",
                "emailable_id": "12",
                "emailable_type": "campaigns",
                "type": "builder",
                "from": "dummy@mailerlite.io",
                "from_name": "Dummy Testerson",
                "reply_to": "reply-to@mailerlite.io",
                "name": null,
                "subject": "hello",
                "plain_text": "Hello,\n\nYou have received a newsletter from {$account}.\n\nHowever, your email software can't display HTML emails. You can view the newsletter by clicking here: {$url}\nYou're receiving this newsletter because you have shown interest in {$account}.\nNot interested anymore? Click here to unsubscribe:\n{$unsubscribe}",
                "screenshot_url": null,
                "preview_url": null,
                "created_at": "2022-07-26 15:08:15",
                "updated_at": "2022-07-26 15:15:29",
                "is_designed": true,
                "language_id": null,
                "is_winner": false,
                "stats": {
                    "sent": 10,
                    "opens_count": 6,
                    "unique_opens_count": 5,
                    "open_rate": {
                        "float": 0.5,
                        "string": "50%"
                    },
                    "clicks_count": 2,
                    "unique_clicks_count": 2,
                    "click_rate": {
                        "float": 0.2,
                        "string": "20%"
                    },
                    "unsubscribes_count": 0,
                    "unsubscribe_rate": {
                        "float": 0,
                        "string": "0%"
                    },
                    "spam_count": 0,
                    "spam_rate": {
                        "float": 0,
                        "string": "0%"
                    },
                    "hard_bounces_count": 0,
                    "hard_bounce_rate": {
                        "float": 0,
                        "string": "0%"
                    },
                    "soft_bounces_count": 0,
                    "soft_bounce_rate": {
                        "float": 0,
                        "string": "0%"
                    },
                    "forwards_count": 0
                },
                "send_after": null,
                "track_opens": true
            }
        ],
        "used_in_automations": false,
        "type_for_humans": "Regular",
        "stats": {
            "sent": 10,
            "opens_count": 6,
            "unique_opens_count": 5,
            "open_rate": {
                "float": 0.5,
                "string": "50%"
            },
            "clicks_count": 2,
            "unique_clicks_count": 2,
            "click_rate": {
                "float": 0.2,
                "string": "20%"
            },
            "unsubscribes_count": 0,
            "unsubscribe_rate": {
                "float": 0,
                "string": "0%"
            },
            "spam_count": 0,
            "spam_rate": {
                "float": 0,
                "string": "0%"
            },
            "hard_bounces_count": 0,
            "hard_bounce_rate": {
                "float": 0,
                "string": "0%"
            },
            "soft_bounces_count": 0,
            "soft_bounce_rate": {
                "float": 0,
                "string": "0%"
            },
            "forwards_count": 0,
            "click_to_open_rate": {
                "float": 1,
                "string": "100%"
            }
        },
        "is_stopped": false,
        "has_winner": null,
        "winner_version_for_human": null,
        "winner_sending_time_for_humans": null,
        "winner_selected_manually_at": null,
        "uses_ecommerce": false,
        "uses_survey": true,
        "can_be_scheduled": false,
        "warnings": [],
        "initial_created_at": null,
        "is_currently_sending_out": false
    }
  ],
  "links": {
    "first": "https://connect.mailerlite.com/api/campaigns?page=1",
    "last": "https://connect.mailerlite.com/api/campaigns?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "https://connect.mailerlite.com/api/campaigns?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "path": "https://connect.mailerlite.com/api/campaigns",
    "per_page": 100,
    "to": 1,
    "total": 1,
    "aggregations": {
       "sum": 2,
       "draft": 1,
       "ready": 0,
       "sent": 1
    }
  }
}
#Get a campaign
You can fetch an existing campaign using this GET request

GET https://connect.mailerlite.com/api/campaigns/{campaign_id}
#Response
Response code: 200 OK
{
  "data": {
      "id": "1",
      "account_id": "1",
      "name": "Dummy campaign",
      "type": "regular",
      "status": "draft",
      "missing_data": [],
      "settings": {
        "track_opens": true,
        "use_google_analytics": false,
        "ecommerce_tracking": false
      },
      "filter": [
        [
          {
            "operator": "in_any",
            "args": [
               "groups",
                  [
                    "42"
                  ]
            ]
          }
        ]
      ],
      "filter_for_humans": [
        [
          "In any group: dummy group"
        ]
      ],
      "delivery_schedule": "instant",
      "language_id": "4",
      "created_at": "2022-07-26 15:07:52",
      "updated_at": "2022-07-26 15:12:17",
      "scheduled_for": "2022-07-26 15:11:51",
      "queued_at": "2022-07-26 15:12:04",
      "started_at": "2022-07-26 15:12:04",
      "finished_at": "2022-07-26 15:12:17",
      "stopped_at": null,
      "default_email_id": "61706700654118223",
      "emails": [
          {
              "id": "1",
              "account_id": "1",
              "emailable_id": "12",
              "emailable_type": "campaigns",
              "type": "builder",
              "from": "dummy@mailerlite.io",
              "from_name": "Dummy Testerson",
              "reply_to": "reply-to@mailerlite.io",
              "name": null,
              "subject": "hello",
              "plain_text": "Hello,\n\nYou have received a newsletter from {$account}.\n\nHowever, your email software can't display HTML emails. You can view the newsletter by clicking here: {$url}\nYou're receiving this newsletter because you have shown interest in {$account}.\nNot interested anymore? Click here to unsubscribe:\n{$unsubscribe}",
              "screenshot_url": null,
              "preview_url": null,
              "created_at": "2022-07-26 15:08:15",
              "updated_at": "2022-07-26 15:15:29",
              "is_designed": true,
              "language_id": null,
              "is_winner": false,
              "stats": {
                  "sent": 10,
                  "opens_count": 0,
                  "unique_opens_count": 0,
                  "open_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "clicks_count": 0,
                  "unique_clicks_count": 0,
                  "click_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "unsubscribes_count": 0,
                  "unsubscribe_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "spam_count": 0,
                  "spam_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "hard_bounces_count": 0,
                  "hard_bounce_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "soft_bounces_count": 0,
                  "soft_bounce_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "forwards_count": 0
              },
              "send_after": null,
              "track_opens": true
          }
      ],
      "used_in_automations": false,
      "type_for_humans": "Regular",
      "is_stopped": false,
      "has_winner": null,
      "winner_version_for_human": null,
      "winner_sending_time_for_humans": null,
      "winner_selected_manually_at": null,
      "uses_ecommerce": false,
      "uses_survey": true,
      "can_be_scheduled": false,
      "warnings": [],
      "initial_created_at": null,
      "is_currently_sending_out": false
  }
}
#Error
When providing an invalid campaign id

Response code: 404 Not Found
#Create a campaign
You can create a campaign using this POST request

POST https://connect.mailerlite.com/api/campaigns
#Request body
Parameter	Type	Required	Limitations
name	string	yes	Maximum string length of 255 characters
language_id	integer	no	Used to define the language in the unsubscribe template. Must be a valid language id. Defaults to english
type	string	yes	Must be one of the following: regular, ab, resend, multivariate. Types resend and multivariate are only available for accounts on growing or advanced plans
emails	array	yes	Must contain 1 email object item, unless campaign type is multivariate with content testing. For multivariate content test, it must contain the amount of content test variations
emails.*.subject	string	yes, unless multivariate campaign	Maximum string length of 255 characters
emails.*.from_name	string	yes, unless multivariate campaign	Maximum string length of 255 characters
emails.*.from	string	yes, unless multivariate campaign	Must be a valid email address that has been already verified on MailerLite
emails.*.reply_to	string	no	Must be a valid reply_to email address that has been already verified on MailerLite
emails.*.content	string	no	The content must be valid HTML, and the account must be on the Advanced plan. The email body must include an unsubscribe link, account name, address, and country. Otherwise, the default email footer will be added. Learn more.
groups	array	no	Must contain valid group ids belonging to the account
segments	array	no	Must contain valid segment ids belonging to the account. If both groups and segments are provided, only segments are used
ab_settings	object	only if type is ab	All items of the array are required
ab_settings[test_type]	string	only if type is ab	Must be one of the following: subject, sender, sending_time
ab_settings[select_winner_by]	string	only if type is ab and test type is not sending_time	Must be one of the following: o (for opens), c (for clicks)
ab_settings[after_time_amount]	integer	only if type is ab and test type is not sending_time	Defines the amount of wait time for the ab testing
ab_settings[after_time_unit]	string	only if type is ab and test type is not sending_time	Defines the unit of the wait time. Must be one of the following: h (for hours) or d (for days)
ab_settings[test_split]	integer	only if type is ab	Must be between 5 and 25 for test types subject and sender and 100 for sending_time test type
ab_settings[b_value]	object	only if type is ab and test type is not sending_time	Must contain the items for the b version of the campaign
ab_settings[b_value][subject]	string	only if ab test type is subject	Maximum string length of 255 characters
ab_settings[b_value][from_name]	string	only if ab test type is sender	Maximum string length of 255 characters
ab_settings[b_value][from]	string	only if ab test type is sender	Must be a valid email address that has been already verified on MailerLite
resend_settings	object	only if type is resend	All items of the array are required
resend_settings[test_type]	string	only if type is resend	Must be one of the following: subject
resend_settings[select_winner_by]	string	only if type is resend	Defines the metric on which the recipients of the second email are selected. Must be one of the following: o (did not open the email), c (did not click the email)
resend_settings[b_value]	object	only if type is resend	Must contain the items for the auto resend of the campaign
resend_setings[b_value][subject]	string	only if type is resend	Maximum string length of 255 characters
multivariate_settings	object	only if type is multivariate	All items of the array are required
multivariate_settings[test_variants]	object	only if type is multivariate	Must contain all 4 test variant options: subject, sender, content and sending_time, however the total amount of email combinations must not exceed 8
multivariate_settings[test_variants][subject]	array	only if type is multivariate	Must contain an array of subject variants. Must contain at least 1
multivariate_settings[test_variants][subject.*]	string	only if type is multivariate	Maximum string length of 255 characters
multivarite_settings[test_variants][sender]	array	only if type is multivariate	Must contain an array of sender variants. Must contain at least 1
multivariate_settings[test_variants][sender.*]	object	only if type is multivariate	Must contain from and from_name
multivariate_settings[test_variants][sender.*.from]	string	only if type is multivariate	Must be a valid email address that has been already verified on MailerLite
multivariate_settings[test_variants][sender.*.from_name]	string	only if type is multivariate	Maximum string length of 255 characters
multivarite_settings[test_variants][content]	integer	only if type is multivariate	Must be a number between 1 and 8
multivarite_settings[test_variants][sending_time]	integer	only if type is multivariate	Must be a number between 1 and 8
multivarite_settings[select_winner_by]	string	only if type is multivariate and test type is not sending_time	Must be one of the following: o (for opens), c (for clicks)
multivarite_settings[after_time_amount]	integer	only if type is multivariate and test type is not sending_time	Defines the amount of wait time for the ab testing
multivarite_settings[after_time_unit]	string	only if type is multivariate and test type is not sending_time	Defines the unit of the wait time. Must be one of the following: h (for hours) or d (for days)
multivarite_settings[test_split]	integer	only if type is multivariate	Must be between 10 and 50 when sending time is not tested and 100 when sending time is tested
settings	object	no	Object containing campaign configuration options such as ecommerce tracking
settings[ecommerce_tracking]	bool	no	If campaign content contains ecommerce shop URLs, ecommerce link tracking will be enabled when set to true
#Response
Response code: 200 OK
{
  "data": {
      "id": "1",
      "account_id": "1",
      "name": "Dummy campaign",
      "type": "regular",
      "status": "draft",
      "missing_data": [],
      "settings": {
        "track_opens": true,
        "use_google_analytics": false,
        "ecommerce_tracking": false
      },
      "filter": [
        [
          {
            "operator": "in_any",
            "args": [
               "groups",
                  [
                    "42"
                  ]
            ]
          }
        ]
      ],
      "filter_for_humans": [
        [
          "In any group: dummy group"
        ]
      ],
      "delivery_schedule": "instant",
      "language_id": "4",
      "created_at": "2022-07-26 15:07:52",
      "updated_at": "2022-07-26 15:12:17",
      "scheduled_for": "2022-07-26 15:11:51",
      "queued_at": "2022-07-26 15:12:04",
      "started_at": "2022-07-26 15:12:04",
      "finished_at": "2022-07-26 15:12:17",
      "stopped_at": null,
      "default_email_id": "61706700654118223",
      "emails": [
          {
              "id": "1",
              "account_id": "1",
              "emailable_id": "12",
              "emailable_type": "campaigns",
              "type": "builder",
              "from": "dummy@mailerlite.io",
              "from_name": "Dummy Testerson",
              "reply_to": "reply-to@mailerlite.io",  
              "name": null,
              "subject": "hello",
              "plain_text": "Hello,\n\nYou have received a newsletter from {$account}.\n\nHowever, your email software can't display HTML emails. You can view the newsletter by clicking here: {$url}\nYou're receiving this newsletter because you have shown interest in {$account}.\nNot interested anymore? Click here to unsubscribe:\n{$unsubscribe}",
              "screenshot_url": null,
              "preview_url": null,
              "created_at": "2022-07-26 15:08:15",
              "updated_at": "2022-07-26 15:15:29",
              "is_designed": true,
              "language_id": null,
              "is_winner": false,
              "stats": {
                  "sent": 10,
                  "opens_count": 0,
                  "unique_opens_count": 0,
                  "open_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "clicks_count": 0,
                  "unique_clicks_count": 0,
                  "click_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "unsubscribes_count": 0,
                  "unsubscribe_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "spam_count": 0,
                  "spam_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "hard_bounces_count": 0,
                  "hard_bounce_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "soft_bounces_count": 0,
                  "soft_bounce_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "forwards_count": 0
              },
              "send_after": null,
              "track_opens": true
          }
      ],
      "used_in_automations": false,
      "type_for_humans": "Regular",
      "is_stopped": false,
      "has_winner": null,
      "winner_version_for_human": null,
      "winner_sending_time_for_humans": null,
      "winner_selected_manually_at": null,
      "uses_ecommerce": false,
      "uses_survey": true,
      "can_be_scheduled": false,
      "warnings": [],
      "initial_created_at": null,
      "is_currently_sending_out": false
  }
}
#Error
When campaign request has missing parameters

Response code: 422 Unprocessable entity
{
  "message": "The given data was invalid.",
  "errors": {
    "type": ["The selected type is invalid."]
  }
}
#Update campaign
If you want to update a campaign that is currently with draft status, use this PUT request

PUT https://connect.mailerlite.com/api/campaigns/{campaign_id}
#Request body
Parameter	Type	Required	Limitations
name	string	yes	Maximum string length of 255 characters
language_id	integer	no	Used to define the language in the unsubscribe template. Must be a valid language id. Defaults to english
emails	array	yes	Must contain 1 email object item
emails.*.subject	string	yes	Maximum string length of 255 characters
emails.*.from_name	string	yes	Maximum string length of 255 characters
emails.*. from	string	yes	Must be a valid email address that has been already verified on MailerLite
emails.*.content	string	no	The content must be valid HTML, and the account must be on the Advanced plan. The email body must include an unsubscribe link, account name, address, and country. Otherwise, the default email footer will be added. Learn more.
groups	array	no	Must contain valid group ids belonging to the account
segments	array	no	Must contain valid segment ids belonging to the account. If both groups and segments are provided, only segments are used
ab_settings	object	only if type is ab	All items of the array are required
ab_settings[test_type]	string	only if type is ab	Must be one of the following: subject, sender, sending_time
ab_settings[select_winner_by]	string	only if type is ab and test type is not sending_time	Must be one of the following: o (for opens), c (for clicks)
ab_settings[after_time_amount]	integer	only if type is ab and test type is not sending_time	Defines the amount of wait time for the ab testing
ab_settings[after_time_unit]	string	only if type is aband test type is not sending_time	Defines the unit of the wait time. Must be one of the following: h (for hours) or d (for days)
ab_settings[test_split]	integer	only if type is ab	Must be between 5 and 25 for test types subject and sender and 100 for sending_time test type
ab_settings[b_value]	object	only if type is ab and test type is not sending_time	Must contain the items for the b version of the campaign
ab_settings[b_value][subject]	string	only if ab test type is subject	Maximum string length of 255 characters
ab_settings[b_value][from_name]	string	only if ab test type is sender	Maximum string length of 255 characters
ab_settings[b_value][from]	string	only if ab test type is sender	Must be a valid email address that has been already verified on MailerLite
resend_settings	object	only if type is resend	All items of the array are required
resend_settings[test_type]	string	only if type is resend	Must be one of the following: subject
resend_settings[select_winner_by]	string	only if type is resend	Defines the metric on which the recipients of the second email are selected. Must be one of the following: o (did not open the email), c (did not click the email)
resend_settings[b_value]	object	only if type is resend	Must contain the items for the auto resend of the campaign
resend_setings[b_value][subject]	string	only if type is resend	Maximum string length of 255 characters
#Response
Response code: 200 OK
{
  "data": {
      "id": "1",
      "account_id": "1",
      "name": "Dummy campaign",
      "type": "regular",
      "status": "draft",
      "missing_data": [],
      "settings": {
        "track_opens": true,
        "use_google_analytics": false,
        "ecommerce_tracking": false
      },
      "filter": [
        [
          {
            "operator": "in_any",
            "args": [
               "groups",
                  [
                    "42"
                  ]
            ]
          }
        ]
      ],
      "filter_for_humans": [
        [
          "In any group: dummy group"
        ]
      ],
      "delivery_schedule": "instant",
      "language_id": "4",
      "created_at": "2022-07-26 15:07:52",
      "updated_at": "2022-07-26 15:12:17",
      "scheduled_for": "2022-07-26 15:11:51",
      "queued_at": "2022-07-26 15:12:04",
      "started_at": "2022-07-26 15:12:04",
      "finished_at": "2022-07-26 15:12:17",
      "stopped_at": null,
      "default_email_id": "61706700654118223",
      "emails": [
          {
              "id": "1",
              "account_id": "1",
              "emailable_id": "12",
              "emailable_type": "campaigns",
              "type": "builder",
              "from": "dummy@mailerlite.io",
              "from_name": "Dummy Testerson",
              "name": null,
              "reply_to": "reply-to@mailerlite.io",
              "subject": "hello",
              "plain_text": "Hello,\n\nYou have received a newsletter from {$account}.\n\nHowever, your email software can't display HTML emails. You can view the newsletter by clicking here: {$url}\nYou're receiving this newsletter because you have shown interest in {$account}.\nNot interested anymore? Click here to unsubscribe:\n{$unsubscribe}",
              "screenshot_url": null,
              "preview_url": null,
              "created_at": "2022-07-26 15:08:15",
              "updated_at": "2022-07-26 15:15:29",
              "is_designed": true,
              "language_id": null,
              "is_winner": false,
              "stats": {
                  "sent": 10,
                  "opens_count": 0,
                  "unique_opens_count": 0,
                  "open_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "clicks_count": 0,
                  "unique_clicks_count": 0,
                  "click_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "unsubscribes_count": 0,
                  "unsubscribe_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "spam_count": 0,
                  "spam_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "hard_bounces_count": 0,
                  "hard_bounce_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "soft_bounces_count": 0,
                  "soft_bounce_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "forwards_count": 0
              },
              "send_after": null,
              "track_opens": true
          }
      ],
      "used_in_automations": false,
      "type_for_humans": "Regular",
      "is_stopped": false,
      "has_winner": null,
      "winner_version_for_human": null,
      "winner_sending_time_for_humans": null,
      "winner_selected_manually_at": null,
      "uses_ecommerce": false,
      "uses_survey": true,
      "can_be_scheduled": false,
      "warnings": [],
      "initial_created_at": null,
      "is_currently_sending_out": false
  }
}
#Error
When trying to update a campaign that is not with status draft

Response code: 422 Unprocessable entity
"Campaign is not with status draft"
When campaign request has missing parameters

Response code: 422 Unprocessable entity
{
  "message": "The given data was invalid.",
  "errors": {
    "name": ["The name may not be greater than 255 characters."]
  }
}
When providing an invalid campaign id

Response code: 404 Not Found
#Schedule a campaign
If you want to schedule or send immediately a campaign, use this POST request

POST https://connect.mailerlite.com/api/campaigns/{campaign_id}/schedule
#Request body
Parameter	Type	Required	Limitations
delivery	string	yes unless campaign type is rss	Must be one of the following: instant, scheduled, timezone_based, smart_sending
schedule[date]	string	only for scheduled and smart_sending delivery type	Must be a date in the future. Campaign must not be of type AB test with sending time test type
schedule[hours]	string	only for scheduled or timezone based delivery types	Must be a valid hour in HH format. Campaign must not be of type AB test with sending time test type
schedule[minutes]	string	only for scheduled or timezone based delivery types	Must be a valid minute in ii format. Campaign must not be of type AB test with sending time test type
schedule[timezone_id]	integer	no	Must be a valid timezone id, defaults to the account's timezone id. Campaign must not be of type AB test with sending time test type
resend[delivery]	string	only for campaign of type auto resend	Must be Must be one of the following: day, scheduled
resend[date]	string	only for campaign of type auto resend	Must be a date in the future
resend[hours]	string	only for campaign of type auto resend	Must be a valid hour in HH format
resend[minutes]	string	only for campaign of type auto resend	Must be a valid minute in ii format
resend[timezone_id]	integer	no	Must be a valid timezone id, defaults to the account's timezone id
sending_time_test_schedule	array	yes if campaign is of type AB test with sending time test type	Must constain 2 sending times
sending_time_test_schedule.*.date	string	yes if campaign is of type AB test with sending time test type	Must be a date in the future
sending_time_test_schedule.*.hours	string	yes if campaign is of type AB test with sending time test type	Must be a valid hour in HH format.
sending_time_test_schedule.*.minutes	string	yes if campaign is of type AB test with sending time test type	Must be a valid minute in ii format.
sending_time_test_schedule.*.timezone_id	string	yes if campaign is of type AB test with sending time test type	Must be a valid timezone id, defaults to the account's timezone id.
#Response
Response code: 200 OK
{
  "data": {
      "id": "1",
      "account_id": "1",
      "name": "Dummy campaign",
      "type": "regular",
      "status": "sent",
      "missing_data": [],
      "settings": {
        "track_opens": true,
        "use_google_analytics": false,
        "ecommerce_tracking": false
      },
      "filter": [
        [
          {
            "operator": "in_any",
            "args": [
               "groups",
                  [
                    "42"
                  ]
            ]
          }
        ]
      ],
      "filter_for_humans": [
        [
          "In any group: dummy group"
        ]
      ],
      "delivery_schedule": "instant",
      "language_id": "4",
      "created_at": "2022-07-26 15:07:52",
      "updated_at": "2022-07-26 15:12:17",
      "scheduled_for": "2022-07-26 15:11:51",
      "queued_at": "2022-07-26 15:12:04",
      "started_at": "2022-07-26 15:12:04",
      "finished_at": "2022-07-26 15:12:17",
      "stopped_at": null,
      "default_email_id": "61706700654118223",
      "emails": [
          {
              "id": "1",
              "account_id": "1",
              "emailable_id": "12",
              "emailable_type": "campaigns",
              "type": "builder",
              "from": "dummy@mailerlite.io",
              "from_name": "Dummy Testerson",
              "name": null,
              "reply_to": "reply-to@mailerlite.io",
              "subject": "hello",
              "plain_text": "Hello,\n\nYou have received a newsletter from {$account}.\n\nHowever, your email software can't display HTML emails. You can view the newsletter by clicking here: {$url}\nYou're receiving this newsletter because you have shown interest in {$account}.\nNot interested anymore? Click here to unsubscribe:\n{$unsubscribe}",
              "screenshot_url": null,
              "preview_url": null,
              "created_at": "2022-07-26 15:08:15",
              "updated_at": "2022-07-26 15:15:29",
              "is_designed": true,
              "language_id": null,
              "is_winner": false,
              "stats": {
                  "sent": 10,
                  "opens_count": 0,
                  "unique_opens_count": 0,
                  "open_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "clicks_count": 0,
                  "unique_clicks_count": 0,
                  "click_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "unsubscribes_count": 0,
                  "unsubscribe_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "spam_count": 0,
                  "spam_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "hard_bounces_count": 0,
                  "hard_bounce_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "soft_bounces_count": 0,
                  "soft_bounce_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "forwards_count": 0
              },
              "send_after": null,
              "track_opens": true
          }
      ],
      "used_in_automations": false,
      "type_for_humans": "Regular",
      "is_stopped": false,
      "has_winner": null,
      "winner_version_for_human": null,
      "winner_sending_time_for_humans": null,
      "winner_selected_manually_at": null,
      "uses_ecommerce": false,
      "uses_survey": true,
      "can_be_scheduled": false,
      "warnings": [],
      "initial_created_at": null,
      "is_currently_sending_out": false
  }
}
#Error
When campaign settings are not complete

Response code: 422 Unprocessable entity
"Campaign settings missing"
When campaign with given ID has not been found for the account

Response code: 404 Not found
#Cancel a ready campaign
If you wish to cancel a campaign that is currently in a ready state, use this POST request

#Request
POST https://connect.mailerlite.com/api/campaigns/{campaign_id}/cancel
#Response
Response code: 200 OK
{
  "data": {
      "id": "1",
      "account_id": "1",
      "name": "Dummy campaign",
      "type": "regular",
      "status": "draft",
      "missing_data": [],
      "settings": {
        "track_opens": true,
        "use_google_analytics": false,
        "ecommerce_tracking": false
      },
      "filter": [
        [
          {
            "operator": "in_any",
            "args": [
               "groups",
                  [
                    "42"
                  ]
            ]
          }
        ]
      ],
      "filter_for_humans": [
        [
          "In any group: dummy group"
        ]
      ],
      "delivery_schedule": "instant",
      "language_id": "4",
      "created_at": "2022-07-26 15:07:52",
      "updated_at": "2022-07-26 15:12:17",
      "scheduled_for": null,
      "queued_at": null,
      "started_at": null,
      "finished_at": null,
      "stopped_at": null,
      "default_email_id": "61706700654118223",
      "emails": [
          {
              "id": "1",
              "account_id": "1",
              "emailable_id": "12",
              "emailable_type": "campaigns",
              "type": "builder",
              "from": "dummy@mailerlite.io",
              "from_name": "Dummy Testerson",
              "name": null,
              "reply_to": "reply-to@mailerlite.io",
              "subject": "hello",
              "plain_text": "Hello,\n\nYou have received a newsletter from {$account}.\n\nHowever, your email software can't display HTML emails. You can view the newsletter by clicking here: {$url}\nYou're receiving this newsletter because you have shown interest in {$account}.\nNot interested anymore? Click here to unsubscribe:\n{$unsubscribe}",
              "screenshot_url": null,
              "preview_url": null,
              "created_at": "2022-07-26 15:08:15",
              "updated_at": "2022-07-26 15:15:29",
              "is_designed": true,
              "language_id": null,
              "is_winner": false,
              "stats": {
                  "sent": 10,
                  "opens_count": 0,
                  "unique_opens_count": 0,
                  "open_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "clicks_count": 0,
                  "unique_clicks_count": 0,
                  "click_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "unsubscribes_count": 0,
                  "unsubscribe_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "spam_count": 0,
                  "spam_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "hard_bounces_count": 0,
                  "hard_bounce_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "soft_bounces_count": 0,
                  "soft_bounce_rate": {
                      "float": 0,
                      "string": "0%"
                  },
                  "forwards_count": 0
              },
              "send_after": null,
              "track_opens": true
          }
      ],
      "used_in_automations": false,
      "type_for_humans": "Regular",
      "is_stopped": false,
      "has_winner": null,
      "winner_version_for_human": null,
      "winner_sending_time_for_humans": null,
      "winner_selected_manually_at": null,
      "uses_ecommerce": false,
      "uses_survey": true,
      "can_be_scheduled": false,
      "warnings": [],
      "initial_created_at": null,
      "is_currently_sending_out": false
  }
}
#Error
When trying to cancel a campaign sending that is not in a ready state

Response code: 400 Bad request
When campaign with given ID has not been found for the account

Response code: 404 Not found
#Delete a campaign
If you want to delete a campaign, use this DELETE request

DELETE https://connect.mailerlite.com/api/campaigns/{campaign_id}
#Response
Response Code: 204 No Content
#Error
Response code: 404 Not found
#Get subscribers' activity of a sent campaign
If you want to get the subscribers' activity of a campaign with status sent use this GET request

GET https://connect.mailerlite.com/api/campaigns/{campaign_id}/reports/subscriber-activity
#Request body
Parameter	Type	Required	Limitations
filter[type]	string	no	Must be one of following: opened, unopened, clicked, unsubscribed, forwarded, hardbounced, softbounced, junk. Defaults to returning all recipients
filter[search]	string	no	Must be a subscriber email
limit	integer	no	Must be one of the following: 10, 25, 50, 100. Defaults to 50
sort	string	no	Must be one of the following: id, updated_at, clicks_count, opens_count. Defaults to id
page	integer	no	Defaults to 1
include	string	no	Additional resources to include in the response. Currently subscriber and subscriber.groups are supported.
#Response
Response code: 200 OK
{
    "data": [
        {
          "id":"66201001018787256",
          "opens_count":1,
          "clicks_count":0,
          "subscriber": {
            "id":"56152210168350162",
            "email":"dummy@mailerlite.com",
            "status":"active",
            "source":"import",
            "sent":13,
            "opens_count":1,
            "clicks_count":0,
            "open_rate":7.69,
            "click_rate":0,
            "ip_address":null,
            "subscribed_at":"2022-05-26 07:42:00",
            "unsubscribed_at":null,
            "created_at":"2022-05-26 07:42:00",
            "updated_at":"2022-09-14 05:44:16",
            "fields": {
              "name":null,
              "last_name":null,
              "company":null,
              "country":null,
              "city":null,
              "phone":null,
              "state":null,
              "zip":null
            },
            "opted_in_at":null,
            "optin_ip":null
          }
        }
      ],
    "links": {
      "first":"https://connect.mailerlite.com/api/campaigns/66200823885989563/reports/subscriber-activity?page=1",
      "last":"https://connect.mailerlite.com/api/campaigns/66200823885989563/reports/subscriber-activity?page=1",
      "prev":null,
      "next":null
    },
    "meta": {
      "current_page":1,
      "from":1,
      "last_page":1,
      "links": [
        {
          "url":null,
          "label":"&laquo; Previous",
          "active":false
        },
        {
          "url":"https://connect.mailerlite.com/api/campaigns/66200823885989563/reports/subscriber-activity?page=1",
          "label":"1",
          "active":true
        },
        {
          "url":null,
          "label":"Next &raquo;",
          "active":false
        }
      ],
      "path":"https://connect.mailerlite.com/api/campaigns/66200823885989563/reports/subscriber-activity",
      "per_page":50,
      "to":1,
      "total":1,
      "aggregations": {
        "sum":11,
        "opened":1,
        "unopened":10,
        "clicked":0,
        "unsubscribed":0,
        "forwarded":0,
        "hardbounced":0,
        "softbounced":0,
        "junk":0
      }
    }
}
#Error
When providing an invalid campaign id

Response code: 404 Not Found
{
  "message": "The given data was invalid.",
  "errors": {
    "limit": ["The limit must be one of following: 10, 25, 50, 100"]
  }
}

#Webhooks
Webhooks allow you to subscribe to real-time notifications about various events that occur in MailerLite. For example, when a new subscriber is added to your account, HTTP POST callback is sent to your provided URL with a payload containing the new subscriber. It allows you to get the most recent updates without constantly polling the API. You can see your existing webhooks, create new, update and delete them.

#Available events
Event	Description
subscriber.created	Fires when a new subscriber is added to an account.
subscriber.updated	Fires when any of the subscriber's custom fields are updated or when they confirm their subscription.
subscriber.unsubscribed	Fires when a subscriber becomes unsubscribed.
subscriber.added_to_group	Fires when a subscriber is added to a group.
subscriber.removed_from_group	Fires when a subscriber is removed from a group.
subscriber.bounced	Fires when an email address bounces.
subscriber.automation_triggered	Fires when a subscriber starts an automation.
subscriber.automation_completed	Fires when a subscriber finishes an automation.
subscriber.spam_reported	Fires when a subscriber marks a campaign as spam.
subscriber.deleted	Fires when a subscriber is set as deleted or forgotten. The batchable option is required for this webhook and must be set as true.
subscriber.active	Fires when a subscriber status is set to active.
campaign.sent	Fires when a campaign is sent.
campaign.click	Fires when a subscriber clicks a link in a campaign. The batchable option is required for this webhook and must be set as true.
campaign.open	Fires when a subscriber opens a campaign. The batchable option is required for this webhook and must be set as true.
#Delivery, attempts and retries
Webhooks are only delivered for active accounts.

A webhook event is considered delivered when your webserver responds with 2XX status code. Make sure you don't return 4XX or 5XX status codes as part of your business logic, as you will keep getting duplicate webhook events.

Your webserver should respond in less than 3 seconds, otherwise webhook is considered failed. For this reason you should not do any heavy processing in the same request cycle and offload it to a different process.

Upon failure (timeout or non-2XX status code) webhook events are retried three more times with 10, 100, and finally 1000 seconds delay.

#Security
Webhook requests include Signature header, its value is HMAC (sha256) which is generated from payload JSON using webhook's secret. You can check its validity in order to be guaranteed that a request is sent from our side.

An example of a function which produces a signature in PHP:

public function generateSignature(string $jsonPayload, string $secret): string
{
    return hash_hmac('sha256', $jsonPayload, $secret);
}
#List all webhooks
GET https://connect.mailerlite.com/api/webhooks
#Response
Response code: 200 OK
{
  "data": [
    {
      "id": "68079566047937883",
      "name": "Test 2",
      "url": "http://google.com",
      "events": [
        "subscriber.created"
      ],
      "enabled": true,
      "secret": "ybmcD7PQ9R",
      "created_at": "2022-10-04 23:22:13",
      "updated_at": "2022-10-04 23:54:04",
      "batchable": true
    },
    {
      "id": "68078863100413274",
      "name": "Test",
      "url": "http://google.com",
      "events": [
        "subscriber.created"
      ],
      "enabled": true,
      "secret": "9JVEvb07Yq",
      "created_at": "2022-10-04 23:11:03",
      "updated_at": "2022-10-04 23:11:03",
      "batchable": false
    },
    {
      "id": "68078820398204249",
      "name": "Test",
      "url": "http://google.com",
      "events": [
        "subscriber.created"
      ],
      "enabled": true,
      "secret": "yXIrayUCWJ",
      "created_at": "2022-10-04 23:10:22",
      "updated_at": "2022-10-04 23:10:22",
      "batchable": true
    },
    {
      "id": "68074372003267924",
      "name": "Eveniet vero minus.",
      "url": "http://www.marvin.com/omnis-accusamus-est-rem-delectus-quaerat.html",
      "events": [
        "subscriber.bounced"
      ],
      "enabled": true,
      "secret": "Kn556GohSH",
      "created_at": "2022-10-04 21:59:40",
      "updated_at": "2022-10-04 21:59:40",
      "batchable": false
    },
    {
      "id": "68074372003267926",
      "name": "Et voluptatibus et est voluptatibus.",
      "url": "http://harber.net/ipsa-molestias-voluptatem-fugiat-quis-tempora-ullam.html",
      "events": [
        "subscriber.automation_completed"
      ],
      "enabled": true,
      "secret": "WXS0dF3FHc",
      "created_at": "2022-10-04 21:59:40",
      "updated_at": "2022-10-04 21:59:40",
      "batchable": true
    },
    {
      "id": "68074372005365080",
      "name": "Perferendis dolorem aut nulla.",
      "url": "http://www.brekke.com/",
      "events": [
        "subscriber.added_to_group"
      ],
      "enabled": true,
      "secret": "Ko17Uw3hiB",
      "created_at": "2022-10-04 21:59:40",
      "updated_at": "2022-10-04 21:59:40",
      "batchable": true
    },
    {
      "id": "68074372004316503",
      "name": "Tenetur delectus eum fugiat.",
      "url": "http://www.cartwright.info/eligendi-soluta-corporis-in-quod-ullam",
      "events": [
        "subscriber.bounced"
      ],
      "enabled": true,
      "secret": "4jQ3Y4UlLI",
      "created_at": "2022-10-04 21:59:40",
      "updated_at": "2022-10-04 21:59:40",
      "batchable": true
    },
    {
      "id": "68074372001170769",
      "name": "Tempore voluptatem et voluptas.",
      "url": "http://www.pfeffer.net/quod-voluptatibus-explicabo-nihil-ipsum-accusamus-error",
      "events": [
        "subscriber.removed_from_group"
      ],
      "enabled": true,
      "secret": "hvHGn2D4yu",
      "created_at": "2022-10-04 21:59:40",
      "updated_at": "2022-10-04 21:59:40",
      "batchable": true
    },
    {
      "id": "68074372001170770",
      "name": "Vel inventore rem.",
      "url": "http://kautzer.com/consequatur-neque-eaque-ad-et-rem-labore-ut.html",
      "events": [
        "subscriber.created"
      ],
      "enabled": true,
      "secret": "xbzp318Djs",
      "created_at": "2022-10-04 21:59:40",
      "updated_at": "2022-10-04 21:59:40",
      "batchable": true
    },
    {
      "id": "68074372003267925",
      "name": "Voluptas animi consequatur.",
      "url": "http://www.oconner.org/laudantium-ipsa-ad-distinctio-eos-quasi-dicta.html",
      "events": [
        "campaign.sent"
      ],
      "enabled": true,
      "secret": "3b1EMAhuoT",
      "created_at": "2022-10-04 21:59:40",
      "updated_at": "2022-10-04 21:59:40",
      "batchable": true
    },
    {
      "id": "68074371998025039",
      "name": "Expedita esse est fugit.",
      "url": "https://www.deckow.com/aut-quae-voluptate-ab-qui-qui",
      "events": [
        "subscriber.removed_from_group"
      ],
      "enabled": true,
      "secret": "QbVgXU0L93",
      "created_at": "2022-10-04 21:59:40",
      "updated_at": "2022-10-04 21:59:40",
      "batchable": true
    },
    {
      "id": "68074372000122192",
      "name": "Autem culpa perferendis quaerat.",
      "url": "http://homenick.biz/tempora-asperiores-qui-alias-voluptas-eos-necessitatibus-et",
      "events": [
        "subscriber.automation_completed"
      ],
      "enabled": true,
      "secret": "N3cZ5WO2ep",
      "created_at": "2022-10-04 21:59:40",
      "updated_at": "2022-10-04 21:59:40",
      "batchable": true
    },
    {
      "id": "68074372002219347",
      "name": "Officia quia aut.",
      "url": "https://www.cartwright.org/mollitia-corporis-ipsam-reiciendis-dolor-error-amet-velit",
      "events": [
        "subscriber.updated"
      ],
      "enabled": true,
      "secret": "xRyma5WnWP",
      "created_at": "2022-10-04 21:59:40",
      "updated_at": "2022-10-04 21:59:40",
      "batchable": true
    },
    {
      "id": "68079566047937234",
      "name": "Campaign Open",
      "url": "http://google.com",
      "events": [
        "campaign.open"
      ],
      "enabled": true,
      "secret": "ybmcD7PQ9R",
      "created_at": "2022-10-04 23:22:13",
      "updated_at": "2022-10-04 23:54:04",
      "batchable": true
    },
    {
      "id": "68079566047937324",
      "name": "Campaign link clicked",
      "url": "http://google.com",
      "events": [
        "campaign.click"
      ],
      "enabled": true,
      "secret": "ybmcD7PQ9R",
      "created_at": "2022-10-04 23:22:13",
      "updated_at": "2022-10-04 23:54:04",
      "batchable": true
    },
    {
      "id": "68079566047937325",
      "name": "Subscriber deleted",
      "url": "http://google.com",
      "events": [
        "subscriber.deleted"
      ],
      "enabled": true,
      "secret": "ybmcD7PQ9o",
      "created_at": "2022-10-04 23:22:13",
      "updated_at": "2022-10-04 23:54:04",
      "batchable": true
    },
    {
      "id": "68079566047937321",
      "name": "Subscriber deleted",
      "url": "http://google.com",
      "events": [
        "subscriber.active"
      ],
      "enabled": true,
      "secret": "ybmcD7PQ1o",
      "created_at": "2022-10-04 23:22:13",
      "updated_at": "2022-10-04 23:54:04",
      "batchable": false
    }
  ],
  "links": {
    "first": "http://localhost:8080/api/webhooks?page=1",
    "last": "http://localhost:8080/api/webhooks?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "http://localhost:8080/api/webhooks?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "path": "http://localhost:8080/api/webhooks",
    "per_page": 50,
    "to": 13,
    "total": 13
  }
}
#Get a webhook
GET https://connect.mailerlite.com/api/webhooks/{webhook_id}
#Response
Response code: 200 OK
{
  "data": {
    "id": "68074372004316503",
    "name": "Tenetur delectus eum fugiat.",
    "url": "http://www.cartwright.info/eligendi-soluta-corporis-in-quod-ullam",
    "events": [
      "subscriber.bounced"
    ],
    "enabled": true,
    "secret": "4jQ3Y4UlLI",
    "created_at": "2022-10-04 21:59:40",
    "updated_at": "2022-10-04 21:59:40",
    "batchable": false
  }
}
#Error
When providing an invalid webhook id

Response code: 404 Not Found
#Create a webhook
POST https://connect.mailerlite.com/api/webhooks
#Request body
Parameter	Type	Required	Limitations
name	string	no	
events	array	yes	Must be one of the events described in following table
url	string	yes	
enabled	boolean	no	
batchable	boolean	no	Required as true only for campaign.open and campaign.click events
#Response
Response code: 200 OK
{
  "data": {
    "id": "68074372004316503",
    "name": "Tenetur delectus eum fugiat.",
    "url": "http://www.cartwright.info/eligendi-soluta-corporis-in-quod-ullam",
    "events": [
      "subscriber.bounced"
    ],
    "enabled": true,
    "secret": "4jQ3Y4UlLI",
    "created_at": "2022-10-04 21:59:40",
    "updated_at": "2022-10-04 21:59:40",
    "batchable": false
  }
}
#Update a webhook
PUT https://connect.mailerlite.com/api/webhooks/{webhook_id}
#Request body
Parameter	Type	Required	Limitations
name	string	no	
events	array	no	
url	string	no	
enabled	boolean	no	
batchable	boolean	no	Required as true only for campaign.open and campaign.click events
#Response
Response code: 200 OK
{
  "data": {
    "id": "68074372004316503",
    "name": "Tenetur delectus eum fugiat.",
    "url": "http://www.cartwright.info/eligendi-soluta-corporis-in-quod-ullam",
    "events": [
      "subscriber.bounced"
    ],
    "enabled": true,
    "secret": "4jQ3Y4UlLI",
    "created_at": "2022-10-04 21:59:40",
    "updated_at": "2022-10-04 21:59:40",
    "batchable": false
  }
}
#Delete a webhook
DELETE https://connect.mailerlite.com/api/webhooks/{webhook_id}
#Response
Response code: 204 No Content
#Payloads
Examples of webhooks data you can receive

subscriber.created

Show payload details
subscriber.updated

Show payload details
subscriber.unsubscribed

Show payload details
subscriber.added_to_group

Show payload details
subscriber.removed_from_group

Show payload details
subscriber.bounced

Show payload details
subscriber.automation_triggered

Show payload details
subscriber.automation_completed

Show payload details
subscriber.spam_reported

Show payload details
campaign.sent

Show payload details
campaign.open

Show payload details
campaign.click

Show payload details
subscriber.deleted

Show payload details
subscriber.active

Show payload details
#Batched payloads
Show batched payload details

#Forms
You can see your existing forms and their basic stats.

#List all forms
If you want to list all forms in your account, send this GET request

GET https://connect.mailerlite.com/api/forms/{type}
Type value is required and can be popup, embedded, or promotion.

#Request parameters
Parameter	Type	Required	Limitations
limit	integer	no	
page	integer	no	Count starts from 1
filter[name]	string	no	Returns partial matches
sort	string	no	Can be one of: created_at, name, conversions_count, opens_count, visitors, conversion_rate, last_registration_at. Defaults to ascending order; prepend -, e.g. -created_at for descending order.
#Response
Response Code: 200 OK
{
  "data": [
    {
      "id": "38965245585131492",
      "type": "embedded",
      "slug": "Ec7t3n",
      "name": "inventore provident ut",
      "created_at": "2021-11-17 14:42:33",
      "conversions_count": 0,
      "opens_count": 0,
      "conversion_rate": {
        "float": 0,
        "string": "0%"
      },
      "settings": [],
      "last_registration_at": null,
      "active": false,
      "is_broken": false,
      "has_content": false,
      "can": {
        "update": true
      },
      "used_in_automations": false,
      "warnings": [],
      "double_optin": null,
      "screenshot_url": null
    }
  ],
  "links": {
    "first": "https://connect.mailerlite.com/api/forms/embedded?page=1",
    "last": "https://connect.mailerlite.com/api/forms/embedded?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "https://connect.mailerlite.com/api/forms/embedded?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "path": "https://connect.mailerlite.com/api/forms/embedded",
    "per_page": 25,
    "to": 1,
    "total": 1,
    "aggregations": {
      "popup": 3,
      "embedded": 1,
      "promotion": 1
    }
  }
}
#Get a form
If you want to fetch a specific form you can use this GET request

GET https://connect.mailerlite.com/api/forms/{form_id}
#Response
Response code: 200 OK
{
  "data": {
    "id": "38965245585131492",
    "type": "embedded",
    "slug": "Ec7t3n",
    "name": "inventore provident ut",
    "created_at": "2021-11-17 14:42:33",
    "conversions_count": 0,
    "opens_count": 0,
    "conversion_rate": {
      "float": 0,
      "string": "0%"
    },
    "settings": [],
    "last_registration_at": null,
    "active": false,
    "is_broken": false,
    "has_content": false,
    "can": {
      "update": true
    },
    "used_in_automations": false,
    "warnings": [],
    "double_optin": null,
    "screenshot_url": null
  }
}
#Error
When the form id is invalid

Response code: 404 Not Found
#Update a form
If you want to update a form use this PUT request

PUT https://connect.mailerlite.com/api/forms/{form_id}
The id must a valid form id that belongs to the account

#Request body
Parameter	Type	Required	Limitations
name	string	yes	Maximum length of 255 characters
#Response
Response code: 200 OK
{
  "data": {
    "id": "38965245585131492",
    "type": "embedded",
    "slug": "Ec7t3n",
    "name": "inventore provident ut",
    "created_at": "2021-11-17 14:42:33",
    "conversions_count": 0,
    "opens_count": 0,
    "conversion_rate": {
      "float": 0,
      "string": "0%"
    },
    "settings": [],
    "last_registration_at": null,
    "active": false,
    "is_broken": false,
    "has_content": false,
    "can": {
      "update": true
    },
    "used_in_automations": false,
    "warnings": [],
    "double_optin": null,
    "screenshot_url": null
  }
}
#Error
When the form id is invalid

Response code: 404 Not Found
If invalid data has been passed

Response Code: 422 Unprocessable Entity
{
  "message": "The given data was invalid.",
  "errors": {
    "name": ["The name may not be greater than 255 characters."]
  }
}
#Delete a form
Use this DELETE request to delete a form

DELETE https://connect.mailerlite.com/api/forms/{form_id}
The id must a valid form id that belongs to the account.

#Response
Response code: 204 No Content
#Error
When the form id is invalid

Response code: 404 Not Found
#Get subscribers who signed up to a specific form
If you want to fetch all the subscribers who signed up to a specific form use this GET request

GET https://connect.mailerlite.com/api/forms/{form_id}/subscribers
#Request parameters
Parameter	Type	Required	Limitations
filter[status]	string	no	Must be one of the possible statuses: active, unsubscribed, unconfirmed, bounced or junk. Defaults to active.
limit	integer	no	Defaults to 25
cursor	string	no	Defaults to first page. Cursor value available in response body
#Response
Response code: 200 OK
{
  "data": [
    {
      "id": "31986843064993537",
      "email": "dummy@example.com",
      "status": "active",
      "source": "api",
      "sent": 0,
      "opens_count": 0,
      "clicks_count": 0,
      "open_rate": 0,
      "click_rate": 0,
      "ip_address": null,
      "subscribed_at": "2021-09-01 14:03:50",
      "unsubscribed_at": null,
      "created_at": "2021-09-01 14:03:50",
      "updated_at": "2021-09-01 14:03:50",
      "fields": {
        "city": null,
        "company": null,
        "country": null,
        "last_name": "Testerson",
        "name": "Dummy",
        "phone": null,
        "state": null,
        "z_i_p": null
      },
      "groups": [],
      "opted_in_at": null,
      "optin_ip": null
    }
  ],
  "links": {
    "first": null,
    "last": null,
    "prev": "https://connect.mailerlite.com/api/forms/1234567890/subscribers?cursor=eyJpZCI6NzI1ODIxNjQ2NDU5Mzg1NTksIl9wb2ludHNUb05leHRJdGVtcyI6ZmFsc2V9",
    "next": "https://connect.mailerlite.com/api/forms/1234567890/subscribers?cursor=eyJpZCI6NzI1ODIxNjQ2NDY5ODcxMzYsIl9wb2ludHNUb05leHRJdGVtcyI6dHJ1ZX0"
  },
  "meta": {
    "path": "https://connect.mailerlite.com/api/forms/1234567890/subscribers",
    "per_page": 25,
    "next_cursor": "eyJpZCI6NzI1ODIxNjQ2NDY5ODcxMzYsIl9wb2ludHNUb05leHRJdGVtcyI6dHJ1ZX0",
    "prev_cursor": "eyJpZCI6NzI1ODIxNjQ2NDU5Mzg1NTksIl9wb2ludHNUb05leHRJdGVtcyI6ZmFsc2V9"
  }
}
#Error
When the form id is invalid

Response code: 404 Not Found


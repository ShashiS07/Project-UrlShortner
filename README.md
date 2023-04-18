## Overview
URL shortening is used to create shorter aliases for long URLs. We call these shortened aliases “short links.” Users are redirected to the original URL when they hit these short links. Short links save a lot of space when displayed, printed, messaged, or tweeted. Additionally, users are less likely to mistype shorter URLs.

For example, if we shorten the following URL through TinyURL:

```
https://babeljs.io/blog/2020/10/15/7.12.0#class-static-blocks-12079httpsgithubcombabelbabelpull12079-12143httpsgithubcombabelbabelpull12143
```

We would get:

```
https://tinyurl.com/y4ned4ep
```
The shortened URL is nearly one-fifth the size of the actual URL.

Some of the use cases for URL shortening is to optimise links shared across users, easy tracking of individual links and sometimes hiding the affiliated original URLs.

If you haven’t used tinyurl.com before, please try creating a new shortened URL and spend some time going through the various options their service offers. This will help you have a little context to the problem we solve through this project.

### Models
- Url Model
```
{ urlCode: { mandatory, unique, lowercase, trim }, longUrl: {mandatory, valid url}, shortUrl: {mandatory, unique} }
```

### POST /url/shorten
- Create a short URL for an original url recieved in the request body.
- The baseUrl must be the application's baseUrl. Example if the originalUrl is http://abc.com/user/images/name/2 then the shortened url should be http://localhost:3000/xyz
- Return the shortened unique url. Refer [this](#url-shorten-response) for the response
- Ensure the same response is returned for an original url everytime
- Return HTTP status 400 for an invalid request.

Screenshot (1111).png

### GET /:urlCode
- Redirect to the original URL corresponding
- Use a valid HTTP status code meant for a redirection scenario.
- Return a suitable error for a url not found
- Return HTTP status 400 for an invalid request

Screenshot (1113).png
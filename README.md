# tme-api-client

Simple TME API Client written in Typescript.

* https://developers.tme.eu/en/
* https://tme.eu/

## Installation:

```
npm add tme-api-client
```

## Example usage:

```javascript
import { AxiosError } from "axios";
import { TmeApiClient } from 'tme-api-client';

const token = 'put your token here';
const secret = 'put your secret here';

const client: TmeApiClient = new TmeApiClient(token, secret);

client.request('Products/GetProducts', {SymbolList: ['LEG-12']})
    .then(console.log)
    .catch((err: AxiosError) => console.log(err.response.data));
```

Not a TypeScript fan? Just use:

```javascript
const TmeApiClient = require('tme-api-client').TmeApiClient;
const client = new TmeApiClient('...', '...');
```

## License

MIT

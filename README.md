# tme-api-client

Simple TME API Client written in Typescript.

## Installation:

```
npm add tme-api-client
```

## Example usage:

```
import { AxiosError } from "axios";
import { TmeApiClient } from 'tme-api-client';

const token = 'put your token here';
const secret = 'put your secret here';

const client: TmeApiClient = new TmeApiClient(token, secret);

client.request('Products/GetProducts', {SymbolList: ['LEG-12']})
    .then(console.log)
    .catch((err: AxiosError) => console.log(err.response.data));
```

## License

MIT